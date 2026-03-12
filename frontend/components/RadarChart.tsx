'use client';

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ScoreData {
  clarity: number;
  context_completeness: number;
  constraints_defined: number;
  output_format: number;
  audience_definition: number;
  domain_specificity: number;
  examples_included: number;
  edge_cases_covered: number;
}

interface RadarChartProps {
  scores: ScoreData;
}

export default function RadarChartComponent({ scores }: RadarChartProps) {
  const data = [
    { subject: 'Clarity', value: scores.clarity, fullMark: 10 },
    { subject: 'Context', value: scores.context_completeness, fullMark: 10 },
    { subject: 'Constraints', value: scores.constraints_defined, fullMark: 10 },
    { subject: 'Format', value: scores.output_format, fullMark: 10 },
    { subject: 'Audience', value: scores.audience_definition, fullMark: 10 },
    { subject: 'Domain', value: scores.domain_specificity, fullMark: 10 },
    { subject: 'Examples', value: scores.examples_included, fullMark: 10 },
    { subject: 'Edge Cases', value: scores.edge_cases_covered, fullMark: 10 },
  ];

  return (
    <div className="glass-card p-6" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-semibold mb-4 gradient-text">Score Breakdown</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            stroke="rgba(148, 163, 184, 0.1)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(26, 34, 53, 0.95)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              color: '#f1f5f9',
              fontSize: '13px',
              backdropFilter: 'blur(10px)',
            }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#6366f1"
            fill="url(#radarGradient)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
