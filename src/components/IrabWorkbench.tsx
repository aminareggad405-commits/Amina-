import React, { useState } from 'react';
import { DIACRITIC_CHALLENGES, DRAG_DROP_EXERCISES } from '../data/exercises';
import { DiacriticChallenge, DragDropExercise } from '../types/grammar';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Check,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  GripVertical,
  PenTool
} from 'lucide-react';

interface IrabWorkbenchProps {
  onEarnXp: (amount: number) => void;
  onOpenReference: () => void;
  completedExercises: string[];
  onMarkExerciseComplete: (exerciseId: string, xpReward: number) => void;
}

type WorkbenchMode = 'parsing' | 'diacritics';

export const IrabWorkbench: React.FC<IrabWorkbenchProps> = ({
  onOpenReference,
  completedExercises,
  onMarkExerciseComplete
}) => {
  const [mode, setMode] = useState<WorkbenchMode>('parsing');

  // --- Mode 1: Parsing Drag & Drop State ---
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const exercise: DragDropExercise = DRAG_DROP_EXERCISES[currentExerciseIndex];

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const [dragOverSlot, setDragOverSlot] = useState<'role' | 'state' | 'sign' | null>(null);
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // --- Mode 2: Diacritic Adjuster State ---
  const [diacriticIndex, setDiacriticIndex] = useState<number>(0);
  const diacriticTask: DiacriticChallenge = DIACRITIC_CHALLENGES[diacriticIndex];
  const [selectedDiacriticOption, setSelectedDiacriticOption] = useState<number | null>(null);
  const [showDiacriticHint, setShowDiacriticHint] = useState<boolean>(false);

  // Drag handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    category: 'role' | 'state' | 'sign',
    value: string
  ) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ category, value }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    slotCategory: 'role' | 'state' | 'sign'
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot !== slotCategory) {
      setDragOverSlot(slotCategory);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    slotCategory: 'role' | 'state' | 'sign'
  ) => {
    e.preventDefault();
    setDragOverSlot(null);
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain')) as {
        category: 'role' | 'state' | 'sign';
        value: string;
      };
      if (payload.category === slotCategory) {
        soundFx.playClick();
        setHasValidated(false);
        if (slotCategory === 'role') setSelectedRole(payload.value);
        if (slotCategory === 'state') setSelectedState(payload.value);
        if (slotCategory === 'sign') setSelectedSign(payload.value);
      } else {
        soundFx.playIncorrect();
      }
    } catch {
      // ignore invalid drag payload
    }
  };

  const handleSelectRole = (role: string) => {
    soundFx.playClick();
    setSelectedRole(role);
    setHasValidated(false);
  };

  const handleSelectState = (state: string) => {
    soundFx.playClick();
    setSelectedState(state);
    setHasValidated(false);
  };

  const handleSelectSign = (sign: string) => {
    soundFx.playClick();
    setSelectedSign(sign);
    setHasValidated(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedRole || !selectedState || !selectedSign) {
      soundFx.playIncorrect();
      return;
    }

    const roleCorrect = selectedRole === exercise.correctRole;
    const stateCorrect = selectedState === exercise.correctState;
    const signCorrect = selectedSign === exercise.correctSign;

    setHasValidated(true);

    if (roleCorrect && stateCorrect && signCorrect) {
      setIsSuccess(true);
      soundFx.playCorrect();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (!completedExercises.includes(exercise.id)) {
        onMarkExerciseComplete(exercise.id, 50);
      }
    } else {
      setIsSuccess(false);
      soundFx.playIncorrect();
    }
  };

  const handleResetSlots = () => {
    soundFx.playClick();
    setSelectedRole(null);
    setSelectedState(null);
    setSelectedSign(null);
    setHasValidated(false);
    setIsSuccess(false);
  };

  const handleNextExercise = () => {
    soundFx.playClick();
    if (currentExerciseIndex < DRAG_DROP_EXERCISES.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      handleResetSlots();
      setShowHint(false);
    }
  };

  const handlePrevExercise = () => {
    soundFx.playClick();
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      handleResetSlots();
      setShowHint(false);
    }
  };

  // --- Mode 2 Handlers ---
  const handleSelectDiacritic = (idx: number) => {
    if (selectedDiacriticOption !== null) return;
    setSelectedDiacriticOption(idx);
    const chosen = diacriticTask.options[idx];
    if (chosen.isCorrect) {
      soundFx.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 }
      });
      if (!completedExercises.includes(diacriticTask.id)) {
        onMarkExerciseComplete(diacriticTask.id, 35);
      }
    } else {
      soundFx.playIncorrect();
    }
  };

  const handleResetDiacritic = () => {
    soundFx.playClick();
    setSelectedDiacriticOption(null);
  };

  const wordsInSentence = exercise.targetSentence.split(' ');

  return (
    <div className="space-y-6">
      {/* Mode Switcher & Reference Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('parsing');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              mode === 'parsing'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GripVertical className="w-4 h-4" />
            <span>١. بناء الإعراب (سحب وإفلات)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setMode('diacritics');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              mode === 'diacritics'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>٢. مدقق الشكل والإعراب</span>
          </button>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenReference();
          }}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <BookMarked className="w-4 h-4 text-emerald-700" />
          <span>جدول علامات الإعراب</span>
        </button>
      </div>

      {/* MODE 1: PARSING WORKBENCH (DRAG & DROP + CLICK) */}
      {mode === 'parsing' && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                  <span>{exercise.lessonRef}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    التمرين {currentExerciseIndex + 1} من {DRAG_DROP_EXERCISES.length}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {exercise.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevExercise}
                  disabled={currentExerciseIndex === 0}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="التمرين السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <span className="text-xs font-bold text-slate-600 px-2 tabular-nums">
                  {currentExerciseIndex + 1} / {DRAG_DROP_EXERCISES.length}
                </span>

                <button
                  onClick={handleNextExercise}
                  disabled={currentExerciseIndex === DRAG_DROP_EXERCISES.length - 1}
                  className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="التمرين التالي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-slate-500 mb-3">
                اسحب البطاقات المناسبة إلى خانات الإعراب أو اضغط عليها لاختيارها:
              </p>

              <div className="font-amiri text-2xl sm:text-4xl py-6 px-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/80 flex flex-wrap items-center justify-center gap-3 leading-loose">
                {wordsInSentence.map((w, idx) => {
                  const isTarget =
                    w.includes(exercise.targetWord) || exercise.targetWord.includes(w);
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        isTarget
                          ? 'bg-emerald-600 text-white font-extrabold shadow-sm scale-105 ring-4 ring-emerald-200'
                          : 'text-slate-800'
                      }`}
                    >
                      {w}
                    </span>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <span className="text-slate-500">الكلمة المطلوب إعرابها:</span>
                <span className="font-bold text-emerald-800 text-sm font-amiri bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                  {exercise.targetWord}
                </span>
                <button
                  onClick={() => {
                    setShowHint(!showHint);
                    soundFx.playClick();
                  }}
                  className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'إخفاء التلميح' : 'مساعدة'}</span>
                </button>
              </div>

              {showHint && (
                <div className="mt-3 p-3 max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 text-right">
                  💡 <strong>تلميح الإعراب:</strong> {exercise.hint}
                </div>
              )}
            </div>
          </div>

          {/* Parsing Construction Board (Drop Zones) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>لوحة بناء صيغة الإعراب</span>
                <span className="text-xs font-normal text-slate-500">
                  (يدعم السحب والإفلات أو النقر المباشر)
                </span>
              </h3>

              {(selectedRole || selectedState || selectedSign) && (
                <button
                  onClick={handleResetSlots}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تفريغ اللوحة</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {/* Slot 1 */}
              <div
                onDragOver={(e) => handleDragOver(e, 'role')}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => handleDrop(e, 'role')}
                className={`p-4 bg-white rounded-xl border-2 transition-all flex flex-col justify-between min-h-[116px] ${
                  dragOverSlot === 'role'
                    ? 'border-blue-500 bg-blue-50/40 scale-[1.01]'
                    : 'border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-500 mb-2">
                  ١. المَوْقِعُ الإِعْرَابِيُّ:
                </span>
                {selectedRole ? (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 font-bold rounded-lg text-center text-sm sm:text-base flex items-center justify-between">
                    <span className="mx-auto">{selectedRole}</span>
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="text-blue-400 hover:text-blue-700 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg py-3 text-center text-xs text-slate-400">
                    اسحب أو اختر بطاقة الموقع
                  </div>
                )}
              </div>

              {/* Slot 2 */}
              <div
                onDragOver={(e) => handleDragOver(e, 'state')}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => handleDrop(e, 'state')}
                className={`p-4 bg-white rounded-xl border-2 transition-all flex flex-col justify-between min-h-[116px] ${
                  dragOverSlot === 'state'
                    ? 'border-emerald-500 bg-emerald-50/40 scale-[1.01]'
                    : 'border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-500 mb-2">
                  ٢. الحَالَةُ الإِعْرَابِيَّةُ:
                </span>
                {selectedState ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-lg text-center text-sm sm:text-base flex items-center justify-between">
                    <span className="mx-auto">{selectedState}</span>
                    <button
                      onClick={() => setSelectedState(null)}
                      className="text-emerald-400 hover:text-emerald-700 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg py-3 text-center text-xs text-slate-400">
                    اسحب أو اختر بطاقة الحالة
                  </div>
                )}
              </div>

              {/* Slot 3 */}
              <div
                onDragOver={(e) => handleDragOver(e, 'sign')}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => handleDrop(e, 'sign')}
                className={`p-4 bg-white rounded-xl border-2 transition-all flex flex-col justify-between min-h-[116px] ${
                  dragOverSlot === 'sign'
                    ? 'border-purple-500 bg-purple-50/40 scale-[1.01]'
                    : 'border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-500 mb-2">
                  ٣. العَلَامَةُ وَالسَّبَبُ:
                </span>
                {selectedSign ? (
                  <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-900 font-bold rounded-lg text-center text-sm sm:text-base flex items-center justify-between">
                    <span className="mx-auto">{selectedSign}</span>
                    <button
                      onClick={() => setSelectedSign(null)}
                      className="text-purple-400 hover:text-purple-700 text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg py-3 text-center text-xs text-slate-400">
                    اسحب أو اختر بطاقة العلامة
                  </div>
                )}
              </div>
            </div>

            {/* Live Sentence Assembly Preview */}
            <div className="mt-4 p-3 bg-slate-100/70 rounded-xl text-center text-sm text-slate-700 font-medium">
              صياغة الإعراب المركبة: «{' '}
              <strong className="text-emerald-800">{exercise.targetWord}</strong>:{' '}
              {selectedRole ? <span className="text-blue-800 font-bold">{selectedRole}</span> : '.....'}{' '}
              {selectedState ? <span className="text-emerald-800 font-bold">{selectedState}</span> : '.....'}، وعلامة{' '}
              {selectedState?.includes('مرفوع')
                ? 'رفعه'
                : selectedState?.includes('منصوب')
                ? 'نصبه'
                : 'إعرابه'}
              :{' '}
              {selectedSign ? <span className="text-purple-800 font-bold">{selectedSign}</span> : '.....'}{' '}
              »
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {completedExercises.includes(exercise.id) ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    تم إنجاز هذا التمرين بنجاح (+50 XP)
                  </span>
                ) : (
                  <span>املأ جميع الخانات الثلاثة ثم اضغط تحقق للتقييم الفوري</span>
                )}
              </div>

              <button
                onClick={handleCheckAnswer}
                disabled={!selectedRole || !selectedState || !selectedSign}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>تحقَّق من صحة الإعراب</span>
              </button>
            </div>

            {hasValidated && (
              <div
                className={`mt-6 p-5 rounded-xl border text-right transition-all ${
                  isSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base mb-2">
                  {isSuccess ? (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>إعراب نموذجي صحيح مئة بالمئة! بارك الله في نباهتك.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <span>هناك خطأ في تركيب الإعراب! تفحّص الملاحظات:</span>
                    </>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-700">
                  {exercise.explanation}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
                  <span className={selectedRole === exercise.correctRole ? 'text-emerald-800' : 'text-rose-800'}>
                    الموقع: {selectedRole === exercise.correctRole ? 'صحيح ✓' : 'غير صحيح ✗'}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className={selectedState === exercise.correctState ? 'text-emerald-800' : 'text-rose-800'}>
                    الحالة: {selectedState === exercise.correctState ? 'صحيح ✓' : 'غير صحيح ✗'}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className={selectedSign === exercise.correctSign ? 'text-emerald-800' : 'text-rose-800'}>
                    العلامة: {selectedSign === exercise.correctSign ? 'صحيح ✓' : 'غير صحيح ✗'}
                  </span>
                </div>

                {isSuccess && currentExerciseIndex < DRAG_DROP_EXERCISES.length - 1 && (
                  <div className="mt-4 pt-3 border-t border-emerald-200 flex justify-end">
                    <button
                      onClick={handleNextExercise}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>التمرين التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Available Draggable Token Banks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800">بنك المواقع الإعرابية</h4>
                <span className="text-[11px] text-blue-700 font-semibold">اسحب أو اختر</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.availableRoles.map((role) => (
                  <button
                    key={role}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'role', role)}
                    onClick={() => handleSelectRole(role)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-grab active:cursor-grabbing ${
                      selectedRole === role
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-sm'
                        : 'bg-slate-50 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800">بنك الحالات الإعرابية</h4>
                <span className="text-[11px] text-emerald-700 font-semibold">اسحب أو اختر</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.availableStates.map((st) => (
                  <button
                    key={st}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'state', st)}
                    onClick={() => handleSelectState(st)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-grab active:cursor-grabbing ${
                      selectedState === st
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-sm'
                        : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-800">بنك العلامات والتعليل</h4>
                <span className="text-[11px] text-purple-700 font-semibold">اسحب أو اختر</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.availableSigns.map((sign) => (
                  <button
                    key={sign}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'sign', sign)}
                    onClick={() => handleSelectSign(sign)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-grab active:cursor-grabbing ${
                      selectedSign === sign
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300 shadow-sm'
                        : 'bg-slate-50 hover:bg-purple-50 hover:text-purple-900 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {sign}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODE 2: DIACRITIC ADJUSTER (مدقق الشكل والإعراب) */}
      {mode === 'diacritics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                <span>تدريب ضبط أواخر الكلمات</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">
                  التحدي {diacriticIndex + 1} من {DIACRITIC_CHALLENGES.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {diacriticTask.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setDiacriticIndex((i) => Math.max(0, i - 1));
                  setSelectedDiacriticOption(null);
                  setShowDiacriticHint(false);
                }}
                disabled={diacriticIndex === 0}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-slate-600 px-2 tabular-nums">
                {diacriticIndex + 1} / {DIACRITIC_CHALLENGES.length}
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setDiacriticIndex((i) =>
                    Math.min(DIACRITIC_CHALLENGES.length - 1, i + 1)
                  );
                  setSelectedDiacriticOption(null);
                  setShowDiacriticHint(false);
                }}
                disabled={diacriticIndex === DIACRITIC_CHALLENGES.length - 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                title="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Sentence Fill Box */}
          <div className="py-6 px-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/80 text-center space-y-3">
            <p className="text-xs font-semibold text-slate-500">
              اختر الضبط الإعرابي الصحيح لملء الفراغ وإتمام الجملة:
            </p>

            <div className="font-amiri text-2xl sm:text-4xl font-bold text-slate-900 leading-loose flex flex-wrap items-center justify-center gap-2.5">
              <span>{diacriticTask.sentenceBefore}</span>
              <span
                className={`px-4 py-1 rounded-xl border-2 transition-all ${
                  selectedDiacriticOption === null
                    ? 'border-dashed border-emerald-400 bg-white text-emerald-700'
                    : diacriticTask.options[selectedDiacriticOption].isCorrect
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-rose-500 bg-rose-600 text-white shadow-sm'
                }`}
              >
                {selectedDiacriticOption !== null
                  ? diacriticTask.options[selectedDiacriticOption].wordWithEnding
                  : diacriticTask.baseWordPrompt}
              </span>
              <span>{diacriticTask.sentenceAfter}</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs pt-2">
              {completedExercises.includes(diacriticTask.id) && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم الإتقان (+35 XP)</span>
                </span>
              )}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowDiacriticHint(!showDiacriticHint);
                }}
                className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showDiacriticHint ? 'إخفاء التلميح' : 'تلميح الضبط'}</span>
              </button>
            </div>

            {showDiacriticHint && (
              <div className="mt-2 p-3 max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 text-right">
                💡 <strong>تلميح:</strong> {diacriticTask.hint}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {diacriticTask.options.map((opt, idx) => {
              const isChosen = selectedDiacriticOption === idx;
              const isAnswered = selectedDiacriticOption !== null;
              let btnClass =
                'bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/30';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass =
                    'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
                } else if (isChosen) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectDiacritic(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border-2 text-center font-bold text-sm sm:text-base transition-all cursor-pointer ${btnClass}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {selectedDiacriticOption !== null && (
            <div
              className={`p-5 rounded-xl border text-right ${
                diacriticTask.options[selectedDiacriticOption].isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="font-bold text-sm sm:text-base mb-1.5 flex items-center gap-2">
                {diacriticTask.options[selectedDiacriticOption].isCorrect ? (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span>أحسنت! ضبط إعرابي سليم وموفق.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>ضبط غير دقيق! إليك التعليل النحوي:</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {diacriticTask.ruleExplanation}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={handleResetDiacritic}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>

                {diacriticIndex < DIACRITIC_CHALLENGES.length - 1 && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setDiacriticIndex((i) => i + 1);
                      setSelectedDiacriticOption(null);
                      setShowDiacriticHint(false);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>التحدي التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
