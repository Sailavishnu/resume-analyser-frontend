import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import {
  Users, Building2, FileText, CheckCircle2, AlertTriangle,
  TrendingUp, Shield, Activity, ArrowUpRight, ArrowRight, MessageSquare, Cpu
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';

export default function AdminDashboard() {
  const { stats, users, auditLogs } = useAdminStore();
  const navigate = useNavigate();

  const metrics = [
    { label: 'Registered Students', value: stats.totalStudents.toLocaleString(), change: '+14% this month', icon: Users, color: 'blue' },
    { label: 'Verified HR Recruiters', value: stats.totalHr.toLocaleString(), change: '+8 new companies', icon: Building2, color: 'emerald' },
    { label: 'Resumes Analyzed', value: stats.resumesAnalyzed.toLocaleString(), change: 'Avg Score: ' + stats.averageAtsScore + '%', icon: FileText, color: 'violet' },
    { label: 'System Health', value: stats.systemHealth, change: 'Latency: 28ms', icon: Activity, color: 'teal' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <ScrollReveal variant="fade" duration={0.5}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Master Admin Console
              </h1>
              <Badge variant="violet">System Admin</Badge>
            </div>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Real-time platform metrics, user moderation, resume audit streams, and system configuration.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')} icon={Users}>
              Manage Users
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/analytics')} icon={TrendingUp}>
              Platform Analytics
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* ── KPI Metric Cards ── */}
      <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <StaggerItem key={i} variant="pop">
              <Card className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
                  {m.value}
                </div>
                <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {m.change}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registered Users */}
        <ScrollReveal variant="slide-up" delay={0.1} className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Recently Active Users & Verification
              </h3>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs text-brand-blue hover:underline font-semibold flex items-center gap-1"
              >
                View all users <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: 'var(--border-faint)', color: 'var(--text-faint)' }}>
                    <th className="pb-2.5">User</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Joined</th>
                    <th className="pb-2.5 text-right">Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-faint)' }}>
                  {users.slice(0, 5).map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--nav-hover-bg)] transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-lg object-cover border" style={{ borderColor: 'var(--border-light)' }} />
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
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
                          u.status === 'active' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {u.joinedDate}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {u.role === 'student' ? `${u.resumesCount} CVs (${u.avgAtsScore}%)` : u.role === 'hr' ? `${u.jobsPosted} Jobs` : 'Full Access'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </ScrollReveal>

        {/* Security & Audit Stream */}
        <ScrollReveal variant="slide-right" delay={0.15} className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-violet" />
              <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Live Security & Audit Log
              </h3>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl glass space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${
                      log.type === 'warning' ? 'text-amber-500' : log.type === 'success' ? 'text-emerald-500' : 'text-brand-blue'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{log.time}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{log.target}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Triggered by: {log.by}</p>
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
