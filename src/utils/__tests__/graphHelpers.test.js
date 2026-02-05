import { getNonIncludedNodes, getIncludedNodes } from '../graphHelpers';

describe('graph helper utilities', () => {
  const mockGraph = {
    getNodes: () => [
      { index: 0, value: 'A' },
      { index: 1, value: 'B' },
      { index: 2, value: 'C' },
      { index: 3, value: 'D' },
    ]
  };

  describe('getNonIncludedNodes', () => {
    it('should return all non-included nodes', () => {
      const included = [true, false, true, false];
      const result = getNonIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(2);
      expect(result[0].index).toBe(1);
      expect(result[1].index).toBe(3);
    });

    it('should return all nodes when none are included', () => {
      const included = [false, false, false, false];
      const result = getNonIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(4);
    });

    it('should return empty array when all are included', () => {
      const included = [true, true, true, true];
      const result = getNonIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(0);
    });
  });

  describe('getIncludedNodes', () => {
    it('should return all included nodes', () => {
      const included = [true, false, true, false];
      const result = getIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(2);
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(2);
    });

    it('should return empty array when none are included', () => {
      const included = [false, false, false, false];
      const result = getIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(0);
    });

    it('should return all nodes when all are included', () => {
      const included = [true, true, true, true];
      const result = getIncludedNodes(mockGraph, included);

      expect(result).toHaveLength(4);
    });
  });
});
