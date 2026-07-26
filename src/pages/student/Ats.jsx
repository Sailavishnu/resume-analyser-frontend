import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { Sparkles, CheckCircle2, XCircle, ChevronRight, Bookmark, ArrowUpRight, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import EmptyState from '../../components/ui/EmptyState';

export default function Ats() {
  const { getSelectedResume } = useStudentStore();
  const navigate = useNavigate();

  const resume = getSelectedResume();

  if (!resume) {
    return (
      <EmptyState
        title="No resumes found"
        description="Please upload your resume to generate an ATS Analysis score."
        actionLabel="Upload Resume"
        onAction={() => navigate('/student/upload')}
      />
    );
  }

  const analysis = resume.analysis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">AI ATS Scorecard</h1>
          <p className="text-xs text-gray-400">Review recommendations below to match recruiter algorithms.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/student/enhancement')} icon={Sparkles}>
          Enhance Resume Bullets
        </Button>
      </div>

      {/* Main Stats layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Ring Gauge */}
        <Card className="flex flex-col items-center justify-center p-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Overall Score</h3>
          <AnimatedProgress value={analysis.overallScore} type="circle" size={140} strokeWidth={10} />
          
          <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-white/[0.04] text-center">
            <div>
              <p className="text-xs text-gray-500">Skills Match</p>
              <p className="text-sm font-bold text-white mt-0.5">{analysis.sectionScores.skills}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Formatting</p>
              <p className="text-sm font-bold text-white mt-0.5">{analysis.sectionScores.formatting}%</p>
            </div>
          </div>
        </Card>

        {/* Keywords Matching */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Search className="h-4 w-4 text-brand-blue" />
              <span>Keyword Optimization</span>
            </h3>

            {/* Matched keywords */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Matched Skills ({analysis.keywords.matched.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.keywords.matched.map(kw => (
                  <Badge key={kw} variant="success" size="sm">{kw}</Badge>
                ))}
              </div>
            </div>

            {/* Missing keywords */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-brand-rose mb-2 uppercase tracking-wide">Critical Gaps ({analysis.keywords.missing.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.keywords.missing.map(kw => (
                  <Badge key={kw} variant="danger" size="sm">{kw}</Badge>
                ))}
              </div>
            </div>

            {/* AI keywords recommendations */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-brand-amber mb-2 uppercase tracking-wide">Recommended Additions</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.keywords.suggestions.map(kw => (
                  <Badge key={kw} variant="warning" size="sm">{kw}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Formatting & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formatting Analysis checklist */}
        <Card className="p-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Formatting & Structure Check</h3>
          <div className="space-y-4">
            {analysis.formattingCheck.map(f => (
              <div key={f.id} className="flex gap-3">
                {f.passed ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-emerald shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4.5 w-4.5 text-brand-rose shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${f.passed ? 'text-gray-200' : 'text-white'}`}>{f.check}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Action Items list */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">AI Actionable Tasks</h3>
            <div className="space-y-3.5">
              <div className="p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg">
                <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" /> Add Missing Keywords
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Integrate keywords like <strong>TypeScript</strong> and <strong>AWS</strong> into your experience bullets to pass job screening guidelines.
                </p>
              </div>
              <div className="p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg">
                <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" /> Quantify Work Impact
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Avoid passive statements in your experience logs. Apply AI bullet rewriting enhancements to show metrics-driven achievements.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.04]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/enhancement')}
              className="w-full text-xs"
            >
              Analyze Bullet Point Optimizations <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
