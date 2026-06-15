# Basic Computer LMS

Simple static computer-learning site maintained by Hein Htet Zaw.

## Files

This repository is intentionally minimal:

- `index.html` - deployed static page
- `README.md` - project notes
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow

## Deployment

The site deploys automatically to GitHub Pages when changes are pushed to `main`.

Public URL:

```text
https://mine969.github.io/basic-computer-lms/
```

## Maintainer

Hein Htet Zaw

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
