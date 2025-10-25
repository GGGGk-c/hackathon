# ⚡ Quick Start - 5 Minutes to Launch

## Step 1: Install Dependencies (2 minutes)

Open a terminal in the project directory and run:

```bash
npm install
```

## Step 2: Start the App (1 minute)

```bash
npm run dev
```

The app will automatically open in your browser at http://localhost:3000

## Step 3: Add Your First Satellite (1 minute)

1. Click the **"+"** button in the Satellites panel (top left)
2. Enter a name: `ISS-Demo`
3. Use these **Low Earth Orbit** parameters:
   - Mass: `420000` kg
   - Cross Section: `100` m²
   - Semi-Major Axis: `6800` km
   - Eccentricity: `0.001`
   - Inclination: `51.6`°
   - RAAN: `0`°
   - Arg. Peri.: `0`°
   - True Anom.: `0`°
4. Click **"Add Satellite"**

## Step 4: Watch for Threats (30 seconds)

Wait a few seconds and you'll see:
- ✅ Your satellite appears in the list
- 🎯 3D orbit visualization in the viewer
- ⚠️ Automatic threat detection starts
- 🌟 Space weather monitoring updates

## Step 5: Take Action (30 seconds)

When a threat appears:
1. View details in **Threat Monitor** panel
2. Select the threat in **Decision & Action Panel**
3. Review suggested actions with metrics
4. Click **"Execute"** on your preferred action

## 🎉 You're Ready!

### Try These Next:

**Add a GPS Satellite:**
- Semi-Major Axis: `26560` km
- Inclination: `55`°
- (Keep other params as default)

**Add a Geostationary Satellite:**
- Semi-Major Axis: `42164` km
- Inclination: `0`°
- Eccentricity: `0.0001`

**Explore 3D View:**
- Toggle to "3D Visualization" mode
- Drag to rotate, scroll to zoom
- Watch your satellites orbit Earth

**Monitor Multiple Satellites:**
- Add 3-5 satellites at different altitudes
- Watch for conjunction threats between them
- Manage actions for multiple threats

## 🆘 Having Issues?

### App won't start?
```bash
# Clear and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use?
Edit `vite.config.ts` and change port to `3001`

### Need help with orbital parameters?
Check the main `README.md` for detailed parameter explanations!

---

**Enjoy your satellite collision avoidance system! 🛰️**

