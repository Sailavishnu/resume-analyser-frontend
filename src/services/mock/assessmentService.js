/**
 * Mock Skill Assessments Service
 */

const sampleAssessments = [
  {
    id: 'asm-js',
    skill: 'JavaScript Core & ES6+',
    category: 'Frontend',
    questionsCount: 10,
    durationMin: 12,
    level: 'Intermediate',
    bestScore: 84,
    questions: [
      {
        id: 'q1',
        text: 'What will be the output of `console.log(typeof NaN)`?',
        options: ['"number"', '"nan"', '"undefined"', '"object"'],
        correctIndex: 0,
        explanation: 'In JavaScript, NaN is a numeric data value representing Not-a-Number, so typeof NaN returns "number".'
      },
      {
        id: 'q2',
        text: 'Which array method returns a new array with all elements that pass the test implemented by the provided function?',
        options: ['map()', 'filter()', 'reduce()', 'forEach()'],
        correctIndex: 1,
        explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.'
      },
      {
        id: 'q3',
        text: 'What is the primary difference between `==` and `===` in JavaScript?',
        options: [
          'No difference; they are aliases.',
          '`===` performs type coercion before comparison, `==` does not.',
          '`===` compares both value and type without type coercion.',
          '`==` is strictly for comparing objects.'
        ],
        correctIndex: 2,
        explanation: 'Strict equality (===) compares both value and type without converting types.'
      },
      {
        id: 'q4',
        text: 'What is the purpose of the JavaScript Event Loop?',
        options: [
          'To compile JavaScript code into native machine assembly.',
          'To manage asynchronous execution of callbacks by monitoring the call stack and callback queue.',
          'To continuously loop over DOM tree nodes for repaint operations.',
          'To handle multi-threaded CPU parallel loops in the browser.'
        ],
        correctIndex: 1,
        explanation: 'The event loop continuously checks if the call stack is empty, pushing tasks from the callback queue to the call stack.'
      },
      {
        id: 'q5',
        text: 'What does `Promise.all([p1, p2, p3])` do when one promise rejects?',
        options: [
          'It continues until all other promises resolve.',
          'It rejects immediately with the reason of the first rejected promise.',
          'It returns null for the rejected item and resolves the rest.',
          'It retries the rejected promise up to 3 times.'
        ],
        correctIndex: 1,
        explanation: 'Promise.all has fail-fast behavior: if any promise rejects, the entire returned promise rejects immediately.'
      }
    ]
  },
  {
    id: 'asm-react',
    skill: 'React 18 & State Management',
    category: 'Frontend',
    questionsCount: 10,
    durationMin: 15,
    level: 'Advanced',
    bestScore: 91,
    questions: [
      {
        id: 'rq1',
        text: 'What is the primary rule for the dependency array in `useEffect`?',
        options: [
          'Only add state variables, never props.',
          'All reactive values used inside the effect must be included in the dependency array.',
          'Leave it empty to trigger on every re-render.',
          'Add functions declared outside the component.'
        ],
        correctIndex: 1,
        explanation: 'Every reactive value (state, props, variables calculated from them) used inside an effect must be declared in dependencies.'
      },
      {
        id: 'rq2',
        text: 'What problem does `useCallback` primarily solve in React?',
        options: [
          'Prevents an expensive function from running on initial mount.',
          'Memoizes a callback instance between renders to prevent unnecessary child re-renders.',
          'Turns synchronous state mutations into asynchronous background tasks.',
          'Caches network fetch responses in LocalStorage.'
        ],
        correctIndex: 1,
        explanation: 'useCallback caches a function definition between renders when passed to optimized child components.'
      }
    ]
  },
  {
    id: 'asm-sql',
    skill: 'SQL & Relational Databases',
    category: 'Database',
    questionsCount: 10,
    durationMin: 12,
    level: 'Intermediate',
    bestScore: 78,
    questions: [
      {
        id: 'sq1',
        text: 'Which clause is used to filter groups created by the `GROUP BY` clause?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correctIndex: 1,
        explanation: 'WHERE filters rows before aggregation; HAVING filters groups after aggregation.'
      }
    ]
  },
  {
    id: 'asm-python',
    skill: 'Python & Backend APIs',
    category: 'Backend',
    questionsCount: 10,
    durationMin: 15,
    level: 'Intermediate',
    bestScore: null,
    questions: [
      {
        id: 'py1',
        text: 'What is a Python generator and how does it yield values?',
        options: [
          'A class that generates random numbers using a seed.',
          'A function that uses `yield` to return an iterator that produces values on-demand.',
          'A multi-threaded worker in the multiprocessing package.',
          'A decorator that compiles Python functions with Cython.'
        ],
        correctIndex: 1,
        explanation: 'Generators yield values one at a time with memory efficiency without constructing the entire list in RAM.'
      }
    ]
  }
];

export const assessmentService = {
  async getAssessments() {
    await new Promise(r => setTimeout(r, 250));
    return sampleAssessments;
  },

  async submitAnswers(assessmentId, answers) {
    await new Promise(r => setTimeout(r, 600));
    const asm = sampleAssessments.find(a => a.id === assessmentId) || sampleAssessments[0];
    let correct = 0;
    asm.questions.forEach((q, i) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / asm.questions.length) * 100);
    asm.bestScore = Math.max(score, asm.bestScore || 0);

    return {
      assessmentId,
      score,
      totalQuestions: asm.questions.length,
      correctAnswers: correct,
      incorrectAnswers: asm.questions.length - correct,
      strongTopics: ['Core Language Syntax', 'Asynchronous Operations', 'Built-in Prototypes'],
      weakTopics: ['Closure Scoping', 'Event Loop Timing'],
      readinessContribution: score >= 80 ? '+2' : '+1'
    };
  },
  
  getQuestionsForSkill(assessmentId) {
    const asm = sampleAssessments.find(a => a.id === assessmentId);
    return asm ? asm.questions : [];
  },
  
  evaluateAssessment(assessmentId, answers) {
    const asm = sampleAssessments.find(a => a.id === assessmentId);
    if (!asm) return { score: 0, correct: 0 };
    let correct = 0;
    asm.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return {
      score: Math.round((correct / asm.questions.length) * 100),
      correctAnswers: correct,
      totalQuestions: asm.questions.length,
      weakTopics: ['Closure Scoping', 'Event Loop Timing']
    };
  }
};
