import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { useAuthStore } from '../../store/authStore';
import {
  Sparkles,
  Calendar,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import Skeleton from '../../components/ui/Skeleton';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getSelectedResume, interviews, jobs } = useStudentStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const resume = getSelectedResume();
  const atsScore = resume?.score || 75;

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
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <ScrollReveal variant="fade" duration={0.6}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-blue/10 blur-[80px] pointer-events-none" />
          <div className="space-y-2 z-10">
            <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
              Welcome back, {user?.name.split(' ')[0]}! <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Your current primary resume is <span className="text-brand-blue font-semibold">{resume?.name || 'Priya_Lakshmi_CV_2026.pdf'}</span>. We have generated some actionable feedback for optimization.
            </p>
          </div>
          <div className="flex gap-3 z-10">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/upload')} icon={FileText}>
              Manage Resumes
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/student/builder')} icon={Sparkles}>
              Build New CV
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Summary Grid */}
      <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score card */}
        <StaggerItem variant="pop">
          <Card hoverEffect className="flex items-center gap-6 justify-between p-6 h-full">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">ATS Compatibility</h3>
              <p className="text-xs text-gray-400 max-w-[150px]">Your CV score is high, but matches could increase with minor adjustments.</p>
              <button
                onClick={() => navigate('/student/ats')}
                className="text-xs font-semibold text-brand-blue flex items-center gap-1 hover:underline pt-2 cursor-pointer"
              >
                Analyze scorecard <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <AnimatedProgress value={atsScore} type="circle" size={100} strokeWidth={8} />
          </Card>
        </StaggerItem>

        {/* Profile Completeness progress */}
        <StaggerItem variant="pop">
          <Card hoverEffect className="p-6 flex flex-col justify-between h-full">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Resume Completion</h3>
              <p className="text-[11px] text-gray-400">Add Certifications and Projects to reach 100%.</p>
            </div>
            <div className="py-2">
              <AnimatedProgress value={85} type="bar" />
            </div>
            <button
              onClick={() => navigate('/student/profile')}
              className="text-xs font-semibold text-brand-blue flex items-center gap-1 hover:underline cursor-pointer"
            >
              Edit profile section <ChevronRight className="h-3 w-3" />
            </button>
          </Card>
        </StaggerItem>

        {/* Daily Goal Card */}
        <StaggerItem variant="pop">
          <Card hoverEffect className="p-6 flex flex-col justify-between relative overflow-hidden h-full">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-brand-violet/10 blur-[30px]" />
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-violet" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Daily Task</h3>
              </div>
              <p className="text-xs font-semibold text-white mt-1">Complete a Mock Interview Session</p>
              <p className="text-[11px] text-gray-400">Keep your answers sharp. AI interview prep increases hiring likelihood by 40%.</p>
            </div>
            <div className="pt-4 z-10">
              <Button variant="outline" size="sm" onClick={() => navigate('/student/interview')} className="w-full !py-1.5 text-xs">
                Start Practice Session
              </Button>
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Row 2: Matchings & Interviews split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Matching Jobs / AI recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal variant="slide-up" delay={0.05}>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Recommended Job Matches</h3>
                  <p className="text-xs text-gray-400">Based on parsed skills in your active CV.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/jdmatch')} className="text-brand-blue hover:text-brand-blue/80 text-xs">
                  View all matches
                </Button>
              </div>
              
              <StaggerContainer staggerDelay={0.08} className="space-y-3.5">
                {jobs.slice(0, 2).map(job => (
                  <StaggerItem key={job.id} variant="slide-left">
                    <div
                      onClick={() => navigate('/student/jdmatch')}
                      className="flex items-center justify-between p-3.5 bg-obsidian-950/50 hover:bg-obsidian-900 border border-white/[0.04] hover:border-white/[0.08] rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={job.logo} alt={job.company} className="h-10 w-10 rounded-lg object-cover border border-white/[0.06]" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={job.matchRate >= 90 ? 'success' : 'primary'} size="sm">
                          {job.matchRate}% Match
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Card>
          </ScrollReveal>

          {/* AI Suggestions Box */}
          <ScrollReveal variant="slide-up" delay={0.1}>
            <Card className="p-6 border-l-4 border-brand-indigo bg-brand-indigo/5">
              <div className="flex items-start gap-4">
                <Sparkles className="h-5 w-5 text-brand-indigo shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-heading">AI Analysis: Optimize Work Experience Bullets</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We found passive descriptions in your work history at <strong>Tesla</strong>. Rewriting them to emphasize impact (e.g. replacing <span className="italic text-gray-500">"Responsible for component work"</span> with <span className="text-gray-300">"Architected and deployed 12+ React components"</span>) can boost your ATS scorecard to 89%.
                  </p>
                  <div className="pt-3">
                    <Button variant="outline" size="sm" onClick={() => navigate('/student/enhancement')} className="border-brand-indigo/30 hover:bg-brand-indigo/10 !py-1 text-xs">
                      Apply Enhancements
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
            <Card className="p-6">
              <h3 className="text-base font-bold text-white font-heading mb-4">Interviews & Activities</h3>
              
              {/* Interviews List */}
              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-gray-400 mb-2.5">Scheduled Events</p>
                {interviews.length > 0 ? (
                  interviews.map(item => (
                    <div key={item.id} className="p-3 bg-obsidian-900 border border-white/[0.04] rounded-lg flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-brand-blue shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.role}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.company} • {item.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 p-3 bg-obsidian-950/40 rounded-lg text-center border border-dashed border-white/[0.06]">
                    No upcoming interviews.
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-3">Recent Activity</p>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1 before:w-[1px] before:bg-white/[0.06]">
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-brand-blue mt-1.5" />
                    <p className="font-semibold text-gray-200">Uploaded Resume</p>
                    <p className="text-[10px] text-gray-500">Sarah_Connor_CV_2026.pdf • 2 days ago</p>
                  </div>
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-brand-emerald mt-1.5" />
                    <p className="font-semibold text-gray-200">Job Matching Verified</p>
                    <p className="text-[10px] text-gray-500">Matched 92% to Vercel positions • 2 days ago</p>
                  </div>
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-brand-violet mt-1.5" />
                    <p className="font-semibold text-gray-200">AI Prep Completed</p>
                    <p className="text-[10px] text-gray-500">Mock interview score: 88% • 4 days ago</p>
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
