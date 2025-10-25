import { useState, useEffect } from 'react'
import Header from './components/Header'
import SatelliteForm from './components/SatelliteForm'
import SatelliteVisualization from './components/SatelliteVisualization'
import ThreatMonitor from './components/ThreatMonitor'
import ActionPanel from './components/ActionPanel'
import SpaceWeatherPanel from './components/SpaceWeatherPanel'
import { useSatelliteStore } from './store/satelliteStore'
import { loadSatellitesFromCSV } from './utils/tleParser'

function App() {
  const [activeView, setActiveView] = useState<'monitor' | '3d'>('monitor')
  const [isLoading, setIsLoading] = useState(true)
  const satellites = useSatelliteStore((state) => state.satellites)
  const addSatellite = useSatelliteStore((state) => state.addSatellite)
  
  // 应用启动时自动加载卫星数据
  useEffect(() => {
    async function loadInitialSatellites() {
      try {
        console.log('🚀 Loading satellites from Data.csv...')
        const csvSatellites = await loadSatellitesFromCSV()
        
        if (csvSatellites.length > 0) {
          // 只加载前10个卫星，避免系统过载
          const satellitesToLoad = csvSatellites.slice(0, 10)
          
          for (const sat of satellitesToLoad) {
            addSatellite({
              name: sat.name,
              mass: sat.mass,
              crossSection: sat.crossSection,
              orbitalParams: sat.orbitalParams,
            })
          }
          
          console.log(`✅ Successfully loaded ${satellitesToLoad.length} satellites`)
        } else {
          console.log('⚠️ No satellites loaded from CSV')
        }
      } catch (error) {
        console.error('❌ Error loading initial satellites:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialSatellites()
  }, [addSatellite])
  
  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-darker via-space-dark to-space-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-space-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Satellites...</p>
          <p className="text-sm text-gray-400 mt-2">Parsing TLE data from Data.csv</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-darker via-space-dark to-space-blue">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="glass-effect rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveView('monitor')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeView === 'monitor'
                    ? 'bg-space-cyan text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Threat Monitor
              </button>
              <button
                onClick={() => setActiveView('3d')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeView === '3d'
                    ? 'bg-space-cyan text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                3D Visualization
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Input and Weather */}
            <div className="space-y-6">
              <SatelliteForm />
              <SpaceWeatherPanel />
            </div>

            {/* Center Column - Main View */}
            <div className="lg:col-span-2 space-y-6">
              {activeView === 'monitor' ? (
                <>
                  <ThreatMonitor />
                  <ActionPanel />
                </>
              ) : (
                <div className="glass-effect rounded-xl p-6 h-[700px]">
                  <SatelliteVisualization />
                </div>
              )}
            </div>
          </div>

          {/* Satellite Count Info */}
          {satellites.length > 0 && (
            <div className="mt-6 text-center text-gray-400">
              <p>Monitoring {satellites.length} satellite{satellites.length > 1 ? 's' : ''}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App




