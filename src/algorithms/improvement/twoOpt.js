import { distance } from '../../utils/distance.js';
import { Edge } from '../../core/Edge.js';

/**
 * Creates a 2-opt local search algorithm instance
 * Iteratively removes edge crossings to improve tour quality
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Function} context.removeEdge - Function to remove edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.getPath - Get current tour path
 * @returns {Function} Async 2-opt algorithm
 */
export function createTwoOpt(context) {
  const {
    delay,
    waitForIsPlaying,
    removeEdge,
    getPath,
  } = context;

  /**
   * Performs a 2-opt swap at positions i and j
   * @param {Node[]} path - Current tour path
   * @param {number} i - First position
   * @param {number} j - Second position
   */
  async function do2Opt(path, i, j) {
    // Highlight affected nodes
    path[i].color = "#0f61e8";
    path[i + 1].color = "#0f61e8";
    path[j].color = "#0f61e8";
    path[j + 1].color = "#0f61e8";

    // Highlight old edges
    let oldEdge1 = context.graph.findEdge(path[i], path[i + 1]);
    let oldEdge2 = context.graph.findEdge(path[j], path[j + 1]);
    oldEdge1.color = "#0f61e8";
    oldEdge2.color = "#0f61e8";
    await waitForIsPlaying();

    await delay(2000);

    // Create and highlight new edges
    let newEdge1 = new Edge(path[i], path[j], distance(path[i], path[j]));
    newEdge1.color = "#ae2a0d";
    let newEdge2 = new Edge(path[i + 1], path[j + 1], distance(path[i + 1], path[j + 1]));
    newEdge2.color = "#ae2a0d";
    await waitForIsPlaying();

    await delay(2000);
    context.graph.addEdgeFromEdge(newEdge1);
    context.graph.addEdgeFromEdge(newEdge2);
    await waitForIsPlaying();

    await delay(2000);
    removeEdge(path[i], path[i + 1]);
    removeEdge(path[j], path[j + 1]);
    await waitForIsPlaying();

    await delay(2000);

    // Reset edge colors
    newEdge1.color = "#000000";
    newEdge2.color = "#000000";

    // Reset node colors
    path[i].color = "#fff";
    path[i + 1].color = "#fff";
    path[j].color = "#fff";
    path[j + 1].color = "#fff";
  }

  /**
   * 2-opt local search algorithm
   * Repeatedly finds and applies improving 2-opt swaps
   *
   * @returns {Promise<void>}
   */
  return async function twoOpt() {
    let foundImprovement = true;
    let path = getPath();
    let n = path.length;

    while (foundImprovement) {
      foundImprovement = false;

      for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
          await waitForIsPlaying();

          // Calculate gain from swapping edges
          var gain = -distance(path[i], path[j]);
          gain -= distance(path[i + 1], path[j + 1]);
          gain += distance(path[i], path[i + 1]);
          gain += distance(path[j], path[j + 1]);

          // If improvement found, apply it
          if (gain > 1e-4) {
            await do2Opt(path, i, j);
            foundImprovement = true;
            path = getPath();
          }
          gain = 0;
        }
      }
    }
  };
}
