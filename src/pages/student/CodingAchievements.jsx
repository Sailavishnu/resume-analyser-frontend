/**
 * Coding Achievements Page
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Star,
  Target,
  Users,
  Flame,
  Crown,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  RotateCcw
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import { 
  AchievementsGrid, 
  ACHIEVEMENTS_LIBRARY, 
  ACHIEVEMENT_CATEGORIES 
} from '../../components/coding/AchievementSystem';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const FILTER_OPTIONS = [
  { id: 'all', name: 'All Categories', icon: Trophy },
  ...Object.values(ACHIEVEMENT_CATEGORIES)
];

export default function CodingAchievements() {
  const {
    userStats,
    loading,
    fetchUserStats
  } = useCodingStore();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unlocked, locked
  const [sortBy, setSortBy] = useState('category'); // category, rarity, date

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Convert achievements library to array
  const allAchievements = Object.values(ACHIEVEMENTS_LIBRARY);
  
  // Get user's unlocked achievements
  const userAchievements = userStats?.achievements || [];
  
  // Filter achievements based on current filters
  const filteredAchievements = allAchievements.filter(achievement => {
    // Category filter
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) {
      return false;
    }
    
    // Search filter
    if (searchFilter && !achievement.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    
    // Status filter
    const isUnlocked = userAchievements.some(ua => ua.id === achievement.id);
    if (statusFilter === 'unlocked' && !isUnlocked) return false;
    if (statusFilter === 'locked' && isUnlocked) return false;
    
    return true;
  });

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      case 'date':
        const aUnlocked = userAchievements.find(ua => ua.id === a.id);
        const bUnlocked = userAchievements.find(ua => ua.id === b.id);
        if (aUnlocked && bUnlocked) {
          return new Date(bUnlocked.unlocked_at) - new Date(aUnlocked.unlocked_at);
        }
        return aUnlocked ? -1 : bUnlocked ? 1 : 0;
      case 'category':
      default:
        return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
    }
  });

  // Calculate statistics
  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = (unlockedCount / totalCount * 100).toFixed(1);
  
  const categoryStats = Object.values(ACHIEVEMENT_CATEGORIES).map(category => {
    const categoryAchievements = allAchievements.filter(a => a.category === category.id);
    const unlockedInCategory = userAchievements.filter(ua => 
      categoryAchievements.some(ca => ca.id === ua.id)
    ).length;
    
    return {
      ...category,
      total: categoryAchievements.length,
      unlocked: unlockedInCategory,
      percentage: categoryAchievements.length > 0 ? (unlockedInCategory / categoryAchievements.length * 100) : 0
    };
  });

  const totalXPFromAchievements = userAchievements.reduce((sum, ua) => {
    const achievement = allAchievements.find(a => a.id === ua.id);
    return sum + (achievement?.xp_reward || 0);
  }, 0);

  const clearFilters = () => {
    setCategoryFilter('all');
    setSearchFilter('');
    setStatusFilter('all');
    setSortBy('category');
  };

  const activeFiltersCount = [
    categoryFilter !== 'all',
    searchFilter.length > 0,
    statusFilter !== 'all',
    sortBy !== 'category'
  ].filter(Boolean).length;

  if (loading.stats) {
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
            Achievements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Unlock badges and earn rewards for your coding milestones
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {completionPercentage}% Complete
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {unlockedCount}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalXPFromAchievements}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {completionPercentage}%
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 capitalize">
                {userStats?.current_rank || 'Newbie'}
              </p>
            </div>
            <Crown className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Category Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Progress by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryStats.map(category => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/30 mb-3`}>
                  <IconComponent className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {category.unlocked}/{category.total}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-${category.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {category.percentage.toFixed(0)}%
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search achievements..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setCategoryFilter(option.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    categoryFilter === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{option.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Achievements</option>
              <option value="unlocked">Unlocked Only</option>
              <option value="locked">Locked Only</option>
            </select>
            
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="category">Sort by Category</option>
              <option value="rarity">Sort by Rarity</option>
              <option value="date">Sort by Unlock Date</option>
            </select>
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 dark:text-gray-400"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters ({activeFiltersCount})
            </Button>
          )}
        </div>
      </Card>

      {/* Achievements Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sortedAchievements.length} Achievement{sortedAchievements.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        {sortedAchievements.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Achievements Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters to see more achievements.
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <AchievementsGrid
            achievements={sortedAchievements}
            userAchievements={userAchievements}
            categoryFilter={categoryFilter}
          />
        )}
      </div>
    </div>
  );
}