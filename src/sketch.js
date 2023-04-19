import {Graph} from './Graph.js';
import {Node} from './Node.js';
import {Edge} from './Edge.js';
import {Edmonds} from './Blossom.js'; 

let WIDTH = window.innerWidth; //"static variables" like in java
let HEIGHT = window.innerHeight *3/ 5;
let speed = 5; 

let startNode = new Node(WIDTH / 2, HEIGHT / 2, 0);
let count = 1; //count the nodes
let graph = new Graph(0);
let totalGraph = new Graph(0);
let startDefined = false;
let algo = "Not Defined";
let eulerCycle = [];

const sketch = (p) => {

  let addingNodes = false;
  let isRunning = false;
  let clearingBoard = false;
  //let algoFinished = false;


  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
  };

  p.windowResized = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight *3/5;
    p.resizeCanvas(WIDTH, HEIGHT);
  }

  p.draw = async () => {
    console.log("props are: addingNodes " + addingNodes + " isRunnung: " + isRunning);
    p.background(220);
    //draw the nodes
    //mouse position and already added nodes white
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
      //draw edges 
      drawEdges(p);
    }
     //start node pink
     p.fill(255, 0, 200);
     p.circle(startNode.x, startNode.y, 10);

     if (isRunning) {
      isRunning = false;
      console.log("hi, cur algo is: " + algo);
      switch(algo) {
        case 'Nearest Insertion':
          await insertion("nearest");
          break;
          case 'Farthest Insertion':
            await insertion("farthest");
            break;
          case 'Nearest Neighbor':
            await nearestNeighbor(startNode, new Array(graph.V).fill(false), false);
            break;
          case 'Nearest Neighbor Look Ahead (made up)':
            await nearestNeighborImproved();
            break;
          case 'Brute Force':
            await bruteForce(startNode, new Array(graph.V).fill(false), 0);
            break;
          case 'Cluster naively':
            await clusterNaively();
            break;
          case 'Christofides':
            await christofides();
            break;
          default:
            isRunning = false;
      }
      isRunning = false;
            //christofides();
    }

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


  function removeAllEdges() {
    let tempGraph = new Graph(0);
    for (let node of graph.getNodes())
      tempGraph.addVertex(node);
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
    }
  }

    //this function "sends" data/additional parameters to our function. When ever the props change, the change is passed here
    p.updateWithProps = function (newProps) {
      if (newProps.removeEdges) {
        removeAllEdges();
      }
      addingNodes = newProps.addingNodes;
      isRunning = newProps.isRunning;
      clearingBoard = newProps.clearinBoard;
      if (clearingBoard) {
        startNode = new Node(WIDTH / 2, HEIGHT / 2, 0, []);
        count = 1; //count the nodes
        graph = new Graph(0);
        startDefined = false;
        totalGraph = new Graph(0);
      }
      if (!newProps.algo !== algo)
        algo = newProps.algo;
      if (!newProps.speed !== speed) 
        speed = newProps.speed;
      if (speed == 0)
        speed = 1;
      //whenever a prop changes we start the loop again (it's only stopped after the path got displayed)
      p.loop();
    }
