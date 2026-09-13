import React, { useState } from 'react';
import { RESUME_GUIDE } from '../../data/resumeGuide';
import { Download, Eye, Sparkles, FileText, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function ResumeGuide() {
  const [activeSection, setActiveSection] = useState('templates');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const navItems = [
    { id: 'templates',  label: 'ATS Templates',     icon: '📄', desc: 'Download high-scoring CVs' },
    { id: 'structure',  label: 'Section Structure', icon: '🗂️', desc: 'What to include in each section' },
    { id: 'formatting', label: 'Formatting Rules',  icon: '📐', desc: 'Font, spacing & layout' },
    { id: 'ats',        label: 'ATS Checklist',     icon: '🤖', desc: 'Pass automated screening' },
    { id: 'online',     label: 'Online Presence',   icon: '🌐', desc: 'LinkedIn & GitHub tips' },
    { id: 'verbs',      label: 'Action Verbs',      icon: '⚡', desc: 'Strong bullet starters' },
    { id: 'quantify',   label: 'Quantify Impact',   icon: '📊', desc: 'Add metrics & numbers' },
    { id: 'summary',    label: 'Summary vs Objective', icon: '✍️', desc: 'Which one to use' },
    { id: 'mistakes',   label: 'Common Mistakes',   icon: '🚫', desc: 'Pitfalls to avoid' },
  ];

  const currentIdx = navItems.findIndex(n => n.id === activeSection);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Resume Architecture & Writing Guide
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Master the rules top candidates use to beat ATS parsers, impress recruiters, and download vetted CV templates.
          </p>
        </div>
        {activeSection !== 'templates' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveSection('templates')}
            icon={Download}
            className="text-xs self-start sm:self-auto"
          >
            ATS Templates
          </Button>
        )}
      </div>

      {/* ── Desktop: Horizontal card nav ── */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-9 gap-2">
        {navItems.map((n) => {
          const isActive = activeSection === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setActiveSection(n.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 text-center cursor-pointer ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-500/20'
                  : 'border-[var(--border-light)] bg-[var(--bg-surface)] hover:border-indigo-400 hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <span className="text-xl">{n.icon}</span>
              <span
                className={`text-xs font-semibold leading-tight ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-primary)]'
                }`}
              >
                {n.label}
              </span>
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? 'text-indigo-500/80 dark:text-indigo-300/80' : 'text-[var(--text-muted)]'
                }`}
              >
                {n.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: sticky scrollable pills */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-1 sm:hidden -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map(n => {
          const isActive = activeSection === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setActiveSection(n.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <span>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </div>

      {/* Prev/Next navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => currentIdx > 0 && setActiveSection(navItems[currentIdx - 1].id)}
          disabled={currentIdx === 0}
          className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          {currentIdx > 0 ? navItems[currentIdx - 1].label : 'Prev'}
        </button>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
          {currentIdx + 1} of {navItems.length}
        </span>
        <button
          onClick={() => currentIdx < navItems.length - 1 && setActiveSection(navItems[currentIdx + 1].id)}
          disabled={currentIdx === navItems.length - 1}
          className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {currentIdx < navItems.length - 1 ? navItems[currentIdx + 1].label : 'Next'}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* ── Active Tab Content ── */}
      <div className="transition-all duration-300">
        {activeSection === 'templates'  && <TemplatesSection onPreview={setPreviewTemplate} />}
        {activeSection === 'structure'  && <StructureSection />}
        {activeSection === 'formatting' && <FormattingSection />}
        {activeSection === 'ats'        && <ATSSection />}
        {activeSection === 'online'     && <OnlinePresenceSection />}
        {activeSection === 'verbs'      && <VerbsSection />}
        {activeSection === 'quantify'   && <QuantifySection />}
        {activeSection === 'summary'    && <SummaryVsObjectiveSection />}
        {activeSection === 'mistakes'   && <MistakesSection />}
      </div>

      {/* ── PDF Preview Modal ── */}
      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate ? `Preview: ${previewTemplate.title}` : 'Resume Preview'}
        size="2xl"
        footerActions={
          previewTemplate && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-400">
                Format: <span className="text-white font-medium">Standard ATS 1-Page PDF</span>
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <a href={previewTemplate.file} download={previewTemplate.downloadName}>
                  <Button variant="primary" size="sm" icon={Download}>
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          )
        }
      >
        {previewTemplate && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian-900 border border-white/[0.06] text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Score: <strong className="text-emerald-400">{previewTemplate.score}% ATS Compatibility</strong></span>
              </div>
              <a
                href={previewTemplate.file}
                target="_blank"
                rel="noreferrer"
                className="text-brand-blue hover:underline flex items-center gap-1 font-semibold"
              >
                Open in new tab <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="h-[62vh] w-full rounded-xl overflow-hidden border border-white/[0.08] bg-obsidian-950">
              <iframe
                src={`${previewTemplate.file}#toolbar=0`}
                className="w-full h-full"
                title={previewTemplate.title}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ── Section Structure ── */
function StructureSection() {
  const [open, setOpen] = useState(0);
  const sections = RESUME_GUIDE.sections;

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Every resume section explained — mandatory fields, expert dos & don'ts, and real-world good vs bad examples.
      </p>

      {/* Order guide */}
      <div className="glass-card p-4 sm:p-5">
        <div className="text-xs font-bold uppercase tracking-wider mb-3 text-indigo-500 dark:text-indigo-400">
          Recommended Section Order
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  s.required
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-light)] text-[var(--text-secondary)]'
                }`}
              >
                <span>{s.icon}</span>
                {s.name}
                {!s.required && <span className="text-[10px] opacity-70">(optional)</span>}
              </span>
              {i < sections.length - 1 && (
                <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section accordions */}
      <div className="space-y-3">
        {sections.map((s, i) => (
          <div key={s.id} className="glass-card overflow-hidden !rounded-2xl border" style={{ borderColor: 'var(--border-light)' }}>
            <div
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">{s.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {s.name}
                    </span>
                    {s.required ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                        Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--bg-elevated)] border border-[var(--border-faint)] text-[var(--text-muted)]">
                        Optional
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {s.what}
                  </div>
                </div>
              </div>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-90' : ''}`}
                style={{ color: 'var(--text-muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>

            {open === i && (
              <div className="border-t p-5 space-y-5" style={{ borderColor: 'var(--border-light)' }}>
                {/* Why */}
                {s.why && (
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5">
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      Why this matters
                    </div>
                    <p className="text-xs leading-relaxed text-indigo-900/90 dark:text-indigo-200/90">
                      {s.why}
                    </p>
                  </div>
                )}

                {/* Dos & Donts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center font-bold">✓</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Do</span>
                    </div>
                    <div className="space-y-1.5">
                      {s.dos.map((d, di) => (
                        <div key={di} className="flex items-start gap-2">
                          <span className="text-emerald-500 text-xs mt-0.5 flex-shrink-0">•</span>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-center font-bold">✗</span>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Don't</span>
                    </div>
                    <div className="space-y-1.5">
                      {s.donts.map((d, di) => (
                        <div key={di} className="flex items-start gap-2">
                          <span className="text-rose-500 text-xs mt-0.5 flex-shrink-0">•</span>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Good vs Bad example */}
                {s.example && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Real-World Comparison
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">✓ Strong Example</div>
                        <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">{s.example.good}</pre>
                      </div>
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">✗ Weak / Avoid</div>
                        <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-rose-900/90 dark:text-rose-200/90">{s.example.bad}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Formatting Rules ── */
function FormattingSection() {
  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
        Formatting principles that keep your resume clean for hiring managers and fully readable by ATS parsers.
      </p>
      {RESUME_GUIDE.formatting.map((f, i) => (
        <div key={i} className="glass-card p-4 sm:p-5 flex gap-4 items-start">
          <span className="text-2xl flex-shrink-0 p-2 rounded-xl bg-indigo-500/10">{f.icon}</span>
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{f.rule}</div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ATS Checklist ── */
function ATSSection() {
  const [checked, setChecked] = useState({});
  const items = RESUME_GUIDE.ats;
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Audit your resume against ATS criteria before uploading.
        </p>
        <span className={`text-sm font-bold ${doneCount === items.length ? 'text-emerald-500' : 'text-indigo-500'}`}>
          {doneCount}/{items.length} completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-light)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const isDone = !!checked[i];
          return (
            <div
              key={i}
              onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'glass-card hover:border-indigo-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                isDone
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-[var(--border-mid)] bg-[var(--bg-elevated)]'
              }`}>
                {isDone && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
              <div>
                <div className={`text-sm font-semibold ${isDone ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-85' : 'text-[var(--text-primary)]'}`}>
                  {item.check}
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {doneCount === items.length && (
        <div className="glass-card !border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
          <div className="text-3xl mb-1">🎉</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            Your resume complies with all core ATS rules! Upload it to analyze keyword match scores.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Online Presence ── */
function OnlinePresenceSection() {
  const { onlinePresence } = RESUME_GUIDE;
  const [activeTab, setActiveTab] = useState('linkedin');

  const tabs = [
    { id: 'linkedin', label: '💼 LinkedIn', data: onlinePresence.linkedin },
    { id: 'github',   label: '💻 GitHub',   data: onlinePresence.github },
    { id: 'portfolio', label: '🌐 Portfolio', data: onlinePresence.portfolio },
  ];

  return (
    <div className="space-y-4">
      <div className="glass-card !border-indigo-500/30 bg-indigo-500/10 p-4">
        <p className="text-xs sm:text-sm leading-relaxed text-indigo-900/90 dark:text-indigo-200/90">{onlinePresence.why}</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* LinkedIn */}
      {activeTab === 'linkedin' && (
        <div className="space-y-3">
          {onlinePresence.linkedin.sections.map((s, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.priority === 'Critical' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400' :
                  s.priority === 'High'     ? 'bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400' :
                                              'bg-[var(--bg-elevated)] border border-[var(--border-light)] text-[var(--text-muted)]'
                }`}>{s.priority}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.rule}</p>
              {s.goodExample && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">✓ Good Example</div>
                    <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90">{s.goodExample}</p>
                  </div>
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5">
                    <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mb-1">✗ Avoid</div>
                    <p className="text-xs text-rose-900/90 dark:text-rose-200/90">{s.badExample}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">Common LinkedIn Mistakes</div>
            <div className="space-y-1.5">
              {onlinePresence.linkedin.mistakes.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 text-xs mt-0.5 flex-shrink-0">✗</span>
                  <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GitHub */}
      {activeTab === 'github' && (
        <div className="space-y-3">
          {onlinePresence.github.sections.map((s, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.priority === 'Critical' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400' :
                  s.priority === 'High'     ? 'bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400' :
                                              'bg-[var(--bg-elevated)] border border-[var(--border-light)] text-[var(--text-muted)]'
                }`}>{s.priority}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.rule}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">Common GitHub Mistakes</div>
            <div className="space-y-1.5">
              {onlinePresence.github.mistakes.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 text-xs mt-0.5 flex-shrink-0">✗</span>
                  <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="glass-card p-5 space-y-3">
          <div className="text-2xl">{onlinePresence.portfolio.icon}</div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{onlinePresence.portfolio.title}</h3>
          <div className="space-y-2">
            <div>
              <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">When to include:</span>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>{onlinePresence.portfolio.when}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">What to highlight:</span>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>{onlinePresence.portfolio.what}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">💡 Pro Tip:</span>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed mt-0.5">{onlinePresence.portfolio.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Action Verbs ── */
function VerbsSection() {
  const [copied, setCopied] = useState(null);
  const { actionVerbs } = RESUME_GUIDE;

  const groups = [
    { key: 'built',    label: 'Built / Created',   badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20' },
    { key: 'improved', label: 'Improved / Fixed',  badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' },
    { key: 'led',      label: 'Led / Managed',     badge: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20' },
    { key: 'designed', label: 'Designed / Planned',badge: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20' },
    { key: 'tested',   label: 'Tested / Debugged', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20' },
    { key: 'created',  label: 'Created / Launched',badge: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20' },
  ];

  const copy = (verb) => {
    navigator.clipboard?.writeText(verb);
    setCopied(verb);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
        Start every accomplishment bullet with a high-impact action verb. Click any word to copy to clipboard.
      </p>
      {groups.map(g => (
        <div key={g.key} className="glass-card p-4">
          <div className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {g.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {actionVerbs[g.key]?.map(v => (
              <button
                key={v}
                onClick={() => copy(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${g.badge}`}
              >
                {copied === v ? '✓ Copied' : v}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Quantify Impact ── */
function QuantifySection() {
  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
        Transform vague duty descriptions into measurable achievements with concrete metrics.
      </p>
      <div className="space-y-3">
        {RESUME_GUIDE.quantifyTips.map((q, i) => (
          <div key={i} className="glass-card overflow-hidden !rounded-2xl border" style={{ borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border-b border-rose-500/20">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex-shrink-0">✗ Vague Duty</span>
              <p className="text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90">{q.weak}</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">✓ Quantified</span>
              <p className="text-xs sm:text-sm font-medium text-emerald-900/90 dark:text-emerald-200/90">{q.strong}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card !border-indigo-500/30 bg-indigo-500/10 p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
          Metrics You Can Estimate & Quantify in Academic/Personal Projects
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {['Active users / signups', 'API requests/sec', '% reduction in latency', '% decrease in bug count', 'Team size / sprints', 'Lines of boilerplate removed', 'Features delivered', 'Time saved (hrs/week)', 'DB query time (ms)', 'Unit test coverage %'].map((n, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-900/90 dark:text-indigo-200/90">
              <span className="text-indigo-500">→</span> {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Summary vs Objective ── */
function SummaryVsObjectiveSection() {
  const data = RESUME_GUIDE.summaryVsObjective;

  return (
    <div className="space-y-4">
      <div className="glass-card !border-indigo-500/30 bg-indigo-500/10 p-4">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">2026 Industry Consensus</div>
        <p className="text-xs sm:text-sm leading-relaxed font-medium text-indigo-900/90 dark:text-indigo-200/90">{data.verdict2026}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">✓ Use a Summary when:</div>
          <div className="space-y-1.5">
            {data.whenSummary.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 text-xs mt-0.5">•</span>
                <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">⚠ Use an Objective only when:</div>
          <div className="space-y-1.5">
            {data.whenObjective.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-500 text-xs mt-0.5">•</span>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          High-Converting Summary Formula for Freshers & Students
        </div>
        <p className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20 leading-relaxed">
          {data.summaryTemplateForFreshers}
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Strong Summary Examples</div>
        {data.examples.strong.map((ex, i) => (
          <div key={i} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
            <p className="text-xs leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">{ex}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Weak Objective Examples (Avoid)</div>
        {data.examples.weak.map((ex, i) => (
          <div key={i} className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
            <p className="text-xs leading-relaxed text-rose-900/90 dark:text-rose-200/90">{ex}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Common Mistakes ── */
function MistakesSection() {
  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
        The most frequent pitfalls that cause resumes to be discarded before human review — and their direct solutions.
      </p>
      {RESUME_GUIDE.commonMistakes.map((m, i) => (
        <div key={i} className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-black flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{m.mistake}</span>
          </div>
          <div className="flex items-start gap-2 pl-8">
            <span className="text-emerald-500 text-xs flex-shrink-0 mt-0.5 font-bold">Fix →</span>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.fix}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Download High-Scoring ATS Templates Section ── */
function TemplatesSection({ onPreview }) {
  const templates = [
    {
      id: 'sde',
      title: 'Full-Stack & Software Engineer ATS Template',
      role: 'Tech & Engineering',
      score: 98,
      pages: '1 Page',
      badgeVariant: 'teal',
      description: 'Engineered for software roles with Google XYZ impact metrics, clean single-column structure, and dedicated technical skills breakdown.',
      file: '/samples/software_engineer_ats_template.pdf',
      downloadName: 'Software_Engineer_ATS_Template.pdf',
      highlights: ['Google XYZ bullet format', 'Zero table/graphic parsing errors', '98% ATS pass score'],
      tags: ['React / Node', 'Python', 'System Design', 'Cloud / AWS']
    },
    {
      id: 'data',
      title: 'Data Analyst & Python / SQL ATS Template',
      role: 'Data & Analytics',
      score: 96,
      pages: '1 Page',
      badgeVariant: 'blue',
      description: 'Focused on quantitative business impact, data pipeline projects, machine learning deliverables, and statistical analysis tools.',
      file: '/samples/data_analyst_ats_template.pdf',
      downloadName: 'Data_Analyst_ATS_Template.pdf',
      highlights: ['Quantified business KPIs', 'Structured SQL & BI sections', 'Clean chronological order'],
      tags: ['SQL', 'Python', 'Tableau / PowerBI', 'ETL Pipelines']
    },
    {
      id: 'fresher',
      title: 'Fresher & Campus Placement ATS Template',
      role: 'Entry-Level & College',
      score: 95,
      pages: '1 Page',
      badgeVariant: 'violet',
      description: 'Ideal for undergraduates and college freshers with highlighted capstone projects, coding profiles, hackathons, and foundational coursework.',
      file: '/samples/fresher_entry_level_template.pdf',
      downloadName: 'Fresher_Placement_ATS_Template.pdf',
      highlights: ['Academic & project balance', 'LeetCode/GitHub highlight links', 'Optimized for campus drives'],
      tags: ['B.Tech / MCA', 'DSA & OOPs', 'Internship Ready', 'Campus Placement']
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner for Templates */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              Verified ATS Compliant
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Parser Compatible
            </span>
          </div>
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">
            Download High-Scoring ATS Templates
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            Curated and battle-tested single-column resume templates designed to breeze through Workday, Taleo, Greenhouse, and Lever ATS parsers. Preview in-browser or download clean PDF templates directly.
          </p>
        </div>
      </div>

      {/* Grid of 3 Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="glass-card flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10 group"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    {tpl.score}% ATS Score
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{tpl.pages} · Standard PDF</p>
                </div>
              </div>

              {/* Title & Role */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  {tpl.role}
                </span>
                <h3 className="text-base font-bold text-white font-heading mt-0.5 leading-snug">
                  {tpl.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                {tpl.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tpl.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-gray-300 border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-5 mt-5 border-t border-white/[0.06]">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                icon={Eye}
                onClick={() => onPreview(tpl)}
              >
                Preview
              </Button>
              <a
                href={tpl.file}
                download={tpl.downloadName}
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  icon={Download}
                >
                  Download
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
