import { distance } from '../../utils/distance.js';
import { Graph } from '../../core/Graph.js';

/**
 * Creates a Brute Force algorithm instance
 * Tries all possible permutations to find optimal TSP solution
 * WARNING: Exponential time complexity - only suitable for small graphs
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Node} context.startNode - Starting node
 * @param {Function} context.addEdge - Function to add edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.getNonIncludedNodes - Get unvisited nodes
 * @returns {Function} Async brute force algorithm
 */
export function createBruteForce(context) {
  const {
    startNode,
    addEdge,
    delay,
    waitForIsPlaying,
    getNonIncludedNodes,
  } = context;

  // Note: Don't destructure graph - use context.graph getter to access/modify current value

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
   * Brute Force algorithm for TSP
   * Recursively explores all permutations to find optimal tour
   *
   * @param {Node} curNode - Current node in the tour
   * @param {boolean[]} included - Array tracking visited nodes
   * @param {number} time - Accumulated time/distance so far
   * @returns {Promise<number>} Total tour time/distance
   */
  return async function bruteForce(curNode, included, time) {
    included[curNode.index] = true;
    let neighbors = getNonIncludedNodes(included);

    // Base case: no more nodes to visit, return to start
    if (neighbors.length == 0) {
      let weight = distance(startNode, curNode);
      addEdge(startNode, curNode, weight);
      return time + weight;
    }

    // Try each remaining neighbor and find the best one
    let minTime = Number.MAX_VALUE;
    let bestNeighbor = null;

    for (let neighbor of neighbors) {
      await waitForIsPlaying();

      // Try this neighbor
      let includedCopy = JSON.parse(JSON.stringify(included));
      let tempGraph = copyGraph(context.graph);
      addEdge(curNode, neighbor, distance(curNode, neighbor));
      await delay(300);

      // Recursively solve the remaining problem
      let finishTime = await bruteForce(neighbor, includedCopy, time + distance(curNode, neighbor));

      // Track the best option
      if (finishTime < minTime) {
        minTime = finishTime;
        bestNeighbor = neighbor;
      }

      // Restore graph state
      context.graph = copyGraph(tempGraph);
      await delay(300);
    }

    // Commit to the best neighbor found
    addEdge(curNode, bestNeighbor, distance(curNode, bestNeighbor));
    await delay(400);
    return bruteForce(bestNeighbor, included, time + distance(curNode, bestNeighbor));
  };
}
