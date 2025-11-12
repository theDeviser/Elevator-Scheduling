import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './SimulationPage.module.css';

/**
 * SimulationPage - Pre-defined test scenarios
 */
const SimulationPage = () => {
  const { resetSimulation, addFloorRequest, startSimulation } = useElevator();

  /**
   * Scenario 1: Morning Rush
   * Everyone going up from ground floor in the morning
   */
  const runMorningRush = () => {
    resetSimulation();
    
    // 10 people want to go up from F0
    for (let i = 0; i < 10; i++) {
      setTimeout(() => addFloorRequest(0, 'UP'), i * 200);
    }
    
    // 5 people want to go up from F1
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addFloorRequest(1, 'UP'), 2000 + i * 200);
    }
    
    // 3 people want to go up from F2
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addFloorRequest(2, 'UP'), 3000 + i * 200);
    }
    
    setTimeout(startSimulation, 500);
  };

  /**
   * Scenario 2: Evening Rush
   * Everyone coming down from upper floors in the evening
   */
  const runEveningRush = () => {
    resetSimulation();
    
    // 5 people want to come down from F9
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addFloorRequest(9, 'DOWN'), i * 200);
    }
    
    // 5 people want to come down from F8
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addFloorRequest(8, 'DOWN'), 1000 + i * 200);
    }
    
    // 5 people want to come down from F7
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addFloorRequest(7, 'DOWN'), 2000 + i * 200);
    }
    
    setTimeout(startSimulation, 500);
  };

  /**
   * Scenario 3: Balanced Load
   * Random UP and DOWN requests
   */
  const runBalancedLoad = () => {
    resetSimulation();
    
    const requests = [];
    
    // Generate 20 random requests
    for (let i = 0; i < 20; i++) {
      const floor = Math.floor(Math.random() * 10);
      let direction;
      
      if (floor === 0) {
        direction = 'UP';
      } else if (floor === 9) {
        direction = 'DOWN';
      } else {
        direction = Math.random() > 0.5 ? 'UP' : 'DOWN';
      }
      
      requests.push({ floor, direction });
    }
    
    // Add requests over time
    requests.forEach((req, index) => {
      setTimeout(() => addFloorRequest(req.floor, req.direction), index * 300);
    });
    
    setTimeout(startSimulation, 500);
  };

  /**
   * Scenario 4: Stress Test
   * Many requests simultaneously
   */
  const runStressTest = () => {
    resetSimulation();
    
    // UP and DOWN requests from every floor
    for (let floor = 1; floor < 9; floor++) {
      setTimeout(() => {
        addFloorRequest(floor, 'UP');
        addFloorRequest(floor, 'DOWN');
      }, floor * 100);
    }
    
    // UP from F0 and DOWN from F9
    setTimeout(() => addFloorRequest(0, 'UP'), 0);
    setTimeout(() => addFloorRequest(9, 'DOWN'), 100);
    
    setTimeout(startSimulation, 500);
  };

  return (
    <div className={styles.simulationPage}>
      <div className={styles.header}>
        <h1>Simulation Scenarios</h1>
        <p>Use the buttons below to run pre-defined test scenarios</p>
      </div>

      <div className={styles.scenariosGrid}>
        {/* Scenario 1 */}
        <div className={styles.scenarioCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>🌅</span>
            <h3>Morning Rush</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.description}>
              Morning time simulation - most people go up from ground floor.
            </p>
            <ul className={styles.details}>
              <li>10 UP requests from F0</li>
              <li>5 UP requests from F1</li>
              <li>3 UP requests from F2</li>
            </ul>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={runMorningRush}>
            🚀 Run Scenario
          </button>
        </div>

        {/* Scenario 2 */}
        <div className={styles.scenarioCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>🌆</span>
            <h3>Evening Rush</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.description}>
              Evening time simulation - most people come down from upper floors.
            </p>
            <ul className={styles.details}>
              <li>5 DOWN requests from F9</li>
              <li>5 DOWN requests from F8</li>
              <li>5 DOWN requests from F7</li>
            </ul>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={runEveningRush}>
            🚀 Run Scenario
          </button>
        </div>

        {/* Scenario 3 */}
        <div className={styles.scenarioCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>⚖️</span>
            <h3>Balanced Load</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.description}>
              Mixed traffic pattern - random UP and DOWN requests from all floors.
            </p>
            <ul className={styles.details}>
              <li>20 random requests</li>
              <li>All floors</li>
              <li>Mixed UP/DOWN directions</li>
            </ul>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={runBalancedLoad}>
            🚀 Run Scenario
          </button>
        </div>

        {/* Scenario 4 */}
        <div className={styles.scenarioCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>🔥</span>
            <h3>Stress Test</h3>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.description}>
              Maximum load test - both UP and DOWN requests from every floor simultaneously.
            </p>
            <ul className={styles.details}>
              <li>16+ simultaneous requests</li>
              <li>All floors activated</li>
              <li>Tests LOOK algorithm efficiency</li>
            </ul>
          </div>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={runStressTest}>
            🔥 Run Stress Test
          </button>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h2>About LOOK Algorithm</h2>
        <div className={styles.algorithmInfo}>
          <p>
            This simulator uses the <strong>LOOK Algorithm</strong>, which is an improved version of the SCAN algorithm.
          </p>
          <h3>How it works:</h3>
          <ul>
            <li>Elevator moves in one direction as long as there are requests in that direction</li>
            <li>When no more requests remain in one direction, it changes direction</li>
            <li>Idle elevators get priority first</li>
            <li>Moving elevators are preferred for requests in the same direction</li>
            <li>It's more efficient than traditional SCAN because it avoids unnecessary travel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
