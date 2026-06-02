import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import type { Flashcard, Lang } from '../models/data';
import { ensureSignedIn, synthesizeSpeech, transcribeSpeech } from '../services/firebase';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { resampleToWav48k } from '../services/audioConvert';
import { judgePronunciation, type Verdict } from '../models/judgePronunciation';
import { LANG_THEME } from '../models/langTheme';

type Props = {
  cards: Flashcard[];
  levelNumber: number;
  lang: Lang;
  /** English keys already mastered for this language. */
  mastered: string[];
  /** Called when the kid pronounces a card correctly (perfect or close). */
  onMarkCorrect: (english: string) => void;
  /** Called when 80% of the level's cards are mastered. */
  onPassLevel: () => void;
  /** Back to the level picker. */
  onBack: () => void;
  /** Hidden-but-visible manual override per scope decision. */
  onManualPass: () => void;
};

type Phase =
  | { kind: 'prompt' }
  | { kind: 'recording' }
  | { kind: 'judging' }
  | { kind: 'verdict'; verdict: Verdict; transcript: string };

export function QuizSession({
  cards,
  levelNumber,
  lang,
  mastered,
  onMarkCorrect,
  onPassLevel,
  onBack,
  onManualPass,
}: Props) {
  const theme = LANG_THEME[lang];

  // Build the queue once: shuffle the level cards. On wrong answers we'll
  // splice the card back in further down the queue so it gets retried.
  const initialQueue = useMemo(() => shuffle(cards.map(c => c.english)), [cards]);
  const [queue, setQueue] = useState<string[]>(initialQueue);
  const [queueIndex, setQueueIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: 'prompt' });
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const recorder = useAudioRecorder();

  const passThreshold = Math.ceil(cards.length * 0.8);
  // Mastered cards that belong to this level. Mastery is stored per-language
  // not per-level, so we intersect.
  const levelKeys = useMemo(() => new Set(cards.map(c => c.english)), [cards]);
  const masteredInLevel = useMemo(
    () => mastered.filter(k => levelKeys.has(k)).length,
    [mastered, levelKeys],
  );

  // Fire onPassLevel once 80% threshold reached. The parent will navigate
  // back to the level picker; this guard prevents re-firing on re-renders.
  const firedPassRef = useRef(false);
  useEffect(() => {
    if (firedPassRef.current) return;
    if (masteredInLevel >= passThreshold) {
      firedPassRef.current = true;
      onPassLevel();
    }
  }, [masteredInLevel, passThreshold, onPassLevel]);

  // Lookup map for card data
  const byEnglish = useMemo(() => new Map(cards.map(c => [c.english, c])), [cards]);
  const currentEnglish = queue[queueIndex] ?? queue[0];
  const card = byEnglish.get(currentEnglish);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading…
      </div>
    );
  }

  const targetWord = card[lang] as string | undefined;
  const targetPhonetic = card.romanization[lang] ?? '';

  const advanceQueue = (markCorrect: boolean) => {
    if (markCorrect) {
      onMarkCorrect(currentEnglish);
    } else {
      // Re-queue this card ~3 positions further along so the kid hits it again.
      setQueue(q => {
        const next = [...q];
        // Insert at queueIndex + 4, or push at the end if we're near it.
        const insertAt = Math.min(queueIndex + 4, next.length);
        next.splice(insertAt, 0, currentEnglish);
        return next;
      });
    }
    setQueueIndex(i => i + 1);
    setPhase({ kind: 'prompt' });
  };

  const playTarget = async () => {
    if (!targetWord || isPlayingTarget) return;
    setIsPlayingTarget(true);
    try {
      await ensureSignedIn();
      const { data } = await synthesizeSpeech({ text: targetWord, lang });
      const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
      audio.addEventListener('ended', () => setIsPlayingTarget(false));
      audio.addEventListener('error', () => setIsPlayingTarget(false));
      await audio.play();
    } catch (e) {
      console.error(e);
      setIsPlayingTarget(false);
    }
  };

  const startRecording = async () => {
    if (phase.kind !== 'prompt') return;
    if (!targetWord) return;
    setPhase({ kind: 'recording' });
    recorder.start(async ({ blob, mimeType: _mt }) => {
      setPhase({ kind: 'judging' });
      try {
        const { blob: wav } = await resampleToWav48k(blob);
        const arrayBuffer = await wav.arrayBuffer();
        const audioBase64 = arrayBufferToBase64(arrayBuffer);
        await ensureSignedIn();
        const { data } = await transcribeSpeech({
          audioBase64,
          mimeType: 'audio/wav',
          lang,
        });
        const j = judgePronunciation(targetWord, data.transcript, data.confidence, lang);
        setPhase({ kind: 'verdict', verdict: j.verdict, transcript: data.transcript });
      } catch (e) {
        console.error(e);
        setPhase({ kind: 'verdict', verdict: 'unclear', transcript: '' });
      }
    });
  };

  const stopRecording = () => {
    if (phase.kind === 'recording') recorder.stop();
  };

  const goNext = () => {
    if (phase.kind !== 'verdict') return;
    const correct = phase.verdict === 'perfect' || phase.verdict === 'close';
    advanceQueue(correct);
  };

  // Allow tapping Try again on unclear without penalty
  const tryAgain = () => setPhase({ kind: 'prompt' });

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        {/* Header banner — back / level info / manual pass override */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 bg-white/70 rounded-2xl px-4 py-3 shadow-sm">
          <button
            onClick={onBack}
            className="rounded-xl px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm active:scale-95 transition-transform"
          >
            ← Levels
          </button>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Practicing</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-800">
              Level {levelNumber}
            </div>
          </div>
          <button
            onClick={onManualPass}
            className="rounded-xl px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_4px_0_0_rgb(6_95_70)] active:translate-y-0.5 active:shadow-none transition-all"
            title="Mark this level as passed"
          >
            ✓ Pass
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 mb-1.5">
            <span>{masteredInLevel} of {cards.length} mastered</span>
            <span>{passThreshold} to pass</span>
          </div>
          <div className="h-3 rounded-full bg-white/60 overflow-hidden">
            <div
              className={`h-full rounded-full ${theme.stripe} transition-all duration-500`}
              style={{ width: `${Math.min(100, (masteredInLevel / passThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* The card prompt */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 mb-6 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-2 ${theme.stripe}`} />
          <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wide mb-3 mt-2">
            Say this in {theme.label}
          </div>
          <div className="text-3xl sm:text-5xl font-extrabold text-slate-800 mb-4">
            {card.english}
          </div>
          <div className="text-sm sm:text-base text-slate-500">{card.cat}</div>

          {/* Verdict reveal: show the target word so they learn it */}
          {phase.kind === 'verdict' && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">{targetWord}</div>
              {targetPhonetic && (
                <div className="text-base sm:text-lg text-slate-500 italic mb-3">{targetPhonetic}</div>
              )}
              {phase.transcript && (
                <div className="text-xs sm:text-sm text-slate-400">
                  You said: <span className="font-semibold text-slate-600">{phase.transcript}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action area — changes by phase */}
        {phase.kind === 'prompt' && (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startRecording}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${theme.buttonBg} ${theme.buttonShadow} text-white flex items-center justify-center active:translate-y-1 active:shadow-none transition-all`}
              aria-label="Start recording"
            >
              <Mic className="w-9 h-9 sm:w-11 sm:h-11" />
            </button>
            <button
              onClick={playTarget}
              disabled={isPlayingTarget}
              className="text-sm sm:text-base text-slate-600 underline font-bold disabled:opacity-50"
            >
              {isPlayingTarget ? 'Playing…' : 'Hear it first 🔊'}
            </button>
            {recorder.error && (
              <div className="text-xs text-rose-600 font-bold">Mic error: {recorder.error}</div>
            )}
          </div>
        )}

        {phase.kind === 'recording' && (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={stopRecording}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center active:scale-95 transition-transform animate-pulse shadow-[0_6px_0_0_rgb(159_18_57)]"
              aria-label="Stop recording"
            >
              <Square className="w-8 h-8 fill-current" />
            </button>
            <div className="text-sm sm:text-base text-slate-600 font-bold">Listening…</div>
          </div>
        )}

        {phase.kind === 'judging' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="text-sm sm:text-base text-slate-600 font-bold">Checking…</div>
          </div>
        )}

        {phase.kind === 'verdict' && (
          <VerdictPanel
            verdict={phase.verdict}
            onNext={goNext}
            onTryAgain={tryAgain}
          />
        )}
      </div>
    </div>
  );
}

function VerdictPanel({
  verdict,
  onNext,
  onTryAgain,
}: {
  verdict: Verdict;
  onNext: () => void;
  onTryAgain: () => void;
}) {
  if (verdict === 'unclear') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-600">🤔 Didn't catch that</div>
        <button
          onClick={onTryAgain}
          className="rounded-2xl px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
        >
          Try again
        </button>
      </div>
    );
  }
  const tone = verdict === 'perfect'
    ? { label: '✨ Perfect!', color: 'text-emerald-600' }
    : verdict === 'close'
    ? { label: '👍 Close enough', color: 'text-amber-600' }
    : { label: '❌ Not quite', color: 'text-rose-600' };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`text-2xl sm:text-3xl font-extrabold ${tone.color}`}>{tone.label}</div>
      <button
        onClick={onNext}
        className="rounded-2xl px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-base sm:text-lg shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
      >
        Next →
      </button>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  // Chunk to avoid blowing the stack on large arrays
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}
