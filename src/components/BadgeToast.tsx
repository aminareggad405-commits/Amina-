import React from 'react';
import { Award, X } from 'lucide-react';
import { Badge } from '../types/grammar';

interface BadgeToastProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export const BadgeToast: React.FC<BadgeToastProps> = ({ badge, onDismiss }) => {
  if (!badge) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-white border border-amber-300 rounded-2xl shadow-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
        <Award className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 text-right">
        <div className="text-xs font-bold text-amber-700 mb-0.5">
          إنجاز جديد! فُتح وسام
        </div>
        <h4 className="font-black text-slate-900 text-sm truncate">
          {badge.title}
        </h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
          {badge.description}
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
        aria-label="إغلاق الإشعار"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
