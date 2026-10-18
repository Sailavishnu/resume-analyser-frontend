import React from 'react';
import Card from '../../components/ui/Card';
import { Award } from 'lucide-react';

export default function Assessments() {
  return <div className="space-y-5"><header><h1 className="text-xl font-bold text-white">Skill assessments</h1><p className="text-sm text-gray-400">Assessment history and results.</p></header><Card className="p-10 text-center"><Award className="h-9 w-9 mx-auto text-amber-400 mb-3"/><h2 className="text-base font-semibold text-white">No assessment records</h2><p className="text-sm text-gray-400 max-w-lg mx-auto mt-2">There is no assessment API connected to this account, so no quizzes or scores are shown here.</p></Card></div>;
}
