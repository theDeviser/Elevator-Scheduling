import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

/**
 * Sidebar Component - For navigation
 * V2: Added Metrics Dashboard and renamed Simulation to Configuration
 */
const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>🏢 Elevator</h2>
        <p>Simulator V2</p>
      </div>
      
      <nav className={styles.nav}>
        <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
          <span className={styles.icon}>📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/metrics" className={`${styles.navLink} ${isActive('/metrics')}`}>
          <span className={styles.icon}>📈</span>
          <span>Metrics</span>
        </Link>
        <Link to="/configuration" className={`${styles.navLink} ${isActive('/configuration')}`}>
          <span className={styles.icon}>⚙️</span>
          <span>Configuration</span>
        </Link>
        <Link to="/logs" className={`${styles.navLink} ${isActive('/logs')}`}>
          <span className={styles.icon}>📝</span>
          <span>Logs</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <p>LOOK & FIFO Algorithms</p>
        <p className={styles.version}>Version 2.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
