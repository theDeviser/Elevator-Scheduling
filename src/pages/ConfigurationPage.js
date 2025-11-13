import React, { useState } from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './ConfigurationPage.module.css';

/**
 * ConfigurationPage - Configuration and simulation control
 * Renamed from SimulationPage with major upgrades
 */
const ConfigurationPage = () => {
  const { state, resetSimulation, addFloorRequest, startSimulation, setElevatorStatus, setElevatorZoning, setZoningPreset, validate } = useElevator();
  const [validationResult, setValidationResult] = useState(null);

  /**
   * Section 1: Elevator Configuration
   */
  const toggleElevatorStatus = (elevatorId) => {
    const currentStatus = state.elevators[elevatorId].status;
    const newStatus = currentStatus === 'OPERATIONAL' ? 'OUT_OF_ORDER' : 'OPERATIONAL';
    setElevatorStatus(elevatorId, newStatus);
  };

  /**
   * Section 2: Zoning Presets
   */
  const applyHighLowZoning = () => {
    setZoningPreset('HIGH_LOW');
    setValidationResult(null);
  };

  const resetAllZoning = () => {
    setZoningPreset('DEFAULT');
    setValidationResult(null);
  };

  /**
   * Section 3: Simulation Scenarios
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

  /**
   * Section 4: Validation
   */
  const handleValidate = () => {
    const result = validate();
    setValidationResult(result);
  };

  const handleFullReset = () => {
    resetSimulation();
    // Reset all elevators to operational
    for (let i = 0; i < 4; i++) {
      setElevatorStatus(i, 'OPERATIONAL');
    }
    // Reset zoning
    setZoningPreset('DEFAULT');
    setValidationResult(null);
  };

  return (
    <div className={styles.configurationPage}>
      <div className={styles.header}>
        <h1>⚙️ Configuration & Simulation</h1>
        <p>Configure elevators, apply zoning rules, and run test scenarios</p>
      </div>

      {/* Section 1: Elevator Configuration */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🏗️ Elevator Configuration</h2>
          <p>Toggle elevator operational status</p>
        </div>
        
        <div className={styles.elevatorGrid}>
          {state.elevators.map(elevator => (
            <div key={elevator.id} className={styles.elevatorCard}>
              <div className={styles.elevatorInfo}>
                <h3>Elevator {elevator.id}</h3>
                <div className={styles.elevatorDetails}>
                  <span>Current Floor: F{elevator.currentFloor}</span>
                  <span>State: {elevator.state}</span>
                </div>
              </div>
              
              <button
                className={`${styles.statusToggle} ${elevator.status === 'OPERATIONAL' ? styles.operational : styles.outOfOrder}`}
                onClick={() => toggleElevatorStatus(elevator.id)}
              >
                {elevator.status === 'OPERATIONAL' ? (
                  <>
                    <span className={styles.toggleIcon}>✓</span>
                    <span>Operational</span>
                  </>
                ) : (
                  <>
                    <span className={styles.toggleIcon}>✗</span>
                    <span>Out of Order</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Zoning Presets */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🗺️ Zoning Presets</h2>
          <p>Apply floor access restrictions to elevators</p>
        </div>
        
        <div className={styles.zoningButtons}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={applyHighLowZoning}>
            <span className={styles.btnIcon}>🏢</span>
            <div className={styles.btnContent}>
              <span className={styles.btnTitle}>Apply High-Low Zoning</span>
              <span className={styles.btnDesc}>Elevators 0-1: Floors 0-5 | Elevators 2-3: Floors 0,6-9</span>
            </div>
          </button>
          
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={resetAllZoning}>
            <span className={styles.btnIcon}>🔄</span>
            <div className={styles.btnContent}>
              <span className={styles.btnTitle}>Reset All Zoning</span>
              <span className={styles.btnDesc}>All elevators can access all floors</span>
            </div>
          </button>
        </div>
      </div>

      {/* Section 3: Simulation Scenarios */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🎬 Simulation Scenarios</h2>
          <p>Run pre-defined test scenarios with current configuration</p>
        </div>

        <div className={styles.scenariosGrid}>
          <div className={styles.scenarioCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🌅</span>
              <h3>Morning Rush</h3>
            </div>
            <p className={styles.cardDesc}>
              Most people going up from ground floor
            </p>
            <ul className={styles.cardDetails}>
              <li>10 UP requests from F0</li>
              <li>5 UP requests from F1</li>
              <li>3 UP requests from F2</li>
            </ul>
            <button className={`${styles.btn} ${styles.btnScenario}`} onClick={runMorningRush}>
              ▶️ Run Scenario
            </button>
          </div>

          <div className={styles.scenarioCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🌆</span>
              <h3>Evening Rush</h3>
            </div>
            <p className={styles.cardDesc}>
              Most people coming down from upper floors
            </p>
            <ul className={styles.cardDetails}>
              <li>5 DOWN requests from F9</li>
              <li>5 DOWN requests from F8</li>
              <li>5 DOWN requests from F7</li>
            </ul>
            <button className={`${styles.btn} ${styles.btnScenario}`} onClick={runEveningRush}>
              ▶️ Run Scenario
            </button>
          </div>

          <div className={styles.scenarioCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚖️</span>
              <h3>Balanced Load</h3>
            </div>
            <p className={styles.cardDesc}>
              Random mixed UP/DOWN requests
            </p>
            <ul className={styles.cardDetails}>
              <li>20 random requests</li>
              <li>All floors</li>
              <li>Mixed directions</li>
            </ul>
            <button className={`${styles.btn} ${styles.btnScenario}`} onClick={runBalancedLoad}>
              ▶️ Run Scenario
            </button>
          </div>

          <div className={styles.scenarioCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔥</span>
              <h3>Stress Test</h3>
            </div>
            <p className={styles.cardDesc}>
              Maximum load test
            </p>
            <ul className={styles.cardDetails}>
              <li>16+ simultaneous requests</li>
              <li>All floors activated</li>
              <li>Tests algorithm efficiency</li>
            </ul>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={runStressTest}>
              🔥 Run Stress Test
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Validation */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>✅ Configuration Validator</h2>
          <p>Check if current setup is feasible</p>
        </div>

        <div className={styles.validatorSection}>
          <button className={`${styles.btn} ${styles.btnValidate}`} onClick={handleValidate}>
            <span className={styles.btnIcon}>🔍</span>
            <span>Validate Setup</span>
          </button>

          {validationResult && (
            <div className={`${styles.validationResult} ${validationResult.valid ? styles.valid : styles.invalid}`}>
              {validationResult.valid ? (
                <>
                  <span className={styles.resultIcon}>✅</span>
                  <span className={styles.resultText}>Setup is valid! All floors are accessible.</span>
                </>
              ) : (
                <>
                  <span className={styles.resultIcon}>⚠️</span>
                  <div className={styles.errorList}>
                    <strong>Setup has issues:</strong>
                    <ul>
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.globalControls}>
          <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleFullReset}>
            <span className={styles.btnIcon}>🔄</span>
            <span>Full System Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;

