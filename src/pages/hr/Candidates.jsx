import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { Mail, Phone, Calendar, UserCheck, XCircle, Search, Filter, Briefcase, Eye, ShieldAlert } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Candidates() {
  const { candidates, campaigns, selectedCampaignId, setSelectedCampaignId, setCandidateStatus } = useHrStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0] || null);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleStatusChange = (candId, status) => {
    setCandidateStatus(candId, status);
    toast.success(`Candidate status updated: ${status}`);
    
    // Refresh local selected state
    setSelectedCandidate(prev => prev && prev.id === candId ? { ...prev, status } : prev);
  };

  // Filter candidates matching current selected campaign + search term
  const filteredCandidates = candidates.filter(cand => {
    const matchesCampaign = cand.appliedCampaignId === selectedCampaignId;
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCampaign && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Applicant Tracking Pipeline</h1>
          <p className="text-xs text-gray-400">Review, filter, and score candidates parsed inside campaigns.</p>
        </div>
      </div>

      {/* Filter Options */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:max-w-xs">
          <Input
            type="select"
            value={selectedCampaignId}
            onChange={e => {
              setSelectedCampaignId(e.target.value);
              // Reset selection
              const firstForCamp = candidates.find(c => c.appliedCampaignId === e.target.value);
              setSelectedCandidate(firstForCamp || null);
            }}
            options={campaigns.map(c => ({ value: c.id, label: c.title }))}
          />
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search candidate name or skill..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/[0.08] hover:border-white/[0.12] focus:border-brand-teal rounded-lg py-1.5 pl-10 pr-4 text-xs text-gray-300 focus:outline-none transition-colors"
          />
        </div>
      </Card>

      {/* Split Grid: List Table on Left (2/3), Details on Right (1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Candidates Table */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-obsidian-900/40 text-gray-400">
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Candidate</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Experience</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">ATS Score</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(cand => (
                      <tr
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className={`
                          hover:bg-white/[0.01] transition-colors cursor-pointer
                          ${selectedCandidate?.id === cand.id ? 'bg-white/[0.02]' : ''}
                        `}
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-white">{cand.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{cand.email}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-300 font-medium">
                          {cand.experienceYears} Years
                        </td>
                        <td className="px-5 py-4 font-bold">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            cand.matchScore >= 85 
                              ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/25' 
                              : cand.matchScore >= 70 
                                ? 'bg-brand-amber/10 text-brand-amber border border-brand-amber/25' 
                                : 'bg-brand-rose/10 text-brand-rose border border-brand-rose/25'
                          }`}>
                            {cand.matchScore}% Fit
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant={
                              cand.status === 'shortlisted' 
                                ? 'success' 
                                : cand.status === 'rejected' 
                                  ? 'danger' 
                                  : 'primary'
                            }
                            size="sm"
                            className="capitalize"
                          >
                            {cand.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/[0.05]">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500 font-medium">
                        No candidates listed for this campaign requirements search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Candidate Profile details scorecard card */}
        <div>
          {selectedCandidate ? (
            <Card className="p-6 space-y-6 sticky top-24">
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-white/[0.06]">
                <div className="h-16 w-16 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-2xl flex items-center justify-center font-bold text-2xl uppercase">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{selectedCandidate.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedCandidate.education}</p>
                </div>
              </div>

              {/* Fit highlights summary */}
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">AI Screen Summary</p>
                  <p className="text-gray-300 leading-relaxed bg-obsidian-950 p-2.5 rounded border border-white/[0.04]">
                    {selectedCandidate.analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-brand-emerald/5 border border-brand-emerald/15 rounded-lg">
                    <p className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Pros</p>
                    <ul className="space-y-1 text-gray-300">
                      {selectedCandidate.analysis.pros.map((pro, i) => (
                        <li key={i} className="list-disc list-inside">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-brand-rose/5 border border-brand-rose/15 rounded-lg">
                    <p className="text-[10px] text-brand-rose font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Gaps</p>
                    <ul className="space-y-1 text-gray-300">
                      {selectedCandidate.analysis.cons.map((con, i) => (
                        <li key={i} className="list-disc list-inside">{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/[0.06] flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(selectedCandidate.id, 'rejected')}
                  disabled={selectedCandidate.status === 'rejected'}
                  className="w-1/2 text-brand-rose border-brand-rose/20 hover:bg-brand-rose/10"
                  icon={XCircle}
                >
                  Reject
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => handleStatusChange(selectedCandidate.id, 'shortlisted')}
                  disabled={selectedCandidate.status === 'shortlisted'}
                  className="w-1/2"
                  icon={UserCheck}
                >
                  Shortlist
                </Button>
              </div>
            </Card>
          ) : (
            <div className="border border-dashed border-white/[0.08] rounded-xl p-8 text-center text-gray-500 bg-obsidian-900/30 min-h-[250px] flex items-center justify-center">
              Select a candidate row to load their analytical scorecard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
