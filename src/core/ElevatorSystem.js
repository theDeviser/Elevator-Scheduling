import Elevator from './Elevator';
import LookStrategy from './algorithms/LookStrategy';
import FifoStrategy from './algorithms/FifoStrategy';

/**
 * ElevatorSystem Class - Manages all elevators
 * V2: Supports swappable algorithms and metrics tracking
 */
class ElevatorSystem {
  constructor() {
    this.elevators = [
      new Elevator(0),
      new Elevator(1),
      new Elevator(2),
      new Elevator(3)
    ];
    this.floorRequestQueue = []; // { floor, direction, jobId }
    this.logs = [];
    
    // V2: Algorithm strategy
    this.currentAlgorithm = new LookStrategy(); // Default algorithm
    
    // V2: Metrics tracking
    this.metrics = {
      jobsCreated: 0,
      jobsCompleted: 0,
      totalWaitTime: 0,
      totalRideTime: 0
    };
    
    // V2: Pending jobs tracking
    this.pendingJobs = new Map(); // jobId -> { requestTime, rideStartTime, floor, direction }
  }

  /**
   * Adds a log entry with timestamp
   */
  addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  /**
   * V2: Sets the scheduling algorithm
   * @param {string} algorithmName - 'LOOK' or 'FIFO'
   */
  setAlgorithm(algorithmName) {
    if (algorithmName === 'LOOK') {
      this.currentAlgorithm = new LookStrategy();
      this.addLog(`Algorithm changed to LOOK`);
    } else if (algorithmName === 'FIFO') {
      this.currentAlgorithm = new FifoStrategy();
      this.addLog(`Algorithm changed to FIFO`);
    } else {
      console.warn(`Unknown algorithm: ${algorithmName}`);
    }
  }

  /**
   * V2: Sets an elevator's operational status
   * @param {number} elevatorId - Elevator ID (0-3)
   * @param {string} status - 'OPERATIONAL' or 'OUT_OF_ORDER'
   */
  setElevatorStatus(elevatorId, status) {
    if (elevatorId >= 0 && elevatorId < 4) {
      this.elevators[elevatorId].status = status;
      this.addLog(`Elevator ${elevatorId} status changed to ${status}`);
    }
  }

  /**
   * V2: Sets which floors an elevator can access
   * @param {number} elevatorId - Elevator ID (0-3)
   * @param {Array} floorArray - Array of accessible floor numbers
   */
  setElevatorZoning(elevatorId, floorArray) {
    if (elevatorId >= 0 && elevatorId < 4) {
      this.elevators[elevatorId].accessibleFloors = new Set(floorArray);
      this.addLog(`Elevator ${elevatorId} zoning set to floors: ${floorArray.join(', ')}`);
    }
  }

