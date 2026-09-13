import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { roadmapService } from '../../services/mock/roadmapService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnimatedProgress from '../../components/ui/AnimatedProgress';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/ui/ScrollReveal';
import {
  Compass, CheckCircle2, Circle, Clock, Sparkles,
  ArrowRight, Award, AlertTriangle, BookOpen, ExternalLink,
  ChevronRight, Layers, Flame, RefreshCw
} from 'lucide-react';

export default function Roadmap() {
  const navigate = useNavigate();
  const { roadmap, toggleRoadmapSkill, careerReadiness, streak } = useStudentStore();
  const [selectedRole, setSelectedRole] = useState(roadmap?.roleId || 'frontend');
  const [activePhaseFilter, setActivePhaseFilter] = useState('all');

  const availableRoles = [
    { id: 'frontend', name: 'Frontend Engineer', active: true },
    { id: 'backend', name: 'Backend Engineer', active: false },
    { id: 'fullstack', name: 'Fullstack Engineer', active: false },
    { id: 'devops', name: 'DevOps & Cloud Engineer', active: false }
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    // In future or mock, could switch active roadmap
  };

  const phases = roadmap?.phases || [];
  const allSkills = phases.flatMap(p => p.skills);
  const completedCount = allSkills.filter(s => s.completed).length;
  const completionPercentage = roadmap?.completionPercentage || Math.round((completedCount / (allSkills.length || 1)) * 100);

  const filteredPhases = activePhaseFilter === 'all'
    ? phases
    : phases.filter(p => p.id === activePhaseFilter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <ScrollReveal variant="fade" duration={0.6}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-blue/10 blur-[90px] pointer-events-none" />
          
          <div className="space-y-3 z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/15 text-brand-blue border border-brand-blue/30 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" /> Career Pathway
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" /> 🔥 {streak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
              Personalized Career Roadmap
            </h1>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Step-by-step milestone pathway for <span className="text-white font-semibold">{roadmap?.roleName || 'Frontend Engineer'}</span>. Every skill you complete dynamically updates your <span className="text-brand-blue font-semibold">Career Readiness Score ({careerReadiness}/100)</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 z-10">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-4">
              <AnimatedProgress value={completionPercentage} type="circle" size={68} strokeWidth={6} />
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Track Progress</p>
                <p className="text-lg font-bold text-white">{completedCount} of {allSkills.length} Skills</p>
                <p className="text-[11px] text-emerald-400 font-medium">Job Ready Target: 85%</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Role Switcher & Phase Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <span className="text-xs font-medium text-gray-400 mr-2 shrink-0 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> Target Role:
          </span>
          {availableRoles.map(r => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedRole === r.id
                  ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30 font-semibold'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActivePhaseFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activePhaseFilter === 'all'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All 5 Phases
          </button>
          {phases.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePhaseFilter(p.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activePhaseFilter === p.id
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Phase {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Phases Timeline */}
      <div className="space-y-6">
        {filteredPhases.map((phase, pIdx) => {
          const phaseCompleted = phase.skills.every(s => s.completed);
          const phaseCompletedCount = phase.skills.filter(s => s.completed).length;

          return (
            <ScrollReveal key={phase.id} variant="fade" delay={pIdx * 0.05}>
              <Card className="overflow-hidden border border-white/[0.08] bg-obsidian-900/90 backdrop-blur-xl">
                {/* Phase Header */}
                <div className="p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      phaseCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40'
                    }`}>
                      {pIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {phase.title}
                        {phaseCompleted && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {phaseCompletedCount} of {phase.skills.length} skills verified
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-44">
                    <AnimatedProgress
                      value={Math.round((phaseCompletedCount / (phase.skills.length || 1)) * 100)}
                      type="bar"
                    />
                  </div>
                </div>

                {/* Phase Skills Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {phase.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        skill.completed
                          ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40'
                          : skill.isGap
                          ? 'bg-amber-500/[0.05] border-amber-500/30 hover:border-amber-500/50'
                          : 'bg-white/[0.02] border-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => toggleRoadmapSkill(phase.id, skill.id)}
                            className="flex items-center gap-2.5 text-left group cursor-pointer"
                          >
                            <div className="mt-0.5">
                              {skill.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-500 group-hover:text-brand-blue transition-colors" />
                              )}
                            </div>
                            <span className={`text-xs font-semibold transition-colors ${
                              skill.completed ? 'text-gray-300 line-through' : 'text-white group-hover:text-brand-blue'
                            }`}>
                              {skill.name}
                            </span>
                          </button>
                        </div>

                        {/* Gap and Source Badges */}
                        {skill.isGap && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" /> {skill.priority || 'High'} Priority Gap
                            </span>
                            {skill.source && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-400">
                                {skill.source}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Interactive Action Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] mt-1">
                        <span className="text-[10px] text-gray-500 font-medium">
                          {skill.completed ? '✓ Mastered' : skill.isGap ? 'Immediate focus' : 'In curriculum'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {skill.name.toLowerCase().includes('react') || skill.name.toLowerCase().includes('javascript') || skill.name.toLowerCase().includes('sql') ? (
                            <button
                              onClick={() => navigate('/student/assessments')}
                              className="text-[10px] font-semibold text-brand-blue hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                            >
                              Verify <ExternalLink className="h-2.5 w-2.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleRoadmapSkill(phase.id, skill.id)}
                              className="text-[10px] font-medium text-gray-400 hover:text-white cursor-pointer"
                            >
                              {skill.completed ? 'Mark unread' : 'Mark done'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Cross-feature CTA card */}
      <ScrollReveal variant="fade" delay={0.2}>
        <div className="p-6 rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 via-obsidian-900 to-brand-violet/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-blue" />
              Accelerate with Skill Assessments & AI Mock Practice
            </h3>
            <p className="text-xs text-gray-400">
              Pass quick 12-minute technical quizzes to earn verified badges that recruiters see on your candidate profile.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/interview')}>
              Mock Interview
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/student/assessments')} icon={Award}>
              Take Skill Assessment
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
