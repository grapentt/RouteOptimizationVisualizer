import { distance } from '../../utils/distance.js';
import { Edge } from '../../core/Edge.js';

/**
 * Creates a 3-opt local search algorithm instance
 * More powerful than 2-opt, examines three edge swaps
 * Factory function that returns the algorithm with access to sketch context
 *
 * @param {Object} context - Sketch context
 * @param {Graph} context.graph - The graph to operate on
 * @param {Function} context.removeEdge - Function to remove edges
 * @param {Function} context.delay - Async delay function
 * @param {Function} context.waitForIsPlaying - Wait for play state
 * @param {Function} context.getPath - Get current tour path
 * @returns {Function} Async 3-opt algorithm
 */
export function createThreeOpt(context) {
  const {
    delay,
    waitForIsPlaying,
    removeEdge,
    getPath,
  } = context;

  /**
   * Calculates the length of a 3-opt wiring configuration
   * @param {Node[]} wiring - Array of 6 nodes representing 3 edges
   * @returns {number} Total length of the three edges
   */
  function length3OptWiring(wiring) {
    let length = 0;
    for (let i = 0; i < 6; i += 2) {
      length += distance(wiring[i], wiring[i + 1]);
    }
    return length;
  }

  /**
   * Finds the best 3-opt reconnection and applies it if better
   * @param {Node[]} path - Current tour path
   * @param {number} i - First edge position
   * @param {number} j - Second edge position
   * @param {number} k - Third edge position
   * @returns {Promise<number>} Gain from applying best reconnection
   */
  async function gainOfBest3OptWiring(path, i, j, k) {
    // Extract the 6 nodes involved in the 3-opt move
    let a = path[i];
    let b = path[i + 1];
    let c = path[j];
    let d = path[j + 1];
    let e = path[k];
    let f = path[k + 1];

    // All possible 3-opt reconnections
    // See: http://tsp-basics.blogspot.com/2017/03/3-opt-move.html
    let w0 = [a, b, c, d, e, f]; // Original wiring
    let w1 = [a, b, c, e, d, f];
    let w2 = [a, c, b, d, e, f];
    let w3 = [a, c, b, e, d, f];
    let w4 = [a, d, e, b, c, f];
    let w5 = [a, d, e, c, b, f];
    let w6 = [a, e, d, b, c, f];
    let w7 = [a, e, d, c, b, f];

    let alternativeOptions = [w1, w2, w3, w4, w5, w6, w7];
    let shortestWiring = w0;
    let originalLength = length3OptWiring(w0);
    let shortestLength = originalLength;

    // Find the best alternative reconnection
    for (let option of alternativeOptions) {
      await waitForIsPlaying();
      let length = length3OptWiring(option);
      if (shortestLength > length) {
        shortestLength = length;
        shortestWiring = option;
      }
    }

    // If improvement found, visualize and apply it
    if (originalLength > shortestLength) {
      // Highlight affected nodes
      a.color = "#0f61e8";
      b.color = "#0f61e8";
      c.color = "#0f61e8";
      d.color = "#0f61e8";
      e.color = "#0f61e8";
      f.color = "#0f61e8";

      // Highlight old edges
      let oldEdge1 = context.graph.findEdge(a, b);
      oldEdge1.color = "#0f61e8";
      let oldEdge2 = context.graph.findEdge(c, d);
      oldEdge2.color = "#0f61e8";
      let oldEdge3 = context.graph.findEdge(e, f);
      oldEdge3.color = "#0f61e8";
      await delay(2000);

      // Create and highlight new edges
      let newEdge1 = new Edge(shortestWiring[0], shortestWiring[1], distance(shortestWiring[0], shortestWiring[1]));
      let newEdge2 = new Edge(shortestWiring[2], shortestWiring[3], distance(shortestWiring[2], shortestWiring[3]));
      let newEdge3 = new Edge(shortestWiring[4], shortestWiring[5], distance(shortestWiring[4], shortestWiring[5]));
      newEdge1.color = "#ae2a0d";
      newEdge2.color = "#ae2a0d";
      newEdge3.color = "#ae2a0d";

      context.graph.addEdgeFromEdge(newEdge1);
      context.graph.addEdgeFromEdge(newEdge2);
      context.graph.addEdgeFromEdge(newEdge3);
      await delay(2000);

      // Remove old edges
      removeEdge(a, b);
      removeEdge(c, d);
      removeEdge(e, f);
      await delay(1000);

      // Reset edge colors
      newEdge1.color = "#000000";
      newEdge2.color = "#000000";
      newEdge3.color = "#000000";

      // Reset node colors
      a.color = "#fff";
      b.color = "#fff";
      c.color = "#fff";
      d.color = "#fff";
      e.color = "#fff";
      f.color = "#fff";
    }

    return originalLength - shortestLength;
  }

  /**
   * 3-opt local search algorithm
   * Repeatedly finds and applies improving 3-opt moves
   *
   * @returns {Promise<void>}
   */
  return async function threeOpt() {
    let foundImprovement = true;
    let path = getPath();
    let n = path.length;

    while (foundImprovement) {
      foundImprovement = false;

      for (let i = 0; i < n - 3; ++i) {
        for (let j = i + 1; j < n - 2; ++j) {
          for (let k = j + 1; k < n - 1; ++k) {
            await waitForIsPlaying();

            // Calculate gain from best 3-opt reconnection
            var gain = await gainOfBest3OptWiring(path, i, j, k);

            // If improvement found
            if (gain > 1e-4) {
              foundImprovement = true;
              path = getPath();
            }
            gain = 0;
          }
        }
      }
    }
  };
}
