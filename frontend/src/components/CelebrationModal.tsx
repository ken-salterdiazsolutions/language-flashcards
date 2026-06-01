import { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import celebratingUrl from '../assets/mascot-celebrating.json?url';
import type { Tier } from '../services/celebration';

type Props = {
  streak: number;
  tier: Tier;
  open: boolean;
  onClose: () => void;
};

function copy(streak: number, tier: Tier): { title: string; body: string } {
  if (tier === 3) {
    return {
      title: `${streak} in a row!`,
      body: 'Your pronunciation is on fire — keep it going!',
    };
  }
  // Tier 4
  if (streak >= 100) return { title: '100!!!', body: "That's incredible. You're a pronunciation champion." };
  if (streak >= 50) return { title: `${streak}!!`, body: 'Half a century! Unbelievable streak.' };
  return { title: `${streak}!!`, body: "You're crushing it — what a streak!" };
}

export function CelebrationModal({ streak, tier, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const { title, body } = copy(streak, tier);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close celebration"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg"
        >
          ✕
        </button>

        <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-2">
          <DotLottieReact src={celebratingUrl} loop autoplay />
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-5xl sm:text-6xl">🎯</span>
          <span className="text-7xl sm:text-8xl font-black text-violet-600">{streak}</span>
        </div>

        <h2 id="celebration-title" className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-5 px-2">{body}</p>

        <button
          onClick={onClose}
          className="rounded-2xl px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
        >
          Keep going!
        </button>
      </div>
    </div>
  );
}
