import type { Profile } from '../models/profile';
import { LANG_THEME } from '../models/langTheme';
import { LEVELS } from '../models/levels';

type Props = {
  activeProfile: Profile;
  onBack: () => void;
  onPickLevel: (level: number) => void;
};

type Status = 'passed' | 'current' | 'locked';

export function LevelPicker({ activeProfile, onBack, onPickLevel }: Props) {
  const lang = activeProfile.currentLanguage;
  const theme = LANG_THEME[lang];
  const progress = activeProfile.progress[lang];
  const currentLevel = progress?.level ?? 1;
  const passed = new Set(progress?.passedLevels ?? []);

  const levelNumbers = Object.keys(LEVELS)
    .map(Number)
    .sort((a, b) => a - b);

  const statusOf = (n: number): Status => {
    if (passed.has(n)) return 'passed';
    if (n === currentLevel) return 'current';
    if (n < currentLevel) return 'passed'; // forward-compat: shouldn't happen
    return 'locked';
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        <header className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <button
            onClick={onBack}
            className="rounded-full bg-white/70 hover:bg-white px-4 py-2 font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            ← Home
          </button>
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-bold ${theme.chip} ${theme.chipText}`}>
            <span>{theme.label}</span>
            <span className="opacity-80">·</span>
            <span>{theme.short}</span>
          </div>
        </header>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 text-center">Pick a level</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 text-center">
          {passed.size} of {levelNumbers.length} passed
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          {levelNumbers.map((n) => {
            const s = statusOf(n);
            const cardCount = LEVELS[n].length;
            const disabled = s === 'locked';
            return (
              <button
                key={n}
                disabled={disabled}
                onClick={() => onPickLevel(n)}
                className={
                  'aspect-square rounded-2xl flex flex-col items-center justify-center font-extrabold transition-all ' +
                  (s === 'passed'
                    ? 'bg-emerald-400 hover:bg-emerald-500 text-white shadow-[0_6px_0_0_rgb(6_95_70)] active:translate-y-1 active:shadow-none'
                    : s === 'current'
                    ? `bg-white text-slate-800 ring-4 ${theme.ring} ${theme.glow} active:scale-95`
                    : 'bg-white/40 text-slate-400 cursor-not-allowed')
                }
                aria-label={`Level ${n} ${s}`}
              >
                <div className="text-3xl sm:text-4xl">{n}</div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">{cardCount} cards</div>
                <div className="text-base sm:text-lg mt-1">
                  {s === 'passed' ? '✓' : s === 'current' ? '⭐' : '🔒'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
