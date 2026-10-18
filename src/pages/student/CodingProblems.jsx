/**
 * Problems List Page with Advanced Filtering and Multiple View Modes
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Filter,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import ProblemFilters from '../../components/coding/ProblemFilters';
import ProblemList from '../../components/coding/ProblemList';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function CodingProblems() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    problems,
    loading,
    filters,
    pagination,
    userStats,
    fetchProblems,
    updateFilters,
    updatePagination,
    fetchUserStats
  } = useCodingStore();

  const [viewMode, setViewMode] = useState('table');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initialize from URL params
    const urlFilters = {
      difficulty: searchParams.get('difficulty') || 'all',
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'all',
      search: searchParams.get('search') || ''
    };
    
    updateFilters(urlFilters);
    
    // Fetch initial data
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProblems(),
          fetchUserStats()
        ]);
      } catch (error) {
        console.error('Error loading problems data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleFiltersChange = (newFilters) => {
    // Update URL params
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === 'all' || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    
    setSearchParams(params);
    
    // Apply filters and reset pagination
    updateFilters(newFilters);
    updatePagination({ page: 1 });
    
    // Fetch updated problems
    fetchProblems();
  };

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    handleFiltersChange(newFilters);
  };

  const handlePageChange = (newPage) => {
    updatePagination({ page: newPage });
    fetchProblems();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchProblems(),
        fetchUserStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProblemClick = (problem) => {
    navigate(`/student/coding/problems/${problem.problem_id}`);
  };

  // Calculate statistics
  const totalSolved = userStats?.problems_solved || 0;
  const totalAttempted = userStats?.problems_attempted || 0;
  const acceptanceRate = userStats?.acceptance_rate || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/coding')}
            className="lg:hidden"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Problem Set
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Solve coding challenges to improve your skills and earn XP
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="hidden sm:flex"
          >
            {refreshing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          
          <Badge variant="blue" size="lg">
            <Code2 className="w-4 h-4 mr-1" />
            {pagination.total} Problems
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Solved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalSolved}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attempted</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {totalAttempted}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(acceptanceRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {userStats?.total_users || '1.2k'}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Problem Filters */}
      <ProblemFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        totalProblems={pagination.total}
      />

      {/* Problem List */}
      <ProblemList
        problems={problems}
        loading={loading.problems}
        userStats={userStats}
        pagination={pagination}
        viewMode={viewMode}
        onPageChange={handlePageChange}
        onProblemClick={handleProblemClick}
        onViewModeChange={setViewMode}
        showBookmarks={true}
      />
    </div>
  );
}