# Senior Computer & AI Literacy LMS

An offline-first static LMS for a senior learner. The app uses the final course package and stores all progress in the browser with LocalStorage. There is no login, backend, Supabase, or database server.

## What Is Included

- Vite + React + TypeScript + Tailwind CSS
- Static hash-router pages
- PWA service worker for offline caching
- Full final-edition course parsed into LMS JSON
- 25 modules and 191 lessons
- Real-world course images and screenshot-style visuals
- 1,210 parsed flashcards
- Offline search index
- Bookmarks
- Local progress tracking
- Font size, light/dark, high contrast, simple mode, focus mode
- English/Burmese UI strings in `src/utils/strings.ts`
- Downloads page for clean/visual Markdown, PDF, EPUB, and audit report

## Source Files

The app uses:

```txt
public/course-source/Senior-Computer-AI-Literacy-Course-220K-REAL-WORLD-VISUAL.md
```

Backup source:

```txt
public/course-source/Senior-Computer-AI-Literacy-Course-220K-CLEAN-NO-PHOTO.md
```

Downloads are stored in:

```txt
public/downloads/
```

Real-world visuals are stored in:

```txt
public/images/course/
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL, usually:

```txt
http://127.0.0.1:5173
```

## Easy Launch For Mom

For a simple Windows launch:

1. Double-click `Create Desktop Shortcut.bat` once.
2. Double-click the new `Computer Lessons` shortcut on the Desktop.
3. Keep the small launcher window open while studying.
4. Close the launcher window when finished.

You can also double-click `Computer Lessons.bat` directly.

That one launcher handles setup, build, and opening the browser.

The launcher uses the production static build on:

```txt
http://127.0.0.1:4173
```

## Build

```bash
npm run build
```

The build output is in `dist/`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Use the default Vite settings.
4. Build command: `npm run build`
5. Output directory: `dist`

No environment variables are required.

## Offline Use

The app registers `public/sw.js`. After opening the deployed site once, the app shell and visited assets are cached for later offline use. Learner progress, bookmarks, remembered flashcards, quiz/self-check scores, and preferences are saved in LocalStorage.

For fully local use, run `npm run build` and serve the `dist/` folder with any static server.

## Course Parser

Run:

```bash
npm run parse-course
```

This reads the final visual Markdown and writes:

```txt
src/data/course.json
src/data/modules.json
src/data/search-index.json
```

Parsing limitations:

- Module and lesson headings are parsed from `M01` and `M01-L01` style headings.
- Quiz answer sections are extracted as self-check material. Full multiple-choice question reconstruction is best-effort and not forced.
- Flashcards are extracted from both bold term cards and `Front` / `Back` card formats.
- Images referenced as `assets/...` are rewritten to `/images/course/...`.

## Burmese Lesson Translation

The app supports Burmese lesson overrides while keeping useful technical terms in English.

UI strings live in:

```txt
src/utils/strings.ts
```

Burmese course overrides live in:

```txt
src/data/burmese-overrides.json
```

To translate the full course, set `OPENAI_API_KEY`, then run:

```bash
npm run translate:my
npm run build
```

On Windows, you can set the key without pasting it into chat:

```txt
Set OpenAI API Key.bat
```

Close and reopen your terminal after saving the key.

The script is resumable. If it stops halfway, run it again and it will continue from lessons that are not translated yet.

Translation rule:

- Translate normal explanation text to Burmese.
- Keep useful technical terms in English, such as `Windows`, `browser`, `email`, `AI`, `ChatGPT`, `QR code`, `PayPay`, `LINE`, `password`, and `SMS code`.

## Notes

The JavaScript bundle is large because the complete course and offline search index are embedded for offline use. That is intentional for this MVP.
