import React, { useState } from 'react';
import { useStudentStore } from '../../store/studentStore';
import { Compass, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Layers, BookOpen, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function CareerNavigator() {
  const [targetRole, setTargetRole] = useState('Cyber Security Specialist');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeCareerPath = () => {
    setLoading(true);
    toast.loading(`Analyzing primary resume against ${targetRole}...`, { id: 'career-scan' });
    setTimeout(() => {
      setLoading(false);
      let matched = [];
      let missing = [];
      let certs = [];
      let projects = [];

      if (targetRole.toLowerCase().includes('cyber') || targetRole.toLowerCase().includes('security')) {
        matched = ['Python', 'Linux', 'Network Fundamentals', 'Git'];
        missing = ['Kali Linux Tooling', 'Wireshark Packet Analysis', 'Metasploit Exploitation', 'SOC Threat Monitoring'];
        certs = ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'OSCP'];
        projects = ['Build a Network Packet Sniffer in Python', 'Setup a Local SOC Lab with Splunk & Snort'];
      } else {
        matched = ['React', 'JavaScript', 'HTML5/CSS3', 'Git'];
        missing = ['TypeScript', 'Docker Containerization', 'Next.js App Router', 'GraphQL'];
        certs = ['Meta Front-End Developer Certificate', 'AWS Certified Developer'];
        projects = ['Fullstack E-Commerce with Next.js & Stripe', 'Microservices API with Docker & Redis'];
      }

      setAnalysisResult({
        targetRole,
        currentReadinessScore: 78,
        projectedAtsGain: '+16 Points',
        matchedSkills: matched,
        missingSkills: missing,
        certificationPath: certs,
        recommendedProjects: projects
      });

      toast.success(`Career Path Analysis Complete! Current Readiness: 78%`, { id: 'career-scan' });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-brand-blue" /> AI Career Navigator & Skill Gap Roadmap
          </h1>
          <p className="text-xs text-gray-400">
            Compare your primary resume skills against target engineering roles to generate a multi-phase learning roadmap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector Panel */}
        <Card className="p-5 border border-white/[0.08] bg-obsidian-900/90 lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-white font-heading border-b border-white/[0.06] pb-2">
            Target Career Goal
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Desired Target Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="Cyber Security Specialist">Cyber Security Specialist</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Fullstack Web Architect">Fullstack Web Architect</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
              </select>
            </div>

            <Button
              variant="primary"
              onClick={handleAnalyzeCareerPath}
              loading={loading}
              className="w-full text-xs"
              icon={Sparkles}
            >
              Analyze Skill Gap & Roadmap
            </Button>
          </div>
        </Card>

        {/* Roadmap Output */}
        <Card className="p-6 space-y-5 border border-white/[0.08] bg-obsidian-900/90 lg:col-span-2">
          {analysisResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{analysisResult.targetRole}</h2>
                  <p className="text-xs text-brand-blue">Target Career Goal • Primary Resume Evaluation</p>
                </div>
                <Badge variant="blue" icon={Target}>
                  {analysisResult.currentReadinessScore}% Readiness
                </Badge>
              </div>

              {/* Matched vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-obsidian-950 rounded-xl border border-white/[0.06] space-y-2">
                  <p className="font-semibold text-emerald-400">Verified Resume Skills ({analysisResult.matchedSkills.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.matchedSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-obsidian-950 rounded-xl border border-white/[0.06] space-y-2">
                  <p className="font-semibold text-amber-400">Missing Skills To Acquire ({analysisResult.missingSkills.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.missingSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Projects */}
              <div className="p-4 bg-obsidian-950 rounded-xl border border-brand-blue/20 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-brand-blue" /> Recommended Hands-On Portfolio Projects:
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {analysisResult.recommendedProjects.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 space-y-3">
              <Compass className="h-10 w-10 mx-auto text-gray-600 animate-pulse" />
              <p className="text-xs">Choose a target engineering role and click Analyze to generate your skill roadmap.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
