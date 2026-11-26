import React from 'react';
import { Volume2, VolumeX, Flame, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  xp: number;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  xp,
  streak
}) => {
  const [soundOn, setSoundOn] = React.useState(soundFx.isEnabled());

  const handleToggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundOn(newState);
    if (newState) soundFx.playClick();
  };

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'lessons', label: 'الدروس النحوية' },
    { id: 'workbench', label: 'مختبر الإعراب' },
    { id: 'speed', label: 'تحدي السرعة' },
    { id: 'leaderboard', label: 'الأوسمة والمتصدرون' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand wordmark (single line, no distracting badges) */}
        <button
          onClick={() => {
            onTabChange('home');
            soundFx.playClick();
          }}
          className="flex items-center gap-2.5 text-right hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            نـ
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 whitespace-nowrap">
            نِبرَاسُ النَّحْوِ
          </span>
        </button>

        {/* Zone 2: 5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  soundFx.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Install CTA & learning indicators */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Daily streak */}
          <div
            title="سلسلة أيام التعلم المتتالية"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/70 text-xs font-bold whitespace-nowrap"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="tabular-nums">{streak}</span>
            <span>أيام</span>
          </div>

          {/* XP counter */}
          <div
            title="مجموع نقاط الخبرة النحوية"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-bold whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tabular-nums">{xp}</span>
            <span className="text-[11px] text-emerald-700 font-normal">XP</span>
          </div>

          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* Audio toggle button */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="تبديل الصوت"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 gap-2 border-t border-slate-100 bg-slate-50/70">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                soundFx.playClick();
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-white bg-emerald-700'
                  : 'text-slate-600 bg-white border border-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
