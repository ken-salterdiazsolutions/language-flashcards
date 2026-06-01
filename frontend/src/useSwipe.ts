import { useCallback, useRef } from 'react';

/**
 * Returns pointer-event handlers that detect horizontal swipes while still
 * allowing the host element to be tapped/clicked. A swipe is committed
 * when horizontal travel exceeds `threshold` (default 50px) and dominates
 * vertical travel.
 *
 * Because React's prop merging is "last write wins", we can't bundle our
 * own onClick handler into the spread without clobbering the host's. So
 * we expose `wasSwipe()` for the host's onClick to call and short-circuit:
 *
 *   const swipe = useSwipe({ onLeft: nextCard, onRight: prevCard });
 *   <button
 *     {...swipe.handlers}
 *     onClick={() => { if (!swipe.wasSwipe()) flip(); }}
 *   >...</button>
 *
 * `wasSwipe()` clears the flag, so subsequent clicks behave normally.
 */
export function useSwipe(opts: {
  onLeft?: () => void;
  onRight?: () => void;
  threshold?: number;
}) {
  const threshold = opts.threshold ?? 50;
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const swipedRef = useRef(false);

  const reset = () => {
    startX.current = null;
    startY.current = null;
  };

  const wasSwipe = useCallback(() => {
    const was = swipedRef.current;
    swipedRef.current = false;
    return was;
  }, []);

  return {
    wasSwipe,
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        startX.current = e.clientX;
        startY.current = e.clientY;
        swipedRef.current = false;
      },
      onPointerUp: (e: React.PointerEvent) => {
        if (startX.current === null || startY.current === null) return;
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX >= threshold && absX > absY) {
          swipedRef.current = true;
          if (dx < 0) opts.onLeft?.();
          else opts.onRight?.();
        }
        reset();
      },
      onPointerCancel: reset,
    },
  };
}
