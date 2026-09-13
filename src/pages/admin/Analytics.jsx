import React from 'react';
import {
  TrendingUp, BarChart3, PieChart, Users, ArrowUpRight,
  Cpu, Award, Target, Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminAnalytics() {
  const skillGapData = [
    { skill: 'React.js', studentSupply: 88, hrDemand: 92, gap: '+4% High Demand' },
    { skill: 'TypeScript', studentSupply: 54, hrDemand: 82, gap: '+28% Talent Shortage' },
    { skill: 'Docker / Containers', studentSupply: 38, hrDemand: 74, gap: '+36% Talent Shortage' },
    { skill: 'Python / AI Basics', studentSupply: 79, hrDemand: 68, gap: 'Balanced' },
    { skill: 'AWS / Cloud Deployment', studentSupply: 31, hrDemand: 78, gap: '+47% Critical Shortage' },
  ];

  const scoreDistributions = [
    { range: '90 - 100% (Elite ATS Match)', count: 420, percent: 18, color: 'bg-emerald-500' },
    { range: '75 - 89% (Interview Ready)', count: 1240, percent: 52, color: 'bg-indigo-500' },
    { range: '60 - 74% (Needs Polish)', count: 580, percent: 24, color: 'bg-amber-500' },
    { range: 'Below 60% (High Rejection Risk)', count: 140, percent: 6, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Platform Intelligence & Talent Analytics
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Insights into candidate ATS score distributions, market skill demands, and placement conversion.
          </p>
        </div>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATS Score Distribution */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              ATS Score Distribution (All Active Resumes)
            </h3>
            <span className="text-xs text-brand-blue font-semibold">3,892 Resumes</span>
          </div>

          <div className="space-y-3">
            {scoreDistributions.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-secondary)' }}>{s.range}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{s.count} ({s.percent}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Gap Analysis */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Curriculum & Skill Gap Analysis
            </h3>
            <span className="text-xs text-amber-500 font-semibold">Market vs Student CVs</span>
          </div>

          <div className="space-y-2.5">
            {skillGapData.map((item, i) => (
              <div key={i} className="p-3 rounded-xl glass flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.skill}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Student Supply: {item.studentSupply}% · HR Demand: {item.hrDemand}%
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                  item.gap.includes('Shortage') ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'
                }`}>
                  {item.gap}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
