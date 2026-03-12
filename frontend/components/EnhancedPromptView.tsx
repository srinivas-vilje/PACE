'use client';

import React, { useState } from 'react';

interface EnhancedPromptViewProps {
  refined: string;
  structured: string;
  professional: string;
  minimal: string;
}

const tabs = [
  { key: 'refined', label: '✨ Refined', desc: 'Main optimized version' },
  { key: 'structured', label: '📋 Structured', desc: 'With clear sections' },
  { key: 'professional', label: '💼 Professional', desc: 'Formal tone' },
  { key: 'minimal', label: '⚡ Minimal', desc: 'Concise version' },
];

export default function EnhancedPromptView({ refined, structured, professional, minimal }: EnhancedPromptViewProps) {
  const [activeTab, setActiveTab] = useState('refined');
  const [copied, setCopied] = useState(false);

  const prompts: Record<string, string> = { refined, structured, professional, minimal };
  const activePrompt = prompts[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Enhanced Prompt</h3>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prompt display */}
      <div className="relative">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/30 min-h-[120px]">
          <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">
            {activePrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
