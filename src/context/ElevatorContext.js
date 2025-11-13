import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import ElevatorSystem from '../core/ElevatorSystem';

const ElevatorContext = createContext();

/**
 * ElevatorProvider - For global state management
 * V2: Added new methods for algorithm selection, status, zoning, and validation
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
   * V2: Sets the scheduling algorithm
   */
  const setAlgorithm = (algorithmName) => {
    systemRef.current.setAlgorithm(algorithmName);
    updateState();
  };

  /**
   * V2: Sets elevator operational status
   */
  const setElevatorStatus = (elevatorId, status) => {
    systemRef.current.setElevatorStatus(elevatorId, status);
    updateState();
  };

  /**
   * V2: Sets elevator zoning (accessible floors)
   */
  const setElevatorZoning = (elevatorId, floorArray) => {
    systemRef.current.setElevatorZoning(elevatorId, floorArray);
    updateState();
  };

  /**
   * V2: Applies a zoning preset
   */
  const setZoningPreset = (presetName) => {
    systemRef.current.setZoningPreset(presetName);
    updateState();
  };

  /**
   * V2: Validates current configuration
   */
  const validate = () => {
    return systemRef.current.validate();
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
    // V2: New methods
    setAlgorithm,
    setElevatorStatus,
    setElevatorZoning,
    setZoningPreset,
    validate,
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
