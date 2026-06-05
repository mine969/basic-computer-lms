import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import { findLesson, moduleForLesson } from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";
import { t } from "@/utils/strings";

type ProgressApi = ReturnType<typeof useProgress>;

export function BookmarksPage({
  course,
  progressApi
}: {
  course: Course;
  progressApi: ProgressApi;
}) {
  const language = progressApi.progress.preferences.language;
  const lessons = progressApi.progress.bookmarks.map((id) => findLesson(course, id));
  const s = t(language);

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">{s.bookmarks}</h1>
        <p className="page-lead">Saved lessons appear here for quick review.</p>
      </section>
      {lessons.length === 0 ? (
        <div className="card">
          <p className="text-2xl font-bold">{s.noBookmarks}</p>
          <a className="primary-button mt-4" href={linkTo.modules()}>
            {s.modules}
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            const module = moduleForLesson(course, lesson);
            return (
              <article className="card" key={lesson.id}>
                <p className="text-lg font-black text-ocean dark:text-teal-200">
                  {module.id} - {module.title}
                </p>
                <h2 className="mt-2 text-2xl font-black">{lesson.title}</h2>
                <a className="primary-button mt-4" href={linkTo.lesson(lesson.id)}>
                  {s.openLesson}
                </a>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
