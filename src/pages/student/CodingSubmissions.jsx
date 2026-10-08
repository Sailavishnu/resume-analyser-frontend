/**
 * Coding Submissions History Page
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Calendar,
  Code2,
  ExternalLink,
  Download,
  RefreshCw,
  Search,
  BarChart3
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const STATUS_CONFIG = {
  accepted: { 
    icon: CheckCircle, 
    color: 'text-green-600 dark:text-green-400', 
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Accepted'
  },
  wrong_answer: { 
    icon: XCircle, 
    color: 'text-red-600 dark:text-red-400', 
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Wrong Answer'
  },
  runtime_error: { 
    icon: AlertCircle, 
    color: 'text-orange-600 dark:text-orange-400', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'Runtime Error'
  },
  compile_error: { 
    icon: AlertCircle, 
    color: 'text-yellow-600 dark:text-yellow-400', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Compile Error'
  },
  time_limit_exceeded: { 
    icon: Clock, 
    color: 'text-blue-600 dark:text-blue-400', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Time Limit'
  }
};

const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red'
};

const LANGUAGES = ['All', 'Python', 'JavaScript', 'Java', 'C++', 'C'];
const STATUSES = ['All', 'Accepted', 'Wrong Answer', 'Runtime Error', 'Compile Error', 'Time Limit'];

export default function CodingSubmissions() {
  const navigate = useNavigate();
  const {
    submissions,
    loading,
    fetchSubmissions
  } = useCodingStore();

  const [filters, setFilters] = useState({
    status: 'all',
    language: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [submissionData, setSubmissionData] = useState({ submissions: [], analytics: {} });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [filters]);

  const loadSubmissions = async () => {
    try {
      const filterParams = {
        ...(filters.status !== 'all' && { status: filters.status.toLowerCase().replace(' ', '_') }),
        ...(filters.language !== 'all' && { language: filters.language.toLowerCase() }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        limit: 50
      };

      const data = await fetchSubmissions(filterParams);
      setSubmissionData(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadSubmissions();
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      language: 'all', 
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const exportSubmissions = () => {
    const csvContent = [
      'Problem,Status,Language,Runtime,Memory,Date',
      ...submissionData.submissions.map(sub => 
        `"${sub.problem_title}","${sub.status}","${sub.language}","${sub.runtime || 'N/A'}ms","${sub.memory_used || 'N/A'}KB","${new Date(sub.submitted_at).toLocaleString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coding-submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusDisplay = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.runtime_error;
    const IconComponent = config.icon;
    
    return {
      icon: <IconComponent className={`w-5 h-5 ${config.color}`} />,
      label: config.label,
      bgColor: config.bgColor,
      textColor: config.color
    };
  };

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatMemory = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value, index) => {
      const keys = Object.keys(filters);
      if (keys[index] === 'search') return value && value.trim().length > 0;
      return value !== 'all' && value !== '';
    }
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Submission History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your coding progress and analyze your performance
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportSubmissions}
            disabled={submissionData.submissions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      {submissionData.analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submissionData.analytics.total_submissions || 0}
                </p>
              </div>
              <Code2 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {submissionData.analytics.accepted_submissions || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {submissionData.analytics.acceptance_rate?.toFixed(1) || 0}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Runtime</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {submissionData.analytics.avg_runtime?.toFixed(0) || 0}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by problem name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            More Filters
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

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Submissions List */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : submissionData.submissions.length === 0 ? (
          <div className="text-center p-12">
            <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Submissions Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {activeFiltersCount > 0 
                ? 'Try adjusting your filters to see more submissions.'
                : 'Start solving problems to see your submission history here.'
              }
            </p>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="col-span-1">Status</div>
              <div className="col-span-4">Problem</div>
              <div className="col-span-2">Language</div>
              <div className="col-span-2">Runtime</div>
              <div className="col-span-2">Memory</div>
              <div className="col-span-1">Date</div>
            </div>

            {/* Submissions */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {submissionData.submissions.map((submission, index) => {
                const statusDisplay = getStatusDisplay(submission.status);
                
                return (
                  <motion.div
                    key={submission.submission_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/student/coding/problems/${submission.problem_id}`)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full ${statusDisplay.bgColor}`}>
                          {statusDisplay.icon}
                        </div>
                      </div>
                      
                      <div className="col-span-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {submission.problem_title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={DIFFICULTY_COLORS[submission.difficulty?.toLowerCase()]}
                                size="sm"
                              >
                                {submission.difficulty}
                              </Badge>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {submission.category}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <Badge variant="gray" size="sm">
                          {submission.language}
                        </Badge>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-gray-900 dark:text-white">
                          {formatTime(submission.runtime)}
                        </span>
                        {submission.passed_test_cases !== undefined && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {submission.passed_test_cases}/{submission.total_test_cases} passed
                          </div>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-gray-900 dark:text-white">
                          {formatMemory(submission.memory_used)}
                        </span>
                        {submission.xp_gained && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            +{submission.xp_gained} XP
                          </div>
                        )}
                      </div>
                      
                      <div className="col-span-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex items-start space-x-3">
                        {statusDisplay.icon}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {submission.problem_title}
                          </h3>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge 
                              variant={DIFFICULTY_COLORS[submission.difficulty?.toLowerCase()]}
                              size="sm"
                            >
                              {submission.difficulty}
                            </Badge>
                            <Badge variant="gray" size="sm">
                              {submission.language}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Runtime: </span>
                              <span className="text-gray-900 dark:text-white">{formatTime(submission.runtime)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Memory: </span>
                              <span className="text-gray-900 dark:text-white">{formatMemory(submission.memory_used)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </span>
                            {submission.xp_gained && (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                +{submission.xp_gained} XP
                              </span>
                            )}
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
      </Card>
    </div>
  );
}