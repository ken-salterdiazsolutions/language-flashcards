import { useState } from 'react';
import type { Lang } from '../models/data';
import type { Avatar, Profile } from '../models/profile';
import { AVATAR_OPTIONS } from '../models/profile';
import { LANG_THEME } from '../models/langTheme';
import { LEVELS } from '../models/levels';

const LANG_ORDER: Lang[] = ['japanese', 'korean', 'mandarin', 'spanish', 'french', 'german', 'ukrainian', 'italian', 'hindi'];

type Props = {
  activeProfile: Profile;
  profiles: Profile[];
  onClose: () => void;
  onRename: (name: string) => void;
  onSetAvatar: (avatar: Avatar) => void;
  onChangeLanguage: (lang: Lang) => void;
  onSelectProfile: (id: string) => void;
  onCreateNewProfile: () => void;
  onDeleteProfile: (id: string) => void;
};

export function ProfileSettings({
  activeProfile,
  profiles,
  onClose,
  onRename,
  onSetAvatar,
  onChangeLanguage,
  onSelectProfile,
  onCreateNewProfile,
  onDeleteProfile,
}: Props) {
  const [nameDraft, setNameDraft] = useState(activeProfile.name);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const totalLevels = Object.keys(LEVELS).length;

  // Commit name on blur so we don't thrash storage on every keystroke.
  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== activeProfile.name) onRename(trimmed);
    else setNameDraft(activeProfile.name);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-orange-100 via-pink-100 to-violet-200 font-[Nunito,system-ui,sans-serif]">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">

        <header className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={onClose}
            className="rounded-full bg-white/70 hover:bg-white px-4 py-2 font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            ← Back
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Settings</h1>
          <div className="w-[72px]" aria-hidden="true" />
        </header>

        {/* Name + avatar preview */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Your name</h2>
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-4xl sm:text-5xl shrink-0">
              {activeProfile.avatar}
            </span>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value.slice(0, 16))}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              maxLength={16}
              className="flex-1 bg-white rounded-2xl px-4 py-3 text-lg font-bold text-slate-800 shadow-md outline-none ring-4 ring-violet-200 focus:ring-violet-400"
            />
          </div>
        </section>

        {/* Avatar picker */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Avatar</h2>
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 sm:gap-3">
            {AVATAR_OPTIONS.map(av => {
              const active = activeProfile.avatar === av;
              return (
                <button
                  key={av}
                  onClick={() => onSetAvatar(av)}
                  className={`aspect-square bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md hover:shadow-lg active:scale-95 transition-all ${active ? 'ring-4 ring-violet-400 scale-105' : ''}`}
                >
                  {av}
                </button>
              );
            })}
          </div>
        </section>

        {/* Language picker with progress */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Language</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANG_ORDER.map(lang => {
              const t = LANG_THEME[lang];
              const active = activeProfile.currentLanguage === lang;
              const progress = activeProfile.progress[lang];
              const level = progress?.level ?? 1;
              const passed = progress?.passedLevels.length ?? 0;
              const hasProgress = !!progress && (passed > 0 || level > 1);
              return (
                <button
                  key={lang}
                  onClick={() => onChangeLanguage(lang)}
                  className={`${t.tileBg} ${t.tileBgHover} ${t.tileShadow} rounded-2xl px-3 py-4 text-white text-left active:translate-y-1 active:shadow-none transition-all relative ${active ? 'ring-4 ring-white' : ''}`}
                >
                  <div className="font-extrabold text-base sm:text-lg">{t.label}</div>
                  <div className="text-sm sm:text-base opacity-90">{t.short}</div>
                  {hasProgress && (
                    <div className="mt-2 inline-block bg-black/25 rounded-full px-2 py-0.5 text-xs font-bold">
                      L{level} · {passed}/{totalLevels}
                    </div>
                  )}
                  {active && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center text-sm font-extrabold shadow">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Profile list */}
        <section className="mb-10">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Profiles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profiles.map(p => {
              const isActive = p.id === activeProfile.id;
              return (
                <div key={p.id} className="relative">
                  <button
                    onClick={() => onSelectProfile(p.id)}
                    disabled={isActive}
                    className={`w-full bg-white rounded-2xl p-3 sm:p-4 shadow-md flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'ring-4 ring-violet-400 cursor-default' : 'hover:shadow-lg active:scale-95'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl">{p.avatar}</span>
                    <span className="font-extrabold text-slate-800 truncate w-full text-center text-sm sm:text-base">{p.name}</span>
                    {isActive && (
                      <span className="text-xs font-bold text-violet-600">Active</span>
                    )}
                  </button>
                  {!isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                      aria-label={`Delete profile ${p.name}`}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-200 hover:bg-rose-300 text-slate-600 text-sm font-bold flex items-center justify-center shadow-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={onCreateNewProfile}
              className="bg-white/60 hover:bg-white border-2 border-dashed border-violet-400 rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-1 text-violet-600 font-extrabold active:scale-95 transition-all"
            >
              <span className="text-4xl sm:text-5xl">+</span>
              <span className="text-sm sm:text-base">New profile</span>
            </button>
          </div>
        </section>

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
                <button onClick={() => { onDeleteProfile(confirmDelete); setConfirmDelete(null); }} className="rounded-2xl px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
