import { useState } from 'react'
import { Satellite, Plus, Trash2 } from 'lucide-react'
import { useSatelliteStore, type OrbitalParameters } from '../store/satelliteStore'

export default function SatelliteForm() {
  const { satellites, addSatellite, removeSatellite } = useSatelliteStore()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    mass: 500,
    crossSection: 10,
    semiMajorAxis: 7000,
    eccentricity: 0.001,
    inclination: 45,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const orbitalParams: OrbitalParameters = {
      semiMajorAxis: formData.semiMajorAxis,
      eccentricity: formData.eccentricity,
      inclination: formData.inclination,
      raan: formData.raan,
      argumentOfPeriapsis: formData.argumentOfPeriapsis,
      trueAnomaly: formData.trueAnomaly,
    }

    addSatellite({
      name: formData.name || `Satellite ${satellites.length + 1}`,
      mass: formData.mass,
      crossSection: formData.crossSection,
      orbitalParams,
    })

    // Reset form
    setFormData({
      ...formData,
      name: '',
    })
    setIsExpanded(false)
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Satellite className="w-5 h-5 text-space-cyan" />
          <h2 className="text-xl font-semibold">Satellites</h2>
          {satellites.length > 0 && (
            <span className="px-2 py-1 text-xs font-semibold bg-space-cyan/20 text-space-cyan rounded-full">
              {satellites.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Add new satellite"
        >
          <Plus className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Satellite List */}
      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto scrollbar-hide">
        {satellites.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No satellites added yet
          </p>
        ) : (
          satellites.map((sat) => (
            <div
              key={sat.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">{sat.name}</div>
                <div className="text-xs text-gray-400">
                  Alt: {(sat.orbitalParams.semiMajorAxis - 6371).toFixed(0)} km
                  {' • '}
                  Inc: {sat.orbitalParams.inclination.toFixed(1)}°
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  sat.status === 'critical' ? 'bg-red-500 animate-pulse' :
                  sat.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <button
                  onClick={() => removeSatellite(sat.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Satellite Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Satellite Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mass (kg)</label>
              <input
                type="number"
                value={formData.mass}
                onChange={(e) => setFormData({ ...formData, mass: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cross Section (m²)</label>
              <input
                type="number"
                value={formData.crossSection}
                onChange={(e) => setFormData({ ...formData, crossSection: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Semi-Major Axis (km)
            </label>
            <input
              type="number"
              value={formData.semiMajorAxis}
              onChange={(e) => setFormData({ ...formData, semiMajorAxis: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Eccentricity</label>
              <input
                type="number"
                step="0.001"
                value={formData.eccentricity}
                onChange={(e) => setFormData({ ...formData, eccentricity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Inclination (°)</label>
              <input
                type="number"
                value={formData.inclination}
                onChange={(e) => setFormData({ ...formData, inclination: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">RAAN (°)</label>
              <input
                type="number"
                value={formData.raan}
                onChange={(e) => setFormData({ ...formData, raan: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Arg. Peri. (°)</label>
              <input
                type="number"
                value={formData.argumentOfPeriapsis}
                onChange={(e) => setFormData({ ...formData, argumentOfPeriapsis: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">True Anom. (°)</label>
              <input
                type="number"
                value={formData.trueAnomaly}
                onChange={(e) => setFormData({ ...formData, trueAnomaly: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-space-cyan focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-space-cyan hover:bg-space-cyan/80 rounded-lg font-semibold transition-colors glow-effect"
          >
            Add Satellite
          </button>
        </form>
      )}
    </div>
  )
}




