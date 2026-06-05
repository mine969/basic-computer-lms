import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Lesson = {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  content: string;
  excerpt: string;
  sections: string[];
  quizAnswers: string[];
  flashcards: { front: string; back: string }[];
};

type Module = {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
};

const root = process.cwd();
const sourcePath = path.join(
  root,
  "public",
  "course-source",
  "Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.md"
);
const outDir = path.join(root, "src", "data");
const publicOutDir = path.join(root, "public", "data");
const source = readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
const lines = source.split("\n");

const moduleHeading = /^# (M\d{2}) (.+)$/;
const lessonHeading = /^# (M\d{2})-L(\d{2}):?\s+(.+)$/;
const excludedModuleHeadings = [
  "Module Review",
  "Module Quiz",
  "Practical Assessment",
  "Module Flashcards",
  "Flashcards",
  "Cheat Sheet"
];

function cleanText(value: string) {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€™/g, "'")
    .replace(/â€“|â€”/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(value: string) {
  return cleanText(
    value
      .replace(/!\[[^\]]*]\([^)]+\)/g, "")
      .replace(/\[[^\]]+]\([^)]+\)/g, "$1")
      .replace(/[#*_`>|-]/g, " ")
  );
}

function lessonExcerpt(content: string) {
  const plain = stripMarkdown(content);
  return plain.slice(0, 180) + (plain.length > 180 ? "..." : "");
}

function extractSections(content: string) {
  return [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => cleanText(match[1]));
}

function extractFlashcards(content: string) {
  const section = content.split(/^## Flashcards\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  const termCards = [...section.matchAll(/^- \*\*(.+?):\*\*\s*(.+)$/gm)].map((match) => ({
    front: cleanText(match[1]),
    back: cleanText(match[2])
  }));
  const frontBackCards = [
    ...section.matchAll(/^- \*\*Front:\*\*\s*(.+?)\n\s+\*\*Back:\*\*\s*(.+)$/gm)
  ].map((match) => ({
    front: cleanText(match[1]),
    back: cleanText(match[2])
  }));
  return [...termCards, ...frontBackCards];
}

