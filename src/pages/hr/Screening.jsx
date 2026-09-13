import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle2, Loader2, Sparkles, FolderUp,
  RefreshCcw, UserCheck, XCircle, Calendar, Eye, AlertTriangle,
  Layers, Check
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

export default function Screening() {
  const {
    bulkParseCandidates,
    parsing,
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    candidates,
    setCandidateStatus
  } = useHrStore();

  const [activeTab, setActiveTab] = useState('screening'); // 'screening' | 'bulk'
  const [filesQueue, setFilesQueue] = useState([]);
  const [rejectingCandidate, setRejectingCandidate] = useState(null);
  const navigate = useNavigate();

  const activeCamp = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const onDrop = (acceptedFiles) => {
    setFilesQueue(acceptedFiles.map(f => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2),
      status: 'queued'
    })));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleStartParsing = async () => {
    if (filesQueue.length === 0) {
      toast.error('Please drag resumes into the queue first.');
      return;
    }

    toast.loading(`Extracting ATS schemas from ${filesQueue.length} resumes...`, { id: 'bulk' });
    setFilesQueue(prev => prev.map(f => ({ ...f, status: 'parsing' })));

    await bulkParseCandidates(filesQueue.map(f => ({ name: f.name })));

    setFilesQueue(prev => prev.map(f => ({ ...f, status: 'completed' })));
    toast.success('Batch resume parsing complete! Applicants added to campaign.', { id: 'bulk' });

    setTimeout(() => {
      setActiveTab('screening');
    }, 1200);
  };

  const handleShortlist = (candId) => {
    setCandidateStatus(candId, 'shortlisted');
    toast.success('Candidate moved to Shortlisted stage');
  };

  const handleConfirmReject = () => {
    if (!rejectingCandidate) return;
    setCandidateStatus(rejectingCandidate.id, 'rejected');
    toast.error(`${rejectingCandidate.name} has been rejected`);
    setRejectingCandidate(null);
  };

  const campaignCandidates = candidates.filter(c => !selectedCampaignId || c.appliedCampaignId === selectedCampaignId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">AI Candidate Screening & Ingestion</h1>
          <p className="text-xs text-gray-400">
            Evaluate candidate match vectors, make stage decisions, or bulk parse resume folders.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-obsidian-950 border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('screening')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'screening'
                ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Candidate Screening ({campaignCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bulk'
                ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bulk Resume Parser
          </button>
        </div>
      </div>

      {/* Campaign Selector Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-medium">Job Opening:</span>
        <select
          value={selectedCampaignId}
          onChange={e => setSelectedCampaignId(e.target.value)}
          className="bg-obsidian-950 border border-white/[0.08] text-xs text-gray-200 rounded-lg py-1.5 px-3 focus:outline-none"
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.title} ({c.department})</option>
          ))}
        </select>
      </div>

      {activeTab === 'screening' ? (
        /* Screen Candidates Queue */
        <div className="space-y-4">
          {campaignCandidates.length > 0 ? (
            campaignCandidates.map(cand => (
              <Card key={cand.id} className="p-6 border border-white/[0.08] bg-obsidian-900/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-teal/15 border border-brand-teal/30 text-teal-300 font-bold text-lg flex items-center justify-center shrink-0">
                      {cand.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{cand.name}</h3>
                      <p className="text-xs text-gray-400">{cand.education} • {cand.experienceYears} Yrs Exp</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{cand.email} • {cand.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        cand.matchScore >= 85
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : cand.matchScore >= 70
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {cand.matchScore}% Match
                      </span>
                      <p className="text-[10px] text-gray-500 uppercase mt-0.5">Status: {cand.status}</p>
                    </div>
                  </div>
                </div>

                {/* AI Screening Summary */}
                <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/[0.06] text-xs space-y-2">
                  <p className="font-semibold text-brand-teal flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> AI Screening Summary
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {cand.analysis?.summary}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cand.skills?.map(sk => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/[0.06]">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Decision Actions Bar */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    Target Role: <strong className="text-gray-300">{cand.targetRole || activeCamp?.title}</strong>
                  </span>

                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRejectingCandidate(cand)}
                      disabled={cand.status === 'rejected'}
                      className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 text-xs"
                      icon={XCircle}
                    >
                      Reject
                    </Button>

                    <Button
                      variant="teal"
                      size="sm"
                      onClick={() => handleShortlist(cand.id)}
                      disabled={cand.status === 'shortlisted'}
                      className="text-xs"
                      icon={UserCheck}
                    >
                      {cand.status === 'shortlisted' ? 'Shortlisted ✓' : 'Shortlist Candidate'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center text-gray-500 border border-dashed border-white/[0.08]">
              No candidates in the screening queue for this opening.
            </Card>
          )}
        </div>
      ) : (
        /* Bulk Ingestion View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90">
              <h3 className="text-sm font-bold text-white font-heading mb-3">Target Campaign: {activeCamp?.title}</h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-white/[0.08] hover:border-brand-teal/40 bg-obsidian-950/40 rounded-xl p-10 cursor-pointer text-center transition-colors ${
                  isDragActive ? 'border-brand-teal bg-brand-teal/5' : ''
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-obsidian-800 rounded-full text-brand-teal border border-brand-teal/20 mb-3">
                    <FolderUp className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-semibold text-white font-heading mb-1">
                    Drag folder or files of resumes here
                  </p>
                  <p className="text-[10px] text-gray-400 max-w-xs mt-0.5">
                    Supports batch upload of candidate PDF and DOCX files (up to 10MB each).
                  </p>
                </div>
              </div>

              {filesQueue.length > 0 && (
                <div className="pt-5 border-t border-white/[0.06] mt-5">
                  <Button
                    variant="teal"
                    onClick={handleStartParsing}
                    loading={parsing}
                    className="w-full text-xs"
                    icon={Sparkles}
                  >
                    Start Parsing {filesQueue.length} Resumes
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Files Queue Sidebar */}
          <Card className="p-5 flex flex-col justify-between border border-white/[0.08] bg-obsidian-900/90">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Upload Queue</span>
                <span className="text-brand-teal">{filesQueue.length} Files</span>
              </h3>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filesQueue.length > 0 ? (
                  filesQueue.map((file, i) => (
                    <div key={i} className="p-2.5 bg-obsidian-950/60 rounded-lg border border-white/[0.04] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[120px]">{file.name}</p>
                          <p className="text-[9px] text-gray-500">{file.size} MB</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-teal uppercase font-semibold">{file.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-8">Queue is empty</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Rejection Confirmation Modal */}
      {rejectingCandidate && (
        <Modal
          isOpen={!!rejectingCandidate}
          onClose={() => setRejectingCandidate(null)}
          title="Confirm Candidate Rejection"
          size="sm"
          footerActions={
            <>
              <Button variant="ghost" size="sm" onClick={() => setRejectingCandidate(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReject}>
                Confirm Reject
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              <span>Are you sure you want to reject this applicant?</span>
            </div>
            <p>
              Candidate: <strong className="text-white">{rejectingCandidate.name}</strong> ({rejectingCandidate.email}).
            </p>
            <p className="text-[11px] text-gray-400">
              Their application status will be updated to "Rejected" and documented in the recruitment audit trail.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
