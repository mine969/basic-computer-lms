import type { Course, CourseModule, Lesson, Preferences } from "@/types";

type LessonOverride = Partial<Omit<Lesson, "id" | "moduleId" | "number">> & {
  id: string;
};

type ModuleOverride = Partial<Omit<CourseModule, "id" | "number" | "lessons">> & {
  id: string;
  lessons?: LessonOverride[];
};

export type CourseOverrides = {
  course?: Partial<Pick<Course, "title" | "description">>;
  modules?: ModuleOverride[];
};

function mergeLesson(lesson: Lesson, override?: LessonOverride): Lesson {
  return override ? { ...lesson, ...override } : lesson;
}

function mergeModule(module: CourseModule, override?: ModuleOverride): CourseModule {
  if (!override) return module;
  return {
    ...module,
    ...override,
    lessons: module.lessons.map((lesson) =>
      mergeLesson(
        lesson,
        override.lessons?.find((item) => item.id === lesson.id)
      )
    )
  };
}

export function localizeCourse(
  baseCourse: Course,
  language: Preferences["language"],
  overrides?: CourseOverrides
): Course {
  if (language !== "my" || !overrides) return baseCourse;
  return {
    ...baseCourse,
    ...overrides.course,
    modules: baseCourse.modules.map((module) =>
      mergeModule(
        module,
        overrides.modules?.find((item) => item.id === module.id)
      )
    )
  };
}

export function getAllLessons(course: Course) {
  return course.modules.flatMap((module) => module.lessons);
}

export function findLesson(course: Course, lessonId: string) {
  const lessons = getAllLessons(course);
  return lessons.find((lesson) => lesson.id === lessonId) ?? lessons[0];
}

export function findModule(course: Course, moduleId: string) {
  return course.modules.find((module) => module.id === moduleId) ?? course.modules[0];
}

export function moduleForLesson(course: Course, lesson: Lesson) {
  return findModule(course, lesson.moduleId);
}

export function lessonNeighbors(course: Course, lesson: Lesson) {
  const lessons = getAllLessons(course);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null
  };
}

export function moduleProgress(module: CourseModule, completedLessons: string[]) {
  if (!module.lessons.length) return 0;
  const completed = module.lessons.filter((lesson) =>
    completedLessons.includes(lesson.id)
  ).length;
  return Math.round((completed / module.lessons.length) * 100);
}
