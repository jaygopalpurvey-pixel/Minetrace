import * as THREE from 'three';

/**
 * Creates an offline-ready, high-resolution procedural dark intelligence
 * Earth canvas texture with continental landmasses, technical graticule lines,
 * and night-side node luminescence.
 */
export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Base Dark Navy Ocean (#070A12)
  ctx.fillStyle = '#070A12';
  ctx.fillRect(0, 0, width, height);

  // Subtle ocean bathymetry radial gradient
  const oceanGrad = ctx.createRadialGradient(
    width / 2, height / 2, 50,
    width / 2, height / 2, width / 2
  );
  oceanGrad.addColorStop(0, '#090F1C');
  oceanGrad.addColorStop(1, '#070A12');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Technical Lat/Lon Graticule Grid Lines
  ctx.strokeStyle = 'rgba(67, 217, 255, 0.05)';
  ctx.lineWidth = 1;

  // Parallels (Latitude every 15 deg)
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Meridians (Longitude every 15 deg)
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator & Prime Meridian Highlight
  ctx.strokeStyle = 'rgba(67, 217, 255, 0.15)';
  ctx.lineWidth = 1.5;
  // Equator
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  // Prime Meridian
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // 3. Vector Continental Silhouettes (#111A2B with subtle #43D9FF/10 border)
  ctx.fillStyle = '#111A2B';
  ctx.strokeStyle = 'rgba(141, 154, 178, 0.25)';
  ctx.lineWidth = 1.2;

  // Helper: converts lat/lon to canvas x, y
  const toXY = (lat: number, lon: number): [number, number] => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  // Draw polygon on canvas
  const drawPoly = (coords: Array<[number, number]>) => {
    if (coords.length < 3) return;
    ctx.beginPath();
    const [startX, startY] = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Simplified major continental outlines
  // North America
  drawPoly([
    [70, -165], [72, -130], [68, -85], [60, -65], [47, -53], [44, -65],
    [30, -81], [25, -80], [18, -95], [15, -92], [8, -77], [18, -105],
    [32, -117], [48, -124], [58, -137], [60, -165], [65, -168]
  ]);

  // South America
  drawPoly([
    [12, -72], [10, -62], [5, -52], [-2, -44], [-8, -35], [-23, -42],
    [-34, -53], [-54, -68], [-55, -73], [-45, -75], [-18, -70], [-5, -81],
    [8, -77]
  ]);

  // Europe
  drawPoly([
    [71, 28], [60, 25], [55, 38], [42, 28], [36, -5], [43, -9],
    [50, -5], [58, 6], [62, 5], [70, 20]
  ]);

  // Africa
  drawPoly([
    [37, 10], [32, 32], [22, 38], [12, 51], [2, 45], [-12, 40],
    [-26, 33], [-34, 18], [-33, 17], [-15, 12], [4, 9], [5, -1],
    [10, -14], [28, -13], [35, -6]
  ]);

  // Asia / Eurasia
  drawPoly([
    [77, 105], [70, 180], [60, 160], [45, 140], [38, 120], [22, 115],
    [10, 105], [1, 104], [22, 70], [25, 62], [12, 44], [30, 48],
    [40, 50], [55, 60], [65, 80]
  ]);

  // Australia
  drawPoly([
    [-11, 142], [-18, 146], [-28, 153], [-38, 148], [-38, 140],
    [-32, 116], [-22, 114], [-15, 125], [-12, 131], [-12, 136]
  ]);

  // Greenland
  drawPoly([
    [83, -30], [82, -15], [75, -20], [60, -43], [68, -55], [78, -68]
  ]);

  // 4. Dot-Matrix Technical Texture Over Continents
  ctx.fillStyle = 'rgba(67, 217, 255, 0.18)';
  const nodePoints: Array<[number, number]> = [
    // South America (Atacama, Salta, Minas Gerais)
    [-23.8, -69.1], [-24.1, -65.3], [-18.5, -44.5], [-34.6, -58.3],
    // North America (US Industrial, Canada)
    [37.1, -95.7], [34.0, -118.2], [40.7, -74.0], [51.2, -85.3],
    // Africa (Katanga DRC, Bushveld SA, Zambia)
    [-10.7, 25.4], [-25.7, 28.2], [-12.8, 28.2], [-18.7, 46.8],
    // Europe
    [51.1, 10.4], [52.1, 5.3], [48.8, 2.3], [60.4, 8.4], [61.9, 25.7],
    // Asia (China, Indonesia, Japan, Korea, India)
    [35.8, 104.2], [31.2, 121.4], [-2.5, 121.5], [36.2, 138.2], [35.9, 127.7], [20.6, 78.9],
    // Australia
    [-28.0, 119.0], [-31.9, 115.8], [-33.8, 151.2]
  ];

  nodePoints.forEach(([lat, lon]) => {
    const [x, y] = toXY(lat, lon);
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Subtle outer halo
    ctx.fillStyle = 'rgba(67, 217, 255, 0.06)';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(67, 217, 255, 0.18)';
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Custom Atmosphere Glow Shader Material
 * Uses a Fresnel falloff to create a realistic cyan/periwinkle edge halo.
 */
export function createAtmosphereMaterial(): THREE.ShaderMaterial {
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      // Fresnel intensity: higher at grazing angles (edge of sphere)
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
      vec3 glowColor = vec3(0.26, 0.85, 1.0); // Cyan #43D9FF
      gl_FragColor = vec4(glowColor, intensity * 0.7);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
}
