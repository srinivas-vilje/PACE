'use client';

import React, { useState } from 'react';

interface FeedbackData {
  prompt_id: number;
  helpful_score: number;
  better_output: string;
  use_again: string;
  comments?: string;
}

interface FeedbackModalProps {
  promptId: number;
  onSubmit: (data: FeedbackData) => void;
  onClose: () => void;
}

export default function FeedbackModal({ promptId, onSubmit, onClose }: FeedbackModalProps) {
  const [helpfulScore, setHelpfulScore] = useState(0);
  const [betterOutput, setBetterOutput] = useState('');
  const [useAgain, setUseAgain] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    onSubmit({
      prompt_id: promptId,
      helpful_score: helpfulScore,
      better_output: betterOutput,
      use_again: useAgain,
      comments: comments || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 max-w-md w-full animate-fade-in" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <h3 className="text-lg font-semibold gradient-text mb-4">How was the analysis?</h3>

        {/* Helpfulness */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">Was this helpful?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setHelpfulScore(n)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                  helpfulScore >= n
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Better output */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">Did improved prompt give better output?</label>
          <div className="flex gap-2">
            {['Yes', 'No', 'Maybe'].map((opt) => (
              <button
                key={opt}
                onClick={() => setBetterOutput(opt)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  betterOutput === opt
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/30 hover:bg-slate-700/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Use again */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">Would you use this again?</label>
          <div className="flex gap-2">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                onClick={() => setUseAgain(opt)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  useAgain === opt
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/30 hover:bg-slate-700/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-2">Additional comments (optional)</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            className="prompt-textarea text-sm"
            placeholder="Any other feedback..."
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 bg-slate-800/60 border border-slate-700/30 hover:bg-slate-700/60 transition-all">
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={!helpfulScore}
            className={`flex-1 glow-btn py-2.5 text-sm ${!helpfulScore ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
