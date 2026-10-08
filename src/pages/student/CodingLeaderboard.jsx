/**
 * Coding Platform Leaderboard Page
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Calendar,
  Flame,
  Star,
  Target,
  RefreshCw,
  Filter,
  Award
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const LEADERBOARD_TYPES = [
  { id: 'global', name: 'Global Ranking', icon: Trophy, description: 'All-time leaderboard' },
  { id: 'weekly', name: 'This Week', icon: Calendar, description: 'Weekly competition' },
  { id: 'streak', name: 'Streak Leaders', icon: Flame, description: 'Longest streaks' }
];

const getRankIcon = (rank) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
};

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

export default function CodingLeaderboard() {
  const { user } = useAuthStore();
  const {
    leaderboard,
    weeklyChallenge,
    loading,
    fetchLeaderboard,
    fetchWeeklyChallenge
  } = useCodingStore();

  const [activeTab, setActiveTab] = useState('global');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboardData();
  }, [activeTab]);

  const loadLeaderboardData = async () => {
    try {
      await fetchLeaderboard(activeTab, 100);
      if (activeTab === 'weekly') {
        await fetchWeeklyChallenge();
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadLeaderboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const getCurrentUserPosition = () => {
    if (!leaderboard?.leaderboard || !user) return null;
    
    return leaderboard.leaderboard.find(entry => entry.user_id === user.id) ||
           leaderboard.user_position;
  };

  const userPosition = getCurrentUserPosition();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compete with other coders and climb the rankings
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* User Position Card */}
      {userPosition && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRankIcon(userPosition.rank)}
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Your Position: #{userPosition.rank}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{userPosition.total_xp} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{userPosition.problems_solved} solved</span>
                </div>
                {userPosition.current_streak > 0 && (
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4" />
                    <span>{userPosition.current_streak} streak</span>
                  </div>
                )}
              </div>
            </div>
            
            <Badge variant={getRankColor(userPosition.rank_title)} size="lg">
              {userPosition.rank_title}
            </Badge>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {LEADERBOARD_TYPES.map(type => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === type.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <div className="text-left">
                    <div>{type.name}</div>
                    <div className="text-xs text-gray-400">{type.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Weekly Challenge Banner */}
      {activeTab === 'weekly' && weeklyChallenge && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Weekly Challenge
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete all problems for bonus rewards!
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {weeklyChallenge.participants} participants
              </div>
              <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                +{weeklyChallenge.completion_xp_bonus} XP bonus
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        {loading.leaderboard ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">User</div>
                <div className="col-span-2">
                  {activeTab === 'streak' ? 'Streak' : activeTab === 'weekly' ? 'Weekly XP' : 'Total XP'}
                </div>
                <div className="col-span-2">Problems</div>
                <div className="col-span-2">Accuracy</div>
                <div className="col-span-1">Rank</div>
              </div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {(leaderboard?.leaderboard || leaderboard?.weekly_leaderboard || []).map((entry, index) => (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    entry.user_id === user?.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {entry.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {entry.username}
                            {entry.user_id === user?.id && (
                              <Badge variant="blue" size="sm" className="ml-2">You</Badge>
                            )}
                          </div>
                          {entry.total_badges > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Award className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {entry.total_badges} badges
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main Metric */}
                    <div className="col-span-2">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {activeTab === 'streak' ? entry.current_streak :
                         activeTab === 'weekly' ? entry.weekly_xp :
                         entry.total_xp?.toLocaleString()}
                      </div>
                      {activeTab === 'streak' && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Max: {entry.max_streak}
                        </div>
                      )}
                    </div>

                    {/* Problems Solved */}
                    <div className="col-span-2">
                      <div className="text-gray-900 dark:text-white">
                        {activeTab === 'weekly' ? entry.weekly_solves : entry.problems_solved || 0}
                      </div>
                      {entry.difficulty_breakdown && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="green" size="sm">{entry.difficulty_breakdown?.easy || 0}</Badge>
                          <Badge variant="yellow" size="sm">{entry.difficulty_breakdown?.medium || 0}</Badge>
                          <Badge variant="red" size="sm">{entry.difficulty_breakdown?.hard || 0}</Badge>
                        </div>
                      )}
                    </div>

                    {/* Accuracy */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${entry.acceptance_rate || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.acceptance_rate?.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="col-span-1">
                      <Badge variant={getRankColor(entry.rank_title)} size="sm">
                        {entry.rank_title?.replace('_', ' ') || 'Newbie'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {leaderboard?.total_users && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{leaderboard.total_users} total ranked users</span>
                  </div>
                  <div>
                    Updated {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}