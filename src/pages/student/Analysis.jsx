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
  const keywords = analysis.keywords || { matched: [], missing: [] };
  const atsChecks = Array.isArray(analysis.atsChecks) ? analysis.atsChecks : [];
  const atsScore = analysis.overallScore;
  const parsed = resume.parsed_data || {};
  const documentQuality = parsed.document_quality || {};
  const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
  const warnings = [...(analysis.criticalIssues || []), ...(analysis.warnings || [])];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
  const contactCheck = atsChecks.find(check => check.check_name === 'Contact details');
  const textCheck = atsChecks.find(check => check.check_name === 'Text available for analysis');
  const parsedSkills = Object.entries(parsed.skills || {}).flatMap(([group, values]) =>
    Array.isArray(values) ? values.map(value => ({ group, value })) : []
  );
  const parsedSections = [
    ['Summary', parsed.summary ? 'Content parsed' : parsed.sections_detected?.summary ? 'Heading found; review text' : 'Not detected'],
    ['Skills', parsedSkills.length ? `${parsedSkills.length} items parsed` : parsed.sections_detected?.skills ? 'Heading found; review text' : 'Not detected'],
    ['Work experience', parsed.experience?.length ? `${parsed.experience.length} entries parsed` : parsed.sections_detected?.experience ? 'Heading found; review entries' : 'Not detected'],
    ['Projects', parsed.projects?.length ? `${parsed.projects.length} entries parsed` : parsed.sections_detected?.projects ? 'Heading found; review entries' : 'Not detected'],
    ['Education', parsed.education?.length ? `${parsed.education.length} entries parsed` : parsed.sections_detected?.education ? 'Heading found; review entries' : 'Not detected'],
    ['Certifications', parsed.certifications?.length ? `${parsed.certifications.length} entries parsed` : parsed.sections_detected?.certifications ? 'Heading found; review entries' : 'Not detected'],
  ];

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
            ATS Readiness Estimate
          </h3>
          <AnimatedProgress value={atsScore} type="circle" size={140} strokeWidth={10} />

          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-white/[0.08]">
            <div>
              <p className="text-[11px] text-gray-400">Contact Parsing</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">{contactCheck ? `${contactCheck.score}/${contactCheck.max_score}` : '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Text Analyzed</p>
              <p className="text-sm font-bold text-sky-400 mt-0.5">{textCheck ? `${textCheck.score}/${textCheck.max_score}` : '—'}</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 space-y-4 bg-obsidian-900 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading text-white">
              What the parser recognized
            </h3>
            <span className="text-xs text-sky-400 font-semibold">Content presence, not a quality grade</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {parsedSections.map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-obsidian-950 px-3 py-2.5">
                <span className="text-xs text-gray-300">{label}</span>
                <span className={`text-[10px] font-semibold ${status.includes('parsed') ? 'text-emerald-400' : 'text-amber-300'}`}>{status}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-500">“Not detected” means the parser did not extract it; it does not prove the resume lacks that content.</p>

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

      <Card className="p-5 space-y-4 bg-obsidian-900 border border-white/[0.08]">
        <div>
          <h3 className="text-sm font-bold text-white">Extracted resume content</h3>
          <p className="text-[11px] text-gray-500 mt-1">Review the extracted fields for accuracy. Unrecognized content should not be treated as missing from your actual document.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/[0.07] bg-obsidian-950 p-4">
            <h4 className="text-xs font-semibold text-white mb-2">Skills explicitly listed</h4>
            {parsedSkills.length ? <div className="space-y-2">{Object.entries(parsed.skills || {}).filter(([, values]) => Array.isArray(values) && values.length).map(([group, values]) => <p key={group} className="text-xs text-gray-300"><span className="text-gray-500 capitalize">{group}: </span>{values.join(', ')}</p>)}</div> : <p className="text-xs text-gray-500">No items parsed from a recognized skills section.</p>}
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-obsidian-950 p-4">
            <h4 className="text-xs font-semibold text-white mb-2">Education & certifications</h4>
            {parsed.education?.length ? <ul className="space-y-2 text-xs text-gray-300">{parsed.education.map((item, i) => <li key={`edu-${i}`}>{item.degree}{item.institution ? ` — ${item.institution}` : ''}{item.graduation_year ? ` (${item.graduation_year})` : ''}</li>)}</ul> : <p className="text-xs text-gray-500">No education entry was confidently parsed.</p>}
            {parsed.certifications?.length > 0 && <ul className="mt-3 space-y-1 text-xs text-gray-300">{parsed.certifications.map((item, i) => <li key={`cert-${i}`}>{item.cert_name}{item.issuer ? ` — ${item.issuer}` : ''}</li>)}</ul>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[['Work experience', parsed.experience || [], item => [item.position, item.company, item.date].filter(Boolean).join(' · ')], ['Projects', parsed.projects || [], item => [item.project_name, item.date].filter(Boolean).join(' · ') ]].map(([title, entries, getTitle]) => <div key={title} className="rounded-lg border border-white/[0.07] bg-obsidian-950 p-4">
            <h4 className="text-xs font-semibold text-white mb-2">{title}</h4>
            {entries.length ? <ul className="space-y-3">{entries.map((item, i) => <li key={`${title}-${i}`} className="text-xs text-gray-300"><p className="font-medium">{getTitle(item) || 'Entry extracted; title not identified'}</p>{item.description && <p className="text-gray-400 mt-1">{item.description}</p>}{item.key_points?.length > 0 && <ul className="mt-1.5 ml-4 list-disc space-y-1">{item.key_points.map((point, j) => <li key={j}>{point}</li>)}</ul>}</li>)}</ul> : <p className="text-xs text-gray-500">No entries parsed from this section.</p>}
          </div>)}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3 bg-obsidian-900 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white">What the parser found</h3>
          <p className="text-xs text-gray-400">{documentQuality.word_count ?? 0} words · {documentQuality.non_empty_lines ?? 0} text lines · {Object.values(parsed.skills || {}).filter(Array.isArray).flat().length} listed skills</p>
          <div className="space-y-2 text-xs text-gray-300">
            <p><span className="text-gray-500">Name:</span> {parsed.full_name || 'Not detected'}</p>
            <p><span className="text-gray-500">Email:</span> {parsed.email || 'Not detected'}</p>
            <p><span className="text-gray-500">Phone:</span> {parsed.phone || 'Not detected'}</p>
            <p><span className="text-gray-500">Experience entries:</span> {parsed.experience?.length || 0} · <span className="text-gray-500">Projects:</span> {parsed.projects?.length || 0} · <span className="text-gray-500">Education:</span> {parsed.education?.length || 0}</p>
          </div>
          <p className="text-[11px] text-amber-300">This report can assess extracted text only; it cannot verify visual layout, columns, fonts, or graphics.</p>
        </Card>
        <Card className="p-5 space-y-3 bg-obsidian-900 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white">Strengths and review flags</h3>
          {strengths.length > 0 && <ul className="space-y-1.5 text-xs text-emerald-300">{strengths.map((item, i) => <li key={`s-${i}`}>✓ {item}</li>)}</ul>}
          {warnings.length > 0 && <ul className="space-y-1.5 text-xs text-amber-300">{warnings.map((item, i) => <li key={`w-${i}`}>• {typeof item === 'string' ? item : item.message || JSON.stringify(item)}</li>)}</ul>}
          {strengths.length === 0 && warnings.length === 0 && <p className="text-xs text-gray-500">No additional flags were recorded.</p>}
        </Card>
      </div>

      <Card className="p-5 space-y-3 bg-obsidian-900 border border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Prioritized improvements</h3>
          <span className="text-[10px] text-gray-500">Suggestions use parsed resume evidence; verify every change.</span>
        </div>
        {recommendations.length ? <div className="grid sm:grid-cols-2 gap-3">
          {recommendations.map((item, i) => <div key={`${item.category}-${i}`} className="rounded-lg border border-white/[0.07] bg-obsidian-950 p-3">
            <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-white capitalize">{String(item.category || 'review').replaceAll('_', ' ')}</span><Badge variant={item.priority === 'high' ? 'rose' : 'blue'}>{item.priority || 'suggestion'}</Badge></div>
            <p className="text-xs text-gray-300 mt-2">{item.suggestion}</p>
            {item.example && <p className="text-[11px] text-gray-500 mt-1">{item.example}</p>}
          </div>)}
        </div> : <p className="text-xs text-gray-500">No automatic suggestions are available in this analysis.</p>}
      </Card>

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
          <h3 className="text-sm font-bold text-white">How this estimate is calculated</h3>
          <p className="text-xs text-gray-400 mt-1">This product estimate totals contact parsing (15), recognized sections (25), an explicit skills list (15), text available for analysis (20), and parsed work/project detail (25). It is not a score from an employer’s ATS, a hiring prediction, or a job match. Use JD Matching for comparison with an actual job description.</p>
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
