import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProfileStore,
  saveProfileStore,
  createProfile,
  ensureLangProgress,
  type Profile,
  type ProfileStore,
} from './profile';

const STORAGE_KEY = 'lf.profileStore';

beforeEach(() => {
  localStorage.clear();
});

describe('loadProfileStore', () => {
  it('returns an empty store when nothing is persisted', () => {
    expect(loadProfileStore()).toEqual({ profiles: [], activeProfileId: null });
  });

  it('falls back to an empty store on malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json');
    expect(loadProfileStore()).toEqual({ profiles: [], activeProfileId: null });
  });

  it('falls back when profiles is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles: 'oops', activeProfileId: null }));
    expect(loadProfileStore()).toEqual({ profiles: [], activeProfileId: null });
  });
});

describe('saveProfileStore + loadProfileStore round-trip', () => {
  it('persists and reloads an identical store', () => {
    const store: ProfileStore = {
      profiles: [createProfile({ name: 'Mia', avatar: '🦊', language: 'spanish' })],
      activeProfileId: null,
    };
    store.activeProfileId = store.profiles[0].id;
    saveProfileStore(store);
    expect(loadProfileStore()).toEqual(store);
  });
});

describe('createProfile', () => {
  it('trims and truncates the name to 16 characters', () => {
    const p = createProfile({ name: '  Alexandria the Great  ', avatar: '🐼', language: 'french' });
    expect(p.name).toBe('Alexandria the G');
    expect(p.name.length).toBeLessThanOrEqual(16);
  });

  it('seeds a default progress slot for the chosen language', () => {
    const p = createProfile({ name: 'Mia', avatar: '🐱', language: 'korean' });
    expect(p.currentLanguage).toBe('korean');
    expect(p.progress.korean).toEqual({
      level: 1,
      passedLevels: [],
      cardsMastered: [],
      currentLevelAttempts: 0,
    });
    expect(p.id).toMatch(/^p_/);
  });
});

describe('ensureLangProgress', () => {
  const base: Profile = createProfile({ name: 'Mia', avatar: '🐶', language: 'spanish' });

  it('returns the same profile reference when the slot already exists', () => {
    expect(ensureLangProgress(base, 'spanish')).toBe(base);
  });

  it('adds a fresh slot for a new language without mutating the original', () => {
    const next = ensureLangProgress(base, 'german');
    expect(next).not.toBe(base);
    expect(next.progress.german).toEqual({
      level: 1,
      passedLevels: [],
      cardsMastered: [],
      currentLevelAttempts: 0,
    });
    // original untouched
    expect(base.progress.german).toBeUndefined();
  });
});
