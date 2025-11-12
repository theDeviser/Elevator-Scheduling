# Contributing Guide

## Development Workflow

### Setup
```bash
npm install
npm start
```

### Code Structure

#### Adding New Components
Create all new components in `src/components/` and also create a corresponding `.module.css` file.

#### Modifying Core Logic
The `src/core/` directory contains the Elevator and ElevatorSystem classes. Make algorithm changes here.

#### Adding New Pages
Create new pages in `src/pages/` and add routes in `App.js`.

## Testing Checklist

### Manual Testing

1. **Basic Flow**:
   - [ ] Start button works
   - [ ] Pause button works
   - [ ] Reset button resets everything

2. **Floor Controls**:
   - [ ] UP buttons add requests
   - [ ] DOWN buttons add requests
   - [ ] Active state is displayed

3. **Interior Controls**:
   - [ ] Buttons work for each elevator
   - [ ] Current floor is disabled
   - [ ] Target floors are highlighted

4. **Elevator Movement**:
   - [ ] Elevators move smoothly
   - [ ] Direction indicators show correctly
   - [ ] State changes (IDLE, MOVING, DOORS_OPEN) are correct

5. **Logs**:
   - [ ] All events are logged
   - [ ] Auto-scroll works
   - [ ] Log count is correct

6. **Scenarios**:
   - [ ] Morning Rush executes correctly
   - [ ] Evening Rush executes correctly
   - [ ] Balanced Load generates randomly
   - [ ] Stress Test activates all floors

## Code Style

- Use functional components
- Use React Hooks (useState, useEffect, etc.)
- Use CSS Modules for styling
- Follow naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

## Algorithm Improvements

If you want to make improvements to the LOOK algorithm:

1. Modify the `findBestElevator()` method in `src/core/ElevatorSystem.js`
2. Change the scoring logic in `calculateScore()`
3. Verify with testing scenarios

## Performance Optimization

- Simulation speed: Change interval time in `src/context/ElevatorContext.js`
- Door timer: Change setTimeout in `arrive()` method in `src/core/Elevator.js`

## Questions?

For questions about project structure or implementation, see README.md.
