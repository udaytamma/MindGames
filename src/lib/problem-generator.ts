/**
 * @fileoverview Problem Generator Module for MindGames
 *
 * This module handles the generation of math problem chains for mental arithmetic training.
 * It supports four operations (add, subtract, multiply, divide) with configurable mix percentages.
 *
 * Key features:
 * - Chain-based problem generation where each result feeds into the next problem
 * - Smart starting number selection based on operation mix
 * - Clean division handling (no remainders)
 * - Configurable bounds for results and operands
 *
 * @module problem-generator
 */

import {
  GameConfig,
  Operation,
  Problem,
  ProblemChain,
  Worksheet,
  OperationMix,
} from '@/types';

/**
 * Generates a unique 9-character alphanumeric ID
 * @returns A random string ID
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer in the range [min, max]
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Selects a random operation based on the configured percentage mix.
 * Uses weighted random selection where each operation's probability
 * corresponds to its percentage in the mix.
 *
 * @param mix - The operation mix configuration (percentages should sum to 100)
 * @returns The selected operation type
 *
 * @example
 * // With mix { add: 40, subtract: 40, multiply: 10, divide: 10 }
 * // add has 40% chance, subtract 40%, multiply 10%, divide 10%
 */
const selectOperationByMix = (mix: OperationMix): Operation => {
  const random = Math.random() * 100;
  let cumulative = 0;

  cumulative += mix.add;
  if (random < cumulative) return 'add';

  cumulative += mix.subtract;
  if (random < cumulative) return 'subtract';

  cumulative += mix.multiply;
  if (random < cumulative) return 'multiply';

  return 'divide';
};

/**
 * Generates a valid operand for the given operation and current value.
 * Ensures that the resulting value stays within configured bounds and
 * produces clean results (no decimals for division).
 *
 * @param operation - The arithmetic operation to perform
 * @param currentValue - The current value in the chain
 * @param config - The game configuration with bounds and operation settings
 * @returns A valid operand, or null if no valid operand can be generated
 */
const generateOperand = (
  operation: Operation,
  currentValue: number,
  config: GameConfig
): number | null => {
  const opConfig = config.operations[operation];
  let min = opConfig.minValue;
  let max = opConfig.maxValue;

  switch (operation) {
    case 'add': {
      // Ensure result doesn't exceed maxResult
      const maxAddend = config.maxResult - currentValue;
      if (maxAddend < min) return null;
      max = Math.min(max, maxAddend);
      if (max < min) return null;
      return randomInt(min, max);
    }

    case 'subtract': {
      // Ensure result doesn't go below 1 (keep numbers positive and >= 1)
      const minResult = config.allowNegativeResults ? -config.maxResult : 1;
      const maxSubtrahend = currentValue - minResult;
      if (maxSubtrahend < min) return null;
      max = Math.min(max, maxSubtrahend);
      if (max < min) return null;
      return randomInt(min, max);
    }

    case 'multiply': {
      // Ensure result doesn't exceed maxResult
      if (currentValue === 0) return randomInt(min, max);
      const maxMultiplier = Math.floor(config.maxResult / currentValue);
      if (maxMultiplier < min) return null;
      max = Math.min(max, maxMultiplier);
      if (max < min) return null;
      return randomInt(min, max);
    }

    case 'divide': {
      // Ensure division is clean (no remainder) and result >= 1
      if (currentValue <= 0) return null;

      // Find all valid divisors within range
      const validDivisors: number[] = [];
      for (let d = min; d <= Math.min(max, currentValue); d++) {
        if (currentValue % d === 0) {
          const result = currentValue / d;
          if (result >= 1 && result <= config.maxResult) {
            validDivisors.push(d);
          }
        }
      }

      if (validDivisors.length === 0) return null;
      return validDivisors[randomInt(0, validDivisors.length - 1)];
    }

    default:
      return null;
  }
};

/**
 * Calculates the result of an arithmetic operation
 * @param value - The starting value
 * @param operation - The operation to perform
 * @param operand - The operand to use
 * @returns The result of the operation
 */
const calculateResult = (
  value: number,
  operation: Operation,
  operand: number
): number => {
  switch (operation) {
    case 'add':
      return value + operand;
    case 'subtract':
      return value - operand;
    case 'multiply':
      return value * operand;
    case 'divide':
      return value / operand;
    default:
      return value;
  }
};

/**
 * Attempts to generate a problem with a specific operation.
 * Validates that the result is within bounds and clean.
 *
 * @param currentValue - The current value in the chain
 * @param operation - The operation to use
 * @param config - The game configuration
 * @returns A Problem object if successful, null otherwise
 */
const tryGenerateProblem = (
  currentValue: number,
  operation: Operation,
  config: GameConfig
): Problem | null => {
  const operand = generateOperand(operation, currentValue, config);
  if (operand === null) return null;

  const result = calculateResult(currentValue, operation, operand);

  // Validate result
  if (result < 1 && !config.allowNegativeResults) return null;
  if (result > config.maxResult) return null;
  if (operation === 'divide' && !Number.isInteger(result)) return null;

  return {
    id: generateId(),
    startValue: currentValue,
    operation,
    operand,
    result,
  };
};

/**
 * Generates a single problem using the configured mix percentages.
 * Uses a multi-strategy approach:
 * 1. Random selection based on mix percentages
 * 2. Fallback to operations sorted by percentage
 * 3. Last resort: simple add/subtract with small numbers
 *
 * @param currentValue - The current value in the chain
 * @param config - The game configuration
 * @param maxAttempts - Maximum random attempts before falling back (default: 20)
 * @returns A Problem object if successful, null if all strategies fail
 */
