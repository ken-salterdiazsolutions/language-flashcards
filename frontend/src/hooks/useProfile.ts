import { useCallback, useState } from 'react';
import type { Lang } from '../models/data';
import {
  type Avatar,
  type Profile,
  type ProfileStore,
  createProfile,
  ensureLangProgress,
  loadProfileStore,
  saveProfileStore,
} from '../models/profile';

/**
 * Manages the set of profiles + the active one. localStorage-backed.
 * Phase A only uses { name, avatar, currentLanguage } from the profile;
 * the progress field is reserved for later phases.
 */
export function useProfile() {
  const [store, setStore] = useState<ProfileStore>(() => loadProfileStore());

  const persist = useCallback((next: ProfileStore) => {
    setStore(next);
    saveProfileStore(next);
  }, []);

  const activeProfile = store.profiles.find(p => p.id === store.activeProfileId) ?? null;

  const addProfile = useCallback((input: { name: string; avatar: Avatar; language: Lang }) => {
    const profile = createProfile(input);
    persist({
      profiles: [...store.profiles, profile],
      activeProfileId: profile.id,
    });
    return profile;
  }, [persist, store.profiles]);

  const selectProfile = useCallback((id: string | null) => {
    persist({ ...store, activeProfileId: id });
  }, [persist, store]);

  const updateActive = useCallback((mut: (p: Profile) => Profile) => {
    if (!store.activeProfileId) return;
    persist({
      ...store,
      profiles: store.profiles.map(p => p.id === store.activeProfileId ? mut(p) : p),
    });
  }, [persist, store]);

  const setCurrentLanguage = useCallback((lang: Lang) => {
    updateActive(p => ensureLangProgress({ ...p, currentLanguage: lang }, lang));
  }, [updateActive]);

  const deleteProfile = useCallback((id: string) => {
    const remaining = store.profiles.filter(p => p.id !== id);
    persist({
      profiles: remaining,
      activeProfileId: store.activeProfileId === id ? null : store.activeProfileId,
    });
  }, [persist, store]);

  const renameActive = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 16);
    if (!trimmed) return;
    updateActive(p => ({ ...p, name: trimmed }));
  }, [updateActive]);

  const setAvatar = useCallback((avatar: Avatar) => {
    updateActive(p => ({ ...p, avatar }));
  }, [updateActive]);

  /**
   * Mark a card as mastered for the active profile + language. Idempotent.
   * "Mastered" = answered correctly at least once in quiz mode.
   */
  const markCardCorrect = useCallback((lang: Lang, english: string) => {
    updateActive(p => {
      const ensured = ensureLangProgress(p, lang);
      const lp = ensured.progress[lang]!;
      if (lp.cardsMastered.includes(english)) return ensured;
      return {
        ...ensured,
        progress: {
          ...ensured.progress,
          [lang]: { ...lp, cardsMastered: [...lp.cardsMastered, english] },
        },
      };
    });
  }, [updateActive]);

  /**
   * Mark a level as passed for the active profile's language. Idempotent:
   * passing a level twice doesn't duplicate it. Advances `level` to the
   * next unpassed level when the just-passed level was the current one.
   */
  const passLevel = useCallback((lang: Lang, level: number) => {
    updateActive(p => {
      const ensured = ensureLangProgress(p, lang);
      const lp = ensured.progress[lang]!;
      if (lp.passedLevels.includes(level)) return ensured;
      const passedLevels = [...lp.passedLevels, level].sort((a, b) => a - b);
      // Bump current level if we just passed it.
      const nextLevel = lp.level === level ? level + 1 : lp.level;
      return {
        ...ensured,
        progress: {
          ...ensured.progress,
          [lang]: { ...lp, passedLevels, level: nextLevel, currentLevelAttempts: 0 },
        },
      };
    });
  }, [updateActive]);

  return {
    profiles: store.profiles,
    activeProfile,
    addProfile,
    selectProfile,
    setCurrentLanguage,
    deleteProfile,
    renameActive,
    setAvatar,
    passLevel,
    markCardCorrect,
  };
}
