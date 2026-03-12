'use client';

import React, { useState } from 'react';

interface PromptEditorProps {
  onSubmit: (data: {
    prompt: string;
    domain?: string;
    target_llm?: string;
    desired_format?: string;
    comparison_enabled: boolean;
  }) => void;
  isLoading: boolean;
}

const domains = ['coding', 'business', 'analysis', 'writing', 'education', 'marketing', 'research', 'other'];
const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Other'];

export default function PromptEditor({ onSubmit, isLoading }: PromptEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [domain, setDomain] = useState('');
  const [targetLlm, setTargetLlm] = useState('');
  const [desiredFormat, setDesiredFormat] = useState('');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({
      prompt: prompt.trim(),
      domain: domain || undefined,
      target_llm: targetLlm || undefined,
      desired_format: desiredFormat || undefined,
      comparison_enabled: comparisonEnabled,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Prompt Editor</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{prompt.length} chars</span>
          <span>•</span>
          <span>{prompt.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      <textarea
        className="prompt-textarea mb-4"
        rows={6}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your prompt here... e.g., 'Write a Python function that sorts a list of dictionaries by multiple keys'"
      />

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        className="text-xs text-indigo-400 hover:text-indigo-300 mb-4 flex items-center gap-1 transition-colors"
      >
        <span className={`transform transition-transform ${showOptions ? 'rotate-90' : ''}`}>▶</span>
        Advanced Options
      </button>

      {showOptions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 animate-fade-in">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/30 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">Auto-detect</option>
              {domains.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Target LLM</label>
            <select
              value={targetLlm}
              onChange={(e) => setTargetLlm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/30 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">Any</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Desired Format</label>
            <input
              type="text"
              value={desiredFormat}
              onChange={(e) => setDesiredFormat(e.target.value)}
              placeholder="e.g., JSON, Markdown, Code..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/30 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={comparisonEnabled}
              onChange={(e) => setComparisonEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-indigo-500 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-xs text-slate-400">Enable Output Comparison</span>
        </label>

        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={`glow-btn px-6 py-2.5 text-sm flex items-center gap-2 ${
            !prompt.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
          } ${isLoading ? 'pulse-loading' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>🔍 Analyze Prompt</>
          )}
        </button>
      </div>
    </form>
  );
}
