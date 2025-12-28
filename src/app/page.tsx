'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import OperationMixSlider from '@/components/OperationMixSlider';
import HorizontalChain from '@/components/ChainDisplay';
import Timer from '@/components/Timer';
import confetti from 'canvas-confetti';
import {
  Brain,
  Play,
  RotateCcw,
  Sun,
  Moon,
  Settings,
  CheckCircle2,
  XCircle,
  Target,
  Trophy,
  Zap,
  Clock,
  Hash,
  Layers,
  ChevronDown,
  ChevronUp,
  Baby,
  User,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { UserProfile } from '@/types';

// Encouraging messages for kid mode
const CHAIN_COMPLETE_MESSAGES = [
  "Great job! You're doing amazing!",
  "Wow! You're a math superstar!",
  "Fantastic work! Keep it up!",
  "You're on fire! So smart!",
  "Incredible! You nailed it!",
  "Math wizard in action!",
  "You're crushing it!",
  "Awesome sauce! Way to go!",
];

const FINAL_COMPLETE_MESSAGES = [
  "You did it! You're a math champion!",
  "All done! You're absolutely brilliant!",
  "Congratulations! Perfect finish!",
  "Victory! You conquered all the chains!",
];

export default function Home() {
  const {
    state,
    setConfig,
    setOperationMix,
    setUserProfile,
    generateNewWorksheet,
    startSession,
    endSession,
    submitAnswer,
    setActiveInput,
    nextChain,
    reset,
    clearChainCompletion,
    getTotalProblemsCount,
    getAnsweredCount,
    getCorrectCount,
    isAllChainsComplete,
  } = useGame();

  const { resolvedTheme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [encourageMessage, setEncourageMessage] = useState<string | null>(null);

  const { worksheet, isPlaying, config, answers, activeChainIndex, activeInputIndex, session, userProfile, lastCompletedChainIndex } = state;

  const totalProblems = getTotalProblemsCount();
  const answeredCount = getAnsweredCount();
  const correctCount = getCorrectCount();
  const progress = totalProblems > 0 ? (answeredCount / totalProblems) * 100 : 0;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Trigger confetti for all chains complete
  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899'],
      });

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899'],
      });
    }, 250);
  }, []);

  // Handle chain completion encouragement for kid mode
  useEffect(() => {
    if (userProfile === 'kid' && lastCompletedChainIndex !== null && isPlaying) {
      const isAllComplete = isAllChainsComplete();

      if (isAllComplete) {
        // Show final message and confetti
        const message = FINAL_COMPLETE_MESSAGES[Math.floor(Math.random() * FINAL_COMPLETE_MESSAGES.length)];
        setEncourageMessage(message);
        triggerConfetti();
      } else {
        // Show encouraging message
        const message = CHAIN_COMPLETE_MESSAGES[Math.floor(Math.random() * CHAIN_COMPLETE_MESSAGES.length)];
        setEncourageMessage(message);
      }

      // Clear message after 2 seconds
      const timer = setTimeout(() => {
        setEncourageMessage(null);
        clearChainCompletion();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastCompletedChainIndex, userProfile, isPlaying, isAllChainsComplete, triggerConfetti, clearChainCompletion]);

  // Auto-end session when all chains complete
  useEffect(() => {
    if (isPlaying && isAllChainsComplete()) {
      endSession();
    }
  }, [isPlaying, isAllChainsComplete, endSession]);

  // Trigger confetti on session complete for kid mode
  useEffect(() => {
    if (session?.isComplete && userProfile === 'kid') {
      triggerConfetti();
    }
  }, [session?.isComplete, userProfile, triggerConfetti]);

  const handleChainComplete = (chainIndex: number) => {
    if (chainIndex === activeChainIndex) {
      nextChain();
    }
  };

  const handleProfileChange = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Encouragement Toast for Kid Mode */}
      {encourageMessage && userProfile === 'kid' && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-lg font-bold">{encourageMessage}</span>
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Mind Games</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mental Math Training</p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  showSettings
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Profile & Settings */}
          <aside className="lg:w-72 flex-shrink-0 space-y-4">
            {/* Profile Selection */}
            <div className="card p-4">
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                Profile
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProfileChange('kid')}
                  className={clsx(
                    'flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    userProfile === 'kid'
                      ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  <Baby className={clsx('w-6 h-6', userProfile === 'kid' ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                  <span className="text-sm font-semibold">Kid</span>
                  {userProfile === 'kid' && (
                    <span className="text-xs text-white/80">Fun mode!</span>
                  )}
                </button>
                <button
                  onClick={() => handleProfileChange('adult')}
                  className={clsx(
                    'flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    userProfile === 'adult'
                      ? 'bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  <User className={clsx('w-6 h-6', userProfile === 'adult' ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                  <span className="text-sm font-semibold">Adult</span>
                  {userProfile === 'adult' && (
                    <span className="text-xs text-white/80">Focus mode</span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Settings Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full btn btn-secondary justify-between"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </span>
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Settings Panel - Always visible on desktop */}
            <div className={clsx(
              'card overflow-hidden transition-all duration-300',
              'lg:block lg:max-h-none lg:opacity-100',
              showSettings ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100 border-0 lg:border'
            )}>
              <div className="p-4 space-y-6">
                {/* Operation Mix */}
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                    Operation Mix
                  </h3>
                  <OperationMixSlider
                    value={config.operationMix}
                    onChange={setOperationMix}
                    minPercent={10}
                  />
                </div>

                {/* Other settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Configuration
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="label flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Max Result
                      </label>
                      <select
                        value={config.maxResult}
                        onChange={(e) => setConfig({ maxResult: parseInt(e.target.value) })}
                        className="select text-sm"
                      >
                        {[20, 50, 100, 200, 500, 1000, 5000, 10000].map((n) => (
                          <option key={n} value={n}>{n.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Chains
                      </label>
                      <select
                        value={config.chainCount}
                        onChange={(e) => setConfig({ chainCount: parseInt(e.target.value) })}
                        className="select text-sm"
                      >
                        {[3, 4, 5, 6, 7, 8, 10].map((n) => (
                          <option key={n} value={n}>{n} chains</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Chain Length
                      </label>
                      <select
                        value={config.chainLength}
                        onChange={(e) => setConfig({ chainLength: parseInt(e.target.value) })}
                        className="select text-sm"
                      >
                        {[4, 5, 6, 7, 8, 10, 12].map((n) => (
                          <option key={n} value={n}>{n} problems</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time Limit
                      </label>
                      <select
                        value={config.timeLimit}
                        onChange={(e) => setConfig({ timeLimit: parseInt(e.target.value) })}
                        className="select text-sm"
                      >
                        <option value={0}>No limit</option>
                        <option value={60}>1 min</option>
                        <option value={120}>2 min</option>
                        <option value={180}>3 min</option>
                        <option value={300}>5 min</option>
                        <option value={600}>10 min</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Control Bar */}
            <div className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Generate button */}
                <button
                  onClick={() => {
                    generateNewWorksheet();
                  }}
                  disabled={isPlaying}
                  className="btn btn-primary"
                >
                  <Zap className="w-4 h-4" />
                  Generate
                </button>

                {/* Start/Stop button */}
                {worksheet && !isPlaying && !session?.isComplete && (
                  <button onClick={startSession} className="btn btn-success">
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                )}

                {isPlaying && (
                  <button onClick={endSession} className="btn btn-danger">
                    <Target className="w-4 h-4" />
                    Finish
                  </button>
                )}

                {/* Reset button */}
                {(worksheet || session) && (
                  <button onClick={reset} className="btn btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Timer */}
                {isPlaying && config.timeLimit > 0 && (
                  <Timer
                    timeLimit={config.timeLimit}
                    isRunning={isPlaying}
                    isPaused={false}
                    onTimeUp={endSession}
                    className="!p-2 !rounded-lg"
                  />
                )}

                {/* Progress stats */}
                {worksheet && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{answeredCount}</span>
                      <span className="text-slate-400">/</span>
                      <span>{totalProblems}</span>
                    </div>

                    {answeredCount > 0 && (
                      <>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">{correctCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span className="font-medium">{answeredCount - correctCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
                          <Target className="w-4 h-4" />
                          <span className="font-medium">{accuracy}%</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {worksheet && (
                <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Chains Display */}
            {worksheet && worksheet.chains.length > 0 ? (
              <div className="space-y-3">
                {worksheet.chains.map((chain, index) => (
                  <HorizontalChain
                    key={chain.id}
                    chain={chain}
                    chainIndex={index}
                    isActive={isPlaying && index === activeChainIndex}
                    answers={answers}
                    onSubmitAnswer={submitAnswer}
                    onChainComplete={() => handleChainComplete(index)}
                    activeInputIndex={index === activeChainIndex ? activeInputIndex : 0}
                    onSetActiveInput={setActiveInput}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Ready to Train?
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Click <strong>Generate</strong> to create problem chains.
                  Use <strong>Tab</strong> to move between answers.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>
                    </div>
                    <span>{config.operationMix.add}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">-</span>
                    </div>
                    <span>{config.operationMix.subtract}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">x</span>
                    </div>
                    <span>{config.operationMix.multiply}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">/</span>
                    </div>
                    <span>{config.operationMix.divide}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Session Complete */}
            {session?.isComplete && (
              <div className="card p-8 text-center animate-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {userProfile === 'kid' ? (
                    session.score.percentage >= 90
                      ? "You're a SUPERSTAR!"
                      : session.score.percentage >= 70
                      ? "Amazing work!"
                      : session.score.percentage >= 50
                      ? "Great effort, champ!"
                      : "Keep practicing, you got this!"
                  ) : (
                    session.score.percentage >= 90
                      ? 'Excellent!'
                      : session.score.percentage >= 70
                      ? 'Great Job!'
                      : session.score.percentage >= 50
                      ? 'Good Effort!'
                      : 'Keep Practicing!'
                  )}
                </h2>
                <div className="text-5xl font-bold text-gradient mb-4">
                  {session.score.percentage}%
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You got <span className="font-semibold text-emerald-600">{session.score.correct}</span> out of{' '}
                  <span className="font-semibold">{session.score.total}</span> correct
                </p>
                <button onClick={reset} className="btn btn-primary">
                  <RotateCcw className="w-4 h-4" />
                  {userProfile === 'kid' ? 'Play Again!' : 'Try Again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
        Mind Games - Practice makes perfect
      </footer>
    </div>
  );
}
