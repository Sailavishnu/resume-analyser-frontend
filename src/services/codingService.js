/**
 * Coding Service - API client for coding platform features
 */
import apiClient from './apiClient';

class CodingService {
  // ========== Problems ==========
  async getProblems(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.category) params.append('category', filters.category);
      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      
      const queryString = params.toString();
      const url = `/coding/problems${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  }

  async getProblem(problemId) {
    try {
      const response = await apiClient.get(`/coding/problems/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem:', error);
      throw error;
    }
  }

  // ========== Code Execution ==========
  async runCode(problemId, code, language = 'python') {
    try {
      const response = await apiClient.post('/coding/run', {
        problem_id: problemId,
        code,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error running code:', error);
      throw error;
    }
  }

  async submitCode(problemId, code, language = 'python') {
    try {
      const response = await apiClient.post('/coding/submit', {
        problem_id: problemId,
        code,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  }

  // ========== User Statistics ==========
  async getUserStats() {
    try {
      const response = await apiClient.get('/coding/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async getUserProgress() {
    try {
      const response = await apiClient.get('/coding/analytics/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  // ========== Submissions ==========
  async getSubmissionHistory(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.problemId) params.append('problem_id', filters.problemId);
      if (filters.language) params.append('language', filters.language);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      
      const queryString = params.toString();
      const url = `/coding/analytics/submissions${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching submission history:', error);
      throw error;
    }
  }

  // ========== Leaderboard ==========
  async getLeaderboard(type = 'global', limit = 50) {
    try {
      const response = await apiClient.get(`/coding/leaderboard/${type}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  async getWeeklyChallenge() {
    try {
      const response = await apiClient.get('/coding/challenges/weekly');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly challenge:', error);
      throw error;
    }
  }

  async joinWeeklyChallenge() {
    try {
      const response = await apiClient.post('/coding/challenges/weekly/join');
      return response.data;
    } catch (error) {
      console.error('Error joining weekly challenge:', error);
      throw error;
    }
  }

  async getChallengeProgress() {
    try {
      const response = await apiClient.get('/coding/challenges/weekly/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching challenge progress:', error);
      throw error;
    }
  }

  // ========== Problem Analytics ==========
  async getProblemAnalytics(problemId) {
    try {
      const response = await apiClient.get(`/coding/analytics/problems/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem analytics:', error);
      throw error;
    }
  }
}

export default new CodingService();