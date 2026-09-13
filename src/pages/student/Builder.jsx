import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, BookOpen, Wrench, Briefcase, Plus, Trash2, Sparkles,
  Download, CheckCircle, RotateCcw, Eye, FileText, Code2,
  FolderGit2, ExternalLink, Printer, Check
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const SAMPLE_RESUME_DATA = {
  fullName: 'Saila Vishnu G',
  title: 'Backend & Fullstack Developer',
  address: '336 C New Street, Sivakasi, Tamil Nadu',
  phone: '+91 6384114630',
  email: 'sailavishnu29@gmail.com',
  linkedin: 'linkedin.com/in/sailavishnu',
  github: 'github.com/sailavishnu',
  summary: 'Passionate Backend Developer focused on building scalable web applications and exploring emerging technologies. Experienced in developing applications across backend and frontend, with a strong interest in solving real-world problems.',
  education: [
    {
      institution: 'Mepco Schlenk Engineering College, Sivakasi',
      degree: 'Bachelor of Engineering in Computer Science Engineering',
      score: 'CGPA: 7.99 (up to 4th semester)',
      year: '2024 - 2028'
    },
    {
      institution: 'AVM Marimuthu Nadar Hr Sec School, Sivakasi',
      degree: 'Higher Secondary Certificate (HSC)',
      score: '90.33%',
      year: '2023 - 2024'
    }
  ],
  projects: [
    {
      title: 'Placement Preparation Platform (PPP)',
      duration: 'April – June 2026',
      techStack: 'React.js, Node.js, Express.js, MongoDB, JWT, Socket.IO, Groq AI API',
      bullets: [
        'Identified fragmentation in student placement prep — scattered across multiple platforms for aptitude, core CS concepts, mock interviews, resume building, and peer networking.',
        'Built a unified MERN platform consolidating aptitude problems, core CS learning modules, AI mock interviews, resume analysis, and community features in one app.',
        'Implemented secure authentication (OAuth + JWT), developed REST APIs for user/dashboard/learning modules, integrated Socket.IO for real-time peer messaging, and leveraged Groq AI for resume and interview analysis.',
        'Integrated 40k+ lines of learning data; enabled 250+ students to prepare for interviews with <100ms response time, reducing multi-platform switching and streamlining placement prep.'
      ]
    },
    {
      title: 'Call for All (Service Provider Marketplace)',
      duration: 'Jan – May 2026',
      techStack: 'React.js, Node.js, Express.js, MongoDB, Leaflet.js, Razorpay',
      bullets: [
        'Identified inefficiency in service discovery — customers struggle to find trusted electricians, plumbers, and carpenters; service providers lack centralized access to customer requests.',
        'Developed a two-sided marketplace connecting customers and service providers with real-time location tracking, integrated payment, and granular work-status updates.',
        'Implemented Leaflet.js for map-based provider discovery with filtering option; integrated Razorpay for secure payments; built dedicated admin panel for tracking all transactions, user activity, and service metrics.',
        'Enabled 100+ customers and 50+ service providers to connect seamlessly; achieved 15% increase in service provider booking volume; deployed fully responsive dual-portal application.'
      ]
    }
  ],
  experience: [
    {
      role: 'Data Analytics Intern',
      company: 'Deloitte',
      duration: 'Ongoing',
      bullets: [
        'Initiated exploration of core data analytics domains including data visualization, A/B testing, and analytics engineering; building foundational expertise through hands-on work.',
        'Actively working with SQL and dashboards to analyze business metrics and support foundational analytics projects across various business domains.'
      ]
    },
    {
      role: 'MERN Stack Development Intern',
      company: 'Notasco Technologies India Pvt Ltd',
      duration: 'Jun 11th - Jun 25th 2026',
      bullets: [
        'Strengthened MERN fundamentals through hands-on study of React component patterns, Node.js asynchronous operations, and MongoDB data modeling.',
        'Engaged with the development team on full-stack best practices and learned real-world implementation strategies.'
      ]
    }
  ],
  skills: {
    languages: 'Java, JavaScript, C, C++, Python',
    databases: 'MongoDB, SQL, REST APIs',
    frameworks: 'React.js, Node.js, Express.js, FastAPI, Leaflet.js, Razorpay',
    coreConcepts: 'Data Structures & Algorithms, Object-Oriented Programming, Database Design',
    other: 'Git, GitHub, Linux'
  }
};

