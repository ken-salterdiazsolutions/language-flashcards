import { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import celebratingUrl from './assets/mascot-celebrating.json?url';

type Props = {
  streak: number;
  open: boolean;
  onClose: () => void;
};

const MILESTONES = [3, 7, 14, 30, 60, 100];

function nextMilestone(streak: number): number | null {
  return MILESTONES.find(m => m > streak) ?? null;
}

function headline(streak: number): { title: string; body: string } {
  if (streak === 0) {
    return {
      title: 'Ready to start a streak?',
      body: "Flip a card to begin! Come back every day to build your streak and unlock celebrations.",
    };
  }
  if (streak === 1) {
    return {
      title: 'You started a streak!',
      body: "Come back tomorrow and the day after to keep it going!",
    };
  }
  if (streak < 7) {
    return {
      title: `${streak} days in a row!`,
      body: "Awesome! Keep practicing every day to make your streak grow.",
    };
  }
  if (streak < 14) {
    return {
      title: 'A whole week!',
      body: `${streak} days! That's a real habit. The mascot is so proud!`,
    };
  }
  if (streak < 30) {
    return {
      title: 'Two weeks strong!',
      body: `${streak} days! You're a language explorer.`,
    };
  }
  return {
    title: 'Streak champion!',
    body: `${streak} days! That's incredible. Don't break the chain!`,
  };
}

export function StreakModal({ streak, open, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const { title, body } = headline(streak);
  const next = nextMilestone(streak);
  const remaining = next !== null ? next - streak : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close streak details"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg"
        >
          ✕
        </button>

        {/* Mascot celebrating */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-2">
          <DotLottieReact src={celebratingUrl} loop autoplay />
        </div>

        {/* Streak number with fire */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-5xl sm:text-6xl streak-fire-emoji">🔥</span>
          <span className="text-6xl sm:text-7xl font-black text-amber-600">{streak}</span>
        </div>

        <h2 id="streak-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-4 px-2">
          {body}
        </p>

        {next !== null && remaining !== null && (
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold rounded-full px-4 py-2 text-sm sm:text-base mb-5">
            <span>🌟</span>
            <span>
              {remaining === 1 ? '1 more day' : `${remaining} more days`} to reach {next}!
            </span>
          </div>
        )}

        <div>
          <button
            onClick={onClose}
            className="rounded-2xl px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
