import {Edge} from './Edge.js'; 

export class Graph {
    constructor(V) {
        this.V = V;
        this.E = 0;
        this.AdjList = new Map();
    }

    /**
     * 
     * @param {Node} v 
     */
    addVertex(v) {
        this.AdjList.set(v, []);
        this.V++;
    }

    /**
     * 
     * @param {Node} v 
     * @param {Node} w 
     * @param {double} weight
     */
    addEdge(v, w, weight) {
        if (weight == undefined)
            throw 'weight is undefined';
        let e = new Edge(v, w, weight); 
        this.AdjList.get(v).push(e);
        this.AdjList.get(w).push(e);
        this.E++;
    }

    addEdgeFromEdge(edge) {
        let v = edge.either();
        let w = edge.other(v);
        this.AdjList.get(v).push(edge);
        this.AdjList.get(w).push(edge);
        this.E++;
    }

    /**
     * @returns {Edge[]} edges
     */
    getEdges() {
        let edgeList = [];
        let nodes = this.AdjList.keys();
        // iterate over the vertices
        for (let node of nodes) {
            //get all edges that contain that vertex
            let edges = this.AdjList.get(node);
            //iterate over all these edges
            for (let e of edges) {
                if (node.index < e.other(node).index)
                    edgeList.push(e);
            }
        }
        return edgeList;
    }

    removeAllEdges() {
        let newMap = new Map();
        for (let node of this.AdjList) {
            newMap.set(node, []);
        }
        this.AdjList = newMap;
        this.E = 0;
    }

    removeEdge(v1, v2) {
        let e = this.findEdge(v1, v2);
        this.AdjList.get(v1).splice(this.AdjList.get(v1).indexOf(e), 1);
        this.AdjList.get(v2).splice(this.AdjList.get(v2).indexOf(e), 1);
    }

    /**
     * 
     * @param {Node} v1 
     * @param {Node} v2 
     * @returns 
     */
    findEdge(v1, v2) {
        let edges = this.getEdges();
        for (let e of edges) {
            let node1 = e.either();
            let node2 = e.other(node1);
            if (node1.index == v1.index && node2.index == v2.index || node2.index == v1.index && node1.index == v2.index)
                return e; 
        }
    }

    getNeighbors(node) {
        let out = [];
        for (let edge of this.AdjList.get(node)) {
            out.push(edge.other(node));
        }
        return out;
    }

    /**
     * 
     * @returns {Node[]} nodes 
     */
    getNodes() {
        let nodes = [];
        for (let node of this.AdjList.keys()) {
            nodes.push(node);
        }
        return nodes;
    }

    printGraph() {
        // get all the vertices
        var get_keys = this.AdjList.keys();
 
        // iterate over the vertices
        for (let node of get_keys) {
            let str = node.index  + ": ";
            //get all edges that contain that vertex
            let edges = this.AdjList.get(node);
            //iterate over all these edges
            for (let e of edges) {
                str += e.other(node).index + " (w: " + e.weight + ")  ";
            }
            console.log(str);
        }
    }
}


/*
// Using the above implemented graph class
var g = new Graph(6);
var vertices = [ new Node(1,1,1), new Node(2,2,2), new Node(3,3,3) ];
 
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge(vertices[0], vertices[1], 2);
g.addEdge(vertices[0], vertices[2], 3);
 
// prints all vertex and
// its adjacency list
g.printGraph();

*/