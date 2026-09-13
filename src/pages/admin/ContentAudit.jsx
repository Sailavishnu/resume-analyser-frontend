import React, { useState } from 'react';
import { FileText, Briefcase, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminContentAudit() {
  const [activeTab, setActiveTab] = useState('resumes');

  const resumes = [
    { id: 1, candidate: 'Sarah Connor', file: 'Sarah_Connor_CV_2026.pdf', score: 84, date: '2026-09-12', flagged: false, role: 'Full Stack Engineer' },
    { id: 2, candidate: 'David Chen', file: 'David_Chen_Backend_Resume.pdf', score: 78, date: '2026-09-10', flagged: false, role: 'Cloud Backend Developer' },
    { id: 3, candidate: 'Michael Scott', file: 'Regional_Manager_Paper.docx', score: 42, date: '2026-09-08', flagged: true, reason: 'Non-standard layout containers, low keywords', role: 'Sales Manager' },
    { id: 4, candidate: 'Aisha Patel', file: 'Aisha_ML_AI_Intern.pdf', score: 91, date: '2026-09-06', flagged: false, role: 'Machine Learning Intern' },
  ];

  const jobs = [
    { id: 1, company: 'Stripe', title: 'Senior React Engineer', applicants: 38, atsCutoff: 75, status: 'Active', posted: '2026-09-01' },
    { id: 2, company: 'Amazon', title: 'SDE-1 Graduate Trainee', applicants: 142, atsCutoff: 80, status: 'Active', posted: '2026-08-28' },
    { id: 3, company: 'Vercel', title: 'Developer Experience Specialist', applicants: 24, atsCutoff: 70, status: 'Active', posted: '2026-09-04' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            Content Moderation & Audit Engine
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Review uploaded student CVs, ATS score compliance, and recruiter job postings.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'resumes' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('resumes')}
            icon={FileText}
          >
            Resumes Audit ({resumes.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'jobs' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('jobs')}
            icon={Briefcase}
          >
            Job Postings ({jobs.length})
          </Button>
        </div>
      </div>

      {activeTab === 'resumes' ? (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)', color: 'var(--text-faint)' }}>
                <th className="p-4">Candidate & Resume</th>
                <th className="p-4">Target Role</th>
                <th className="p-4">ATS Score</th>
                <th className="p-4">Compliance Status</th>
                <th className="p-4">Upload Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-faint)' }}>
              {resumes.map(r => (
                <tr key={r.id} className="hover:bg-[var(--nav-hover-bg)] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{r.candidate}</p>
                    <p className="text-[11px] text-brand-blue flex items-center gap-1 mt-0.5">
                      <FileText className="h-3 w-3" /> {r.file}
                    </p>
                  </td>
                  <td className="p-4 text-[11px]" style={{ color: 'var(--text-secondary)' }}>{r.role}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      r.score >= 80 ? 'bg-emerald-500/15 text-emerald-500' : r.score >= 60 ? 'bg-amber-500/15 text-amber-500' : 'bg-rose-500/15 text-rose-500'
                    }`}>
                      {r.score}%
                    </span>
                  </td>
                  <td className="p-4">
                    {r.flagged ? (
                      <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Flagged: {r.reason}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> ATS Compliant
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: 'var(--border-faint)', background: 'var(--nav-hover-bg)', color: 'var(--text-faint)' }}>
                <th className="p-4">Company & Job Title</th>
                <th className="p-4">Applicant Volume</th>
                <th className="p-4">ATS Filter Cutoff</th>
                <th className="p-4">Posting Status</th>
                <th className="p-4">Posted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-faint)' }}>
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-[var(--nav-hover-bg)] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{j.title}</p>
                    <p className="text-[11px] text-brand-blue mt-0.5">🏢 {j.company}</p>
                  </td>
                  <td className="p-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                    {j.applicants} Candidates
                  </td>
                  <td className="p-4">
                    <Badge variant="indigo">{j.atsCutoff}% Required</Badge>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                      {j.status}
                    </span>
                  </td>
                  <td className="p-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>{j.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
