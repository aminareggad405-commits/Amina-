import React, { useState } from 'react';
import { LESSONS } from '../data/curriculum';
import { Lesson, SentenceWord } from '../types/grammar';
import { soundFx } from '../utils/audio';
import {
  BookOpen,
  Shield,
  Target,
  Sparkles,
  Compass,
  CheckCircle2,
  Play,
  Lightbulb,
  BookMarked,
  MousePointerClick
} from 'lucide-react';
import { InteractiveQuestionCard } from './InteractiveQuestionCard';
import confetti from 'canvas-confetti';

interface LessonsViewProps {
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, badgeId?: string) => void;
  onEarnXp: (amount: number) => void;
  onNavigateToWorkbench: () => void;
  onOpenReference: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  selectedLessonId,
  onSelectLesson,
  completedLessons,
  onCompleteLesson,
  onEarnXp,
  onNavigateToWorkbench,
  onOpenReference
}) => {
  // Track active inspected word token per example key `${sectionIdx}-${exampleIdx}`
  const [inspectedTokens, setInspectedTokens] = useState<Record<string, number | null>>({});

  const currentLesson: Lesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const isLessonCompleted = completedLessons.includes(currentLesson.id);

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'Target':
        return <Target className="w-5 h-5 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getCaseBadgeStyles = (gCase: SentenceWord['case'], isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-white border-slate-200 text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/40';
    }
    switch (gCase) {
      case 'marfoo':
        return 'bg-blue-600 border-blue-700 text-white shadow-sm';
      case 'mansoob':
        return 'bg-emerald-600 border-emerald-700 text-white shadow-sm';
      case 'majroor':
        return 'bg-purple-600 border-purple-700 text-white shadow-sm';
      default:
        return 'bg-slate-700 border-slate-800 text-white shadow-sm';
    }
  };

  const getCaseCardStyles = (gCase: SentenceWord['case']) => {
    switch (gCase) {
      case 'marfoo':
        return 'bg-blue-50/80 border-blue-200 text-blue-950';
      case 'mansoob':
        return 'bg-emerald-50/80 border-emerald-200 text-emerald-950';
      case 'majroor':
        return 'bg-purple-50/80 border-purple-200 text-purple-950';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-900';
    }
  };

  const handleToggleToken = (exampleKey: string, tokenIndex: number) => {
    soundFx.playClick();
    setInspectedTokens((prev) => ({
      ...prev,
      [exampleKey]: prev[exampleKey] === tokenIndex ? null : tokenIndex
    }));
  };

  const handleMarkComplete = () => {
    if (isLessonCompleted) return;
    soundFx.playFanfare();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 }
    });
    onCompleteLesson(currentLesson.id, currentLesson.badgeIdToUnlock);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Lesson Directory */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">قائمة الدروس الأساسية</h3>
            <span className="text-xs font-semibold text-emerald-800 tabular-nums">
              {completedLessons.length} / {LESSONS.length} مكتمل
            </span>
          </div>

          <div className="space-y-2">
            {LESSONS.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onSelectLesson(lesson.id);
                    soundFx.playClick();
                    setInspectedTokens({});
                  }}
                  className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs shrink-0 mt-0.5">
                    {getLessonIcon(lesson.iconName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-400">الدرس {lesson.number}</span>
                      {isDone ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مكتمل</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">{lesson.estimatedMinutes} دقائق</span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5 truncate">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {lesson.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenReference();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-emerald-700" />
              <span>جدول علامات الإعراب المرجعي</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onNavigateToWorkbench();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>انتقل إلى مختبر الإعراب التفاعلي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Active Lesson Reader */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Lesson Hero Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
              <span>الدرس رقم {currentLesson.number}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{currentLesson.gradeLevel}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>وقت القراءة: ~{currentLesson.estimatedMinutes} دقائق</span>
            </div>

            {isLessonCompleted && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>أتممت هذا الدرس</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {currentLesson.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {currentLesson.summary}
          </p>

          {/* Lesson Sections */}
          <div className="space-y-8 border-t border-slate-100 pt-6">
            {currentLesson.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {sec.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {sec.content}
                </p>

                {sec.bulletPoints && (
                  <ul className="space-y-2 mr-2">
                    {sec.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                        <span className="text-emerald-600 mt-1 text-[10px]">●</span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Golden rule callout if available */}
                {sec.goldenRule && (
                  <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 mt-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block mb-0.5">
                        قاعدة ذهبية للمرحلة المتوسطة:
                      </span>
                      <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                        {sec.goldenRule}
                      </p>
                    </div>
                  </div>
                )}

                {/* Interactive Examples Anatomy */}
                {sec.examples && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-700">
                        نماذج إعرابية تفاعلية:
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        <span>اضغط على أي كلمة لاكتشاف إعرابها</span>
                      </div>
                    </div>

                    {sec.examples.map((ex, eIdx) => {
                      const exKey = `${sIdx}-${eIdx}`;
                      const activeTokenIdx = inspectedTokens[exKey] ?? null;
                      const activeToken =
                        ex.tokens && activeTokenIdx !== null ? ex.tokens[activeTokenIdx] : null;

                      return (
                        <div
                          key={eIdx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
                        >
                          {ex.tokens && ex.tokens.length > 0 ? (
                            <div className="py-3 px-4 bg-white rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-center gap-2.5">
                              {ex.tokens.map((tok, tIdx) => {
                                const isSel = activeTokenIdx === tIdx;
                                return (
                                  <button
                                    key={tIdx}
                                    onClick={() => handleToggleToken(exKey, tIdx)}
                                    className={`font-amiri text-xl sm:text-2xl font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${getCaseBadgeStyles(
                                      tok.case,
                                      isSel
                                    )}`}
                                    title="اضغط لعرض التحليل الإعرابي لهذه الكلمة"
                                  >
                                    {tok.word}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="font-amiri text-xl sm:text-2xl font-bold text-emerald-900 text-center py-2 px-3 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
                              « {ex.sentence} »
                            </div>
                          )}

                          {/* Live Word Inspector Detail Card */}
                          {activeToken && (
                            <div
                              className={`p-3.5 rounded-xl border text-xs sm:text-sm space-y-1.5 transition-all ${getCaseCardStyles(
                                activeToken.case
                              )}`}
                            >
                              <div className="flex flex-wrap items-center gap-2 font-bold">
                                <span className="font-amiri text-lg">{activeToken.word}</span>
                                <span aria-hidden="true">·</span>
                                <span>{activeToken.role}</span>
                                <span aria-hidden="true">·</span>
                                <span>{activeToken.caseLabel}</span>
                                <span aria-hidden="true">·</span>
                                <span>العلامة: {activeToken.sign}</span>
                              </div>
                              <p className="text-xs leading-relaxed opacity-90">
                                {activeToken.explanation}
                              </p>
                            </div>
                          )}

                          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                            <strong>الإعراب الكامل:</strong> {ex.analysis}
                          </div>
                          {ex.note && (
                            <div className="text-xs text-emerald-700 font-semibold">
                              💡 {ex.note}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Complete Lesson Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              {isLessonCompleted
                ? 'أحسنت! لقد أنهيت هذا الدرس وحصلت على نقاط الإتقان الخاصة به.'
                : 'بعد قراءة القاعدة وتجربة الأمثلة، سجّل إتمامك للدرس للحصول على +40 XP.'}
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={isLessonCompleted}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isLessonCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLessonCompleted ? 'تم إتمام الدرس ✓' : 'أتممت الدرس (+40 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Quiz for this Lesson */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>اختبر فهمك السريع للدرس {currentLesson.number}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">سؤال تطبيقي فوري</span>
          </div>

          {currentLesson.quickQuiz.map((quiz) => (
            <InteractiveQuestionCard
              key={quiz.id}
              question={quiz.question}
              sentenceExample={quiz.sentenceExample}
              options={quiz.options}
              correctIndex={quiz.correctIndex}
              explanation={quiz.explanation}
              tip="تذكر ما قرأته تواً في فقرة القواعد والأنواع"
              onAnswerCorrect={(points) => onEarnXp(points)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
