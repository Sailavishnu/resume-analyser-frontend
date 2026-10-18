/**
 * AI Mock Interview Service (Connects to FastAPI AI/ML Backend via apiClient)
 * 
 * Endpoints:
 * - POST /interviews/start
 * - POST /interviews/{sessionId}/answer
 * - GET  /interviews/{sessionId}
 * - GET  /interviews
 */

import apiClient from './apiClient';

export const interviewService = {
  /**
   * Check if candidate has uploaded a primary resume
   */
  checkPrimaryResume: async (studentId = null) => {
    try {
      const response = await apiClient.get('/interviews/check-primary-resume', {
        params: studentId ? { student_id: studentId } : {}
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Check primary resume error:', err.message);
      return { has_primary_resume: false };
    }
  },

  /**
   * Start a new real AI Interview session tailored to candidate's primary resume or chosen domain
   */
  startInterview: async ({ role, resumeId = null, studentId = null, domain = null }) => {
    if (!role?.trim()) throw new Error('Enter a target role before starting the interview.');
    const response = await apiClient.post('/interviews/start', {
      target_role: role.trim(),
      interview_type: 'technical',
      resume_id: resumeId,
      student_id: studentId,
      domain,
    });
    return response.data?.data || response.data;
  },

  /**
   * Submit answer for local NLP evaluation and fetch next adaptive question
   */
  submitAnswer: async ({ sessionId, answerText, studentId = null }) => {
    const response = await apiClient.post(`/interviews/${sessionId}/answer`, {
      answer_text: answerText,
      student_id: studentId,
    });
    return response.data?.data || response.data;
  },

  /**
   * Get past interview sessions
   */
  getPastInterviews: async () => {
    const response = await apiClient.get('/interviews');
    return response.data?.data || response.data || [];
  },
};
