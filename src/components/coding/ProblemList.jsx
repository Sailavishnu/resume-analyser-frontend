/**
 * Problem List Component with Multiple View Modes
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  BookOpen,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Bookmark,
  ExternalLink,
  Play
} from 'lucide-react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../shared/LoadingSpinner';

const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red'
};

const VIEW_MODES = {
  TABLE: 'table',
  GRID: 'grid',
  COMPACT: 'compact'
};

export default function ProblemList({
  problems = [],
  loading = false,
  userStats = null,
  pagination = { page: 1, limit: 20, total: 0 },
  onPageChange,
  onProblemClick,
  viewMode = VIEW_MODES.TABLE,
  onViewModeChange,
  showBookmarks = false,
  onToggleBookmark,
  className = ''
}) {
  const navigate = useNavigate();
  const [hoveredProblem, setHoveredProblem] = useState(null);

  const getProblemStatus = (problem) => {
    if (userStats?.solved_problems?.includes(problem.problem_id)) {
      return 'solved';
    }
    if (userStats?.attempted_problems?.includes(problem.problem_id)) {
      return 'attempted';
    }
    return 'unattempted';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'attempted':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
    }
  };

  const handleProblemClick = (problem) => {
    if (onProblemClick) {
      onProblemClick(problem);
    } else {
      navigate(`/student/coding/problems/${problem.problem_id}`);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (problems.length === 0) {
    return (
      <Card className="text-center p-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Problems Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters or search terms to find problems.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange?.(VIEW_MODES.TABLE)}
              className={`p-2 rounded-md transition-colors ${
                viewMode === VIEW_MODES.TABLE
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange?.(VIEW_MODES.GRID)}
              className={`p-2 rounded-md transition-colors ${
                viewMode === VIEW_MODES.GRID
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination.total} problems • Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
          </div>
        </div>

        {/* Pagination Info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {pagination.page} of {totalPages}
        </div>
      </div>

      {/* Problems List */}
      <Card>
        {viewMode === VIEW_MODES.TABLE && (
          <>
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Difficulty</div>
              <div className="col-span-2">Acceptance</div>
              <div className="col-span-1">XP</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {problems.map((problem, index) => {
                const status = getProblemStatus(problem);
                
                return (
                  <motion.div
                    key={problem.problem_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                    onClick={() => handleProblemClick(problem)}
                    onMouseEnter={() => setHoveredProblem(problem.problem_id)}
                    onMouseLeave={() => setHoveredProblem(null)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 flex items-center space-x-2">
                        {getStatusIcon(status)}
                        {showBookmarks && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark?.(problem.problem_id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Bookmark className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                          </button>
                        )}
                      </div>
                      
                      <div className="col-span-5">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </h3>
                          {hoveredProblem === problem.problem_id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <ExternalLink className="w-4 h-4 text-blue-500" />
                            </motion.div>
                          )}
                        </div>
                        
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {problem.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="gray" size="sm">
                                {tag}
                              </Badge>
                            ))}
                            {problem.tags.length > 3 && (
                              <Badge variant="gray" size="sm">
                                +{problem.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {problem.category?.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      
                      <div className="col-span-1">
                        <Badge 
                          variant={DIFFICULTY_COLORS[problem.difficulty?.toLowerCase()]}
                          size="sm"
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {problem.acceptance_rate || 0}%
                          </span>
                          <Users className="w-4 h-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {problem.total_submissions || 0}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          +{problem.xp_reward}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProblemClick(problem);
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(status)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {problem.title}
                            </h3>
                            {showBookmarks && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleBookmark?.(problem.problem_id);
                                }}
                              >
                                <Bookmark className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <Badge 
                              variant={DIFFICULTY_COLORS[problem.difficulty?.toLowerCase()]}
                              size="sm"
                            >
                              {problem.difficulty}
                            </Badge>
                            
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {problem.category}
                            </span>
                            
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              +{problem.xp_reward} XP
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            {problem.acceptance_rate || 0}% acceptance
                            <Users className="w-4 h-4 ml-3 mr-1" />
                            {problem.total_submissions || 0} submissions
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {viewMode === VIEW_MODES.GRID && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.map((problem, index) => {
                const status = getProblemStatus(problem);
                
                return (
                  <motion.div
                    key={problem.problem_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all group"
                    onClick={() => handleProblemClick(problem)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <Badge 
                          variant={DIFFICULTY_COLORS[problem.difficulty?.toLowerCase()]}
                          size="sm"
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>
                      
                      {showBookmarks && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark?.(problem.problem_id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Bookmark className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                        </button>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {problem.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {problem.category?.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{problem.acceptance_rate || 0}%</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          +{problem.xp_reward} XP
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {problem.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="gray" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {problem.tags.length > 2 && (
                          <Badge variant="gray" size="sm">
                            +{problem.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} problems
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (pagination.page <= 3) {
                  page = i + 1;
                } else if (pagination.page >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              {totalPages > 5 && pagination.page < totalPages - 2 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => onPageChange?.(totalPages)}
                    className="px-3 py-1 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}