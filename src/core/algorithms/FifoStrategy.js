import AlgorithmStrategy from './AlgorithmStrategy';

/**
 * FifoStrategy - First-In, First-Out algorithm
 * Simply assigns to the first available IDLE elevator regardless of position
 */
class FifoStrategy extends AlgorithmStrategy {
  /**
   * Finds the first IDLE operational elevator that can access the floor
   */
  findBestElevator(elevators, floorRequestQueue, request) {
    for (const elevator of elevators) {
      // Check if elevator is suitable (operational and can access floor)
      if (!this.isElevatorSuitable(elevator, request.floor)) {
        continue;
      }

      // FIFO: Take the first IDLE elevator
      if (elevator.state === 'IDLE') {
        return elevator.id;
      }
    }

    // If no IDLE elevator, try to find any operational one that can access the floor
    for (const elevator of elevators) {
      if (this.isElevatorSuitable(elevator, request.floor)) {
        return elevator.id;
      }
    }

    return null;
  }
}

export default FifoStrategy;