function extractQuizAnswers(content: string) {
  const section = content.split(/^## Quiz Answers\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  return [...section.matchAll(/^\d+\.\s+(.+)$/gm)].map((match) => cleanText(match[1]));
}

const moduleImageMap: Record<string, { file: string; caption: string }> = {
  M01: { file: "laptop-home-workspace.jpg", caption: "Real-world photo: laptop on a calm home desk." },
  M02: { file: "windows-desktop-screenshot.jpg", caption: "Screenshot-style visual: Windows desktop and taskbar." },
  M03: { file: "keyboard-close-up.jpg", caption: "Real-world photo: keyboard keys for typing practice." },
  M04: { file: "file-explorer-screenshot.jpg", caption: "Screenshot-style visual: files and folders in File Explorer." },
  M05: { file: "wifi-router.jpg", caption: "Real-world photo: Wi-Fi router used for internet access." },
  M06: { file: "browser-address-screenshot.jpg", caption: "Screenshot-style visual: browser address bar safety." },
  M07: { file: "email-inbox-screenshot.jpg", caption: "Screenshot-style visual: email inbox with safe and risky messages." },
  M08: { file: "laptop-home-workspace.jpg", caption: "Real-world photo: laptop workspace for writing documents." },
  M09: { file: "laptop-home-workspace.jpg", caption: "Real-world photo: computer workspace for spreadsheet practice." },
  M10: { file: "laptop-home-workspace.jpg", caption: "Real-world photo: computer workspace for presentation practice." },
  M11: { file: "data-center.jpg", caption: "Real-world photo: data center equipment representing cloud storage." },
  M12: { file: "multifunction-printer.jpg", caption: "Real-world photo: printer used for documents and copies." },
  M13: { file: "smartphone-camera.jpg", caption: "Real-world photo: smartphone used for daily tasks." },
  M14: { file: "smartphone-camera.jpg", caption: "Real-world photo: smartphone used for communication and photos." },
  M15: { file: "qr-code-safety-screenshot.jpg", caption: "Screenshot-style visual: QR code payment safety reminder." },
  M16: { file: "online-shopping-screenshot.jpg", caption: "Screenshot-style visual: online shopping safety checklist." },
  M17: { file: "scam-sms-screenshot.jpg", caption: "Screenshot-style visual: common scam message warning signs." },
  M18: { file: "bank-login-screenshot.jpg", caption: "Screenshot-style visual: online banking login safety." },
  M19: { file: "ai-prompt-screenshot.jpg", caption: "Screenshot-style visual: simple safe AI prompt example." },
  M20: { file: "ai-prompt-screenshot.jpg", caption: "Screenshot-style visual: asking ChatGPT a clear question." },
  M21: { file: "ai-prompt-screenshot.jpg", caption: "Screenshot-style visual: asking AI for simple step-by-step help." },
  M22: { file: "ai-prompt-screenshot.jpg", caption: "Screenshot-style visual: using an AI assistant safely." },
  M23: { file: "scam-sms-screenshot.jpg", caption: "Screenshot-style visual: misinformation and scam warning signs." },
  M24: { file: "data-center.jpg", caption: "Real-world photo: cloud and future technology data center." },
  M25: { file: "laptop-home-workspace.jpg", caption: "Real-world photo: calm home learning workspace." }
};

function chooseLessonImage(moduleId: string, title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("keyboard") || lower.includes("typing")) {
    return { file: "keyboard-close-up.jpg", caption: "Real-world photo: keyboard keys used for typing." };
  }
  if (lower.includes("mouse") || lower.includes("click")) {
    return { file: "computer-mice.jpg", caption: "Real-world photo: computer mice used for clicking practice." };
  }
  if (lower.includes("usb") || lower.includes("storage")) {
    return { file: "usb-flash-drive.jpg", caption: "Real-world photo: USB flash drive for portable storage." };
  }
  if (lower.includes("printer") || lower.includes("print")) {
    return { file: "multifunction-printer.jpg", caption: "Real-world photo: printer used for documents." };
  }
  if (lower.includes("scanner") || lower.includes("scan")) {
    return { file: "flatbed-scanner.jpg", caption: "Real-world photo: flatbed scanner used for paper documents." };
  }
  if (lower.includes("browser") || lower.includes("website") || lower.includes("address")) {
    return { file: "browser-address-screenshot.jpg", caption: "Screenshot-style visual: browser address bar safety." };
  }
  if (lower.includes("email") || lower.includes("gmail") || lower.includes("outlook")) {
    return { file: "email-inbox-screenshot.jpg", caption: "Screenshot-style visual: email inbox and message safety." };
  }
  if (lower.includes("wi-fi") || lower.includes("internet")) {
    return { file: "wifi-router.jpg", caption: "Real-world photo: Wi-Fi router for internet connection." };
  }
  if (lower.includes("bank")) {
    return { file: "bank-login-screenshot.jpg", caption: "Screenshot-style visual: online banking login safety." };
  }
  if (lower.includes("pay") || lower.includes("qr") || lower.includes("money")) {
    return { file: "qr-code-safety-screenshot.jpg", caption: "Screenshot-style visual: QR code payment safety reminder." };
  }
  if (lower.includes("shopping") || lower.includes("rakuten") || lower.includes("amazon")) {
    return { file: "online-shopping-screenshot.jpg", caption: "Screenshot-style visual: online shopping safety checklist." };
  }
  if (lower.includes("scam") || lower.includes("security") || lower.includes("password")) {
    return { file: "scam-sms-screenshot.jpg", caption: "Screenshot-style visual: scam warning signs to check slowly." };
  }
  if (lower.includes("phone") || lower.includes("android") || lower.includes("iphone")) {
    return { file: "smartphone-camera.jpg", caption: "Real-world photo: smartphone used for daily learning." };
  }
  if (lower.includes("ai") || lower.includes("chatgpt") || lower.includes("gemini") || lower.includes("copilot")) {
    return { file: "ai-prompt-screenshot.jpg", caption: "Screenshot-style visual: safe AI prompt example." };
  }
  return moduleImageMap[moduleId] ?? moduleImageMap.M01;
}

function ensureLessonImage(content: string, moduleId: string, title: string) {
  if (/!\[[^\]]*]\([^)]+\)/.test(content)) return content;
  const image = chooseLessonImage(moduleId, title);
  const figure = `![${image.caption}](/images/course/${image.file})\n\n*Figure: ${image.caption}*\n\n`;
  return content.replace(/^# .+\n/, (heading) => `${heading}\n${figure}`);
}

const modules = new Map<string, Module>();
let currentModule: Module | null = null;
let currentLessonMeta: { id: string; moduleId: string; number: number; title: string } | null =
  null;
let currentLessonLines: string[] = [];

