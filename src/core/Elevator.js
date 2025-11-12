/**
 * Elevator Class - Represents a single elevator car
 */
class Elevator {
  constructor(id) {
    this.id = id;
    this.currentFloor = 0;
    this.direction = 'IDLE'; // 'UP', 'DOWN', or 'IDLE'
    this.state = 'IDLE'; // 'IDLE', 'MOVING', 'DOORS_OPEN'
    this.internalQueue = new Set(); // Target floors
    this.doorTimer = null;
  }

  /**
   * Adds an internal request (button press from inside the elevator)
   */
  addInternalRequest(floorNum) {
    if (floorNum >= 0 && floorNum <= 9 && floorNum !== this.currentFloor) {
      this.internalQueue.add(floorNum);
    }
  }

  /**
   * Gets the next target floor based on current direction
   */
  getNextTarget() {
    if (this.internalQueue.size === 0) return null;

    const targets = Array.from(this.internalQueue).sort((a, b) => a - b);

    if (this.direction === 'UP') {
      // Priority to floors above current floor
      const upTargets = targets.filter(f => f > this.currentFloor);
      if (upTargets.length > 0) return upTargets[0];
      // If no floors above, go down
      return targets[targets.length - 1];
    } else if (this.direction === 'DOWN') {
      // Priority to floors below current floor
      const downTargets = targets.filter(f => f < this.currentFloor).reverse();
      if (downTargets.length > 0) return downTargets[0];
      // If no floors below, go up
      return targets[0];
    } else {
      // IDLE - choose nearest floor
      return targets.reduce((closest, floor) => {
        return Math.abs(floor - this.currentFloor) < Math.abs(closest - this.currentFloor)
          ? floor
          : closest;
      });
    }
  }

  /**
   * Main logic tick - called every second
   */
  step(onLog) {
    if (this.state === 'DOORS_OPEN') {
      // Doors are open, timer is running
      return;
    }

    if (this.state === 'IDLE') {
      // Check if there's a target
      const nextTarget = this.getNextTarget();
      if (nextTarget !== null) {
        // Set direction and start moving
        if (nextTarget > this.currentFloor) {
          this.direction = 'UP';
        } else if (nextTarget < this.currentFloor) {
          this.direction = 'DOWN';
        }
        this.state = 'MOVING';
        onLog?.(`Elevator ${this.id} starting to move ${this.direction} from F${this.currentFloor} to F${nextTarget}`);
      }
    }

    if (this.state === 'MOVING') {
      // Move one floor
      if (this.direction === 'UP') {
        this.currentFloor++;
      } else if (this.direction === 'DOWN') {
        this.currentFloor--;
      }

      onLog?.(`Elevator ${this.id} moving to F${this.currentFloor}`);

      // Check if we've reached a target floor
      if (this.internalQueue.has(this.currentFloor)) {
        this.arrive(onLog);
      } else if (this.internalQueue.size === 0) {
        // No more targets
        this.state = 'IDLE';
        this.direction = 'IDLE';
      }
    }
  }

  /**
   * Called when elevator arrives at a target floor
   */
  arrive(onLog) {
    this.state = 'DOORS_OPEN';
    this.internalQueue.delete(this.currentFloor);
    onLog?.(`Elevator ${this.id} arrived at F${this.currentFloor}. Doors opening...`);

    // Doors will close in 2 seconds
    this.doorTimer = setTimeout(() => {
      this.closeDoors(onLog);
    }, 2000);
  }

  /**
   * Closes doors and checks for next target
   */
  closeDoors(onLog) {
    onLog?.(`Elevator ${this.id} doors closing at F${this.currentFloor}`);
    this.doorTimer = null;

    const nextTarget = this.getNextTarget();
    if (nextTarget !== null) {
      // Still have targets remaining
      if (nextTarget > this.currentFloor) {
        this.direction = 'UP';
      } else if (nextTarget < this.currentFloor) {
        this.direction = 'DOWN';
      }
      this.state = 'MOVING';
    } else {
      // No more targets
      this.state = 'IDLE';
      this.direction = 'IDLE';
    }
  }

  /**
   * Resets the elevator to initial state
   */
  reset() {
    if (this.doorTimer) {
      clearTimeout(this.doorTimer);
      this.doorTimer = null;
    }
    this.currentFloor = 0;
    this.direction = 'IDLE';
    this.state = 'IDLE';
    this.internalQueue.clear();
  }
}

export default Elevator;
