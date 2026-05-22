'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePrefsStore } from '@/store/prefsStore';
import { useUIStore } from '@/store/uiStore';
import { useTasksStore } from '@/store/tasksStore';
import storage, { STORAGE_KEYS } from '@/lib/storage';
import { COLORS } from '@/lib/tokens';

const ACCENT_PRESETS = [
  { label: 'Gold',    value: '#D4AF37' },
  { label: 'Emerald', value: '#6EE7B7' },
  { label: 'Amber',   value: '#F59E0B' },
  { label: 'Sky',     value: '#38BDF8' },
  { label: 'Rose',    value: '#FB7185' },
  { label: 'Violet',  value: '#A78BFA' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{ background: COLORS.surface, borderColor: COLORS.border }}
    >
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4">{title}</p>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-white/60 flex-shrink-0">{label}</label>
      <div className="flex-1 max-w-xs">{children}</div>
    </div>
  );
}

export function SettingsPanel() {
  const user = useAuthStore((s) => s.user);
  const { prefs, updatePrefs, hydrate, resetPrefs } = usePrefsStore();
  const showToast = useUIStore((s) => s.showToast);
  const hydrateTasks = useTasksStore((s) => s.hydrate);

  const [name, setName] = useState(prefs.displayName);
  const [role, setRole] = useState(prefs.role);
  const [showDanger, setShowDanger] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { setName(prefs.displayName); setRole(prefs.role); }, [prefs.displayName, prefs.role]);

  function handleSaveProfile() {
    updatePrefs({ displayName: name.trim() || prefs.displayName, role: role.trim() || prefs.role });
    showToast('Profile saved', 'success');
  }

  function handleAccentChange(color: string) {
    updatePrefs({ accentColor: color });
    showToast('Accent updated');
  }

  function handleNotificationToggle() {
    updatePrefs({ notifications: !prefs.notifications });
    showToast(prefs.notifications ? 'Notifications off' : 'Notifications on');
  }

  function handleResetPrefs() {
    resetPrefs();
    showToast('Preferences reset');
  }

  async function handleClearAllData() {
    storage.removeItem(STORAGE_KEYS.TASKS);
    storage.removeItem(STORAGE_KEYS.ACTIVITY);
    storage.removeItem(STORAGE_KEYS.PREFERENCES);
    resetPrefs();
    await hydrateTasks();
    setShowDanger(false);
    showToast('All data cleared', 'error');
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-semibold">Settings</h3>
        <p className="text-xs text-white/35 mt-1">Workspace preferences and configuration</p>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div className="space-y-3">
          <FieldRow label="Display Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm text-white bg-transparent outline-none"
              style={{ borderColor: COLORS.border }}
              placeholder="Your name"
            />
          </FieldRow>
          <FieldRow label="Role">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm text-white bg-transparent outline-none"
              style={{ borderColor: COLORS.border }}
              placeholder="Your role"
            />
          </FieldRow>
          <FieldRow label="Email">
            <p className="text-sm text-white/40 px-3 py-2">{user?.email ?? '—'}</p>
          </FieldRow>
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
              style={{ background: prefs.accentColor, color: COLORS.bgBase }}
            >
              Save Profile
            </button>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="space-y-4">
          <FieldRow label="Accent Color">
            <div className="flex gap-2 flex-wrap">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleAccentChange(p.value)}
                  title={p.label}
                  className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    background: p.value,
                    borderColor: prefs.accentColor === p.value ? 'white' : 'transparent',
                    boxShadow: prefs.accentColor === p.value ? `0 0 0 1px ${p.value}` : 'none',
                  }}
                />
              ))}
              {/* Custom colour input */}
              <label className="w-7 h-7 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors relative overflow-hidden" title="Custom color">
                <span className="text-white/40 text-xs">+</span>
                <input
                  type="color"
                  value={prefs.accentColor}
                  onChange={(e) => handleAccentChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </FieldRow>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <FieldRow label="In-app notifications">
          <div className="flex justify-end">
            <button
              onClick={handleNotificationToggle}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              style={{ background: prefs.notifications ? prefs.accentColor : 'rgba(255,255,255,0.15)' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: prefs.notifications ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        </FieldRow>
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone">
        <div className="space-y-3">
          <FieldRow label="Reset preferences">
            <div className="flex justify-end">
              <button
                onClick={handleResetPrefs}
                className="px-3 py-1.5 rounded-lg text-xs border transition-opacity hover:opacity-70"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
              >
                Reset to defaults
              </button>
            </div>
          </FieldRow>

          {!showDanger ? (
            <FieldRow label="Clear all workspace data">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDanger(true)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-red-500/30 text-red-400 transition-opacity hover:opacity-70"
                >
                  Clear data…
                </button>
              </div>
            </FieldRow>
          ) : (
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{ borderColor: 'rgba(239,68,68,0.30)', background: 'rgba(239,68,68,0.06)' }}
            >
              <p className="text-sm text-red-300">
                This will permanently delete all tasks, activity history, and preferences.
                This cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDanger(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border text-white/50 hover:text-white/80 transition-colors"
                  style={{ borderColor: COLORS.border }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllData}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-400 transition-colors"
                >
                  Yes, clear everything
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
