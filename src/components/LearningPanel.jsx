import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Lightbulb,
  Play,
  X,
} from 'lucide-react';
import { getModuleLearningGuide } from '../data/learningGuides.js';
import { tokenizeCssLines } from '../utils/syntaxHighlight.js';
import LearningVisuals from './LearningVisuals.jsx';

const TOKEN_CLASSES = {
  selector: 'text-blue-700 dark:text-blue-400 font-medium',
  atrule: 'text-violet-700 dark:text-violet-400 font-medium',
  property: 'text-sky-800 dark:text-sky-300',
  value: 'text-slate-700 dark:text-slate-300',
  number: 'text-amber-700 dark:text-amber-300',
  color: 'text-emerald-700 dark:text-emerald-400 font-medium',
  punctuation: 'text-slate-400 dark:text-slate-500',
  plain: 'text-slate-600 dark:text-slate-400',
};

function FormattedProse({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeText = part.slice(1, -1);
          return (
            <code
              key={idx}
              className={`rounded border border-slate-200 bg-slate-100 px-1 py-0 font-mono text-[11px] font-medium leading-[1.3] text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300 ${
                codeText.length <= 22 ? 'whitespace-nowrap' : ''
              }`}
            >
              {codeText}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}

function isApplied(currentProps, applyProps) {
  if (!currentProps || !applyProps) return false;
  return Object.entries(applyProps).every(([key, val]) => {
    if (Array.isArray(val)) return false;
    return currentProps[key] === val;
  });
}

export default function LearningPanel({
  isOpen,
  onClose,
  playgroundId,
  selectedPropertyId,
  onSelectPropertyId,
  currentProps,
  onApplyExampleProps,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [appliedBanner, setAppliedBanner] = useState(null);
  const bodyRef = useRef(null);

  const guide = getModuleLearningGuide(playgroundId);
  const properties = guide?.properties || [];
  const activeIndex = Math.max(
    0,
    properties.findIndex((p) => p.id === selectedPropertyId)
  );
  const activeProperty = properties[activeIndex] || properties[0];

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
    setAppliedBanner(null);
  }, [playgroundId, activeProperty?.id]);

  if (!isOpen || !guide || !activeProperty) return null;

  const tokenizedSnippet = activeProperty.codeExample?.css
    ? tokenizeCssLines(activeProperty.codeExample.css)
    : [];

  async function handleCopySnippet(cssText) {
    try {
      await navigator.clipboard.writeText(cssText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cssText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedKey(activeProperty.id);
    setTimeout(() => setCopiedKey(null), 1600);
  }

  function handleApply(patch, label) {
    if (!patch) return;
    onApplyExampleProps(patch);
    setAppliedBanner(label || 'Applied to live preview');
    setTimeout(() => setAppliedBanner(null), 1800);
  }

  const prevProp = activeIndex > 0 ? properties[activeIndex - 1] : null;
  const nextProp = activeIndex < properties.length - 1 ? properties[activeIndex + 1] : null;

  return (
    <aside
      role="complementary"
      aria-label={`${guide.name} Learning Panel`}
      data-testid="learning-panel"
      className="absolute inset-0 z-40 flex w-full flex-col border-l border-slate-200 bg-white shadow-xl sm:left-auto sm:w-[480px] lg:static lg:z-auto lg:h-full lg:w-[460px] xl:w-[500px] lg:shrink-0 lg:shadow-none dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2.5">
          <BookOpen className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {guide.name} Guide
              </h2>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
              <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap dark:text-slate-400">
                {properties.length} topics
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close learning panel"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <X className="h-3.5 w-3.5" />
          <span>Close</span>
        </button>
      </div>

      {/* Module Mental Model Summary */}
      <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <FormattedProse text={guide.mentalModel} />
        </p>
        {guide.keyConcept ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <FormattedProse text={guide.keyConcept} />
            </span>
          </p>
        ) : null}
      </div>

      {/* Property Selector Tabs */}
      <div
        role="tablist"
        aria-label={`${guide.name} properties`}
        className="stylelab-scroll flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
      >
        {properties.map((prop) => {
          const isSelected = prop.id === activeProperty.id;
          return (
            <button
              key={prop.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectPropertyId(prop.id)}
              className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {prop.controlLabel}
            </button>
          );
        })}
      </div>

      {/* Scrollable Property Lesson Content */}
      <div ref={bodyRef} className="stylelab-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-5">
          {/* Property Title & Feedback */}
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                {activeProperty.cssProperty}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <FormattedProse text={activeProperty.shortSummary} />
              </p>
            </div>
            {appliedBanner ? (
              <span
                role="status"
                className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{appliedBanner}</span>
              </span>
            ) : null}
          </div>

          {/* 01. What It Means & How It Works */}
          <section className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              What It Means & How It Works
            </h4>
            <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
              <FormattedProse text={activeProperty.whatItMeans} />
            </p>
            <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
              <FormattedProse text={activeProperty.howItWorks} />
            </p>
          </section>

          {/* 02. Interactive Visual Examples */}
          <section className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Interactive Visual Comparison
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Click any example to apply live
              </span>
            </div>
            <LearningVisuals
              propertyGuide={activeProperty}
              currentProps={currentProps}
              onApplyProps={(patch) => handleApply(patch, 'Applied to live preview')}
            />
          </section>

          {/* 03. Every Available Value Explained */}
          {activeProperty.values?.length ? (
            <section className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <h4 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Available Values
              </h4>
              <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-slate-50/40 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/40">
                {activeProperty.values.map((valItem) => {
                  const matched = isApplied(currentProps, valItem.applyProps);
                  return (
                    <div
                      key={valItem.value}
                      className="flex items-start justify-between gap-3 px-3 py-2.5"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                          {valItem.label || valItem.value}
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          <FormattedProse text={valItem.description} />
                        </p>
                      </div>
                      {valItem.applyProps ? (
                        <button
                          type="button"
                          onClick={() => handleApply(valItem.applyProps, `Applied ${valItem.value}`)}
                          className={`inline-flex shrink-0 items-center gap-1 rounded border px-2 py-1 text-[11px] font-medium whitespace-nowrap transition-colors ${
                            matched
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500'
                          }`}
                        >
                          {matched ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" />
                              <span>Apply</span>
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* 04. When to Use & Real-World Example */}
          <section className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                When & Why Developers Use It
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                <FormattedProse text={activeProperty.whenToUse} />
              </p>
            </div>

            {activeProperty.realWorldExample ? (
              <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Real-World Example: {activeProperty.realWorldExample.title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <FormattedProse text={activeProperty.realWorldExample.description} />
                </p>
              </div>
            ) : null}
          </section>

          {/* 05. CSS Code Example */}
          {activeProperty.codeExample ? (
            <section className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  CSS Code Example
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopySnippet(activeProperty.codeExample.css)}
                    className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {copiedKey === activeProperty.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  {activeProperty.codeExample.applyProps ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleApply(activeProperty.codeExample.applyProps, 'Code example applied')
                      }
                      className="inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 whitespace-nowrap"
                    >
                      <Play className="h-3 w-3" />
                      <span>Apply to Playground</span>
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="stylelab-scroll overflow-x-auto rounded-md border border-slate-200 bg-slate-50/80 p-3 font-mono text-xs leading-5 dark:border-slate-800 dark:bg-slate-950/80">
                <pre className="m-0">
                  <code>
                    {tokenizedSnippet.map((tokens, lineIdx) => (
                      <div key={lineIdx} className="flex">
                        <span className="mr-3 w-4 shrink-0 select-none text-right tabular-nums text-slate-400 dark:text-slate-600">
                          {lineIdx + 1}
                        </span>
                        <span className="whitespace-pre">
                          {tokens.map((tok, tIdx) => (
                            <span key={tIdx} className={TOKEN_CLASSES[tok.type] || TOKEN_CLASSES.plain}>
                              {tok.text}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </section>
          ) : null}

          {/* 06. Common Mistakes & Fixes */}
          {activeProperty.commonMistakes?.length ? (
            <section className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Common Mistakes & How to Avoid Them</span>
              </h4>
              <div className="space-y-2.5">
                {activeProperty.commonMistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-relaxed dark:border-slate-800 dark:bg-slate-950/50"
                  >
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Mistake: </span>
                      <FormattedProse text={item.mistake} />
                    </p>
                    <p className="mt-1.5 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">How to avoid: </span>
                      <FormattedProse text={item.fix} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {/* Footer Prev / Next Stepper */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
        <button
          type="button"
          disabled={!prevProp}
          onClick={() => prevProp && onSelectPropertyId(prevProp.id)}
          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="max-w-[140px] truncate">{prevProp ? prevProp.controlLabel : 'Start'}</span>
        </button>

        <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          {activeIndex + 1} / {properties.length}
        </span>

        <button
          type="button"
          disabled={!nextProp}
          onClick={() => nextProp && onSelectPropertyId(nextProp.id)}
          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <span className="max-w-[140px] truncate">{nextProp ? nextProp.controlLabel : 'Done'}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
