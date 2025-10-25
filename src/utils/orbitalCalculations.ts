import { OrbitalParameters } from '../types'
import * as THREE from 'three'

/**
 * Convert orbital parameters to Cartesian position
 */
export function orbitalToCartesian(
  params: OrbitalParameters,
  normalizeToEarthRadii: boolean = true
): THREE.Vector3 {
  const a = normalizeToEarthRadii ? params.semiMajorAxis / 6371 : params.semiMajorAxis
  const e = params.eccentricity
  const i = (params.inclination * Math.PI) / 180
  const raan = (params.raan * Math.PI) / 180
  const argPeri = (params.argumentOfPeriapsis * Math.PI) / 180
  const trueAnom = (params.trueAnomaly * Math.PI) / 180

  // Calculate position in orbital plane
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnom))
  const x = r * Math.cos(trueAnom)
  const y = r * Math.sin(trueAnom)

  // Rotation matrices
  const cosI = Math.cos(i)
  const sinI = Math.sin(i)
  const cosRaan = Math.cos(raan)
  const sinRaan = Math.sin(raan)
  const cosArgPeri = Math.cos(argPeri)
  const sinArgPeri = Math.sin(argPeri)

  // Transform to 3D space
  const px =
    x * (cosRaan * cosArgPeri - sinRaan * sinArgPeri * cosI) -
    y * (cosRaan * sinArgPeri + sinRaan * cosArgPeri * cosI)
  const py =
    x * (sinRaan * cosArgPeri + cosRaan * sinArgPeri * cosI) -
    y * (sinRaan * sinArgPeri - cosRaan * cosArgPeri * cosI)
  const pz = x * sinArgPeri * sinI + y * cosArgPeri * sinI

  return new THREE.Vector3(px, pz, py)
}

/**
 * Generate orbit path points
 */
export function generateOrbitPath(
  params: OrbitalParameters,
  segments: number = 128,
  normalizeToEarthRadii: boolean = true
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const a = normalizeToEarthRadii ? params.semiMajorAxis / 6371 : params.semiMajorAxis
  const e = params.eccentricity
  const i = (params.inclination * Math.PI) / 180
  const raan = (params.raan * Math.PI) / 180
  const argPeri = (params.argumentOfPeriapsis * Math.PI) / 180

  const cosI = Math.cos(i)
  const sinI = Math.sin(i)
  const cosRaan = Math.cos(raan)
  const sinRaan = Math.sin(raan)
  const cosArgPeri = Math.cos(argPeri)
  const sinArgPeri = Math.sin(argPeri)

  for (let j = 0; j <= segments; j++) {
    const theta = (j / segments) * 2 * Math.PI
    const rOrbit = (a * (1 - e * e)) / (1 + e * Math.cos(theta))
    const xOrbit = rOrbit * Math.cos(theta)
    const yOrbit = rOrbit * Math.sin(theta)

    const pxOrbit =
      xOrbit * (cosRaan * cosArgPeri - sinRaan * sinArgPeri * cosI) -
      yOrbit * (cosRaan * sinArgPeri + sinRaan * cosArgPeri * cosI)
    const pyOrbit =
      xOrbit * (sinRaan * cosArgPeri + cosRaan * sinArgPeri * cosI) -
      yOrbit * (sinRaan * sinArgPeri - cosRaan * cosArgPeri * cosI)
    const pzOrbit = xOrbit * sinArgPeri * sinI + yOrbit * cosArgPeri * sinI

    points.push(new THREE.Vector3(pxOrbit, pzOrbit, pyOrbit))
  }

  return points
}

/**
 * Calculate orbital period (Kepler's third law)
 */
export function calculateOrbitalPeriod(semiMajorAxis: number): number {
  const mu = 398600.4418 // Earth's gravitational parameter (km³/s²)
  const a = semiMajorAxis
  return 2 * Math.PI * Math.sqrt((a * a * a) / mu)
}

/**
 * Calculate altitude from semi-major axis
 */
export function calculateAltitude(semiMajorAxis: number): number {
  const earthRadius = 6371 // km
  return semiMajorAxis - earthRadius
}

/**
 * Calculate velocity at current position
 */
export function calculateOrbitalVelocity(
  semiMajorAxis: number,
  currentRadius: number
): number {
  const mu = 398600.4418 // Earth's gravitational parameter (km³/s²)
  return Math.sqrt(mu * (2 / currentRadius - 1 / semiMajorAxis))
}

