import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface InteractiveQuestionProps {
  question: string;
  sentenceExample?: string;
  targetWordHighlight?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
  onAnswerCorrect?: (points: number) => void;
}

export const InteractiveQuestionCard: React.FC<InteractiveQuestionProps> = ({
  question,
  sentenceExample,
  targetWordHighlight,
  options,
  correctIndex,
  explanation,
  tip,
  onAnswerCorrect
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    if (index === correctIndex) {
      soundFx.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (onAnswerCorrect) {
        onAnswerCorrect(20);
      }
    } else {
      soundFx.playIncorrect();
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setSelectedIndex(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  // Render sentence with highlighted target word if provided
  const renderSentenceWithHighlight = () => {
    if (!sentenceExample) return null;
    if (!targetWordHighlight) {
      return (
        <div className="font-amiri text-2xl sm:text-3xl font-bold text-center text-slate-800 py-4 px-6 bg-emerald-50/50 rounded-xl border border-emerald-100 tracking-wide">
          « {sentenceExample} »
        </div>
      );
    }

    const parts = sentenceExample.split(targetWordHighlight);
    return (
      <div className="font-amiri text-2xl sm:text-3xl font-bold text-center text-slate-800 py-4 px-6 bg-emerald-50/50 rounded-xl border border-emerald-100 tracking-wide leading-relaxed">
        « {parts[0]}
        <span className="text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-lg border-b-2 border-emerald-500 font-extrabold mx-1">
          {targetWordHighlight}
        </span>
        {parts[1]} »
      </div>
    );
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Question Header */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-transparent">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>تحدي تفاعلي سريع</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>+20 نقطة تميز</span>
          </div>

          {tip && (
            <button
              onClick={() => {
                setShowHint(!showHint);
                soundFx.playClick();
              }}
              className="text-xs font-medium text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'إخفاء التلميح' : 'تلميح نحوي'}</span>
            </button>
          )}
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {question}
        </h3>

        {/* Optional Hint Drawer */}
        {showHint && tip && (
          <div className="mt-3 p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-900 leading-relaxed">
            💡 <strong>تلميح المعلم:</strong> {tip}
          </div>
        )}
      </div>

      {/* Sentence Example Box */}
      {sentenceExample && (
        <div className="px-6 py-4 bg-slate-50/40">
          {renderSentenceWithHighlight()}
        </div>
      )}

      {/* Interactive Options List */}
      <div className="p-6 space-y-3">
        <div className="text-xs font-semibold text-slate-500 mb-1">
          اختر الإجابة الصحيحة بالضغط عليها:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option, idx) => {
            let optionStyles = 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-slate-50';

            if (isAnswered) {
              if (idx === correctIndex) {
                optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
              } else if (idx === selectedIndex) {
                optionStyles = 'bg-rose-50 border-rose-400 text-rose-950';
              } else {
                optionStyles = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border-2 text-right text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyles} ${
                  !isAnswered ? 'active:scale-[0.99]' : ''
                }`}
              >
                <span className="flex-1 leading-relaxed">{option}</span>
                {isAnswered && idx === correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && idx === selectedIndex && idx !== correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div
            className={`mt-4 p-4 rounded-xl border text-sm transition-all ${
              isCorrect
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/90 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>إجابة صحيحة وممتازة! أحسنت صنعاً.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>إجابة غير دقيقة! راجع الشرح النحوي أدناه:</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
              {explanation}
            </p>

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
