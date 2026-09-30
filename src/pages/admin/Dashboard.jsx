import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Building2, FileText, CheckCircle2, AlertTriangle,
  TrendingUp, Shield, Activity, ArrowRight, MessageSquare, Cpu,
  Server, GraduationCap, Briefcase, Target, Database, Zap, Globe, Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const REGISTRATION_TREND = [
  { month: 'Apr', students: 180, hr: 12 },
  { month: 'May', students: 260, hr: 18 },
  { month: 'Jun', students: 340, hr: 24 },
  { month: 'Jul', students: 420, hr: 28 },
  { month: 'Aug', students: 560, hr: 36 },
  { month: 'Sep', students: 720, hr: 52 },
];

const RESUME_SCORE_DIST = [
  { range: '90-100', count: 420, fill: '#10b981' },
  { range: '75-89', count: 1240, fill: '#6366f1' },
  { range: '60-74', count: 580, fill: '#f59e0b' },
  { range: '<60', count: 140, fill: '#f43f5e' },
];

const DOMAIN_DEMAND = [
  { domain: 'Fullstack Web', demand: 92, supply: 78 },
  { domain: 'AI / ML', demand: 88, supply: 52 },
  { domain: 'DevOps / Cloud', demand: 74, supply: 38 },
  { domain: 'Cybersecurity', demand: 68, supply: 44 },
  { domain: 'Data Science', demand: 82, supply: 60 },
];

const PLACEMENT_PIE = [
  { name: 'Placed', value: 840, color: '#0d9488' },
  { name: 'Interviewing', value: 320, color: '#6366f1' },
  { name: 'Shortlisted', value: 180, color: '#f59e0b' },
  { name: 'Pending', value: 560, color: '#374151' },
];

const CHART_TOOLTIP_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

