import { create } from 'zustand';

const MOCK_RESUMES = [
  {
    id: 'res-1',
    name: 'Priya_Lakshmi_CV_2026.pdf',
    uploadDate: '2026-07-20T10:30:00Z',
    score: 84,
    role: 'Fullstack Software Engineer',
    analysis: {
      overallScore: 84,
      sectionScores: {
        skills: 88,
        experience: 82,
        education: 90,
        formatting: 78
      },
      keywords: {
        matched: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile'],
        missing: ['TypeScript', 'Docker', 'AWS (S3/EC2)', 'GraphQL', 'CI/CD'],
        suggestions: ['Kubernetes', 'Redis', 'Unit Testing (Jest/RTL)']
      },
      formattingCheck: [
        { id: 'f1', check: 'Font size consistency', passed: true, detail: 'Fonts are legible and appropriately scaled between headers and body.' },
        { id: 'f2', check: 'Margins & Spacing', passed: false, detail: 'The right margin on page 2 is slightly narrow (0.5"). Standardize to 0.75" or 1".' },
        { id: 'f3', check: 'Action Verbs usage', passed: true, detail: 'Strong verbs like "Designed", "Led", "Optimized" are used frequently.' },
        { id: 'f4', check: 'Contact Information', passed: true, detail: 'Email, Phone, and LinkedIn links are correctly placed.' },
        { id: 'f5', check: 'Length (Pages)', passed: false, detail: 'The resume contains significant empty space on page 2. Condense to a tight 1-page layout.' }
      ],
      bulletsBreakdown: [
        {
          id: 'b1',
          section: 'Experience (Tesla)',
          original: 'Responsible for building dashboard components for internal service teams.',
          improved: 'Architected and deployed 12+ reusable React dashboards, reducing loading speeds by 40% and increasing service team throughput by 15%.',
          impact: 'Adds quantifiable metrics and action-oriented results instead of a passive list of tasks.'
        },
        {
          id: 'b2',
          section: 'Experience (Tesla)',
          original: 'Worked on fixing bugs and writing SQL queries for the databases.',
          improved: 'Optimized 30+ legacy SQL queries and resolved 150+ critical React/Node.js bugs, leading to a 25% boost in system reliability.',
          impact: 'Specifies the scale of bug fixing and queries optimized, showcasing problem-solving capability.'
        },
        {
          id: 'b3',
          section: 'Summary',
          original: 'Hardworking developer with expertise in React looking for a role.',
          improved: 'Results-driven Fullstack Developer with 2+ years of experience designing and shipping scalable React/Node.js web applications in agile environments.',
          impact: 'Highlights experience levels and target frameworks in a professional summary tone.'
        }
      ]
    }
  },
  {
    id: 'res-2',
    name: 'Priya_Lakshmi_Backend_CV.pdf',
    uploadDate: '2026-07-24T18:15:00Z',
    score: 68,
    role: 'Backend Developer',
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
    company: 'Vercel',
    logo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=100&auto=format&fit=crop&q=80',
    location: 'Remote, US',
    salary: '$140k - $170k',
    matchRate: 92,
    skillsRequired: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'Git'],
    skillsMatched: ['React', 'JavaScript', 'Tailwind CSS', 'Git'],
    skillsMissing: ['TypeScript', 'Next.js'],
    gapAnalysis: {
      technicalGaps: 'Your resume shows strong React experience, but lacks exposure to modern Next.js server actions and TypeScript definitions.',
      recommendations: [
        { title: 'Learn Next.js App Router', source: 'Next.js Official Docs', duration: '2 weeks' },
        { title: 'TypeScript for React Developers', source: 'Total TypeScript', duration: '1 week' }
      ]
    }
  },
  {
    id: 'job-2',
    title: 'Fullstack Engineer',
    company: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$150k - $190k',
    matchRate: 85,
    skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'AWS'],
    skillsMatched: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs'],
    skillsMissing: ['Docker', 'AWS', 'PostgreSQL'],
    gapAnalysis: {
      technicalGaps: 'Good database foundation but lacks cloud deployments (AWS) and containerization configurations (Docker).',
      recommendations: [
        { title: 'Docker for Beginners', source: 'Docker Hub Academy', duration: '5 hours' },
        { title: 'AWS Cloud Practitioner Essentials', source: 'Coursera / AWS', duration: '12 hours' }
      ]
    }
  },
  {
    id: 'job-3',
    title: 'Frontend Engineer - UI Platform',
    company: 'Linear',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80',
    location: 'Remote, Global',
    salary: '$130k - $160k',
    matchRate: 78,
    skillsRequired: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'GraphQL', 'Jest'],
    skillsMatched: ['React', 'Tailwind CSS', 'Git'],
    skillsMissing: ['TypeScript', 'Framer Motion', 'GraphQL', 'Jest'],
    gapAnalysis: {
      technicalGaps: 'Linear places extreme emphasis on smooth fluid interactions. Adding Framer Motion work and Jest unit tests is critical.',
      recommendations: [
        { title: 'Framer Motion Complete Guide', source: 'Frontend Masters', duration: '8 hours' },
        { title: 'Unit Testing React Apps with Jest', source: 'TestingJavaScript.com', duration: '10 hours' }
      ]
    }
  }
];

const MOCK_INTERVIEWS = [
  {
    id: 'int-1',
    role: 'Frontend Engineer',
    company: 'Vercel Mock',
    date: '2026-07-22',
    score: 88,
    feedback: 'Excellent explanation of React render loops and rendering optimization. Needs minor focus on security (XSS prevention).'
  }
];

