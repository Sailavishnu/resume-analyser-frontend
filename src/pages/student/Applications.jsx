import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Calendar, Briefcase, Building, ChevronRight, Search, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Applications() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockApplications = [
    { id: 'app-1', company: 'Vercel', role: 'Senior React Developer', date: '2026-07-22', status: 'interview' },
    { id: 'app-2', company: 'Stripe', role: 'Fullstack Engineer', date: '2026-07-18', status: 'applied' },
    { id: 'app-3', company: 'Linear', role: 'UI Platform Engineer', date: '2026-07-10', status: 'rejected' },
    { id: 'app-4', company: 'GitHub', role: 'Frontend Architect', date: '2026-06-28', status: 'offer' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return <Badge variant="primary">Applied</Badge>;
      case 'interview':
        return <Badge variant="warning">Interviewing</Badge>;
      case 'offer':
        return <Badge variant="success">Offer Received</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const filteredApps = mockApplications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (company) => {
    toast.info(`Mock Action: Details fetched for ${company} candidacy.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Job Applications Tracker</h1>
          <p className="text-xs text-gray-400">Keep tab on active applications, interview invites, and hiring results.</p>
        </div>
      </div>

      {/* Filter panel */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
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

        <div className="flex gap-2.5 w-full md:w-auto">
          {['all', 'applied', 'interview', 'offer', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors cursor-pointer
                ${filterStatus === status 
                  ? 'bg-brand-blue/10 border-brand-blue/35 text-brand-blue' 
                  : 'bg-obsidian-950 border-white/[0.06] text-gray-400 hover:text-white'
                }
              `}
            >
              {status === 'all' ? 'All Roles' : status}
            </button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-obsidian-900/40 text-gray-400">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Applied Role</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredApps.length > 0 ? (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{app.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{app.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(app.company)}
                        className="group-hover:text-white transition-colors"
                        icon={ChevronRight}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500 font-medium">
                    No applications matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
