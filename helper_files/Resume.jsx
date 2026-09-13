import { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, Copy, Check, FileText } from 'lucide-react';
import ResumeGuide from '../../components/resume/ResumeGuide';
import { extractText } from '../../lib/extractText';
import { runRuleChecks, analyzeResume, analyzeJDMatch, rewriteResume, generatePDF } from '../../lib/resumeAI';

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 75) return 'text-emerald-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

function scoreLabel(score) {
  if (score >= 75) return { text: 'Strong',            color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40' };
  if (score >= 50) return { text: 'Needs Improvement', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40' };
  return               { text: 'Needs Major Work',  color: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40' };
}

function ScoreRing({ score }) {
  const color   = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const dash    = `${score} ${100 - score}`;
  const label   = scoreLabel(score);
  return (
    <div className="text-center space-y-3">
      <div className="relative w-36 h-36 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E6F0" strokeWidth="2.5"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
            strokeDasharray={dash} strokeLinecap="round" className="transition-all duration-1000"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</span>
          <span className="text-xs text-[#8890A8]">/ 100</span>
        </div>
      </div>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${label.color}`}>
        {label.text}
      </span>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium flex-shrink-0 transition-colors">
      {copied ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
    </button>
  );
}

// ── Upload tab ────────────────────────────────────────────────────────────────

function UploadTab({ onAnalyzed }) {
  const [dragging, setDragging]   = useState(false);
  const [fileName, setFileName]   = useState('');
  const [stage, setStage]         = useState('idle'); // idle | extracting | scanning | analyzing | done | error
  const [error, setError]         = useState('');
  const inputRef                  = useRef(null);

  async function processFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Only PDF or DOCX files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setFileName(file.name);
    setError('');

    try {
      setStage('extracting');
      const text = await extractText(file);
      if (!text || text.length < 50) throw new Error('Could not extract text. Make sure your PDF is not image-only.');

      setStage('scanning');
      const { checks, ruleScore, wordCount, quantifiedPct } = runRuleChecks(text);

      setStage('analyzing');
      const aiResult = await analyzeResume(text, ruleScore);

      // Blend rule score (40%) + AI score (60%)
      const finalScore = Math.round(ruleScore * 0.4 + aiResult.aiScore * 0.6);

      setStage('done');
      onAnalyzed({ text, checks, ruleScore, aiResult, finalScore });
    } catch (e) {
      setStage('error');
      setError(e?.message || 'Something went wrong. Please try again.');
    }
  }

  const stageLabel = {
    extracting: 'Extracting text from your resume…',
    scanning:   'Running ATS rule checks…',
    analyzing:  'AI deep analysis in progress…',
    done:       'Analysis complete!',
    error:      '',
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
        onClick={() => stage === 'idle' || stage === 'error' ? inputRef.current?.click() : null}
        className={`rounded-2xl border-2 border-dashed p-6 sm:p-12 text-center cursor-pointer transition-all
          ${dragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-[#E2E6F0] dark:border-[#272A38] hover:border-indigo-400 bg-[#F8F9FF] dark:bg-[#13131f]'}`}>
        <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
          onChange={e => processFile(e.target.files[0])} />

        {stage === 'idle' || stage === 'error' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-indigo-500" />
            </div>
            <p className="font-semibold text-[#07090f] dark:text-[#F0F2FF] mb-1">Drop your resume here</p>
            <p className="text-sm text-[#3d4468] dark:text-[#8890A8]">PDF or DOCX · Max 5MB</p>
            <p className="text-xs text-indigo-500 mt-2 font-medium">or click to browse</p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-[#3d4468] dark:text-[#8890A8]">
              <FileText size={16} className="text-indigo-500" />
              <span className="font-medium text-[#07090f] dark:text-[#F0F2FF]">{fileName}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-indigo-500">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              {stageLabel[stage]}
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-3">
              {['extracting', 'scanning', 'analyzing'].map((s, i) => {
                const stages  = ['extracting', 'scanning', 'analyzing'];
                const current = stages.indexOf(stage);
                const done    = i < current || stage === 'done';
                const active  = i === current;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full transition-all ${done ? 'bg-emerald-500' : active ? 'bg-indigo-500 animate-pulse' : 'bg-[#E2E6F0] dark:bg-[#272A38]'}`} />
                    <span className="text-xs text-[#8890A8] capitalize hidden sm:block">{s}</span>
                    {i < 2 && <div className="w-4 h-px bg-[#E2E6F0] dark:bg-[#272A38] ml-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-[#F0F2FF] dark:bg-[#0d1520] border border-indigo-200 dark:border-indigo-500/20 p-3 text-xs text-[#3d4468] dark:text-[#8890A8] space-y-1">
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">How it works</p>
        <p>1. Text is extracted locally in your browser — your file stays on-device.</p>
        <p>2. Instant ATS rule checks run on-device (word count, sections, verbs, quantification).</p>
        <p>3. For AI analysis, the extracted text is sent to the server and processed by Groq.</p>
      </div>
    </div>
  );
}

// ── ATS tab ───────────────────────────────────────────────────────────────────

function ATSTab({ data }) {
  if (!data) return (
    <div className="text-center py-16 text-[#8890A8] text-sm">
      Upload your resume first to see your ATS score.
    </div>
  );

  const { checks, finalScore, aiResult } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score ring */}
        <div className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] p-6 flex flex-col items-center justify-center gap-4">
          <ScoreRing score={finalScore} />
          <p className="text-xs text-[#3d4468] dark:text-[#8890A8] text-center leading-relaxed">{aiResult.summary}</p>
        </div>

        {/* Rule checks */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E6F0] dark:border-[#272A38]">
            <h3 className="font-semibold text-[#07090f] dark:text-[#F0F2FF] text-sm">ATS Rule Checks</h3>
          </div>
          <div className="divide-y divide-[#E2E6F0] dark:divide-[#272A38]">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                {c.pass
                  ? <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                  : <AlertCircle size={15} className="text-red-500 flex-shrink-0" />}
                <span className={`text-sm flex-1 ${c.pass ? 'text-[#07090f] dark:text-[#F0F2FF]' : 'text-red-600 dark:text-red-400'}`}>{c.label}</span>
                {c.detail && <span className="text-xs text-[#8890A8]">{c.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Strengths</h3>
          <ul className="space-y-2">
            {aiResult.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Improvements Needed</h3>
          <ul className="space-y-2">
            {aiResult.improvements?.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>{s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing keywords */}
      {aiResult.missingKeywords?.length > 0 && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {aiResult.missingKeywords.map((k, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Rewrites tab ───────────────────────────────────────────────────────────

function AIRewritesTab({ data }) {
  if (!data) return (
    <div className="text-center py-16 text-[#8890A8] text-sm">
      Upload your resume first to get AI-powered bullet rewrites.
    </div>
  );

  const { aiResult } = data;
  const bullets = aiResult.weakBullets || [];

  if (bullets.length === 0) return (
    <div className="text-center py-16 space-y-2">
      <div className="text-3xl">🎉</div>
      <p className="font-semibold text-[#07090f] dark:text-[#F0F2FF]">No weak bullets found!</p>
      <p className="text-sm text-[#8890A8]">Your bullet points are already well-written.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {bullets.map((b, i) => (
        <div key={i} className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] overflow-hidden">
          {/* Original */}
          <div className="flex items-start gap-3 p-4 border-b border-[#E2E6F0] dark:border-[#272A38]">
            <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Weak bullet</div>
              <p className="text-sm text-[#1e2340] dark:text-[#9096B0] italic">"{b.original}"</p>
              {b.reason && <p className="text-xs text-[#8890A8] mt-1">Why: {b.reason}</p>}
            </div>
          </div>
          {/* Rewrites */}
          <div className="p-4 space-y-2">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">AI Rewrites</div>
            {b.rewrites?.map((r, j) => (
              <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-500 text-xs font-bold flex-shrink-0 mt-0.5">✦</span>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 flex-1 leading-relaxed">{r}</p>
                <CopyButton text={r} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Improved Resume tab ───────────────────────────────────────────────────────

function ImprovedTab({ data }) {
  const [rewritten, setRewritten]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [genPDF, setGenPDF]         = useState(false);
  const [error, setError]           = useState('');
  const [copied, setCopied]         = useState(false);

  if (!data) return (
    <div className="text-center py-16 text-[#8890A8] text-sm">
      Upload your resume first to generate an improved version.
    </div>
  );

  async function handleRewrite() {
    setLoading(true); setError(''); setRewritten('');
    try {
      const text = await rewriteResume(data.text, data.aiResult);
      setRewritten(text);
    } catch (e) {
      setError(e?.message || 'Rewrite failed. Please try again.');
    } finally { setLoading(false); }
  }

  async function handleDownloadPDF() {
    setGenPDF(true);
    try {
      const name = rewritten.split('\n')[0]?.trim() || 'Resume';
      await generatePDF(rewritten, name);
    } catch (e) {
      setError('PDF generation failed: ' + e?.message);
    } finally { setGenPDF(false); }
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Split into sections for diff view
  const originalLines  = data.text.split('\n').filter(l => l.trim());
  const rewrittenLines = rewritten.split('\n').filter(l => l.trim());

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Info banner */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-[#F0F2FF] dark:bg-[#0d1520] p-4 space-y-2">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">What Groq AI will apply:</p>
        <ul className="space-y-1">
          {data.aiResult.improvements?.map((imp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#3d4468] dark:text-[#8890A8]">
              <span className="text-indigo-500 flex-shrink-0">→</span>{imp}
            </li>
          ))}
          {data.aiResult.missingKeywords?.length > 0 && (
            <li className="flex items-start gap-2 text-sm text-[#3d4468] dark:text-[#8890A8]">
              <span className="text-indigo-500 flex-shrink-0">→</span>
              Add missing keywords: <span className="font-medium text-indigo-600 dark:text-indigo-400 ml-1">{data.aiResult.missingKeywords.join(', ')}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Generate button */}
      {!rewritten && (
        <button onClick={handleRewrite} disabled={loading}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     hover:from-indigo-500 hover:to-purple-500
                     disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20">
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Rewriting your resume with AI…</span>
            : '✨ Generate Improved Resume'}
        </button>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {rewritten && (
        <div className="space-y-5">
          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleDownloadPDF} disabled={genPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                         text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500
                         disabled:opacity-40 transition-all shadow-md shadow-indigo-500/20">
              {genPDF
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating PDF…</>
                : <>⬇ Download Improved PDF</>}
            </button>
            <button onClick={handleCopyAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700
                         text-indigo-600 dark:text-indigo-400 text-sm font-semibold
                         hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              {copied ? <><Check size={14}/>Copied!</> : <><Copy size={14}/>Copy All Text</>}
            </button>
            <button onClick={handleRewrite}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E6F0] dark:border-[#272A38]
                         text-[#3d4468] dark:text-[#8890A8] text-sm font-semibold
                         hover:bg-[#F0F2FF] dark:hover:bg-[#1a1a2e] transition-colors">
              ↺ Regenerate
            </button>
          </div>

          {/* Side-by-side diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] overflow-hidden">
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/10 border-b border-[#E2E6F0] dark:border-[#272A38] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">Original</span>
              </div>
              <div className="p-4 space-y-1 max-h-[500px] overflow-y-auto">
                {originalLines.map((line, i) => (
                  <p key={i} className={`text-xs leading-relaxed font-mono
                    ${line === line.toUpperCase() && line.length < 45
                      ? 'font-bold text-[#07090f] dark:text-[#F0F2FF] mt-3'
                      : 'text-[#3d4468] dark:text-[#8890A8]'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Improved */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 overflow-hidden">
              <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">AI Improved</span>
              </div>
              <div className="p-4 space-y-1 max-h-[500px] overflow-y-auto">
                {rewrittenLines.map((line, i) => (
                  <p key={i} className={`text-xs leading-relaxed font-mono
                    ${line === line.toUpperCase() && line.length < 45
                      ? 'font-bold text-indigo-600 dark:text-indigo-400 mt-3'
                      : 'text-[#1e2340] dark:text-[#c8cce0]'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#8890A8] text-center">
            Note: PDF uses a clean ATS-friendly template. Original formatting/design is not preserved — content and quality are improved.
          </p>
        </div>
      )}
    </div>
  );
}

// ── JD Match tab ──────────────────────────────────────────────────────────────

function JDMatchTab({ resumeText }) {
  const [jd, setJD]         = useState('');
  const [loading, setLoad]  = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');

  async function handleMatch() {
    if (!jd.trim() || !resumeText) return;
    setLoad(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeJDMatch(resumeText, jd);
      setResult(data);
    } catch (e) {
      setError(e?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoad(false);
    }
  }

  if (!resumeText) return (
    <div className="text-center py-16 text-[#8890A8] text-sm">
      Upload your resume first, then paste a job description to match against.
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] p-5 space-y-3">
        <h3 className="font-semibold text-[#07090f] dark:text-[#F0F2FF] text-sm">Paste Job Description</h3>
        <textarea
          value={jd} onChange={e => setJD(e.target.value)} rows={7}
          placeholder="Paste the full job description here…"
          className="w-full bg-transparent text-sm text-[#1e2340] dark:text-[#c8cce0]
                     placeholder:text-[#8890A8] resize-none focus:outline-none" />
        <button onClick={handleMatch} disabled={!jd.trim() || loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Analyzing match…</span>
            : 'Analyze JD Match →'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Match score */}
          <div className="rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] p-6 flex flex-col items-center gap-4">
            <ScoreRing score={result.matchScore} />
            <p className="text-sm text-[#3d4468] dark:text-[#8890A8] text-center leading-relaxed max-w-md">{result.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Matched */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((k, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((k, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-[#F0F2FF] dark:bg-[#0d1520] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">How to Improve Your Match</h3>
            <ul className="space-y-2">
              {result.suggestions?.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#3d4468] dark:text-[#8890A8]">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">→</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Resume (main) ─────────────────────────────────────────────────────────────

export default function Resume() {
  const [tab, setTab]           = useState('guide');
  const [menuOpen, setMenuOpen] = useState(false);
  const [analysisData, setData] = useState(null);

  function handleAnalyzed(data) {
    setData(data);
    setTab('ats');
  }

  const TABS = [
    { id: 'guide',    label: 'Guide',           icon: '📖', desc: 'Resume writing tips',    locked: false },
    { id: 'upload',   label: 'Upload',          icon: '📤', desc: 'Upload your resume',     locked: false },
    { id: 'ats',      label: 'ATS Check',       icon: '🎯', desc: 'ATS score & analysis',   locked: !analysisData },
    { id: 'ai',       label: 'AI Rewrites',     icon: '✨', desc: 'Bullet point rewrites',  locked: !analysisData },
    { id: 'improved', label: 'Improved Resume', icon: '🚀', desc: 'Full AI rewrite',        locked: !analysisData },
    { id: 'jd',       label: 'JD Match',        icon: '🔗', desc: 'Match with job posting', locked: false },
  ];

  const currentTab = TABS.find(t => t.id === tab);
  const currentIndex = TABS.findIndex(t => t.id === tab);

  function selectTab(id) {
    setTab(id);
    setMenuOpen(false);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#07090f] dark:text-[#F0F2FF]">Resume Hub</h1>
        <p className="text-[#3d4468] dark:text-[#8890A8] text-sm mt-1">
          ATS check · AI bullet rewrites · JD matcher — powered by Groq AI
        </p>
      </div>

      {/* ── Mobile: Dropdown trigger ──────────────────────────────── */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
              {currentIndex + 1}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{currentTab?.icon}</span>
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{currentTab?.label}</span>
                {tab === 'ats' && analysisData && (
                  <span className={`text-xs font-bold ${scoreColor(analysisData.finalScore)}`}>
                    {analysisData.finalScore}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400">{currentTab?.desc}</p>
            </div>
          </div>
          <svg className={`w-5 h-5 text-indigo-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            {/* Menu */}
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-[#E2E6F0] dark:border-[#272A38] bg-white dark:bg-[#1a1a2e] shadow-xl shadow-black/10 overflow-hidden">
              {TABS.map(({ id, label, icon, desc, locked }, i) => {
                const isActive = tab === id;
                return (
                  <button
                    key={id}
                    onClick={() => !locked && selectTab(id)}
                    disabled={locked}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[#E2E6F0]/50 dark:border-[#272A38]/50 last:border-b-0
                      ${isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                        : locked
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-[#F8F9FF] dark:hover:bg-[#13131f]'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isActive ? 'bg-indigo-500 text-white' : 'bg-[#E2E6F0] dark:bg-[#272A38] text-[#3d4468] dark:text-[#8890A8]'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{icon}</span>
                        <span className={`text-sm font-semibold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#07090f] dark:text-[#F0F2FF]'}`}>{label}</span>
                        {locked && <span className="text-[10px]">🔒</span>}
                        {id === 'ats' && analysisData && (
                          <span className={`text-xs font-bold ${scoreColor(analysisData.finalScore)}`}>{analysisData.finalScore}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8890A8]">{desc}</p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-[#E2E6F0] dark:bg-[#272A38] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / TABS.length) * 100}%` }} />
        </div>
      </div>

      {/* ── Desktop: Horizontal step nav ─────────────────────────── */}
      <div className="hidden sm:block">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ id, label, icon, desc, locked }, i) => {
            const isActive = tab === id;
            const isDone = id === 'ats' && analysisData;
            return (
              <button key={id} onClick={() => !locked && setTab(id)} disabled={locked}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all min-w-[170px] flex-shrink-0 text-left
                  ${isActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                    : locked
                      ? 'border-[#E2E6F0] dark:border-[#272A38] opacity-40 cursor-not-allowed'
                      : 'border-[#E2E6F0] dark:border-[#272A38] bg-[#F8F9FF] dark:bg-[#13131f] hover:border-indigo-300 cursor-pointer'
                  }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${isActive ? 'bg-indigo-500 text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-[#E2E6F0] dark:bg-[#272A38] text-[#3d4468] dark:text-[#8890A8]'}`}>
                  {isDone && !isActive ? '✓' : i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{icon}</span>
                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-[#07090f] dark:text-[#F0F2FF]'}`}>{label}</span>
                    {id === 'ats' && analysisData && <span className={`text-xs font-bold ${scoreColor(analysisData.finalScore)}`}>{analysisData.finalScore}</span>}
                    {locked && <span className="text-[10px]">🔒</span>}
                  </div>
                  <p className={`text-[11px] truncate ${isActive ? 'text-indigo-500' : 'text-[#8890A8]'}`}>{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-2 h-1.5 bg-[#E2E6F0] dark:bg-[#272A38] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / TABS.length) * 100}%` }} />
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────── */}
      {tab === 'guide'    && <ResumeGuide />}
      {tab === 'upload'   && <UploadTab onAnalyzed={handleAnalyzed} />}
      {tab === 'ats'      && <ATSTab data={analysisData} />}
      {tab === 'ai'       && <AIRewritesTab data={analysisData} />}
      {tab === 'improved' && <ImprovedTab data={analysisData} />}
      {tab === 'jd'       && <JDMatchTab resumeText={analysisData?.text} />}
    </div>
  );
}