/*
    async function runAlgorithm() {
      for (let i = 0; i < nodes.length; ++i) {
        adj[i] = nodes[i];
      }
      adj[nodes.length] = nodes[0];
    }
*/

    async function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time/speed));
    }
    
    
    function displayNodes() {
      graph.printGraph();
    }

    /**
     * Mode has to be "nearest" or "farthest" and decides
     * whether we run nearestInsertion or farthestInsertion.
     * @param {string} mode 
     */
    async function insertion(mode) {
      //add the startNode
      let toAdd = startNode;
      var included = new Array(graph.V).fill(false);
      included[toAdd.index] = true;

      //add the first node
      let node = null;
      switch(mode) {
        case "nearest":
          node = findNode(startNode, included, "closest");
          break;
        case "farthest":
          node = findNode(startNode, included, "farthest");
          break;
        default:

      }
      addEdge(startNode, node, euclidDistance(startNode, node));
      included[node.index] = true;
      await delay(1000);

      //the second node is inserted slightly different than the remaining ones
      let arr = null;
      switch(mode) {
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
      addEdge(root, toAdd, euclidDistance(root, toAdd));
      addEdge(followUp, toAdd, euclidDistance(followUp, toAdd));
      included[toAdd.index] = true;
      await delay(1000);

      //we know how many nodes well have to add, so for loop
      for (let i = 0; i< graph.V-3; ++i) {
        let arr = null;
        switch(mode) {
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
        //remove edge between root and followUp
        removeEdge(root, followUp);
        //mark the three nodes
        toAdd.color = "#ae2a0d";
        root.color = "#0f61e8";
        followUp.color = "#0f61e8";
        await delay(1000);
        //add edges
        addEdge(root, toAdd, euclidDistance(root, toAdd));
        await delay(400);
        addEdge(toAdd, followUp, euclidDistance(toAdd, followUp)); 
        included[toAdd.index] = true;
        await delay(1000);
        toAdd.color = "#fff";
        root.color = "#fff";
        followUp.color = "#fff";
      }
      //algoFinished = true;
    }

    /**
     * 
     * @param {boolean[]} included 
     * @param {string} mode 
     * @returns 
     */
    function findClosestOrFarthestToIncluded(included, mode) {
      if (mode !== "closest" && mode !== "farthest")
        throw('Invalid Input. Mode is: ' + mode + ' but has to be "closest" or "farthest"');

      let curMinOrMax = Number.MAX_VALUE; //min
      if (mode == "farthest") {
        curMinOrMax = Number.MIN_VALUE; //max
      }
      let root = null;
      let closestToRoot = null;
      
      //iterating through all non - included nodes
      let nonIncludedNodes = getNonIncludedNodes(included);
      for (let node of nonIncludedNodes) {
        //and find closest distance to included 
        let [closestDist, potentialRoot] = findClosestNode(node, getIncludedNodes(included));
        //if that cloeset dist is greate than curMax, than the node is considered to be farther from included
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
      let rootEdges = graph.AdjList.get(root);

      let firstRootNeighbor = rootEdges[0].other(root);
      if (rootEdges.length == 1)
        return [root, closestToRoot, firstRootNeighbor];
      let secondRootNeighbor =  rootEdges[1].other(root);
      let newDist1 = euclidDistance(closestToRoot, firstRootNeighbor);
      let newDist2 = euclidDistance(closestToRoot, secondRootNeighbor);
      let oldDist1 = euclidDistance(root, firstRootNeighbor);
      let oldDist2 = euclidDistance(root, secondRootNeighbor);

      if (newDist1 - oldDist1 < newDist2 -oldDist2)
        return [root, closestToRoot, firstRootNeighbor];
      return [root, closestToRoot, secondRootNeighbor];
    }

    /**
     * 
     * @param {Node} node 
     * @param {Node} nodes 
     * @returns [closestDist, closestNode]
     */
    function findClosestNode(node, nodes) {
      let closestNode = null;
      let closestDist = Number.MAX_VALUE;
      for (let v of nodes) {
        let dist = euclidDistance(node, v);
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
      if (node1.index == node2.index)
        throw('nodes cannot be the same');
      graph.addEdge(node1, node2, weight);
    }
    
    /**
     * This function runs nearestNeigbor on the global graph, starting from
     * curNode, only visiting non-included nodes (as given by the included array).
     * The boolean value timeOnlyFromCurNode specifies whether the function returns the
     * total travel time from startNode to startNode, or only from curNode to startNode.
     * @param {Node} curNode 
     * @param {boolean[]} included 
     * @param {boolean} timeOnlyFromCurNode 
     * @returns 
     */
    async function nearestNeighbor(curNode, included, timeOnlyFromCurNode) {
      if (timeOnlyFromCurNode == undefined)
        timeOnlyFromCurNode = false;
      let time = 0;
      //algoFinished = false;
      included[curNode.index] = true;
      //adj.push(curNode);
      let nonIncludedNodes = getNonIncludedNodes(included);
      for (let i = 0; i < nonIncludedNodes.length; ++i) {
        let node = findNode(curNode, included, "closest");
        //add an edge between node and curNode
        let weight = euclidDistance(node, curNode);
        time += weight;
        addEdge(node, curNode, weight);

        curNode = node;
        included[curNode.index] = true;

        //adj.push(curNode);
        await delay(300);
      }
      let weight = euclidDistance(curNode, startNode);
      time += weight;
      addEdge(curNode, startNode, weight);
      await delay(300);
      if (timeOnlyFromCurNode)
        return time;
      return await calculateTravelTime();
      //algoFinished = true;
    }

    
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
     * 
     * @param {Node} curNode 
     * @param {boolean[]} included 
     * @param {double} time 
     * @returns 
     */
    async function bruteForce(curNode, included, time) {
      included[curNode.index] = true;
      let neighbors = getNonIncludedNodes(included);
      if (neighbors.length == 0) {
        let weight = euclidDistance(startNode, curNode);
        addEdge(startNode, curNode, weight);
        return time + weight;
      }
      let minTime = Number.MAX_VALUE;
      let bestNeighbor = null;
      for (let neighbor of neighbors) {
        let includedCopy = JSON.parse(JSON.stringify(included));
        let tempGraph = copyGraph(graph);
        addEdge(curNode, neighbor, euclidDistance(curNode, neighbor));
        await delay(300);
        let finishTime = await bruteForce(neighbor, includedCopy, time + euclidDistance(curNode, neighbor));
        if (finishTime < minTime) {
          minTime = finishTime;
          bestNeighbor = neighbor;
        }
        graph = copyGraph(tempGraph);
        await delay(300);
      }
      addEdge(curNode, bestNeighbor, euclidDistance(curNode, bestNeighbor));
      await delay(400);
      return bruteForce(bestNeighbor, included, time + euclidDistance(curNode, bestNeighbor));
    }

    async function nearestNeighborImproved() {
      let curNode = startNode;
      let included = new Array(graph.V).fill(false);
      included[curNode.index] = true;
      //in every iteration add one node
      for (let i = 0; i<graph.V -1; ++i) {
        let min = Number.MAX_VALUE;
        let potentialNextNode = null;
        let nonIncludedNodes = getNonIncludedNodes(included);
        //iterate through all non-included nodes
        for (let v of nonIncludedNodes) {
          let tempGraph = copyGraph(graph);
          let includedCopy = JSON.parse(JSON.stringify(included));
          addEdge(curNode, v, euclidDistance(curNode, v));
          let time = await nearestNeighbor(v, includedCopy, true);
          time += euclidDistance(curNode, v);
          delay(300);
          if (time < min) {
            potentialNextNode = v;
            min = time;
          }      
          graph = copyGraph(tempGraph);
        }
        
        addEdge(curNode, potentialNextNode, euclidDistance(curNode, potentialNextNode));
        curNode = potentialNextNode;
        included[curNode.index] = true;
        await delay(300);
      }
      addEdge(curNode, startNode, euclidDistance(curNode, startNode));
    }

    function copyGraph(g) {
      let newGraph = new Graph(0);
      for (let node of g.getNodes()){
        newGraph.addVertex(node);
      }
      for (let edge of g.getEdges()) {
        newGraph.addEdgeFromEdge(edge);
      }
      return newGraph;
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
      if (mode !== "closest" && mode !== "farthest")
        throw('Invalid Input. Mode is: ' + mode + ' but has to be "closest" or "farthest"');
      let minOrMax = Number.MAX_VALUE; //min
      if (mode == "farthest")
        minOrMax = Number.MIN_VALUE; //max
      let curClosestOrFarthest = null;
      for (let node of graph.getNodes()) {
        if (included[node.index])
          continue;
        let dist = euclidDistance(curNode, node);
        //let dist = graph.findEdge(curNode, node).weight;
        if (mode == "closest") {
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

    /**
     * 
     * @param {Node} node1 
     * @param {Node} node2 
     * @returns 
     */
    function euclidDistance(node1, node2) {
      if (!node1 || !node2) {
        throw('a node for dist does not exists');
        return
      }
      let result = (node1.x - node2.x) * (node1.x - node2.x) + (node1.y - node2.y) * (node1.y - node2.y);
      return Math.sqrt(result);
    }

    async function christofides() {
      await computeMST();


      let nodesWithOddDegree = await getNodesWithOddDegree(graph);  

      for (var node of nodesWithOddDegree) {
        await delay(3000);
        console.log("yoo");
        node.color = "#ae2a0d";
      }
      // await delay(15000);
      await findPerfectMatchingMinWeight(nodesWithOddDegree);
      await findEulerianCycle();
    
      for (node of eulerCycle) {
        console.log(node.index+  "-");
      }
      let included = new Array(graph.V).fill(false);
      var curNode = eulerCycle.pop();
      var temp = curNode;
      // we have to go back to this one in the end
      var first = curNode;
      included[curNode.index] = true;
      while (eulerCycle.length > 0) {
        curNode = eulerCycle.pop();
        if (!included[curNode.index]) {
          included[curNode.index] = true;
          console.log("Now adding: " + temp.index +" to " + curNode.index);
          addEdge(temp, curNode, euclidDistance(temp, curNode));
          temp = curNode;
        }
      }
      console.log("Now adding: " + curNode.index +" to " + first.index);

      addEdge(temp, first, euclidDistance(curNode, first));
      // let edge = new Edge(nodesWithOddDegree[0], nodesWithOddDegree[1], euclidDistance(nodesWithOddDegree[0], nodesWithOddDegree[1]));
      // //console.log('there are nodes with odd degree: ' + nodesWithOddDegree.length);
      // edge.color = 255;
      // graph.addEdgeFromEdge(edge);
      
    }

    async function findEulerianCycle() {
      // Find a vertex with odd degree
      let v = graph.getNodes()[0];
      for (var node of graph.getNodes()) {
        if (graph.getNeighbors(node).length % 2== 1) {
          v = node;
          break;
        }
      }
      // Print tour starting from oddv
      await printEulerUtil(v);
    
    }

    async function printEulerUtil(v) {
      console.log("Pushing: " + v.index);
      eulerCycle.push(v);

      //Print Euler tour starting from vertex u
    
      // Recur for all the vertices adjacent to
      // this vertex
      for (let node of graph.getNeighbors(v)) {
        await delay(3000);
        // If edge u-v is not removed and it's a
        // valid next edge
        if (await isValidNextEdge(v, node)) {
          console.log(v.index + "-" + node.index);
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
      if (count == 1) 
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
      graph.addEdge(u, v, euclidDistance(u, v));
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
      let nodesWithOddDegree = getNodesWithOddDegree(graph);  
      await findPerfectMatchingMinWeight();
      let edge = new Edge(nodesWithOddDegree[0], nodesWithOddDegree[1], euclidDistance(nodesWithOddDegree[0], nodesWithOddDegree[1]));
      //console.log('there are nodes with odd degree: ' + nodesWithOddDegree.length);
      edge.color = 255;
      graph.addEdgeFromEdge(edge);
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
          var v = nodes[i];
          var w = nodes[j];
          var weight = euclidDistance(v, w);
          edmondsEdges.push([v.index, w.index, - weight])
        }
      }
      var edmonds = new Edmonds(edmondsEdges);

      var result = edmonds.maxWeightMatching();
      
      console.log(result)

      for (var i = 0; i < result.length; ++i) {
        var indexV = i;
        var indexW = result[i];
        var v = graph.getNodes().find(node => node.index === indexV);
        var w = graph.getNodes().find(node => node.index === indexW);
        if (indexV < indexW) {
          addEdge(v, w, euclidDistance(v, w));
        }
      }
    } 


    function getNodesWithOddDegree(g) {
      let out = [];
      for (let node of g.getNodes()) {
        if (g.getNeighbors(node).length % 2 == 1){
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
      if (totalGraph.V == 0) {
        let nodes = graph.getNodes();
        let allNodesAdded = false;
        for (let i = 0; i < nodes.length; ++i) {
          if (!allNodesAdded)
            totalGraph.addVertex(nodes[i]);
          for (let j = i+1; j< nodes.length; ++j) {
            if (!allNodesAdded) 
              totalGraph.addVertex(nodes[j]);
            let weight = euclidDistance(nodes[i], nodes[j]);
            let edge = new Edge(nodes[i], nodes[j], weight);
            totalGraph.addEdgeFromEdge(edge);
          }
          if (!allNodesAdded) 
            allNodesAdded = true;
        }
      }
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
        console.log("v1: " + v1.index);
        console.log("v2: " + v2.index);    
        //case 1, both nodes not included
        if (!v1.root && !v2.root) {
          v2.root = v1;
          v1.isRoot = true;
          v1.children = 1;
          addEdge(v1, v2, e.weight);
          console.log("v1 and v2 both had no root. Now children " + v1.children);
          continue;
        }
        if (v1.isRoot && !v2.root || v1.root && !v2.root) {
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
        if (v2.isRoot && !v1.root || v2.root && !v1.root) {
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