import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { useAuthStore } from '../../store/authStore';
import {
  Sparkles, Calendar, Briefcase, TrendingUp, Clock,
  CheckCircle2, AlertCircle, ChevronRight, FileText,
  Flame, Award, Compass, ArrowRight, ShieldCheck,
  Check, ExternalLink, Zap
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import Skeleton from '../../components/ui/Skeleton';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';

export default function Dashboard() {
  const { user } = useAuthStore();
  const {
    getSelectedResume,
    interviews,
    jobs,
    streak,
    careerReadiness,
    readinessBreakdown,
    roadmap,
    targetRole,
    applyToJob,
    applications
  } = useStudentStore();

  const [loading, setLoading] = useState(true);
  const [appliedToast, setAppliedToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const resume = getSelectedResume();
  const atsScore = resume?.atsScore || 88;
  const resumeScore = resume?.score || 84;

  const handleQuickApply = (job) => {
    applyToJob(job.id, resume?.name || 'Priya_Lakshmi_CV_2026.pdf');
    setAppliedToast(`Successfully applied to ${job.company} for ${job.title}!`);
    setTimeout(() => setAppliedToast(null), 3500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Toast notification */}
      {appliedToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-500/90 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 border border-emerald-400/40 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-xs font-semibold">{appliedToast}</p>
        </div>
      )}

      {/* Header Banner */}
      <ScrollReveal variant="fade" duration={0.6}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-brand-blue/10 blur-[85px] pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/15 text-brand-blue border border-brand-blue/30 flex items-center gap-1.5">
                Target: {targetRole || 'Frontend Engineer'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" /> 🔥 {streak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
              Welcome back, {user?.name?.split(' ')[0] || 'Priya'}! <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Your career command center is synced with your primary CV <span className="text-brand-blue font-semibold">{resume?.name || 'Priya_Lakshmi_CV_2026.pdf'}</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 z-10 shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/analysis')} icon={Sparkles}>
              Analyze CV
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/student/roadmap')} icon={Compass}>
              Career Roadmap
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Hero: Career Readiness Score Card */}
      <ScrollReveal variant="slide-up" delay={0.05}>
        <Card className="p-6 md:p-8 border border-white/[0.08] bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-brand-blue/[0.04] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 h-36 w-36 rounded-full bg-brand-blue/10 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Overall Readiness Gauge */}
            <div className="flex items-center gap-6">
              <AnimatedProgress value={careerReadiness} type="circle" size={115} strokeWidth={9} />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">
                  Career Readiness Score
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {careerReadiness} <span className="text-sm font-normal text-gray-400">/ 100</span>
                </h3>
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {careerReadiness >= 75 ? 'Job Ready' : 'Developing'}
                </span>
                <p className="text-[11px] text-gray-400 pt-1">
                  Top 15% among candidate cohort
                </p>
              </div>
            </div>

            {/* Middle: Dimension Breakdown */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluation Dimensions</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Resume Health</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.resume || resumeScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ATS Index</span>
                  <span className="font-semibold text-emerald-400">{readinessBreakdown?.ats || atsScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Skills Alignment</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.skills || 71}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Assessments</span>
                  <span className="font-semibold text-emerald-400">{readinessBreakdown?.assessments || 79}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mock Interview</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.interview || 81}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profile Setup</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.profile || 94}%</span>
                </div>
              </div>
            </div>

            {/* Right: Next Best Action Recommendation */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Zap className="h-4 w-4" /> Next High-Value Opportunity
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Take the <strong className="text-white">JavaScript / React Assessment</strong> or close the <strong className="text-white">TypeScript</strong> skill gap to raise your readiness to <strong className="text-brand-blue">81%</strong>.
              </p>
              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="sm" onClick={() => navigate('/student/assessments')} className="w-full text-xs">
                  Verify Skills (+2 Readiness)
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Immediate Quick-Action Hub */}
      <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/roadmap')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-brand-blue/15 text-brand-blue group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors">Career Roadmap</p>
              <p className="text-[10px] text-gray-400">{roadmap?.completionPercentage || 68}% Mastered</p>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/assessments')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Skill Tests</p>
              <p className="text-[10px] text-gray-400">4 Quizzes Available</p>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/interview')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-brand-violet/15 text-brand-violet group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-brand-violet transition-colors">AI Interview</p>
              <p className="text-[10px] text-gray-400">Adaptive Practice</p>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/applications')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Applications</p>
              <p className="text-[10px] text-gray-400">{applications?.length || 2} In Pipeline</p>
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Row 2: Matchings & Interviews split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Matching Jobs / AI recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal variant="slide-up" delay={0.05}>
            <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Recommended Job Matches</h3>
                  <p className="text-xs text-gray-400">Ranked by AI matching score against your active CV.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/analysis?tab=jdmatch')} className="text-brand-blue hover:text-brand-blue/80 text-xs">
                  View JD Matcher <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              </div>

              <div className="space-y-3.5">
                {jobs.slice(0, 3).map(job => {
                  const isApplied = applications.some(a => a.jobId === job.id);

                  return (
                    <div
                      key={job.id}
                      className="p-4 bg-obsidian-950/60 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <img src={job.logo} alt={job.company} className="h-11 w-11 rounded-lg object-cover border border-white/[0.08] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span className="text-gray-300 font-medium">{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">{job.salary}</span>
                          </p>

                          {/* Skill matches tags */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {job.skillsMatched?.slice(0, 3).map(sk => (
                              <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                ✓ {sk}
                              </span>
                            ))}
                            {job.skillsMissing?.slice(0, 1).map(sk => (
                              <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                ⚠ {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <Badge variant={job.matchRate >= 90 ? 'success' : 'primary'} size="sm">
                          {job.matchRate}% Match
                        </Badge>

                        {isApplied ? (
                          <span className="text-xs font-semibold text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Applied
                          </span>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleQuickApply(job)}
                            className="text-xs !py-1.5"
                          >
                            Quick Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </ScrollReveal>

          {/* AI Suggestions Box */}
          <ScrollReveal variant="slide-up" delay={0.1}>
            <Card className="p-6 border border-brand-indigo/30 bg-brand-indigo/[0.06]">
              <div className="flex items-start gap-4">
                <Sparkles className="h-5 w-5 text-brand-indigo shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-heading">AI Actionable Insight: Work Experience Impact</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We detected passive descriptions in your work history. Rewriting them with quantifiable outcomes (e.g. replacing <span className="italic text-gray-500">"Responsible for building dashboards"</span> with <span className="text-gray-200 font-medium">"Architected and deployed 12+ reusable React dashboards, reducing loading speeds by 40%"</span>) can raise your ATS compatibility from 88% to 94%.
                  </p>
                  <div className="pt-3 flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate('/student/analysis?tab=enhancement')} className="border-brand-indigo/30 hover:bg-brand-indigo/10 !py-1 text-xs">
                      Improve Bullets with AI
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        {/* Right 1/3: Upcoming interviews & Activity timeline */}
        <ScrollReveal variant="slide-right" delay={0.15}>
          <div className="space-y-6">
            <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
              <h3 className="text-base font-bold text-white font-heading mb-4">Interviews & Activities</h3>

              {/* Interviews List */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-gray-400 mb-2.5">Scheduled Placement Events</p>
                {interviews.length > 0 ? (
                  interviews.map(item => (
                    <div key={item.id} className="p-3 bg-obsidian-950/80 border border-white/[0.06] rounded-xl flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-brand-blue shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.role}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.company} • {item.date}</p>
                        {item.feedback && (
                          <p className="text-[10px] text-brand-blue mt-1 italic">{item.feedback}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 p-3 bg-obsidian-950/40 rounded-lg text-center border border-dashed border-white/[0.06]">
                    No upcoming interviews scheduled.
                  </div>
                )}
              </div>

              {/* Activity Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-3">Recent Progress Timeline</p>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1 before:w-[1px] before:bg-white/[0.06]">
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-brand-blue mt-1.5" />
                    <p className="font-semibold text-gray-200">Applied to Zoho Corporation</p>
                    <p className="text-[10px] text-gray-500">Priya_Lakshmi_CV_2026.pdf (94% match) • Yesterday</p>
                  </div>
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <p className="font-semibold text-gray-200">ATS Verification 88% Index</p>
                    <p className="text-[10px] text-gray-500">Passed automated screening filters • 2 days ago</p>
                  </div>
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-brand-violet mt-1.5" />
                    <p className="font-semibold text-gray-200">React 18 Assessment Verified</p>
                    <p className="text-[10px] text-gray-500">Scored 91% in Advanced React • 3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
