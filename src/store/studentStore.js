import { create } from 'zustand';
import { interviewService } from '../services/interviewService';
import { resumeService } from '../services/resumeService';

const MOCK_RESUMES = [
  {
    id: 'res-1',
    name: 'Priya_Lakshmi_CV_2026.pdf',
    version: 'v2.1',
    slot: 'primary',
    isPrimary: true,
    uploadDate: '2026-07-20T10:30:00Z',
    score: 84,
    atsScore: 88,
    role: 'Fullstack Software Engineer',
    dimensions: [
      { label: 'ATS Compatibility', score: 88, status: 'Strong' },
      { label: 'Skills Alignment', score: 82, status: 'Good' },
      { label: 'Experience Impact', score: 78, status: 'Needs Work' },
      { label: 'Project Depth', score: 90, status: 'Strong' },
      { label: 'Formatting', score: 94, status: 'Excellent' }
    ],
    analysis: {
      overallScore: 84,
      sectionScores: {
        skills: 88,
        experience: 82,
        education: 90,
        formatting: 78
      },
      keywords: {
        matched: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile', 'Zustand', 'TailwindCSS'],
        missing: ['TypeScript', 'Docker', 'AWS (S3/EC2)', 'GraphQL', 'CI/CD'],
        suggestions: ['Kubernetes', 'Redis', 'Unit Testing (Jest/RTL)']
      },
      formattingCheck: [
        { id: 'f1', check: 'Font size consistency', passed: true, detail: 'Fonts are legible and appropriately scaled between headers and body.' },
        { id: 'f2', check: 'Margins & Spacing', passed: false, detail: 'Standardized 0.75" single-column ATS margins.' },
        { id: 'f3', check: 'Action Verbs usage', passed: true, detail: 'Strong verbs like "Designed", "Led", "Optimized" are used frequently.' },
        { id: 'f4', check: 'Contact Information', passed: true, detail: 'Email, Phone, and LinkedIn links are correctly placed.' },
        { id: 'f5', check: 'Length (Pages)', passed: true, detail: 'Clean 1-page compact layout.' }
      ],
      bulletsBreakdown: [
        {
          id: 'b1',
          section: 'Experience (Zoho Projects)',
          original: 'Responsible for building dashboard components for service teams.',
          improved: 'Architected and deployed 12+ reusable React dashboards, reducing loading speeds by 40% and increasing service team throughput by 15%.',
          impact: 'Adds quantifiable metrics and action-oriented results instead of a passive list of tasks.'
        },
        {
          id: 'b2',
          section: 'Projects (SaaS Platform)',
          original: 'Worked on fixing bugs and writing SQL queries for the databases.',
          improved: 'Optimized 30+ legacy SQL queries and resolved 150+ critical React/Node.js bugs, leading to a 25% boost in system reliability.',
          impact: 'Specifies the scale of bug fixing and queries optimized, showcasing problem-solving capability.'
        },
        {
          id: 'b3',
          section: 'Summary',
          original: 'Hardworking developer with expertise in React looking for a role.',
          improved: 'Results-driven Fullstack Developer with expertise in designing and shipping scalable React/Node.js web applications in agile environments.',
          impact: 'Highlights experience levels and target frameworks in a professional summary tone.'
        }
      ]
    }
  },
  {
    id: 'res-2',
    name: 'Priya_Lakshmi_Backend_CV.pdf',
    version: 'v1.0',
    slot: 'secondary',
    isPrimary: false,
    uploadDate: '2026-07-24T18:15:00Z',
    score: 68,
    atsScore: 72,
    role: 'Backend Developer',
    dimensions: [
      { label: 'ATS Compatibility', score: 72, status: 'Needs Work' },
      { label: 'Skills Alignment', score: 68, status: 'Fair' },
      { label: 'Experience Impact', score: 65, status: 'Needs Work' },
      { label: 'Project Depth', score: 75, status: 'Good' },
      { label: 'Formatting', score: 80, status: 'Good' }
    ],
    analysis: {
      overallScore: 68,
      sectionScores: {
        skills: 60,
        experience: 70,
        education: 90,
        formatting: 55
      },
      keywords: {
        matched: ['Node.js', 'SQL', 'Python', 'REST APIs', 'Git'],
        missing: ['PostgreSQL', 'Docker', 'Redis', 'Microservices', 'AWS'],
        suggestions: ['MongoDB', 'gRPC', 'System Design']
      },
      formattingCheck: [
        { id: 'f1', check: 'Font size consistency', passed: true, detail: 'Readable typeface hierarchy.' },
        { id: 'f2', check: 'Margins & Spacing', passed: false, detail: 'Uneven vertical spacing between paragraphs.' },
        { id: 'f3', check: 'Action Verbs usage', passed: false, detail: 'Contains repetitive verbs (e.g., "Assisted in", "Helped with").' },
        { id: 'f4', check: 'Contact Information', passed: true, detail: 'Present and correct.' },
        { id: 'f5', check: 'Length (Pages)', passed: true, detail: 'Compact 1 page structure.' }
      ],
      bulletsBreakdown: [
        {
          id: 'b1',
          section: 'Experience (Freelance)',
          original: 'Helped with making the API calls and writing Python scripts.',
          improved: 'Engineered robust Python script automations and integrated 15+ external third-party endpoints, saving developers 10+ hours per week.',
          impact: 'Quantifies time saved and details integration complexity.'
        }
      ]
    }
  }
];

