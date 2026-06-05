import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Lesson = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  sections: string[];
  quizAnswers: string[];
  flashcards: { front: string; back: string }[];
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

const root = process.cwd();
const sourcePath = path.join(root, "src", "data", "course.json");
const outPath = path.join(root, "src", "data", "burmese-overrides.json");
const publicOutPath = path.join(root, "public", "data", "burmese-overrides.json");
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-4o-mini";

const protectedTerms = [
  "Windows",
  "Windows 11",
  "Start Menu",
  "Taskbar",
  "File Explorer",
  "browser",
  "email",
  "Gmail",
  "Outlook",
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "OneDrive",
  "Google Drive",
  "Android",
  "iPhone",
  "PayPay",
  "Rakuten",
  "Amazon",
  "Mercari",
  "LINE",
  "QR code",
  "AI",
  "ChatGPT",
  "Gemini",
  "Copilot",
  "deepfake",
  "password",
  "PIN",
  "SMS code",
  "LocalStorage",
  "Module",
  "Lesson",
  "Flashcards",
  "Download"
];

if (!apiKey) {
  console.error("OPENAI_API_KEY is missing. Set it, then run npm run translate:my.");
  process.exit(1);
}

const course = JSON.parse(readFileSync(sourcePath, "utf8")) as Course;
const existing = existsSync(outPath)
  ? (JSON.parse(readFileSync(outPath, "utf8")) as {
      language: "my";
      course?: Partial<Course>;
      modules: ModuleOverride[];
    })
  : {
      language: "my" as const,
      course: {},
      modules: []
    };

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
  return override;
}

async function translateObject<T>(label: string, payload: T): Promise<T> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Translate English learning content into natural Burmese for a 60+ beginner. Preserve Markdown structure, image links, tables, headings, JSON keys, IDs, and technical English terms. Do not over-translate common tech terms. Return only valid JSON."
        },
        {
          role: "user",
          content: JSON.stringify({
            task: label,
            protectedTerms,
            style:
              "Simple Burmese, calm tone, short sentences. Keep protected terms in English unless Burmese is clearly more natural.",
            payload
          })
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const parsed = JSON.parse(data.choices[0]?.message.content ?? "{}");
  return (parsed.payload ?? parsed) as T;
}

existing.course = await translateObject("course title and description", {
  title: course.title,
  description: course.description
});
save();

for (const module of course.modules) {
  const mod = moduleOverride(module.id);
  if (!mod.title || !mod.description) {
    const translated = await translateObject(`module ${module.id}`, {
      title: module.title,
      description: module.description
    });
    mod.title = translated.title;
    mod.description = translated.description;
    save();
  }

  for (const lesson of module.lessons) {
    if (mod.lessons.some((item) => item.id === lesson.id && item.content)) continue;
    console.log(`Translating ${lesson.id} ${lesson.title}`);
    const translated = await translateObject(`lesson ${lesson.id}`, {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      excerpt: lesson.excerpt,
      sections: lesson.sections,
      quizAnswers: lesson.quizAnswers,
      flashcards: lesson.flashcards
    });
    const { id: _translatedId, ...translatedFields } = translated;
    mod.lessons.push({ id: lesson.id, ...translatedFields });
    save();
  }
}

console.log(`Burmese lesson overrides written to ${outPath}`);
