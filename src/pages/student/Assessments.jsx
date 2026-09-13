import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { assessmentService } from '../../services/mock/assessmentService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  Award, Clock, CheckCircle2, XCircle, AlertCircle,
  HelpCircle, ArrowRight, ArrowLeft, RefreshCw, Flame,
  Sparkles, BookOpen, Layers, Check
} from 'lucide-react';

export default function Assessments() {
  const navigate = useNavigate();
  const { assessments, completeAssessment, careerReadiness, streak } = useStudentStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeQuiz, setActiveQuiz] = useState(null); // { assessment, questions, currentIndex, answers: {}, timeLeft: 720, submitted: false, result: null }

  // Timer effect when quiz is running
  useEffect(() => {
    if (!activeQuiz || activeQuiz.submitted) return;

    const interval = setInterval(() => {
      setActiveQuiz(prev => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          // auto submit
          const result = assessmentService.evaluateAssessment(prev.assessment.id, prev.answers);
          completeAssessment(prev.assessment.id, result.score);
          return { ...prev, timeLeft: 0, submitted: true, result };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz?.assessment?.id, activeQuiz?.submitted]);

  const startQuiz = (assessment) => {
    const questions = assessmentService.getQuestionsForSkill(assessment.id);
    setActiveQuiz({
      assessment,
      questions,
      currentIndex: 0,
      answers: {},
      timeLeft: assessment.durationMin * 60,
      submitted: false,
      result: null
    });
  };

  const handleSelectOption = (optionIdx) => {
    if (activeQuiz.submitted) return;
    setActiveQuiz(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentIndex]: optionIdx
      }
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    const result = assessmentService.evaluateAssessment(activeQuiz.assessment.id, activeQuiz.answers);
    completeAssessment(activeQuiz.assessment.id, result.score);
    setActiveQuiz(prev => ({
      ...prev,
      submitted: true,
      result
    }));
  };

  const categories = ['All', 'Frontend', 'Backend', 'Database'];
  const filteredAssessments = activeCategory === 'All'
    ? assessments
    : assessments.filter(a => a.category === activeCategory);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* If Quiz is in progress or completed */}
      {activeQuiz ? (
        <ScrollReveal variant="fade" duration={0.4}>
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Quiz Runner Header */}
            <Card className="p-6 border border-white/[0.1] bg-obsidian-900/90 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">
                    Skill Verification Quiz
                  </span>
                  <h2 className="text-xl font-bold text-white font-heading">
                    {activeQuiz.assessment.skill}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {!activeQuiz.submitted && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-amber-400">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(activeQuiz.timeLeft)}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer"
                  >
                    {activeQuiz.submitted ? 'Close' : 'Quit Quiz'}
                  </button>
                </div>
              </div>

              {!activeQuiz.submitted && (
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Question {activeQuiz.currentIndex + 1} of {activeQuiz.questions.length}</span>
                    <span>{Math.round(((activeQuiz.currentIndex + 1) / activeQuiz.questions.length) * 100)}% Completed</span>
                  </div>
                  <AnimatedProgress
                    value={Math.round(((activeQuiz.currentIndex + 1) / activeQuiz.questions.length) * 100)}
                    type="bar"
                  />
                </div>
              )}
            </Card>

            {/* If Quiz Submitted: Show Result Report */}
            {activeQuiz.submitted && activeQuiz.result ? (
              <Card className="p-6 md:p-8 border border-white/[0.1] bg-obsidian-900 space-y-6">
                <div className="text-center space-y-3 pb-6 border-b border-white/[0.08]">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Assessment Completed!</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Your assessment score has been recorded and synchronized with your Career Readiness Score & Roadmap.
                  </p>

                  <div className="flex justify-center items-center gap-6 pt-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-w-[120px]">
                      <p className="text-3xl font-extrabold text-emerald-400">{activeQuiz.result.score}%</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Score</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-w-[120px]">
                      <p className="text-3xl font-extrabold text-white">
                        {activeQuiz.result.correctCount}/{activeQuiz.result.totalQuestions}
                      </p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Correct</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-w-[120px]">
                      <p className="text-3xl font-extrabold text-brand-blue">+2</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Readiness Bump</p>
                    </div>
                  </div>
                </div>

                {/* Review Questions & Explanations */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Detailed Answer Review</h4>
                  {activeQuiz.questions.map((q, idx) => {
                    const selected = activeQuiz.answers[idx];
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border ${
                          isCorrect ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-rose-500/[0.03] border-rose-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-400" />
                            )}
                          </div>
                          <div className="space-y-2 flex-1">
                            <p className="text-xs font-semibold text-white">
                              {idx + 1}. {q.text}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              <span className="font-semibold text-gray-300">Your choice:</span> {q.options[selected] !== undefined ? q.options[selected] : 'Skipped'}
                            </p>
                            {!isCorrect && (
                              <p className="text-[11px] text-emerald-400">
                                <span className="font-semibold">Correct choice:</span> {q.options[q.correctIndex]}
                              </p>
                            )}
                            <p className="text-[11px] text-gray-400 italic bg-white/[0.02] p-2 rounded border border-white/[0.05]">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                  <Button variant="outline" size="sm" onClick={() => startQuiz(activeQuiz.assessment)} icon={RefreshCw}>
                    Retake Assessment
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setActiveQuiz(null)}>
                    Return to Catalog
                  </Button>
                </div>
              </Card>
            ) : (
              /* Active Question View */
              <Card className="p-6 md:p-8 border border-white/[0.1] bg-obsidian-900 space-y-6">
                {(() => {
                  const currentQ = activeQuiz.questions[activeQuiz.currentIndex];
                  const selectedOption = activeQuiz.answers[activeQuiz.currentIndex];

                  return (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">
                          Question {activeQuiz.currentIndex + 1}
                        </span>
                        <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
                          {currentQ.text}
                        </h3>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {currentQ.options.map((option, optIdx) => {
                          const isSelected = selectedOption === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(optIdx)}
                              className={`w-full p-4 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
                                isSelected
                                  ? 'bg-brand-blue/15 border-brand-blue text-white shadow-sm shadow-brand-blue/20'
                                  : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.15]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                  isSelected
                                    ? 'bg-brand-blue text-white border-brand-blue'
                                    : 'bg-white/[0.06] text-gray-400 border-white/[0.1]'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-brand-blue shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Prev / Next / Submit */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                        <button
                          onClick={() => setActiveQuiz(prev => ({ ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) }))}
                          disabled={activeQuiz.currentIndex === 0}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Previous
                        </button>

                        {activeQuiz.currentIndex < activeQuiz.questions.length - 1 ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setActiveQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
                            icon={ArrowRight}
                          >
                            Next Question
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handleSubmitQuiz}
                            icon={CheckCircle2}
                          >
                            Submit Assessment
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </Card>
            )}
          </div>
        </ScrollReveal>
      ) : (
        /* Assessments Catalog View */
        <>
          {/* Header Banner */}
          <ScrollReveal variant="fade" duration={0.6}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-violet/10 blur-[90px] pointer-events-none" />

              <div className="space-y-3 z-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/15 text-brand-violet border border-brand-violet/30 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> Skill Credentials
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-400" /> 🔥 {streak} Day Streak
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
                  Technical Skill Assessments
                </h1>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  Validate your hands-on coding and architecture knowledge. Scores above 80% earn verified recruiter badges and boost your <span className="text-brand-blue font-semibold">Career Readiness ({careerReadiness}/100)</span>.
                </p>
              </div>

              <div className="flex gap-3 z-10 shrink-0">
                <Button variant="outline" size="sm" onClick={() => navigate('/student/roadmap')} icon={Layers}>
                  View Roadmap
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30 font-semibold'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Assessment Cards Grid */}
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssessments.map(asm => {
              const hasScore = asm.bestScore !== null && asm.bestScore !== undefined;

              return (
                <StaggerItem key={asm.id} variant="pop">
                  <Card hoverEffect className="p-6 border border-white/[0.08] bg-obsidian-900/80 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded border border-brand-blue/20">
                            {asm.category}
                          </span>
                          <h3 className="text-base font-bold text-white mt-2">
                            {asm.skill}
                          </h3>
                        </div>

                        {hasScore ? (
                          <div className="text-right">
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                              Verified {asm.bestScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded">
                            Not Taken
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 py-2 border-y border-white/[0.05] text-center">
                        <div>
                          <p className="text-xs font-bold text-white">{asm.questionsCount}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Questions</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{asm.durationMin} Mins</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Duration</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-violet">{asm.level}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Difficulty</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
                        <span>+2 Readiness on pass</span>
                      </div>

                      <Button
                        variant={hasScore ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => startQuiz(asm)}
                        icon={ArrowRight}
                      >
                        {hasScore ? 'Retake' : 'Start Assessment'}
                      </Button>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </>
      )}
    </div>
  );
}
