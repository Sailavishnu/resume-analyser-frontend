import React from 'react';
import { useStudentStore } from '../../store/studentStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Compass } from 'lucide-react';

export default function Roadmap() {
  const roadmap = useStudentStore(state => state.roadmap);
  const targetRole = useStudentStore(state => state.targetRole);
  const phases = roadmap?.phases || [];
  return <div className="space-y-5"><header><h1 className="text-xl font-bold text-white">Career roadmap</h1><p className="text-sm text-gray-400">Your saved learning plan{targetRole ? ` for ${targetRole}` : ''}.</p></header>{phases.length ? phases.map(phase=><Card key={phase.id} className="p-5"><h2 className="font-semibold text-white">{phase.name}</h2><p className="text-sm text-gray-400">{phase.skills?.length || 0} skills in this phase</p></Card>) : <Card className="p-10 text-center"><Compass className="h-9 w-9 mx-auto text-sky-400 mb-3"/><h2 className="text-base font-semibold text-white">No roadmap is saved yet</h2><p className="text-sm text-gray-400 max-w-lg mx-auto mt-2">Roadmap recommendations are not connected to a configured career planning service yet. Set a target role in your profile and use job description matching to review concrete skill gaps.</p></Card>}</div>;
}
