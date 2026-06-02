import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Profile } from '../models/profile';
import { LANG_THEME } from '../models/langTheme';
import { LEVELS } from '../models/levels';
import { ProfileMascot } from './ProfileMascot';
import bullseyeUrl from '../assets/bullseye.json?url';
import cardsUrl from '../assets/cards.json?url';

type Props = {
  activeProfile: Profile;
  onOpenSettings: () => void;
  onPracticeLevels: () => void;
  onFreePlay: () => void;
  /** Jump straight into the current level's practice session. */
  onContinue: () => void;
};

export function Home({
  activeProfile,
  onOpenSettings,
  onPracticeLevels,
  onFreePlay,
  onContinue,
}: Props) {
  const lang = activeProfile.currentLanguage;
  const theme = LANG_THEME[lang];
  const progress = activeProfile.progress[lang];
  const currentLevel = progress?.level ?? 1;
  const passedCount = progress?.passedLevels.length ?? 0;
  const totalLevels = Object.keys(LEVELS).length;
  const showContinue = passedCount > 0 || currentLevel > 1;

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        {/* Header — avatar button now opens Settings (name/avatar/language/profile) */}
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
          <button
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-transform ${theme.chip} ${theme.chipText}`}
            aria-label="Change language"
          >
            <span>{theme.label}</span>
            <span className="opacity-80">·</span>
            <span>{theme.short}</span>
          </button>
        </header>

        {/* Continue shortcut — only shown for kids with some progress */}
        {showContinue && (
          <button
            onClick={onContinue}
            className="w-full mb-6 bg-white/80 hover:bg-white rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-md active:scale-[0.99] transition-all flex items-center justify-between gap-3"
          >
            <div className="text-left">
              <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Continue</div>
              <div className="text-base sm:text-lg font-extrabold text-slate-800">
                Level {currentLevel}
                {currentLevel > totalLevels ? ' — all done!' : ''}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl">▶️</div>
          </button>
        )}

        {/* Mode tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
          <button
            onClick={onPracticeLevels}
            className="rounded-3xl p-5 sm:p-6 bg-violet-500 hover:bg-violet-600 text-white text-left shadow-[0_8px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 -ml-1">
              <DotLottieReact src={bullseyeUrl} loop autoplay />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">Practice Levels</div>
            <div className="text-sm sm:text-base text-white/85 mt-1">
              Step-by-step lessons.
            </div>
            <div className="mt-3 inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
              {passedCount} of {totalLevels} passed
            </div>
          </button>

          <button
            onClick={onFreePlay}
            className="rounded-3xl p-5 sm:p-6 bg-amber-400 hover:bg-amber-500 text-amber-950 text-left shadow-[0_8px_0_0_rgb(146_64_14)] active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 -ml-1">
              <DotLottieReact src={cardsUrl} loop autoplay />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold">Free Play</div>
            <div className="text-sm sm:text-base text-amber-900/85 mt-1">
              Browse all the cards.
            </div>
            <div className="mt-3 inline-block bg-white/30 rounded-full px-3 py-1 text-xs font-bold">
              All categories
            </div>
          </button>
        </div>

        <div className="flex justify-center">
          <ProfileMascot celebrateKey={0} />
        </div>
      </div>
    </div>
  );
}
