import React from 'react';
import { ChartIcon, FlameIcon, TimerIcon, CheckCircleIcon, SparklesIcon } from './Icons';
import { INITIAL_CATEGORIES } from '../utils/seedData';

export function AnalyticsView({ tasks, focusMinutes = 0 }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalPomodoros = tasks.reduce((sum, t) => sum + (t.completedPomodoros || 0), 0);
  const totalFocusHours = ((focusMinutes + totalPomodoros * 25) / 60).toFixed(1);

  // Priority count
  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  // Category counts
  const categoryCounts = INITIAL_CATEGORIES.map((cat) => ({
    ...cat,
    count: tasks.filter((t) => t.category === cat.id).length,
  }));

  // Mock days of the week activity based on task dates or seed
  const weekDays = [
    { day: 'Mon', completed: 4, target: 5 },
    { day: 'Tue', completed: 6, target: 5 },
    { day: 'Wed', completed: 3, target: 5 },
    { day: 'Thu', completed: 5, target: 5 },
    { day: 'Fri', completed: 7, target: 5 },
    { day: 'Sat', completed: 2, target: 4 },
    { day: 'Sun', completed: 3, target: 4 },
  ];

  // Productivity Score Calculation
  const productivityScore = Math.min(100, Math.round(completionRate * 0.7 + Math.min(30, totalPomodoros * 5)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({completedTasks}/{totalTasks})
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Focus Time</span>
            <TimerIcon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalFocusHours}h
            </span>
            <span className="text-xs text-slate-500">logged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            {totalPomodoros} completed Pomodoro sessions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Productivity Score</span>
            <SparklesIcon className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {productivityScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
            <FlameIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">5</span>
            <span className="text-xs text-slate-500">days streak</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
            🔥 Keep up the momentum!
          </p>
        </div>
      </div>

      {/* Two-Column Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Weekly Velocity</h3>
              <p className="text-xs text-slate-400">Tasks completed each day</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              This Week
            </span>
          </div>

          <div className="flex items-end justify-between h-44 pt-4 px-2">
            {weekDays.map((item) => {
              const heightPercent = Math.min(100, Math.round((item.completed / 8) * 100));
              return (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {item.completed}
                  </span>
                  <div className="w-8 sm:w-10 bg-slate-100 dark:bg-slate-800 rounded-t-xl h-32 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Priority Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Task urgency distribution</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">High Priority</span>
                  <span>{highPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-600 dark:text-amber-400">Medium Priority</span>
                  <span>{mediumPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Low Priority</span>
                  <span>{lowPriority} tasks</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Category Distribution
            </h3>
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-slate-50 dark:bg-slate-800"
                >
                  <span className="text-slate-800 dark:text-slate-200">{cat.label}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
