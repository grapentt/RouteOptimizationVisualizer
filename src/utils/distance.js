/**
 * Calculates the Euclidean distance between two nodes
 * @param {Node} node1 - First node
 * @param {Node} node2 - Second node
 * @returns {number} The Euclidean distance between the two nodes
 * @throws {Error} If either node is null or undefined
 */
export function distance(node1, node2) {
  if (!node1 || !node2) {
    throw new Error('Both nodes must be defined for distance calculation');
  }

  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the total distance of a path through nodes
 * @param {Node[]} nodes - Array of nodes representing a path
 * @returns {number} Total distance of the path
 */
export function pathDistance(nodes) {
  if (!nodes || nodes.length < 2) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < nodes.length - 1; i++) {
    total += distance(nodes[i], nodes[i + 1]);
  }

  return total;
}

/**
 * Calculates the distance of a complete tour (includes return to start)
 * @param {Node[]} nodes - Array of nodes representing a tour
 * @returns {number} Total distance of the tour
 */
export function tourDistance(nodes) {
  if (!nodes || nodes.length < 2) {
    return 0;
  }

  let total = pathDistance(nodes);
  // Add distance back to start
  total += distance(nodes[nodes.length - 1], nodes[0]);

  return total;
}
