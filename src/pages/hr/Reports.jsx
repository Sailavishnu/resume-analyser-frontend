import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { ClipboardList, Download, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('csv');

  const mockReports = [
    { id: 'rep-1', name: 'Senior_React_Applicants_Scorecard_2026.csv', type: 'CSV', date: '2026-07-25', size: '14.2 KB' },
    { id: 'rep-2', name: 'Engineering_Shortlist_Quarter_Feedback.pdf', type: 'PDF', date: '2026-07-20', size: '2.5 MB' },
    { id: 'rep-3', name: 'Funnel_Attrition_Analytics.xlsx', type: 'XLSX', date: '2026-07-15', size: '48.9 KB' }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Compiling database records and matching tables...', { id: 'report' });
    
    // Simulate generation
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Report successfully compiled! Downloading file.', { id: 'report' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Pipeline Reports Builder</h1>
          <p className="text-xs text-gray-400">Compile matching statistics, applicant funnel details, and screening notes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Creator parameters */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4.5 w-4.5 text-brand-teal" />
            <h3 className="text-sm font-bold text-white font-heading">Generate New Report</h3>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <Input
              label="Select Target Category"
              type="select"
              options={[
                { value: 'all', label: 'All Open Positions' },
                { value: 'react', label: 'Senior React Developer' },
                { value: 'fullstack', label: 'Fullstack Engineer' }
              ]}
            />

            <Input
              label="Format Type"
              type="select"
              value={format}
              onChange={e => setFormat(e.target.value)}
              options={[
                { value: 'csv', label: 'Comma Separated Values (.csv)' },
                { value: 'pdf', label: 'Portable Document File (.pdf)' },
                { value: 'excel', label: 'Microsoft Excel (.xlsx)' }
              ]}
            />

            <Button type="submit" variant="teal" loading={loading} className="w-full" icon={Download}>
              Compile & Export
            </Button>
          </form>
        </Card>

        {/* Reports logs history */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Download Archives</h3>
          <Card className="p-4">
            <div className="space-y-4">
              {mockReports.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg text-xs group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-obsidian-900 rounded-lg text-gray-400 shrink-0">
                      <FileSpreadsheet className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate max-w-[240px]">{item.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.date} • {item.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">{item.type}</Badge>
                    <button
                      onClick={() => toast.success(`Mock: Download initialized for archive ${item.id}`)}
                      className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/[0.05] cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
