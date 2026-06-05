import { useEffect, useMemo, useState } from "react";
import type { Course, Preferences } from "@/types";
import {
  type CourseOverrides,
  localizeCourse
} from "@/utils/localizedCourse";

type CourseState = {
  baseCourse: Course | null;
  burmeseOverrides: CourseOverrides | null;
  error: string | null;
};

export function useCourseData(language: Preferences["language"]) {
  const [state, setState] = useState<CourseState>({
    baseCourse: null,
    burmeseOverrides: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [courseResponse, overridesResponse] = await Promise.all([
          fetch("/data/course.json"),
          fetch("/data/burmese-overrides.json")
        ]);
        if (!courseResponse.ok) {
          throw new Error(`Could not load course.json (${courseResponse.status})`);
        }
        const baseCourse = (await courseResponse.json()) as Course;
        const burmeseOverrides = overridesResponse.ok
          ? ((await overridesResponse.json()) as CourseOverrides)
          : null;
        if (!cancelled) setState({ baseCourse, burmeseOverrides, error: null });
      } catch (error) {
        if (!cancelled) {
          setState({
            baseCourse: null,
            burmeseOverrides: null,
            error: error instanceof Error ? error.message : "Could not load course data"
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const course = state.baseCourse
      ? localizeCourse(state.baseCourse, language, state.burmeseOverrides ?? undefined)
      : null;
    return {
      course,
      loading: !state.baseCourse && !state.error,
      error: state.error
    };
  }, [language, state]);
}
