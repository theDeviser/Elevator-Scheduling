import React, { useRef, useEffect } from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './LogsPage.module.css';

/**
 * LogsPage - List of all simulation events
 */
const LogsPage = () => {
  const { state } = useElevator();
  const logsEndRef = useRef(null);

  // Auto scroll to bottom when new log arrives
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  return (
    <div className={styles.logsPage}>
      <div className={styles.header}>
        <h1>System Logs</h1>
        <p>All simulation events will be displayed here</p>
        <div className={styles.logCount}>
          Total Logs: <span>{state.logs.length}</span>
        </div>
      </div>

      <div className={styles.logsContainer}>
        {state.logs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>No logs yet</h3>
            <p>Start the simulation to see logs here</p>
          </div>
        ) : (
          <div className={styles.logsList}>
            {state.logs.map((log, index) => (
              <div key={index} className={styles.logEntry}>
                <span className={styles.logIndex}>#{index + 1}</span>
                <span className={styles.logText}>{log}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;