  /**
   * V2: Applies a zoning preset to multiple elevators
   * @param {string} presetName - 'HIGH_LOW' or 'DEFAULT'
   */
  setZoningPreset(presetName) {
    if (presetName === 'HIGH_LOW') {
      // Elevators 0 & 1: Low floors (0-5)
      this.setElevatorZoning(0, [0, 1, 2, 3, 4, 5]);
      this.setElevatorZoning(1, [0, 1, 2, 3, 4, 5]);
      // Elevators 2 & 3: High floors (0, 6-9) - include 0 for ground access
      this.setElevatorZoning(2, [0, 6, 7, 8, 9]);
      this.setElevatorZoning(3, [0, 6, 7, 8, 9]);
      this.addLog('Applied HIGH_LOW zoning preset');
    } else if (presetName === 'DEFAULT') {
      // Reset all elevators to access all floors
      for (let i = 0; i < 4; i++) {
        this.setElevatorZoning(i, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }
      this.addLog('Reset all zoning to DEFAULT');
    }
  }

  /**
   * Adds a floor request (from floor button)
   * V2: Generates job ID and tracks metrics
   */
  addFloorRequest(floorNum, direction) {
    // Check for duplicate requests
    const exists = this.floorRequestQueue.some(
      req => req.floor === floorNum && req.direction === direction
    );
    
    if (!exists) {
      // V2: Generate unique job ID
      const jobId = `floor-${floorNum}-dir-${direction}-${Date.now()}`;
      
      // V2: Track job creation
      this.pendingJobs.set(jobId, {
        requestTime: Date.now(),
        rideStartTime: null,
        floor: floorNum,
        direction: direction
      });
      
      this.floorRequestQueue.push({ floor: floorNum, direction, jobId });
      this.metrics.jobsCreated++;
      
      this.addLog(`Floor request at F${floorNum} (Direction: ${direction})`);
      this.dispatch();
    }
  }

  /**
   * Adds an internal request (from inside elevator)
   */
  addInternalRequest(elevatorId, floorNum) {
    if (elevatorId >= 0 && elevatorId < 4) {
      this.elevators[elevatorId].addInternalRequest(floorNum);
      this.addLog(`Elevator ${elevatorId} interior request for F${floorNum}`);
    }
  }

  /**
   * V2: Dispatches requests using the current algorithm strategy
   */
  dispatch() {
    if (this.floorRequestQueue.length === 0) return;

    const request = this.floorRequestQueue[0];
    
    // V2: Use the current algorithm strategy
    const bestElevatorId = this.currentAlgorithm.findBestElevator(
      this.elevators,
      this.floorRequestQueue,
      request
    );

    if (bestElevatorId !== null) {
      const bestElevator = this.elevators[bestElevatorId];
      
      // Assign request to elevator
      bestElevator.addInternalRequest(request.floor);
      
      // V2: Update job tracking - elevator is now heading to pick up
      const job = this.pendingJobs.get(request.jobId);
      if (job) {
        job.assignedElevator = bestElevatorId;
        job.assignedTime = Date.now();
      }
      
      this.floorRequestQueue.shift(); // Remove from queue
      this.addLog(`Dispatcher assigning Elevator ${bestElevatorId} to request at F${request.floor}`);
      
      // If more requests exist, dispatch recursively
      if (this.floorRequestQueue.length > 0) {
        this.dispatch();
      }
    }
  }

  /**
   * V2: Records when elevator picks up a passenger (arrives at requested floor)
   * @param {number} elevatorId
   * @param {number} floor
   */
  recordPickup(elevatorId, floor) {
    // Find matching job
    for (const [jobId, job] of this.pendingJobs.entries()) {
      if (job.floor === floor && job.assignedElevator === elevatorId && !job.rideStartTime) {
        // Calculate wait time
        const waitTime = Date.now() - job.requestTime;
        this.metrics.totalWaitTime += waitTime;
        
        // Mark ride start
        job.rideStartTime = Date.now();
        
        this.addLog(`Elevator ${elevatorId} picked up passenger at F${floor} (Wait: ${(waitTime / 1000).toFixed(1)}s)`);
        break;
      }
    }
  }

  /**
   * V2: Records when elevator drops off a passenger (completes internal request)
   * @param {number} elevatorId
   * @param {number} floor
   */
  recordDropoff(elevatorId, floor) {
    // Find matching job
    for (const [jobId, job] of this.pendingJobs.entries()) {
      if (job.assignedElevator === elevatorId && job.rideStartTime) {
        // Calculate ride time
        const rideTime = Date.now() - job.rideStartTime;
        this.metrics.totalRideTime += rideTime;
        this.metrics.jobsCompleted++;
        
        // Remove completed job
        this.pendingJobs.delete(jobId);
        
        this.addLog(`Elevator ${elevatorId} dropped off passenger at F${floor} (Ride: ${(rideTime / 1000).toFixed(1)}s)`);
        break;
      }
    }
  }

  /**
   * Main simulation step - calls step() for each elevator
   * V2: Enhanced with pickup/dropoff tracking
   */
  systemStep() {
    for (const elevator of this.elevators) {
      // Track previous state
      const wasMoving = elevator.state === 'MOVING';
      const prevFloor = elevator.currentFloor;
      
      elevator.step((msg) => this.addLog(msg));
      
      // V2: Detect arrival events for metrics
      if (wasMoving && elevator.state === 'DOORS_OPEN') {
        // Elevator just arrived - record pickup or dropoff
        this.recordPickup(elevator.id, elevator.currentFloor);
      }
    }

    // Dispatch pending requests
    if (this.floorRequestQueue.length > 0) {
      this.dispatch();
    }
  }

  /**
   * V2: Validates current configuration
   * Returns an object with { valid: boolean, errors: [] }
   */
  validate() {
    const errors = [];
    
    // Check if there are any operational elevators
    const operationalElevators = this.elevators.filter(e => e.status === 'OPERATIONAL');
    if (operationalElevators.length === 0) {
      errors.push('No operational elevators available');
    }
    
    // Check if all floors are accessible by at least one operational elevator
    for (let floor = 0; floor <= 9; floor++) {
      const accessible = operationalElevators.some(e => e.accessibleFloors.has(floor));
      if (!accessible) {
        errors.push(`Floor ${floor} is inaccessible by all operational elevators`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Resets the entire system
   * V2: Also resets metrics and algorithm
   */
  reset() {
    for (const elevator of this.elevators) {
      elevator.reset();
    }
    this.floorRequestQueue = [];
    this.logs = [];
    
    // V2: Reset metrics
    this.metrics = {
      jobsCreated: 0,
      jobsCompleted: 0,
      totalWaitTime: 0,
      totalRideTime: 0
    };
    this.pendingJobs.clear();
    
    this.addLog('System reset complete');
  }

  /**
   * Serializes current state (for React state)
   * V2: Includes new properties
   */
  getState() {
    return {
      elevators: this.elevators.map(e => ({
        id: e.id,
        currentFloor: e.currentFloor,
        direction: e.direction,
        state: e.state,
        internalQueue: Array.from(e.internalQueue),
        status: e.status, // V2
        accessibleFloors: Array.from(e.accessibleFloors) // V2
      })),
      floorRequestQueue: [...this.floorRequestQueue],
      logs: [...this.logs],
      metrics: { ...this.metrics }, // V2
      currentAlgorithmName: this.currentAlgorithm.constructor.name.replace('Strategy', '') // V2
    };
  }
}

export default ElevatorSystem;

