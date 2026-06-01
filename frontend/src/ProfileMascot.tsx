import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

import standingUrl from './assets/mascot-standing.json?url';
import wavingUrl from './assets/mascot-waving-hello.json?url';
import celebratingUrl from './assets/mascot-celebrating.json?url';

type Mood = 'wave' | 'celebrate' | 'idle';

const SOURCES: Record<Mood, string> = {
  wave: wavingUrl,
  celebrate: celebratingUrl,
  idle: standingUrl,
};

type Props = {
  /** Bumps any time the parent wants the mascot to play `celebrate` once. */
  celebrateKey: number;
};

/**
 * Smaller, simpler mascot for the profile flow. On mount it plays a
 * one-shot wave then settles to idle. When `celebrateKey` changes the
 * mascot plays the celebrate animation once, then returns to idle.
 *
 * Compared to the in-app Mascot: no walking, no click handler, no
 * offstage pause, no audio bounce. Just three Lotties controlled by
 * mood state.
 */
export function ProfileMascot({ celebrateKey }: Props) {
  const [mood, setMood] = useState<Mood>('wave');
  const moodRef = useRef<Mood>('wave');
  moodRef.current = mood;
  const dotLottieRef = useRef<DotLottie | null>(null);
  const prevKeyRef = useRef<number>(celebrateKey);

  // Whenever celebrateKey changes (parent signaling a transition), fire
  // a celebrate. Ignore the initial render's value.
  useEffect(() => {
    if (celebrateKey === prevKeyRef.current) return;
    prevKeyRef.current = celebrateKey;
    setMood('celebrate');
  }, [celebrateKey]);

  // Configure the player when mood changes
  useEffect(() => {
    const lottie = dotLottieRef.current;
    if (!lottie) return;
    lottie.setLoop(mood === 'idle');
    lottie.setFrame(0);
    lottie.play();
  }, [mood]);

  const handleComplete = () => {
    if (moodRef.current !== 'idle') setMood('idle');
  };

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto pointer-events-none select-none" aria-hidden="true">
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
