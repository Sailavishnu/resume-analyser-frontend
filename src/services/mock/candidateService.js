// Mock Candidate Management Service for HR Portal
export const candidateService = {
  calculateMatchBreakdown: (candidate, job) => {
    const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
    const requiredSkills = (job.targetKeywords || job.skillsRequired || ['React', 'JavaScript', 'Node.js', 'SQL']).map(s => s.toLowerCase());
    
    const matched = requiredSkills.filter(req => candidateSkills.some(cs => cs.includes(req) || req.includes(cs)));
    const missing = requiredSkills.filter(req => !candidateSkills.some(cs => cs.includes(req) || req.includes(cs)));

    const skillScore = Math.round((matched.length / Math.max(1, requiredSkills.length)) * 100);
    const expScore = Math.min(100, Math.round((candidate.experienceYears / 4) * 85));
    const projectScore = Math.min(95, 75 + Math.floor(Math.random() * 18));
    const educationScore = candidate.education?.includes('Ph.D') ? 100 : candidate.education?.includes('M.S') ? 95 : 90;

    const overall = Math.round(
      (skillScore * 0.45) +
      (expScore * 0.30) +
      (projectScore * 0.15) +
      (educationScore * 0.10)
    );

    return {
      overall,
      matchedSkills: matched,
      missingSkills: missing,
      breakdown: {
        skills: skillScore,
        experience: expScore,
        projects: projectScore,
        education: educationScore
      },
      screeningSummary: matched.length >= 4
        ? `High-potential candidate for ${job.title || 'the role'}. Deep hands-on experience in ${matched.slice(0, 3).join(', ')}. Candidate shows solid code architecture discipline.`
        : `Moderate alignment. Strong baseline proficiency, but missing critical requirements: ${missing.slice(0, 2).join(', ')}.`
    };
  },

  compareCandidates: (candidateList, job) => {
    return candidateList.map(cand => ({
      candidate: cand,
      analysis: candidateService.calculateMatchBreakdown(cand, job)
    }));
  }
};
