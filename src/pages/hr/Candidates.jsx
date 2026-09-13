import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import {
  Mail, Phone, Calendar, UserCheck, XCircle, Search, Filter,
  Briefcase, Eye, ShieldAlert, CheckSquare, Square, Users,
  X, Check, Sparkles, Award, ArrowRight, Layers
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Candidates() {
  const { candidates, campaigns, selectedCampaignId, setSelectedCampaignId, setCandidateStatus } = useHrStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0] || null);

  // Candidate comparison state (up to 3)
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleStatusChange = (candId, status) => {
    setCandidateStatus(candId, status);
    toast.success(`Candidate status updated: ${status}`);
    setSelectedCandidate(prev => prev && prev.id === candId ? { ...prev, status } : prev);
  };

  const toggleCompare = (candId, e) => {
    e?.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(candId)) {
        return prev.filter(id => id !== candId);
      }
      if (prev.length >= 3) {
        toast.error('You can compare a maximum of 3 candidates simultaneously.');
        return prev;
      }
      return [...prev, candId];
    });
  };

  // Filter candidates matching current selected campaign + search term + status + score
  const filteredCandidates = candidates.filter(cand => {
    const matchesCampaign = !selectedCampaignId || cand.appliedCampaignId === selectedCampaignId;
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || cand.status === statusFilter;
    const matchesScore = cand.matchScore >= minScoreFilter;

    return matchesCampaign && matchesSearch && matchesStatus && matchesScore;
  });

  const candidatesToCompare = candidates.filter(c => compareIds.includes(c.id));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Candidate Pipeline & AI Match</h1>
          <p className="text-xs text-gray-400">
            Review parsed candidate dossiers, compare applicant skills, and manage recruitment decisions.
          </p>
        </div>

        {compareIds.length >= 2 && (
          <Button
            variant="teal"
            size="sm"
            onClick={() => setIsCompareOpen(true)}
            icon={Users}
            className="animate-pulse shadow-lg shadow-teal-500/20"
          >
            Compare Candidates ({compareIds.length}/3)
          </Button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <Card className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between border border-white/[0.08] bg-obsidian-900/90">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Campaign Selector */}
          <div className="w-full sm:w-60">
            <Input
              type="select"
              value={selectedCampaignId}
              onChange={e => {
                setSelectedCampaignId(e.target.value);
                const firstForCamp = candidates.find(c => c.appliedCampaignId === e.target.value);
                setSelectedCandidate(firstForCamp || null);
              }}
              options={campaigns.map(c => ({ value: c.id, label: c.title }))}
            />
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-obsidian-950 border border-white/[0.08] hover:border-white/[0.12] focus:border-brand-teal rounded-lg py-1.5 pl-10 pr-4 text-xs text-gray-300 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Status and Score Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {['all', 'applied', 'shortlisted', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/30'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {st}
            </button>
          ))}

          <select
            value={minScoreFilter}
            onChange={e => setMinScoreFilter(Number(e.target.value))}
            className="bg-obsidian-950 border border-white/[0.08] text-xs text-gray-300 rounded-lg py-1.5 px-3 focus:outline-none"
          >
            <option value="0">All Match Scores</option>
            <option value="75">75%+ Fit</option>
            <option value="85">85%+ Top Fit</option>
            <option value="90">90%+ Exceptional</option>
          </select>
        </div>
      </Card>

      {/* Split Grid: List Table on Left (2/3), Details on Right (1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Candidates Table */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="overflow-hidden border border-white/[0.08] bg-obsidian-900/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-obsidian-950/60 text-gray-400">
                    <th className="px-4 py-4 w-10 text-center">Compare</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Candidate</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Experience</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">ATS Score</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(cand => {
                      const isComparing = compareIds.includes(cand.id);

                      return (
                        <tr
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                            selectedCandidate?.id === cand.id ? 'bg-brand-teal/[0.06]' : ''
                          }`}
                        >
                          <td className="px-4 py-4 text-center" onClick={e => toggleCompare(cand.id, e)}>
                            <button className="text-gray-400 hover:text-brand-teal transition-colors cursor-pointer">
                              {isComparing ? (
                                <CheckSquare className="h-4 w-4 text-brand-teal" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold text-white">{cand.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{cand.email}</p>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-300 font-medium">
                            {cand.experienceYears} Years
                          </td>

                          <td className="px-5 py-4 font-bold">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${
                              cand.matchScore >= 85
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : cand.matchScore >= 70
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}>
                              {cand.matchScore}% Match
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(cand);
                              }}
                              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/[0.05]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">
                        No candidates matching the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Candidate Profile Scorecard */}
        <div>
          {selectedCandidate ? (
            <Card className="p-6 space-y-6 sticky top-24 border border-white/[0.08] bg-obsidian-900/90">
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-white/[0.06]">
                <div className="h-16 w-16 bg-brand-teal/15 border border-brand-teal/30 text-teal-300 rounded-2xl flex items-center justify-center font-bold text-2xl uppercase">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{selectedCandidate.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedCandidate.education}</p>
                  <p className="text-[11px] text-brand-teal mt-1 font-semibold">
                    {selectedCandidate.experienceYears} Years Exp • {selectedCandidate.location}
                  </p>
                </div>
              </div>

              {/* Fit highlights summary */}
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-brand-teal" /> AI Screening Summary
                  </p>
                  <p className="text-gray-300 leading-relaxed bg-obsidian-950/80 p-3 rounded-xl border border-white/[0.06]">
                    {selectedCandidate.analysis?.summary}
                  </p>
                </div>

                {/* Candidate Skills Pills */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Verified Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills?.map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-xl">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" /> Strengths
                    </p>
                    <ul className="space-y-1 text-gray-300 text-[11px]">
                      {selectedCandidate.analysis?.pros?.map((pro, i) => (
                        <li key={i} className="list-disc list-inside">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-rose-500/[0.04] border border-rose-500/20 rounded-xl">
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Gaps
                    </p>
                    <ul className="space-y-1 text-gray-300 text-[11px]">
                      {selectedCandidate.analysis?.cons?.map((con, i) => (
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
                  className="w-1/2 text-rose-400 border-rose-500/20 hover:bg-rose-500/10 text-xs"
                  icon={XCircle}
                >
                  Reject
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => handleStatusChange(selectedCandidate.id, 'shortlisted')}
                  disabled={selectedCandidate.status === 'shortlisted'}
                  className="w-1/2 text-xs"
                  icon={UserCheck}
                >
                  Shortlist
                </Button>
              </div>
            </Card>
          ) : (
            <div className="border border-dashed border-white/[0.08] rounded-xl p-8 text-center text-gray-500 bg-obsidian-900/30 min-h-[250px] flex items-center justify-center">
              Select a candidate row to load analytical scorecard.
            </div>
          )}
        </div>
      </div>

      {/* Candidate Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/[0.1] rounded-2xl max-w-5xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-teal">
                  Side-by-Side Candidate Evaluation
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Comparing {candidatesToCompare.length} Candidates for {activeCampaign?.title || 'Job Opening'}
                </h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Side by side columns */}
            <div className={`grid grid-cols-1 md:grid-cols-${candidatesToCompare.length} gap-4`}>
              {candidatesToCompare.map(cand => (
                <div key={cand.id} className="p-5 rounded-xl border border-white/[0.08] bg-obsidian-950/80 space-y-4">
                  <div className="text-center pb-3 border-b border-white/[0.06]">
                    <h4 className="text-base font-bold text-white">{cand.name}</h4>
                    <p className="text-xs text-gray-400">{cand.education}</p>
                    <div className="mt-2 inline-block">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-teal/15 text-teal-300 border border-brand-teal/30">
                        {cand.matchScore}% Fit Index
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Experience</span>
                      <p className="font-semibold text-white">{cand.experienceYears} Years</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Skills Matrix</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cand.skills?.map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/[0.06]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">AI Key Strength</span>
                      <p className="text-emerald-400 text-[11px] mt-0.5">{cand.analysis?.pros?.[0]}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Identified Gap</span>
                      <p className="text-rose-400 text-[11px] mt-0.5">{cand.analysis?.cons?.[0]}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex gap-2">
                    <Button
                      variant="teal"
                      size="sm"
                      onClick={() => handleStatusChange(cand.id, 'shortlisted')}
                      className="w-full text-xs"
                    >
                      Shortlist
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/[0.08]">
              <Button variant="outline" size="sm" onClick={() => setIsCompareOpen(false)}>
                Done Comparing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
