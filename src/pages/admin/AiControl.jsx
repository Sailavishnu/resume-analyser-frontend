import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  Cpu, Sparkles, RefreshCcw, Layers, Database, ShieldCheck, CheckCircle2,
  Zap, AlertTriangle, Settings, Activity, BarChart3, Brain, Target,
  ArrowUpRight, Play, Square, RotateCcw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const LATENCY_MOCK = [
  { t: '00s', bert: 12, spacy: 4, faiss: 1 },
  { t: '10s', bert: 14, spacy: 5, faiss: 2 },
  { t: '20s', bert: 11, spacy: 4, faiss: 1 },
  { t: '30s', bert: 13, spacy: 6, faiss: 1 },
  { t: '40s', bert: 12, spacy: 4, faiss: 2 },
  { t: '50s', bert: 15, spacy: 5, faiss: 1 },
];

const DOMAIN_KNOWLEDGE_STATS = [
  { domain: 'Cyber Security & InfoSec', keywords: 48, lastUpdated: '2026-09-30', status: 'active' },
  { domain: 'Full Stack Web Development', keywords: 52, lastUpdated: '2026-09-30', status: 'active' },
  { domain: 'Data Science & AI / ML', keywords: 61, lastUpdated: '2026-09-30', status: 'active' },
  { domain: 'Cloud & DevOps Engineering', keywords: 44, lastUpdated: '2026-09-30', status: 'active' },
  { domain: 'Mobile Development', keywords: 38, lastUpdated: '2026-09-28', status: 'active' },
  { domain: 'Database & Data Engineering', keywords: 42, lastUpdated: '2026-09-29', status: 'active' },
];

const ML_CONFIG = [
  { key: 'SBERT Min Similarity', value: '0.35', type: 'number', unit: 'threshold' },
  { key: 'Domain Screen Min Relevance', value: '40', type: 'number', unit: '%' },
  { key: 'JD Match Top-K Results', value: '5', type: 'number', unit: 'results' },
  { key: 'FAISS Index Type', value: 'IndexFlatIP', type: 'select', options: ['IndexFlatIP', 'IndexHNSWFlat', 'IndexIVFFlat'] },
  { key: 'ATS Score Weight (Skills)', value: '50', type: 'number', unit: '%' },
  { key: 'ATS Score Weight (Experience)', value: '30', type: 'number', unit: '%' },
];

const CHART_STYLE = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

