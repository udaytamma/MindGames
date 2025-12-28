/**
 * @fileoverview Integration tests for GameContext
 * Tests the game state management including session handling,
 * answer submission, and chain navigation.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { DEFAULT_CONFIG } from '@/types';

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('GameContext', () => {
  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.state.mode).toBe('live');
      expect(result.current.state.worksheet).toBeNull();
      expect(result.current.state.session).toBeNull();
      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.isPaused).toBe(false);
      expect(result.current.state.activeChainIndex).toBe(0);
      expect(result.current.state.activeInputIndex).toBe(0);
      expect(result.current.state.userProfile).toBe('adult');
    });

    it('should have default config', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.state.config.operationMix).toEqual({
        add: 40,
        subtract: 40,
        multiply: 10,
        divide: 10,
      });
    });
  });

  describe('Worksheet Generation', () => {
    it('should generate a worksheet', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
      });

      expect(result.current.state.worksheet).not.toBeNull();
      expect(result.current.state.worksheet!.chains.length).toBe(
        result.current.state.config.chainCount
      );
    });

    it('should reset answers when generating new worksheet', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
      });

      expect(result.current.state.answers.size).toBe(0);
    });

    it('should reset active indices when generating new worksheet', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.setActiveInput(2);
      });

      act(() => {
        result.current.generateNewWorksheet();
      });

      expect(result.current.state.activeChainIndex).toBe(0);
      expect(result.current.state.activeInputIndex).toBe(0);
    });
  });

  describe('Session Management', () => {
    it('should start a session', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
      });

      act(() => {
        result.current.startSession();
      });

      expect(result.current.state.isPlaying).toBe(true);
      expect(result.current.state.session).not.toBeNull();
      expect(result.current.state.session!.isComplete).toBe(false);
    });

    it('should not start session without worksheet', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startSession();
      });

      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.session).toBeNull();
    });

    it('should end a session', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      act(() => {
        result.current.endSession();
      });

      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.session!.isComplete).toBe(true);
      expect(result.current.state.session!.endedAt).not.toBeNull();
    });

    it('should calculate score on session end', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      // Submit some answers
      const firstProblem = result.current.state.worksheet!.chains[0].problems[0];
      act(() => {
        result.current.submitAnswer(firstProblem.id, firstProblem.result); // Correct
      });

      act(() => {
        result.current.endSession();
      });

      expect(result.current.state.session!.score.correct).toBe(1);
      expect(result.current.state.session!.score.total).toBe(1);
      expect(result.current.state.session!.score.percentage).toBe(100);
    });
  });

  describe('Answer Submission', () => {
    it('should submit correct answer', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      const firstProblem = result.current.state.worksheet!.chains[0].problems[0];

      act(() => {
        result.current.submitAnswer(firstProblem.id, firstProblem.result);
      });

      const answer = result.current.state.answers.get(firstProblem.id);
      expect(answer).toBeDefined();
      expect(answer!.isCorrect).toBe(true);
      expect(answer!.userAnswer).toBe(firstProblem.result);
    });

    it('should submit incorrect answer', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      const firstProblem = result.current.state.worksheet!.chains[0].problems[0];
      const wrongAnswer = firstProblem.result + 999;

      act(() => {
        result.current.submitAnswer(firstProblem.id, wrongAnswer);
      });

      const answer = result.current.state.answers.get(firstProblem.id);
      expect(answer).toBeDefined();
      expect(answer!.isCorrect).toBe(false);
      expect(answer!.userAnswer).toBe(wrongAnswer);
    });

    it('should track answer timestamp', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      const before = new Date();
      const firstProblem = result.current.state.worksheet!.chains[0].problems[0];

      act(() => {
        result.current.submitAnswer(firstProblem.id, firstProblem.result);
      });

      const after = new Date();
      const answer = result.current.state.answers.get(firstProblem.id);

      expect(answer!.answeredAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(answer!.answeredAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Chain Navigation', () => {
    it('should move to next chain', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      expect(result.current.state.activeChainIndex).toBe(0);

      act(() => {
        result.current.nextChain();
      });

      expect(result.current.state.activeChainIndex).toBe(1);
      expect(result.current.state.activeInputIndex).toBe(0);
    });

    it('should track completed chain index', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      act(() => {
        result.current.nextChain();
      });

      expect(result.current.state.lastCompletedChainIndex).toBe(0);
    });

    it('should set active input', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      act(() => {
        result.current.setActiveInput(3);
      });

      expect(result.current.state.activeInputIndex).toBe(3);
    });

    it('should clear chain completion', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
        result.current.nextChain();
      });

      expect(result.current.state.lastCompletedChainIndex).toBe(0);

      act(() => {
        result.current.clearChainCompletion();
      });

      expect(result.current.state.lastCompletedChainIndex).toBeNull();
    });
  });

  describe('Configuration', () => {
    it('should update config', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.setConfig({ maxResult: 500, chainCount: 10 });
      });

      expect(result.current.state.config.maxResult).toBe(500);
      expect(result.current.state.config.chainCount).toBe(10);
    });

    it('should update operation mix', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      const newMix = { add: 10, subtract: 10, multiply: 40, divide: 40 };

      act(() => {
        result.current.setOperationMix(newMix);
      });

      expect(result.current.state.config.operationMix).toEqual(newMix);
    });

    it('should set user profile', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.state.userProfile).toBe('adult');

      act(() => {
        result.current.setUserProfile('kid');
      });

      expect(result.current.state.userProfile).toBe('kid');
    });
  });

  describe('Statistics', () => {
    it('should return correct total problems count', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.getTotalProblemsCount()).toBe(0);

      act(() => {
        result.current.generateNewWorksheet();
      });

      const expected = result.current.state.worksheet!.chains.reduce(
        (sum, chain) => sum + chain.problems.length,
        0
      );

      expect(result.current.getTotalProblemsCount()).toBe(expected);
    });

    it('should return correct answered count', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      expect(result.current.getAnsweredCount()).toBe(0);

      const firstProblem = result.current.state.worksheet!.chains[0].problems[0];

      act(() => {
        result.current.submitAnswer(firstProblem.id, firstProblem.result);
      });

      expect(result.current.getAnsweredCount()).toBe(1);
    });

    it('should return correct count', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
      });

      const problems = result.current.state.worksheet!.chains[0].problems;

      // Submit one correct and one incorrect
      act(() => {
        result.current.submitAnswer(problems[0].id, problems[0].result); // Correct
        result.current.submitAnswer(problems[1].id, problems[1].result + 999); // Wrong
      });

      expect(result.current.getCorrectCount()).toBe(1);
    });

    it('should detect all chains complete', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.setConfig({ chainCount: 1, chainLength: 4 });
      });

      act(() => {
        result.current.generateNewWorksheet();
      });

      act(() => {
        result.current.startSession();
      });

      // Get count and verify we have problems
      const totalProblems = result.current.getTotalProblemsCount();
      expect(totalProblems).toBeGreaterThan(0);
      expect(result.current.getAnsweredCount()).toBe(0);

      // Answer all problems
      const allProblems = result.current.state.worksheet!.chains.flatMap(
        chain => chain.problems
      );

      act(() => {
        for (const problem of allProblems) {
          result.current.submitAnswer(problem.id, problem.result);
        }
      });

      expect(result.current.getAnsweredCount()).toBe(totalProblems);
      expect(result.current.isAllChainsComplete()).toBe(true);
    });
  });

  describe('Reset', () => {
    it('should reset to initial state while preserving stats', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.generateNewWorksheet();
        result.current.startSession();
        result.current.setUserProfile('kid');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.state.worksheet).toBeNull();
      expect(result.current.state.session).toBeNull();
      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.answers.size).toBe(0);
    });
  });
});
