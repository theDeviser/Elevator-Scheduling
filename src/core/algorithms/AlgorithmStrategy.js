/**
 * AlgorithmStrategy - Base class for elevator scheduling algorithms
 * All concrete strategies must implement the findBestElevator method
 */
class AlgorithmStrategy {
  /**
   * Finds the best elevator for a given request
   * @param {Array} elevators - Array of Elevator instances
   * @param {Array} floorRequestQueue - Current queue of floor requests
   * @param {Object} request - The request object { floor, direction }
   * @returns {number|null} - Elevator ID or null if none suitable
   */
  findBestElevator(elevators, floorRequestQueue, request) {
    throw new Error('findBestElevator must be implemented by concrete strategy');
  }

  /**
   * Checks if an elevator is suitable for assignment
   * @param {Object} elevator - Elevator instance
   * @param {number} floor - Target floor
   * @returns {boolean}
   */
  isElevatorSuitable(elevator, floor) {
    // Check if elevator is operational
    if (elevator.status !== 'OPERATIONAL') {
      return false;
    }

    // Check if elevator can access this floor
    if (!elevator.accessibleFloors.has(floor)) {
      return false;
    }

    return true;
  }
}

export default AlgorithmStrategy;

