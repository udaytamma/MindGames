'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  GameConfig,
  GameMode,
  GameSession,
  Worksheet,
  Answer,
  UserStats,
  UserProfile,
  DEFAULT_CONFIG,
  OperationMix,
} from '@/types';
import { generateWorksheet, getTotalProblems } from '@/lib/problem-generator';

interface GameState {
  mode: GameMode;
  config: GameConfig;
  worksheet: Worksheet | null;
  session: GameSession | null;
  answers: Map<string, Answer>;
  isPlaying: boolean;
  isPaused: boolean;
  showSolutions: boolean;
  activeChainIndex: number;
  activeInputIndex: number;
  stats: UserStats;
  userProfile: UserProfile;
  lastCompletedChainIndex: number | null;
}

type GameAction =
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_CONFIG'; config: Partial<GameConfig> }
  | { type: 'SET_OPERATION_MIX'; mix: OperationMix }
  | { type: 'SET_USER_PROFILE'; profile: UserProfile }
  | { type: 'GENERATE_WORKSHEET' }
  | { type: 'START_SESSION' }
  | { type: 'END_SESSION' }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'SUBMIT_ANSWER'; problemId: string; answer: number }
  | { type: 'SET_ACTIVE_CHAIN'; chainIndex: number }
  | { type: 'SET_ACTIVE_INPUT'; inputIndex: number }
  | { type: 'NEXT_CHAIN' }
  | { type: 'TOGGLE_SOLUTIONS' }
  | { type: 'RESET' }
  | { type: 'CLEAR_CHAIN_COMPLETION' }
  | { type: 'LOAD_STATS'; stats: UserStats };

const initialStats: UserStats = {
  totalSessions: 0,
  totalProblems: 0,
  correctAnswers: 0,
  averageAccuracy: 0,
  averageTimePerProblem: 0,
  streakDays: 0,
  lastSessionDate: null,
  levelProgress: new Map(),
  achievements: [],
};

const initialState: GameState = {
  mode: 'live',
  config: DEFAULT_CONFIG,
  worksheet: null,
  session: null,
  answers: new Map(),
  isPlaying: false,
  isPaused: false,
  showSolutions: false,
  activeChainIndex: 0,
  activeInputIndex: 0,
  stats: initialStats,
  userProfile: 'adult',
  lastCompletedChainIndex: null,
};

