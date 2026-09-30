import React, { useState, useEffect } from 'react';
import {
  Server, Activity, Cpu, Database, HardDrive, Wifi,
  CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCcw,
  Zap, Globe, ShieldCheck, BarChart3
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line
} from 'recharts';
import toast from 'react-hot-toast';

const generateTimepoints = () => {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, i) => {
    const t = new Date(now - (11 - i) * 5000);
    return {
      time: `${t.getMinutes()}:${String(t.getSeconds()).padStart(2, '0')}`,
      cpu: Math.floor(Math.random() * 20 + 18),
      memory: Math.floor(Math.random() * 15 + 55),
      latency: Math.floor(Math.random() * 10 + 18),
      requests: Math.floor(Math.random() * 40 + 60),
    };
  });
};

const ENDPOINTS = [
  { path: '/api/v1/resumes/upload', method: 'POST', avgMs: 245, status: 'healthy', calls: 1284 },
  { path: '/api/v1/auth/login', method: 'POST', avgMs: 38, status: 'healthy', calls: 3820 },
  { path: '/api/v1/hr/candidates/screen-domain', method: 'POST', avgMs: 189, status: 'healthy', calls: 432 },
  { path: '/api/v1/jd-match/compare', method: 'POST', avgMs: 312, status: 'healthy', calls: 876 },
  { path: '/api/v1/admin/dashboard', method: 'GET', avgMs: 22, status: 'healthy', calls: 2108 },
  { path: '/api/v1/resumes/analyze', method: 'POST', avgMs: 890, status: 'warn', calls: 654 },
];

const SERVICES = [
  { name: 'FastAPI Application', status: 'up', uptime: '99.98%', port: '8000', pid: '13036' },
  { name: 'MongoDB (Local)', status: 'up', uptime: '99.99%', port: '27017', pid: 'mongod' },
  { name: 'Sentence-BERT Model', status: 'up', uptime: '100%', port: 'In-Memory', pid: '—' },
  { name: 'FAISS Vector Index', status: 'up', uptime: '100%', port: 'File-Backed', pid: '—' },
  { name: 'spaCy NLP Pipeline', status: 'up', uptime: '100%', port: 'In-Memory', pid: '—' },
  { name: 'Cloudinary CDN', status: 'warn', uptime: '—', port: 'api.cloudinary.com', pid: 'Offline Mode' },
];

export default function SystemMonitor() {
  const [metrics, setMetrics] = useState(generateTimepoints());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setMetrics(prev => {
        const now = new Date();
        const newPoint = {
          time: `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, '0')}`,
          cpu: Math.floor(Math.random() * 20 + 18),
          memory: Math.floor(Math.random() * 15 + 55),
          latency: Math.floor(Math.random() * 10 + 18),
          requests: Math.floor(Math.random() * 40 + 60),
        };
        return [...prev.slice(1), newPoint];
      });
      setLastRefresh(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const latest = metrics[metrics.length - 1];

  const handleManualRefresh = () => {
    setMetrics(generateTimepoints());
    setLastRefresh(new Date());
    toast.success('System metrics refreshed');
  };

  const statusIcon = (s) => {
    if (s === 'up') return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
    if (s === 'warn') return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
    return <XCircle className="h-3.5 w-3.5 text-rose-400" />;
  };

  const endpointColor = (s) =>
    s === 'healthy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : s === 'warn' ? 'text-amber-300 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  const chartTooltipStyle = { backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6', fontSize: 10 };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Server className="h-6 w-6 text-brand-violet" /> System Health & Infrastructure Monitor
          </h1>
          <p className="text-xs text-gray-400">
            Real-time telemetry for FastAPI server, MongoDB, ML models, and API endpoints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={autoRefresh ? 'teal' : 'default'} className="text-[10px] cursor-pointer" onClick={() => setAutoRefresh(a => !a)}>
            {autoRefresh ? '● LIVE' : '○ Paused'}
          </Badge>
          <Button variant="outline" size="sm" icon={RefreshCcw} onClick={handleManualRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: `${latest?.cpu}%`, icon: Cpu, color: 'brand-teal', sub: 'uvicorn worker' },
          { label: 'RAM Used', value: `${latest?.memory}%`, icon: HardDrive, color: 'brand-violet', sub: '~820 MB / 16 GB' },
          { label: 'API Latency', value: `${latest?.latency}ms`, icon: Zap, color: 'brand-blue', sub: 'P95 avg response' },
          { label: 'Req / min', value: `${latest?.requests}`, icon: Globe, color: 'emerald', sub: 'active throughput' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">{m.label}</span>
                <Icon className={`h-4 w-4 text-${m.color}`} />
              </div>
              <p className="text-2xl font-extrabold font-heading text-white">{m.value}</p>
              <p className="text-[11px] text-gray-500">{m.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-teal" /> CPU & Memory (Live)
            </h3>
            <span className="text-[10px] text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={9} />
                <YAxis stroke="#9ca3af" fontSize={9} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="cpu" stroke="#0d9488" fill="url(#cpuGrad)" strokeWidth={1.5} dot={false} name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="url(#memGrad)" strokeWidth={1.5} dot={false} name="RAM %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 space-y-3 bg-obsidian-900/90 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brand-blue" /> API Throughput & Latency
            </h3>
            <span className="text-[10px] text-gray-500">Requests per minute</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={9} />
                <YAxis stroke="#9ca3af" fontSize={9} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="requests" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Req/min" />
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} name="Latency ms" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Services & Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Health */}
        <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-teal" /> Service Health Registry
          </h3>
          <div className="space-y-2.5">
            {SERVICES.map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-xs">
                <div className="flex items-center gap-2.5">
                  {statusIcon(svc.status)}
                  <div>
                    <p className="font-semibold text-white">{svc.name}</p>
                    <p className="text-[10px] text-gray-500">Port / Addr: {svc.port} · PID: {svc.pid}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    svc.status === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {svc.status === 'up' ? 'Operational' : 'Degraded'}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-0.5">Uptime: {svc.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* API Endpoint Stats */}
        <Card className="p-5 space-y-4 bg-obsidian-900/90 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-blue" /> API Endpoint Performance
          </h3>
          <div className="space-y-2">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        ep.method === 'GET' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'
                      }`}>{ep.method}</span>
                      <code className="text-[10px] text-gray-300 font-mono truncate">{ep.path}</code>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{ep.calls.toLocaleString()} total calls</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${endpointColor(ep.status)}`}>
                      {ep.avgMs}ms
                    </span>
                  </div>
                </div>
                {/* Latency bar */}
                <div className="mt-2 h-1 rounded-full bg-obsidian-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ep.status === 'warn' ? 'bg-amber-400' : 'bg-brand-teal'}`}
                    style={{ width: `${Math.min((ep.avgMs / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
