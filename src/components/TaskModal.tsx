import React, { useState } from 'react';
import { Task, OrgNode, TaskStatus, Priority, DirectiveType } from '../types';
import { LEVEL_LABELS } from '../data/orgHierarchy';
import { 
  X, 
  Send, 
  FileText, 
  Paperclip, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Printer,
  Sparkles
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null; // null if creating new
  preselectedNode?: OrgNode | null;
  orgNodes: OrgNode[];
  onSaveTask: (taskData: Partial<Task>) => void;
  onViewOfficialLetter: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  preselectedNode,
  orgNodes,
  onSaveTask,
  onViewOfficialLetter,
}) => {
  const isEditing = !!task;

  // Form states
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [directiveType, setDirectiveType] = useState<DirectiveType>(task?.directiveType || 'رئاسي');
  const [officialRefNumber, setOfficialRefNumber] = useState(task?.officialRefNumber || `ر/${Math.floor(100 + Math.random() * 900)}/2026`);
  const [targetNodeId, setTargetNodeId] = useState(task?.targetNodeId || preselectedNode?.id || 'qa_dept');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'urgent');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'new');
  const [progress, setProgress] = useState(task?.progress || 0);
  const [dueDate, setDueDate] = useState(task?.dueDate || '2026-04-15');
  const [assignedOfficer, setAssignedOfficer] = useState(task?.assignedOfficer || 'مسؤول الجهة المعنية');
  const [instructions, setInstructions] = useState(task?.instructions || '');
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedTarget = orgNodes.find(n => n.id === targetNodeId);

    const taskPayload: Partial<Task> = {
      title,
      description,
      directiveType,
      officialRefNumber,
      targetNodeId,
      targetNodeName: selectedTarget?.name || 'جهة غير محددة',
      targetNodeLevel: selectedTarget?.level || 'department',
      priority,
      status,
      progress: Number(progress),
      dueDate,
      assignedOfficer: assignedOfficer || (selectedTarget?.headName ? selectedTarget.headName : 'مسؤول الجهة'),
      instructions,
      createdAt: task?.createdAt || new Date().toISOString().split('T')[0],
      createdBy: task?.createdBy || 'مكتب رئيس الجامعة',
      code: task?.code || `AUIQ-2026-${String(Math.floor(10 + Math.random() * 90)).padStart(3, '0')}`,
    };

    onSaveTask(taskPayload);
    onClose();
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !task) return;
    const updatedComments = [
      ...(task.comments || []),
      {
        id: `c_${Date.now()}`,
        author: 'مكتب رئيس الجامعة',
        role: 'إدارة المتابعة',
        text: newComment,
        createdAt: new Date().toLocaleString('ar-IQ'),
      },
    ];
    onSaveTask({ ...task, comments: updatedComments });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>جامعة العين العراقية · مكتب رئيس الجامعة</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              {isEditing ? `متابعة وتحديث التكليف: ${task.code}` : 'إصدار تكليف وأمر رئاسي جديد'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          {/* Title & Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                موضوع التكليف / الأمر الرئاسي <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: استكمال متطلبات الاعتماد المؤسسي الوطني..."
                required
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                رقم الإشارة / الكتاب الرسمي
              </label>
              <input
                type="text"
                value={officialRefNumber}
                onChange={(e) => setOfficialRefNumber(e.target.value)}
                placeholder="ر/104/2026"
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Directive Type, Target Org Unit, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                نوع التوجيه أو الصدور
              </label>
              <select
                value={directiveType}
                onChange={(e) => setDirectiveType(e.target.value as DirectiveType)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="رئاسي">توجيه رئيس الجامعة</option>
                <option value="وزاري">أمر وزاري صادر</option>
                <option value="مجلس_الجامعة">قرار مجلس الجامعة</option>
                <option value="عاجل_وسري">عاجل وسري للغاية</option>
                <option value="متابعة_دورية">متابعة دورية</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                الجهة المكلفة حسب الهيكل التنظيمي <span className="text-rose-400">*</span>
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => {
                  setTargetNodeId(e.target.value);
                  const node = orgNodes.find(n => n.id === e.target.value);
                  if (node?.headName) {
                    setAssignedOfficer(node.headName);
                  }
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <optgroup label="رئاسة الجامعة وتشكيلاتها المباشرة">
                  {orgNodes.filter(n => n.category === 'presidency' || n.category === 'direct_presidency').map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </optgroup>
                <optgroup label="مساعد رئيس الجامعة للشؤون الإدارية وتشكيلاته">
                  {orgNodes.filter(n => n.category === 'administrative').map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </optgroup>
                <optgroup label="مساعد رئيس الجامعة للشؤون العلمية">
                  {orgNodes.filter(n => n.category === 'scientific').map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </optgroup>
                <optgroup label="كليات الجامعة (11 كلية)">
                  {orgNodes.filter(n => n.category === 'colleges').map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.code})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                مستوى الأسبقية والأهمية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="high_urgent">عاجل وفوري 🔴</option>
                <option value="urgent">عاجل 🟠</option>
                <option value="normal">اعتيادي 🟢</option>
              </select>
            </div>
          </div>

          {/* Dates and Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                المسؤول / المكلف بالمتابعة
              </label>
              <input
                type="text"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                placeholder="اسم المسؤول أو المنصب..."
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                تاريخ الاستحقاق والإنجاز
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                المرحلة / الحالة الحالية
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="new">جديدة ومصدرة</option>
                <option value="in_progress">قيد المتابعة والتنفيذ</option>
                <option value="pending_approval">بانتظار مصادقة الرئاسة</option>
                <option value="completed">منجزة ومصادق عليها</option>
              </select>
            </div>
          </div>

          {/* Progress Slider (for editing) */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">نسبة تقدم الإنجاز:</span>
              <span className="text-amber-400 font-mono">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Description & Detailed Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              تفاصيل التكليف والتعليمات الرئاسية
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب التوجيهات الرسمية والشروط المطلوبة للإنجاز بدقة..."
              className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Comments and Follow-up Log (if editing) */}
          {isEditing && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-200">سجل الملاحظات والمتابعة</h3>
              
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map(c => (
                    <div key={c.id} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-400">{c.author} ({c.role})</span>
                        <span className="text-slate-500">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-300">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 text-center py-2">لا توجد ملاحظات مسجلة بعد</div>
                )}
              </div>

              {/* Add Comment Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="أضف تعليق أو توجيه إضافي..."
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  إضافة
                </button>
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onViewOfficialLetter(task)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>معاينة وطباعة الكتاب الرئاسي الرسمي</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                {isEditing ? 'حفظ التعديلات' : 'إصدار وتعميم التكليف'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
