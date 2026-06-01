import { useCallback, useState } from 'react';
import type { Lang } from './data';
import {
  type Avatar,
  type Profile,
  type ProfileStore,
  createProfile,
  ensureLangProgress,
  loadProfileStore,
  saveProfileStore,
} from './profile';

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

  return {
    profiles: store.profiles,
    activeProfile,
    addProfile,
    selectProfile,
    setCurrentLanguage,
    deleteProfile,
  };
}
