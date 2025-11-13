import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './AlgorithmSelector.module.css';

/**
 * AlgorithmSelector Component - Allows switching between scheduling algorithms
 */
const AlgorithmSelector = () => {
  const { state, setAlgorithm } = useElevator();

  const handleAlgorithmChange = (event) => {
    const algorithm = event.target.value;
    setAlgorithm(algorithm);
  };

  return (
    <div className={styles.algorithmSelector}>
      <label className={styles.label}>
        <span className={styles.icon}>🧠</span>
        <span>Scheduling Algorithm:</span>
      </label>
      <select
        className={styles.select}
        value={state.currentAlgorithmName}
        onChange={handleAlgorithmChange}
      >
        <option value="LOOK">LOOK - Directional Scan</option>
        <option value="FIFO">FIFO - First Come First Serve</option>
      </select>
      <div className={styles.description}>
        {state.currentAlgorithmName === 'LOOK' && (
          <p>✨ Optimizes by moving in one direction until no more requests</p>
        )}
        {state.currentAlgorithmName === 'FIFO' && (
          <p>📝 Assigns to first available idle elevator regardless of position</p>
        )}
      </div>
    </div>
  );
};

export default AlgorithmSelector;

