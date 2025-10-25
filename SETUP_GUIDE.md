# 🚀 Setup Guide - ANT61 Satellite Collision Avoidance System

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open a new terminal and run `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Installation Steps

### Option 1: Using Command Prompt (CMD)

1. Open **Command Prompt** (not PowerShell)
2. Navigate to the project directory:
   ```cmd
   cd "D:\CODE A\Hackthon2"
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Start the development server:
   ```cmd
   npm run dev
   ```

5. Open your browser to: http://localhost:3000

### Option 2: Using PowerShell

1. Open **PowerShell**
2. Navigate to the project directory:
   ```powershell
   cd "D:\CODE A\Hackthon2"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

5. Open your browser to: http://localhost:3000

### Option 3: Using VS Code Terminal

1. Open VS Code
2. Open the project folder: File → Open Folder → Select `D:\CODE A\Hackthon2`
3. Open integrated terminal: View → Terminal (or Ctrl + `)
4. Run:
   ```bash
   npm install
   npm run dev
   ```

## Troubleshooting

### Issue: "npm is not recognized"

**Solution 1: Add Node.js to PATH**
1. Find your Node.js installation path (usually `C:\Program Files\nodejs\`)
2. Add it to your system PATH:
   - Open System Properties → Environment Variables
   - Edit "Path" under System Variables
   - Add Node.js path
   - Restart your terminal

**Solution 2: Reinstall Node.js**
1. Download Node.js from https://nodejs.org/
2. Run the installer
3. Make sure "Add to PATH" is checked during installation
4. Restart your computer

### Issue: Port 3000 already in use

Change the port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change this number
  open: true
}
```

### Issue: Dependencies not installing

Try these commands in order:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Project Structure

```
Hackthon2/
├── public/              # Static assets
│   └── satellite.svg    # Satellite icon
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── SatelliteForm.tsx
│   │   ├── ThreatMonitor.tsx
│   │   ├── ActionPanel.tsx
│   │   ├── SpaceWeatherPanel.tsx
│   │   └── SatelliteVisualization.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useSpaceWeather.ts
│   ├── services/       # API services
│   │   └── conjunctionDataService.ts
│   ├── store/          # State management
│   │   └── satelliteStore.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── orbitalCalculations.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
├── tailwind.config.js  # Tailwind CSS config
└── README.md          # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Quick Start Guide

Once the app is running:

1. **Add a Satellite**
   - Click the "+" button in the Satellites panel
   - Enter satellite name and parameters
   - Click "Add Satellite"

2. **Monitor Threats**
   - Threats will automatically appear in the Threat Monitor
   - Color codes indicate severity

3. **Take Action**
   - Select a threat
   - Review suggested actions
   - Click "Execute" to implement

4. **View 3D Visualization**
   - Toggle to "3D Visualization" mode
   - Use mouse to interact with the view

## Need Help?

- Check the main README.md for detailed documentation
- Review example orbital parameters in README.md
- Make sure all dependencies are installed correctly

## Production Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```






