import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Layout from '../components/shared/Layout';

// Auth
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// Student Portal Pages
import StudentDashboard from '../pages/student/Dashboard';
import ResumeBuilder from '../pages/student/Builder';
import ResumeUpload from '../pages/student/Upload';
import AtsAnalysis from '../pages/student/Ats';
import ResumeEnhancement from '../pages/student/Enhancement';
import JdMatch from '../pages/student/JdMatch';
import AiMockInterview from '../pages/student/Interview';
import StudentApplications from '../pages/student/Applications';
import StudentResources from '../pages/student/Resources';
import StudentNotifications from '../pages/student/Notifications';
import StudentProfile from '../pages/student/Profile';
import StudentSettings from '../pages/student/Settings';

// HR Portal Pages
import HrDashboard from '../pages/hr/Dashboard';
import HrJobs from '../pages/hr/Jobs';
import HrCandidates from '../pages/hr/Candidates';
import HrScreening from '../pages/hr/Screening';
import HrInterviews from '../pages/hr/Interviews';
import HrAnalytics from '../pages/hr/Analytics';
import HrReports from '../pages/hr/Reports';
import HrCompany from '../pages/hr/Company';
import HrSettings from '../pages/hr/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* Student Portal Protected Routes */}
      <Route path="/student" element={<Layout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="builder" element={<ResumeBuilder />} />
        <Route path="upload" element={<ResumeUpload />} />
        <Route path="ats" element={<AtsAnalysis />} />
        <Route path="enhancement" element={<ResumeEnhancement />} />
        <Route path="jdmatch" element={<JdMatch />} />
        <Route path="interview" element={<AiMockInterview />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* HR Portal Protected Routes */}
      <Route path="/hr" element={<Layout />}>
        <Route index element={<HrDashboard />} />
        <Route path="jobs" element={<HrJobs />} />
        <Route path="candidates" element={<HrCandidates />} />
        <Route path="screening" element={<HrScreening />} />
        <Route path="interviews" element={<HrInterviews />} />
        <Route path="analytics" element={<HrAnalytics />} />
        <Route path="reports" element={<HrReports />} />
        <Route path="company" element={<HrCompany />} />
        <Route path="notifications" element={<StudentNotifications />} /> {/* Reused notification list */}
        <Route path="settings" element={<HrSettings />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
