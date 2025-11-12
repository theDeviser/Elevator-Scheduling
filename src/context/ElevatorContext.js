import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import ElevatorSystem from '../core/ElevatorSystem';

const ElevatorContext = createContext();

/**
 * ElevatorProvider - For global state management
 */
export const ElevatorProvider = ({ children }) => {
  const systemRef = useRef(new ElevatorSystem());
  const [state, setState] = useState(systemRef.current.getState());
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  /**
   * Updates the state
   */
  const updateState = () => {
    setState(systemRef.current.getState());
  };

  /**
   * Starts the simulation
   */
  const startSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        systemRef.current.systemStep();
        updateState();
      }, 1000); // Tick every 1 second
    }
  };

  /**
   * Pauses the simulation
   */
  const pauseSimulation = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  /**
   * Resets the system
   */
  const resetSimulation = () => {
    pauseSimulation();
    systemRef.current.reset();
    updateState();
  };

  /**
   * Adds a floor request
   */
  const addFloorRequest = (floor, direction) => {
    systemRef.current.addFloorRequest(floor, direction);
    updateState();
  };

  /**
   * Adds an internal request
   */
  const addInternalRequest = (elevatorId, floor) => {
    systemRef.current.addInternalRequest(elevatorId, floor);
    updateState();
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value = {
    state,
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    addFloorRequest,
    addInternalRequest,
    updateState
  };

  return (
    <ElevatorContext.Provider value={value}>
      {children}
    </ElevatorContext.Provider>
  );
};

/**
 * Custom hook to use ElevatorContext
 */
export const useElevator = () => {
  const context = useContext(ElevatorContext);
  if (!context) {
    throw new Error('useElevator must be used within ElevatorProvider');
  }
  return context;
};

export default ElevatorContext;