export default function AiControl() {
  const { stats } = useAdminStore();
  const [rebuilding, setRebuilding] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [mlConfig, setMlConfig] = useState(
    Object.fromEntries(ML_CONFIG.map(c => [c.key, c.value]))
  );

  const handleRebuildIndex = () => {
    setRebuilding(true);
    toast.loading('Triggering FAISS Vector Store rebuild...', { id: 'rebuild' });
    setTimeout(() => {
      setRebuilding(false);
      toast.success('FAISS index rebuilt: 30 job vectors indexed!', { id: 'rebuild' });
    }, 2200);
  };

  const handleWarmupModels = () => {
    toast.loading('Warming up Sentence-BERT & spaCy pipeline...', { id: 'warmup' });
    setTimeout(() => {
      toast.success('All ML models warm & ready in memory!', { id: 'warmup' });
    }, 1500);
  };

  const handleRetrainDomainGraph = () => {
    setRetraining(true);
    toast.loading('Reloading Domain Knowledge Graph mappings...', { id: 'retrain' });
    setTimeout(() => {
      setRetraining(false);
      toast.success('Domain Knowledge Graph refreshed! 6 domains, 285 keywords indexed.', { id: 'retrain' });
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-brand-violet" /> AI Engine & Machine Learning Control Center
          </h1>
          <p className="text-xs text-gray-400">
            Monitor Sentence-BERT, spaCy NLP, FAISS vector index, Domain Knowledge Graph, and configure ML scoring parameters.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleWarmupModels} icon={Zap}>Warm-Up</Button>
          <Button variant="outline" size="sm" onClick={handleRetrainDomainGraph} loading={retraining} icon={Brain}>
            Reload Domain Graph
          </Button>
          <Button variant="violet" size="sm" onClick={handleRebuildIndex} loading={rebuilding} icon={RefreshCcw}>
            Rebuild FAISS Index
          </Button>
        </div>
      </div>

      {/* ML Component Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border border-white/[0.08] bg-obsidian-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" /> Sentence-BERT
            </h3>
            <Badge variant="teal">Active</Badge>
          </div>
          <div className="text-[11px] text-gray-400 space-y-2 bg-obsidian-950 p-3 rounded-xl border border-white/[0.04]">
            <div className="flex justify-between"><span>Model</span><strong className="text-white">all-MiniLM-L6-v2</strong></div>
            <div className="flex justify-between"><span>Embedding Dim</span><strong className="text-white">384</strong></div>
            <div className="flex justify-between"><span>Inference Latency</span><strong className="text-emerald-400">~12ms / sentence</strong></div>
            <div className="flex justify-between"><span>Memory</span><strong className="text-white">~80 MB</strong></div>
            <div className="flex justify-between"><span>Status</span><strong className="text-emerald-400">● Warm in Memory</strong></div>
          </div>
        </Card>

        <Card className="p-5 border border-white/[0.08] bg-obsidian-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-violet" /> FAISS Vector Index
            </h3>
            <Badge variant="violet">30 Vectors</Badge>
          </div>
          <div className="text-[11px] text-gray-400 space-y-2 bg-obsidian-950 p-3 rounded-xl border border-white/[0.04]">
            <div className="flex justify-between"><span>Index Type</span><strong className="text-white">IndexFlatIP</strong></div>
            <div className="flex justify-between"><span>Similarity</span><strong className="text-white">Cosine (Inner Product)</strong></div>
            <div className="flex justify-between"><span>Indexed Jobs</span><strong className="text-emerald-400">15 Active Listings</strong></div>
            <div className="flex justify-between"><span>Top-K Speed</span><strong className="text-emerald-400">&lt; 2ms</strong></div>
            <div className="flex justify-between"><span>File</span><strong className="text-white">ml/artifacts/job_vectors.index</strong></div>
          </div>
        </Card>

        <Card className="p-5 border border-white/[0.08] bg-obsidian-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" /> spaCy NLP Engine
            </h3>
            <Badge variant="blue">Loaded</Badge>
          </div>
          <div className="text-[11px] text-gray-400 space-y-2 bg-obsidian-950 p-3 rounded-xl border border-white/[0.04]">
            <div className="flex justify-between"><span>Pipeline</span><strong className="text-white">en_core_web_sm</strong></div>
            <div className="flex justify-between"><span>Entity Extractor</span><strong className="text-emerald-400">Active</strong></div>
            <div className="flex justify-between"><span>Skill Normalization</span><strong className="text-emerald-400">Ready</strong></div>
            <div className="flex justify-between"><span>PDF Parser</span><strong className="text-white">PyMuPDF Integration</strong></div>
            <div className="flex justify-between"><span>Latency</span><strong className="text-emerald-400">~4ms / doc</strong></div>
          </div>
        </Card>
      </div>

      {/* ML Inference Latency Chart */}
      <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-teal" /> ML Model Inference Latency (ms)
        </h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={LATENCY_MOCK}>
              <XAxis dataKey="t" stroke="#6b7280" fontSize={9} />
              <YAxis stroke="#6b7280" fontSize={9} unit="ms" />
              <Tooltip contentStyle={CHART_STYLE} />
              <Line type="monotone" dataKey="bert" stroke="#0d9488" strokeWidth={2} dot={false} name="Sentence-BERT" />
              <Line type="monotone" dataKey="spacy" stroke="#6366f1" strokeWidth={2} dot={false} name="spaCy NLP" />
              <Line type="monotone" dataKey="faiss" stroke="#f59e0b" strokeWidth={2} dot={false} name="FAISS Search" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-teal-400 rounded inline-block" /> Sentence-BERT</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-400 rounded inline-block" /> spaCy NLP</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 rounded inline-block" /> FAISS Search</span>
        </div>
      </Card>

      {/* Domain Knowledge Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-teal" /> Domain Knowledge Graph
            </h3>
            <Badge variant="teal">{DOMAIN_KNOWLEDGE_STATS.length} Domains</Badge>
          </div>
          <div className="space-y-2">
            {DOMAIN_KNOWLEDGE_STATS.map(d => (
              <div key={d.domain} className="flex items-center justify-between p-2.5 rounded-lg bg-obsidian-950 border border-white/[0.06] text-xs">
                <div>
                  <p className="font-semibold text-white text-[11px]">{d.domain}</p>
                  <p className="text-[9px] text-gray-500">Updated: {d.lastUpdated}</p>
                </div>
                <div className="text-right">
                  <span className="text-brand-teal font-bold">{d.keywords} keywords</span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                    <span className="text-[9px] text-emerald-400">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ML Scoring Config */}
        <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-brand-violet" /> ML Scoring Configuration
            </h3>
            <Button variant="violet" size="sm" onClick={() => toast.success('ML configuration saved!')} className="text-[10px]">
              Save Config
            </Button>
          </div>
          <div className="space-y-2.5">
            {ML_CONFIG.map(cfg => (
              <div key={cfg.key} className="flex items-center justify-between p-3 rounded-lg bg-obsidian-950 border border-white/[0.06] text-xs gap-3">
                <label className="text-gray-300 font-semibold text-[11px] min-w-0 flex-1">{cfg.key}</label>
                <div className="flex items-center gap-1.5 shrink-0">
                  {cfg.type === 'select' ? (
                    <select
                      value={mlConfig[cfg.key]}
                      onChange={e => setMlConfig(p => ({ ...p, [cfg.key]: e.target.value }))}
                      className="bg-obsidian-900 border border-white/10 rounded-lg px-2 py-1 text-white text-[10px] focus:outline-none focus:border-brand-violet"
                    >
                      {cfg.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={mlConfig[cfg.key]}
                      onChange={e => setMlConfig(p => ({ ...p, [cfg.key]: e.target.value }))}
                      className="w-16 bg-obsidian-900 border border-white/10 rounded-lg px-2 py-1 text-white text-[10px] focus:outline-none focus:border-brand-violet text-right"
                    />
                  )}
                  {cfg.unit && <span className="text-[10px] text-gray-500">{cfg.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
