import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

import standingUrl from './assets/mascot-standing.json?url';
import wavingUrl from './assets/mascot-waving-hello.json?url';
import celebratingUrl from './assets/mascot-celebrating.json?url';

type Mood = 'idle' | 'wave' | 'celebrate';

const SOURCES: Record<Mood, string> = {
  idle: standingUrl,
  wave: wavingUrl,
  celebrate: celebratingUrl,
};

type Props = {
  /** Bumps when card is flipped to back side — triggers wave */
  flipCount: number;
  /** True while TTS is playing — adds a bounce on top of current animation */
  isPlaying: boolean;
  /** Current streak value — milestones (3/7/14/30) trigger celebrate */
  streak: number;
};

const MILESTONES = new Set([3, 7, 14, 30]);

export function Mascot({ flipCount, isPlaying, streak }: Props) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const prevStreakRef = useRef(streak);
  const prevFlipRef = useRef(flipCount);

  // Trigger wave on flip count change (but not on initial mount)
  useEffect(() => {
    if (flipCount === 0) return;
    if (flipCount === prevFlipRef.current) return;
    prevFlipRef.current = flipCount;
    setMood('wave');
  }, [flipCount]);

  // Trigger celebrate when streak hits a milestone
  useEffect(() => {
    const prev = prevStreakRef.current;
    prevStreakRef.current = streak;
    if (streak > prev && MILESTONES.has(streak)) {
      setMood('celebrate');
    }
  }, [streak]);

  // Configure the player when mood changes
  useEffect(() => {
    const lottie = dotLottieRef.current;
    if (!lottie) return;
    lottie.setLoop(mood === 'idle');
    lottie.setFrame(0);
    lottie.play();
  }, [mood]);

  const handleComplete = () => {
    // Non-idle moods play once then return to idle
    if (mood !== 'idle') setMood('idle');
  };

  return (
    <div
      className={`fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-30 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none select-none ${
        isPlaying ? 'animate-bounce' : ''
      }`}
      aria-hidden="true"
    >
      <DotLottieReact
        src={SOURCES[mood]}
        loop={mood === 'idle'}
        autoplay
        dotLottieRefCallback={(instance) => {
          dotLottieRef.current = instance;
          instance?.addEventListener('complete', handleComplete);
        }}
      />
    </div>
  );
}
