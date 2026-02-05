import { distance } from './distance.js';

/**
 * Path and tour calculation utilities
 */

/**
 * Calculates the total travel time/distance for the current tour
 * @param {Graph} graph - The graph instance
 * @param {Node} startNode - Starting node
 * @returns {Promise<number>} Total travel time/distance
 */
export async function calculateTravelTime(graph, startNode) {
  let time = 0;
  let V = graph.V;
  let included = new Array(V).fill(false);
  included[startNode.index] = true;
  let curNode = startNode;

  // Add all nodes
  for (let i = 0; i < graph.V - 1; ++i) {
    let edgesToCurNode = graph.AdjList.get(curNode);
    for (let edge of edgesToCurNode) {
      let neighbor = edge.other(curNode);
      if (!included[neighbor.index]) {
        time += edge.weight;
        included[neighbor.index] = true;
        curNode = neighbor;
        break;
      }
    }
  }

  let lastEdge = graph.findEdge(curNode, startNode);
  time += lastEdge.weight;
  return time;
}

/**
 * Gets the current tour path as an ordered array of nodes
 * @param {Graph} graph - The graph instance
 * @param {Node} startNode - Starting node
 * @returns {Node[]} Ordered array of nodes representing the tour
 */
export function getPath(graph, startNode) {
  let path = [];
  let visited = new Array(graph.V).fill(false);
  let cur = startNode;

  for (var i = 0; i < graph.V; ++i) {
    path.push(cur);
    visited[cur.index] = true;
    // Get both neighbors
    var neighbors = graph.getNeighbors(cur);
    cur = visited[neighbors[0].index] ? neighbors[1] : neighbors[0];
  }

  path.push(startNode);
  return path;
}

/**
 * Calculates the total length of a path
 * @param {Node[]} path - Array of nodes
 * @returns {number} Total path length
 */
export function getLength(path) {
  let length = 0;
  let n = path.length;

  for (let i = 0; i < n - 1; ++i) {
    length += distance(path[i], path[i + 1]);
  }

  return length;
}
