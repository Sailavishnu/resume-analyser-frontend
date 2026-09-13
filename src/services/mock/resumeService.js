/**
 * Mock Resume Service
 * Handles resume health, multi-dimension scoring, version comparison, and bullet rewrites.
 */

export const resumeService = {
  async analyzeResume(fileName = 'Resume.pdf') {
    // Simulate step-by-step parsing
    await new Promise(r => setTimeout(r, 800));
    return {
      id: 'res-' + Date.now(),
      name: fileName,
      version: 'v1.0',
      uploadedAt: new Date().toISOString(),
      healthScore: 84,
      atsScore: 88,
      completeness: 92,
      scoreChange: '+6 from previous version',
      dimensions: [
        { label: 'ATS Compatibility', score: 88, status: 'Strong', desc: 'Standard single-column layout with standard headings.' },
        { label: 'Skills Alignment', score: 82, status: 'Good', desc: 'Core tech stack covered. TypeScript and Docker could be added.' },
        { label: 'Experience Impact', score: 78, status: 'Needs Work', desc: 'Several bullets lack quantified performance metrics.' },
        { label: 'Project Depth', score: 90, status: 'Strong', desc: 'Full stack web applications with architecture details.' },
        { label: 'Formatting & Layout', score: 94, status: 'Excellent', desc: 'Clean margins, consistent font hierarchy, no tables.' },
        { label: 'Section Completeness', score: 92, status: 'Strong', desc: 'All standard sections detected and populated.' }
      ],
      findings: {
        critical: [
          { id: 'c1', title: 'Target Role Keywords Missing', desc: 'Targeting Senior React roles usually expects TypeScript and Redux/Zustand explicitly in the summary.' }
        ],
        warning: [
          { id: 'w1', title: 'Unquantified Achievements', desc: 'Bullets describe duties ("Worked on web app") rather than business metrics ("Improved latency by 25%").' },
          { id: 'w2', title: 'Summary vs Objective Ambiguity', desc: 'The intro combines objective with summary. Focus purely on technical value.' }
        ],
        good: [
          { id: 'g1', title: 'Zero Parse Obstacles', desc: 'Clean font (Inter), no text boxes, clean contact header format.' },
          { id: 'g2', title: 'Strong Action Verb Density', desc: '82% of bullet points start with strong action verbs like Engineered, Architected, and Deployed.' }
        ]
      }
    };
  },

  async improveBullet(originalText, mode = 'impact') {
    await new Promise(r => setTimeout(r, 400));
    const improvements = {
      impact: `Engineered and deployed an optimized module, increasing throughput by 32% and reducing user drop-off across 12,000+ monthly sessions.`,
      concise: `Built a scalable microservice handling 10k+ requests with 99.9% uptime.`,
      technical: `Architected a decoupled React/Node.js pipeline utilizing Redis caching, reducing API response latency to under 45ms.`,
      ats: `Implemented RESTful APIs and modern frontend components following clean architecture and automated unit testing standards.`
    };
    return {
      original: originalText,
      improved: improvements[mode] || improvements.impact,
      mode,
      qualityScore: 94,
      reason: 'Replaces passive phrasing with high-impact action verbs and quantified performance percentage.'
    };
  },

  async compareVersions(resumeA, resumeB) {
    await new Promise(r => setTimeout(r, 250));
    if (!resumeA || !resumeB) return null;

    const scoreA = resumeA.atsScore || resumeA.score || 70;
    const scoreB = resumeB.atsScore || resumeB.score || 85;
    const delta = scoreB - scoreA;

    const skillsA = resumeA.analysis?.keywords?.matched || ['JavaScript', 'HTML5', 'CSS3', 'Git'];
    const skillsB = resumeB.analysis?.keywords?.matched || ['React', 'JavaScript', 'Node.js', 'SQL', 'Zustand'];

    const addedSkills = skillsB.filter(s => !skillsA.some(sa => sa.toLowerCase() === s.toLowerCase()));
    const missingSkills = (resumeB.analysis?.keywords?.missing || []).slice(0, 4);

    return {
      v1: {
        id: resumeA.id,
        name: resumeA.name,
        role: resumeA.role || 'Baseline CV',
        score: resumeA.score || 70,
        ats: scoreA,
        slot: resumeA.slot || 'secondary',
        skillsCount: skillsA.length,
        skills: skillsA
      },
      v2: {
        id: resumeB.id,
        name: resumeB.name,
        role: resumeB.role || 'Target CV',
        score: resumeB.score || 85,
        ats: scoreB,
        slot: resumeB.slot || 'primary',
        skillsCount: skillsB.length,
        skills: skillsB
      },
      improvementDelta: delta >= 0 ? `+${delta} ATS Points` : `${delta} ATS Points`,
      deltaPositive: delta >= 0,
      addedSkills: addedSkills.length > 0 ? addedSkills : ['TailwindCSS', 'Zustand State'],
      missingSkills,
      resolvedIssues: [
        'Adopted standard ATS single-column hierarchy',
        'Quantified work experience deliverables with percentage outcomes',
        'Added categorized skills block'
      ]
    };
  }
};
