import { useState } from 'react';
import { RESUME_GUIDE } from '../../data/resumeGuide';

export default function ResumeGuide() {
  const [activeSection, setActiveSection] = useState('structure');

  const navItems = [
    { id: 'structure',  label: 'Section Structure', icon: '🗂️', desc: 'What to include in each section' },
    { id: 'formatting', label: 'Formatting Rules',  icon: '📐', desc: 'Font, spacing & layout' },
    { id: 'ats',        label: 'ATS Checklist',     icon: '🤖', desc: 'Pass automated screening' },
    { id: 'verbs',      label: 'Action Verbs',      icon: '⚡', desc: 'Strong bullet starters' },
    { id: 'quantify',   label: 'Quantify Impact',   icon: '📊', desc: 'Add metrics & numbers' },
    { id: 'mistakes',   label: 'Common Mistakes',   icon: '🚫', desc: 'Pitfalls to avoid' },
  ];

  const currentIdx = navItems.findIndex(n => n.id === activeSection);

  return (
    <div className="space-y-4">

      {/* ── Desktop: Horizontal card nav / Mobile: Scrollable pills ── */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-6 gap-2">
        {navItems.map((n, i) => (
          <button key={n.id} onClick={() => setActiveSection(n.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center
              ${activeSection === n.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm shadow-indigo-500/10'
                : 'border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}>
            <span className="text-xl">{n.icon}</span>
            <span className={`text-xs font-semibold leading-tight ${
              activeSection === n.id
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-[#07090f] dark:text-[#F0F2FF]'
            }`}>{n.label}</span>
            <span className={`text-[10px] leading-tight ${
              activeSection === n.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-[#8890A8]'
            }`}>{n.desc}</span>
          </button>
        ))}
      </div>

      {/* Mobile: sticky scrollable pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 sm:hidden -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setActiveSection(n.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 whitespace-nowrap ${
              activeSection === n.id
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-[#F0F2FF] dark:bg-[#1a1a2e] text-[#3d4468] dark:text-[#8890A8] hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
            }`}>
            <span>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>

      {/* Prev/Next navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => currentIdx > 0 && setActiveSection(navItems[currentIdx - 1].id)}
          disabled={currentIdx === 0}
          className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          {currentIdx > 0 ? navItems[currentIdx - 1].label : 'Prev'}
        </button>
        <span className="text-[10px] text-[#8890A8]">{currentIdx + 1} / {navItems.length}</span>
        <button
          onClick={() => currentIdx < navItems.length - 1 && setActiveSection(navItems[currentIdx + 1].id)}
          disabled={currentIdx === navItems.length - 1}
          className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {currentIdx < navItems.length - 1 ? navItems[currentIdx + 1].label : 'Next'}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {activeSection === 'structure'  && <StructureSection />}
      {activeSection === 'formatting' && <FormattingSection />}
      {activeSection === 'ats'        && <ATSSection />}
      {activeSection === 'verbs'      && <VerbsSection />}
      {activeSection === 'quantify'   && <QuantifySection />}
      {activeSection === 'mistakes'   && <MistakesSection />}
    </div>
  );
}

/* ── Section Structure ── */
function StructureSection() {
  const [open, setOpen] = useState(0);
  const sections = RESUME_GUIDE.sections;

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
        Every section explained — what to include, dos, don'ts, and a good vs bad example.
      </p>

      {/* Order guide */}
      <div className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3d4468] dark:text-[#6b7080] mb-3">Recommended Section Order</div>
        <div className="flex flex-wrap gap-2 items-center">
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                s.required
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-[#F0F2FF] dark:bg-[#1a1a2e] border-[#E2E6F0] dark:border-[#272A38] text-[#3d4468] dark:text-[#8890A8]'
              }`}>
                <span>{s.icon}</span>
                {s.name}
                {!s.required && <span className="text-[10px] opacity-70">(optional)</span>}
              </span>
              {i < sections.length - 1 && (
                <svg className="w-3 h-3 text-[#8890A8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section accordions */}
      {sections.map((s, i) => (
        <div key={s.id} className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] overflow-hidden">
          <div
            onClick={() => setOpen(open === i ? null : i)}
            className="flex items-center justify-between p-4 cursor-pointer
                       bg-[#F8F9FF] dark:bg-[#13131f] hover:bg-[#F0F2FF] dark:hover:bg-[#1a1a2e] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#07090f] dark:text-[#F0F2FF]">{s.name}</span>
                  {s.required
                    ? <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">Required</span>
                    : <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F2FF] dark:bg-[#1a1a2e] text-[#8890A8]">Optional</span>
                  }
                </div>
                <div className="text-xs text-[#3d4468] dark:text-[#8890A8] mt-0.5">{s.what}</div>
              </div>
            </div>
            <svg className={`w-4 h-4 text-[#8890A8] flex-shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </div>

          {open === i && (
            <div className="border-t border-[#E2E6F0] dark:border-[#272A38] p-5 space-y-5">

              {/* Dos & Donts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center font-bold">✓</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Do</span>
                  </div>
                  <div className="space-y-1.5">
                    {s.dos.map((d, di) => (
                      <div key={di} className="flex items-start gap-2">
                        <span className="text-emerald-500 text-xs mt-1 flex-shrink-0">•</span>
                        <p className="text-xs text-[#1e2340] dark:text-[#c8cce0] leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-center font-bold">✗</span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Don't</span>
                  </div>
                  <div className="space-y-1.5">
                    {s.donts.map((d, di) => (
                      <div key={di} className="flex items-start gap-2">
                        <span className="text-red-500 text-xs mt-1 flex-shrink-0">•</span>
                        <p className="text-xs text-[#1e2340] dark:text-[#c8cce0] leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Good vs Bad example */}
              {s.example && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#3d4468] dark:text-[#6b7080]">Example</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 p-3">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">✓ Good</div>
                      <pre className="text-xs text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap font-sans leading-relaxed">{s.example.good}</pre>
                    </div>
                    <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-3">
                      <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">✗ Bad</div>
                      <pre className="text-xs text-red-800 dark:text-red-300 whitespace-pre-wrap font-sans leading-relaxed">{s.example.bad}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Formatting Rules ── */
function FormattingSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
        Formatting rules that affect both human readers and ATS parsers.
      </p>
      {RESUME_GUIDE.formatting.map((f, i) => (
        <div key={i} className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#13131f] p-4 flex gap-4">
          <span className="text-2xl flex-shrink-0">{f.icon}</span>
          <div>
            <div className="text-sm font-semibold text-[#07090f] dark:text-[#F0F2FF] mb-1">{f.rule}</div>
            <p className="text-sm text-[#3d4468] dark:text-[#8890A8] leading-relaxed">{f.detail}</p>
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
        <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
          Go through each point and check off what your resume already does.
        </p>
        <span className={`text-sm font-bold ${doneCount === items.length ? 'text-emerald-500' : 'text-indigo-500'}`}>
          {doneCount}/{items.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[#E2E6F0] dark:bg-[#272A38] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
            className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
              checked[i]
                ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#13131f] hover:border-indigo-300'
            }`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
              checked[i]
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-[#C0C8D8] dark:border-[#3d4468]'
            }`}>
              {checked[i] && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            <div>
              <div className={`text-sm font-semibold ${checked[i] ? 'text-emerald-700 dark:text-emerald-300 line-through opacity-75' : 'text-[#07090f] dark:text-[#F0F2FF]'}`}>
                {item.check}
              </div>
              <p className="text-xs text-[#3d4468] dark:text-[#8890A8] mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {doneCount === items.length && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Your resume is ATS-ready! Upload it above for a full score.
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
    { key: 'built',    label: 'Built / Created',   color: 'indigo' },
    { key: 'improved', label: 'Improved / Fixed',  color: 'emerald' },
    { key: 'led',      label: 'Led / Managed',     color: 'amber' },
    { key: 'designed', label: 'Designed / Planned',color: 'purple' },
  ];

  const colorMap = {
    indigo:  'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    amber:   'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40',
    purple:  'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40',
  };

  const copy = (verb) => {
    navigator.clipboard?.writeText(verb);
    setCopied(verb);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
        Every bullet point in your resume should start with one of these. Click to copy.
      </p>
      {groups.map(g => (
        <div key={g.key}>
          <div className="text-xs font-semibold uppercase tracking-wide text-[#3d4468] dark:text-[#6b7080] mb-2">{g.label}</div>
          <div className="flex flex-wrap gap-2">
            {actionVerbs[g.key].map(v => (
              <button
                key={v}
                onClick={() => copy(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${colorMap[g.color]}`}>
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
      <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
        The single biggest upgrade you can make to your resume bullets — add a number.
      </p>
      <div className="space-y-3">
        {RESUME_GUIDE.quantifyTips.map((q, i) => (
          <div key={i} className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
              <span className="text-xs font-bold text-red-500 flex-shrink-0">✗ Weak</span>
              <p className="text-sm text-red-700 dark:text-red-300">{q.weak}</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/10">
              <span className="text-xs font-bold text-emerald-500 flex-shrink-0">✓ Strong</span>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">{q.strong}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-[#0d1520] p-4">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Numbers to look for in your own projects</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Users / signups', 'API requests/day', '% reduction in time', '% reduction in errors', 'Team size', 'Lines of code reduced', 'Features shipped', 'Time saved (hours/week)', 'DB query time (ms)', 'Test coverage %'].map((n, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300">
              <span className="text-indigo-400">→</span> {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Common Mistakes ── */
function MistakesSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">
        The 8 most common resume mistakes that get you filtered out — and how to fix them.
      </p>
      {RESUME_GUIDE.commonMistakes.map((m, i) => (
        <div key={i} className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#13131f] p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-black flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">{m.mistake}</span>
          </div>
          <div className="flex items-start gap-2 pl-8">
            <span className="text-emerald-500 text-xs flex-shrink-0 mt-0.5 font-bold">Fix →</span>
            <p className="text-sm text-[#1e2340] dark:text-[#c8cce0] leading-relaxed">{m.fix}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
