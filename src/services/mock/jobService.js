/**
 * Mock Job & Application Service
 */

const sampleJobs = [
  {
    id: 'job-1',
    title: 'Senior React & Frontend Engineer',
    company: 'Zoho Corporation',
    location: 'Chennai, India (Hybrid)',
    salary: '₹14,00,000 - ₹20,00,000',
    type: 'Full-time',
    matchRate: 94,
    skillsRequired: ['React', 'JavaScript', 'TypeScript', 'Zustand/Redux', 'TailwindCSS'],
    experienceRequired: '0–2 Years',
    applicantsCount: 48,
    postedAt: '2 days ago',
    matchHighlights: {
      matched: ['React', 'JavaScript', 'TailwindCSS', 'REST APIs'],
      missing: ['TypeScript', 'Docker']
    },
    whyMatch: 'Your React and single-page application projects match 94% of day-to-day duties at Zoho.',
    applied: true,
    appliedDate: '10 Sep 2026',
    status: 'Shortlisted'
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer Trainee',
    company: 'Freshworks',
    location: 'Chennai, India (On-site)',
    salary: '₹10,00,000 - ₹15,00,000',
    type: 'Full-time',
    matchRate: 88,
    skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'Git', 'Docker'],
    experienceRequired: 'Fresher / 0-1 Year',
    applicantsCount: 72,
    postedAt: '4 days ago',
    matchHighlights: {
      matched: ['React', 'Node.js', 'Git'],
      missing: ['PostgreSQL', 'Docker']
    },
    whyMatch: 'Strong full stack architecture background with clean RESTful API project proofs.',
    applied: false,
    appliedDate: null,
    status: null
  },
  {
    id: 'job-3',
    title: 'Frontend UI/UX Specialist',
    company: 'Chargebee',
    location: 'Bangalore / Remote',
    salary: '₹12,00,000 - ₹18,00,000',
    type: 'Remote',
    matchRate: 91,
    skillsRequired: ['React', 'CSS Flexbox/Grid', 'Framer Motion', 'Accessibility (a11y)'],
    experienceRequired: '0-2 Years',
    applicantsCount: 35,
    postedAt: '1 week ago',
    matchHighlights: {
      matched: ['React', 'Framer Motion', 'Glassmorphism', 'CSS'],
      missing: ['Jest Testing']
    },
    whyMatch: 'Your UI polish and animated frontend showcase aligns with Chargebee brand guidelines.',
    applied: false,
    appliedDate: null,
    status: null
  }
];

export const jobService = {
  async getJobs() {
    await new Promise(r => setTimeout(r, 300));
    return sampleJobs;
  },

  async applyToJob(jobId, resumeId = 'res-primary') {
    await new Promise(r => setTimeout(r, 650));
    const job = sampleJobs.find(j => j.id === jobId);
    if (job) {
      job.applied = true;
      job.appliedDate = 'Just now';
      job.status = 'Applied';
    }
    return {
      applicationId: 'app-' + Date.now(),
      jobId,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      timeline: [
        { title: 'Application Submitted', time: 'Just now', note: `Applied using primary CV (${job?.matchRate || 90}% match score).` }
      ]
    };
  }
};