const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Senior React Developer',
    company: 'Zoho Corporation',
    logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=100&auto=format&fit=crop&q=80',
    location: 'Chennai, India (Hybrid)',
    salary: '₹14,00,000 - ₹20,00,000',
    matchRate: 94,
    skillsRequired: ['React', 'JavaScript', 'TypeScript', 'Zustand/Redux', 'Tailwind CSS', 'Git'],
    skillsMatched: ['React', 'JavaScript', 'Tailwind CSS', 'Git', 'Zustand/Redux'],
    skillsMissing: ['TypeScript'],
    gapAnalysis: {
      technicalGaps: 'Your resume shows strong React experience, but lacks TypeScript types and generics.',
      recommendations: [
        { title: 'TypeScript for React Developers', source: 'Total TypeScript', duration: '1 week', priority: 'High' },
        { title: 'Docker Containerization', source: 'Docker Hub', duration: '3 days', priority: 'Medium' }
      ]
    }
  },
  {
    id: 'job-2',
    title: 'Fullstack Engineer',
    company: 'Freshworks',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'Chennai, India (On-site)',
    salary: '₹12,00,000 - ₹17,00,000',
    matchRate: 88,
    skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'AWS'],
    skillsMatched: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs'],
    skillsMissing: ['Docker', 'AWS', 'PostgreSQL'],
    gapAnalysis: {
      technicalGaps: 'Good database foundation but lacks cloud deployments (AWS) and containerization configurations (Docker).',
      recommendations: [
        { title: 'Docker for Beginners', source: 'Docker Hub Academy', duration: '5 hours', priority: 'Medium' },
        { title: 'AWS Cloud Practitioner Essentials', source: 'Coursera / AWS', duration: '12 hours', priority: 'Low' }
      ]
    }
  },
  {
    id: 'job-3',
    title: 'Frontend UI/UX Specialist',
    company: 'Chargebee',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore / Remote',
    salary: '₹13,00,000 - ₹18,00,000',
    matchRate: 91,
    skillsRequired: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Jest'],
    skillsMatched: ['React', 'Tailwind CSS', 'Framer Motion'],
    skillsMissing: ['TypeScript', 'Jest'],
    gapAnalysis: {
      technicalGaps: 'Chargebee places heavy emphasis on fluid interactions and unit test coverage.',
      recommendations: [
        { title: 'Unit Testing React Apps with Jest', source: 'TestingJavaScript.com', duration: '10 hours', priority: 'Medium' }
      ]
    }
  }
];

