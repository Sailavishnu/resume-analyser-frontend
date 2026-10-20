import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Clock3, Compass, Loader2, RefreshCw, Sparkles, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { studentService } from '../../services/studentService';

const roleSuggestions = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'Database Administrator', 'UX/UI Designer', 'QA Engineer', 'DevOps Engineer', 'Cybersecurity Analyst', 'Product Manager'];
const softSkillFields = [
  ['communication', 'Communication'], ['teamwork', 'Teamwork'],
  ['problemSolving', 'Problem solving'], ['timeManagement', 'Time management'],
];
const inputClass = 'mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/45 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10';
const labelClass = 'text-sm font-medium text-slate-200';

function splitSkills(value) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function RoadmapForm({ initial, onSubmit, loading, onCancel, error }) {
  const [form, setForm] = useState(() => ({
    targetRole: initial?.targetRole || '',
    frontendSkills: (initial?.frontendSkills || []).join(', '),
    backendSkills: (initial?.backendSkills || []).join(', '),
    additionalSkills: (initial?.additionalSkills || []).join(', '),
    experienceLevel: initial?.experienceLevel || 'beginner',
    hoursPerWeek: initial?.hoursPerWeek || 8,
    timeframeWeeks: initial?.timeframeWeeks || 12,
    softSkills: { communication: 3, teamwork: 3, problemSolving: 3, timeManagement: 3, ...(initial?.softSkills || {}) },
  }));
  const change = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const submit = event => {
    event.preventDefault();
    onSubmit({
      ...form,
      targetRole: form.targetRole.trim(),
      frontendSkills: splitSkills(form.frontendSkills),
      backendSkills: splitSkills(form.backendSkills),
      additionalSkills: splitSkills(form.additionalSkills),
      hoursPerWeek: Number(form.hoursPerWeek),
      timeframeWeeks: Number(form.timeframeWeeks),
      softSkills: Object.fromEntries(Object.entries(form.softSkills).map(([key, value]) => [key, Number(value)])),
    });
  };

  return <Card className="mx-auto max-w-5xl p-4 sm:p-5" hoverEffect={false}>
    {error && <div role="alert" className="mb-5 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
    <form onSubmit={submit} className="space-y-3.5">
      <section className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        <label className={labelClass}>Target role
          <input className={inputClass} list="career-role-options" required minLength={2} maxLength={120} value={form.targetRole} onChange={e => change('targetRole', e.target.value)} placeholder="Type any role you want to pursue" />
          <datalist id="career-role-options">{roleSuggestions.map(role => <option key={role} value={role} />)}</datalist>
        </label>
        <label className={labelClass}>Current experience level
          <select className={inputClass} value={form.experienceLevel} onChange={e => change('experienceLevel', e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
        </label>
        <label className={labelClass}>Frontend skills you already know <span className="font-normal text-slate-500">(comma separated)</span>
          <input className={inputClass} value={form.frontendSkills} onChange={e => change('frontendSkills', e.target.value)} placeholder="HTML, CSS, React... or leave blank" />
        </label>
        <label className={labelClass}>Backend skills you already know <span className="font-normal text-slate-500">(comma separated)</span>
          <input className={inputClass} value={form.backendSkills} onChange={e => change('backendSkills', e.target.value)} placeholder="Python, APIs, SQL... or leave blank" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>Other skills, tools, or experience
          <input className={inputClass} value={form.additionalSkills} onChange={e => change('additionalSkills', e.target.value)} placeholder="GitHub, Figma, Excel, coursework, projects..." />
        </label>
      </section>

      <section>
        <div className="mb-3"><h3 className="font-semibold text-white">How do you rate these soft skills?</h3><p className="mt-1 text-xs text-slate-500">This is a self-assessment to help balance the technical plan with professional skills.</p></div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {softSkillFields.map(([key, title]) => <label key={key} className={`${labelClass} rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2`}>{title}
            <select className={`${inputClass} mt-1 py-2`} value={form.softSkills[key]} onChange={e => setForm(current => ({ ...current, softSkills: { ...current.softSkills, [key]: e.target.value } }))}>
              <option value="1">1 — Need practice</option><option value="2">2 — Developing</option><option value="3">3 — Comfortable</option><option value="4">4 — Strong</option><option value="5">5 — Very confident</option>
            </select>
          </label>)}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Time available each week
          <div className="mt-1.5 flex overflow-hidden rounded-xl border border-white/10 bg-slate-950/45 focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/10"><input className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white outline-none" type="number" min="1" max="80" required value={form.hoursPerWeek} onChange={e => change('hoursPerWeek', e.target.value)} /><span className="flex items-center whitespace-nowrap border-l border-white/10 px-3 text-xs text-slate-400">hours / week</span></div>
        </label>
        <label className={labelClass}>Target timeframe
          <div className="mt-1.5 flex overflow-hidden rounded-xl border border-white/10 bg-slate-950/45 focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/10"><input className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white outline-none" type="number" min="4" max="52" required value={form.timeframeWeeks} onChange={e => change('timeframeWeeks', e.target.value)} /><span className="flex items-center whitespace-nowrap border-l border-white/10 px-3 text-xs text-slate-400">weeks</span></div>
        </label>
      </section>
      <div className="flex flex-wrap justify-end gap-3 border-t border-white/5 pt-3">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Back to my roadmap</Button>}
        <Button type="submit" loading={loading} disabled={!form.targetRole.trim()} icon={Sparkles}>{loading ? 'Building your plan…' : 'Generate my roadmap'}</Button>
      </div>
    </form>
  </Card>;
}

function RoadmapMap({ phases, onSelect, selectedId }) {
  const coordinates = useMemo(() => phases.map((phase, index) => ({
    x: phases.length <= 1 ? 500 : 70 + index * (860 / (phases.length - 1)),
    y: index % 2 === 0 ? 185 : 85,
    phase,
  })), [phases]);
  const path = coordinates.reduce((d, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prior = coordinates[index - 1];
    const middle = (prior.x + point.x) / 2;
    return `${d} C ${middle} ${prior.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  const completedCount = phases.filter(phase => phase.status === 'completed').length;
  const routeProgress = phases.length ? completedCount / phases.length * 100 : 0;
  return <div className="relative overflow-hidden rounded-2xl border px-3 pb-4 pt-5 shadow-md sm:px-7" style={{ backgroundColor: 'var(--roadmap-map-bg)', borderColor: 'var(--border-mid)' }}>
    <svg viewBox="0 0 1000 270" className="h-56 w-full sm:h-64" role="img" aria-label="Personalized career roadmap phases">
      <path d={path} fill="none" stroke="var(--roadmap-route-muted)" strokeWidth="22" strokeLinecap="round" />
      <path d={path} fill="none" stroke="rgba(56,189,248,.78)" strokeWidth="22" strokeLinecap="round" pathLength="100" strokeDasharray={`${routeProgress} 100`} />
      <path d={path} fill="none" stroke="var(--roadmap-route-dash)" strokeWidth="2" strokeDasharray="8 10" />
      {coordinates.map(({ x, y, phase }, index) => {
        const colors = phase.status === 'completed' ? ['#10b981', '#064e3b'] : phase.status === 'active' ? ['#38bdf8', '#0c4a6e'] : ['#64748b', '#1e293b'];
        return <g key={phase.id} className="cursor-pointer" onClick={() => onSelect(phase.id)} role="button" tabIndex="0" aria-label={`${phase.title}, ${phase.status}`} onKeyDown={event => event.key === 'Enter' && onSelect(phase.id)}>
          <circle cx={x} cy={y} r="23" fill={colors[1]} stroke={colors[0]} strokeWidth={selectedId === phase.id ? 5 : 3} />
          <text x={x} y={y + 6} textAnchor="middle" fill="white" fontSize="17" fontWeight="700">{phase.status === 'completed' ? '✓' : index + 1}</text>
          <text x={x} y={y + (y < 130 ? 57 : -48)} textAnchor="middle" fill="var(--roadmap-label)" fontSize="13" fontWeight="700">{phase.title.length > 19 ? `${phase.title.slice(0, 18)}…` : phase.title}</text>
          <text x={x} y={y + (y < 130 ? 74 : -32)} textAnchor="middle" fill="var(--roadmap-label-muted)" fontSize="11" fontWeight="600">Weeks {phase.startWeek}–{phase.endWeek}</text>
        </g>;
      })}
    </svg>
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs" style={{ color: 'var(--text-secondary)' }}><div className="flex gap-4"><span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />Completed</span><span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-sky-500" />Active</span><span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-slate-500" />Upcoming</span></div><span>Select a phase to view details</span></div>
  </div>;
}

function PhaseCard({ phase, index, selected, onSelect, onComplete, busy }) {
  const complete = phase.status === 'completed';
  const locked = phase.status === 'locked';
  return <Card className={`group self-start p-4 transition-colors ${selected ? 'border-sky-400/40 ring-1 ring-sky-400/20' : ''}`}>
    <button className="w-full text-left" onClick={onSelect} aria-expanded={selected}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${complete ? 'bg-emerald-400/10 text-emerald-300' : locked ? 'bg-slate-400/10 text-slate-400' : 'bg-sky-400/10 text-sky-300'}`}>{complete ? '✓ Completed' : locked ? 'Upcoming' : '● Active'}</span>
        <span className="text-xs text-slate-400">Weeks {phase.startWeek}–{phase.endWeek}</span>
      </div>
      <h3 className="font-semibold text-white">Stage {index + 1}: {phase.title}</h3><p className={`mt-2 text-sm text-slate-400 transition-all ${selected ? '' : 'line-clamp-1 opacity-0 group-hover:line-clamp-2 group-hover:opacity-100'}`}>{phase.goal}</p>
    </button>
    {selected && <div className="mt-5 space-y-4 border-t border-white/5 pt-4">
      {[['Topics to learn', phase.topics], ['Practice activities', phase.activities], ['Deliverables', phase.deliverables], ['Professional skills', phase.softSkills]].map(([title, list]) => <div key={title}><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p><ul className="space-y-1.5">{list.map((item, i) => <li key={`${title}-${i}`} className="flex gap-2 text-sm text-slate-300"><span className="text-sky-400">•</span>{item}</li>)}</ul></div>)}
      {!locked && !complete && <Button size="sm" loading={busy} icon={Check} onClick={onComplete}>Mark stage complete</Button>}
    </div>}
  </Card>;
}

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingPhase, setUpdatingPhase] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    studentService.getCareerRoadmap().then(value => { if (alive) { setRoadmap(value); setSelectedId(value?.phases?.find(phase => phase.status === 'active')?.id || value?.phases?.[0]?.id || null); } })
      .catch(reason => { if (alive) setError(reason.message || 'Could not load your roadmap.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const generate = async intake => {
    setGenerating(true); setError('');
    try {
      const value = await studentService.generateCareerRoadmap(intake);
      setRoadmap(value); setEditing(false); setSelectedId(value?.phases?.[0]?.id || null);
    } catch (reason) { setError(reason.message || 'Could not generate your roadmap. Please try again.'); }
    finally { setGenerating(false); }
  };
  const complete = async phaseId => {
    setUpdatingPhase(phaseId); setError('');
    try { const value = await studentService.completeCareerRoadmapPhase(phaseId); setRoadmap(value); setSelectedId(value?.phases?.find(phase => phase.status === 'active')?.id || phaseId); }
    catch (reason) { setError(reason.message || 'Could not update this stage.'); }
    finally { setUpdatingPhase(null); }
  };

  if (loading) return <div className="flex min-h-64 items-center justify-center text-slate-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading your saved roadmap…</div>;
  if (!roadmap || editing) return <RoadmapForm initial={editing ? roadmap?.intake : null} onSubmit={generate} loading={generating} onCancel={roadmap && editing ? () => { setEditing(false); setError(''); } : undefined} error={error} />;

  const phases = roadmap.phases || [];
  const active = phases.find(phase => phase.status === 'active');
  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Your career roadmap</p><h1 className="mt-1 text-2xl font-bold text-white">{roadmap.title}</h1><p className="mt-1 max-w-3xl text-sm text-slate-400">{roadmap.summary}</p></div>
      <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => { setEditing(true); setError(''); }}>Update goals</Button>
    </header>
    {error && <div role="alert" className="flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
    <div className="flex flex-wrap gap-2.5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"><Target className="h-3.5 w-3.5 text-emerald-300" />Focus: {roadmap.target_role}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"><Clock3 className="h-3.5 w-3.5 text-sky-300" />{roadmap.weekly_hours}h/week · {roadmap.total_weeks} weeks</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"><CheckCircle2 className="h-3.5 w-3.5 text-violet-300" />{roadmap.progress || 0}% complete</span>
    </div>
    <RoadmapMap phases={phases} selectedId={selectedId} onSelect={setSelectedId} />
    {active && <div className="text-sm text-slate-400">Current focus: <span className="font-medium text-sky-300">{active.title}</span>. Complete its activities to unlock the next stage.</div>}
    <div className="grid items-start gap-4 lg:grid-cols-2">{phases.map((phase, index) => <PhaseCard key={phase.id} phase={phase} index={index} selected={selectedId === phase.id} onSelect={() => setSelectedId(selectedId === phase.id ? null : phase.id)} onComplete={() => complete(phase.id)} busy={updatingPhase === phase.id} />)}</div>
    {!phases.length && <Card className="p-8 text-center text-slate-400"><ArrowLeft className="mx-auto mb-2 h-5 w-5" />The saved roadmap has no stages. Update your goals to generate a new plan.</Card>}
  </div>;
}