function finishLesson() {
  if (!currentModule || !currentLessonMeta) return;
  if (currentModule.lessons.some((lesson) => lesson.id === currentLessonMeta?.id)) {
    currentLessonMeta = null;
    currentLessonLines = [];
    return;
  }
  const content = ensureLessonImage(
    cleanTextBlocks(currentLessonLines.join("\n").trim()),
    currentLessonMeta.moduleId,
    currentLessonMeta.title
  );
  currentModule.lessons.push({
    ...currentLessonMeta,
    content,
    excerpt: lessonExcerpt(content),
    sections: extractSections(content),
    quizAnswers: extractQuizAnswers(content),
    flashcards: extractFlashcards(content)
  });
  currentLessonMeta = null;
  currentLessonLines = [];
}

function cleanTextBlocks(value: string) {
  return value
    .replace(/â€œ|â€/g, '"')
    .replace(/â€™/g, "'")
    .replace(/â€“|â€”/g, "-")
    .replace(/\]\(assets\//g, "](/images/course/")
    .replace(/(\d+\.\s+[^.\n]+?\.)\s+(?=\d+\.)/g, "$1\n")
    .replace(/(- [^-.\n]+?\.)\s+(?=- )/g, "$1\n");
}

for (const line of lines) {
  const lessonMatch = lessonHeading.exec(line);
  if (lessonMatch) {
    finishLesson();
    const moduleId = lessonMatch[1];
    currentModule = modules.get(moduleId) ?? currentModule;
    currentLessonMeta = {
      id: `${moduleId}-L${lessonMatch[2]}`,
      moduleId,
      number: Number(lessonMatch[2]),
      title: cleanText(lessonMatch[3])
    };
    currentLessonLines = [`# ${cleanText(lessonMatch[3])}`];
    continue;
  }

  const moduleMatch = moduleHeading.exec(line);
  if (moduleMatch && !line.includes("-L")) {
    const title = cleanText(moduleMatch[2]);
    if (!excludedModuleHeadings.some((excluded) => title.includes(excluded))) {
      finishLesson();
      if (!modules.has(moduleMatch[1])) {
        modules.set(moduleMatch[1], {
          id: moduleMatch[1],
          number: Number(moduleMatch[1].slice(1)),
          title,
          description: `${title} lessons for calm, practical computer learning.`,
          lessons: []
        });
      }
      currentModule = modules.get(moduleMatch[1]) ?? null;
      continue;
    }
  }

  if (currentLessonMeta) currentLessonLines.push(line);
}
finishLesson();

const courseModules = [...modules.values()]
  .filter((module) => module.lessons.length > 0)
  .sort((a, b) => a.number - b.number);

const course = {
  title: "Senior Computer & AI Literacy Course",
  description:
    "A calm offline course for learning computers, internet safety, smartphones, and everyday AI.",
  source: "Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.md",
  generatedAt: new Date().toISOString(),
  parsingLimitations: [
    "Quiz questions are displayed from lesson content; answer-only sections are extracted where available.",
    "Flashcards are extracted from bullet lines formatted as bold term plus explanation.",
    "Visual suggestions are shown as placeholder visual cards unless an image file is present."
  ],
  modules: courseModules
};

const modulesSummary = courseModules.map((module) => ({
  id: module.id,
  number: module.number,
  title: module.title,
  description: module.description,
  lessonCount: module.lessons.length,
  firstLessonId: module.lessons[0]?.id
}));

const searchIndex = courseModules.flatMap((module) =>
  module.lessons.map((lesson) => ({
    moduleId: module.id,
    moduleTitle: module.title,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    text: stripMarkdown(`${module.title} ${lesson.title} ${lesson.content}`)
  }))
);

mkdirSync(outDir, { recursive: true });
mkdirSync(publicOutDir, { recursive: true });
writeFileSync(path.join(outDir, "course.json"), JSON.stringify(course, null, 2), "utf8");
writeFileSync(
  path.join(publicOutDir, "course.json"),
  JSON.stringify(course, null, 2),
  "utf8"
);
writeFileSync(
  path.join(outDir, "modules.json"),
  JSON.stringify(modulesSummary, null, 2),
  "utf8"
);
writeFileSync(
  path.join(publicOutDir, "modules.json"),
  JSON.stringify(modulesSummary, null, 2),
  "utf8"
);
writeFileSync(
  path.join(outDir, "search-index.json"),
  JSON.stringify(searchIndex, null, 2),
  "utf8"
);
writeFileSync(
  path.join(publicOutDir, "search-index.json"),
  JSON.stringify(searchIndex, null, 2),
  "utf8"
);

console.log(
  `Parsed ${courseModules.length} modules and ${courseModules.reduce(
    (total, module) => total + module.lessons.length,
    0
  )} lessons.`
);
