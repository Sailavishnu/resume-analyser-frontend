import { create } from 'zustand';

const MOCK_CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Remote',
    applicantsCount: 4,
    shortlistedCount: 1,
    status: 'Active',
    createdDate: '2026-07-15T08:00:00Z',
    description: 'Looking for a Senior React Engineer to help build our cloud infrastructure console dashboard...',
    weights: {
      skills: 45,
      experience: 35,
      education: 10,
      formatting: 10
    },
    targetKeywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Webpack']
  },
  {
    id: 'camp-2',
    title: 'Fullstack Engineer',
    department: 'Product',
    location: 'San Francisco, CA',
    applicantsCount: 28,
    shortlistedCount: 6,
    status: 'Active',
    createdDate: '2026-07-18T12:00:00Z',
    description: 'Design and deploy robust fullstack APIs and intuitive user interfaces for Stripe Payments...',
    weights: {
      skills: 40,
      experience: 40,
      education: 15,
      formatting: 5
    },
    targetKeywords: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'AWS', 'GraphQL']
  },
  {
    id: 'camp-3',
    title: 'Technical Support Representative',
    department: 'Operations',
    location: 'Austin, TX',
    applicantsCount: 8,
    shortlistedCount: 1,
    status: 'Draft',
    createdDate: '2026-07-25T14:30:00Z',
    description: 'Help customers configure and troubleshoot deployment issues inside customer dashboards...',
    weights: {
      skills: 30,
      experience: 30,
      education: 20,
      formatting: 20
    },
    targetKeywords: ['SQL', 'Technical Support', 'API Debugging', 'Communication', 'SaaS']
  }
];

const MOCK_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Priya Lakshmi',
    email: 'priya.lakshmi@gmail.com',
    phone: '+91 98401 23456',
    location: 'Chennai, India',
    education: 'B.Tech in Computer Science - Anna University',
    experienceYears: 4,
    skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile', 'Zustand', 'Tailwind CSS'],
    targetRole: 'Fullstack Software Engineer',
    appliedCampaignId: 'camp-1',
    matchScore: 94,
    status: 'shortlisted',
    analysis: {
      summary: 'Exceptional frontend and fullstack capability. Architected 12+ reusable React dashboards and optimized SQL pipelines.',
      pros: ['Deep React 18 & custom hooks architecture', 'Quantifiable performance metrics in work history', 'Clean ATS structure'],
      cons: ['Needs additional production TypeScript depth', 'Lacks containerization (Docker) in active projects']
    }
  },
  {
    id: 'cand-2',
    name: 'Karthik Kumar',
    email: 'karthik.k@outlook.com',
    phone: '+91 97910 87654',
    location: 'Coimbatore / Remote',
    education: 'B.E. in Software Engineering - PSG Tech',
    experienceYears: 2,
    skills: ['JavaScript', 'HTML5', 'CSS3', 'Python', 'Flask', 'SQL', 'Git'],
    targetRole: 'Frontend Developer',
    appliedCampaignId: 'camp-1',
    matchScore: 82,
    status: 'applied',
    analysis: {
      summary: 'Strong foundational programmer with solid Python scripting and web basics. Good potential for frontend growth.',
      pros: ['High problem-solving agility', 'Clean Git workflow and collaboration ethos'],
      cons: ['Less hands-on experience with modern state libraries (Zustand/Redux)', 'Resume layout has minor vertical spacing inconsistencies']
    }
  },
  {
    id: 'cand-3',
    name: 'Meenakshi Devi',
    email: 'meenakshi.devi@iitm.ac.in',
    phone: '+91 94440 56789',
    location: 'Chennai / Bangalore',
    education: 'M.Tech in Systems Engineering - IIT Madras',
    experienceYears: 6,
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Kubernetes', 'CI/CD', 'REST APIs'],
    targetRole: 'Fullstack Engineer',
    appliedCampaignId: 'camp-2',
    matchScore: 91,
    status: 'shortlisted',
    analysis: {
      summary: 'Seasoned backend and cloud architect. Deep microservices, containerization, and AWS serverless deployment expertise.',
      pros: ['6+ years scalable systems engineering', 'Expert Docker/Kubernetes container orchestration', 'Strong SQL indexing'],
      cons: ['Prefers backend focus over complex frontend interactive design systems']
    }
  },
  {
    id: 'cand-4',
    name: 'Divya Kannan',
    email: 'divya.kannan@ssn.edu.in',
    phone: '+91 98840 11223',
    location: 'Chennai, India',
    education: 'B.E. in Electrical & Computer Eng - SSN College of Engineering',
    experienceYears: 1,
    skills: ['C++', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Linux'],
    targetRole: 'Software Developer',
    appliedCampaignId: 'camp-1',
    matchScore: 68,
    status: 'applied',
    analysis: {
      summary: 'Strong algorithmic acumen and academic programming rigor, but lacking contemporary web framework stack.',
      pros: ['Solid algorithmic data structure foundations', 'Comfortable with low-level systems and database queries'],
      cons: ['No hands-on React or Node.js web frameworks listed', 'Resume format needs restructuring for web engineering ATS scans']
    }
  }
];

