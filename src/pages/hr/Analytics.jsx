import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  LineChart as LineIcon, Users, Star, BarChart3,
  PieChart as PieIcon, TrendingUp, Target, Clock,
  Download, Filter, UserCheck, Award
} from 'lucide-react';

const TOOLTIP = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

const scoreData = [
  { range: '60-70', count: 4, fill: '#f43f5e' },
  { range: '70-80', count: 12, fill: '#f59e0b' },
  { range: '80-90', count: 24, fill: '#6366f1' },
  { range: '90-100', count: 10, fill: '#10b981' },
];

const applicantTrends = [
  { month: 'May', applicants: 45, shortlists: 12, offers: 3 },
  { month: 'Jun', applicants: 85, shortlists: 22, offers: 7 },
  { month: 'Jul', applicants: 110, shortlists: 34, offers: 12 },
  { month: 'Aug', applicants: 134, shortlists: 48, offers: 18 },
  { month: 'Sep', applicants: 168, shortlists: 60, offers: 24 },
];

const sourceData = [
  { name: 'LinkedIn', value: 450, color: '#6366f1' },
  { name: 'Referrals', value: 180, color: '#10b981' },
  { name: 'Campus Portal', value: 310, color: '#0d9488' },
  { name: 'Direct Apply', value: 120, color: '#f59e0b' },
];

const pipelineStages = [
  { stage: 'Applied', count: 428 },
  { stage: 'Screened', count: 284 },
  { stage: 'Shortlisted', count: 96 },
  { stage: 'Interviewed', count: 42 },
  { stage: 'Offered', count: 18 },
];

const domainBreakdown = [
  { domain: 'Cyber Security', shortlisted: 22, rejected: 8 },
  { domain: 'Fullstack Dev', shortlisted: 38, rejected: 14 },
  { domain: 'AI / ML', shortlisted: 18, rejected: 6 },
  { domain: 'Cloud DevOps', shortlisted: 12, rejected: 8 },
  { domain: 'Data Science', shortlisted: 14, rejected: 5 },
];

const timeToHire = [
  { week: 'Wk 1', days: 5 },
  { week: 'Wk 2', days: 4 },
  { week: 'Wk 3', days: 6 },
  { week: 'Wk 4', days: 3 },
  { week: 'Wk 5', days: 4 },
  { week: 'Wk 6', days: 3 },
];

const KPIS = [
  { label: 'Total Pool Scanned', value: '1,060', sub: 'Resumes this cycle', icon: Users, color: 'brand-teal' },
  { label: 'Average Match Score', value: '82.5%', sub: 'AI domain scoring', icon: Star, color: 'brand-violet' },
  { label: 'Avg Screening Time', value: '1.2s', sub: 'per resume', icon: Clock, color: 'brand-blue' },
  { label: 'Shortlist Rate', value: '22.4%', sub: '+4.2% vs last month', icon: UserCheck, color: 'emerald' },
];

export default function HrAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Recruitment & Matching Analytics</h1>
          <p className="text-xs text-gray-400">Monitor candidate scores, sourcing channels, pipeline stats, and hiring speed.</p>
        </div>
        <Button variant="outline" size="sm" icon={Download} className="text-xs">Export CSV</Button>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-obsidian-950 border border-white/[0.08] w-fit">
        {['overview', 'pipeline', 'domains'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
              activeTab === tab ? 'bg-brand-teal text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'pipeline' ? 'Pipeline Flow' : 'Domain Breakdown'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPIS.map((k, i) => {
              const Icon = k.icon;
              return (
                <Card key={i} className="p-5 space-y-2 bg-obsidian-900/90 border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest leading-tight">{k.label}</span>
                    <Icon className="h-4 w-4 text-brand-teal" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-0.5">{k.value}</p>
                  <p className="text-[10px] text-gray-500">{k.sub}</p>
                </Card>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Trends */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Monthly Hiring Pipeline Trends
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicantTrends}>
                    <defs>
                      <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="shGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip contentStyle={TOOLTIP} />
                    <Area type="monotone" dataKey="applicants" stroke="#8b5cf6" fill="url(#appGrad)" strokeWidth={2} dot={false} name="Applicants" />
                    <Area type="monotone" dataKey="shortlists" stroke="#0d9488" fill="url(#shGrad)" strokeWidth={2} dot={false} name="Shortlisted" />
                    <Area type="monotone" dataKey="offers" stroke="#f59e0b" strokeWidth={1.5} fill="none" dot={false} name="Offers" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-400 rounded inline-block" /> Applicants</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-teal-400 rounded inline-block" /> Shortlisted</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 rounded inline-block" /> Offers</span>
              </div>
            </Card>

            {/* Match Score Distribution */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                AI Match Score Distribution
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} barSize={36}>
                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip contentStyle={TOOLTIP} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Candidates">
                      {scoreData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Source Channels */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Applicant Sourcing Channels</h3>
              <div className="h-48 flex items-center gap-6">
                <div className="h-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={36} paddingAngle={3}>
                        {sourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2.5 shrink-0">
                  {sourceData.map(item => (
                    <div key={item.name} className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 pl-3.5">{item.value} candidates</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Time-to-Hire */}
            <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Time-to-Hire (Days)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeToHire}>
                    <XAxis dataKey="week" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} domain={[0, 10]} />
                    <Tooltip contentStyle={TOOLTIP} />
                    <Line type="monotone" dataKey="days" stroke="#0d9488" strokeWidth={2.5} dot={{ fill: '#0d9488', r: 4 }} name="Days to Hire" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-500">Average: <strong className="text-white">4.2 days</strong> per confirmed hire</p>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Recruitment Pipeline Funnel</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineStages} layout="vertical" barSize={22}>
                  <XAxis type="number" stroke="#6b7280" fontSize={10} />
                  <YAxis type="category" dataKey="stage" stroke="#6b7280" fontSize={10} width={80} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Candidates" fill="#0d9488">
                    {pipelineStages.map((_, i) => (
                      <Cell key={i} fill={`hsl(${173 - i * 15}, 65%, ${52 - i * 4}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {pipelineStages.map((stage, i) => {
              const prev = pipelineStages[i - 1];
              const rate = prev ? Math.round((stage.count / prev.count) * 100) : 100;
              return (
                <Card key={stage.stage} className="p-4 bg-obsidian-900/90 border border-white/[0.08] space-y-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">{stage.stage}</p>
                  <p className="text-2xl font-extrabold font-heading text-white">{stage.count}</p>
                  {prev && (
                    <p className="text-[10px] text-amber-400">
                      {rate}% pass-through from {prev.stage}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'domains' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Shortlist vs Rejection by Domain (Knowledge Graph Screening)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainBreakdown} barSize={16}>
                  <XAxis dataKey="domain" stroke="#6b7280" fontSize={9} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Bar dataKey="shortlisted" fill="#10b981" radius={[4, 4, 0, 0]} name="Shortlisted" />
                  <Bar dataKey="rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400 inline-block" /> Shortlisted</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500 inline-block" /> Rejected</span>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainBreakdown.map(d => {
              const rate = Math.round((d.shortlisted / (d.shortlisted + d.rejected)) * 100);
              return (
                <Card key={d.domain} className="p-4 bg-obsidian-900/90 border border-white/[0.08] space-y-3">
                  <p className="text-xs font-bold text-white">{d.domain}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">{d.shortlisted} shortlisted</span>
                    <span className="text-rose-400">{d.rejected} rejected</span>
                  </div>
                  <div className="h-2 rounded-full bg-obsidian-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400">Shortlist rate: <strong className="text-white">{rate}%</strong></p>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
