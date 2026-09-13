import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Always-loaded layout shell (small & critical)
import Layout from '../components/shared/Layout';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// ─── Lazy-loaded Pages ────────────────────────────────────────────────
// Auth
const SignIn     = lazy(() => import('../pages/auth/SignIn'));
const SignUp     = lazy(() => import('../pages/auth/SignUp'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));

// Student Portal
const StudentDashboard    = lazy(() => import('../pages/student/Dashboard'));
const ResumeGuide         = lazy(() => import('../pages/student/ResumeGuide'));
const ResumeBuilder       = lazy(() => import('../pages/student/Builder'));
const ResumeVault         = lazy(() => import('../pages/student/Vault'));
const ResumeAnalysis      = lazy(() => import('../pages/student/Analysis'));
const StudentRoadmap      = lazy(() => import('../pages/student/Roadmap'));
const StudentAssessments  = lazy(() => import('../pages/student/Assessments'));
const AiMockInterview     = lazy(() => import('../pages/student/Interview'));
const StudentApplications = lazy(() => import('../pages/student/Applications'));
const StudentResources    = lazy(() => import('../pages/student/Resources'));
const StudentNotifications= lazy(() => import('../pages/student/Notifications'));
const StudentProfile      = lazy(() => import('../pages/student/Profile'));
const StudentSettings     = lazy(() => import('../pages/student/Settings'));

// HR Portal
const HrDashboard  = lazy(() => import('../pages/hr/Dashboard'));
const HrJobs       = lazy(() => import('../pages/hr/Jobs'));
const HrCandidates = lazy(() => import('../pages/hr/Candidates'));
const HrScreening  = lazy(() => import('../pages/hr/Screening'));
const HrInterviews = lazy(() => import('../pages/hr/Interviews'));
const HrAnalytics  = lazy(() => import('../pages/hr/Analytics'));
const HrReports    = lazy(() => import('../pages/hr/Reports'));
const HrCompany    = lazy(() => import('../pages/hr/Company'));
const HrSettings   = lazy(() => import('../pages/hr/Settings'));

// Shared
const Messages = lazy(() => import('../pages/shared/Messages'));

// Admin Portal
const AdminDashboard    = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers        = lazy(() => import('../pages/admin/Users'));
const AdminContentAudit = lazy(() => import('../pages/admin/ContentAudit'));
const AdminAnalytics    = lazy(() => import('../pages/admin/Analytics'));
const AdminSettings     = lazy(() => import('../pages/admin/Settings'));

// ── Route guard ──────────────────────────────────────────────────────
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuthStore();

  if (!user) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const roleHome = user.role === 'admin' ? '/admin' : user.role === 'hr' ? '/hr' : '/student';
    return <Navigate to={roleHome} replace />;
  }

  return children;
}

// ── App Routes ───────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
          <Route path="resumes" element={<ResumeVault />} />
          <Route path="analysis" element={<ResumeAnalysis />} />
          <Route path="roadmap" element={<StudentRoadmap />} />
          <Route path="assessments" element={<StudentAssessments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="interview" element={<AiMockInterview />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="resources" element={<StudentResources />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />

          {/* Legacy deep links */}
          <Route path="upload" element={<Navigate to="/student/resumes" replace />} />
          <Route path="compare" element={<Navigate to="/student/resumes?tab=compare" replace />} />
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
    </Suspense>
  );
}
