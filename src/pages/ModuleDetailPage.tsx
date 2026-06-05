import { ProgressBar } from "@/components/ProgressBar";
import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import { findModule, moduleProgress } from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";

type ProgressApi = ReturnType<typeof useProgress>;

export function ModuleDetailPage({
  course,
  moduleId,
  progressApi
}: {
  course: Course;
  moduleId: string;
  progressApi: ProgressApi;
}) {
  const module = findModule(course, moduleId);
  const progress = moduleProgress(module, progressApi.progress.completedLessons);

  return (
    <div className="space-y-7">
      <a className="secondary-button" href={linkTo.modules()}>
        Back to modules
      </a>
      <section className="space-y-4">
        <p className="text-xl font-black text-ocean dark:text-teal-200">
          {module.id}
        </p>
        <h1 className="page-title">{module.title}</h1>
        <p className="page-lead">{module.description}</p>
        <ProgressBar value={progress} />
      </section>

      <div className="grid gap-4">
        {module.lessons.map((lesson) => {
          const complete = progressApi.progress.completedLessons.includes(lesson.id);
          return (
            <article className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between" key={lesson.id}>
              <div>
                <p className="text-lg font-black text-slate-600 dark:text-slate-300">
                  Lesson {lesson.number}
                </p>
                <h2 className="text-2xl font-black">{lesson.title}</h2>
                <p className="mt-2 text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  {lesson.excerpt}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {complete ? <span className="complete-badge">Done</span> : null}
                <a className="primary-button" href={linkTo.lesson(lesson.id)}>
                  Open lesson
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
