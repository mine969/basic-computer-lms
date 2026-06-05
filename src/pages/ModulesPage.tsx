import { ProgressBar } from "@/components/ProgressBar";
import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import { moduleProgress } from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";
import { t } from "@/utils/strings";

type ProgressApi = ReturnType<typeof useProgress>;

export function ModulesPage({
  course,
  progressApi
}: {
  course: Course;
  progressApi: ProgressApi;
}) {
  const language = progressApi.progress.preferences.language;
  const s = t(language);
  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">{s.allModules}</h1>
        <p className="page-lead">
          Study one module at a time. Each card shows how much is complete.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {course.modules.map((module) => {
          const progress = moduleProgress(
            module,
            progressApi.progress.completedLessons
          );
          const next =
            module.lessons.find(
              (lesson) => !progressApi.progress.completedLessons.includes(lesson.id)
            ) ?? module.lessons[0];

          return (
            <article className="card flex flex-col gap-5" key={module.id}>
              <div className="flex items-start justify-between gap-4">
                <p className="rounded-lg bg-ocean px-4 py-2 text-xl font-black text-white">
                  {module.id}
                </p>
                {progress === 100 ? (
                  <p className="rounded-lg bg-leaf px-4 py-2 text-lg font-black text-white">
                    {s.completed}
                  </p>
                ) : null}
              </div>
              <div>
                <h2 className="text-3xl font-black leading-tight">{module.title}</h2>
                <p className="mt-3 text-xl leading-relaxed text-slate-700 dark:text-slate-200">
                  {module.description}
                </p>
              </div>
              <p className="text-lg font-black">{module.lessons.length} lessons</p>
              <ProgressBar value={progress} />
              <div className="mt-auto flex flex-wrap gap-3">
                <a className="primary-button" href={linkTo.lesson(next.id)}>
                  {s.continue}
                </a>
                <a className="secondary-button" href={linkTo.module(module.id)}>
                  {s.viewLessons}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
