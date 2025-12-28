export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export type OperationFrequency = 'never' | 'rare' | 'normal' | 'often' | 'very_often';

export type NotationStyle = 'operators' | 'arrows' | 'equals';

export type GameMode = 'live' | 'print';

export interface OperationConfig {
  enabled: boolean;
  frequency: OperationFrequency;
  minValue: number;
  maxValue: number;
}

export interface DifficultyLevel {
  id: number;
  name: string;
  description: string;
  maxResult: number;
  operations: {
    add: OperationConfig;
    subtract: OperationConfig;
    multiply: OperationConfig;
    divide: OperationConfig;
  };
  chainLength: number;
  recommended?: boolean;
}

export interface OperationMix {
  add: number;
  subtract: number;
  multiply: number;
  divide: number;
}

export interface GameConfig {
  difficultyLevel: number;
  maxResult: number;
  chainLength: number;
  chainCount: number;
  notationStyle: NotationStyle;
  showSumOfDigits: boolean;
  showResultLines: boolean;
  decorativeCharacter: string;
  timeLimit: number; // in seconds, 0 = no limit
  operations: {
    add: OperationConfig;
    subtract: OperationConfig;
    multiply: OperationConfig;
    divide: OperationConfig;
  };
  operationMix: OperationMix; // percentage mix for each operation
  allowNegativeResults: boolean;
}

export interface Problem {
  id: string;
  startValue: number;
  operation: Operation;
  operand: number;
  result: number;
}

export interface ProblemChain {
  id: string;
  problems: Problem[];
  startingNumber: number;
}

export interface Worksheet {
  id: string;
  chains: ProblemChain[];
  config: GameConfig;
  createdAt: Date;
}

export interface Answer {
  problemId: string;
  userAnswer: number | null;
  isCorrect: boolean | null;
  answeredAt: Date | null;
}

export interface GameSession {
  id: string;
  worksheet: Worksheet;
  answers: Map<string, Answer>;
  startedAt: Date;
  endedAt: Date | null;
  isComplete: boolean;
  score: {
    correct: number;
    incorrect: number;
    total: number;
    percentage: number;
  };
}

export interface UserStats {
  totalSessions: number;
  totalProblems: number;
  correctAnswers: number;
  averageAccuracy: number;
  averageTimePerProblem: number;
  streakDays: number;
  lastSessionDate: Date | null;
  levelProgress: Map<number, number>; // level -> best percentage
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

export const OPERATION_NAMES: Record<Operation, string> = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};

export const FREQUENCY_WEIGHTS: Record<OperationFrequency, number> = {
  never: 0,
  rare: 1,
  normal: 3,
  often: 5,
  very_often: 8,
};

export type UserProfile = 'kid' | 'adult';

export const DEFAULT_CONFIG: GameConfig = {
  difficultyLevel: 1,
  maxResult: 100,
  chainLength: 6,
  chainCount: 5,
  notationStyle: 'operators',
  showSumOfDigits: false,
  showResultLines: false,
  decorativeCharacter: '',
  timeLimit: 0,
  operations: {
    add: { enabled: true, frequency: 'normal', minValue: 1, maxValue: 20 },
    subtract: { enabled: true, frequency: 'normal', minValue: 1, maxValue: 20 },
    multiply: { enabled: true, frequency: 'normal', minValue: 2, maxValue: 10 },
    divide: { enabled: true, frequency: 'normal', minValue: 2, maxValue: 10 },
  },
  operationMix: { add: 40, subtract: 40, multiply: 10, divide: 10 }, // Basic preset as default
  allowNegativeResults: false,
};
