import { describe, it, expect } from 'vitest';
import { LEVELS, MAX_LEVEL, getLevelCards, getQuizPool } from './levels';
import { flashcards } from './data';

const levelNumbers = Object.keys(LEVELS).map(Number);

describe('LEVELS structure', () => {
  it('MAX_LEVEL is the highest defined level (11)', () => {
    expect(MAX_LEVEL).toBe(11);
    expect(MAX_LEVEL).toBe(Math.max(...levelNumbers));
  });

  it('every key in every level resolves to a real flashcard', () => {
    const known = new Set(flashcards.map(c => c.english));
    const missing: string[] = [];
    for (const keys of Object.values(LEVELS)) {
      for (const k of keys) if (!known.has(k)) missing.push(k);
    }
    expect(missing).toEqual([]);
  });

  it('the levels partition the deck exactly — no orphans, no duplicates', () => {
    const allLevelKeys = Object.values(LEVELS).flat();
    // no duplicate keys across levels
    expect(new Set(allLevelKeys).size).toBe(allLevelKeys.length);
    // union of level keys === full set of deck english keys
    const levelSet = new Set(allLevelKeys);
    const deckSet = new Set(flashcards.map(c => c.english));
    expect(levelSet).toEqual(deckSet);
  });
});

describe('getLevelCards', () => {
  it('returns one card per key, in order', () => {
    const cards = getLevelCards(1);
    expect(cards.map(c => c.english)).toEqual(LEVELS[1]);
  });

  it('returns an empty array for an unknown level', () => {
    expect(getLevelCards(999)).toEqual([]);
  });
});

describe('getQuizPool', () => {
  it('never returns more than quizSize cards', () => {
    const pool = getQuizPool({ level: 1, passedLevels: [], quizSize: 10 });
    expect(pool.length).toBeLessThanOrEqual(10);
    expect(pool.length).toBe(10); // level 1 has 14 cards, so it fills
  });

  it('with no passed levels, draws only from the current level', () => {
    const pool = getQuizPool({ level: 3, passedLevels: [], quizSize: 10 });
    const level3 = new Set(LEVELS[3]);
    expect(pool.every(c => level3.has(c.english))).toBe(true);
  });

  it('mixes ~20% review from passed levels while keeping current-level cards', () => {
    const pool = getQuizPool({ level: 3, passedLevels: [1, 2], quizSize: 10 });
    expect(pool.length).toBe(10);

    const level3 = new Set(LEVELS[3]);
    const reviewKeys = new Set([...LEVELS[1], ...LEVELS[2]]);

    const fromCurrent = pool.filter(c => level3.has(c.english)).length;
    const fromReview = pool.filter(c => reviewKeys.has(c.english)).length;

    // reviewCount = min(floor(10 * 0.2), 9) = 2; newCount = 8
    expect(fromReview).toBe(2);
    expect(fromCurrent).toBe(8);
    expect(fromCurrent).toBeGreaterThanOrEqual(1); // the quizSize-1 clamp guarantee
  });

  it('returns an empty pool when the current level has no cards', () => {
    expect(getQuizPool({ level: 999, passedLevels: [1, 2], quizSize: 10 })).toEqual([]);
  });
});
