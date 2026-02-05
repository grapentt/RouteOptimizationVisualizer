import { distance } from './distance.js';

/**
 * Node search utilities for finding closest/farthest nodes
 */

/**
 * Finds the closest or farthest node to a given node
 * @param {Node} curNode - Reference node
 * @param {Graph} graph - The graph instance
 * @param {boolean[]} included - Array tracking which nodes are included
 * @param {string} mode - "closest" or "farthest"
 * @returns {Node} The found node
 * @throws {Error} If mode is invalid
 */
export function findNode(curNode, graph, included, mode) {
  if (mode !== "closest" && mode !== "farthest") {
    throw new Error('Invalid Input. Mode is: ' + mode + ' but has to be "closest" or "farthest"');
  }

  let minOrMax = Number.MAX_VALUE; // min
  if (mode === "farthest") {
    minOrMax = Number.MIN_VALUE; // max
  }

  let curClosestOrFarthest = null;

  for (let node of graph.getNodes()) {
    if (included[node.index]) {
      continue;
    }

    let dist = distance(curNode, node);

    if (mode === "closest") {
      if (dist < minOrMax) {
        minOrMax = dist;
        curClosestOrFarthest = node;
      }
    } else {
      if (dist > minOrMax) {
        minOrMax = dist;
        curClosestOrFarthest = node;
      }
    }
  }

  return curClosestOrFarthest;
}

/**
 * Finds the closest node to a given node from a list of candidates
 * @param {Node} node - Reference node
 * @param {Node[]} nodes - Candidate nodes
 * @returns {Array} [closestDistance, closestNode]
 */
export function findClosestNode(node, nodes) {
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
