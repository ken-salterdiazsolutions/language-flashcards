# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A kid-facing multilingual flashcard web app. Browse a deck of ~189 words across 9 languages
(Japanese, Korean, Mandarin, Spanish, French, German, Ukrainian, Italian, Hindi), hear native
pronunciation via Google TTS, and practice speaking in a quiz mode scored by Google STT. Single-page
React app deployed to Firebase Hosting; two Cloud Functions wrap Google's speech APIs.

## Commands

The repo is split into two npm packages — there is no root `package.json`. Always target a subdirectory.
`cd` does not persist between Bash calls here, so use `npm --prefix <dir>`:

```bash
npm --prefix frontend run dev      # Vite dev server (frontend at :5173)
npm --prefix frontend run build    # tsc -b && vite build → frontend/dist
npm --prefix frontend run lint     # eslint
npm --prefix functions run build   # tsc → functions/lib
npm --prefix functions run deploy  # firebase deploy --only functions
firebase deploy --only hosting     # build runs via predeploy hook in firebase.json
```

There is no test runner configured. Firebase project ID is `language-flashcards-b282d`.
Pushing to `main` auto-deploys hosting via GitHub Actions (`.github/workflows/`).

## Architecture

### Routing & state (frontend/src/App.tsx)
App is a hand-rolled state-machine router (no router library): a `Route` union switches between
`home`, `levels`, `freeplay`, `practice`, and `settings`. There is no backend persistence — all
user data lives in `localStorage` under key `lf.profileStore`, managed entirely by the `useProfile`
hook (`hooks/useProfile.ts`). If there's no active profile, `ProfilePicker` takes over the whole screen.

Profiles (`models/profile.ts`) hold per-language progress in `progress: Record<Lang, LangProgress>`.
`LangProgress` tracks `level`, `passedLevels[]`, and `cardsMastered[]` (English keys). Switching the
active language lazily creates a progress slot via `ensureLangProgress`. Mutations go through
`updateActive`, which is immutable-update + persist on every change.

### The deck (frontend/src/models/data.ts)
`flashcards: Flashcard[]` is the single source of truth, keyed throughout the app by the `english`
field (it's the stable ID — levels, mastery, and lookups all use English strings). The file is large
because translations are layered in via **overlay merge loops that run at module load**: the base array
has Japanese/Korean/Mandarin inline, then several `for (const card of flashcards)` loops at the bottom
splice in Latin-script translations, romanizations, and the Japanese kanji overlay (`KANJI_OVERLAY`).
This is why `spanish?`, `french?`, etc. are optional in the type but present at runtime. When adding a
word you must update both the base entry and the relevant overlay blocks, all keyed by `english`.

### Levels & quiz selection (frontend/src/models/levels.ts)
`LEVELS` maps level number → list of English keys (11 levels, summing to the full deck). `getLevelCards`
resolves keys to cards. `getQuizPool` builds a shuffled practice set that is 80% current-level / 20%
review from earlier passed levels.

### Pronunciation scoring (frontend/src/models/judgePronunciation.ts)
Pure function. Combines STT confidence with a Levenshtein-based string similarity between the target
word and the transcript, after normalizing (diacritic/punctuation stripping). Returns a `Verdict`:
`perfect` (≥0.90), `close` (≥0.60), `wrong`, or `unclear` (empty/low-confidence — deliberately distinct
from `wrong` so a quiet recording doesn't penalize the kid). Tuned to be forgiving.

### Quiz flow (frontend/src/components/QuizSession.tsx)
A phase machine (`prompt → recording → judging → verdict`). Wrong answers get spliced back into the
queue for retry. A level auto-passes once **80% of its cards are mastered** (`Math.ceil(len*0.8)`),
fired once via a ref guard. Mastery is stored per-language, not per-level, so the component intersects
`mastered` with the level's keys.

### Speech round-trip
- **TTS**: `synthesizeSpeech` callable returns base64 MP3. Voice per language in `VOICE_BY_LANG`
  (Neural2 where available; Mandarin uses Wavenet, Ukrainian falls back to Standard).
- **STT**: the browser records audio, then `services/audioConvert.ts` (`resampleToWav48k`) decodes and
  re-encodes to **48kHz mono LINEAR16 WAV** before upload — Google STT rejects the browser's default
  44.1kHz Opus. The `transcribeSpeech` callable also accepts webm/ogg/mp4 via `pickEncoding`.
- **Auth**: both functions require auth. The frontend signs in **anonymously** on demand via
  `ensureSignedIn()` (`services/firebase.ts`) — call it before any callable.
- **Note**: TTS↔STT BCP-47 codes differ for Mandarin (TTS `cmn-CN`, STT `zh-CN`). Both maps live in
  `functions/src/index.ts`. The `Lang` union is defined once on the frontend (`models/data.ts`) and
  re-declared in `functions/src/index.ts` — the two packages deploy independently and can't share a
  module, so when you add a language you must update both copies (plus `VOICE_BY_LANG` and `STT_LANG_CODE`).
  This duplication is **intentional**: a shared workspace package was considered and rejected as overly
  complicated for a 9-string union. Don't re-propose cross-package sharing unless this decision is revisited.

### Theming (frontend/src/models/langTheme.ts)
`LANG_THEME` maps each language to Tailwind class strings (flag-inspired gradients, button shadows, glow).
Reused by the picker and quiz. Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`).

## Conventions
- Two-space indent, TypeScript throughout, React 19 function components + hooks. No class components.
- Cards are always referenced by their `english` string, never by array index across persisted state.
- Lottie animations (`assets/*.json`) are imported as URLs (`?url`) and rendered with `DotLottieReact`.
