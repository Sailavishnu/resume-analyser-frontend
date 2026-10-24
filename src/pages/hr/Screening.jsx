import React, { useRef, useState } from 'react';
import { FileArchive, Search, UploadCloud } from 'lucide-react';
import { useHrStore } from '../../store/hrStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const RESULT_MODES = [
  { value: 1, label: 'Best match' },
  { value: 3, label: 'Top 3' },
  { value: 10, label: 'Top 10' },
  { value: 100, label: 'All resumes' },
];
const COMMON_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Database Administrator',
  'DevOps Engineer', 'QA Engineer', 'Cybersecurity Analyst', 'UI/UX Designer',
  'Product Manager', 'Other / enter a role',
];
const CUSTOM_ROLE = 'custom';

export default function Screening() {
  const { screenZip, rankZip, parsing } = useHrStore();
  const inputRef = useRef(null);
  const [batch, setBatch] = useState(null);
  const [roleChoice, setRoleChoice] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [roleDetails, setRoleDetails] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [resultMode, setResultMode] = useState(3);
  const [results, setResults] = useState([]);
  const [rankedCount, setRankedCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [error, setError] = useState('');
  const role = roleChoice === CUSTOM_ROLE ? customRole.trim() : roleChoice;
  const clearResults = () => { setResults([]); setRankedCount(0); };

  const importZip = async (file) => {
    if (!file) return;
    setError(''); setResults([]); setBatch(null);
    setUploading(true);
    try {
      const imported = await screenZip(file);
      setBatch(imported);
    } catch (e) { setError(e.message || 'Could not import this ZIP.'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  const rank = async (event) => {
    event.preventDefault();
    if (!batch?.session_id) return;
    if (role.length < 2) { setError('Choose or enter the role you are hiring for.'); return; }
    setError(''); setRanking(true);
    try {
      const response = await rankZip(batch.session_id, {
        role, role_details: roleDetails,
        required_skills: skillsInput.split(',').map(skill => skill.trim()).filter(Boolean),
        top_k: Number(resultMode),
      });
      setResults(response.results || []);
      setRankedCount(response.total_ranked || 0);
      if (!response.results?.length) setError('No resumes matched these role criteria. Try a broader role description or skills list.');
    } catch (e) { setError(e.message || 'Could not rank this batch. Re-import the ZIP if it expired.'); }
    finally { setRanking(false); }
  };

  return <div className="mx-auto max-w-5xl space-y-6 pb-12">
    <header className="border-b border-white/[0.08] pb-4">
      <h1 className="text-2xl font-bold text-white">AI Resume Screening</h1>
      <p className="mt-1 text-sm text-gray-400">Import a ZIP of resumes, then describe the role to rank the strongest candidates.</p>
    </header>

    {!batch ? <Card className="p-8 text-center sm:p-12">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal"><FileArchive className="h-7 w-7" /></div>
      <h2 className="text-lg font-semibold text-white">Start with a resume ZIP</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">We extract and parse PDF and DOCX resumes, then hold their parsed content and vector index temporarily for this screening session.</p>
      <input ref={inputRef} type="file" accept=".zip,application/zip" className="hidden" onChange={event => importZip(event.target.files?.[0])} />
      <Button variant="teal" icon={UploadCloud} loading={uploading || parsing} onClick={() => inputRef.current?.click()} className="mt-6">Import ZIP</Button>
      <p className="mt-3 text-xs text-gray-500">ZIP limit 25 MB · up to 100 PDF/DOCX resumes · processing stays in memory for 30 minutes</p>
      {uploading && <p className="mt-4 text-sm text-brand-teal">Extracting resumes, parsing content, and building the temporary FAISS index…</p>}
    </Card> : <>
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-semibold text-white">Resume batch imported</h2><p className="text-sm text-gray-400">Parsed in temporary memory only. The screening session expires in {batch.expires_in_minutes} minutes.</p></div>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>Import another ZIP</Button><input ref={inputRef} type="file" accept=".zip,application/zip" className="hidden" onChange={event => importZip(event.target.files?.[0])} /></div>
        </div>
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Files in ZIP', batch.statistics?.files_in_zip ?? batch.resume_count],
            ['PDF / DOCX files', batch.statistics?.supported_files ?? batch.resume_count],
            ['Readable resumes', batch.statistics?.parsed_resumes ?? batch.resume_count],
            ['Files skipped', batch.statistics?.skipped_files ?? 0],
            ['PDF / DOCX', `${batch.statistics?.pdf_resumes ?? 0} / ${batch.statistics?.docx_resumes ?? 0}`],
            ['Unique skills', batch.statistics?.unique_skills ?? 0],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value}</p></div>)}
          {batch.statistics?.average_experience_years != null && <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"><p className="text-xs text-gray-500">Average experience</p><p className="mt-1 text-xl font-semibold text-white">{batch.statistics.average_experience_years} years</p></div>}
        </div>
        <div className="mb-5 flex flex-wrap gap-2">{batch.resumes?.slice(0, 8).map((resume, i) => <span key={`${resume.filename}-${i}`} title={resume.skills?.join(', ')} className="max-w-full truncate rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">{resume.full_name || resume.filename}</span>)}{batch.resume_count > 8 && <span className="rounded-lg px-2 py-1.5 text-xs text-gray-500">+{batch.resume_count - 8} more</span>}</div>

        <form onSubmit={rank} className="grid gap-4 border-t border-white/[0.08] pt-5 md:grid-cols-2">
          <label className="block text-sm text-gray-300">Target job role<select required value={roleChoice} onChange={event => { setRoleChoice(event.target.value); clearResults(); }} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2.5 text-white focus:border-brand-teal focus:outline-none"><option value="" disabled>Select a role</option>{COMMON_ROLES.map(item => <option key={item} value={item === 'Other / enter a role' ? CUSTOM_ROLE : item}>{item}</option>)}</select></label>
          {roleChoice === CUSTOM_ROLE && <label className="block text-sm text-gray-300">Enter a custom role<input required minLength={2} maxLength={160} value={customRole} onChange={event => { setCustomRole(event.target.value); clearResults(); }} placeholder="e.g. Clinical Data Coordinator" className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none" /></label>}
          <label className="block text-sm text-gray-300">Required skills, optional<input value={skillsInput} onChange={event => { setSkillsInput(event.target.value); clearResults(); }} placeholder="e.g. PostgreSQL, query optimization, Python" className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none" /></label>
          <label className="block text-sm text-gray-300 md:col-span-2">Role details or job description<textarea rows={3} value={roleDetails} onChange={event => { setRoleDetails(event.target.value); clearResults(); }} placeholder="Describe responsibilities, experience, and what makes someone a strong fit…" className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none" /></label>
          <label className="block text-sm text-gray-300">Show results<select value={resultMode} onChange={event => { setResultMode(Number(event.target.value)); clearResults(); }} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2.5 text-white">{RESULT_MODES.map(mode => <option key={mode.value} value={mode.value}>{mode.label}</option>)}</select></label>
          <div className="flex items-end"><Button type="submit" variant="teal" icon={Search} loading={ranking} className="w-full">{results.length ? 'Update ranking' : 'Find best-fit resumes'}</Button></div>
        </form>
      </Card>

      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}
      {results.length > 0 && <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-lg font-semibold text-white">Best fit for {role}</h2><p className="text-xs text-gray-400">Ranked with Sentence-BERT semantic similarity and required-skill coverage · Showing {rankedCount} of {batch.resume_count} resumes</p></div></div>
        {results.map((candidate, index) => <Card key={`${candidate.filename}-${index}`} className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-brand-teal/15 px-2.5 py-1 text-xs font-bold text-brand-teal">#{index + 1}</span><h3 className="font-semibold text-white">{candidate.full_name || candidate.filename}</h3></div><p className="mt-1 text-sm text-gray-400">{candidate.email || candidate.filename}{candidate.experience_years != null ? ` · ${candidate.experience_years} years experience` : ''}</p>{candidate.summary && <p className="mt-2 line-clamp-3 text-sm text-gray-300">{candidate.summary}</p>}
            {candidate.skills?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{candidate.skills.slice(0, 12).map(skill => <span key={skill} className={`rounded-md border px-2 py-1 text-[11px] ${candidate.matched_required_skills.includes(skill) ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/[0.03] text-gray-400'}`}>{skill}</span>)}</div>}
            {candidate.missing_required_skills.length > 0 && <p className="mt-2 text-xs text-amber-300">Missing listed skills: {candidate.missing_required_skills.join(', ')}</p>}
          </div><div className="min-w-24 text-right"><p className="text-2xl font-bold text-brand-teal">{candidate.score}%</p><p className="text-[11px] text-gray-500">fit score</p><p className="mt-1 text-[10px] text-gray-600">Semantic {candidate.semantic_score}%</p></div>
        </Card>)}
      </section>}
    </>}
    {error && !batch && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}
  </div>;
}
