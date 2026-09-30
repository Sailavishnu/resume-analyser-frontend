import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Building2, FileText, CheckCircle2, AlertTriangle,
  TrendingUp, Shield, Activity, ArrowRight, MessageSquare, Cpu,
  Server, GraduationCap, Briefcase, Target, Database, Zap, Globe, Eye,
  Filter, Sliders, Layers, RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid
} from 'recharts';

const REGISTRATION_TREND_DATA = {
  '24h': [
    { time: '00:00', students: 12, hr: 1 },
    { time: '04:00', students: 8, hr: 0 },
    { time: '08:00', students: 45, hr: 4 },
    { time: '12:00', students: 89, hr: 9 },
    { time: '16:00', students: 110, hr: 12 },
    { time: '20:00', students: 64, hr: 5 },
  ],
  '7d': [
    { time: 'Mon', students: 140, hr: 12 },
    { time: 'Tue', students: 190, hr: 15 },
    { time: 'Wed', students: 240, hr: 22 },
    { time: 'Thu', students: 310, hr: 28 },
    { time: 'Fri', students: 280, hr: 25 },
    { time: 'Sat', students: 160, hr: 10 },
    { time: 'Sun', students: 120, hr: 8 },
  ],
  '30d': [
    { time: 'Apr', students: 180, hr: 12 },
    { time: 'May', students: 260, hr: 18 },
    { time: 'Jun', students: 340, hr: 24 },
    { time: 'Jul', students: 420, hr: 28 },
    { time: 'Aug', students: 560, hr: 36 },
    { time: 'Sep', students: 720, hr: 52 },
  ]
};

const CONVERSION_FUNNEL = [
  { stage: 'Total Applicants', count: 5420, fill: '#3b82f6' },
  { stage: 'ATS Passed (>75)', count: 3890, fill: '#0ea5e9' },
  { stage: 'Graph Matched', count: 2150, fill: '#0d9488' },
  { stage: 'Interviewed', count: 1284, fill: '#6366f1' },
  { stage: 'Final Offers', count: 840, fill: '#10b981' }
];

const AI_THROUGHPUT_LATENCY = [
  { time: '10:00', latencyMs: 24, throughputRpm: 1240 },
  { time: '10:10', latencyMs: 28, throughputRpm: 1350 },
  { time: '10:20', latencyMs: 22, throughputRpm: 1480 },
  { time: '10:30', latencyMs: 35, throughputRpm: 1890 },
  { time: '10:40', latencyMs: 26, throughputRpm: 1620 },
  { time: '10:50', latencyMs: 21, throughputRpm: 1510 },
  { time: '11:00', latencyMs: 23, throughputRpm: 1590 },
];

const RESUME_SCORE_DIST = [
  { range: '90-100 (Tier 1)', count: 420, fill: '#10b981' },
  { range: '75-89 (Strong)', count: 1240, fill: '#6366f1' },
  { range: '60-74 (Average)', count: 580, fill: '#f59e0b' },
  { range: '<60 (Needs Work)', count: 140, fill: '#f43f5e' },
];

const DOMAIN_DEMAND = [
  { domain: 'Fullstack Web', demand: 92, supply: 78, gap: 14 },
  { domain: 'AI / ML', demand: 88, supply: 52, gap: 36 },
  { domain: 'DevOps / Cloud', demand: 74, supply: 38, gap: 36 },
  { domain: 'Cybersecurity', demand: 68, supply: 44, gap: 24 },
  { domain: 'Data Science', demand: 82, supply: 60, gap: 22 },
];

const PLACEMENT_PIE = [
  { name: 'Placed', value: 840, color: '#0d9488' },
  { name: 'Interviewing', value: 320, color: '#6366f1' },
  { name: 'Shortlisted', value: 180, color: '#f59e0b' },
  { name: 'Pending', value: 560, color: '#374151' },
];

const CHART_TOOLTIP_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 11, borderRadius: 8 };

