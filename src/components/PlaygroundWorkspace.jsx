import React, { useEffect, useRef, useState } from 'react';
import {
  Code,
  ExternalLink,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  X,
} from 'lucide-react';
import SidebarNav from './SidebarNav.jsx';
import PreviewCanvas from './PreviewCanvas.jsx';
import CodePanel from './CodePanel.jsx';
import PropertyControls from './PropertyControls.jsx';
import ExportModal from './ExportModal.jsx';
import LearningPanel from './LearningPanel.jsx';
import { getModuleLearningGuide } from '../data/learningGuides.js';

const MIN_CODE_HEIGHT = 96;
const MIN_PREVIEW_HEIGHT = 180;
const MIN_RIGHT_WIDTH = 260;
const MAX_RIGHT_WIDTH = 520;
const MIN_PREVIEW_WIDTH = 320;

export default function PlaygroundWorkspace({
  theme,
  onToggleTheme,
  playground,
  activePlayground,
  onSelectPlayground,
  props,
  onChangeProp,
  onApplyExampleProps,
  items,
  selectedItemId,
  onSelectItem,
  onAddItem,
  onRemoveItem,
  onUpdateItemProp,
  onReset,
  onApplyPreset,
  customPresets,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  showExplanations,
  onToggleExplanations,
  viewportSize,
  onChangeViewport,
  cssCode,
  sidebarCollapsed,
  onToggleSidebarCollapsed,
  codePanelCollapsed,
  onToggleCodePanelCollapsed,
  codePanelHeight,
  onChangeCodePanelHeight,
  rightPanelWidth,
  onChangeRightPanelWidth,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const [learningPropertyId, setLearningPropertyId] = useState(
    () => getModuleLearningGuide(activePlayground)?.properties?.[0]?.id || null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenBlockedNotice, setFullscreenBlockedNotice] = useState(false);

  // Fullscreen-local panel collapse states so entering/exiting fullscreen
  // never clobbers the user's saved normal-mode layout preferences.
  const [fsSidebarCollapsed, setFsSidebarCollapsed] = useState(true);
  const [fsCodeCollapsed, setFsCodeCollapsed] = useState(true);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const [workspaceDims, setWorkspaceDims] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));

  const workspaceRef = useRef(null);
  const mainRef = useRef(null);
  const wasFullscreenRef = useRef(false);

  // Measure actual workspace container dimensions (adapts to fullscreen, resize, and browser zoom)
  useEffect(() => {
    const el = workspaceRef.current;
    function updateDims() {
      const rect = el?.getBoundingClientRect();
      setWorkspaceDims({
        width: rect?.width || window.innerWidth,
        height: rect?.height || window.innerHeight,
      });
    }
    updateDims();

    let observer = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateDims);
      if (el) observer.observe(el);
      if (mainRef.current) observer.observe(mainRef.current);
    }
    window.addEventListener('resize', updateDims);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateDims);
    };
  }, []);

  // Sync strictly with native Fullscreen API (fullscreenchange)
  useEffect(() => {
    function handleFullscreenChange() {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement || null;
      const active = Boolean(fsEl);
      if (active && !wasFullscreenRef.current) {
        // Entering fullscreen: collapse sidebar & Generated CSS by default, keep properties open
        setFsSidebarCollapsed(true);
        setFsCodeCollapsed(true);
        setRightPanelCollapsed(false);
        setFullscreenBlockedNotice(false);
      }
      wasFullscreenRef.current = active;
      setIsFullscreen(active);
      setWorkspaceDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keep selected learning topic aligned when switching playground modules
  useEffect(() => {
    const firstPropId = getModuleLearningGuide(activePlayground)?.properties?.[0]?.id || null;
    setLearningPropertyId(firstPropId);
  }, [activePlayground]);

  // Escape closes export modal, learning panel, mobile drawer, or active native fullscreen
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== 'Escape') return;
      if (exportOpen) {
        setExportOpen(false);
      } else if (learningOpen) {
        setLearningOpen(false);
      } else if (mobileNavOpen) {
        setMobileNavOpen(false);
      } else if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exportOpen, learningOpen, mobileNavOpen]);

  function handleToggleLearning() {
    setLearningOpen((prev) => {
      const next = !prev;
      if (next && !learningPropertyId) {
        setLearningPropertyId(getModuleLearningGuide(activePlayground)?.properties?.[0]?.id || null);
      }
      return next;
    });
  }

  function handleOpenLearningProperty(propId) {
    if (propId) {
      setLearningPropertyId(propId);
    }
    setLearningOpen(true);
  }

  async function handleToggleFullscreen() {
    const el = workspaceRef.current;
    if (!el) return;

    const currentFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (currentFs) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } catch {
        // fullscreenchange listener keeps state accurate
      }
      return;
    }

    const canFullscreen =
      document.fullscreenEnabled !== false || document.webkitFullscreenEnabled === true;

    if (!canFullscreen || (!el.requestFullscreen && !el.webkitRequestFullscreen)) {
      setFullscreenBlockedNotice(true);
      return;
    }

    try {
      setFullscreenBlockedNotice(false);
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      // Embedded iframe or browser policy denied native fullscreen
      setFullscreenBlockedNotice(true);
    }
  }

  function clampCodeHeight(targetHeight) {
    const mainHeight = mainRef.current?.getBoundingClientRect().height || workspaceDims.height - 48;
    const maxAllowed = Math.max(MIN_CODE_HEIGHT + 40, mainHeight - MIN_PREVIEW_HEIGHT);
    return Math.round(Math.min(maxAllowed, Math.max(MIN_CODE_HEIGHT, targetHeight)));
  }

  function clampRightWidth(targetWidth) {
    const sidebarW = effectiveSidebarCollapsed ? 0 : 224;
    const maxAllowed = Math.max(
      MIN_RIGHT_WIDTH,
      Math.min(MAX_RIGHT_WIDTH, workspaceDims.width - sidebarW - MIN_PREVIEW_WIDTH)
    );
    return Math.round(Math.min(maxAllowed, Math.max(MIN_RIGHT_WIDTH, targetWidth)));
  }

  function handleStartCodeResize(e) {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = effectiveCodeHeight;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';

    function onPointerMove(moveEvent) {
      const delta = startY - moveEvent.clientY;
      onChangeCodePanelHeight(clampCodeHeight(startHeight + delta));
    }

    function onPointerUp() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function handleStartRightResize(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = effectiveRightWidth;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    function onPointerMove(moveEvent) {
      const delta = startX - moveEvent.clientX;
      onChangeRightPanelWidth?.(clampRightWidth(startWidth + delta));
    }

    function onPointerUp() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  const effectiveSidebarCollapsed = isFullscreen ? fsSidebarCollapsed : sidebarCollapsed;
  const effectiveCodeCollapsed = isFullscreen ? fsCodeCollapsed : codePanelCollapsed;
  const effectiveCodeHeight = clampCodeHeight(codePanelHeight);
  const effectiveRightWidth = clampRightWidth(rightPanelWidth);

  function handleToggleSidebar() {
    if (isFullscreen) {
      setFsSidebarCollapsed((v) => !v);
    } else {
      onToggleSidebarCollapsed();
    }
  }

  function handleToggleCodePanel() {
    if (isFullscreen) {
      setFsCodeCollapsed((v) => !v);
    } else {
      onToggleCodePanelCollapsed();
    }
  }

  const standaloneUrl = typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <div
      ref={workspaceRef}
      data-fullscreen={isFullscreen ? 'true' : 'false'}
      className={`stylelab-workspace relative flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 ${
        isFullscreen
          ? 'h-full w-full overflow-hidden'
          : 'min-h-screen lg:h-screen lg:overflow-hidden'
      }`}
    >
      {/* Top Bar */}
      <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open playground navigation"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleSidebar}
            aria-label={effectiveSidebarCollapsed ? 'Show CSS Modules sidebar' : 'Hide CSS Modules sidebar'}
            aria-expanded={!effectiveSidebarCollapsed}
            title={effectiveSidebarCollapsed ? 'Show CSS Modules sidebar' : 'Hide CSS Modules sidebar'}
            className="hidden items-center justify-center rounded-md border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:inline-flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {effectiveSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-slate-100">
            StyleLab
          </span>
        </div>

        <div className="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex">
          <span>Playground</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {playground.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 whitespace-nowrap dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Code className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Embedded preview notice if browser blocks native fullscreen */}
      {fullscreenBlockedNotice ? (
        <div
          role="status"
          className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200"
        >
          <span>
            Native fullscreen is restricted inside this embedded preview. Open StyleLab in a standalone browser tab to use fullscreen mode.
          </span>
          <div className="flex items-center gap-2">
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-amber-300 bg-white px-2 py-0.5 font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-100 dark:hover:bg-amber-900"
            >
              <span>Open Standalone Tab</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={() => setFullscreenBlockedNotice(false)}
              aria-label="Dismiss fullscreen notice"
              className="rounded p-1 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Three-Panel Workspace */}
      <div className="stylelab-scroll flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left Navigation Panel */}
        <SidebarNav
          activePlayground={activePlayground}
          onSelectPlayground={onSelectPlayground}
          customPresets={customPresets}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          collapsed={effectiveSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Center Preview + Resizable/Collapsible Generated CSS Panel */}
        <main ref={mainRef} className="flex min-h-[360px] shrink-0 flex-col overflow-hidden lg:min-h-0 lg:min-w-0 lg:flex-1 lg:shrink">
          <PreviewCanvas
            playground={playground}
            props={props}
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItemText={(itemId, text) => onUpdateItemProp(itemId, 'text', text)}
            viewportSize={viewportSize}
            onChangeViewport={onChangeViewport}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            rightPanelCollapsed={rightPanelCollapsed}
            onExpandRightPanel={() => setRightPanelCollapsed(false)}
          />
          <CodePanel
            cssCode={cssCode}
            onOpenExport={() => setExportOpen(true)}
            isCollapsed={effectiveCodeCollapsed}
            onToggleCollapse={handleToggleCodePanel}
            panelHeight={effectiveCodeHeight}
            onStartResize={handleStartCodeResize}
            onKeyResize={(delta) => onChangeCodePanelHeight(clampCodeHeight(effectiveCodeHeight + delta))}
          />
        </main>

        {/* Draggable Vertical Divider + Resizable Right Property Controls OR Docked Learning Panel */}
        {!learningOpen && !rightPanelCollapsed ? (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize Properties panel"
              aria-valuenow={effectiveRightWidth}
              tabIndex={0}
              onPointerDown={handleStartRightResize}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  onChangeRightPanelWidth?.(clampRightWidth(effectiveRightWidth + 16));
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  onChangeRightPanelWidth?.(clampRightWidth(effectiveRightWidth - 16));
                }
              }}
              title="Drag to resize Properties panel"
              className="group hidden w-1.5 shrink-0 cursor-col-resize touch-none items-center justify-center bg-slate-100/80 transition-colors hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none lg:flex dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <span className="h-8 w-0.5 rounded-full bg-slate-300 transition-colors group-hover:bg-blue-500 group-focus-visible:bg-blue-500 dark:bg-slate-700" />
            </div>

            <PropertyControls
              playground={playground}
              props={props}
              onChangeProp={onChangeProp}
              items={items}
              selectedItemId={selectedItemId}
              onUpdateItemProp={onUpdateItemProp}
              onReset={onReset}
              onApplyPreset={onApplyPreset}
              customPresets={customPresets[activePlayground] || []}
              onSaveCustomPreset={onSaveCustomPreset}
              onDeleteCustomPreset={onDeleteCustomPreset}
              showExplanations={showExplanations}
              onToggleExplanations={onToggleExplanations}
              learningOpen={learningOpen}
              onToggleLearning={handleToggleLearning}
              onOpenLearningProperty={handleOpenLearningProperty}
              onCollapsePanel={() => setRightPanelCollapsed(true)}
              panelWidth={effectiveRightWidth}
            />
          </>
        ) : (
          <div className="block lg:hidden">
            <PropertyControls
              playground={playground}
              props={props}
              onChangeProp={onChangeProp}
              items={items}
              selectedItemId={selectedItemId}
              onUpdateItemProp={onUpdateItemProp}
              onReset={onReset}
              onApplyPreset={onApplyPreset}
              customPresets={customPresets[activePlayground] || []}
              onSaveCustomPreset={onSaveCustomPreset}
              onDeleteCustomPreset={onDeleteCustomPreset}
              showExplanations={showExplanations}
              onToggleExplanations={onToggleExplanations}
              learningOpen={learningOpen}
              onToggleLearning={handleToggleLearning}
              onOpenLearningProperty={handleOpenLearningProperty}
            />
          </div>
        )}

        {/* Detailed Educational Learning Panel (docked on desktop, overlay on mobile; works in native fullscreen) */}
        <LearningPanel
          isOpen={learningOpen}
          onClose={() => setLearningOpen(false)}
          playgroundId={activePlayground}
          selectedPropertyId={learningPropertyId}
          onSelectPropertyId={setLearningPropertyId}
          currentProps={props}
          onApplyExampleProps={onApplyExampleProps}
        />
      </div>

      {/* Export Modal (inside workspaceRef so it renders in native fullscreen too) */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        playgroundId={activePlayground}
        playgroundName={playground.name}
        props={props}
        items={items}
        cssCode={cssCode}
      />
    </div>
  );
}
