import React from 'react';
import { LESSONS } from '../data/curriculum';
import { soundFx } from '../utils/audio';
import { InteractiveQuestionCard } from './InteractiveQuestionCard';
import { PWAInstallButton } from './PWAInstallButton';
import { BookOpen, Zap, Play, ArrowLeft, CheckCircle2, BookMarked } from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenReference: () => void;
  onEarnXp: (amount: number) => void;
  completedLessons: string[];
  studentName: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenLesson,
  onOpenReference,
  onEarnXp,
  completedLessons,
  studentName
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Showcase Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Text/CTA */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800 mb-3">
                <span>منصة التعلم التفاعلي لمرحلة التعليم المتوسط</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>الفئة 11-15 سنة</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-600 tabular-nums">
                  تقدمك: {completedLessons.length} من {LESSONS.length} دروس
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
                تعلَّمْ قَوَاعِدَ النَّحْوِ العَرَبِيِّ بِالمُتْعَةِ وَالتَّطْبِيقِ
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                أهلاً بك يا <strong>{studentName}</strong> في «نِبرَاسُ النَّحْوِ»، رفيقك التفاعلي لاكتشاف أسرار الجملة العربية، وتفكيك ألغاز الإعراب بالسحب والإفلات، وضبط أواخر الكلمات، والتنافس لحصد أوسمة النحويين الأوائل!
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onNavigate('workbench');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ابدأ مختبر الإعراب التفاعلي</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onNavigate('lessons');
                  }}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>تصفح الدروس الخمسة</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenReference();
                  }}
                  className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookMarked className="w-4 h-4 text-emerald-700" />
                  <span>جدول العلامات</span>
                </button>

                <PWAInstallButton variant="button" />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-500 font-medium">
                <span>5 دروس مشروحة بالتحليل التفاعلي</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>مختبر إعراب وتدقيق شكل</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>حفظ تلقائي للتقدم والأوسمة</span>
              </div>
            </div>
          </div>

          {/* Right Image Banner */}
          <div className="lg:col-span-5 bg-emerald-950 relative min-h-[260px] sm:min-h-[340px] flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/arabic_grammar_hero_banner_1792064271380.jpg"
              alt="تلاميذ يتعلمون قواعد النحو العربي في بيئة تفاعلية مشوقة"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-4 left-4 text-white text-xs text-right font-medium drop-shadow-sm">
              «النحو في الكلام كالملح في الطعام»
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Prototype Showcase */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              نموذج أولي تطبيقي: سؤال تفاعلي فوري
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              جرّب آلية التفاعل المباشرة واكتشف التغذية الراجعة الفورية والصوتية
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800">
            تحدي الدرس الأول · المبتدأ والخبر
          </span>
        </div>

        <InteractiveQuestionCard
          question="ما نوع الخبر في الجملة الآتية؟ وما محله الإعرابي؟"
          sentenceExample="القَمَرُ يُنِيرُ الدَّرْبَ"
          targetWordHighlight="يُنِيرُ الدَّرْبَ"
          options={[
            'خبر مفرد مرفوع بالضمة',
            'خبر جملة فعلية في محل رفع',
            'خبر شبه جملة ظرفية',
            'مفعول به منصوب'
          ]}
          correctIndex={1}
          explanation="الخبر هنا هو جملة (يُنيرُ الدربَ)، وهي جملة فعلية مكوّنة من الفعل (ينيرُ) والفاعل المستتر (هو)، وهي في محل رفع خبر المبتدأ (القمر)."
          tip="لاحظ أن الكلمة بعد المبتدأ بدأت بفعل مضارع (يُنير) وليس اسماً مفرداً"
          onAnswerCorrect={(p) => onEarnXp(p)}
        />
      </div>

      {/* Curriculum Grid Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              المنهاج التفاعلي: دروس النحو الأساسية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              اضغط على أي درس للانتقال المباشر إليه واستكشاف أمثلته التفاعلية
            </p>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigate('lessons');
            }}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>عرض كل الدروس</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((lesson) => {
            const isDone = completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm ${
                  isDone
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                    <span className="font-bold text-emerald-800">
                      الدرس {lesson.number}
                    </span>
                    {isDone ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مكتمل</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">~{lesson.estimatedMinutes} دقائق</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {lesson.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{lesson.gradeLevel}</span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenLesson(lesson.id);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isDone ? 'مراجعة الدرس' : 'اقرأ وتدرب'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Gamification Challenge Card in Grid */}
          <div className="bg-linear-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mb-2">
                <Zap className="w-4 h-4 fill-amber-300" />
                <span>ميدان التحدي السريع</span>
              </div>
              <h3 className="text-base font-bold mb-1.5">
                تحدي الـ 60 ثانية
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                أجب على أكبر عدد من أسئلة تمييز المواقع الإعرابية واحصد مضاعفات النقاط والكومبو!
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onNavigate('speed');
              }}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>خوض التحدي الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
