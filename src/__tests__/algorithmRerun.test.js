/**
 * Integration tests for algorithm re-run scenarios
 * Tests the workflow: run algorithm → add more nodes → remove edges → run again
 */

import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

describe('Algorithm Re-run with Additional Nodes', () => {
  let graph;
  let nodes;

  beforeEach(() => {
    // Setup: Create initial graph with 3 nodes
    graph = new Graph(0);
    nodes = [
      new Node(100, 100, 0),
      new Node(200, 200, 1),
      new Node(300, 100, 2),
    ];

    nodes.forEach(node => graph.addVertex(node));
  });

  test('Graph correctly tracks node count after initialization', () => {
    expect(graph.V).toBe(3);
    expect(graph.getNodes().length).toBe(3);
  });

  test('Graph correctly tracks nodes after adding more nodes', () => {
    // Simulate: algorithm has run, user adds 2 more nodes
    const newNode1 = new Node(400, 200, 3);
    const newNode2 = new Node(500, 150, 4);

    graph.addVertex(newNode1);
    graph.addVertex(newNode2);

    expect(graph.V).toBe(5);
    expect(graph.getNodes().length).toBe(5);
  });

  test('Graph preserves all nodes after removing edges', () => {
    // Step 1: Add edges to simulate algorithm running
    graph.addEdge(nodes[0], nodes[1], 100);
    graph.addEdge(nodes[1], nodes[2], 150);
    graph.addEdge(nodes[2], nodes[0], 120);

    expect(graph.E).toBe(3);
    expect(graph.V).toBe(3);

    // Step 2: Add more nodes (simulating user adding nodes after algo runs)
    const newNode1 = new Node(400, 200, 3);
    const newNode2 = new Node(500, 150, 4);
    graph.addVertex(newNode1);
    graph.addVertex(newNode2);

    expect(graph.V).toBe(5);
    expect(graph.getNodes().length).toBe(5);

    // Step 3: Remove all edges (simulating "Remove Edges" button)
    const allNodes = graph.getNodes();
    const nodeCount = allNodes.length;

    let tempGraph = new Graph(0);
    for (let node of allNodes) {
      tempGraph.addVertex(node);
    }

    // Verify new graph has all nodes
    expect(tempGraph.V).toBe(nodeCount);
    expect(tempGraph.getNodes().length).toBe(nodeCount);
    expect(tempGraph.E).toBe(0);

    // Step 4: Verify all node indices are preserved
    const newGraphNodes = tempGraph.getNodes();
    expect(newGraphNodes.map(n => n.index).sort()).toEqual([0, 1, 2, 3, 4]);
  });

  test('Algorithm can run on all nodes after edge removal', () => {
    // Initial setup: 3 nodes with edges
    graph.addEdge(nodes[0], nodes[1], 100);
    graph.addEdge(nodes[1], nodes[2], 150);
    graph.addEdge(nodes[2], nodes[0], 120);

    // Add 2 more nodes
    const newNode1 = new Node(400, 200, 3);
    const newNode2 = new Node(500, 150, 4);
    graph.addVertex(newNode1);
    graph.addVertex(newNode2);

    const initialNodeCount = graph.V;

    // Remove edges
    let tempGraph = new Graph(0);
    for (let node of graph.getNodes()) {
      tempGraph.addVertex(node);
    }
    graph = tempGraph;

    // Simulate algorithm run: create included array based on graph.V
    const included = new Array(graph.V).fill(false);

    // Verify array size matches total node count (not just original nodes)
    expect(included.length).toBe(5);
    expect(included.length).toBe(initialNodeCount);
    expect(graph.V).toBe(5);

    // Verify we can access all nodes
    const allNodes = graph.getNodes();
    expect(allNodes.length).toBe(5);

    // Mark all nodes as included (simulating algorithm visiting all nodes)
    allNodes.forEach(node => {
      included[node.index] = true;
    });

    // Verify all nodes were accessible
    expect(included.filter(val => val).length).toBe(5);
  });

  test('Node indices remain unique after edge removal', () => {
    // Add nodes with specific indices
    const node3 = new Node(400, 200, 3);
    const node4 = new Node(500, 150, 4);
    graph.addVertex(node3);
    graph.addVertex(node4);

    // Remove edges
    let tempGraph = new Graph(0);
    for (let node of graph.getNodes()) {
      tempGraph.addVertex(node);
    }

    const nodeIndices = tempGraph.getNodes().map(n => n.index);
    const uniqueIndices = new Set(nodeIndices);

    expect(nodeIndices.length).toBe(uniqueIndices.size);
    expect(uniqueIndices.size).toBe(5);
  });

  test('Graph.V increments correctly when adding vertices to new graph', () => {
    const emptyGraph = new Graph(0);
    expect(emptyGraph.V).toBe(0);

    emptyGraph.addVertex(new Node(100, 100, 0));
    expect(emptyGraph.V).toBe(1);

    emptyGraph.addVertex(new Node(200, 200, 1));
    expect(emptyGraph.V).toBe(2);

    emptyGraph.addVertex(new Node(300, 100, 2));
    expect(emptyGraph.V).toBe(3);
  });
});
