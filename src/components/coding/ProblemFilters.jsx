/**
 * Advanced Problem Filters Component
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  Clock,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: BookOpen },
  { id: 'array', name: 'Array', icon: Target },
  { id: 'string', name: 'String', icon: BookOpen },
  { id: 'linkedlist', name: 'Linked List', icon: Target },
  { id: 'tree', name: 'Tree', icon: Target },
  { id: 'graph', name: 'Graph', icon: Target },
  { id: 'dynamicprogramming', name: 'Dynamic Programming', icon: Zap },
  { id: 'greedy', name: 'Greedy', icon: Target },
  { id: 'backtracking', name: 'Backtracking', icon: Target },
  { id: 'sorting', name: 'Sorting', icon: Target },
  { id: 'searching', name: 'Binary Search', icon: Search },
  { id: 'math', name: 'Math', icon: BookOpen },
  { id: 'bitmanipulation', name: 'Bit Manipulation', icon: BookOpen },
  { id: 'twopointers', name: 'Two Pointers', icon: Target },
  { id: 'slidingwindow', name: 'Sliding Window', icon: Target },
  { id: 'stack', name: 'Stack', icon: Target },
  { id: 'queue', name: 'Queue', icon: Target },
  { id: 'heap', name: 'Heap', icon: Target },
  { id: 'trie', name: 'Trie', icon: Target },
  { id: 'unionfind', name: 'Union Find', icon: Target }
];

const DIFFICULTIES = [
  { id: 'all', name: 'All Levels', color: 'gray' },
  { id: 'easy', name: 'Easy', color: 'green' },
  { id: 'medium', name: 'Medium', color: 'yellow' },
  { id: 'hard', name: 'Hard', color: 'red' }
];

const STATUS_OPTIONS = [
  { id: 'all', name: 'All Problems', icon: BookOpen, description: 'Show all problems' },
  { id: 'solved', name: 'Solved', icon: Trophy, description: 'Problems you\'ve completed' },
  { id: 'attempted', name: 'Attempted', icon: Clock, description: 'Problems you\'ve tried' },
  { id: 'unattempted', name: 'Todo', icon: Target, description: 'Problems to solve' }
];

const QUICK_FILTERS = [
  {
    id: 'beginner',
    name: 'Beginner Friendly',
    description: 'Easy problems for learning',
    filters: { difficulty: 'easy', status: 'unattempted' }
  },
  {
    id: 'practice',
    name: 'Practice More',
    description: 'Medium problems you haven\'t solved',
    filters: { difficulty: 'medium', status: 'unattempted' }
  },
  {
    id: 'challenge',
    name: 'Challenge Yourself',
    description: 'Hard problems for experts',
    filters: { difficulty: 'hard' }
  },
  {
    id: 'retry',
    name: 'Retry Failed',
    description: 'Problems you attempted but didn\'t solve',
    filters: { status: 'attempted' }
  },
  {
    id: 'arrays',
    name: 'Array Masters',
    description: 'Focus on array problems',
    filters: { category: 'array' }
  },
  {
    id: 'algorithms',
    name: 'Algorithm Focus',
    description: 'Dynamic programming and greedy',
    filters: { category: 'dynamicprogramming' }
  }
];

export default function ProblemFilters({
  filters,
  onFiltersChange,
  onSearch,
  totalProblems = 0,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleQuickFilter = (quickFilter) => {
    const newFilters = { ...filters, ...quickFilter.filters };
    onFiltersChange(newFilters);
    setIsExpanded(false);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      difficulty: 'all',
      category: 'all',
      status: 'all',
      search: '',
      tags: []
    };
    onFiltersChange(resetFilters);
    setSearchTerm('');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value && value.trim().length > 0;
    if (key === 'tags') return value && value.length > 0;
    return value !== 'all' && value !== '';
  }).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search problems by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant={isExpanded ? 'primary' : 'outline'}
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="blue"
                size="sm"
                className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.slice(1).map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => handleFilterChange('difficulty', difficulty.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filters.difficulty === difficulty.id
                    ? `border-${difficulty.color}-500 bg-${difficulty.color}-50 dark:bg-${difficulty.color}-900/20 text-${difficulty.color}-700 dark:text-${difficulty.color}-300`
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 dark:text-gray-400"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </Card>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {totalProblems} problems found
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-8">
                {/* Quick Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Quick Filters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUICK_FILTERS.map((quickFilter) => (
                      <button
                        key={quickFilter.id}
                        onClick={() => handleQuickFilter(quickFilter)}
                        className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          {quickFilter.name}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {quickFilter.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Completion Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STATUS_OPTIONS.map((status) => {
                      const IconComponent = status.icon;
                      return (
                        <button
                          key={status.id}
                          onClick={() => handleFilterChange('status', status.id)}
                          className={`p-3 border rounded-lg transition-colors text-left ${
                            filters.status === status.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <IconComponent className="w-4 h-4" />
                            <span className="font-medium text-sm">{status.name}</span>
                          </div>
                          <p className="text-xs opacity-75">{status.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Problem Categories
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleFilterChange('category', category.id)}
                          className={`p-2 text-sm border rounded-lg transition-colors flex items-center space-x-2 ${
                            filters.category === category.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty (Detailed) */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Difficulty Level
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DIFFICULTIES.map((difficulty) => (
                      <button
                        key={difficulty.id}
                        onClick={() => handleFilterChange('difficulty', difficulty.id)}
                        className={`p-3 border rounded-lg transition-colors text-left ${
                          filters.difficulty === difficulty.id
                            ? `border-${difficulty.color}-500 bg-${difficulty.color}-50 dark:bg-${difficulty.color}-900/20 text-${difficulty.color}-700 dark:text-${difficulty.color}-300`
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-3 h-3 rounded-full bg-${difficulty.color}-500`}></div>
                          <span className="font-medium text-sm">{difficulty.name}</span>
                        </div>
                        <p className="text-xs opacity-75">
                          {difficulty.id === 'all' && 'All difficulty levels'}
                          {difficulty.id === 'easy' && 'Perfect for beginners'}
                          {difficulty.id === 'medium' && 'Good for practice'}
                          {difficulty.id === 'hard' && 'Challenge yourself'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}