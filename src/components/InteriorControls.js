import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './InteriorControls.module.css';

/**
 * InteriorControls Component - Buttons inside the elevator
 * V2: Respects elevator status and accessible floors
 */
const InteriorControls = () => {
  const { state, addInternalRequest } = useElevator();

  const handleButtonClick = (elevatorId, floor) => {
    addInternalRequest(elevatorId, floor);
  };

  // Check if floor is already a target
  const isTargetFloor = (elevatorId, floor) => {
    return state.elevators[elevatorId]?.internalQueue.includes(floor);
  };

  // Check if elevator is on current floor
  const isCurrentFloor = (elevatorId, floor) => {
    return state.elevators[elevatorId]?.currentFloor === floor;
  };

  // V2: Check if floor is accessible
  const isFloorAccessible = (elevatorId, floor) => {
    return state.elevators[elevatorId]?.accessibleFloors.includes(floor);
  };

  // V2: Check if elevator is operational
  const isElevatorOperational = (elevatorId) => {
    return state.elevators[elevatorId]?.status === 'OPERATIONAL';
  };

  return (
    <div className={styles.interiorControls}>
      <div className={styles.header}>
        <h3>Interior Controls</h3>
        <p>Select floor from inside elevator</p>
      </div>

      <div className={styles.elevatorPanels}>
        {state.elevators.map(elevator => (
          <div key={elevator.id} className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>Elevator {elevator.id}</span>
              <span className={styles.currentFloor}>Current: F{elevator.currentFloor}</span>
              {/* V2: Status indicator */}
              <span className={`${styles.statusBadge} ${elevator.status === 'OPERATIONAL' ? styles.operational : styles.outOfOrder}`}>
                {elevator.status === 'OPERATIONAL' ? '✓' : '✗'}
              </span>
            </div>
            
            {/* V2: Out of Order Overlay */}
            {!isElevatorOperational(elevator.id) && (
              <div className={styles.outOfOrderOverlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayIcon}>⚠️</span>
                  <span className={styles.overlayText}>OUT OF ORDER</span>
                </div>
              </div>
            )}
            
            <div className={`${styles.buttonGrid} ${!isElevatorOperational(elevator.id) ? styles.disabled : ''}`}>
              {Array.from({ length: 10 }, (_, i) => 9 - i).map(floor => (
                <button
                  key={floor}
                  className={`${styles.floorBtn} ${
                    isTargetFloor(elevator.id, floor) ? styles.active : ''
                  } ${
                    isCurrentFloor(elevator.id, floor) ? styles.current : ''
                  } ${
                    !isFloorAccessible(elevator.id, floor) ? styles.restricted : ''
                  }`}
                  onClick={() => handleButtonClick(elevator.id, floor)}
                  disabled={
                    isCurrentFloor(elevator.id, floor) ||
                    !isElevatorOperational(elevator.id) ||
                    !isFloorAccessible(elevator.id, floor)
                  }
                  title={
                    !isFloorAccessible(elevator.id, floor)
                      ? `Floor ${floor} not accessible by this elevator`
                      : ''
                  }
                >
                  {floor}
                  {/* V2: Restricted indicator */}
                  {!isFloorAccessible(elevator.id, floor) && (
                    <span className={styles.restrictedIcon}>🚫</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorControls;
