import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import {
  Users, Search, ShieldCheck, Sparkles, Filter, CheckCircle2,
  Mail, Phone, MapPin, Award, ExternalLink, UserCheck, RefreshCcw, Layers
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function TalentPool() {
  const { candidates, screenCandidatesByDomain, setCandidateStatus, parsing } = useHrStore();
  const [selectedDomain, setSelectedDomain] = useState('Cyber Security');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleDomainFilter = async (domain) => {
    setSelectedDomain(domain);
    await screenCandidatesByDomain(domain);
    toast.success(`Inter-domain scan active for ${domain}`);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchText = (c.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                      (c.skills || []).some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchText;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-teal" /> AI Talent Pool & Inter-Domain Matrix
          </h1>
          <p className="text-xs text-gray-400">
            Cross-domain candidate discovery powered by Knowledge Graph embeddings (e.g. Kali Linux ➔ Cybersecurity).
          </p>
        </div>

        <Badge variant="teal" className="text-xs py-1 px-3">
          {filteredCandidates.length} Active Candidates
        </Badge>
      </div>

      {/* Domain Matrix Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'Cyber Security', label: 'Cybersecurity & Defense', icon: ShieldCheck, color: 'emerald' },
          { key: 'Full Stack Web', label: 'Full Stack Web Dev', icon: Layers, color: 'blue' },
          { key: 'Data Science & AI', label: 'AI & Data Science', icon: Sparkles, color: 'violet' },
          { key: 'Cloud & DevOps', label: 'Cloud & DevOps Eng', icon: RefreshCcw, color: 'teal' }
        ].map(d => {
          const Icon = d.icon;
          const isSelected = selectedDomain === d.key;
          return (
            <Card
              key={d.key}
              onClick={() => handleDomainFilter(d.key)}
              className={`p-4 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-brand-teal bg-brand-teal/10 shadow-lg shadow-brand-teal/20'
                  : 'border-white/[0.08] bg-obsidian-900/80 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-teal text-white' : 'bg-obsidian-950 text-gray-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{d.label}</h4>
                  <p className="text-[10px] text-gray-400">Inter-Linked Matrix</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search Input */}
      <Card className="p-4 bg-obsidian-900/90 border border-white/[0.08] flex items-center gap-3">
        <Search className="h-4 w-4 text-brand-teal" />
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Filter candidates by tool (e.g. Kali Linux, PyTorch, Docker, React)..."
          className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
        />
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCandidates.map(c => (
          <Card key={c.id} className="p-5 border border-white/[0.08] bg-obsidian-900/90 space-y-4 hover:border-brand-teal/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 text-teal-300 font-bold text-base flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <p className="text-[11px] text-gray-400">{c.education || 'CS Engineering'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{c.email}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {c.matchScore}% Match
                </span>
                <p className="text-[9px] text-gray-500 uppercase mt-1">{c.status}</p>
              </div>
            </div>

            {/* Inter-domain rationale */}
            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-xs space-y-1">
              <p className="font-semibold text-brand-teal text-[11px]">Knowledge Graph Match Rationale:</p>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {c.rationale || c.analysis?.summary}
              </p>
              {c.discovered_linked_skills?.length > 0 && (
                <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-semibold">Discovered Tools:</span>
                  {c.discovered_linked_skills.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-gray-400">{c.location || 'Remote'}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCandidate(c)}
                  className="text-[11px] py-1 px-2.5"
                >
                  Inspect Profile
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => {
                    setCandidateStatus(c.id, 'shortlisted');
                    toast.success(`${c.name} shortlisted for campaign`);
                  }}
                  disabled={c.status === 'shortlisted'}
                  className="text-[11px] py-1 px-2.5"
                  icon={UserCheck}
                >
                  {c.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
