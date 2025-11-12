import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './InteriorControls.module.css';

/**
 * InteriorControls Component - Buttons inside the elevator
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
            </div>
            
            <div className={styles.buttonGrid}>
              {Array.from({ length: 10 }, (_, i) => 9 - i).map(floor => (
                <button
                  key={floor}
                  className={`${styles.floorBtn} ${
                    isTargetFloor(elevator.id, floor) ? styles.active : ''
                  } ${
                    isCurrentFloor(elevator.id, floor) ? styles.current : ''
                  }`}
                  onClick={() => handleButtonClick(elevator.id, floor)}
                  disabled={isCurrentFloor(elevator.id, floor)}
                >
                  {floor}
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

