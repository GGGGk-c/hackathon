import { Satellite, Radio, Shield } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Satellite className="w-10 h-10 text-space-cyan animate-spin-slow" />
              <Radio className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white text-shadow">
                ANT61 Beacon
              </h1>
              <p className="text-xs text-gray-400">Satellite Collision Avoidance System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
              <div className="text-sm">
                <div className="text-gray-400">System Status</div>
                <div className="text-green-400 font-semibold">Operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}







