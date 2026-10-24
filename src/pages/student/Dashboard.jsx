import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, SearchCode, Sparkles, Calendar } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { resumes, jobs, applications, interviews, targetRole, fetchResumes, fetchStudentData, applyToJob } = useStudentStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.allSettled([fetchResumes(), fetchStudentData()]).finally(() => setLoading(false)); }, [fetchResumes, fetchStudentData]);
  const resume = resumes.find(item => item.isPrimary) || resumes[0];
  const appliedIds = new Set(applications.map(item => String(item.jobId || item.job_id)));
  const onApply = async job => {
    try { await applyToJob(job.id || job._id); toast.success(`Application submitted for ${job.title}.`); }
    catch (error) { toast.error(error?.response?.data?.detail || error?.message || 'Application could not be submitted.'); }
  };
  return <div className="space-y-6">
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5"><div><h1 className="text-2xl font-bold text-white">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1><p className="text-sm text-gray-400 mt-1">Your student workspace, populated from your account.</p>{targetRole && <p className="text-xs text-sky-400 mt-2">Target role: {targetRole}</p>}</div><div className="flex gap-2"><Button variant="outline" onClick={() => navigate('/student/resumes')} icon={FileText}>Resume vault</Button><Button variant="primary" onClick={() => navigate('/student/analysis?tab=jdmatch')} icon={SearchCode}>Match a job</Button></div></header>
    {loading ? <Card className="p-8 text-center text-gray-400">Loading your account data…</Card> : <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['Resumes', resumes.length], ['Applications', applications.length], ['Available jobs', jobs.length], ['Interview sessions', interviews.length]].map(([label, count]) => <Card key={label} className="p-5"><p className="text-xs text-gray-400">{label}</p><p className="text-2xl font-bold text-white mt-2">{count}</p></Card>)}</div>
      <div className="grid lg:grid-cols-3 gap-5"><Card className="p-5 lg:col-span-1 space-y-3"><div className="flex items-center gap-2 text-sky-400"><FileText className="h-4 w-4" /><h2 className="font-semibold text-white">Primary resume</h2></div>{resume ? <><p className="text-sm text-white break-all">{resume.name}</p><p className="text-xs text-gray-400">ATS score: {resume.atsScore == null ? 'Not available' : `${resume.atsScore}%`}</p><Button variant="outline" size="sm" onClick={() => navigate('/student/analysis')}>Open analysis</Button></> : <><p className="text-sm text-gray-400">No resume uploaded yet.</p><Button variant="primary" size="sm" onClick={() => navigate('/student/resumes')}>Upload a resume</Button></>}</Card>
        <Card className="p-5 lg:col-span-2"><div className="flex items-center gap-2 mb-4"><Briefcase className="h-4 w-4 text-sky-400" /><h2 className="font-semibold text-white">Available jobs</h2></div>{jobs.length ? <div className="space-y-3">{jobs.slice(0, 5).map(job => { const id = String(job.id || job._id); return <div key={id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.03]"><div><p className="text-sm font-semibold text-white">{job.title}</p><p className="text-xs text-gray-400">{job.company || job.company_name || 'Company not provided'}{job.location ? ` · ${job.location}` : ''}</p>{job.required_skills?.length > 0 && <div className="flex gap-1 flex-wrap mt-2">{job.required_skills.slice(0, 5).map(skill => <Badge key={skill} size="sm">{skill}</Badge>)}</div>}</div>{appliedIds.has(id) ? <span className="text-xs text-emerald-400">Applied</span> : <Button size="sm" onClick={() => onApply({ ...job, id })} disabled={!resume}>Apply</Button>}</div> })}</div> : <p className="text-sm text-gray-400">No job postings are available right now.</p>}</Card></div>
      <Card className="p-5"><div className="flex items-center gap-2 mb-3"><Calendar className="h-4 w-4 text-violet-400" /><h2 className="font-semibold text-white">Recent interviews</h2></div>{interviews.length ? interviews.slice(0, 5).map((item, index) => <p key={item.id || item._id || index} className="text-sm text-gray-300 py-2 border-t border-white/[0.05]">{item.role || item.target_role || 'Interview session'} · {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Date unavailable'}</p>) : <p className="text-sm text-gray-400">No interview sessions recorded.</p>}</Card>
    </>}
  </div>;
}
