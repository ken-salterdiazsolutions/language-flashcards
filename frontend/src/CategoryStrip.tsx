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

  // Auto-center active pill on change
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selected]);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative mb-6 sm:mb-8 md:px-12">
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
        className="flex gap-2 overflow-x-auto scroll-smooth snap-x px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              ref={active ? activeRef : undefined}
              onClick={() => onSelect(cat)}
              className={`shrink-0 snap-start rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                active ? 'bg-slate-800 text-white shadow-md' : 'bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              <span className="mr-1">{CATEGORY_EMOJI[cat]}</span>
              {cat === 'all' ? 'All' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
