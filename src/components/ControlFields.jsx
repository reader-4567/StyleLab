import React from 'react';
import { HelpCircle } from 'lucide-react';

function LearnButton({ label, onLearn }) {
  if (!onLearn) return null;
  return (
    <button
      type="button"
      onClick={onLearn}
      aria-label={`Learn about ${label}`}
      title={`Detailed guide for ${label}`}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-500 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
    >
      <HelpCircle className="h-3 w-3" />
    </button>
  );
}

export function ControlSection({ title, children, action }) {
  return (
    <div className="border-b border-slate-200 py-3.5 last:border-b-0 dark:border-slate-800">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
  explanation,
  showExplanation = false,
  onLearn,
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <label
            htmlFor={id}
            className="truncate text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          <LearnButton label={label} onLearn={onLearn} />
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            aria-label={`${label} numeric value`}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (!Number.isNaN(next)) {
                onChange(Math.min(max, Math.max(min, next)));
              }
            }}
            className="w-16 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-right font-mono text-xs tabular-nums text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {unit ? (
            <span className="w-6 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="stylelab-slider w-full"
      />
      {showExplanation && explanation ? (
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {explanation}
        </p>
      ) : null}
    </div>
  );
}

export function SelectControl({
  id,
  label,
  value,
  options,
  onChange,
  explanation,
  showExplanation = false,
  onLearn,
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <label
            htmlFor={id}
            className="truncate text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          <LearnButton label={label} onLearn={onLearn} />
        </div>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-[155px] rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
      {showExplanation && explanation ? (
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {explanation}
        </p>
      ) : null}
    </div>
  );
}

export function SegmentedControl({
  label,
  value,
  options,
  onChange,
  explanation,
  showExplanation = false,
  onLearn,
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
          <LearnButton label={label} onLearn={onLearn} />
        </div>
      ) : null}
      <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-md border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
        {options.map((opt) => {
          const optVal = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isActive = value === optVal;
          return (
            <button
              key={optVal}
              type="button"
              onClick={() => onChange(optVal)}
              className={`rounded px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {optLabel}
            </button>
          );
        })}
      </div>
      {showExplanation && explanation ? (
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {explanation}
        </p>
      ) : null}
    </div>
  );
}

export function ColorControl({ id, label, value, onChange }) {
  const pickerValue = /^#[0-9a-fA-F]{6}$/.test(value || '')
    ? value
    : /^#[0-9a-fA-F]{3}$/.test(value || '')
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : '#000000';

  return (
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-7 cursor-pointer rounded border border-slate-200 bg-transparent p-0.5 dark:border-slate-700"
        />
        <input
          type="text"
          aria-label={`${label} hex code`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
}

export function ToggleControl({ id, label, checked, onChange, explanation, showExplanation = false, onLearn }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <label
            htmlFor={id}
            className="truncate text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
          <LearnButton label={label} onLearn={onLearn} />
        </div>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
            checked
              ? 'border-blue-600 bg-blue-600'
              : 'border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              checked ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
      {showExplanation && explanation ? (
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {explanation}
        </p>
      ) : null}
    </div>
  );
}
