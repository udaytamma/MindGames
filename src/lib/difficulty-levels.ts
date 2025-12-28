import { DifficultyLevel, OperationConfig } from '@/types';

const createOpConfig = (
  enabled: boolean,
  frequency: 'never' | 'rare' | 'normal' | 'often' | 'very_often',
  minValue: number,
  maxValue: number
): OperationConfig => ({
  enabled,
  frequency,
  minValue,
  maxValue,
});

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  // Beginner levels (1-10): Basic addition and subtraction
  {
    id: 1,
    name: 'First Steps',
    description: 'Addition up to 10',
    maxResult: 10,
    operations: {
      add: createOpConfig(true, 'very_often', 1, 5),
      subtract: createOpConfig(false, 'never', 1, 5),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 6,
    recommended: true,
  },
  {
    id: 2,
    name: 'Getting Started',
    description: 'Addition and subtraction up to 10',
    maxResult: 10,
    operations: {
      add: createOpConfig(true, 'normal', 1, 5),
      subtract: createOpConfig(true, 'normal', 1, 5),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 6,
  },
  {
    id: 3,
    name: 'Growing Numbers',
    description: 'Addition and subtraction up to 20',
    maxResult: 20,
    operations: {
      add: createOpConfig(true, 'normal', 1, 10),
      subtract: createOpConfig(true, 'normal', 1, 10),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 8,
    recommended: true,
  },
  {
    id: 4,
    name: 'Double Digits',
    description: 'Addition and subtraction up to 50',
    maxResult: 50,
    operations: {
      add: createOpConfig(true, 'normal', 1, 20),
      subtract: createOpConfig(true, 'normal', 1, 20),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 8,
  },
  {
    id: 5,
    name: 'Century Club',
    description: 'Addition and subtraction up to 100',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'normal', 1, 50),
      subtract: createOpConfig(true, 'normal', 1, 50),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 10,
    recommended: true,
  },

  // Intermediate levels (6-15): Introduction to multiplication
  {
    id: 6,
    name: 'Times Two',
    description: 'Multiplication by 2, up to 20',
    maxResult: 20,
    operations: {
      add: createOpConfig(true, 'normal', 1, 5),
      subtract: createOpConfig(true, 'normal', 1, 5),
      multiply: createOpConfig(true, 'often', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 8,
  },
  {
    id: 7,
    name: 'Times Tables',
    description: 'Multiplication 2-5, up to 50',
    maxResult: 50,
    operations: {
      add: createOpConfig(true, 'normal', 1, 10),
      subtract: createOpConfig(true, 'normal', 1, 10),
      multiply: createOpConfig(true, 'often', 2, 5),
      divide: createOpConfig(false, 'never', 2, 5),
    },
    chainLength: 8,
    recommended: true,
  },
  {
    id: 8,
    name: 'Division Discovery',
    description: 'Division by 2, up to 20',
    maxResult: 20,
    operations: {
      add: createOpConfig(true, 'normal', 1, 10),
      subtract: createOpConfig(true, 'normal', 1, 10),
      multiply: createOpConfig(true, 'rare', 2, 2),
      divide: createOpConfig(true, 'often', 2, 2),
    },
    chainLength: 8,
  },
  {
    id: 9,
    name: 'All Four Operations',
    description: 'All operations, up to 50',
    maxResult: 50,
    operations: {
      add: createOpConfig(true, 'normal', 1, 15),
      subtract: createOpConfig(true, 'normal', 1, 15),
      multiply: createOpConfig(true, 'normal', 2, 5),
      divide: createOpConfig(true, 'normal', 2, 5),
    },
    chainLength: 10,
    recommended: true,
  },
  {
    id: 10,
    name: 'Building Confidence',
    description: 'All operations, up to 100',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'normal', 1, 30),
      subtract: createOpConfig(true, 'normal', 1, 30),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'normal', 2, 10),
    },
    chainLength: 10,
  },

  // Advanced levels (11-20): Larger numbers
  {
    id: 11,
    name: 'Times Master',
    description: 'Full times tables 2-10',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'rare', 1, 20),
      subtract: createOpConfig(true, 'rare', 1, 20),
      multiply: createOpConfig(true, 'very_often', 2, 10),
      divide: createOpConfig(true, 'often', 2, 10),
    },
    chainLength: 12,
    recommended: true,
  },
  {
    id: 12,
    name: 'Division Expert',
    description: 'Division focus, up to 100',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'rare', 1, 20),
      subtract: createOpConfig(true, 'rare', 1, 20),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'very_often', 2, 10),
    },
    chainLength: 12,
  },
  {
    id: 13,
    name: 'Three Digit Territory',
    description: 'All operations up to 200',
    maxResult: 200,
    operations: {
      add: createOpConfig(true, 'normal', 1, 50),
      subtract: createOpConfig(true, 'normal', 1, 50),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'normal', 2, 10),
    },
    chainLength: 12,
  },
  {
    id: 14,
    name: 'Mental Math Hero',
    description: 'All operations up to 500',
    maxResult: 500,
    operations: {
      add: createOpConfig(true, 'normal', 1, 100),
      subtract: createOpConfig(true, 'normal', 1, 100),
      multiply: createOpConfig(true, 'normal', 2, 12),
      divide: createOpConfig(true, 'normal', 2, 12),
    },
    chainLength: 14,
    recommended: true,
  },
  {
    id: 15,
    name: 'Thousand Seeker',
    description: 'All operations up to 1,000',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'normal', 1, 200),
      subtract: createOpConfig(true, 'normal', 1, 200),
      multiply: createOpConfig(true, 'normal', 2, 15),
      divide: createOpConfig(true, 'normal', 2, 15),
    },
    chainLength: 14,
  },

  // Expert levels (16-25): Challenge mode
  {
    id: 16,
    name: 'Multiplication Master',
    description: 'Heavy multiplication up to 1,000',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'rare', 10, 100),
      subtract: createOpConfig(true, 'rare', 10, 100),
      multiply: createOpConfig(true, 'very_often', 2, 20),
      divide: createOpConfig(true, 'often', 2, 20),
    },
    chainLength: 16,
  },
  {
    id: 17,
    name: 'Division Champion',
    description: 'Heavy division up to 1,000',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'rare', 10, 100),
      subtract: createOpConfig(true, 'rare', 10, 100),
      multiply: createOpConfig(true, 'often', 2, 15),
      divide: createOpConfig(true, 'very_often', 2, 20),
    },
    chainLength: 16,
  },
  {
    id: 18,
    name: 'Big Number Boss',
    description: 'All operations up to 5,000',
    maxResult: 5000,
    operations: {
      add: createOpConfig(true, 'normal', 10, 500),
      subtract: createOpConfig(true, 'normal', 10, 500),
      multiply: createOpConfig(true, 'normal', 2, 25),
      divide: createOpConfig(true, 'normal', 2, 25),
    },
    chainLength: 16,
    recommended: true,
  },
  {
    id: 19,
    name: 'Speed Demon',
    description: 'Quick calculations up to 100',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'very_often', 1, 20),
      subtract: createOpConfig(true, 'very_often', 1, 20),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'normal', 2, 10),
    },
    chainLength: 20,
  },
  {
    id: 20,
    name: 'Marathon Runner',
    description: 'Extended chains up to 1,000',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'normal', 10, 100),
      subtract: createOpConfig(true, 'normal', 10, 100),
      multiply: createOpConfig(true, 'normal', 2, 12),
      divide: createOpConfig(true, 'normal', 2, 12),
    },
    chainLength: 24,
  },

  // Master levels (21-30): Serious challenge
  {
    id: 21,
    name: 'Ten Thousand Trail',
    description: 'All operations up to 10,000',
    maxResult: 10000,
    operations: {
      add: createOpConfig(true, 'normal', 50, 1000),
      subtract: createOpConfig(true, 'normal', 50, 1000),
      multiply: createOpConfig(true, 'normal', 2, 30),
      divide: createOpConfig(true, 'normal', 2, 30),
    },
    chainLength: 18,
    recommended: true,
  },
  {
    id: 22,
    name: 'Addition Ace',
    description: 'Addition only, up to 10,000',
    maxResult: 10000,
    operations: {
      add: createOpConfig(true, 'very_often', 100, 2000),
      subtract: createOpConfig(false, 'never', 1, 1),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 20,
  },
  {
    id: 23,
    name: 'Subtraction Star',
    description: 'Subtraction focus, up to 10,000',
    maxResult: 10000,
    operations: {
      add: createOpConfig(true, 'rare', 100, 1000),
      subtract: createOpConfig(true, 'very_often', 100, 2000),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 20,
  },
  {
    id: 24,
    name: 'Fifty Thousand',
    description: 'All operations up to 50,000',
    maxResult: 50000,
    operations: {
      add: createOpConfig(true, 'normal', 100, 5000),
      subtract: createOpConfig(true, 'normal', 100, 5000),
      multiply: createOpConfig(true, 'normal', 2, 50),
      divide: createOpConfig(true, 'normal', 2, 50),
    },
    chainLength: 18,
  },
  {
    id: 25,
    name: 'Century Master',
    description: 'All operations up to 100,000',
    maxResult: 100000,
    operations: {
      add: createOpConfig(true, 'normal', 500, 10000),
      subtract: createOpConfig(true, 'normal', 500, 10000),
      multiply: createOpConfig(true, 'normal', 2, 100),
      divide: createOpConfig(true, 'normal', 2, 100),
    },
    chainLength: 20,
    recommended: true,
  },

  // Grandmaster levels (26-35): Elite difficulty
  {
    id: 26,
    name: 'Multiplication Marathon',
    description: 'Heavy multiplication up to 100,000',
    maxResult: 100000,
    operations: {
      add: createOpConfig(true, 'rare', 100, 1000),
      subtract: createOpConfig(true, 'rare', 100, 1000),
      multiply: createOpConfig(true, 'very_often', 2, 150),
      divide: createOpConfig(true, 'often', 2, 100),
    },
    chainLength: 20,
  },
  {
    id: 27,
    name: 'Division Dynasty',
    description: 'Heavy division up to 100,000',
    maxResult: 100000,
    operations: {
      add: createOpConfig(true, 'rare', 100, 1000),
      subtract: createOpConfig(true, 'rare', 100, 1000),
      multiply: createOpConfig(true, 'often', 2, 100),
      divide: createOpConfig(true, 'very_often', 2, 150),
    },
    chainLength: 20,
  },
  {
    id: 28,
    name: 'Half Million',
    description: 'All operations up to 500,000',
    maxResult: 500000,
    operations: {
      add: createOpConfig(true, 'normal', 1000, 50000),
      subtract: createOpConfig(true, 'normal', 1000, 50000),
      multiply: createOpConfig(true, 'normal', 2, 200),
      divide: createOpConfig(true, 'normal', 2, 200),
    },
    chainLength: 20,
  },
  {
    id: 29,
    name: 'Millionaire',
    description: 'All operations up to 1,000,000',
    maxResult: 1000000,
    operations: {
      add: createOpConfig(true, 'normal', 5000, 100000),
      subtract: createOpConfig(true, 'normal', 5000, 100000),
      multiply: createOpConfig(true, 'normal', 2, 500),
      divide: createOpConfig(true, 'normal', 2, 500),
    },
    chainLength: 22,
    recommended: true,
  },
  {
    id: 30,
    name: 'Ultimate Challenge',
    description: 'Everything at maximum',
    maxResult: 1000000,
    operations: {
      add: createOpConfig(true, 'often', 10000, 200000),
      subtract: createOpConfig(true, 'often', 10000, 200000),
      multiply: createOpConfig(true, 'often', 2, 1000),
      divide: createOpConfig(true, 'often', 2, 1000),
    },
    chainLength: 24,
  },

  // Special challenge levels (31-39)
  {
    id: 31,
    name: 'Speed Round: Easy',
    description: 'Quick easy problems',
    maxResult: 20,
    operations: {
      add: createOpConfig(true, 'very_often', 1, 10),
      subtract: createOpConfig(true, 'very_often', 1, 10),
      multiply: createOpConfig(false, 'never', 2, 2),
      divide: createOpConfig(false, 'never', 2, 2),
    },
    chainLength: 30,
  },
  {
    id: 32,
    name: 'Speed Round: Medium',
    description: 'Quick medium problems',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'often', 1, 30),
      subtract: createOpConfig(true, 'often', 1, 30),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'normal', 2, 10),
    },
    chainLength: 28,
  },
  {
    id: 33,
    name: 'Speed Round: Hard',
    description: 'Quick hard problems',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'often', 10, 200),
      subtract: createOpConfig(true, 'often', 10, 200),
      multiply: createOpConfig(true, 'normal', 2, 15),
      divide: createOpConfig(true, 'normal', 2, 15),
    },
    chainLength: 26,
  },
  {
    id: 34,
    name: 'Endurance: Light',
    description: 'Many easy problems',
    maxResult: 50,
    operations: {
      add: createOpConfig(true, 'normal', 1, 20),
      subtract: createOpConfig(true, 'normal', 1, 20),
      multiply: createOpConfig(true, 'rare', 2, 5),
      divide: createOpConfig(true, 'rare', 2, 5),
    },
    chainLength: 32,
  },
  {
    id: 35,
    name: 'Endurance: Heavy',
    description: 'Many hard problems',
    maxResult: 10000,
    operations: {
      add: createOpConfig(true, 'normal', 100, 2000),
      subtract: createOpConfig(true, 'normal', 100, 2000),
      multiply: createOpConfig(true, 'normal', 2, 50),
      divide: createOpConfig(true, 'normal', 2, 50),
    },
    chainLength: 32,
  },
  {
    id: 36,
    name: 'Multiplication Tables Practice',
    description: 'Perfect for memorizing times tables',
    maxResult: 144,
    operations: {
      add: createOpConfig(false, 'never', 1, 1),
      subtract: createOpConfig(false, 'never', 1, 1),
      multiply: createOpConfig(true, 'very_often', 1, 12),
      divide: createOpConfig(true, 'very_often', 1, 12),
    },
    chainLength: 16,
    recommended: true,
  },
  {
    id: 37,
    name: 'Mixed Practice: Beginner',
    description: 'Balanced beginner workout',
    maxResult: 100,
    operations: {
      add: createOpConfig(true, 'normal', 1, 30),
      subtract: createOpConfig(true, 'normal', 1, 30),
      multiply: createOpConfig(true, 'normal', 2, 10),
      divide: createOpConfig(true, 'normal', 2, 10),
    },
    chainLength: 12,
  },
  {
    id: 38,
    name: 'Mixed Practice: Intermediate',
    description: 'Balanced intermediate workout',
    maxResult: 1000,
    operations: {
      add: createOpConfig(true, 'normal', 10, 200),
      subtract: createOpConfig(true, 'normal', 10, 200),
      multiply: createOpConfig(true, 'normal', 2, 20),
      divide: createOpConfig(true, 'normal', 2, 20),
    },
    chainLength: 16,
  },
  {
    id: 39,
    name: 'Mixed Practice: Advanced',
    description: 'Balanced advanced workout',
    maxResult: 10000,
    operations: {
      add: createOpConfig(true, 'normal', 100, 2000),
      subtract: createOpConfig(true, 'normal', 100, 2000),
      multiply: createOpConfig(true, 'normal', 2, 50),
      divide: createOpConfig(true, 'normal', 2, 50),
    },
    chainLength: 20,
  },
];

export const getLevel = (id: number): DifficultyLevel | undefined => {
  return DIFFICULTY_LEVELS.find(level => level.id === id);
};

export const getRecommendedLevels = (): DifficultyLevel[] => {
  return DIFFICULTY_LEVELS.filter(level => level.recommended);
};

export const getLevelsByCategory = (): Record<string, DifficultyLevel[]> => {
  return {
    'Beginner (1-5)': DIFFICULTY_LEVELS.filter(l => l.id >= 1 && l.id <= 5),
    'Intermediate (6-10)': DIFFICULTY_LEVELS.filter(l => l.id >= 6 && l.id <= 10),
    'Advanced (11-15)': DIFFICULTY_LEVELS.filter(l => l.id >= 11 && l.id <= 15),
    'Expert (16-20)': DIFFICULTY_LEVELS.filter(l => l.id >= 16 && l.id <= 20),
    'Master (21-25)': DIFFICULTY_LEVELS.filter(l => l.id >= 21 && l.id <= 25),
    'Grandmaster (26-30)': DIFFICULTY_LEVELS.filter(l => l.id >= 26 && l.id <= 30),
    'Special Challenges (31-39)': DIFFICULTY_LEVELS.filter(l => l.id >= 31 && l.id <= 39),
  };
};
