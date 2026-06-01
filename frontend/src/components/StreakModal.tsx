import { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import celebratingUrl from '../assets/mascot-celebrating.json?url';
import streakFireUrl from '../assets/streak-fire.json?url';

type Kind = 'day' | 'pronunciation';

type Props = {
  kind: Kind;
  streak: number;
  open: boolean;
  onClose: () => void;
};

const DAY_MILESTONES = [3, 7, 14, 30, 60, 100];
const PRONUNCIATION_MILESTONES = [1, 5, 10, 15, 20, 25, 50, 100];

function nextMilestone(streak: number, kind: Kind): number | null {
  const list = kind === 'day' ? DAY_MILESTONES : PRONUNCIATION_MILESTONES;
  return list.find(m => m > streak) ?? null;
}

function dayHeadline(streak: number): { title: string; body: string } {
  if (streak === 0) {
    return {
      title: 'Ready to start a streak?',
      body: 'Flip a card to begin! Come back every day to build your streak and unlock celebrations.',
    };
  }
  if (streak === 1) {
    return {
      title: 'You started a streak!',
      body: 'Come back tomorrow and the day after to keep it going!',
    };
  }
  if (streak < 7) {
    return {
      title: `${streak} days in a row!`,
      body: 'Awesome! Keep practicing every day to make your streak grow.',
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

function pronunciationHeadline(streak: number): { title: string; body: string } {
  if (streak === 0) {
    return {
      title: 'Try saying it out loud!',
      body: 'Flip a card, tap the mic, and pronounce the word. Each correct one adds to your streak.',
    };
  }
  if (streak === 1) {
    return {
      title: 'First one — nice!',
      body: 'Keep going to build a pronunciation streak.',
    };
  }
  if (streak < 5) {
    return {
      title: `${streak} in a row!`,
      body: "You're warming up. Keep practicing!",
    };
  }
  if (streak < 10) {
    return {
      title: 'High five!',
      body: `${streak} correct pronunciations in a row! You're getting the hang of it.`,
    };
  }
  if (streak < 25) {
    return {
      title: 'Pronunciation pro!',
      body: `${streak} in a row! Your accent is really shaping up.`,
    };
  }
  return {
    title: 'Pronunciation champion!',
    body: `${streak} in a row! That's incredible.`,
  };
}

function teaserText(streak: number, next: number, kind: Kind): string {
  const remaining = next - streak;
  if (kind === 'day') {
    return remaining === 1 ? '1 more day to reach ' + next + '!' : `${remaining} more days to reach ${next}!`;
  }
  return remaining === 1 ? '1 more to reach ' + next + '!' : `${remaining} more to reach ${next}!`;
}

export function StreakModal({ kind, streak, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const { title, body } = kind === 'day' ? dayHeadline(streak) : pronunciationHeadline(streak);
  const next = nextMilestone(streak, kind);
  const labelId = `streak-modal-title-${kind}`;
  const numberColor = kind === 'day' ? 'text-amber-600' : 'text-violet-600';
  const teaserBg = kind === 'day' ? 'bg-amber-100 text-amber-900' : 'bg-violet-100 text-violet-900';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
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

        {/* Mascot celebrating + streak number only shown when streak > 0.
            At zero, the headline copy carries the "let's get started" tone
            and a celebrating mascot + a big 0 feels off. */}
        {streak > 0 && (
          <>
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-2">
              <DotLottieReact src={celebratingUrl} loop autoplay />
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              {kind === 'day' ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20">
                  <DotLottieReact src={streakFireUrl} loop autoplay />
                </div>
              ) : (
                <span className="text-5xl sm:text-6xl">🎯</span>
              )}
              <span className={`text-6xl sm:text-7xl font-black ${numberColor}`}>{streak}</span>
            </div>
          </>
        )}

        <h2 id={labelId} className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-4 px-2">{body}</p>

        {next !== null && (
          <div className={`inline-flex items-center gap-2 ${teaserBg} font-bold rounded-full px-4 py-2 text-sm sm:text-base mb-5`}>
            <span>🌟</span>
            <span>{teaserText(streak, next, kind)}</span>
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
