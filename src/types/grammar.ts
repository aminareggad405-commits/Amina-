export type GrammaticalCase = 'marfoo' | 'mansoob' | 'majroor' | 'majzoom' | 'mabni';

export interface SentenceWord {
  word: string;
  role: string; // e.g. مبتدأ، خبر، فاعل، مفعول به
  case: GrammaticalCase;
  caseLabel: string; // e.g. مرفوع، منصوب، مجرور، مبني
  sign: string; // e.g. الضمة الظاهرة، الألف لأنه مثنى
  explanation: string;
}

export interface LessonExample {
  sentence: string;
  analysis: string;
  note?: string;
  tokens?: SentenceWord[];
}

export interface LessonSection {
  title: string;
  content: string;
  bulletPoints?: string[];
  examples?: LessonExample[];
  goldenRule?: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  gradeLevel: string;
  estimatedMinutes: number;
  iconName: string;
  summary: string;
  badgeIdToUnlock?: string;
  sections: LessonSection[];
  quickQuiz: QuizQuestion[];
}

export interface DragDropExercise {
  id: string;
  lessonRef: string;
  title: string;
  targetSentence: string;
  targetWord: string;
  targetWordIndex: number;
  correctRole: string;
  correctState: string;
  correctSign: string;
  hint: string;
  explanation: string;
  availableRoles: string[];
  availableStates: string[];
  availableSigns: string[];
}

export interface DiacriticBlankOption {
  label: string;
  wordWithEnding: string;
  isCorrect: boolean;
}

export interface DiacriticChallenge {
  id: string;
  title: string;
  sentenceBefore: string;
  baseWordPrompt: string;
  sentenceAfter: string;
  options: DiacriticBlankOption[];
  ruleExplanation: string;
  hint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  sentenceExample?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'mastery' | 'streak' | 'speed' | 'explorer';
  requirementText: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  grade: string;
  xp: number;
  avatarSeed: string;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export interface GrammarSignRow {
  nounType: string;
  raf: string;
  nasb: string;
  jarr: string;
  example: string;
}
