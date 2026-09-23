import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, OrgNode, TaskStatus } from './types';
import { ORG_HIERARCHY } from './data/orgHierarchy';
import { INITIAL_TASKS } from './data/initialTasks';
import { WaterRippleCanvas } from './components/WaterRippleCanvas';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TaskManager } from './components/TaskManager';
import { OrgHierarchyViewer } from './components/OrgHierarchyViewer';
import { OfficialLettersView } from './components/OfficialLettersView';
import { PythonProjectExport } from './components/PythonProjectExport';
import { TaskModal } from './components/TaskModal';
import { OfficialLetterModal } from './components/OfficialLetterModal';

export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'org' | 'letters' | 'python'>('dashboard');

  // Water Ripple effect state (Enabled by default as requested: "على ان يكون تموج عن تمرير المؤشر في مكان داخل الموقع")
  const [rippleEnabled, setRippleEnabled] = useState(true);
  const [rippleColor, setRippleColor] = useState<'gold' | 'cyan' | 'emerald'>('gold');

  // Org Hierarchy State
  const [orgNodes] = useState<OrgNode[]>(ORG_HIERARCHY);

  // Tasks State - Initialized empty as requested ("احذف التكليفات التي وضعتها انت")
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      // Clear any legacy mock tasks stored in previous session
      localStorage.removeItem('auiq_tasks_v1');
      const saved = localStorage.getItem('auiq_tasks_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from storage', e);
    }
    return INITIAL_TASKS; // Empty array []
  });

  useEffect(() => {
    try {
      localStorage.setItem('auiq_tasks_v2', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to storage', e);
    }
  }, [tasks]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);
  const [preselectedNodeForModal, setPreselectedNodeForModal] = useState<OrgNode | null>(null);

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [activeTaskForLetter, setActiveTaskForLetter] = useState<Task | null>(null);

  // Handlers
  const handleOpenNewTask = (preselectedNode?: OrgNode) => {
    setActiveTaskForModal(null);
    setPreselectedNodeForModal(preselectedNode || null);
    setIsTaskModalOpen(true);
  };

  const handleSelectTask = (task: Task) => {
    setActiveTaskForModal(task);
    setPreselectedNodeForModal(null);
    setIsTaskModalOpen(true);
  };

  const handleViewOfficialLetter = (task: Task) => {
    setActiveTaskForLetter(task);
    setIsLetterModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (activeTaskForModal) {
      // Editing existing
      const wasCompleted = activeTaskForModal.status === 'completed';
      const isNowCompleted = taskData.status === 'completed';

      setTasks(prev => prev.map(t => {
        if (t.id === activeTaskForModal.id) {
          return { ...t, ...taskData } as Task;
        }
        return t;
      }));

      if (!wasCompleted && isNowCompleted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#38bdf8', '#10b981'],
        });
      }
    } else {
      // Adding new
      const newTask: Task = {
        id: `task_${Date.now()}`,
        code: taskData.code || `AUIQ-2026-${String(tasks.length + 1).padStart(3, '0')}`,
        title: taskData.title || '',
        description: taskData.description || '',
        directiveType: taskData.directiveType || 'رئاسي',
        officialRefNumber: taskData.officialRefNumber || `ر/${Math.floor(100 + Math.random() * 900)}/2026`,
        targetNodeId: taskData.targetNodeId || 'qa_dept',
        targetNodeName: taskData.targetNodeName || 'قسم ضمان الجودة والأداء الجامعي',
        targetNodeLevel: taskData.targetNodeLevel || 'department',
        priority: taskData.priority || 'urgent',
        status: taskData.status || 'new',
        progress: taskData.progress || 0,
        dueDate: taskData.dueDate || '2026-04-15',
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'مكتب رئيس الجامعة',
        assignedOfficer: taskData.assignedOfficer || 'مسؤول الجهة',
        instructions: taskData.instructions || '',
        notes: '',
        comments: [],
        attachments: [],
        confidential: false,
      };

      setTasks(prev => [newTask, ...prev]);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f59e0b', '#38bdf8'],
      });
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const progress = newStatus === 'completed' ? 100 : t.progress === 100 ? 50 : t.progress;
        return { ...t, status: newStatus, progress };
      }
      return t;
    }));

    if (newStatus === 'completed') {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#10b981'],
      });
    }
  };

  const handleSelectOrgNode = (nodeId: string) => {
    setActiveTab('org');
  };

  return (
    <div className="min-h-screen bg-[#040a18] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans relative">
      {/* 1. Interactive Water Ripple Canvas */}
      <WaterRippleCanvas
        enabled={rippleEnabled}
        rippleColor={rippleColor}
        intensity={1.0}
      />

      {/* 2. Top Header Navigation Bar with Dual Ministry & Al-Ayen Logos */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewTaskClick={() => handleOpenNewTask()}
        rippleEnabled={rippleEnabled}
        setRippleEnabled={setRippleEnabled}
        rippleColor={rippleColor}
        setRippleColor={setRippleColor}
      />

      {/* 3. Main Workspace Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            orgNodes={orgNodes}
            onSelectTask={handleSelectTask}
            onOpenNewTask={() => handleOpenNewTask()}
            onSelectOrgNode={handleSelectOrgNode}
            onViewOfficialLetter={handleViewOfficialLetter}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onSelectTask={handleSelectTask}
            onOpenNewTask={() => handleOpenNewTask()}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onViewOfficialLetter={handleViewOfficialLetter}
          />
        )}

        {activeTab === 'org' && (
          <OrgHierarchyViewer
            orgNodes={orgNodes}
            tasks={tasks}
            onSelectNodeForNewTask={(node) => handleOpenNewTask(node)}
            onSelectTask={handleSelectTask}
          />
        )}

        {activeTab === 'letters' && (
          <OfficialLettersView
            tasks={tasks}
            onViewLetter={handleViewOfficialLetter}
            onOpenNewTask={() => handleOpenNewTask()}
          />
        )}

        {activeTab === 'python' && (
          <PythonProjectExport />
        )}
      </main>

      {/* 4. Official Academic Footer (Path completely removed as requested) */}
      <footer className="border-t border-[#0e214d] bg-[#030712]/95 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="space-y-1">
            <p className="font-bold text-slate-300">
              جمهورية العراق · وزارة التعليم العالي والبحث العلمي · جامعة العين العراقية (AUIQ)
            </p>
            <p className="text-[11px] text-slate-400">
              مكتب رئيس الجامعة · منظومة إدارة التكليفات والمهام التنظيمية وفق الهيكل المعتمد
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>النظام نشط ومربوط بالهيكل التنظيمي</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={activeTaskForModal}
        preselectedNode={preselectedNodeForModal}
        orgNodes={orgNodes}
        onSaveTask={handleSaveTask}
        onViewOfficialLetter={(t) => {
          setIsTaskModalOpen(false);
          handleViewOfficialLetter(t);
        }}
      />

      <OfficialLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        task={activeTaskForLetter}
      />
    </div>
  );
}