export default function AdminDashboard() {
  const { stats, users, auditLogs, fetchDashboardStats, fetchUsers } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, [fetchDashboardStats, fetchUsers]);

  const kpis = [
    {
      label: 'Total Students', value: (stats.totalStudents || 0).toLocaleString(),
      sub: '+14.2% vs last month', icon: GraduationCap, color: 'brand-blue'
    },
    {
      label: 'Verified Recruiters', value: (stats.totalHr || 0).toLocaleString(),
      sub: '+8 new companies', icon: Building2, color: 'brand-teal'
    },
    {
      label: 'Resumes Analyzed', value: (stats.resumesAnalyzed || 0).toLocaleString(),
      sub: `Avg ATS: ${stats.averageAtsScore || 82.5}%`, icon: FileText, color: 'brand-violet'
    },
    {
      label: 'Active Job Posts', value: (stats.activeJobs || 145).toLocaleString(),
      sub: '+22 this week', icon: Briefcase, color: 'emerald'
    },
    {
      label: 'AI Screenings Run', value: '6,284',
      sub: 'Knowledge graph scans', icon: Cpu, color: 'amber'
    },
    {
      label: 'Platform Uptime', value: stats.systemHealth || '99.98%',
      sub: 'Last 30 days · 22ms avg', icon: Activity, color: 'rose'
    },
    {
      label: 'Placements Made', value: '840',
      sub: 'Confirmed this cycle', icon: Target, color: 'indigo'
    },
    {
      label: 'Interviews Scheduled', value: '1,284',
      sub: '342 completed today', icon: MessageSquare, color: 'cyan'
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <ScrollReveal variant="fade" duration={0.5}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-brand-violet/10 p-8">
          <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-brand-violet/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-brand-teal/8 blur-[80px] pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold font-heading text-white">Master Admin Control Console</h1>
                <Badge variant="violet">Superadmin</Badge>
              </div>
              <p className="text-xs text-gray-400">
                Live platform performance, user account moderation, system health, and audit trail streams.
              </p>
            </div>
            <div className="flex gap-2">
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

      {/* ── 8 KPI Metric Cards ── */}
      <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((m, i) => {
          const Icon = m.icon;
          return (
            <StaggerItem key={i} variant="pop">
              <Card className="p-4 space-y-2.5 bg-obsidian-900/90 border border-white/[0.08] hover:border-white/[0.16] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400 leading-tight">{m.label}</span>
                  <div className="p-1.5 rounded-lg bg-brand-teal/15 text-brand-teal border border-brand-teal/20">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-extrabold font-heading text-white">{m.value}</div>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="h-2.5 w-2.5" /> {m.sub}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Registration Trend */}
        <ScrollReveal variant="slide-up" delay={0.05} className="lg:col-span-2">
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">User Registration Trend</h3>
              <Badge variant="blue">6-Month</Badge>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGISTRATION_TREND}>
                  <defs>
                    <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="students" stroke="#0ea5e9" fill="url(#studGrad)" strokeWidth={2} dot={false} name="Students" />
                  <Area type="monotone" dataKey="hr" stroke="#0d9488" fill="url(#hrGrad)" strokeWidth={2} dot={false} name="HR Recruiters" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-sky-400 inline-block rounded" /> Students</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-teal-400 inline-block rounded" /> HR Recruiters</span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Placement Pie */}
        <ScrollReveal variant="slide-right" delay={0.08}>
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] h-full">
            <h3 className="text-sm font-bold text-white">Placement Status</h3>
            <div className="h-36 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PLACEMENT_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3}>
                    {PLACEMENT_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {PLACEMENT_PIE.map(item => (
                <div key={item.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: item.color }} />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ATS Score Distribution */}
        <ScrollReveal variant="slide-up" delay={0.05}>
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Resume ATS Score Distribution</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESUME_SCORE_DIST} barSize={32}>
                  <XAxis dataKey="range" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Resumes">
                    {RESUME_SCORE_DIST.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-500">3,892 total resumes scored across all students</p>
          </Card>
        </ScrollReveal>

        {/* Domain Demand vs Supply */}
        <ScrollReveal variant="slide-up" delay={0.08}>
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Domain Demand vs Student Supply</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_DEMAND} layout="vertical" barSize={10}>
                  <XAxis type="number" stroke="#6b7280" fontSize={9} domain={[0, 100]} />
                  <YAxis type="category" dataKey="domain" stroke="#6b7280" fontSize={9} width={80} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="demand" fill="#6366f1" radius={[0, 4, 4, 0]} name="HR Demand %" />
                  <Bar dataKey="supply" fill="#0d9488" radius={[0, 4, 4, 0]} name="Student Supply %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" /> HR Demand</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-400 inline-block" /> Student Supply</span>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* ── Bottom Row: Users table + Audit Log ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <ScrollReveal variant="slide-up" delay={0.1} className="lg:col-span-2">
          <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recently Active Users & Role Control</h3>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs text-brand-teal hover:underline font-semibold flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <th className="pb-2.5">User</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Joined</th>
                    <th className="pb-2.5 text-right">Activity</th>
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
                            className="h-7 w-7 rounded-lg object-cover border border-white/10"
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

        {/* Audit Log */}
        <ScrollReveal variant="slide-right" delay={0.15}>
          <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-teal" />
              <h3 className="text-sm font-bold text-white">Live Audit Log</h3>
            </div>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-teal text-[11px]">{log.action}</span>
                    <span className="text-[10px] text-gray-500">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-300">{log.target}</p>
                  <p className="text-[10px] text-gray-400">By: {log.by}</p>
                </div>
              ))}
            </div>

            {/* Quick links to admin sections */}
            <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Quick Actions</p>
              {[
                { label: 'AI Engine Control', path: '/admin/ai-control', icon: Cpu },
                { label: 'System Monitor', path: '/admin/system', icon: Server },
                { label: 'Platform Analytics', path: '/admin/analytics', icon: TrendingUp },
              ].map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-obsidian-950 hover:bg-brand-teal/10 border border-white/[0.04] hover:border-brand-teal/30 text-xs text-gray-300 hover:text-white transition-all"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-teal" />
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
