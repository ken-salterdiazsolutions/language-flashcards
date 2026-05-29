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
  /** True while TTS is playing — adds a subtle head-bob */
  isPlaying: boolean;
  /** Current streak value — milestones (3/7/14/30) trigger celebrate */
  streak: number;
};

const MILESTONES = new Set([3, 7, 14, 30]);
const IDLE_WALK_INTERVAL_MS = 20_000;
const WALK_SPEED_PX_PER_SEC = 55; // relaxed stroll; ~12 seconds to cross a 660px card
const WALK_DURATION_MS = 4_500;     // each walk burst lasts this long, then settles to idle

export function Mascot({ flipCount, navCount, categoryKey, isPlaying, streak }: Props) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Start walking immediately on mount so the mascot walks in from the left.
  const [mood, setMood] = useState<Mood>('walk');
  const moodRef = useRef<Mood>('walk');
  moodRef.current = mood;

  // Horizontal position, in pixels from the left edge of the parent.
  // Starts off-screen to the left so the entry walk reads as "walking in."
  const xRef = useRef<number>(-200);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const prevStreakRef = useRef(streak);
  const prevFlipRef = useRef(flipCount);
  const prevNavRef = useRef(navCount);
  const prevCategoryRef = useRef(categoryKey);

  const requestMood = (next: Mood) => {
    if (PRIORITY[next] > PRIORITY[moodRef.current]) setMood(next);
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
    if (streak > prev && MILESTONES.has(streak)) requestMood('celebrate');
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

  // Periodic idle walks
  useEffect(() => {
    const id = setInterval(() => {
      if (moodRef.current === 'idle') setMood('walk');
    }, IDLE_WALK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Configure the Lottie player when mood changes
  useEffect(() => {
    const lottie = dotLottieRef.current;
    if (!lottie) return;
    lottie.setLoop(mood === 'walk' || mood === 'idle');
    lottie.setFrame(0);
    lottie.play();
  }, [mood]);

  // Drive horizontal position with rAF while walking; stop after WALK_DURATION_MS.
  useEffect(() => {
    if (mood !== 'walk') {
      lastTickRef.current = null;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const startedAt = performance.now();

    const step = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (container && wrapper) {
        const containerW = container.clientWidth;
        const mascotW = wrapper.offsetWidth;
        xRef.current += WALK_SPEED_PX_PER_SEC * dt;
        if (xRef.current > containerW) xRef.current = -mascotW;
        wrapper.style.left = `${xRef.current}px`;
      }

      // Once the walk duration has elapsed, only settle if the mascot is fully
      // inside the container (no edge clipping). Otherwise keep walking.
      if (now - startedAt >= WALK_DURATION_MS && container && wrapper) {
        const containerW = container.clientWidth;
        const mascotW = wrapper.offsetWidth;
        const fullyVisible = xRef.current >= 0 && xRef.current + mascotW <= containerW;
        if (fullyVisible) {
          setMood('idle');
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
    };
  }, [mood]);

  // Wave and celebrate are one-shot Lotties; when they finish, return to idle.
  // Walk doesn't use this — its lifecycle is driven by the rAF duration cap.
  const handleComplete = () => {
    const current = moodRef.current;
    if (current === 'wave' || current === 'celebrate') setMood('idle');
  };

  return (
    // containerRef gives us the parent width for the walk wrap logic.
    // The wrapper is absolutely positioned at the bottom of the card,
    // and we drive `left` imperatively via the rAF loop above.
    <div ref={containerRef} className="absolute inset-x-0 -bottom-8 sm:-bottom-12 h-32 sm:h-40 pointer-events-none z-10 overflow-x-clip">
      <div
        ref={wrapperRef}
        onClick={() => requestMood('wave')}
        className={`absolute top-0 w-32 h-32 sm:w-40 sm:h-40 pointer-events-auto cursor-pointer active:scale-95 transition-transform ${isPlaying ? 'animate-mascot-talk' : ''}`}
        style={{ left: `${xRef.current}px` }}
        role="button"
        aria-label="Wave at the mascot"
      >
        <DotLottieReact
          src={SOURCES[mood]}
          loop={mood === 'walk' || mood === 'idle'}
          autoplay
          dotLottieRefCallback={(instance) => {
            dotLottieRef.current = instance;
            instance?.addEventListener('complete', handleComplete);
          }}
        />
      </div>
    </div>
  );
}
