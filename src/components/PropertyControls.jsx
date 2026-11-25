import React, { useState } from 'react';
import { BookOpen, BookmarkPlus, Info, PanelRightClose, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  ColorControl,
  ControlSection,
  SegmentedControl,
  SelectControl,
  SliderControl,
  ToggleControl,
} from './ControlFields.jsx';

export default function PropertyControls({
  playground,
  props,
  onChangeProp,
  items,
  selectedItemId,
  onUpdateItemProp,
  onReset,
  onApplyPreset,
  customPresets,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  showExplanations,
  onToggleExplanations,
  learningOpen = false,
  onToggleLearning,
  onOpenLearningProperty,
  onCollapsePanel,
  panelWidth = 320,
}) {
  const [presetName, setPresetName] = useState('');
  const [isSavingPreset, setIsSavingPreset] = useState(false);

  const pgId = playground.id;
  const exp = playground.explanations || {};
  const selectedItem = items.find((it) => it.id === selectedItemId) || null;
  const selectedItemIndex = selectedItem ? items.findIndex((it) => it.id === selectedItem.id) + 1 : null;

  function handleSaveSubmit(e) {
    e.preventDefault();
    if (!presetName.trim()) return;
    onSaveCustomPreset(presetName.trim());
    setPresetName('');
    setIsSavingPreset(false);
  }

  function renderPlaygroundControls() {
    switch (pgId) {
      case 'flexbox':
        return (
          <>
            <ControlSection title="Container Layout">
              <SegmentedControl
                label="display"
                value={props.display}
                options={['flex', 'inline-flex']}
                onChange={(v) => onChangeProp('display', v)}
                explanation={exp.display}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('display')}
              />
              <SelectControl
                id="flex-direction"
                label="flex-direction"
                value={props.flexDirection}
                options={['row', 'row-reverse', 'column', 'column-reverse']}
                onChange={(v) => onChangeProp('flexDirection', v)}
                explanation={exp.flexDirection}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('flexDirection')}
              />
              <SelectControl
                id="justify-content"
                label="justify-content"
                value={props.justifyContent}
                options={[
                  'flex-start',
                  'center',
                  'flex-end',
                  'space-between',
                  'space-around',
                  'space-evenly',
                ]}
                onChange={(v) => onChangeProp('justifyContent', v)}
                explanation={exp.justifyContent}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('justifyContent')}
              />
              <SelectControl
                id="align-items"
                label="align-items"
                value={props.alignItems}
                options={['stretch', 'flex-start', 'center', 'flex-end', 'baseline']}
                onChange={(v) => onChangeProp('alignItems', v)}
                explanation={exp.alignItems}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('alignItems')}
              />
              <SegmentedControl
                label="flex-wrap"
                value={props.flexWrap}
                options={['nowrap', 'wrap', 'wrap-reverse']}
                onChange={(v) => onChangeProp('flexWrap', v)}
                explanation={exp.flexWrap}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('flexWrap')}
              />
              {props.flexWrap !== 'nowrap' ? (
                <SelectControl
                  id="align-content"
                  label="align-content"
                  value={props.alignContent}
                  options={[
                    'flex-start',
                    'center',
                    'flex-end',
                    'space-between',
                    'space-around',
                    'stretch',
                  ]}
                  onChange={(v) => onChangeProp('alignContent', v)}
                  explanation={exp.alignContent}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('alignContent')}
                />
              ) : null}
              <SliderControl
                id="flex-gap"
                label="gap"
                value={props.gap}
                min={0}
                max={48}
                onChange={(v) => onChangeProp('gap', v)}
                explanation={exp.gap}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('gap')}
              />
              <SliderControl
                id="flex-height"
                label="min-height"
                value={props.containerHeight}
                min={120}
                max={420}
                step={10}
                onChange={(v) => onChangeProp('containerHeight', v)}
                explanation={exp.containerHeight}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('containerHeight')}
              />
            </ControlSection>

            <ControlSection
              title={selectedItem ? `Selected Item #${selectedItemIndex}` : 'Item Properties'}
              action={
                <button
                  type="button"
                  onClick={() => onOpenLearningProperty?.('itemProperties')}
                  className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Guide
                </button>
              }
            >
              {selectedItem ? (
                <>
                  <SliderControl
                    id="item-flex-grow"
                    label="flex-grow"
                    value={selectedItem.flexGrow ?? 0}
                    min={0}
                    max={5}
                    unit=""
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'flexGrow', v)}
                    onLearn={() => onOpenLearningProperty?.('itemProperties')}
                  />
                  <SliderControl
                    id="item-flex-shrink"
                    label="flex-shrink"
                    value={selectedItem.flexShrink ?? 1}
                    min={0}
                    max={5}
                    unit=""
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'flexShrink', v)}
                    onLearn={() => onOpenLearningProperty?.('itemProperties')}
                  />
                  <SelectControl
                    id="item-flex-basis"
                    label="flex-basis"
                    value={selectedItem.flexBasis ?? 'auto'}
                    options={['auto', '0px', '80px', '120px', '160px', '220px', '50%']}
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'flexBasis', v)}
                    explanation="Starting size along the main axis before flex-grow or flex-shrink distributes remaining space."
                    showExplanation={showExplanations}
                    onLearn={() => onOpenLearningProperty?.('itemProperties')}
                  />
                  <SelectControl
                    id="item-align-self"
                    label="align-self"
                    value={selectedItem.alignSelf ?? 'auto'}
                    options={['auto', 'flex-start', 'center', 'flex-end', 'stretch']}
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'alignSelf', v)}
                    onLearn={() => onOpenLearningProperty?.('itemProperties')}
                  />
                  <SliderControl
                    id="item-order"
                    label="order"
                    value={selectedItem.order ?? 0}
                    min={-3}
                    max={6}
                    unit=""
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'order', v)}
                    onLearn={() => onOpenLearningProperty?.('itemProperties')}
                  />
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any flex item in the preview to customize flex-grow, flex-shrink, flex-basis, align-self, or order.
                </p>
              )}
            </ControlSection>
          </>
        );

      case 'grid':
        return (
          <>
            <ControlSection title="Grid Tracks & Spacing">
              <SegmentedControl
                label="Column Sizing"
                value={props.columnMode}
                options={[
                  { value: 'fr', label: 'Fixed Tracks (fr)' },
                  { value: 'auto-fit', label: 'Auto-Fit' },
                ]}
                onChange={(v) => onChangeProp('columnMode', v)}
                explanation={exp.columnMode}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('columnMode')}
              />
              {props.columnMode === 'fr' ? (
                <SliderControl
                  id="grid-cols"
                  label="Columns"
                  value={props.columns}
                  min={1}
                  max={6}
                  unit="cols"
                  onChange={(v) => onChangeProp('columns', v)}
                  explanation={exp.columns}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('columns')}
                />
              ) : (
                <SliderControl
                  id="grid-min-col"
                  label="Min Track Width"
                  value={props.minColWidth}
                  min={80}
                  max={240}
                  step={10}
                  onChange={(v) => onChangeProp('minColWidth', v)}
                  onLearn={() => onOpenLearningProperty?.('columnMode')}
                />
              )}
              <SliderControl
                id="grid-row-height"
                label="grid-auto-rows"
                value={props.rowHeight}
                min={48}
                max={180}
                step={4}
                onChange={(v) => onChangeProp('rowHeight', v)}
                onLearn={() => onOpenLearningProperty?.('rowHeight')}
              />
              <SliderControl
                id="grid-col-gap"
                label="column-gap"
                value={props.columnGap}
                min={0}
                max={40}
                onChange={(v) => onChangeProp('columnGap', v)}
                explanation={exp.columnGap}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('columnGap')}
              />
              <SliderControl
                id="grid-row-gap"
                label="row-gap"
                value={props.rowGap}
                min={0}
                max={40}
                onChange={(v) => onChangeProp('rowGap', v)}
                explanation={exp.rowGap}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('columnGap')}
              />
            </ControlSection>

            <ControlSection title="Alignment & Flow">
              <SelectControl
                id="grid-justify-items"
                label="justify-items"
                value={props.justifyItems}
                options={['stretch', 'start', 'center', 'end']}
                onChange={(v) => onChangeProp('justifyItems', v)}
                explanation={exp.justifyItems}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('justifyItems')}
              />
              <SelectControl
                id="grid-align-items"
                label="align-items"
                value={props.alignItems}
                options={['stretch', 'start', 'center', 'end']}
                onChange={(v) => onChangeProp('alignItems', v)}
                explanation={exp.alignItems}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('justifyItems')}
              />
              <SelectControl
                id="grid-auto-flow"
                label="grid-auto-flow"
                value={props.autoFlow}
                options={['row', 'column', 'row dense', 'column dense']}
                onChange={(v) => onChangeProp('autoFlow', v)}
                explanation={exp.autoFlow}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('autoFlow')}
              />
            </ControlSection>

            <ControlSection
              title={selectedItem ? `Selected Cell #${selectedItemIndex}` : 'Cell Span'}
              action={
                <button
                  type="button"
                  onClick={() => onOpenLearningProperty?.('cellSpan')}
                  className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Guide
                </button>
              }
            >
              {selectedItem ? (
                <>
                  <SliderControl
                    id="cell-col-span"
                    label="grid-column span"
                    value={selectedItem.colSpan ?? 1}
                    min={1}
                    max={4}
                    unit=""
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'colSpan', v)}
                    onLearn={() => onOpenLearningProperty?.('cellSpan')}
                  />
                  <SliderControl
                    id="cell-row-span"
                    label="grid-row span"
                    value={selectedItem.rowSpan ?? 1}
                    min={1}
                    max={3}
                    unit=""
                    onChange={(v) => onUpdateItemProp(selectedItem.id, 'rowSpan', v)}
                    onLearn={() => onOpenLearningProperty?.('cellSpan')}
                  />
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any cell in the preview to adjust its column or row span.
                </p>
              )}
            </ControlSection>
          </>
        );

      case 'box-model':
        return (
          <>
            <ControlSection title="Box Sizing & Dimensions">
              <SegmentedControl
                label="box-sizing"
                value={props.boxSizing}
                options={['border-box', 'content-box']}
                onChange={(v) => onChangeProp('boxSizing', v)}
                explanation={exp.boxSizing}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('boxSizing')}
              />
              <SliderControl
                id="box-width"
                label="width"
                value={props.width}
                min={100}
                max={340}
                step={4}
                onChange={(v) => onChangeProp('width', v)}
                onLearn={() => onOpenLearningProperty?.('boxSizing')}
              />
              <SliderControl
                id="box-height"
                label="height"
                value={props.height}
                min={48}
                max={220}
                step={4}
                onChange={(v) => onChangeProp('height', v)}
                onLearn={() => onOpenLearningProperty?.('boxSizing')}
              />
            </ControlSection>

            <ControlSection
              title="Padding"
              action={
                <button
                  type="button"
                  onClick={() => onChangeProp('linkPadding', !props.linkPadding)}
                  className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {props.linkPadding ? 'Split sides' : 'Link all'}
                </button>
              }
            >
              {props.linkPadding ? (
                <SliderControl
                  id="box-pad-all"
                  label="padding"
                  value={props.paddingTop}
                  min={0}
                  max={64}
                  onChange={(v) => {
                    onChangeProp('paddingTop', v);
                    onChangeProp('paddingRight', v);
                    onChangeProp('paddingBottom', v);
                    onChangeProp('paddingLeft', v);
                  }}
                  explanation={exp.padding}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('padding')}
                />
              ) : (
                <>
                  <SliderControl id="pad-t" label="padding-top" value={props.paddingTop} min={0} max={64} onChange={(v) => onChangeProp('paddingTop', v)} onLearn={() => onOpenLearningProperty?.('padding')} />
                  <SliderControl id="pad-r" label="padding-right" value={props.paddingRight} min={0} max={64} onChange={(v) => onChangeProp('paddingRight', v)} onLearn={() => onOpenLearningProperty?.('padding')} />
                  <SliderControl id="pad-b" label="padding-bottom" value={props.paddingBottom} min={0} max={64} onChange={(v) => onChangeProp('paddingBottom', v)} onLearn={() => onOpenLearningProperty?.('padding')} />
                  <SliderControl id="pad-l" label="padding-left" value={props.paddingLeft} min={0} max={64} onChange={(v) => onChangeProp('paddingLeft', v)} onLearn={() => onOpenLearningProperty?.('padding')} />
                </>
              )}
            </ControlSection>

            <ControlSection
              title="Border & Margin"
              action={
                <button
                  type="button"
                  onClick={() => onChangeProp('linkMargin', !props.linkMargin)}
                  className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {props.linkMargin ? 'Split margins' : 'Link margins'}
                </button>
              }
            >
              <SliderControl
                id="box-border-w"
                label="border-width"
                value={props.borderWidth}
                min={0}
                max={20}
                onChange={(v) => onChangeProp('borderWidth', v)}
                explanation={exp.borderWidth}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('borderWidth')}
              />
              <SelectControl
                id="box-border-style"
                label="border-style"
                value={props.borderStyle}
                options={['solid', 'dashed', 'dotted', 'double']}
                onChange={(v) => onChangeProp('borderStyle', v)}
                onLearn={() => onOpenLearningProperty?.('borderWidth')}
              />
              <ColorControl
                id="box-border-color"
                label="border-color"
                value={props.borderColor}
                onChange={(v) => onChangeProp('borderColor', v)}
              />
              {props.linkMargin !== false ? (
                <SliderControl
                  id="box-margin-all"
                  label="margin"
                  value={props.marginTop}
                  min={0}
                  max={48}
                  onChange={(v) => {
                    onChangeProp('marginTop', v);
                    onChangeProp('marginRight', v);
                    onChangeProp('marginBottom', v);
                    onChangeProp('marginLeft', v);
                  }}
                  explanation={exp.margin}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('margin')}
                />
              ) : (
                <>
                  <SliderControl id="mar-t" label="margin-top" value={props.marginTop} min={0} max={48} onChange={(v) => onChangeProp('marginTop', v)} onLearn={() => onOpenLearningProperty?.('margin')} />
                  <SliderControl id="mar-r" label="margin-right" value={props.marginRight} min={0} max={48} onChange={(v) => onChangeProp('marginRight', v)} onLearn={() => onOpenLearningProperty?.('margin')} />
                  <SliderControl id="mar-b" label="margin-bottom" value={props.marginBottom} min={0} max={48} onChange={(v) => onChangeProp('marginBottom', v)} onLearn={() => onOpenLearningProperty?.('margin')} />
                  <SliderControl id="mar-l" label="margin-left" value={props.marginLeft} min={0} max={48} onChange={(v) => onChangeProp('marginLeft', v)} onLearn={() => onOpenLearningProperty?.('margin')} />
                </>
              )}
            </ControlSection>
          </>
        );

      case 'typography':
        return (
          <>
            <ControlSection title="Font & Scale">
              <SelectControl
                id="type-family"
                label="font-family"
                value={props.fontFamily}
                options={[
                  { value: '"Plus Jakarta Sans", sans-serif', label: 'Plus Jakarta Sans' },
                  { value: 'Georgia, Cambria, "Times New Roman", serif', label: 'Georgia Serif' },
                  { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
                  { value: 'system-ui, -apple-system, sans-serif', label: 'System Sans' },
                ]}
                onChange={(v) => onChangeProp('fontFamily', v)}
                onLearn={() => onOpenLearningProperty?.('fontFamily')}
              />
              <SliderControl
                id="type-size"
                label="font-size"
                value={props.fontSize}
                min={12}
                max={48}
                onChange={(v) => onChangeProp('fontSize', v)}
                explanation={exp.fontSize}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('fontSize')}
              />
              <SliderControl
                id="type-weight"
                label="font-weight"
                value={props.fontWeight}
                min={300}
                max={800}
                step={100}
                unit=""
                onChange={(v) => onChangeProp('fontWeight', v)}
                onLearn={() => onOpenLearningProperty?.('fontSize')}
              />
              <SliderControl
                id="type-line-height"
                label="line-height"
                value={props.lineHeight}
                min={1}
                max={2.4}
                step={0.05}
                unit=""
                onChange={(v) => onChangeProp('lineHeight', v)}
                explanation={exp.lineHeight}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('lineHeight')}
              />
              <SliderControl
                id="type-letter-spacing"
                label="letter-spacing"
                value={props.letterSpacing}
                min={-0.06}
                max={0.25}
                step={0.01}
                unit="em"
                onChange={(v) => onChangeProp('letterSpacing', v)}
                explanation={exp.letterSpacing}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('lineHeight')}
              />
            </ControlSection>

            <ControlSection title="Alignment & Measure">
              <SegmentedControl
                label="text-align"
                value={props.textAlign}
                options={['left', 'center', 'right', 'justify']}
                onChange={(v) => onChangeProp('textAlign', v)}
                onLearn={() => onOpenLearningProperty?.('maxWidthCh')}
              />
              <SelectControl
                id="type-transform"
                label="text-transform"
                value={props.textTransform}
                options={['none', 'uppercase', 'lowercase', 'capitalize']}
                onChange={(v) => onChangeProp('textTransform', v)}
                onLearn={() => onOpenLearningProperty?.('textTransform')}
              />
              <SelectControl
                id="type-decoration"
                label="text-decoration"
                value={props.textDecoration}
                options={['none', 'underline', 'line-through', 'overline']}
                onChange={(v) => onChangeProp('textDecoration', v)}
                onLearn={() => onOpenLearningProperty?.('textTransform')}
              />
              <SliderControl
                id="type-max-width"
                label="max-width"
                value={props.maxWidthCh}
                min={20}
                max={80}
                unit="ch"
                onChange={(v) => onChangeProp('maxWidthCh', v)}
                explanation={exp.maxWidthCh}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('maxWidthCh')}
              />
              <ColorControl
                id="type-color"
                label="color"
                value={props.color}
                onChange={(v) => onChangeProp('color', v)}
              />
            </ControlSection>
          </>
        );

      case 'gradients':
        return (
          <>
            <ControlSection title="Gradient Type & Geometry">
              <SegmentedControl
                label="Gradient Type"
                value={props.type}
                options={[
                  { value: 'linear', label: 'Linear' },
                  { value: 'radial', label: 'Radial' },
                  { value: 'conic', label: 'Conic' },
                ]}
                onChange={(v) => onChangeProp('type', v)}
                explanation={exp.type}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('type')}
              />
              {props.type !== 'radial' ? (
                <SliderControl
                  id="grad-angle"
                  label="Angle"
                  value={props.angle}
                  min={0}
                  max={360}
                  unit="deg"
                  onChange={(v) => onChangeProp('angle', v)}
                  explanation={exp.angle}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('angle')}
                />
              ) : (
                <SegmentedControl
                  label="Shape"
                  value={props.radialShape}
                  options={['circle', 'ellipse']}
                  onChange={(v) => onChangeProp('radialShape', v)}
                  onLearn={() => onOpenLearningProperty?.('angle')}
                />
              )}
              {props.type !== 'linear' ? (
                <SelectControl
                  id="grad-pos"
                  label="Position"
                  value={props.radialPosition}
                  options={['center', 'top', 'bottom', 'left', 'right', 'top left', 'bottom right']}
                  onChange={(v) => onChangeProp('radialPosition', v)}
                  onLearn={() => onOpenLearningProperty?.('angle')}
                />
              ) : null}
            </ControlSection>

            <ControlSection
              title="Color Stops"
              action={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenLearningProperty?.('stops')}
                    className="text-[11px] font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (props.stops.length >= 6) return;
                      const nextId = Date.now();
                      onChangeProp('stops', [
                        ...props.stops,
                        { id: nextId, color: '#6366f1', position: 80 },
                      ]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Stop</span>
                  </button>
                </div>
              }
            >
              {showExplanations && exp.stops ? (
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {exp.stops}
                </p>
              ) : null}
              <div className="space-y-3">
                {props.stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="rounded-md border border-slate-200 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Stop {idx + 1}
                      </span>
                      {props.stops.length > 2 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onChangeProp(
                              'stops',
                              props.stops.filter((s) => s.id !== stop.id)
                            )
                          }
                          aria-label={`Remove stop ${idx + 1}`}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <ColorControl
                        id={`stop-color-${stop.id}`}
                        label="Color"
                        value={stop.color}
                        onChange={(val) =>
                          onChangeProp(
                            'stops',
                            props.stops.map((s) => (s.id === stop.id ? { ...s, color: val } : s))
                          )
                        }
                      />
                      <SliderControl
                        id={`stop-pos-${stop.id}`}
                        label="Position"
                        value={stop.position}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(val) =>
                          onChangeProp(
                            'stops',
                            props.stops.map((s) => (s.id === stop.id ? { ...s, position: val } : s))
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ControlSection>
          </>
        );

      case 'shadows':
        return (
          <>
            <ControlSection title="Surface">
              <ColorControl
                id="shadow-card-bg"
                label="background-color"
                value={props.cardBg}
                onChange={(v) => onChangeProp('cardBg', v)}
              />
              <SliderControl
                id="shadow-card-radius"
                label="border-radius"
                value={props.cardRadius}
                min={0}
                max={32}
                onChange={(v) => onChangeProp('cardRadius', v)}
              />
            </ControlSection>

            <ControlSection
              title="Shadow Layers"
              action={
                <button
                  type="button"
                  onClick={() => {
                    if (props.layers.length >= 4) return;
                    onChangeProp('layers', [
                      ...props.layers,
                      {
                        id: Date.now(),
                        x: 0,
                        y: 8,
                        blur: 18,
                        spread: 0,
                        color: '#0f172a',
                        opacity: 0.14,
                        inset: false,
                      },
                    ]);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Layer</span>
                </button>
              }
            >
              {props.layers.map((layer, idx) => {
                const updateLayer = (field, val) =>
                  onChangeProp(
                    'layers',
                    props.layers.map((l) => (l.id === layer.id ? { ...l, [field]: val } : l))
                  );

                return (
                  <div
                    key={layer.id}
                    className="space-y-2.5 rounded-md border border-slate-200 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Layer {idx + 1}
                      </span>
                      {props.layers.length > 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onChangeProp(
                              'layers',
                              props.layers.filter((l) => l.id !== layer.id)
                            )
                          }
                          aria-label={`Remove shadow layer ${idx + 1}`}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>

                    <SliderControl
                      id={`sh-x-${layer.id}`}
                      label="offset-x"
                      value={layer.x}
                      min={-40}
                      max={40}
                      onChange={(v) => updateLayer('x', v)}
                      explanation={idx === 0 ? exp.xOffset : undefined}
                      showExplanation={showExplanations}
                      onLearn={() => onOpenLearningProperty?.('xOffset')}
                    />
                    <SliderControl
                      id={`sh-y-${layer.id}`}
                      label="offset-y"
                      value={layer.y}
                      min={-40}
                      max={40}
                      onChange={(v) => updateLayer('y', v)}
                      explanation={idx === 0 ? exp.yOffset : undefined}
                      showExplanation={showExplanations}
                      onLearn={() => onOpenLearningProperty?.('xOffset')}
                    />
                    <SliderControl
                      id={`sh-blur-${layer.id}`}
                      label="blur-radius"
                      value={layer.blur}
                      min={0}
                      max={64}
                      onChange={(v) => updateLayer('blur', v)}
                      explanation={idx === 0 ? exp.blur : undefined}
                      showExplanation={showExplanations}
                      onLearn={() => onOpenLearningProperty?.('blur')}
                    />
                    <SliderControl
                      id={`sh-spread-${layer.id}`}
                      label="spread-radius"
                      value={layer.spread}
                      min={-24}
                      max={24}
                      onChange={(v) => updateLayer('spread', v)}
                      explanation={idx === 0 ? exp.spread : undefined}
                      showExplanation={showExplanations}
                      onLearn={() => onOpenLearningProperty?.('blur')}
                    />
                    <SliderControl
                      id={`sh-opacity-${layer.id}`}
                      label="opacity"
                      value={layer.opacity}
                      min={0}
                      max={1}
                      step={0.02}
                      unit=""
                      onChange={(v) => updateLayer('opacity', v)}
                      onLearn={() => onOpenLearningProperty?.('inset')}
                    />
                    <ColorControl
                      id={`sh-color-${layer.id}`}
                      label="color"
                      value={layer.color}
                      onChange={(v) => updateLayer('color', v)}
                    />
                    <ToggleControl
                      id={`sh-inset-${layer.id}`}
                      label="inset"
                      checked={layer.inset}
                      onChange={(v) => updateLayer('inset', v)}
                      explanation={idx === 0 ? exp.inset : undefined}
                      showExplanation={showExplanations}
                      onLearn={() => onOpenLearningProperty?.('inset')}
                    />
                  </div>
                );
              })}
            </ControlSection>
          </>
        );

      case 'borders':
        return (
          <>
            <ControlSection title="Border Stroke">
              <SliderControl
                id="border-w"
                label="border-width"
                value={props.borderWidth}
                min={0}
                max={16}
                onChange={(v) => onChangeProp('borderWidth', v)}
                onLearn={() => onOpenLearningProperty?.('borderStyle')}
              />
              <SelectControl
                id="border-style"
                label="border-style"
                value={props.borderStyle}
                options={['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']}
                onChange={(v) => onChangeProp('borderStyle', v)}
                explanation={exp.borderStyle}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('borderStyle')}
              />
              <ColorControl
                id="border-color"
                label="border-color"
                value={props.borderColor}
                onChange={(v) => onChangeProp('borderColor', v)}
              />
            </ControlSection>

            <ControlSection
              title="Border Radius"
              action={
                <button
                  type="button"
                  onClick={() => onChangeProp('linkRadius', !props.linkRadius)}
                  className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {props.linkRadius ? 'Individual corners' : 'Link corners'}
                </button>
              }
            >
              {props.linkRadius ? (
                <SliderControl
                  id="radius-all"
                  label="border-radius"
                  value={props.radiusTL}
                  min={0}
                  max={64}
                  onChange={(v) => {
                    onChangeProp('radiusTL', v);
                    onChangeProp('radiusTR', v);
                    onChangeProp('radiusBR', v);
                    onChangeProp('radiusBL', v);
                  }}
                  explanation={exp.borderRadius}
                  showExplanation={showExplanations}
                  onLearn={() => onOpenLearningProperty?.('borderRadius')}
                />
              ) : (
                <>
                  <SliderControl id="r-tl" label="top-left" value={props.radiusTL} min={0} max={64} onChange={(v) => onChangeProp('radiusTL', v)} onLearn={() => onOpenLearningProperty?.('borderRadius')} />
                  <SliderControl id="r-tr" label="top-right" value={props.radiusTR} min={0} max={64} onChange={(v) => onChangeProp('radiusTR', v)} onLearn={() => onOpenLearningProperty?.('borderRadius')} />
                  <SliderControl id="r-br" label="bottom-right" value={props.radiusBR} min={0} max={64} onChange={(v) => onChangeProp('radiusBR', v)} onLearn={() => onOpenLearningProperty?.('borderRadius')} />
                  <SliderControl id="r-bl" label="bottom-left" value={props.radiusBL} min={0} max={64} onChange={(v) => onChangeProp('radiusBL', v)} onLearn={() => onOpenLearningProperty?.('borderRadius')} />
                </>
              )}
            </ControlSection>

            <ControlSection title="Outline">
              <SelectControl
                id="outline-style"
                label="outline-style"
                value={props.outlineStyle}
                options={['none', 'solid', 'dashed', 'dotted']}
                onChange={(v) => onChangeProp('outlineStyle', v)}
                explanation={exp.outline}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('outline')}
              />
              <SliderControl
                id="outline-w"
                label="outline-width"
                value={props.outlineWidth}
                min={0}
                max={12}
                onChange={(v) => onChangeProp('outlineWidth', v)}
                onLearn={() => onOpenLearningProperty?.('outline')}
              />
              <SliderControl
                id="outline-offset"
                label="outline-offset"
                value={props.outlineOffset}
                min={-8}
                max={24}
                onChange={(v) => onChangeProp('outlineOffset', v)}
                explanation={exp.outlineOffset}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('outline')}
              />
              <ColorControl
                id="outline-color"
                label="outline-color"
                value={props.outlineColor}
                onChange={(v) => onChangeProp('outlineColor', v)}
              />
            </ControlSection>
          </>
        );

      case 'transforms':
        return (
          <>
            <ControlSection title="2D Transform">
              <SliderControl
                id="tr-x"
                label="translateX"
                value={props.translateX}
                min={-100}
                max={100}
                onChange={(v) => onChangeProp('translateX', v)}
                explanation={exp.translate}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('translate')}
              />
              <SliderControl
                id="tr-y"
                label="translateY"
                value={props.translateY}
                min={-80}
                max={80}
                onChange={(v) => onChangeProp('translateY', v)}
                onLearn={() => onOpenLearningProperty?.('translate')}
              />
              <SliderControl
                id="tr-rot"
                label="rotate"
                value={props.rotate}
                min={-180}
                max={180}
                unit="deg"
                onChange={(v) => onChangeProp('rotate', v)}
                explanation={exp.rotate}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('rotate')}
              />
              <SliderControl
                id="tr-scale"
                label="scale"
                value={props.scale}
                min={0.4}
                max={1.8}
                step={0.05}
                unit="×"
                onChange={(v) => onChangeProp('scale', v)}
                explanation={exp.scale}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('scale')}
              />
              <SliderControl
                id="tr-skewx"
                label="skewX"
                value={props.skewX}
                min={-35}
                max={35}
                unit="deg"
                onChange={(v) => onChangeProp('skewX', v)}
                onLearn={() => onOpenLearningProperty?.('rotate')}
              />
              <SliderControl
                id="tr-skewy"
                label="skewY"
                value={props.skewY}
                min={-35}
                max={35}
                unit="deg"
                onChange={(v) => onChangeProp('skewY', v)}
                onLearn={() => onOpenLearningProperty?.('rotate')}
              />
            </ControlSection>

            <ControlSection title="3D & Origin">
              <SliderControl
                id="tr-persp"
                label="perspective"
                value={props.perspective}
                min={200}
                max={1200}
                step={20}
                onChange={(v) => onChangeProp('perspective', v)}
                explanation={exp.perspective}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('perspective')}
              />
              <SliderControl
                id="tr-rotx"
                label="rotateX"
                value={props.rotateX}
                min={-60}
                max={60}
                unit="deg"
                onChange={(v) => onChangeProp('rotateX', v)}
                onLearn={() => onOpenLearningProperty?.('perspective')}
              />
              <SliderControl
                id="tr-roty"
                label="rotateY"
                value={props.rotateY}
                min={-60}
                max={60}
                unit="deg"
                onChange={(v) => onChangeProp('rotateY', v)}
                onLearn={() => onOpenLearningProperty?.('perspective')}
              />
              <SelectControl
                id="tr-origin"
                label="transform-origin"
                value={props.transformOrigin}
                options={[
                  'center center',
                  'top left',
                  'top right',
                  'bottom left',
                  'bottom right',
                  'top center',
                  'bottom center',
                ]}
                onChange={(v) => onChangeProp('transformOrigin', v)}
                explanation={exp.transformOrigin}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('transformOrigin')}
              />
            </ControlSection>
          </>
        );

      case 'transitions':
        return (
          <>
            <ControlSection title="Timing Configuration">
              <SelectControl
                id="trans-prop"
                label="transition-property"
                value={props.property}
                options={['all', 'transform', 'background-color', 'border-radius', 'opacity']}
                onChange={(v) => onChangeProp('property', v)}
                explanation={exp.property}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('property')}
              />
              <SliderControl
                id="trans-dur"
                label="duration"
                value={props.duration}
                min={50}
                max={1200}
                step={20}
                unit="ms"
                onChange={(v) => onChangeProp('duration', v)}
                explanation={exp.duration}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('duration')}
              />
              <SelectControl
                id="trans-ease"
                label="timing-function"
                value={props.timingFunction}
                options={[
                  { value: 'cubic-bezier(0.16, 1, 0.3, 1)', label: 'Expo Out (UI)' },
                  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring Overshoot' },
                  { value: 'ease', label: 'ease' },
                  { value: 'ease-in-out', label: 'ease-in-out' },
                  { value: 'ease-out', label: 'ease-out' },
                  { value: 'linear', label: 'linear' },
                ]}
                onChange={(v) => onChangeProp('timingFunction', v)}
                explanation={exp.timingFunction}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('timingFunction')}
              />
              <SliderControl
                id="trans-delay"
                label="delay"
                value={props.delay}
                min={0}
                max={600}
                step={20}
                unit="ms"
                onChange={(v) => onChangeProp('delay', v)}
                explanation={exp.delay}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('delay')}
              />
            </ControlSection>

            <ControlSection title="Hover / Active Target State">
              <SliderControl
                id="trans-ty"
                label="translateY"
                value={props.targetTranslateY}
                min={-32}
                max={32}
                onChange={(v) => onChangeProp('targetTranslateY', v)}
              />
              <SliderControl
                id="trans-scale"
                label="scale"
                value={props.targetScale}
                min={0.8}
                max={1.3}
                step={0.02}
                unit="×"
                onChange={(v) => onChangeProp('targetScale', v)}
              />
              <SliderControl
                id="trans-radius"
                label="border-radius"
                value={props.targetRadius}
                min={0}
                max={40}
                onChange={(v) => onChangeProp('targetRadius', v)}
              />
              <SliderControl
                id="trans-opacity"
                label="opacity"
                value={props.targetOpacity}
                min={0.2}
                max={1}
                step={0.05}
                unit=""
                onChange={(v) => onChangeProp('targetOpacity', v)}
              />
              <ColorControl
                id="trans-bg"
                label="background-color"
                value={props.targetBg}
                onChange={(v) => onChangeProp('targetBg', v)}
              />
            </ControlSection>
          </>
        );

      case 'animations':
        return (
          <>
            <ControlSection title="Keyframe & Playback">
              <SelectControl
                id="anim-keyframe"
                label="@keyframes"
                value={props.keyframe}
                options={['float', 'bounce', 'pulse', 'spin', 'shake', 'slide-in']}
                onChange={(v) => onChangeProp('keyframe', v)}
                explanation={exp.keyframe}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('keyframe')}
              />
              <SliderControl
                id="anim-dur"
                label="duration"
                value={props.duration}
                min={0.3}
                max={5}
                step={0.1}
                unit="s"
                onChange={(v) => onChangeProp('duration', v)}
                explanation={exp.duration}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('duration')}
              />
              <SelectControl
                id="anim-ease"
                label="timing-function"
                value={props.timingFunction}
                options={[
                  { value: 'ease-in-out', label: 'ease-in-out' },
                  { value: 'ease-out', label: 'ease-out' },
                  { value: 'linear', label: 'linear' },
                  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring' },
                ]}
                onChange={(v) => onChangeProp('timingFunction', v)}
                onLearn={() => onOpenLearningProperty?.('duration')}
              />
              <SliderControl
                id="anim-delay"
                label="delay"
                value={props.delay}
                min={0}
                max={2}
                step={0.1}
                unit="s"
                onChange={(v) => onChangeProp('delay', v)}
                onLearn={() => onOpenLearningProperty?.('duration')}
              />
              <SelectControl
                id="anim-iter"
                label="iteration-count"
                value={props.iterationCount}
                options={['infinite', '1', '2', '3', '5']}
                onChange={(v) => onChangeProp('iterationCount', v)}
                explanation={exp.iterationCount}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('iterationCount')}
              />
              <SelectControl
                id="anim-dir"
                label="direction"
                value={props.direction}
                options={['normal', 'reverse', 'alternate', 'alternate-reverse']}
                onChange={(v) => onChangeProp('direction', v)}
                explanation={exp.direction}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('direction')}
              />
              <SelectControl
                id="anim-fill"
                label="fill-mode"
                value={props.fillMode}
                options={['none', 'forwards', 'backwards', 'both']}
                onChange={(v) => onChangeProp('fillMode', v)}
                explanation={exp.fillMode}
                showExplanation={showExplanations}
                onLearn={() => onOpenLearningProperty?.('fillMode')}
              />
              {items.length > 1 ? (
                <SliderControl
                  id="anim-stagger"
                  label="item stagger"
                  value={props.staggerMs}
                  min={0}
                  max={400}
                  step={20}
                  unit="ms"
                  onChange={(v) => onChangeProp('staggerMs', v)}
                  onLearn={() => onOpenLearningProperty?.('duration')}
                />
              ) : null}
            </ControlSection>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <aside
      aria-label="Property Controls"
      style={{ '--properties-width': `${panelWidth}px` }}
      className="flex w-full shrink-0 flex-col border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:min-h-0 lg:w-[var(--properties-width)] lg:overflow-hidden lg:border-t-0 lg:border-l"
    >
      {/* Controls Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          Properties
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleExplanations}
            aria-pressed={showExplanations}
            aria-label={showExplanations ? 'Hide quick control hints' : 'Show quick control hints'}
            title={showExplanations ? 'Hide short hints below controls' : 'Show short hints below controls'}
            className={`inline-flex items-center justify-center rounded border p-1 transition-colors ${
              showExplanations
                ? 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleLearning}
            aria-pressed={learningOpen}
            title="Open detailed CSS learning panel"
            className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium whitespace-nowrap transition-colors ${
              learningOpen
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/50'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>Explain</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
          {onCollapsePanel ? (
            <button
              type="button"
              onClick={onCollapsePanel}
              aria-label="Collapse properties panel"
              title="Collapse properties panel"
              className="hidden rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:inline-flex dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <PanelRightClose className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Presets & Property Controls Scroll Area */}
      <div className="stylelab-scroll min-h-0 flex-1 overflow-y-auto px-4">
        {/* Built-in & Custom Presets */}
        <ControlSection
          title="Presets"
          action={
            <button
              type="button"
              onClick={() => setIsSavingPreset((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <BookmarkPlus className="h-3 w-3" />
              <span>Save Preset</span>
            </button>
          }
        >
          {isSavingPreset ? (
            <form onSubmit={handleSaveSubmit} className="flex items-center gap-1.5">
              <label htmlFor="custom-preset-name" className="sr-only">
                Preset name
              </label>
              <input
                id="custom-preset-name"
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name..."
                className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                autoFocus
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            {playground.presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {customPresets.length > 0 ? (
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Saved Presets
              </div>
              <div className="space-y-1">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <button
                      type="button"
                      onClick={() => onApplyPreset(preset)}
                      className="min-w-0 flex-1 truncate text-left text-xs font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                    >
                      {preset.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomPreset(preset.id)}
                      aria-label={`Delete preset ${preset.name}`}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </ControlSection>

        {renderPlaygroundControls()}
      </div>
    </aside>
  );
}
