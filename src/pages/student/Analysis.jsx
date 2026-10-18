import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../../store/studentStore';
import {
  FileText, Sparkles, SearchCode, BarChart3, Upload, CheckCircle2,
  AlertCircle, ShieldAlert, ArrowRight, Copy, Check, ExternalLink, RefreshCw,
  Layers, Star, GitCompare, Trash2, ArrowUpRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import FileUpload from '../../components/shared/FileUpload';
import ResumeEnhancementPanel from '../../components/shared/ResumeEnhancementPanel';
import { resumeService } from '../../services/resumeService';
import toast from 'react-hot-toast';

export default function ResumeAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'ats';
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    getSelectedResume
  } = useStudentStore();
  const navigate = useNavigate();
  const resume = getSelectedResume() || resumes[0];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'ats',         label: 'ATS Scorecard',    icon: BarChart3,   desc: 'Parser audit & score' },
    { id: 'jdmatch',     label: 'JD Matching',      icon: SearchCode,  desc: 'Target job alignment' },
    { id: 'enhancement', label: 'AI Enhancement',   icon: Sparkles,    desc: 'Bullet point rewrites' },
    { id: 'compare',     label: 'Version Compare',  icon: GitCompare,  desc: 'Side-by-side CV diff' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-400" /> Resume Analysis & Optimization Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Deep-dive audit, keyword analysis, job alignment, side-by-side version comparison, and AI bullet optimization.
          </p>
        </div>

        {/* Selected CV Selector & Vault Link */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {resumes.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-gray-400 hidden md:block">Auditing:</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="bg-obsidian-900 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer focus:outline-none border border-white/[0.08] text-white"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.isPrimary ? 'Primary' : r.slot === 'secondary' ? 'Secondary' : 'Draft'} • {r.atsScore ?? r.score ?? '—'}{r.atsScore != null || r.score != null ? '%' : ''})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/resumes')}
            icon={Layers}
          >
            Manage Vault
          </Button>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                isActive
                  ? 'border-sky-500 bg-sky-500/10 shadow-sm'
                  : 'bg-obsidian-900 hover:border-white/20'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-sky-500 text-obsidian-950 font-bold' : 'bg-obsidian-950 text-gray-400'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-sky-400' : 'text-white'}`}>
                  {t.label}
                </p>
                <p className="text-[10px] text-gray-400">
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

          {activeTab === 'enhancement' && <ResumeEnhancementPanel resume={resume} />}

          {activeTab === 'compare' && (
            <VersionComparePane resumes={resumes} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ATS SCORECARD PANE
══════════════════════════════════════════════════════════════════ */
function AtsScorecardPane({ resume, onGoToJd, onGoToEnhance }) {
  if (!resume || !resume.analysis) {
    return (
      <Card className="p-8 text-center bg-obsidian-900 border border-white/10">
        <p className="text-sm font-semibold text-gray-400">No resume selected.</p>
      </Card>
    );
  }

  const analysis = resume.analysis;
  const sectionScores = analysis.sectionScores || {};
  const keywords = analysis.keywords || { matched: [], missing: [] };
  const atsChecks = Array.isArray(analysis.atsChecks) ? analysis.atsChecks : [];
  const atsScore = analysis.overallScore;

  if (analysis.analysisStatus === 'failed') {
    return (
      <Card className="p-8 text-center bg-obsidian-900 border border-rose-500/20">
        <p className="text-sm font-semibold text-rose-300">Resume analysis failed.</p>
        <p className="text-xs text-gray-400 mt-2">{resume.analysis_stage || 'Please upload a readable PDF or DOCX and try again.'}</p>
      </Card>
    );
  }
  if (atsScore == null) {
    return (
      <Card className="p-8 text-center bg-obsidian-900 border border-white/10">
        <p className="text-sm font-semibold text-gray-300">Resume analysis is still processing.</p>
        <p className="text-xs text-gray-500 mt-2">{resume.analysis_stage || 'Scores appear after the resume has been parsed.'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-8 text-center bg-obsidian-900 border border-white/[0.08]">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-400">
            Overall ATS Compatibility
          </h3>
          <AnimatedProgress value={atsScore} type="circle" size={140} strokeWidth={10} />

          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-white/[0.08]">
            <div>
              <p className="text-[11px] text-gray-400">Skills Match</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{sectionScores.skills}%</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Layout & Format</p>
              <p className="text-sm font-bold text-sky-400 mt-0.5">{sectionScores.formatting}%</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 space-y-4 bg-obsidian-900 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading text-white">
              Resume Section Health Breakdown
            </h3>
            <span className="text-xs text-sky-400 font-semibold">Health indicators</span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Technical & Domain Skills', value: sectionScores.skills, color: 'emerald' },
              { label: 'Work & Project Experience', value: sectionScores.experience, color: 'blue' },
              { label: 'Education & Certifications', value: sectionScores.education, color: 'violet' },
              { label: 'ATS Parsable Typography & Spacing', value: sectionScores.formatting, color: 'teal' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">{s.label}</span>
                  <span className="text-white">{s.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-obsidian-950 overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${s.value ?? 0}%` }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3 bg-obsidian-900 border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Matched Keywords Found ({keywords.matched.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.matched.map((k, i) => (
              <Badge key={i} variant="emerald">{k}</Badge>
            ))}
            {keywords.matched.length === 0 && <span className="text-xs text-gray-500">No job description was provided, so job-specific matches are unavailable.</span>}
          </div>
        </Card>

        <Card className="p-5 space-y-3 bg-obsidian-900 border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Missing High-Value Keywords ({keywords.missing.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.missing.map((k, i) => (
              <Badge key={i} variant="rose">{k}</Badge>
            ))}
            {keywords.missing.length === 0 && <span className="text-xs text-gray-500">No job-specific keyword gaps are available yet.</span>}
          </div>
        </Card>
      </div>

      <Card className="p-5 space-y-4 bg-obsidian-900 border border-white/[0.08]">
        <div>
          <h3 className="text-sm font-bold text-white">ATS score calculation</h3>
          <p className="text-xs text-gray-400 mt-1">The score is calculated from contact details (20 points), detected sections (25), technical keyword density (20), formatting/readability (20), and experience detail (15). It is a rule-based compatibility estimate, not a prediction of a hiring decision.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {atsChecks.map((check, index) => (
            <div key={`${check.check_name}-${index}`} className="rounded-lg border border-white/[0.06] bg-obsidian-950 p-3">
              <div className="flex justify-between gap-2 text-xs">
                <span className="font-semibold text-gray-200">{check.check_name}</span>
                <span className={check.passed ? 'text-emerald-400' : 'text-amber-400'}>{check.score}/{check.max_score ?? '?'}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{check.message}</p>
            </div>
          ))}
          {atsChecks.length === 0 && <p className="text-xs text-gray-500">Detailed ATS checks are not available for this saved analysis.</p>}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   JOB DESCRIPTION MATCHING PANE
