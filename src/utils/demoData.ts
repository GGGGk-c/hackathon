import { OrbitalParameters, Satellite } from '../types'

/**
 * Predefined satellite configurations for quick testing
 */

export const DEMO_SATELLITES: Omit<Satellite, 'id' | 'status' | 'lastUpdate'>[] = [
  {
    name: 'ISS (LEO)',
    mass: 420000,
    crossSection: 100,
    orbitalParams: {
      semiMajorAxis: 6793,
      eccentricity: 0.0003,
      inclination: 51.64,
      raan: 90,
      argumentOfPeriapsis: 0,
      trueAnomaly: 45,
    },
  },
  {
    name: 'GPS Satellite (MEO)',
    mass: 2000,
    crossSection: 15,
    orbitalParams: {
      semiMajorAxis: 26560,
      eccentricity: 0.01,
      inclination: 55,
      raan: 120,
      argumentOfPeriapsis: 30,
      trueAnomaly: 90,
    },
  },
  {
    name: 'Geostationary CommSat',
    mass: 3500,
    crossSection: 20,
    orbitalParams: {
      semiMajorAxis: 42164,
      eccentricity: 0.0001,
      inclination: 0.1,
      raan: 180,
      argumentOfPeriapsis: 0,
      trueAnomaly: 180,
    },
  },
  {
    name: 'Polar Earth Observer',
    mass: 1500,
    crossSection: 12,
    orbitalParams: {
      semiMajorAxis: 7200,
      eccentricity: 0.002,
      inclination: 98,
      raan: 270,
      argumentOfPeriapsis: 45,
      trueAnomaly: 270,
    },
  },
  {
    name: 'Molniya Orbit CommSat',
    mass: 2500,
    crossSection: 18,
    orbitalParams: {
      semiMajorAxis: 26554,
      eccentricity: 0.72,
      inclination: 63.4,
      raan: 45,
      argumentOfPeriapsis: 270,
      trueAnomaly: 0,
    },
  },
]

/**
 * Common orbital configurations
 */
export const ORBITAL_PRESETS: Record<string, OrbitalParameters> = {
  'LEO-Equatorial': {
    semiMajorAxis: 6800,
    eccentricity: 0.001,
    inclination: 0,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  },
  'LEO-Polar': {
    semiMajorAxis: 7000,
    eccentricity: 0.001,
    inclination: 90,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  },
  'LEO-SSO': {
    semiMajorAxis: 7200,
    eccentricity: 0.002,
    inclination: 98,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  },
  'MEO-GPS': {
    semiMajorAxis: 26560,
    eccentricity: 0.01,
    inclination: 55,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  },
  'GEO': {
    semiMajorAxis: 42164,
    eccentricity: 0.0001,
    inclination: 0,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  },
  'Molniya': {
    semiMajorAxis: 26554,
    eccentricity: 0.72,
    inclination: 63.4,
    raan: 0,
    argumentOfPeriapsis: 270,
    trueAnomaly: 0,
  },
}

/**
 * Get a random demo satellite
 */
export function getRandomDemoSatellite(): Omit<Satellite, 'id' | 'status' | 'lastUpdate'> {
  return DEMO_SATELLITES[Math.floor(Math.random() * DEMO_SATELLITES.length)]
}

/**
 * Generate random orbital parameters within realistic ranges
 */
export function generateRandomOrbit(orbitType: 'LEO' | 'MEO' | 'GEO'): OrbitalParameters {
  const ranges = {
    LEO: { min: 6500, max: 8000 },
    MEO: { min: 12000, max: 30000 },
    GEO: { min: 41000, max: 43000 },
  }

  const range = ranges[orbitType]
  
  return {
    semiMajorAxis: Math.random() * (range.max - range.min) + range.min,
    eccentricity: Math.random() * 0.05,
    inclination: Math.random() * 180,
    raan: Math.random() * 360,
    argumentOfPeriapsis: Math.random() * 360,
    trueAnomaly: Math.random() * 360,
  }
}







