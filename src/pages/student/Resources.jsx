import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { BookOpen, Bookmark, BookmarkCheck, ExternalLink, GraduationCap, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Resources() {
  const [bookmarks, setBookmarks] = useState(['res-1']);

  const mockResources = [
    {
      id: 'res-1',
      category: 'technical',
      title: 'Cracking the Coding Interview - DSA Guide',
      desc: 'Understand tree traversals, graph computations, and custom dynamic programming configurations.',
      duration: '15 hrs',
      source: 'LeetCode Academy'
    },
    {
      id: 'res-2',
      category: 'resume',
      title: 'Action Verbs and Power Phrases Checklist',
      desc: 'Review 200+ active words to optimize experience lines and pass ATS parser benchmarks.',
      duration: '1 hr',
      source: 'Antigravity Careers'
    },
    {
      id: 'res-3',
      category: 'hr',
      title: 'Answering STAR Methodology Prompts',
      desc: 'Learn structured frameworks to summarize complex tasks and achievements clearly for HR screening panels.',
      duration: '4 hrs',
      source: 'Coursera Hub'
    },
    {
      id: 'res-4',
      category: 'aptitude',
      title: 'Logical Reasoning and Mathematical Foundations',
      desc: 'Practice logical algorithms, probability metrics, and critical thinking questions.',
      duration: '8 hrs',
      source: 'GeeksForGeeks'
    }
  ];

  const handleBookmarkToggle = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(b => b !== id));
      toast.success('Bookmark removed.');
    } else {
      setBookmarks(prev => [...prev, id]);
      toast.success('Bookmark saved to folder.');
    }
  };

  const handleOpenResource = (title) => {
    toast.success(`Mock: Opening external resource: "${title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold font-heading text-white">Learning & Career Resources</h1>
          <p className="text-xs text-gray-400">Upgrade your technical competency and soft skills with curated modules.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockResources.map(item => {
          const isBookmarked = bookmarks.includes(item.id);
          return (
            <Card key={item.id} className="p-5 flex flex-col justify-between h-48 relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
                    {item.category}
                  </span>
                  
                  <button
                    onClick={() => handleBookmarkToggle(item.id)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4.5 w-4.5 text-brand-emerald" />
                    ) : (
                      <Bookmark className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white font-heading truncate">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/[0.04] text-[10px] text-gray-500 font-semibold">
                <span>Source: {item.source} • {item.duration}</span>
                <Button variant="ghost" size="sm" onClick={() => handleOpenResource(item.title)} className="text-brand-blue text-[10px]" icon={ExternalLink}>
                  Open Module
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
