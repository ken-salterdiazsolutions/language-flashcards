import confetti from 'canvas-confetti';
import cheerUrl from '../assets/cheer.mp3';

/**
 * Pronunciation streak celebration tiers. Increasing intensity at higher
 * milestones (1 < 5,10 < 15,20 < 25,50,100). Returns a tier number 1-4
 * or null when the streak isn't a milestone we celebrate.
 */
export type Tier = 1 | 2 | 3 | 4;

const TIER_MILESTONES: Record<number, Tier> = {
  1: 1,
  5: 2,
  10: 2,
  15: 3,
  20: 3,
  25: 4,
  50: 4,
  100: 4,
};

export function tierForStreak(streak: number): Tier | null {
  return TIER_MILESTONES[streak] ?? null;
}

/**
 * Whether the celebration for this tier should show a modal. Tiers 1 and 2
 * play subtle in-place confetti; tiers 3 and 4 interrupt with a modal.
 */
export function tierHasModal(tier: Tier): boolean {
  return tier >= 3;
}

/**
 * Fire the confetti for a given tier. Tier 1 is a tiny burst from the
 * streak chip area; higher tiers spray from corners or for longer durations.
 */
export function fireConfetti(tier: Tier) {
  if (tier === 1) {
    // Tiny burst from header (where the chip is)
    confetti({
      particleCount: 30,
      spread: 50,
      startVelocity: 25,
      origin: { x: 0.85, y: 0.1 },
      ticks: 80,
    });
    return;
  }

  if (tier === 2) {
    // Burst from both lower corners
    confetti({ particleCount: 80, spread: 60, startVelocity: 35, origin: { x: 0.15, y: 1 }, angle: 60 });
    confetti({ particleCount: 80, spread: 60, startVelocity: 35, origin: { x: 0.85, y: 1 }, angle: 120 });
    return;
  }

  if (tier === 3) {
    // Big two-sided spray
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, startVelocity: 45, origin: { x: 0, y: 0.5 }, angle: 60 });
        confetti({ particleCount: 100, spread: 70, startVelocity: 45, origin: { x: 1, y: 0.5 }, angle: 120 });
      }, i * 250);
    }
    return;
  }

  // Tier 4: continuous confetti for ~3.5s
  const end = Date.now() + 3500;
  const colors = ['#a855f7', '#fbbf24', '#10b981', '#fb7185', '#38bdf8'];
  (function frame() {
    confetti({ particleCount: 6, angle: 60,  spread: 75, origin: { x: 0,   y: 0.7 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 75, origin: { x: 1,   y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/**
 * Play the kid cheer sound. Silent at tier 1 (a single "first one!" cheer
 * feels excessive for the very first correct answer). Caller passes the
 * tier so this stays in one place.
 *
 * Note: browsers block audio.play() unless triggered by a user gesture.
 * Streak milestones DO follow a user gesture (the mic button click → STT
 * response), so this should work; if a browser balks the play() promise
 * rejects silently.
 */
export function playCheer(tier: Tier) {
  if (tier === 1) return;
  try {
    const audio = new Audio(cheerUrl);
    audio.volume = tier === 4 ? 0.7 : 0.5;
    audio.play().catch(() => { /* autoplay blocked */ });
  } catch {
    /* ignore */
  }
}
