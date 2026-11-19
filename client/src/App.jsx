import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PublicJobsPage } from './pages/jobs/PublicJobsPage';
import { Login } from './pages/auth/Login';
import { VerifyOtp } from './pages/auth/VerifyOtp';
import { EmailTemplatesPreview } from './pages/EmailTemplatesPreview';
import { CandidateRegister } from './pages/auth/CandidateRegister';
import { RecruiterRegister } from './pages/auth/RecruiterRegister';
import { CandidateProfile } from './pages/candidate/CandidateProfile';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfile } from './pages/recruiter/CompanyProfile';
import { Pricing } from './pages/recruiter/Pricing';
import { Billing } from './pages/recruiter/Billing';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<PublicJobsPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/recruiter/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/email-templates" element={<EmailTemplatesPreview />} />
        <Route path="/register/candidate" element={<CandidateRegister />} />
        <Route path="/register/recruiter" element={<RecruiterRegister />} />

        {/* Candidate Protected Routes */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Protected Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/company"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/billing"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <Billing />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
