'use client';

import React, { useCallback } from 'react';
import { Plus, Minus, X, Divide, Shuffle, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import clsx from 'clsx';

export interface OperationMix {
  add: number;
  subtract: number;
  multiply: number;
  divide: number;
}

interface OperationMixSliderProps {
  value: OperationMix;
  onChange: (mix: OperationMix) => void;
  minPercent?: number;
}

const OPERATIONS = [
  { key: 'add' as const, label: 'Add', icon: Plus, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'subtract' as const, label: 'Sub', icon: Minus, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
  { key: 'multiply' as const, label: 'Mul', icon: X, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
  { key: 'divide' as const, label: 'Div', icon: Divide, color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' },
];

const PRESETS = [
  {
    name: 'Random',
    mix: { add: 25, subtract: 25, multiply: 25, divide: 25 },
    icon: Shuffle,
    description: 'Equal mix'
  },
  {
    name: 'Basic',
    mix: { add: 40, subtract: 40, multiply: 10, divide: 10 },
    icon: BookOpen,
    description: 'Add & subtract focus'
  },
  {
    name: 'Advanced',
    mix: { add: 20, subtract: 20, multiply: 30, divide: 30 },
    icon: GraduationCap,
    description: 'More multiply & divide'
  },
  {
    name: 'Expert',
    mix: { add: 10, subtract: 10, multiply: 40, divide: 40 },
    icon: Trophy,
    description: 'Heavy multiply & divide'
  },
];

const mixEquals = (a: OperationMix, b: OperationMix): boolean => {
  return a.add === b.add && a.subtract === b.subtract && a.multiply === b.multiply && a.divide === b.divide;
};

export default function OperationMixSlider({
  value,
  onChange,
  minPercent = 10,
}: OperationMixSliderProps) {
  const adjustValue = useCallback(
    (key: keyof OperationMix, delta: number) => {
      const newValue = { ...value };
      const currentVal = newValue[key];
      const newVal = Math.max(minPercent, Math.min(100 - 3 * minPercent, currentVal + delta));

      if (newVal === currentVal) return;

      const diff = newVal - currentVal;
      newValue[key] = newVal;

      // Distribute the difference among other operations
      const otherKeys = (Object.keys(newValue) as (keyof OperationMix)[]).filter(k => k !== key);
      const totalOther = otherKeys.reduce((sum, k) => sum + newValue[k], 0);

      if (totalOther === 0) return;

      // Proportionally adjust others
      let remaining = -diff;
      for (let i = 0; i < otherKeys.length; i++) {
        const k = otherKeys[i];
        if (i === otherKeys.length - 1) {
          newValue[k] = Math.max(minPercent, newValue[k] + remaining);
        } else {
          const proportion = newValue[k] / totalOther;
          const adjustment = Math.round(remaining * proportion);
          const adjusted = Math.max(minPercent, newValue[k] + adjustment);
          const actualAdjustment = adjusted - newValue[k];
          newValue[k] = adjusted;
          remaining -= actualAdjustment;
        }
      }

      // Normalize to exactly 100%
      const total = Object.values(newValue).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        const diff = 100 - total;
        const sortedKeys = otherKeys.sort((a, b) => newValue[b] - newValue[a]);
        for (const k of sortedKeys) {
          const newKeyVal = newValue[k] + diff;
          if (newKeyVal >= minPercent) {
            newValue[k] = newKeyVal;
            break;
          }
        }
      }

      onChange(newValue);
    },
    [value, onChange, minPercent]
  );

  const handleSliderChange = (key: keyof OperationMix, newPercent: number) => {
    const clampedPercent = Math.max(minPercent, Math.min(100 - 3 * minPercent, newPercent));
    const diff = clampedPercent - value[key];
    if (diff !== 0) {
      adjustValue(key, diff);
    }
  };

  const getSelectedPreset = () => {
    return PRESETS.find(p => mixEquals(p.mix, value))?.name || null;
  };

  const selectedPreset = getSelectedPreset();

  return (
    <div className="space-y-4">
      {/* Presets - Now at top and larger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map(({ name, mix, icon: Icon, description }) => {
          const isSelected = selectedPreset === name;
          return (
            <button
              key={name}
              onClick={() => onChange(mix)}
              className={clsx(
                'flex flex-col items-center gap-1 px-3 py-3 rounded-xl font-medium transition-all duration-200',
                isSelected
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <Icon className={clsx('w-5 h-5', isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
              <span className="text-sm font-semibold">{name}</span>
              <span className={clsx(
                'text-xs',
                isSelected ? 'text-primary-100' : 'text-slate-500 dark:text-slate-400'
              )}>
                {description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual bar showing distribution */}
      <div className="slider-track bg-slate-200 dark:bg-slate-700">
        {OPERATIONS.map(({ key, color }) => (
          <div
            key={key}
            className={clsx('slider-segment', color)}
            style={{ width: `${value[key]}%` }}
          />
        ))}
      </div>

      {/* Individual controls */}
      <div className="grid grid-cols-4 gap-3">
        {OPERATIONS.map(({ key, label, icon: Icon, color, textColor }) => (
          <div key={key} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className={clsx('w-6 h-6 rounded-md flex items-center justify-center', color)}>
                <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {label}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => adjustValue(key, -5)}
                disabled={value[key] <= minPercent}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className={clsx('text-lg font-bold w-12 tabular-nums', textColor)}>
                {value[key]}%
              </span>

              <button
                onClick={() => adjustValue(key, 5)}
                disabled={value[key] >= 100 - 3 * minPercent}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Slider input */}
            <input
              type="range"
              min={minPercent}
              max={100 - 3 * minPercent}
              value={value[key]}
              onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
              className="w-full h-1.5 mt-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
