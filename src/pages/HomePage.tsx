import { ProgressBar } from "@/components/ProgressBar";
import type { useProgress } from "@/hooks/useProgress";
import type { Course } from "@/types";
import { findLesson, getAllLessons, moduleForLesson } from "@/utils/localizedCourse";
import { linkTo } from "@/utils/routes";
import { t } from "@/utils/strings";

type ProgressApi = ReturnType<typeof useProgress>;

export function HomePage({
  course,
  progressApi
}: {
  course: Course;
  progressApi: ProgressApi;
}) {
  const language = progressApi.progress.preferences.language;
  const allLessons = getAllLessons(course);
  const completed = progressApi.progress.completedLessons.length;
  const percent = Math.round((completed / allLessons.length) * 100);
  const current = progressApi.progress.currentLesson
    ? findLesson(course, progressApi.progress.currentLesson)
    : allLessons[0];
  const currentModule = moduleForLesson(course, current);
  const s = t(language);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <section className="space-y-6">
        <p className="text-xl font-black text-ocean dark:text-teal-200">
          Offline-first course
        </p>
        <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl">
          {course.title}
        </h1>
        <p className="max-w-3xl text-2xl leading-relaxed text-slate-700 dark:text-slate-200">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="primary-button" href={linkTo.lesson(allLessons[0].id)}>
            {s.startLearning}
          </a>
          <a className="secondary-button" href={linkTo.lesson(current.id)}>
            {s.continue}
          </a>
        </div>
      </section>

      <aside className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-800">
        <img
          className="h-72 w-full object-cover"
          src="/images/course/laptop-home-workspace.jpg"
          alt="Real-world photo of a laptop on a calm home desk"
        />
        <div className="space-y-5 p-6">
          <h2 className="text-3xl font-black">{s.progress}</h2>
          <ProgressBar value={percent} label={`${completed} ${s.lessonsComplete}`} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Modules" value={course.modules.length} />
            <Stat label="Lessons" value={allLessons.length} />
          </div>
          <p className="rounded-lg bg-teal-50 p-4 text-xl font-bold text-teal-950 dark:bg-teal-950 dark:text-teal-100">
            {s.next}: {currentModule.id} - {current.title}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
      <p className="text-base font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {label}
      </p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}
