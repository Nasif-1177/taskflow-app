import React from 'react';
import {
  CalendarIcon,
  TagIcon,
  TimerIcon,
  CheckCircleIcon,
  EditIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
} from './Icons';
import { getPriorityBadge, getCategoryBadge, formatDate, triggerConfetti } from '../utils/helpers';
import { sound } from '../utils/sound';

const COLUMNS = ['todo', 'in_progress', 'review', 'done'];

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
  onSelectForTimer,
  onToggleComplete,
}) {
  const priorityInfo = getPriorityBadge(task.priority);
  const categoryInfo = getCategoryBadge(task.category);

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const isDone = task.status === 'done';

  const currentIndex = COLUMNS.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < COLUMNS.length - 1;

  const handleCompleteClick = () => {
    sound.playComplete();
    if (!isDone) {
      triggerConfetti();
    }
    onToggleComplete(task.id, isDone ? 'todo' : 'done');
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${priorityInfo.classes}`}>
            {priorityInfo.label}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${categoryInfo.bg}`}>
            {categoryInfo.label}
          </span>
        </div>

        {/* Quick Menu */}
        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex items-start gap-2.5 mb-2">
        <button
          onClick={handleCompleteClick}
          title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
          className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
        >
          <div
            className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-colors ${
              isDone
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {isDone && <CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
          </div>
        </button>
        <div>
          <h3
            className={`font-semibold text-sm leading-snug ${
              isDone
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="my-3 py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span>Subtasks</span>
            <span className="font-semibold">{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Meta Details */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(task.dueDate)}</span>
            </span>
          )}

          {/* Pomodoros */}
          <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
            <TimerIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {task.completedPomodoros || 0}/{task.estimatedPomodoros || 1}
            </span>
          </span>
        </div>

        {/* Move & Focus Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectForTimer(task)}
            title="Focus on this task in Pomodoro"
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 transition"
          >
            <PlayIcon className="w-2.5 h-2.5" /> Focus
          </button>

          {canMoveLeft && (
            <button
              onClick={() => onMoveStatus(task.id, COLUMNS[currentIndex - 1])}
              title={`Move to ${COLUMNS[currentIndex - 1].replace('_', ' ')}`}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeftIcon className="w-3 h-3" />
            </button>
          )}

          {canMoveRight && (
            <button
              onClick={() => onMoveStatus(task.id, COLUMNS[currentIndex + 1])}
              title={`Move to ${COLUMNS[currentIndex + 1].replace('_', ' ')}`}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowRightIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
