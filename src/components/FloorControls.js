import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './FloorControls.module.css';

/**
 * FloorControls Component - For floor buttons (Up/Down)
 */
const FloorControls = () => {
  const { state, addFloorRequest } = useElevator();

  // Check if floor request is pending
  const isRequestPending = (floor, direction) => {
    return state.floorRequestQueue.some(
      req => req.floor === floor && req.direction === direction
    );
  };

  const handleFloorRequest = (floor, direction) => {
    addFloorRequest(floor, direction);
  };

  // Show floors in reverse order (9 to 0)
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  return (
    <div className={styles.floorControls}>
      <div className={styles.header}>
        <h3>Floor Controls</h3>
        <p>Call elevator from outside</p>
      </div>
      
      <div className={styles.floorsContainer}>
        {floors.map(floor => (
          <div key={floor} className={styles.floorRow}>
            <div className={styles.floorLabel}>F{floor}</div>
            
            <div className={styles.buttons}>
              {floor < 9 && (
                <button
                  className={`${styles.btn} ${styles.btnUp} ${
                    isRequestPending(floor, 'UP') ? styles.active : ''
                  }`}
                  onClick={() => handleFloorRequest(floor, 'UP')}
                  disabled={isRequestPending(floor, 'UP')}
                >
                  ▲
                </button>
              )}
              
              {floor > 0 && (
                <button
                  className={`${styles.btn} ${styles.btnDown} ${
                    isRequestPending(floor, 'DOWN') ? styles.active : ''
                  }`}
                  onClick={() => handleFloorRequest(floor, 'DOWN')}
                  disabled={isRequestPending(floor, 'DOWN')}
                >
                  ▼
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorControls;

