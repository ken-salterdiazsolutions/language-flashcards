import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ensureSignedIn, synthesizeSpeech } from './services/firebase';
import { flashcards, categories, CATEGORY_EMOJI, type Lang } from './models/data';
import { useStreak } from './hooks/useStreak';
import { CategoryStrip } from './components/CategoryStrip';
import { LANG_THEME } from './models/langTheme';
import { useSwipe } from './hooks/useSwipe';
import { Mascot } from './components/Mascot';
import { StreakModal } from './components/StreakModal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import streakFireUrl from './assets/streak-fire.json?url';

// LANG_THEME extracted to ./langTheme.ts so the ProfilePicker can reuse it.

type Props = {
  activeProfile: import('./models/profile').Profile;
  onOpenSettings: () => void;
  /** Optional Home-screen escape hatch — when set, a "Home" pill renders
   *  in the header. Free Play passes this; level mode uses its own banner. */
  onHome?: () => void;
  /**
   * When set, scope the deck to these cards and hide the category strip.
   * Used by Practice (level) mode. Free Play passes undefined to keep the
   * full-deck browse behavior.
   */
  levelMode?: {
    cards: import('./models/data').Flashcard[];
    levelNumber: number;
    onBack: () => void;
    onPassLevel: () => void;
  };
};

const MultilingualFlashcards = ({ activeProfile, onOpenSettings, onHome, levelMode }: Props) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const selectedLanguage = activeProfile.currentLanguage;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKanji, setShowKanji] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [navCount, setNavCount] = useState(0);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const { streak, recordVisit } = useStreak();

  // Match the card flip animation duration. If the user changes category
  // while the card is flipped to the back, flip it back to the English side
  // first so they don't get a sneak peek at the new answer.
  const FLIP_DURATION_MS = 700;
  const afterFlipBack = (fn: () => void) => {
    if (showAnswer) {
      resetCardState();
      setTimeout(fn, FLIP_DURATION_MS);
    } else {
      fn();
    }
  };

  const filtered = levelMode
    ? levelMode.cards
    : selectedCategory === 'all' ? flashcards : flashcards.filter(c => c.cat === selectedCategory);
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

  // Touch/pointer swipe handlers for the card. Swipe-left = next, swipe-right
  // = prev (the card moves with the finger). Tap still flips because the hook
  // only suppresses the click when a swipe committed.
  const cardSwipe = useSwipe({ onLeft: nextCard, onRight: prevCard });

  // Keyboard shortcuts: ← prev, → next, Space/Enter flip. Skipped when a
  // text field has focus (e.g. future name input on a level screen).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      // Don't intercept when a dialog (modal) is open — those handle their own keys.
      if (document.querySelector('[role="dialog"]')) return;
      if (e.key === 'ArrowLeft')      { e.preventDefault(); prevCard(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nextCard(); }
      else if (e.key === ' ' || e.key === 'Enter') {
        // Only when the focused element isn't a button itself, to avoid
        // double-firing the focused button's own activation.
        if (target && target.tagName === 'BUTTON') return;
        e.preventDefault();
        flipCard();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextCard, prevCard, flipCard]);

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
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 bg-white/60 hover:bg-white rounded-full pl-1 pr-3 py-1 shadow-sm active:scale-95 transition-transform"
            aria-label={`${activeProfile.name} — open settings`}
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 flex items-center justify-center text-2xl sm:text-3xl">
              {activeProfile.avatar}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-800 max-w-[8ch] truncate">
              {activeProfile.name}
            </span>
          </button>
          <div className="flex items-center gap-2">
            {onHome && (
              <button
                onClick={onHome}
                className="flex items-center gap-1 bg-white/70 hover:bg-white rounded-full px-3 py-1.5 text-sm sm:text-base font-extrabold text-slate-700 shadow-sm active:scale-95 transition-transform"
                aria-label="Back to home"
              >
                🏠 <span className="hidden sm:inline">Home</span>
              </button>
            )}
            <button
              onClick={() => setStreakModalOpen(true)}
              className="flex items-center gap-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-full px-3 py-1.5 text-sm sm:text-base shadow-sm active:scale-95 transition-transform"
              aria-label="Show day streak details"
            >
              <span className="inline-block w-6 h-6 sm:w-7 sm:h-7 -my-1">
                <DotLottieReact src={streakFireUrl} loop autoplay />
              </span>
              {streak > 0 ? (
                <>
                  <span>{streak}</span>
                  <span className="hidden sm:inline text-amber-800/80 font-semibold">day streak</span>
                </>
              ) : (
                <span className="font-semibold">Day streak!</span>
              )}
            </button>
          </div>
        </header>

        {/* Level mode banner — replaces language + category strips */}
        {levelMode && (
          <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 bg-white/70 rounded-2xl px-4 py-3 shadow-sm">
            <button
              onClick={levelMode.onBack}
              className="rounded-xl px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm active:scale-95 transition-transform"
            >
              ← Levels
            </button>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Practicing</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-800">
                Level {levelMode.levelNumber} · {filtered.length} cards
              </div>
            </div>
            <button
              onClick={levelMode.onPassLevel}
              className="rounded-xl px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_4px_0_0_rgb(6_95_70)] active:translate-y-0.5 active:shadow-none transition-all"
              title="Mark this level as passed"
            >
              ✓ Pass
            </button>
          </div>
        )}

        {/* Category strip — hidden in level mode */}
        {!levelMode && (
          <CategoryStrip
            categories={categories}
            selected={selectedCategory}
            onSelect={(cat) => afterFlipBack(() => { setSelectedCategory(cat); setCurrentCard(0); })}
          />
        )}

        {/* The card — full 3D flip */}
        <div className="relative mb-6" style={{ perspective: '1600px' }}>
          <button
            {...cardSwipe.handlers}
            onClick={() => {
              // Skip the flip if the user just completed a swipe — pointerup
              // fired both the swipe callback and a synthetic click on the
              // button.
              if (cardSwipe.wasSwipe()) return;
              flipCard();
            }}
            className="group relative w-full text-left touch-pan-y"
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
                <>🔊 Hear it!</>
              )}
            </button>
            {canShowBreakdown && (
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex-1 rounded-2xl py-4 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
              >
                {showBreakdown ? '📚 Hide it!' : '🔍 Break it down!'}
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

      <StreakModal
        streak={streak}
        open={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
      />
    </div>
  );
};

export default MultilingualFlashcards;
