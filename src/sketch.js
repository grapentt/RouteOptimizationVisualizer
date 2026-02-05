import {Graph} from './core/Graph.js';
import {Node} from './core/Node.js';
import {Edge} from './core/Edge.js';
import {Edmonds} from './algorithms/utils/blossom.js';
import {distance} from './utils/distance.js';
import {createNearestNeighbor} from './algorithms/construction/nearestNeighbor.js';
import {createInsertion} from './algorithms/construction/insertion.js';
import {createNearestNeighborImproved} from './algorithms/construction/nearestNeighborImproved.js';
import {createBruteForce} from './algorithms/construction/bruteForce.js';
import {createTwoOpt} from './algorithms/improvement/twoOpt.js';
import {createThreeOpt} from './algorithms/improvement/threeOpt.js'; 

let WIDTH = window.innerWidth; //"static variables" like in java
let HEIGHT = window.innerHeight *3/ 5;
let speed = 5; 

let startNode = new Node(WIDTH / 2, HEIGHT / 2, 0);
let count = 1; //count the nodes
let graph = new Graph(0);
let totalGraph = new Graph(0);
let startDefined = false;
let isPlaying = true;
let eulerCycle = [];

const sketch = (p) => {

  let addingNodes = false;
  let setIsPlaying = p.setIsPlaying;

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
  };

  p.windowResized = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight *3/5;
    p.resizeCanvas(WIDTH, HEIGHT);
  }

  p.draw = async () => {
    p.background(220);
    // Draw nodes
    p.fill("#fff");
    p.circle(p.mouseX, p.mouseY, 10);
    if (startDefined) {
      let nodes = graph.getNodes();
      for (let node of nodes) {
        if (node.color)
          p.fill(node.color);
        else
          p.fill("#fff");
        p.circle(node.x, node.y, 10);
      }
      drawEdges(p);
    }
    p.fill(255, 0, 200);
    p.circle(startNode.x, startNode.y, 10);

    // Command execution is handled in updateWithProps, not here
    // This keeps draw loop simple and predictable
  };


  function anyNodeHasNeighbors() {
    return graph.E > 0;
  }


  function drawEdges(p) {
    //displayNeihbors(startNode);
    if (anyNodeHasNeighbors()) {
      let edges = graph.getEdges();
      for (let e of edges) {
        if (e.color) {
          p.stroke(e.color);
        }
        else 
          p.stroke('black');
        let v1 = e.either();
        let v2 = e.other(v1);
        let x1 = v1.x;
        let y1 = v1.y;
        let x2 = v2.x;
        let y2 = v2.y;
        p.line(x1, y1, x2, y2);
      }
    }
  }

  // async function waitForIsPlaying() {
  //   if (isPlaying)
  //     return;
  //   delay(1000);
  //   await waitForIsPlaying();
  // }

  async function waitForIsPlaying() {
    return new Promise(resolve => {
      function checkIsPlaying() {
        if (isPlaying) {
          resolve();
        } else {
          setTimeout(checkIsPlaying, 300);
        }
      }
      checkIsPlaying();
    });
  }
  

  function removeAllEdges() {
    let tempGraph = new Graph(0);
    for (let node of graph.getNodes()) {
      tempGraph.addVertex(node);
    }
    graph = tempGraph;
    totalGraph = new Graph(0);
  }


  
  p.mouseClicked = async () => {
    if (addingNodes) 
      addNodes(p);
    //the algorithm updates the paths that p.draw() displays
  };

  /**
   * Adding nodes to canvas
   * @param {}
   */
  function addNodes(p) {
    if (!startDefined) {
      graph.addVertex(startNode);
      startDefined = true;
    }
    p.loop();
    //if Y is smaller than HEIGHT, the click was outside of canvas (probably on button) and the don't add
    if (p.mouseY < HEIGHT && p.mouseY > 0) {
      let node = new Node(p.mouseX, p.mouseY, count++);
      graph.addVertex(node);

      // Notify React that a node was added
      if (callbacks.onNodeAdded) {
        callbacks.onNodeAdded();
      }
    }
  }

    // Command-based props handler
    let lastProcessedCommand = null;
    let callbacks = {
      onConstructionComplete: null,
      onLocalSearchComplete: null,
      onClearComplete: null,
      onRemoveEdgesComplete: null,
      onNodeAdded: null
    };

    p.updateWithProps = async function (newProps) {
      // Store callbacks
      callbacks.onConstructionComplete = newProps.onConstructionComplete;
      callbacks.onLocalSearchComplete = newProps.onLocalSearchComplete;
      callbacks.onClearComplete = newProps.onClearComplete;
      callbacks.onRemoveEdgesComplete = newProps.onRemoveEdgesComplete;
      callbacks.onNodeAdded = newProps.onNodeAdded;

      // Update regular props
      setIsPlaying = newProps.setIsPlaying;
      addingNodes = newProps.addingNodes;
      isPlaying = newProps.isPlaying;
      // algo and localSearch are received via props but not used in sketch
      // The command-based architecture handles algorithm selection in React
      if (newProps.speed) speed = newProps.speed;
      if (speed === 0) speed = 0.0001;

      // Handle commands
      const cmd = newProps.sketchCommand;
      if (cmd && cmd.timestamp !== lastProcessedCommand) {
        lastProcessedCommand = cmd.timestamp;

        if (cmd.type === 'runConstructionAlgorithm') {
          await executeConstructionAlgorithm(cmd.algorithm);
        } else if (cmd.type === 'runLocalSearch') {
          await executeLocalSearch(cmd.algorithm);
        } else if (cmd.type === 'removeEdges') {
          executeRemoveEdges();
        } else if (cmd.type === 'clearBoard') {
          executeClearBoard();
        }
      }

      p.loop();
    };

    // Command execution functions
    async function executeConstructionAlgorithm(algorithm) {

      // Clear existing edges
      removeAllEdges();

      // Reset node colors
      let nodes = graph.getNodes();
      for (let node of nodes) {
        node.color = '#fff';
      }

      setIsPlaying(true);
      isPlaying = true;

      // Run the algorithm
      switch(algorithm) {
        case 'Nearest Insertion':
          await insertionExtracted("nearest");
          break;
        case 'Farthest Insertion':
          await insertionExtracted("farthest");
          break;
        case 'Nearest Neighbor':
          await nearestNeighborExtracted(startNode, new Array(graph.V).fill(false), false);
          break;
        case 'Nearest Neighbor Look Ahead (made up)':
          await nearestNeighborImprovedExtracted();
          break;
        case 'Brute Force':
          await bruteForceExtracted(startNode, new Array(graph.V).fill(false), 0);
          break;
        case 'Cluster naively':
          await clusterNaively();
          break;
        case 'Christofides':
          await christofides();
          break;
        default:
      }

      setIsPlaying(false);
      isPlaying = false;

      if (callbacks.onConstructionComplete) {
        callbacks.onConstructionComplete();
      }
    }

    async function executeLocalSearch(algorithm) {

      setIsPlaying(true);
      isPlaying = true;

      switch (algorithm) {
        case '2-opt':
          await twoOptExtracted();
          break;
        case '3-opt':
          await threeOptExtracted();
          break;
        default:
      }

      setIsPlaying(false);
      isPlaying = false;

      if (callbacks.onLocalSearchComplete) {
        callbacks.onLocalSearchComplete();
      }
    }

    function executeRemoveEdges() {

      // Clear all edges but keep nodes
      removeAllEdges();

      // Reset node colors
      let nodes = graph.getNodes();
      for (let node of nodes) {
        node.color = '#fff';
      }

      if (callbacks.onRemoveEdgesComplete) {
        callbacks.onRemoveEdgesComplete();
      }
    }

    function executeClearBoard() {
      startNode = new Node(WIDTH / 2, HEIGHT / 2, 0);
      count = 1;
      graph = new Graph(0);
      startDefined = false;
      totalGraph = new Graph(0);

      if (callbacks.onClearComplete) {
        callbacks.onClearComplete();
      }
    }

