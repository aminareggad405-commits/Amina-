import React, { useState, useEffect, useRef } from 'react';
import { SPEED_CHALLENGE_QUESTIONS } from '../data/exercises';
import { QuizQuestion } from '../types/grammar';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Zap, Timer, Flame, RotateCcw, Trophy, XCircle, CheckCircle2 } from 'lucide-react';

interface SpeedChallengeProps {
  highScore: number;
  onRecordScore: (score: number) => void;
  onEarnXp: (amount: number) => void;
}

interface MistakeRecord {
  question: string;
  chosenOption: string;
  correctOption: string;
  explanation: string;
}

export const SpeedChallenge: React.FC<SpeedChallengeProps> = ({
  highScore,
  onRecordScore,
  onEarnXp
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finishGame = () => {
    setGameState('finished');
    soundFx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const startChallenge = () => {
    soundFx.playClick();
    const shuffled = [...SPEED_CHALLENGE_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setMistakes([]);
    setTimeLeft(60);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleAnswer = (selectedIndex: number) => {
    if (gameState !== 'playing') return;

    const currentQ = questions[currentIndex % questions.length];
    const isCorrect = selectedIndex === currentQ.correctIndex;

    if (isCorrect) {
      soundFx.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const pointsAdded = 50 * multiplier;
      setScore((prev) => prev + pointsAdded);
      setCorrectCount((c) => c + 1);
      onEarnXp(pointsAdded);
    } else {
      soundFx.playIncorrect();
      setStreak(0);
      setWrongCount((w) => w + 1);
      setMistakes((prev) => [
        ...prev,
        {
          question: currentQ.question,
          chosenOption: currentQ.options[selectedIndex],
          correctOption: currentQ.options[currentQ.correctIndex],
          explanation: currentQ.explanation
        }
      ]);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (gameState === 'finished') {
      onRecordScore(score);
    }
  }, [gameState, score, onRecordScore]);

  const currentQ = questions[currentIndex % (questions.length || 1)];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro state */}
      {gameState === 'idle' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-4">
            <Zap className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            تحدي النحو السريع (60 ثانية)
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6">
            اختبر سرعة بديهتك النحوية! لديك دقيقة واحدة للإجابة على أكبر قدر من أسئلة تمييز المبتدأ والخبر، الفاعل، المنصوبات، والحركات المقدرة.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8 text-xs font-semibold">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">الزمن المحدد</span>
              <span className="text-slate-800 text-sm">٦٠ ثانية</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">مضاعف الكومبو</span>
              <span className="text-amber-600 text-sm font-bold">حتى 3x نقاط</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">نقاط الخبرة</span>
              <span className="text-emerald-700 text-sm font-bold">+50 لكل جواب</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-700 block mb-1">رقمك القياسي</span>
              <span className="text-amber-900 text-sm font-black tabular-nums">{highScore}</span>
            </div>
          </div>

          <button
            onClick={startChallenge}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-base shadow-sm transition-all transform active:scale-95 cursor-pointer"
          >
            ابدأ التحدي الآن ⚡
          </button>
        </div>
      )}

      {/* Playing state */}
      {gameState === 'playing' && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500' : 'text-slate-600'}`} />
              <div className="text-left font-mono font-bold text-lg tabular-nums">
                <span className={timeLeft <= 10 ? 'text-rose-600' : 'text-slate-900'}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>كومبو: </span>
              <span className="tabular-nums font-black">{streak}x</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm sm:text-base">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <span className="tabular-nums">{score}</span>
              <span className="text-xs text-slate-500">نقطة</span>
            </div>
          </div>

          <div className="h-1.5 w-full bg-slate-200">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-xs font-bold text-slate-400">
              السؤال {currentIndex + 1}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed font-amiri">
              {currentQ.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 font-semibold text-right text-sm sm:text-base transition-all active:scale-95 cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished State */}
      {gameState === 'finished' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                انتهى وقت التحدي! أحسنت يا بطل
              </h2>
              <p className="text-sm text-slate-500">
                {score > highScore
                  ? 'رقم قياسي شخصي جديد! أداء استثنائي.'
                  : 'إليك نتيجة أدائك في تحدي الـ 60 ثانية:'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-700 font-semibold block mb-1">النقاط المحققة</span>
                <span className="text-2xl font-black text-emerald-900 tabular-nums">{score}</span>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-xs text-blue-700 font-semibold block mb-1">إجابات صحيحة</span>
                <span className="text-2xl font-black text-blue-900 tabular-nums">{correctCount}</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xs text-amber-700 font-semibold block mb-1">أعلى كومبو</span>
                <span className="text-2xl font-black text-amber-900 tabular-nums">{highestStreak}x</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold block mb-1">نسبة الدقة</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {correctCount + wrongCount > 0
                    ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={startChallenge}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة التحدي وتحطيم الرقم القياسي</span>
              </button>
            </div>
          </div>

          {/* Mistake Review Drawer */}
          {mistakes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  مراجعة الأخطاء لتثبيت القاعدة ({mistakes.length})
                </h3>
                <span className="text-xs text-slate-500">تعلّم من كل محاولة</span>
              </div>

              <div className="space-y-3">
                {mistakes.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-right"
                  >
                    <div className="font-amiri text-lg font-bold text-slate-900">
                      {m.question}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold">
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>إجابتك: {m.chosenOption}</span>
                      </span>
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>الصحيح: {m.correctOption}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {m.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
