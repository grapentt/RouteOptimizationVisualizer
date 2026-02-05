/**
 * Configuration constants for the Route Optimization Visualizer
 */

// Canvas settings
export const CANVAS = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight * 3 / 5,
  HEIGHT_RATIO: 3 / 5,
  BACKGROUND_COLOR: 220,
};

// Node rendering settings
export const NODE = {
  DEFAULT_RADIUS: 10,
  DEFAULT_COLOR: '#fff',
  HIGHLIGHT_COLOR: 'rgb(255, 0, 200)',
  START_NODE_COLOR: 'rgb(255, 0, 200)',
};

// Edge rendering settings
export const EDGE = {
  DEFAULT_COLOR: 'black',
  STROKE_WEIGHT: 1,
};

// Animation settings
export const ANIMATION = {
  DEFAULT_SPEED: 5,
  MIN_SPEED: 1,
  MAX_SPEED: 50,
  BASE_DELAY: 1000, // Base delay in milliseconds
};

// Algorithm states
export const STATE = {
  NO_SOLUTION: 0,
  SOLUTION_FOUND: 1,
};

// Colors for visualization
export const COLORS = {
  WHITE: '#fff',
  BLACK: 'black',
  PINK: 'rgb(255, 0, 200)',
  BACKGROUND: 220,
};
