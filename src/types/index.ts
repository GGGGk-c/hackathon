export interface OrbitalParameters {
  semiMajorAxis: number // km
  eccentricity: number
  inclination: number // degrees
  raan: number // Right Ascension of Ascending Node (degrees)
  argumentOfPeriapsis: number // degrees
  trueAnomaly: number // degrees
}

export interface Satellite {
  id: string
  name: string
  orbitalParams: OrbitalParameters
  mass: number // kg
  crossSection: number // m²
  status: 'active' | 'warning' | 'critical'
  lastUpdate: Date
}

export interface Threat {
  id: string
  satelliteId: string
  type: 'debris' | 'conjunction' | 'cme' | 'solar-storm'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timeToEvent: number // seconds
  probability: number // 0-1
  description: string
  suggestedActions: Action[]
  detectedAt: Date
}

export interface Action {
  id: string
  type: 'maneuver' | 'orientation' | 'shutdown' | 'monitor'
  description: string
  deltaV?: number // m/s
  fuelCost?: number // kg
  successRate: number // 0-1
  executionTime: number // seconds
  priority: number // 1-5
}

export interface SpaceWeather {
  solarWindSpeed: number // km/s
  solarFlareLevel: 'quiet' | 'active' | 'storm'
  kpIndex: number // 0-9
  protonFlux: number
  electronFlux: number
  lastUpdate: Date
}







