import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Wrench, Briefcase, Plus, Trash, Sparkles, Download, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Builder() {
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState({
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    title: 'Fullstack Software Engineer',
    summary: 'Results-driven Fullstack Developer with 2+ years of experience designing and shipping scalable React/Node.js web applications in agile environments.',
    education: [
      { degree: 'B.S. in Computer Science', school: 'UCLA', year: '2024' }
    ],
    skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'SQL', 'Python'],
    experience: [
      { role: 'Frontend Intern', company: 'Tesla', duration: '2025 - Present', desc: 'Responsible for building dashboard components for internal service teams.' }
    ],
    projects: [
      { name: 'AI Resume Screener', desc: 'Developed a system parsing resumes against JD match parameters, boosting pipeline tracking.' }
    ]
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const steps = [
    { id: 1, name: 'Personal Details', icon: User },
    { id: 2, name: 'Education & Skills', icon: BookOpen },
    { id: 3, name: 'Work History', icon: Briefcase },
  ];

  const handleAddField = (field, schema) => {
    setCvData(prev => ({
      ...prev,
      [field]: [...prev[field], schema]
    }));
  };

  const handleRemoveField = (field, index) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdateListItem = (field, index, key, value) => {
    setCvData(prev => {
      const updatedList = [...prev[field]];
      updatedList[index] = { ...updatedList[index], [key]: value };
      return { ...prev, [field]: updatedList };
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleExport = () => {
    toast.success('Mock Export: PDF downloaded successfully.');
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success('CV draft saved successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Interactive CV Builder</h1>
          <p className="text-xs text-gray-400">Fill in your information and check the formatting live on the preview sheet.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleSaveDraft} loading={saving}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={handleExport} icon={Download}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Left side: Stepper Form */}
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between p-4 bg-obsidian-900 border border-white/[0.06] rounded-xl">
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    onClick={() => setStep(s.id)}
                    className={`
                      h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                      ${step === s.id 
                        ? 'bg-brand-blue text-white shadow-md' 
                        : step > s.id 
                          ? 'bg-brand-emerald/20 text-brand-emerald' 
                          : 'bg-obsidian-850 text-gray-500'
                      }
                    `}
                  >
                    {step > s.id ? <CheckCircle className="h-4 w-4" /> : s.id}
                  </div>
                  <span className={`text-[11px] font-semibold hidden md:inline ${step === s.id ? 'text-white' : 'text-gray-500'}`}>
                    {s.name}
                  </span>
                  {idx < steps.length - 1 && <span className="h-0.5 w-6 bg-white/[0.04] hidden md:inline" />}
                </div>
              );
            })}
          </div>

          {/* Form Step Contents */}
          <Card className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="text-sm font-bold text-white font-heading mb-4">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={cvData.firstName}
                    onChange={e => setCvData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    label="Last Name"
                    value={cvData.lastName}
                    onChange={e => setCvData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  label="Target Job Title"
                  value={cvData.title}
                  onChange={e => setCvData(prev => ({ ...prev, title: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    value={cvData.email}
                    onChange={e => setCvData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    label="Phone"
                    value={cvData.phone}
                    onChange={e => setCvData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <Input
                  label="Location"
                  value={cvData.location}
                  onChange={e => setCvData(prev => ({ ...prev, location: e.target.value }))}
                />
                <Input
                  type="textarea"
                  label="Professional Summary"
                  value={cvData.summary}
                  onChange={e => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center justify-between">
                    <span>Education Details</span>
                    <Button variant="outline" size="sm" onClick={() => handleAddField('education', { degree: '', school: '', year: '' })} className="!py-1 text-xs">
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </h3>
                  {cvData.education.map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-3 items-end p-3 bg-obsidian-950/40 rounded-lg border border-white/[0.04] mb-3">
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={e => handleUpdateListItem('education', idx, 'degree', e.target.value)}
                      />
                      <Input
                        label="School"
                        value={edu.school}
                        onChange={e => handleUpdateListItem('education', idx, 'school', e.target.value)}
                      />
                      <div className="flex gap-2 items-center">
                        <Input
                          label="Grad Year"
                          value={edu.year}
                          onChange={e => handleUpdateListItem('education', idx, 'year', e.target.value)}
                        />
                        <Button variant="ghost" onClick={() => handleRemoveField('education', idx)} className="text-brand-rose !p-2 mt-4 hover:bg-brand-rose/10 rounded-lg">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.06] pt-5">
                  <h3 className="text-sm font-bold text-white font-heading mb-3">Skills List</h3>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="e.g. Docker, TypeScript"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button variant="outline" onClick={handleAddSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map(s => (
                      <Badge key={s} variant="primary" className="flex items-center gap-1.5 py-1">
                        {s}
                        <Trash className="h-3 w-3 cursor-pointer hover:text-white text-gray-400" onClick={() => handleRemoveSkill(s)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center justify-between">
                    <span>Professional Work Experience</span>
                    <Button variant="outline" size="sm" onClick={() => handleAddField('experience', { role: '', company: '', duration: '', desc: '' })} className="!py-1 text-xs">
                      <Plus className="h-3 w-3" /> Add Role
                    </Button>
                  </h3>
                  {cvData.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-obsidian-950/40 rounded-lg border border-white/[0.04] mb-3 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          label="Job Title"
                          value={exp.role}
                          onChange={e => handleUpdateListItem('experience', idx, 'role', e.target.value)}
                        />
                        <Input
                          label="Company"
                          value={exp.company}
                          onChange={e => handleUpdateListItem('experience', idx, 'company', e.target.value)}
                        />
                        <Input
                          label="Duration"
                          value={exp.duration}
                          onChange={e => handleUpdateListItem('experience', idx, 'duration', e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 items-start">
                        <Input
                          type="textarea"
                          label="Role Details"
                          value={exp.desc}
                          onChange={e => handleUpdateListItem('experience', idx, 'desc', e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="ghost" onClick={() => handleRemoveField('experience', idx)} className="text-brand-rose !p-2 mt-6 hover:bg-brand-rose/10 rounded-lg">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center border-t border-white/[0.06] pt-4 mt-6">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep(p => p - 1)} className="text-xs">
                Previous Step
              </Button>
              <Button variant="secondary" disabled={step === steps.length} onClick={() => setStep(p => p + 1)} className="text-xs">
                Next Step
              </Button>
            </div>
          </Card>
        </div>

        {/* Right side: Live Preview A4 mock canvas sheet */}
        <div className="sticky top-24">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Live CV Preview</p>
          <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl min-h-[640px] border border-gray-200 font-sans select-none overflow-hidden relative">
            
            {/* CV Title Header */}
            <div className="border-b-2 border-gray-300 pb-4 mb-5">
              <h2 className="text-2xl font-bold font-heading tracking-tight text-gray-900 uppercase">
                {cvData.firstName} {cvData.lastName}
              </h2>
              <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mt-0.5">{cvData.title}</p>
              
              {/* Contact grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-2 text-[10px] text-gray-500 mt-2.5 font-medium">
                <div>Email: {cvData.email}</div>
                <div>Phone: {cvData.phone}</div>
                <div>Location: {cvData.location}</div>
              </div>
            </div>

            {/* Summary */}
            {cvData.summary && (
              <div className="mb-5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Summary
                </h4>
                <p className="text-[10px] text-gray-600 leading-relaxed font-normal">{cvData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.length > 0 && (
              <div className="mb-5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Experience
                </h4>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className="mb-3 text-[10px]">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>{exp.role || 'New Role'} @ {exp.company || 'Company'}</span>
                      <span className="text-gray-500 font-medium">{exp.duration}</span>
                    </div>
                    <p className="text-gray-500 mt-0.5 leading-relaxed font-normal">{exp.desc || 'Details...'}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <div className="mb-5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-medium text-gray-700">
                  {cvData.skills.map(s => (
                    <span key={s} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <div className="mb-5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900 border-b border-gray-200 pb-1 mb-2">
                  Education
                </h4>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-[10px] text-gray-700">
                    <div>
                      <span className="font-semibold">{edu.degree || 'Degree'}</span>
                      <span className="text-gray-500"> — {edu.school || 'School'}</span>
                    </div>
                    <span className="text-gray-500 font-semibold">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
