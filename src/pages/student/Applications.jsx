import React, { useState } from 'react';
import { useStudentStore } from '../../store/studentStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  Calendar, Briefcase, Building, ChevronRight, Search,
  FileText, Clock, CheckCircle2, AlertCircle, Sparkles,
  MapPin, X, MessageSquare, Plus, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Applications() {
  const { applications } = useStudentStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [localNotes, setLocalNotes] = useState({});

  const pipelineStages = [
    { id: 'all', label: 'All' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Shortlisted', label: 'Shortlisted' },
    { id: 'Interview', label: 'Interview' },
    { id: 'Offer', label: 'Offer' },
    { id: 'Rejected', label: 'Rejected' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
      case 'applied':
        return <Badge variant="primary">Applied</Badge>;
      case 'Under Review':
        return <Badge variant="info">Under Review</Badge>;
      case 'Shortlisted':
      case 'shortlisted':
        return <Badge variant="success">Shortlisted</Badge>;
      case 'Interview':
      case 'interview':
        return <Badge variant="warning">Interview</Badge>;
      case 'Offer':
      case 'offer':
        return <Badge variant="success">Offer Extended</Badge>;
      case 'Rejected':
      case 'rejected':
        return <Badge variant="danger">Not Selected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredApps = (applications || []).filter(app => {
    const matchesSearch =
      (app.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (app.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSaveNote = () => {
    if (!newNote.trim() || !selectedApp) return;
    setLocalNotes(prev => ({
      ...prev,
      [selectedApp.id]: [...(prev[selectedApp.id] || []), { date: 'Just now', text: newNote.trim() }]
    }));
    setNewNote('');
    toast.success('Private candidate note saved');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <ScrollReveal variant="fade" duration={0.5}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">Application Tracker & Pipeline</h1>
            <p className="text-xs text-gray-400">
              Track candidate submissions, automated ATS checkpoints, and recruiter decision stages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              {applications.length} Applications Tracked
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Filter panel */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/[0.08] bg-obsidian-900/90">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search company or position..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/[0.08] hover:border-white/[0.12] focus:border-brand-blue rounded-lg py-1.5 pl-10 pr-4 text-xs text-gray-300 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {pipelineStages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setFilterStatus(stage.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterStatus.toLowerCase() === stage.id.toLowerCase()
                  ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Table / List */}
      <Card className="overflow-hidden border border-white/[0.08] bg-obsidian-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-obsidian-950/60 text-gray-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Company & Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Match Index</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">CV Used</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Pipeline Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredApps.length > 0 ? (
                filteredApps.map(app => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-brand-blue group-hover:border-brand-blue/30 transition-colors">
                          <Building className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-brand-blue transition-colors">{app.role}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <span>{app.company}</span>
                            {app.location && (
                              <>
                                <span>•</span>
                                <span>{app.location}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{app.matchRate || 90}%</span>
                        <div className="w-16">
                          <AnimatedProgress value={app.matchRate || 90} type="bar" />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <FileText className="h-3.5 w-3.5 text-gray-500" />
                        <span className="truncate max-w-[140px]">{app.resumeUsed || 'Primary CV'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{app.appliedDate || 'Recent'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                        }}
                        className="group-hover:text-white transition-colors text-xs"
                        icon={ChevronRight}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">
                    No applications found in this stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">
                  Application Dossier
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedApp.role}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedApp.company} • {selectedApp.location || 'Remote'}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Application Overview Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <div>
                <p className="text-sm font-bold text-emerald-400">{selectedApp.matchRate || 92}%</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">ATS Match</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{selectedApp.status}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Stage</p>
              </div>
              <div>
                <p className="text-sm font-bold text-brand-blue">{selectedApp.appliedDate || 'Sep 2026'}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Submitted</p>
              </div>
            </div>

            {/* Recruiter / Automated Feedback Notes */}
            {selectedApp.notes && (
              <div className="p-4 rounded-xl bg-brand-blue/[0.05] border border-brand-blue/20 space-y-1">
                <p className="text-xs font-semibold text-brand-blue flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Recruiter Screening Note
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">{selectedApp.notes}</p>
              </div>
            )}

            {/* Application Milestones Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recruitment Timeline</h4>
              <div className="space-y-3 pl-2 border-l-2 border-brand-blue/30">
                {(selectedApp.timeline || [
                  { date: selectedApp.appliedDate, title: 'Application Submitted', desc: `Applied using ${selectedApp.resumeUsed}.` },
                  { date: 'Next Day', title: 'ATS Check Passed', desc: 'Matched technical keywords.' }
                ]).map((t, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-blue ring-4 ring-obsidian-900" />
                    <p className="text-xs font-bold text-white">{t.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Notes Section */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Private Interview & Follow-up Notes
              </h4>

              {/* Existing local notes */}
              {localNotes[selectedApp.id]?.map((note, nIdx) => (
                <div key={nIdx} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-gray-300">
                  <span className="text-[10px] text-gray-500 block mb-1">{note.date}</span>
                  {note.text}
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Karthik Kumar mentioned focusing on React custom hooks..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveNote()}
                  className="flex-1 bg-obsidian-950 border border-white/[0.08] focus:border-brand-blue rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none"
                />
                <Button variant="primary" size="sm" onClick={handleSaveNote} icon={Plus}>
                  Add Note
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/[0.08]">
              <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
