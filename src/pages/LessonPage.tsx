import { useEffect, useMemo } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ProgressBar } from "@/components/ProgressBar";
import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import {
  findLesson,
  getAllLessons,
  lessonNeighbors,
  moduleForLesson
} from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";
import { t } from "@/utils/strings";

type ProgressApi = ReturnType<typeof useProgress>;

export function LessonPage({
  course,
  lessonId,
  progressApi
}: {
  course: Course;
  lessonId: string;
  progressApi: ProgressApi;
}) {
  const language = progressApi.progress.preferences.language;
  const lesson = findLesson(course, lessonId);
  const allLessons = getAllLessons(course);
  const module = moduleForLesson(course, lesson);
  const neighbors = lessonNeighbors(course, lesson);
  const lessonIndex = allLessons.findIndex((item) => item.id === lesson.id) + 1;
  const readingProgress = Math.round((lessonIndex / allLessons.length) * 100);
  const bookmarked = progressApi.progress.bookmarks.includes(lesson.id);
  const completed = progressApi.progress.completedLessons.includes(lesson.id);
  const s = t(language);

  useEffect(() => {
    progressApi.setCurrentLesson(lesson.id);
  }, [lesson.id]);

  const toc = useMemo(
    () =>
      lesson.sections.map((section) => ({
        section,
        href: `#${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      })),
    [lesson.sections]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className="space-y-4 xl:sticky xl:top-44 xl:self-start">
        <a className="secondary-button w-full" href={linkTo.module(module.id)}>
          {s.backToModules}
        </a>
        <div className="card space-y-4">
          <p className="text-lg font-black text-ocean dark:text-teal-200">
            {module.title}
          </p>
          <ProgressBar value={readingProgress} label="Course reading" />
          <button
            className="primary-button w-full"
            onClick={() => progressApi.markComplete(lesson.id)}
          >
            {completed ? s.lessonComplete : s.markComplete}
          </button>
          <button
            className="secondary-button w-full"
            onClick={() => progressApi.toggleBookmark(lesson.id)}
          >
            {bookmarked ? s.removeBookmark : s.bookmarkLesson}
          </button>
        </div>
        {!progressApi.progress.preferences.simpleMode ? (
          <nav className="card space-y-2">
            <h2 className="text-xl font-black">{s.lessonSections}</h2>
            {toc.slice(0, 12).map((item) => (
              <a
                className="block rounded-lg px-3 py-2 text-lg font-bold hover:bg-teal-50 dark:hover:bg-slate-700"
                href={item.href}
                key={item.href}
              >
                {item.section}
              </a>
            ))}
          </nav>
        ) : null}
      </aside>

      <article className="space-y-6">
        <div className="card space-y-4">
          <p className="text-xl font-black text-ocean dark:text-teal-200">
            {module.id} - Lesson {lesson.number}
          </p>
          <h1 className="page-title">{lesson.title}</h1>
          <div className="flex flex-wrap gap-3">
            {neighbors.previous ? (
              <a className="secondary-button" href={linkTo.lesson(neighbors.previous.id)}>
                {s.previousLesson}
              </a>
            ) : null}
            {neighbors.next ? (
              <a className="primary-button" href={linkTo.lesson(neighbors.next.id)}>
                {s.nextLesson}
              </a>
            ) : null}
            {lesson.flashcards.length ? (
              <a className="secondary-button" href={linkTo.flashcards(module.id)}>
                {s.practiceFlashcards}
              </a>
            ) : null}
          </div>
        </div>
        <MarkdownRenderer markdown={lesson.content} />
        {lesson.quizAnswers.length ? (
          <section className="card space-y-4">
            <h2 className="text-3xl font-black">Self Check</h2>
            <p className="text-xl leading-relaxed">
              This course stores answer sections. Try the questions in the lesson,
              then compare with these answers.
            </p>
            <button
              className="primary-button"
              onClick={() => progressApi.saveQuizScore(lesson.id, 100)}
            >
              I reviewed the answers
            </button>
          </section>
        ) : null}
      </article>
    </div>
  );
}
