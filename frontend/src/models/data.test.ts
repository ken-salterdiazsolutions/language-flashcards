import { describe, it, expect } from 'vitest';
import { flashcards, type Lang } from './data';

const ALL_LANGS: Lang[] = [
  'japanese', 'korean', 'mandarin', 'spanish', 'french',
  'german', 'ukrainian', 'italian', 'hindi',
];

describe('flashcards deck integrity', () => {
  it('contains 189 cards', () => {
    expect(flashcards.length).toBe(189);
  });

  it('uses unique english keys (the stable card ID)', () => {
    const keys = flashcards.map(c => c.english);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has a non-empty translation for all 9 languages on every card', () => {
    // Guards the overlay-merge-at-load contract: a card missing from any
    // overlay (Latin / Ukrainian / Italian / Hindi) would leave a field undefined.
    const gaps: string[] = [];
    for (const card of flashcards) {
      for (const lang of ALL_LANGS) {
        const value = card[lang];
        if (typeof value !== 'string' || value.trim() === '') {
          gaps.push(`${card.english} → ${lang}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('has a non-empty pronunciation/romanization for all 9 languages on every card', () => {
    const gaps: string[] = [];
    for (const card of flashcards) {
      for (const lang of ALL_LANGS) {
        const rom = card.romanization[lang];
        if (typeof rom !== 'string' || rom.trim() === '') {
          gaps.push(`${card.english} → ${lang}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });
});
