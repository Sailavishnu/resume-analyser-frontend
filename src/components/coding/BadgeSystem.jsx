/**
 * Badge System Components
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Star,
  Crown,
  Trophy,
  Medal,
  Award,
  Zap,
  Flame,
  Target,
  Code2,
  BookOpen,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';

import Badge from '../ui/Badge';

// Badge Types and Configurations
const BADGE_TYPES = {
  RANK: {
    id: 'rank',
    name: 'Rank Badges',
    description: 'Earned through overall progress and XP'
  },
  SKILL: {
    id: 'skill',
    name: 'Skill Badges',
    description: 'Demonstrate mastery in specific areas'
  },
  MILESTONE: {
    id: 'milestone',
    name: 'Milestone Badges',
    description: 'Celebrate important achievements'
  },
  SPECIAL: {
    id: 'special',
    name: 'Special Badges',
    description: 'Limited edition and event badges'
  }
};

// Predefined Badges
const BADGES_LIBRARY = {
  // Rank Badges
  newbie_badge: {
    id: 'newbie_badge',
    name: 'Newbie',
    description: 'Welcome to the coding journey!',
    icon: '🌱',
    type: 'rank',
    color: '#6B7280',
    requirement: 'Starting rank',
    rarity: 'common'
  },
  pupil_badge: {
    id: 'pupil_badge',
    name: 'Pupil',
    description: 'Learning the fundamentals',
    icon: '📚',
    type: 'rank',
    color: '#10B981',
    requirement: '1200+ XP',
    rarity: 'common'
  },
  specialist_badge: {
    id: 'specialist_badge',
    name: 'Specialist',
    description: 'Specialized knowledge acquired',
    icon: '🎯',
    type: 'rank',
    color: '#06B6D4',
    requirement: '2600+ XP',
    rarity: 'uncommon'
  },
  expert_badge: {
    id: 'expert_badge',
    name: 'Expert',
    description: 'Advanced problem-solving skills',
    icon: '⭐',
    type: 'rank',
    color: '#3B82F6',
    requirement: '4200+ XP',
    rarity: 'rare'
  },
  master_badge: {
    id: 'master_badge',
    name: 'Master',
    description: 'Mastery achieved in coding',
    icon: '👑',
    type: 'rank',
    color: '#F59E0B',
    requirement: '6300+ XP',
    rarity: 'epic'
  },
  grandmaster_badge: {
    id: 'grandmaster_badge',
    name: 'Grandmaster',
    description: 'Elite coding excellence',
    icon: '💎',
    type: 'rank',
    color: '#EF4444',
    requirement: '8700+ XP',
    rarity: 'legendary'
  },
  
  // Skill Badges
  algorithm_master: {
    id: 'algorithm_master',
    name: 'Algorithm Master',
    description: 'Solved 50+ algorithm problems',
    icon: '🔬',
    type: 'skill',
    color: '#8B5CF6',
    requirement: 'Solve 50 algorithm problems',
    rarity: 'rare'
  },
  data_structure_expert: {
    id: 'data_structure_expert',
    name: 'Data Structure Expert',
    description: 'Mastered arrays, trees, graphs',
    icon: '🏗️',
    type: 'skill',
    color: '#F59E0B',
    requirement: 'Solve 30 data structure problems',
    rarity: 'rare'
  },
  dynamic_programming_guru: {
    id: 'dynamic_programming_guru',
    name: 'DP Guru',
    description: 'Dynamic programming specialist',
    icon: '🧩',
    type: 'skill',
    color: '#EC4899',
    requirement: 'Solve 20 DP problems',
    rarity: 'epic'
  },
  graph_theorist: {
    id: 'graph_theorist',
    name: 'Graph Theorist',
    description: 'Graph algorithm specialist',
    icon: '🕸️',
    type: 'skill',
    color: '#10B981',
    requirement: 'Solve 15 graph problems',
    rarity: 'rare'
  },
  
  // Language Badges
  python_ninja: {
    id: 'python_ninja',
    name: 'Python Ninja',
    description: 'Python programming expert',
    icon: '🐍',
    type: 'skill',
    color: '#3776AB',
    requirement: 'Solve 50 problems in Python',
    rarity: 'uncommon'
  },
  javascript_wizard: {
    id: 'javascript_wizard',
    name: 'JavaScript Wizard',
    description: 'JavaScript mastery achieved',
    icon: '⚡',
    type: 'skill',
    color: '#F7DF1E',
    requirement: 'Solve 50 problems in JavaScript',
    rarity: 'uncommon'
  },
  
  // Milestone Badges
  first_solve: {
    id: 'first_solve',
    name: 'First Steps',
    description: 'Completed first problem',
    icon: '🎊',
    type: 'milestone',
    color: '#10B981',
    requirement: 'Solve 1 problem',
    rarity: 'common'
  },
  century_club: {
    id: 'century_club',
    name: 'Century Club',
    description: 'Solved 100 problems',
    icon: '💯',
    type: 'milestone',
    color: '#8B5CF6',
    requirement: 'Solve 100 problems',
    rarity: 'epic'
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Lightning-fast solutions',
    icon: '⚡',
    type: 'milestone',
    color: '#F59E0B',
    requirement: 'Solve with <100ms runtime',
    rarity: 'rare'
  },
  
  // Special Badges
  early_adopter: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Beta platform participant',
    icon: '🚀',
    type: 'special',
    color: '#EC4899',
    requirement: 'Joined during beta',
    rarity: 'legendary'
  },
  weekly_champion: {
    id: 'weekly_champion',
    name: 'Weekly Champion',
    description: 'Won weekly challenge',
    icon: '🏆',
    type: 'special',
    color: '#F59E0B',
    requirement: 'Complete weekly challenge',
    rarity: 'epic'
  },
  community_helper: {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Active community member',
    icon: '🤝',
    type: 'special',
    color: '#10B981',
    requirement: 'Help other users',
    rarity: 'uncommon'
  }
};

const RARITY_STYLES = {
  common: {
    border: 'border-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    glow: false
  },
  uncommon: {
    border: 'border-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    glow: false
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    glow: true
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    glow: true
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    glow: true
  }
};

// Individual Badge Component
export function BadgeCard({ 
  badge, 
  owned = false, 
  size = 'md',
  showDetails = false,
  onClick 
}) {
  const rarityStyle = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common;
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${rarityStyle.border} ${rarityStyle.bg}
        ${owned ? 'opacity-100' : 'opacity-50 grayscale'}
        ${rarityStyle.glow && owned ? 'shadow-lg' : ''}
      `}
      onClick={() => onClick?.(badge)}
      title={badge.description}
    >
      {/* Badge Icon */}
      <div className={`
        flex items-center justify-center rounded-full border-2 mb-2
        ${sizeClasses[size]}
        ${owned ? rarityStyle.border : 'border-gray-300 dark:border-gray-600'}
        ${owned ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'}
      `}>
        <span className="text-2xl">{badge.icon}</span>
      </div>
      
      {/* Badge Name */}
      <div className="text-center">
        <h3 className={`font-bold text-xs ${
          owned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {badge.name}
        </h3>
        
        {showDetails && (
          <>
            <p className={`text-xs mt-1 ${
              owned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {badge.description}
            </p>
            
            <Badge
              variant={badge.rarity === 'legendary' ? 'yellow' : 'gray'}
              size="sm"
              className="mt-2"
            >
              {badge.rarity}
            </Badge>
          </>
        )}
      </div>
      
      {/* Rarity Indicator */}
      <div 
        className="absolute top-1 right-1 w-3 h-3 rounded-full"
        style={{ backgroundColor: badge.color }}
      />
      
      {/* New Badge Indicator */}
      {owned && badge.isNew && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs">!</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Badge Collection Display
export function BadgeCollection({ 
  userBadges = [], 
  categoryFilter = 'all',
  className = '' 
}) {
  const allBadges = Object.values(BADGES_LIBRARY);
  
  const filteredBadges = allBadges.filter(badge => 
    categoryFilter === 'all' || badge.type === categoryFilter
  );
  
  const isOwned = (badgeId) => {
    return userBadges.some(ub => ub.id === badgeId);
  };
  
  return (
    <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 ${className}`}>
      {filteredBadges.map(badge => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          owned={isOwned(badge.id)}
          showDetails={true}
        />
      ))}
    </div>
  );
}

// Mini Badge Display (for profiles, etc.)
export function MiniBadge({ badge, size = 'sm', owned = true }) {
  if (!badge) return null;
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center rounded-full border-2 
        ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}
        ${owned ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 opacity-50'}
      `}
      title={`${badge.name}: ${badge.description}`}
    >
      <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
        {badge.icon}
      </span>
    </div>
  );
}

// Badge Showcase (featured badges)
export function BadgeShowcase({ 
  badges = [], 
  title = "Featured Badges",
  className = '' 
}) {
  if (badges.length === 0) return null;
  
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {badges.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            owned={true}
            size="lg"
            showDetails={false}
          />
        ))}
      </div>
    </div>
  );
}

// Progress towards next badge
export function BadgeProgress({ 
  targetBadge, 
  currentProgress, 
  targetProgress,
  className = '' 
}) {
  const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
  
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-2xl">{targetBadge.icon}</div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {targetBadge.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {targetBadge.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {currentProgress}/{targetProgress}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {targetBadge.requirement}
        </p>
      </div>
    </div>
  );
}

// Export badges library
export { BADGES_LIBRARY, BADGE_TYPES };