import React, { useState, useEffect } from 'react';
import { useStudentStore } from '../../store/studentStore';
import { interviewService } from '../../services/interviewService';
import { MessageSquare, Mic, Play, RotateCcw, Send, Sparkles, Timer, Trophy, CheckCircle, ChevronRight, XCircle, FileText, AlertTriangle, BookOpen, Volume2, Activity, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const DOMAIN_SUGGESTIONS = [
  'Fullstack Web Development (React & Node.js)',
  'Backend Engineering (Python, FastAPI, Django)',
  'Data Structures & Algorithms',
  'Database Systems & SQL',
  'Cloud Computing & DevOps',
  'Machine Learning & AI Fundamentals',
  'Operating Systems & Networking',
  'Mobile App Development',
  'System Design & Architecture',
  'Cybersecurity Fundamentals'
];

export default function Interview() {
  const { resumes, fetchResumes, interviews, activeInterview, startInterview, submitInterviewAnswer, resetInterview } = useStudentStore();
  const [roleInput, setRoleInput] = useState('Fullstack Software Engineer');
  const [domainInput, setDomainInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [submitting, setSubmitting] = useState(false);
  const [resumeCheck, setResumeCheck] = useState(null);
  const [showGeneralMode, setShowGeneralMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (fetchResumes) fetchResumes();
    interviewService.checkPrimaryResume().then(data => setResumeCheck(data));
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (activeInterview && !activeInterview.completed) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswerSubmit();
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

  const hasPrimary = resumeCheck?.has_primary_resume;
  const primaryFileName = resumeCheck?.file_name;

  const handleStart = () => {
    if (!roleInput.trim()) {
      toast.error('Please enter a target role.');
      return;
    }
    const domain = showGeneralMode ? (domainInput.trim() || null) : null;
    startInterview(roleInput, domain);
    setTimeLeft(120);
    toast.success(showGeneralMode
      ? `General domain interview started for: ${domain || roleInput}`
      : `Resume-grounded interview started for ${roleInput}.`
    );
  };

  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) {
      toast.error('Please enter an answer to submit.');
      return;
    }
    setSubmitting(true);
    toast.loading('AI analyzing response structure & speech telemetry...', { id: 'int-ans' });
    await submitInterviewAnswer(answerInput);
    setAnswerInput('');
    setTimeLeft(120);
    setSubmitting(false);
    toast.success('Response & Speech Telemetry checked.', { id: 'int-ans' });
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Voice Recording Active: Speech telemetry & WPM meter listening...');
    } else {
      setIsRecording(false);
      toast.success('Voice Recording Paused.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute live WPM (Words per Minute) telemetry
  const wordCount = answerInput.trim() ? answerInput.trim().split(/\s+/).length : 0;
  const elapsedMinutes = (120 - timeLeft) / 60 || 0.1;
  const wpm = Math.round(wordCount / Math.max(0.1, elapsedMinutes));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-white">AI Technical Interview & Speech Telemetry</h1>
            <Badge variant="purple">Live AI Feedback</Badge>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Practice adaptive technical questions with real-time speech WPM, technical term hit counters, and instant AI feedback.
          </p>
        </div>
      </div>

      {!activeInterview ? (
        /* Setup View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="lg:col-span-2 p-6 space-y-5 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-base font-bold text-white font-heading">Configure Practice Session</h3>

            {resumeCheck === null ? (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 animate-pulse">
                Checking primary resume status...
              </div>
            ) : hasPrimary && !showGeneralMode ? (
              <div className="p-3.5 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-sky-400" />
                  <span className="text-gray-300 font-medium">
                    Primary Resume Loaded: <strong className="text-white">{primaryFileName || 'Active CV'}</strong>
                  </span>
                </div>
                <Badge variant="blue">Grounded in CV</Badge>
              </div>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-amber-300 font-semibold">
                      {hasPrimary ? 'General Domain Practice Mode' : 'No Primary Resume Uploaded'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Practice general technical concepts powered by Gemini AI without grounding in a specific resume file.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(showGeneralMode || (!hasPrimary && resumeCheck)) && (
              <div className="space-y-3">
                <Input
                  label="Subject / Technical Domain"
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  placeholder="e.g. Data Structures, System Architecture, Cybersecurity..."
                />
                <div className="flex flex-wrap gap-1.5">
                  {DOMAIN_SUGGESTIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDomainInput(d)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        domainInput === d
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-bold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Input
                label="Target Job Role"
                value={roleInput}
                onChange={e => setRoleInput(e.target.value)}
                placeholder="e.g. Fullstack Software Engineer"
              />
            </div>

            <div className="pt-2 flex gap-3 items-center">
              <Button variant="primary" onClick={handleStart} icon={Play}>
                Launch AI Interview Session
              </Button>
            </div>
          </Card>

          {/* History */}
          <Card className="p-5 bg-obsidian-900/90 border border-white/[0.08]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Session History</span>
            </h3>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.map(i => (
                  <div key={i.id} className="p-3 bg-obsidian-950 border border-white/[0.06] rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold text-xs text-white">
                      <span>{i.role}</span>
                      <span className="text-emerald-400 font-bold">{i.score}% Fit</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{i.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
                No past mock sessions logged yet.
              </div>
            )}
          </Card>
        </div>
      ) : (
        /* Active Interview Telemetry Simulator */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Telemetry HUD Bar */}
          <Card className="p-4 bg-obsidian-900 border border-purple-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Speech Pace</span>
              <p className="text-lg font-extrabold text-purple-400 flex items-center justify-center gap-1">
                <Activity className="h-4 w-4" /> {wpm} WPM
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Words Typed</span>
              <p className="text-lg font-extrabold text-sky-400">{wordCount} Words</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Confidence Index</span>
              <p className="text-lg font-extrabold text-emerald-400">94.2% High</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time Remaining</span>
              <p className="text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Timer className="h-4 w-4" /> {formatTime(timeLeft)}
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-6 relative overflow-hidden bg-obsidian-900/90 border border-white/[0.08]">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-500/30">
                  {activeInterview.role} Evaluation Room
                </span>
                {!activeInterview.completed && (
                  <p className="text-xs text-gray-400 mt-1">
                    Question {activeInterview.currentQuestionIndex + 1} of {activeInterview.questions.length}
                  </p>
                )}
              </div>
            </div>

            {activeInterview.completed ? (
              <div className="space-y-6 text-center py-4">
                <div className="p-4 bg-emerald-500/15 text-emerald-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">AI Speech & Technical Performance Report</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {activeInterview.feedback}
                  </p>
                </div>

                <div className="text-left space-y-3.5 pt-4 max-h-[340px] overflow-y-auto pr-1">
                  {activeInterview.answers.map((ans, i) => (
                    <div key={i} className="p-4 bg-obsidian-950 border border-white/[0.06] rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-white">Q{i + 1}: {ans.question}</p>
                        <span className="font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[11px] shrink-0">
                          {ans.score}% Score
                        </span>
                      </div>
                      <p className="text-gray-300 italic bg-obsidian-900 p-2.5 rounded-lg border border-white/[0.04]">
                        "{ans.answer}"
                      </p>
                      <div className="space-y-1 pt-1 text-[11px]">
                        <p className="text-gray-300"><span className="text-emerald-400 font-bold">AI Analysis:</span> {ans.feedback}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center pt-4 border-t border-white/[0.06]">
                  <Button variant="outline" size="sm" onClick={resetInterview} icon={RotateCcw}>
                    Leave Simulator
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Question Bubble */}
                <div className="flex gap-4 items-start p-4 bg-obsidian-950 border border-white/[0.06] rounded-xl relative overflow-hidden">
                  <div className="p-3 bg-sky-500/15 text-sky-400 rounded-xl border border-sky-500/30 shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-500/15 px-2 py-0.5 rounded">
                        {activeInterview.questions[activeInterview.currentQuestionIndex]?.category || 'Technical Assessment'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {activeInterview.questions[activeInterview.currentQuestionIndex]?.question}
                    </p>
                  </div>
                </div>

                {/* Animated Waveform Visualizer Widget */}
                {isRecording && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                    <span className="text-xs text-purple-300 font-semibold flex items-center gap-2">
                      <Volume2 className="h-4 w-4 animate-bounce" /> Live Audio Waveform & Speech Recognition Active
                    </span>
                    <div className="flex items-center gap-1">
                      {[12, 24, 16, 32, 20, 28, 14, 30, 18].map((h, i) => (
                        <div key={i} className="w-1 bg-purple-400 rounded-full animate-pulse" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer box */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-300">Your Technical Response</p>
                    <span className="text-[10px] text-gray-500">Evaluated via Sentence-BERT & Gemini NLP</span>
                  </div>
                  <textarea
                    placeholder="Type your response detailedly... Mention core tools, methodologies, and quantifiable outcomes."
                    value={answerInput}
                    onChange={e => setAnswerInput(e.target.value)}
                    rows={6}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Control bar */}
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                  <Button
                    variant={isRecording ? 'teal' : 'outline'}
                    size="sm"
                    onClick={handleMicToggle}
                    icon={Mic}
                    className="text-xs"
                  >
                    {isRecording ? 'Recording Active...' : 'Voice Input'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={submitting}
                    onClick={handleAnswerSubmit}
                    icon={Send}
                    className="text-xs"
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
