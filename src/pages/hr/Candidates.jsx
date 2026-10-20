import React, { useEffect, useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Candidates() {
  const { campaigns, candidates, acceptedStudents, selectedCampaignId, setSelectedCampaignId, fetchJobs, fetchCandidates, fetchAcceptedStudents, setCandidateStatus } = useHrStore();
  const [view, setView] = useState('pipeline');
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchJobs().catch(e => toast.error(e.message)); fetchAcceptedStudents().catch(e => toast.error(e.message)); }, [fetchJobs, fetchAcceptedStudents]);
  useEffect(() => { if (selectedCampaignId) fetchCandidates(selectedCampaignId).catch(e => toast.error(e.message)); }, [selectedCampaignId, fetchCandidates]);

  const changeStatus = async (applicationId, status) => {
    setBusy(true);
    try { await setCandidateStatus(applicationId, status); toast.success(status === 'hired' ? 'Student accepted; notification sent.' : `Application moved to ${status}.`); }
    catch (e) { toast.error(e.message || 'Could not update application.'); }
    finally { setBusy(false); }
  };

  return <div className="space-y-6 pb-12">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
      <div><h1 className="text-2xl font-bold text-white">Candidate Pipeline</h1><p className="text-xs text-gray-400">Review students who applied to your job postings.</p></div>
      <div className="flex gap-2"><Button variant={view === 'pipeline' ? 'teal' : 'outline'} size="sm" onClick={() => setView('pipeline')}>Pipeline</Button><Button variant={view === 'accepted' ? 'teal' : 'outline'} size="sm" onClick={() => setView('accepted')}>Accepted students ({acceptedStudents.length})</Button></div>
    </header>
    {view === 'pipeline' ? <>
      <div className="flex flex-wrap items-center gap-3"><label className="text-sm text-gray-300">Job posting</label><select value={selectedCampaignId || ''} onChange={e => setSelectedCampaignId(e.target.value || null)} className="min-w-64 rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-sm text-white"><option value="">Select a job</option>{campaigns.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}</select></div>
      {!selectedCampaignId && <Card className="p-8 text-center text-gray-400">Create a job posting to receive student applications.</Card>}
      {selectedCampaignId && candidates.length === 0 && <Card className="p-8 text-center text-gray-400">No student applications for this job yet.</Card>}
      {candidates.map(candidate => <Card key={candidate.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div><h3 className="font-semibold text-white">{candidate.full_name}</h3><p className="text-sm text-gray-400">{candidate.email}{candidate.location ? ` · ${candidate.location}` : ''}</p><p className="mt-1 text-xs text-gray-500">Applied {candidate.applied_at ? new Date(candidate.applied_at).toLocaleDateString() : ''} · {candidate.status.replaceAll('_', ' ')}</p>{candidate.skills?.length > 0 && <p className="mt-2 text-xs text-gray-300">Skills: {candidate.skills.join(', ')}</p>}</div>
        <div className="flex flex-wrap gap-2"><select aria-label="Application status" value={candidate.status} disabled={busy} onChange={e => changeStatus(candidate.id, e.target.value)} className="rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-sm text-white"><option value="applied">Applied</option><option value="under_review">Under review</option><option value="shortlisted">Shortlisted</option><option value="interview">Interview</option><option value="offer">Offer</option><option value="hired">Accept student</option><option value="rejected">Rejected</option></select></div>
      </Card>)}
    </> : <>
      {acceptedStudents.length === 0 && <Card className="p-8 text-center text-gray-400">No students have been accepted to your postings yet.</Card>}
      {acceptedStudents.map(student => <Card key={`${student.student_id}-${student.job_id}`} className="p-5"><h3 className="font-semibold text-white">{student.full_name}</h3><p className="text-sm text-gray-400">{student.email}{student.phone ? ` · ${student.phone}` : ''}</p><p className="mt-2 text-sm text-gray-300">{student.job_title}{student.location ? ` · ${student.location}` : ''}</p><p className="mt-1 text-xs text-gray-500">Accepted {student.accepted_at ? new Date(student.accepted_at).toLocaleDateString() : ''}</p></Card>)}
    </>}
  </div>;
}
