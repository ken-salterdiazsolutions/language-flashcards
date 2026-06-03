# Language Flashcards

A kid-facing multilingual flashcard web app. Browse a deck of ~189 words across **9 languages**
(Japanese, Korean, Mandarin, Spanish, French, German, Ukrainian, Italian, Hindi), hear native
pronunciation via Google Text-to-Speech, and practice speaking in a quiz mode scored by Google
Speech-to-Text.

It's a single-page React app deployed to Firebase Hosting, backed by two Cloud Functions that wrap
Google's speech APIs.

## Features

- **Free play** — browse the full deck and tap any card to hear it spoken in the selected language.
- **Levels** — 11 levels of increasing difficulty that span the whole deck.
- **Practice (quiz mode)** — say the word out loud; the app records, transcribes, and scores your
  pronunciation. Scoring is deliberately forgiving for young learners.
- **Profiles** — multiple local profiles, each tracking per-language progress (current level, passed
  levels, and mastered cards). All data lives in `localStorage`; there is no backend account system.
- **Per-language theming** — flag-inspired gradients and colors for each language.

## Tech stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4, Lottie animations.
- **Backend:** Firebase Cloud Functions (Node 24, TypeScript) wrapping Google Cloud
  Text-to-Speech and Speech-to-Text.
- **Hosting/Auth:** Firebase Hosting; anonymous Firebase Auth (required to call the functions).
- Firebase project ID: `language-flashcards-b282d`.

## Repository layout

The repo is split into two independent npm packages — **there is no root `package.json`.**

```
frontend/    Vite + React single-page app
functions/   Firebase Cloud Functions (TTS / STT wrappers)
firebase.json   Hosting + Functions config
.github/        CI and auto-deploy workflows
```

## Getting started

### Prerequisites

- Node.js 24
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)

### Install

`cd` does not persist between scripted commands in this repo's tooling, so the convention is to use
`npm --prefix <dir>`:

```bash
npm --prefix frontend install
npm --prefix functions install
```

### Run the frontend locally

```bash
npm --prefix frontend run dev      # Vite dev server at http://localhost:5173
```

The dev server calls the deployed Cloud Functions. To run the functions locally instead, use the
Firebase emulator:

```bash
npm --prefix functions run serve   # builds, then starts the functions emulator
```

## Common commands

```bash
npm --prefix frontend run dev      # Vite dev server (http://localhost:5173)
npm --prefix frontend run build    # tsc -b && vite build → frontend/dist
npm --prefix frontend run lint     # eslint
npm --prefix frontend run test     # vitest (unit tests for src/models/*)

npm --prefix functions run build   # tsc → functions/lib
npm --prefix functions run test    # vitest
npm --prefix functions run deploy  # firebase deploy --only functions
npm --prefix functions run logs    # tail function logs

firebase deploy --only hosting     # build runs via the predeploy hook in firebase.json
```

## Deployment

- Pushing to `main` **auto-deploys hosting** via GitHub Actions (`.github/workflows/`).
- Cloud Functions are deployed manually with `npm --prefix functions run deploy`.

## How it works

### App structure

`frontend/src/App.tsx` is a hand-rolled state-machine router (no router library) that switches
between `home`, `levels`, `freeplay`, `practice`, and `settings` views. There is no server-side
persistence — all user data lives in `localStorage` under the key `lf.profileStore`, managed by the
`useProfile` hook.

### The deck

`frontend/src/models/data.ts` holds `flashcards`, the single source of truth. Every card is keyed by
its `english` field throughout the app (levels, mastery tracking, and lookups all use English
strings as the stable ID). Translations for Latin-script languages, romanizations, and Japanese kanji
are layered in via overlay-merge loops that run at module load.

### Speech round-trip

- **TTS:** the `synthesizeSpeech` callable returns base64-encoded MP3, using a per-language voice
  (Neural2 where available).
- **STT:** the browser records audio, re-encodes it to 48 kHz mono LINEAR16 WAV, and uploads it to
  the `transcribeSpeech` callable.
- **Scoring:** `judgePronunciation` combines STT confidence with a Levenshtein-based string
  similarity (after normalizing diacritics/punctuation) to return a verdict: `perfect`, `close`,
  `wrong`, or `unclear`.
- **Auth:** both callables require auth; the frontend signs in anonymously on demand.

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture notes and contribution conventions, including
how to add a new word or a new language.
