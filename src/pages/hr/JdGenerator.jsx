import React, { useState } from 'react';
import { Sparkles, Brain } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/apiClient';
import toast from 'react-hot-toast';

export default function JdGenerator() {
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry Level (0-2 years)');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!roleTitle.trim() || !department.trim()) { toast.error('Enter a role title and department.'); return; }
    setGenerating(true);
    try {
      const response = await api.post('/jobs/hr/generate-description', { role_title: roleTitle, department, experience_level: experienceLevel });
      setResult(response.data?.data || null);
      toast.success('Job description generated with Gemini.');
    } catch (e) { toast.error(e.message || 'Gemini could not generate the description.'); }
    finally { setGenerating(false); }
  };

  return <div className="mx-auto max-w-5xl space-y-6 pb-12">
    <header className="border-b border-white/[0.08] pb-4"><h1 className="flex items-center gap-2 text-2xl font-bold text-white"><Brain className="h-6 w-6 text-brand-teal" />Gemini Job Description Generator</h1><p className="mt-1 text-sm text-gray-400">Generate and review a role-specific job description, skills, and interview questions.</p></header>
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="space-y-4 p-5"><h2 className="font-semibold text-white">Role details</h2>
        <label className="block text-sm text-gray-300">Role title<input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white" placeholder="e.g. Database Administrator" /></label>
        <label className="block text-sm text-gray-300">Department<input value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white" placeholder="e.g. Data Engineering" /></label>
        <label className="block text-sm text-gray-300">Experience level<select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-white"><option>Entry Level (0-2 years)</option><option>Mid-level (3-5 years)</option><option>Senior (6+ years)</option></select></label>
        <Button variant="teal" icon={Sparkles} loading={generating} onClick={generate} className="w-full">Generate with Gemini</Button>
      </Card>
      <Card className="space-y-5 p-6 lg:col-span-2">
        {!result ? <div className="py-14 text-center text-sm text-gray-400">Enter role details and generate a job description.</div> : <>
          <div><h2 className="text-xl font-bold text-white">{roleTitle}</h2><p className="text-sm text-brand-teal">{department} · {experienceLevel}</p></div>
          <div><h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">Description</h3><p className="whitespace-pre-line rounded-xl border border-white/[0.06] bg-obsidian-950 p-4 text-sm leading-relaxed text-gray-200">{result.description}</p></div>
          <div className="grid gap-4 md:grid-cols-2"><div><h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">Required skills</h3><ul className="list-inside list-disc space-y-1 text-sm text-gray-200">{result.required_skills?.map((skill, i) => <li key={i}>{skill}</li>)}</ul></div><div><h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">Preferred skills</h3><ul className="list-inside list-disc space-y-1 text-sm text-gray-200">{result.preferred_skills?.map((skill, i) => <li key={i}>{skill}</li>)}</ul></div></div>
          {result.target_keywords?.length > 0 && <div><h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">Keywords</h3><div className="flex flex-wrap gap-2">{result.target_keywords.map((word, i) => <span key={i} className="rounded-lg border border-brand-teal/30 bg-brand-teal/10 px-2 py-1 text-xs text-brand-teal">{word}</span>)}</div></div>}
          {result.interview_questions?.length > 0 && <div><h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">Interview questions</h3><ul className="list-inside list-disc space-y-1 text-sm text-gray-300">{result.interview_questions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>}
        </>}
      </Card>
    </div>
  </div>;
}
