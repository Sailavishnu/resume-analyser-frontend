import React, { useState } from 'react';
import { useStudentStore } from '../../store/studentStore';
import { Sparkles, ArrowRight, ArrowLeftRight, Check, History, RotateCcw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function Enhancement() {
  const { getSelectedResume, updateBulletPoint } = useStudentStore();
  const [applyingId, setApplyingId] = useState(null);
  const [history, setHistory] = useState([]);

  const resume = getSelectedResume();

  if (!resume) {
    return (
      <div className="text-center p-8 bg-obsidian-900 border border-white/[0.06] rounded-xl text-gray-400">
        No resume select. Upload a resume first.
      </div>
    );
  }

  const handleApplyImprovement = async (bullet) => {
    setApplyingId(bullet.id);
    toast.loading('Applying AI recommendation...', { id: 'enhance' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save history
    setHistory(prev => [{
      id: bullet.id,
      section: bullet.section,
      oldText: bullet.original,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);

    updateBulletPoint(bullet.id, bullet.improved);
    setApplyingId(null);
    toast.success('CV bullet successfully optimized! Score increased.', { id: 'enhance' });
  };

  const bullets = resume.analysis.bulletsBreakdown;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">AI Resume Enhancement</h1>
          <p className="text-xs text-gray-400">Compare proposed changes and apply metrics-driven revisions instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2/3: Before/After Comparison cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Optimizations Feed</h3>
          
          {bullets.map(bullet => {
            const isAlreadyOptimized = bullet.original === bullet.improved;
            return (
              <Card key={bullet.id} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-brand-blue uppercase bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
                    {bullet.section}
                  </span>
                  {isAlreadyOptimized && (
                    <Badge variant="success" className="py-0.5"><Check className="h-3 w-3 mr-1" /> Optimized</Badge>
                  )}
                </div>

                {/* Compare Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Bullet */}
                  <div className="p-3 bg-obsidian-950/40 border border-white/[0.04] rounded-lg">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Current Text</p>
                    <p className="text-xs text-gray-300 leading-relaxed italic">"{bullet.original}"</p>
                  </div>

                  {/* Improved Bullet */}
                  <div className="p-3 bg-brand-indigo/5 border border-brand-indigo/15 rounded-lg">
                    <p className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Proposed Text
                    </p>
                    <p className="text-xs text-white leading-relaxed font-medium">"{bullet.improved}"</p>
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.04]">
                  <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                    <strong>Why it works:</strong> {bullet.impact}
                  </p>
                  <Button
                    variant={isAlreadyOptimized ? 'ghost' : 'primary'}
                    size="sm"
                    disabled={isAlreadyOptimized}
                    loading={applyingId === bullet.id}
                    onClick={() => handleApplyImprovement(bullet)}
                    className="shrink-0"
                  >
                    {isAlreadyOptimized ? 'Applied' : 'Apply Rewrite'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right 1/3: History and active status */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-brand-blue" />
              <span>Version History</span>
            </h3>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((h, index) => (
                  <div key={index} className="text-xs border-b border-white/[0.04] pb-3 last:border-none">
                    <div className="flex justify-between items-center text-gray-500 font-semibold mb-1 text-[10px]">
                      <span>{h.section}</span>
                      <span>{h.timestamp}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed truncate">Old: "{h.oldText}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-6 border border-dashed border-white/[0.06] rounded-lg">
                No active modifications in this session. Re-writes applied will populate this trace history.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
