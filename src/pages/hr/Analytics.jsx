import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LineChart, Users, Star, BarChart3, PieChart as PieIcon } from 'lucide-react';

export default function Analytics() {
  const scoreData = [
    { range: '60-70', count: 4 },
    { range: '70-80', count: 12 },
    { range: '80-90', count: 24 },
    { range: '90-100', count: 10 },
  ];

  const applicantTrends = [
    { name: 'May', applicants: 45, shortlists: 12 },
    { name: 'Jun', applicants: 85, shortlists: 22 },
    { name: 'Jul', applicants: 110, shortlists: 34 },
  ];

  const sourceData = [
    { name: 'Linkedin', value: 450, color: '#6366f1' },
    { name: 'Direct Referrals', value: 180, color: '#10b981' },
    { name: 'Campus Placement Portal', value: 310, color: '#0d9488' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Recruitment & Matching Analytics</h1>
          <p className="text-xs text-gray-400">Monitor candidate scores distribution, channels traffic, and campaign statistics.</p>
        </div>
      </div>

      {/* Numerical Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-teal/10 rounded-xl text-brand-teal border border-brand-teal/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Total Pool Scanned</p>
            <p className="text-2xl font-bold text-white mt-0.5">940 Resumes</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue border border-brand-blue/20">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Average Match Score</p>
            <p className="text-2xl font-bold text-white mt-0.5">82.5% Fit</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="p-3 bg-brand-violet/10 rounded-xl text-brand-violet border border-brand-violet/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Average screening Time</p>
            <p className="text-2xl font-bold text-white mt-0.5">1.2 Seconds</p>
          </div>
        </Card>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match distribution */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-brand-teal" />
            <span>Match score distribution (Candidate count)</span>
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis dataKey="range" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6' }} />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Source Channels */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <PieIcon className="h-4.5 w-4.5 text-brand-blue" />
            <span>Applicant Sourcing Channels</span>
          </h3>
          <div className="h-64 w-full flex items-center justify-between text-xs">
            <div className="h-full w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#6366f1" labelLine={false}>
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 space-y-2">
              {sourceData.map(item => (
                <div key={item.name} className="flex flex-col">
                  <span className="font-semibold text-white truncate">{item.name}</span>
                  <span className="text-[10px] text-gray-500 font-bold">{item.value} candidates</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Hiring pipeline trends */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-brand-violet" />
            <span>Hiring pipelines trends (Monthly)</span>
          </h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicantTrends}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f0f13', borderColor: '#2d2d3f', color: '#f3f4f6' }} />
                <Area type="monotone" dataKey="applicants" stroke="#8b5cf6" fillOpacity={0.15} fill="url(#colorApplicants)" />
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
