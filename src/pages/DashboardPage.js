import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import FloorControls from '../components/FloorControls';
import ElevatorShaft from '../components/ElevatorShaft';
import InteriorControls from '../components/InteriorControls';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage - Main simulator UI
 */
const DashboardPage = () => {
  const { state, isRunning, startSimulation, pauseSimulation, resetSimulation } = useElevator();

  return (
    <div className={styles.dashboard}>
      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <h1>Elevator Simulator Dashboard</h1>
        <div className={styles.controls}>
          {!isRunning ? (
            <button className={`${styles.btn} ${styles.btnStart}`} onClick={startSimulation}>
              ▶️ Start
            </button>
          ) : (
            <button className={`${styles.btn} ${styles.btnPause}`} onClick={pauseSimulation}>
              ⏸️ Pause
            </button>
          )}
          <button className={`${styles.btn} ${styles.btnReset}`} onClick={resetSimulation}>
            🔄 Reset
          </button>
          <div className={styles.statusIndicator}>
            <span className={`${styles.indicator} ${isRunning ? styles.running : ''}`}></span>
            <span>{isRunning ? 'Running' : 'Paused'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.mainGrid}>
        {/* Floor Controls */}
        <div className={styles.floorControlsSection}>
          <FloorControls />
        </div>

        {/* Elevator Shafts */}
        {state.elevators.map(elevator => (
          <div key={elevator.id} className={styles.elevatorSection}>
            <ElevatorShaft elevator={elevator} />
          </div>
        ))}

        {/* Interior Controls */}
        <div className={styles.interiorControlsSection}>
          <InteriorControls />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

