import { create } from 'zustand'

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

interface SatelliteStore {
  satellites: Satellite[]
  threats: Threat[]
  selectedSatellite: string | null
  addSatellite: (satellite: Omit<Satellite, 'id' | 'lastUpdate' | 'status'>) => void
  removeSatellite: (id: string) => void
  updateSatellite: (id: string, updates: Partial<Satellite>) => void
  selectSatellite: (id: string | null) => void
  addThreat: (threat: Omit<Threat, 'id' | 'detectedAt'>) => void
  removeThreat: (id: string) => void
  executeAction: (threatId: string, actionId: string) => void
}

export const useSatelliteStore = create<SatelliteStore>((set) => ({
  satellites: [],
  threats: [],
  selectedSatellite: null,

  addSatellite: (satellite) =>
    set((state) => ({
      satellites: [
        ...state.satellites,
        {
          ...satellite,
          id: `sat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'active',
          lastUpdate: new Date(),
        },
      ],
    })),

  removeSatellite: (id) =>
    set((state) => ({
      satellites: state.satellites.filter((s) => s.id !== id),
      threats: state.threats.filter((t) => t.satelliteId !== id),
      selectedSatellite: state.selectedSatellite === id ? null : state.selectedSatellite,
    })),

  updateSatellite: (id, updates) =>
    set((state) => ({
      satellites: state.satellites.map((s) =>
        s.id === id ? { ...s, ...updates, lastUpdate: new Date() } : s
      ),
    })),

  selectSatellite: (id) => set({ selectedSatellite: id }),

  addThreat: (threat) =>
    set((state) => {
      const newThreat = {
        ...threat,
        id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        detectedAt: new Date(),
      }
      
      // Update satellite status based on threat severity
      const updatedSatellites = state.satellites.map((s) => {
        if (s.id === threat.satelliteId) {
          const status = threat.severity === 'critical' ? 'critical' : 
                        threat.severity === 'high' ? 'warning' : s.status
          return { ...s, status }
        }
        return s
      })

      return {
        threats: [...state.threats, newThreat],
        satellites: updatedSatellites,
      }
    }),

  removeThreat: (id) =>
    set((state) => ({
      threats: state.threats.filter((t) => t.id !== id),
    })),

  executeAction: (threatId, actionId) =>
    set((state) => {
      console.log(`Executing action ${actionId} for threat ${threatId}`)
      // In a real system, this would communicate with the satellite
      return {
        threats: state.threats.filter((t) => t.id !== threatId),
      }
    }),
}))






