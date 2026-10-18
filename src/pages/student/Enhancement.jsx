import React, { useEffect } from 'react';
import { useStudentStore } from '../../store/studentStore';
import ResumeEnhancementPanel from '../../components/shared/ResumeEnhancementPanel';

export default function Enhancement() {
  const { resumes, fetchResumes, getSelectedResume } = useStudentStore();
  useEffect(() => { fetchResumes(); }, [fetchResumes]);
  const resume = getSelectedResume() || resumes[0] || null;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ResumeEnhancementPanel resume={resume} />
    </div>
  );
}
