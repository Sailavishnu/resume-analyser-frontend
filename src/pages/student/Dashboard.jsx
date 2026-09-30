import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { useAuthStore } from '../../store/authStore';
import {
  Sparkles, Calendar, Briefcase, TrendingUp, Clock,
  CheckCircle2, AlertCircle, ChevronRight, FileText,
  Flame, Award, Compass, ArrowRight, ShieldCheck,
  Check, ExternalLink, Zap, Target, Sliders, Layers
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import Skeleton from '../../components/ui/Skeleton';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const SKILL_MATCH_RADAR = [
  { skill: 'React 18', student: 95, required: 90 },
  { skill: 'TypeScript', student: 65, required: 85 },
  { skill: 'Node.js', student: 88, required: 80 },
  { skill: 'SQL & DB', student: 75, required: 70 },
  { skill: 'System Design', student: 60, required: 75 },
  { skill: 'Testing (Jest)', student: 70, required: 80 },
];

const CHART_TOOLTIP_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 11, borderRadius: 8 };

export default function Dashboard() {
  const { user } = useAuthStore();
  const {
    getSelectedResume,
    resumes,
    setSelectedResumeId,
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
  const [customKeyword, setCustomKeyword] = useState('');
  const [keywordMatches, setKeywordMatches] = useState([
    { word: 'React 18', hit: true },
    { word: 'TypeScript', hit: false },
    { word: 'State Management (Zustand)', hit: true },
    { word: 'REST APIs', hit: true },
    { word: 'CI/CD Pipelines', hit: false }
  ]);

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

  const addTestKeyword = (e) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;
    setKeywordMatches(prev => [
      ...prev,
      { word: customKeyword.trim(), hit: Math.random() > 0.3 }
    ]);
    setCustomKeyword('');
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
          <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-sky-500/10 blur-[85px] pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                Target: {targetRole || 'Fullstack Software Engineer'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" /> 🔥 {streak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
              Welcome back, {user?.name?.split(' ')[0] || 'Priya'}! <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Your career command center is active. Active CV: <span className="text-sky-400 font-semibold">{resume?.name || 'Priya_Lakshmi_CV_2026.pdf'}</span>.
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
        <Card className="p-6 md:p-8 border border-white/[0.08] bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-sky-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 h-36 w-36 rounded-full bg-sky-500/10 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Overall Readiness Gauge */}
            <div className="flex items-center gap-6">
              <AnimatedProgress value={careerReadiness} type="circle" size={115} strokeWidth={9} />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
                  Career Readiness Index
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {careerReadiness} <span className="text-sm font-normal text-gray-400">/ 100</span>
                </h3>
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {careerReadiness >= 75 ? 'Job Ready (Tier 1)' : 'Developing'}
                </span>
                <p className="text-[11px] text-gray-400 pt-1">
                  Top 12% among current applicant pool
                </p>
              </div>
            </div>

            {/* Middle: Dimension Breakdown */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Evaluation Metrics</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Resume Quality</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.resume || resumeScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ATS Compatibility</span>
                  <span className="font-semibold text-emerald-400">{readinessBreakdown?.ats || atsScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Skill Alignment</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.skills || 78}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Technical Tests</span>
                  <span className="font-semibold text-emerald-400">{readinessBreakdown?.assessments || 82}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Mock Interview</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.interview || 85}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profile Completeness</span>
                  <span className="font-semibold text-white">{readinessBreakdown?.profile || 94}%</span>
                </div>
              </div>
            </div>

            {/* Right: Next Best Action Recommendation */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Zap className="h-4 w-4" /> Next Recommended Action
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Complete the <strong className="text-white">TypeScript & System Design</strong> assessments to boost your match score to <strong className="text-sky-400">92%</strong> for Tier-1 companies.
              </p>
              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="sm" onClick={() => navigate('/student/assessments')} className="w-full text-xs">
                  Take Skill Quiz (+3 Points)
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Graphical Skill Match & ATS Keyword Density Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for Skill Match vs Requirements */}
        <ScrollReveal variant="slide-up" delay={0.05}>
          <Card className="p-6 space-y-4 border border-white/[0.08] bg-obsidian-900/90">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-sky-400" />
                  Target Role Skill Radar
                </h3>
                <p className="text-xs text-gray-400">Your verified proficiency vs Recruiter demand for Fullstack Role</p>
              </div>
              <Badge variant="blue">Interactive Graph</Badge>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKILL_MATCH_RADAR} barSize={14}>
                  <XAxis dataKey="skill" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="student" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Your Level %" />
                  <Bar dataKey="required" fill="#6366f1" radius={[4, 4, 0, 0]} name="Recruiter Required %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sky-400 rounded-sm" /> Your Verified Score</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" /> Market Threshold</span>
              <span className="text-emerald-400 font-semibold">React 18 (+5% Ahead)</span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Live ATS Keyword Density Tester */}
        <ScrollReveal variant="slide-up" delay={0.08}>
          <Card className="p-6 space-y-4 border border-white/[0.08] bg-obsidian-900/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-400" />
                  ATS Keyword Optimizer Simulator
                </h3>
                <Badge variant="teal">Real-time Check</Badge>
              </div>
              <p className="text-xs text-gray-400">Test if target keywords exist inside your uploaded resume before submitting.</p>

              {/* Keyword tester form */}
              <form onSubmit={addTestKeyword} className="flex gap-2 my-4">
                <input
                  type="text"
                  placeholder="Test target keyword (e.g. Docker, GraphQL)..."
                  value={customKeyword}
                  onChange={e => setCustomKeyword(e.target.value)}
                  className="flex-1 bg-obsidian-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-teal-400"
                />
                <Button variant="teal" size="sm" type="submit" className="text-xs">
                  Check
                </Button>
              </form>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Detected Keyword Density</p>
                <div className="flex flex-wrap gap-2">
                  {keywordMatches.map((k, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
                        k.hit
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {k.hit ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {k.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-xs flex items-center justify-between mt-4">
              <span className="text-gray-400">Estimated Pass Probability:</span>
              <span className="font-extrabold text-emerald-400">92.4% (ATS Safe)</span>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* Immediate Quick-Action Hub */}
      <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/roadmap')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">Career Roadmap</p>
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
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Skill Quizzes</p>
              <p className="text-[10px] text-gray-400">4 Tests Ready</p>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem variant="pop">
          <Card
            hoverEffect
            onClick={() => navigate('/student/interview')}
            className="p-4 flex items-center gap-3 cursor-pointer group border border-white/[0.07] bg-obsidian-900/80"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">AI Interview</p>
              <p className="text-[10px] text-gray-400">Speech Telemetry</p>
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
              <p className="text-[10px] text-gray-400">{applications?.length || 2} Active</p>
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Row 2: Matchings & Interviews split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal variant="slide-up" delay={0.05}>
            <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">Recommended Job Matches</h3>
                  <p className="text-xs text-gray-400">Ranked by AI matching score against your active CV.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/analysis?tab=jdmatch')} className="text-sky-400 hover:text-sky-300 text-xs">
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
        </div>

        <ScrollReveal variant="slide-right" delay={0.15}>
          <div className="space-y-6">
            <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
              <h3 className="text-base font-bold text-white font-heading mb-4">Interviews & Activities</h3>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-gray-400 mb-2.5">Scheduled Placement Events</p>
                {interviews.length > 0 ? (
                  interviews.map(item => (
                    <div key={item.id} className="p-3 bg-obsidian-950/80 border border-white/[0.06] rounded-xl flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-sky-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.role}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.company} • {item.date}</p>
                        {item.feedback && (
                          <p className="text-[10px] text-sky-400 mt-1 italic">{item.feedback}</p>
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

              <div>
                <p className="text-xs font-semibold text-gray-400 mb-3">Recent Progress Timeline</p>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1 before:w-[1px] before:bg-white/[0.06]">
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-sky-400 mt-1.5" />
                    <p className="font-semibold text-gray-200">Applied to Zoho Corporation</p>
                    <p className="text-[10px] text-gray-500">Priya_Lakshmi_CV_2026.pdf (94% match) • Yesterday</p>
                  </div>
                  <div className="relative text-xs">
                    <div className="absolute -left-5 h-2 w-2 rounded-full bg-emerald-400 mt-1.5" />
                    <p className="font-semibold text-gray-200">ATS Verification 88% Index</p>
                    <p className="text-[10px] text-gray-500">Passed automated screening filters • 2 days ago</p>
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
