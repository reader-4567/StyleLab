import React, { useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';
import { generateExportHtml } from '../utils/cssGenerator.js';

export default function ExportModal({
  isOpen,
  onClose,
  playgroundId,
  playgroundName,
  props,
  items,
  cssCode,
}) {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = generateExportHtml(playgroundId, props, items);
  const displayCode = activeTab === 'html' ? htmlCode : cssCode;
  const filename = activeTab === 'html' ? `stylelab-${playgroundId}.html` : `stylelab-${playgroundId}.css`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = displayCode;
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

  function handleDownload() {
    const mime = activeTab === 'html' ? 'text/html;charset=utf-8' : 'text/css;charset=utf-8';
    const blob = new Blob([displayCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div>
            <h2
              id="export-modal-title"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Export {playgroundName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standalone HTML document or clean CSS rules ready for production.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === 'html'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              HTML + CSS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('css')}
              className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === 'css'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              CSS Only
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download {activeTab === 'html' ? '.html' : '.css'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-200">
          <pre className="m-0 whitespace-pre-wrap">{displayCode}</pre>
        </div>
      </div>
    </div>
  );
}
