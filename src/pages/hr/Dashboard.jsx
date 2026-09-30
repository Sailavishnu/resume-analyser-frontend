import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrStore } from '../../store/hrStore';
import { useAuthStore } from '../../store/authStore';
import {
  Users, Briefcase, Calendar, Sparkles, ChevronRight,
  TrendingUp, Plus, Upload, UserCheck, Target, Brain,
  ShieldCheck, Clock, BarChart3
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell
} from 'recharts';

const PIPELINE_DATA = [
  { day: 'Mon', applied: 18, shortlisted: 5 },
  { day: 'Tue', applied: 24, shortlisted: 7 },
  { day: 'Wed', applied: 31, shortlisted: 12 },
  { day: 'Thu', applied: 22, shortlisted: 8 },
  { day: 'Fri', applied: 28, shortlisted: 10 },
  { day: 'Sat', applied: 14, shortlisted: 4 },
  { day: 'Sun', applied: 10, shortlisted: 3 },
];

const DOMAIN_SCORE = [
  { domain: 'Cyber Security', score: 92, fill: '#10b981' },
  { domain: 'Full Stack', score: 85, fill: '#6366f1' },
  { domain: 'AI / ML', score: 78, fill: '#f59e0b' },
  { domain: 'Cloud DevOps', score: 74, fill: '#0ea5e9' },
];

const CHART_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

const RECENT_ACTIONS = [
  { text: 'Aravind Swaminathan shortlisted for Cyber Security role', time: '12 min ago' },
  { text: 'Mass resume parsing: 5 resumes ingested into Fullstack campaign', time: '1 hour ago' },
  { text: 'JD Generator created: Cloud & DevOps Engineer job spec', time: '3 hours ago' },
  { text: 'Domain scan completed for AI / ML Engineer — 3 matches', time: '5 hours ago' },
];

export default function HrDashboard() {
  const { user } = useAuthStore();
  const { campaigns, candidates, setSelectedCampaignId } = useHrStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton variant="card" className="h-28" />
          <Skeleton variant="card" className="h-28" />
          <Skeleton variant="card" className="h-28" />
          <Skeleton variant="card" className="h-28" />
        </div>
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  const totalOpenings = campaigns.length;
  const totalApplicants = candidates.length;
  const totalShortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const totalRejected = candidates.filter(c => c.status === 'rejected').length;
  const shortlistRate = totalApplicants > 0 ? Math.round((totalShortlisted / totalApplicants) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <ScrollReveal variant="fade" duration={0.6}>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #111118 0%, #0d9488 200%)' }}
        >
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)' }} />
          <div className="space-y-2 z-10">
            <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              Recruiting Dashboard, {user?.name?.split(' ')[0] || 'Recruiter'}! 🚀
            </h1>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              You have{' '}
              <span className="text-teal-400 font-semibold">{totalApplicants} applicants</span> in the pipeline across{' '}
              <span className="text-teal-400 font-semibold">{totalOpenings} active campaigns</span>. Use AI screening to find top talent fast.
            </p>
          </div>
          <div className="flex gap-3 z-10 flex-wrap">
            <Button variant="teal" size="sm" onClick={() => navigate('/hr/jd-generator')} icon={Sparkles}>
              AI JD Generator
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/hr/screening')} icon={Upload}>
              Screen Resumes
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Stat Cards */}
      <StaggerContainer staggerDelay={0.07} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', value: totalOpenings, icon: Briefcase, sub: 'job openings' },
          { label: 'Total Applicants', value: totalApplicants, icon: Users, sub: 'in pipeline' },
          { label: 'Shortlisted', value: totalShortlisted, icon: UserCheck, sub: `${shortlistRate}% shortlist rate` },
          {
            label: 'Rejection Rate',
            value: `${totalApplicants > 0 ? Math.round((totalRejected / totalApplicants) * 100) : 0}%`,
            icon: TrendingUp,
            sub: 'screened out'
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <StaggerItem key={i} variant="pop">
              <Card className="p-5 space-y-2 bg-obsidian-900/90 border border-white/[0.08]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{m.label}</h3>
                  <Icon className="h-4 w-4 text-teal-400" />
                </div>
                <p className="text-3xl font-extrabold text-white font-heading">{m.value}</p>
                <p className="text-[10px] text-gray-500">{m.sub}</p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Pipeline Chart */}
        <ScrollReveal variant="slide-up" delay={0.05} className="lg:col-span-2">
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Weekly Application Flow</h3>
              <Badge variant="teal">This Week</Badge>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PIPELINE_DATA}>
                  <defs>
                    <linearGradient id="hrAppFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hrShortFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={CHART_STYLE} />
                  <Area type="monotone" dataKey="applied" stroke="#0ea5e9" fill="url(#hrAppFill)" strokeWidth={2} dot={false} name="Applied" />
                  <Area type="monotone" dataKey="shortlisted" stroke="#0d9488" fill="url(#hrShortFill)" strokeWidth={2} dot={false} name="Shortlisted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-sky-400 rounded inline-block" /> Applied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-teal-400 rounded inline-block" /> Shortlisted
              </span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Domain Match Scores */}
        <ScrollReveal variant="slide-right" delay={0.08}>
          <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] h-full">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-teal-400" /> Domain Avg Match
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_SCORE} layout="vertical" barSize={12}>
                  <XAxis type="number" stroke="#6b7280" fontSize={9} domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="domain" stroke="#6b7280" fontSize={9} width={78} />
                  <Tooltip contentStyle={CHART_STYLE} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Avg Match %">
                    {DOMAIN_SCORE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* Campaigns + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Campaign Pipelines */}
        <ScrollReveal variant="slide-up" delay={0.1} className="lg:col-span-2">
          <Card className="p-5 bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Active Campaign Pipelines</h3>
                <p className="text-xs text-gray-400">Track applications and match indexes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/hr/jobs')} className="text-teal-400 text-xs">
                Manage campaigns
              </Button>
            </div>
            <div className="space-y-3">
              {campaigns.slice(0, 3).map(camp => (
                <div
                  key={camp.id}
                  onClick={() => {
                    setSelectedCampaignId(camp.id);
                    navigate('/hr/candidates');
                  }}
                  className="flex items-center justify-between p-3.5 bg-obsidian-950/50 hover:bg-obsidian-900 border border-white/[0.04] hover:border-teal-500/20 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 text-teal-300 rounded-lg flex items-center justify-center font-bold shrink-0" style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}>
                      {camp.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{camp.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{camp.department} · {camp.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{camp.applicantsCount} Applied</p>
                      <p className="text-[10px] text-gray-500">{camp.shortlistedCount} Shortlisted</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* Recent Activity + Quick Access */}
        <ScrollReveal variant="slide-right" delay={0.12}>
          <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            <div className="space-y-2.5 max-h-52 overflow-y-auto">
              {RECENT_ACTIONS.map((a, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-obsidian-950 border border-white/[0.06] text-[11px]">
                  <p className="text-gray-300">{a.text}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {a.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">AI Tools</p>
              {[
                { label: 'AI Candidate Screening', path: '/hr/screening', icon: ShieldCheck },
                { label: 'Talent Pool Matrix', path: '/hr/talent-pool', icon: Brain },
                { label: 'JD Generator', path: '/hr/jd-generator', icon: Sparkles },
              ].map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-obsidian-950 border border-white/[0.04] text-xs text-gray-300 hover:text-white transition-all"
                  style={{ transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,148,136,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <Icon className="h-3.5 w-3.5 text-teal-400" />
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