const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-1',
    company: 'Zoho Corporation',
    role: 'Senior React Developer',
    salary: '₹14,00,000 - ₹20,00,000',
    location: 'Chennai (Hybrid)',
    status: 'Shortlisted',
    appliedDate: '10 Sep 2026',
    matchRate: 94,
    resumeUsed: 'Priya_Lakshmi_CV_2026.pdf',
    notes: 'Karthik Kumar (Recruiter) scheduled technical discussion for Thursday 3 PM.',
    timeline: [
      { date: '10 Sep 2026', title: 'Application Submitted', desc: 'Applied with Primary Resume (94% match score).' },
      { date: '11 Sep 2026', title: 'ATS Automated Screening Passed', desc: 'ATS compatibility verified at 94% index.' },
      { date: '12 Sep 2026', title: 'Recruiter Shortlisted', desc: 'Shortlisted by Karthik Kumar for technical interview.' }
    ]
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    company: 'Freshworks',
    role: 'Fullstack Engineer',
    salary: '₹12,00,000 - ₹17,00,000',
    location: 'Chennai (On-site)',
    status: 'Under Review',
    appliedDate: '11 Sep 2026',
    matchRate: 88,
    resumeUsed: 'Priya_Lakshmi_CV_2026.pdf',
    notes: 'Awaiting round 1 candidate screening review.',
    timeline: [
      { date: '11 Sep 2026', title: 'Application Submitted', desc: 'Applied through campus placement portal.' }
    ]
  }
];

