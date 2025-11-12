# 🚀 Quick Start Guide

## First Time Setup

### Step 1: Install Dependencies
```bash
npm install
```

This command will install all required packages:
- React and React DOM
- React Router DOM
- React Scripts (for development server)

### Step 2: Start Development Server
```bash
npm start
```

This command will:
- Start the development server on port 3000
- Automatically open the application in your browser
- Enable hot reload (code changes will automatically reflect)

### Step 3: Use the Application

#### Dashboard (Main Page)
1. Click the **Start** button to begin the simulation
2. Use **Floor Controls** on the left to call elevators (UP/DOWN buttons)
3. Use **Interior Controls** on the right to select destination floors
4. Watch real-time elevator movement in the center

#### Logs Page
- Click **Logs** in the sidebar
- View detailed list of all system events

#### Simulation Page
- Click **Simulation** in the sidebar
- Run one of the pre-defined scenarios:
  - **Morning Rush**: Many people going up from ground floor
  - **Evening Rush**: People coming down from upper floors
  - **Balanced Load**: Mixed random requests
  - **Stress Test**: Maximum load test

## Common Commands

### Development
```bash
npm start          # Start development server
npm test           # Run tests (if any)
npm run build      # Create production build
```

### Troubleshooting

#### Port 3000 already in use
If port 3000 is already in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on a different port
set PORT=3001 && npm start
```

#### Node modules error
If you encounter any module errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Tips and Tricks

### 1. Changing Simulation Speed
In `src/context/ElevatorContext.js` at line 24:
```javascript
intervalRef.current = setInterval(() => {
  systemRef.current.systemStep();
  updateState();
}, 1000); // Change 1000ms here (lower = faster, higher = slower)
```

### 2. Changing Number of Floors
This is hardcoded in V1 (0-9 floors). Will be configurable in V2.

### 3. Changing Number of Elevators
In `src/core/ElevatorSystem.js` constructor:
```javascript
this.elevators = [
  new Elevator(0),
  new Elevator(1),
  new Elevator(2),
  new Elevator(3)
  // Add more elevators here
];
```

### 4. Changing Door Open Time
In `src/core/Elevator.js` at line 89:
```javascript
this.doorTimer = setTimeout(() => {
  this.closeDoors(onLog);
}, 2000); // Change 2000ms here
```

## Project Structure Overview

```
src/
├── core/              # Business logic (Pure JS classes)
│   ├── Elevator.js
│   └── ElevatorSystem.js
├── context/           # React Context (State management)
│   └── ElevatorContext.js
├── components/        # Reusable UI components
│   ├── Sidebar.js
│   ├── FloorControls.js
│   ├── ElevatorShaft.js
│   └── InteriorControls.js
├── pages/             # Page components
│   ├── DashboardPage.js
│   ├── LogsPage.js
│   └── SimulationPage.js
└── App.js             # Main app with routing
```

## Next Steps

1. ✅ Run the application and explore
2. ✅ Try different scenarios
3. ✅ View logs and understand the algorithm
4. ✅ Read the code and understand it
5. ✅ Make your own modifications (optional)

## Help and Support

- **README.md**: Detailed documentation
- **CONTRIBUTING.md**: Development guide
- **Code Comments**: All files have English comments

---

**Happy Learning! 🎓**
