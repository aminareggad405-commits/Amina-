import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { LessonsView } from './components/LessonsView';
import { IrabWorkbench } from './components/IrabWorkbench';
import { SpeedChallenge } from './components/SpeedChallenge';
import { LeaderboardView } from './components/LeaderboardView';
import { GrammarReferenceModal } from './components/GrammarReferenceModal';
import { BadgeToast } from './components/BadgeToast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { INITIAL_BADGES, SAMPLE_LEADERBOARD } from './data/exercises';
import { LESSONS } from './data/curriculum';
import { Badge, LeaderboardUser } from './types/grammar';
import { soundFx } from './utils/audio';

const STORAGE_KEY = 'nibras_grammar_state_v1';

interface SavedProgress {
  xp: number;
  streak: number;
  studentName: string;
  studentGrade: string;
  completedLessons: string[];
  completedExercises: string[];
  speedHighScore: number;
  unlockedBadgeIds: string[];
}

const DEFAULT_PROGRESS: SavedProgress = {
  xp: 1420,
  streak: 3,
  studentName: 'أنت (البطل النحوي)',
  studentGrade: 'السنة الثانية متوسط',
  completedLessons: ['lesson-1'],
  completedExercises: [],
  speedHighScore: 0,
  unlockedBadgeIds: ['badge-starter', 'badge-streak']
};

function loadInitialProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [progress, setProgress] = useState<SavedProgress>(loadInitialProgress);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Persist to localStorage whenever progress updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore quota/private mode errors
    }
  }, [progress]);

  // Derive badges array from unlockedBadgeIds
  const badges: Badge[] = INITIAL_BADGES.map((b) => {
    const isUnlocked = progress.unlockedBadgeIds.includes(b.id);
    return {
      ...b,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked ? b.unlockedAt || 'مُكتسب' : undefined
    };
  });

  // Derive sorted leaderboard with current user synced
  const leaderboard: LeaderboardUser[] = SAMPLE_LEADERBOARD.map((u) => {
    if (u.isCurrentUser) {
      return {
        ...u,
        name: progress.studentName,
        grade: progress.studentGrade,
        xp: progress.xp,
        badgeCount: progress.unlockedBadgeIds.length
      };
    }
    return u;
  }).sort((a, b) => b.xp - a.xp);

  const unlockBadge = useCallback((badgeId: string) => {
    setProgress((prev) => {
      if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
      const found = INITIAL_BADGES.find((b) => b.id === badgeId);
      if (found) {
        setNewlyUnlockedBadge({ ...found, unlocked: true });
      }
      return {
        ...prev,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId]
      };
    });
  }, []);

  // Auto-dismiss badge toast after 5 seconds
  useEffect(() => {
    if (!newlyUnlockedBadge) return;
    const timer = setTimeout(() => setNewlyUnlockedBadge(null), 5000);
    return () => clearTimeout(timer);
  }, [newlyUnlockedBadge]);

  const handleEarnXp = useCallback(
    (amount: number) => {
      setProgress((prev) => {
        const nextXp = prev.xp + amount;
        const nextUnlocked = [...prev.unlockedBadgeIds];
        if (nextXp >= 1500 && !nextUnlocked.includes('badge-mansoobat')) {
          nextUnlocked.push('badge-mansoobat');
          const found = INITIAL_BADGES.find((b) => b.id === 'badge-mansoobat');
          if (found) setNewlyUnlockedBadge({ ...found, unlocked: true });
        }
        return {
          ...prev,
          xp: nextXp,
          unlockedBadgeIds: nextUnlocked
        };
      });
    },
    []
  );

  const handleCompleteLesson = useCallback(
    (lessonId: string, badgeId?: string) => {
      setProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        const nextXp = prev.xp + 40;
        const nextLessons = [...prev.completedLessons, lessonId];
        const nextUnlocked = [...prev.unlockedBadgeIds];

        if (badgeId && !nextUnlocked.includes(badgeId)) {
          nextUnlocked.push(badgeId);
          const found = INITIAL_BADGES.find((b) => b.id === badgeId);
          if (found) setNewlyUnlockedBadge({ ...found, unlocked: true });
        }

        return {
          ...prev,
          xp: nextXp,
          completedLessons: nextLessons,
          unlockedBadgeIds: nextUnlocked
        };
      });
    },
    []
  );

  const handleMarkExerciseComplete = useCallback((exerciseId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return {
        ...prev,
        xp: prev.xp + xpReward,
        completedExercises: [...prev.completedExercises, exerciseId]
      };
    });
  }, []);

  const handleRecordSpeedScore = useCallback(
    (score: number) => {
      setProgress((prev) => ({
        ...prev,
        speedHighScore: Math.max(prev.speedHighScore, score)
      }));
      if (score >= 600) {
        unlockBadge('badge-speed');
      }
    },
    [unlockBadge]
  );

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lessons');
  };

  const handleUpdateProfile = (name: string, grade: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
      studentGrade: grade
    }));
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        xp={progress.xp}
        streak={progress.streak}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'home' && (
          <HomeDashboard
            onNavigate={setCurrentTab}
            onOpenLesson={handleOpenLesson}
            onOpenReference={() => setIsReferenceOpen(true)}
            onEarnXp={handleEarnXp}
            completedLessons={progress.completedLessons}
            studentName={progress.studentName}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView
            selectedLessonId={selectedLessonId}
            onSelectLesson={setSelectedLessonId}
            completedLessons={progress.completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onEarnXp={handleEarnXp}
            onNavigateToWorkbench={() => setCurrentTab('workbench')}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {currentTab === 'workbench' && (
          <IrabWorkbench
            onEarnXp={handleEarnXp}
            onOpenReference={() => setIsReferenceOpen(true)}
            completedExercises={progress.completedExercises}
            onMarkExerciseComplete={handleMarkExerciseComplete}
          />
        )}

        {currentTab === 'speed' && (
          <SpeedChallenge
            highScore={progress.speedHighScore}
            onRecordScore={handleRecordSpeedScore}
            onEarnXp={handleEarnXp}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            badges={badges}
            leaderboard={leaderboard}
            xp={progress.xp}
            streak={progress.streak}
            studentName={progress.studentName}
            studentGrade={progress.studentGrade}
            onUpdateProfile={handleUpdateProfile}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">نِبرَاسُ النَّحْوِ</span>
            <span>·</span>
            <span>منصة التعلم التفاعلي لمرحلة التعليم المتوسط</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentTab('lessons');
                soundFx.playClick();
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              الدروس
            </button>
            <button
              onClick={() => {
                setCurrentTab('workbench');
                soundFx.playClick();
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              مختبر الإعراب
            </button>
            <button
              onClick={() => {
                setCurrentTab('speed');
                soundFx.playClick();
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              التحديات
            </button>
            <button
              onClick={() => {
                setCurrentTab('leaderboard');
                soundFx.playClick();
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              لوحة الصدارة
            </button>
          </div>
        </div>
      </footer>

      {/* Grammar Quick Reference Modal */}
      <GrammarReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Badge Unlock Toast */}
      <BadgeToast
        badge={newlyUnlockedBadge}
        onDismiss={() => setNewlyUnlockedBadge(null)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
