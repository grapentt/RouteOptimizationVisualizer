// import {Node} from './Node.js'; 


export class Edge {
    /**
     * 
     * @param {Node} v 
     * @param {Node} w 
     * @param {double} weight 
     */
    constructor(v, w, weight) {
      this.v = v;
      this.w = w;
      this.weight = weight;
    }

    either() {
        return this.v;
    }

    other(node) {
        if (node.index == this.v.index)
            return this.w;
        return this.v;
    }

    toString() {
        return this.v.index + "-" + this.w.index + " (" + this.weight + ")";
    }
  }