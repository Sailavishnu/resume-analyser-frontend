import React, { useState } from 'react';
import { FileText, Briefcase, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Search, BarChart3, PieChart as PieIcon, Cpu } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

const CHART_TOOLTIP_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 11, borderRadius: 8 };

const KEYWORD_FREQUENCY_DATA = [
  { term: 'React / JS', occurrences: 1420 },
  { term: 'Python / ML', occurrences: 980 },
  { term: 'Cybersecurity', occurrences: 640 },
  { term: 'Kali / Wireshark', occurrences: 520 },
  { term: 'Docker / DevOps', occurrences: 760 },
  { term: 'SQL / Databases', occurrences: 1150 },
];

const COMPLIANCE_DONUT = [
  { name: 'ATS Compliant (>75%)', value: 2840, color: '#10b981' },
  { name: 'Needs Polish (60-74%)', value: 890, color: '#f59e0b' },
  { name: 'Flagged / Layout Error', value: 162, color: '#f43f5e' },
];

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
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" /> Content & Text Audit Analytics Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Audit document parsing accuracy, keyphrase frequencies, layout compliance, and ATS score distributions.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'resumes' ? 'teal' : 'outline'}
            onClick={() => setActiveTab('resumes')}
            icon={FileText}
          >
            Resumes Audit ({resumes.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'jobs' ? 'teal' : 'outline'}
            onClick={() => setActiveTab('jobs')}
            icon={Briefcase}
          >
            Job Postings ({jobs.length})
          </Button>
        </div>
      </div>

      {/* ── Graphical Text & Document Analytics Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Keyword Frequency Analysis Bar Chart */}
        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal-400" /> Parsed Technical Keyword Frequency
            </h3>
            <Badge variant="teal">NLP Extracted</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={KEYWORD_FREQUENCY_DATA} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="term" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="occurrences" fill="#0d9488" radius={[4, 4, 0, 0]} name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Content Compliance Donut Chart */}
        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-purple-400" /> Content Health
            </h3>
            <Badge variant="violet">Document Quality</Badge>
          </div>
          <div className="h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPLIANCE_DONUT} dataKey="value" cx="50%" cy="50%" innerRadius={34} outerRadius={56} paddingAngle={4}>
                  {COMPLIANCE_DONUT.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-xs">
            {COMPLIANCE_DONUT.map(item => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {activeTab === 'resumes' ? (
        <Card className="p-0 overflow-hidden border border-white/[0.08] bg-obsidian-900/90">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider bg-obsidian-950 text-gray-400">
                <th className="p-4">Candidate & Resume</th>
                <th className="p-4">Target Role</th>
                <th className="p-4">ATS Score</th>
                <th className="p-4">Compliance Status</th>
                <th className="p-4">Upload Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {resumes.map(r => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-white">{r.candidate}</p>
                    <p className="text-[11px] text-teal-400 flex items-center gap-1 mt-0.5">
                      <FileText className="h-3 w-3" /> {r.file}
                    </p>
                  </td>
                  <td className="p-4 text-[11px] text-gray-300">{r.role}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      r.score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : r.score >= 60 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {r.score}%
                    </span>
                  </td>
                  <td className="p-4">
                    {r.flagged ? (
                      <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Flagged: {r.reason}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> ATS Compliant
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[11px] text-gray-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden border border-white/[0.08] bg-obsidian-900/90">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase font-bold tracking-wider bg-obsidian-950 text-gray-400">
                <th className="p-4">Company & Job Title</th>
                <th className="p-4">Applicant Volume</th>
                <th className="p-4">ATS Filter Cutoff</th>
                <th className="p-4">Posting Status</th>
                <th className="p-4">Posted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-white">{j.title}</p>
                    <p className="text-[11px] text-teal-400 mt-0.5">🏢 {j.company}</p>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {j.applicants} Candidates
                  </td>
                  <td className="p-4">
                    <Badge variant="violet">{j.atsCutoff}% Required</Badge>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {j.status}
                    </span>
                  </td>
                  <td className="p-4 text-[11px] text-gray-400">{j.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
