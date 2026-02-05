import { distance } from '../../utils/distance.js';

/**
 * Creates an Insertion algorithm instance (Nearest or Farthest)
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Node} context.startNode - Starting node
 * @param {Function} context.addEdge - Function to add edges
 * @param {Function} context.removeEdge - Function to remove edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.findNode - Find closest/farthest node
 * @param {Function} context.getNonIncludedNodes - Get unvisited nodes
 * @param {Function} context.getIncludedNodes - Get visited nodes
 * @returns {Function} Async insertion algorithm
 */
export function createInsertion(context) {
  const {
    // DON'T destructure graph - access via context.graph to get current value
    startNode,
    addEdge,
    removeEdge,
    delay,
    waitForIsPlaying,
    findNode,
    getNonIncludedNodes,
    getIncludedNodes,
  } = context;

  /**
   * Finds the closest node to a given node from an array of nodes
   * @param {Node} node - The reference node
   * @param {Node[]} nodes - Array of candidate nodes
   * @returns {Array} [closestDistance, closestNode]
   */
  function findClosestNode(node, nodes) {
    let closestNode = null;
    let closestDist = Number.MAX_VALUE;
    for (let v of nodes) {
      let dist = distance(node, v);
      if (dist < closestDist) {
        closestDist = dist;
        closestNode = v;
      }
    }
    return [closestDist, closestNode];
  }

  /**
   * Finds the closest or farthest unvisited node to the set of visited nodes
   * and determines the best insertion point
   *
   * @param {boolean[]} included - Array tracking visited nodes
   * @param {string} mode - "closest" or "farthest"
   * @returns {Array} [root, nodeToInsert, followUp] - insertion position nodes
   */
  function findClosestOrFarthestToIncluded(included, mode) {
    if (mode !== "closest" && mode !== "farthest")
      throw new Error('Invalid Input. Mode is: ' + mode + ' but has to be "closest" or "farthest"');

    let curMinOrMax = Number.MAX_VALUE; // min
    if (mode == "farthest") {
      curMinOrMax = Number.MIN_VALUE; // max
    }
    let root = null;
    let closestToRoot = null;

    // Iterate through all non-included nodes
    let nonIncludedNodes = getNonIncludedNodes(included);
    for (let node of nonIncludedNodes) {
      // Find closest distance to included nodes
      let [closestDist, potentialRoot] = findClosestNode(node, getIncludedNodes(included));

      if (mode == "closest") {
        if (closestDist < curMinOrMax) {
          curMinOrMax = closestDist;
          root = potentialRoot;
          closestToRoot = node;
        }
      }
      if (mode == "farthest") {
        if (closestDist > curMinOrMax) {
          curMinOrMax = closestDist;
          root = potentialRoot;
          closestToRoot = node;
        }
      }
    }

    // Find best insertion position
    let rootEdges = context.graph.AdjList.get(root);

    let firstRootNeighbor = rootEdges[0].other(root);
    if (rootEdges.length == 1)
      return [root, closestToRoot, firstRootNeighbor];

    let secondRootNeighbor = rootEdges[1].other(root);
    let newDist1 = distance(closestToRoot, firstRootNeighbor);
    let newDist2 = distance(closestToRoot, secondRootNeighbor);
    let oldDist1 = distance(root, firstRootNeighbor);
    let oldDist2 = distance(root, secondRootNeighbor);

    if (newDist1 - oldDist1 < newDist2 - oldDist2)
      return [root, closestToRoot, firstRootNeighbor];
    return [root, closestToRoot, secondRootNeighbor];
  }

  /**
   * Insertion algorithm for TSP (Nearest or Farthest)
   * Builds tour by iteratively inserting nodes at optimal positions
   *
   * @param {string} mode - "nearest" or "farthest"
   * @returns {Promise<void>}
   */
  return async function insertion(mode) {
    // Add the start node
    let toAdd = startNode;
    var included = new Array(context.graph.V).fill(false);
    included[toAdd.index] = true;

    // Add the first node
    let node = null;
    switch (mode) {
      case "nearest":
        node = findNode(startNode, included, "closest");
        break;
      case "farthest":
        node = findNode(startNode, included, "farthest");
        break;
      default:
    }
    addEdge(startNode, node, distance(startNode, node));
    included[node.index] = true;
    await delay(1000);

    // The second node is inserted slightly different than the remaining ones
    let arr = null;
    switch (mode) {
      case "nearest":
        arr = findClosestOrFarthestToIncluded(included, "closest");
        break;
      case "farthest":
        arr = findClosestOrFarthestToIncluded(included, "farthest");
        break;
      default:
    }
    let root = arr[0];
    toAdd = arr[1];
    let followUp = arr[2];
    addEdge(root, toAdd, distance(root, toAdd));
    addEdge(followUp, toAdd, distance(followUp, toAdd));
    included[toAdd.index] = true;
    await delay(1000);

    // Insert remaining nodes
    for (let i = 0; i < context.graph.V - 3; ++i) {
      await waitForIsPlaying();
      let arr = null;
      switch (mode) {
        case "nearest":
          arr = findClosestOrFarthestToIncluded(included, "closest");
          break;
        case "farthest":
          arr = findClosestOrFarthestToIncluded(included, "farthest");
          break;
        default:
      }
      let root = arr[0];
      let toAdd = arr[1];
      let followUp = arr[2];

      // Remove edge between root and followUp
      removeEdge(root, followUp);

      // Highlight the three nodes
      toAdd.color = "#ae2a0d";
      root.color = "#0f61e8";
      followUp.color = "#0f61e8";
      await delay(1000);

      // Add new edges
      addEdge(root, toAdd, distance(root, toAdd));
      await delay(400);
      addEdge(toAdd, followUp, distance(toAdd, followUp));
      included[toAdd.index] = true;
      await delay(1000);

      // Reset colors
      toAdd.color = "#fff";
      root.color = "#fff";
      followUp.color = "#fff";
    }
  };
}
