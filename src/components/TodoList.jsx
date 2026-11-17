import React, { useState, useMemo } from 'react';
import {
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  TimerIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
} from './Icons';
import { getPriorityBadge, getCategoryBadge, formatDate, triggerConfetti } from '../utils/helpers';
import { sound } from '../utils/sound';

export function TodoList({
  tasks,
  onSaveTask,
  onEditTask,
  onDeleteTask,
  onSelectForTimer,
  onToggleComplete,
  onBatchAction,
}) {
  const [quickTitle, setQuickTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'active', 'completed'
  const [search, setSearch] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: quickTitle.trim(),
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'work',
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      dueDate: todayStr,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    onSaveTask(newTask);
    setQuickTitle('');
    sound.playClick();
  };

  const handleToggle = (task) => {
    sound.playComplete();
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    if (nextStatus === 'done') {
      triggerConfetti();
    }
    onToggleComplete(task.id, nextStatus);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (filter === 'today') return t.dueDate === todayStr;
      if (filter === 'active') return t.status !== 'done';
      if (filter === 'completed') return t.status === 'done';
      return true;
    });
  }, [tasks, filter, search, todayStr]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-1">
              <SparklesIcon className="w-4 h-4" /> Focus Mode & Daily Planner
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, ready to achieve your goals?
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              {completedTasks} of {totalTasks} tasks completed ({percentComplete}% velocity)
            </p>
          </div>

          <div className="w-full sm:w-44 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span>Overall Progress</span>
              <span className="font-bold">{percentComplete}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <span className="pl-3 text-slate-400">
          <PlusIcon className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Add a new task for today... (Press Enter to save)"
          className="flex-1 px-2 py-2 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl transition"
        >
          Add Task
        </button>
      </form>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: 'Today' },
            { id: 'active', label: 'Incomplete' },
            { id: 'completed', label: 'Done' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === tab.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter list..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {completedTasks > 0 && (
            <button
              onClick={() => onBatchAction('clear_completed')}
              className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-rose-200 dark:border-rose-900/60"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Task Rows List */}
      <div className="space-y-2.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isDone = task.status === 'done';
            const priorityBadge = getPriorityBadge(task.priority);
            const categoryBadge = getCategoryBadge(task.category);
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between gap-3">
                  {/* Left: Checkbox + Title */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggle(task)}
                      className="shrink-0 text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isDone && <CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-medium text-sm ${
                            isDone
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${priorityBadge.classes}`}>
                          {priorityBadge.label}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${categoryBadge.bg}`}>
                          {categoryBadge.label}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Meta & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {task.dueDate && (
                      <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}

                    <button
                      onClick={() => onSelectForTimer(task)}
                      title="Start Pomodoro for this task"
                      className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition flex items-center gap-1"
                    >
                      <PlayIcon className="w-3 h-3" />
                      <span className="hidden md:inline">Focus</span>
                    </button>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                      </button>
                    )}

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                  <div className="px-12 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${st.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                          {st.completed && <CheckCircleIcon className="w-2.5 h-2.5 text-white" />}
                        </span>
                        <span className={st.completed ? 'line-through text-slate-400' : ''}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No tasks found in this view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
