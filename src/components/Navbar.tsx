import React from 'react';
import { UniversityLogo } from './UniversityLogo';
import { Plus, Waves, Sparkles, FolderDown, LayoutDashboard, ListTodo, Network, FileText } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'tasks' | 'org' | 'letters' | 'python';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'org' | 'letters' | 'python') => void;
  onNewTaskClick: () => void;
  rippleEnabled: boolean;
  setRippleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  rippleColor: 'gold' | 'cyan' | 'emerald';
  setRippleColor: (color: 'gold' | 'cyan' | 'emerald') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewTaskClick,
  rippleEnabled,
  setRippleEnabled,
  rippleColor,
  setRippleColor,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#0f2658] bg-[#040a18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Combined Ministry & University Brand Crests */}
        <div className="flex items-center shrink-0">
          <UniversityLogo size="md" />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>لوحة التحكم القيادية</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>إدارة المهام والتكليفات</span>
          </button>

          <button
            onClick={() => setActiveTab('org')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'org'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>الهيكل التنظيمي المعتمد</span>
          </button>

          <button
            onClick={() => setActiveTab('letters')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'letters'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الكتب والأوامر الرئاسية</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative ${
              activeTab === 'python'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:text-emerald-300 hover:bg-blue-950/40'
            }`}
          >
            <FolderDown className="w-4 h-4 text-emerald-400" />
            <span>كود بايثون وحفظ المشروع</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </nav>

        {/* Zone 3: Actions (Ripple toggle and + New Task) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Ripple Effect interactive controller */}
          <div className="relative group">
            <button
              onClick={() => setRippleEnabled(!rippleEnabled)}
              title={rippleEnabled ? 'تموج المؤشر مفعل (انقر للتعطيل)' : 'تفعيل تموج المؤشر'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                rippleEnabled
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Waves className={`w-3.5 h-3.5 ${rippleEnabled ? 'text-amber-400 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">التموج المائي</span>
              <span className={`w-1.5 h-1.5 rounded-full ${rippleEnabled ? 'bg-amber-400' : 'bg-slate-500'}`} />
            </button>

            {/* Ripple color dropdown on hover */}
            {rippleEnabled && (
              <div className="absolute left-0 mt-1 hidden group-hover:flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-700 shadow-xl z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); setRippleColor('gold'); }}
                  className={`w-5 h-5 rounded-full bg-amber-400 border-2 transition-transform ${rippleColor === 'gold' ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                  title="ذهبي ملكي (شعار الوزارة والجامعة)"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setRippleColor('cyan'); }}
                  className={`w-5 h-5 rounded-full bg-sky-400 border-2 transition-transform ${rippleColor === 'cyan' ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                  title="أزرق جامعة العين"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setRippleColor('emerald'); }}
                  className={`w-5 h-5 rounded-full bg-emerald-400 border-2 transition-transform ${rippleColor === 'emerald' ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                  title="أخضر أكاديمي"
                />
              </div>
            )}
          </div>

          {/* New Task CTA */}
          <button
            onClick={onNewTaskClick}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">+ تكليف جديد</span>
            <span className="sm:hidden">تكليف</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-800 bg-[#060e22] px-4 py-2 overflow-x-auto flex items-center gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'tasks' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          المهام
        </button>
        <button
          onClick={() => setActiveTab('org')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'org' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          الهيكل التنظيمي
        </button>
        <button
          onClick={() => setActiveTab('letters')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'letters' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          الكتب الرسمية
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${activeTab === 'python' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          مشروع بايثون
        </button>
      </div>
    </header>
  );
};
