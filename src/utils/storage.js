const PREFS_KEY = 'stylelab_preferences_v1';
const PRESETS_KEY = 'stylelab_custom_presets_v1';

export function loadPreferences(storage = typeof window !== 'undefined' ? window.localStorage : null) {
  const defaults = {
    theme: 'light',
    activePlayground: 'flexbox',
    viewportSize: 'desktop',
    showExplanations: true,
    sidebarCollapsed: false,
    codePanelCollapsed: false,
    codePanelHeight: 164,
    rightPanelWidth: 320,
    statesByPlayground: {},
  };
  if (!storage) return defaults;

  try {
    const raw = storage.getItem(PREFS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      statesByPlayground: parsed.statesByPlayground || {},
    };
  } catch {
    return defaults;
  }
}

export function savePreferences(prefs, storage = typeof window !== 'undefined' ? window.localStorage : null) {
  if (!storage) return;
  try {
    storage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadCustomPresets(storage = typeof window !== 'undefined' ? window.localStorage : null) {
  if (!storage) return {};
  try {
    const raw = storage.getItem(PRESETS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCustomPreset(
  playgroundId,
  name,
  props,
  items,
  storage = typeof window !== 'undefined' ? window.localStorage : null
) {
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    return loadCustomPresets(storage);
  }
  const all = loadCustomPresets(storage);
  const existing = Array.isArray(all[playgroundId]) ? all[playgroundId] : [];
  const nextPreset = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: trimmedName,
    props: JSON.parse(JSON.stringify(props)),
    items: JSON.parse(JSON.stringify(items)),
    createdAt: Date.now(),
  };
  const updated = {
    ...all,
    [playgroundId]: [nextPreset, ...existing],
  };
  if (storage) {
    try {
      storage.setItem(PRESETS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }
  return updated;
}

export function deleteCustomPreset(
  playgroundId,
  presetId,
  storage = typeof window !== 'undefined' ? window.localStorage : null
) {
  const all = loadCustomPresets(storage);
  const existing = Array.isArray(all[playgroundId]) ? all[playgroundId] : [];
  const updated = {
    ...all,
    [playgroundId]: existing.filter((p) => p.id !== presetId),
  };
  if (storage) {
    try {
      storage.setItem(PRESETS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }
  return updated;
}
