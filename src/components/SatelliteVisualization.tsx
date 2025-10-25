import { useRef, useMemo } from 'react'
import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSatelliteStore } from '../store/satelliteStore'

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={earthRef} args={[1, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#1e40af"
        metalness={0.4}
        roughness={0.7}
        emissive="#0c1f5c"
        emissiveIntensity={0.2}
      />
    </Sphere>
  )
}

interface SatelliteOrbitProps {
  satellite: any
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function SatelliteOrbit({ satellite, isSelected, isHovered, onSelect, onHover }: SatelliteOrbitProps) {
  const orbitalRef = useRef<THREE.Group>(null)
  const satelliteRef = useRef<THREE.Mesh>(null)
  
  // Convert orbital parameters to 3D position
  const { position, orbitPoints } = useMemo(() => {
    const params = satellite.orbitalParams
    const a = params.semiMajorAxis / 6371 // Normalize to Earth radii
    const e = params.eccentricity
    const i = (params.inclination * Math.PI) / 180
    const raan = (params.raan * Math.PI) / 180
    const argPeri = (params.argumentOfPeriapsis * Math.PI) / 180
    const trueAnom = (params.trueAnomaly * Math.PI) / 180

    // Calculate position in orbital plane
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnom))
    const x = r * Math.cos(trueAnom)
    const y = r * Math.sin(trueAnom)

    // Rotate to 3D space
    const cosI = Math.cos(i)
    const sinI = Math.sin(i)
    const cosRaan = Math.cos(raan)
    const sinRaan = Math.sin(raan)
    const cosArgPeri = Math.cos(argPeri)
    const sinArgPeri = Math.sin(argPeri)

    const px =
      x * (cosRaan * cosArgPeri - sinRaan * sinArgPeri * cosI) -
      y * (cosRaan * sinArgPeri + sinRaan * cosArgPeri * cosI)
    const py =
      x * (sinRaan * cosArgPeri + cosRaan * sinArgPeri * cosI) -
      y * (sinRaan * sinArgPeri - cosRaan * cosArgPeri * cosI)
    const pz = x * sinArgPeri * sinI + y * cosArgPeri * sinI

    // Generate orbit path
    const points: THREE.Vector3[] = []
    const segments = 128
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

    return {
      position: new THREE.Vector3(px, pz, py),
      orbitPoints: points,
    }
  }, [satellite])

  useFrame((state) => {
    if (orbitalRef.current) {
      const time = state.clock.getElapsedTime()
      // Slow orbit animation
      orbitalRef.current.rotation.y = time * 0.05
    }
  })

  const color = 
    satellite.status === 'critical' ? '#ef4444' :
    satellite.status === 'warning' ? '#fbbf24' :
    '#06b6d4'
  
  const displayColor = isSelected ? '#ffffff' : isHovered ? '#22d3ee' : color

  return (
    <group ref={orbitalRef}>
      {/* Orbit path */}
      <Line
        points={orbitPoints}
        color={color}
        lineWidth={1}
        opacity={0.4}
        transparent
      />
      
      {/* Satellite - 可点击 */}
      <Sphere 
        ref={satelliteRef}
        args={[isSelected ? 0.12 : 0.08, 16, 16]} 
        position={position}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(satellite.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          onHover(satellite.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          onHover(null)
        }}
      >
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={isSelected ? 1.5 : (satellite.status === 'critical' ? 1 : 0.5)}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Satellite glow effect */}
      {(satellite.status !== 'active' || isSelected || isHovered) && (
        <Sphere args={[isSelected ? 0.18 : 0.12, 16, 16]} position={position}>
          <meshBasicMaterial
            color={displayColor}
            transparent
            opacity={isSelected ? 0.5 : 0.3}
          />
        </Sphere>
      )}
      
      {/* Satellite name label - 点击或悬停时显示 */}
      {(isSelected || isHovered) && (
        <Html 
          position={[position.x, position.y + 0.2, position.z]} 
          center
          distanceFactor={6}
        >
          <div
            className="satellite-label"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: displayColor,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: `2px solid ${displayColor}`,
              pointerEvents: 'none',
              textShadow: `0 0 8px ${displayColor}`,
              boxShadow: `0 0 15px ${displayColor}60`,
              animation: isSelected ? 'pulse 2s infinite' : 'none',
            }}
          >
            {satellite.name}
          </div>
        </Html>
      )}
    </group>
  )
}


export default function SatelliteVisualization() {
  const satellites = useSatelliteStore((state) => state.satellites)
  const [selectedSatelliteId, setSelectedSatelliteId] = React.useState<string | null>(null)
  const [hoveredSatelliteId, setHoveredSatelliteId] = React.useState<string | null>(null)

  const selectedSatellite = satellites.find(s => s.id === selectedSatelliteId)

  return (
    <div className="w-full h-full relative">
      {/* Satellite Info Panel */}
      {selectedSatellite && (
        <div className="absolute top-4 right-4 z-10 glass-effect rounded-lg p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-space-cyan">{selectedSatellite.name}</h3>
            <button
              onClick={() => setSelectedSatelliteId(null)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Altitude:</span>
              <span className="font-medium">{selectedSatellite.orbitalParams.semiMajorAxis.toFixed(0)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inclination:</span>
              <span className="font-medium">{selectedSatellite.orbitalParams.inclination.toFixed(2)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Eccentricity:</span>
              <span className="font-medium">{selectedSatellite.orbitalParams.eccentricity.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mass:</span>
              <span className="font-medium">{selectedSatellite.mass} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                selectedSatellite.status === 'critical' ? 'text-red-400' :
                selectedSatellite.status === 'warning' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {selectedSatellite.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Instruction */}
      {!selectedSatellite && (
        <div className="absolute top-4 right-4 z-10 glass-effect rounded-lg px-3 py-2 text-xs text-gray-400">
          💡 Click on a satellite to view details
        </div>
      )}
      
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <Stars radius={300} depth={50} count={5000} factor={4} fade speed={1} />
        
        <Earth />
        
        {satellites.map((satellite) => (
          <SatelliteOrbit 
            key={satellite.id} 
            satellite={satellite}
            isSelected={selectedSatelliteId === satellite.id}
            isHovered={hoveredSatelliteId === satellite.id}
            onSelect={setSelectedSatelliteId}
            onHover={setHoveredSatelliteId}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-3 text-sm">
        <div className="font-semibold mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-gray-300">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-gray-300">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
            <span className="text-gray-300">Critical</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute top-4 left-4 glass-effect rounded-lg p-3 text-xs text-gray-400">
        <div>🖱️ Left Click + Drag: Rotate</div>
        <div>🖱️ Right Click + Drag: Pan</div>
        <div>🖱️ Scroll: Zoom</div>
      </div>

      {satellites.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">No satellites to display</p>
            <p className="text-sm">Add a satellite to see its orbit</p>
          </div>
        </div>
      )}
    </div>
  )
}