async function delay(time) {
  await waitForIsPlaying();
  return new Promise(resolve => setTimeout(resolve, time/speed));
}
    /**
     * Find the closest node to a given node from a list of nodes
     * @param {Node} node
     * @param {Node[]} nodes
     * @returns {Array} [closestDist, closestNode]
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

    function removeEdge(node1, node2) {
      graph.removeEdge(node1, node2);
    }

    /**
     * Adds an edge between the node node1 and node2 that have to exist in the graph
     * @param {Node} node1 
     * @param {Node} node2
     */
    function addEdge (node1, node2, weight) {
      if (node1.index ===node2.index)
        throw new Error('nodes cannot be the same');
      graph.addEdge(node1, node2, weight);
    }

    // =============================================
    // EXTRACTED ALGORITHMS - Create instances with context access
    // =============================================

    // Create context object that algorithms can access
    const algorithmContext = {
      get graph() { return graph; },
      set graph(value) { graph = value; },
      get startNode() { return startNode; },
      addEdge,
      removeEdge,
      delay,
      waitForIsPlaying,
      findNode,
      getNonIncludedNodes,
      getIncludedNodes,
      calculateTravelTime,
      getPath,
      get nearestNeighbor() { return nearestNeighborExtracted; },
    };

    // Create algorithm instances
    const nearestNeighborExtracted = createNearestNeighbor(algorithmContext);
    const insertionExtracted = createInsertion(algorithmContext);
    const nearestNeighborImprovedExtracted = createNearestNeighborImproved({
      ...algorithmContext,
      nearestNeighbor: nearestNeighborExtracted,
    });
    const bruteForceExtracted = createBruteForce(algorithmContext);
    const twoOptExtracted = createTwoOpt(algorithmContext);
    const threeOptExtracted = createThreeOpt(algorithmContext);

    // =============================================
    // HELPER FUNCTIONS & LEGACY ALGORITHMS
    // =============================================
    // Note: christofides() and clusterNaively() remain here
    // They use complex helper functions that haven't been extracted yet

    async function calculateTravelTime(start) {
      let time = 0;
      let V = graph.V;
      let included = new Array(V).fill(false);
      included[startNode.index] = true;
      let curNode = startNode;
      //adding all nodes
      for (let i = 0; i<graph.V-1; ++i) {
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

    function getNonIncludedNodes(included) {
      let out = [];
      for (let v of graph.getNodes()) {
        if (!included[v.index])
          out.push(v);
      }
      return out;
    }

    function getIncludedNodes(included) {
      let out = [];
      for (let v of graph.getNodes()) {
        if (included[v.index])
          out.push(v);
      }
      return out;
    }


    /**
     * This method finds the closest or farthets Node to curNode, 
     * that is not yet inclueded (true in the included array). The 
     * mode decides if we find closest or farthets and has to be
     * "closest" or "farthsest".
     * @param {*} curNode 
     * @param {*} included 
     * @param {string} mode
     * @returns 
     */
    function findNode(curNode, included, mode) {
      if (mode !=="closest" && mode !=="farthest")
        throw new Error('Invalid Input. Mode is: ' + mode + ' but has to be "closest" or "farthest"');
      let minOrMax = Number.MAX_VALUE; //min
      if (mode ==="farthest")
        minOrMax = Number.MIN_VALUE; //max
      let curClosestOrFarthest = null;
      for (let node of graph.getNodes()) {
        if (included[node.index])
          continue;
        let dist = distance(curNode, node);
        //let dist = graph.findEdge(curNode, node).weight;
        if (mode ==="closest") {
          if (dist < minOrMax) {
            minOrMax = dist;
            curClosestOrFarthest = node;
          }
        }
        else {
          if (dist > minOrMax) {
            minOrMax = dist;
            curClosestOrFarthest = node;
          }
        }
      }
      return curClosestOrFarthest;
    }


    async function christofides() {
      await computeMST();


      let nodesWithOddDegree = getNodesWithOddDegree(graph);  

      for (var node of nodesWithOddDegree) {
        node.color = "#ae2a0d";
      }
      // await delay(15000);
      await findPerfectMatchingMinWeight(nodesWithOddDegree);
      for (let node of nodesWithOddDegree) {
        node.color = "#fff";
      }
      await findEulerianCycle();
    
      // for (node of eulerCycle) {
      //   console.log(node.index+  "-");
      // }
      let included = new Array(graph.V).fill(false);
      var curNode = eulerCycle.pop();
      var temp = curNode;
      // we have to go back to this one in the end
      var first = curNode;
      included[curNode.index] = true;
      while (eulerCycle.length > 0) {
        await waitForIsPlaying();
        curNode = eulerCycle.pop();
        if (!included[curNode.index]) {
          included[curNode.index] = true;
          addEdge(temp, curNode, distance(temp, curNode));
          temp = curNode;
        }
      }

      addEdge(temp, first, distance(curNode, first));
      // let edge = new Edge(nodesWithOddDegree[0], nodesWithOddDegree[1], distance(nodesWithOddDegree[0], nodesWithOddDegree[1]));
      // //console.log('there are nodes with odd degree: ' + nodesWithOddDegree.length);
      // edge.color = 255;
      // graph.addEdgeFromEdge(edge);

      for (let node of nodesWithOddDegree) {
        node.color = "#fff";
      }
      
    }

    async function findEulerianCycle() {
      await waitForIsPlaying();
      // Find a vertex with odd degree
      let v = graph.getNodes()[0];
      for (var node of graph.getNodes()) {
        if (graph.getNeighbors(node).length % 2===1) {
          v = node;
          break;
        }
      }
      // Print tour starting from oddv
      await printEulerUtil(v);
    
    }

    async function printEulerUtil(v) {
      await waitForIsPlaying();
      eulerCycle.push(v);

      //Print Euler tour starting from vertex u
    
      // Recur for all the vertices adjacent to
      // this vertex
      for (let node of graph.getNeighbors(v)) {
        await delay(500);
        // If edge u-v is not removed and it's a
        // valid next edge
        if (await isValidNextEdge(v, node)) {
          graph.removeEdge(v, node);
          await printEulerUtil(node);
          break;
        }
      }
    }


    // The function to check if edge u-v can be considered
    // as next edge in Euler Tout
    async function isValidNextEdge(u, v) {
      // The edge u-v is valid in one of the following
      // two cases:
      // 1) If v is the only adjacent vertex of u
      let count = graph.getNeighbors(u).length; 
      if (count ===1) 
        return true;

      // 2) If there are multiple adjacents, then u-v
      //    is not a bridge
      // Do following steps to check if u-v is a bridge
      
      // 2.a) count of vertices reachable from u
      let visited = new Array(graph.V);
      visited.fill(false);
      let count1 = await DFSCount(u, visited);
      
      // 2.b) Remove edge (u, v) and after removing
      // the edge, count vertices reachable from u
      graph.removeEdge(u, v);
      visited.fill(false);
      let count2 = await DFSCount(u, visited);

      // 2.c) Add the edge back to the graph
      graph.addEdge(u, v, distance(u, v));
      // 2.d) If count1 is greater, then edge (u, v)
      // is a bridge
      return count1 > count2 ? false : true;
    }


    async function DFSCount(v, visited) {
      // Mark the current node as visited
      visited[v.index] = true;
      let count = 1;
      
      // Recur for all vertices adjacent to this vertex
      
      for (let node of graph.getNeighbors(v)) {
        if (!visited[node.index]) 
          count += await DFSCount(node, visited);
      }
      return count;
      //min-cost-max matching is harder than I thought...
      
    }

    /**
     * 
     * @param {Node} {even number of nodes} 
     */
    async function findPerfectMatchingMinWeight(nodes) {
      var edmondsEdges = [];
      for (var i = 0; i< nodes.length-1; ++i) {
        for (var j = i+1; j < nodes.length; ++j) {
          await waitForIsPlaying();
          var v = nodes[i];
          var w = nodes[j];
          var weight = distance(v, w);
          edmondsEdges.push([v.index, w.index, - weight])
        }
      }
      var edmonds = new Edmonds(edmondsEdges);

      var result = edmonds.maxWeightMatching();


      for (let i = 0; i < result.length; ++i) {
        let indexV = i;
        let indexW = result[i];
        let v2 = graph.getNodes().find(node => node.index === indexV);
        let w2 = graph.getNodes().find(node => node.index === indexW);
        if (indexV < indexW) {
          addEdge(v2, w2, distance(v2, w2));
        }
      }
    } 


    function getNodesWithOddDegree(g) {
      let out = [];
      for (let node of g.getNodes()) {
        if (g.getNeighbors(node).length % 2 ===1){
          out.push(node);
        }
      }
      return out;
    }

    /**
     * Computes MST from the global variable totalGraph, that we also initialize here
     */
    async function computeMST() {
      //first fill total graph if not already done
      fillTotalGraph();
      let distTo = new Array(graph.V).fill(Number.MAX_VALUE);
      let included = new Array(graph.V).fill(false);
      distTo[startNode.index] = 0;
      included[startNode.index] = true;
      updateDistances(startNode, distTo);
      //adding V nodes to MST
      for (let i = 0; i< graph.V-1; ++i) {
        await waitForIsPlaying();
        let node = shortestAddableNodeToIncluded(distTo, included);
        let [weight, root] = findClosestNode(node, getIncludedNodes(included));
        addEdge(root, node, weight);
        included[node.index] = true;
        updateDistances(node, distTo);
        graph.printGraph();
        await delay(300);
      }
    }

    function updateDistances(node, distTo) {
      let neighbors = totalGraph.getNeighbors(node);
      neighbors.forEach(v => {
        distTo[v.index] = totalGraph.findEdge(v, node).weight;
      });
    }

    /**
     * This function returns a node and the edge connecting this node
     * with one that is included such that the weight is minimal.
     * @param {double[]} distTo 
     * @param {boolean[]} included 
     */
    function shortestAddableNodeToIncluded(distTo, included) {
      let nonIncludedNodes = getNonIncludedNodes(included);
      let closestDist = Number.MAX_VALUE;
      let closestNode = null;
      for (let node of nonIncludedNodes) {
        if (distTo[node.index] < closestDist) {
          closestDist = distTo[node.index];
          closestNode = node;
        }
      }
      return closestNode;
    }

    /**
     * Creates a total graph (edges between all nodes)
     */
    function fillTotalGraph() {
      if (totalGraph.V ===0) {
        let nodes = graph.getNodes();
        let allNodesAdded = false;
        for (let i = 0; i < nodes.length; ++i) {
          if (!allNodesAdded)
            totalGraph.addVertex(nodes[i]);
          for (let j = i+1; j< nodes.length; ++j) {
            if (!allNodesAdded) 
              totalGraph.addVertex(nodes[j]);
            let weight = distance(nodes[i], nodes[j]);
            let edge = new Edge(nodes[i], nodes[j], weight);
            totalGraph.addEdgeFromEdge(edge);
          }
          if (!allNodesAdded) 
            allNodesAdded = true;
        }
      }
    }

    function getPath() {
      let path = [];
      let visited = new Array(graph.V).fill(false);
      let cur = startNode;
      for (var i = 0; i < graph.V; ++i) {
        path.push(cur);
        visited[cur.index] = true;
        // get both neighbors
        var neighbors = graph.getNeighbors(cur);
        cur = visited[neighbors[0].index] ? neighbors[1] : neighbors[0]; 
      }
      path.push(startNode);
      // for (let node of path) {
      //   console.log(node.index + "-");
      // }
      return path;
    }







    /**
     * 
     * @param {number of clusters} k 
     */
    async function clusterNaively(k) {
      fillTotalGraph();
      let nodesPerCluster = totalGraph.V/k;
      let edges = totalGraph.getEdges();
      edges.sort((e1, e2) => (e1.weight >= e2.weight) ? 1 : -1);
      //add small edges to cluster, if it doesn't exceed its size (size is naively n/k)
      for (let e of edges) {
        await delay(1000);    
        let v1 = e.either();
        let v2 = e.other(v1);  
        //case 1, both nodes not included
        if (!v1.root && !v2.root) {
          v2.root = v1;
          v1.isRoot = true;
          v1.children = 1;
          addEdge(v1, v2, e.weight);
          continue;
        }
        if ((v1.isRoot && !v2.root) || (v1.root && !v2.root)) {
            if (v1.isRoot) {
              if (v1.children + 1 < nodesPerCluster) {
                v2.root = v1;
                v1.children++;
              }
            }
            else {
              v2.root = v1.root; 
              v1.root.children++;
            }
            addEdge(v1, v2, e.weight);
            continue;
          }
        if ((v2.isRoot && !v1.root) || (v2.root && !v1.root)) {
          if (v2.root.children + 1 < nodesPerCluster) {
            v1.root = v2.root;
            v2.root.children++;
            addEdge(v1, v2, e.weight);
          }
          continue;
        }
        if (v1.root && v2.root) {
          if (v1.root.children + 1 + v2.root + 1 < nodesPerCluster) {
            let temp = v1.root.children + 1;
            v1.root = v2.root;
            v2.root.children += temp;
            addEdge(v1, v2, e.weight);
          }
          continue;
        }
      }

    }

    

}

export default sketch;