import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHrStore } from '../../store/hrStore';
import {
  Plus, Briefcase, MapPin, Sparkles, Building, Settings,
  Check, Trash2, ArrowUpRight, Users, CheckCircle2,
  Clock, Filter
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Jobs() {
  const navigate = useNavigate();
  const { campaigns, createCampaign, setSelectedCampaignId } = useHrStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [desc, setDesc] = useState('');

  // Coordinated weights totaling exactly 100%
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 35,
    education: 15,
    formatting: 10
  });

  const handleWeightChange = (key, value) => {
    const val = Math.max(0, Math.min(100, Number(value)));
    setWeights(prev => {
      const remaining = 100 - val;
      const otherKeys = Object.keys(prev).filter(k => k !== key);
      const currentOtherSum = otherKeys.reduce((sum, k) => sum + prev[k], 0);

      const nextWeights = { ...prev, [key]: val };
      if (currentOtherSum === 0) {
        const evenShare = Math.floor(remaining / otherKeys.length);
        otherKeys.forEach((k, idx) => {
          nextWeights[k] = idx === 0 ? remaining - evenShare * (otherKeys.length - 1) : evenShare;
        });
      } else {
        let allocated = 0;
        otherKeys.forEach((k, idx) => {
          if (idx === otherKeys.length - 1) {
            nextWeights[k] = Math.max(0, remaining - allocated);
          } else {
            const share = Math.round((prev[k] / currentOtherSum) * remaining);
            nextWeights[k] = Math.max(0, share);
            allocated += share;
          }
        });
      }
      return nextWeights;
    });
  };

  const handleLaunch = async (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error('Title and Description are required.');
      return;
    }

    setLoading(true);
    toast.loading('Analyzing JD parameters to auto-generate matching keywords...', { id: 'camp' });

    await createCampaign({
      title,
      department: dept,
      location,
      description: desc,
      weights
    });

    // Reset form
    setTitle('');
    setDesc('');
    setWeights({ skills: 40, experience: 35, education: 15, formatting: 10 });
    setIsOpen(false);
    setLoading(false);
    toast.success('Hiring Campaign launched successfully!', { id: 'camp' });
  };

  const handleNavigateToPipeline = (campaignId) => {
    setSelectedCampaignId(campaignId);
    navigate('/hr/candidates');
  };

  const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Job Campaigns & ATS Weighting</h1>
          <p className="text-xs text-gray-400">
            Configure matching criteria and coordinated weight matrices for candidate evaluations.
          </p>
        </div>
        <Button variant="teal" size="sm" onClick={() => setIsOpen(true)} icon={Plus}>
          Launch Job Campaign
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map(camp => {
          const shortlisted = camp.shortlistedCount || Math.floor((camp.applicantsCount || 4) / 3);
          const interviews = Math.floor(shortlisted / 2);

          return (
            <Card key={camp.id} hoverEffect className="p-6 flex flex-col justify-between h-auto min-h-[280px] border border-white/[0.08] bg-obsidian-900/90">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2.5 py-0.5 rounded border border-brand-teal/20">
                    {camp.department}
                  </span>
                  <Badge variant={camp.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {camp.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white font-heading truncate">{camp.title}</h3>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-500" /> {camp.location}</span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{camp.description}</p>

                {/* Candidate Funnel Statistics */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                  <div>
                    <p className="text-xs font-bold text-white">{camp.applicantsCount || 0}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Applicants</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400">{shortlisted}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Shortlisted</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-teal">{interviews}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Interviews</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs mt-3">
                <span className="text-[11px] text-gray-400">
                  Weights: <span className="text-gray-300 font-semibold">{camp.weights?.skills || 40}% skills</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigateToPipeline(camp.id)}
                  className="text-brand-teal hover:text-teal-300 !py-1 text-xs"
                  icon={ArrowUpRight}
                >
                  Candidate Pipeline
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Launch New Hiring Campaign"
        size="lg"
        footerActions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="teal" size="sm" onClick={handleLaunch} loading={loading}>Launch Campaign</Button>
          </>
        }
      >
        <form onSubmit={handleLaunch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Position Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
            <Input
              label="Department"
              type="select"
              value={dept}
              onChange={e => setDept(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product', label: 'Product Development' },
                { value: 'Design', label: 'UI/UX Design' },
                { value: 'Operations', label: 'Operations' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Work Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Chennai (Hybrid), Remote"
            />
          </div>

          <Input
            type="textarea"
            label="Job Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Paste technical requirements and expectations here. ATS matching keywords are extracted automatically upon creation."
            className="min-h-[120px]"
            required
          />

          {/* Coordinated Weights Sliders */}
          <div className="pt-3 space-y-3.5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-brand-teal" />
                <span>Coordinated ATS Weights (Must total 100%)</span>
              </p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                totalWeights === 100 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                Total: {totalWeights}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                  <span>Core Skills</span>
                  <span className="text-brand-teal font-bold">{weights.skills}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.skills}
                  onChange={e => handleWeightChange('skills', e.target.value)}
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                  <span>Experience Tenure</span>
                  <span className="text-brand-teal font-bold">{weights.experience}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.experience}
                  onChange={e => handleWeightChange('experience', e.target.value)}
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                  <span>Education Relevance</span>
                  <span className="text-brand-teal font-bold">{weights.education}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.education}
                  onChange={e => handleWeightChange('education', e.target.value)}
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                  <span>Formatting & Structure</span>
                  <span className="text-brand-teal font-bold">{weights.formatting}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.formatting}
                  onChange={e => handleWeightChange('formatting', e.target.value)}
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
