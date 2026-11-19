import React from 'react';
import { GRAMMAR_SIGNS_TABLE } from '../data/exercises';
import { BookMarked, X } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface GrammarReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarReferenceModal: React.FC<GrammarReferenceModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={() => {
        soundFx.playClick();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                جدول علامات الإعراب المرجعي للمرحلة المتوسطة
              </h2>
              <p className="text-xs text-slate-500">
                دليل سريع للتمييز بين علامات الرفع والنصب والجر الأصلية والفرعية
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Body */}
        <div className="p-6 overflow-y-auto">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-right text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold">نوع الاسم</th>
                  <th className="py-3 px-4 font-bold text-blue-800 bg-blue-50/40">حالة الرفع</th>
                  <th className="py-3 px-4 font-bold text-emerald-800 bg-emerald-50/40">حالة النصب</th>
                  <th className="py-3 px-4 font-bold text-purple-800 bg-purple-50/40">حالة الجر</th>
                  <th className="py-3 px-4 font-bold">مثال تطبيقي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GRAMMAR_SIGNS_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {row.nounType}
                    </td>
                    <td className="py-3 px-4 text-blue-900 bg-blue-50/15 font-medium">
                      {row.raf}
                    </td>
                    <td className="py-3 px-4 text-emerald-900 bg-emerald-50/15 font-medium">
                      {row.nasb}
                    </td>
                    <td className="py-3 px-4 text-purple-900 bg-purple-50/15 font-medium">
                      {row.jarr}
                    </td>
                    <td className="py-3 px-4 font-amiri text-base font-bold text-slate-800 whitespace-nowrap">
                      {row.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>تذكير سريع:</strong> علامات الإعراب الأصلية هي الضمة للرفع، والفتحة للنصب، والكسرة للجر، وما عداها (كالألف والواو والياء والكسرة في جمع المؤنث) يُعدّ علامات فرعية نيابةً عنها.
          </div>
        </div>
      </div>
    </div>
  );
};
