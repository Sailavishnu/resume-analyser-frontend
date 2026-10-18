/**
 * User Coding Profile and Progress Tracking Page
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Code2,
  Award,
  Star,
  Flame,
  Zap,
  BookOpen,
  Activity,
  Settings,
  Share2,
  Download,
  Edit3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

import useCodingStore from '../../store/codingStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const RANK_INFO = {
  newbie: { color: '#6B7280', title: 'Newbie', nextRank: 'Pupil', xpNeeded: 1200 },
  pupil: { color: '#10B981', title: 'Pupil', nextRank: 'Specialist', xpNeeded: 1400 },
  specialist: { color: '#06B6D4', title: 'Specialist', nextRank: 'Expert', xpNeeded: 1600 },
  expert: { color: '#3B82F6', title: 'Expert', nextRank: 'Candidate Master', xpNeeded: 1900 },
  candidate_master: { color: '#8B5CF6', title: 'Candidate Master', nextRank: 'Master', xpNeeded: 2100 },
  master: { color: '#F59E0B', title: 'Master', nextRank: 'Grandmaster', xpNeeded: 2400 },
  grandmaster: { color: '#EF4444', title: 'Grandmaster', nextRank: 'Legendary Grandmaster', xpNeeded: 3000 }
};

export default function CodingProfile() {
  const { user } = useAuthStore();
  const {
    userStats,
    userProgress,
    loading,
    fetchUserStats,
    fetchUserProgress,
    fetchSubmissions
  } = useCodingStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        await Promise.all([
          fetchUserStats(),
          fetchUserProgress()
        ]);

        // Fetch recent submissions for activity chart
        const submissions = await fetchSubmissions({ limit: 50 });
        setSubmissionHistory(submissions.submissions || []);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  const getRankInfo = () => {
    const currentRank = userStats?.current_rank || 'newbie';
    return RANK_INFO[currentRank] || RANK_INFO.newbie;
  };

  const calculateRankProgress = () => {
    const rankInfo = getRankInfo();
    const currentXP = userStats?.total_xp || 0;
    const progress = Math.min((currentXP / rankInfo.xpNeeded) * 100, 100);
    return {
      progress,
      xpNeeded: rankInfo.xpNeeded - currentXP,
      nextRank: rankInfo.nextRank
    };
  };

  const processActivityData = () => {
    if (!userProgress?.daily_activity) return [];
    
    return userProgress.daily_activity.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      solved: day.accepted,
      attempted: day.total - day.accepted,
      total: day.total
    }));
  };

  const processDifficultyData = () => {
    if (!userProgress?.difficulty_breakdown) return [];
    
    return Object.entries(userProgress.difficulty_breakdown).map(([difficulty, stats]) => ({
      name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      solved: stats.solved,
      attempted: stats.attempted,
      accuracy: stats.accuracy
    }));
  };

  const processLanguageData = () => {
    if (!userProgress?.language_usage) return [];
    
    return userProgress.language_usage.map(lang => ({
      name: lang.language.charAt(0).toUpperCase() + lang.language.slice(1),
      value: lang.solved,
      total: lang.attempted
    }));
  };

  const rankProgress = calculateRankProgress();

  if (loading.stats || loading.progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Badge
                variant={getRankInfo().color}
                className="text-xs font-bold px-2 py-1"
              >
                {getRankInfo().title}
              </Badge>
            </div>
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'Anonymous User'}
              </h1>
              <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>{userStats?.total_xp || 0} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{userStats?.problems_solved || 0} Solved</span>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4" />
                <span>{userStats?.current_streak || 0} Day Streak</span>
              </div>
            </div>

            {/* Rank Progress */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress to {rankProgress.nextRank}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {rankProgress.xpNeeded > 0 ? `${rankProgress.xpNeeded} XP needed` : 'Max rank!'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${rankProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'progress', name: 'Progress', icon: TrendingUp },
            { id: 'achievements', name: 'Achievements', icon: Award },
            { id: 'activity', name: 'Activity', icon: Activity }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total XP
                    </h3>
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userStats?.total_xp?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    +{userStats?.weekly_xp || 0} this week
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Problems Solved
                    </h3>
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userStats?.problems_solved || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {userStats?.acceptance_rate ? `${(userStats.acceptance_rate * 100).toFixed(1)}% success rate` : '0% success rate'}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Streak
                    </h3>
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userStats?.current_streak || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Max: {userStats?.max_streak || 0} days
                  </p>
                </Card>
              </div>

              {/* Activity Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Submission Activity (Last 30 Days)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processActivityData()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="solved"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Solved"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Total Attempts"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Difficulty Breakdown */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance by Difficulty
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processDifficultyData()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="solved" fill="#10B981" name="Solved" />
                      <Bar dataKey="attempted" fill="#E5E7EB" name="Attempted" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Language Usage */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Language Usage
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processLanguageData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {processLanguageData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Recent Achievements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {userStats?.achievements?.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(achievement.unlocked_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Solve problems to earn achievements!
                    </p>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Easy Solved</span>
                    <Badge variant="green" size="sm">{userStats?.easy_solved || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium Solved</span>
                    <Badge variant="yellow" size="sm">{userStats?.medium_solved || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hard Solved</span>
                    <Badge variant="red" size="sm">{userStats?.hard_solved || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Badges</span>
                    <Badge variant="purple" size="sm">{userStats?.total_badges || 0}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Learning Progress Over Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed progress analytics will be available here.
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Achievements
              </h3>
              {userStats?.achievements?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userStats.achievements.map((achievement, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Start solving problems to earn achievements!
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {submissionHistory.slice(0, 10).map((submission, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        submission.status === 'accepted' ? 'bg-green-500' :
                        submission.status === 'wrong_answer' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {submission.problem_title}
                      </span>
                      <Badge
                        variant={
                          submission.difficulty === 'easy' ? 'green' :
                          submission.difficulty === 'medium' ? 'yellow' : 'red'
                        }
                        size="sm"
                      >
                        {submission.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}