import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

/**
 * Sidebar Component - For navigation
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
        <p>Simulator V1</p>
      </div>
      
      <nav className={styles.nav}>
        <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
          <span className={styles.icon}>📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/logs" className={`${styles.navLink} ${isActive('/logs')}`}>
          <span className={styles.icon}>📝</span>
          <span>Logs</span>
        </Link>
        <Link to="/simulation" className={`${styles.navLink} ${isActive('/simulation')}`}>
          <span className={styles.icon}>⚙️</span>
          <span>Simulation</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <p>LOOK Algorithm</p>
        <p className={styles.version}>Version 1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;

