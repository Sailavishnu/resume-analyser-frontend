/**
 * Individual Problem Solving Interface
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  BarChart3,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Send,
  ArrowLeft,
  Lightbulb,
  Code2,
  Settings
} from 'lucide-react';

import useCodingStore from '../../store/codingStore';
import MonacoEditor from '../../components/coding/MonacoEditor';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red'
};

export default function CodingProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  const {
    currentProblem,
    loading,
    fetchProblem,
    runCode,
    submitCode,
    editorSettings
  } = useCodingStore();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [runHistory, setRunHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchProblem(problemId);
    }
  }, [problemId, fetchProblem]);

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`coding-problem-${problemId}-${language}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [problemId, language]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Auto-save to localStorage
    localStorage.setItem(`coding-problem-${problemId}-${language}`, newCode);
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    setTestResults(null);

    try {
      const result = await runCode(problemId, code, language);
      setTestResults(result);
      
      // Add to run history
      const runEntry = {
        timestamp: new Date().toISOString(),
        language,
        result,
        code: code.substring(0, 100) + (code.length > 100 ? '...' : '')
      };
      setRunHistory(prev => [runEntry, ...prev.slice(0, 9)]);

    } catch (error) {
      toast.error('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    if (!confirm('Are you sure you want to submit this solution?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCode(problemId, code, language);
      
      if (result.status === 'accepted') {
        // Clear saved code after successful submission
        localStorage.removeItem(`coding-problem-${problemId}-${language}`);
      }

      // Show detailed result
      setTestResults(result);

    } catch (error) {
      toast.error('Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem(`coding-problem-${problemId}-${language}`, code);
    toast.success('Code saved locally');
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'wrong_answer':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'runtime_error':
      case 'compile_error':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading.problem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Problem Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested problem could not be found.
          </p>
          <Button onClick={() => navigate('/student/coding/problems')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/coding/problems')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentProblem.title}
            </h1>
            <div className="flex items-center space-x-3 mt-1">
              <Badge variant={DIFFICULTY_COLORS[currentProblem.difficulty]} size="sm">
                {currentProblem.difficulty}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentProblem.category}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                +{currentProblem.xp_reward} XP
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{currentProblem.total_submissions || 0} submissions</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <BarChart3 className="w-4 h-4" />
            <span>{currentProblem.acceptance_rate || 0}% accepted</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2 inline" />
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 mr-2 inline" />
              Submissions
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                {/* Problem Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Problem Description
                  </h3>
                  <div 
                    className="prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: currentProblem.description }}
                  />
                </div>

                {/* Examples */}
                {currentProblem.examples && currentProblem.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Examples
                    </h3>
                    <div className="space-y-4">
                      {currentProblem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Input:
                              </h4>
                              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {example.input}
                              </pre>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Output:
                              </h4>
                              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {example.output}
                              </pre>
                            </div>
                          </div>
                          {example.explanation && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Explanation:
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {currentProblem.constraints && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Constraints
                    </h3>
                    <div 
                      className="text-sm text-gray-600 dark:text-gray-400"
                      dangerouslySetInnerHTML={{ __html: currentProblem.constraints }}
                    />
                  </div>
                )}

                {/* Hints */}
                {currentProblem.hints && currentProblem.hints.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Hints
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        {showHint ? 'Hide' : 'Show'} Hints
                      </Button>
                    </div>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {currentProblem.hints.map((hint, index) => (
                          <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>Hint {index + 1}:</strong> {hint}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {currentProblem.tags && currentProblem.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProblem.tags.map((tag) => (
                        <Badge key={tag} variant="gray" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Run History
                </h3>
                {runHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No submissions yet. Run your code to see results here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {runHistory.map((entry, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(entry.result.status)}
                            <span className="font-medium text-sm capitalize">
                              {entry.result.status?.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {entry.result.passed_test_cases !== undefined && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.result.passed_test_cases}/{entry.result.total_test_cases} test cases passed
                          </p>
                        )}
                        {entry.result.runtime && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Runtime: {formatTime(entry.result.runtime)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language Selector and Controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
              >
                {isRunning ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                Run
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                Submit
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              height="100%"
              onRun={handleRun}
              onSubmit={handleSubmit}
              onSave={handleSave}
              showSettings={false}
              showActions={false}
            />
          </div>

          {/* Results Panel */}
          {testResults && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 max-h-60 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-3">
                {getStatusIcon(testResults.status)}
                <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {testResults.status?.replace('_', ' ')}
                </h3>
              </div>

              {testResults.passed_test_cases !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Test Cases
                    </span>
                    <span className="text-sm font-medium">
                      {testResults.passed_test_cases}/{testResults.total_test_cases}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        testResults.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(testResults.passed_test_cases / testResults.total_test_cases) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {testResults.runtime && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Runtime: {formatTime(testResults.runtime)}
                </p>
              )}

              {testResults.memory_used && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Memory: {(testResults.memory_used / 1024 / 1024).toFixed(2)} MB
                </p>
              )}

              {testResults.output && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Output:
                  </h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono overflow-x-auto">
                    {testResults.output}
                  </pre>
                </div>
              )}

              {testResults.error_message && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                    Error:
                  </h4>
                  <pre className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded font-mono overflow-x-auto">
                    {testResults.error_message}
                  </pre>
                </div>
              )}

              {testResults.xp_gained && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +{testResults.xp_gained} XP earned!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}