══════════════════════════════════════════════════════════════════ */
function JdMatchingPane({ resume }) {
  const [jdText, setJdText] = useState('');
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatchCalculation = async () => {
    if (!jdText.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    if (!resume?.id) return toast.error('Upload a resume before matching it to a job description.');
    setMatching(true);
    try {
      const match = await resumeService.compareWithJobDescription(resume.id, jdText.trim());
      setResults(match);
      toast.success('Job description analysis complete.');
    } catch (error) {
      toast.error(error.message || 'Could not analyze this job description.');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4 bg-obsidian-900 border border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold font-heading text-white">
                Target Job Description
              </h3>
              <span className="text-[10px] text-gray-500">{resume?.name || 'No resume selected'}</span>
            </div>

            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, required qualifications, tech stack)..."
              rows={8}
              className="bg-obsidian-950 border border-white/10 w-full rounded-xl p-3.5 text-xs text-white resize-none focus:outline-none focus:border-sky-400"
            />

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleMatchCalculation}
                disabled={matching}
                icon={SearchCode}
              >
                {matching ? 'Analyzing...' : 'Analyze Job Description'}
              </Button>
            </div>
          </Card>
        </div>

        <div>
          {results ? (
            <Card className="p-6 space-y-5 bg-obsidian-900 border border-white/[0.08]">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Resume and Job Description
                </p>
                <div className="text-4xl font-extrabold font-heading text-sky-400 mt-2">
                  {results.skill_coverage}%
                </div>
                <p className="text-[11px] text-gray-400 font-semibold mt-1">
                  Skills present in JD found in resume
                </p>
                <p className="text-[11px] text-sky-300 mt-1">Sentence embedding similarity: {(Math.max(0, results.semantic_similarity) * 100).toFixed(1)}%</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div>
                    <p className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched skills ({results.matched_skills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {results.matched_skills.map((m, i) => (
                      <Badge key={i} variant="emerald">{m}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-rose-400 mb-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing From Resume ({results.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {results.missing_skills.map((m, i) => (
                      <Badge key={i} variant="rose">{m}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">Semantic engine: {results.embedding_engine}. Skills detected: {results.skills_found_in_job_description.length}.</p>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-3 flex flex-col items-center justify-center h-full min-h-[220px] bg-obsidian-900 border border-white/[0.08]">
              <SearchCode className="h-8 w-8 text-sky-400/40" />
              <p className="text-xs font-semibold text-white">No Comparison Run Yet</p>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[220px]">
                Paste the actual job description to compare detected technical skills and sentence embedding similarity with this uploaded resume.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AI BULLET ENHANCEMENT PANE
══════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════
   VERSION COMPARISON PANE (Side-by-Side Diff)
══════════════════════════════════════════════════════════════════ */
function VersionComparePane({ resumes }) {
  const [v1Id, setV1Id] = useState(resumes[0]?.id || '');
  const [v2Id, setV2Id] = useState(resumes[1]?.id || resumes[0]?.id || '');

  const v1 = resumes.find(r => r.id === v1Id) || resumes[0];
  const v2 = resumes.find(r => r.id === v2Id) || resumes[1] || resumes[0];
  const skillsOf = (resume) => Object.values(resume?.parsed_data?.skills || {})
    .filter(Array.isArray).flat().filter((skill, index, all) => all.indexOf(skill) === index);
  const skills1 = skillsOf(v1);
  const skills2 = skillsOf(v2);
  const score1 = v1?.atsScore ?? null;
  const score2 = v2?.atsScore ?? null;
  const scoreDiff = score1 != null && score2 != null ? score2 - score1 : null;

  if (resumes.length < 2) {
    return <Card className="p-8 text-center text-sm text-gray-400">Upload a second resume to compare saved ATS scores and parsed skills.</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-obsidian-900 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-sky-400" /> Side-by-Side Resume Version Comparator
          </h3>
          <p className="text-xs text-gray-400">This comparison uses the ATS scores and skills parsed from each uploaded resume.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={v1Id}
            onChange={e => setV1Id(e.target.value)}
            className="bg-obsidian-950 border border-white/10 text-xs text-white rounded-lg p-2"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>Base: {r.name} ({r.atsScore ?? '—'}%)</option>
            ))}
          </select>

          <span className="text-gray-500 font-bold">vs</span>

          <select
            value={v2Id}
            onChange={e => setV2Id(e.target.value)}
            className="bg-obsidian-950 border border-white/10 text-xs text-white rounded-lg p-2"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>Compare: {r.name} ({r.atsScore ?? '—'}%)</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Version 1 */}
        <Card className="p-6 space-y-4 bg-obsidian-900 border border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <Badge variant="blue">Base Version</Badge>
              <h4 className="text-base font-bold text-white mt-1">{v1?.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white">{score1 == null ? '—' : `${score1}%`}</span>
              <p className="text-[10px] text-gray-400">ATS Score</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-gray-400">Parsed skills: <strong className="text-emerald-400">{skills1.length}</strong></p>

            <div className="flex flex-wrap gap-1">
              {skills1.map(k => (
                <span key={k} className="px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 text-[10px]">{k}</span>
              ))}
              {!skills1.length && <span className="text-[10px] text-gray-500">No skills were parsed.</span>}
            </div>
          </div>
        </Card>

        {/* Version 2 */}
        <Card className="p-6 space-y-4 bg-obsidian-900 border border-teal-500/30">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <Badge variant="teal">Newer Version</Badge>
              <h4 className="text-base font-bold text-white mt-1">{v2?.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-teal-400">{score2 == null ? '—' : `${score2}%`}</span>
              <p className={`text-[10px] font-bold ${scoreDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {scoreDiff == null ? 'Score delta unavailable' : scoreDiff >= 0 ? `+${scoreDiff} points` : `${scoreDiff} points`}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-gray-400">Parsed skills: <strong className="text-emerald-400">{skills2.length}</strong></p>

            <div className="flex flex-wrap gap-1">
              {skills2.map(k => (
                <span key={k} className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px]">{k}</span>
              ))}
              {!skills2.length && <span className="text-[10px] text-gray-500">No skills were parsed.</span>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
