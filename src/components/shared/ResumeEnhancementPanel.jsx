import React, { useEffect, useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';
import { resumeService } from '../../services/resumeService';

export default function ResumeEnhancementPanel({ resume }) {
  const [targetRole, setTargetRole] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    let active = true;
    setSuggestions([]);
    if (resume?.id) {
      resumeService.getEnhancements(resume.id)
        .then(items => { if (active) setSuggestions(items); })
        .catch(() => { if (active) setSuggestions([]); });
    }
    return () => { active = false; };
  }, [resume?.id]);

  const generate = async (event) => {
    event.preventDefault();
    if (!resume?.id) return toast.error('Upload a resume before requesting suggestions.');
    if (targetRole.trim().length < 2) return toast.error('Enter the role you are targeting.');
    setLoading(true);
    try {
      const items = await resumeService.generateEnhancements(resume.id, targetRole.trim());
      setSuggestions(items);
      if (!items.length) toast('No supported rewrites were found in the parsed resume.');
      else toast.success(`Generated ${items.length} role-specific suggestions.`);
    } catch (error) {
      toast.error(error.message || 'Could not generate resume suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const saveSuggestion = async (item) => {
    setSavingId(item.id);
    try {
      const saved = await resumeService.updateEnhancementStatus(item.id, 'accepted');
      setSuggestions(current => current.map(entry => entry.id === item.id ? { ...entry, ...saved } : entry));
      toast.success('Suggestion saved. Your original uploaded file is unchanged.');
    } catch (error) {
      toast.error(error.message || 'Could not save this suggestion.');
    } finally {
      setSavingId(null);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Suggested text copied.');
    } catch {
      toast.error('Clipboard access is unavailable in this browser.');
    }
  };

  if (!resume) {
    return <Card className="p-8 text-center text-sm text-gray-400">Upload a resume before using role-specific enhancement.</Card>;
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="h-4 w-4 text-sky-400" /> Resume enhancement for your target role</h2>
          <p className="text-xs text-gray-400 mt-1">Suggestions use bullets parsed from {resume.name || resume.file_name || 'your resume'}. The model must preserve your actual skills, results, and experience.</p>
        </div>
        <form onSubmit={generate} className="flex flex-col sm:flex-row gap-3">
          <Input value={targetRole} onChange={event => setTargetRole(event.target.value)} placeholder="What role are you targeting? e.g. Data Analyst" aria-label="Target role" />
          <Button type="submit" variant="primary" loading={loading} disabled={loading || !targetRole.trim()} icon={Sparkles} className="shrink-0">Generate suggestions</Button>
        </form>
        <p className="text-[11px] text-gray-500">If Gemini is not configured, the server will report that clearly. It will not substitute generic or invented suggestions.</p>
      </Card>

      {suggestions.map(item => (
        <Card key={item.id} className="p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="primary">{item.section}</Badge>
            {item.target_role && <span className="text-[11px] text-gray-400">Target: {item.target_role}</span>}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/[0.03] p-3">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Original from your resume</p>
              <p className="text-xs text-gray-300 whitespace-pre-wrap">{item.original_text}</p>
            </div>
            <div className="rounded-lg bg-sky-500/[0.06] border border-sky-500/10 p-3">
              <p className="text-[10px] font-bold uppercase text-sky-400 mb-1">Suggested rewrite</p>
              <p className="text-xs text-white whitespace-pre-wrap">{item.suggested_text}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400"><strong>Why:</strong> {item.reason}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" icon={Copy} onClick={() => copyText(item.suggested_text)}>Copy</Button>
            <Button variant={item.status === 'accepted' ? 'ghost' : 'primary'} size="sm" icon={Check} disabled={item.status === 'accepted' || savingId === item.id} loading={savingId === item.id} onClick={() => saveSuggestion(item)}>
              {item.status === 'accepted' ? 'Saved' : 'Save suggestion'}
            </Button>
          </div>
        </Card>
      ))}

      {!suggestions.length && !loading && (
        <Card className="p-6 text-center text-xs text-gray-500">No role-specific suggestions yet. Choose a target role and generate suggestions from this resume.</Card>
      )}
    </div>
  );
}
