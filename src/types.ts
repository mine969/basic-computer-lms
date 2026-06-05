export type Lesson = {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  content: string;
  excerpt: string;
  sections: string[];
  quizAnswers: string[];
  flashcards: Flashcard[];
};

export type CourseModule = {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Flashcard = {
  front: string;
  back: string;
};

export type Course = {
  title: string;
  description: string;
  source: string;
  generatedAt: string;
  parsingLimitations: string[];
  modules: CourseModule[];
};

export type Preferences = {
  fontSize: number;
  theme: "light" | "dark";
  highContrast: boolean;
  simpleMode: boolean;
  focusMode: boolean;
  language: "en" | "my";
};

export type ProgressState = {
  completedLessons: string[];
  currentLesson: string | null;
  quizScores: Record<string, number>;
  bookmarks: string[];
  rememberedFlashcards: string[];
  preferences: Preferences;
};