const generateProblem = (
  currentValue: number,
  config: GameConfig,
  maxAttempts: number = 20
): Problem | null => {
  const operations: Operation[] = ['add', 'subtract', 'multiply', 'divide'];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Select operation based on mix
    const operation = selectOperationByMix(config.operationMix);

    const problem = tryGenerateProblem(currentValue, operation, config);
    if (problem) return problem;
  }

  // Fallback: try each operation in order of their mix percentage
  const sortedOps = [...operations].sort(
    (a, b) => config.operationMix[b] - config.operationMix[a]
  );

  for (const op of sortedOps) {
    const problem = tryGenerateProblem(currentValue, op, config);
    if (problem) return problem;
  }

  // Last resort fallback: simple add or subtract with small numbers
  const simpleConfig: GameConfig = {
    ...config,
    operations: {
      ...config.operations,
      add: { ...config.operations.add, minValue: 1, maxValue: 5 },
      subtract: { ...config.operations.subtract, minValue: 1, maxValue: 5 },
    },
  };

  const addProblem = tryGenerateProblem(currentValue, 'add', simpleConfig);
  if (addProblem) return addProblem;

  const subProblem = tryGenerateProblem(currentValue, 'subtract', simpleConfig);
  if (subProblem) return subProblem;

  return null;
};

/**
 * Generates a problem chain - a sequence of linked math problems where
 * each problem's result becomes the starting value for the next.
 *
 * Smart starting number selection:
 * - For multiply/divide heavy mixes (≥50%), uses highly composite numbers
 *   (12, 18, 20, 24, 30, etc.) for better divisibility
 * - For add/subtract heavy mixes, uses numbers in the lower range of maxResult
 *
 * @param config - The game configuration
 * @returns A ProblemChain object, or null if generation fails
 *
 * @example
 * const chain = generateChain(config);
 * // chain.startingNumber = 24
 * // chain.problems = [
 * //   { startValue: 24, operation: 'divide', operand: 4, result: 6 },
 * //   { startValue: 6, operation: 'multiply', operand: 5, result: 30 },
 * //   ...
 * // ]
 */
export const generateChain = (config: GameConfig): ProblemChain | null => {
  const problems: Problem[] = [];

  // Start with a number that works well for the operations
  // For multiply/divide heavy mixes, use numbers that are more divisible
  const hasHighMultDiv =
    config.operationMix.multiply + config.operationMix.divide >= 50;

  let minStart: number;
  let maxStart: number;

  if (hasHighMultDiv) {
    // Use numbers with more factors for multiply/divide
    const goodStarts = [12, 18, 20, 24, 30, 36, 40, 48, 60, 72, 80, 90, 100];
    const filteredStarts = goodStarts.filter((n) => n <= config.maxResult / 2);
    if (filteredStarts.length > 0) {
      const idx = randomInt(0, filteredStarts.length - 1);
      minStart = maxStart = filteredStarts[idx];
    } else {
      minStart = 10;
      maxStart = Math.min(50, Math.floor(config.maxResult / 3));
    }
  } else {
    minStart = Math.max(5, Math.floor(config.maxResult * 0.1));
    maxStart = Math.min(Math.floor(config.maxResult * 0.4), 100);
  }

  let currentValue = randomInt(minStart, maxStart);
  const startingNumber = currentValue;

  for (let i = 0; i < config.chainLength; i++) {
    const problem = generateProblem(currentValue, config);

    if (!problem) {
      // If we can't generate more problems, stop here
      if (problems.length >= 3) break;
      return null;
    }

    problems.push(problem);
    currentValue = problem.result;
  }

  if (problems.length === 0) return null;

  return {
    id: generateId(),
    problems,
    startingNumber,
  };
};

/**
 * Generates a complete worksheet containing multiple problem chains.
 * Will retry chain generation up to 3x the requested count to handle
 * any generation failures.
 *
 * @param config - The game configuration
 * @returns A Worksheet containing all generated chains
 */
export const generateWorksheet = (config: GameConfig): Worksheet => {
  const chains: ProblemChain[] = [];
  let attempts = 0;
  const maxAttempts = config.chainCount * 3;

  while (chains.length < config.chainCount && attempts < maxAttempts) {
    const chain = generateChain(config);
    if (chain && chain.problems.length >= 3) {
      chains.push(chain);
    }
    attempts++;
  }

  return {
    id: generateId(),
    chains,
    config,
    createdAt: new Date(),
  };
};

/**
 * Calculates the sum of all digits in a number.
 * Useful for mental math verification techniques.
 *
 * @param n - The number to sum digits of (handles negatives via absolute value)
 * @returns The sum of all digits
 *
 * @example
 * sumOfDigits(123) // returns 6 (1+2+3)
 * sumOfDigits(-456) // returns 15 (4+5+6)
 */
export const sumOfDigits = (n: number): number => {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

/**
 * Formats a number with locale-appropriate thousand separators.
 *
 * @param n - The number to format
 * @returns A formatted string representation
 *
 * @example
 * formatNumber(1000) // returns "1,000" in en-US locale
 */
export const formatNumber = (n: number): string => {
  return n.toLocaleString();
};

/**
 * Calculates the total number of problems across all chains in a worksheet.
 *
 * @param worksheet - The worksheet to count problems in
 * @returns The total number of problems
 */
export const getTotalProblems = (worksheet: Worksheet): number => {
  return worksheet.chains.reduce((sum, chain) => sum + chain.problems.length, 0);
};
