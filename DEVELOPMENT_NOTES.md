# Development Notes

## Architecture Overview

This application is built with a modern React + TypeScript stack with the following architecture:

### State Management
- **Zustand** for global state management
- Centralized store in `src/store/satelliteStore.ts`
- Manages satellites, threats, and actions

### Component Structure
- **Header**: Displays app branding and system status
- **SatelliteForm**: Input form for adding/managing satellites
- **ThreatMonitor**: Real-time threat detection display
- **ActionPanel**: Decision-making interface with suggested actions
- **SpaceWeatherPanel**: Live space weather conditions
- **SatelliteVisualization**: 3D orbital visualization with Three.js

### Data Flow
1. User adds satellite via SatelliteForm
2. Satellite data stored in Zustand store
3. ThreatMonitor simulates real-time threat detection
4. Threats trigger automatic satellite status updates
5. ActionPanel displays threat-specific actions
6. User executes actions, triggering state updates

### 3D Visualization
- Built with `@react-three/fiber` (React renderer for Three.js)
- `@react-three/drei` for helpers (OrbitControls, Stars, etc.)
- Real orbital mechanics calculations in `src/utils/orbitalCalculations.ts`
- Coordinate system: Earth at origin, orbits calculated from Keplerian elements

### Threat Detection Simulation
Current implementation simulates threats based on:
- Random probability with weighted distribution
- Satellite count and orbital parameters
- Time-based generation intervals

**For Production**: Replace simulation with real APIs:
- Space-Track.org for conjunction data
- NOAA SWPC for space weather
- NASA CCSDS for standardized CDM messages

### Space Weather Integration
Current: Simulated with realistic parameters
**For Production**: 
- NOAA Space Weather API: `https://services.swpc.noaa.gov/json/`
- ESA Space Weather Service
- CCMC/NASA models

## Key Features

### Orbital Calculations
- `orbitalToCartesian()`: Convert Keplerian elements to 3D coordinates
- `generateOrbitPath()`: Create orbit visualization path
- `calculateOrbitalPeriod()`: Kepler's third law implementation
- Coordinate transformations using rotation matrices

### Action Generation
Actions are prioritized based on:
- Threat severity (critical > high > medium > low)
- Collision probability
- Time to event
- Available ΔV budget

### UI/UX Design
- **Glass morphism** aesthetic with backdrop blur
- **Color coding**:
  - Green: Active/Normal
  - Yellow: Warning/High
  - Red: Critical
  - Blue: Info/Medium
- **Animations**: Pulse effects for critical alerts
- **Responsive**: Works on desktop and tablet (mobile limited due to 3D)

## Future Enhancements

### Phase 1: Real Data Integration
- [ ] Space-Track.org API integration
- [ ] NOAA Space Weather API
- [ ] Authentication handling
- [ ] Rate limiting and caching

### Phase 2: Advanced Features
- [ ] WebSocket for real-time updates
- [ ] Historical threat analysis
- [ ] Automated action execution
- [ ] Multi-satellite constellation management
- [ ] Fuel budget tracking

### Phase 3: ML/AI Features
- [ ] Threat prediction models
- [ ] Optimal maneuver planning
- [ ] Pattern recognition in conjunction events
- [ ] Anomaly detection in space weather

### Phase 4: Hardware Integration
- [ ] ANT61 Beacon API integration
- [ ] Direct satellite command execution
- [ ] Telemetry data ingestion
- [ ] Health monitoring

## Technical Decisions

### Why Zustand?
- Lightweight (minimal boilerplate)
- No Context Provider needed
- TypeScript-first design
- Easy to debug

### Why Vite?
- Fast HMR (Hot Module Replacement)
- Modern build tool
- Excellent TypeScript support
- Smaller bundle sizes than CRA

### Why Three.js?
- Industry standard for 3D in browser
- Large ecosystem and community
- React-three-fiber provides React integration
- Good performance for orbital visualization

### Why Tailwind CSS?
- Utility-first approach
- Fast prototyping
- Consistent design system
- Small production bundle with purging

## Testing Strategy (Not Implemented)

Suggested testing approach:
- **Unit Tests**: Orbital calculations, utility functions
- **Component Tests**: React Testing Library for components
- **Integration Tests**: User flows (add satellite → detect threat → execute action)
- **E2E Tests**: Cypress for full application flows
- **Visual Tests**: Storybook for component gallery

## Performance Considerations

- 3D rendering limited to reasonable satellite count (<50)
- Threat generation throttled to prevent performance issues
- React.memo could be added for expensive re-renders
- Virtual scrolling for large threat lists (not yet implemented)

## Security Notes

- No sensitive data stored client-side
- API keys should be handled server-side
- Space-Track.org credentials require backend proxy
- CORS considerations for external APIs

## Deployment

Recommended platforms:
- **Vercel**: Zero-config deployment for Vite
- **Netlify**: Good for static sites
- **AWS Amplify**: Full AWS integration
- **GitHub Pages**: Free hosting option

Build command: `npm run build`
Output directory: `dist/`

