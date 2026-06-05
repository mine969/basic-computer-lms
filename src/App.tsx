import { Layout } from "@/components/Layout";
import { useCourseData } from "@/hooks/useCourseData";
import { useHashRoute } from "@/hooks/useHashRoute";
import { useProgress } from "@/hooks/useProgress";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { DownloadsPage } from "@/pages/DownloadsPage";
import { FlashcardsPage } from "@/pages/FlashcardsPage";
import { HomePage } from "@/pages/HomePage";
import { LessonPage } from "@/pages/LessonPage";
import { ModuleDetailPage } from "@/pages/ModuleDetailPage";
import { ModulesPage } from "@/pages/ModulesPage";
import { SearchPage } from "@/pages/SearchPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function App() {
  const route = useHashRoute();
  const progressApi = useProgress();
  const { course, loading, error } = useCourseData(
    progressApi.progress.preferences.language
  );

  return (
    <Layout progressApi={progressApi}>
      {loading ? (
        <div className="card">
          <h1 className="page-title">Loading lessons...</h1>
          <p className="page-lead">Please wait a moment.</p>
        </div>
      ) : null}
      {error ? (
        <div className="card">
          <h1 className="page-title">Lessons could not load</h1>
          <p className="page-lead">{error}</p>
        </div>
      ) : null}
      {course && route.name === "home" ? (
        <HomePage course={course} progressApi={progressApi} />
      ) : null}
      {course && route.name === "modules" ? (
        <ModulesPage course={course} progressApi={progressApi} />
      ) : null}
      {course && route.name === "module" ? (
        <ModuleDetailPage
          course={course}
          moduleId={route.moduleId}
          progressApi={progressApi}
        />
      ) : null}
      {course && route.name === "lesson" ? (
        <LessonPage
          course={course}
          lessonId={route.lessonId}
          progressApi={progressApi}
        />
      ) : null}
      {course && route.name === "search" ? <SearchPage course={course} /> : null}
      {course && route.name === "bookmarks" ? (
        <BookmarksPage course={course} progressApi={progressApi} />
      ) : null}
      {course && route.name === "flashcards" ? (
        <FlashcardsPage
          course={course}
          moduleId={route.moduleId}
          progressApi={progressApi}
        />
      ) : null}
      {route.name === "downloads" ? <DownloadsPage /> : null}
      {route.name === "settings" ? <SettingsPage progressApi={progressApi} /> : null}
    </Layout>
  );
}
