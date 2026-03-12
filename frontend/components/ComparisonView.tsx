'use client';

import React from 'react';

interface ComparisonViewProps {
  originalOutput: string;
  enhancedOutput: string;
  comparisonAnalysis: string;
}

export default function ComparisonView({ originalOutput, enhancedOutput, comparisonAnalysis }: ComparisonViewProps) {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Output Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Original output */}
        <div className="rounded-xl bg-slate-900/60 border border-red-500/10 overflow-hidden">
          <div className="px-4 py-2 bg-red-500/5 border-b border-red-500/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              Original Prompt Output
            </span>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
              {originalOutput}
            </pre>
          </div>
        </div>

        {/* Enhanced output */}
        <div className="rounded-xl bg-slate-900/60 border border-emerald-500/10 overflow-hidden">
          <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Enhanced Prompt Output
            </span>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
              {enhancedOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Analysis */}
      {comparisonAnalysis && (
        <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Evaluator Analysis
          </span>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{comparisonAnalysis}</p>
        </div>
      )}
    </div>
  );
}
