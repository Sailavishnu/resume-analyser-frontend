import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { Plus, Briefcase, MapPin, Sparkles, Building, Settings, Check, Trash2, ArrowUpRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Jobs() {
  const { campaigns, createCampaign, parsing } = useHrStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [desc, setDesc] = useState('');
  
  // Custom weights state sliders
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 40,
    education: 10,
    formatting: 10
  });

  const handleWeightChange = (key, value) => {
    setWeights(prev => {
      const updated = { ...prev, [key]: Number(value) };
      // Normalizing sum to 100 roughly is manual but sliders are custom.
      return updated;
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
    setWeights({ skills: 40, experience: 40, education: 10, formatting: 10 });
    setIsOpen(false);
    setLoading(false);
    toast.success('Hiring Campaign launched successfully!', { id: 'camp' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Job Campaigns Management</h1>
          <p className="text-xs text-gray-400">Configure matching weights for custom ATS evaluations.</p>
        </div>
        <Button variant="teal" size="sm" onClick={() => setIsOpen(true)} icon={Plus}>
          Launch New Job opening
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map(camp => (
          <Card key={camp.id} className="p-6 flex flex-col justify-between h-64">
            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20">
                  {camp.department}
                </span>
                <Badge variant={camp.status === 'Active' ? 'success' : 'neutral'} size="sm">
                  {camp.status}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-white font-heading truncate">{camp.title}</h3>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold mt-1">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {camp.location}</span>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-2">{camp.description}</p>
            </div>

            <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center text-[10px] text-gray-500 font-semibold">
              <span>{camp.applicantsCount} Applicants matched</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  useHrStore.getState().setSelectedCampaignId(camp.id);
                  // navigate to candidate screen
                }}
                className="text-brand-teal !py-1 text-[10px]"
                icon={ArrowUpRight}
              >
                Pipeline View
              </Button>
            </div>
          </Card>
        ))}
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
              placeholder="e.g. Senior Backend Engineer"
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
              placeholder="e.g. Remote, Austin, TX"
            />
          </div>

          <Input
            type="textarea"
            label="Job Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Paste detailed requirements here. AI will extract core matching keywords automatically on launch."
            className="min-h-[150px]"
            required
          />

          {/* Weights sliders */}
          <div className="pt-2 space-y-3.5 border-t border-white/[0.04]">
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-brand-teal" />
              <span>Configure ATS Matching Weights (%)</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Core Skills match</span>
                  <span>{weights.skills}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.skills}
                  onChange={e => handleWeightChange('skills', e.target.value)}
                  className="w-full h-1 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Experience Tenure</span>
                  <span>{weights.experience}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.experience}
                  onChange={e => handleWeightChange('experience', e.target.value)}
                  className="w-full h-1 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Education Match</span>
                  <span>{weights.education}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.education}
                  onChange={e => handleWeightChange('education', e.target.value)}
                  className="w-full h-1 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex justify-between">
                  <span>Formatting & Structure</span>
                  <span>{weights.formatting}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.formatting}
                  onChange={e => handleWeightChange('formatting', e.target.value)}
                  className="w-full h-1 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
