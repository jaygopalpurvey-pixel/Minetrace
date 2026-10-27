import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TradeRoute, TradeHub } from '@/types/globe';
import { latLonToVector3, createCurvedArc } from '@/lib/geoCoordinates';
import { createProceduralEarthTexture, createAtmosphereMaterial } from '@/lib/earthTexture';

export interface EarthGlobe3DProps {
  routes: TradeRoute[];
  hubs: TradeHub[];
  autoRotate: boolean;
  selectedRouteId?: string | null;
  onHoverRoute: (route: TradeRoute | null, mouseX: number, mouseY: number) => void;
  onHoverHub: (hub: TradeHub | null, mouseX: number, mouseY: number) => void;
  onSelectRoute: (route: TradeRoute) => void;
  onSelectHub: (hub: TradeHub) => void;
  resetViewTrigger: number;
}

const GLOBE_RADIUS = 100;

export const EarthGlobe3D: React.FC<EarthGlobe3DProps> = ({
  routes,
  hubs,
  autoRotate,
  selectedRouteId,
  onHoverRoute,
  onHoverHub,
  onSelectRoute,
  onSelectHub,
  resetViewTrigger,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // References for Three.js instance
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Dynamic mesh references for raycasting & particle updates
  const arcCurvesRef = useRef<Array<{ route: TradeRoute; curve: THREE.CatmullRomCurve3; lineMesh: THREE.Line }>>([]);
  const hubMeshesRef = useRef<Array<{ hub: TradeHub; mesh: THREE.Mesh }>>([]);
  const photonParticlesRef = useRef<Array<{ curve: THREE.CatmullRomCurve3; speed: number; offset: number; mesh: THREE.Mesh }>>([]);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Reset Camera View Handler
  useEffect(() => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 75, 230);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetViewTrigger]);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    if (!hasWebGL || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070a12);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 75, 230);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 135;
    controls.maxDistance = 450;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.45;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 5. Lighting (Cinematic Day/Night terminator & ambient cyan glow)
    const ambientLight = new THREE.AmbientLight(0x0a1428, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(250, 150, 200);
    scene.add(sunLight);

    const secondaryCyanLight = new THREE.DirectionalLight(0x43d9ff, 1.0);
    secondaryCyanLight.position.set(-200, -100, -150);
    scene.add(secondaryCyanLight);

    // 6. Earth Sphere with Procedural Dark Canvas Texture
    const earthTexture = createProceduralEarthTexture();
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.8,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // 7. Atmosphere Fresnel Edge Glow Shell
    const atmosphereMaterial = createAtmosphereMaterial();
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 48, 48);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 8. Distant Twinkling Starfield Particles
    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 600 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // 80% white, 20% cyan tint
      if (Math.random() > 0.8) {
        starColors[i * 3] = 0.26;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.9;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Raycasting for Hover & Click
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line = { threshold: 3.5 };
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check hub marker hover
      const hubObjects = hubMeshesRef.current.map((h) => h.mesh);
      const hubIntersects = raycaster.intersectObjects(hubObjects, false);

      if (hubIntersects.length > 0) {
        const matched = hubMeshesRef.current.find((h) => h.mesh === hubIntersects[0].object);
        if (matched) {
          onHoverHub(matched.hub, e.clientX, e.clientY);
          onHoverRoute(null, 0, 0);
          container.style.cursor = 'pointer';
          return;
        }
      }

      // Check curved arc hover
      const arcObjects = arcCurvesRef.current.map((a) => a.lineMesh);
      const arcIntersects = raycaster.intersectObjects(arcObjects, false);

      if (arcIntersects.length > 0) {
        const matched = arcCurvesRef.current.find((a) => a.lineMesh === arcIntersects[0].object);
        if (matched) {
          onHoverRoute(matched.route, e.clientX, e.clientY);
          onHoverHub(null, 0, 0);
          container.style.cursor = 'pointer';
          return;
        }
      }

      // No hover
      onHoverRoute(null, 0, 0);
      onHoverHub(null, 0, 0);
      container.style.cursor = 'grab';
    };

    const handlePointerClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check hub click
      const hubObjects = hubMeshesRef.current.map((h) => h.mesh);
      const hubIntersects = raycaster.intersectObjects(hubObjects, false);
      if (hubIntersects.length > 0) {
        const matched = hubMeshesRef.current.find((h) => h.mesh === hubIntersects[0].object);
        if (matched) {
          onSelectHub(matched.hub);
          return;
        }
      }

      // Check arc click
      const arcObjects = arcCurvesRef.current.map((a) => a.lineMesh);
      const arcIntersects = raycaster.intersectObjects(arcObjects, false);
      if (arcIntersects.length > 0) {
        const matched = arcCurvesRef.current.find((a) => a.lineMesh === arcIntersects[0].object);
        if (matched) {
          onSelectRoute(matched.route);
          return;
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handlePointerClick);

    // Animation Render Loop
    let clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Controls update for damping & autoRotate
      controls.update();

      // Animate photon particles along each active trade arc
      photonParticlesRef.current.forEach((photon) => {
        const t = (elapsed * photon.speed + photon.offset) % 1;
        const point = photon.curve.getPoint(t);
        photon.mesh.position.copy(point);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Clean disposal on unmount
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animFrameIdRef.current);

      controls.dispose();
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasWebGL]);

  // Update Controls autoRotate dynamically
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Render Trade Hubs and Curved Arcs whenever routes or hubs change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. Remove previous dynamic meshes
    arcCurvesRef.current.forEach((a) => {
      scene.remove(a.lineMesh);
      a.lineMesh.geometry.dispose();
      (a.lineMesh.material as THREE.Material).dispose();
    });
    arcCurvesRef.current = [];

    hubMeshesRef.current.forEach((h) => {
      scene.remove(h.mesh);
      h.mesh.geometry.dispose();
      (h.mesh.material as THREE.Material).dispose();
    });
    hubMeshesRef.current = [];

    photonParticlesRef.current.forEach((p) => {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    photonParticlesRef.current = [];

    // Helper colors by risk classification
    const getColorHex = (classification: string) => {
      switch (classification) {
        case 'RED':
          return 0xff5b65;
        case 'AMBER':
          return 0xffb547;
        case 'GREEN':
          return 0x20e09e;
        default:
          return 0x8d9ab2;
      }
    };

    // 2. Render Trade Hub Markers
    hubs.forEach((hub) => {
      const pos = latLonToVector3(hub.coords[0], hub.coords[1], GLOBE_RADIUS);
      const colorHex = getColorHex(hub.dominantClassification);

      // Beacon Pin Cylinder lifting from surface normal
      const pinGeom = new THREE.CylinderGeometry(0.3, 0.6, 5, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.9,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);

      // Orient cylinder outward along surface normal
      pinMesh.position.copy(pos);
      pinMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      pinMesh.translateY(2.5); // Lift half-height so base touches surface

      // Ground Pulsing Ring
      const ringGeom = new THREE.RingGeometry(0.8, 2.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0)); // Align with sphere tangent

      pinMesh.add(ringMesh);
      scene.add(pinMesh);

      hubMeshesRef.current.push({ hub, mesh: pinMesh });
    });

    // 3. Render 3D Curved Parabolic Arcs & Traveling Photons
    const photonGeom = new THREE.SphereGeometry(1.1, 12, 12);
    const selectedPhotonGeom = new THREE.SphereGeometry(1.8, 12, 12);
    const isAnySelected = Boolean(selectedRouteId);

    routes.forEach((route, idx) => {
      if (!route.originCoords || !route.destCoords) return;

      const isSelected = selectedRouteId
        ? route.id === selectedRouteId || route.analysisId === selectedRouteId
        : false;

      const startVec = latLonToVector3(route.originCoords[0], route.originCoords[1], GLOBE_RADIUS);
      const endVec = latLonToVector3(route.destCoords[0], route.destCoords[1], GLOBE_RADIUS);

      const arcPoints = createCurvedArc(startVec, endVec, GLOBE_RADIUS, 56);
      const splineCurve = new THREE.CatmullRomCurve3(arcPoints);

      const colorHex = isSelected ? 0x43d9ff : getColorHex(route.classification);

      // Arc Line
      const lineGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: isSelected ? 1.0 : isAnySelected ? 0.2 : 0.75,
        linewidth: isSelected ? 3 : 2,
      });
      const lineMesh = new THREE.Line(lineGeom, lineMat);
      scene.add(lineMesh);

      arcCurvesRef.current.push({
        route,
        curve: splineCurve,
        lineMesh,
      });

      // Animated Photon Particle (Cyan/Gold/Red glowing packet traveling the arc)
      const photonMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x43d9ff : colorHex,
        transparent: true,
        opacity: isSelected ? 1.0 : isAnySelected ? 0.25 : 0.95,
      });
      const photonMesh = new THREE.Mesh(isSelected ? selectedPhotonGeom : photonGeom, photonMat);
      scene.add(photonMesh);

      photonParticlesRef.current.push({
        curve: splineCurve,
        speed: 0.15 + (idx % 3) * 0.04,
        offset: (idx * 0.25) % 1,
        mesh: photonMesh,
      });
    });

    // Smoothly focus camera if a specific route is selected
    if (selectedRouteId && cameraRef.current && controlsRef.current) {
      const selected = routes.find(
        (r) => r.id === selectedRouteId || r.analysisId === selectedRouteId
      );
      if (selected && selected.originCoords && selected.destCoords) {
        const p1 = latLonToVector3(selected.originCoords[0], selected.originCoords[1], GLOBE_RADIUS);
        const p2 = latLonToVector3(selected.destCoords[0], selected.destCoords[1], GLOBE_RADIUS);
        const midTarget = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(220);
        cameraRef.current.position.lerp(midTarget, 0.4);
        controlsRef.current.update();
      }
    }
  }, [routes, hubs, selectedRouteId]);

  // Graceful WebGL Fallback if device does not support WebGL
  if (!hasWebGL) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#090D17] rounded-xl border border-[#8D9AB2]/20 h-[520px]">
        <div className="w-16 h-16 rounded-full bg-[#111A2B] border border-[#FFB547]/40 flex items-center justify-center text-[#FFB547] mb-4">
          <span className="font-mono text-2xl font-bold">2D</span>
        </div>
        <h4 className="text-lg font-bold font-mono text-[#F5F7FF] mb-2">
          WebGL Hardware Acceleration Unavailable
        </h4>
        <p className="text-sm text-[#8D9AB2] max-w-md leading-relaxed mb-4">
          Your browser or display environment does not support WebGL 3D rendering. Please enable hardware
          acceleration or view routes in the tabular Priority Investigations list below.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[520px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing outline-none"
    />
  );
};
