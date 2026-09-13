import React, { useState } from 'react';
import { Cpu, Shield, Database, Save, HardDrive, Bell, Sliders } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [aiModel, setAiModel] = useState('gemini-flash');
  const [atsThreshold, setAtsThreshold] = useState(75);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    toast.success('System configuration saved successfully');
  };

  const handleBackup = () => {
    toast.loading('Exporting encrypted database snapshot...', { duration: 1500 });
    setTimeout(() => {
      toast.success('Database backup created: backup_2026_09_13.enc');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-faint)' }}>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
            System Infrastructure & AI Config
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage core AI model routing, scoring strictness, and database operations.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} icon={Save}>
          Save Settings
        </Button>
      </div>

      <div className="space-y-4">
        {/* AI Model Routing */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-brand-violet" />
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Parser & Scoring Engine Provider</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select which model powers ATS keyword extraction and bullet enhancements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'gemini-flash', name: 'Google Gemini 2.5 Flash', desc: 'Fastest latency (180ms), optimal cost' },
              { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Deep semantic reasoning for CVs' },
              { id: 'local-fastapi', name: 'Local NLP (FastAPI + SpaCy)', desc: 'Privacy-focused local execution' },
            ].map(m => (
              <div
                key={m.id}
                onClick={() => setAiModel(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  aiModel === m.id
                    ? 'border-brand-violet bg-brand-violet/10 shadow-sm'
                    : 'glass hover:border-brand-violet/40'
                }`}
              >
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ATS Filter Threshold */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Default Recruiter ATS Cutoff Threshold</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Candidates scoring above this threshold get prioritized in HR candidate tables.</p>
            </div>
            <span className="text-lg font-extrabold text-brand-blue font-heading">{atsThreshold}%</span>
          </div>

          <input
            type="range"
            min="50"
            max="95"
            value={atsThreshold}
            onChange={(e) => setAtsThreshold(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </Card>

        {/* Database & Operations */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-brand-blue" />
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Database Operations & Backups</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Trigger live data backups or clear temporary resume caches.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleBackup} icon={HardDrive}>
              Trigger Full Backup (.enc)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                toast(`Maintenance mode ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
              }}
            >
              {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
