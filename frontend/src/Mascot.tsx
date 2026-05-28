import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

import standingUrl from './assets/mascot-standing.json?url';
import wavingUrl from './assets/mascot-waving-hello.json?url';
import celebratingUrl from './assets/mascot-celebrating.json?url';
import walkingUrl from './assets/mascot-walking.json?url';

type Mood = 'idle' | 'wave' | 'celebrate' | 'walk';

const SOURCES: Record<Mood, string> = {
  idle: standingUrl,
  wave: wavingUrl,
  celebrate: celebratingUrl,
  walk: walkingUrl,
};

// Higher = wins. Only override the current mood with a strictly higher one.
const PRIORITY: Record<Mood, number> = {
  idle: 0,
  walk: 1,
  wave: 2,
  celebrate: 3,
};

type Props = {
  /** Bumps when card is flipped to back side — triggers wave */
  flipCount: number;
  /** Bumps when prev/next is clicked — triggers walk */
  navCount: number;
  /** Changes when category selection changes — triggers walk */
  categoryKey: string;
  /** True while TTS is playing — adds a bounce on top of current animation */
  isPlaying: boolean;
  /** Current streak value — milestones (3/7/14/30) trigger celebrate */
  streak: number;
};

const MILESTONES = new Set([3, 7, 14, 30]);
const IDLE_WALK_INTERVAL_MS = 20_000;

export function Mascot({ flipCount, navCount, categoryKey, isPlaying, streak }: Props) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const [mood, setMood] = useState<Mood>('idle');
  const moodRef = useRef<Mood>('idle');
  moodRef.current = mood;

  const prevStreakRef = useRef(streak);
  const prevFlipRef = useRef(flipCount);
  const prevNavRef = useRef(navCount);
  const prevCategoryRef = useRef(categoryKey);

  // Switch to a new mood only if it has higher priority than the current one.
  const requestMood = (next: Mood) => {
    if (PRIORITY[next] > PRIORITY[moodRef.current]) {
      setMood(next);
    }
  };

  // Wave on flip
  useEffect(() => {
    if (flipCount === 0) return;
    if (flipCount === prevFlipRef.current) return;
    prevFlipRef.current = flipCount;
    requestMood('wave');
  }, [flipCount]);

  // Celebrate on streak milestone
  useEffect(() => {
    const prev = prevStreakRef.current;
    prevStreakRef.current = streak;
    if (streak > prev && MILESTONES.has(streak)) {
      requestMood('celebrate');
    }
  }, [streak]);

  // Walk on prev/next navigation
  useEffect(() => {
    if (navCount === 0) return;
    if (navCount === prevNavRef.current) return;
    prevNavRef.current = navCount;
    requestMood('walk');
  }, [navCount]);

  // Walk on category change
  useEffect(() => {
    if (categoryKey === prevCategoryRef.current) return;
    prevCategoryRef.current = categoryKey;
    requestMood('walk');
  }, [categoryKey]);

  // Periodic idle walks every IDLE_WALK_INTERVAL_MS, but only if currently idle
  useEffect(() => {
    const id = setInterval(() => {
      if (moodRef.current === 'idle') {
        setMood('walk');
      }
    }, IDLE_WALK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

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
    if (moodRef.current !== 'idle') setMood('idle');
  };

  return (
    <div
      className={`w-full h-full pointer-events-none select-none ${isPlaying ? 'animate-bounce' : ''}`}
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
