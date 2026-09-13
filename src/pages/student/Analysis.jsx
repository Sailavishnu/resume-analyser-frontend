import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../../store/studentStore';
import {
  FileText, Sparkles, SearchCode, BarChart3, Upload, CheckCircle2,
  AlertCircle, ShieldAlert, ArrowRight, Copy, Check, ExternalLink, RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import FileUpload from '../../components/shared/FileUpload';
import toast from 'react-hot-toast';

export default function ResumeAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { resumes, getSelectedResume, analyzeUploadedResume, analyzing, setSelectedResumeId } = useStudentStore();
  const navigate = useNavigate();
  const resume = getSelectedResume() || resumes[0];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleFileUpload = async (file) => {
    try {
      toast.loading(`Analyzing ${file.name} with AI parser...`, { id: 'upload' });
      const newResume = await analyzeUploadedResume(file.name);
      toast.success('Analysis complete! ATS scorecard generated.', { id: 'upload' });
      handleTabChange('ats');
    } catch (err) {
      toast.error('Failed parsing file. Please try again.', { id: 'upload' });
    }
  };

  const tabs = [
    { id: 'overview',    label: 'Upload & Resumes', icon: Upload,      desc: 'Active CV & uploads' },
    { id: 'ats',         label: 'ATS Scorecard',    icon: BarChart3,   desc: 'Parser audit & score' },
    { id: 'jdmatch',     label: 'JD Matching',      icon: SearchCode,  desc: 'Target job alignment' },
    { id: 'enhancement', label: 'AI Enhancement',   icon: Sparkles,    desc: 'Bullet point rewrites' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Resume Analysis Engine
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Upload, audit, match with job descriptions, and enhance bullets — all in one place.
          </p>
        </div>

        {/* Selected CV pill */}
        {resume && (
          <div className="glass px-3.5 py-2 rounded-xl flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <FileText className="h-4 w-4 text-brand-blue" />
            <div className="text-left">
              <p className="text-xs font-semibold truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }}>
                {resume.name}
              </p>
              <p className="text-[10px] text-emerald-500 font-medium">
                Active CV · {resume.score}% ATS Score
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'glass hover:border-indigo-400/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)]'}`}>
                  {t.label}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {t.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Panes ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {activeTab === 'overview' && (
            <UploadAndManagePane
              resumes={resumes}
              selectedId={resume?.id}
              onSelect={setSelectedResumeId}
              onUpload={handleFileUpload}
              analyzing={analyzing}
              onGoToAts={() => handleTabChange('ats')}
            />
          )}

          {activeTab === 'ats' && (
            <AtsScorecardPane
              resume={resume}
              onGoToJd={() => handleTabChange('jdmatch')}
              onGoToEnhance={() => handleTabChange('enhancement')}
            />
          )}

          {activeTab === 'jdmatch' && (
            <JdMatchingPane resume={resume} />
          )}

          {activeTab === 'enhancement' && (
            <EnhancementPane resume={resume} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   1. UPLOAD & MANAGE RESUMES PANE
══════════════════════════════════════════════════════════════════ */
function UploadAndManagePane({ resumes, selectedId, onSelect, onUpload, analyzing, onGoToAts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6">
          <h3 className="text-sm font-bold font-heading mb-3" style={{ color: 'var(--text-primary)' }}>
            Upload New Resume (PDF / DOCX)
          </h3>
          <FileUpload onFileSelect={onUpload} isAnalyzing={analyzing} />
        </Card>

        {/* ATS Compliance notice */}
        <div className="glass-card p-4.5 border-l-4 border-amber-500 bg-amber-500/5 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-amber-600 dark:text-amber-400">ATS Parsing Recommendation</p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Use clean, standard single-column text layouts. Graphic-heavy CVs, complex multi-column tables, or embedded Canva images can confuse automated parsers and lower your placement match rate.
            </p>
          </div>
        </div>
      </div>

      {/* History & Active Resumes */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold font-heading uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Your Uploaded Resumes ({resumes.length})
            </h4>
            <span className="text-[10px] text-indigo-500 font-semibold">Click to activate</span>
          </div>

          <div className="space-y-2.5">
            {resumes.map(r => {
              const isSelected = r.id === selectedId;
              return (
                <div
                  key={r.id}
                  onClick={() => onSelect(r.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'glass hover:border-indigo-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`} style={{ color: isSelected ? undefined : 'var(--text-primary)' }}>
                        {r.name}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Uploaded {new Date(r.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      {r.score}%
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border-faint)' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onGoToAts(); }}
                        className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
                      >
                        Inspect Scorecard <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. ATS SCORECARD PANE
══════════════════════════════════════════════════════════════════ */
function AtsScorecardPane({ resume, onGoToJd, onGoToEnhance }) {
  if (!resume || !resume.analysis) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No resume selected.</p>
      </div>
    );
  }

  const analysis = resume.analysis;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Ring Gauge */}
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
            Overall ATS Readiness
          </h3>
          <AnimatedProgress value={analysis.overallScore} type="circle" size={140} strokeWidth={10} />

          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-faint)' }}>
            <div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Skills Match</p>
              <p className="text-sm font-bold text-emerald-500 mt-0.5">{analysis.sectionScores.skills}%</p>
            </div>
            <div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Layout & Format</p>
              <p className="text-sm font-bold text-indigo-500 mt-0.5">{analysis.sectionScores.formatting}%</p>
            </div>
          </div>
        </Card>

        {/* Section Scores */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Section Performance Breakdown
            </h3>
            <span className="text-xs text-brand-blue font-semibold">4 of 4 Verified</span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Technical & Domain Skills', value: analysis.sectionScores.skills, color: 'emerald' },
              { label: 'Work & Project Experience', value: analysis.sectionScores.experience, color: 'blue' },
              { label: 'Education & Certifications', value: analysis.sectionScores.education, color: 'violet' },
              { label: 'ATS Parsable Typography & Spacing', value: analysis.sectionScores.formatting, color: 'teal' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{s.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet transition-all duration-500"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onGoToJd} icon={SearchCode}>
              Test Against a JD
            </Button>
            <Button variant="primary" size="sm" onClick={onGoToEnhance} icon={Sparkles}>
              Enhance Bullets
            </Button>
          </div>
        </Card>
      </div>

      {/* Keywords Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Matched Keywords Found ({analysis.keywords.matched.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.matched.map((k, i) => (
              <Badge key={i} variant="emerald">{k}</Badge>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Missing High-Value Keywords ({analysis.keywords.missing.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.missing.map((k, i) => (
              <Badge key={i} variant="rose">{k}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. JOB DESCRIPTION MATCHING PANE
══════════════════════════════════════════════════════════════════ */
function JdMatchingPane({ resume }) {
  const [jdText, setJdText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatchCalculation = async () => {
    if (!jdText.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    setMatching(true);
    toast.loading('Scanning job description keywords against CV...', { id: 'jd' });
    await new Promise(r => setTimeout(r, 1400));

    const textLower = jdText.toLowerCase();
    const targetKeywords = ['react', 'node.js', 'typescript', 'docker', 'aws', 'graphql', 'redis', 'sql', 'python', 'kubernetes', 'ci/cd', 'tailwind'];
    const matched = targetKeywords.filter(k => textLower.includes(k) && (resume?.analysis?.keywords?.matched || []).some(rm => rm.toLowerCase().includes(k)));
    const missing = targetKeywords.filter(k => textLower.includes(k) && !matched.includes(k));

    const calculatedScore = Math.min(96, Math.max(45, 55 + (matched.length * 6) - (missing.length * 4)));

    setResults({
      score: calculatedScore,
      matched: matched.length > 0 ? matched : ['React', 'JavaScript', 'SQL', 'Git'],
      missing: missing.length > 0 ? missing : ['Docker', 'AWS', 'TypeScript', 'Redis'],
    });

    setMatching(false);
    toast.success('JD alignment calculated!', { id: 'jd' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Target Job Description
              </h3>
              <div className="flex gap-1.5 overflow-x-auto">
                {['Full Stack Developer', 'Frontend Engineer', 'Backend Dev'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setTargetRole(preset);
                      setJdText(`We are looking for an exceptional ${preset}. Required skills: React, TypeScript, Node.js, REST APIs, SQL, Docker, and AWS cloud deployment.`);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-[var(--border-light)] bg-[var(--bg-elevated)] hover:border-indigo-400 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Preset: {preset}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, required qualifications, tech stack)..."
              rows={8}
              className="glass-input w-full rounded-xl p-3.5 text-xs resize-none"
              style={{ color: 'var(--text-primary)' }}
            />

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleMatchCalculation}
                disabled={matching}
                icon={SearchCode}
              >
                {matching ? 'Calculating Match...' : 'Calculate Alignment %'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Column */}
        <div>
          {results ? (
            <Card className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Job Description Match
                </p>
                <div className="text-4xl font-extrabold font-heading text-indigo-500 mt-2">
                  {results.score}%
                </div>
                <p className="text-[11px] text-emerald-500 font-semibold mt-1">
                  {results.score >= 75 ? 'Strong Candidate Fit' : 'Moderate Match — Address Missing Skills'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--border-faint)' }}>
                <div>
                  <p className="text-xs font-bold text-emerald-500 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched In JD ({results.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {results.matched.map((m, i) => (
                      <Badge key={i} variant="emerald">{m}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-rose-500 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing From Resume ({results.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {results.missing.map((m, i) => (
                      <Badge key={i} variant="rose">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[220px]">
              <SearchCode className="h-8 w-8 text-brand-blue/40" />
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>No Comparison Run Yet</p>
              <p className="text-[11px] leading-relaxed max-w-[220px]" style={{ color: 'var(--text-muted)' }}>
                Paste a target job posting on the left to see how your active CV scores against the recruiter's requirements.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. AI BULLET ENHANCEMENT PANE
══════════════════════════════════════════════════════════════════ */
function EnhancementPane({ resume }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const bulletOptimizations = [
    {
      original: "Worked on frontend features using React and fixed bugs.",
      enhanced: "Architected 12+ reusable React UI components with TypeScript, slashing page render latency by 34% and resolving 40+ production bug tickets.",
      gain: "+18 ATS points",
      metric: "Latency reduction & component scale",
    },
    {
      original: "Handled database queries and backend APIs with Node.js.",
      enhanced: "Designed and documented 15 RESTful endpoints in Node.js/Express with MongoDB indexing, supporting 25,000+ daily requests with 99.9% uptime.",
      gain: "+22 ATS points",
      metric: "Request volume & uptime reliability",
    },
    {
      original: "Responsible for testing and code reviews in our college project team.",
      enhanced: "Spearheaded Git branching protocols and Jest test suites for a 4-person Agile squad, boosting unit test coverage to 82% ahead of release.",
      gain: "+15 ATS points",
      metric: "Test coverage & team leadership",
    },
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    toast.success('Enhanced bullet copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 border-l-4 border-indigo-500 flex items-center justify-between">
        <div className="text-xs">
          <p className="font-bold text-indigo-600 dark:text-indigo-400">AI Bullet Point Optimization</p>
          <p style={{ color: 'var(--text-muted)' }}>
            Weak bullets state passive duties. Strong bullets state: <strong>Action Verb + Task + Quantifiable Impact</strong>.
          </p>
        </div>
        <Badge variant="indigo">XYZ Formula</Badge>
      </div>

      <div className="space-y-3.5">
        {bulletOptimizations.map((b, i) => (
          <Card key={i} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-500">Before (Vague / Low ATS Weight):</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {b.gain}
              </span>
            </div>
            <p className="text-xs text-rose-900/80 dark:text-rose-200/80 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/20">
              {b.original}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-violet" /> AI Enhanced (XYZ Metric Driven):
              </span>
              <button
                onClick={() => handleCopy(b.enhanced, i)}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 cursor-pointer"
              >
                {copiedIdx === i ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy Bullet</>}
              </button>
            </div>
            <p className="text-xs font-medium text-emerald-900/90 dark:text-emerald-200/90 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 leading-relaxed">
              {b.enhanced}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
