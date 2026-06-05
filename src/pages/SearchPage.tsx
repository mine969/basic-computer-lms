import { useMemo, useState } from "react";
import type { Course } from "@/types";
import { linkTo } from "@/utils/routes";

export function SearchPage({ course }: { course: Course }) {
  const [query, setQuery] = useState("");
  const searchIndex = useMemo(
    () =>
      course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          moduleId: module.id,
          moduleTitle: module.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          text: `${module.title} ${lesson.title} ${lesson.content}`
            .replace(/!\[[^\]]*]\([^)]+\)/g, "")
            .replace(/[#*_`>|-]/g, " ")
            .replace(/\s+/g, " ")
        }))
      ),
    [course]
  );
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return searchIndex
      .filter((item) => item.text.toLowerCase().includes(q))
      .slice(0, 40)
      .map((item) => {
        const lower = item.text.toLowerCase();
        const index = lower.indexOf(q);
        const preview = item.text.slice(Math.max(0, index - 70), index + 180);
        return { ...item, preview };
      });
  }, [query]);

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">Search Lessons</h1>
        <p className="page-lead">Search works offline across module titles, lesson titles, and lesson text.</p>
      </section>
      <input
        className="w-full rounded-lg border-4 border-slate-300 bg-white p-5 text-2xl font-bold text-ink dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        placeholder="Search for email, scam, AI, files..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid gap-4">
        {results.map((result) => (
          <article className="card" key={result.lessonId}>
            <p className="text-lg font-black text-ocean dark:text-teal-200">
              {result.moduleId} - {result.moduleTitle}
            </p>
            <h2 className="mt-2 text-2xl font-black">{result.lessonTitle}</h2>
            <p className="mt-3 text-xl leading-relaxed text-slate-700 dark:text-slate-200">
              {result.preview}
            </p>
            <a className="primary-button mt-4" href={linkTo.lesson(result.lessonId)}>
              Open lesson
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
