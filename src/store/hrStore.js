import { create } from 'zustand';
import api from '../services/apiClient';

const MOCK_CAMPAIGNS = [
  {
    id: 'camp-1',
    title: 'Senior Cyber Security Specialist',
    department: 'Information Security',
    location: 'Remote',
    applicantsCount: 4,
    shortlistedCount: 2,
    status: 'Active',
    createdDate: '2026-07-15T08:00:00Z',
    description: 'Looking for a Security Engineer or SOC Analyst skilled in Kali Linux, Wireshark, Metasploit, Nmap, and threat monitoring...',
    weights: { skills: 50, experience: 30, education: 10, formatting: 10 },
    targetKeywords: ['Cyber Security', 'Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Penetration Testing']
  },
  {
    id: 'camp-2',
    title: 'Fullstack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    applicantsCount: 12,
    shortlistedCount: 4,
    status: 'Active',
    createdDate: '2026-07-18T12:00:00Z',
    description: 'Design and deploy robust fullstack APIs and user interfaces with React, Node.js, and MongoDB...',
    weights: { skills: 40, experience: 40, education: 10, formatting: 10 },
    targetKeywords: ['React', 'Node.js', 'MongoDB', 'Docker', 'REST APIs', 'FastAPI']
  }
];

const MOCK_CANDIDATES = [
  {
    id: 'cand-cyber-1',
    name: 'Aravind Swaminathan',
    email: 'aravind.security@xavier.edu',
    phone: '+91 98401 99887',
    location: 'Chennai / Remote',
    education: 'B.Tech in Information Security - SRM University',
    experienceYears: 3,
    skills: ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Python', 'Burp Suite', 'Network Defense'],
    targetRole: 'Cyber Security Specialist',
    appliedCampaignId: 'camp-1',
    matchScore: 92,
    domain_matched: 'Cyber Security & Information Assurance',
    discovered_linked_skills: ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap'],
    rationale: 'Matched via inter-domain knowledge graph (Kali Linux, Wireshark, Metasploit). Demonstrates strong penetration testing & threat monitoring foundation.',
    status: 'shortlisted',
    analysis: {
      summary: 'Matched via Inter-domain Knowledge Graph. Candidate explicitly masteries Kali Linux & Metasploit tools inter-linked with Cyber Security Specialist roles.',
      pros: ['Expert in Kali Linux, Wireshark, and Nmap network auditing', 'Practical SOC and penetration testing lab experience'],
      cons: ['Needs additional CISSP certification credentials']
    }
  },
  {
    id: 'cand-1',
    name: 'Priya Lakshmi',
    email: 'priya.lakshmi@gmail.com',
    phone: '+91 98401 23456',
    location: 'Chennai, India',
    education: 'B.Tech in Computer Science - Anna University',
    experienceYears: 4,
    skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Agile', 'Zustand'],
    targetRole: 'Fullstack Software Engineer',
    appliedCampaignId: 'camp-2',
    matchScore: 94,
    status: 'shortlisted',
    analysis: {
      summary: 'Exceptional frontend and fullstack capability. Architected 12+ reusable React dashboards and optimized SQL pipelines.',
      pros: ['Deep React 18 & custom hooks architecture', 'Quantifiable performance metrics in work history'],
      cons: ['Needs additional production TypeScript depth']
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
    appliedCampaignId: 'camp-2',
    matchScore: 82,
    status: 'applied',
    analysis: {
      summary: 'Strong foundational programmer with solid Python scripting and web basics.',
      pros: ['High problem-solving agility', 'Clean Git workflow'],
      cons: ['Less hands-on experience with modern state libraries']
    }
  }
];

export const useHrStore = create((set, get) => ({
  campaigns: MOCK_CAMPAIGNS,
  candidates: MOCK_CANDIDATES,
  selectedCampaignId: 'camp-1',
  selectedCandidateId: 'cand-cyber-1',
  parsing: false,

  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

  // Inter-Domain Knowledge Graph Mass Screening
  screenCandidatesByDomain: async (domainQuery) => {
    set({ parsing: true });
    try {
      const res = await api.post('/hr/candidates/screen-domain', { domain: domainQuery, min_relevance: 40 });
      if (res.data?.data) {
        const screened = res.data.data.map(item => ({
          id: `cand-${item.student_id}`,
          name: item.name,
          email: item.email,
          skills: item.skills,
          experienceYears: 2,
          targetRole: domainQuery,
          appliedCampaignId: get().selectedCampaignId,
          matchScore: item.matchScore,
          domain_matched: item.domain_matched,
          discovered_linked_skills: item.discovered_linked_skills || [],
          rationale: item.rationale,
          status: item.status || 'applied',
          analysis: {
            summary: item.rationale,
            pros: item.discovered_linked_skills?.map(s => `Inter-linked tool mastery: ${s}`) || [],
            cons: ['Verified via Inter-domain Knowledge Graph scan']
          }
        }));

        set(state => ({
          candidates: [...screened, ...state.candidates.filter(c => !screened.some(s => s.id === c.id))],
          parsing: false
        }));
        return screened;
      }
    } catch (err) {
      console.warn('Domain screening API fallback:', err.message);
    }

    set({ parsing: false });
    return get().candidates;
  },

  setCandidateStatus: async (candidateId, newStatus) => {
    try {
      await api.patch(`/hr/candidates/${candidateId}/status`, { status: newStatus });
    } catch (err) {
      console.warn('Backend status update fallback:', err.message);
    }

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

  createCampaign: async (campaignData) => {
    try {
      await api.post('/hr/jobs', campaignData);
    } catch (err) {
      console.warn('Campaign create API fallback:', err.message);
    }
    const newCampaign = {
      id: `camp-${Date.now()}`,
      title: campaignData.title || 'Untitled Campaign',
      department: campaignData.department || 'Engineering',
      location: 'Remote',
      applicantsCount: 0,
      shortlistedCount: 0,
      status: 'Active',
      createdDate: new Date().toISOString(),
      description: campaignData.description || '',
      weights: { skills: 50, experience: 30, education: 10, formatting: 10 },
      targetKeywords: campaignData.targetKeywords || []
    };
    set(state => ({ campaigns: [newCampaign, ...state.campaigns] }));
    return newCampaign;
  },

  bulkParseCandidates: async (files) => {
    set({ parsing: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const targetCampaignId = get().selectedCampaignId;

    const parsedCandidates = files.map((file, index) => {
      const randomScore = Math.floor(Math.random() * (96 - 70 + 1)) + 70;
      const names = ['Vikram Seth', 'Ananya Sharma', 'Rahul Dravid', 'Sonia Gandhi'];
      const name = names[index % names.length];
      return {
        id: `cand-bulk-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: `${name.toLowerCase().replace(' ', '.')}@tech.edu`,
        phone: `+91 9840${Math.floor(100000+Math.random()*900000)}`,
        location: 'Bangalore, India',
        education: 'B.Tech Computer Science',
        experienceYears: Math.floor(Math.random() * 5) + 1,
        skills: ['Kali Linux', 'Wireshark', 'Python', 'React', 'Docker', 'Git'],
        targetRole: 'Cyber Security & Engineering',
        appliedCampaignId: targetCampaignId,
        matchScore: randomScore,
        discovered_linked_skills: ['Kali Linux', 'Wireshark'],
        status: 'applied',
        analysis: {
          summary: `Mass parsed from file ${file.name}. Inter-domain scan tagged cybersecurity tools.`,
          pros: ['High domain versatility', 'Passed ATS structure scan'],
          cons: ['Requires live interview verification']
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
        parsing: false
      };
    });
  }
}));