function calculateScore(answers: Map<string, Answer>) {
  let correct = 0;
  let incorrect = 0;

  answers.forEach((answer) => {
    if (answer.isCorrect === true) correct++;
    else if (answer.isCorrect === false) incorrect++;
  });

  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, incorrect, total, percentage };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.config },
      };

    case 'SET_OPERATION_MIX':
      return {
        ...state,
        config: { ...state.config, operationMix: action.mix },
      };

    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.profile,
      };

    case 'GENERATE_WORKSHEET': {
      const worksheet = generateWorksheet(state.config);
      return {
        ...state,
        worksheet,
        answers: new Map(),
        showSolutions: false,
        activeChainIndex: 0,
        activeInputIndex: 0,
        isPlaying: false,
        session: null,
      };
    }

    case 'START_SESSION': {
      if (!state.worksheet) return state;

      const session: GameSession = {
        id: Math.random().toString(36).substring(2, 11),
        worksheet: state.worksheet,
        answers: new Map(),
        startedAt: new Date(),
        endedAt: null,
        isComplete: false,
        score: { correct: 0, incorrect: 0, total: 0, percentage: 0 },
      };

      return {
        ...state,
        session,
        isPlaying: true,
        isPaused: false,
        activeChainIndex: 0,
        activeInputIndex: 0,
        answers: new Map(),
      };
    }

    case 'END_SESSION': {
      if (!state.session) return state;

      const score = calculateScore(state.answers);
      const endedSession: GameSession = {
        ...state.session,
        answers: state.answers,
        endedAt: new Date(),
        isComplete: true,
        score,
      };

      // Update stats
      const newStats: UserStats = {
        ...state.stats,
        totalSessions: state.stats.totalSessions + 1,
        totalProblems: state.stats.totalProblems + score.total,
        correctAnswers: state.stats.correctAnswers + score.correct,
        averageAccuracy:
          state.stats.totalSessions > 0
            ? (state.stats.averageAccuracy * state.stats.totalSessions +
                score.percentage) /
              (state.stats.totalSessions + 1)
            : score.percentage,
        lastSessionDate: new Date(),
        levelProgress: new Map(state.stats.levelProgress),
        achievements: state.stats.achievements,
        averageTimePerProblem: state.stats.averageTimePerProblem,
        streakDays: state.stats.streakDays,
      };

      return {
        ...state,
        session: endedSession,
        isPlaying: false,
        stats: newStats,
      };
    }

    case 'PAUSE_SESSION':
      return { ...state, isPaused: true };

    case 'RESUME_SESSION':
      return { ...state, isPaused: false };

    case 'SUBMIT_ANSWER': {
      if (!state.worksheet) return state;

      // Find the problem to get its correct answer
      let correctResult: number | null = null;
      for (const chain of state.worksheet.chains) {
        const problem = chain.problems.find((p) => p.id === action.problemId);
        if (problem) {
          correctResult = problem.result;
          break;
        }
      }

      if (correctResult === null) return state;

      const isCorrect = action.answer === correctResult;
      const answer: Answer = {
        problemId: action.problemId,
        userAnswer: action.answer,
        isCorrect,
        answeredAt: new Date(),
      };

      const newAnswers = new Map(state.answers);
      newAnswers.set(action.problemId, answer);

      return { ...state, answers: newAnswers };
    }

    case 'SET_ACTIVE_CHAIN':
      return { ...state, activeChainIndex: action.chainIndex, activeInputIndex: 0 };

    case 'SET_ACTIVE_INPUT':
      return { ...state, activeInputIndex: action.inputIndex };

    case 'NEXT_CHAIN': {
      if (!state.worksheet) return state;
      const completedChainIndex = state.activeChainIndex;
      const nextChainIndex = state.activeChainIndex + 1;

      if (nextChainIndex >= state.worksheet.chains.length) {
        // All chains complete - still track the last completed chain
        return {
          ...state,
          lastCompletedChainIndex: completedChainIndex,
        };
      }

      return {
        ...state,
        activeChainIndex: nextChainIndex,
        activeInputIndex: 0,
        lastCompletedChainIndex: completedChainIndex,
      };
    }

    case 'CLEAR_CHAIN_COMPLETION':
      return {
        ...state,
        lastCompletedChainIndex: null,
      };

    case 'TOGGLE_SOLUTIONS':
      return { ...state, showSolutions: !state.showSolutions };

    case 'RESET':
      return {
        ...initialState,
        stats: state.stats,
        mode: state.mode,
        config: state.config,
      };

    case 'LOAD_STATS':
      return { ...state, stats: action.stats };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  setMode: (mode: GameMode) => void;
  setConfig: (config: Partial<GameConfig>) => void;
  setOperationMix: (mix: OperationMix) => void;
  setUserProfile: (profile: UserProfile) => void;
  generateNewWorksheet: () => void;
  startSession: () => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  submitAnswer: (problemId: string, answer: number) => void;
  setActiveChain: (chainIndex: number) => void;
  setActiveInput: (inputIndex: number) => void;
  nextChain: () => void;
  toggleSolutions: () => void;
  reset: () => void;
  clearChainCompletion: () => void;
  getTotalProblemsCount: () => number;
  getAnsweredCount: () => number;
  getCorrectCount: () => number;
  isAllChainsComplete: () => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const setConfig = useCallback((config: Partial<GameConfig>) => {
    dispatch({ type: 'SET_CONFIG', config });
  }, []);

  const setOperationMix = useCallback((mix: OperationMix) => {
    dispatch({ type: 'SET_OPERATION_MIX', mix });
  }, []);

  const setUserProfile = useCallback((profile: UserProfile) => {
    dispatch({ type: 'SET_USER_PROFILE', profile });
  }, []);

  const generateNewWorksheet = useCallback(() => {
    dispatch({ type: 'GENERATE_WORKSHEET' });
  }, []);

  const startSession = useCallback(() => {
    dispatch({ type: 'START_SESSION' });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
  }, []);

  const pauseSession = useCallback(() => {
    dispatch({ type: 'PAUSE_SESSION' });
  }, []);

  const resumeSession = useCallback(() => {
    dispatch({ type: 'RESUME_SESSION' });
  }, []);

  const submitAnswer = useCallback((problemId: string, answer: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', problemId, answer });
  }, []);

  const setActiveChain = useCallback((chainIndex: number) => {
    dispatch({ type: 'SET_ACTIVE_CHAIN', chainIndex });
  }, []);

  const setActiveInput = useCallback((inputIndex: number) => {
    dispatch({ type: 'SET_ACTIVE_INPUT', inputIndex });
  }, []);

  const nextChain = useCallback(() => {
    dispatch({ type: 'NEXT_CHAIN' });
  }, []);

  const toggleSolutions = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOLUTIONS' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const clearChainCompletion = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAIN_COMPLETION' });
  }, []);

  const getTotalProblemsCount = useCallback(() => {
    if (!state.worksheet) return 0;
    return getTotalProblems(state.worksheet);
  }, [state.worksheet]);

  const getAnsweredCount = useCallback(() => {
    return state.answers.size;
  }, [state.answers]);

  const getCorrectCount = useCallback(() => {
    let count = 0;
    state.answers.forEach((answer) => {
      if (answer.isCorrect) count++;
    });
    return count;
  }, [state.answers]);

  const isAllChainsComplete = useCallback(() => {
    if (!state.worksheet) return false;
    const totalProblems = getTotalProblems(state.worksheet);
    return state.answers.size >= totalProblems;
  }, [state.worksheet, state.answers]);

  return (
    <GameContext.Provider
      value={{
        state,
        setMode,
        setConfig,
        setOperationMix,
        setUserProfile,
        generateNewWorksheet,
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        submitAnswer,
        setActiveChain,
        setActiveInput,
        nextChain,
        toggleSolutions,
        reset,
        clearChainCompletion,
        getTotalProblemsCount,
        getAnsweredCount,
        getCorrectCount,
        isAllChainsComplete,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
