import React, { useEffect, useMemo, useState } from 'react';
import { PLAYGROUNDS } from './data/playgrounds.js';
import { generateCssCode } from './utils/cssGenerator.js';
import {
  deleteCustomPreset,
  loadCustomPresets,
  loadPreferences,
  saveCustomPreset,
  savePreferences,
} from './utils/storage.js';
import PlaygroundWorkspace from './components/PlaygroundWorkspace.jsx';

function buildInitialStates(savedStates) {
  const result = {};
  Object.values(PLAYGROUNDS).forEach((pg) => {
    const saved = savedStates?.[pg.id];
    result[pg.id] = {
      props: saved?.props
        ? { ...pg.defaultProps, ...saved.props }
        : JSON.parse(JSON.stringify(pg.defaultProps)),
      items: Array.isArray(saved?.items) && saved.items.length > 0
        ? saved.items
        : JSON.parse(JSON.stringify(pg.defaultItems)),
    };
  });
  return result;
}

export default function App() {
  const initialPrefs = useMemo(() => loadPreferences(), []);

  const [theme, setTheme] = useState(initialPrefs.theme === 'dark' ? 'dark' : 'light');
  const [activePlayground, setActivePlayground] = useState(
    PLAYGROUNDS[initialPrefs.activePlayground] ? initialPrefs.activePlayground : 'flexbox'
  );
  const [viewportSize, setViewportSize] = useState(
    ['desktop', 'tablet', 'mobile'].includes(initialPrefs.viewportSize)
      ? initialPrefs.viewportSize
      : 'desktop'
  );
  const [showExplanations, setShowExplanations] = useState(
    initialPrefs.showExplanations !== undefined ? Boolean(initialPrefs.showExplanations) : true
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    Boolean(initialPrefs.sidebarCollapsed)
  );
  const [codePanelCollapsed, setCodePanelCollapsed] = useState(
    Boolean(initialPrefs.codePanelCollapsed)
  );
  const [codePanelHeight, setCodePanelHeight] = useState(
    typeof initialPrefs.codePanelHeight === 'number' && initialPrefs.codePanelHeight >= 96
      ? initialPrefs.codePanelHeight
      : 164
  );
  const [rightPanelWidth, setRightPanelWidth] = useState(
    typeof initialPrefs.rightPanelWidth === 'number' && initialPrefs.rightPanelWidth >= 260
      ? initialPrefs.rightPanelWidth
      : 320
  );
  const [statesByPlayground, setStatesByPlayground] = useState(() =>
    buildInitialStates(initialPrefs.statesByPlayground)
  );
  const [customPresets, setCustomPresets] = useState(() => loadCustomPresets());
  const [selectedItemId, setSelectedItemId] = useState(null);

  const playground = PLAYGROUNDS[activePlayground];
  const currentState = statesByPlayground[activePlayground] || {
    props: playground.defaultProps,
    items: playground.defaultItems,
  };

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist preferences & playground state in LocalStorage
  useEffect(() => {
    savePreferences({
      theme,
      activePlayground,
      viewportSize,
      showExplanations,
      sidebarCollapsed,
      codePanelCollapsed,
      codePanelHeight,
      rightPanelWidth,
      statesByPlayground,
    });
  }, [
    theme,
    activePlayground,
    viewportSize,
    showExplanations,
    sidebarCollapsed,
    codePanelCollapsed,
    codePanelHeight,
    rightPanelWidth,
    statesByPlayground,
  ]);

  const cssCode = useMemo(
    () => generateCssCode(activePlayground, currentState.props, currentState.items),
    [activePlayground, currentState.props, currentState.items]
  );

  function handleSelectPlayground(id) {
    setActivePlayground(id);
    setSelectedItemId(null);
  }

  function handleChangeProp(key, value) {
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        ...prev[activePlayground],
        props: {
          ...prev[activePlayground].props,
          [key]: value,
        },
      },
    }));
  }

  function handleApplyPropsPatch(patch) {
    if (!patch || typeof patch !== 'object') return;
    const clonedPatch = JSON.parse(JSON.stringify(patch));
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        ...prev[activePlayground],
        props: {
          ...prev[activePlayground].props,
          ...clonedPatch,
        },
      },
    }));
  }

  function handleAddItem() {
    if (currentState.items.length >= playground.maxItems) return;
    const nextIdx = currentState.items.length + 1;
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const defaultItem = {
      id: newId,
      label: String(nextIdx).padStart(2, '0'),
      text:
        activePlayground === 'typography'
          ? 'Additional sample paragraph demonstrating vertical spacing and typographic consistency.'
          : `Item ${nextIdx}`,
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      alignSelf: 'auto',
      order: 0,
      colSpan: 1,
      rowSpan: 1,
    };

    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        ...prev[activePlayground],
        items: [...prev[activePlayground].items, defaultItem],
      },
    }));
  }

  function handleRemoveItem() {
    if (currentState.items.length <= playground.minItems) return;
    const removed = currentState.items[currentState.items.length - 1];
    if (selectedItemId === removed?.id) {
      setSelectedItemId(null);
    }
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        ...prev[activePlayground],
        items: prev[activePlayground].items.slice(0, -1),
      },
    }));
  }

  function handleUpdateItemProp(itemId, key, value) {
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        ...prev[activePlayground],
        items: prev[activePlayground].items.map((item) =>
          item.id === itemId ? { ...item, [key]: value } : item
        ),
      },
    }));
  }

  function handleReset() {
    setSelectedItemId(null);
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        props: JSON.parse(JSON.stringify(playground.defaultProps)),
        items: JSON.parse(JSON.stringify(playground.defaultItems)),
      },
    }));
  }

  function handleApplyPreset(preset) {
    setSelectedItemId(null);
    setStatesByPlayground((prev) => ({
      ...prev,
      [activePlayground]: {
        props: JSON.parse(JSON.stringify({ ...playground.defaultProps, ...preset.props })),
        items: Array.isArray(preset.items) && preset.items.length > 0
          ? JSON.parse(JSON.stringify(preset.items))
          : prev[activePlayground].items,
      },
    }));
  }

  function handleSaveCustomPreset(name) {
    const updated = saveCustomPreset(
      activePlayground,
      name,
      currentState.props,
      currentState.items
    );
    setCustomPresets(updated);
  }

  function handleDeleteCustomPreset(presetId) {
    const updated = deleteCustomPreset(activePlayground, presetId);
    setCustomPresets(updated);
  }

  return (
    <PlaygroundWorkspace
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      playground={playground}
      activePlayground={activePlayground}
      onSelectPlayground={handleSelectPlayground}
      props={currentState.props}
      onChangeProp={handleChangeProp}
      onApplyExampleProps={handleApplyPropsPatch}
      items={currentState.items}
      selectedItemId={selectedItemId}
      onSelectItem={setSelectedItemId}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onUpdateItemProp={handleUpdateItemProp}
      onReset={handleReset}
      onApplyPreset={handleApplyPreset}
      customPresets={customPresets}
      onSaveCustomPreset={handleSaveCustomPreset}
      onDeleteCustomPreset={handleDeleteCustomPreset}
      showExplanations={showExplanations}
      onToggleExplanations={() => setShowExplanations((v) => !v)}
      viewportSize={viewportSize}
      onChangeViewport={setViewportSize}
      cssCode={cssCode}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebarCollapsed={() => setSidebarCollapsed((c) => !c)}
      codePanelCollapsed={codePanelCollapsed}
      onToggleCodePanelCollapsed={() => setCodePanelCollapsed((c) => !c)}
      codePanelHeight={codePanelHeight}
      onChangeCodePanelHeight={setCodePanelHeight}
      rightPanelWidth={rightPanelWidth}
      onChangeRightPanelWidth={setRightPanelWidth}
    />
  );
}
