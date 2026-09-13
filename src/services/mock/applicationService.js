// Mock Application Tracker Service
export const applicationService = {
  getPipelineStages: () => [
    { id: 'all', label: 'All Applications' },
    { id: 'Saved', label: 'Saved' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Shortlisted', label: 'Shortlisted' },
    { id: 'Interview', label: 'Interview' },
    { id: 'Offer', label: 'Offer' },
    { id: 'Rejected', label: 'Rejected' }
  ],

  createApplication: (job, resumeName) => {
    return {
      id: 'app-' + Date.now(),
      jobId: job.id,
      company: job.company,
      role: job.title,
      salary: job.salary,
      location: job.location,
      status: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      matchRate: job.matchRate || 88,
      resumeUsed: resumeName || 'Priya_Lakshmi_CV_2026.pdf',
      notes: 'Applied via portal. Automated ATS index verified.',
      timeline: [
        {
          date: 'Just now',
          title: 'Application Submitted',
          desc: `Applied using ${resumeName || 'Primary Resume'} with ${job.matchRate || 88}% match score.`
        }
      ]
    };
  },

  addTimelineEvent: (application, eventTitle, eventDesc) => {
    const updated = { ...application };
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    updated.timeline = [
      { date: dateStr, title: eventTitle, desc: eventDesc },
      ...(updated.timeline || [])
    ];
    return updated;
  }
};
