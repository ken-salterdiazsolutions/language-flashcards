import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORY_EMOJI } from './data';

type Props = {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
};

export function CategoryStrip({ categories, selected, onSelect }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, []);

  // Auto-center the active pill only when `selected` actually changes
  // (not on initial mount or React StrictMode's double-invoke). Use a ref
  // to track the previously-applied value rather than firstRender flag.
  const lastSelectedRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastSelectedRef.current === null) {
      lastSelectedRef.current = selected;
      return;
    }
    if (lastSelectedRef.current === selected) return;
    lastSelectedRef.current = selected;

    const pill = activeRef.current;
    const scroller = scrollerRef.current;
    if (!pill || !scroller) return;
    const pRect = pill.getBoundingClientRect();
    const sRect = scroller.getBoundingClientRect();
    const buffer = 16;
    const fullyVisible =
      pRect.left >= sRect.left + buffer && pRect.right <= sRect.right - buffer;
    if (!fullyVisible) {
      pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selected]);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative mb-6 sm:mb-8 px-4 md:px-12">
      {/* Left arrow (desktop hover only, shown when scrollable left) */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-200)}
          aria-label="Scroll categories left"
          className="hidden md:[@media(hover:hover)]:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-violet-500/50 backdrop-blur-md shadow-lg ring-1 ring-white/40 text-white hover:bg-violet-500/70"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(200)}
          aria-label="Scroll categories right"
          className="hidden md:[@media(hover:hover)]:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-violet-500/50 backdrop-blur-md shadow-lg ring-1 ring-white/40 text-white hover:bg-violet-500/70"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Spacer so the first pill's glow has room before the scroller's left clip edge */}
        <div className="shrink-0 w-4" aria-hidden="true" />
        {categories.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              ref={active ? activeRef : undefined}
              onClick={() => onSelect(cat)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                active ? 'bg-violet-500 text-white shadow-[0_0_12px_2px_rgba(139,92,246,0.55)]' : 'bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              <span className="mr-1">{CATEGORY_EMOJI[cat]}</span>
              {cat === 'all' ? 'All' : cat}
            </button>
          );
        })}
        {/* Trailing spacer mirrors the leading one */}
        <div className="shrink-0 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}
