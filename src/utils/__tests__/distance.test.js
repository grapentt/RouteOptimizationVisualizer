import { distance, pathDistance, tourDistance } from '../distance';

describe('distance utilities', () => {
  const node1 = { x: 0, y: 0 };
  const node2 = { x: 3, y: 4 };
  const node3 = { x: 6, y: 8 };

  describe('distance', () => {
    it('should calculate correct Euclidean distance', () => {
      const result = distance(node1, node2);
      expect(result).toBe(5); // 3-4-5 triangle
    });

    it('should return 0 for same node', () => {
      const result = distance(node1, node1);
      expect(result).toBe(0);
    });

    it('should throw error if node1 is null', () => {
      expect(() => distance(null, node2)).toThrow('Both nodes must be defined');
    });

    it('should throw error if node2 is undefined', () => {
      expect(() => distance(node1, undefined)).toThrow('Both nodes must be defined');
    });

    it('should be symmetric', () => {
      expect(distance(node1, node2)).toBe(distance(node2, node1));
    });
  });

  describe('pathDistance', () => {
    it('should calculate total path distance', () => {
      const path = [node1, node2, node3];
      const result = pathDistance(path);
      const expected = distance(node1, node2) + distance(node2, node3);
      expect(result).toBe(expected);
    });

    it('should return 0 for empty path', () => {
      expect(pathDistance([])).toBe(0);
    });

    it('should return 0 for single node', () => {
      expect(pathDistance([node1])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(pathDistance(null)).toBe(0);
    });
  });

  describe('tourDistance', () => {
    it('should calculate tour distance including return to start', () => {
      const tour = [node1, node2, node3];
      const result = tourDistance(tour);
      const expected =
        distance(node1, node2) +
        distance(node2, node3) +
        distance(node3, node1);
      expect(result).toBe(expected);
    });

    it('should return 0 for empty tour', () => {
      expect(tourDistance([])).toBe(0);
    });

    it('should return 0 for single node tour', () => {
      expect(tourDistance([node1])).toBe(0);
    });
  });
});