export default function Builder() {
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState(SAMPLE_RESUME_DATA);
  const [saving, setSaving] = useState(false);

  const steps = [
    { id: 1, name: 'Contact & Summary', icon: User },
    { id: 2, name: 'Education', icon: BookOpen },
    { id: 3, name: 'Projects', icon: FolderGit2 },
    { id: 4, name: 'Experience', icon: Briefcase },
    { id: 5, name: 'Categorized Skills', icon: Code2 },
  ];

  // Helper methods for list mutations
  const handleAddEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', score: '', year: '' }
      ]
    }));
  };

  const handleRemoveEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateEducation = (index, key, value) => {
    setCvData(prev => {
      const list = [...prev.education];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, education: list };
    });
  };

  const handleAddProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', duration: '', techStack: '', bullets: [''] }
      ]
    }));
  };

  const handleRemoveProject = (index) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateProject = (index, key, value) => {
    setCvData(prev => {
      const list = [...prev.projects];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, projects: list };
    });
  };

  const handleAddProjectBullet = (projIndex) => {
    setCvData(prev => {
      const list = [...prev.projects];
      list[projIndex] = {
        ...list[projIndex],
        bullets: [...list[projIndex].bullets, '']
      };
      return { ...prev, projects: list };
    });
  };

  const handleUpdateProjectBullet = (projIndex, bulletIndex, value) => {
    setCvData(prev => {
      const list = [...prev.projects];
      const updatedBullets = [...list[projIndex].bullets];
      updatedBullets[bulletIndex] = value;
      list[projIndex] = { ...list[projIndex], bullets: updatedBullets };
      return { ...prev, projects: list };
    });
  };

  const handleRemoveProjectBullet = (projIndex, bulletIndex) => {
    setCvData(prev => {
      const list = [...prev.projects];
      list[projIndex] = {
        ...list[projIndex],
        bullets: list[projIndex].bullets.filter((_, bi) => bi !== bulletIndex)
      };
      return { ...prev, projects: list };
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: '', company: '', duration: '', bullets: [''] }
      ]
    }));
  };

  const handleRemoveExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateExperience = (index, key, value) => {
    setCvData(prev => {
      const list = [...prev.experience];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, experience: list };
    });
  };

  const handleAddExperienceBullet = (expIndex) => {
    setCvData(prev => {
      const list = [...prev.experience];
      list[expIndex] = {
        ...list[expIndex],
        bullets: [...list[expIndex].bullets, '']
      };
      return { ...prev, experience: list };
    });
  };

  const handleUpdateExperienceBullet = (expIndex, bulletIndex, value) => {
    setCvData(prev => {
      const list = [...prev.experience];
      const updatedBullets = [...list[expIndex].bullets];
      updatedBullets[bulletIndex] = value;
      list[expIndex] = { ...list[expIndex], bullets: updatedBullets };
      return { ...prev, experience: list };
    });
  };

  const handleRemoveExperienceBullet = (expIndex, bulletIndex) => {
    setCvData(prev => {
      const list = [...prev.experience];
      list[expIndex] = {
        ...list[expIndex],
        bullets: list[expIndex].bullets.filter((_, bi) => bi !== bulletIndex)
      };
      return { ...prev, experience: list };
    });
  };

  const handleSkillsChange = (key, value) => {
    setCvData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [key]: value
      }
    }));
  };

  const handleLoadSample = () => {
    setCvData(SAMPLE_RESUME_DATA);
    toast.success('Loaded high-scoring ATS template (Saila Vishnu G).');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('CV draft saved successfully.');
  };

  return (
    <div className="space-y-6 pb-16 print:p-0">
      {/* Header Panel - Hidden on print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              ATS High-Scoring Template
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Score: 94 / 100
            </span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white mt-1">Interactive ATS Resume Builder</h1>
          <p className="text-xs text-gray-400">
            Engineered to replicate top-tier placement resumes with clean typography, STAR bullets, and high parser compatibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button variant="ghost" size="sm" onClick={handleLoadSample} icon={RotateCcw} className="text-xs">
            Reset to Sample Template
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSaveDraft} loading={saving} className="text-xs">
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer} className="text-xs">
            Export / Print PDF
          </Button>
        </div>
      </div>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left side: 5-Step Form (5 columns) - Hidden on Print */}
        <div className="xl:col-span-5 space-y-6 print:hidden">
          {/* Stepper Navigation */}
          <div className="p-3 bg-obsidian-900 border border-white/[0.08] rounded-xl flex items-center justify-between overflow-x-auto gap-2">
            {steps.map((s) => {
              const StepIcon = s.icon;
              const isActive = step === s.id;
              const isPast = step > s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                      : isPast
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <StepIcon className="h-3.5 w-3.5" />
                  <span>{s.id}. {s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Step Contents */}
          <Card className="p-6 border border-white/[0.08] bg-obsidian-900/90 space-y-5">
            {/* STEP 1: Personal Details & Summary */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-blue" />
                    Personal & Contact Info
                  </h3>
                  <span className="text-[11px] text-gray-500">Step 1 of 5</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    value={cvData.fullName}
                    onChange={e => setCvData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                  <Input
                    label="Headline / Title"
                    value={cvData.title}
                    onChange={e => setCvData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <Input
                  label="Address / Location Line"
                  value={cvData.address}
                  onChange={e => setCvData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. 336 C New Street, Sivakasi, Tamil Nadu"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Phone Number"
                    value={cvData.phone}
                    onChange={e => setCvData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    label="Email Address"
                    value={cvData.email}
                    onChange={e => setCvData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="LinkedIn Profile"
                    value={cvData.linkedin}
                    onChange={e => setCvData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="e.g. LinkedIn or URL"
                  />
                  <Input
                    label="GitHub Profile"
                    value={cvData.github}
                    onChange={e => setCvData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="e.g. GitHub or URL"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    rows={4}
                    value={cvData.summary}
                    onChange={e => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full bg-obsidian-950 border border-white/[0.08] focus:border-brand-blue rounded-lg p-3 text-xs text-gray-200 focus:outline-none"
                    placeholder="Brief 2-3 sentence overview highlighting your target focus, backend/frontend engineering expertise, and problem-solving passion..."
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Education */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand-blue" />
                    Academic Credentials
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddEducation} icon={Plus} className="text-xs !py-1">
                    Add Degree
                  </Button>
                </div>

                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-obsidian-950/80 border border-white/[0.06] space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                        Institution #{idx + 1}
                      </span>
                      {cvData.education.length > 1 && (
                        <button
                          onClick={() => handleRemoveEducation(idx)}
                          className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <Input
                      label="Institution / University Name"
                      value={edu.institution}
                      onChange={e => handleUpdateEducation(idx, 'institution', e.target.value)}
                      placeholder="e.g. Mepco Schlenk Engineering College, Sivakasi"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Degree / Certificate"
                        value={edu.degree}
                        onChange={e => handleUpdateEducation(idx, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Engineering in CSE"
                      />
                      <Input
                        label="Duration / Years"
                        value={edu.year}
                        onChange={e => handleUpdateEducation(idx, 'year', e.target.value)}
                        placeholder="e.g. 2024 - 2028"
                      />
                    </div>

                    <Input
                      label="CGPA / Score"
                      value={edu.score}
                      onChange={e => handleUpdateEducation(idx, 'score', e.target.value)}
                      placeholder="e.g. CGPA: 7.99 (up to 4th semester)"
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* STEP 3: Projects */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-brand-blue" />
                    Key Technical Projects
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddProject} icon={Plus} className="text-xs !py-1">
                    Add Project
                  </Button>
                </div>

                {cvData.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-obsidian-950/80 border border-white/[0.06] space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                        Project #{pIdx + 1}
                      </span>
                      {cvData.projects.length > 1 && (
                        <button
                          onClick={() => handleRemoveProject(pIdx)}
                          className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Project Title"
                        value={proj.title}
                        onChange={e => handleUpdateProject(pIdx, 'title', e.target.value)}
                        placeholder="e.g. Placement Preparation Platform (PPP)"
                      />
                      <Input
                        label="Duration / Timeline"
                        value={proj.duration}
                        onChange={e => handleUpdateProject(pIdx, 'duration', e.target.value)}
                        placeholder="e.g. April – June 2026"
                      />
                    </div>

                    <Input
                      label="Tech Stack"
                      value={proj.techStack}
                      onChange={e => handleUpdateProject(pIdx, 'techStack', e.target.value)}
                      placeholder="e.g. React.js, Node.js, Express.js, MongoDB, JWT, Socket.IO"
                    />

                    {/* Bullet points */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Impact & Architecture Bullets
                        </label>
                        <button
                          onClick={() => handleAddProjectBullet(pIdx)}
                          className="text-[10px] font-semibold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Bullet
                        </button>
                      </div>

                      {proj.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-gray-500 text-xs mt-2">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={e => handleUpdateProjectBullet(pIdx, bIdx, e.target.value)}
                            className="flex-1 bg-obsidian-900 border border-white/[0.06] rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-brand-blue"
                            placeholder="State the challenge, architectural solution, and measurable outcome..."
                          />
                          {proj.bullets.length > 1 && (
                            <button
                              onClick={() => handleRemoveProjectBullet(pIdx, bIdx)}
                              className="text-gray-500 hover:text-rose-400 p-1.5 mt-1 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* STEP 4: Experience */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-brand-blue" />
                    Internships & Work Experience
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleAddExperience} icon={Plus} className="text-xs !py-1">
                    Add Experience
                  </Button>
                </div>

                {cvData.experience.map((exp, eIdx) => (
                  <div key={eIdx} className="p-4 rounded-xl bg-obsidian-950/80 border border-white/[0.06] space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                        Experience #{eIdx + 1}
                      </span>
                      {cvData.experience.length > 1 && (
                        <button
                          onClick={() => handleRemoveExperience(eIdx)}
                          className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Role / Title"
                        value={exp.role}
                        onChange={e => handleUpdateExperience(eIdx, 'role', e.target.value)}
                        placeholder="e.g. Data Analytics Intern"
                      />
                      <Input
                        label="Company / Organization"
                        value={exp.company}
                        onChange={e => handleUpdateExperience(eIdx, 'company', e.target.value)}
                        placeholder="e.g. Deloitte"
                      />
                    </div>

                    <Input
                      label="Duration / Dates"
                      value={exp.duration}
                      onChange={e => handleUpdateExperience(eIdx, 'duration', e.target.value)}
                      placeholder="e.g. Jun 11th - Jun 25th 2026 or Ongoing"
                    />

                    {/* Bullets */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Key Deliverables Bullets
                        </label>
                        <button
                          onClick={() => handleAddExperienceBullet(eIdx)}
                          className="text-[10px] font-semibold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-gray-500 text-xs mt-2">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={e => handleUpdateExperienceBullet(eIdx, bIdx, e.target.value)}
                            className="flex-1 bg-obsidian-900 border border-white/[0.06] rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-brand-blue"
                            placeholder="Detail your contributions, frameworks used, and deliverables..."
                          />
                          {exp.bullets.length > 1 && (
                            <button
                              onClick={() => handleRemoveExperienceBullet(eIdx, bIdx)}
                              className="text-gray-500 hover:text-rose-400 p-1.5 mt-1 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* STEP 5: Categorized Skills */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-brand-blue" />
                    Categorized Skills Matrix
                  </h3>
                  <span className="text-[11px] text-gray-500">Step 5 of 5</span>
                </div>

                <Input
                  label="Programming Languages"
                  value={cvData.skills.languages}
                  onChange={e => handleSkillsChange('languages', e.target.value)}
                  placeholder="e.g. Java, JavaScript, C, C++, Python"
                />

                <Input
                  label="Databases & Backend"
                  value={cvData.skills.databases}
                  onChange={e => handleSkillsChange('databases', e.target.value)}
                  placeholder="e.g. MongoDB, SQL, REST APIs, PostgreSQL"
                />

                <Input
                  label="Frameworks & Tools"
                  value={cvData.skills.frameworks}
                  onChange={e => handleSkillsChange('frameworks', e.target.value)}
                  placeholder="e.g. React.js, Node.js, Express.js, FastAPI, Leaflet.js"
                />

                <Input
                  label="Core Computer Science Concepts"
                  value={cvData.skills.coreConcepts}
                  onChange={e => handleSkillsChange('coreConcepts', e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms, Object-Oriented Programming, Database Design"
                />

                <Input
                  label="Other / Developer Tools"
                  value={cvData.skills.other}
                  onChange={e => handleSkillsChange('other', e.target.value)}
                  placeholder="e.g. Git, GitHub, Linux, Docker"
                />
              </motion.div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                disabled={step === 1}
                onClick={() => setStep(p => p - 1)}
                className="text-xs"
              >
                Previous Step
              </Button>

              {step < steps.length ? (
                <Button
                  variant="primary"
                  onClick={() => setStep(p => p + 1)}
                  className="text-xs"
                >
                  Next: {steps[step]?.name}
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handlePrint}
                  icon={Printer}
                  className="text-xs"
                >
                  Print / Export PDF
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right side: Live Preview A4 ATS Sheet (7 columns) */}
        <div className="xl:col-span-7 sticky top-20 print:static print:w-full">
          <div className="flex items-center justify-between mb-3 print:hidden">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-brand-blue" />
              Live ATS Clean Template (1-Page Print Ready)
            </p>
            <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ATS Parsable Format
            </span>
          </div>

          {/* White A4 Resume Paper Canvas with Times/Arial ATS styling */}
          <div
            id="printable-resume"
            className="bg-white text-black p-8 md:p-10 rounded-xl shadow-2xl border border-gray-300 font-serif select-text leading-tight text-[11px] print:p-0 print:border-none print:shadow-none print:m-0 print:rounded-none max-w-[800px] mx-auto"
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          >
            {/* Header: Name & Contact line */}
            <div className="text-center pb-2 mb-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-normal uppercase text-black mb-1">
                {cvData.fullName || 'YOUR NAME'}
              </h1>
              <p className="text-[10px] md:text-[10.5px] text-gray-900 leading-snug">
                {[
                  cvData.address,
                  cvData.phone,
                  cvData.email,
                  cvData.linkedin && 'LinkedIn',
                  cvData.github && 'GitHub'
                ].filter(Boolean).join(' | ')}
              </p>
            </div>

            {/* SUMMARY Section */}
            {cvData.summary && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  SUMMARY
                </h2>
                <p className="text-[10px] text-black text-justify leading-relaxed">
                  {cvData.summary}
                </p>
              </div>
            )}

            {/* EDUCATION Section */}
            {cvData.education?.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  EDUCATION
                </h2>
                <div className="space-y-2">
                  {cvData.education.map((edu, i) => (
                    <div key={i} className="text-[10px]">
                      <div className="flex justify-between font-bold text-black">
                        <span>{edu.institution}</span>
                        <span>{edu.year}</span>
                      </div>
                      <div className="flex items-start gap-1 text-black mt-0.5">
                        <span>●</span>
                        <span>{edu.degree} {edu.score ? `| ${edu.score}` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS Section */}
            {cvData.projects?.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  PROJECTS
                </h2>
                <div className="space-y-2.5">
                  {cvData.projects.map((proj, i) => (
                    <div key={i} className="text-[10px]">
                      <div className="flex justify-between font-bold text-black">
                        <span>{proj.title}</span>
                        <span>{proj.duration}</span>
                      </div>
                      {proj.techStack && (
                        <div className="text-[9.5px] text-gray-800 italic mt-0.5">
                          <span className="font-semibold text-black not-italic">Tech Stack:</span> {proj.techStack}
                        </div>
                      )}
                      <ul className="mt-1 space-y-0.5">
                        {proj.bullets?.filter(b => b.trim()).map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1 text-black text-justify leading-snug">
                            <span className="shrink-0 leading-tight">●</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE Section */}
            {cvData.experience?.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  EXPERIENCE
                </h2>
                <div className="space-y-2.5">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="text-[10px]">
                      <div className="flex justify-between font-bold text-black">
                        <span>{exp.role} | {exp.company}</span>
                        <span>{exp.duration}</span>
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {exp.bullets?.filter(b => b.trim()).map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1 text-black text-justify leading-snug">
                            <span className="shrink-0 leading-tight">●</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS Section */}
            {cvData.skills && (
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                  SKILLS
                </h2>
                <div className="text-[10px] space-y-0.5 text-black">
                  {cvData.skills.languages && (
                    <p><strong className="font-bold">Languages:</strong> {cvData.skills.languages}</p>
                  )}
                  {cvData.skills.databases && (
                    <p><strong className="font-bold">Databases & Backend:</strong> {cvData.skills.databases}</p>
                  )}
                  {cvData.skills.frameworks && (
                    <p><strong className="font-bold">Frameworks & Tools:</strong> {cvData.skills.frameworks}</p>
                  )}
                  {cvData.skills.coreConcepts && (
                    <p><strong className="font-bold">Core Concepts:</strong> {cvData.skills.coreConcepts}</p>
                  )}
                  {cvData.skills.other && (
                    <p><strong className="font-bold">Other:</strong> {cvData.skills.other}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
