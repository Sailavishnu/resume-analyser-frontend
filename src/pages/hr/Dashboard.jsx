import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrStore } from '../../store/hrStore';
import { useAuthStore } from '../../store/authStore';
import {
  Users,
  Briefcase,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Plus,
  Building,
  Upload,
  UserCheck
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { campaigns, candidates } = useHrStore();
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

  // Aggregate stats
  const totalOpenings = campaigns.length;
  const totalApplicants = candidates.length;
  const totalShortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const totalRejected = candidates.filter(c => c.status === 'rejected').length;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-teal/10 blur-[80px] pointer-events-none" />
        <div className="space-y-2 z-10">
          <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
            Recruiting Dashboard, {user?.name.split(' ')[0]}! <span className="animate-wave origin-bottom-right inline-block">🚀</span>
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Welcome to the Skynet Recruitment Portal. You have <span className="text-brand-teal font-semibold">{totalApplicants} applicants</span> in the pipeline. Review matches below.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Button variant="teal" size="sm" onClick={() => navigate('/hr/jobs')} icon={Plus}>
            New Campaign
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/hr/screening')} icon={Upload}>
            Screen Resumes
          </Button>
        </div>
      </div>

      {/* Numerical Stats Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hoverEffect className="p-5 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Jobs</h3>
            <Briefcase className="h-4.5 w-4.5 text-brand-teal" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalOpenings}</p>
        </Card>

        <Card hoverEffect className="p-5 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Applicants</h3>
            <Users className="h-4.5 w-4.5 text-brand-blue" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalApplicants}</p>
        </Card>

        <Card hoverEffect className="p-5 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Shortlisted</h3>
            <UserCheck className="h-4.5 w-4.5 text-brand-emerald" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalShortlisted}</p>
        </Card>

        <Card hoverEffect className="p-5 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Rejection Rate</h3>
            <TrendingUp className="h-4.5 w-4.5 text-brand-rose" />
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">
            {totalApplicants > 0 ? Math.round((totalRejected / totalApplicants) * 100) : 0}%
          </p>
        </Card>
      </div>

      {/* Row 2: Campaign summary & Pipeline flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Campaigns details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Job Campaign Pipelines</h3>
                <p className="text-xs text-gray-400 font-medium">Tracking applications and match indexes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/hr/jobs')} className="text-brand-teal hover:text-brand-teal/80 text-xs">
                Manage campaigns
              </Button>
            </div>

            <div className="space-y-3.5">
              {campaigns.slice(0, 2).map(camp => (
                <div
                  key={camp.id}
                  onClick={() => {
                    useHrStore.getState().setSelectedCampaignId(camp.id);
                    navigate('/hr/candidates');
                  }}
                  className="flex items-center justify-between p-3.5 bg-obsidian-950/50 hover:bg-obsidian-900 border border-white/[0.04] hover:border-white/[0.08] rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-lg flex items-center justify-center font-bold">
                      {camp.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{camp.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{camp.department} • {camp.location}</p>
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
        </div>

        {/* Right 1/3: Activity timelines / Scheduled interview cards */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-white font-heading mb-4">Interviews Agenda</h3>
            <div className="space-y-3">
              <div className="p-3 bg-obsidian-900 border border-white/[0.04] rounded-lg flex items-start gap-3">
                <Calendar className="h-4.5 w-4.5 text-brand-teal shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Sarah Connor (Shortlisted)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Senior React Developer • Today, 3:00 PM</p>
                </div>
              </div>
              <div className="p-3 bg-obsidian-900 border border-white/[0.04] rounded-lg flex items-start gap-3 opacity-60">
                <Calendar className="h-4.5 w-4.5 text-gray-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Ellen Ripley (Shortlisted)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Fullstack Engineer • Tomorrow, 11:00 AM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
