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
    name: 'Sarah Connor',
    email: 'sarah.c@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    education: 'B.S. in Computer Science - UCLA',
    experienceYears: 4,
    skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile'],
    targetRole: 'Fullstack Engineer',
    appliedCampaignId: 'camp-1',
    matchScore: 92,
    status: 'shortlisted',
    analysis: {
      summary: 'Excellent React and Node developer. Strong project layout and code structure.',
      pros: ['Deep React skills with responsive dashboards', 'Quantifiable metrics in resume', 'Clear hierarchy'],
      cons: ['Missing TypeScript expertise', 'Needs Docker containerization knowledge']
    }
  },
  {
    id: 'cand-2',
    name: 'John Connor',
    email: 'john.c@resistance.net',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    education: 'Self-Taught / Dev Academy',
    experienceYears: 2,
    skills: ['JavaScript', 'HTML5', 'CSS3', 'Python', 'Flask', 'SQL'],
    targetRole: 'Junior Frontend Developer',
    appliedCampaignId: 'camp-1',
    matchScore: 78,
    status: 'applied',
    analysis: {
      summary: 'Passionate programmer with solid Python/JS basics, but formatting is raw and lacks nested React framework skills.',
      pros: ['Quick learner, python scripting capability', 'Clean coding styling'],
      cons: ['Formatting has margin issues', 'No commercial React work']
    }
  },
  {
    id: 'cand-3',
    name: 'Ellen Ripley',
    email: 'ripley@nostromo.org',
    phone: '+1 (555) 765-4321',
    location: 'Remote',
    education: 'M.S. in Systems Engineering - MIT',
    experienceYears: 8,
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Kubernetes', 'CI/CD'],
    targetRole: 'Fullstack Engineer',
    appliedCampaignId: 'camp-2',
    matchScore: 89,
    status: 'shortlisted',
    analysis: {
      summary: 'Veteran systems engineer. Superior backend capability, microservices, and orchestration operations.',
      pros: ['8+ years deep systems engineering', 'Expert docker/kubernetes setups', 'Solid database optimizations'],
      cons: ['Minimal modern styling experience (Tailwind/CSS)']
    }
  },
  {
    id: 'cand-4',
    name: 'T-800 Model 101',
    email: 'cyberdyne@skynet.com',
    phone: '+1 (000) 101-0101',
    location: 'Sunnyvale, CA',
    education: 'Cyberdyne Systems Architecture Ph.D.',
    experienceYears: 12,
    skills: ['Assembly', 'C++', 'Python', 'SQL', 'Systems Optimization', 'Hardware Diagnostics'],
    targetRole: 'Fullstack Engineer',
    appliedCampaignId: 'camp-2',
    matchScore: 61,
    status: 'rejected',
    analysis: {
      summary: 'Incredibly overqualified for low-level systems and math optimizations, but lacks visual framework/CSS stack entirely.',
      pros: ['Flawless system tracking', 'Unmatched logic skills'],
      cons: ['No modern web stack context', 'Resume format is rigid and cold']
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
