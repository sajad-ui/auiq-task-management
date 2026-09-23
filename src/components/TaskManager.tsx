import React, { useState } from 'react';
import { Task, TaskStatus, Priority, DirectiveType } from '../types';
import { LEVEL_LABELS } from '../data/orgHierarchy';
import { 
  Search, 
  Plus, 
  FileText, 
  Kanban, 
  Table as TableIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenNewTask: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onViewOfficialLetter: (task: Task) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onSelectTask,
  onOpenNewTask,
  onUpdateTaskStatus,
  onViewOfficialLetter,
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedDirective, setSelectedDirective] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.targetNodeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesDirective = selectedDirective === 'all' || task.directiveType === selectedDirective;

    return matchesSearch && matchesStatus && matchesPriority && matchesDirective;
  });

  const columns: { id: TaskStatus; title: string; count: number; accent: string }[] = [
    {
      id: 'new',
      title: 'تكليفات جديدة ومصدرة',
      count: filteredTasks.filter(t => t.status === 'new').length,
      accent: 'border-sky-500/40 text-sky-400',
    },
    {
      id: 'in_progress',
      title: 'قيد المتابعة والتنفيذ',
      count: filteredTasks.filter(t => t.status === 'in_progress').length,
      accent: 'border-amber-500/40 text-amber-400',
    },
    {
      id: 'pending_approval',
      title: 'بانتظار مصادقة الرئاسة',
      count: filteredTasks.filter(t => t.status === 'pending_approval').length,
      accent: 'border-purple-500/40 text-purple-400',
    },
    {
      id: 'completed',
      title: 'منجزة ومصادق عليها',
      count: filteredTasks.filter(t => t.status === 'completed').length,
      accent: 'border-emerald-500/40 text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              إدارة التكليفات والمهام الرئاسية
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة الأوامر الموجهة للكليات والأقسام والشعب مع إمكانية تحديث الحالة وتوليد الكتب الرسمية
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'board'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>لوحة المراحل (Kanban)</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>جدول البيانات</span>
              </button>
            </div>

            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ تكليف جديد</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برمز المهمة، العنوان، المسؤول..."
              className="w-full pl-3 pr-8 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3" />
          </div>

          {/* Directive Filter */}
          <div>
            <select
              value={selectedDirective}
              onChange={(e) => setSelectedDirective(e.target.value)}
              aria-label="نوع التوجيه"
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="all">كافة أنواع التوجيهات</option>
              <option value="وزاري">أمر وزاري</option>
              <option value="رئاسي">توجيه رئيس الجامعة</option>
              <option value="مجلس_الجامعة">قرار مجلس الجامعة</option>
              <option value="عاجل_وسري">عاجل وسري</option>
              <option value="متابعة_دورية">متابعة دورية</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="الأسبقية والأهمية"
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="all">كافة مستويات الأسبقية</option>
              <option value="high_urgent">عاجل وفوري 🔴</option>
              <option value="urgent">عاجل 🟠</option>
              <option value="normal">اعتيادي 🟢</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="حالة المهمة"
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="all">كافة الحالات</option>
              <option value="new">جديدة ومصدرة</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="pending_approval">بانتظار المصادقة</option>
              <option value="completed">منجزة ومصادق عليها</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Mode 1: Kanban Board */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col max-h-[800px]"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full border ${col.accent.split(' ')[0]} bg-current`} />
                    <h3 className="text-xs font-bold text-slate-200">{col.title}</h3>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto min-h-[220px]">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      لا توجد مهام في هذه المرحلة
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer space-y-2.5 shadow-sm group"
                      >
                        {/* Meta top */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-amber-400 font-semibold">{task.code}</span>
                          <span className={`font-semibold ${
                            task.priority === 'high_urgent' ? 'text-rose-400' :
                            task.priority === 'urgent' ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {task.priority === 'high_urgent' ? 'عاجل وفوري' :
                             task.priority === 'urgent' ? 'عاجل' : 'اعتيادي'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Department Name */}
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          الجهة: <span className="text-slate-300">{task.targetNodeName}</span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>نسبة الإنجاز</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Bottom Bar with fast status mover & Official Letter */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewOfficialLetter(task);
                            }}
                            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
                            title="معاينة وطباعة الكتاب الرسمي"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>كتاب رسمي</span>
                          </button>

                          {/* Quick Advance Status Dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateTaskStatus(task.id, e.target.value as TaskStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`تغيير مرحلة التكليف ${task.code}`}
                            className="bg-slate-900 border border-slate-800 text-[10px] rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                          >
                            <option value="new">جديدة</option>
                            <option value="in_progress">قيد التنفيذ</option>
                            <option value="pending_approval">مصادقة</option>
                            <option value="completed">منجزة</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: High Density Table */
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">رمز التكليف</th>
                  <th className="py-3 px-4 font-semibold">عنوان المهمة والتوجيه</th>
                  <th className="py-3 px-4 font-semibold">الجهة المكلفة</th>
                  <th className="py-3 px-4 font-semibold">نوع التوجيه</th>
                  <th className="py-3 px-4 font-semibold">الأسبقية</th>
                  <th className="py-3 px-4 font-semibold">الإنجاز</th>
                  <th className="py-3 px-4 font-semibold">المرحلة</th>
                  <th className="py-3 px-4 font-semibold">تاريخ الاستحقاق</th>
                  <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      لا توجد مهام مطابقة لمعايير البحث
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {task.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                        {task.targetNodeName}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {task.directiveType === 'وزاري' ? 'أمر وزاري' :
                         task.directiveType === 'رئاسي' ? 'توجيه رئاسي' :
                         task.directiveType === 'عاجل_وسري' ? 'عاجل وسري' : task.directiveType}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          task.priority === 'high_urgent' ? 'text-rose-400' :
                          task.priority === 'urgent' ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {task.priority === 'high_urgent' ? 'عاجل وفوري' :
                           task.priority === 'urgent' ? 'عاجل' : 'اعتيادي'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        {task.progress}%
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={task.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            onUpdateTaskStatus(task.id, e.target.value as TaskStatus);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`تغيير مرحلة التكليف ${task.code}`}
                          className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-200"
                        >
                          <option value="new">جديدة</option>
                          <option value="in_progress">قيد التنفيذ</option>
                          <option value="pending_approval">بانتظار المصادقة</option>
                          <option value="completed">منجزة</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewOfficialLetter(task);
                          }}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                          title="معاينة وطباعة الكتاب الرسمي"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
