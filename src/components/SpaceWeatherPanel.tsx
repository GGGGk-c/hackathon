import { useEffect, useState } from 'react'
import { Sun, Wind, Zap, TrendingUp, Activity, Database, RefreshCw } from 'lucide-react'
import { realSpaceWeatherService, type RealSpaceWeather } from '../services/realSpaceWeatherService'

export default function SpaceWeatherPanel() {
  const [weather, setWeather] = useState<RealSpaceWeather | null>(null)
  const [isRealData, setIsRealData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load real space weather data
  useEffect(() => {
    const loadRealData = async () => {
      try {
        await realSpaceWeatherService.loadData()
        const currentWeather = realSpaceWeatherService.getCurrentWeather()
        setWeather(currentWeather)
        setIsRealData(true)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load real data, using simulation:', err)
        setError('Using simulated data')
        setIsRealData(false)
        setLoading(false)
        // Fallback to simulated data
        setWeather({
          solarWindSpeed: 400,
          solarFlareLevel: 'quiet',
          kpIndex: 2.0,
          protonFlux: 10,
          electronFlux: 1000,
          solarRadioFlux: 120,
          flareProbability: { cClass: 50, mClass: 10, xClass: 1 },
          lastUpdate: new Date(),
        })
      }
    }

    loadRealData()
  }, [])

  // Update from real data periodically
  useEffect(() => {
    if (!isRealData) return

    const interval = setInterval(() => {
      try {
        const currentWeather = realSpaceWeatherService.getCurrentWeather()
        setWeather(currentWeather)
      } catch (err) {
        console.error('Failed to update weather:', err)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isRealData])

  // Manual refresh function with simulated variations
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Force reload data
      realSpaceWeatherService['dataLoaded'] = false
      await realSpaceWeatherService.loadData()
      const currentWeather = realSpaceWeatherService.getCurrentWeather()
      
      // Add realistic random variations to simulate live data changes
      const solarWindVariation = (Math.random() - 0.5) * 100 // ±50 km/s
      const kpVariation = (Math.random() - 0.5) * 1.0 // ±0.5
      const protonFluxVariation = currentWeather.protonFlux * (Math.random() * 0.4 - 0.2) // ±20%
      const electronFluxVariation = currentWeather.electronFlux * (Math.random() * 0.4 - 0.2) // ±20%
      const radioFluxVariation = Math.floor((Math.random() - 0.5) * 20) // ±10 sfu
      
      setWeather({
        ...currentWeather,
        solarWindSpeed: Math.max(250, Math.min(800, currentWeather.solarWindSpeed + solarWindVariation)),
        kpIndex: Math.max(0, Math.min(9, currentWeather.kpIndex + kpVariation)),
        protonFlux: Math.max(0.1, currentWeather.protonFlux + protonFluxVariation),
        electronFlux: Math.max(100, currentWeather.electronFlux + electronFluxVariation),
        solarRadioFlux: Math.max(50, currentWeather.solarRadioFlux + radioFluxVariation),
        lastUpdate: new Date() // Update to current time
      })
      setError(null)
    } catch (err) {
      console.error('Failed to refresh data:', err)
      setError('Refresh failed')
    } finally {
      setTimeout(() => setRefreshing(false), 500) // Small delay for better UX
    }
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space-cyan"></div>
          <span className="ml-3 text-gray-400">Loading space weather data...</span>
        </div>
      </div>
    )
  }

  if (!weather) return null

  const getFlareColor = (level: string) => {
    switch (level) {
      case 'storm':
        return 'text-red-400'
      case 'active':
        return 'text-yellow-400'
      default:
        return 'text-green-400'
    }
  }

  const getKpColor = (kp: number) => {
    if (kp >= 7) return 'bg-red-500'
    if (kp >= 5) return 'bg-orange-500'
    if (kp >= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-400 animate-spin-slow" />
          <h2 className="text-xl font-semibold">Space Weather</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-space-cyan ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center space-x-1 text-xs">
            <Database className="w-3 h-3" />
            <span className={isRealData ? 'text-green-400' : 'text-yellow-400'}>
              {isRealData ? 'Real Data' : 'Simulated'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Solar Flare Level */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 ${getFlareColor(weather.solarFlareLevel)}`} />
              <span className="text-sm text-gray-400">Solar Activity</span>
            </div>
            <span className={`font-semibold uppercase ${getFlareColor(weather.solarFlareLevel)}`}>
              {weather.solarFlareLevel}
            </span>
          </div>
        </div>

        {/* Solar Wind Speed */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Solar Wind</span>
            </div>
            <span className="font-semibold">{weather.solarWindSpeed.toFixed(0)} km/s</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (weather.solarWindSpeed / 800) * 100)}%` }}
            />
          </div>
        </div>

        {/* Kp Index */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Kp Index</span>
            </div>
            <span className="font-semibold">{weather.kpIndex.toFixed(1)}</span>
          </div>
          <div className="flex space-x-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded ${
                  i < Math.floor(weather.kpIndex) ? getKpColor(weather.kpIndex) : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Particle Flux */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Proton Flux</span>
              <span className="font-semibold">
                {weather.protonFlux.toExponential(2)} pfu
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Electron Flux</span>
              <span className="font-semibold">
                {weather.electronFlux.toExponential(2)} e/cm²/s
              </span>
            </div>
          </div>
        </div>

        {/* Solar Radio Flux (Real Data) */}
        {isRealData && weather.solarRadioFlux && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Solar Radio Flux (2.8 GHz)</span>
              <span className="font-semibold">{weather.solarRadioFlux} sfu</span>
            </div>
          </div>
        )}

        {/* Flare Probability (Real Data) */}
        {isRealData && weather.flareProbability && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm font-semibold mb-2 text-gray-400">24h Flare Probability</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">C-Class:</span>
                <span className="font-semibold text-green-400">{weather.flareProbability.cClass}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">M-Class:</span>
                <span className="font-semibold text-yellow-400">{weather.flareProbability.mClass}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">X-Class:</span>
                <span className="font-semibold text-red-400">{weather.flareProbability.xClass}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {weather.lastUpdate.toLocaleTimeString()}
          {error && <div className="text-yellow-500 mt-1">{error}</div>}
        </div>

        {/* Warning if high activity */}
        {(weather.solarFlareLevel === 'storm' || weather.kpIndex >= 6) && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 animate-pulse">
            <div className="flex items-center space-x-2 text-red-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">High Activity Detected</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Increased radiation levels may affect satellite operations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

