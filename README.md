# Route Optimization Visualizer

[![Deploy Status](https://github.com/grapentt/RouteOptimizationVisualizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/grapentt/RouteOptimizationVisualizer/actions/workflows/deploy.yml)

A visual tool for exploring Traveling Salesman Problem (TSP) algorithms. Watch algorithms solve routing problems step-by-step with animated visualizations.

🌐 **Live Demo:** [https://grapentt.github.io/RouteOptimizationVisualizer](https://grapentt.github.io/RouteOptimizationVisualizer)

---

## Current Features

**Construction Algorithms**
- Nearest Neighbor (with look-ahead variant)
- Nearest/Farthest Insertion
- Brute Force
- Christofides Algorithm
- Naive Clustering

**Local Search**
- 2-opt
- 3-opt

**Interactive Visualization**
- Color-coded animation shows algorithm progress
- Pause/resume at any point to examine the current state
- Adjustable speed to observe details or get quick results
- Step through algorithms to understand how they work
- Built-in tutorial for first-time users

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/grapentt/RouteOptimizationVisualizer.git
cd RouteOptimizationVisualizer
npm install

# Run locally
npm start
# Opens at http://localhost:3000

# Run tests
npm test
```

**Requirements:** Node.js 14+, npm 6+

---

## How to Use

1. Click "Add Nodes" and place nodes on the canvas
2. Select an algorithm from the dropdown
3. Click "Run Algorithm" or press the play button
4. Watch the algorithm work - use the speed slider or pause to see each step
5. Optionally run local search to optimize the tour further

The play button is context-aware:
- During execution → pauses/resumes
- No tour → runs selected algorithm
- Tour exists → runs selected local search

---

## Project Structure

```
src/
├── algorithms/
│   ├── construction/      # TSP construction algorithms
│   ├── improvement/       # Local search (2-opt, 3-opt)
│   └── utils/            # Blossom, MST utilities
├── components/
│   ├── Canvas/           # p5.js visualization
│   └── ControlPanel/     # UI controls
├── constants/            # Config and algorithm metadata
├── core/                 # Graph, Node, Edge data structures
├── utils/                # Distance calculations, helpers
└── __tests__/            # Comprehensive test suite
```

---

## Tech Stack

- **React 18** - UI framework
- **p5.js** - Canvas rendering and animation
- **Jest** - Testing framework
- **GitHub Actions** - Automated testing and deployment

---

## Deployment

Automatically deploys to GitHub Pages on push to `main`:
1. Runs all tests
2. Builds production bundle
3. Deploys (only if tests pass)

The build process (`npm run build`) is handled automatically by GitHub Actions. You don't need to run it manually unless you want to test the production build locally.

---

## Development

**Architecture:** Command-based design where React manages state and p5.js executes visualization commands via callbacks.

**Adding a new algorithm:**
1. Create file in `src/algorithms/construction/` or `improvement/`
2. Export factory function returning async algorithm
3. Add to `src/constants/algorithms.js`
4. Register in `src/sketch.js`

Example:
```javascript
export function createMyAlgorithm(context) {
  const { graph, startNode, addEdge, delay } = context;

  return async function myAlgorithm() {
    await delay(50);
    // Your implementation
  };
}
```

---

## Testing

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
```

Tests cover algorithms, user workflows, components, and utility functions.

---

## License

MIT License - see LICENSE file for details.

---

## Contributing

Contributions welcome. Potential improvements:
- Additional algorithms (Ant Colony, Genetic, Simulated Annealing)
- Graph import/export functionality
- Performance optimizations for larger graphs
- Your ideas?
