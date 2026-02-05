import { distance } from '../../utils/distance.js';
import { Graph } from '../../core/Graph.js';

/**
 * Creates a Nearest Neighbor Improved algorithm instance
 * Uses look-ahead to make better choices than greedy nearest neighbor
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Node} context.startNode - Starting node
 * @param {Function} context.addEdge - Function to add edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.getNonIncludedNodes - Get unvisited nodes
 * @param {Function} context.nearestNeighbor - Base nearest neighbor algorithm
 * @returns {Function} Async nearest neighbor improved algorithm
 */
export function createNearestNeighborImproved(context) {
  const {
    startNode,
    addEdge,
    delay,
    waitForIsPlaying,
    getNonIncludedNodes,
    nearestNeighbor,
  } = context;

  // Note: Don't destructure graph - use context.graph getter to access current value

  /**
   * Creates a deep copy of a graph
   * @param {Graph} g - Graph to copy
   * @returns {Graph} New graph instance with same structure
   */
  function copyGraph(g) {
    let newGraph = new Graph(0);
    for (let node of g.getNodes()) {
      newGraph.addVertex(node);
    }
    for (let edge of g.getEdges()) {
      newGraph.addEdgeFromEdge(edge);
    }
    return newGraph;
  }

  /**
   * Nearest Neighbor Improved algorithm for TSP
   * Look-ahead version that evaluates future consequences of each choice
   *
   * @returns {Promise<void>}
   */
  return async function nearestNeighborImproved() {
    let curNode = startNode;
    let included = new Array(context.graph.V).fill(false);
    included[curNode.index] = true;

    // In every iteration add one node
    for (let i = 0; i < context.graph.V - 1; ++i) {
      let min = Number.MAX_VALUE;
      let potentialNextNode = null;
      let nonIncludedNodes = getNonIncludedNodes(included);

      // Iterate through all non-included nodes and evaluate each choice
      for (let v of nonIncludedNodes) {
        await waitForIsPlaying();

        // Try adding this node and see what the future cost would be
        let tempGraph = copyGraph(context.graph);
        let includedCopy = JSON.parse(JSON.stringify(included));
        addEdge(curNode, v, distance(curNode, v));

        // Use nearest neighbor to complete the tour from this choice
        let time = await nearestNeighbor(v, includedCopy, true);
        time += distance(curNode, v);
        delay(300);

        // Keep track of the best choice
        if (time < min) {
          potentialNextNode = v;
          min = time;
        }

        // Restore graph state
        context.graph = copyGraph(tempGraph);
      }

      // Add the best node found
      addEdge(curNode, potentialNextNode, distance(curNode, potentialNextNode));
      curNode = potentialNextNode;
      included[curNode.index] = true;
      await delay(300);
    }

    // Close the tour
    addEdge(curNode, startNode, distance(curNode, startNode));
  };
}
