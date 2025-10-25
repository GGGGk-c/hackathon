import { Threat, Satellite } from '../types'
import { spaceTrackService } from './spaceTrackService'
import { API_CONFIG, USE_SIMULATION } from '../config/api.config'

/**
 * Enhanced Conjunction Data Service
 * Supports both real Space-Track.org API and simulation mode
 * 
 * Real data source: Space-Track.org CDM (Conjunction Data Messages)
 * Documentation: https://www.space-track.org/documentation
 */

interface ConjunctionData {
  objectId: string
  objectName: string
  timeToClosestApproach: number // seconds
  missDistance: number // meters
  probability: number // 0-1
  createdAt: Date
}

/**
 * Check for conjunction threats for a satellite
 * Uses real Space-Track.org data if configured, otherwise simulates
 */
export async function checkConjunctionThreats(
  satellite: Satellite,
  noradCatId?: string
): Promise<Threat[]> {
  const threats: Threat[] = []

  try {
    // If we have a NORAD ID and not in simulation mode, use real data
    if (noradCatId && !USE_SIMULATION) {
      const realThreats = await fetchRealConjunctionThreats(satellite, noradCatId)
      threats.push(...realThreats)
      
      if (realThreats.length > 0) {
        console.log(`✅ Found ${realThreats.length} real conjunction(s) for ${satellite.name}`)
      }
    } else {
      // Fallback to simulation
      const simulatedThreat = generateSimulatedConjunctionThreat(satellite)
      if (simulatedThreat) {
        threats.push(simulatedThreat)
      }
    }
  } catch (error) {
    console.error('❌ Error checking conjunctions:', error)
    // Fallback to simulation on error
    const simulatedThreat = generateSimulatedConjunctionThreat(satellite)
    if (simulatedThreat) {
      threats.push(simulatedThreat)
    }
  }

  return threats
}

/**
 * Fetch real conjunction threats from Space-Track.org
 */
async function fetchRealConjunctionThreats(
  satellite: Satellite,
  noradCatId: string
): Promise<Threat[]> {
  const threats: Threat[] = []

  // Fetch CDM data for the next 7 days
  const cdmData = await spaceTrackService.fetchConjunctionData(noradCatId, 7)

  for (const cdm of cdmData) {
    // Parse the CDM data
    const tca = new Date(cdm.TCA)
    const timeToEvent = Math.max(0, (tca.getTime() - Date.now()) / 1000)
    const missDistance = parseFloat(cdm.MISS_DISTANCE) * 1000 // Convert km to meters
    const probability = parseFloat(cdm.PROBABILITY) || 0

    // Only create threats for events within 24 hours with significant probability
    if (timeToEvent < 86400 && probability > 0.01) {
      const severity = determineSeverity(probability, missDistance)

      threats.push({
        id: `threat-real-${cdm.OBJECT_ID}-${Date.now()}`,
        satelliteId: satellite.id,
        type: 'conjunction',
        severity,
        timeToEvent,
        probability,
        description: `Real conjunction detected with ${cdm.SAT_2_NAME || cdm.OBJECT_NAME} (ID: ${cdm.OBJECT_ID}). Miss distance: ${missDistance.toFixed(0)}m`,
        suggestedActions: generateSuggestedActions(probability, missDistance),
        detectedAt: new Date(cdm.CREATION_DATE),
      })
    }
  }

  return threats
}

/**
 * Simulate conjunction detection (fallback when real data unavailable)
 */
function generateSimulatedConjunctionThreat(satellite: Satellite): Threat | null {
  // Extremely low probability - realistic conjunction detection rate
  const detectionChance = Math.random()
  
  if (detectionChance > 0.995) {  // 降低到0.5%概率，更加符合实际
    const missDistance = Math.random() * 1000 + 50 // 50-1050 meters
    const timeToEvent = Math.random() * 86400 + 3600 // 1-25 hours
    const probability = Math.max(0.1, Math.min(0.9, 1000 / missDistance))
    const severity = determineSeverity(probability, missDistance)

    return {
      id: `threat-sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      satelliteId: satellite.id,
      type: 'conjunction',
      severity,
      timeToEvent,
      probability,
      description: `[SIMULATED] Close approach detected. Object ${Math.floor(Math.random() * 90000 + 10000)}. Miss distance: ${missDistance.toFixed(0)}m`,
      suggestedActions: generateSuggestedActions(probability, missDistance),
      detectedAt: new Date(),
    }
  }
  
  return null
}

/**
 * Determine threat severity based on probability and miss distance
 */
function determineSeverity(
  probability: number,
  missDistance: number
): 'low' | 'medium' | 'high' | 'critical' {
  // Critical: High probability or very close approach
  if (probability > 0.8 || missDistance < 100) {
    return 'critical'
  }
  
  // High: Significant probability or close approach
  if (probability > 0.5 || missDistance < 300) {
    return 'high'
  }
  
  // Medium: Moderate probability
  if (probability > 0.3 || missDistance < 500) {
    return 'medium'
  }
  
  return 'low'
}

/**
 * Generate appropriate actions based on threat parameters
 */
function generateSuggestedActions(probability: number, missDistance: number): any[] {
  const actions = []
  
  // Critical threat - immediate maneuver
  if (probability > 0.8 || missDistance < 100) {
    const deltaV = Math.max(5, 20 * (probability / missDistance) * 10000)
    actions.push({
      id: `action-${Date.now()}-1`,
      type: 'maneuver',
      description: '🚨 URGENT: Execute immediate collision avoidance maneuver',
      deltaV: deltaV,
      fuelCost: deltaV * 0.5,
      successRate: 0.98,
      executionTime: 180,
      priority: 5,
    })
  }
  // High probability - recommend maneuver
  else if (probability > 0.5 || missDistance < 300) {
    const deltaV = Math.max(2, 15 * (probability / missDistance) * 10000)
    actions.push({
      id: `action-${Date.now()}-1`,
      type: 'maneuver',
      description: 'Execute collision avoidance maneuver',
      deltaV: deltaV,
      fuelCost: deltaV * 0.5,
      successRate: 0.95,
      executionTime: 300,
      priority: 4,
    })
  }
  
  // Always offer orientation adjustment
  actions.push({
    id: `action-${Date.now()}-2`,
    type: 'orientation',
    description: 'Minimize cross-section through orientation adjustment',
    successRate: 0.85,
    executionTime: 120,
    priority: 3,
  })
  
  // Monitoring option
  actions.push({
    id: `action-${Date.now()}-3`,
    type: 'monitor',
    description: 'Continue monitoring and prepare for emergency maneuver',
    successRate: 0.7,
    executionTime: 60,
    priority: 2,
  })
  
  return actions
}

/**
 * Legacy function for backward compatibility
 */
export async function fetchConjunctionData(
  noradCatId: string
): Promise<ConjunctionData[]> {
  try {
    if (USE_SIMULATION) {
      console.log('ℹ️ Using simulation mode for conjunction data')
      return []
    }

    const cdmData = await spaceTrackService.fetchConjunctionData(noradCatId)
    
    return cdmData.map(cdm => ({
      objectId: cdm.OBJECT_ID,
      objectName: cdm.SAT_2_NAME || cdm.OBJECT_NAME,
      timeToClosestApproach: Math.max(0, (new Date(cdm.TCA).getTime() - Date.now()) / 1000),
      missDistance: parseFloat(cdm.MISS_DISTANCE) * 1000,
      probability: parseFloat(cdm.PROBABILITY) || 0,
      createdAt: new Date(cdm.CREATION_DATE),
    }))
  } catch (error) {
    console.error('Failed to fetch conjunction data:', error)
    return []
  }
}


