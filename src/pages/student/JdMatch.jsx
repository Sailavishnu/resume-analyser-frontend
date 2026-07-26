import React, { useState } from 'react';
import { useStudentStore } from '../../store/studentStore';
import { Sparkles, FileText, SearchCode, CheckCircle, HelpCircle, Briefcase, GraduationCap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function JdMatch() {
  const { jobs, getSelectedResume } = useStudentStore();
  const [jdText, setJdText] = useState('');
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState(null);

  const resume = getSelectedResume();

  const handleMatchCalculation = async () => {
    if (!jdText.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }

    setMatching(true);
    toast.loading('Analyzing CV against Job Description keywords...', { id: 'jd' });

    // Simulate JD Parser
    await new Promise(r => setTimeout(r, 2000));

    // Dynamic generation based on matching keywords in text
    const textLower = jdText.toLowerCase();
    const targetKeywords = ['typescript', 'next.js', 'docker', 'aws', 'graphql', 'redis', 'kubernetes'];
    const matched = resume.analysis.keywords.matched.filter(k => textLower.includes(k.toLowerCase()));
    
    // Check which targets are found in JD and missing in candidate resume
    const missing = targetKeywords.filter(k => textLower.includes(k.toLowerCase()) && !resume.analysis.keywords.matched.includes(k));
    
    // Calculate a dynamic score
    const baseScore = 60;
    const finalScore = Math.min(100, baseScore + (matched.length * 5) - (missing.length * 3));

    setResults({
      score: finalScore,
      matchedKeywords: matched.length > 0 ? matched : ['React', 'JavaScript', 'SQL'],
      missingKeywords: missing.length > 0 ? missing : ['TypeScript', 'Docker', 'AWS'],
      recommendations: [
        { title: 'Docker containerization systems', link: 'Docker Hub academy' },
        { title: 'Advanced TypeScript configurations', link: 'TypeScript manuals' }
      ]
    });

    setMatching(false);
    toast.success('Alignment analysis complete!', { id: 'jd' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Job Description Matching</h1>
          <p className="text-xs text-gray-400">Paste standard JDs to extract skill gaps and compatibility ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left column: Paste Job Description */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-brand-blue" />
            <h3 className="text-sm font-bold text-white font-heading">Paste Job Description</h3>
          </div>
          
          <Input
            type="textarea"
            placeholder="Paste raw requirements text here (e.g. 'We are looking for a frontend developer who has experience in React, TypeScript, Next.js, Docker...')"
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            className="min-h-[300px]"
          />

          <Button
            variant="primary"
            onClick={handleMatchCalculation}
            loading={matching}
            className="w-full"
            icon={SearchCode}
          >
            Calculate Compatibility Match
          </Button>
        </Card>

        {/* Right column: Results screen */}
        <div className="space-y-6">
          {results ? (
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Compatibility Analysis</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Calculated score against your active resume</p>
                </div>
                <AnimatedProgress value={results.score} type="circle" size={90} strokeWidth={8} />
              </div>

              {/* Matched / Missing Grid */}
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Matching Keywords Found</p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.matchedKeywords.map(k => (
                      <Badge key={k} variant="success" size="sm">{k}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-brand-rose uppercase tracking-wider mb-2">Missing Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.missingKeywords.map(k => (
                      <Badge key={k} variant="danger" size="sm">{k}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations Gap analysis */}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GraduationCap className="h-4.5 w-4.5 text-brand-indigo" />
                  <span>AI Recommended Upskilling</span>
                </p>
                <div className="space-y-2">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className="p-2.5 bg-obsidian-950/40 rounded border border-white/[0.04] text-xs flex justify-between items-center">
                      <span>{rec.title}</span>
                      <span className="text-[10px] text-brand-blue font-semibold uppercase">{rec.link}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="border border-dashed border-white/[0.08] rounded-xl p-12 text-center text-gray-500 bg-obsidian-900/30 flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-4 bg-obsidian-800 rounded-full mb-4 border border-white/[0.04]">
                <SearchCode className="h-7 w-7 text-gray-500" />
              </div>
              <h4 className="text-sm font-semibold text-white font-heading">Awaiting Job Details</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                Enter target parameters in the textbox to review missing tags, skill coverage percentages, and matching guidelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
