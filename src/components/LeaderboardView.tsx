import React, { useState } from 'react';
import { Badge, LeaderboardUser } from '../types/grammar';
import { Trophy, Award, Crown, Zap, Flame, ShieldCheck, Compass, Sparkles, Lock, Edit3, Check, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LeaderboardViewProps {
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  xp: number;
  streak: number;
  studentName: string;
  studentGrade: string;
  onUpdateProfile: (name: string, grade: string) => void;
  onResetProgress: () => void;
}

const GRADE_OPTIONS = [
  'السنة الأولى متوسط',
  'السنة الثانية متوسط',
  'السنة الثالثة متوسط',
  'السنة الرابعة متوسط'
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  badges,
  leaderboard,
  xp,
  streak,
  studentName,
  studentGrade,
  onUpdateProfile,
  onResetProgress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(studentName);
  const [draftGrade, setDraftGrade] = useState(studentGrade);
  const [confirmReset, setConfirmReset] = useState(false);

  const level = Math.floor(xp / 500) + 1;
  const currentLevelMinXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const progressPercent = Math.min(100, Math.round(((xp - currentLevelMinXp) / 500) * 100));

  const getLevelTitle = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'مستكشف الحركات والكلمات';
      case 2:
        return 'فارس الجملة والتركيب';
      case 3:
        return 'معرب المرحلة المتوسطة البارع';
      case 4:
        return 'سيبويه الصغير المتميز';
      default:
        return 'علامة النحو الأكبر';
    }
  };

  const renderBadgeIcon = (icon: string, unlocked: boolean) => {
    const cls = `w-6 h-6 ${unlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (icon) {
      case 'Crown':
        return <Crown className={cls} />;
      case 'ShieldCheck':
        return <ShieldCheck className={cls} />;
      case 'Sparkles':
        return <Sparkles className={cls} />;
      case 'Compass':
        return <Compass className={cls} />;
      case 'Zap':
        return <Zap className={cls} />;
      case 'Flame':
        return <Flame className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draftName.trim() || 'البطل النحوي';
    onUpdateProfile(cleaned, draftGrade);
    setIsEditing(false);
    soundFx.playCorrect();
  };

  return (
    <div className="space-y-8">
      {/* Student Level & Editable Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {level}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-0.5">
                <span>المستوى {level}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{studentGrade}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {getLevelTitle(level)}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>الطالب: <strong className="text-slate-800">{studentName}</strong></span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setDraftName(studentName);
                    setDraftGrade(studentGrade);
                    setIsEditing(!isEditing);
                  }}
                  className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block mb-0.5">مجموع نقاط الخبرة</span>
              <span className="font-black text-slate-900 text-base tabular-nums">{xp} XP</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="text-amber-700 block mb-0.5">أيام الالتزام</span>
              <span className="font-black text-amber-900 text-base tabular-nums">{streak} أيام</span>
            </div>
          </div>
        </div>

        {/* Inline Edit Profile Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم التلميذ في لوحة الصدارة
              </label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                maxLength={28}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="اكتب اسمك..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المستوى الدراسي
              </label>
              <select
                value={draftGrade}
                onChange={(e) => setDraftGrade(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2 px-3 bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Level Progression Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">التقدم نحو المستوى التالي ({level + 1})</span>
            <span className="text-emerald-700 tabular-nums font-bold">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
            <span>{currentLevelMinXp} XP</span>
            <span>باقي {nextLevelXp - xp} XP للترقية القادمة</span>
            <span>{nextLevelXp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Badges Cabinet */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">خزانة الأوسمة والإنجازات</h3>
              <p className="text-xs text-slate-500">
                أوسمة تمنح للتلميذ عند إتقان المفاهيم وحل التمارين
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800">
              {badges.filter((b) => b.unlocked).length} من {badges.length} أوسمة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.unlocked
                    ? 'bg-white border-amber-200 shadow-2xs ring-1 ring-amber-100'
                    : 'bg-slate-50/70 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      badge.unlocked
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {renderBadgeIcon(badge.icon, badge.unlocked)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {badge.title}
                      </h4>
                      {badge.unlocked ? (
                        <span className="text-[11px] text-emerald-700 font-bold whitespace-nowrap">
                          مُكتسب ✓
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {badge.description}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-100 pt-1.5">
                      {badge.unlocked ? (
                        <span className="text-emerald-700 font-medium">
                          حصلت عليه ({badge.unlockedAt || 'بنجاح'})
                        </span>
                      ) : (
                        <span>طريقة الفوز: {badge.requirementText}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">لوحة صدارة القسم</h3>
              <p className="text-xs text-slate-500">
                المتنافسون في الفصل الدراسي هذا الأسبوع
              </p>
            </div>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {leaderboard.map((user, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={user.id}
                    className={`p-3.5 flex items-center justify-between gap-3 ${
                      user.isCurrentUser
                        ? 'bg-emerald-50/70 font-semibold'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 text-center shrink-0">
                        {rank === 1 ? (
                          <span className="text-base">🥇</span>
                        ) : rank === 2 ? (
                          <span className="text-base">🥈</span>
                        ) : rank === 3 ? (
                          <span className="text-base">🥉</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 tabular-nums">
                            {rank}
                          </span>
                        )}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {user.grade}
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                        {user.xp} XP
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.badgeCount} أوسمة
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Reset Option */}
          <div className="pt-2 flex justify-end">
            {!confirmReset ? (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setConfirmReset(true);
                }}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير التقدم المحفوظ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                <span className="text-rose-800 font-semibold">هل أنت متأكد من تصفير نقاطك؟</span>
                <button
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                    soundFx.playClick();
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-md cursor-pointer"
                >
                  نعم، صفّر
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded-md cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
