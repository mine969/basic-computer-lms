import type { ReactNode } from "react";
import { linkTo } from "@/utils/routes";
import { t } from "@/utils/strings";
import type { useProgress } from "@/hooks/useProgress";

type ProgressApi = ReturnType<typeof useProgress>;

export function Layout({
  children,
  progressApi
}: {
  children: ReactNode;
  progressApi: ProgressApi;
}) {
  const { preferences } = progressApi.progress;
  const s = t(preferences.language);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b-2 border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-night/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <a href={linkTo.home()} className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-lg bg-ocean text-2xl font-black text-white">
              AI
            </span>
            <span>
              <span className="block text-2xl font-black">{s.appName}</span>
              <span className="block text-base font-bold text-slate-600 dark:text-slate-300">
                {s.appSubtitle}
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-2 text-lg font-extrabold">
            <NavLink href={linkTo.modules()} label={s.modules} />
            <NavLink href={linkTo.search()} label={s.search} />
            <NavLink href={linkTo.bookmarks()} label={s.bookmarks} />
            <NavLink href={linkTo.flashcards()} label={s.flashcards} />
            <NavLink href={linkTo.downloads()} label={s.downloads} />
            <NavLink href={linkTo.settings()} label={s.settings} />
          </nav>
        </div>
        {!preferences.focusMode ? (
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pb-4">
            <div
              aria-label={s.language}
              className="inline-flex min-h-12 overflow-hidden rounded-lg border-2 border-ocean bg-white text-lg font-black dark:bg-slate-800"
              role="group"
            >
              <button
                aria-pressed={preferences.language === "en"}
                className={`px-4 py-2 transition ${
                  preferences.language === "en"
                    ? "bg-ocean text-white"
                    : "text-ink hover:bg-teal-50 dark:text-white dark:hover:bg-slate-700"
                }`}
                onClick={() => progressApi.updatePreferences({ language: "en" })}
              >
                English
              </button>
              <button
                aria-pressed={preferences.language === "my"}
                className={`border-l-2 border-ocean px-4 py-2 transition ${
                  preferences.language === "my"
                    ? "bg-ocean text-white"
                    : "text-ink hover:bg-teal-50 dark:text-white dark:hover:bg-slate-700"
                }`}
                onClick={() => progressApi.updatePreferences({ language: "my" })}
              >
                မြန်မာ
              </button>
            </div>
            <button
              className="control-button"
              onClick={() =>
                progressApi.updatePreferences({
                  fontSize: Math.min(30, preferences.fontSize + 2)
                })
              }
            >
              {s.biggerText}
            </button>
            <button
              className="control-button"
              onClick={() =>
                progressApi.updatePreferences({
                  fontSize: Math.max(18, preferences.fontSize - 2)
                })
              }
            >
              {s.smallerText}
            </button>
            <button
              className="control-button"
              onClick={() =>
                progressApi.updatePreferences({
                  theme: preferences.theme === "dark" ? "light" : "dark"
                })
              }
            >
              {preferences.theme === "dark" ? s.lightMode : s.darkMode}
            </button>
            <button
              className="control-button"
              onClick={() =>
                progressApi.updatePreferences({
                  highContrast: !preferences.highContrast
                })
              }
            >
              {s.highContrast}
            </button>
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="min-h-12 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-ink transition hover:border-ocean hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
      href={href}
    >
      {label}
    </a>
  );
}
