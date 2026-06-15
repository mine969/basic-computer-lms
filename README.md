# Basic Computer LMS

Basic Computer LMS is a single-file offline educational web app for learning everyday computer skills in a calm, beginner-friendly way.

The course focuses on practical confidence: using a computer, typing, saving files, browsing safely, reading email carefully, protecting passwords, and building a small daily practice routine.

Live site:

```text
https://mine969.github.io/basic-computer-lms/
```

## Course Purpose

This course is designed for first-time or low-confidence computer learners who need clear, repeatable steps instead of complicated technical explanations.

The learning goal is not speed or memorization. The goal is to help learners pause, read the screen, make safe choices, and repeat useful computer actions until they feel familiar.

## Audience

This course is suitable for:

- Beginners learning how to use a computer
- Older learners who prefer calm step-by-step explanations
- Students who need basic digital literacy practice
- Community training, family teaching, or self-study
- Offline classrooms where internet access may be limited

## What Learners Practice

- Identifying basic computer parts
- Starting a computer safely
- Using keyboard keys such as `Enter`, `Backspace`, `Shift`, `Ctrl + S`, `Ctrl + C`, and `Ctrl + V`
- Creating clear file names
- Keeping learning files in folders
- Using a browser and address bar
- Understanding basic website safety with `https://`
- Reading email sender information carefully
- Avoiding suspicious links and attachments
- Keeping passwords private
- Using two-step verification when available
- Building a 10-minute daily computer practice routine

## Course Structure

The app contains four core chapters:

| Chapter | Subject | Focus |
| --- | --- | --- |
| Computer Confidence | Basics | Computer parts, safe starting routine, first note practice |
| Keyboard and Files | Keyboard | Useful keys, shortcuts, file names, folders |
| Browser, Email, and Safety | Internet Safety | Browser basics, email caution, password rules |
| Daily Computer Practice | Practice | 10-minute routine and self-check habits |

## Learning Paths

The course includes eight guided learning paths:

- First Computer Day
- Keyboard Comfort
- Files I Can Find
- Safe Internet Start
- Email Without Panic
- Password Safety
- Daily 10-Minute Practice
- Family Helper Basics

Each path points learners into the same core course content from a different practical goal.

## App Features

- Fully self-contained `index.html`
- Works on GitHub Pages
- Works from `file://` without a server
- No CDN and no external dependencies
- Offline-friendly embedded lesson content
- Four pages: Home, Courses, Quiz, and Reader
- Course cards with progress indicators
- Reader with chapter list, table of contents, notes, bookmarks, and completion tracking
- Global lesson search
- Chapter search and highlighting
- 3-question confidence quiz
- Daily computer tip
- Local progress saved in `localStorage`
- Four visual themes: Terminal Dark, Paper Notes, Learning Lab, and Keyboard Glow
- Reader font controls using stored size index
- Print-friendly reader layout
- Inline service worker and install prompt support

## Offline Design

The app is intentionally built as one file. Lesson markdown is embedded directly inside `index.html` as JSON and parsed lazily only when needed.

This makes the course easy to share, archive, and open without a build step.

## Local Usage

Open this file directly in a browser:

```text
index.html
```

No installation or package manager is required.

## GitHub Pages Deployment

The site deploys only with GitHub Actions to GitHub Pages. It does not use Vercel, Netlify, or any external hosting build service.

The site deploys automatically when changes are pushed to `main`.

GitHub Pages should be configured as:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

Deployment workflow:

```text
.github/workflows/deploy.yml
```

The workflow uploads the repository as a Pages artifact and publishes it with `actions/deploy-pages`.

## Repository Files

```text
index.html                  Single-file offline LMS app
.nojekyll                   Disables Jekyll processing on GitHub Pages
README.md                   Course and project documentation
.github/workflows/deploy.yml GitHub Pages deployment workflow
```

## Technical Notes

- The project has no build system.
- The app stores progress, notes, bookmarks, theme, and font size index locally in the browser.
- Local data stays on the learner's device and is not sent to a server.
- The app uses desktop-first CSS with mobile responsive rules.
- The app is designed to stay small enough for simple static hosting.

## Attribution

Author: Hein Htet Zaw

Content: AI-driven

## Maintainer

Hein Htet Zaw
