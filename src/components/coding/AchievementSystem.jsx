/**
 * Achievement System Components
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Star,
  Flame,
  Target,
  Zap,
  Crown,
  Shield,
  Sparkles,
  Gift,
  Clock,
  Code2,
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  X
} from 'lucide-react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
  PROBLEM_SOLVING: {
    id: 'problem_solving',
    name: 'Problem Solving',
    icon: Target,
    color: 'blue',
    description: 'Master different types of problems'
  },
  CONSISTENCY: {
    id: 'consistency', 
    name: 'Consistency',
    icon: Flame,
    color: 'orange',
    description: 'Build and maintain coding habits'
  },
  SKILL_MASTERY: {
    id: 'skill_mastery',
    name: 'Skill Mastery',
    icon: Crown,
    color: 'purple',
    description: 'Achieve excellence in coding skills'
  },
  COMMUNITY: {
    id: 'community',
    name: 'Community',
    icon: Users,
    color: 'green',
    description: 'Engage with the coding community'
  },
  SPECIAL: {
    id: 'special',
    name: 'Special Events',
    icon: Sparkles,
    color: 'pink',
    description: 'Limited time and special achievements'
  }
};

// Predefined Achievements
const ACHIEVEMENTS_LIBRARY = {
  // Problem Solving Achievements
  first_solve: {
    id: 'first_solve',
    title: 'First Steps',
    description: 'Solve your first coding problem',
    icon: '🎯',
    category: 'problem_solving',
    xp_reward: 50,
    rarity: 'common',
    unlock_condition: 'Solve 1 problem'
  },
  problem_solver_10: {
    id: 'problem_solver_10',
    title: 'Getting Started',
    description: 'Solve 10 coding problems',
    icon: '📚',
    category: 'problem_solving',
    xp_reward: 100,
    rarity: 'common',
    unlock_condition: 'Solve 10 problems'
  },
  problem_solver_50: {
    id: 'problem_solver_50',
    title: 'Problem Crusher',
    description: 'Solve 50 coding problems',
    icon: '⚡',
    category: 'problem_solving',
    xp_reward: 250,
    rarity: 'uncommon',
    unlock_condition: 'Solve 50 problems'
  },
  problem_solver_100: {
    id: 'problem_solver_100',
    title: 'Century Club',
    description: 'Solve 100 coding problems',
    icon: '💯',
    category: 'problem_solving',
    xp_reward: 500,
    rarity: 'rare',
    unlock_condition: 'Solve 100 problems'
  },
  
  // Consistency Achievements
  daily_streak_3: {
    id: 'daily_streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day solving streak',
    icon: '🔥',
    category: 'consistency',
    xp_reward: 75,
    rarity: 'common',
    unlock_condition: '3-day streak'
  },
  daily_streak_7: {
    id: 'daily_streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day solving streak',
    icon: '🏆',
    category: 'consistency',
    xp_reward: 150,
    rarity: 'uncommon',
    unlock_condition: '7-day streak'
  },
  daily_streak_30: {
    id: 'daily_streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day solving streak',
    icon: '👑',
    category: 'consistency',
    xp_reward: 750,
    rarity: 'epic',
    unlock_condition: '30-day streak'
  },
  
  // Skill Mastery Achievements
  easy_master: {
    id: 'easy_master',
    title: 'Easy Peasy',
    description: 'Solve 20 easy problems',
    icon: '🌟',
    category: 'skill_mastery',
    xp_reward: 200,
    rarity: 'common',
    unlock_condition: 'Solve 20 easy problems'
  },
  medium_master: {
    id: 'medium_master',
    title: 'Rising Challenge',
    description: 'Solve 15 medium problems',
    icon: '⭐',
    category: 'skill_mastery',
    xp_reward: 300,
    rarity: 'uncommon',
    unlock_condition: 'Solve 15 medium problems'
  },
  hard_master: {
    id: 'hard_master',
    title: 'Hardcore Coder',
    description: 'Solve 5 hard problems',
    icon: '💎',
    category: 'skill_mastery',
    xp_reward: 500,
    rarity: 'rare',
    unlock_condition: 'Solve 5 hard problems'
  },
  
  // Language Achievements
  python_master: {
    id: 'python_master',
    title: 'Python Charmer',
    description: 'Solve 25 problems in Python',
    icon: '🐍',
    category: 'skill_mastery',
    xp_reward: 200,
    rarity: 'uncommon',
    unlock_condition: 'Solve 25 problems in Python'
  },
  
  // Speed Achievements
  speed_demon: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Solve a problem in under 100ms',
    icon: '⚡',
    category: 'skill_mastery',
    xp_reward: 150,
    rarity: 'rare',
    unlock_condition: 'Runtime < 100ms'
  },
  
  // Community Achievements
  leaderboard_top10: {
    id: 'leaderboard_top10',
    title: 'Elite Coder',
    description: 'Reach top 10 in global leaderboard',
    icon: '🏅',
    category: 'community',
    xp_reward: 1000,
    rarity: 'legendary',
    unlock_condition: 'Top 10 global rank'
  },
  
  // Special Achievements
  weekly_champion: {
    id: 'weekly_champion',
    title: 'Weekly Champion',
    description: 'Win a weekly challenge',
    icon: '🏆',
    category: 'special',
    xp_reward: 500,
    rarity: 'epic',
    unlock_condition: 'Complete weekly challenge'
  }
};

const RARITY_CONFIG = {
  common: { color: '#6B7280', glow: false },
  uncommon: { color: '#10B981', glow: false },
  rare: { color: '#3B82F6', glow: true },
  epic: { color: '#8B5CF6', glow: true },
  legendary: { color: '#F59E0B', glow: true }
};

// Achievement Card Component
export function AchievementCard({ achievement, unlocked = false, progress = null, onClick }) {
  const rarityConfig = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;
  const category = ACHIEVEMENT_CATEGORIES[achievement.category];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        unlocked 
          ? `border-${category.color}-500 bg-gradient-to-br from-${category.color}-50 to-${category.color}-100 dark:from-${category.color}-900/20 dark:to-${category.color}-800/20`
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
      } ${rarityConfig.glow && unlocked ? 'shadow-lg' : ''}`}
      onClick={() => onClick?.(achievement)}
    >
      {/* Rarity Indicator */}
      <div className={`absolute top-0 right-0 w-0 h-0 border-l-[30px] border-b-[30px] border-l-transparent`} 
           style={{ borderBottomColor: rarityConfig.color }}>
      </div>
      
      <div className="p-4">
        {/* Achievement Icon */}
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
            {achievement.icon}
          </div>
          {unlocked && (
            <Badge variant={category.color} size="sm">
              +{achievement.xp_reward} XP
            </Badge>
          )}
        </div>
        
        {/* Achievement Info */}
        <div>
          <h3 className={`font-bold text-sm mb-1 ${
            unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {achievement.title}
          </h3>
          
          <p className={`text-xs mb-2 ${
            unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="gray" size="sm">
              {achievement.rarity}
            </Badge>
            
            {progress && !unlocked && (
              <div className="text-xs text-gray-500">
                {progress.current}/{progress.target}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar (if applicable) */}
        {progress && !unlocked && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className={`bg-${category.color}-500 h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Unlock Date */}
        {unlocked && achievement.unlocked_at && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Achievement Details Modal
export function AchievementModal({ achievement, isOpen, onClose }) {
  if (!achievement) return null;
  
  const category = ACHIEVEMENT_CATEGORIES[achievement.category];
  const CategoryIcon = category.icon;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{achievement.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {achievement.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CategoryIcon className={`w-5 h-5 text-${category.color}-500`} />
              <span className="font-medium text-gray-900 dark:text-white">Category</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{category.name}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900 dark:text-white">Rarity</span>
            </div>
            <Badge variant="gray" size="sm" className="capitalize">
              {achievement.rarity}
            </Badge>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">XP Reward</span>
            </div>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              +{achievement.xp_reward} XP
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Condition</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {achievement.unlock_condition}
            </p>
          </Card>
        </div>
        
        {achievement.unlocked_at && (
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-900 dark:text-green-100">
                Unlocked on {new Date(achievement.unlocked_at).toLocaleDateString()}
              </span>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
}

// Achievement Notification
export function AchievementNotification({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-600 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="text-3xl animate-bounce">{achievement.icon}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                Achievement Unlocked!
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              {achievement.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {achievement.description}
            </p>
            
            <Badge variant="yellow" size="sm">
              +{achievement.xp_reward} XP
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Achievements Grid Component
export function AchievementsGrid({ 
  achievements = [], 
  userAchievements = [], 
  categoryFilter = 'all',
  className = '' 
}) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const filteredAchievements = achievements.filter(achievement => 
    categoryFilter === 'all' || achievement.category === categoryFilter
  );
  
  const isUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.id === achievementId);
  };
  
  const getProgress = (achievementId) => {
    // This would come from user stats in real implementation
    return null;
  };
  
  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
  };
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={isUnlocked(achievement.id)}
            progress={getProgress(achievement.id)}
            onClick={handleAchievementClick}
          />
        ))}
      </div>
      
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAchievement(null);
        }}
      />
    </div>
  );
}

// Export achievements library
export { ACHIEVEMENTS_LIBRARY, ACHIEVEMENT_CATEGORIES };