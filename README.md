# ANT61 Satellite Collision Avoidance System

A real-time satellite collision avoidance and threat monitoring system built for the Hackathon 2025 challenge.

## 🚀 Features

- **Satellite Management**: Input and track multiple satellites with detailed orbital parameters
- **3D Visualization**: Interactive Three.js visualization of satellite orbits around Earth
- **Threat Detection**: Real-time monitoring of potential collision threats including:
  - Space debris conjunctions
  - Close approach events
  - Coronal Mass Ejections (CME)
  - Solar storms
- **Space Weather Monitoring**: Live space weather data including:
  - Solar wind speed
  - Kp index
  - Particle flux levels
  - Solar flare activity
- **Decision Support System**: Suggested actions with detailed metrics:
  - ΔV requirements
  - Fuel costs
  - Success rates
  - Execution times
- **Real-time Notifications**: Color-coded threat levels (Low, Medium, High, Critical)
- **Action Execution**: Execute avoidance maneuvers directly from the interface

## 🛠️ Technologies

### Required
- **React 18** - Modern frontend framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Optional (Implemented)
- **Three.js** (@react-three/fiber) - 3D satellite orbit visualization
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Modern, responsive UI styling
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### 1. Add Satellites
- Click the "+" button in the Satellites panel
- Enter satellite details:
  - Name
  - Mass and cross-section
  - Orbital parameters (semi-major axis, eccentricity, inclination, RAAN, argument of periapsis, true anomaly)
- Click "Add Satellite"

### 2. Monitor Threats
- The system automatically detects potential threats
- View threat details in the Threat Monitor panel
- Threats are color-coded by severity:
  - 🔴 Critical - Immediate action required
  - 🟡 High - Action recommended
  - 🔵 Medium/Low - Monitor situation

### 3. Take Action
- Review suggested actions in the Decision & Action Panel
- Each action shows:
  - Priority level
  - Required ΔV and fuel cost
  - Execution time
  - Success rate
- Click "Execute" to implement the chosen action

### 4. View 3D Visualization
- Toggle to "3D Visualization" mode
- Interact with the 3D view:
  - Left click + drag to rotate
  - Right click + drag to pan
  - Scroll to zoom
- Satellites are color-coded by status

### 5. Monitor Space Weather
- Real-time space weather conditions displayed in the right panel
- High activity warnings alert operators to increased risks

## 🌍 Orbital Parameters Guide

- **Semi-Major Axis**: Average radius of orbit (km) - Earth radius is ~6,371 km
- **Eccentricity**: Orbit shape (0 = circular, <1 = elliptical)
- **Inclination**: Tilt of orbit plane (0° = equatorial, 90° = polar)
- **RAAN**: Right Ascension of Ascending Node (0-360°)
- **Argument of Periapsis**: Angle to closest approach point (0-360°)
- **True Anomaly**: Current position in orbit (0-360°)

### Example Satellites

**Low Earth Orbit (LEO)**
- Semi-Major Axis: 6,800 km
- Inclination: 51.6° (ISS-like)

**Medium Earth Orbit (MEO)**
- Semi-Major Axis: 20,000 km
- Inclination: 55° (GPS-like)

**Geostationary Orbit (GEO)**
- Semi-Major Axis: 42,164 km
- Inclination: 0°
- Eccentricity: ~0

## 🎨 Features Implementation

### Core Features
- ✅ Multi-satellite input and management
- ✅ Real-time threat detection simulation
- ✅ Decision-making support system
- ✅ Action execution interface
- ✅ 3D orbital visualization
- ✅ Space weather monitoring
- ✅ Responsive, modern UI

### Advanced Features
- ✅ Automatic threat generation based on orbital parameters
- ✅ Priority-based action recommendations
- ✅ Visual threat severity indicators
- ✅ Interactive 3D Earth and orbit visualization
- ✅ Real-time space weather simulation
- ✅ Smooth animations and transitions

## 🔮 Future Enhancements

- Integration with real space weather APIs (NOAA, ESA)
- Integration with real conjunction data (Space-Track.org)
- WebSocket support for real-time data streaming
- Historical threat analysis and reporting
- Multi-user collaboration features
- Machine learning-based threat prediction
- Automated action execution with ANT61 Beacon hardware

## 📝 License

This project was created for the Hackathon 2025 challenge.

## 🏆 Acknowledgments

Built with ❤️ for the ANT61 Beacon Satellite Collision Avoidance Challenge






