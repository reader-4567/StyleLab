import React from 'react';
import {
  AlignLeft,
  Box,
  Columns3,
  Layers,
  LayoutGrid,
  Move3d,
  Palette,
  PanelLeftClose,
  Play,
  Square,
  Timer,
  X,
} from 'lucide-react';
import { PLAYGROUNDS, PLAYGROUND_IDS } from '../data/playgrounds.js';

const PLAYGROUND_ICONS = {
  flexbox: Columns3,
  grid: LayoutGrid,
  'box-model': Box,
  typography: AlignLeft,
  gradients: Palette,
  shadows: Layers,
  borders: Square,
  transforms: Move3d,
  transitions: Timer,
  animations: Play,
};

export default function SidebarNav({
  activePlayground,
  onSelectPlayground,
  customPresets,
  mobileOpen,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
}) {
  const navContent = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 lg:hidden">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Playgrounds
        </span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="stylelab-scroll min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            CSS Modules
          </span>
          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse navigation sidebar"
              title="Collapse navigation sidebar"
              className="hidden rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:inline-flex dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <nav aria-label="CSS Playgrounds" className="space-y-0.5">
          {PLAYGROUND_IDS.map((id) => {
            const pg = PLAYGROUNDS[id];
            const Icon = PLAYGROUND_ICONS[id] || Box;
            const isActive = activePlayground === id;
            const savedCount = Array.isArray(customPresets?.[id]) ? customPresets[id].length : 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelectPlayground(id);
                  onCloseMobile?.();
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/70'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span className="truncate whitespace-nowrap">{pg.name}</span>
                </span>
                {savedCount > 0 ? (
                  <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                    {savedCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Changes update live and persist locally in your browser.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar */}
      {!collapsed ? (
        <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block lg:min-h-0 lg:overflow-hidden">
          {navContent}
        </aside>
      ) : null}

      {/* Mobile slide-over drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {navContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
