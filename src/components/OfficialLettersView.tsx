import React, { useState } from 'react';
import { Task } from '../types';
import { FileText, Printer, Search, Download, CheckCircle2, ShieldCheck, ChevronLeft, Plus } from 'lucide-react';

interface OfficialLettersViewProps {
  tasks: Task[];
  onViewLetter: (task: Task) => void;
  onOpenNewTask: () => void;
}

export const OfficialLettersView: React.FC<OfficialLettersViewProps> = ({
  tasks,
  onViewLetter,
  onOpenNewTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.officialRefNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetNodeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.directiveType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#09152e]/90 border border-[#162f5e] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>مكتب رئيس جامعة العين العراقية · السجل المعتمد للكتب والأوامر الجامعية</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
              الكتب والتوجيهات الرئاسية الرسمية
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              أرشيف رقمي للكتب الصادرة مع إمكانية المعاينة والطباعة المباشرة بصيغة A4 معتمدة وتوليد أوامر جديدة
            </p>
          </div>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>+ صياغة كتاب رئاسي جديد</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-950 border border-slate-800'
              }`}
            >
              الكل ({tasks.length})
            </button>
            <button
              onClick={() => setFilterType('رئاسي')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'رئاسي' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-950 border border-slate-800'
              }`}
            >
              أوامر وتوجيهات رئيس الجامعة
            </button>
            <button
              onClick={() => setFilterType('وزاري')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'وزاري' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-950 border border-slate-800'
              }`}
            >
              الكتب والأوامر الوزارية
            </button>
            <button
              onClick={() => setFilterType('مجلس_الجامعة')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'مجلس_الجامعة' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-950 border border-slate-800'
              }`}
            >
              قرارات مجلس الجامعة
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعدد، الموضوع، الجهة..."
              className="w-full pl-3 pr-9 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Letters Grid or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#09152e]/60 border border-dashed border-[#162f5e] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">
              سجل الكتب والأوامر الرئاسية فارغ حالياً
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              عند إصدار أي تكليف جديد، سيتم تلقائياً إنشاء كتاب رسمي معتمد يحمل شعار الوزارة وشعار جامعة العين العراقية مع الختم والباركود جاهزاً للطباعة.
            </p>
          </div>
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>صياغة أول كتاب رسمي</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onViewLetter(task)}
              className="p-5 rounded-xl bg-[#09152e]/80 border border-[#162f5e] hover:border-amber-500/40 hover:bg-[#0c1f44] transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-bold">{task.officialRefNumber}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{task.createdAt}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {task.title}
                </h3>

                <div className="text-xs text-slate-400">
                  إلى: <span className="text-slate-300 font-medium">{task.targetNodeName}</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  رمز الوثيقة: {task.code}
                </span>

                <div className="flex items-center gap-1 text-amber-400 font-semibold group-hover:underline">
                  <FileText className="w-3.5 h-3.5" />
                  <span>معاينة وطباعة الكتاب</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
