# Route Optimization Visualizer

[![Deploy Status](https://github.com/grapentt/RouteOptimizationVisualizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/grapentt/RouteOptimizationVisualizer/actions/workflows/deploy.yml)

An interactive web application for visualizing and comparing various algorithms that solve the Traveling Salesman Problem (TSP). Built with React and p5.js, this tool provides an educational and intuitive way to understand how different route optimization algorithms work through real-time animated visualizations.

🌐 **Live Demo:** [https://grapentt.github.io/RouteOptimizationVisualizer](https://grapentt.github.io/RouteOptimizationVisualizer)

## Features

### Construction Algorithms
- **Nearest Neighbor** - Greedy approach building routes by selecting closest unvisited nodes
- **Nearest Neighbor Look Ahead** - Enhanced version with forward-looking optimization
- **Nearest Insertion** - Iteratively inserts the nearest unvisited node into the tour
- **Farthest Insertion** - Inserts the farthest unvisited node to build diverse tours
- **Brute Force** - Exhaustive search for the optimal solution (small graphs only)
- **Christofides Algorithm** - Approximation algorithm with guaranteed performance bounds
- **Naive Clustering** - Divides nodes into clusters before optimization

### Local Search Optimization
- **2-opt** - Edge swap optimization for tour improvement
- **3-opt** - More complex edge reconfiguration for better results

### Interactive Features
- **Visual Canvas** - Click to add nodes and watch algorithms solve in real-time
- **Animation Controls** - Adjustable speed slider, play/pause functionality
- **Smart Play/Pause Button** - Context-aware: runs construction algorithms or local search based on current state
- **Algorithm Comparison** - Run different algorithms on the same set of nodes
- **Edge Management** - Remove edges while preserving nodes to try different approaches
- **Guided Tutorial** - Built-in walkthrough for new users

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RouteOptimizationVisualizer.git
   cd RouteOptimizationVisualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Workflow

1. **Add Nodes**
   - Click the "Add Nodes" button
   - Click on the canvas to place nodes

2. **Select Algorithm**
   - Choose a construction algorithm from the dropdown menu
   - Click "Run Algorithm" or press the Play button

3. **Optimize with Local Search**
   - After a tour is created, select a local search algorithm
   - Click "Run Local Search" or press the Play button

4. **Experiment**
   - Add more nodes to the existing graph
   - Remove edges to try a different algorithm
   - Adjust animation speed for better visibility

### Keyboard & Controls

- **Add Nodes Button** - Toggle node placement mode
- **Play/Pause Button** - Smart button that adapts to context:
  - During execution: Pause/resume animation
  - No tour: Run construction algorithm
  - Tour exists: Run local search
- **Speed Slider** - Control animation speed (1-100)
- **Remove Edges** - Clear tour while keeping nodes
- **Clear Board** - Reset everything

## Project Structure

```
src/
├── algorithms/
│   ├── construction/      # TSP construction algorithms
│   │   ├── nearestNeighbor.js
│   │   ├── insertion.js
│   │   ├── bruteForce.js
│   │   └── nearestNeighborImproved.js
│   ├── improvement/       # Local search algorithms
│   │   ├── twoOpt.js
│   │   └── threeOpt.js
│   └── utils/            # Algorithm utilities (Blossom, MST)
├── components/
│   ├── Canvas/           # Visualization canvas component
│   └── ControlPanel/     # UI controls (selectors, buttons, sliders)
├── constants/            # Configuration and algorithm metadata
├── core/                 # Core data structures (Graph, Node, Edge)
├── utils/                # Utility functions (distance, graph helpers)
└── __tests__/            # Test suites
```

## Technologies Used

### Frontend
- **React** (v18) - UI framework
- **p5.js** - Canvas rendering and animations
- **react-p5-wrapper** - React integration for p5.js
- **react-select** - Dropdown components

### Development
- **Create React App** - Build tooling
- **Jest** - Testing framework
- **React Testing Library** - Component testing

### Algorithms
- **Edmonds Blossom Algorithm** - Perfect matching for Christofides
- **Prim's Algorithm** - Minimum spanning tree construction

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner. All 58 tests cover core functionality and user workflows.

### `npm run build`
Creates an optimized production build in the `build/` folder.

### `npm run eject`
**Note:** This is a one-way operation. Ejects from Create React App for full configuration control.

## Deployment

This project automatically deploys to GitHub Pages on every push to `main`.

**Live URL:** [https://grapentt.github.io/RouteOptimizationVisualizer](https://grapentt.github.io/RouteOptimizationVisualizer)

### Automatic Deployment

Every push to `main` triggers:
1. Runs all 58 tests
2. Builds production bundle
3. Deploys to GitHub Pages
4. Site live in 2-3 minutes

### Manual Deployment

Trigger manually from GitHub Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### First-Time Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## Development

### Architecture

The application uses a **command-based architecture** for state management:

- **React** manages all application state (single source of truth)
- **p5.js sketch** executes commands and renders visualizations
- **Callbacks** notify React when operations complete
- **No dual-state machines** - prevents race conditions

### Key Design Patterns

- **Factory Pattern** - Algorithm functions as closures with context
- **Command Pattern** - Explicit commands with timestamps prevent duplication
- **Callback Pattern** - Completion notifications from sketch to React
- **Context Getter Pattern** - Dynamic access to current graph state

### Adding a New Algorithm

1. Create algorithm file in `src/algorithms/construction/` or `src/algorithms/improvement/`
2. Export factory function that returns algorithm implementation
3. Add metadata to `src/constants/algorithms.js`
4. Import and register in `src/sketch.js`

Example:
```javascript
// src/algorithms/construction/myAlgorithm.js
export function createMyAlgorithm(context) {
  const { graph, startNode, addEdge, delay } = context;

  return async function myAlgorithm() {
    // Implementation with access to context
    await delay(50);
    // ... algorithm logic
  };
}
```

## Testing

The project includes comprehensive test coverage:

- **Algorithm Rerun Tests** - Verifies algorithms work after adding nodes
- **User Workflow Tests** - Tests complete user interactions
- **Component Tests** - UI component behavior
- **Utility Tests** - Distance calculations, graph operations

Run tests with:
```bash
npm test
```

View coverage:
```bash
npm test -- --coverage
```

## Performance Considerations

- **Brute Force** - Only suitable for ≤10 nodes (factorial complexity)
- **Christofides** - Best for 20-100 nodes (guaranteed 1.5x optimal)
- **Local Search** - Can optimize tours with 100+ nodes efficiently
- **Animation Speed** - Reduce speed for large graphs to see details

## Known Limitations

- Brute force becomes impractical beyond 10-12 nodes
- Very large graphs (500+ nodes) may slow down rendering
- Mobile touch support is limited (designed for desktop browsers)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## Contributing

Contributions are welcome! Areas for improvement:

- Additional TSP algorithms (Ant Colony, Genetic Algorithms)
- More local search heuristics (Simulated Annealing)
- Mobile/touch optimization
- Performance improvements for large graphs
- Export/import graph configurations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Edmonds Blossom Algorithm** implementation adapted from existing open-source implementations
- **p5.js** for making canvas animations accessible
- **React** team for excellent documentation and tooling

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs` folder
- Review test cases for usage examples

---

**Built with ❤️ using React and p5.js**
