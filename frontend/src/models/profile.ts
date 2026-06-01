import type { Lang } from './data';

export const AVATAR_OPTIONS = ['🐱', '🐶', '🦊', '🐼', '🐯', '🦄', '🐸', '🐧', '🐵', '🐰', '🦁', '🐨'] as const;
export type Avatar = typeof AVATAR_OPTIONS[number];

/** Per-language progress slot. Levels/quiz fields included for forward
 *  compat with Phase D+; only currentLanguage is used in Phase A. */
export type LangProgress = {
  level: number;
  passedLevels: number[];
  cardsMastered: string[];      // English keys of mastered cards
  currentLevelAttempts: number;
};

export type Profile = {
  id: string;
  name: string;
  avatar: Avatar;
  currentLanguage: Lang;
  progress: Partial<Record<Lang, LangProgress>>;
  createdAt: number;
};

export type ProfileStore = {
  profiles: Profile[];
  activeProfileId: string | null;
};

const STORAGE_KEY = 'lf.profileStore';

function defaultLangProgress(): LangProgress {
  return { level: 1, passedLevels: [], cardsMastered: [], currentLevelAttempts: 0 };
}

export function loadProfileStore(): ProfileStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profiles: [], activeProfileId: null };
    const parsed = JSON.parse(raw) as ProfileStore;
    if (!Array.isArray(parsed.profiles)) return { profiles: [], activeProfileId: null };
    return parsed;
  } catch {
    return { profiles: [], activeProfileId: null };
  }
}

export function saveProfileStore(store: ProfileStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function createProfile(input: { name: string; avatar: Avatar; language: Lang }): Profile {
  const id = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name: input.name.trim().slice(0, 16),
    avatar: input.avatar,
    currentLanguage: input.language,
    progress: { [input.language]: defaultLangProgress() },
    createdAt: Date.now(),
  };
}

/** Returns the current progress slot for a profile's active language,
 *  creating an empty one if the language was never started before. */
export function ensureLangProgress(profile: Profile, lang: Lang): Profile {
  if (profile.progress[lang]) return profile;
  return {
    ...profile,
    progress: { ...profile.progress, [lang]: defaultLangProgress() },
  };
}
