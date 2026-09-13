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
import toast from 'react-hot-toast';

export default function ResumeAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    resumes,
    getSelectedResume,
    analyzeUploadedResume,
    analyzing,
    setSelectedResumeId,
    setAsPrimaryResume,
    setAsSecondaryResume,
    deleteResume
  } = useStudentStore();
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
    { id: 'compare',     label: 'Compare Versions', icon: Layers,      desc: 'Diff Primary vs Secondary' },
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
              onGoToCompare={() => handleTabChange('compare')}
              onSetPrimary={setAsPrimaryResume}
              onSetSecondary={setAsSecondaryResume}
              onDelete={deleteResume}
            />
          )}

          {activeTab === 'compare' && (
            <CompareVersionsPane
              resumes={resumes}
              onSetPrimary={setAsPrimaryResume}
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
function UploadAndManagePane({
  resumes,
  selectedId,
  onSelect,
  onUpload,
  analyzing,
  onGoToAts,
  onGoToCompare,
  onSetPrimary,
  onSetSecondary,
  onDelete
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Upload New Resume (PDF / DOCX)
            </h3>
            <span className="text-[11px] text-gray-400">Max size: 10MB</span>
          </div>
          <FileUpload onFileSelect={onUpload} isAnalyzing={analyzing} />
        </Card>

        {/* Cloud Storage & ATS Notice */}
        <div className="glass-card p-4.5 border-l-4 border-amber-500 bg-amber-500/5 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-amber-600 dark:text-amber-400">Primary & Secondary Resume Storage</p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              You can maintain up to 2 active cloud versions (<strong>Primary</strong> for campus placements and <strong>Secondary</strong> for specialized roles). When you upload a new CV, you can evaluate its ATS scorecard or compare it side-by-side with your existing versions before promoting it.
            </p>
          </div>
        </div>
      </div>

      {/* History & Active Resumes */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold font-heading uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Your Stored Resumes ({resumes.length}/2)
              </h4>
              <p className="text-[10px] text-gray-500">Primary & Secondary Slots</p>
            </div>
            <button
              onClick={onGoToCompare}
              className="text-[11px] font-semibold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GitCompare className="h-3 w-3" /> Compare All
            </button>
          </div>

          <div className="space-y-3">
            {resumes.map(r => {
              const isSelected = r.id === selectedId;
              const isPrimary = r.isPrimary || r.slot === 'primary';
              const isSecondary = r.slot === 'secondary';

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
                      <div className="flex items-center gap-1.5 mb-1">
                        {isPrimary ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                            ★ Primary Active
                          </span>
                        ) : isSecondary ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Secondary Backup
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/[0.05] text-gray-400">
                            {r.version || 'Draft'}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`} style={{ color: isSelected ? undefined : 'var(--text-primary)' }}>
                        {r.name}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {r.role || 'Software Engineer'} • Uploaded {new Date(r.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      {r.atsScore || r.score}%
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] gap-2" style={{ borderColor: 'var(--border-faint)' }}>
                    <div className="flex items-center gap-2">
                      {!isPrimary && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetPrimary(r.id);
                            toast.success(`Set ${r.name} as your Primary CV!`);
                          }}
                          className="font-semibold text-brand-blue hover:underline cursor-pointer"
                        >
                          Make Primary
                        </button>
                      )}
                      {resumes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(r.id);
                            toast.success(`Removed ${r.name}`);
                          }}
                          className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                          title="Delete CV"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onGoToCompare(); }}
                        className="font-semibold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        Compare
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelect(r.id); onGoToAts(); }}
                        className="font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
                      >
                        Audit <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
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
   COMPARE VERSIONS PANE (DIFF PRIMARY VS SECONDARY / NEW CV)
══════════════════════════════════════════════════════════════════ */
function CompareVersionsPane({ resumes, onSetPrimary, onGoToAts }) {
  const [v1Id, setV1Id] = useState(resumes.find(r => r.slot === 'secondary')?.id || resumes[1]?.id || resumes[0]?.id);
  const [v2Id, setV2Id] = useState(resumes.find(r => r.isPrimary || r.slot === 'primary')?.id || resumes[0]?.id);

  const resA = resumes.find(r => r.id === v1Id) || resumes[0];
  const resB = resumes.find(r => r.id === v2Id) || resumes[1] || resumes[0];

  const scoreA = resA?.atsScore || resA?.score || 70;
  const scoreB = resB?.atsScore || resB?.score || 85;
  const delta = scoreB - scoreA;

  const skillsA = resA?.analysis?.keywords?.matched || ['Node.js', 'SQL', 'Python', 'REST APIs', 'Git'];
  const skillsB = resB?.analysis?.keywords?.matched || ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile', 'Zustand', 'TailwindCSS'];

  const addedSkills = skillsB.filter(s => !skillsA.some(sa => sa.toLowerCase() === s.toLowerCase()));
  const missingSkills = (resB?.analysis?.keywords?.missing || ['TypeScript', 'Docker', 'AWS']).slice(0, 4);

  const dimensions = [
    { label: 'ATS Compatibility Index', a: resA?.dimensions?.[0]?.score || 72, b: resB?.dimensions?.[0]?.score || 88 },
    { label: 'Skills & Keyword Match', a: resA?.dimensions?.[1]?.score || 68, b: resB?.dimensions?.[1]?.score || 82 },
    { label: 'Experience Impact (XYZ)', a: resA?.dimensions?.[2]?.score || 65, b: resB?.dimensions?.[2]?.score || 78 },
    { label: 'Project Depth & Architecture', a: resA?.dimensions?.[3]?.score || 75, b: resB?.dimensions?.[3]?.score || 90 },
    { label: 'Formatting Consistency', a: resA?.dimensions?.[4]?.score || 80, b: resB?.dimensions?.[4]?.score || 94 }
  ];

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">
              Version Comparison Engine
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Compare Any Two Resumes</h3>
            <p className="text-xs text-gray-400">
              Select your baseline version and target version to inspect score gains and keyword differences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              delta >= 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {delta >= 0 ? `+${delta} ATS Points Delta` : `${delta} ATS Points Delta`}
            </span>
          </div>
        </div>

        {/* Version Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Baseline Resume (v1)
            </label>
            <select
              value={v1Id}
              onChange={e => setV1Id(e.target.value)}
              className="w-full bg-obsidian-950 border border-white/[0.08] text-xs text-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.isPrimary ? 'Primary' : r.slot === 'secondary' ? 'Secondary' : 'Draft'} • {r.atsScore || r.score}%)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Role: <strong className="text-gray-400">{resA?.role || 'Developer'}</strong> • Uploaded {new Date(resA?.uploadDate).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Target / Comparison Resume (v2)
            </label>
            <select
              value={v2Id}
              onChange={e => setV2Id(e.target.value)}
              className="w-full bg-obsidian-950 border border-white/[0.08] text-xs text-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-blue"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.isPrimary ? 'Primary' : r.slot === 'secondary' ? 'Secondary' : 'Draft'} • {r.atsScore || r.score}%)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Role: <strong className="text-gray-400">{resB?.role || 'Developer'}</strong> • Uploaded {new Date(resB?.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Side-by-side Score Delta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <Card className="p-6 border border-white/[0.06] bg-obsidian-900/60 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Baseline Version</span>
              <h4 className="text-base font-bold text-white mt-1 truncate max-w-[220px]">{resA?.name}</h4>
              <p className="text-xs text-gray-500">{resA?.role}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white">{scoreA}%</span>
              <p className="text-[10px] text-gray-500 uppercase">ATS Score</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Matched Keywords ({skillsA.length})</p>
            <div className="flex flex-wrap gap-1">
              {skillsA.map(sk => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Target Card */}
        <Card className="p-6 border border-brand-blue/30 bg-brand-blue/[0.03] space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">Target Version</span>
                {resB?.isPrimary && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-brand-blue/20 text-brand-blue">
                    Active Primary
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white mt-1 truncate max-w-[220px]">{resB?.name}</h4>
              <p className="text-xs text-gray-400">{resB?.role}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400">{scoreB}%</span>
              <p className="text-[10px] text-gray-500 uppercase">ATS Score</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Newly Added Skills ({addedSkills.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {addedSkills.map(sk => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  + {sk}
                </span>
              ))}
              {skillsB.filter(s => !addedSkills.includes(s)).map(sk => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            {!resB?.isPrimary ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSetPrimary(resB.id);
                  toast.success(`Promoted ${resB.name} as Primary Active CV!`);
                }}
                className="text-xs w-full"
                icon={Check}
              >
                Promote as Primary Active CV
              </Button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Currently Active Primary for Campus Applications
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Dimension Breakdown Table */}
      <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Side-by-Side Dimension Comparison
        </h4>

        <div className="space-y-4 divide-y divide-white/[0.04]">
          {dimensions.map((dim, idx) => {
            const diff = dim.b - dim.a;
            return (
              <div key={idx} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 sm:w-1/3">
                  <p className="text-xs font-bold text-white">{dim.label}</p>
                  <p className="text-[10px] text-gray-500">
                    Difference: <span className={diff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diff >= 0 ? `+${diff}%` : `${diff}%`}
                    </span>
                  </p>
                </div>

                <div className="flex-1 flex items-center gap-6">
                  {/* Baseline Bar */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>v1: {resA?.name?.slice(0, 14)}...</span>
                      <span>{dim.a}%</span>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gray-400 h-full rounded-full" style={{ width: `${dim.a}%` }} />
                    </div>
                  </div>

                  {/* Target Bar */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-blue font-semibold">
                      <span>v2: {resB?.name?.slice(0, 14)}...</span>
                      <span className="text-emerald-400">{dim.b}%</span>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${dim.b}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
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
