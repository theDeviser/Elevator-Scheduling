import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ElevatorProvider } from './context/ElevatorContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MetricsDashboardPage from './pages/MetricsDashboardPage';
import ConfigurationPage from './pages/ConfigurationPage';
import LogsPage from './pages/LogsPage';
import './App.css';

/**
 * Main App Component
 * V2: Added MetricsDashboard and renamed Simulation to Configuration
 */
function App() {
  return (
    <ElevatorProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/metrics" element={<MetricsDashboardPage />} />
              <Route path="/configuration" element={<ConfigurationPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ElevatorProvider>
  );
}

export default App;
