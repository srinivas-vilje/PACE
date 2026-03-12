'use client';

import React from 'react';

interface Suggestion {
  type: string;
  suggestion: string;
}

interface SuggestionPanelProps {
  suggestions: Suggestion[];
}

const typeIcons: Record<string, string> = {
  'No output format': '📄',
  'No constraints': '🚧',
  'No role assigned': '🎭',
  'Too broad': '🔍',
  'Ambiguous wording': '❓',
  'No examples': '💡',
  'No deadline': '⏰',
};

function getIcon(type: string) {
  for (const [key, icon] of Object.entries(typeIcons)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '⚡';
}

export default function SuggestionPanel({ suggestions }: SuggestionPanelProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-semibold mb-4 gradient-text">Improvement Suggestions</h3>
        <div className="flex items-center justify-center py-8 text-slate-400">
          <span className="text-2xl mr-3">✨</span>
          <p>No gaps detected — your prompt looks great!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-lg font-semibold mb-4 gradient-text">
        Improvement Suggestions
        <span className="ml-2 text-xs font-normal text-slate-400">({suggestions.length} found)</span>
      </h3>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300"
            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{getIcon(s.type)}</span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {s.type}
              </span>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">{s.suggestion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
