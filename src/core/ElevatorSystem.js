import Elevator from './Elevator';

/**
 * ElevatorSystem Class - Manages all elevators
 * Implementation of LOOK Algorithm
 */
class ElevatorSystem {
  constructor() {
    this.elevators = [
      new Elevator(0),
      new Elevator(1),
      new Elevator(2),
      new Elevator(3)
    ];
    this.floorRequestQueue = []; // { floor, direction }
    this.logs = [];
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
   * Adds a floor request (from floor button)
   */
  addFloorRequest(floorNum, direction) {
    // Check for duplicate requests
    const exists = this.floorRequestQueue.some(
      req => req.floor === floorNum && req.direction === direction
    );
    
    if (!exists) {
      this.floorRequestQueue.push({ floor: floorNum, direction });
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
   * LOOK Algorithm - Chooses best elevator for a request
   */
  dispatch() {
    if (this.floorRequestQueue.length === 0) return;

    const request = this.floorRequestQueue[0];
    const bestElevator = this.findBestElevator(request);

    if (bestElevator) {
      // Assign request
      bestElevator.addInternalRequest(request.floor);
      this.floorRequestQueue.shift(); // Remove from queue
      this.addLog(`Dispatcher assigning Elevator ${bestElevator.id} to request at F${request.floor}`);
      
      // If more requests exist, dispatch recursively
      if (this.floorRequestQueue.length > 0) {
        this.dispatch();
      }
    }
  }

  /**
   * Finds the best elevator for a request (LOOK Algorithm)
   */
  findBestElevator(request) {
    let bestElevator = null;
    let bestScore = Infinity;

    for (const elevator of this.elevators) {
      const score = this.calculateScore(elevator, request);
      if (score < bestScore) {
        bestScore = score;
        bestElevator = elevator;
      }
    }

    return bestElevator;
  }

  /**
   * Calculates score for an elevator
   * Lower score = better choice
   */
  calculateScore(elevator, request) {
    const distance = Math.abs(elevator.currentFloor - request.floor);

    // IDLE elevator - best option
    if (elevator.state === 'IDLE') {
      return distance;
    }

    // MOVING elevator - check if moving in same direction
    if (elevator.state === 'MOVING') {
      const isMovingTowardsRequest = 
        (elevator.direction === 'UP' && request.floor > elevator.currentFloor) ||
        (elevator.direction === 'DOWN' && request.floor < elevator.currentFloor);

      const isSameDirection = elevator.direction === request.direction;

      if (isMovingTowardsRequest && isSameDirection) {
        // Moving in same direction and on the way - good choice
        return distance;
      } else if (isMovingTowardsRequest) {
        // On the way but different direction - okay choice
        return distance + 10;
      } else {
        // Moving in opposite direction - poor choice
        return distance + 50;
      }
    }

    // DOORS_OPEN - small penalty
    if (elevator.state === 'DOORS_OPEN') {
      return distance + 5;
    }

    return distance;
  }

  /**
   * Main simulation step - calls step() for each elevator
   */
  systemStep() {
    for (const elevator of this.elevators) {
      elevator.step((msg) => this.addLog(msg));
    }

    // Dispatch pending requests
    if (this.floorRequestQueue.length > 0) {
      this.dispatch();
    }
  }

  /**
   * Resets the entire system
   */
  reset() {
    for (const elevator of this.elevators) {
      elevator.reset();
    }
    this.floorRequestQueue = [];
    this.logs = [];
    this.addLog('System reset complete');
  }

  /**
   * Serializes current state (for React state)
   */
  getState() {
    return {
      elevators: this.elevators.map(e => ({
        id: e.id,
        currentFloor: e.currentFloor,
        direction: e.direction,
        state: e.state,
        internalQueue: Array.from(e.internalQueue)
      })),
      floorRequestQueue: [...this.floorRequestQueue],
      logs: [...this.logs]
    };
  }
}

export default ElevatorSystem;