export default function AdminDashboard() {
  const { stats, users, auditLogs, fetchDashboardStats, fetchUsers } = useAdminStore();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, [fetchDashboardStats, fetchUsers]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardStats();
    fetchUsers();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const kpis = [
    {
      label: 'Total Students', value: (stats.totalStudents || 0).toLocaleString(),
      sub: '+14.2% vs last month', icon: GraduationCap, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20'
    },
    {
      label: 'Verified Recruiters', value: (stats.totalHr || 0).toLocaleString(),
      sub: '+8 new companies', icon: Building2, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20'
    },
    {
      label: 'Resumes Analyzed', value: (stats.resumesAnalyzed || 0).toLocaleString(),
      sub: `Avg ATS: ${stats.averageAtsScore || 82.5}%`, icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Active Job Posts', value: (stats.activeJobs || 145).toLocaleString(),
      sub: '+22 this week', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'AI Knowledge Graph Scans', value: '6,284',
      sub: 'Inter-domain queries', icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Platform Health Uptime', value: stats.systemHealth || '99.98%',
      sub: 'Last 30 days · 22ms latency', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      label: 'Confirmed Placements', value: '840',
      sub: '15.5% placement rate', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Interviews Scheduled', value: '1,284',
      sub: '342 completed today', icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header Banner ── */}
      <ScrollReveal variant="fade" duration={0.5}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-teal-950/30 p-6 sm:p-8">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                  Master Analytics & Admin Operations
                </h1>
                <Badge variant="violet">Superadmin Live</Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
                Comprehensive platform telemetry, AI knowledge graph performance, user moderation, and recruitment conversion graphics.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-white/10 text-gray-300 hover:text-white transition-all"
                title="Refresh metrics"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
              </button>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')} icon={Users}>
                Users ({users.length})
              </Button>
              <Button variant="teal" size="sm" onClick={() => navigate('/admin/system')} icon={Server}>
                System Monitor
              </Button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── 8 KPI Cards ── */}
      <StaggerContainer staggerDelay={0.04} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((m, i) => {
          const Icon = m.icon;
          return (
            <StaggerItem key={i} variant="pop">
              <Card className="p-4 space-y-2.5 bg-obsidian-900/90 border border-white/[0.08] hover:border-white/[0.18] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400 leading-tight">{m.label}</span>
                  <div className={`p-1.5 rounded-lg border ${m.bg} ${m.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-heading text-white">{m.value}</div>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="h-2.5 w-2.5" /> {m.sub}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Graphical Row 1: Registration Trend + Recruitment Funnel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User Growth Trend */}
        <ScrollReveal variant="slide-up" delay={0.05} className="lg:col-span-2">
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08] h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sky-400" />
                  Platform Registration Velocity
                </h3>
                <p className="text-xs text-gray-400">Student vs HR recruiter onboardings over time</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center bg-obsidian-950 p-1 rounded-xl border border-white/10 text-xs">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      timeRange === range
                        ? 'bg-teal-500 text-obsidian-950 shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGISTRATION_TREND_DATA[timeRange] || REGISTRATION_TREND_DATA['30d']}>
                  <defs>
                    <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="students" stroke="#0ea5e9" strokeWidth={3} fill="url(#studGrad)" name="Students Registered" />
                  <Area type="monotone" dataKey="hr" stroke="#0d9488" strokeWidth={3} fill="url(#hrGrad)" name="HR Recruiters Onboarded" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-sky-400 rounded-full" /> Students</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-teal-400 rounded-full" /> HR Recruiters</span>
              </div>
              <span className="text-teal-400 font-medium">+24% acceleration in Sep 2026</span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Recruitment Conversion Funnel */}
        <ScrollReveal variant="slide-right" delay={0.08}>
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08] h-full">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                Recruitment Funnel
              </h3>
              <p className="text-xs text-gray-400">Application to Placement conversion rate</p>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONVERSION_FUNNEL} layout="vertical" barSize={14}>
                  <XAxis type="number" stroke="#6b7280" fontSize={10} hide />
                  <YAxis type="category" dataKey="stage" stroke="#9ca3af" fontSize={10} width={100} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Candidates">
                    {CONVERSION_FUNNEL.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">Funnel Conversion Rate:</span>
              <span className="font-bold text-emerald-400">15.5% Overall</span>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* ── Graphical Row 2: Realtime AI Engine Throughput & Latency + Domain Supply vs Demand ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AI Engine Telemetry Chart */}
        <ScrollReveal variant="slide-up" delay={0.05}>
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-teal-400" />
                  AI Knowledge Graph Telemetry
                </h3>
                <p className="text-xs text-gray-400">Request throughput (RPM) vs Inference latency (ms)</p>
              </div>
              <Badge variant="teal">Real-time Stream</Badge>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={AI_THROUGHPUT_LATENCY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#0d9488" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line yAxisId="left" type="monotone" dataKey="throughputRpm" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} name="Throughput (RPM)" />
                  <Line yAxisId="right" type="monotone" dataKey="latencyMs" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Latency (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-2 text-teal-400">● Throughput: ~1,500 requests/min</span>
              <span className="flex items-center gap-2 text-amber-400">● Avg Latency: 23ms</span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Domain Skills Gap Analysis */}
        <ScrollReveal variant="slide-up" delay={0.08}>
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-400" />
                  Industry Domain Skill Gap Radar
                </h3>
                <p className="text-xs text-gray-400">Recruiter search demand vs Student skill supply</p>
              </div>
              <Badge variant="violet">Inter-Domain</Badge>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_DEMAND} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="domain" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="demand" fill="#6366f1" radius={[4, 4, 0, 0]} name="HR Market Demand %" />
                  <Bar dataKey="supply" fill="#0d9488" radius={[4, 4, 0, 0]} name="Student Talent Supply %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" /> Recruiter Demand</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal-500 rounded-sm" /> Student Supply</span>
              <span className="text-amber-400 font-semibold">Highest Gap: AI / ML (36% deficit)</span>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* ── Graphical Row 3: ATS Score Distribution + Placement Pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ATS Score Distribution */}
        <ScrollReveal variant="slide-up" delay={0.05} className="lg:col-span-2">
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-400" />
                Resume ATS Score Tier Breakdown
              </h3>
              <p className="text-xs text-gray-400">Distribution of 3,892 automated resume analysis outputs</p>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESUME_SCORE_DIST} barSize={36}>
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Resumes Count">
                    {RESUME_SCORE_DIST.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </ScrollReveal>

        {/* Placement Status Donut */}
        <ScrollReveal variant="slide-right" delay={0.08}>
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08] h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Placement Distribution</h3>
              <p className="text-xs text-gray-400">Current cohort status</p>
            </div>

            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PLACEMENT_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={4}>
                    {PLACEMENT_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {PLACEMENT_PIE.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-obsidian-950 border border-white/[0.04]">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* ── Moderation Table & System Audit Stream ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User Moderation Table */}
        <ScrollReveal variant="slide-up" delay={0.1} className="lg:col-span-2">
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-400" />
                  User Account Operations & Roles
                </h3>
                <p className="text-xs text-gray-400">Superadmin user management and status controls</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')} icon={ArrowRight}>
                Manage All Users
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <th className="pb-3 pr-2">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Joined Date</th>
                    <th className="pb-3 text-right">Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {users.slice(0, 6).map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`}
                            alt={u.name}
                            className="h-8 w-8 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <p className="font-semibold text-white">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={u.role === 'admin' ? 'violet' : u.role === 'hr' ? 'teal' : 'blue'}>
                          {u.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {(u.status || 'active').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-gray-400">{u.joinedDate || '2026-09-30'}</td>
                      <td className="py-3 text-right font-medium text-gray-300">
                        {u.role === 'student' ? `${u.resumesCount || 1} CVs` : u.role === 'hr' ? `${u.jobsPosted || 0} Jobs` : 'Master Access'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>

        {/* System Audit Stream */}
        <ScrollReveal variant="slide-right" delay={0.15}>
          <Card className="p-6 space-y-4 bg-obsidian-900/90 border border-white/[0.08] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-teal-400" />
                <h3 className="text-base font-bold text-white">System Security Log</h3>
              </div>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-400 text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-gray-500">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-300">{log.target}</p>
                    <p className="text-[10px] text-gray-400">By: {log.by}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Admin Quick Actions</p>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'AI Engine & Vector Config', path: '/admin/ai-control', icon: Cpu },
                  { label: 'System Health & Latency', path: '/admin/system', icon: Server },
                  { label: 'Deep Analytics Report', path: '/admin/analytics', icon: TrendingUp },
                ].map(({ label, path, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-obsidian-950 hover:bg-teal-500/10 border border-white/[0.04] hover:border-teal-500/30 text-xs text-gray-300 hover:text-white transition-all text-left"
                  >
                    <Icon className="h-4 w-4 text-teal-400 flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
