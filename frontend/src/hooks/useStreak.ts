import { useEffect, useState } from 'react';

const LAST_VISIT_KEY = 'lf.lastVisit';
const STREAK_KEY = 'lf.streak';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useStreak() {
  const [streak, setStreak] = useState<number>(() => {
    const s = Number(localStorage.getItem(STREAK_KEY));
    return Number.isFinite(s) && s > 0 ? s : 0;
  });

  const recordVisit = () => {
    const today = todayISO();
    const last = localStorage.getItem(LAST_VISIT_KEY);
    if (last === today) return;
    const next = last === yesterdayISO() ? (Number(localStorage.getItem(STREAK_KEY)) || 0) + 1 : 1;
    localStorage.setItem(LAST_VISIT_KEY, today);
    localStorage.setItem(STREAK_KEY, String(next));
    setStreak(next);
  };

  useEffect(() => {
    const last = localStorage.getItem(LAST_VISIT_KEY);
    const today = todayISO();
    if (last && last !== today && last !== yesterdayISO()) {
      localStorage.removeItem(STREAK_KEY);
      setStreak(0);
    }
  }, []);

  return { streak, recordVisit };
}
