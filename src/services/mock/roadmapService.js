/**
 * Mock Career Roadmap Service
 * 5-Phase learning paths tailored to target career choices.
 */

const defaultRoadmaps = {
  'frontend': {
    roleId: 'frontend',
    roleName: 'Frontend Engineer',
    targetScore: 92,
    completionPercentage: 68,
    phases: [
      {
        id: 'p1',
        title: 'Phase 1: Web Fundamentals',
        desc: 'Semantic HTML5, CSS layout algorithms, modern JavaScript (ES6+)',
        status: 'completed',
        skills: [
          { id: 's1', name: 'HTML5 Semantic Markup', completed: true },
          { id: 's2', name: 'CSS Flexbox & CSS Grid', completed: true },
          { id: 's3', name: 'JavaScript Async / Promises', completed: true }
        ]
      },
      {
        id: 'p2',
        title: 'Phase 2: Modern Frontend Architecture',
        desc: 'Component architecture, hooks, state management & API caching',
        status: 'in_progress',
        skills: [
          { id: 's4', name: 'React 18 & Custom Hooks', completed: true },
          { id: 's5', name: 'Zustand & Client State', completed: true },
          { id: 's6', name: 'TypeScript & Type Safety', completed: false, isGap: true, recommendedAction: 'High priority gap detected in JD Match' }
        ]
      },
      {
        id: 'p3',
        title: 'Phase 3: Production Engineering & Performance',
        desc: 'Bundle optimization, lazy loading, accessibility (a11y), responsive design',
        status: 'in_progress',
        skills: [
          { id: 's7', name: 'TailwindCSS & Glassmorphic Systems', completed: true },
          { id: 's8', name: 'Vite Code Splitting & Performance', completed: true },
          { id: 's9', name: 'Docker for Frontend Dev', completed: false, isGap: true }
        ]
      },
      {
        id: 'p4',
        title: 'Phase 4: Capstone Projects & Portfolio',
        desc: 'Real-world deployable web apps with authentication and database',
        status: 'not_started',
        skills: [
          { id: 's10', name: 'Production SaaS with Auth', completed: true },
          { id: 's11', name: 'Micro-Frontend / Open Source Contribution', completed: false }
        ]
      },
      {
        id: 'p5',
        title: 'Phase 5: Technical & System Design Interviews',
        desc: 'Frontend system design, LeetCode data structures, behavioral questions',
        status: 'not_started',
        skills: [
          { id: 's12', name: 'DSA in JavaScript', completed: true },
          { id: 's13', name: 'Mock Technical Interview Session', completed: true },
          { id: 's14', name: 'Behavioral STAR Method Preparation', completed: false }
        ]
      }
    ]
  },
  'backend': {
    roleId: 'backend',
    roleName: 'Backend Engineer',
    targetScore: 88,
    completionPercentage: 54,
    phases: [
      {
        id: 'bp1',
        title: 'Phase 1: Languages & Runtime',
        desc: 'Python, Go or Node.js runtime mastery',
        status: 'completed',
        skills: [
          { id: 'bs1', name: 'Python 3.11 & AsyncIO', completed: true },
          { id: 'bs2', name: 'Data Structures & Algorithms', completed: true }
        ]
      },
      {
        id: 'bp2',
        title: 'Phase 2: RESTful & gRPC APIs',
        desc: 'FastAPI, Express, database modeling',
        status: 'in_progress',
        skills: [
          { id: 'bs3', name: 'FastAPI / Pydantic APIs', completed: true },
          { id: 'bs4', name: 'PostgreSQL & Query Optimization', completed: false }
        ]
      }
    ]
  }
};

export const roadmapService = {
  async getRoadmap(role = 'frontend') {
    await new Promise(r => setTimeout(r, 300));
    return defaultRoadmaps[role] || defaultRoadmaps['frontend'];
  },

  async toggleSkill(role, skillId) {
    const rm = defaultRoadmaps[role] || defaultRoadmaps['frontend'];
    for (const phase of rm.phases) {
      const skill = phase.skills.find(s => s.id === skillId);
      if (skill) {
        skill.completed = !skill.completed;
        break;
      }
    }
    // Recalculate completion
    const allSkills = rm.phases.flatMap(p => p.skills);
    const completed = allSkills.filter(s => s.completed).length;
    rm.completionPercentage = Math.round((completed / allSkills.length) * 100);
    return rm;
  }
};
