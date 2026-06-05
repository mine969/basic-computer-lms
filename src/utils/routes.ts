export type Route =
  | { name: "home" }
  | { name: "modules" }
  | { name: "module"; moduleId: string }
  | { name: "lesson"; lessonId: string }
  | { name: "search" }
  | { name: "bookmarks" }
  | { name: "flashcards"; moduleId?: string }
  | { name: "downloads" }
  | { name: "settings" };

export const linkTo = {
  home: () => "#/",
  modules: () => "#/modules",
  module: (moduleId: string) => `#/modules/${moduleId}`,
  lesson: (lessonId: string) => `#/lessons/${lessonId}`,
  search: () => "#/search",
  bookmarks: () => "#/bookmarks",
  flashcards: (moduleId?: string) =>
    moduleId ? `#/flashcards/${moduleId}` : "#/flashcards",
  downloads: () => "#/downloads",
  settings: () => "#/settings"
};

export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts[0] === "modules" && parts[1]) return { name: "module", moduleId: parts[1] };
  if (parts[0] === "modules") return { name: "modules" };
  if (parts[0] === "lessons" && parts[1]) return { name: "lesson", lessonId: parts[1] };
  if (parts[0] === "search") return { name: "search" };
  if (parts[0] === "bookmarks") return { name: "bookmarks" };
  if (parts[0] === "flashcards") return { name: "flashcards", moduleId: parts[1] };
  if (parts[0] === "downloads") return { name: "downloads" };
  if (parts[0] === "settings") return { name: "settings" };
  return { name: "home" };
}
