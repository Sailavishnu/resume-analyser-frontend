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
  uploadResume: async (file, slot = 'primary', studentId = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const params = { slot };
    if (studentId) {
      params.student_id = studentId;
    }

    const response = await apiClient.post('/resumes/upload', formData, {
      params,
    });

    return response.data?.data || response.data;
  },

  /**
   * Fetch all real resumes for student from MongoDB
   */
  getStudentResumes: async (studentId = null) => {
    const params = {};
    if (studentId) {
      params.student_id = studentId;
    }

    const response = await apiClient.get('/resumes', { params });
    return response.data?.data || response.data || [];
  },

  /**
   * Update resume slot (primary / secondary)
   */
  setSlot: async (resumeId, slot, studentId = null) => {
    const params = { slot };
    if (studentId) {
      params.student_id = studentId;
    }

    const response = await apiClient.patch(`/resumes/${resumeId}/slot`, null, { params });
    return response.data?.data || response.data;
  },

  /**
   * Delete resume from Cloudinary and MongoDB
   */
  deleteResume: async (resumeId) => {
    const response = await apiClient.delete(`/resumes/${resumeId}`);
    return response.data?.data || response.data || true;
  },
};
