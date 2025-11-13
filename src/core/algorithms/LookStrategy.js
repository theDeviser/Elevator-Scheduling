import AlgorithmStrategy from './AlgorithmStrategy';

/**
 * LookStrategy - Implementation of the LOOK algorithm
 * Moves in one direction until no more requests, then reverses
 */
class LookStrategy extends AlgorithmStrategy {
  /**
   * Finds the best elevator using LOOK algorithm scoring
   */
  findBestElevator(elevators, floorRequestQueue, request) {
    let bestElevator = null;
    let bestScore = Infinity;

    for (const elevator of elevators) {
      // Check if elevator is suitable (operational and can access floor)
      if (!this.isElevatorSuitable(elevator, request.floor)) {
        continue;
      }

      const score = this.calculateScore(elevator, request);
      if (score < bestScore) {
        bestScore = score;
        bestElevator = elevator;
      }
    }

    return bestElevator ? bestElevator.id : null;
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
}

export default LookStrategy;

