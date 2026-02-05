import { distance } from '../../utils/distance.js';

/**
 * Creates a Nearest Neighbor algorithm instance
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Node} context.startNode - Starting node
 * @param {Function} context.addEdge - Function to add edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.findNode - Find closest/farthest node
 * @param {Function} context.getNonIncludedNodes - Get unvisited nodes
 * @param {Function} context.calculateTravelTime - Calculate total tour time
 * @returns {Function} Async nearest neighbor algorithm
 */
export function createNearestNeighbor(context) {
  const {
    // DON'T destructure graph - access via context.graph to get current value
    startNode,
    addEdge,
    delay,
    waitForIsPlaying,
    findNode,
    getNonIncludedNodes,
    calculateTravelTime,
  } = context;

  /**
   * Nearest Neighbor algorithm for TSP
   * Greedy algorithm that always visits the nearest unvisited node
   *
   * @param {Node} curNode - Current node
   * @param {boolean[]} included - Array tracking visited nodes
   * @param {boolean} timeOnlyFromCurNode - If true, return only time from current node
   * @returns {Promise<number>} Total travel time
   */
  return async function nearestNeighbor(curNode, included, timeOnlyFromCurNode) {
    if (timeOnlyFromCurNode == undefined)
      timeOnlyFromCurNode = false;

    let time = 0;
    included[curNode.index] = true;

    let nonIncludedNodes = getNonIncludedNodes(included);

    // Visit each remaining node in nearest order
    for (let i = 0; i < nonIncludedNodes.length; ++i) {
      await waitForIsPlaying();
      let node = findNode(curNode, included, "closest");

      // Add edge between current node and nearest node
      let weight = distance(node, curNode);
      time += weight;
      addEdge(node, curNode, weight);

      curNode = node;
      included[curNode.index] = true;

      await delay(300);
    }

    // Close the tour back to start
    let weight = distance(curNode, startNode);
    time += weight;
    addEdge(curNode, startNode, weight);
    await delay(300);

    if (timeOnlyFromCurNode)
      return time;

    return await calculateTravelTime();
  };
}
