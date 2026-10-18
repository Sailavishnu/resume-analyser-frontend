import React from 'react';
import Card from '../../components/ui/Card';
import { BookOpen } from 'lucide-react';

export default function Resources() {
  return <div className="max-w-4xl space-y-5"><header><h1 className="text-xl font-bold text-white">Learning resources</h1><p className="text-sm text-gray-400">Resources connected to your workspace.</p></header><Card className="p-10 text-center"><BookOpen className="h-9 w-9 mx-auto text-violet-400 mb-3"/><h2 className="text-base font-semibold text-white">No resource catalog connected</h2><p className="text-sm text-gray-400 max-w-lg mx-auto mt-2">The previous resource cards were sample content and did not open real modules. No catalog is currently configured.</p></Card></div>;
}
