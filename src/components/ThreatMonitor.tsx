import { useEffect, useState } from 'react'
import { AlertTriangle, Zap, Orbit, Activity, Database, Shield } from 'lucide-react'
import { useSatelliteStore } from '../store/satelliteStore'
import { formatDistanceToNow } from 'date-fns'
import { checkConjunctionThreats } from '../services/conjunctionDataService'
import { realSpaceWeatherService } from '../services/realSpaceWeatherService'
import { USE_SIMULATION, UPDATE_INTERVALS, THREAT_MODE } from '../config/api.config'

export default function ThreatMonitor() {
  const { threats, satellites, addThreat } = useSatelliteStore()
  const [dataSource, setDataSource] = useState<'real' | 'simulated'>('simulated')

  // Enhanced threat detection with real data support
  useEffect(() => {
    if (satellites.length === 0) return

    let isChecking = false

    const checkThreats = async () => {
      if (isChecking) return
      isChecking = true

      try {
        // Check for conjunction threats using real or simulated data
        for (const satellite of satellites) {
          // Try to get real conjunction data if available
          // Note: You'll need to add noradCatId to your Satellite type or get it from satellite name
          const conjunctionThreats = await checkConjunctionThreats(satellite)
          
          for (const threat of conjunctionThreats) {
            // Only add if not already tracked
            const exists = threats.some(t => 
              t.satelliteId === threat.satelliteId && 
              t.type === threat.type &&
              Math.abs(t.timeToEvent - threat.timeToEvent) < 300 // Within 5 minutes
            )
            
            if (!exists && threats.length < 10) {
              addThreat(threat)
            }
          }
        }

        // Check for space weather threats (基于真实数据)
        const weather = realSpaceWeatherService.getCurrentWeather()
        if (weather && realSpaceWeatherService.isDangerous()) {
          generateSpaceWeatherThreat()
        }
        
        // 根据威胁模式决定是否生成模拟威胁
        if (THREAT_MODE === 'development') {
          // 开发模式：较多模拟威胁用于测试
          if (Math.random() > 0.92 && threats.length < 3) {
            generateSimulatedThreat()
          }
        } else if (THREAT_MODE === 'demo') {
          // 演示模式：极少的模拟威胁
          if (threats.length === 0 && Math.random() > 0.99) {
            generateSimulatedThreat()
          }
        }
        // strict 模式：不生成任何模拟威胁

        // Update data source indicator
        const isRealMode = !USE_SIMULATION && THREAT_MODE === 'strict'
        setDataSource(isRealMode ? 'real' : 'simulated')
      } catch (error) {
        console.error('Error checking threats:', error)
      } finally {
        isChecking = false
      }
    }

    // Initial check
    checkThreats()

    // Periodic checks
    const interval = setInterval(checkThreats, UPDATE_INTERVALS.threats)

    return () => clearInterval(interval)
  }, [satellites, threats, addThreat])

  /**
   * Generate space weather related threats based on real data
   */
  const generateSpaceWeatherThreat = () => {
    if (satellites.length === 0 || threats.some(t => t.type === 'solar-storm')) return

    const randomSatellite = satellites[Math.floor(Math.random() * satellites.length)]
    const weather = realSpaceWeatherService.getCurrentWeather()

    const severity = 
      weather.kpIndex >= 8 ? 'critical' :
      weather.kpIndex >= 6 ? 'high' :
      weather.kpIndex >= 5 ? 'medium' : 'low'

    addThreat({
      satelliteId: randomSatellite.id,
      type: weather.solarFlareLevel === 'storm' ? 'solar-storm' : 'cme',
      severity: severity as 'low' | 'medium' | 'high' | 'critical',
      timeToEvent: 3600, // 1 hour
      probability: 0.7,
      description: `${USE_SIMULATION ? '[REAL DATA] ' : ''}High solar activity detected. Kp=${weather.kpIndex.toFixed(1)}, Solar Wind=${weather.solarWindSpeed.toFixed(0)} km/s`,
      suggestedActions: [
        {
          id: `action-${Date.now()}-1`,
          type: 'orientation',
          description: 'Orient solar panels to minimize radiation exposure',
          successRate: 0.9,
          executionTime: 180,
          priority: 4,
        },
        {
          id: `action-${Date.now()}-2`,
          type: 'shutdown',
          description: 'Shutdown non-essential systems to reduce radiation damage',
          successRate: 0.95,
          executionTime: 300,
          priority: 3,
        },
        {
          id: `action-${Date.now()}-3`,
          type: 'monitor',
          description: 'Monitor radiation levels and system health',
          successRate: 0.85,
          executionTime: 60,
          priority: 2,
        },
      ],
    })
  }

  /**
   * Generate simulated threats (fallback for demo purposes)
   */
  const generateSimulatedThreat = () => {
    const randomSatellite = satellites[Math.floor(Math.random() * satellites.length)]
    const threatTypes = ['debris', 'cme', 'solar-storm'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    const descriptions = {
      debris: `[SIMULATED] Space debris detected. Size: ${(Math.random() * 50 + 10).toFixed(1)} cm`,
      cme: `[SIMULATED] Coronal Mass Ejection. Density: ${(Math.random() * 1000 + 500).toFixed(0)} particles/cm³`,
      'solar-storm': `[SIMULATED] Solar storm. Radiation: ${(Math.random() * 5 + 1).toFixed(1)}x normal`,
    }

    const suggestedActions = [
      {
        id: `action-${Date.now()}-1`,
        type: 'maneuver' as const,
        description: 'Execute avoidance maneuver',
        deltaV: Math.random() * 10 + 2,
        fuelCost: Math.random() * 5 + 1,
        successRate: 0.95,
        executionTime: 300,
        priority: severity === 'critical' ? 5 : severity === 'high' ? 4 : 3,
      },
      {
        id: `action-${Date.now()}-2`,
        type: 'orientation' as const,
        description: 'Adjust satellite orientation',
        successRate: 0.85,
        executionTime: 120,
        priority: severity === 'critical' ? 4 : 3,
      },
      {
        id: `action-${Date.now()}-3`,
        type: 'monitor' as const,
        description: 'Continue monitoring',
        successRate: 0.7,
        executionTime: 60,
        priority: 2,
      },
    ]

    addThreat({
      satelliteId: randomSatellite.id,
      type,
      severity,
      timeToEvent: Math.random() * 86400 + 3600,
      probability: Math.random() * 0.5 + 0.3,
      description: descriptions[type],
      suggestedActions,
    })
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'debris':
      case 'conjunction':
        return <Orbit className="w-5 h-5" />
      case 'cme':
      case 'solar-storm':
        return <Zap className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  const formatTimeToEvent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold">Threat Monitor</h2>
          {THREAT_MODE === 'strict' && (
            <Shield className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            {threats.length} active threat{threats.length !== 1 ? 's' : ''}
          </div>
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold ${
              dataSource === 'real'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}
            title={`Mode: ${THREAT_MODE}`}
          >
            <Database className="w-3 h-3" />
            <span>{dataSource === 'real' ? 'Real Data' : THREAT_MODE === 'demo' ? 'Demo' : 'Dev'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
        {threats.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">All systems nominal</p>
            <p className="text-sm text-gray-500 mt-1">No threats detected</p>
          </div>
        ) : (
          threats.map((threat) => {
            const satellite = satellites.find((s) => s.id === threat.satelliteId)
            
            return (
              <div
                key={threat.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  threat.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500'
                    : threat.severity === 'high'
                    ? 'bg-yellow-500/10 border-yellow-500'
                    : 'bg-blue-500/10 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getThreatIcon(threat.type)}
                    <div>
                      <div className="font-semibold">
                        {threat.type.toUpperCase().replace('-', ' ')}
                      </div>
                      <div className="text-sm text-gray-400">
                        Target: {satellite?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        threat.severity === 'critical'
                          ? 'bg-red-500'
                          : threat.severity === 'high'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-blue-500'
                      }`}
                    >
                      {threat.severity.toUpperCase()}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">{threat.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div className="bg-black/30 p-2 rounded">
                    <div className="text-gray-400">Time to Event</div>
                    <div className="font-semibold text-yellow-400">
                      {formatTimeToEvent(threat.timeToEvent)}
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <div className="text-gray-400">Probability</div>
                    <div className="font-semibold text-red-400">
                      {(threat.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <div className="text-gray-400">Detected</div>
                    <div className="font-semibold text-space-cyan">
                      {formatDistanceToNow(threat.detectedAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {threat.suggestedActions.length} suggested action
                  {threat.suggestedActions.length !== 1 ? 's' : ''} available
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}


