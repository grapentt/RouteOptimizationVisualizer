/**
 * Visualization animator for algorithm execution
 * Provides callback-based approach for highlighting nodes and edges during algorithm execution
 */

/**
 * Creates an animator instance for visualizing algorithm steps
 * @param {Object} config - Configuration object
 * @param {Function} config.onHighlightNode - Callback to highlight a node (node, color)
 * @param {Function} config.onHighlightEdge - Callback to highlight an edge (from, to, color)
 * @param {Function} config.onAddEdge - Callback to add an edge (from, to, weight)
 * @param {Function} config.getDelay - Function to get current delay value
 * @param {Function} config.isPlaying - Function to check if animation is playing
 * @returns {Object} Animator instance with helper methods
 */
export function createAnimator(config) {
  const {
    onHighlightNode,
    onHighlightEdge,
    onAddEdge,
    getDelay,
    isPlaying,
  } = config;

  /**
   * Waits for the specified amount of time, respecting pause state
   * @param {number} ms - Milliseconds to wait
   */
  async function delay(ms) {
    const delayTime = ms || getDelay();
    await new Promise(resolve => setTimeout(resolve, delayTime));

    // Wait while paused
    while (!isPlaying()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Highlights a node with the specified color
   * @param {Node} node - Node to highlight
   * @param {string} color - Color to use for highlighting
   */
  function highlightNode(node, color) {
    if (onHighlightNode) {
      onHighlightNode(node, color);
    }
  }

  /**
   * Highlights an edge with the specified color
   * @param {Node} from - Starting node
   * @param {Node} to - Ending node
   * @param {string} color - Color to use for highlighting
   */
  function highlightEdge(from, to, color) {
    if (onHighlightEdge) {
      onHighlightEdge(from, to, color);
    }
  }

  /**
   * Adds an edge to the graph
   * @param {Node} from - Starting node
   * @param {Node} to - Ending node
   * @param {number} weight - Edge weight
   */
  function addEdge(from, to, weight) {
    if (onAddEdge) {
      onAddEdge(from, to, weight);
    }
  }

  /**
   * Resets all node colors to default
   * @param {Node[]} nodes - Array of nodes to reset
   * @param {string} defaultColor - Default color to use
   */
  function resetNodeColors(nodes, defaultColor = '#fff') {
    nodes.forEach(node => {
      if (onHighlightNode) {
        onHighlightNode(node, defaultColor);
      }
    });
  }

  /**
   * Resets all edge colors to default
   * @param {Edge[]} edges - Array of edges to reset
   * @param {string} defaultColor - Default color to use
   */
  function resetEdgeColors(edges, defaultColor = 'black') {
    edges.forEach(edge => {
      if (onHighlightEdge) {
        onHighlightEdge(edge.from, edge.to, defaultColor);
      }
    });
  }

  return {
    delay,
    highlightNode,
    highlightEdge,
    addEdge,
    resetNodeColors,
    resetEdgeColors,
  };
}
