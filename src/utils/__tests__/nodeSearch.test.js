import { findNode, findClosestNode } from '../nodeSearch';

describe('node search utilities', () => {
  const nodes = [
    { index: 0, x: 0, y: 0 },
    { index: 1, x: 3, y: 4 },
    { index: 2, x: 6, y: 8 },
    { index: 3, x: 1, y: 1 },
  ];

  const mockGraph = {
    getNodes: () => nodes
  };

  describe('findNode', () => {
    const curNode = nodes[0];

    it('should find closest non-included node', () => {
      const included = [true, false, false, false];
      const result = findNode(curNode, mockGraph, included, "closest");

      // Node at index 3 (1,1) is closest to (0,0)
      expect(result.index).toBe(3);
    });

    it('should find farthest non-included node', () => {
      const included = [true, false, false, false];
      const result = findNode(curNode, mockGraph, included, "farthest");

      // Node at index 2 (6,8) is farthest from (0,0)
      expect(result.index).toBe(2);
    });

    it('should throw error for invalid mode', () => {
      const included = [true, false, false, false];
      expect(() => findNode(curNode, mockGraph, included, "invalid"))
        .toThrow('Invalid Input');
    });

    it('should skip already included nodes', () => {
      const included = [true, true, false, true];
      const result = findNode(curNode, mockGraph, included, "closest");

      // Only node 2 is not included
      expect(result.index).toBe(2);
    });

    it('should return null when all nodes are included', () => {
      const included = [true, true, true, true];
      const result = findNode(curNode, mockGraph, included, "closest");

      expect(result).toBeNull();
    });
  });

  describe('findClosestNode', () => {
    const referenceNode = { x: 0, y: 0 };

    it('should find closest node and return distance', () => {
      const [dist, node] = findClosestNode(referenceNode, nodes);

      expect(node.index).toBe(0); // Same position
      expect(dist).toBe(0);
    });

    it('should work with subset of nodes', () => {
      const subset = [nodes[1], nodes[2]];
      const [dist, node] = findClosestNode(referenceNode, subset);

      expect(node.index).toBe(1); // (3,4) is closer than (6,8)
      expect(dist).toBe(5);
    });

    it('should return null for empty node list', () => {
      const [dist, node] = findClosestNode(referenceNode, []);

      expect(node).toBeNull();
      expect(dist).toBe(Number.MAX_VALUE);
    });
  });
});
