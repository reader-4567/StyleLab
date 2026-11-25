import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Info,
  Maximize2,
  Minimize2,
  Minus,
  Monitor,
  PanelRightOpen,
  Pause,
  Play,
  Plus,
  RotateCw,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { getPreviewStyles, isLightHex } from '../utils/cssGenerator.js';
import { getPreviewDiagnostics } from '../utils/previewDiagnostics.js';

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', widthClass: 'w-full min-w-0', widthTag: '100%', Icon: Monitor },
  { id: 'tablet', label: 'Tablet', widthClass: 'w-[768px] shrink-0', widthTag: '768px', Icon: Tablet },
  { id: 'mobile', label: 'Mobile', widthClass: 'w-[375px] shrink-0', widthTag: '375px', Icon: Smartphone },
];

export default function PreviewCanvas({
  playground,
  props,
  items,
  selectedItemId,
  onSelectItem,
  onAddItem,
  onRemoveItem,
  onUpdateItemText,
  viewportSize,
  onChangeViewport,
  isFullscreen = false,
  onToggleFullscreen,
  rightPanelCollapsed = false,
  onExpandRightPanel,
}) {
  const [transitionActive, setTransitionActive] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(true);
  const [animationCycleKey, setAnimationCycleKey] = useState(0);
  const [measuredMetrics, setMeasuredMetrics] = useState({
    width: 0,
    height: 0,
    contentHeight: 0,
    lineCount: 1,
    computedDisplay: '',
  });
  const containerRef = useRef(null);

  const pgId = playground.id;
  const activeViewport = VIEWPORTS.find((v) => v.id === viewportSize) || VIEWPORTS[0];
  const canAdd = items.length < playground.maxItems;
  const canRemove = items.length > playground.minItems;

  const containerStyle = getPreviewStyles(pgId, props, {
    isTransitionActive: transitionActive,
    isAnimationPlaying: animationPlaying,
  });

  function measureContainer() {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cs = window.getComputedStyle(el);
    let lineCount = 1;
    let contentHeight = 0;

    if (pgId === 'flexbox' && el.children.length > 0) {
      const isCol = props.flexDirection === 'column' || props.flexDirection === 'column-reverse';
      const positions = new Set();
      let minTop = Infinity;
      let maxBottom = -Infinity;
      Array.from(el.children).forEach((child) => {
        const cr = child.getBoundingClientRect();
        positions.add(Math.round((isCol ? cr.left : cr.top) / 4));
        if (cr.top < minTop) minTop = cr.top;
        if (cr.bottom > maxBottom) maxBottom = cr.bottom;
      });
      lineCount = Math.max(1, positions.size);
      contentHeight = maxBottom > minTop ? Math.round(maxBottom - minTop) : 0;
    }

    setMeasuredMetrics({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      contentHeight,
      lineCount,
      computedDisplay: cs.display,
    });
  }

  useLayoutEffect(() => {
    measureContainer();
  }, [pgId, props, items, viewportSize, isFullscreen]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => {
      measureContainer();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pgId, props, items.length]);

  const diagnostics = getPreviewDiagnostics(pgId, props, items, measuredMetrics);

  function renderStageContent() {
    if (pgId === 'flexbox') {
      return (
        <div
          data-testid="flex-flow-context"
          className="min-w-0 leading-normal"
        >
          <div
            ref={containerRef}
            data-testid="preview-container"
            style={containerStyle}
            className="max-w-full overflow-x-auto rounded bg-white/90 p-2.5 outline-1 outline-dashed outline-blue-500/75 dark:bg-slate-900/90 dark:outline-blue-400/70"
          >
            {items.map((item, idx) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(isSelected ? null : item.id)}
                  style={{
                    flexGrow: item.flexGrow ?? 0,
                    flexShrink: item.flexShrink ?? 1,
                    flexBasis: item.flexBasis ?? 'auto',
                    alignSelf: item.alignSelf ?? 'auto',
                    order: item.order ?? 0,
                  }}
                  className={`min-w-0 max-w-full overflow-hidden rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500'
                  }`}
                >
                  <div className={`truncate font-mono text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    #{idx + 1}
                    {item.flexBasis && item.flexBasis !== 'auto' ? ` · ${item.flexBasis}` : ''}
                  </div>
                  <div className="truncate text-xs font-semibold">{item.text}</div>
                </button>
              );
            })}
          </div>
          {' '}
          <span
            data-testid="adjacent-inline-sibling"
            className="mt-1.5 inline-block rounded border border-dashed border-slate-300 bg-slate-100/90 px-2.5 py-1.5 align-top font-mono text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
          >
            Adjacent inline sibling
          </span>
        </div>
      );
    }

    if (pgId === 'grid') {
      return (
        <div
          ref={containerRef}
          data-testid="preview-container"
          style={containerStyle}
          className="w-full min-w-0 overflow-x-auto rounded bg-white/90 p-2.5 outline-1 outline-dashed outline-blue-500/70 dark:bg-slate-900/90 dark:outline-blue-400/70"
        >
          {items.map((item, idx) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(isSelected ? null : item.id)}
                style={{
                  gridColumn: item.colSpan > 1 ? `span ${item.colSpan}` : undefined,
                  gridRow: item.rowSpan > 1 ? `span ${item.rowSpan}` : undefined,
                }}
                className={`flex min-h-0 min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-md border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500'
                }`}
              >
                <span className={`block w-full truncate font-mono text-[10px] leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  Cell {idx + 1}
                  {item.colSpan > 1 || item.rowSpan > 1 ? ` (${item.colSpan}×${item.rowSpan})` : ''}
                </span>
                <span className="block w-full truncate text-xs font-semibold leading-tight">{item.text}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (pgId === 'box-model') {
      const contentWidth = props.boxSizing === 'border-box'
        ? Math.max(0, props.width - props.paddingLeft - props.paddingRight - props.borderWidth * 2)
        : props.width;
      const contentHeight = props.boxSizing === 'border-box'
        ? Math.max(0, props.height - props.paddingTop - props.paddingBottom - props.borderWidth * 2)
        : props.height;
      const calculatedBorderBoxW = props.boxSizing === 'border-box'
        ? Math.max(props.width, props.paddingLeft + props.paddingRight + props.borderWidth * 2)
        : props.width + props.paddingLeft + props.paddingRight + props.borderWidth * 2;
      const calculatedBorderBoxH = props.boxSizing === 'border-box'
        ? Math.max(props.height, props.paddingTop + props.paddingBottom + props.borderWidth * 2)
        : props.height + props.paddingTop + props.paddingBottom + props.borderWidth * 2;
      const displayBorderBoxW = measuredMetrics.width || calculatedBorderBoxW;
      const displayBorderBoxH = measuredMetrics.height || calculatedBorderBoxH;

      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <span>Border Box: {displayBorderBoxW} × {displayBorderBoxH}px</span>
            <span aria-hidden="true">·</span>
            <span>Content: {contentWidth} × {contentHeight}px</span>
          </div>

          <div className="flex flex-wrap items-start justify-center gap-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="inline-block rounded bg-amber-100/80 dark:bg-amber-950/50"
                title="Margin zone"
              >
                <div
                  ref={idx === 0 ? containerRef : undefined}
                  data-testid="preview-container"
                  style={{
                    ...containerStyle,
                    backgroundColor: 'rgba(16, 185, 129, 0.16)',
                  }}
                  className="relative flex items-center justify-center"
                >
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xs bg-blue-600/15 text-center font-mono text-xs font-medium text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-amber-300 dark:bg-amber-700" />
              Margin
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-blue-600" />
              Border
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-emerald-400/70" />
              Padding
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-xs bg-blue-300 dark:bg-blue-500/50" />
              Content
            </span>
          </div>
        </div>
      );
    }

    if (pgId === 'typography') {
      const lightText = isLightHex(props.color);
      return (
        <div
          className={`w-full space-y-4 rounded-md border p-6 ${
            lightText
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
          }`}
        >
          {items.map((item, idx) => (
            <div key={item.id} className="space-y-2">
              <p
                ref={idx === 0 ? containerRef : undefined}
                data-testid="preview-container"
                style={containerStyle}
                className="break-words outline-1 outline-dashed outline-slate-200 dark:outline-slate-800"
              >
                {item.text}
              </p>
              {idx === 0 ? (
                <div className="pt-2">
                  <label htmlFor="typography-sample-input" className="sr-only">
                    Sample text content
                  </label>
                  <input
                    id="typography-sample-input"
                    type="text"
                    value={item.text}
                    onChange={(e) => onUpdateItemText(item.id, e.target.value)}
                    placeholder="Type custom preview text..."
                    className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      );
    }

    if (pgId === 'gradients') {
      return (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="preview-checkerboard overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div
                data-testid="preview-container"
                style={containerStyle}
                className="flex h-44 w-full items-end p-4"
              >
                <span className="rounded bg-slate-950/65 px-2.5 py-1 font-mono text-xs font-medium text-white backdrop-blur-xs">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pgId === 'shadows') {
      const lightCard = isLightHex(props.cardBg);
      return (
        <div className="flex w-full flex-wrap items-center justify-center gap-6 rounded-md bg-slate-100/80 py-8 dark:bg-slate-800/30">
          {items.map((item) => (
            <div
              key={item.id}
              data-testid="preview-container"
              style={containerStyle}
              className={`flex h-36 w-52 flex-col justify-between p-4 ${
                lightCard ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              <span className={`font-mono text-[11px] ${lightCard ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.label}
              </span>
              <div>
                <div className="text-sm font-semibold">{item.text}</div>
                <div className={`mt-0.5 text-xs ${lightCard ? 'text-slate-500' : 'text-slate-300'}`}>
                  {props.layers.length} shadow {props.layers.length === 1 ? 'layer' : 'layers'}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pgId === 'borders') {
      return (
        <div className="flex w-full flex-wrap items-center justify-center gap-6 py-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              ref={idx === 0 ? containerRef : undefined}
              data-testid="preview-container"
              style={containerStyle}
              className="flex h-32 w-48 items-center justify-center bg-white p-4 text-center text-xs font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {item.text}
            </div>
          ))}
        </div>
      );
    }

    if (pgId === 'transforms') {
      return (
        <div className="flex w-full flex-wrap items-center justify-center gap-10 py-10">
          {items.map((item) => (
            <div key={item.id} className="relative h-32 w-40">
              {/* Ghost reference box at untransformed position */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-dashed border-slate-300 bg-slate-100/50 dark:border-slate-700 dark:bg-slate-800/30"
              />
              <div
                data-testid="preview-container"
                style={containerStyle}
                className="relative flex h-full w-full flex-col items-center justify-center rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-center text-white shadow-sm"
              >
                <span className="text-xs font-semibold">{item.text}</span>
                <span className="mt-1 font-mono text-[10px] text-blue-100">
                  {props.transformOrigin}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pgId === 'transitions') {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                data-testid="preview-container"
                onMouseEnter={() => setTransitionActive(true)}
                onMouseLeave={() => setTransitionActive(false)}
                onClick={() => setTransitionActive((prev) => !prev)}
                style={containerStyle}
                className="px-6 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                {item.text}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hover the element or use Toggle Active State to inspect the transition timing.
          </p>
        </div>
      );
    }

    if (pgId === 'animations') {
      return (
        <div className="flex w-full flex-wrap items-center justify-center gap-6 py-10">
          {items.map((item, idx) => {
            const staggeredDelay = Number(props.delay) + (idx * (props.staggerMs || 0)) / 1000;
            return (
              <div
                key={`${item.id}-${animationCycleKey}`}
                data-testid="preview-container"
                style={{
                  ...containerStyle,
                  animationDelay: `${staggeredDelay}s`,
                }}
                className="flex h-24 w-32 flex-col items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-3 text-center text-white shadow-sm"
              >
                <span className="text-xs font-semibold">{item.text}</span>
                <span className="mt-1 font-mono text-[10px] text-blue-100">
                  {props.keyframe}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  return (
    <section
      aria-label="Interactive Preview"
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Preview Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {playground.name}
            </h2>
            <span className="hidden text-xs text-slate-400 sm:inline" aria-hidden="true">·</span>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              {playground.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Playground-specific playback / state triggers */}
          {pgId === 'transitions' ? (
            <button
              type="button"
              onClick={() => setTransitionActive((prev) => !prev)}
              className={`rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                transitionActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {transitionActive ? 'Reset Hover State' : 'Toggle Active State'}
            </button>
          ) : null}

          {pgId === 'animations' ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAnimationPlaying((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {animationPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnimationPlaying(true);
                  setAnimationCycleKey((k) => k + 1);
                }}
                aria-label="Restart animation"
                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Restart</span>
              </button>
            </div>
          ) : null}

          {/* Add / Remove Elements */}
          <div className="flex items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={onRemoveItem}
              disabled={!canRemove}
              aria-label="Remove preview element"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="border-x border-slate-200 px-2 py-1 font-mono text-[11px] tabular-nums text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
            <button
              type="button"
              onClick={onAddItem}
              disabled={!canAdd}
              aria-label="Add preview element"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Responsive Preview Viewport Switcher */}
          <div
            role="group"
            aria-label="Preview viewport size"
            className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950"
          >
            {VIEWPORTS.map(({ id, label, Icon }) => {
              const isActive = viewportSize === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeViewport(id)}
                  aria-label={`${label} preview`}
                  aria-pressed={isActive}
                  title={`${label} preview`}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Fullscreen Workspace Toggle */}
          {onToggleFullscreen ? (
            <button
              type="button"
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen workspace'}
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                isFullscreen
                  ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          ) : null}

          {rightPanelCollapsed && onExpandRightPanel ? (
            <button
              type="button"
              onClick={onExpandRightPanel}
              aria-label="Show properties panel"
              title="Show properties panel"
              className="hidden items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap lg:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <PanelRightOpen className="h-3.5 w-3.5" />
              <span>Properties</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Preview Stage Area */}
      <div
        data-testid="preview-stage"
        className={`preview-canvas-grid stylelab-scroll flex min-h-[260px] flex-1 overflow-auto lg:min-h-0 ${
          isFullscreen ? 'p-2 sm:p-3' : 'p-4 sm:p-6'
        }`}
      >
        <div
          data-viewport={activeViewport.id}
          className={`${activeViewport.widthClass} m-auto transition-[width] duration-200`}
        >
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 px-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>{activeViewport.label} Preview</span>
              <span className="tabular-nums text-slate-400 dark:text-slate-500">
                ({activeViewport.widthTag})
              </span>
            </div>
            {['flexbox', 'grid', 'typography', 'borders'].includes(pgId) && measuredMetrics.width > 0 ? (
              <div
                data-testid="computed-dimensions"
                className="flex flex-wrap items-center gap-2 tabular-nums text-slate-600 dark:text-slate-300"
              >
                <span>
                  {measuredMetrics.width} × {measuredMetrics.height}px
                </span>
                {pgId === 'flexbox' ? (
                  <>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span className="text-blue-700 dark:text-blue-400">
                      {props.display === 'inline-flex' ? 'inline-flex (shrink-to-fit)' : 'flex (block · fills row)'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span>
                      {measuredMetrics.lineCount} {measuredMetrics.lineCount === 1 ? 'line' : 'lines'}
                    </span>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Outer Preview Workspace (neutral page/flow surface separated from the CSS demo element) */}
          <div
            data-testid="outer-preview-workspace"
            className={`min-w-0 rounded-lg border border-slate-200 bg-white/60 shadow-xs backdrop-blur-[1px] dark:border-slate-800 dark:bg-slate-900/50 ${
              isFullscreen ? 'p-2.5 sm:p-3' : 'p-4'
            }`}
          >
            {renderStageContent()}
          </div>

          {/* Contextual CSS Behavior Notes */}
          {diagnostics.length > 0 ? (
            <div
              data-testid="preview-diagnostics"
              className="mt-2.5 space-y-1.5 rounded-md border border-slate-200 bg-white/85 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
            >
              {diagnostics.slice(0, 2).map((note) => (
                <div key={note.id} className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="min-w-0 leading-relaxed">
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {note.title}:{' '}
                    </span>
                    <span>{note.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
