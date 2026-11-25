import React, { useState } from 'react';
import { Check } from 'lucide-react';

function isPropsMatch(currentProps, exampleProps) {
  if (!currentProps || !exampleProps) return false;
  return Object.entries(exampleProps).every(([key, val]) => {
    if (Array.isArray(val)) return false;
    return currentProps[key] === val;
  });
}

function VisualOptionCard({ title, subtitle, isActive, onApply, children }) {
  const interactive = Boolean(onApply);
  const baseClass = `group flex flex-col gap-2 rounded-md border p-2.5 text-left transition-colors ${
    isActive
      ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
      : 'border-slate-200 bg-white hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600'
  }`;

  const header = (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </span>
      {interactive ? (
        <span
          className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-medium whitespace-nowrap ${
            isActive
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400'
          }`}
        >
          {isActive ? (
            <>
              <Check className="h-3 w-3" />
              <span>Active</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </span>
      ) : null}
    </div>
  );

  if (!interactive) {
    return (
      <div className={baseClass}>
        {header}
        {children}
        {subtitle ? (
          <span className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onApply}
      className={`${baseClass} w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500`}
    >
      {header}
      {children}
      {subtitle ? (
        <span className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {subtitle}
        </span>
      ) : null}
    </button>
  );
}

const EASING_PATHS = {
  'cubic-bezier(0.16, 1, 0.3, 1)': 'M 4 36 C 12 6, 20 4, 56 4',
  'cubic-bezier(0.34, 1.56, 0.64, 1)': 'M 4 36 C 18 -6, 32 0, 56 4',
  'ease-in-out': 'M 4 36 C 24 36, 36 4, 56 4',
  linear: 'M 4 36 L 56 4',
};

export default function LearningVisuals({ propertyGuide, currentProps, onApplyProps }) {
  const [transitionHoverId, setTransitionHoverId] = useState(null);
  const type = propertyGuide?.visualType;
  if (!type) return null;

  // 1. Flexbox: justify-content visual comparison
  if (type === 'flex-justify') {
    const options = [
      'flex-start',
      'center',
      'flex-end',
      'space-between',
      'space-around',
      'space-evenly',
    ];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((val) => (
          <VisualOptionCard
            key={val}
            title={val}
            isActive={currentProps?.justifyContent === val}
            onApply={() => onApplyProps({ justifyContent: val })}
          >
            <div
              style={{ display: 'flex', justifyContent: val }}
              className="w-full rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="h-5 w-5 rounded-xs bg-blue-600" />
              <span className="h-5 w-7 rounded-xs bg-blue-500" />
              <span className="h-5 w-5 rounded-xs bg-blue-400" />
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 2. Flexbox: align-items visual comparison
  if (type === 'flex-align-items') {
    const options = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((val) => (
          <VisualOptionCard
            key={val}
            title={val}
            isActive={currentProps?.alignItems === val}
            onApply={() => onApplyProps({ alignItems: val })}
          >
            <div
              style={{ display: 'flex', alignItems: val, gap: '6px' }}
              className="h-14 w-full rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="flex items-center justify-center rounded-xs bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                Aa
              </span>
              <span className="flex items-center justify-center rounded-xs bg-blue-500 px-1.5 py-1 text-sm font-bold text-white">
                Bb
              </span>
              <span className="flex items-center justify-center rounded-xs bg-blue-400 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Cc
              </span>
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 3. Flexbox: flex-direction
  if (type === 'flex-direction') {
    const options = ['row', 'row-reverse', 'column', 'column-reverse'];
    return (
      <div className="grid grid-cols-2 gap-2">
        {options.map((val) => (
          <VisualOptionCard
            key={val}
            title={val}
            isActive={currentProps?.flexDirection === val}
            onApply={() => onApplyProps({ flexDirection: val })}
          >
            <div
              style={{ display: 'flex', flexDirection: val, gap: '4px' }}
              className="h-16 w-full rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950"
            >
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="flex h-4 min-w-[18px] items-center justify-center rounded-xs bg-blue-600 px-1 font-mono text-[10px] font-semibold text-white"
                >
                  {n}
                </span>
              ))}
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 4. Flexbox: flex-wrap
  if (type === 'flex-wrap') {
    const options = ['nowrap', 'wrap', 'wrap-reverse'];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((val) => (
          <VisualOptionCard
            key={val}
            title={val}
            isActive={currentProps?.flexWrap === val}
            onApply={() => onApplyProps({ flexWrap: val })}
          >
            <div
              style={{ display: 'flex', flexWrap: val, gap: '4px' }}
              className="h-14 w-full overflow-hidden rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950"
            >
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className="flex h-5 w-9 shrink-0 items-center justify-center rounded-xs bg-blue-600 font-mono text-[10px] font-semibold text-white"
                >
                  {n}
                </span>
              ))}
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 5. Flexbox: align-content
  if (type === 'flex-align-content') {
    const options = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'stretch'];
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((val) => (
          <VisualOptionCard
            key={val}
            title={val}
            isActive={currentProps?.flexWrap !== 'nowrap' && currentProps?.alignContent === val}
            onApply={() => onApplyProps({ flexWrap: 'wrap', alignContent: val })}
          >
            <div
              style={{ display: 'flex', flexWrap: 'wrap', alignContent: val, gap: '3px' }}
              className="h-16 w-full rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span key={n} className="w-[30%] rounded-xs bg-blue-600 py-0.5 text-center font-mono text-[9px] text-white">
                  {n}
                </span>
              ))}
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 6. Flexbox: display / gap / height / item
  if (type === 'flex-display') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <VisualOptionCard
          title="display: flex"
          subtitle="Block-level: spans 100% width and pushes sibling below"
          isActive={currentProps?.display === 'flex'}
          onApply={() => onApplyProps({ display: 'flex' })}
        >
          <div className="w-full rounded border border-slate-300 bg-slate-50 p-1.5 leading-none dark:border-slate-700 dark:bg-slate-950">
            <div className="flex w-full gap-1 rounded border border-dashed border-blue-500 bg-blue-50/70 p-1 dark:bg-blue-950/40">
              <span className="rounded-xs bg-blue-600 px-2 py-0.5 text-[10px] text-white">A</span>
              <span className="rounded-xs bg-blue-600 px-2 py-0.5 text-[10px] text-white">B</span>
            </div>
            <span className="mt-1 inline-block rounded border border-dashed border-slate-300 bg-slate-200/80 px-1.5 py-0.5 font-mono text-[9px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              sibling
            </span>
          </div>
        </VisualOptionCard>
        <VisualOptionCard
          title="display: inline-flex"
          subtitle="Inline-level: shrink-wraps items and sits beside sibling"
          isActive={currentProps?.display === 'inline-flex'}
          onApply={() => onApplyProps({ display: 'inline-flex' })}
        >
          <div className="w-full rounded border border-slate-300 bg-slate-50 p-1.5 leading-none dark:border-slate-700 dark:bg-slate-950">
            <div className="inline-flex gap-1 rounded border border-dashed border-blue-500 bg-blue-50/70 p-1 dark:bg-blue-950/40">
              <span className="rounded-xs bg-blue-600 px-2 py-0.5 text-[10px] text-white">A</span>
              <span className="rounded-xs bg-blue-600 px-2 py-0.5 text-[10px] text-white">B</span>
            </div>
            {' '}
            <span className="inline-block rounded border border-dashed border-slate-300 bg-slate-200/80 px-1.5 py-0.5 align-top font-mono text-[9px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              sibling
            </span>
          </div>
        </VisualOptionCard>
      </div>
    );
  }

  if (type === 'flex-gap' || type === 'flex-height') {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map((item) => (
          <VisualOptionCard
            key={item.value}
            title={item.label}
            isActive={isPropsMatch(currentProps, item.applyProps)}
            onApply={() => onApplyProps(item.applyProps)}
          >
            <div
              style={{
                display: 'flex',
                gap: type === 'flex-gap' ? `${item.applyProps.gap}px` : '6px',
                alignItems: 'center',
                height: type === 'flex-height' ? `${Math.round(item.applyProps.containerHeight / 5.5)}px` : '36px',
              }}
              className="w-full rounded border border-dashed border-slate-300 bg-slate-50 px-2 dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="h-4 flex-1 rounded-xs bg-blue-600" />
              <span className="h-4 flex-1 rounded-xs bg-blue-500" />
              <span className="h-4 flex-1 rounded-xs bg-blue-400" />
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  if (type === 'flex-item') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <VisualOptionCard title="flex-grow: 0 (default)" subtitle="All items keep natural content width">
          <div className="flex w-full gap-1.5 rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
            <span className="rounded-xs bg-slate-400 px-2 py-1 text-[10px] text-white">1</span>
            <span className="rounded-xs bg-blue-600 px-2 py-1 text-[10px] text-white">2</span>
            <span className="rounded-xs bg-slate-400 px-2 py-1 text-[10px] text-white">3</span>
          </div>
        </VisualOptionCard>
        <VisualOptionCard title="Item #2: flex-grow: 1" subtitle="Item #2 expands to fill remaining space">
          <div className="flex w-full gap-1.5 rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
            <span className="rounded-xs bg-slate-400 px-2 py-1 text-[10px] text-white">1</span>
            <span className="flex-1 rounded-xs bg-blue-600 px-2 py-1 text-center text-[10px] font-semibold text-white">
              grow: 1
            </span>
            <span className="rounded-xs bg-slate-400 px-2 py-1 text-[10px] text-white">3</span>
          </div>
        </VisualOptionCard>
      </div>
    );
  }

  // 7. Grid visuals
  if (type === 'grid-columns' || type === 'grid-count' || type === 'grid-rows' || type === 'grid-gaps') {
    const cards = propertyGuide.values || [];
    const colsClass = cards.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';
    return (
      <div className={`grid grid-cols-1 gap-2 ${colsClass}`}>
        {cards.map((item) => {
          const cols = item.applyProps?.columns || 3;
          const colGap = item.applyProps?.columnGap ?? 6;
          const rowGap = item.applyProps?.rowGap ?? 6;
          const isAutoFit = item.applyProps?.columnMode === 'auto-fit';
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, item.applyProps)}
              onApply={() => onApplyProps(item.applyProps)}
            >
              <div className="flex w-full items-center justify-between gap-2 rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isAutoFit
                      ? 'repeat(auto-fit, minmax(42px, 1fr))'
                      : `repeat(${cols}, minmax(0, 1fr))`,
                    columnGap: `${Math.min(10, Math.round(colGap / 2))}px`,
                    rowGap: `${Math.min(10, Math.round(rowGap / 2))}px`,
                  }}
                  className={isAutoFit ? 'w-[104px] border-r border-dashed border-blue-400 pr-1.5 dark:border-blue-500' : 'w-full'}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className="flex h-4 items-center justify-center rounded-xs bg-blue-600 font-mono text-[9px] text-white"
                    >
                      {n}
                    </span>
                  ))}
                </div>
                {isAutoFit ? (
                  <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">
                    auto-wraps
                  </span>
                ) : null}
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  if (type === 'grid-align') {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-2 gap-2">
        {cards.map((item) => (
          <VisualOptionCard
            key={item.value}
            title={item.label}
            isActive={isPropsMatch(currentProps, item.applyProps)}
            onApply={() => onApplyProps(item.applyProps)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                justifyItems: item.applyProps.justifyItems,
                alignItems: item.applyProps.alignItems,
                gap: '4px',
              }}
              className="h-14 w-full rounded border border-dashed border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="rounded-xs border border-blue-700 bg-blue-600 px-1.5 py-0.5 text-[9px] text-white">
                A
              </span>
              <span className="rounded-xs border border-blue-700 bg-blue-600 px-1.5 py-0.5 text-[9px] text-white">
                B
              </span>
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  if (type === 'grid-flow' || type === 'grid-span') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <VisualOptionCard
          title="row (Leaves gap before span-2)"
          isActive={type === 'grid-flow' && currentProps?.autoFlow === 'row'}
          onApply={type === 'grid-flow' ? () => onApplyProps({ autoFlow: 'row' }) : undefined}
        >
          <div className="grid grid-cols-3 gap-1 rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
            <span className="rounded-xs bg-slate-400 py-1 text-center font-mono text-[9px] text-white">1</span>
            <span className="rounded-xs bg-slate-400 py-1 text-center font-mono text-[9px] text-white">2</span>
            <span className="rounded-xs border border-dashed border-amber-400 py-1 text-center font-mono text-[9px] text-amber-600">
              gap
            </span>
            <span className="col-span-2 rounded-xs bg-blue-600 py-1 text-center font-mono text-[9px] text-white">
              3 (span 2)
            </span>
            <span className="rounded-xs bg-slate-400 py-1 text-center font-mono text-[9px] text-white">4</span>
          </div>
        </VisualOptionCard>
        <VisualOptionCard
          title="row dense (Backfills gap)"
          isActive={type === 'grid-flow' && currentProps?.autoFlow === 'row dense'}
          onApply={type === 'grid-flow' ? () => onApplyProps({ autoFlow: 'row dense' }) : undefined}
        >
          <div className="grid grid-cols-3 gap-1 rounded border border-dashed border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
            <span className="rounded-xs bg-slate-400 py-1 text-center font-mono text-[9px] text-white">1</span>
            <span className="rounded-xs bg-slate-400 py-1 text-center font-mono text-[9px] text-white">2</span>
            <span className="rounded-xs bg-emerald-600 py-1 text-center font-mono text-[9px] text-white">4</span>
            <span className="col-span-2 rounded-xs bg-blue-600 py-1 text-center font-mono text-[9px] text-white">
              3 (span 2)
            </span>
          </div>
        </VisualOptionCard>
      </div>
    );
  }

  // 8. Box Model visuals
  if (type === 'box-sizing') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <VisualOptionCard
          title="border-box (width = 200px)"
          subtitle="Total box stays 200px; content adjusts inward."
          isActive={currentProps?.boxSizing === 'border-box'}
          onApply={() =>
            onApplyProps({
              boxSizing: 'border-box',
              width: 240,
              paddingTop: 20,
              paddingRight: 24,
              paddingBottom: 20,
              paddingLeft: 24,
              borderWidth: 4,
            })
          }
        >
          <div className="flex items-center justify-center rounded bg-slate-50 p-2 dark:bg-slate-950">
            <div className="w-36 border-4 border-blue-600 bg-emerald-500/20 p-2 text-center font-mono text-[10px] text-slate-800 dark:text-slate-100">
              Total = 200px
            </div>
          </div>
        </VisualOptionCard>
        <VisualOptionCard
          title="content-box (width = 200px)"
          subtitle="Padding + border add outside -> 264px total."
          isActive={currentProps?.boxSizing === 'content-box'}
          onApply={() =>
            onApplyProps({
              boxSizing: 'content-box',
              width: 200,
              paddingTop: 24,
              paddingRight: 24,
              paddingBottom: 24,
              paddingLeft: 24,
              borderWidth: 8,
            })
          }
        >
          <div className="flex items-center justify-center rounded bg-slate-50 p-2 dark:bg-slate-950">
            <div className="w-44 border-4 border-teal-600 bg-emerald-500/20 p-2 text-center font-mono text-[10px] text-slate-800 dark:text-slate-100">
              200 + Pad + Border
            </div>
          </div>
        </VisualOptionCard>
      </div>
    );
  }

  if (type === 'box-layers') {
    return (
      <div className="rounded-md border border-slate-200 bg-amber-100/70 p-2.5 text-center font-mono text-[10px] dark:border-slate-800 dark:bg-amber-950/40">
        <div className="mb-1 text-amber-800 dark:text-amber-300">Margin (Outer space)</div>
        <div className="rounded border-4 border-blue-600 bg-emerald-400/25 p-2.5">
          <div className="mb-1 text-emerald-800 dark:text-emerald-300">Border → Padding (Inner cushion)</div>
          <div className="rounded bg-blue-600/15 py-2 font-semibold text-blue-900 dark:bg-blue-500/25 dark:text-blue-200">
            Content Area
          </div>
        </div>
      </div>
    );
  }

  // 9. Typography visuals
  if (type.startsWith('type-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cards.map((item) => (
          <VisualOptionCard
            key={item.value}
            title={item.label}
            isActive={isPropsMatch(currentProps, item.applyProps)}
            onApply={() => onApplyProps(item.applyProps)}
          >
            <div className="rounded border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-950">
              <p
                style={{
                  fontFamily: item.applyProps?.fontFamily || 'inherit',
                  fontSize: item.applyProps?.fontSize ? `${Math.min(20, item.applyProps.fontSize)}px` : '13px',
                  fontWeight: item.applyProps?.fontWeight || 500,
                  lineHeight: item.applyProps?.lineHeight || 1.4,
                  letterSpacing: item.applyProps?.letterSpacing !== undefined ? `${item.applyProps.letterSpacing}em` : undefined,
                  textTransform: item.applyProps?.textTransform || 'none',
                  textDecoration: item.applyProps?.textDecoration || 'none',
                  textAlign: item.applyProps?.textAlign || 'left',
                }}
                className="truncate text-slate-800 dark:text-slate-100"
              >
                Sphinx of black quartz
              </p>
            </div>
          </VisualOptionCard>
        ))}
      </div>
    );
  }

  // 10. Gradients visuals
  if (type.startsWith('gradient-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map((item) => {
          const p = { ...currentProps, ...item.applyProps };
          const stopsStr = (p.stops || [])
            .map((s) => `${s.color} ${s.position}%`)
            .join(', ');
          let bg = `linear-gradient(${p.angle ?? 135}deg, ${stopsStr})`;
          if (p.type === 'radial') {
            bg = `radial-gradient(${p.radialShape || 'circle'} at ${p.radialPosition || 'center'}, ${stopsStr})`;
          } else if (p.type === 'conic') {
            bg = `conic-gradient(from ${p.angle ?? 0}deg at ${p.radialPosition || 'center'}, ${stopsStr})`;
          }
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, item.applyProps)}
              onApply={() => onApplyProps(item.applyProps)}
            >
              <div
                style={{ backgroundImage: bg }}
                className="h-12 w-full rounded border border-slate-200 dark:border-slate-700"
              />
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  // 11. Shadows visuals
  if (type.startsWith('shadow-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map((item) => {
          const layer = item.applyProps?.layers?.[0];
          const shadowStr = layer
            ? `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px rgba(15, 23, 42, ${layer.opacity})`
            : 'none';
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              onApply={() => onApplyProps(item.applyProps)}
            >
              <div className="flex h-16 items-center justify-center rounded bg-slate-100 p-2 dark:bg-slate-950">
                <div
                  style={{ boxShadow: shadowStr }}
                  className="flex h-9 w-20 items-center justify-center rounded bg-white text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Card
                </div>
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  // 12. Borders visuals
  if (type.startsWith('border-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-2 gap-2">
        {cards.map((item) => {
          const p = item.applyProps || {};
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, p)}
              onApply={() => onApplyProps(p)}
            >
              <div className="flex h-14 items-center justify-center rounded bg-slate-50 p-2 dark:bg-slate-950">
                <div
                  style={{
                    borderWidth: `${p.borderWidth ?? 2}px`,
                    borderStyle: p.borderStyle || 'solid',
                    borderColor: p.borderColor || '#2563eb',
                    borderTopLeftRadius: `${p.radiusTL ?? 8}px`,
                    borderTopRightRadius: `${p.radiusTR ?? 8}px`,
                    borderBottomRightRadius: `${p.radiusBR ?? 8}px`,
                    borderBottomLeftRadius: `${p.radiusBL ?? 8}px`,
                    outlineWidth: p.outlineWidth !== undefined ? `${p.outlineWidth}px` : undefined,
                    outlineStyle: p.outlineStyle || 'none',
                    outlineColor: p.outlineColor || '#2563eb',
                    outlineOffset: p.outlineOffset !== undefined ? `${Math.max(-4, Math.min(4, p.outlineOffset))}px` : undefined,
                  }}
                  className="flex h-8 w-24 items-center justify-center bg-white text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Box
                </div>
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  // 13. Transforms visuals
  if (type.startsWith('transform-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map((item) => {
          const p = item.applyProps || {};
          const parts = [];
          if (p.perspective) parts.push(`perspective(${p.perspective}px)`);
          if (p.translateX || p.translateY) parts.push(`translate(${Math.round((p.translateX || 0) * 0.4)}px, ${Math.round((p.translateY || 0) * 0.4)}px)`);
          if (p.rotate) parts.push(`rotate(${p.rotate}deg)`);
          if (p.scale && p.scale !== 1) parts.push(`scale(${p.scale})`);
          if (p.skewX) parts.push(`skewX(${p.skewX}deg)`);
          if (p.rotateX) parts.push(`rotateX(${p.rotateX}deg)`);
          if (p.rotateY) parts.push(`rotateY(${p.rotateY}deg)`);
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, p)}
              onApply={() => onApplyProps(p)}
            >
              <div className="flex h-16 items-center justify-center overflow-hidden rounded bg-slate-50 dark:bg-slate-950">
                <div className="relative h-8 w-14">
                  <div className="absolute inset-0 rounded border border-dashed border-slate-300 dark:border-slate-700" />
                  <div
                    style={{
                      transform: parts.join(' ') || 'none',
                      transformOrigin: p.transformOrigin || 'center center',
                    }}
                    className="relative flex h-full w-full items-center justify-center rounded bg-blue-600 text-[10px] font-semibold text-white"
                  >
                    Box
                  </div>
                </div>
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  // 14. Transitions visuals (with SVG easing curve and live hover sample)
  if (type.startsWith('transition-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cards.map((item) => {
          const p = item.applyProps || {};
          const curvePath = EASING_PATHS[p.timingFunction];
          const hovered = transitionHoverId === item.value;
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, p)}
              onApply={() => onApplyProps(p)}
            >
              <div
                onMouseEnter={() => setTransitionHoverId(item.value)}
                onMouseLeave={() => setTransitionHoverId(null)}
                className="flex h-14 items-center justify-between gap-2 rounded bg-slate-50 px-2.5 dark:bg-slate-950"
              >
                {curvePath ? (
                  <svg viewBox="0 0 60 40" className="h-9 w-12 shrink-0" aria-hidden="true">
                    <path d="M 4 36 L 56 36 M 4 4 L 4 36" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" fill="none" />
                    <path d={curvePath} stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400" fill="none" />
                  </svg>
                ) : null}
                <div
                  style={{
                    transitionProperty: 'transform, border-radius',
                    transitionDuration: `${p.duration ?? 240}ms`,
                    transitionTimingFunction: p.timingFunction || 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${p.delay ?? 0}ms`,
                    transform: hovered ? 'translateY(-3px) scale(1.06)' : 'translateY(0) scale(1)',
                    borderRadius: hovered && p.targetRadius ? `${p.targetRadius}px` : '6px',
                  }}
                  className="ml-auto rounded bg-blue-600 px-2.5 py-1 text-[10px] font-medium text-white"
                >
                  Hover
                </div>
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  // 15. Animations visuals
  if (type.startsWith('anim-')) {
    const cards = propertyGuide.values || [];
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cards.map((item) => {
          const p = item.applyProps || {};
          const kf = p.keyframe || currentProps?.keyframe || 'float';
          return (
            <VisualOptionCard
              key={item.value}
              title={item.label}
              isActive={isPropsMatch(currentProps, p)}
              onApply={() => onApplyProps(p)}
            >
              <div className="flex h-14 items-center justify-center rounded bg-slate-50 dark:bg-slate-950">
                <span
                  style={{
                    animationName: `stylelab-${kf}`,
                    animationDuration: `${p.duration ?? 1.6}s`,
                    animationTimingFunction: p.timingFunction || 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDirection: p.direction || 'alternate',
                  }}
                  className="motion-safe-only inline-flex h-7 w-16 items-center justify-center rounded bg-blue-600 font-mono text-[10px] font-semibold text-white"
                >
                  {kf}
                </span>
              </div>
            </VisualOptionCard>
          );
        })}
      </div>
    );
  }

  return null;
}
