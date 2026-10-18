/**
 * Resume API Service (Connects to FastAPI + Cloudinary Backend via apiClient)
 * 
 * Supports:
 * - Real PDF file uploads to Cloudinary
 * - Automatic PDF text & section parsing (PyMuPDF / spaCy)
 * - 2-slot Vault management (Primary / Secondary)
 * - Real ATS & Health Scoring
 */

import apiClient from './apiClient';

export const resumeService = {
  /**
   * Upload real PDF resume to Cloudinary + MongoDB
   * @param {File} file - Real browser File object
   * @param {string} slot - 'primary' or 'secondary'
   * @param {string|null} studentId - Optional student ID
   */
  uploadResume: async (file, slot = 'primary') => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/resumes/upload', formData, {
      params: { slot },
    });

    return response.data?.data || response.data;
  },

  /**
   * Fetch all real resumes for student from MongoDB
   */
  getStudentResumes: async () => {
    const response = await apiClient.get('/resumes');
    return response.data?.data || response.data || [];
  },

  /**
   * Update resume slot (primary / secondary)
   */
  setSlot: async (resumeId, slot) => {
    const response = await apiClient.patch(`/resumes/${resumeId}/slot`, null, { params: { slot } });
    return response.data?.data || response.data;
  },

  /**
   * Delete resume from Cloudinary and MongoDB
   */
  deleteResume: async (resumeId) => {
    const response = await apiClient.delete(`/resumes/${resumeId}`);
    return response.data?.data || response.data || true;
  },

  generateEnhancements: async (resumeId, targetRole) => {
    const response = await apiClient.post(`/resumes/${resumeId}/enhancements`, { target_role: targetRole });
    return response.data?.data || [];
  },

  getEnhancements: async (resumeId) => {
    const response = await apiClient.get(`/resumes/${resumeId}/improvements`);
    return response.data?.data || [];
  },

  updateEnhancementStatus: async (improvementId, status) => {
    const response = await apiClient.patch(`/resumes/improvements/${improvementId}`, { status });
    return response.data?.data || response.data;
  },

  compareWithJobDescription: async (resumeId, jobDescription) => {
    const response = await apiClient.post('/jd-match/resume', {
      resume_id: resumeId,
      job_description: jobDescription,
    });
    return response.data?.data || response.data;
  },
};
