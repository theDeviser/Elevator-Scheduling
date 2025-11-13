import React from 'react';
import styles from './ElevatorShaft.module.css';

/**
 * ElevatorShaft Component - Displays an elevator shaft
 * V2: Shows OUT_OF_ORDER status and accessible floors
 */
const ElevatorShaft = ({ elevator }) => {
  // Calculate elevator position (floor 0 is at the bottom)
  const position = (9 - elevator.currentFloor) * 10; // in percentage

  // V2: Check if elevator is operational
  const isOperational = elevator.status === 'OPERATIONAL';

  return (
    <div className={styles.shaftContainer}>
      <div className={styles.header}>
        <h3>Elevator {elevator.id}</h3>
        {/* V2: Status indicator */}
        <span className={`${styles.statusBadge} ${isOperational ? styles.operational : styles.outOfOrder}`}>
          {elevator.status}
        </span>
      </div>

      <div className={styles.shaft}>
        {/* Floor markers */}
        <div className={styles.floorMarkers}>
          {Array.from({ length: 10 }, (_, i) => 9 - i).map(floor => {
            // V2: Check if floor is accessible
            const isAccessible = elevator.accessibleFloors.includes(floor);
            return (
              <div key={floor} className={styles.floorMarker}>
                <span className={`${styles.floorNum} ${!isAccessible ? styles.restricted : ''}`}>
                  F{floor}
                  {!isAccessible && <span className={styles.lockIcon}>🔒</span>}
                </span>
                <div className={styles.floorLine}></div>
              </div>
            );
          })}
        </div>

        {/* Elevator car */}
        <div
          className={`${styles.elevatorCar} ${styles[elevator.state.toLowerCase()]} ${!isOperational ? styles.outOfOrderCar : ''}`}
          style={{ top: `${position}%` }}
        >
          <div className={styles.carInner}>
            <div className={styles.carFloor}>F{elevator.currentFloor}</div>
            <div className={styles.carDirection}>
              {isOperational ? (
                <>
                  {elevator.direction === 'UP' && '↑'}
                  {elevator.direction === 'DOWN' && '↓'}
                  {elevator.direction === 'IDLE' && '●'}
                </>
              ) : (
                <span className={styles.outOfOrderIcon}>✗</span>
              )}
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
            {isOperational ? elevator.state : 'OUT_OF_ORDER'}
          </span>
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Direction:</span>
          <span className={styles.statusValue}>
            {isOperational ? elevator.direction : 'N/A'}
          </span>
        </div>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Targets:</span>
          <span className={styles.statusValue}>
            {isOperational && elevator.internalQueue.length > 0 
              ? elevator.internalQueue.sort((a, b) => a - b).join(', ')
              : 'None'}
          </span>
        </div>
        {/* V2: Accessible Floors */}
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Access:</span>
          <span className={`${styles.statusValue} ${styles.accessInfo}`}>
            {elevator.accessibleFloors.length === 10 
              ? 'All Floors'
              : `F${elevator.accessibleFloors.sort((a, b) => a - b).join(', ')}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ElevatorShaft;
