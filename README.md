# TaskFlow — Interactive Productivity & Task Management Hub

A modern, fast, and feature-complete **100% frontend-only** web application built with **React 19**, **Vite**, and **Tailwind CSS**.

Because TaskFlow runs entirely on the client, **no backend, no Node.js server, and no database** are needed in production. All state automatically persists in the browser via `localStorage` and can be backed up or restored anytime via JSON export/import.

---

## 🌟 Key Features

### 1. Interactive Kanban Board
- **4 Workflow Columns:** *To Do*, *In Progress*, *In Review*, and *Completed*.
- **Quick Card Actions:** Instant column shifts (Left / Right navigation), direct task editing, deletion, and quick completion.
- **Search & Filters:** Instant real-time filtering by keyword, priority (*High*, *Medium*, *Low*), or category tags (*Work*, *Study*, *Personal*, *Design*, *Health*).
- **Celebration Effects:** Micro-confetti burst animation and celebratory sound when marking tasks as done!

### 2. Daily Todos & Focus Planner
- **Time-Aware Greeting:** Dynamically updates greeting (*Good morning / afternoon / evening*) and tracks today's velocity.
- **Quick Add Bar:** Rapidly capture tasks on the fly (press `Enter` to save).
- **Subtasks Breakdown:** Add, toggle, and view nested checklist items with real-time percentage completion progress bars.
- **Filter Tabs:** Switch between *All Tasks*, *Today*, *Incomplete*, and *Completed*.
- **Batch Actions:** Clear completed items in one click.

### 3. Pomodoro Focus Timer
- **Preset Cycles:** Pomodoro (25m), Short Break (5m), and Long Break (15m).
- **Task Linking:** Connect the timer to any active task from your Kanban or Todo list — completing a cycle automatically increments that task's logged Pomodoros!
- **Zero-Dependency Web Audio Synth:** Synthesizes cheerful chimes upon timer finish and task completion using the native Web Audio API (zero external audio file dependencies).
- **Keyboard Shortcuts:** Press <kbd>Space</kbd> anywhere on the page to toggle Play/Pause.

### 4. Productivity Analytics & Insights
- **Velocity Metrics:** Real-time completion rate %, total logged focus hours, and active streak counter.
- **Visual Velocity Chart:** Weekly completion breakdown by day.
- **Priority & Category Distribution:** Live visual bars showing workload urgency and subject distribution.
- **Productivity Score (0-100):** Weighted algorithmic score measuring daily output.

### 5. Client-Side Data & Portability
- **Automatic Persistence:** Saves instantly to browser `localStorage`.
- **Export Backup:** Download a clean `.json` file backup of all tasks and stats anytime.
- **Import Backup:** Restore data on another machine or browser tab seamlessly.
- **Reset to Demo Data:** One-click reset to pre-seeded sample data.
- **Dark / Light Mode:** Native smooth dark theme with persistent preference.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### 1. Start Development Server
```bash
cd ~/Desktop/taskflow-app
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
```
The optimized static build will be generated in `dist/`.

---

## 📦 Zero-Cost Hosting & Deployment

Since TaskFlow is a pure static frontend site, you can host it for free on any static host:

- **Vercel:** Run `npx vercel`
- **Netlify:** Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop)
- **GitHub Pages:** Deploy the `dist` directory using `gh-pages`
- **Cloudflare Pages:** Connect repository and set build command to `npm run build` with output directory `dist`
