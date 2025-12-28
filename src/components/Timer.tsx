'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface TimerProps {
  timeLimit: number; // in seconds, 0 = count up
  isRunning: boolean;
  isPaused: boolean;
  onTimeUp?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  className?: string;
}

export default function Timer({
  timeLimit,
  isRunning,
  isPaused,
  onTimeUp,
  onPause,
  onResume,
  onReset,
  className,
}: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  const resetTimer = useCallback(() => {
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      resetTimer();
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;

        // Check if time is up (countdown mode)
        if (timeLimit > 0 && newTime >= timeLimit) {
          onTimeUp?.();
          return timeLimit;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLimit, onTimeUp, resetTimer]);

  const displayTime = timeLimit > 0 ? Math.max(0, timeLimit - elapsedTime) : elapsedTime;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (timeLimit <= 0) return 0;
    return ((timeLimit - elapsedTime) / timeLimit) * 100;
  };

  const isLowTime = timeLimit > 0 && displayTime <= 30;
  const isCriticalTime = timeLimit > 0 && displayTime <= 10;

  return (
    <div
      className={clsx(
        'flex items-center gap-4 p-4 rounded-xl',
        isLowTime && !isCriticalTime && 'bg-yellow-50 dark:bg-yellow-900/20',
        isCriticalTime && 'bg-red-50 dark:bg-red-900/20 animate-pulse',
        !isLowTime && 'bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      <div className="relative">
        <Clock
          className={clsx(
            'w-8 h-8',
            isCriticalTime
              ? 'text-red-500'
              : isLowTime
              ? 'text-yellow-500'
              : 'text-primary-500'
          )}
        />
        {timeLimit > 0 && (
          <svg
            className="absolute inset-0 -rotate-90 w-8 h-8"
            viewBox="0 0 32 32"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${getProgressPercentage() * 0.88} 88`}
              className={clsx(
                isCriticalTime
                  ? 'text-red-500'
                  : isLowTime
                  ? 'text-yellow-500'
                  : 'text-primary-500'
              )}
            />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <div
          className={clsx(
            'text-3xl font-mono font-bold tabular-nums',
            isCriticalTime
              ? 'text-red-600 dark:text-red-400'
              : isLowTime
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-slate-900 dark:text-white'
          )}
        >
          {formatTime(displayTime)}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {timeLimit > 0 ? 'Time Remaining' : 'Elapsed Time'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isRunning && !isPaused && (
          <button
            onClick={onPause}
            className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            title="Pause"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}

        {isRunning && isPaused && (
          <button
            onClick={onResume}
            className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            title="Resume"
          >
            <Play className="w-5 h-5" />
          </button>
        )}

        {isRunning && (
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
