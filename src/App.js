import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ElevatorProvider } from './context/ElevatorContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import SimulationPage from './pages/SimulationPage';
import './App.css';

/**
 * Main App Component
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
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ElevatorProvider>
  );
}

export default App;

