import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Lang } from './data';
import { AVATAR_OPTIONS, type Avatar, type Profile } from './profile';
import { ProfileMascot } from './ProfileMascot';

/** Languages shown in the new-profile language picker. Order = visual order
 *  in the grid. Native-script labels mirror what's used in the main app. */
const LANG_CHOICES: { value: Lang; label: string; short: string }[] = [
  { value: 'japanese', label: 'Japanese', short: '日本語' },
  { value: 'korean',   label: 'Korean',   short: '한국어' },
  { value: 'mandarin', label: 'Mandarin', short: '中文' },
  { value: 'spanish',  label: 'Spanish',  short: 'Español' },
  { value: 'french',   label: 'French',   short: 'Français' },
  { value: 'german',   label: 'German',   short: 'Deutsch' },
];

type Step = 'list' | 'name' | 'avatar' | 'language';

type Props = {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onCreate: (input: { name: string; avatar: Avatar; language: Lang }) => void;
  onDelete: (id: string) => void;
};

export function ProfilePicker({ profiles, onSelect, onCreate, onDelete }: Props) {
  // If no profiles exist, jump straight into new-profile flow.
  const [step, setStep] = useState<Step>(profiles.length === 0 ? 'name' : 'list');
  const [draftName, setDraftName] = useState('');
  const [draftAvatar, setDraftAvatar] = useState<Avatar | null>(null);
  // Increment to make the mascot celebrate once. The mascot mounts on first
  // render with a wave, then idles. Each click of Next / picking an existing
  // profile bumps this so the mascot plays a celebrate animation between
  // steps.
  const [celebrateKey, setCelebrateKey] = useState(0);
  const cheer = () => setCelebrateKey(k => k + 1);

  const startNew = () => {
    setDraftName('');
    setDraftAvatar(null);
    setStep('name');
    // Don't cheer here — entering the new-profile flow from the list isn't a
    // "the kid made a choice" moment; it's a UI affordance.
  };

  const finishNew = (language: Lang) => {
    if (!draftName.trim() || !draftAvatar) return;
    cheer();
    onCreate({ name: draftName.trim(), avatar: draftAvatar, language });
  };

  const handleSelect = (id: string) => {
    cheer();
    onSelect(id);
  };

  const advanceFromName = () => { cheer(); setStep('avatar'); };
  const advanceFromAvatar = () => { cheer(); setStep('language'); };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif] flex flex-col items-center justify-start p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 justify-center mb-6 sm:mb-10">
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-violet-500" />
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">Flashcards</h1>
        </div>

        {step === 'list' && (
          <ListStep
            profiles={profiles}
            onSelect={handleSelect}
            onNew={startNew}
            onDelete={onDelete}
          />
        )}

        {step === 'name' && (
          <NameStep
            name={draftName}
            setName={setDraftName}
            onBack={profiles.length > 0 ? () => setStep('list') : null}
            onNext={advanceFromName}
          />
        )}

        {step === 'avatar' && (
          <AvatarStep
            selected={draftAvatar}
            onSelect={setDraftAvatar}
            onBack={() => setStep('name')}
            onNext={advanceFromAvatar}
          />
        )}

        {step === 'language' && (
          <LanguageStep
            onBack={() => setStep('avatar')}
            onSelect={finishNew}
          />
        )}

        <div className="mt-8 sm:mt-10">
          <ProfileMascot celebrateKey={celebrateKey} />
        </div>
      </div>
    </div>
  );
}

function ListStep({
  profiles, onSelect, onNew, onDelete,
}: {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-6">Who's playing?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {profiles.map(p => (
          <div key={p.id} className="relative">
            <button
              onClick={() => onSelect(p.id)}
              className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-md hover:shadow-lg active:scale-95 transition-all flex flex-col items-center gap-2"
            >
              <span className="text-5xl sm:text-6xl">{p.avatar}</span>
              <span className="font-extrabold text-slate-800 truncate w-full text-center">{p.name}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
              aria-label={`Delete profile ${p.name}`}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-200 hover:bg-rose-300 text-slate-600 text-sm font-bold flex items-center justify-center shadow-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={onNew}
          className="bg-white/60 hover:bg-white border-2 border-dashed border-violet-400 rounded-3xl p-4 sm:p-6 flex flex-col items-center gap-2 text-violet-600 font-extrabold active:scale-95 transition-all"
        >
          <span className="text-5xl sm:text-6xl">+</span>
          <span>New profile</span>
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-slate-800 font-bold mb-4">
              Delete this profile? Progress will be lost.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="rounded-2xl px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">
                Keep it
              </button>
              <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }} className="rounded-2xl px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NameStep({ name, setName, onBack, onNext }: { name: string; setName: (s: string) => void; onBack: (() => void) | null; onNext: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-1">What's your name?</h2>
      <p className="text-sm sm:text-base text-slate-500 mb-6">Just a first name is fine.</p>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 16))}
        maxLength={16}
        placeholder="Your name"
        className="w-full max-w-xs mx-auto block bg-white rounded-2xl px-4 py-3 text-xl font-bold text-slate-800 text-center shadow-md outline-none ring-4 ring-violet-200 focus:ring-violet-400"
      />
      <div className="flex gap-3 justify-center mt-6">
        {onBack && (
          <button onClick={onBack} className="rounded-2xl px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">
            ← Back
          </button>
        )}
        <button
          disabled={!name.trim()}
          onClick={onNext}
          className="rounded-2xl px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed text-white font-extrabold shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function AvatarStep({ selected, onSelect, onBack, onNext }: { selected: Avatar | null; onSelect: (a: Avatar) => void; onBack: () => void; onNext: () => void }) {
  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-1">Pick your avatar</h2>
      <p className="text-sm sm:text-base text-slate-500 mb-6">Choose any one!</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4">
        {AVATAR_OPTIONS.map(av => {
          const active = selected === av;
          return (
            <button
              key={av}
              onClick={() => onSelect(av)}
              className={`aspect-square bg-white rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-md hover:shadow-lg active:scale-95 transition-all ${active ? 'ring-4 ring-violet-400 scale-105' : ''}`}
            >
              {av}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 justify-center mt-6">
        <button onClick={onBack} className="rounded-2xl px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">
          ← Back
        </button>
        <button
          disabled={!selected}
          onClick={onNext}
          className="rounded-2xl px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 disabled:cursor-not-allowed text-white font-extrabold shadow-[0_6px_0_0_rgb(91_33_182)] active:translate-y-1 active:shadow-none transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function LanguageStep({ onBack, onSelect }: { onBack: () => void; onSelect: (lang: Lang) => void }) {
  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 mb-1">Pick a language to start</h2>
      <p className="text-sm sm:text-base text-slate-500 mb-6">You can add more later.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {LANG_CHOICES.map(l => (
          <button
            key={l.value}
            onClick={() => onSelect(l.value)}
            className="bg-white rounded-2xl px-3 py-4 shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <div className="text-base sm:text-lg font-extrabold text-slate-800">{l.label}</div>
            <div className="text-base sm:text-lg text-slate-600">{l.short}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-center mt-6">
        <button onClick={onBack} className="rounded-2xl px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">
          ← Back
        </button>
      </div>
    </div>
  );
}
