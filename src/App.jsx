import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { TodoList } from './components/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_TASKS } from './utils/seedData';
import { sound } from './utils/sound';

export function App() {
  const [tasks, setTasks] = useLocalStorage('taskflow_tasks', INITIAL_TASKS);
  const [darkMode, setDarkMode] = useLocalStorage('taskflow_dark_mode', false);
  const [focusMinutes, setFocusMinutes] = useLocalStorage('taskflow_focus_minutes', 50);

  const [activeTab, setActiveTab] = useState('kanban');
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Task Operations
  const handleSaveTask = (taskData) => {
    const exists = tasks.some((t) => t.id === taskData.id);
    if (exists) {
      setTasks(tasks.map((t) => (t.id === taskData.id ? taskData : t)));
      showToast('Task updated successfully');
    } else {
      setTasks([taskData, ...tasks]);
      showToast('New task created');
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      showToast('Task deleted');
    }
  };

  const handleMoveStatus = (taskId, nextStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    sound.playClick();
  };

  const handleToggleComplete = (taskId, nextStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleSelectForTimer = (task) => {
    setActiveTaskId(task.id);
    setActiveTab('pomodoro');
    showToast(`Timer focused on: "${task.title}"`);
  };

  const handleTaskPomodoroIncrement = (taskId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
          : t
      )
    );
  };

  const handleLogFocusTime = (minutes) => {
    setFocusMinutes((prev) => (prev || 0) + minutes);
  };

  const handleOpenCreateModal = (status = 'todo') => {
    setTaskToEdit(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  // Batch actions
  const handleBatchAction = (action) => {
    if (action === 'clear_completed') {
      if (window.confirm('Clear all completed tasks from your lists?')) {
        setTasks(tasks.filter((t) => t.status !== 'done'));
        showToast('Completed tasks cleared');
      }
    }
  };

  // Export / Import Data
  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tasks,
      focusMinutes,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
  };

  const handleImportData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported.tasks)) {
          setTasks(imported.tasks);
          if (imported.focusMinutes !== undefined) {
            setFocusMinutes(imported.focusMinutes);
          }
          showToast('Data imported successfully!');
        } else {
          alert('Invalid backup file format: missing tasks array.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset to sample demo data? Your current custom tasks will be replaced.'
      )
    ) {
      setTasks(INITIAL_TASKS);
      setFocusMinutes(50);
      showToast('Reset to demo data completed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCreateModal={handleOpenCreateModal}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        taskCount={tasks.filter((t) => t.status !== 'done').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveStatus={handleMoveStatus}
            onSelectForTimer={handleSelectForTimer}
            onToggleComplete={handleToggleComplete}
            onOpenCreateModal={handleOpenCreateModal}
          />
        )}

        {activeTab === 'todos' && (
          <TodoList
            tasks={tasks}
            onSaveTask={handleSaveTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onSelectForTimer={handleSelectForTimer}
            onToggleComplete={handleToggleComplete}
            onBatchAction={handleBatchAction}
          />
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSetActiveTask={setActiveTaskId}
            onTaskPomodoroIncrement={handleTaskPomodoroIncrement}
            onLogFocusTime={handleLogFocusTime}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView tasks={tasks} focusMinutes={focusMinutes} />
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={defaultStatus}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-400">
        <p>
          TaskFlow — 100% Frontend Client-Side Web App. Zero server required. Data stored locally.
        </p>
      </footer>
    </div>
  );
}

export default App;
