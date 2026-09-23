import React, { useState } from 'react';
import { OrgNode, OrgLevel, Task } from '../types';
import { LEVEL_LABELS } from '../data/orgHierarchy';
import { 
  Building2, 
  Network, 
  FolderTree, 
  Search, 
  Plus, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  User,
  Layers
} from 'lucide-react';

interface OrgHierarchyViewerProps {
  orgNodes: OrgNode[];
  tasks: Task[];
  onSelectNodeForNewTask: (node: OrgNode) => void;
  onSelectTask: (task: Task) => void;
}

export const OrgHierarchyViewer: React.FC<OrgHierarchyViewerProps> = ({
  orgNodes,
  tasks,
  onSelectNodeForNewTask,
  onSelectTask,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'presidency' | 'administrative' | 'scientific' | 'colleges'>('all');
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('qa_dept');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    presidency_direct: true,
    admin_affairs: true,
    scientific_affairs: true,
    colleges_section: true,
  });

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Selected node
  const selectedNode = orgNodes.find(n => n.id === selectedNodeId) || orgNodes[0];

  // Tasks assigned to selected node
  const nodeTasks = tasks.filter(t => t.targetNodeId === selectedNode.id);

  // Filtered nodes for grid
  const filteredNodes = orgNodes.filter(node => {
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'colleges' ? node.level === 'college' : node.category === activeCategory);
    const matchesLevel = activeLevel === 'all' || node.level === activeLevel;
    const matchesSearch = searchQuery === '' || 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.headName && node.headName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>مصادقة معالي وزير التعليم العالي والبحث العلمي المحترم · مصادقة السيد رئيس الجامعة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
              الهيكل التنظيمي لجامعة العين العراقية (AUIQ)
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              تصفح التشكيلات الأكاديمية والإدارية ومراكز الأبحاث والشعب والوحدات وكليات الجامعة الـ 11، مع متابعة التكليفات والمهام المسندة لكل جهة.
            </p>
          </div>

          {/* Color Level Legend as in the official diagram */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">دليل المستويات:</span>
            <div className="flex items-center gap-1.5 text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
              <span>رئاسة الجامعة</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
              <span>بمستوى أقسام</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              <span>بمستوى شعب</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>بمستوى وحدة</span>
            </div>
            <div className="flex items-center gap-1.5 text-violet-300">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
              <span>كليات الجامعة</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-950 hover:text-slate-200 border border-slate-800'
              }`}
            >
              كافة التشكيلات ({orgNodes.length})
            </button>
            <button
              onClick={() => setActiveCategory('presidency')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === 'presidency'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-950 hover:text-slate-200 border border-slate-800'
              }`}
            >
              رئاسة الجامعة وتشكيلاتها
            </button>
            <button
              onClick={() => setActiveCategory('administrative')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === 'administrative'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-950 hover:text-slate-200 border border-slate-800'
              }`}
            >
              الشؤون الإدارية
            </button>
            <button
              onClick={() => setActiveCategory('scientific')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === 'scientific'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-950 hover:text-slate-200 border border-slate-800'
              }`}
            >
              الشؤون العلمية
            </button>
            <button
              onClick={() => setActiveCategory('colleges')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === 'colleges'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 bg-slate-950 hover:text-slate-200 border border-slate-800'
              }`}
            >
              كليات الجامعة (11)
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في أسماء الأقسام، الشعب، المسؤولين..."
              className="w-full pl-3 pr-9 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Main Split: Left Tree/Directory, Right Selected Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Interactive Nodes Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredNodes.map(node => {
              const levelStyle = LEVEL_LABELS[node.level] || LEVEL_LABELS['department'];
              const isSelected = selectedNode?.id === node.id;
              const count = tasks.filter(t => t.targetNodeId === node.id).length;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-right flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-amber-400 font-semibold">
                        {node.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                        {levelStyle.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100">
                      {node.name}
                    </h3>

                    {node.headName && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{node.headTitle || 'المسؤول'}: {node.headName}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-amber-400' : 'bg-slate-600'}`} />
                      <span className="text-slate-400 text-[11px]">
                        {count > 0 ? `${count} تكليفات مسندة` : 'لا توجد مهام نشطة'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectNodeForNewTask(node);
                      }}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <span>+ تكليف</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredNodes.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/60 rounded-xl border border-slate-800">
              لم يتم العثور على تشكيلات مطابقة لمعايير البحث الحالية
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Selected Node Inspector & Tasks Panel */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          {selectedNode ? (
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-5 shadow-xl">
              {/* Node Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-bold">{selectedNode.code}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${(LEVEL_LABELS[selectedNode.level] || LEVEL_LABELS['department']).bg} ${(LEVEL_LABELS[selectedNode.level] || LEVEL_LABELS['department']).text} ${(LEVEL_LABELS[selectedNode.level] || LEVEL_LABELS['department']).border}`}>
                    {(LEVEL_LABELS[selectedNode.level] || LEVEL_LABELS['department']).label}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-100">
                  {selectedNode.name}
                </h2>

                {selectedNode.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedNode.description}
                  </p>
                )}
              </div>

              {/* Node Officers and Details */}
              <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                {selectedNode.headName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{selectedNode.headTitle || 'المسؤول'}:</span>
                    <span className="text-slate-200 font-semibold">{selectedNode.headName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">التبعية الإدارية:</span>
                  <span className="text-slate-300">
                    {selectedNode.category === 'presidency' ? 'رئاسة الجامعة' :
                     selectedNode.category === 'administrative' ? 'مساعد رئيس الجامعة للشؤون الإدارية' :
                     selectedNode.category === 'scientific' ? 'مساعد رئيس الجامعة للشؤون العلمية' :
                     selectedNode.category === 'colleges' ? 'كليات الجامعة / المساعد العلمي' : 'مرتبطة برئاسة الجامعة مباشرة'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">المهام المسندة:</span>
                  <span className="text-amber-400 font-mono font-bold">{nodeTasks.length} تكليف</span>
                </div>
              </div>

              {/* Action Button: Create Task for this specific node */}
              <button
                onClick={() => onSelectNodeForNewTask(selectedNode)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>إصدار تكليف مباشر لهذه الجهة</span>
              </button>

              {/* Tasks List for this node */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-semibold text-slate-200">التكليفات المسندة</h3>
                  <span className="text-slate-500 font-mono text-[11px]">{nodeTasks.length}</span>
                </div>

                {nodeTasks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-lg border border-slate-800/60">
                    لا توجد مهام حالية مسندة لهذه الجهة
                  </div>
                ) : (
                  <div className="space-y-2">
                    {nodeTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-amber-400 font-semibold">{t.code}</span>
                          <span className="text-slate-400 font-mono tabular-nums">{t.dueDate}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 line-clamp-1">{t.title}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>الإنجاز: {t.progress}%</span>
                          <span className={`${t.priority === 'high_urgent' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                            {t.priority === 'high_urgent' ? 'عاجل وفوري' : 'اعتيادي'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              حدد جهة من الهيكل التنظيمي لاستعراض تفاصيلها ومهامها
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
