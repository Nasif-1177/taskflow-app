import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, ResetIcon, SkipIcon, FlameIcon, TimerIcon, CheckCircleIcon } from './Icons';
import { sound } from '../utils/sound';
import { triggerConfetti } from '../utils/helpers';

const MODES = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25, color: 'text-indigo-600 dark:text-indigo-400', stroke: '#6366f1' },
  short_break: { label: 'Short Break', defaultMinutes: 5, color: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981' },
  long_break: { label: 'Long Break', defaultMinutes: 15, color: 'text-blue-600 dark:text-blue-400', stroke: '#3b82f6' },
};

export function PomodoroTimer({
  tasks,
  activeTaskId,
  onSetActiveTask,
  onTaskPomodoroIncrement,
  onLogFocusTime,
}) {
  const [mode, setMode] = useState('pomodoro');
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const totalSeconds = minutes * 60;

  // Handle mode switches
  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    const m = MODES[newMode].defaultMinutes;
    setMinutes(m);
    setSecondsLeft(m * 60);
  };

  // Timer interval effect
  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      // Completed!
      sound.playTimerAlert();
      triggerConfetti();
      setIsRunning(false);

      if (mode === 'pomodoro') {
        const nextSessions = completedSessions + 1;
        setCompletedSessions(nextSessions);
        if (onLogFocusTime) {
          onLogFocusTime(minutes);
        }
        if (activeTaskId && onTaskPomodoroIncrement) {
          onTaskPomodoroIncrement(activeTaskId);
        }

        // Switch to break automatically
        if (nextSessions % 4 === 0) {
          switchMode('long_break');
        } else {
          switchMode('short_break');
        }
      } else {
        switchMode('pomodoro');
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, mode, completedSessions, activeTaskId, minutes]);

  // Global keyboard shortcuts (Space for pause/play)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
        sound.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
    sound.playClick();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(minutes * 60);
    sound.playClick();
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      switchMode('short_break');
    } else {
      switchMode('pomodoro');
    }
    sound.playClick();
  };

  // SVG Progress calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const strokeDashoffset = circumference - progress * circumference;

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;
  const formattedTime = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Timer Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 sm:p-12 flex flex-col items-center">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-8 border border-slate-200 dark:border-slate-700/60">
          {Object.entries(MODES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                mode === key
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={MODES[mode].stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {formattedTime}
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-2">
              {isRunning ? 'Focusing...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={resetTimer}
            title="Reset timer"
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ResetIcon className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white text-base flex items-center gap-2.5 transition shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 glow-active'
            }`}
          >
            {isRunning ? (
              <>
                <PauseIcon className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <PlayIcon className="w-5 h-5" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            title="Skip phase"
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <SkipIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">Space</kbd> to toggle timer
        </p>
      </div>

      {/* Linked Task Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <TimerIcon className="w-4 h-4 text-indigo-500" />
            Link Timer to Active Task
          </h3>
          {activeTask && (
            <button
              onClick={() => onSetActiveTask(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear link
            </button>
          )}
        </div>

        <select
          value={activeTaskId || ''}
          onChange={(e) => onSetActiveTask(e.target.value || null)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- No specific task (General focus) --</option>
          {tasks
            .filter((t) => t.status !== 'done')
            .map((task) => (
              <option key={task.id} value={task.id}>
                {task.title} ({task.completedPomodoros || 0}/{task.estimatedPomodoros || 1} pomodoros)
              </option>
            ))}
        </select>

        {activeTask && (
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                Active: {activeTask.title}
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">
                Completing a Pomodoro cycle will automatically log 1 session towards this task.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-xs">
              {activeTask.completedPomodoros || 0} / {activeTask.estimatedPomodoros || 1}
            </span>
          </div>
        )}
      </div>

      {/* Daily Pomodoro Streak Counter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
            <FlameIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sessions Today</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedSessions}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center">
            <TimerIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Focus Minutes</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedSessions * 25}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
