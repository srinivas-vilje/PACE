'use client';

import React, { useState } from 'react';
import PromptEditor from '@/components/PromptEditor';
import RadarChart from '@/components/RadarChart';
import ScoreCard from '@/components/ScoreCard';
import SuggestionPanel from '@/components/SuggestionPanel';
import EnhancedPromptView from '@/components/EnhancedPromptView';
import ComparisonView from '@/components/ComparisonView';
import FeedbackModal from '@/components/FeedbackModal';

interface AnalysisResult {
  id: number;
  analysis: {
    intent: { intent: string; confidence: number; complexity_level: string };
    structure_scores: {
      clarity: number;
      context_completeness: number;
      constraints_defined: number;
      output_format: number;
      audience_definition: number;
      domain_specificity: number;
      examples_included: number;
      edge_cases_covered: number;
    };
    gaps: Array<{ type: string; suggestion: string }>;
    enhanced_prompts: {
      refined_prompt: string;
      structured_version: string;
      professional_version: string;
      minimal_version: string;
    };
    final_scoring: {
      total_score: number;
      grade: string;
      quality_level: string;
    };
    pii_analysis?: { detected: boolean; description: string; masked_prompt: string };
    few_shot_examples?: string[];
    model_benchmarks?: Array<{ model_name: string; rating: number; reasoning: string }>;
    original_output?: string;
    enhanced_output?: string;
    comparison_analysis?: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'playground'>('analysis');

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (res.ok) setHistory(await res.json());
    } catch (e) { console.error(e); }
  };

  React.useEffect(() => { fetchHistory(); }, []);

  const handleAnalyze = async (data: { prompt: string; domain?: string; target_llm?: string; desired_format?: string; comparison_enabled: boolean }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Server error ${res.status}`);
      }

      const json: AnalysisResult = await res.json();
      setResult(json);
      fetchHistory(); // Refresh history after new analysis
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to analyze prompt. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async (prompt: string, model: string) => {
    try {
      const res = await fetch(`${API_BASE}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      return await res.json();
    } catch (e) {
      return { error: 'Execution failed' };
    }
  };

  const handleFeedback = async (feedbackData: { prompt_id: number; helpful_score: number; better_output: string; use_again: string; comments?: string }) => {
    try {
      await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
    } catch (e) {
      console.error('Failed to submit feedback', e);
    }
    setShowFeedback(false);
  };

  const analysis = result?.analysis;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-md bg-slate-900/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">PACE</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Prompt Analysis & Composition Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v1.0
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar History */}
        <aside className="w-64 border-r border-slate-800/50 h-[calc(100vh-65px)] sticky top-[65px] bg-slate-900/50 backdrop-blur-sm overflow-y-auto hidden lg:block">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Prompt History</h3>
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setResult({ id: item.id, analysis: item })}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                    result?.id === item.id 
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' 
                    : 'bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <p className="truncate font-medium mb-1">{item.original_prompt}</p>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="opacity-70">{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-700/50">Score: {Math.round(item.final_scoring?.total_score || 0)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'analysis' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Analysis & Strategy
                {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('playground')}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'playground' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Model Playground
                {activeTab === 'playground' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
              </button>
            </div>

            {activeTab === 'analysis' ? (
              <>
                {/* Hero */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                    Analyze & Enhance Your <span className="gradient-text">Prompts</span>
                  </h2>
                </div>

                {/* Prompt Editor */}
                <div className="mb-8">
                  <PromptEditor onSubmit={handleAnalyze} isLoading={isLoading} />
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                    ⚠️ {error}
                  </div>
                )}

                {/* Results Analysis */}
                {analysis && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Security Alert (Feature 4) */}
                    {analysis.pii_analysis?.detected && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                        <span className="text-xl">🛡️</span>
                        <div>
                          <h4 className="text-amber-400 font-semibold text-sm">Security Alert: Sensitive Data Detected</h4>
                          <p className="text-xs text-amber-500/80 mt-1">{analysis.pii_analysis.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Intent & Stats */}
                    {analysis.intent && (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="score-badge grade-b">Intent: {analysis.intent.intent}</span>
                        <span className="score-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                          Confidence: {(analysis.intent.confidence * 100).toFixed(0)}%
                        </span>
                        <span className="score-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          Complexity: {analysis.intent.complexity_level}
                        </span>
                      </div>
                    )}

                    {/* Core Scoring */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1">
                        <ScoreCard
                          totalScore={analysis.final_scoring?.total_score || 0}
                          grade={analysis.final_scoring?.grade || 'N/A'}
                          qualityLevel={analysis.final_scoring?.quality_level || 'Unknown'}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        {analysis.structure_scores && <RadarChart scores={analysis.structure_scores} />}
                      </div>
                    </div>

                    {/* Model Benchmarking (Feature 5) */}
                    {analysis.model_benchmarks && (
                      <div className="glass-card p-6">
                        <h3 className="text-sm font-semibold mb-4 text-slate-300">Target Model Compatibility</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {analysis.model_benchmarks.map((m) => (
                            <div key={m.model_name} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-200">{m.model_name}</span>
                                <div className="flex text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < m.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{m.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced Prompt View */}
                    {analysis.enhanced_prompts && (
                      <EnhancedPromptView
                        refined={analysis.enhanced_prompts.refined_prompt}
                        structured={analysis.enhanced_prompts.structured_version}
                        professional={analysis.enhanced_prompts.professional_version}
                        minimal={analysis.enhanced_prompts.minimal_version}
                      />
                    )}

                    {/* Knowledge Boost: Examples (Feature 7) */}
                    {analysis.few_shot_examples && analysis.few_shot_examples.length > 0 && (
                      <div className="glass-card p-6 border-l-4 border-l-indigo-500">
                        <h3 className="text-sm font-semibold mb-4 text-indigo-300 flex items-center gap-2">
                          <span>💡</span> Intelligence Boost: Key Examples
                        </h3>
                        <div className="space-y-3">
                          {analysis.few_shot_examples.map((ex, i) => (
                            <div key={i} className="text-xs p-3 rounded-lg bg-slate-900/50 text-slate-400 border border-slate-800">
                              {ex}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <SuggestionPanel suggestions={analysis.gaps} />
                  </div>
                )}
              </>
            ) : (
              <div className="animate-fade-in text-center py-20">
                <div className="max-w-md mx-auto">
                  <span className="text-4xl mb-4 block">🧪</span>
                  <h3 className="text-xl font-bold mb-2">Model Playground</h3>
                  <p className="text-slate-500 text-sm mb-8">Execute your optimized prompts against real models to see the difference.</p>
                  <p className="text-xs text-slate-600 italic">Playground feature integration in progress...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && result && (
        <FeedbackModal
          promptId={result.id}
          onSubmit={handleFeedback}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </main>
  );
}
