import type { Lang } from './data';

export type Verdict = 'perfect' | 'close' | 'wrong' | 'unclear';

export type Judgment = {
  verdict: Verdict;
  similarity: number;        // 0..1
  confidence: number;        // 0..1, from STT
  normalizedTarget: string;
  normalizedTranscript: string;
};

const LATIN_LANGS = new Set<Lang>(['spanish', 'french', 'german']);

/**
 * Score a kid's pronunciation attempt by combining STT confidence with
 * a string-similarity score between the target and what STT transcribed.
 *
 * Tier logic (designed to be forgiving for kids):
 *   - unclear: STT couldn't make it out (empty transcript or very low confidence)
 *   - perfect: similarity ≥ 0.90
 *   - close:   similarity ≥ 0.60
 *   - wrong:   anything below
 *
 * "unclear" is intentionally distinct from "wrong" — a quiet recording
 * shouldn't penalize the streak.
 */
export function judgePronunciation(
  target: string,
  transcript: string,
  confidence: number,
  lang: Lang,
): Judgment {
  const isLatin = LATIN_LANGS.has(lang);
  const normalizedTarget = normalize(target, isLatin);
  const normalizedTranscript = normalize(transcript, isLatin);

  // STT couldn't make out anything — distinct from "got something wrong".
  if (!normalizedTranscript || confidence < 0.4) {
    return {
      verdict: 'unclear',
      similarity: 0,
      confidence,
      normalizedTarget,
      normalizedTranscript,
    };
  }

  const similarity = stringSimilarity(normalizedTarget, normalizedTranscript);

  let verdict: Verdict;
  if (similarity >= 0.9) verdict = 'perfect';
  else if (similarity >= 0.6) verdict = 'close';
  else verdict = 'wrong';

  return { verdict, similarity, confidence, normalizedTarget, normalizedTranscript };
}

/**
 * Lowercase + strip diacritics + strip punctuation for Latin-script langs.
 * For Asian scripts we just strip punctuation/whitespace; case and
 * diacritic-folding are no-ops there anyway.
 */
function normalize(s: string, latin: boolean): string {
  let out = s.trim();
  if (latin) {
    // NFD splits "é" into "e" + combining accent; the range strip removes the marks.
    out = out.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  // Strip punctuation common across scripts (ASCII + Japanese/Chinese forms).
  out = out.replace(/[.,!?;:'"¡¿。、！？「」『』，；：]/g, '');
  // Collapse whitespace
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

/**
 * 1 - (Levenshtein distance / max length). Returns 0..1, where 1 means
 * the strings are identical and 0 means they share no characters.
 */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  const distance = levenshtein(a, b);
  return Math.max(0, 1 - distance / maxLen);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Two rolling rows is enough; saves O(m*n) → O(min(m,n)) memory.
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,        // insertion
        prev[j] + 1,            // deletion
        prev[j - 1] + cost,     // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}
