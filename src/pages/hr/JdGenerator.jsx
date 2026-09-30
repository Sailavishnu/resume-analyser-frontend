import React, { useState } from 'react';
import { useHrStore } from '../../store/hrStore';
import { Sparkles, FileText, CheckCircle2, Copy, ArrowRight, Layers, DollarSign, Brain } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function JdGenerator() {
  const { createCampaign, parsing } = useHrStore();
  const [roleTitle, setRoleTitle] = useState('Cyber Security Specialist');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Senior Level (3+ Yrs)');
  const [department, setDepartment] = useState('Information Security');
  const [generatedResult, setGeneratedResult] = useState(null);

  const handleGenerateJD = () => {
    toast.loading(`Generating ATS-Optimized JD for ${roleTitle}...`, { id: 'jd-gen' });
    setTimeout(() => {
      let keywords = [];
      let reqSkills = [];
      let prefSkills = [];
      let desc = '';

      if (roleTitle.toLowerCase().includes('cyber') || roleTitle.toLowerCase().includes('security')) {
        keywords = ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Penetration Testing', 'Burp Suite', 'SOC Analysis', 'Firewalls', 'CEH'];
        reqSkills = ['Network Defense & Auditing', 'Vulnerability Assessment', 'Kali Linux Tooling', 'Incident Response'];
        prefSkills = ['Certified Ethical Hacker (CEH)', 'Python Automation', 'Cloud Security (AWS/Azure)'];
        desc = `We are seeking a highly skilled Cyber Security Specialist to safeguard our enterprise infrastructure. The ideal candidate will conduct vulnerability assessments, penetration testing with Kali Linux & Metasploit, and monitor network traffic via Wireshark.`;
      } else if (roleTitle.toLowerCase().includes('data') || roleTitle.toLowerCase().includes('ai')) {
        keywords = ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'FAISS', 'RAG Architecture'];
        reqSkills = ['Python Machine Learning Stack', 'Model Training & Evaluation', 'Vector Database Indexing'];
        prefSkills = ['Deep Learning Transformers', 'Docker & API Deployment', 'MLOps'];
        desc = `Join our AI Lab to design state-of-the-art machine learning models and semantic vector search engines. You will build end-to-end data pipelines using Python, PyTorch, and FAISS.`;
      } else {
        keywords = ['React 18', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST APIs', 'Docker', 'Tailwind CSS'];
        reqSkills = ['Full Stack JavaScript/TypeScript', 'React Hooks Architecture', 'RESTful API Design & MongoDB'];
        prefSkills = ['Next.js App Router', 'GraphQL', 'AWS Deployment'];
        desc = `Looking for an ambitious Fullstack Web Developer to lead component design and API microservices. You will collaborate with product teams to build fast, intuitive user experiences.`;
      }

      setGeneratedResult({
        title: roleTitle,
        department,
        experienceLevel,
        description: desc,
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        targetKeywords: keywords,
        salaryBenchmark: roleTitle.toLowerCase().includes('cyber') ? '$95,000 - $135,000 USD / Yr' : '$90,000 - $130,000 USD / Yr',
        suggestedInterviewQuestions: [
          `Walk me through a complex technical hurdle in ${roleTitle} and how you diagnosed root cause.`,
          `How do you handle architectural trade-offs between performance and security?`,
          `What eviction or optimization strategies do you employ when scaling system throughput?`
        ]
      });
      toast.success('ATS Job Description & Keywords Generated!', { id: 'jd-gen' });
    }, 1200);
  };

  const handleCreateOpening = async () => {
    if (!generatedResult) return;
    await createCampaign({
      title: generatedResult.title,
      department: generatedResult.department,
      description: generatedResult.description
    });
    toast.success('Job Opening created and published to campaign list!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-brand-teal" /> AI Job Description Generator & Requirement Optimizer
          </h1>
          <p className="text-xs text-gray-400">
            Automatically craft ATS-friendly job descriptions, recommended target keywords, and salary benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <Card className="p-5 space-y-4 border border-white/[0.08] bg-obsidian-900/90 lg:col-span-1">
          <h3 className="text-sm font-bold text-white font-heading border-b border-white/[0.06] pb-2">
            Role Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Target Role Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                placeholder="e.g. Cyber Security Specialist"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Information Security"
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
              >
                <option>Entry Level (0-2 Yrs)</option>
                <option>Mid-Senior Level (3+ Yrs)</option>
                <option>Lead / Principal Architect (6+ Yrs)</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                variant="teal"
                onClick={handleGenerateJD}
                className="w-full text-xs"
                icon={Sparkles}
              >
                Generate ATS Job Spec
              </Button>
            </div>
          </div>
        </Card>

        {/* Result Preview */}
        <Card className="p-6 space-y-5 border border-white/[0.08] bg-obsidian-900/90 lg:col-span-2">
          {generatedResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{generatedResult.title}</h2>
                  <p className="text-xs text-brand-teal">{generatedResult.department} • {generatedResult.experienceLevel}</p>
                </div>
                <Badge variant="teal" icon={DollarSign}>
                  {generatedResult.salaryBenchmark}
                </Badge>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Job Summary & Impact</h4>
                <p className="text-xs text-gray-300 leading-relaxed p-3 bg-obsidian-950 rounded-xl border border-white/[0.06]">
                  {generatedResult.description}
                </p>
              </div>

              {/* Target Keywords */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target ATS Keywords (For Resume Matching)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {generatedResult.targetKeywords.map(kw => (
                    <span key={kw} className="text-xs px-2.5 py-1 rounded-lg bg-brand-teal/15 text-brand-teal border border-brand-teal/30 font-semibold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Required vs Preferred */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-obsidian-950 rounded-xl border border-white/[0.06] space-y-1">
                  <p className="font-semibold text-emerald-400">Required Technical Skills:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {generatedResult.requiredSkills.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-3 bg-obsidian-950 rounded-xl border border-white/[0.06] space-y-1">
                  <p className="font-semibold text-teal-300">Preferred Qualifications:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {generatedResult.preferredSkills.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-gray-400">Ready to post to your recruiter portal?</span>
                <Button variant="teal" size="sm" onClick={handleCreateOpening} icon={ArrowRight}>
                  Publish Opening to Pipeline
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 space-y-3">
              <Sparkles className="h-10 w-10 mx-auto text-gray-600 animate-pulse" />
              <p className="text-xs">Select role parameters on the left and click Generate to craft an ATS job description.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
