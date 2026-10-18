import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../../store/studentStore';
import {
  Layers, Upload, FileText, Star, GitCompare, Trash2, ArrowRight,
  CheckCircle2, AlertCircle, Sparkles, Check, ShieldAlert, Clock,
  SearchCode, Swords, ArrowUpRight, Crown, Shield, TrendingUp,
  BarChart3, ChevronRight, Copy, ArrowLeftRight, ExternalLink, Download, Eye
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import FileUpload from '../../components/shared/FileUpload';
import toast from 'react-hot-toast';
import { resumeService } from '../../services/resumeService';

const formatUploadDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
};

export default function ResumeVault() {
  const [activeTab, setActiveTab] = useState('resumes');
  const [uploadSlot, setUploadSlot] = useState('primary');
  const navigate = useNavigate();

  const {
    resumes,
    fetchResumes,
    getSelectedResume,
    analyzeUploadedResume,
    analyzing,
    setSelectedResumeId,
    setAsPrimaryResume,
    setAsSecondaryResume,
    deleteResume
  } = useStudentStore();

  useEffect(() => {
    if (fetchResumes) {
      fetchResumes();
    }
  }, []);

  const handleFileUpload = async (file) => {
    try {
      toast.loading(`Uploading ${file.name} to Database & parsing with AI...`, { id: 'upload' });
      await analyzeUploadedResume(file, uploadSlot);
      toast.success(`Success! Saved to ${uploadSlot.toUpperCase()} slot and parsed.`, { id: 'upload' });
    } catch (err) {
      toast.error(`Upload error: ${err.message || 'Please check backend logs.'}`, { id: 'upload' });
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
              uploadSlot={uploadSlot}
              setUploadSlot={setUploadSlot}
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
function MyResumesTab({ resumes, onUpload, analyzing, onSelect, onSetPrimary, onSetSecondary, onDelete, onGoToAnalysis, uploadSlot, setUploadSlot }) {
  const primary = resumes.find(r => r.isPrimary || r.slot === 'primary');
  const secondary = resumes.find(r => r.slot === 'secondary' && !r.isPrimary);

  return (
    <div className="space-y-6">
      {/* Resume Slot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Slot */}
        <ResumeSlotCard
          label="Primary"
          sublabel="Used for campus placements & AI Mock Interviews"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Upload Real Resume (Database Storage)
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              PDF or DOCX format • Auto-parsed into MongoDB for AI Interviews & ATS Scoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Target Slot:</span>
            <div className="flex rounded-lg bg-[var(--bg-elevated)] p-0.5 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setUploadSlot('primary')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  uploadSlot === 'primary'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Primary Slot
              </button>
              <button
                type="button"
                onClick={() => setUploadSlot('secondary')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  uploadSlot === 'secondary'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Secondary Slot
              </button>
            </div>
          </div>
        </div>
        <FileUpload onFileSelect={onUpload} isAnalyzing={analyzing} />
      </Card>

      {/* Cloud Storage Notice */}
      <div className="glass-card p-4.5 border-l-4 border-cyan-500 bg-cyan-500/5 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-cyan-600 dark:text-cyan-400">Database Resume Storage</p>
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
          {resume.atsScore != null
            ? <AnimatedProgress value={resume.atsScore} type="circle" size={56} strokeWidth={5} />
            : <span className="text-lg font-bold text-gray-400">—</span>}
          <p className="text-[9px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>ATS</p>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Target Role</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{resume.role || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Uploaded</p>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{formatUploadDate(resume.uploadDate)}</p>
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
      <div className="pt-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: 'var(--border-faint)' }}>
        <div className="flex items-center gap-2.5">
          {resume.downloadUrl && (
            <a
              href={resume.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
              title="View resume (read-only)"
            >
              <Eye className="h-3 w-3" /> View
            </a>
          )}
          {resume.downloadUrl && (
            <a
              href={resume.downloadUrl.includes('cloudinary.com')
                ? resume.downloadUrl.replace('/upload/', '/upload/fl_attachment/')
                : resume.downloadUrl
              }
              download
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20"
              title="Download resume file"
            >
              <Download className="h-3 w-3" /> Download
            </a>
          )}
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
          {(
            <button
              onClick={async () => {
                try {
                  await onDelete();
                  toast.success(`Removed ${resume.name}`);
                } catch (error) {
                  toast.error(error.message || 'Could not remove this resume.');
                }
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

  const scoreA = resA?.atsScore ?? null;
  const scoreB = resB?.atsScore ?? null;
  const delta = scoreA != null && scoreB != null ? scoreB - scoreA : null;
  const parsedSkills = (resume) => Object.values(resume?.parsed_data?.skills || {})
    .filter(Array.isArray).flat().filter((skill, index, all) => all.indexOf(skill) === index);
  const skillsA = parsedSkills(resA);
  const skillsB = parsedSkills(resB);

  const addedSkills = skillsB.filter(s => !skillsA.some(sa => sa.toLowerCase() === s.toLowerCase()));
  const removedSkills = skillsA.filter(s => !skillsB.some(sb => sb.toLowerCase() === s.toLowerCase()));

  const dimensions = [
    { label: 'Skills', a: resA?.analysis?.sectionScores?.skills, b: resB?.analysis?.sectionScores?.skills },
    { label: 'Experience', a: resA?.analysis?.sectionScores?.experience, b: resB?.analysis?.sectionScores?.experience },
    { label: 'Education', a: resA?.analysis?.sectionScores?.education, b: resB?.analysis?.sectionScores?.education },
    { label: 'Formatting', a: resA?.analysis?.sectionScores?.formatting, b: resB?.analysis?.sectionScores?.formatting },
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
            <p className="text-xs text-gray-400">Compare only the ATS scores, section scores, and parsed skills saved for each upload.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            delta == null ? 'bg-white/[0.05] text-gray-400 border border-white/[0.08]' : delta >= 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {delta == null ? 'ATS score delta unavailable' : `${delta >= 0 ? '+' : ''}${delta} ATS points`}
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
                  {r.name} ({r.isPrimary ? 'Primary' : 'Secondary'} • {r.atsScore ?? '—'}%)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Uploaded {formatUploadDate(resA?.uploadDate)}
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
                  {r.name} ({r.isPrimary ? 'Primary' : 'Secondary'} • {r.atsScore ?? '—'}%)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Uploaded {formatUploadDate(resB?.uploadDate)}
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
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white">{scoreA == null ? '—' : `${scoreA}%`}</span>
              <p className="text-[10px] text-gray-500 uppercase">ATS Score</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Parsed Skills ({skillsA.length})</p>
            <div className="flex flex-wrap gap-1">
              {skillsA.map(sk => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                  {sk}
                </span>
              ))}
              {!skillsA.length && <span className="text-[10px] text-gray-500">No skills were parsed.</span>}
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
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400">{scoreB == null ? '—' : `${scoreB}%`}</span>
              <p className="text-[10px] text-gray-500 uppercase">ATS Score</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Skills Added in This Upload ({addedSkills.length})
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
              {!skillsB.length && <span className="text-[10px] text-gray-500">No skills were parsed.</span>}
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
            const diff = dim.a != null && dim.b != null ? dim.b - dim.a : null;
            return (
              <div key={idx} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 sm:w-1/3">
                  <p className="text-xs font-bold text-white">{dim.label}</p>
                  <p className="text-[10px] text-gray-500">
                    Difference: <span className={diff == null ? 'text-gray-500' : diff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {diff == null ? 'Unavailable' : `${diff >= 0 ? '+' : ''}${diff} points`}
                    </span>
                  </p>
                </div>

                <div className="flex-1 flex items-center gap-6">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>v1: {resA?.name?.slice(0, 14)}...</span>
                      <span>{dim.a == null ? '—' : `${dim.a}%`}</span>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gray-400 h-full rounded-full" style={{ width: `${dim.a ?? 0}%` }} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-cyan-400 font-semibold">
                      <span>v2: {resB?.name?.slice(0, 14)}...</span>
                      <span className="text-emerald-400">{dim.b == null ? '—' : `${dim.b}%`}</span>
                    </div>
                    <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${dim.b ?? 0}%` }} />
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const primary = resumes.find(r => r.isPrimary || r.slot === 'primary');
  const secondary = resumes.find(r => r.slot === 'secondary' && !r.isPrimary);
  const first = primary || resumes[0];
  const second = secondary || resumes.find(r => r.id !== first?.id);
  if (!first || !second) return <Card className="p-12 text-center space-y-3"><Swords className="h-10 w-10 mx-auto text-cyan-500/40"/><h3 className="text-lg font-bold text-white">Two uploaded resumes are required</h3><p className="text-sm text-gray-400">Add a second resume to compare both against the same job description.</p></Card>;
  const runComparison = async () => {
    if (jdText.trim().length < 30) return toast.error('Paste the full job description (at least 30 characters).');
    setLoading(true);
    try {
      const [a,b] = await Promise.all([resumeService.compareWithJobDescription(first.id,jdText.trim()),resumeService.compareWithJobDescription(second.id,jdText.trim())]);
      setResults({a:{...a,name:first.name,slot:first.slot},b:{...b,name:second.name,slot:second.slot}});
    } catch(error) { toast.error(error?.response?.data?.detail || error?.message || 'Could not compare resumes.'); }
    finally { setLoading(false); }
  };
  return <div className="space-y-6"><Card className="p-6 space-y-4"><div><h3 className="text-sm font-bold text-white">Compare resumes against a job description</h3><p className="text-xs text-gray-400 mt-1">Both saved resumes are analyzed by the backend NLP and semantic matching pipeline.</p></div><textarea value={jdText} onChange={e=>{setJdText(e.target.value);setResults(null);}} placeholder="Paste the actual job description here, including responsibilities and qualifications." rows={7} className="glass-input w-full rounded-xl p-3.5 text-xs resize-none text-white"/><div className="flex justify-between items-center"><p className="text-xs text-gray-400">{first.name} vs {second.name}</p><Button variant="primary" onClick={runComparison} disabled={loading}>{loading?'Comparing…':'Compare resumes'}</Button></div></Card>{results&&<div className="grid md:grid-cols-2 gap-5">{[['a',results.a],['b',results.b]].map(([key,value])=><Card key={key} className="p-5 space-y-4"><div><p className="text-[10px] uppercase text-gray-400">{value.slot} resume</p><h4 className="text-sm font-bold text-white truncate">{value.name}</h4></div><p className="text-sm text-gray-300">Skill coverage: <strong>{value.skill_coverage}%</strong> · Semantic similarity: <strong>{Math.round((value.semantic_similarity||0)*100)}%</strong></p>{[['Matched skills',value.matched_skills],['Partial matches',value.partial_skills],['Missing skills',value.missing_skills]].map(([label,items])=><section key={label}><p className="text-[10px] uppercase text-gray-400 mb-1">{label}</p><div className="flex flex-wrap gap-1">{items?.length?items.map(item=><Badge key={item} size="sm">{item}</Badge>):<span className="text-xs text-gray-500">None identified</span>}</div></section>)}<p className="text-[10px] text-gray-500">Semantic engine: {value.embedding_engine||'unavailable'}</p></Card>)}</div>}</div>;
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
                        {resume.role || 'Target role not specified'} • {formatUploadDate(resume.uploadDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-400">{resume.atsScore ?? resume.score ?? '—'}{resume.atsScore != null || resume.score != null ? '%' : ''}</span>
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
