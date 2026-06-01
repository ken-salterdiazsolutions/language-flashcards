import type { Lang } from './data';

export type LangTheme = {
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
  /** Solid bg for picker tiles (filled card style) */
  tileBg: string;
  /** Darker variant for the tile's bottom shadow / hover */
  tileBgHover: string;
  /** Shadow offset used on the picker tile for the chunky button look */
  tileShadow: string;
};

export const LANG_THEME: Record<Lang, LangTheme> = {
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
    tileBg: 'bg-rose-400',
    tileBgHover: 'hover:bg-rose-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(159_18_57)]',
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
    tileBg: 'bg-sky-400',
    tileBgHover: 'hover:bg-sky-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(7_89_133)]',
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
    tileBg: 'bg-amber-400',
    tileBgHover: 'hover:bg-amber-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(146_64_14)]',
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
    tileBg: 'bg-fuchsia-400',
    tileBgHover: 'hover:bg-fuchsia-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(162_28_175)]',
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
    tileBg: 'bg-indigo-400',
    tileBgHover: 'hover:bg-indigo-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(55_48_163)]',
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
    tileBg: 'bg-emerald-400',
    tileBgHover: 'hover:bg-emerald-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(6_95_70)]',
  },
};
