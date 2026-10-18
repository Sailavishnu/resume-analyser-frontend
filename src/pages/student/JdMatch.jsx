import React, { useState } from 'react';
import { SearchCode, Briefcase } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { resumeService } from '../../services/resumeService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function JdMatch() {
  const { getSelectedResume } = useStudentStore();
  const resume = getSelectedResume();
  const [jdText, setJdText] = useState('');
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState(null);

  const runMatch = async () => {
    if (!resume?.id) return toast.error('Upload a resume before matching it to a job description.');
    if (jdText.trim().length < 30) return toast.error('Paste the full job description (at least 30 characters).');
    setMatching(true);
    try {
      const data = await resumeService.compareWithJobDescription(resume.id, jdText.trim());
      setResults(data);
    } catch (error) {
      toast.error(error?.response?.data?.detail || error?.message || 'Could not analyze this job description.');
    } finally {
      setMatching(false);
    }
  };

  return <div className="space-y-6">
    <header className="border-b border-white/[0.06] pb-4">
      <h1 className="text-xl font-bold font-heading text-white">Job Description Matching</h1>
      <p className="text-xs text-gray-400">Compare a saved resume with the requirements in a real job description.</p>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-brand-blue"/><h2 className="text-sm font-bold text-white">Job description</h2></div>
        <p className="text-xs text-gray-400">Resume: {resume?.name || 'No resume selected'}</p>
        <Input type="textarea" placeholder="Paste the complete job description, including responsibilities and required qualifications." value={jdText} onChange={e => setJdText(e.target.value)} className="min-h-[300px]" />
        <Button variant="primary" onClick={runMatch} loading={matching} disabled={!resume?.id} className="w-full" icon={SearchCode}>Analyze Match</Button>
      </Card>
      <Card className="p-6 min-h-[300px] space-y-5">
        {results ? <>
          <div><h2 className="text-sm font-bold text-white">Resume alignment</h2><p className="text-xs text-gray-400">Skill coverage: {results.skill_coverage}% · Semantic similarity: {Math.round((results.semantic_similarity || 0) * 100)}%</p><p className="text-[10px] text-gray-500 mt-1">Semantic engine: {results.embedding_engine || 'unavailable'}</p></div>
          {[['Skills found in resume', results.matched_skills || [], 'success'], ['Partial matches', results.partial_skills || [], 'primary'], ['JD skills not found', results.missing_skills || [], 'danger']].map(([label, values, variant]) => <section key={label}><h3 className="text-[11px] font-bold text-gray-400 uppercase mb-2">{label}</h3><div className="flex flex-wrap gap-1.5">{values.length ? values.map(skill => <Badge key={skill} variant={variant} size="sm">{skill}</Badge>) : <span className="text-xs text-gray-500">None identified</span>}</div></section>)}
          <p className="text-[11px] text-gray-500 border-t border-white/[0.06] pt-3">Coverage is based on skills extracted from this job description and your parsed resume. It is a screening aid, not a hiring probability.</p>
        </> : <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center text-gray-500"><SearchCode className="h-8 w-8 mb-3"/><h2 className="text-sm font-semibold text-white">No match analysis yet</h2><p className="text-xs max-w-xs mt-1">Paste a job description and run the analysis to see skills found, partial matches, and gaps.</p></div>}
      </Card>
    </div>
  </div>;
}
