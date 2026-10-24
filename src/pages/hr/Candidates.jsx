import React, { useEffect, useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Candidates() {
  const { campaigns, candidates, acceptedStudents, selectedCampaignId, setSelectedCampaignId, fetchJobs, fetchCandidates, fetchAcceptedStudents, setCandidateStatus } = useHrStore();
  const [view, setView] = useState('pipeline');
  const [busyApplicationId, setBusyApplicationId] = useState(null);

  useEffect(() => { fetchJobs().catch(e => toast.error(e.message)); fetchAcceptedStudents().catch(e => toast.error(e.message)); }, [fetchJobs, fetchAcceptedStudents]);
  useEffect(() => { if (selectedCampaignId) fetchCandidates(selectedCampaignId).catch(e => toast.error(e.message)); }, [selectedCampaignId, fetchCandidates]);

  const changeStatus = async (applicationId, status) => {
    setBusyApplicationId(applicationId);
    const statusLabels = { under_review: 'in progress', shortlisted: 'shortlisted', interview: 'interview', offer: 'offer', hired: 'accepted', rejected: 'rejected', applied: 'applied' };
    try { await setCandidateStatus(applicationId, status); toast.success(status === 'hired' ? 'Student selected and accepted; notification sent.' : `Application moved to ${statusLabels[status] || status}.`); }
    catch (e) { toast.error(e.message || 'Could not update application.'); }
    finally { setBusyApplicationId(null); }
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
      {candidates.map(candidate => {
        const isBusy = busyApplicationId === candidate.id;
        const isAccepted = candidate.status === 'hired';
        return <Card key={candidate.id} className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-white">{candidate.full_name}</h3>
              <p className="text-sm text-gray-400">{candidate.email}{candidate.phone ? ` · ${candidate.phone}` : ''}{candidate.location ? ` · ${candidate.location}` : ''}</p>
              <p className="mt-1 text-xs text-gray-500">Applied {candidate.applied_at ? new Date(candidate.applied_at).toLocaleDateString() : 'date unavailable'} · {isAccepted ? 'accepted' : candidate.status.replaceAll('_', ' ')}</p>
              {candidate.target_role && <p className="mt-2 text-xs text-gray-300">Student’s target role: {candidate.target_role}</p>}
              {candidate.skills?.length > 0 && <p className="mt-2 text-xs text-gray-300">Skills: {candidate.skills.join(', ')}</p>}
              {candidate.resume_url && <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-teal-200"><ExternalLink className="h-4 w-4" /> Review submitted resume</a>}
              {!candidate.resume_url && <p className="mt-3 text-xs text-gray-500">No resume file was attached to this application.</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`status-${candidate.id}`}>Application stage</label>
              <select id={`status-${candidate.id}`} aria-label="Application stage" value={candidate.status} disabled={isBusy || isAccepted} onChange={e => changeStatus(candidate.id, e.target.value)} className="rounded-lg border border-white/10 bg-obsidian-950 px-3 py-2 text-sm text-white">
                <option value="applied">Applied</option><option value="under_review">In progress</option><option value="shortlisted">Shortlisted</option><option value="interview">Interview</option><option value="offer">Offer</option><option value="hired">Accept student</option><option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-3">
            <span className="mr-auto text-xs text-gray-500">Review this application</span>
            <Button variant="outline" size="sm" disabled={isBusy || isAccepted || candidate.status === 'under_review'} onClick={() => changeStatus(candidate.id, 'under_review')}>In progress</Button>
            <Button variant="teal" size="sm" disabled={isBusy || isAccepted} onClick={() => changeStatus(candidate.id, 'hired')}>{isAccepted ? 'Selected' : 'Select student'}</Button>
            <Button variant="danger" size="sm" disabled={isBusy || isAccepted || candidate.status === 'rejected'} onClick={() => changeStatus(candidate.id, 'rejected')}>Reject</Button>
          </div>
        </Card>;
      })}
    </> : <>
      {acceptedStudents.length === 0 && <Card className="p-8 text-center text-gray-400">No students have been accepted to your postings yet.</Card>}
      {acceptedStudents.map(student => <Card key={`${student.student_id}-${student.job_id}`} className="p-5"><h3 className="font-semibold text-white">{student.full_name}</h3><p className="text-sm text-gray-400">{student.email}{student.phone ? ` · ${student.phone}` : ''}</p><p className="mt-2 text-sm text-gray-300">{student.job_title}{student.location ? ` · ${student.location}` : ''}</p><p className="mt-1 text-xs text-gray-500">Accepted {student.accepted_at ? new Date(student.accepted_at).toLocaleDateString() : ''}</p></Card>)}
    </>}
  </div>;
}
