import type { useProgress } from "@/hooks/useProgress";
import { t } from "@/utils/strings";

type ProgressApi = ReturnType<typeof useProgress>;

export function SettingsPage({ progressApi }: { progressApi: ProgressApi }) {
  const prefs = progressApi.progress.preferences;
  const s = t(prefs.language);

  function reset() {
    if (window.confirm("Reset all progress, bookmarks, scores, and settings?")) {
      progressApi.resetProgress();
    }
  }

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <h1 className="page-title">{s.settings}</h1>
        <p className="page-lead">Adjust the reading experience. All settings save offline.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          className="card text-left text-2xl font-black"
          onClick={() =>
            progressApi.updatePreferences({ fontSize: Math.min(30, prefs.fontSize + 2) })
          }
        >
          {s.increaseTextSize}
        </button>
        <button
          className="card text-left text-2xl font-black"
          onClick={() =>
            progressApi.updatePreferences({ fontSize: Math.max(18, prefs.fontSize - 2) })
          }
        >
          {s.decreaseTextSize}
        </button>
        <Toggle
          label={s.darkMode}
          active={prefs.theme === "dark"}
          onClick={() =>
            progressApi.updatePreferences({
              theme: prefs.theme === "dark" ? "light" : "dark"
            })
          }
        />
        <Toggle
          label={s.highContrastMode}
          active={prefs.highContrast}
          onClick={() => progressApi.updatePreferences({ highContrast: !prefs.highContrast })}
        />
        <Toggle
          label={s.simpleMode}
          active={prefs.simpleMode}
          onClick={() => progressApi.updatePreferences({ simpleMode: !prefs.simpleMode })}
        />
        <Toggle
          label={s.focusMode}
          active={prefs.focusMode}
          onClick={() => progressApi.updatePreferences({ focusMode: !prefs.focusMode })}
        />
        <div className="card">
          <h2 className="text-2xl font-black">{s.language}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className={prefs.language === "en" ? "primary-button" : "secondary-button"}
              onClick={() => progressApi.updatePreferences({ language: "en" })}
            >
              {s.english}
            </button>
            <button
              className={prefs.language === "my" ? "primary-button" : "secondary-button"}
              onClick={() => progressApi.updatePreferences({ language: "my" })}
            >
              {s.burmese}
            </button>
          </div>
        </div>
      </div>
      <button className="danger-button" onClick={reset}>
        {s.resetProgress}
      </button>
    </div>
  );
}

function Toggle({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className="card text-left" onClick={onClick}>
      <span className="block text-2xl font-black">{label}</span>
      <span className="mt-2 block text-xl font-bold">
        {active ? "On" : "Off"}
      </span>
    </button>
  );
}
