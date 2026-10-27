import * as THREE from 'three';

/**
 * Standardized ISO-3 Country Coordinates (Latitude, Longitude)
 * Defensible country-level and major mining/industrial basin centroids.
 */
export const COUNTRY_COORDINATES: Record<string, { name: string; lat: number; lon: number }> = {
  // Major Critical Mineral Producers & Exporters
  CHL: { name: 'Chile', lat: -23.8634, lon: -69.1328 }, // Atacama Salar / Antofagasta
  COD: { name: 'DR Congo', lat: -10.7167, lon: 25.4667 }, // Katanga Copperbelt
  IDN: { name: 'Indonesia', lat: -2.5489, lon: 121.5000 }, // Central Sulawesi / Halmahera Nickel
  AUS: { name: 'Australia', lat: -28.0000, lon: 119.0000 }, // Western Australia Lithium/Nickel
  BRA: { name: 'Brazil', lat: -18.5122, lon: -44.5550 }, // Minas Gerais
  CAN: { name: 'Canada', lat: 51.2538, lon: -85.3232 }, // Ontario / Quebec mineral belt
  ZAF: { name: 'South Africa', lat: -25.7479, lon: 28.2293 }, // Bushveld Complex
  ARG: { name: 'Argentina', lat: -24.1858, lon: -65.2995 }, // Jujuy / Salta Lithium
  CHN: { name: 'China', lat: 35.8617, lon: 104.1954 }, // Major refining & processing
  RUS: { name: 'Russia', lat: 61.5240, lon: 105.3188 }, // Norilsk Nickel / Siberia
  ZMB: { name: 'Zambia', lat: -12.8024, lon: 28.2132 }, // Copperbelt
  MDG: { name: 'Madagascar', lat: -18.7669, lon: 46.8691 }, // Graphite deposits
  MOZ: { name: 'Mozambique', lat: -13.2500, lon: 39.5000 }, // Balama Graphite
  ZWE: { name: 'Zimbabwe', lat: -17.8252, lon: 31.0335 }, // Bikita Lithium
  PHL: { name: 'Philippines', lat: 9.7719, lon: 125.5000 }, // Surigao Nickel
  VNM: { name: 'Vietnam', lat: 14.0583, lon: 108.2772 }, // Rare Earths

  // Major Consumers & Processing Hubs
  USA: { name: 'United States', lat: 37.0902, lon: -95.7129 },
  DEU: { name: 'Germany', lat: 51.1657, lon: 10.4515 },
  JPN: { name: 'Japan', lat: 36.2048, lon: 138.2529 },
  KOR: { name: 'South Korea', lat: 35.9078, lon: 127.7669 },
  IND: { name: 'India', lat: 20.5937, lon: 78.9629 },
  GBR: { name: 'United Kingdom', lat: 55.3781, lon: -3.4360 },
  FRA: { name: 'France', lat: 46.2276, lon: 2.2137 },
  NLD: { name: 'Netherlands', lat: 52.1326, lon: 5.2913 }, // Rotterdam transit port
  SGP: { name: 'Singapore', lat: 1.3521, lon: 103.8198 }, // Global maritime transit
  BEL: { name: 'Belgium', lat: 50.5039, lon: 4.4699 }, // Antwerp transit port
  NOR: { name: 'Norway', lat: 60.4720, lon: 8.4689 },
  FIN: { name: 'Finland', lat: 61.9241, lon: 25.7482 },
  MEX: { name: 'Mexico', lat: 23.6345, lon: -102.5528 },
};

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates on a sphere of radius R.
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates an elevated 3D parabolic cubic Bezier curve between two geographic points.
 */
export function createCurvedArc(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  radius: number,
  pointsCount = 64
): THREE.Vector3[] {
  // Angular distance between points
  const distance = startVec.distanceTo(endVec);
  
  // Parabolic peak height scales with geographical distance
  const maxAltitude = Math.min(distance * 0.35, radius * 0.65);

  // Midpoint projected outward along surface normal
  const midPoint = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);

  const midLength = midPoint.length();
  if (midLength > 0.0001) {
    midPoint.normalize().multiplyScalar(radius + maxAltitude);
  } else {
    midPoint.set(0, radius + maxAltitude, 0);
  }

  // Two control points for a smooth cubic bezier spline
  const control1 = new THREE.Vector3().lerpVectors(startVec, midPoint, 0.5);
  control1.normalize().multiplyScalar(radius + maxAltitude * 0.85);

  const control2 = new THREE.Vector3().lerpVectors(endVec, midPoint, 0.5);
  control2.normalize().multiplyScalar(radius + maxAltitude * 0.85);

  const curve = new THREE.CubicBezierCurve3(startVec, control1, control2, endVec);
  return curve.getPoints(pointsCount);
}

/**
 * Resolves country code or country name to known coordinates.
 */
export function resolveCoordinates(
  code: string,
  name?: string
): { lat: number; lon: number; name: string } | null {
  const upperCode = (code || '').toUpperCase().trim();
  if (COUNTRY_COORDINATES[upperCode]) {
    return COUNTRY_COORDINATES[upperCode];
  }

  // Fallback match on name
  if (name) {
    const cleanName = name.toLowerCase().trim();
    for (const v of Object.values(COUNTRY_COORDINATES)) {
      if (v.name.toLowerCase() === cleanName || cleanName.includes(v.name.toLowerCase())) {
        return v;
      }
    }
  }

  return null;
}
