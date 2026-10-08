/**
 * Coding Store - State management for coding platform
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import codingService from '../services/codingService';
import toast from 'react-hot-toast';

const useCodingStore = create(
  persist(
    (set, get) => ({
      // ========== State ==========
      problems: [],
      currentProblem: null,
      userStats: null,
      userProgress: null,
      submissions: [],
      leaderboard: null,
      weeklyChallenge: null,
      challengeProgress: null,
      
      // Loading states
      loading: {
        problems: false,
        problem: false,
        execution: false,
        submission: false,
        stats: false,
        leaderboard: false,
        challenge: false
      },
      
      // Code editor state
      editorSettings: {
        theme: 'vs-dark',
        fontSize: 14,
        language: 'python',
        autoSave: true,
        keyBinding: 'standard'
      },
      
      // Problem filters
      filters: {
        difficulty: 'all',
        category: 'all',
        status: 'all',
        tags: [],
        search: ''
      },
      
      // Pagination
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },

      // ========== Actions ==========
      
      // Problems
      fetchProblems: async (customFilters = {}) => {
        set((state) => ({
          loading: { ...state.loading, problems: true }
        }));
        
        try {
          const { filters, pagination } = get();
          const searchParams = {
            ...filters,
            ...customFilters,
            limit: pagination.limit,
            offset: (pagination.page - 1) * pagination.limit
          };
          
          const data = await codingService.getProblems(searchParams);
          
          set((state) => ({
            problems: data.problems || [],
            pagination: {
              ...state.pagination,
              total: data.total || 0
            },
            loading: { ...state.loading, problems: false }
          }));
          
          return data;
        } catch (error) {
          toast.error('Failed to fetch problems');
          set((state) => ({
            loading: { ...state.loading, problems: false }
          }));
          throw error;
        }
      },

      fetchProblem: async (problemId) => {
        set((state) => ({
          loading: { ...state.loading, problem: true }
        }));
        
        try {
          const data = await codingService.getProblem(problemId);
          
          set((state) => ({
            currentProblem: data,
            loading: { ...state.loading, problem: false }
          }));
          
          return data;
        } catch (error) {
          toast.error('Failed to fetch problem details');
          set((state) => ({
            loading: { ...state.loading, problem: false }
          }));
          throw error;
        }
      },

      // Code execution
      runCode: async (problemId, code, language = 'python') => {
        set((state) => ({
          loading: { ...state.loading, execution: true }
        }));
        
        try {
          const result = await codingService.runCode(problemId, code, language);
          
          set((state) => ({
            loading: { ...state.loading, execution: false }
          }));
          
          if (result.success) {
            toast.success('Code executed successfully');
          } else {
            toast.error('Code execution failed');
          }
          
          return result;
        } catch (error) {
          toast.error('Failed to execute code');
          set((state) => ({
            loading: { ...state.loading, execution: false }
          }));
          throw error;
        }
      },

      submitCode: async (problemId, code, language = 'python') => {
        set((state) => ({
          loading: { ...state.loading, submission: true }
        }));
        
        try {
          const result = await codingService.submitCode(problemId, code, language);
          
          set((state) => ({
            loading: { ...state.loading, submission: false }
          }));
          
          if (result.status === 'accepted') {
            toast.success(`🎉 Problem solved! +${result.xp_gained || 0} XP`);
            // Refresh user stats after successful submission
            get().fetchUserStats();
          } else if (result.status === 'wrong_answer') {
            toast.error(`Wrong answer (${result.passed_test_cases}/${result.total_test_cases} test cases passed)`);
          } else {
            toast.error(`Submission failed: ${result.status}`);
          }
          
          return result;
        } catch (error) {
          toast.error('Failed to submit code');
          set((state) => ({
            loading: { ...state.loading, submission: false }
          }));
          throw error;
        }
      },

      // User statistics
      fetchUserStats: async () => {
        set((state) => ({
          loading: { ...state.loading, stats: true }
        }));
        
        try {
          const stats = await codingService.getUserStats();
          
          set((state) => ({
            userStats: stats,
            loading: { ...state.loading, stats: false }
          }));
          
          return stats;
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
          set((state) => ({
            loading: { ...state.loading, stats: false }
          }));
          throw error;
        }
      },

      fetchUserProgress: async () => {
        try {
          const progress = await codingService.getUserProgress();
          set({ userProgress: progress });
          return progress;
        } catch (error) {
          console.error('Failed to fetch user progress:', error);
          throw error;
        }
      },

      // Submissions
      fetchSubmissions: async (filters = {}) => {
        try {
          const data = await codingService.getSubmissionHistory(filters);
          set({ submissions: data.submissions || [] });
          return data;
        } catch (error) {
          toast.error('Failed to fetch submissions');
          throw error;
        }
      },

      // Leaderboard
      fetchLeaderboard: async (type = 'global', limit = 50) => {
        set((state) => ({
          loading: { ...state.loading, leaderboard: true }
        }));
        
        try {
          const data = await codingService.getLeaderboard(type, limit);
          
          set((state) => ({
            leaderboard: data,
            loading: { ...state.loading, leaderboard: false }
          }));
          
          return data;
        } catch (error) {
          toast.error('Failed to fetch leaderboard');
          set((state) => ({
            loading: { ...state.loading, leaderboard: false }
          }));
          throw error;
        }
      },

      // Weekly Challenge
      fetchWeeklyChallenge: async () => {
        set((state) => ({
          loading: { ...state.loading, challenge: true }
        }));
        
        try {
          const challenge = await codingService.getWeeklyChallenge();
          
          set((state) => ({
            weeklyChallenge: challenge,
            loading: { ...state.loading, challenge: false }
          }));
          
          return challenge;
        } catch (error) {
          console.error('Failed to fetch weekly challenge:', error);
          set((state) => ({
            loading: { ...state.loading, challenge: false }
          }));
          throw error;
        }
      },

      joinWeeklyChallenge: async () => {
        try {
          const result = await codingService.joinWeeklyChallenge();
          
          if (result.success) {
            toast.success('Joined weekly challenge!');
            get().fetchWeeklyChallenge();
          }
          
          return result;
        } catch (error) {
          toast.error('Failed to join weekly challenge');
          throw error;
        }
      },

      fetchChallengeProgress: async () => {
        try {
          const progress = await codingService.getChallengeProgress();
          set({ challengeProgress: progress });
          return progress;
        } catch (error) {
          console.error('Failed to fetch challenge progress:', error);
          throw error;
        }
      },

      // Achievement notifications
      achievementNotifications: [],
      
      // Gamification
      showAchievementNotification: (achievement) => {
        set((state) => ({
          achievementNotifications: [...state.achievementNotifications, {
            id: Date.now(),
            achievement,
            timestamp: new Date()
          }]
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          set((state) => ({
            achievementNotifications: state.achievementNotifications.filter(
              notif => notif.achievement.id !== achievement.id
            )
          }));
        }, 5000);
      },
      
      removeAchievementNotification: (achievementId) => {
        set((state) => ({
          achievementNotifications: state.achievementNotifications.filter(
            notif => notif.achievement.id !== achievementId
          )
        }));
      },

      // Settings and preferences
      updateEditorSettings: (newSettings) => {
        set((state) => ({
          editorSettings: { ...state.editorSettings, ...newSettings }
        }));
      },

      updateFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
        // Auto-fetch problems with new filters
        get().fetchProblems();
      },

      updatePagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination }
        }));
      },

      // Reset functions
      resetCurrentProblem: () => {
        set({ currentProblem: null });
      },

      resetFilters: () => {
        set({
          filters: {
            difficulty: 'all',
            category: 'all',
            status: 'all',
            tags: [],
            search: ''
          }
        });
      }
    }),
    {
      name: 'coding-store',
      partialize: (state) => ({
        editorSettings: state.editorSettings,
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
);

export default useCodingStore;