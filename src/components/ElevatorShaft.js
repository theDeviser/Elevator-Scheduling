import React from 'react';
import styles from './ElevatorShaft.module.css';

/**
 * ElevatorShaft Component - Displays an elevator shaft
 */
const ElevatorShaft = ({ elevator }) => {
  // Calculate elevator position (floor 0 is at the bottom)
  const position = (9 - elevator.currentFloor) * 10; // in percentage

  return (
    <div className={styles.shaftContainer}>
      <div className={styles.header}>
        <h3>Elevator {elevator.id}</h3>
      </div>

      <div className={styles.shaft}>
        {/* Floor markers */}
        <div className={styles.floorMarkers}>
          {Array.from({ length: 10 }, (_, i) => 9 - i).map(floor => (
            <div key={floor} className={styles.floorMarker}>
              <span className={styles.floorNum}>F{floor}</span>
              <div className={styles.floorLine}></div>
            </div>
          ))}
        </div>

        {/* Elevator car */}
        <div
          className={`${styles.elevatorCar} ${styles[elevator.state.toLowerCase()]}`}
          style={{ top: `${position}%` }}
        >
          <div className={styles.carInner}>
            <div className={styles.carFloor}>F{elevator.currentFloor}</div>
            <div className={styles.carDirection}>
              {elevator.direction === 'UP' && '↑'}
              {elevator.direction === 'DOWN' && '↓'}
              {elevator.direction === 'IDLE' && '●'}
            </div>
          </div>
        </div>
      </div>

      {/* Elevator status */}
      <div className={styles.status}>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Floor:</span>
          <span className={styles.statusValue}>F{elevator.currentFloor}</span>
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>State:</span>
          <span className={`${styles.statusValue} ${styles[elevator.state.toLowerCase()]}`}>
            {elevator.state}
          </span>
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Direction:</span>
          <span className={styles.statusValue}>{elevator.direction}</span>
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Targets:</span>
          <span className={styles.statusValue}>
            {elevator.internalQueue.length > 0 
              ? elevator.internalQueue.sort((a, b) => a - b).join(', ')
              : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ElevatorShaft;

