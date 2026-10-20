import { create } from 'zustand';
import { interviewService } from '../services/interviewService';
import { resumeService } from '../services/resumeService';
import { studentService } from '../services/studentService';

const normalizeResume = (resume) => {
  const rawAnalysis = resume.analysis || {};
  const sectionScores = rawAnalysis.section_scores || rawAnalysis.sectionScores || {};
  const matched = rawAnalysis.matched_keywords || rawAnalysis.keywords?.matched || [];
  const missing = rawAnalysis.missing_keywords || rawAnalysis.keywords?.missing || [];
  let displayName = resume.original_file_name || resume.name || resume.file_name || 'Resume';
  const generatedPrefix = resume.student_id ? `student_${resume.student_id}_` : null;
  if (generatedPrefix && displayName.startsWith(generatedPrefix)) {
    const uniqueName = resume.file_name || displayName;
    displayName = uniqueName.slice(generatedPrefix.length).replace(/_\d{8}_\d{6}_[a-f0-9]{8}(?=\.)/i, '');
  }
  return {
    ...resume,
    id: resume.id || resume._id,
    name: displayName,
    role: resume.target_role || null,
    uploadDate: resume.created_at || resume.uploadDate || null,
    slot: resume.slot || (resume.is_primary ? 'primary' : 'secondary'),
    isPrimary: resume.slot === 'primary' || resume.is_primary,
    score: resume.score ?? rawAnalysis.overall_score ?? null,
    atsScore: resume.ats_score ?? rawAnalysis.ats_score ?? null,
    downloadUrl: resume.cloudinary_url || (resume.id ? `/api/v1/resumes/${resume.id}/download` : null),
    analysis: {
      ...rawAnalysis,
      overallScore: rawAnalysis.ats_score ?? resume.ats_score ?? null,
      sectionScores: {
        skills: sectionScores.skills ?? 0,
        experience: sectionScores.experience ?? 0,
        education: sectionScores.education ?? 0,
        formatting: sectionScores.formatting ?? 0,
      },
      keywords: { matched: Array.isArray(matched) ? matched : [], missing: Array.isArray(missing) ? missing : [] },
      atsChecks: rawAnalysis.ats_checks || rawAnalysis.atsChecks || [],
      strengths: rawAnalysis.strengths || [],
      warnings: rawAnalysis.warnings || [],
      criticalIssues: rawAnalysis.critical_issues || rawAnalysis.criticalIssues || [],
      recommendations: rawAnalysis.recommendations || [],
      analysisVersion: rawAnalysis.analysis_version || rawAnalysis.analysisVersion || null,
      analysisStatus: resume.analysis_status || resume.status || 'unknown',
    },
  };
};

