import { useState } from 'react';
import MultilingualFlashcards from './MultilingualFlashcards';
import { ProfilePicker } from './components/ProfilePicker';
import { Home } from './components/Home';
import { LevelPicker } from './components/LevelPicker';
import { ProfileSettings } from './components/ProfileSettings';
import { useProfile } from './hooks/useProfile';
import { getLevelCards, MAX_LEVEL } from './models/levels';

type Route =
  | { kind: 'home' }
  | { kind: 'levels' }
  | { kind: 'freeplay' }
  | { kind: 'practice'; level: number }
  | { kind: 'settings' };

function App() {
  const profile = useProfile();
  const [route, setRoute] = useState<Route>({ kind: 'home' });

  // If no active profile, show the picker. Picker creating or selecting
  // a profile flips this on automatically (state in useProfile updates).
  if (!profile.activeProfile) {
    return (
      <ProfilePicker
        profiles={profile.profiles}
        onSelect={profile.selectProfile}
        onCreate={profile.addProfile}
        onDelete={profile.deleteProfile}
      />
    );
  }

  const activeProfile = profile.activeProfile;
  const goHome = () => setRoute({ kind: 'home' });
  const goSettings = () => setRoute({ kind: 'settings' });

  if (route.kind === 'settings') {
    return (
      <ProfileSettings
        activeProfile={activeProfile}
        profiles={profile.profiles}
        onClose={goHome}
        onRename={profile.renameActive}
        onSetAvatar={profile.setAvatar}
        onChangeLanguage={(lang) => {
          profile.setCurrentLanguage(lang);
          // Always land on Home after a language change — current level cards
          // for the old language wouldn't make sense in the new one.
          goHome();
        }}
        onSelectProfile={(id) => {
          profile.selectProfile(id);
          goHome();
        }}
        onCreateNewProfile={() => {
          // Drop active profile → ProfilePicker takes over and runs its
          // new-profile flow (it auto-enters create when profiles.length===0,
          // and shows a "+ New profile" tile otherwise).
          profile.selectProfile(null);
        }}
        onDeleteProfile={profile.deleteProfile}
      />
    );
  }

  if (route.kind === 'home') {
    const lang = activeProfile.currentLanguage;
    const currentLevel = activeProfile.progress[lang]?.level ?? 1;
    return (
      <Home
        activeProfile={activeProfile}
        onOpenSettings={goSettings}
        onPracticeLevels={() => setRoute({ kind: 'levels' })}
        onFreePlay={() => setRoute({ kind: 'freeplay' })}
        onContinue={() => setRoute({
          kind: 'practice',
          // Cap at MAX_LEVEL so a "completed" profile can still re-enter the last level.
          level: Math.min(currentLevel, MAX_LEVEL),
        })}
      />
    );
  }

  if (route.kind === 'levels') {
    return (
      <LevelPicker
        activeProfile={activeProfile}
        onBack={goHome}
        onPickLevel={(level) => setRoute({ kind: 'practice', level })}
      />
    );
  }

  if (route.kind === 'practice') {
    const cards = getLevelCards(route.level);
    return (
      <MultilingualFlashcards
        activeProfile={activeProfile}
        onOpenSettings={goSettings}
        levelMode={{
          cards,
          levelNumber: route.level,
          onBack: () => setRoute({ kind: 'levels' }),
          onPassLevel: () => {
            profile.passLevel(activeProfile.currentLanguage, route.level);
            setRoute({ kind: 'levels' });
          },
        }}
      />
    );
  }

  // route.kind === 'freeplay'
  return (
    <MultilingualFlashcards
      activeProfile={activeProfile}
      onOpenSettings={goSettings}
      onHome={goHome}
    />
  );
}

export default App;
