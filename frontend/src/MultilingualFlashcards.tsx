import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { ensureSignedIn, synthesizeSpeech, transcribeSpeech } from './firebase';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { resampleToWav48k } from './audioConvert';
import { judgePronunciation, type Judgment } from './models/judgePronunciation';
import { flashcards, categories, CATEGORY_EMOJI, type Lang } from './models/data';
import { useStreak } from './hooks/useStreak';
import { usePronunciationStreak } from './hooks/usePronunciationStreak';
import { tierForStreak, tierHasModal, fireConfetti, playCheer, type Tier } from './celebration';
import { CelebrationModal } from './CelebrationModal';
import { CategoryStrip } from './CategoryStrip';
import { LANG_THEME } from './models/langTheme';
import { useSwipe } from './hooks/useSwipe';
import { Mascot } from './Mascot';
import { StreakModal } from './StreakModal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import streakFireUrl from './assets/streak-fire.json?url';

// LANG_THEME extracted to ./langTheme.ts so the ProfilePicker can reuse it.

// Result panel shown after a pronunciation attempt is judged.
// Style varies by verdict tier: perfect (green), close (amber),
// wrong (rose), unclear (slate).
// For `wrong`: shows Try again + Skip (Skip is the streak-reset trigger).
// For `unclear`: shows only Try again (unclear doesn't count as an attempt).
// For `perfect` / `close`: just dismiss.
function PronunciationResult({
  judgment,
  onDismiss,
  onRetry,
  onSkip,
}: {
  judgment: Judgment;
  onDismiss: () => void;
  onRetry: () => void;
  onSkip: () => void;
}) {
  const { verdict, normalizedTranscript } = judgment;
  const config = {
    perfect: { bg: 'bg-emerald-100', text: 'text-emerald-800', emoji: '🎉', title: 'Perfect!', body: 'You nailed it!' },
    close:   { bg: 'bg-amber-100',   text: 'text-amber-800',   emoji: '🌟', title: 'Almost!',  body: "That counts! You're getting it." },
    wrong:   { bg: 'bg-rose-100',    text: 'text-rose-800',    emoji: '🤔', title: 'Not quite',body: 'Listen again and give it another go.' },
    unclear: { bg: 'bg-slate-100',   text: 'text-slate-700',   emoji: '👂', title: "Didn't catch that", body: 'Try saying it a little louder.' },
  }[verdict];
  const showRetry = verdict === 'wrong' || verdict === 'unclear';
  const showSkip = verdict === 'wrong';
  return (
    <div className={`relative rounded-3xl p-5 sm:p-6 mb-6 shadow-md ${config.bg}`}>
      <button
        onClick={onDismiss}
        aria-label="Dismiss result"
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/60 hover:bg-white text-slate-600 font-bold flex items-center justify-center"
      >
        ✕
      </button>
      <div className="text-center">
        <div className="text-4xl sm:text-5xl mb-2">{config.emoji}</div>
        <h3 className={`text-xl sm:text-2xl font-extrabold mb-1 ${config.text}`}>{config.title}</h3>
        <p className={`text-sm sm:text-base ${config.text} opacity-80`}>{config.body}</p>
        {normalizedTranscript && verdict !== 'perfect' && (
          <p className="text-xs sm:text-sm text-slate-600 mt-3 italic">
            We heard: <span className="font-bold not-italic">"{normalizedTranscript}"</span>
          </p>
        )}
        {(showRetry || showSkip) && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
            {showRetry && (
              <button
                onClick={onRetry}
                className="rounded-2xl px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm sm:text-base shadow-[0_4px_0_0_rgb(157_23_77)] active:translate-y-1 active:shadow-none transition-all"
              >
                🎤 Try again
              </button>
            )}
            {showSkip && (
              <button
                onClick={onSkip}
                className="rounded-2xl px-5 py-2.5 bg-slate-400 hover:bg-slate-500 text-white font-bold text-sm sm:text-base shadow-[0_4px_0_0_rgb(71_85_105)] active:translate-y-1 active:shadow-none transition-all"
              >
                ⏭️ Skip
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('FileReader returned non-string'));
        return;
      }
      // result is "data:<mime>;base64,<actual base64>" — strip the prefix
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

type Props = {
  activeProfile: import('./models/profile').Profile;
  onSwitchProfile: () => void;
  onChangeLanguage: (lang: Lang) => void;
};

const MultilingualFlashcards = ({ activeProfile, onSwitchProfile, onChangeLanguage }: Props) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const selectedLanguage = activeProfile.currentLanguage;
  const setSelectedLanguage = onChangeLanguage;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKanji, setShowKanji] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [navCount, setNavCount] = useState(0);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [pronStreakModalOpen, setPronStreakModalOpen] = useState(false);
  // Tracks an active celebration triggered by a pronunciation streak milestone.
  // Non-null = celebration modal showing; null = no celebration (or only
  // subtle confetti tier, which doesn't use this state).
  const [celebrationTier, setCelebrationTier] = useState<Tier | null>(null);
  const [chipPulse, setChipPulse] = useState(false);
  const { streak, recordVisit } = useStreak();
  const pronunciationStreakState = usePronunciationStreak();
  const prevPronStreakRef = useRef<number>(pronunciationStreakState.streak);

  // Pronunciation feature state.
  // pronStatus drives the mic button UI; pronJudgment holds the most recent
  // result while the result panel is shown. Both are cleared when the user
  // navigates, flips the card, or changes language/category.
  type PronStatus = 'idle' | 'recording' | 'uploading';
  const [pronStatus, setPronStatus] = useState<PronStatus>('idle');
  const [pronJudgment, setPronJudgment] = useState<Judgment | null>(null);
  const audioRecorder = useAudioRecorder();

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

  // Pronunciation streak milestone watcher. When the streak transitions into
  // a milestone value (1, 5, 10, 15, 20, 25, 50, 100), fire the celebration:
  // confetti + cheer sound + chip pulse, plus a modal for higher tiers.
  useEffect(() => {
    const prev = prevPronStreakRef.current;
    const curr = pronunciationStreakState.streak;
    prevPronStreakRef.current = curr;
    if (curr <= prev) return; // resets and no-ops don't trigger celebrations
    const tier = tierForStreak(curr);
    if (!tier) return;
    fireConfetti(tier);
    playCheer(tier);
    setChipPulse(true);
    const pulseTimer = window.setTimeout(() => setChipPulse(false), 800);
    if (tierHasModal(tier)) setCelebrationTier(tier);
    return () => clearTimeout(pulseTimer);
  }, [pronunciationStreakState.streak]);

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
    setPronJudgment(null);
    // Don't clobber pronStatus if a recording is in flight — let the user
    // stop deliberately. But once they leave the answer side it doesn't
    // matter; the mic button only renders while showAnswer is true.
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

  const handleRecordPronunciation = async () => {
    if (audioRecorder.isRecording) {
      audioRecorder.stop();
      return;
    }
    if (pronStatus === 'uploading') return;
    const target = card[selectedLanguage] ?? '';
    setPronJudgment(null);
    setPronStatus('recording');
    audioRecorder.start(async ({ blob }) => {
      setPronStatus('uploading');
      try {
        // Browsers record at varying rates; resample to 48kHz mono WAV so
        // Google STT consistently accepts the audio (see audioConvert.ts).
        const converted = await resampleToWav48k(blob);
        const audioBase64 = await blobToBase64(converted.blob);
        await ensureSignedIn();
        const { data } = await transcribeSpeech({
          audioBase64,
          mimeType: converted.mimeType,
          lang: selectedLanguage,
        });
        const judgment = judgePronunciation(target, data.transcript, data.confidence, selectedLanguage);
        setPronJudgment(judgment);
        if (judgment.verdict === 'perfect' || judgment.verdict === 'close') {
          pronunciationStreakState.recordCorrect();
        }
        // wrong/unclear: no streak change yet. The user can retry; the skip
        // button on the wrong-result panel is the explicit reset trigger.
      } catch (e) {
        console.error('[pron] transcribe failed:', e);
        // Treat backend failures as "unclear" so the user can retry without
        // it counting against any streak.
        setPronJudgment({
          verdict: 'unclear',
          similarity: 0,
          confidence: 0,
          normalizedTarget: target,
          normalizedTranscript: '',
        });
      } finally {
        setPronStatus('idle');
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={onSwitchProfile}
            className="flex items-center gap-2 bg-white/60 hover:bg-white rounded-full pl-1 pr-3 py-1 shadow-sm active:scale-95 transition-transform"
            aria-label={`Switch from profile ${activeProfile.name}`}
          >
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 flex items-center justify-center text-2xl sm:text-3xl">
              {activeProfile.avatar}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-800 max-w-[8ch] truncate">
              {activeProfile.name}
            </span>
          </button>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setPronStreakModalOpen(true)}
              className={`flex items-center gap-1.5 bg-violet-200 hover:bg-violet-300 text-violet-900 font-bold rounded-full px-3 py-1.5 text-sm sm:text-base shadow-sm active:scale-95 transition-all ${chipPulse ? 'animate-streak-pulse' : ''}`}
              aria-label="Show pronunciation streak details"
            >
              <span className="text-base sm:text-lg">🎯</span>
              {pronunciationStreakState.streak > 0 ? (
                <>
                  <span>{pronunciationStreakState.streak}</span>
                  <span className="hidden sm:inline text-violet-800/80 font-semibold">in a row</span>
                </>
              ) : (
                <span className="font-semibold">Say streak!</span>
              )}
            </button>
          </div>
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
                <>
                  <Megaphone className="w-5 h-5" />
                  Hear it!
                </>
              )}
            </button>
            <button
              onClick={handleRecordPronunciation}
              disabled={pronStatus === 'uploading'}
              className={`flex-1 rounded-2xl py-4 text-white font-extrabold text-base sm:text-lg active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 ${
                pronStatus === 'recording'
                  ? 'bg-red-500 hover:bg-red-600 shadow-[0_6px_0_0_rgb(153_27_27)] animate-pulse'
                  : 'bg-pink-500 hover:bg-pink-600 shadow-[0_6px_0_0_rgb(157_23_77)] disabled:opacity-70 disabled:cursor-wait'
              }`}
            >
              {pronStatus === 'recording' ? (
                <>🎤 Listening… (click to stop)</>
              ) : pronStatus === 'uploading' ? (
                <>
                  <span className="inline-block w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                  Checking…
                </>
              ) : (
                <>🎤 Say it!</>
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

        {/* Pronunciation result panel */}
        {showAnswer && pronJudgment && (
          <PronunciationResult
            judgment={pronJudgment}
            onDismiss={() => setPronJudgment(null)}
            onRetry={() => {
              setPronJudgment(null);
              handleRecordPronunciation();
            }}
            onSkip={() => {
              pronunciationStreakState.recordSkip();
              setPronJudgment(null);
            }}
          />
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
        kind="day"
        streak={streak}
        open={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
      />
      <StreakModal
        kind="pronunciation"
        streak={pronunciationStreakState.streak}
        open={pronStreakModalOpen}
        onClose={() => setPronStreakModalOpen(false)}
      />
      {celebrationTier !== null && (
        <CelebrationModal
          streak={pronunciationStreakState.streak}
          tier={celebrationTier}
          open={true}
          onClose={() => setCelebrationTier(null)}
        />
      )}
    </div>
  );
};

export default MultilingualFlashcards;