export const useStudentStore = create((set, get) => ({
  resumes: [],
  selectedResumeId: null,
  jobs: [],
  applications: [],
  interviews: [],

  // Platform Metrics
  targetRole: null,
  streak: 0,
  careerReadiness: 0,
  analyzing: false,
  activeInterview: null,

  setSelectedResumeId: (id) => set({ selectedResumeId: id }),

  setAsPrimaryResume: async (id) => {
    await resumeService.setSlot(id, 'primary');
    set(state => ({
      resumes: state.resumes.map(r => {
        if (r.id === id) return { ...r, isPrimary: true, slot: 'primary' };
        if (r.slot === 'primary') return { ...r, isPrimary: false, slot: 'secondary' };
        return r;
      }),
      selectedResumeId: id
    }));
  },

  setAsSecondaryResume: async (id) => {
    await resumeService.setSlot(id, 'secondary');
    set(state => ({
      resumes: state.resumes.map(r => {
        if (r.id === id) return { ...r, isPrimary: false, slot: 'secondary' };
        if (r.slot === 'secondary') return { ...r, isPrimary: true, slot: 'primary' };
        return r;
      })
    }));
  },

  deleteResume: async (id) => {
    await resumeService.deleteResume(id);
    set(state => {
      const remaining = state.resumes.filter(r => r.id !== id);
      return {
        resumes: remaining,
        selectedResumeId: state.selectedResumeId === id ? remaining[0]?.id : state.selectedResumeId
      };
    });
  },

  getSelectedResume: () => {
    const { resumes, selectedResumeId } = get();
    return resumes.find(r => r.id === selectedResumeId) || resumes[0] || null;
  },

  setTargetRole: (role) => {
    set({ targetRole: role });
  },

  fetchStudentData: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const [jobsResult, applicationsResult, profileResult, analyticsResult, interviewsResult] = await Promise.allSettled([
      studentService.getJobs(),
      studentService.getApplications(),
      studentService.getProfile(),
      studentService.getAnalytics(),
      interviewService.getPastInterviews(),
    ]);
    const jobs = jobsResult.status === 'fulfilled' ? jobsResult.value.map(job => ({
      ...job,
      company: job.company_name || 'Company not provided',
      logo: job.company_logo || null,
      skillsRequired: job.required_skills || [],
      skillsMatched: [],
      skillsMissing: [],
      salary: job.salary_min != null || job.salary_max != null
        ? `${job.salary_min ?? '—'} - ${job.salary_max ?? '—'}` : null,
    })) : [];
    const applications = applicationsResult.status === 'fulfilled' ? applicationsResult.value.map(application => ({
      ...application,
      jobId: application.job_id,
      company: application.company_name || 'Company not provided',
      role: application.job_title || 'Job title unavailable',
      appliedDate: application.applied_at || application.created_at || null,
      matchRate: application.match_score ?? null,
    })) : [];
    const profile = profileResult.status === 'fulfilled' ? profileResult.value : {};
    const analytics = analyticsResult.status === 'fulfilled' ? analyticsResult.value : {};
    const interviews = interviewsResult.status === 'fulfilled' ? interviewsResult.value : [];
    const resumes = get().resumes;
    set({
      jobs,
      applications,
      interviews,
      targetRole: profile.target_role || null,
      streak: analytics.current_streak ?? profile.current_streak ?? 0,
      careerReadiness: analytics.career_readiness_score ?? profile.career_readiness_score ?? 0,
    });
  },

  applyToJob: async (jobId) => {
    const resume = get().getSelectedResume();
    if (!resume?.id) throw new Error('Upload and select a resume before applying.');
    const application = await studentService.applyToJob(jobId, resume.id);
    await get().fetchStudentData();
    return application;
  },

  fetchResumes: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ resumes: [], selectedResumeId: null });
      return;
    }
    try {
      const realResumes = await resumeService.getStudentResumes();
      const formatted = (realResumes || []).map(normalizeResume);
      set({
        resumes: formatted.slice(0, 2),
        selectedResumeId: formatted.find(r => r.slot === 'primary')?.id || formatted[0]?.id || null
      });
    } catch (e) {
      console.warn('Could not load remote resumes:', e);
    }
  },

  analyzeUploadedResume: async (fileOrName, slot = 'primary') => {
    if (!(fileOrName instanceof File)) {
      throw new Error('Select a resume file to upload.');
    }
    set({ analyzing: true });
    
    // If real browser File object provided, upload to Cloudinary & MongoDB
    if (fileOrName instanceof File) {
      try {
        const uploaded = await resumeService.uploadResume(fileOrName, slot);
        const newResume = {
          ...normalizeResume(uploaded),
          slot: uploaded.slot || slot,
          isPrimary: (uploaded.slot === 'primary' || slot === 'primary'),
          uploadDate: uploaded.created_at || new Date().toISOString(),
        };

        set(state => {
          const filtered = state.resumes.filter(r => r.slot !== slot && r.id !== newResume.id);
          const nextList = [newResume, ...filtered].slice(0, 2);
          return {
            resumes: nextList,
            selectedResumeId: newResume.id,
            analyzing: false
          };
        });
        return newResume;
      } catch (err) {
        set({ analyzing: false });
        throw err;
      }
    }

  },

  // AI Interview Simulator Flow (Connected to FastAPI AI/ML Backend)
  startInterview: async (role, domain = null) => {
    if (!role?.trim()) throw new Error('Enter the role you want to practice for.');
    const selectedResume = get().getSelectedResume();
    const sessionData = await interviewService.startInterview({
      role: role?.trim(),
      resumeId: selectedResume ? selectedResume.id : null,
      domain: domain,
    });

    set({
      activeInterview: {
        sessionId: sessionData.session_id || sessionData.interview_id,
        role: sessionData.target_role || role,
        hasPrimaryResume: sessionData.has_primary_resume,
        resumeFileName: sessionData.resume_file_name,
        domain: sessionData.domain,
        currentQuestionIndex: sessionData.current_question_index || 0,
        questions: sessionData.questions || [sessionData.current_question],
        answers: [],
        completed: false,
        feedback: null
      }
    });
  },

  submitInterviewAnswer: async (answerText) => {
    const { activeInterview } = get();
    if (!activeInterview) return;

    const currentIdx = activeInterview.currentQuestionIndex;
    const currentQuestion = activeInterview.questions[currentIdx] || { question: 'Question' };

    // Call real backend NLP evaluation
    const evalData = await interviewService.submitAnswer({
      sessionId: activeInterview.sessionId,
      answerText
    });

    const latestEval = evalData.latest_evaluation || {};
    const score = latestEval.score ?? null;

    const newAnswer = {
      questionId: currentQuestion.id || `q_${currentIdx + 1}`,
      category: currentQuestion.category || 'Technical Evaluation',
      question: currentQuestion.question,
      answer: answerText,
      score,
      relevance: latestEval.relevance,
      technicalDepth: latestEval.technical_depth,
      matchedKeywords: latestEval.matched_keywords || [],
      feedback: latestEval.feedback || null
    };

    const updatedAnswers = [...activeInterview.answers, newAnswer];
    const isCompleted = evalData.is_completed || (currentIdx >= (activeInterview.questions.length - 1) && !evalData.next_question);

    if (isCompleted) {
      const scoredAnswers = updatedAnswers.filter(answer => Number.isFinite(answer.score));
      const totalScore = scoredAnswers.length ? Math.round(scoredAnswers.reduce((sum, answer) => sum + answer.score, 0) / scoredAnswers.length) : null;
      const interviewSummary = {
        id: `int-${Math.random().toString(36).substr(2, 9)}`,
        role: activeInterview.role,
        company: null,
        date: new Date().toISOString().split('T')[0],
        score: totalScore,
        status: 'Completed',
        feedback: evalData.report?.summary || null
      };

      set(state => ({
        activeInterview: {
          ...state.activeInterview,
          answers: updatedAnswers,
          completed: true,
          feedback: interviewSummary.feedback
        },
        interviews: [interviewSummary, ...state.interviews],
      }));
    } else {
      const updatedQuestions = [...activeInterview.questions];
      if (evalData.next_question) {
        if (currentIdx + 1 < updatedQuestions.length) {
          updatedQuestions[currentIdx + 1] = evalData.next_question;
        } else {
          updatedQuestions.push(evalData.next_question);
        }
      }

      set({
        activeInterview: {
          ...activeInterview,
          answers: updatedAnswers,
          questions: updatedQuestions,
          currentQuestionIndex: currentIdx + 1
        }
      });
    }
  },

  resetInterview: () => {
    set({ activeInterview: null });
  }
}));
