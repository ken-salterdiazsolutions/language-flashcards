import MultilingualFlashcards from './MultilingualFlashcards';
import { ProfilePicker } from './ProfilePicker';
import { useProfile } from './hooks/useProfile';

function App() {
  const profile = useProfile();

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

  return (
    <MultilingualFlashcards
      activeProfile={profile.activeProfile}
      onSwitchProfile={() => profile.selectProfile(null)}
      onChangeLanguage={profile.setCurrentLanguage}
    />
  );
}

export default App;
