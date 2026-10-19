import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../../services/apiClient';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronDown,
  ChevronUp, CircleHelp, Clock3, FileText, LoaderCircle, RotateCcw,
} from 'lucide-react';

const ROLES = ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Software Engineer'];
const TYPE_LABEL = { resume: 'Resume Building', 'job-readiness': 'Job Readiness' };
const TOOLTIP_STYLE = { backgroundColor: 'var(--bg-card, #111827)', border: '1px solid var(--border-light, #374151)', borderRadius: 12, color: 'var(--text-primary, #f9fafb)', fontSize: 12 };

function unwrap(response) { return response?.data?.data ?? response?.data; }
function errorMessage(error) { return error?.message || 'Something went wrong. Please try again.'; }
function newSubmissionId() { return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function average(value) { return value == null ? '—' : `${Math.round(value)}%`; }

export default function Practice() {
  const [tab, setTab] = useState('practice');
  const [challenges, setChallenges] = useState([]);
  const [challengeType, setChallengeType] = useState(null);
  const [challengeRole, setChallengeRole] = useState(ROLES[0]);
  const [challengeDifficulty, setChallengeDifficulty] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [answer, setAnswer] = useState({});
  const [result, setResult] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submissionId = useRef(null);

  const loadChallenges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/practice/challenges', { params: {
        ...(challengeType ? { type: challengeType } : {}),
        ...(challengeType === 'job-readiness' ? { targetRole: challengeRole } : {}),
        ...(challengeDifficulty !== 'all' ? { difficulty: challengeDifficulty } : {}),
      } });
      setChallenges(unwrap(response) || []);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [challengeType, challengeRole, challengeDifficulty]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const type = historyFilter === 'all' ? 'all' : historyFilter;
      const [statsResponse, attemptResponse] = await Promise.all([
        apiClient.get('/practice/stats', { params: { type } }),
        apiClient.get('/practice/attempts', { params: historyFilter === 'all' ? {} : { type: historyFilter }, }),
      ]);
      setStats(unwrap(statsResponse));
      setAttempts(unwrap(attemptResponse)?.items || []);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilter]);

  useEffect(() => { loadChallenges(); }, [loadChallenges]);
  useEffect(() => { if (tab === 'history') loadHistory(); }, [tab, loadHistory]);

  const filteredChallenges = useMemo(
    () => challengeType ? challenges.filter(item => item.type === challengeType) : challenges,
    [challenges, challengeType],
  );

  const openChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setTargetRole(challenge.type === 'job-readiness' ? challengeRole : (challenge.targetRoles?.[0] || ''));
    const initial = {};
    if (challenge.answerType === 'ordered-list') initial.sections = [...challenge.content.sections];
    if (challenge.answerType === 'skill-categories') {
      initial.required = [];
      initial.preferred = [];
      initial.notMentioned = [...challenge.content.skills];
    }
    if (challenge.answerType === 'classifications') {
      initial.classifications = Object.fromEntries(challenge.content.requirements.map(skill => [skill, 'not-demonstrated']));
    }
    setAnswer(initial);
    setResult(null);
    setDetail(null);
    setError('');
    submissionId.current = null;
  };

  const updateAnswer = (update) => {
    setAnswer(previous => ({ ...previous, ...update }));
    submissionId.current = null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedChallenge || submitting) return;
    setSubmitting(true);
    setError('');
    submissionId.current ||= newSubmissionId();
    try {
      const response = await apiClient.post('/practice/attempts', {
        challengeId: selectedChallenge.id,
        answer,
        targetRole,
        submissionId: submissionId.current,
      });
      setResult(unwrap(response));
      submissionId.current = null;
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const retryChallenge = () => {
    openChallenge(selectedChallenge);
  };

  const openAttempt = async (attempt) => {
    setError('');
    try {
      const response = await apiClient.get(`/practice/attempts/${attempt.id}`);
      setDetail(unwrap(response));
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const clearChallenge = () => { setSelectedChallenge(null); setResult(null); setError(''); };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-500">Student practice</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Practice</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Build stronger resume evidence and learn to assess job requirements.</p>
        </div>
        <div className="flex rounded-xl border p-1" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }} role="tablist" aria-label="Practice views">
          {[['practice', 'Practice'], ['history', 'History']].map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => { setTab(key); setSelectedChallenge(null); setDetail(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === key ? 'bg-cyan-500 text-white shadow' : ''}`}
              style={tab === key ? undefined : { color: 'var(--text-muted)' }}>{label}</button>
          ))}
        </div>
      </header>

      {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500"><span>{error}</span><button type="button" onClick={() => tab === 'history' ? loadHistory() : loadChallenges()} className="font-semibold underline">Retry</button></div>}

      {tab === 'practice' ? (
        selectedChallenge ? (
          <ChallengeWorkspace
            challenge={selectedChallenge} targetRole={targetRole} setTargetRole={setTargetRole}
            answer={answer} updateAnswer={updateAnswer} result={result} submitting={submitting}
            onSubmit={handleSubmit} onBack={clearChallenge} onRetry={retryChallenge}
            onHistory={() => { setSelectedChallenge(null); setTab('history'); }}
          />
        ) : (
          <>
            {challengeType && <button type="button" onClick={() => setChallengeType(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600"><ArrowLeft size={16} /> All practice</button>}
            {challengeType === 'job-readiness' && <label className="block max-w-sm text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Target role<select value={challengeRole} onChange={event => setChallengeRole(event.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{ROLES.map(role => <option key={role}>{role}</option>)}</select></label>}
            {challengeType && <label className="block max-w-sm text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Difficulty<select value={challengeDifficulty} onChange={event => setChallengeDifficulty(event.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>}
            {loading ? <LoadingState label="Loading challenges…" /> : challengeType ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredChallenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => openChallenge(challenge)} />)}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <PracticeTypeCard type="resume" icon={FileText} title="Resume Building Challenge" description="Practise writing evidence-based summaries, improving project descriptions, and organizing resume sections." onClick={() => setChallengeType('resume')} />
                <PracticeTypeCard type="job-readiness" icon={BriefcaseBusiness} title="Job Readiness Challenge" description="Read job descriptions, identify requirements, assess documented skills, and plan your next steps." onClick={() => setChallengeType('job-readiness')} />
              </div>
            )}
          </>
        )
      ) : (
        <HistoryView filter={historyFilter} setFilter={setHistoryFilter} stats={stats} attempts={attempts} loading={historyLoading} onOpen={openAttempt} onPractice={() => setTab('practice')} />
      )}

      {detail && <AttemptDetails attempt={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function PracticeTypeCard({ type, icon: Icon, title, description, onClick }) {
  return <button type="button" onClick={onClick} className="group flex min-h-64 flex-col items-start rounded-2xl border p-7 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}>
    <span className={`mb-5 grid h-12 w-12 place-items-center rounded-xl ${type === 'resume' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-indigo-500/10 text-indigo-500'}`}><Icon size={23} /></span>
    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    <p className="mt-2 max-w-lg text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{description}</p>
    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-cyan-600">Start Practising <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
  </button>;
}

function ChallengeCard({ challenge, onClick }) {
  const Icon = challenge.type === 'resume' ? FileText : BriefcaseBusiness;
  return <button type="button" onClick={onClick} className="group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}>
    <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600"><Icon size={19} /></span><span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{challenge.difficulty}</span></div>
    <h2 className="mt-4 text-base font-bold" style={{ color: 'var(--text-primary)' }}>{challenge.title}</h2>
    <p className="mt-2 min-h-12 text-sm leading-5" style={{ color: 'var(--text-muted)' }}>{challenge.description}</p>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600">Start Practising <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
  </button>;
}

function ChallengeWorkspace({ challenge, targetRole, setTargetRole, answer, updateAnswer, result, submitting, onSubmit, onBack, onRetry, onHistory }) {
  return <section className="rounded-2xl border p-5 sm:p-7" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}>
    <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600"><ArrowLeft size={16} /> Back to challenges</button>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-600"><span>{TYPE_LABEL[challenge.type]}</span><span>·</span><span>{challenge.difficulty}</span></div><h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{challenge.title}</h2><p className="mt-2 max-w-3xl text-sm" style={{ color: 'var(--text-muted)' }}>{challenge.instructions}</p></div>
      {challenge.type === 'resume' && challenge.targetRoles?.length > 1 && <label className="min-w-52 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Target role<select value={targetRole} onChange={event => { setTargetRole(event.target.value); }} className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{challenge.targetRoles.map(role => <option key={role}>{role}</option>)}</select></label>}
    </div>
    <ChallengePrompt challenge={challenge} answer={answer} updateAnswer={updateAnswer} />
    {result ? <EvaluationResult result={result} onRetry={onRetry} onHistory={onHistory} /> : <form onSubmit={onSubmit} className="mt-6 border-t pt-5" style={{ borderColor: 'var(--border-light)' }}><button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-60">{submitting && <LoaderCircle size={16} className="animate-spin" />}{submitting ? 'Evaluating…' : 'Submit answer'}</button><span className="ml-3 text-xs" style={{ color: 'var(--text-muted)' }}>Your attempt is saved to your private history.</span></form>}
  </section>;
}

function ChallengePrompt({ challenge, answer, updateAnswer }) {
  const content = challenge.content || {};
  const textField = challenge.id === 'resume-summary-beginner' ? 'summary' : 'description';
  const textLabel = textField === 'summary' ? 'Your professional summary' : 'Improved project description';
  const skillField = challenge.id === 'resume-skills-selection' ? 'skills' : 'actions';
  if (challenge.answerType === 'text') return <div className="space-y-4"><InfoBox title="Candidate / project context" content={content.candidateProfile ? <ProfileText profile={content.candidateProfile} /> : <div><p className="font-semibold">{content.project}</p><p className="mt-1">{content.originalDescription}</p><p className="mt-2 text-xs">Technologies listed: {content.technologies?.join(', ')}</p></div>} /><label className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{textLabel}<textarea value={answer[textField] || ''} onChange={event => updateAnswer({ [textField]: event.target.value })} maxLength={5000} rows={5} required placeholder="Write your response using only the supplied facts…" className="mt-2 block w-full rounded-xl border p-3 text-sm outline-none focus:border-cyan-500" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-input, transparent)', color: 'var(--text-primary)' }} /><span className="mt-1 block text-right text-xs" style={{ color: 'var(--text-muted)' }}>{(answer[textField] || '').length}/5000</span></label></div>;
  if (challenge.answerType === 'ordered-list') return <div className="space-y-4"><InfoBox title="Candidate profile" content={content.candidateProfile} /><p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Arrange the sections</p><div className="space-y-2">{(answer.sections || []).map((section, index) => <div key={section} className="flex items-center gap-3 rounded-xl border px-3 py-2.5" style={{ borderColor: 'var(--border-light)' }}><span className="w-6 text-xs font-bold text-cyan-600">{index + 1}</span><span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{section}</span><button type="button" disabled={index === 0} aria-label={`Move ${section} up`} onClick={() => moveItem(answer.sections, index, index - 1, sections => updateAnswer({ sections }))} className="rounded-lg p-1.5 disabled:opacity-30"><ChevronUp size={17} /></button><button type="button" disabled={index === answer.sections.length - 1} aria-label={`Move ${section} down`} onClick={() => moveItem(answer.sections, index, index + 1, sections => updateAnswer({ sections }))} className="rounded-lg p-1.5 disabled:opacity-30"><ChevronDown size={17} /></button></div>)}</div></div>;
  if (challenge.answerType === 'multi-select') return <div className="space-y-4"><InfoBox title="Candidate profile" content={content.candidateProfile || challenge.instructions} /><p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{challenge.id === 'resume-skills-selection' ? 'Select all supported skills' : 'Choose the three most useful next steps'}</p><div className="grid gap-2 sm:grid-cols-2">{content.options.map(option => { const selected = (answer[skillField] || []).includes(option); return <label key={option} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm ${selected ? 'border-cyan-500 bg-cyan-500/5' : ''}`} style={{ borderColor: selected ? undefined : 'var(--border-light)', color: 'var(--text-primary)' }}><input type="checkbox" checked={selected} onChange={event => updateAnswer({ [skillField]: event.target.checked ? [...(answer[skillField] || []), option] : (answer[skillField] || []).filter(value => value !== option) })} className="mt-0.5 accent-cyan-600" /><span>{option}</span></label>; })}</div></div>;
  if (challenge.answerType === 'skill-categories') return <div className="space-y-4"><InfoBox title={`${content.role} job description`} content={content.jobDescription} /><div className="space-y-2">{content.skills.map(skill => <label key={skill} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5" style={{ borderColor: 'var(--border-light)' }}><span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{skill}</span><select aria-label={`Classify ${skill}`} value={categoryOf(answer, skill)} onChange={event => classifySkill(answer, skill, event.target.value, updateAnswer)} className="rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}><option value="required">Required</option><option value="preferred">Preferred</option><option value="notMentioned">Not mentioned</option></select></label>)}</div></div>;
  if (challenge.answerType === 'classifications') return <div className="space-y-4"><InfoBox title={`${content.role} job description`} content={content.jobDescription || 'Assess the requirements for the selected role.'} /><InfoBox title="Candidate profile" content={content.candidateProfile} /><div className="space-y-3">{content.requirements.map(skill => <fieldset key={skill} className="rounded-xl border p-3" style={{ borderColor: 'var(--border-light)' }}><legend className="px-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{skill}</legend><div className="mt-1 flex flex-wrap gap-3">{[['matched', 'Matched'], ['partial', 'Partially matched'], ['not-demonstrated', 'Not demonstrated']].map(([value, label]) => <label key={value} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><input type="radio" name={skill} checked={answer.classifications?.[skill] === value} onChange={() => updateAnswer({ classifications: { ...answer.classifications, [skill]: value } })} className="accent-cyan-600" />{label}</label>)}</div></fieldset>)}</div></div>;
  return <div role="alert" className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-500">This challenge format is not supported.</div>;
}

function ProfileText({ profile }) { return <dl className="grid gap-2 sm:grid-cols-2">{Object.entries(profile).map(([key, value]) => <div key={key}><dt className="text-[10px] font-bold uppercase tracking-wide opacity-60">{key}</dt><dd className="mt-0.5">{Array.isArray(value) ? value.join(', ') : value}</dd></div>)}</dl>; }
function InfoBox({ title, content }) { return <section className="rounded-xl border p-4 text-sm leading-6" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-subtle, rgba(100,116,139,0.06))', color: 'var(--text-secondary)' }}><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-600">{title}</h3>{content}</section>; }
function moveItem(list, from, to, callback) { if (to < 0 || to >= list.length) return; const next = [...list]; [next[from], next[to]] = [next[to], next[from]]; callback(next); }
function categoryOf(answer, skill) { for (const key of ['required', 'preferred', 'notMentioned']) if ((answer[key] || []).includes(skill)) return key; return 'notMentioned'; }
function classifySkill(answer, skill, nextCategory, update) { const lists = { required: [...(answer.required || [])], preferred: [...(answer.preferred || [])], notMentioned: [...(answer.notMentioned || [])] }; for (const values of Object.values(lists)) { const index = values.indexOf(skill); if (index >= 0) values.splice(index, 1); } lists[nextCategory].push(skill); update(lists); }

function EvaluationResult({ result, onRetry, onHistory }) {
  const feedback = result.feedback || {};
  return <section className="mt-7 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-5" aria-live="polite">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Challenge complete</p><h3 className="mt-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your score: {result.score}/100</h3></div><div className="flex gap-2"><button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}><RotateCcw size={15} /> Try again</button><button type="button" onClick={onHistory} className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-bold text-white">View history</button></div></div>
    {Object.keys(result.criteriaScores || {}).length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(result.criteriaScores).map(([name, score]) => <div key={name} className="rounded-lg border p-3" style={{ borderColor: 'var(--border-light)' }}><p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{name.replaceAll('_', ' ')}</p><p className="mt-1 font-bold" style={{ color: 'var(--text-primary)' }}>{score}%</p></div>)}</div>}
    {feedback.explanation && <p className="mt-4 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{feedback.explanation}</p>}
    <div className="mt-4 grid gap-4 sm:grid-cols-2"><FeedbackList title="Strengths" items={feedback.strengths} good /> <FeedbackList title="Next improvements" items={feedback.improvements} /></div>
    {feedback.explanations && <div className="mt-4 space-y-2">{Object.entries(feedback.explanations).map(([key, value]) => <p key={key} className="text-xs leading-5" style={{ color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text-primary)' }}>{key}:</strong> {value}</p>)}</div>}
    {feedback.nextSteps?.length > 0 && <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wide text-cyan-600">Prioritized next steps</p><ol className="mt-2 list-inside list-decimal space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{feedback.nextSteps.map(item => <li key={item}>{item}</li>)}</ol></div>}
    {result.suggestedAnswer && <details className="mt-4 rounded-xl border p-3" style={{ borderColor: 'var(--border-light)' }}><summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Suggested answer or ordering</summary><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{typeof result.suggestedAnswer === 'string' ? result.suggestedAnswer : JSON.stringify(result.suggestedAnswer, null, 2)}</pre></details>}
  </section>;
}
function FeedbackList({ title, items = [], good = false }) { return <div><h4 className={`mb-2 text-xs font-bold uppercase tracking-wide ${good ? 'text-emerald-600' : 'text-amber-600'}`}>{title}</h4>{items.length ? <ul className="space-y-1.5">{items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}><span>{good ? <Check size={15} className="mt-0.5 text-emerald-500" /> : <CircleHelp size={15} className="mt-0.5 text-amber-500" />}</span><span>{item}</span></li>)}</ul> : <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No items to show.</p>}</div>; }

function HistoryView({ filter, setFilter, stats, attempts, loading, onOpen, onPractice }) {
  const chart = useMemo(() => (stats?.chart || []).map((point, index) => ({ ...point, index: index + 1, resumeScore: point.type === 'resume' ? point.score : null, jobScore: point.type === 'job-readiness' ? point.score : null })), [stats]);
  const customTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return <div className="rounded-xl border p-3 shadow-lg" style={TOOLTIP_STYLE}><p className="font-bold">{point.challengeName}</p><p>{TYPE_LABEL[point.type]}</p><p>{new Date(point.date).toLocaleString()} · {point.score}%</p></div>;
  };
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Total attempts', stats?.summary?.totalAttempts ?? 0], ['Resume average', average(stats?.summary?.resumeAverage)], ['Job readiness average', average(stats?.summary?.jobReadinessAverage)], ['Overall average', average(stats?.summary?.overallAverage)]].map(([label, value]) => <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}><p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</p><p className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p></div>)}</div>
    <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Score progression</h2><p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Scores shown in chronological attempt order.</p></div><select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter practice history" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}><option value="all">All practice</option><option value="resume">Resume Building</option><option value="job-readiness">Job Readiness</option></select></div>
      {loading ? <LoadingState label="Loading your history…" /> : chart.length ? <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart} margin={{ top: 8, right: 16, left: -15, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-light, #334155)" opacity={0.55} /><XAxis dataKey="index" tickFormatter={value => { const point = chart[value - 1]; return point ? new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : value; }} stroke="var(--text-muted, #94a3b8)" fontSize={10} /><YAxis domain={[0, 100]} stroke="var(--text-muted, #94a3b8)" fontSize={10} /><Tooltip content={customTooltip} /><Legend /><Line type="monotone" dataKey="resumeScore" name="Resume Building" stroke="#06b6d4" strokeWidth={2.5} connectNulls={false} dot={{ r: 3 }} activeDot={{ r: 5 }} /><Line type="monotone" dataKey="jobScore" name="Job Readiness" stroke="#8b5cf6" strokeWidth={2.5} connectNulls={false} dot={{ r: 3 }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div> : <div className="py-8 text-center"><Clock3 size={30} className="mx-auto text-slate-400"/><p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No completed attempts yet</p><p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Complete a practice challenge to see your progress here.</p></div>}
    </section>
    <section className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}><div className="border-b px-5 py-4" style={{ borderColor: 'var(--border-light)' }}><h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Attempt history</h2></div>{loading ? <LoadingState label="Loading attempts…" /> : attempts.length ? <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>{attempts.map(attempt => <div key={attempt.id} className="flex flex-wrap items-center gap-3 px-5 py-4"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{attempt.challengeName}</p><p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{TYPE_LABEL[attempt.challengeType]} · {new Date(attempt.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-700">{attempt.score}%</span><button type="button" onClick={() => onOpen(attempt)} className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>View details</button></div>)}</div> : <div className="p-8 text-center"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>No attempts match this filter. Start a challenge to build your private history.</p><button type="button" onClick={onPractice} className="mt-3 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white">Start practising</button></div>}</section>
  </div>;
}

function AttemptDetails({ attempt, onClose }) {
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="attempt-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-7" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-card)' }}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-cyan-600">{TYPE_LABEL[attempt.challengeType]} · {new Date(attempt.createdAt).toLocaleString()}</p><h2 id="attempt-title" className="mt-1 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{attempt.challengeName}</h2><p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Score: <strong style={{ color: 'var(--text-primary)' }}>{attempt.score}/100</strong>{attempt.targetRole ? ` · Target role: ${attempt.targetRole}` : ''}</p></div><button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border-light)', color: 'var(--text-primary)' }}>Close</button></div><div className="mt-5 space-y-4"><ReportBlock title="Submitted answer" value={attempt.submittedAnswer} /><ReportBlock title="Criteria scores" value={attempt.criteriaScores} /><ReportBlock title="Feedback" value={attempt.feedback} />{attempt.suggestedAnswer && <ReportBlock title="Reference answer" value={attempt.suggestedAnswer} />}</div></section></div>;
}
function ReportBlock({ title, value }) { return <section className="rounded-xl border p-4" style={{ borderColor: 'var(--border-light)' }}><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-600">{title}</h3><pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre></section>; }
function LoadingState({ label }) { return <div className="flex items-center justify-center gap-2 py-12 text-sm" style={{ color: 'var(--text-muted)' }}><LoaderCircle size={17} className="animate-spin" />{label}</div>; }
