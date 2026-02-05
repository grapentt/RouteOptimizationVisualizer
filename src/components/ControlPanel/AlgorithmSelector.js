import React from 'react';
import Select from 'react-select';
import { CONSTRUCTION_ALGORITHM_OPTIONS, LOCAL_SEARCH_OPTIONS } from '../../constants/algorithms.js';

/**
 * Algorithm selector dropdown component
 */
export function AlgorithmSelector({ value, onChange, showAlert, className }) {
  return (
    <div className="dropdown-wrapper">
      <div className={showAlert ? "select-warning" : ""}>
        <Select
          className={`dropdown-menu ${className || 'algorithm-select'}`}
          options={CONSTRUCTION_ALGORITHM_OPTIONS}
          onChange={onChange}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
        />
      </div>
    </div>
  );
}

/**
 * Local search algorithm selector dropdown component
 */
export function LocalSearchSelector({ value, onChange, showAlert, className }) {
  return (
    <div className="dropdown-wrapper">
      <div className={showAlert ? "select-warning" : ""}>
        <Select
          className={`dropdown-menu ${className || 'local-search-select'}`}
          options={LOCAL_SEARCH_OPTIONS}
          onChange={onChange}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
        />
      </div>
    </div>
  );
}
