import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import { ensureSignedIn, synthesizeSpeech } from './firebase';
import { flashcards, categories, CATEGORY_EMOJI, type Lang } from './data';
import { useStreak } from './useStreak';
import { CategoryStrip } from './CategoryStrip';
import { Mascot } from './Mascot';

type LangTheme = {
  label: string;
  short: string;
  stripe: string;
  chip: string;
  chipText: string;
  ring: string;
  buttonBg: string;
  buttonShadow: string;
  /** Tailwind arbitrary box-shadow for the active language pill's glow effect */
  glow: string;
};

const LANG_THEME: Record<Lang, LangTheme> = {
  japanese: {
    label: 'Japanese',
    short: '日本語',
    stripe: 'bg-rose-400',
    chip: 'bg-rose-100',
    chipText: 'text-rose-700',
    ring: 'ring-rose-300',
    buttonBg: 'bg-rose-500 hover:bg-rose-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(159_18_57)]',
    glow: 'shadow-[0_0_12px_2px_rgba(251,113,133,0.55)]',
  },
  korean: {
    label: 'Korean',
    short: '한국어',
    stripe: 'bg-sky-400',
    chip: 'bg-sky-100',
    chipText: 'text-sky-700',
    ring: 'ring-sky-300',
    buttonBg: 'bg-sky-500 hover:bg-sky-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(7_89_133)]',
    glow: 'shadow-[0_0_12px_2px_rgba(56,189,248,0.55)]',
  },
  mandarin: {
    label: 'Mandarin',
    short: '中文',
    stripe: 'bg-amber-400',
    chip: 'bg-amber-100',
    chipText: 'text-amber-800',
    ring: 'ring-amber-300',
    buttonBg: 'bg-amber-500 hover:bg-amber-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(146_64_14)]',
    glow: 'shadow-[0_0_12px_2px_rgba(251,191,36,0.55)]',
  },
  spanish: {
    label: 'Spanish',
    short: 'Español',
    stripe: 'bg-fuchsia-400',
    chip: 'bg-fuchsia-100',
    chipText: 'text-fuchsia-700',
    ring: 'ring-fuchsia-300',
    buttonBg: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(162_28_175)]',
    glow: 'shadow-[0_0_12px_2px_rgba(232,121,249,0.55)]',
  },
  french: {
    label: 'French',
    short: 'Français',
    stripe: 'bg-indigo-400',
    chip: 'bg-indigo-100',
    chipText: 'text-indigo-700',
    ring: 'ring-indigo-300',
    buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(55_48_163)]',
    glow: 'shadow-[0_0_12px_2px_rgba(129,140,248,0.55)]',
  },
  german: {
    label: 'German',
    short: 'Deutsch',
    stripe: 'bg-emerald-400',
    chip: 'bg-emerald-100',
    chipText: 'text-emerald-700',
    ring: 'ring-emerald-300',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(6_95_70)]',
    glow: 'shadow-[0_0_12px_2px_rgba(52,211,153,0.55)]',
  },
};

const MultilingualFlashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>('japanese');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKanji, setShowKanji] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [navCount, setNavCount] = useState(0);
  const { streak, recordVisit } = useStreak();

  // Language strip scroll state — mirrors CategoryStrip's behavior so the
  // language picker can show prev/next chevron arrows on desktop.
  const langScrollerRef = useRef<HTMLDivElement>(null);
  const [langCanScrollLeft, setLangCanScrollLeft] = useState(false);
  const [langCanScrollRight, setLangCanScrollRight] = useState(false);
  useEffect(() => {
    const el = langScrollerRef.current;
    if (!el) return;
    const update = () => {
      setLangCanScrollLeft(el.scrollLeft > 4);
      setLangCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);
  const scrollLangBy = (delta: number) => {
    langScrollerRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Match the card flip animation duration. If the user changes language or
  // category while the card is flipped to the back, flip it back to the
  // English side first so they don't get a sneak peek at the new answer.
  const FLIP_DURATION_MS = 700;
  const afterFlipBack = (fn: () => void) => {
    if (showAnswer) {
      resetCardState();
      setTimeout(fn, FLIP_DURATION_MS);
    } else {
      fn();
    }
  };

  const filtered = selectedCategory === 'all' ? flashcards : flashcards.filter(c => c.cat === selectedCategory);
  const card = filtered[currentCard] || filtered[0];
  const theme = LANG_THEME[selectedLanguage];

  const resetCardState = () => {
    setShowAnswer(false);
    setShowBreakdown(false);
    setShowKanji(false);
  };

  const canShowKanji = selectedLanguage === 'japanese' && !!card.kanji;
  const displayWord = canShowKanji && showKanji && card.kanji ? card.kanji : (card[selectedLanguage] ?? '');
  const displayRomanization = card.romanization[selectedLanguage] ?? '';
  // breakdown is only populated for Asian-script languages (jp/ko/zh). Latin-
  // script langs don't have meaningful per-character breakdowns.
  const breakdownForLang = canShowKanji && showKanji && card.kanjiBreakdown ? card.kanjiBreakdown : card.breakdown[selectedLanguage];
  const canShowBreakdown = !!breakdownForLang;

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filtered.length);
    setNavCount(c => c + 1);
    resetCardState();
  };
  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + filtered.length) % filtered.length);
    setNavCount(c => c + 1);
    resetCardState();
  };
  const flipCard = () => {
    if (!showAnswer) {
      recordVisit();
      setRevealCount(c => c + 1);
    }
    setShowAnswer(!showAnswer);
    setShowBreakdown(false);
  };

  const playSound = async (text: string, lang: Lang) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await ensureSignedIn();
      const { data } = await synthesizeSpeech({ text, lang });
      const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', () => setIsPlaying(false));
      await audio.play();
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-violet-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Flashcards
            </h1>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-200 text-amber-900 font-bold rounded-full px-3 py-1.5 text-sm sm:text-base shadow-sm">
              <span className="text-base sm:text-lg">🔥</span>
              <span>{streak}</span>
              <span className="hidden sm:inline text-amber-800/80 font-semibold">day streak</span>
            </div>
          )}
        </header>

        {/* Language picker — scrollable strip */}
        <div className="relative mb-4 sm:mb-6 px-4 md:px-12">
          {langCanScrollLeft && (
            <button
              onClick={() => scrollLangBy(-200)}
              aria-label="Scroll languages left"
              className="hidden md:[@media(hover:hover)]:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-violet-500/50 backdrop-blur-md shadow-lg ring-1 ring-white/40 text-white hover:bg-violet-500/70"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {langCanScrollRight && (
            <button
              onClick={() => scrollLangBy(200)}
              aria-label="Scroll languages right"
              className="hidden md:[@media(hover:hover)]:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-violet-500/50 backdrop-blur-md shadow-lg ring-1 ring-white/40 text-white hover:bg-violet-500/70"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          <div
            ref={langScrollerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="shrink-0 w-4" aria-hidden="true" />
            {(Object.keys(LANG_THEME) as Lang[]).map((lang) => {
              const t = LANG_THEME[lang];
              const active = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => afterFlipBack(() => setSelectedLanguage(lang))}
                  className={`shrink-0 rounded-2xl px-4 py-3 font-bold transition-all min-w-[100px] sm:min-w-[120px] ${
                    active
                      ? `bg-white text-slate-800 ${t.glow}`
                      : 'bg-white/60 text-slate-500 hover:bg-white/80'
                  }`}
                >
                  <div className="text-sm sm:text-base">{t.label}</div>
                  <div className={`text-base sm:text-lg ${active ? t.chipText : ''}`}>{t.short}</div>
                </button>
              );
            })}
            <div className="shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Category strip — horizontal scroll with auto-centered active pill */}
        <CategoryStrip
          categories={categories}
          selected={selectedCategory}
          onSelect={(cat) => afterFlipBack(() => { setSelectedCategory(cat); setCurrentCard(0); })}
        />

        {/* The card — full 3D flip */}
        <div className="relative mb-6" style={{ perspective: '1600px' }}>
          <button
            onClick={flipCard}
            className="group relative w-full text-left"
            style={{ aspectRatio: '4 / 3', minHeight: '320px' }}
            aria-label={showAnswer ? 'Flip card back to English' : 'Flip card to reveal translation'}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center px-8 py-8 sm:py-12"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-3 ${theme.stripe}`} />
                <div className="text-center space-y-3">
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${theme.chip} ${theme.chipText}`}>
                    <span>{CATEGORY_EMOJI[card.cat]}</span>
                    {card.cat}
                  </div>
                  <div className="text-4xl sm:text-6xl font-black text-slate-800 wrap-break-word leading-tight">
                    {card.english}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-semibold pt-2">Tap to flip →</div>
                </div>
              </div>

              {/* Back face — pre-rotated 180° so it reads correctly when the container flips */}
              <div
                className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center px-8 py-8 sm:py-12"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className={`absolute top-0 right-0 bottom-0 w-3 ${theme.stripe}`} />
                <div className="text-center space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${theme.chip} ${theme.chipText}`}>
                      {theme.label}
                    </div>
                    {canShowKanji && (
                      <div className="inline-flex items-center rounded-full bg-slate-100 text-xs font-bold p-0.5">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); setShowKanji(false); }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setShowKanji(false); } }}
                          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer select-none ${!showKanji ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}
                        >
                          かな
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); setShowKanji(true); }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setShowKanji(true); } }}
                          className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer select-none ${showKanji ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}
                        >
                          漢字
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-5xl sm:text-7xl font-black text-slate-800 wrap-break-word leading-tight tracking-tight">
                    {displayWord}
                  </div>
                  <div className="text-lg sm:text-2xl text-slate-500 font-bold">
                    {displayRomanization}
                  </div>
                  <div className="text-sm sm:text-base text-slate-400 italic">
                    {card.english}
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Mascot walks along the bottom of the card; positions itself */}
          <Mascot
            flipCount={revealCount}
            navCount={navCount}
            categoryKey={selectedCategory}
            isPlaying={isPlaying}
            streak={streak}
          />
        </div>

        {/* Action buttons (only when flipped) */}
        {showAnswer && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => playSound(card[selectedLanguage] ?? '', selectedLanguage)}
              disabled={isPlaying}
              className={`flex-1 rounded-2xl py-4 text-white font-extrabold text-base sm:text-lg ${theme.buttonBg} ${theme.buttonShadow} active:translate-y-1 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2`}
            >
              {isPlaying ? (
                <>
                  <span className="inline-block w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Play sound
                </>
              )}
            </button>
            {canShowBreakdown && (
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex-1 rounded-2xl py-4 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
              >
                {showBreakdown ? '📚 Hide breakdown' : '🔍 Show breakdown'}
              </button>
            )}
          </div>
        )}

        {/* Breakdown panel */}
        {showAnswer && showBreakdown && breakdownForLang && (
          <div className="bg-white/80 backdrop-blur rounded-3xl p-4 sm:p-6 mb-6 shadow-md">
            <h3 className="font-extrabold text-slate-700 text-center mb-4 text-base sm:text-lg">
              Character breakdown
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {breakdownForLang.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 text-center min-w-14 sm:min-w-18 shadow-sm border border-slate-100">
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">{item.char}</div>
                  <div className={`text-xs sm:text-sm font-bold ${theme.chipText}`}>{item.rom}</div>
                  {item.meaning && (
                    <div className={`text-[10px] sm:text-xs mt-1 italic ${item.meaning === '(sound)' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={prevCard}
            className="rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 sm:px-5 py-3 shadow-[0_4px_0_0_rgb(203_213_225)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <div className="text-slate-600 font-bold text-sm sm:text-base">
            {currentCard + 1} <span className="text-slate-400">/</span> {filtered.length}
          </div>
          <button
            onClick={nextCard}
            className="rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 sm:px-5 py-3 shadow-[0_4px_0_0_rgb(203_213_225)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default MultilingualFlashcards;