export const useHrStore = create((set, get) => ({
  campaigns: MOCK_CAMPAIGNS,
  candidates: MOCK_CANDIDATES,
  selectedCampaignId: 'camp-1',
  selectedCandidateId: 'cand-1',
  parsing: false,

  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

  createCampaign: async (campaignData) => {
    set({ parsing: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const text = campaignData.description.toLowerCase();
    const possibleKeywords = ['React', 'Node.js', 'TypeScript', 'Docker', 'Kubernetes', 'SQL', 'Python', 'AWS', 'GraphQL', 'Tailwind'];
    const extractedKeywords = possibleKeywords.filter(kw => text.includes(kw.toLowerCase()));
    if (extractedKeywords.length === 0) extractedKeywords.push('React', 'JavaScript');

    const newCampaign = {
      id: `camp-${Math.random().toString(36).substr(2, 9)}`,
      title: campaignData.title,
      department: campaignData.department || 'Engineering',
      location: campaignData.location || 'Remote',
      applicantsCount: 0,
      shortlistedCount: 0,
      status: 'Active',
      createdDate: new Date().toISOString(),
      description: campaignData.description,
      weights: campaignData.weights || { skills: 40, experience: 40, education: 10, formatting: 10 },
      targetKeywords: extractedKeywords
    };

    set(state => ({
      campaigns: [...state.campaigns, newCampaign],
      selectedCampaignId: newCampaign.id,
      parsing: false
    }));

    return newCampaign;
  },

  updateCampaignWeights: (campaignId, newWeights) => {
    set(state => {
      const updatedCampaigns = state.campaigns.map(camp => {
        if (camp.id === campaignId) {
          return { ...camp, weights: newWeights };
        }
        return camp;
      });
      return { campaigns: updatedCampaigns };
    });
  },

  setCandidateStatus: (candidateId, newStatus) => {
    set(state => {
      const updatedCandidates = state.candidates.map(cand => {
        if (cand.id === candidateId) {
          return { ...cand, status: newStatus };
        }
        return cand;
      });

      const updatedCampaigns = state.campaigns.map(camp => {
        const campaignCandidates = updatedCandidates.filter(c => c.appliedCampaignId === camp.id);
        const shortlisted = campaignCandidates.filter(c => c.status === 'shortlisted').length;
        return {
          ...camp,
          applicantsCount: campaignCandidates.length,
          shortlistedCount: shortlisted
        };
      });

      return { candidates: updatedCandidates, campaigns: updatedCampaigns };
    });
  },

  bulkParseCandidates: async (files) => {
    set({ parsing: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const targetCampaignId = get().selectedCampaignId;

    const parsedCandidates = files.map((file, index) => {
      const randomScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
      const names = ['Logan Howlett', 'Jean Grey', 'Scott Summers', 'Ororo Munroe'];
      const name = names[index % names.length];
      return {
        id: `cand-bulk-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: `${name.toLowerCase().replace(' ', '.')}@xavier.edu`,
        phone: `+1 (555) ${Math.floor(100+Math.random()*900)}-${Math.floor(1000+Math.random()*9000)}`,
        location: 'Westchester, NY',
        education: 'Xavier Institute for Gifted Youngsters',
        experienceYears: Math.floor(Math.random() * 8) + 1,
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Agile', 'Team Leadership'],
        targetRole: 'Software Developer',
        appliedCampaignId: targetCampaignId,
        matchScore: randomScore,
        status: 'applied',
        analysis: {
          summary: `Candidate parsed automatically from ${file.name}. Demonstrates strong core JavaScript proficiency.`,
          pros: ['High collaboration skills', 'Understands source control workflows'],
          cons: ['Lacks specific advanced tooling listed in keywords']
        }
      };
    });

    set(state => {
      const newCandidatePool = [...parsedCandidates, ...state.candidates];
      
      const updatedCampaigns = state.campaigns.map(camp => {
        if (camp.id === targetCampaignId) {
          const campaignCandidates = newCandidatePool.filter(c => c.appliedCampaignId === camp.id);
          return {
            ...camp,
            applicantsCount: campaignCandidates.length,
            shortlistedCount: campaignCandidates.filter(c => c.status === 'shortlisted').length
          };
        }
        return camp;
      });

      return {
        candidates: newCandidatePool,
        campaigns: updatedCampaigns,
        parsing: false,
        selectedCandidateId: parsedCandidates[0]?.id || state.selectedCandidateId
      };
    });
  }
}));
