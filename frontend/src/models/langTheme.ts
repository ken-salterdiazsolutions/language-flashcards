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
  /**
   * Flag-inspired gradient classes for the picker tile background. We use
   * gradients (not literal flag SVGs) to give each language a recognizable
   * identity without leaning on national symbols. The chunky 3D shadow on
   * the tile still comes from `tileShadow`.
   */
  tileBg: string;
  /** Slightly darker / hover state for the same tile gradient */
  tileBgHover: string;
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
    // Japan: white → red. Light text-shadow keeps the "Japanese" label
    // readable over the white half.
    tileBg: 'bg-linear-to-br from-white to-red-500',
    tileBgHover: 'hover:from-slate-100 hover:to-red-600',
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
    // Korea: red taegeuk → blue taegeuk
    tileBg: 'bg-linear-to-br from-red-500 to-blue-700',
    tileBgHover: 'hover:from-red-600 hover:to-blue-800',
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
    // China: red → yellow
    tileBg: 'bg-linear-to-br from-red-600 to-yellow-400',
    tileBgHover: 'hover:from-red-700 hover:to-yellow-500',
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
    // Latin-American style red/yellow/red horizontal tricolor — generic
    // Spanish-speaking palette without tying to Spain specifically.
    tileBg: 'bg-linear-to-b from-red-600 via-yellow-400 to-red-600',
    tileBgHover: 'hover:from-red-700 hover:via-yellow-500 hover:to-red-700',
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
    // France: blue → red (drop the white middle — washed out as a tile)
    tileBg: 'bg-linear-to-b from-blue-700 to-red-600',
    tileBgHover: 'hover:from-blue-800 hover:to-red-700',
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
    // Germany tricolor: black → red → gold
    tileBg: 'bg-linear-to-b from-slate-900 via-red-600 to-yellow-400',
    tileBgHover: 'hover:from-black hover:via-red-700 hover:to-yellow-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(6_95_70)]',
  },
  ukrainian: {
    label: 'Ukrainian',
    short: 'Українська',
    stripe: 'bg-yellow-400',
    chip: 'bg-yellow-100',
    chipText: 'text-yellow-800',
    ring: 'ring-yellow-300',
    buttonBg: 'bg-blue-500 hover:bg-blue-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(30_64_175)]',
    glow: 'shadow-[0_0_12px_2px_rgba(250,204,21,0.55)]',
    // Ukraine: blue → yellow
    tileBg: 'bg-linear-to-b from-blue-500 to-yellow-400',
    tileBgHover: 'hover:from-blue-600 hover:to-yellow-500',
    tileShadow: 'shadow-[0_6px_0_0_rgb(30_64_175)]',
  },
  italian: {
    label: 'Italian',
    short: 'Italiano',
    stripe: 'bg-green-400',
    chip: 'bg-green-100',
    chipText: 'text-green-700',
    ring: 'ring-green-300',
    buttonBg: 'bg-green-500 hover:bg-green-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(22_101_52)]',
    glow: 'shadow-[0_0_12px_2px_rgba(74,222,128,0.55)]',
    // Italy: green → red (drop the white middle)
    tileBg: 'bg-linear-to-b from-green-600 to-red-600',
    tileBgHover: 'hover:from-green-700 hover:to-red-700',
    tileShadow: 'shadow-[0_6px_0_0_rgb(22_101_52)]',
  },
  hindi: {
    label: 'Hindi',
    short: 'हिन्दी',
    stripe: 'bg-orange-400',
    chip: 'bg-orange-100',
    chipText: 'text-orange-700',
    ring: 'ring-orange-300',
    buttonBg: 'bg-orange-500 hover:bg-orange-600',
    buttonShadow: 'shadow-[0_6px_0_0_rgb(154_52_18)]',
    glow: 'shadow-[0_0_12px_2px_rgba(251,146,60,0.55)]',
    // India: saffron → green (drop the white middle)
    tileBg: 'bg-linear-to-b from-orange-500 to-green-600',
    tileBgHover: 'hover:from-orange-600 hover:to-green-700',
    tileShadow: 'shadow-[0_6px_0_0_rgb(154_52_18)]',
  },
};
