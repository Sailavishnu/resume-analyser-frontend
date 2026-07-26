import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, Loader2, Sparkles, FolderUp, RefreshCcw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

export default function Screening() {
  const { bulkParseCandidates, parsing, campaigns, selectedCampaignId, setSelectedCampaignId } = useHrStore();
  const [filesQueue, setFilesQueue] = useState([]);
  const navigate = useNavigate();

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
    
    // Simulate updating UI status
    setFilesQueue(prev => prev.map(f => ({ ...f, status: 'parsing' })));
    
    await bulkParseCandidates(filesQueue.map(f => ({ name: f.name })));
    
    setFilesQueue(prev => prev.map(f => ({ ...f, status: 'completed' })));
    toast.success('Batch resume parsing complete! Applicants added to campaign.', { id: 'bulk' });
    
    // Redirect to applicants list after 1 second
    setTimeout(() => {
      navigate('/hr/candidates');
    }, 1200);
  };

  const activeCamp = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Bulk Resume Parser</h1>
          <p className="text-xs text-gray-400">Upload multiple CVs at once to parse details and map candidate tags automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drag Drop Area */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white font-heading mb-3">Target Campaign Link</h3>
            <div className="mb-4">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Link applicants to job position</label>
              <select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-obsidian-950 border border-white/[0.08] hover:border-white/[0.12] rounded-lg text-gray-200 focus:outline-none"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] bg-obsidian-950/40 rounded-xl p-10 cursor-pointer text-center transition-colors
                ${isDragActive ? 'border-brand-teal bg-brand-teal/5' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="p-4 bg-obsidian-800 rounded-full text-gray-400 border border-white/[0.04] mb-3">
                  <FolderUp className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-white font-heading mb-1">
                  Drag folder of resumes here
                </p>
                <p className="text-[10px] text-gray-400 max-w-xs mt-0.5">
                  Select folder containing candidate PDF and DOCX files.
                </p>
              </div>
            </div>

            {/* Start button */}
            {filesQueue.length > 0 && (
              <div className="pt-5 border-t border-white/[0.04] mt-5">
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

        {/* Upload queue list */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex justify-between">
              <span>Files Queue</span>
              <span>{filesQueue.length} Files</span>
            </h3>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {filesQueue.length > 0 ? (
                filesQueue.map((file, i) => (
                  <div key={i} className="p-2.5 bg-obsidian-950/50 rounded-lg border border-white/[0.04] flex items-center justify-between text-xs min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[120px]">{file.name}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">{file.size} MB</p>
                      </div>
                    </div>
                    <div>
                      {file.status === 'queued' && <span className="text-[9px] text-gray-500 font-semibold uppercase">Queued</span>}
                      {file.status === 'parsing' && <Loader2 className="h-3.5 w-3.5 text-brand-teal animate-spin" />}
                      {file.status === 'completed' && <CheckCircle className="h-4 w-4 text-brand-emerald" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-gray-500 text-center py-10 border border-dashed border-white/[0.06] rounded-lg">
                  No files selected. Drag documents onto the left console to start the file queues.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
