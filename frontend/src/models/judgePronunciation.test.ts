import { describe, it, expect } from 'vitest';
import { judgePronunciation } from './judgePronunciation';

// confidence comfortably above the 0.4 "unclear" floor unless a test says otherwise
const OK = 0.95;

describe('judgePronunciation — tiers', () => {
  it('identical strings score perfect with similarity 1', () => {
    const j = judgePronunciation('hola', 'hola', OK, 'spanish');
    expect(j.verdict).toBe('perfect');
    expect(j.similarity).toBe(1);
  });

  it('a single-character slip in a short word is close, not wrong', () => {
    // "perro" (5) vs "pero" (4): 1 edit / maxLen 5 = 0.8 similarity → close
    const j = judgePronunciation('perro', 'pero', OK, 'spanish');
    expect(j.verdict).toBe('close');
    expect(j.similarity).toBeCloseTo(0.8, 5);
  });

  it('a wildly different transcript is wrong', () => {
    const j = judgePronunciation('perro', 'gato', OK, 'spanish');
    expect(j.verdict).toBe('wrong');
  });
});

describe('judgePronunciation — tier boundaries', () => {
  it('similarity exactly 0.90 is perfect (inclusive lower bound)', () => {
    // "strawberry" (10) vs "strawberr" (9): 1 edit / 10 = 0.90
    const j = judgePronunciation('strawberry', 'strawberr', OK, 'spanish');
    expect(j.similarity).toBeCloseTo(0.9, 5);
    expect(j.verdict).toBe('perfect');
  });

  it('similarity exactly 0.60 is close (inclusive lower bound)', () => {
    // 5-char strings, 2 edits / 5 = 0.60
    const j = judgePronunciation('abcde', 'abcxy', OK, 'spanish');
    expect(j.similarity).toBeCloseTo(0.6, 5);
    expect(j.verdict).toBe('close');
  });
});

describe('judgePronunciation — unclear is distinct from wrong', () => {
  it('an empty transcript is unclear, not wrong', () => {
    const j = judgePronunciation('hola', '', OK, 'spanish');
    expect(j.verdict).toBe('unclear');
    expect(j.similarity).toBe(0);
  });

  it('low STT confidence is unclear even when the words match perfectly', () => {
    const j = judgePronunciation('hola', 'hola', 0.3, 'spanish');
    expect(j.verdict).toBe('unclear');
  });

  it('confidence exactly 0.40 is not unclear (the < 0.4 floor is exclusive)', () => {
    const j = judgePronunciation('hola', 'hola', 0.4, 'spanish');
    expect(j.verdict).toBe('perfect');
  });
});

describe('judgePronunciation — Latin-script normalization', () => {
  it('folds diacritics for Latin languages', () => {
    expect(judgePronunciation('café', 'cafe', OK, 'french').verdict).toBe('perfect');
  });

  it('is case-insensitive', () => {
    expect(judgePronunciation('HOLA', 'hola', OK, 'spanish').verdict).toBe('perfect');
  });

  it('strips surrounding punctuation', () => {
    const j = judgePronunciation('¡Hola!', 'hola', OK, 'spanish');
    expect(j.normalizedTarget).toBe('hola');
    expect(j.verdict).toBe('perfect');
  });
});

describe('judgePronunciation — non-Latin scripts', () => {
  it('strips CJK punctuation but does not need case/diacritic folding', () => {
    const j = judgePronunciation('こんにちは。', 'こんにちは', OK, 'japanese');
    expect(j.normalizedTarget).toBe('こんにちは');
    expect(j.verdict).toBe('perfect');
  });
});

describe('judgePronunciation — degenerate inputs', () => {
  it('an empty target with a present transcript is wrong with similarity 0', () => {
    const j = judgePronunciation('', 'hola', OK, 'spanish');
    expect(j.similarity).toBe(0);
    expect(j.verdict).toBe('wrong');
  });
});
