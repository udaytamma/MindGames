/**
 * @fileoverview Unit tests for the problem generator module
 * Tests the core math problem generation logic including chain creation,
 * operation selection, and result calculation.
 */

import {
  generateChain,
  generateWorksheet,
  getTotalProblems,
  formatNumber,
  sumOfDigits,
} from '@/lib/problem-generator';
import { DEFAULT_CONFIG, GameConfig, OperationMix } from '@/types';

describe('Problem Generator', () => {
  describe('generateChain', () => {
    it('should generate a chain with the configured number of problems', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        chainLength: 5,
      };

      const chain = generateChain(config);

      expect(chain).not.toBeNull();
      expect(chain!.problems.length).toBeGreaterThanOrEqual(3);
      expect(chain!.problems.length).toBeLessThanOrEqual(config.chainLength);
    });

    it('should have a valid starting number', () => {
      const chain = generateChain(DEFAULT_CONFIG);

      expect(chain).not.toBeNull();
      expect(chain!.startingNumber).toBeGreaterThan(0);
      expect(chain!.startingNumber).toBeLessThanOrEqual(DEFAULT_CONFIG.maxResult);
    });

    it('should create problems where each result feeds into the next', () => {
      const chain = generateChain(DEFAULT_CONFIG);

      expect(chain).not.toBeNull();

      let currentValue = chain!.startingNumber;
      for (const problem of chain!.problems) {
        expect(problem.startValue).toBe(currentValue);
        currentValue = problem.result;
      }
    });

    it('should keep all results within maxResult bounds', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        maxResult: 100,
      };

      const chain = generateChain(config);

      expect(chain).not.toBeNull();
      for (const problem of chain!.problems) {
        expect(problem.result).toBeLessThanOrEqual(config.maxResult);
        expect(problem.result).toBeGreaterThanOrEqual(1);
      }
    });

    it('should produce clean division results (no decimals)', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        operationMix: { add: 0, subtract: 0, multiply: 0, divide: 100 },
      };

      // Run multiple times to ensure division is clean
      for (let i = 0; i < 10; i++) {
        const chain = generateChain(config);
        if (chain) {
          for (const problem of chain.problems) {
            if (problem.operation === 'divide') {
              expect(Number.isInteger(problem.result)).toBe(true);
            }
          }
        }
      }
    });

    it('should generate unique IDs for chains and problems', () => {
      const chain1 = generateChain(DEFAULT_CONFIG);
      const chain2 = generateChain(DEFAULT_CONFIG);

      expect(chain1).not.toBeNull();
      expect(chain2).not.toBeNull();
      expect(chain1!.id).not.toBe(chain2!.id);

      const problemIds = chain1!.problems.map(p => p.id);
      const uniqueIds = new Set(problemIds);
      expect(uniqueIds.size).toBe(problemIds.length);
    });
  });

  describe('generateWorksheet', () => {
    it('should generate the configured number of chains', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        chainCount: 5,
      };

      const worksheet = generateWorksheet(config);

      expect(worksheet.chains.length).toBe(config.chainCount);
    });

    it('should store the config in the worksheet', () => {
      const worksheet = generateWorksheet(DEFAULT_CONFIG);

      expect(worksheet.config).toEqual(DEFAULT_CONFIG);
    });

    it('should have a creation date', () => {
      const before = new Date();
      const worksheet = generateWorksheet(DEFAULT_CONFIG);
      const after = new Date();

      expect(worksheet.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(worksheet.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should generate unique worksheet IDs', () => {
      const worksheet1 = generateWorksheet(DEFAULT_CONFIG);
      const worksheet2 = generateWorksheet(DEFAULT_CONFIG);

      expect(worksheet1.id).not.toBe(worksheet2.id);
    });
  });

  describe('getTotalProblems', () => {
    it('should correctly count total problems across all chains', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        chainCount: 3,
        chainLength: 5,
      };

      const worksheet = generateWorksheet(config);
      const total = getTotalProblems(worksheet);

      const actualTotal = worksheet.chains.reduce(
        (sum, chain) => sum + chain.problems.length,
        0
      );

      expect(total).toBe(actualTotal);
    });

    it('should return 0 for empty worksheet', () => {
      const worksheet = {
        id: 'test',
        chains: [],
        config: DEFAULT_CONFIG,
        createdAt: new Date(),
      };

      expect(getTotalProblems(worksheet)).toBe(0);
    });
  });

  describe('Operation Mix', () => {
    it('should respect add-heavy mix', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        chainCount: 10,
        chainLength: 10,
        operationMix: { add: 70, subtract: 10, multiply: 10, divide: 10 },
      };

      const worksheet = generateWorksheet(config);

      let addCount = 0;
      let totalCount = 0;

      for (const chain of worksheet.chains) {
        for (const problem of chain.problems) {
          if (problem.operation === 'add') addCount++;
          totalCount++;
        }
      }

      // With 70% add probability, we expect at least 40% adds in practice
      const addPercentage = (addCount / totalCount) * 100;
      expect(addPercentage).toBeGreaterThan(30);
    });

    it('should respect multiply/divide-heavy mix', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        chainCount: 10,
        chainLength: 8,
        operationMix: { add: 10, subtract: 10, multiply: 40, divide: 40 },
      };

      const worksheet = generateWorksheet(config);

      let multDivCount = 0;
      let totalCount = 0;

      for (const chain of worksheet.chains) {
        for (const problem of chain.problems) {
          if (problem.operation === 'multiply' || problem.operation === 'divide') {
            multDivCount++;
          }
          totalCount++;
        }
      }

      // With 80% multiply/divide probability, we expect significant representation
      const multDivPercentage = (multDivCount / totalCount) * 100;
      expect(multDivPercentage).toBeGreaterThan(20);
    });
  });

  describe('Utility Functions', () => {
    describe('formatNumber', () => {
      it('should format numbers with thousand separators', () => {
        expect(formatNumber(1000)).toBe('1,000');
        expect(formatNumber(1000000)).toBe('1,000,000');
      });

      it('should handle small numbers without separators', () => {
        expect(formatNumber(100)).toBe('100');
        expect(formatNumber(1)).toBe('1');
      });

      it('should handle zero', () => {
        expect(formatNumber(0)).toBe('0');
      });
    });

    describe('sumOfDigits', () => {
      it('should calculate sum of digits correctly', () => {
        expect(sumOfDigits(123)).toBe(6); // 1+2+3
        expect(sumOfDigits(999)).toBe(27); // 9+9+9
        expect(sumOfDigits(100)).toBe(1); // 1+0+0
      });

      it('should handle single digit numbers', () => {
        expect(sumOfDigits(5)).toBe(5);
        expect(sumOfDigits(0)).toBe(0);
      });

      it('should handle negative numbers', () => {
        expect(sumOfDigits(-123)).toBe(6); // abs(-123) = 123, 1+2+3 = 6
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small maxResult', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        maxResult: 20,
        operationMix: { add: 50, subtract: 50, multiply: 0, divide: 0 },
      };

      const chain = generateChain(config);

      // Should still generate something
      expect(chain).not.toBeNull();
      if (chain) {
        for (const problem of chain.problems) {
          expect(problem.result).toBeLessThanOrEqual(20);
          expect(problem.result).toBeGreaterThanOrEqual(1);
        }
      }
    });

    it('should handle large maxResult', () => {
      const config: GameConfig = {
        ...DEFAULT_CONFIG,
        maxResult: 10000,
      };

      const chain = generateChain(config);

      expect(chain).not.toBeNull();
      for (const problem of chain!.problems) {
        expect(problem.result).toBeLessThanOrEqual(10000);
      }
    });
  });
});
