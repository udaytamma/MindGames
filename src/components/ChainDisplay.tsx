'use client';

import React, { useRef, useEffect, useCallback, useState, createRef } from 'react';
import { Problem, ProblemChain, OPERATION_SYMBOLS } from '@/types';
import { formatNumber } from '@/lib/problem-generator';
import { Check, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ChainInputProps {
  problem: Problem;
  isActive: boolean;
  isDisabled: boolean;
  answer: { userAnswer: number | null; isCorrect: boolean | null } | undefined;
  onSubmit: (answer: number) => void;
  onTabToNext: () => void;
  isExpanded: boolean;
}

const ChainInput = React.forwardRef<HTMLInputElement, ChainInputProps>(
  function ChainInput(
    { problem, isActive, isDisabled, answer, onSubmit, onTabToNext, isExpanded },
    ref
  ) {
    const [inputValue, setInputValue] = useState('');
    const hasAnswered = answer !== undefined && answer.userAnswer !== null;

    useEffect(() => {
      if (isActive && ref && 'current' in ref && ref.current && isExpanded) {
        ref.current.focus();
      }
    }, [isActive, ref, isExpanded]);

    useEffect(() => {
      if (hasAnswered) {
        setInputValue('');
      }
    }, [hasAnswered]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (inputValue.trim()) {
          const numAnswer = parseInt(inputValue, 10);
          if (!isNaN(numAnswer)) {
            onSubmit(numAnswer);
          }
        }
        onTabToNext();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim()) {
          const numAnswer = parseInt(inputValue, 10);
          if (!isNaN(numAnswer)) {
            onSubmit(numAnswer);
            onTabToNext();
          }
        }
      }
    };

    const baseClasses = isExpanded
      ? 'w-24 h-12 text-center font-mono text-2xl font-semibold border-2 rounded-lg transition-all duration-150'
      : 'w-14 h-7 text-center font-mono text-sm border rounded transition-all duration-150';

    const getInputClassName = () => {
      if (hasAnswered) {
        return clsx(
          baseClasses,
          answer?.isCorrect
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
        );
      }
      if (isActive && !isDisabled) {
        return clsx(
          baseClasses,
          'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border-primary-400 dark:border-primary-600',
          'ring-2 ring-primary-400 ring-offset-2 dark:ring-offset-slate-900'
        );
      }
      return clsx(
        baseClasses,
        'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600'
      );
    };

    if (hasAnswered) {
      return (
        <div className={clsx('flex items-center justify-center gap-1', getInputClassName())}>
          <span className="font-mono">{answer?.userAnswer}</span>
          {isExpanded && (
            answer?.isCorrect ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-xs opacity-70">({problem.result})</span>
            )
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder="?"
        className={getInputClassName()}
        tabIndex={isActive && !isDisabled ? 0 : -1}
      />
    );
  }
);

interface HorizontalChainProps {
  chain: ProblemChain;
  chainIndex: number;
  isActive: boolean;
  answers: Map<string, { userAnswer: number | null; isCorrect: boolean | null }>;
  onSubmitAnswer: (problemId: string, answer: number) => void;
  onChainComplete: () => void;
  activeInputIndex: number;
  onSetActiveInput: (index: number) => void;
}

export default function HorizontalChain({
  chain,
  chainIndex,
  isActive,
  answers,
  onSubmitAnswer,
  onChainComplete,
  activeInputIndex,
  onSetActiveInput,
}: HorizontalChainProps) {
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = chain.problems.map((_, i) => inputRefs.current[i] || createRef<HTMLInputElement>());
  }, [chain.problems]);

  const handleTabToNext = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= chain.problems.length) {
      onChainComplete();
    } else {
      onSetActiveInput(nextIndex);
    }
  }, [chain.problems.length, onChainComplete, onSetActiveInput]);

  // Scroll active input into view
  useEffect(() => {
    if (isActive && inputRefs.current[activeInputIndex]?.current) {
      inputRefs.current[activeInputIndex].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [isActive, activeInputIndex]);

  const isExpanded = isActive;
  const completedCount = chain.problems.filter(p => answers.has(p.id) && answers.get(p.id)?.userAnswer !== null).length;
  const correctCount = chain.problems.filter(p => answers.get(p.id)?.isCorrect === true).length;

  return (
    <div
      ref={containerRef}
      className={clsx(
        'rounded-xl border transition-all duration-500 ease-out overflow-hidden',
        isExpanded
          ? 'bg-white dark:bg-slate-900 border-primary-200 dark:border-primary-800 shadow-lg p-5'
          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer'
      )}
    >
      {/* Chain header */}
      <div className={clsx('flex items-center gap-3', isExpanded ? 'mb-4' : 'mb-2')}>
        <div className={clsx(
          'rounded-lg font-bold flex items-center justify-center transition-all duration-300',
          isExpanded
            ? 'w-10 h-10 text-lg bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
            : 'w-6 h-6 text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        )}>
          {chainIndex + 1}
        </div>

        {isExpanded ? (
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Chain {chainIndex + 1}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} / {chain.problems.length} completed
              {correctCount > 0 && ` • ${correctCount} correct`}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount}/{chain.problems.length}
            </span>
            {completedCount === chain.problems.length && (
              <span className={clsx(
                'text-xs font-medium',
                correctCount === chain.problems.length
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}>
                {Math.round((correctCount / chain.problems.length) * 100)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chain flow */}
      <div className={clsx(
        'flex items-center overflow-x-auto pb-2 scrollbar-thin',
        isExpanded ? 'gap-3' : 'gap-1'
      )}>
        {/* Starting number */}
        <span className={clsx(
          'flex-shrink-0 font-mono font-semibold tabular-nums',
          isExpanded
            ? 'text-3xl text-slate-800 dark:text-slate-100'
            : 'text-base text-slate-600 dark:text-slate-400'
        )}>
          {formatNumber(chain.startingNumber)}
        </span>

        {/* Problems */}
        {chain.problems.map((problem, index) => {
          const answer = answers.get(problem.id);
          const isProblemActive = isActive && index === activeInputIndex;
          const isDisabled = !isActive || index !== activeInputIndex;

          return (
            <React.Fragment key={problem.id}>
              {/* Operator only (no arrow before) */}
              <span className={clsx(
                'flex-shrink-0 font-semibold tabular-nums',
                isExpanded
                  ? 'text-xl text-primary-600 dark:text-primary-400'
                  : 'text-sm text-slate-500 dark:text-slate-500'
              )}>
                {OPERATION_SYMBOLS[problem.operation]}{formatNumber(problem.operand)}
              </span>

              {/* Equals sign */}
              <span className={clsx(
                'flex-shrink-0 font-semibold',
                isExpanded
                  ? 'text-xl text-slate-400 dark:text-slate-500'
                  : 'text-sm text-slate-400 dark:text-slate-600'
              )}>
                =
              </span>

              {/* Input */}
              <ChainInput
                ref={inputRefs.current[index]}
                problem={problem}
                isActive={isProblemActive}
                isDisabled={isDisabled}
                answer={answer}
                onSubmit={(ans) => onSubmitAnswer(problem.id, ans)}
                onTabToNext={() => handleTabToNext(index)}
                isExpanded={isExpanded}
              />

              {/* Arrow after answer (except for last problem) */}
              {index < chain.problems.length - 1 && (
                <ChevronRight className={clsx(
                  'flex-shrink-0 text-slate-300 dark:text-slate-600',
                  isExpanded ? 'w-5 h-5' : 'w-3 h-3'
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar for collapsed chains */}
      {!isExpanded && completedCount > 0 && (
        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${(completedCount / chain.problems.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
