'use client';

import React from 'react';

interface ScoreCardProps {
  totalScore: number;
  grade: string;
  qualityLevel: string;
}

export default function ScoreCard({ totalScore, grade, qualityLevel }: ScoreCardProps) {
  const gradeClass = `grade-${grade.toLowerCase()}`;
  
  const circumference = 2 * Math.PI * 54;
  const progress = (totalScore / 100) * circumference;
  const dashoffset = circumference - progress;

  const getScoreColor = () => {
    if (totalScore >= 90) return '#22c55e';
    if (totalScore >= 70) return '#3b82f6';
    if (totalScore >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center animate-fade-in">
      <h3 className="text-lg font-semibold mb-6 gradient-text">Overall Score</h3>
      
      {/* Circular progress */}
      <div className="relative w-36 h-36 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            stroke="rgba(148, 163, 184, 0.08)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60" cy="60" r="54"
            stroke={getScoreColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: getScoreColor() }}>
            {Math.round(totalScore)}
          </span>
          <span className="text-xs text-slate-400 mt-1">out of 100</span>
        </div>
      </div>

      {/* Grade badge */}
      <div className={`score-badge ${gradeClass} text-base px-6 py-2 mb-2`}>
        Grade: {grade}
      </div>
      
      <p className="text-sm text-slate-400 mt-1">{qualityLevel}</p>
    </div>
  );
}
