import { useState, useEffect } from 'react'
import { CheckCircle, Play, Gauge, Clock, Flame } from 'lucide-react'
import { useSatelliteStore } from '../store/satelliteStore'

export default function ActionPanel() {
  const { threats, satellites, executeAction, removeThreat } = useSatelliteStore()
  const [executingAction, setExecutingAction] = useState<string | null>(null)
  const [selectedThreat, setSelectedThreat] = useState<string | null>(
    threats.length > 0 ? threats[0].id : null
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 自动选择第一个威胁（当威胁列表变化时）
  useEffect(() => {
    if (threats.length > 0 && !selectedThreat) {
      setSelectedThreat(threats[0].id)
    }
    // 如果当前选中的威胁不存在了，选择第一个
    if (selectedThreat && !threats.find(t => t.id === selectedThreat)) {
      setSelectedThreat(threats.length > 0 ? threats[0].id : null)
    }
  }, [threats, selectedThreat])

  // 自动隐藏成功消息
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleExecuteAction = async (threatId: string, actionId: string) => {
    const threat = threats.find(t => t.id === threatId)
    const action = threat?.suggestedActions.find(a => a.id === actionId)
    const satellite = satellites.find(s => s.id === threat?.satelliteId)
    
    setExecutingAction(actionId)
    
    // Simulate action execution
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    executeAction(threatId, actionId)
    setExecutingAction(null)
    
    // 显示成功消息
    setSuccessMessage(
      `✅ Action executed successfully! ${action?.type.toUpperCase()} performed on ${satellite?.name}`
    )
    
    // Select next threat if available
    const remainingThreats = threats.filter((t) => t.id !== threatId)
    setSelectedThreat(remainingThreats.length > 0 ? remainingThreats[0].id : null)
  }

  const handleDismissThreat = (threatId: string) => {
    removeThreat(threatId)
    const remainingThreats = threats.filter((t) => t.id !== threatId)
    setSelectedThreat(remainingThreats.length > 0 ? remainingThreats[0].id : null)
  }

  const currentThreat = threats.find((t) => t.id === selectedThreat)
  const currentSatellite = currentThreat
    ? satellites.find((s) => s.id === currentThreat.satelliteId)
    : null

  if (threats.length === 0) {
    return null
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-semibold">Decision & Action Panel</h2>
        </div>
        {successMessage && (
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold animate-pulse border border-green-500/50">
            {successMessage}
          </div>
        )}
      </div>

      {/* Threat Selector */}
      {threats.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Select Threat</label>
          <select
            value={selectedThreat || ''}
            onChange={(e) => setSelectedThreat(e.target.value)}
            className="w-full px-3 py-2 bg-space-dark border border-space-cyan/30 rounded-lg focus:border-space-cyan focus:outline-none text-white threat-select"
            style={{ colorScheme: 'dark' }}
          >
            {threats.map((threat) => {
              const sat = satellites.find((s) => s.id === threat.satelliteId)
              return (
                <option key={threat.id} value={threat.id}>
                  {threat.type.toUpperCase()} - {sat?.name} ({threat.severity})
                </option>
              )
            })}
          </select>
        </div>
      )}

      {currentThreat && currentSatellite && (
        <>
          {/* Threat Summary */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{currentSatellite.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  currentThreat.severity === 'critical'
                    ? 'bg-red-500'
                    : currentThreat.severity === 'high'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-blue-500'
                }`}
              >
                {currentThreat.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{currentThreat.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Collision Probability</span>
              <span className="font-semibold text-red-400">
                {(currentThreat.probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Suggested Actions
            </h3>
            
            {currentThreat.suggestedActions
              .sort((a, b) => b.priority - a.priority)
              .map((action) => (
                <div
                  key={action.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-space-cyan transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold uppercase text-space-cyan">
                          {action.type}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 mx-0.5 rounded ${
                                i < action.priority ? 'bg-yellow-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{action.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {action.deltaV !== undefined && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Gauge className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-gray-400 text-xs">ΔV</div>
                          <div className="font-semibold">{action.deltaV.toFixed(2)} m/s</div>
                        </div>
                      </div>
                    )}
                    {action.fuelCost !== undefined && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="text-gray-400 text-xs">Fuel</div>
                          <div className="font-semibold">{action.fuelCost.toFixed(2)} kg</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-gray-400 text-xs">Time</div>
                        <div className="font-semibold">{action.executionTime}s</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-400">Success Rate: </span>
                      <span className="font-semibold text-green-400">
                        {(action.successRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleExecuteAction(currentThreat.id, action.id)}
                      disabled={executingAction !== null}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                        executingAction === action.id
                          ? 'bg-yellow-500 text-black'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {executingAction === action.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Execute</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Dismiss Option */}
          <button
            onClick={() => handleDismissThreat(currentThreat.id)}
            className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
          Dismiss Threat (Monitor Only)
        </button>
        </>
      )}

      {!currentThreat && threats.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg text-gray-300 mb-2">No Active Threats</p>
          <p className="text-sm text-gray-500">All satellites operating normally</p>
        </div>
      )}
    </div>
  )
}




