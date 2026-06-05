import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Flashcard = { front: string; back: string };
type Lesson = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  sections: string[];
  quizAnswers: string[];
  flashcards: Flashcard[];
};
type CourseModule = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};
type Course = {
  title: string;
  description: string;
  modules: CourseModule[];
};
type LessonOverride = Partial<Lesson> & { id: string };
type ModuleOverride = {
  id: string;
  title?: string;
  description?: string;
  lessons: LessonOverride[];
};
type BurmeseOverrides = {
  language: "my";
  course?: Partial<Pick<Course, "title" | "description">>;
  modules: ModuleOverride[];
};

const root = process.cwd();
const sourcePath = path.join(root, "public", "data", "course.json");
const outPath = path.join(root, "src", "data", "burmese-overrides.json");
const publicOutPath = path.join(root, "public", "data", "burmese-overrides.json");

const protectedTerms = [
  "Windows 11",
  "Start Menu",
  "File Explorer",
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Google Drive",
  "Google Search",
  "Google Maps",
  "Google Docs",
  "Google Japan",
  "Yahoo Japan",
  "QR code",
  "SMS code",
  "one-time password",
  "Two-source rule",
  "Pause-Check-Confirm",
  "Windows",
  "Taskbar",
  "browser",
  "email",
  "Gmail",
  "Outlook",
  "OneDrive",
  "Android",
  "iPhone",
  "PayPay",
  "Rakuten",
  "Amazon",
  "Mercari",
  "LINE",
  "AI",
  "ChatGPT",
  "Gemini",
  "Copilot",
  "deepfake",
  "password",
  "PIN",
  "My Number",
  "LocalStorage",
  "Module",
  "Lesson",
  "Flashcards",
  "Download",
  "CPU",
  "USB",
  "Wi-Fi",
  "Bluetooth",
  "ATM",
  "PDF",
  "EPUB"
].sort((a, b) => b.length - a.length);

const course = JSON.parse(readFileSync(sourcePath, "utf8")) as Course;
const existing: BurmeseOverrides = existsSync(outPath)
  ? JSON.parse(readFileSync(outPath, "utf8"))
  : { language: "my", course: {}, modules: [] };

existing.language = "my";
existing.modules ??= [];

function save() {
  mkdirSync(path.dirname(outPath), { recursive: true });
  mkdirSync(path.dirname(publicOutPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(existing, null, 2), "utf8");
  writeFileSync(publicOutPath, JSON.stringify(existing, null, 2), "utf8");
}

function moduleOverride(moduleId: string) {
  let override = existing.modules.find((item) => item.id === moduleId);
  if (!override) {
    override = { id: moduleId, lessons: [] };
    existing.modules.push(override);
  }
  override.lessons ??= [];
  return override;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protectText(text: string) {
  const replacements: Array<[string, string]> = [];
  let protectedText = text.replace(/https?:\/\/[^\s)]+|\/[A-Za-z0-9_./-]+\.(?:jpg|png|pdf|epub|md|json)/g, (match) => {
    const token = `XQZURL${String(replacements.length).padStart(4, "0")}ZXQ`;
    replacements.push([token, match]);
    return token;
  });

  for (const term of protectedTerms) {
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${escapeRegExp(term)})(?=$|[^\\p{L}\\p{N}_])`, "giu");
    protectedText = protectedText.replace(pattern, (match, prefix, found) => {
      const token = `XQZTERM${String(replacements.length).padStart(4, "0")}ZXQ`;
      replacements.push([token, found]);
      return `${prefix}${token}`;
    });
  }

  return { protectedText, replacements };
}

function restoreText(text: string, replacements: Array<[string, string]>) {
  let restored = text;
  for (const [token, value] of replacements) {
    const tokenPattern = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").split("").join("\\s*"), "gi");
    restored = restored.replace(tokenPattern, value);
  }
  return restored;
}

function splitText(text: string, maxLength = 2600) {
  const chunks: string[] = [];
  let current = "";
  for (const part of text.split(/(\n\n|\n)/)) {
    if (current.length + part.length > maxLength && current.trim()) {
      chunks.push(current);
      current = "";
    }
    if (part.length > maxLength) {
      for (let index = 0; index < part.length; index += maxLength) {
        chunks.push(part.slice(index, index + maxLength));
      }
    } else {
      current += part;
    }
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}

async function translateChunk(chunk: string) {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: "my",
    dt: "t",
    q: chunk
  });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`);
  if (!response.ok) throw new Error(`Translate request failed: ${response.status}`);
  const data = (await response.json()) as unknown[];
  const segments = data[0] as Array<[string]>;
  return segments.map((segment) => segment[0]).join("");
}

async function translateText(text: string) {
  if (!text.trim()) return text;
  const { protectedText, replacements } = protectText(text);
  const chunks = splitText(protectedText);
  const translatedChunks = await Promise.all(chunks.map((chunk) => translateChunk(chunk)));
  return restoreText(translatedChunks.join(""), replacements);
}

async function translateList(items: string[]) {
  return Promise.all(items.map((item) => translateText(item)));
}

async function translateFlashcards(cards: Flashcard[]) {
  return Promise.all(
    cards.map(async (card) => ({
      front: await translateText(card.front),
      back: await translateText(card.back)
    }))
  );
}

existing.course = {
  title: await translateText(course.title),
  description: await translateText(course.description)
};
save();

for (const module of course.modules) {
  const mod = moduleOverride(module.id);
  if (!mod.title) mod.title = await translateText(module.title);
  if (!mod.description) mod.description = await translateText(module.description);
  save();

  for (const lesson of module.lessons) {
    if (mod.lessons.some((item) => item.id === lesson.id && item.content)) continue;
    console.log(`Translating ${lesson.id} ${lesson.title}`);
    const [title, content, excerpt, sections, quizAnswers, flashcards] = await Promise.all([
      translateText(lesson.title),
      translateText(lesson.content),
      translateText(lesson.excerpt),
      translateList(lesson.sections),
      translateList(lesson.quizAnswers),
      translateFlashcards(lesson.flashcards)
    ]);
    mod.lessons.push({
      id: lesson.id,
      title,
      content,
      excerpt,
      sections,
      quizAnswers,
      flashcards
    });
    save();
  }
}

console.log(`Burmese overrides written to ${outPath}`);
