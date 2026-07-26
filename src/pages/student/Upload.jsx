import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { FileUp, ShieldAlert, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import FileUpload from '../../components/shared/FileUpload';
import toast from 'react-hot-toast';

export default function Upload() {
  const { analyzeUploadedResume, analyzing, resumes } = useStudentStore();
  const navigate = useNavigate();

  const handleFileSelect = async (file) => {
    try {
      toast.loading(`Uploading ${file.name} to AI parser...`, { id: 'upload' });
      const newResume = await analyzeUploadedResume(file.name);
      toast.success('Analysis complete! ATS scorecard generated.', { id: 'upload' });
      navigate('/student/ats');
    } catch (err) {
      toast.error('Failed parsing file. Support team notified.', { id: 'upload' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold font-heading text-white">Upload Resume for AI Scorecard</h1>
        <p className="text-xs text-gray-400">Instantly evaluate formatting issues, missing keywords, and profile completeness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Console */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-white font-heading mb-4">Select Document</h3>
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={analyzing} />
          </Card>

          {/* Guidelines info */}
          <Card className="p-5 border-l-4 border-brand-rose bg-brand-rose/5">
            <div className="flex gap-3">
              <ShieldAlert className="h-5 w-5 text-brand-rose shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white font-heading">ATS Compliance Notice</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Avoid using multi-column structures, images, shapes, or tables inside your resume files. Standard applicant parsing systems (ATS) often skip text nested inside non-standard layout containers, lowering match success.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info/History */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <Sparkles className="h-4.5 w-4.5 text-brand-indigo" />
              <h4 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Analysis History</h4>
            </div>
            
            <div className="space-y-3">
              {resumes.map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    useStudentStore.getState().setSelectedResumeId(r.id);
                    navigate('/student/ats');
                  }}
                  className="p-3 bg-obsidian-950/40 hover:bg-obsidian-900 border border-white/[0.04] rounded-lg transition-colors cursor-pointer"
                >
                  <p className="text-xs font-semibold text-gray-200 truncate">{r.name}</p>
                  <div className="flex justify-between items-center mt-1.5 text-[10px] text-gray-500">
                    <span>{new Date(r.uploadDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-brand-emerald bg-brand-emerald/10 px-1 py-0.2 rounded">{r.score}% Match</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
