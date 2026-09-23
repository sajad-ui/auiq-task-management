import React, { useState } from 'react';
import { Task, OrgNode, DirectiveType } from '../types';
import { LEVEL_LABELS } from '../data/orgHierarchy';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  Send, 
  ArrowUpRight, 
  Building2, 
  ShieldAlert,
  ChevronLeft,
  Calendar,
  Sparkles,
  Search,
  PlusCircle,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  orgNodes: OrgNode[];
  onSelectTask: (task: Task) => void;
  onOpenNewTask: () => void;
  onSelectOrgNode: (nodeId: string) => void;
  onViewOfficialLetter: (task: Task) => void;
  onNavigateToTab: (tab: 'dashboard' | 'tasks' | 'org' | 'letters' | 'python') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  orgNodes,
  onSelectTask,
  onOpenNewTask,
  onSelectOrgNode,
  onViewOfficialLetter,
  onNavigateToTab,
}) => {
  const [filterDirective, setFilterDirective] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingApprovalTasks = tasks.filter(t => t.status === 'pending_approval').length;
  const highUrgentTasks = tasks.filter(t => t.priority === 'high_urgent' && t.status !== 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks for preview list
  const filteredTasks = tasks.filter(task => {
    const matchesDirective = filterDirective === 'all' || task.directiveType === filterDirective;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.targetNodeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDirective && matchesSearch;
  });

  // Top departments with tasks
  const deptTaskCounts = orgNodes
    .filter(n => n.level === 'department' || n.level === 'college')
    .map(n => {
      const count = tasks.filter(t => t.targetNodeId === n.id || orgNodes.find(child => child.parentId === n.id && child.id === t.targetNodeId)).length;
      return { node: n, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. Presidential Banner & Welcome - Matched visually with University & Ministry branding */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#060e22] via-[#091838] to-[#0c2356] border border-[#1b3b78] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold tracking-wide">
              <span>جمهورية العراق</span>
              <span aria-hidden="true">·</span>
              <span>وزارة التعليم العالي والبحث العلمي</span>
              <span aria-hidden="true">·</span>
              <span>جامعة العين العراقية (AUIQ)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              لوحة المتابعة الإشرافية لمكتب رئيس الجامعة
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              المنظومة الرقمية الموحدة لإدارة وتوثيق ومتابعة كافة التكليفات والتوجيهات الرئاسية والوزارية عبر تشكيلات الجامعة الـ 70+ وفق الهيكل التنظيمي المعتمد.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('org')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-600/40 text-xs font-semibold shadow-sm transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>استعراض الهيكل التنظيمي</span>
            </button>
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <span>+ إصدار تكليف رئاسي جديد</span>
            </button>
          </div>
        </div>

        {/* Live Urgent Alert Ticker */}
        {highUrgentTasks > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 animate-pulse" />
              <span>تنبيه رئاسي عاجل:</span>
              <span className="text-slate-300">
                يوجد {highUrgentTasks} تكليفات بحالة "عاجل وفوري" تتطلب استجابة سريعة.
              </span>
            </div>
            <button
              onClick={() => setFilterDirective('all')}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 transition-colors"
            >
              مراجعة التكليفات العاجلة
            </button>
          </div>
        )}
      </div>

      {/* 2. Key Performance Indicators (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>إجمالي المهام والتكليفات</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-mono tabular-nums">
              {totalTasks}
            </span>
            <span className="text-xs text-slate-400">تكليف مسجل</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
            <span>{inProgressTasks} قيد المتابعة</span>
            <span aria-hidden="true">·</span>
            <span>{pendingApprovalTasks} بانتظار المصادقة</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>نسبة الإنجاز الكلية</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-emerald-400 font-mono tabular-nums">
              %{completionRate}
            </span>
            <span className="text-xs text-slate-400">{completedTasks} مهمة مكتملة</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>التكليفات ذات الأسبقية الفورية</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-amber-400 font-mono tabular-nums">
              {highUrgentTasks}
            </span>
            <span className="text-xs text-slate-400">مهمة عاجلة</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
            <span>متابعة مكتب الرئيس</span>
            <span aria-hidden="true">·</span>
            <span>استجابة فورية</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>تشكيلات الهيكل التنظيمي</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-sky-300 font-mono tabular-nums">
              {orgNodes.length}
            </span>
            <span className="text-xs text-slate-400">قسم وشعبة ووحدة وكلية</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
            <span>11 كلية</span>
            <span aria-hidden="true">·</span>
            <span>22 قسماً</span>
            <span aria-hidden="true">·</span>
            <span>معتمد رسمياً</span>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tasks Feed & Directive Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-100">سجل التكليفات والمهام النشطة</h2>
                <p className="text-xs text-slate-400">التوجيهات والأوامر الصادرة من مكتب السيد رئيس الجامعة</p>
              </div>

              {/* Directive Filter segmented controls */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterDirective('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterDirective === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterDirective('وزاري')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterDirective === 'وزاري'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  أمر وزاري
                </button>
                <button
                  onClick={() => setFilterDirective('رئاسي')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterDirective === 'رئاسي'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  توجيه رئاسي
                </button>
                <button
                  onClick={() => setFilterDirective('عاجل_وسري')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    filterDirective === 'عاجل_وسري'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  عاجل وسري
                </button>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المهمة أو الجهة المكلفة أو الرمز..."
                className="w-full pl-4 pr-10 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>

            {/* Tasks List or Empty State */}
            {filteredTasks.length === 0 ? (
              <div className="py-14 px-4 text-center rounded-xl bg-slate-950/60 border border-dashed border-slate-800 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-200">
                    لا توجد تكليفات مدخلة حالياً
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    تم إفراغ المهام التجريبية بنجاح. المنظومة جاهزة الآن لإصدار التكليفات الحقيقية وتوجيهها لكليات وأقسام وشعب جامعة العين العراقية.
                  </p>
                </div>
                <button
                  onClick={onOpenNewTask}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <span>+ إصدار أول تكليف رئاسي</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {filteredTasks.slice(0, 6).map(task => {
                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer group space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-amber-400/90 font-semibold">
                              {task.code}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-xs text-slate-300 font-medium">
                              {task.targetNodeName}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-[11px] text-slate-500">
                              المرجع: {task.officialRefNumber}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                            {task.title}
                          </h3>
                        </div>

                        {/* Priority / Status text */}
                        <div className="flex flex-col items-end shrink-0 text-right">
                          <span className={`text-xs font-semibold ${
                            task.priority === 'high_urgent' ? 'text-rose-400' :
                            task.priority === 'urgent' ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {task.priority === 'high_urgent' ? 'عاجل وفوري' :
                             task.priority === 'urgent' ? 'عاجل' : 'اعتيادي'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                            استحقاق: {task.dueDate}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar and Quick Actions */}
                      <div className="flex items-center justify-between gap-4 text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <span className="font-mono tabular-nums text-[11px]">{task.progress}%</span>
                          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                task.status === 'completed' ? 'bg-emerald-400' :
                                task.priority === 'high_urgent' ? 'bg-rose-400' : 'bg-amber-400'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewOfficialLetter(task);
                            }}
                            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors text-xs"
                            title="معاينة وطباعة الكتاب الرسمي الصادر"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>كتاب رسمي</span>
                          </button>
                          <span className="text-slate-500 text-xs">
                            {task.assignedOfficer}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View All Tasks CTA */}
            {filteredTasks.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  عرض {Math.min(filteredTasks.length, 6)} من أصل {tasks.length} تكليف
                </span>
                <button
                  onClick={() => onNavigateToTab('tasks')}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>الانتقال لجدول المهام الشامل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Presidential Quick Actions & Hierarchy Info */}
        <div className="space-y-4">
          {/* Presidential Quick Directives Box */}
          <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إجراءات مكتب رئيس الجامعة</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={onOpenNewTask}
                className="w-full text-right p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">إصدار توجيه أو تكليف جديد</div>
                  <div className="text-[11px] text-slate-400">توجيه كتاب رسمي معتمد لكليات وأقسام الجامعة</div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              <button
                onClick={() => onNavigateToTab('org')}
                className="w-full text-right p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">استعراض الهيكل التنظيمي المعتمد</div>
                  <div className="text-[11px] text-slate-400">تصفح تشكيلات الجامعة واختيار جهة للتكليف</div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              <button
                onClick={() => onNavigateToTab('letters')}
                className="w-full text-right p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">سجل الكتب والأوامر الرئاسية</div>
                  <div className="text-[11px] text-slate-400">طباعة وتوثيق الكتب الرسمية الصادرة بصيغة A4</div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* Active Departments in University Hierarchy */}
          <div className="rounded-xl bg-[#09152e]/90 border border-[#162f5e] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">تشكيلات الهيكل التنظيمي</h3>
              <span className="text-[11px] text-amber-400">جامعة العين</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex justify-between items-center">
                <span className="text-slate-300 font-medium">كليات الجامعة التخصصية</span>
                <span className="font-mono font-bold text-sky-400">11 كلية</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex justify-between items-center">
                <span className="text-slate-300 font-medium">أقسام ومراكز رئاسة الجامعة</span>
                <span className="font-mono font-bold text-amber-400">22 قسماً ومركزاً</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex justify-between items-center">
                <span className="text-slate-300 font-medium">الشعب والوحدات التخصصية</span>
                <span className="font-mono font-bold text-purple-400">40+ شعبة ووحدة</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('org')}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-amber-400 transition-colors border-t border-slate-800/80 pt-3 font-semibold"
            >
              فتح دليل الهيكل التنظيمي الكامل ⬅️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