export const useStudentStore = create((set, get) => ({
  resumes: MOCK_RESUMES,
  selectedResumeId: 'res-1',
  jobs: MOCK_JOBS,
  interviews: MOCK_INTERVIEWS,
  analyzing: false,
  
  // Active Interview Session
  activeInterview: null,

  setSelectedResumeId: (id) => set({ selectedResumeId: id }),

  getSelectedResume: () => {
    const { resumes, selectedResumeId } = get();
    return resumes.find(r => r.id === selectedResumeId) || resumes[0] || null;
  },

  analyzeUploadedResume: async (fileName) => {
    set({ analyzing: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newResume = {
      id: `res-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      uploadDate: new Date().toISOString(),
      score: 75,
      role: 'Software Developer',
      analysis: {
        overallScore: 75,
        sectionScores: {
          skills: 70,
          experience: 75,
          education: 85,
          formatting: 70
        },
        keywords: {
          matched: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
          missing: ['Node.js', 'SQL', 'TypeScript', 'Tailwind CSS'],
          suggestions: ['Redux', 'Unit Testing', 'Webpack']
        },
        formattingCheck: [
          { id: 'f1', check: 'Font size consistency', passed: true, detail: 'Clear, legible font hierarchy.' },
          { id: 'f2', check: 'Margins & Spacing', passed: true, detail: 'Standard margins used.' },
          { id: 'f3', check: 'Action Verbs usage', passed: false, detail: 'Too many passive statements (e.g. "Participated in", "Learnt about").' }
        ],
        bulletsBreakdown: [
          {
            id: 'b1',
            section: 'Experience',
            original: 'Worked with a team of students to design a web app.',
            improved: 'Collaborated with 4 cross-functional developers to design and deploy a responsive React web application, improving page load speeds by 20%.',
            impact: 'Utilizes action verbs and displays teamwork dynamics with concrete outcomes.'
          }
        ]
      }
    };

    set(state => ({
      resumes: [newResume, ...state.resumes],
      selectedResumeId: newResume.id,
      analyzing: false
    }));
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
        const newOverall = Math.min(100, oldOverall + 2);

        return {
          ...resume,
          score: newOverall,
          analysis: {
            ...resume.analysis,
            overallScore: newOverall,
            bulletsBreakdown: updatedBreakdown
          }
        };
      });

      return { resumes: updatedResumes };
    });
  },

  // AI Interview Simulator Flow
  startInterview: (role) => {
    const questions = [
      {
        id: 'q1',
        question: `Based on your resume, you worked at Tesla on React dashboards. How did you design those dashboards for performance and heavy data loads?`,
        suggestedKws: ['virtualization', 'memoization', 'caching', 'useMemo', 'lazy loading']
      },
      {
        id: 'q2',
        question: `Your resume lists Node.js. Can you explain how Node.js handles asynchronous operations and how you utilized the Event Loop?`,
        suggestedKws: ['event loop', 'callback queue', 'non-blocking', 'libuv', 'promises']
      },
      {
        id: 'q3',
        question: `You list Docker as a missing skill on Vercel's requirements. How do you plan to handle containerization in a collaborative cloud deployment?`,
        suggestedKws: ['dockerfile', 'images', 'containers', 'volumes', 'microservices']
      }
    ];

    set({
      activeInterview: {
        role,
        currentQuestionIndex: 0,
        questions,
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
    const currentQuestion = activeInterview.questions[currentIdx];

    const keywordsFound = currentQuestion.suggestedKws.filter(kw => 
      answerText.toLowerCase().includes(kw.toLowerCase())
    );
    const score = Math.min(100, Math.max(50, 50 + (keywordsFound.length * 15) + (answerText.length > 50 ? 10 : 0)));

    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answerText,
      score,
      feedback: keywordsFound.length > 0 
        ? `Good. You accurately highlighted key concepts: ${keywordsFound.join(', ')}.`
        : `Your response was basic. Try referencing terms like: ${currentQuestion.suggestedKws.slice(0, 3).join(', ')}.`
    };

    const updatedAnswers = [...activeInterview.answers, newAnswer];
    const isLastQuestion = currentIdx >= activeInterview.questions.length - 1;

    if (isLastQuestion) {
      const totalScore = Math.round(updatedAnswers.reduce((sum, a) => sum + a.score, 0) / updatedAnswers.length);
      const interviewSummary = {
        id: `int-${Math.random().toString(36).substr(2, 9)}`,
        role: activeInterview.role,
        company: 'AI Recruitment Evaluator',
        date: new Date().toISOString().split('T')[0],
        score: totalScore,
        feedback: `Completed with an overall score of ${totalScore}%. Strong conceptual grasp in frontend dashboard optimizations. Target deeper research on backend scaling and infrastructure concepts.`
      };

      set(state => ({
        activeInterview: {
          ...state.activeInterview,
          answers: updatedAnswers,
          completed: true,
          feedback: interviewSummary.feedback
        },
        interviews: [interviewSummary, ...state.interviews]
      }));
    } else {
      set({
        activeInterview: {
          ...activeInterview,
          answers: updatedAnswers,
          currentQuestionIndex: currentIdx + 1
        }
      });
    }
  },

  resetInterview: () => {
    set({ activeInterview: null });
  }
}));
