import React, { useRef } from 'react';
import { Task } from '../types';
import { AlAyenLogo } from './AlAyenLogo';
import { MinistryLogo } from './MinistryLogo';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';

interface OfficialLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const OfficialLetterModal: React.FC<OfficialLetterModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !task) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6 my-8 print:border-none print:shadow-none print:p-0 print:m-0 print:bg-white">
        {/* Modal Controls Header (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">معاينة الكتاب الرئاسي الرسمي المعتمد</span>
            <span className="text-xs text-slate-400">({task.code})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكتاب (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div
          ref={printAreaRef}
          className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 font-sans print:shadow-none print:border-none print:p-8 select-text"
          dir="rtl"
        >
          {/* Header Zone: Right Ministry / Center Dual Logos / Left Ref & Date */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">
            {/* Right: State & University Identification */}
            <div className="text-right space-y-1 text-xs sm:text-sm font-bold text-slate-800">
              <p>جمهورية العراق</p>
              <p className="text-amber-900">وزارة التعليم العالي والبحث العلمي</p>
              <p className="text-base text-[#0a1d56] font-extrabold font-serif">جامعة العين العراقية</p>
              <p className="text-slate-900 font-bold">مكتب رئيس الجامعة</p>
            </div>

            {/* Center: Both Official Ministry & University Logos */}
            <div className="flex items-center gap-4">
              {/* Iraqi Ministry of Higher Education & Scientific Research Emblem */}
              <MinistryLogo size="lg" variant="plain" />
              
              <div className="h-12 w-px bg-slate-300" />

              {/* Al-Ayen Iraqi University Logo */}
              <div className="flex flex-col items-center">
                <AlAyenLogo size="lg" showText={false} variant="plain" />
                <span className="text-[9px] font-black text-[#0a1d56] tracking-wider uppercase font-mono mt-0.5">
                  ALAYEN IRAQI UNIVERSITY · AUIQ
                </span>
              </div>
            </div>

            {/* Left: Reference numbers & Date */}
            <div className="text-left space-y-1 text-xs font-semibold text-slate-700 font-mono">
              <p className="flex justify-between gap-2">
                <span>العدد:</span>
                <span className="font-bold text-slate-900">{task.officialRefNumber}</span>
              </p>
              <p className="flex justify-between gap-2">
                <span>التاريخ:</span>
                <span className="text-slate-900">{task.createdAt} م</span>
              </p>
              <p className="flex justify-between gap-2">
                <span>المرفقات:</span>
                <span className="text-slate-900">{task.attachments?.length || 0} ملف</span>
              </p>
            </div>
          </div>

          {/* Recipient line */}
          <div className="my-6 space-y-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0a1d56]">
              إلى / {task.targetNodeName} المحترمون
            </h2>
            <div className="text-sm font-bold text-slate-800 bg-slate-100 p-2.5 rounded border-r-4 border-[#0a1d56]">
              م / {task.title}
            </div>
          </div>

          {/* Formal Body Text */}
          <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify">
            <p className="font-bold">سلامٌ من الله عليكم ورحمة منهُ وبركات...</p>
            <p>
              بناءً على مقتضيات المصلحة العامة لتطوير الأداء الأكاديمي والإداري في تشكيلات جامعة العين العراقية،
              {task.directiveType === 'وزاري' && ' واستناداً إلى الأمر الوزاري الصادر عن وزارة التعليم العالي والبحث العلمي، '}
              {task.directiveType === 'رئاسي' && ' واستناداً للصلاحيات المخولة لنا وتوجيهات رئاسة الجامعة، '}
              {task.directiveType === 'مجلس_الجامعة' && ' وتنفيذاً لقرارات وتوصيات مجلس جامعة العين العراقية الموقر، '}
              تقرر تكليفكم بالمهام والواجبات المبينة أدناه:
            </p>

            <div className="p-4 my-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-medium">
              <p className="font-semibold text-slate-950 leading-relaxed">
                {task.description || task.title}
              </p>
              {task.instructions && (
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">محددات التوجيه: </span>
                  {task.instructions}
                </div>
              )}
            </div>

            <p>
              يرجى إيلاء الموضوع الأهمية القصوى والبدء الفوري بالتنفيذ وموافاتنا بتقرير تفصيلي بالإجراءات المتخذة في موعد أقصاه (<span className="font-bold text-slate-900 font-mono">{task.dueDate}</span>).
            </p>

            <p className="text-center font-bold text-slate-900 pt-4">
              .. ولأجله وقعنا وصادقنا ..
            </p>
          </div>

          {/* Signatures & Seal Section */}
          <div className="mt-12 pt-4 flex items-end justify-between">
            {/* Barcode & Auth verification */}
            <div className="space-y-1 text-right">
              {/* Decorative Barcode */}
              <div className="font-mono text-[10px] text-slate-500 tracking-tighter">
                ||||| | |||| ||| |||||| || ||||||| ||| |||||||
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                وثيقة رسمية صادرة عبر المنظومة الرقمية لرئاسة الجامعة
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                كود التحقق: {task.code}
              </p>
            </div>

            {/* University President Seal & Signature */}
            <div className="text-center space-y-1.5 relative">
              {/* Royal University Stamp */}
              <div className="w-24 h-24 absolute -top-8 -right-8 rounded-full border-2 border-dashed border-red-700/60 flex items-center justify-center pointer-events-none rotate-[-12deg] opacity-75">
                <div className="w-20 h-20 rounded-full border border-red-700/80 flex flex-col items-center justify-center text-[8px] font-bold text-red-800 text-center leading-tight">
                  <span>جامعة العين العراقية</span>
                  <span>مكتب رئيس الجامعة</span>
                  <span className="text-[7px]">مصادق وموثق</span>
                  <span className="text-[6px] font-mono">2026</span>
                </div>
              </div>

              <p className="font-bold text-slate-900 text-sm">
                الأستاذ الدكتور
              </p>
              <p className="font-extrabold text-[#0a1d56] text-base font-serif">
                شفيق شاكر شفيق
              </p>
              <p className="text-xs font-bold text-amber-700">
                رئيس جامعة العين العراقية
              </p>
            </div>
          </div>

          {/* Copies To (نسخة منه إلى) */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-900">نسخة منه إلى:</span>
            <ul className="list-disc list-inside space-y-0.5 pr-2">
              <li>مكتب السيد رئيس الجامعة / الأوليات والمتابعة.</li>
              <li>مكتب السيد المساعد الإداري / المساعد العلمي (حسب الاختصاص).</li>
              <li>قسم التدقيق والرقابة الداخلية / للمتابعة والتدقيق.</li>
              <li>شعبة البريد المركزي / للتوثيق والأرشفة.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
