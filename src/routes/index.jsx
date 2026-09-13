import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts
import Layout from '../components/shared/Layout';

// Auth
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import AdminLogin from '../pages/auth/AdminLogin';

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

// ── Route guard: requires login, redirects to login if no user ──
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // If trying to access admin, redirect to admin login
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Role mismatch — redirect to correct portal
  if (requiredRole && user.role !== requiredRole) {
    const roleHome = user.role === 'admin' ? '/admin' : user.role === 'hr' ? '/hr' : '/student';
    return <Navigate to={roleHome} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ═══ Auth Routes ═══ */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ═══ Student Portal — Protected ═══ */}
      <Route path="/student" element={
        <ProtectedRoute requiredRole="student">
          <Layout />
        </ProtectedRoute>
      }>
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

        {/* Legacy deep links → unified analysis engine */}
        <Route path="upload" element={<Navigate to="/student/analysis?tab=overview" replace />} />
        <Route path="ats" element={<Navigate to="/student/analysis?tab=ats" replace />} />
        <Route path="jdmatch" element={<Navigate to="/student/analysis?tab=jdmatch" replace />} />
        <Route path="enhancement" element={<Navigate to="/student/analysis?tab=enhancement" replace />} />
      </Route>

      {/* ═══ HR Portal — Protected ═══ */}
      <Route path="/hr" element={
        <ProtectedRoute requiredRole="hr">
          <Layout />
        </ProtectedRoute>
      }>
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

      {/* ═══ Admin Portal — Protected (separate login) ═══ */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContentAudit />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* ═══ Default Redirects ═══ */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
