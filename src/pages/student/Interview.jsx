import React, { useState, useEffect } from 'react';
import { useStudentStore } from '../../store/studentStore';
import { MessageSquare, Mic, Play, RotateCcw, Send, Sparkles, Timer, Trophy, CheckCircle, ChevronRight, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Interview() {
  const { interviews, activeInterview, startInterview, submitInterviewAnswer, resetInterview } = useStudentStore();
  const [roleInput, setRoleInput] = useState('Frontend Engineer');
  const [answerInput, setAnswerInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [submitting, setSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (activeInterview && !activeInterview.completed) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswerSubmit(); // Auto submit on timer runout
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(120);
    }
    return () => clearInterval(interval);
  }, [activeInterview]);

  const handleStart = () => {
    if (!roleInput.trim()) {
      toast.error('Please enter a target role.');
      return;
    }
    startInterview(roleInput);
    setTimeLeft(120);
    toast.success(`Mock Interview initialized for ${roleInput}.`);
  };

  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) {
      toast.error('Please enter an answer to submit.');
      return;
    }
    setSubmitting(true);
    toast.loading('AI analyzing response structure...', { id: 'int-ans' });
    await submitInterviewAnswer(answerInput);
    setAnswerInput('');
    setTimeLeft(120);
    setSubmitting(false);
    toast.success('Response checked.', { id: 'int-ans' });
  };

  const handleMicClick = () => {
    toast.info('Voice Capture: Integration point for Web Speech API / microphone recording streams.', { duration: 4000 });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">AI Mock Interview Prep</h1>
          <p className="text-xs text-gray-400">Practice questions generated from your resume and get immediate analytics.</p>
        </div>
      </div>

      {!activeInterview ? (
        /* Setup / History view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Setup console */}
          <Card className="lg:col-span-2 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading">Start New Interview Session</h3>
            <p className="text-xs text-gray-400">AI will generate a series of questions checking matching tags and experience credentials in your CV.</p>
            
            <div className="flex gap-3 pt-2">
              <Input
                label="Target Job Position"
                value={roleInput}
                onChange={e => setRoleInput(e.target.value)}
                placeholder="e.g. Frontend Engineer, Node.js Architect"
              />
            </div>
            
            <div className="pt-2">
              <Button variant="primary" onClick={handleStart} icon={Play}>
                Initialize AI Room
              </Button>
            </div>
          </Card>

          {/* History */}
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-brand-amber" />
              <span>Past Performance</span>
            </h3>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.map(i => (
                  <div key={i.id} className="p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg">
                    <div className="flex justify-between font-semibold text-xs text-gray-200">
                      <span>{i.role}</span>
                      <span className="text-brand-emerald">{i.score}%</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{i.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-6 border border-dashed border-white/[0.06] rounded-lg">
                No mock interviews logged. Completed sessions will show here.
              </div>
            )}
          </Card>
        </div>
      ) : (
        /* Active Interview Simulator */
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6 space-y-6 relative overflow-hidden">
            {/* Header statistics */}
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider bg-brand-blue/10 px-2 py-0.5 rounded">
                  {activeInterview.role} Prep Room
                </span>
                {!activeInterview.completed && (
                  <p className="text-xs text-gray-400 mt-1">
                    Question {activeInterview.currentQuestionIndex + 1} of {activeInterview.questions.length}
                  </p>
                )}
              </div>
              
              {!activeInterview.completed && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-obsidian-950 rounded-lg text-brand-amber border border-brand-amber/25 text-xs font-semibold">
                  <Timer className="h-4 w-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {activeInterview.completed ? (
              /* Completion Feedback screen */
              <div className="space-y-6 text-center py-4">
                <div className="p-4 bg-brand-emerald/10 text-brand-emerald rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-brand-emerald/25">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">AI Evaluation Summary</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {activeInterview.feedback}
                  </p>
                </div>

                {/* Answers breakdown */}
                <div className="text-left space-y-3.5 pt-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeInterview.answers.map((ans, i) => (
                    <div key={i} className="p-3.5 bg-obsidian-950/40 border border-white/[0.04] rounded-xl text-xs space-y-2">
                      <p className="font-semibold text-white">Q: {ans.question}</p>
                      <p className="text-gray-400 italic">"My answer: {ans.answer}"</p>
                      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.03] text-[10px]">
                        <span className="font-semibold text-brand-blue bg-brand-blue/10 px-1.5 py-0.2 rounded">Score: {ans.score}%</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{ans.feedback}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center pt-4 border-t border-white/[0.04]">
                  <Button variant="outline" size="sm" onClick={resetInterview} icon={RotateCcw}>
                    Leave Simulator
                  </Button>
                </div>
              </div>
            ) : (
              /* Active rounds */
              <div className="space-y-6">
                {/* Active Question Bubble */}
                <div className="flex gap-4 items-start p-4 bg-obsidian-950 border border-white/[0.04] rounded-xl">
                  <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-lg border border-brand-blue/20 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Question</p>
                    <p className="text-sm font-medium text-white leading-relaxed mt-1">
                      {activeInterview.questions[activeInterview.currentQuestionIndex].question}
                    </p>
                  </div>
                </div>

                {/* Answer box */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400">Your Response</p>
                  <Input
                    type="textarea"
                    placeholder="Type your response detailedly... Remember to quantify outcomes and list core methodologies."
                    value={answerInput}
                    onChange={e => setAnswerInput(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                {/* Control bar */}
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMicClick}
                    icon={Mic}
                    className="border-white/[0.08] hover:bg-white/[0.02]"
                  >
                    Voice Input
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={submitting}
                    onClick={handleAnswerSubmit}
                    icon={Send}
                  >
                    Submit Response
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
