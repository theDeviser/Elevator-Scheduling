import React from 'react';
import { useElevator } from '../context/ElevatorContext';
import styles from './MetricsDashboardPage.module.css';

/**
 * MetricsDashboardPage - Displays performance metrics
 * Shows average wait time, ride time, and jobs completed
 */
const MetricsDashboardPage = () => {
  const { state } = useElevator();
  const { metrics } = state;

  // Calculate averages (handle division by zero)
  const avgWaitTime = metrics.jobsCompleted > 0
    ? (metrics.totalWaitTime / metrics.jobsCompleted / 1000).toFixed(2)
    : '0.00';
    
  const avgRideTime = metrics.jobsCompleted > 0
    ? (metrics.totalRideTime / metrics.jobsCompleted / 1000).toFixed(2)
    : '0.00';

  const completionRate = metrics.jobsCreated > 0
    ? ((metrics.jobsCompleted / metrics.jobsCreated) * 100).toFixed(1)
    : '0.0';

  return (
    <div className={styles.metricsPage}>
      <div className={styles.header}>
        <h1>📊 Metrics Dashboard</h1>
        <p>Performance analysis of the elevator system</p>
        <div className={styles.algorithmBadge}>
          Current Algorithm: <span>{state.currentAlgorithmName}</span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {/* Average Wait Time */}
        <div className={`${styles.metricCard} ${styles.waitTime}`}>
          <div className={styles.cardIcon}>⏱️</div>
          <div className={styles.cardContent}>
            <h3>Average Wait Time</h3>
            <div className={styles.metricValue}>
              {avgWaitTime}<span className={styles.unit}>s</span>
            </div>
            <p className={styles.cardDescription}>
              Time passengers wait for elevator to arrive
            </p>
          </div>
        </div>

        {/* Average Ride Time */}
        <div className={`${styles.metricCard} ${styles.rideTime}`}>
          <div className={styles.cardIcon}>🚀</div>
          <div className={styles.cardContent}>
            <h3>Average Ride Time</h3>
            <div className={styles.metricValue}>
              {avgRideTime}<span className={styles.unit}>s</span>
            </div>
            <p className={styles.cardDescription}>
              Time passengers spend traveling in elevator
            </p>
          </div>
        </div>

        {/* Total Jobs Completed */}
        <div className={`${styles.metricCard} ${styles.jobsCompleted}`}>
          <div className={styles.cardIcon}>✅</div>
          <div className={styles.cardContent}>
            <h3>Jobs Completed</h3>
            <div className={styles.metricValue}>
              {metrics.jobsCompleted}
            </div>
            <p className={styles.cardDescription}>
              Total number of completed passenger trips
            </p>
          </div>
        </div>

        {/* Total Jobs Created */}
        <div className={`${styles.metricCard} ${styles.jobsCreated}`}>
          <div className={styles.cardIcon}>📋</div>
          <div className={styles.cardContent}>
            <h3>Jobs Created</h3>
            <div className={styles.metricValue}>
              {metrics.jobsCreated}
            </div>
            <p className={styles.cardDescription}>
              Total number of requests generated
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className={`${styles.metricCard} ${styles.completionRate}`}>
          <div className={styles.cardIcon}>📈</div>
          <div className={styles.cardContent}>
            <h3>Completion Rate</h3>
            <div className={styles.metricValue}>
              {completionRate}<span className={styles.unit}>%</span>
            </div>
            <p className={styles.cardDescription}>
              Percentage of jobs completed vs created
            </p>
          </div>
        </div>

        {/* Total Time Stats */}
        <div className={`${styles.metricCard} ${styles.totalTime}`}>
          <div className={styles.cardIcon}>⌚</div>
          <div className={styles.cardContent}>
            <h3>Total Service Time</h3>
            <div className={styles.metricValue}>
              {((metrics.totalWaitTime + metrics.totalRideTime) / 1000).toFixed(1)}
              <span className={styles.unit}>s</span>
            </div>
            <p className={styles.cardDescription}>
              Combined wait and ride time for all passengers
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className={styles.chartSection}>
        <h2>Performance Comparison</h2>
        <div className={styles.barChart}>
          <div className={styles.barGroup}>
            <div className={styles.barLabel}>Wait Time</div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles.waitBar}`}
                style={{ width: `${Math.min((parseFloat(avgWaitTime) / 10) * 100, 100)}%` }}
              >
                {avgWaitTime}s
              </div>
            </div>
          </div>
          <div className={styles.barGroup}>
            <div className={styles.barLabel}>Ride Time</div>
            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles.rideBar}`}
                style={{ width: `${Math.min((parseFloat(avgRideTime) / 10) * 100, 100)}%` }}
              >
                {avgRideTime}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h2>📌 How to Use Metrics</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h4>Lower Wait Time = Better</h4>
            <p>
              Wait time indicates how quickly elevators respond to floor requests.
              The LOOK algorithm typically minimizes this by choosing nearby elevators.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h4>Lower Ride Time = Better</h4>
            <p>
              Ride time shows how long passengers spend in the elevator. This depends
              on how many stops the elevator makes before reaching the destination.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h4>Compare Algorithms</h4>
            <p>
              Run the same scenario with different algorithms (LOOK vs FIFO) and compare
              these metrics to see which performs better under different conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboardPage;