const MOCK_ROADMAP = {
  roleId: 'frontend',
  roleName: 'Frontend Engineer',
  completionPercentage: 68,
  phases: [
    {
      id: 'p1',
      title: 'Phase 1: Web Fundamentals',
      status: 'completed',
      skills: [
        { id: 's1', name: 'HTML5 Semantic Markup', completed: true },
        { id: 's2', name: 'CSS Flexbox & CSS Grid', completed: true },
        { id: 's3', name: 'JavaScript Async / ES6+', completed: true }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Modern Frontend Architecture',
      status: 'in_progress',
      skills: [
        { id: 's4', name: 'React 18 & Custom Hooks', completed: true },
        { id: 's5', name: 'Zustand & Client State', completed: true },
        { id: 's6', name: 'TypeScript & Type Safety', completed: false, isGap: true, priority: 'High', source: 'JD Match' }
      ]
    },
    {
      id: 'p3',
      title: 'Phase 3: Production Engineering & Styling',
      status: 'in_progress',
      skills: [
        { id: 's7', name: 'TailwindCSS Design System', completed: true },
        { id: 's8', name: 'Framer Motion Animations', completed: true },
        { id: 's9', name: 'Docker Containerization', completed: false, isGap: true, priority: 'Medium', source: 'JD Match' }
      ]
    },
    {
      id: 'p4',
      title: 'Phase 4: Capstone Projects & Portfolio',
      status: 'not_started',
      skills: [
        { id: 's10', name: 'Production SaaS App with Auth', completed: true },
        { id: 's11', name: 'Performance Optimization & Core Web Vitals', completed: false }
      ]
    },
    {
      id: 'p5',
      title: 'Phase 5: Technical Interviews & Preparation',
      status: 'in_progress',
      skills: [
        { id: 's12', name: 'DSA in JavaScript', completed: true },
        { id: 's13', name: 'AI Mock Interview Practice', completed: true },
        { id: 's14', name: 'Behavioral STAR Framework', completed: false }
      ]
    }
  ]
};

const MOCK_ASSESSMENTS = [
  { id: 'asm-js', skill: 'JavaScript Core & ES6+', category: 'Frontend', questionsCount: 10, durationMin: 12, level: 'Intermediate', bestScore: 84 },
  { id: 'asm-react', skill: 'React 18 & State Management', category: 'Frontend', questionsCount: 10, durationMin: 15, level: 'Advanced', bestScore: 91 },
  { id: 'asm-sql', skill: 'SQL & Relational Databases', category: 'Database', questionsCount: 10, durationMin: 12, level: 'Intermediate', bestScore: 78 },
  { id: 'asm-python', skill: 'Python & Backend APIs', category: 'Backend', questionsCount: 10, durationMin: 15, level: 'Intermediate', bestScore: null }
];

export const useStudentStore = create((set, get) => ({
  resumes: MOCK_RESUMES,
  selectedResumeId: 'res-1',
  jobs: MOCK_JOBS,
  applications: MOCK_APPLICATIONS,
  roadmap: MOCK_ROADMAP,
  assessments: MOCK_ASSESSMENTS,
  interviews: [
    {
      id: 'int-1',
      role: 'Senior React Developer',
      company: 'Zoho Corporation',
      date: '2026-09-17 (Thursday 3:00 PM)',
      score: 88,
      status: 'Scheduled',
      feedback: 'Technical interview scheduled with Karthik Kumar. Focus: React performance & Zustand state.'
    }
  ],

  // Platform Metrics
  targetRole: 'Frontend Engineer',
  streak: 7,
  careerReadiness: 76,
  readinessBreakdown: {
    resume: 84,
    ats: 88,
    skills: 71,
    projects: 76,
    assessments: 79,
    interview: 81,
    applications: 68,
    profile: 94
  },

  analyzing: false,
  activeInterview: null,

  setSelectedResumeId: (id) => set({ selectedResumeId: id }),

  setAsPrimaryResume: async (id) => {
    set(state => ({
      resumes: state.resumes.map(r => ({
        ...r,
        isPrimary: r.id === id,
        slot: r.id === id ? 'primary' : (r.slot === 'primary' ? 'secondary' : r.slot)
      })),
      selectedResumeId: id
    }));
    try {
      await resumeService.setSlot(id, 'primary');
    } catch (e) {
      console.warn('Slot update sync error:', e);
    }
  },

  setAsSecondaryResume: async (id) => {
    set(state => ({
      resumes: state.resumes.map(r => ({
        ...r,
        slot: r.id === id ? 'secondary' : (r.slot === 'secondary' ? null : r.slot),
        isPrimary: r.id === id ? false : r.isPrimary
      }))
    }));
    try {
      await resumeService.setSlot(id, 'secondary');
    } catch (e) {
      console.warn('Slot update sync error:', e);
    }
  },

  deleteResume: async (id) => {
    set(state => {
      const remaining = state.resumes.filter(r => r.id !== id);
      return {
        resumes: remaining,
        selectedResumeId: state.selectedResumeId === id ? remaining[0]?.id : state.selectedResumeId
      };
    });
    try {
      await resumeService.deleteResume(id);
    } catch (e) {
      console.warn('Delete resume sync error:', e);
    }
  },

  getSelectedResume: () => {
    const { resumes, selectedResumeId } = get();
    return resumes.find(r => r.id === selectedResumeId) || resumes[0] || null;
  },

  setTargetRole: (role) => {
    set({ targetRole: role });
  },

  // Apply to a job with cross-feature state sync
  applyToJob: (jobId, resumeName = 'Priya_Lakshmi_CV_2026.pdf') => {
    const job = get().jobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication = {
      id: 'app-' + Date.now(),
      jobId,
      company: job.company,
      role: job.title,
      salary: job.salary,
      location: job.location,
      status: 'Applied',
      appliedDate: 'Just now',
      matchRate: job.matchRate || 90,
      resumeUsed: resumeName,
      notes: 'Applied via Placement Portal. Awaiting initial recruiter screening.',
      timeline: [
        { date: 'Just now', title: 'Application Submitted', desc: `Applied using ${resumeName} with ${job.matchRate}% match.` }
      ]
    };

    set(state => ({
      applications: [newApplication, ...state.applications.filter(a => a.jobId !== jobId)],
      streak: state.streak + 1,
      careerReadiness: Math.min(100, state.careerReadiness + 1)
    }));
  },

  // Add missing skill from JD Match to Career Roadmap
  addSkillToRoadmap: (skillName, priority = 'High') => {
    set(state => {
      const currentPhases = [...state.roadmap.phases];
      const targetPhase = currentPhases[1]; // Phase 2
      const exists = targetPhase.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (exists) return state;

      const newSkill = {
        id: 's-gap-' + Date.now(),
        name: skillName,
        completed: false,
        isGap: true,
        priority,
        source: 'JD Match Gap'
      };

      targetPhase.skills.push(newSkill);
      return {
        roadmap: {
          ...state.roadmap,
          phases: currentPhases
        }
      };
    });
  },

  // Toggle Roadmap Skill Status & Sync Career Readiness
  toggleRoadmapSkill: (phaseId, skillId) => {
    set(state => {
      const updatedPhases = state.roadmap.phases.map(phase => {
        if (phase.id !== phaseId) return phase;
        const updatedSkills = phase.skills.map(s => {
          if (s.id === skillId) return { ...s, completed: !s.completed };
          return s;
        });
        return { ...phase, skills: updatedSkills };
      });

      const allSkills = updatedPhases.flatMap(p => p.skills);
      const completed = allSkills.filter(s => s.completed).length;
      const completionPercentage = Math.round((completed / allSkills.length) * 100);

      return {
        roadmap: {
          ...state.roadmap,
          phases: updatedPhases,
          completionPercentage
        },
        careerReadiness: Math.min(100, Math.max(70, 70 + Math.round(completionPercentage * 0.25)))
      };
    });
  },

  // Complete an assessment & update skill profile + readiness
  completeAssessment: (assessmentId, score) => {
    set(state => {
      const updatedAssessments = state.assessments.map(asm => {
        if (asm.id !== assessmentId) return asm;
        return { ...asm, bestScore: Math.max(asm.bestScore || 0, score) };
      });

      return {
        assessments: updatedAssessments,
        streak: state.streak + 1,
        careerReadiness: Math.min(100, state.careerReadiness + 2)
      };
    });
  },

  fetchResumes: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const realResumes = await resumeService.getStudentResumes();
      if (realResumes && realResumes.length > 0) {
        const formatted = realResumes.map(r => ({
          ...r,
          id: r.id || r._id,
          name: r.file_name || r.name,
          slot: r.slot || (r.is_primary ? 'primary' : 'secondary'),
          isPrimary: r.slot === 'primary' || r.is_primary,
          score: r.score || 82,
          atsScore: r.ats_score || 85,
          downloadUrl: `http://127.0.0.1:8000/api/v1/resumes/${r.id}/download`,
          analysis: r.analysis || {
            overallScore: r.score || 82,
            sectionScores: { skills: 85, experience: 80, education: 88, formatting: 82 },
            keywords: { matched: r.parsed_data?.skills?.languages || [], missing: [], suggestions: [] },
            formattingCheck: [],
            bulletsBreakdown: []
          }
        }));
        set({
          resumes: formatted,
          selectedResumeId: formatted.find(r => r.slot === 'primary')?.id || formatted[0]?.id
        });
      }
    } catch (e) {
      console.warn('Could not load remote resumes:', e);
    }
  },

  analyzeUploadedResume: async (fileOrName, slot = 'primary') => {
    set({ analyzing: true });
    
    // If real browser File object provided, upload to GridFS & MongoDB
    if (fileOrName instanceof File) {
      try {
        const uploaded = await resumeService.uploadResume(fileOrName, slot);
        const newResume = {
          ...uploaded,
          id: uploaded.id || uploaded._id,
          name: uploaded.file_name || uploaded.name,
          slot: uploaded.slot || slot,
          isPrimary: (uploaded.slot === 'primary' || slot === 'primary'),
          score: uploaded.score || 82,
          atsScore: uploaded.ats_score || 86,
          downloadUrl: `http://127.0.0.1:8000/api/v1/resumes/${uploaded.id}/download`,
          uploadDate: uploaded.created_at || new Date().toISOString(),
          analysis: uploaded.analysis || {
            overallScore: uploaded.score || 82,
            sectionScores: { skills: 85, experience: 80, education: 88, formatting: 82 },
            keywords: { matched: uploaded.parsed_data?.skills?.languages || [], missing: [], suggestions: [] },
            formattingCheck: [],
            bulletsBreakdown: []
          }
        };

        set(state => {
          const filtered = state.resumes.filter(r => r.slot !== slot && r.id !== newResume.id);
          const nextList = [newResume, ...filtered].slice(0, 2);
          return {
            resumes: nextList,
            selectedResumeId: newResume.id,
            analyzing: false,
            careerReadiness: Math.min(100, state.careerReadiness + 5)
          };
        });
        return newResume;
      } catch (err) {
        set({ analyzing: false });
        throw err;
      }
    }

    // Fallback simulation if string passed
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newResume = {
      id: `res-${Math.random().toString(36).substr(2, 9)}`,
      name: typeof fileOrName === 'string' ? fileOrName : 'Uploaded_Resume.pdf',
      version: 'v1.0',
      slot: slot,
      isPrimary: slot === 'primary',
      uploadDate: new Date().toISOString(),
      score: 82,
      atsScore: 86,
      role: 'Software Engineer',
      analysis: {
        overallScore: 82,
        sectionScores: { skills: 85, experience: 80, education: 90, formatting: 84 },
        keywords: { matched: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs'], missing: [], suggestions: [] },
        formattingCheck: [],
        bulletsBreakdown: []
      }
    };

    set(state => {
      const filtered = state.resumes.filter(r => r.slot !== slot);
      return {
        resumes: [newResume, ...filtered].slice(0, 2),
        selectedResumeId: newResume.id,
        analyzing: false,
        careerReadiness: Math.min(100, state.careerReadiness + 3)
      };
    });
    return newResume;
  },

  updateBulletPoint: (bulletId, newContent) => {
    set(state => {
      const updatedResumes = state.resumes.map(resume => {
        if (resume.id !== state.selectedResumeId) return resume;
        
        const updatedBreakdown = resume.analysis.bulletsBreakdown.map(bullet => {
          if (bullet.id === bulletId) {
            return { ...bullet, original: newContent };
          }
          return bullet;
        });

        const oldOverall = resume.analysis.overallScore;
        const newOverall = Math.min(100, oldOverall + 3);

        return {
          ...resume,
          score: newOverall,
          atsScore: Math.min(100, resume.atsScore + 2),
          analysis: {
            ...resume.analysis,
            overallScore: newOverall,
            bulletsBreakdown: updatedBreakdown
          }
        };
      });

      return {
        resumes: updatedResumes,
        careerReadiness: Math.min(100, state.careerReadiness + 1)
      };
    });
  },

  // AI Interview Simulator Flow (Connected to FastAPI AI/ML Backend)
  startInterview: async (role) => {
    const selectedResume = get().getSelectedResume();
    const sessionData = await interviewService.startInterview({
      role: role || 'Software Engineer',
      resumeId: selectedResume ? selectedResume.id : null,
    });

    set({
      activeInterview: {
        sessionId: sessionData.session_id || sessionData.interview_id,
        role: sessionData.target_role || role,
        currentQuestionIndex: sessionData.current_question_index || 0,
        questions: sessionData.questions || [sessionData.current_question],
        answers: [],
        completed: false,
        feedback: null
      }
    });
  },

  submitInterviewAnswer: async (answerText) => {
    const { activeInterview } = get();
    if (!activeInterview) return;

    const currentIdx = activeInterview.currentQuestionIndex;
    const currentQuestion = activeInterview.questions[currentIdx] || { question: 'Question' };

    // Call real backend NLP evaluation
    const evalData = await interviewService.submitAnswer({
      sessionId: activeInterview.sessionId,
      answerText
    });

    const latestEval = evalData.latest_evaluation || {};
    const score = latestEval.score || 75;

    const newAnswer = {
      questionId: currentQuestion.id || `q_${currentIdx + 1}`,
      category: currentQuestion.category || 'Technical Evaluation',
      question: currentQuestion.question,
      answer: answerText,
      score: score,
      relevance: latestEval.relevance,
      technicalDepth: latestEval.technical_depth,
      matchedKeywords: latestEval.matched_keywords || [],
      feedback: latestEval.feedback || `Score: ${score}%. Response evaluated via NLP semantic analysis.`
    };

    const updatedAnswers = [...activeInterview.answers, newAnswer];
    const isCompleted = evalData.is_completed || (currentIdx >= (activeInterview.questions.length - 1) && !evalData.next_question);

    if (isCompleted) {
      const totalScore = Math.round(updatedAnswers.reduce((sum, a) => sum + a.score, 0) / updatedAnswers.length);
      const interviewSummary = {
        id: `int-${Math.random().toString(36).substr(2, 9)}`,
        role: activeInterview.role,
        company: 'AI Recruitment Evaluator',
        date: new Date().toISOString().split('T')[0],
        score: totalScore,
        status: 'Completed',
        feedback: evalData.report?.summary || `Completed with an overall score of ${totalScore}%. Good technical foundation evaluated across core engineering principles.`
      };

      set(state => ({
        activeInterview: {
          ...state.activeInterview,
          answers: updatedAnswers,
          completed: true,
          feedback: interviewSummary.feedback
        },
        interviews: [interviewSummary, ...state.interviews],
        streak: state.streak + 1,
        careerReadiness: Math.min(100, state.careerReadiness + 2)
      }));
    } else {
      const updatedQuestions = [...activeInterview.questions];
      if (evalData.next_question) {
        if (currentIdx + 1 < updatedQuestions.length) {
          updatedQuestions[currentIdx + 1] = evalData.next_question;
        } else {
          updatedQuestions.push(evalData.next_question);
        }
      }

      set({
        activeInterview: {
          ...activeInterview,
          answers: updatedAnswers,
          questions: updatedQuestions,
          currentQuestionIndex: currentIdx + 1
        }
      });
    }
  },

  resetInterview: () => {
    set({ activeInterview: null });
  }
}));
