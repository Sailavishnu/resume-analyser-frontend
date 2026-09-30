import React, { useState } from 'react';
import {
  TrendingUp, BarChart3, Users, ArrowUpRight,
  Cpu, Award, Target, Activity, Download, Globe, Shield
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const TOOLTIP = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

const SCORE_DISTRIBUTIONS = [
  { range: '90-100 (Elite)', count: 420, percent: 18, fill: '#10b981' },
  { range: '75-89 (Ready)', count: 1240, percent: 52, fill: '#6366f1' },
  { range: '60-74 (Polish)', count: 580, percent: 24, fill: '#f59e0b' },
  { range: '<60 (Risky)', count: 140, percent: 6, fill: '#f43f5e' },
];

const SKILL_GAP_DATA = [
  { skill: 'React.js', studentSupply: 88, hrDemand: 92 },
  { skill: 'TypeScript', studentSupply: 54, hrDemand: 82 },
  { skill: 'Docker', studentSupply: 38, hrDemand: 74 },
  { skill: 'Python / AI', studentSupply: 79, hrDemand: 68 },
  { skill: 'AWS Cloud', studentSupply: 31, hrDemand: 78 },
  { skill: 'Cybersecurity', studentSupply: 44, hrDemand: 68 },
];

const MONTHLY_RESUMES = [
  { month: 'Apr', uploads: 320, analyzed: 295, placed: 42 },
  { month: 'May', uploads: 480, analyzed: 450, placed: 68 },
  { month: 'Jun', uploads: 610, analyzed: 580, placed: 94 },
  { month: 'Jul', uploads: 720, analyzed: 698, placed: 120 },
  { month: 'Aug', uploads: 890, analyzed: 864, placed: 148 },
  { month: 'Sep', uploads: 1040, analyzed: 1010, placed: 184 },
];

const HIRING_FUNNEL = [
  { stage: 'Applied', count: 4200 },
  { stage: 'Screened', count: 2800 },
  { stage: 'Shortlisted', count: 1200 },
  { stage: 'Interviewed', count: 540 },
  { stage: 'Offered', count: 220 },
  { stage: 'Placed', count: 184 },
];

const TOP_COMPANIES = [
  { name: 'Infosys', hires: 48, avgScore: 84 },
  { name: 'Zoho', hires: 36, avgScore: 88 },
  { name: 'TCS', hires: 62, avgScore: 78 },
  { name: 'Wipro', hires: 24, avgScore: 81 },
  { name: 'IBM', hires: 18, avgScore: 92 },
  { name: 'Accenture', hires: 40, avgScore: 79 },
];

const RADAR_DATA = [
  { subject: 'Resume Quality', A: 82 },
  { subject: 'Skill Match', A: 74 },
  { subject: 'ATS Compliance', A: 88 },
  { subject: 'Placement Rate', A: 68 },
  { subject: 'Engagement', A: 79 },
  { subject: 'Interview Success', A: 72 },
];

const SOURCE_PIE = [
  { name: 'Direct Portal', value: 1840, color: '#0d9488' },
  { name: 'LinkedIn', value: 1220, color: '#6366f1' },
  { name: 'Referrals', value: 620, color: '#f59e0b' },
  { name: 'Campus Drive', value: 380, color: '#0ea5e9' },
];

const SUMMARY_KPIS = [
  { label: 'Total Analyses', value: '3,892', change: '+12%', icon: BarChart3 },
  { label: 'Avg ATS Score', value: '76.4%', change: '+2.1 pts', icon: Target },
  { label: 'Placement Rate', value: '58.8%', change: '+6.4%', icon: TrendingUp },
  { label: 'Screening Efficiency', value: '1.2s', change: '-0.3s faster', icon: Cpu },
];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Platform Intelligence & Talent Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Insights into candidate ATS distributions, market skill demands, hiring funnels, and placement conversions.
          </p>
        </div>
        <Button variant="outline" size="sm" icon={Download}>
          Export Report
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-obsidian-950 border border-white/[0.08] w-fit">
        {['overview', 'skills', 'hiring'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
              activeTab === tab
                ? 'bg-brand-teal text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'overview' ? 'Platform Overview' : tab === 'skills' ? 'Skill Gap Analysis' : 'Hiring Funnel'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SUMMARY_KPIS.map((k, i) => {
              const Icon = k.icon;
              return (
                <Card key={i} className="p-4 space-y-2 bg-obsidian-900/90 border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{k.label}</span>
                    <Icon className="h-4 w-4 text-brand-teal" />
                  </div>
                  <p className="text-xl font-extrabold font-heading text-white">{k.value}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="h-2.5 w-2.5" /> {k.change}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Monthly Resume Activity */}
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Monthly Resume Activity (Uploads → Analyzed → Placed)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_RESUMES}>
                  <defs>
                    <linearGradient id="uplGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="anlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="plcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Area type="monotone" dataKey="uploads" stroke="#6366f1" fill="url(#uplGrad)" strokeWidth={2} dot={false} name="Uploaded" />
                  <Area type="monotone" dataKey="analyzed" stroke="#0d9488" fill="url(#anlGrad)" strokeWidth={2} dot={false} name="Analyzed" />
                  <Area type="monotone" dataKey="placed" stroke="#f59e0b" fill="url(#plcGrad)" strokeWidth={2} dot={false} name="Placed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 text-[10px] text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-400 rounded inline-block" /> Uploaded</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-teal-400 rounded inline-block" /> Analyzed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 rounded inline-block" /> Placed</span>
            </div>
          </Card>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ATS Score Distribution */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">ATS Score Distribution</h3>
                <span className="text-xs text-brand-blue font-semibold">3,892 Resumes</span>
              </div>
              <div className="space-y-3">
                {SCORE_DISTRIBUTIONS.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{s.range}</span>
                      <span className="text-white">{s.count.toLocaleString()} ({s.percent}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-obsidian-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.percent}%`, background: s.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Source Channels Pie */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Applicant Sources</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SOURCE_PIE} dataKey="value" innerRadius={30} outerRadius={56} paddingAngle={3}>
                      {SOURCE_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {SOURCE_PIE.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4">
          {/* Skill Gap Bar */}
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Curriculum vs Market Skill Gap Analysis</h3>
              <Badge variant="amber">Market Intelligence</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKILL_GAP_DATA} barSize={14}>
                  <XAxis dataKey="skill" stroke="#6b7280" fontSize={9} />
                  <YAxis stroke="#6b7280" fontSize={9} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Bar dataKey="hrDemand" fill="#6366f1" radius={[4, 4, 0, 0]} name="HR Demand %" />
                  <Bar dataKey="studentSupply" fill="#0d9488" radius={[4, 4, 0, 0]} name="Student Supply %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500 inline-block" /> HR Demand</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-teal-500 inline-block" /> Student Supply</span>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Platform Radar */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Platform Performance Radar</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={80}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={9} />
                    <PolarRadiusAxis stroke="#374151" fontSize={8} />
                    <Radar name="Platform" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
                    <Tooltip contentStyle={TOOLTIP} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Skill Gap Cards */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Critical Skill Gap Summary</h3>
              <div className="space-y-2.5">
                {SKILL_GAP_DATA.map(item => {
                  const gap = item.hrDemand - item.studentSupply;
                  return (
                    <div key={item.skill} className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{item.skill}</p>
                        <p className="text-[10px] text-gray-400">
                          Supply: {item.studentSupply}% · Demand: {item.hrDemand}%
                        </p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                        gap > 20 ? 'bg-rose-500/15 text-rose-400' :
                        gap > 0 ? 'bg-amber-500/15 text-amber-300' :
                        'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        {gap > 0 ? `+${gap}% Gap` : 'Surplus'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'hiring' && (
        <div className="space-y-4">
          {/* Funnel */}
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Platform-wide Hiring Funnel</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HIRING_FUNNEL} layout="vertical" barSize={18}>
                  <XAxis type="number" stroke="#6b7280" fontSize={9} />
                  <YAxis type="category" dataKey="stage" stroke="#6b7280" fontSize={10} width={80} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Candidates" fill="#0d9488">
                    {HIRING_FUNNEL.map((_, i) => (
                      <Cell key={i} fill={`hsl(${170 - i * 20}, 70%, ${50 - i * 3}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Companies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Top Hiring Companies</h3>
              <div className="space-y-2.5">
                {TOP_COMPANIES.map((co, i) => (
                  <div key={co.name} className="flex items-center justify-between p-3 bg-obsidian-950 rounded-xl border border-white/[0.06] text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 font-bold w-4">#{i + 1}</span>
                      <p className="font-semibold text-white">{co.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{co.hires} hires</p>
                      <p className="text-[10px] text-gray-500">Avg Match: {co.avgScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Conversion Rate by Stage</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={HIRING_FUNNEL}>
                    <XAxis dataKey="stage" stroke="#6b7280" fontSize={9} />
                    <YAxis stroke="#6b7280" fontSize={9} />
                    <Tooltip contentStyle={TOOLTIP} />
                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Candidates" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Applied → Placed: <strong className="text-white">4.4%</strong></span>
                <span>Interview → Offer: <strong className="text-emerald-400">40.7%</strong></span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
