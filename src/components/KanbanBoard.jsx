import React, { useState, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { PlusIcon, SearchIcon, FilterIcon } from './Icons';
import { INITIAL_CATEGORIES } from '../utils/seedData';

const COLUMNS = [
  { id: 'todo', title: 'To Do', accent: 'bg-indigo-500' },
  { id: 'in_progress', title: 'In Progress', accent: 'bg-amber-500' },
  { id: 'review', title: 'In Review', accent: 'bg-purple-500' },
  { id: 'done', title: 'Completed', accent: 'bg-emerald-500' },
];

export function KanbanBoard({
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onSelectForTimer,
  onToggleComplete,
  onOpenCreateModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === 'all' || task.category === categoryFilter;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, priorityFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by keyword..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {INITIAL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* New Task Button */}
          <button
            onClick={() => onOpenCreateModal('todo')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
          >
            <PlusIcon className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-800/60 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.accent}`} />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {col.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenCreateModal(col.id)}
                  title={`Add task to ${col.title}`}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onMoveStatus={onMoveStatus}
                      onSelectForTimer={onSelectForTimer}
                      onToggleComplete={onToggleComplete}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      No tasks in {col.title}
                    </p>
                    <button
                      onClick={() => onOpenCreateModal(col.id)}
                      className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Create task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
