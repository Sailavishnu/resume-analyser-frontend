// Mock Interview Service for AI Mock Interview Simulator
export const interviewService = {
  getInterviewConfig: (role = 'Frontend Engineer') => {
    return {
      role,
      type: 'Technical + System Design',
      difficulty: 'Intermediate to Advanced',
      durationMinutes: 15,
      questionsCount: 3,
      passThreshold: 75
    };
  },

  getQuestionBank: (role = 'Frontend Engineer') => {
    return [
      {
        id: 'q1',
        category: 'Project Architecture & State',
        question: 'Based on your resume, you built dashboard systems using React and Node.js. How did you optimize those components for heavy data re-renders?',
        suggestedKeywords: ['virtualization', 'memoization', 'caching', 'useMemo', 'useCallback', 'zustand', 're-render'],
        expectedKeyPoints: [
          'Utilizing memoization primitives like useMemo or React.memo to prevent unnecessary child tree renders',
          'Selective state subscriptions with Zustand or Redux slices',
          'Virtual windowing (e.g., react-window) for large data tables'
        ]
      },
      {
        id: 'q2',
        category: 'Technical Core & Async Operations',
        question: 'Your profile mentions asynchronous APIs and REST services. Can you explain how Node.js handles asynchronous events under the hood?',
        suggestedKeywords: ['event loop', 'callback queue', 'non-blocking', 'libuv', 'promises', 'microtasks', 'macrotasks'],
        expectedKeyPoints: [
          'Libuv thread pool handling I/O operations asynchronously',
          'Event loop phases: timers, I/O callbacks, idle, poll, check, close callbacks',
          'Microtask queue (Promise callbacks) priority over macrotask queue'
        ]
      },
      {
        id: 'q3',
        category: 'Problem Solving & Skill Gaps',
        question: 'You list Docker and cloud deployments as learning gaps. How do you plan to containerize your applications for production clusters?',
        suggestedKeywords: ['dockerfile', 'images', 'containers', 'volumes', 'compose', 'microservices', 'multi-stage build'],
        expectedKeyPoints: [
          'Multi-stage Dockerfiles to minimize production artifact sizes',
          'Separating configuration from application code via environment variables',
          'Using docker-compose for local development orchestration'
        ]
      }
    ];
  },

  evaluateAnswer: (question, answerText) => {
    const text = (answerText || '').toLowerCase();
    const matched = (question.suggestedKeywords || []).filter(kw => text.includes(kw.toLowerCase()));
    const wordCount = answerText ? answerText.trim().split(/\s+/).length : 0;
    
    let score = 55;
    score += matched.length * 9;
    if (wordCount > 30) score += 8;
    if (wordCount > 60) score += 5;
    score = Math.min(96, Math.max(50, score));

    return {
      score,
      relevance: Math.min(100, score + 4),
      technicalClarity: Math.min(100, score - 2),
      completeness: Math.min(100, score + (wordCount > 40 ? 5 : -5)),
      matchedKeywords: matched,
      feedback: matched.length >= 2
        ? `Strong response. You articulated key architectural concepts: ${matched.join(', ')}.`
        : `Your response was conceptual. Anchor your answer with technical terms like: ${question.suggestedKeywords.slice(0, 3).join(', ')}.`
    };
  }
};
