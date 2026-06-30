'use client'

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Check,
  Calendar,
  AlertTriangle,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import { ItineraryEvent, ActivityLog } from '@/types';
import { IMAGES } from '@/data/prototype-data';

export const CoPlanningTasksPage: React.FC = () => {
  const {
    tasks,
    setTasks,
    collaborators,
    isAddTaskOpen,
    setIsAddTaskOpen,
    newTaskTitle,
    setNewTaskTitle,
    newTaskAssignee,
    setNewTaskAssignee,
    newTaskCategory,
    setNewTaskCategory,
    newTaskPriority,
    setNewTaskPriority,
    newTaskDueDate,
    setNewTaskDueDate,
    newTaskDescription,
    setNewTaskDescription,
    handleCreateTask,
    taskFilterAssignee,
    setTaskFilterAssignee,
    taskFilterStatus,
    setTaskFilterStatus,
    handleToggleTask,
    handleDeleteTask,
    setItinerary,
    setActivities
  } = useApp();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-champagne-gold uppercase">EVENT CO-PLANNING</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mt-1">Preparation Checklist</h1>
          <p className="text-on-surface-variant font-body-md mt-2">Assign responsibilities, verify event details, and orchestrate with your travel companions.</p>
        </div>
        <div>
          <button
            onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
            className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-champagne-gold transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer border-none"
          >
            {isAddTaskOpen ? 'Close Panel' : '+ Create Task'}
          </button>
        </div>
      </div>

      {/* Progress Circular/Bar Visualizer */}
      <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            {/* Custom SVG Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#f2f4f6" strokeWidth="4" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#c5a059"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - (tasks.filter(t => t.completed).length / (tasks.length || 1)))}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold text-primary">
              {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
            </span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-primary">Pre-Gala Readiness Score</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {tasks.filter(t => t.completed).length} of {tasks.length} standard milestone deliverables checked off.
            </p>
          </div>
        </div>

        {/* Progress Messages */}
        <div className="text-right hidden md:block">
          <span className="text-xs font-bold uppercase tracking-wider text-champagne-gold block">STATUS INDICATOR</span>
          <span className="text-sm font-bold text-primary mt-1 block">
            {tasks.filter(t => !t.completed).length === 0
              ? "✓ Perfect Gala Orchestration Ready!"
              : `${tasks.filter(t => !t.completed).length} pending items require attention`}
          </span>
        </div>
      </div>

      {/* Quick Add Task Sliding Section */}
      {isAddTaskOpen && (
        <div className="bg-white border-2 border-champagne-gold/40 rounded-xl p-6 shadow-lg space-y-4 animate-in slide-in-from-top duration-300">
          <h3 className="font-serif text-xl font-bold text-primary">Assign New Task</h3>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Confirm VIP champagne toast schedule"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-refined-offwhite border border-outline-variant/60 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Assignee</label>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="w-full px-4 py-2.5 bg-refined-offwhite border border-outline-variant/60 rounded-lg text-sm outline-none focus:border-primary"
              >
                {collaborators.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Category Scope</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-refined-offwhite border border-outline-variant/60 rounded-lg text-sm outline-none focus:border-primary"
              >
                {['Catering Liaison', 'Wardrobe Fitting', 'Helicopter Transfer Coordination', 'Guest Seating Plan', 'Ticketing & Passes', 'Photography Shotlist'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Priority</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      newTaskPriority === p
                        ? 'bg-primary border-primary text-white font-bold'
                        : 'bg-white border-outline-variant/60 text-outline hover:text-primary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Target Date</label>
              <input
                type="text"
                placeholder="e.g. Friday, Oct 18"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-refined-offwhite border border-outline-variant/60 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-bold uppercase text-outline">Task Details / Description</label>
              <textarea
                placeholder="Specify deliverables, milestones, and location guidelines..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-refined-offwhite border border-outline-variant/60 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px]"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAddTaskOpen(false)}
                className="px-5 py-2.5 border border-outline-variant text-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-50 cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-all shadow-md cursor-pointer border-none"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-outline-variant/30 rounded-xl p-4 gap-4 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Filter Assignee:</span>
          <select
            value={taskFilterAssignee}
            onChange={(e) => setTaskFilterAssignee(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer outline-none"
          >
            <option value="all">All Collaborators</option>
            {collaborators.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-outline mr-2 shrink-0">Filter Status:</span>
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setTaskFilterStatus(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                taskFilterStatus === status
                  ? 'bg-primary border-primary text-white font-bold'
                  : 'bg-refined-offwhite border-outline-variant/40 text-outline hover:text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks
          .filter((t) => taskFilterAssignee === 'all' || t.assigneeId === taskFilterAssignee)
          .filter((t) => {
            if (taskFilterStatus === 'all') return true;
            if (taskFilterStatus === 'completed') return t.completed;
            return !t.completed;
          })
          .map((task) => {
            const assignee = collaborators.find((col) => col.id === task.assigneeId);

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 ${
                  task.completed ? 'border-outline-variant/30 bg-white/60 opacity-80' : 'border-outline-variant/30'
                }`}
              >
                <div>
                  {/* Task Header: Category, Priority */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-champagne-gold uppercase tracking-widest">
                      {task.category}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-slate-50 text-slate-700 border border-slate-100'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>

                  {/* Interactive Circle Checkbox and Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'border-champagne-gold bg-champagne-gold text-white'
                          : 'border-outline hover:border-primary'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                    <div>
                      <h4 className={`font-serif text-lg font-bold text-primary leading-snug ${
                        task.completed ? 'line-through text-outline' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Info: Assignee Avatar, Due Date, and Actions */}
                <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    {/* Assignee display */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/40 shrink-0">
                        <img src={assignee?.avatar} alt={assignee?.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary">{assignee?.name}</p>
                        <p className="text-[9px] text-outline">Assignee</p>
                      </div>
                    </div>

                    {/* Due Date with Icon */}
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-outline uppercase block">Target Completion</span>
                      <span className="text-xs font-semibold text-primary mt-0.5 block">{task.dueDate}</span>
                    </div>
                  </div>

                  {/* Custom Innovation Component: Cross-linking to active Itinerary */}
                  <div className="pt-3 border-t border-dashed border-outline-variant/30 flex justify-between gap-2">
                    <button
                      onClick={() => {
                        const matchedCategory = task.category.includes('Catering')
                          ? 'food-drink'
                          : task.category.includes('Helicopter') || task.category.includes('Lodge')
                            ? 'travel'
                            : 'services';

                        const newEvent: ItineraryEvent = {
                          id: `iti-task-imported-${Date.now()}`,
                          title: task.title,
                          category: matchedCategory as any,
                          time: 'Flexible Time',
                          location: 'Assigned Coordinator Location',
                          status: 'Pending',
                          price: 0,
                          date: task.dueDate.includes('Friday') ? 'Friday' : 'Saturday',
                          description: task.description || 'Imported task from event preparation checklist.',
                          image: matchedCategory === 'food-drink'
                            ? IMAGES.gastronomy
                            : matchedCategory === 'travel'
                              ? IMAGES.perryLane
                              : 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80'
                        };

                        setItinerary((prev) => [...prev, newEvent]);

                        const newAct: ActivityLog = {
                          id: `act-${Date.now()}`,
                          user: 'You',
                          action: `linked task "${task.title}" directly to Itinerary timeline`,
                          time: 'Just now',
                          icon: 'link',
                        };
                        setActivities((prev) => [newAct, ...prev]);
                        alert(`Successfully linked task "${task.title}" directly to Itinerary timeline!`);
                      }}
                      className="flex-1 py-1.5 bg-refined-offwhite hover:bg-champagne-gold hover:text-white rounded text-[10px] font-bold text-primary uppercase tracking-wider transition-colors text-center border border-outline-variant/40 cursor-pointer"
                      title="Import this task directly as a pending timeline event inside the Itinerary view"
                    >
                      🔗 Link to Timeline
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteTask(task.id);
                      }}
                      className="px-2.5 py-1.5 hover:bg-rose-50 text-outline hover:text-error rounded text-xs transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
