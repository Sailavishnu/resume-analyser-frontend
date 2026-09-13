/**
 * Mock JD Matching & Skill Gap Service
 */

export const jdMatchService = {
  async matchResumeToJob(resumeId, jobId) {
    await new Promise(r => setTimeout(r, 600));
    return {
      overallMatch: 92,
      dimensions: {
        skills: 94,
        experience: 88,
        projects: 91,
        education: 100,
        keywords: 86
      },
      skills: {
        strong: ['React', 'JavaScript', 'HTML5/CSS3', 'Git', 'RESTful APIs', 'Zustand/Redux'],
        partial: ['Node.js & Express', 'Unit Testing (Jest/Vitest)'],
        missing: [
          { skill: 'TypeScript', priority: 'High', effort: '1–2 weeks', path: 'Types, Generics, and React TS props' },
          { skill: 'Docker Containerization', priority: 'Medium', effort: '3–5 days', path: 'Dockerfiles, compose, multi-stage builds' },
          { skill: 'AWS S3 / CloudFront', priority: 'Low', effort: '2–3 days', path: 'Static asset hosting & CDN delivery' }
        ]
      },
      matchExplanation: 'You meet 9 of 10 primary frontend requirements. Your full stack portfolio matches 91% of day-to-day deliverables. Closing the TypeScript gap will boost estimated match from 92% to 98%.',
      projectedMatchAfterGaps: 98
    };
  }
};
