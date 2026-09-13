import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../../store/studentStore';
import {
  Layers, Upload, FileText, Star, GitCompare, Trash2, ArrowRight,
  CheckCircle2, AlertCircle, Sparkles, Check, ShieldAlert, Clock,
  SearchCode, Swords, ArrowUpRight, Crown, Shield, TrendingUp,
  BarChart3, ChevronRight, Copy, ArrowLeftRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import FileUpload from '../../components/shared/FileUpload';
import toast from 'react-hot-toast';

export default function ResumeVault() {
  const [activeTab, setActiveTab] = useState('resumes');
  const navigate = useNavigate();

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

  const handleFileUpload = async (file) => {
    try {
      toast.loading(`Analyzing ${file.name} with AI parser...`, { id: 'upload' });
      await analyzeUploadedResume(file.name);
      toast.success('Analysis complete! Resume added to your vault.', { id: 'upload' });
    } catch (err) {
      toast.error('Failed parsing file. Please try again.', { id: 'upload' });
    }
  };

  const tabs = [
    { id: 'resumes',  label: 'My Resumes',  icon: Layers,     desc: 'Primary & Secondary slots' },
    { id: 'compare',  label: 'Compare',      icon: GitCompare, desc: 'Side-by-side ATS diff' },
    { id: 'jdbattle', label: 'JD Battle',    icon: Swords,     desc: 'Which CV wins the JD?' },
    { id: 'history',  label: 'History',       icon: Clock,      desc: 'Upload timeline' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Resume Vault
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Upload, manage, compare, and battle-test your resumes against job descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="glass px-3 py-1.5 rounded-lg text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {resumes.length}/2 Slots Used
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/analysis')}
            icon={BarChart3}
          >
            Deep Audit
          </Button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                isActive
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-sm'
                  : 'glass hover:border-cyan-400/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-600 text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-[var(--text-primary)]'}`}>
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

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {activeTab === 'resumes' && (
            <MyResumesTab
              resumes={resumes}
              onUpload={handleFileUpload}
              analyzing={analyzing}
              onSelect={setSelectedResumeId}
              onSetPrimary={setAsPrimaryResume}
              onSetSecondary={setAsSecondaryResume}
              onDelete={deleteResume}
              onGoToAnalysis={(id) => {
                setSelectedResumeId(id);
                navigate('/student/analysis');
              }}
            />
          )}
          {activeTab === 'compare' && (
            <CompareTab
              resumes={resumes}
              onSetPrimary={setAsPrimaryResume}
            />
          )}
          {activeTab === 'jdbattle' && (
            <JdBattleTab resumes={resumes} />
          )}
          {activeTab === 'history' && (
            <HistoryTab resumes={resumes} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   TAB 1: MY RESUMES — Slot Cards + Upload
══════════════════════════════════════════════════════════════════ */
function MyResumesTab({ resumes, onUpload, analyzing, onSelect, onSetPrimary, onSetSecondary, onDelete, onGoToAnalysis }) {
  const primary = resumes.find(r => r.isPrimary || r.slot === 'primary');
  const secondary = resumes.find(r => r.slot === 'secondary' && !r.isPrimary);

  return (
    <div className="space-y-6">
      {/* Resume Slot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Slot */}
        <ResumeSlotCard
          label="Primary"
          sublabel="Used for campus placements & main applications"
          resume={primary}
          accentColor="cyan"
          icon={Crown}
          onAudit={() => primary && onGoToAnalysis(primary.id)}
          onDelete={() => primary && onDelete(primary.id)}
          resumes={resumes}
          isEmpty={!primary}
        />

        {/* Secondary Slot */}
        <ResumeSlotCard
          label="Secondary"
          sublabel="For specialized roles & backup applications"
          resume={secondary}
          accentColor="amber"
          icon={Shield}
          onAudit={() => secondary && onGoToAnalysis(secondary.id)}
          onPromote={() => secondary && onSetPrimary(secondary.id)}
          onDelete={() => secondary && onDelete(secondary.id)}
          resumes={resumes}
          isEmpty={!secondary}
        />
      </div>

      {/* Upload Zone */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Upload New Resume
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              PDF or DOCX format • Max 10MB per file
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {resumes.length}/2 Used
          </span>
        </div>
        <FileUpload onFileSelect={onUpload} isAnalyzing={analyzing} />
      </Card>

      {/* Cloud Storage Notice */}
      <div className="glass-card p-4.5 border-l-4 border-cyan-500 bg-cyan-500/5 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-cyan-600 dark:text-cyan-400">Cloud Resume Storage (Cloudinary)</p>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your <strong>Primary</strong> and <strong>Secondary</strong> resumes are stored securely in the cloud.
            Upload a new version, compare it against your existing CVs, then promote it when you're ready.
            Use the <strong>JD Battle</strong> tab to test which resume scores better for a specific job posting.
          </p>
        </div>
      </div>
    </div>
  );
}


/* ── Resume Slot Card Component ── */
function ResumeSlotCard({ label, sublabel, resume, accentColor, icon: Icon, onAudit, onPromote, onDelete, resumes, isEmpty }) {
  const colors = {
    cyan: {
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-500/[0.04]',
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: '0 0 30px rgba(6,182,212,0.08)',
      iconBg: 'bg-cyan-600',
      text: 'text-cyan-400'
    },
    amber: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/[0.04]',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      glow: '0 0 30px rgba(245,158,11,0.08)',
      iconBg: 'bg-amber-600',
      text: 'text-amber-400'
    }
  };
  const c = colors[accentColor] || colors.cyan;

  if (isEmpty) {
    return (
      <Card className={`p-6 border ${c.border} ${c.bg} min-h-[200px] flex flex-col items-center justify-center text-center space-y-3`}
        style={{ boxShadow: c.glow }}
      >
        <div className={`p-3 rounded-xl ${c.iconBg} text-white/80`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{label} Slot — Empty</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{sublabel}</p>
        </div>
        <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
          Upload a resume below to fill this slot
        </p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 border ${c.border} ${c.bg} space-y-4 relative overflow-hidden`}
      style={{ boxShadow: c.glow }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${c.iconBg} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
                {label} Resume
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${c.badge}`}>
                {resume.version || 'v1.0'}
              </span>
            </div>
            <p className="text-xs font-bold mt-0.5 truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
              {resume.name}
            </p>
          </div>
        </div>

        {/* Score Ring */}
        <div className="text-center">
          <AnimatedProgress value={resume.atsScore || resume.score} type="circle" size={56} strokeWidth={5} />
          <p className="text-[9px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>ATS</p>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Target Role</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{resume.role || 'Software Engineer'}</p>
        </div>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Uploaded</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{new Date(resume.uploadDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Keywords Preview */}
      <div className="pt-2 border-t" style={{ borderColor: 'var(--border-faint)' }}>
        <p className="text-[10px] font-semibold mb-1.5" style={{ color: 'var(--text-faint)' }}>
          Top Keywords ({resume.analysis?.keywords?.matched?.length || 0} matched)
        </p>
        <div className="flex flex-wrap gap-1">
          {(resume.analysis?.keywords?.matched || []).slice(0, 5).map(sk => (
            <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {sk}
            </span>
          ))}
          {(resume.analysis?.keywords?.matched?.length || 0) > 5 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-500">
              +{resume.analysis.keywords.matched.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-faint)' }}>
        <div className="flex items-center gap-2">
          {onPromote && (
            <button
              onClick={() => {
                onPromote();
                toast.success(`Promoted ${resume.name} to Primary!`);
              }}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
            >
              <ArrowUpRight className="h-3 w-3" /> Promote
            </button>
          )}
          {resumes.length > 1 && (
            <button
              onClick={() => {
                onDelete();
                toast.success(`Removed ${resume.name}`);
              }}
              className="text-[11px] text-gray-500 hover:text-rose-400 cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
        <button
          onClick={onAudit}
          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
        >
          Deep Audit <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </Card>
  );
}


/* ══════════════════════════════════════════════════════════════════
   TAB 2: COMPARE — Side-by-Side ATS Delta
══════════════════════════════════════════════════════════════════ */
function CompareTab({ resumes, onSetPrimary }) {
  const [v1Id, setV1Id] = useState(resumes.find(r => r.slot === 'secondary')?.id || resumes[1]?.id || resumes[0]?.id);
  const [v2Id, setV2Id] = useState(resumes.find(r => r.isPrimary || r.slot === 'primary')?.id || resumes[0]?.id);

  const resA = resumes.find(r => r.id === v1Id) || resumes[0];
  const resB = resumes.find(r => r.id === v2Id) || resumes[1] || resumes[0];

  if (resumes.length < 2) {
    return (
      <Card className="p-12 text-center space-y-4 flex flex-col items-center">
        <GitCompare className="h-12 w-12 text-cyan-500/30" />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Need 2 Resumes to Compare</h3>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
          Upload a second resume in the "My Resumes" tab to unlock side-by-side comparison.
        </p>
      </Card>
    );
  }

  const scoreA = resA?.atsScore || resA?.score || 70;
  const scoreB = resB?.atsScore || resB?.score || 85;
  const delta = scoreB - scoreA;

  const skillsA = resA?.analysis?.keywords?.matched || ['Node.js', 'SQL', 'Python', 'REST APIs', 'Git'];
  const skillsB = resB?.analysis?.keywords?.matched || ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile', 'Zustand', 'TailwindCSS'];

  const addedSkills = skillsB.filter(s => !skillsA.some(sa => sa.toLowerCase() === s.toLowerCase()));
  const removedSkills = skillsA.filter(s => !skillsB.some(sb => sb.toLowerCase() === s.toLowerCase()));

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
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Version Comparison Engine
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Compare Any Two Resumes</h3>
            <p className="text-xs text-gray-400">
              Select your baseline and target to inspect score gains and keyword differences.
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            delta >= 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {delta >= 0 ? `+${delta} ATS Points Delta` : `${delta} ATS Points Delta`}
          </span>
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
              className="w-full bg-obsidian-950 border border-white/[0.08] text-xs text-gray-200 rounded-xl p-3 focus:outline-none focus:border-cyan-500"
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
              className="w-full bg-obsidian-950 border border-white/[0.08] text-xs text-gray-200 rounded-xl p-3 focus:outline-none focus:border-cyan-500"
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

      {/* Score Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline */}
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

          {removedSkills.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
              <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Unique to this version ({removedSkills.length})</p>
              <div className="flex flex-wrap gap-1">
                {removedSkills.map(sk => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Target */}
        <Card className="p-6 border border-cyan-500/30 bg-cyan-500/[0.03] space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Target Version</span>
                {resB?.isPrimary && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
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

      {/* Dimension Breakdown */}
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
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>v1: {resA?.name?.slice(0, 14)}...</span>
                      <span>{dim.a}%</span>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gray-400 h-full rounded-full" style={{ width: `${dim.a}%` }} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-cyan-400 font-semibold">
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
   TAB 3: JD BATTLE — Compare Both CVs Against the Same JD
══════════════════════════════════════════════════════════════════ */
function JdBattleTab({ resumes }) {
  const [jdText, setJdText] = useState('');
  const [battling, setBattling] = useState(false);
  const [results, setResults] = useState(null);

  const primary = resumes.find(r => r.isPrimary || r.slot === 'primary');
  const secondary = resumes.find(r => r.slot === 'secondary' && !r.isPrimary);

  if (resumes.length < 2) {
    return (
      <Card className="p-12 text-center space-y-4 flex flex-col items-center">
        <Swords className="h-12 w-12 text-cyan-500/30" />
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Need 2 Resumes for JD Battle</h3>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
          Upload a second resume to battle-test which CV scores higher against a job description.
        </p>
      </Card>
    );
  }

  const resA = primary || resumes[0];
  const resB = secondary || resumes[1];

  const handleBattle = async () => {
    if (!jdText.trim()) {
      toast.error('Paste a job description to start the battle.');
      return;
    }
    setBattling(true);
    toast.loading('Scanning JD keywords against both resumes...', { id: 'battle' });
    await new Promise(r => setTimeout(r, 1800));

    const textLower = jdText.toLowerCase();
    const jdKeywords = ['react', 'node.js', 'typescript', 'docker', 'aws', 'graphql', 'redis', 'sql', 'python', 'kubernetes', 'ci/cd', 'tailwind', 'javascript', 'rest', 'api', 'git', 'agile', 'mongodb', 'postgresql', 'zustand', 'redux', 'express', 'jest', 'testing'];

    const jdFound = jdKeywords.filter(k => textLower.includes(k));

    const matchResume = (res) => {
      const resumeSkills = (res?.analysis?.keywords?.matched || []).map(s => s.toLowerCase());
      const matched = jdFound.filter(k => resumeSkills.some(rs => rs.includes(k)));
      const missing = jdFound.filter(k => !matched.includes(k));
      const score = jdFound.length > 0
        ? Math.min(98, Math.max(35, Math.round((matched.length / jdFound.length) * 100)))
        : 50;
      return { matched, missing, score };
    };

    const resultA = matchResume(resA);
    const resultB = matchResume(resB);

    setResults({
      jdKeywordsCount: jdFound.length,
      a: { ...resultA, name: resA.name, role: resA.role, slot: resA.isPrimary ? 'Primary' : 'Secondary' },
      b: { ...resultB, name: resB.name, role: resB.role, slot: resB.isPrimary ? 'Primary' : resB.slot === 'secondary' ? 'Secondary' : 'Draft' },
      winner: resultA.score >= resultB.score ? 'a' : 'b',
      delta: Math.abs(resultA.score - resultB.score)
    });

    setBattling(false);
    toast.success('Battle complete! See which resume wins.', { id: 'battle' });
  };

  return (
    <div className="space-y-6">
      {/* JD Input */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                JD Battle Arena
              </h3>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Paste a job description — see which resume scores higher against the same requirements.
            </p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {['Full Stack Developer', 'Frontend Engineer', 'Backend Developer'].map(preset => (
              <button
                key={preset}
                onClick={() => {
                  setJdText(`We are looking for an exceptional ${preset} to join our team. Required skills: React, TypeScript, Node.js, REST APIs, SQL, Docker, AWS cloud deployment, Git, Agile methodologies, and CI/CD pipelines. Experience with Redis, GraphQL, and Kubernetes is a plus.`);
                  setResults(null);
                }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-[var(--border-light)] bg-[var(--bg-elevated)] hover:border-cyan-400 cursor-pointer whitespace-nowrap"
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
          rows={6}
          className="glass-input w-full rounded-xl p-3.5 text-xs resize-none"
          style={{ color: 'var(--text-primary)' }}
        />

        <div className="flex items-center justify-between">
          <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            Comparing: <strong className="text-cyan-400">{resA.name}</strong> vs <strong className="text-amber-400">{resB.name}</strong>
          </p>
          <Button
            variant="primary"
            onClick={handleBattle}
            disabled={battling}
            icon={Swords}
          >
            {battling ? 'Analyzing Both CVs...' : 'Start Battle'}
          </Button>
        </div>
      </Card>

      {/* Battle Results */}
      {results && (
        <div className="space-y-6">
          {/* Winner Banner */}
          <Card className={`p-5 border-2 ${results.winner === 'a' ? 'border-cyan-500/50 bg-cyan-500/[0.04]' : 'border-amber-500/50 bg-amber-500/[0.04]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${results.winner === 'a' ? 'bg-cyan-600' : 'bg-amber-600'} text-white`}>
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">🏆 Winner</p>
                  <p className="text-base font-bold text-white">{results.winner === 'a' ? results.a.name : results.b.name}</p>
                  <p className="text-xs text-gray-400">{results.winner === 'a' ? results.a.slot : results.b.slot} • {results.winner === 'a' ? results.a.role : results.b.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-emerald-400">
                  {results.winner === 'a' ? results.a.score : results.b.score}%
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold">
                  +{results.delta} points ahead
                </p>
              </div>
            </div>
          </Card>

          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BattleResultCard
              result={results.a}
              isWinner={results.winner === 'a'}
              accentColor="cyan"
              jdKeywordsCount={results.jdKeywordsCount}
            />
            <BattleResultCard
              result={results.b}
              isWinner={results.winner === 'b'}
              accentColor="amber"
              jdKeywordsCount={results.jdKeywordsCount}
            />
          </div>

          {/* Insight */}
          <Card className="p-4 border-l-4 border-cyan-500 bg-cyan-500/5">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-cyan-400">Battle Insight</p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {results.winner === 'a' ? results.a.name : results.b.name} matched <strong>{Math.max(results.a.matched.length, results.b.matched.length)}</strong> out of {results.jdKeywordsCount} JD keywords.
                  The losing resume is missing: <strong className="text-rose-400">
                    {(results.winner === 'a' ? results.b.missing : results.a.missing).slice(0, 4).join(', ')}
                  </strong>. Consider adding these keywords to improve alignment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!results && (
        <Card className="p-12 text-center space-y-3 flex flex-col items-center">
          <Swords className="h-10 w-10 text-cyan-500/25" />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No Battle Run Yet</p>
          <p className="text-xs max-w-sm" style={{ color: 'var(--text-muted)' }}>
            Paste a target job description above and hit "Start Battle" to see which of your resumes is the better match.
          </p>
        </Card>
      )}
    </div>
  );
}


/* ── Battle Result Card ── */
function BattleResultCard({ result, isWinner, accentColor, jdKeywordsCount }) {
  const borderColor = accentColor === 'cyan' ? 'border-cyan-500/30' : 'border-amber-500/30';
  const bgColor = accentColor === 'cyan' ? 'bg-cyan-500/[0.03]' : 'bg-amber-500/[0.03]';
  const textColor = accentColor === 'cyan' ? 'text-cyan-400' : 'text-amber-400';

  return (
    <Card className={`p-6 border ${borderColor} ${bgColor} space-y-4 relative`}>
      {isWinner && (
        <div className="absolute top-3 right-3">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            🏆 WINNER
          </span>
        </div>
      )}

      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{result.slot} Resume</p>
        <h4 className="text-sm font-bold text-white mt-0.5 truncate">{result.name}</h4>
        <p className="text-xs text-gray-500">{result.role}</p>
      </div>

      <div className="text-center py-3">
        <p className={`text-4xl font-extrabold ${isWinner ? 'text-emerald-400' : 'text-gray-300'}`}>
          {result.score}%
        </p>
        <p className="text-[10px] text-gray-500 mt-1">JD Match Score</p>
      </div>

      {/* Matched */}
      <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
        <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> Matched ({result.matched.length}/{jdKeywordsCount})
        </p>
        <div className="flex flex-wrap gap-1">
          {result.matched.map((m, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Missing */}
      <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
        <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> Missing ({result.missing.length})
        </p>
        <div className="flex flex-wrap gap-1">
          {result.missing.slice(0, 6).map((m, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {m}
            </span>
          ))}
          {result.missing.length > 6 && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-500">+{result.missing.length - 6}</span>
          )}
        </div>
      </div>
    </Card>
  );
}


/* ══════════════════════════════════════════════════════════════════
   TAB 4: HISTORY — Upload Timeline with Score Trends
══════════════════════════════════════════════════════════════════ */
function HistoryTab({ resumes }) {
  const sortedResumes = [...resumes].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-2">
        <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
          Upload History & Score Trends
        </h3>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Track how your resume scores have improved over time.
        </p>
      </Card>

      {/* Timeline */}
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-white/[0.06]" />

        <div className="space-y-6">
          {sortedResumes.map((resume) => {
            const isPrimary = resume.isPrimary || resume.slot === 'primary';
            const isSecondary = resume.slot === 'secondary';

            return (
              <div key={resume.id} className="relative">
                <div className={`absolute -left-6 top-3 h-[22px] w-[22px] rounded-full border-2 flex items-center justify-center text-[10px] ${
                  isPrimary
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : isSecondary
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-gray-600 bg-gray-600/20 text-gray-400'
                }`}>
                  {isPrimary ? '★' : isSecondary ? '◆' : '●'}
                </div>

                <Card className="p-5 ml-2 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {isPrimary ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            ★ Primary Active
                          </span>
                        ) : isSecondary ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Secondary Backup
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/[0.05] text-gray-400">
                            {resume.version || 'Draft'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{resume.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {resume.role || 'Software Engineer'} • {new Date(resume.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-400">{resume.atsScore || resume.score}%</span>
                      <p className="text-[9px] text-gray-500">ATS Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-faint)' }}>
                    {(resume.dimensions || []).slice(0, 3).map((dim, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[9px] truncate" style={{ color: 'var(--text-faint)' }}>{dim.label}</p>
                        <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <p className="text-[9px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{dim.score}%</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {sortedResumes.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="h-10 w-10 mx-auto text-gray-600 mb-3" />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No Resumes Uploaded Yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Upload your first resume to start tracking your progress.
          </p>
        </Card>
      )}
    </div>
  );
}
