/**
 * Algorithm metadata and options for the Route Optimization Visualizer
 */

// Algorithm types
export const ALGORITHM_TYPES = {
  CONSTRUCTION: 'construction',
  IMPROVEMENT: 'improvement',
};

// Algorithm identifiers
export const ALGORITHMS = {
  NOT_SELECTED: 'Not Selected',
  NEAREST_INSERTION: 'Nearest Insertion',
  FARTHEST_INSERTION: 'Farthest Insertion',
  NEAREST_NEIGHBOR: 'Nearest Neighbor',
  NEAREST_NEIGHBOR_LOOKAHEAD: 'Nearest Neighbor Look Ahead (made up)',
  BRUTE_FORCE: 'Brute Force',
  CHRISTOFIDES: 'Christofides',
};

// Local search identifiers
export const LOCAL_SEARCH = {
  NOT_SELECTED: 'Not Selected',
  TWO_OPT: '2-opt',
  THREE_OPT: '3-opt',
};

// Construction algorithm dropdown options
export const CONSTRUCTION_ALGORITHM_OPTIONS = [
  { value: "0", label: "Select Algorithm" },
  { value: "1", label: ALGORITHMS.NEAREST_INSERTION },
  { value: "2", label: ALGORITHMS.FARTHEST_INSERTION },
  { value: "3", label: ALGORITHMS.NEAREST_NEIGHBOR },
  { value: "4", label: ALGORITHMS.NEAREST_NEIGHBOR_LOOKAHEAD },
  { value: "5", label: ALGORITHMS.BRUTE_FORCE },
  { value: "7", label: ALGORITHMS.CHRISTOFIDES },
];

// Local search algorithm dropdown options
export const LOCAL_SEARCH_OPTIONS = [
  { value: "0", label: "Select Algorithm" },
  { value: "1", label: LOCAL_SEARCH.TWO_OPT },
  { value: "2", label: LOCAL_SEARCH.THREE_OPT },
];

// Algorithm metadata
export const ALGORITHM_METADATA = {
  [ALGORITHMS.NEAREST_INSERTION]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Builds tour by repeatedly inserting the nearest unvisited node',
    complexity: 'O(n²)',
  },
  [ALGORITHMS.FARTHEST_INSERTION]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Builds tour by repeatedly inserting the farthest unvisited node',
    complexity: 'O(n²)',
  },
  [ALGORITHMS.NEAREST_NEIGHBOR]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Greedy algorithm that always visits the nearest unvisited node',
    complexity: 'O(n²)',
  },
  [ALGORITHMS.NEAREST_NEIGHBOR_LOOKAHEAD]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Improved nearest neighbor with look-ahead capability',
    complexity: 'O(n³)',
  },
  [ALGORITHMS.BRUTE_FORCE]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Tries all possible permutations to find optimal solution',
    complexity: 'O(n!)',
  },
  [ALGORITHMS.CHRISTOFIDES]: {
    type: ALGORITHM_TYPES.CONSTRUCTION,
    description: 'Approximation algorithm with 1.5x optimal guarantee',
    complexity: 'O(n³)',
  },
  [LOCAL_SEARCH.TWO_OPT]: {
    type: ALGORITHM_TYPES.IMPROVEMENT,
    description: 'Iteratively removes edge crossings by swapping edge pairs',
    complexity: 'O(n²)',
  },
  [LOCAL_SEARCH.THREE_OPT]: {
    type: ALGORITHM_TYPES.IMPROVEMENT,
    description: 'More powerful local search examining three edge swaps',
    complexity: 'O(n³)',
  },
};
