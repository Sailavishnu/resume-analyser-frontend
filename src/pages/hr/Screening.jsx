import React, { useEffect, useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Screening() {
  const { campaigns, fetchJobs, screenZip, parsing } = useHrStore();
  const [jobId, setJobId] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { fetchJobs().catch(e => setError(e.message)); }, [fetchJobs]);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setResults([]);
    if (!file || !jobId) { setError('Select a job and ZIP file first.'); return; }
    try { setResults(await screenZip(file, jobId)); }
    catch (e) { setError(e.message || 'Could not screen this ZIP.'); }
  };
  return <div className="mx-auto max-w-4xl space-y-6 pb-12">
    <header className="border-b border-white/[0.08] pb-4"><h1 className="text-2xl font-bold text-white">AI Resume Screening</h1><p className="mt-1 text-sm text-gray-400">Upload a ZIP of PDF or DOCX resumes to rank them against one of your job postings. Files are processed for this session and are not saved.</p></header>
    <Card className="p-6"><form onSubmit={submit} className="space-y-4">
      <label className="block text-sm text-gray-300">Job posting<select required value={jobId} onChange={e => setJobId(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white"><option value="">Select a job</option>{campaigns.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
      <label className="block text-sm text-gray-300">Resume ZIP file<input required type="file" accept=".zip,application/zip" onChange={e => { setFile(e.target.files?.[0] || null); setResults([]); }} className="mt-1 block w-full rounded-lg border border-white/10 bg-obsidian-950 p-3 text-sm text-gray-300" /></label>
      <p className="text-xs text-gray-500">Up to 25 MB per archive and 100 PDF/DOCX resumes. This screening does not create candidate records.</p>
      <Button type="submit" variant="teal" loading={parsing}>Screen resumes</Button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </form></Card>
    {results.length > 0 && <section className="space-y-3"><h2 className="text-lg font-semibold text-white">Ranked resumes</h2>{results.map((candidate, index) => <Card key={`${candidate.filename}-${index}`} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold text-white">{index + 1}. {candidate.full_name || candidate.filename}</p><p className="text-sm text-gray-400">{candidate.email || candidate.filename}</p>{candidate.matched_required_skills?.length > 0 && <p className="mt-1 text-xs text-gray-300">Required skills matched: {candidate.matched_required_skills.join(', ')}</p>}</div><div className="text-right"><p className="text-xl font-bold text-brand-teal">{candidate.score}%</p><p className="text-xs text-gray-500">Semantic similarity</p></div></Card>)}</section>}
  </div>;
}
