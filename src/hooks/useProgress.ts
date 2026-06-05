import { useEffect, useMemo, useState } from "react";
import type { Preferences, ProgressState } from "@/types";

const storageKey = "senior_offline_lms_progress";

const defaultPreferences: Preferences = {
  fontSize: 20,
  theme: "light",
  highContrast: false,
  simpleMode: false,
  focusMode: false,
  language: "en"
};

const defaultProgress: ProgressState = {
  completedLessons: [],
  currentLesson: null,
  quizScores: {},
  bookmarks: [],
  rememberedFlashcards: [],
  preferences: defaultPreferences
};

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored) as Partial<ProgressState>;
    return {
      ...defaultProgress,
      ...parsed,
      preferences: { ...defaultPreferences, ...parsed.preferences }
    };
  } catch {
    return defaultProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    document.documentElement.classList.toggle("dark", progress.preferences.theme === "dark");
    document.documentElement.classList.toggle("high-contrast", progress.preferences.highContrast);
    document.documentElement.classList.toggle("simple-mode", progress.preferences.simpleMode);
    document.documentElement.classList.toggle("focus-mode", progress.preferences.focusMode);
    document.documentElement.style.setProperty(
      "--reader-font-size",
      `${progress.preferences.fontSize}px`
    );
  }, [progress]);

  return useMemo(
    () => ({
      progress,
      markComplete: (lessonId: string) =>
        setProgress((current) => ({
          ...current,
          currentLesson: lessonId,
          completedLessons: Array.from(new Set([...current.completedLessons, lessonId]))
        })),
      setCurrentLesson: (lessonId: string) =>
        setProgress((current) => ({ ...current, currentLesson: lessonId })),
      toggleBookmark: (lessonId: string) =>
        setProgress((current) => ({
          ...current,
          bookmarks: current.bookmarks.includes(lessonId)
            ? current.bookmarks.filter((id) => id !== lessonId)
            : [...current.bookmarks, lessonId]
        })),
      rememberFlashcard: (cardId: string) =>
        setProgress((current) => ({
          ...current,
          rememberedFlashcards: Array.from(
            new Set([...current.rememberedFlashcards, cardId])
          )
        })),
      saveQuizScore: (lessonId: string, score: number) =>
        setProgress((current) => ({
          ...current,
          quizScores: { ...current.quizScores, [lessonId]: score }
        })),
      updatePreferences: (preferences: Partial<Preferences>) =>
        setProgress((current) => ({
          ...current,
          preferences: { ...current.preferences, ...preferences }
        })),
      resetProgress: () => setProgress(defaultProgress)
    }),
    [progress]
  );
}
