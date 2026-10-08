/**
 * Coding Platform Main Dashboard
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  Users,
  Zap,
  Calendar
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import { useAuthStore } from '../../store/authStore';
import { AchievementNotification } from '../../components/coding/AchievementSystem';
import { BadgeShowcase } from '../../components/coding/BadgeSystem';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function CodingDashboard() {
  const { user } = useAuthStore();
  const {
    userStats,
    userProgress,
    weeklyChallenge,
    challengeProgress,
    problems,
    loading,
    achievementNotifications,
    fetchUserStats,
    fetchUserProgress,
    fetchWeeklyChallenge,
    fetchChallengeProgress,
    fetchProblems,
    joinWeeklyChallenge,
    removeAchievementNotification
  } = useCodingStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      try {
        await Promise.all([
          fetchUserStats(),
          fetchUserProgress(),
          fetchWeeklyChallenge(),
          fetchChallengeProgress(),
          fetchProblems({ limit: 5 }) // Recent problems
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const getRankColor = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'newbie': return 'gray';
      case 'pupil': return 'green';
      case 'specialist': return 'cyan';
      case 'expert': return 'blue';
      case 'candidate_master': return 'purple';
      case 'master': return 'orange';
      case 'grandmaster': return 'red';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'yellow';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  if (loading.stats || loading.challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coding Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sharpen your programming skills and compete with others
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={getRankColor(userStats?.current_rank)}
            size="lg"
            className="capitalize"
          >
            <Award className="w-4 h-4 mr-1" />
            {userStats?.current_rank || 'Newbie'}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total XP
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats?.total_xp?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Problems Solved
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats?.problems_solved || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats?.current_streak || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Acceptance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userStats?.acceptance_rate ? `${userStats.acceptance_rate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weekly Challenge
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete all 3 problems to earn bonus XP and achievements!
              </p>
              
              {/* Challenge Progress */}
              <div className="space-y-2 mb-4">
                {weeklyChallenge.problems?.map((problem, index) => (
                  <div key={problem.problem_id} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${challengeProgress?.solved_problem_ids?.includes(problem.problem_id)
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {problem.title}
                    </span>
                    <Badge 
                      variant={getDifficultyColor(problem.difficulty)}
                      size="sm"
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progress: {challengeProgress?.problems_solved || 0}/{weeklyChallenge.problems?.length || 3}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="blue" size="sm">
                    +{weeklyChallenge.completion_xp_bonus} XP
                  </Badge>
                  {challengeProgress?.early_completion_eligible && (
                    <Badge variant="orange" size="sm">
                      +{weeklyChallenge.early_completion_bonus} Early Bonus
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              {challengeProgress?.is_completed ? (
                <Badge variant="green" size="lg">
                  <Trophy className="w-4 h-4 mr-1" />
                  Completed!
                </Badge>
              ) : (
                <Button
                  onClick={() => window.location.href = '/student/coding/challenges'}
                  variant="primary"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Start Challenge
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Problems */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommended Problems
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/student/coding/problems'}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {problems.slice(0, 5).map((problem) => (
                <motion.div
                  key={problem.problem_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => window.location.href = `/student/coding/problems/${problem.problem_id}`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {problem.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{problem.category}</span>
                      <span>•</span>
                      <span>{problem.acceptance_rate}% acceptance</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getDifficultyColor(problem.difficulty)} size="sm">
                      {problem.difficulty}
                    </Badge>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      +{problem.xp_reward} XP
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                onClick={() => window.location.href = '/student/coding/problems'}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Solve Problems
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/student/coding/leaderboard'}
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/student/coding/submissions'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Submissions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/student/coding/profile'}
              >
                <Users className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </div>
          </Card>

          {/* Achievement Preview */}
          {userStats?.achievements?.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {userStats.achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Achievement Notifications */}
      {achievementNotifications.map((notification) => (
        <AchievementNotification
          key={notification.id}
          achievement={notification.achievement}
          onClose={() => removeAchievementNotification(notification.achievement.id)}
        />
      ))}
    </div>
  );
}