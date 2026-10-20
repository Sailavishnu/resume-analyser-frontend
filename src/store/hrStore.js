import { create } from 'zustand';
import api from '../services/apiClient';

const normalizeJob = (job) => ({
  ...job,
  id: job.id || job._id,
  department: job.department || '—',
  applicantsCount: job.applicant_count || 0,
  shortlistedCount: 0,
  status: job.status || 'active',
  createdDate: job.created_at,
  weights: job.matching_config || {},
});

const normalizeCandidate = (item) => ({
  ...item,
  id: item.application_id,
  name: item.full_name || 'Student',
  email: item.email || '',
  skills: item.skills || [],
  targetRole: item.target_role,
  appliedCampaignId: item.job_id,
  matchScore: item.overall_score,
  appliedDate: item.applied_at,
});

export const useHrStore = create((set, get) => ({
  campaigns: [],
  candidates: [],
  acceptedStudents: [],
  selectedCampaignId: null,
  selectedCandidateId: null,
  parsing: false,
  loading: false,
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

  fetchJobs: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/jobs/hr/jobs', { params: { page: 1, page_size: 100 } });
      const campaigns = (res.data?.data || []).map(normalizeJob);
      set(state => ({ campaigns, loading: false, selectedCampaignId: campaigns.some(j => j.id === state.selectedCampaignId) ? state.selectedCampaignId : campaigns[0]?.id || null }));
      return campaigns;
    } catch (error) { set({ loading: false }); throw error; }
  },

  fetchCandidates: async (jobId = get().selectedCampaignId) => {
    if (!jobId) { set({ candidates: [] }); return []; }
    const res = await api.get(`/hr/candidates/jobs/${jobId}`, { params: { page: 1, page_size: 100 } });
    const candidates = (res.data?.data || []).map(normalizeCandidate);
    set({ candidates, selectedCampaignId: jobId });
    return candidates;
  },

  fetchAcceptedStudents: async () => {
    const res = await api.get('/hr/candidates/accepted');
    const acceptedStudents = res.data?.data || [];
    set({ acceptedStudents });
    return acceptedStudents;
  },

  setCandidateStatus: async (applicationId, status) => {
    await api.patch(`/hr/candidates/${applicationId}/status`, { status });
    if (status === 'hired') {
      set(state => ({ candidates: state.candidates.filter(candidate => candidate.id !== applicationId) }));
      await get().fetchAcceptedStudents();
    } else await get().fetchCandidates();
  },

  createCampaign: async (data) => {
    const res = await api.post('/jobs/hr/jobs', {
      title: data.title, department: data.department, description: data.description,
      location: data.location, work_mode: data.work_mode || 'On-site',
      experience_min: data.experience_min ?? 0, experience_max: data.experience_max ?? 2,
      required_skills: data.requiredSkills || data.required_skills || [],
      preferred_skills: data.preferredSkills || data.preferred_skills || [],
      matching_config: data.weights ? { skills: data.weights.skills, experience: data.weights.experience, education: data.weights.education, projects: data.weights.formatting } : undefined,
    });
    const campaign = normalizeJob(res.data?.data || res.data);
    set(state => ({ campaigns: [campaign, ...state.campaigns], selectedCampaignId: campaign.id }));
    return campaign;
  },

  screenZip: async (file, jobId) => {
    const body = new FormData();
    body.append('archive', file);
    body.append('job_id', jobId);
    set({ parsing: true });
    try {
      const res = await api.post('/hr/screening/zip', body, { timeout: 120000 });
      return res.data?.data || [];
    } finally { set({ parsing: false }); }
  },
}));
