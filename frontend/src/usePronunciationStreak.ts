import { useState } from 'react';

const STORAGE_KEY = 'lf.pronunciationStreak';

/**
 * Pronunciation streak counter. Distinct from the day streak — this one
 * tracks consecutive correct pronunciations (perfect or close verdicts).
 *
 * Rules:
 *   - perfect / close → increment
 *   - wrong / unclear → no change (the user can retry)
 *   - skip            → reset to 0 (the user explicitly gave up)
 *
 * Persists across reloads via localStorage. No time decay — only the
 * user's skip resets the counter.
 */
export function usePronunciationStreak() {
  const [streak, setStreak] = useState<number>(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  });

  const recordCorrect = () => {
    setStreak(prev => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const recordSkip = () => {
    localStorage.setItem(STORAGE_KEY, '0');
    setStreak(0);
  };

  return { streak, recordCorrect, recordSkip };
}
