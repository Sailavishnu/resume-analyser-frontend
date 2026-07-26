import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { User, Mail, GraduationCap, Code, Briefcase, Plus, Edit, X, Trophy } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      title: user?.title || '',
      email: user?.email || '',
    }
  });

  const onSubmit = (data) => {
    updateProfile(data);
    setIsOpen(false);
    toast.success('Profile details updated successfully.');
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !user.skills.includes(skillInput.trim())) {
      const updatedSkills = [...user.skills, skillInput.trim()];
      updateProfile({ skills: updatedSkills });
      setSkillInput('');
      toast.success('Skill added.');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = user.skills.filter(s => s !== skillToRemove);
    updateProfile({ skills: updatedSkills });
    toast.success('Skill removed.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">My Professional Profile</h1>
          <p className="text-xs text-gray-400">Manage technical parameters, certifications, and target hiring sectors.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} icon={Edit}>
          Edit Profile Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt="User avatar"
            className="h-24 w-24 rounded-2xl object-cover border-2 border-brand-blue/30 shadow-lg"
          />
          <div>
            <h2 className="text-base font-bold text-white font-heading">{user?.name}</h2>
            <p className="text-xs text-brand-blue font-semibold mt-0.5">{user?.title}</p>
            <p className="text-[10px] text-gray-500 mt-1">{user?.email}</p>
          </div>
        </Card>

        {/* Right Side: Resume elements */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Checklist card */}
          <Card className="p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Code className="h-4 w-4 text-brand-blue" />
              <span>Core Competencies & Skills</span>
            </h3>

            {/* Input field */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g. GraphQL, Tailwind CSS"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
              />
              <Button variant="outline" size="sm" onClick={handleAddSkill} icon={Plus}>Add</Button>
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map(s => (
                  <Badge key={s} variant="primary" className="flex items-center gap-1.5 py-1">
                    <span>{s}</span>
                    <button
                      onClick={() => handleRemoveSkill(s)}
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic">No skills listed yet. Add skills above.</span>
              )}
            </div>
          </Card>

          {/* Education background card */}
          <Card className="p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-brand-indigo" />
              <span>Education Background</span>
            </h3>
            
            <div className="space-y-4">
              <div className="text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>B.S. in Computer Science</span>
                  <span className="text-gray-500">2021 - 2024</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">UCLA (University of California, Los Angeles)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile Details"
        footerActions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)}>Save Changes</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            id="name"
            register={register('name')}
          />
          <Input
            label="Professional Title"
            id="title"
            register={register('title')}
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            register={register('email')}
          />
        </form>
      </Modal>
    </div>
  );
}
