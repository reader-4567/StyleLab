import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Code2, Copy, Download } from 'lucide-react';
import { tokenizeCssLines } from '../utils/syntaxHighlight.js';

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

export default function CodePanel({
  cssCode,
  onOpenExport,
  isCollapsed = false,
  onToggleCollapse,
  panelHeight = 164,
  onStartResize,
  onKeyResize,
}) {
  const [copied, setCopied] = useState(false);
  const tokenizedLines = tokenizeCssLines(cssCode);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cssCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <section
      aria-label="Generated CSS Code"
      data-collapsed={isCollapsed ? 'true' : 'false'}
      style={!isCollapsed ? { height: `${panelHeight}px` } : undefined}
      className="relative z-10 flex shrink-0 flex-col border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Draggable horizontal resize divider when expanded */}
      {!isCollapsed && onStartResize ? (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize Generated CSS panel"
          aria-valuenow={panelHeight}
          tabIndex={0}
          onPointerDown={onStartResize}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              onKeyResize?.(16);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              onKeyResize?.(-16);
            }
          }}
          title="Drag to resize Generated CSS panel"
          className="group flex h-2 shrink-0 cursor-row-resize touch-none items-center justify-center border-b border-slate-100 bg-slate-50/80 transition-colors hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none dark:border-slate-800/80 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <span className="h-0.5 w-8 rounded-full bg-slate-300 transition-colors group-hover:bg-blue-500 group-focus-visible:bg-blue-500 dark:bg-slate-700" />
        </div>
      ) : null}

      {/* Code Panel Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-1.5 sm:px-4 dark:border-slate-800">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand Generated CSS panel' : 'Collapse Generated CSS panel'}
            className="inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {isCollapsed ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
            )}
            <Code2 className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span>Generated CSS</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap sm:px-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export HTML & CSS</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy CSS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Syntax-Highlighted Code Body */}
      {!isCollapsed ? (
        <div className="stylelab-scroll min-h-0 flex-1 overflow-auto bg-slate-50/70 p-3 font-mono text-xs leading-5 dark:bg-slate-950/70">
          <pre className="m-0">
            <code>
              {tokenizedLines.map((tokens, lineIdx) => (
                <div key={lineIdx} className="flex">
                  <span className="mr-4 w-5 shrink-0 select-none text-right tabular-nums text-slate-400 dark:text-slate-600">
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
      ) : null}
    </section>
  );
}
