import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Layout from '../components/shared/Layout';

// Auth
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// Student Portal Pages
import StudentDashboard from '../pages/student/Dashboard';
import ResumeGuide from '../pages/student/ResumeGuide';
import ResumeBuilder from '../pages/student/Builder';
import ResumeAnalysis from '../pages/student/Analysis';
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

// Shared
import Messages from '../pages/shared/Messages';

// Admin Portal Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminContentAudit from '../pages/admin/ContentAudit';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminSettings from '../pages/admin/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* Student Portal Protected Routes */}
      <Route path="/student" element={<Layout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="guide" element={<ResumeGuide />} />
        <Route path="builder" element={<ResumeBuilder />} />
        <Route path="analysis" element={<ResumeAnalysis />} />
        <Route path="messages" element={<Messages />} />
        <Route path="interview" element={<AiMockInterview />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />

        {/* Legacy deep links redirected seamlessly to unified analysis engine */}
        <Route path="upload" element={<Navigate to="/student/analysis?tab=overview" replace />} />
        <Route path="ats" element={<Navigate to="/student/analysis?tab=ats" replace />} />
        <Route path="jdmatch" element={<Navigate to="/student/analysis?tab=jdmatch" replace />} />
        <Route path="enhancement" element={<Navigate to="/student/analysis?tab=enhancement" replace />} />
      </Route>

      {/* HR Portal Protected Routes */}
      <Route path="/hr" element={<Layout />}>
        <Route index element={<HrDashboard />} />
        <Route path="jobs" element={<HrJobs />} />
        <Route path="candidates" element={<HrCandidates />} />
        <Route path="screening" element={<HrScreening />} />
        <Route path="interviews" element={<HrInterviews />} />
        <Route path="messages" element={<Messages />} />
        <Route path="analytics" element={<HrAnalytics />} />
        <Route path="reports" element={<HrReports />} />
        <Route path="company" element={<HrCompany />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="settings" element={<HrSettings />} />
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContentAudit />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
