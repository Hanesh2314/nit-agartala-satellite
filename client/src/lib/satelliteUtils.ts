import type { SatellitePart } from '@/types';

/**
 * Calculate satellite orbit parameters
 */
export function calculateOrbitParameters(altitude: number, inclination: number) {
  // Earth radius in km
  const earthRadius = 6371;
  
  // Calculate orbit circumference
  const orbitRadius = earthRadius + altitude;
  const orbitCircumference = 2 * Math.PI * orbitRadius;
  
  // Calculate orbital period using Kepler's Third Law
  // T^2 ∝ R^3, where T is the period and R is the orbital radius
  const earthStandardGravitationalParameter = 3.986004418e14; // m^3/s^2
  const orbitRadiusMeters = orbitRadius * 1000;
  const orbitalPeriodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(orbitRadiusMeters, 3) / earthStandardGravitationalParameter);
  const orbitalPeriodMinutes = orbitalPeriodSeconds / 60;
  
  return {
    radius: orbitRadius,
    circumference: orbitCircumference,
    period: orbitalPeriodMinutes,
    inclination
  };
}

/**
 * Generate satellite parts based on departments
 */
export function generateSatelliteParts(departments: any[]): SatellitePart[] {
  return departments.map((dept, index) => {
    // Create different positions based on index
    let position: [number, number, number] = [0, 0, 0];
    
    switch (index % 3) {
      case 0: // Engineering - top right
        position = [20, -15, 0];
        break;
      case 1: // Communications - bottom right
        position = [15, 10, 0];
        break;
      case 2: // Data Science - left side
        position = [-20, 0, 0];
        break;
    }
    
    return {
      name: dept.name,
      description: dept.description,
      position,
      departmentId: dept.id,
      color: dept.color,
    };
  });
}

/**
 * Calculate satellite position for a given time
 */
export function calculateSatellitePosition(time: number, orbitParams: any) {
  const { radius, inclination, period } = orbitParams;
  
  // Calculate position in orbit
  const angle = (time / period) * 2 * Math.PI;
  
  // Calculate 3D position
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle) * Math.cos(inclination * Math.PI / 180);
  const z = radius * Math.sin(angle) * Math.sin(inclination * Math.PI / 180);
  
  return { x, y, z };
}
