/**
 * Graph helper utilities for working with node inclusion/exclusion
 */

/**
 * Gets all nodes that are not yet included in the tour
 * @param {Graph} graph - The graph instance
 * @param {boolean[]} included - Array tracking which nodes are included
 * @returns {Node[]} Array of non-included nodes
 */
export function getNonIncludedNodes(graph, included) {
  const out = [];
  for (let v of graph.getNodes()) {
    if (!included[v.index]) {
      out.push(v);
    }
  }
  return out;
}

/**
 * Gets all nodes that are included in the tour
 * @param {Graph} graph - The graph instance
 * @param {boolean[]} included - Array tracking which nodes are included
 * @returns {Node[]} Array of included nodes
 */
export function getIncludedNodes(graph, included) {
  const out = [];
  for (let v of graph.getNodes()) {
    if (included[v.index]) {
      out.push(v);
    }
  }
  return out;
}
