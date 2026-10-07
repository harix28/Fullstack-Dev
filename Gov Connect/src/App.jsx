import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SavedProvider } from '@/context/SavedContext';
import { ToastProvider } from '@/components/ui/Toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
// Public pages
import LandingPage from '@/pages/public/LandingPage';
import ServicesPage from '@/pages/public/ServicesPage';
// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
// Dashboard pages
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import SchemesPage from '@/pages/dashboard/SchemesPage';
import SchemeDetailPage from '@/pages/dashboard/SchemeDetailPage';
import JobsPage from '@/pages/dashboard/JobsPage';
import JobDetailPage from '@/pages/dashboard/JobDetailPage';
import DocumentsPage from '@/pages/dashboard/DocumentsPage';
import GrievancesPage from '@/pages/dashboard/GrievancesPage';
import NewGrievancePage from '@/pages/dashboard/NewGrievancePage';
import GrievanceDetailPage from '@/pages/dashboard/GrievanceDetailPage';
import AssistantPage from '@/pages/dashboard/AssistantPage';
import SavedItemsPage from '@/pages/dashboard/SavedItemsPage';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
// Loading fallback
const PageLoader = () => (<div className="min-h-screen flex items-center justify-center bg-[#F5EBE0]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#59463B] border-t-transparent rounded-full animate-spin"/>
      <p className="text-[#7D6E63] text-sm font-medium">Loading GovConnect...</p>
    </div>
  </div>);
// Protected route wrapper
function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return <PageLoader />;
    if (!isAuthenticated)
        return <Navigate to="/login" replace/>;
    return <Outlet />;
}
// Public-only route wrapper (redirects authenticated users to dashboard)
function PublicOnlyRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return <PageLoader />;
    if (isAuthenticated)
        return <Navigate to="/dashboard" replace/>;
    return <>{children}</>;
}
function AppRoutes() {
    return (<Routes>
      {/* ── Public Single Landing Page (Consolidated intro, motive, services, about) ── */}
      <Route path="/" element={<LandingPage />}/>
      <Route path="/about" element={<Navigate to="/" replace/>}/>
      <Route path="/how-it-works" element={<Navigate to="/" replace/>}/>
      <Route path="/contact" element={<Navigate to="/" replace/>}/>

      {/* ── Auth Routes ── */}
      <Route path="/login" element={<PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>}/>
      <Route path="/register" element={<PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>

      {/* ── Protected Dashboard Routes (all user journeys accessible via /dashboard/* or short aliases) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />}/>
          <Route path="/dashboard/overview" element={<DashboardOverview />}/>
          <Route path="/dashboard/profile" element={<ProfilePage />}/>
          <Route path="/profile" element={<ProfilePage />}/>

          {/* Schemes */}
          <Route path="/dashboard/schemes" element={<SchemesPage />}/>
          <Route path="/dashboard/schemes/recommended" element={<SchemesPage />}/>
          <Route path="/dashboard/schemes/explore" element={<SchemesPage />}/>
          <Route path="/dashboard/schemes/:id" element={<SchemeDetailPage />}/>
          <Route path="/schemes" element={<SchemesPage />}/>
          <Route path="/schemes/:id" element={<SchemeDetailPage />}/>

          {/* Jobs */}
          <Route path="/dashboard/jobs" element={<JobsPage />}/>
          <Route path="/dashboard/jobs/recommended" element={<JobsPage />}/>
          <Route path="/dashboard/jobs/:id" element={<JobDetailPage />}/>
          <Route path="/jobs" element={<JobsPage />}/>
          <Route path="/jobs/:id" element={<JobDetailPage />}/>

          {/* Documents Vault */}
          <Route path="/dashboard/documents" element={<DocumentsPage />}/>
          <Route path="/documents" element={<DocumentsPage />}/>

          {/* Grievance Module */}
          <Route path="/dashboard/grievances" element={<GrievancesPage />}/>
          <Route path="/dashboard/grievances/new" element={<NewGrievancePage />}/>
          <Route path="/dashboard/grievances/:id" element={<GrievanceDetailPage />}/>
          <Route path="/grievances" element={<GrievancesPage />}/>
          <Route path="/grievances/new" element={<NewGrievancePage />}/>
          <Route path="/grievances/:id" element={<GrievanceDetailPage />}/>

          {/* Ask Sarkar AI Assistant */}
          <Route path="/dashboard/assistant" element={<AssistantPage />}/>
          <Route path="/ask-sarkar" element={<AssistantPage />}/>

          {/* Saved Items */}
          <Route path="/dashboard/saved" element={<SavedItemsPage />}/>
          <Route path="/saved" element={<SavedItemsPage />}/>

          {/* Notifications */}
          <Route path="/dashboard/notifications" element={<NotificationsPage />}/>
          <Route path="/notifications" element={<NotificationsPage />}/>

          {/* Settings */}
          <Route path="/dashboard/settings" element={<SettingsPage />}/>
          <Route path="/settings" element={<SettingsPage />}/>

          {/* Local Services */}
          <Route path="/dashboard/services" element={<ServicesPage />}/>
          <Route path="/services" element={<ServicesPage />}/>
        </Route>
      </Route>

      {/* ── 404 Fallback ── */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-[#F5EBE0] p-4">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-[#E3D5CA] text-[#59463B] rounded-2xl flex items-center justify-center mx-auto mb-4 font-extrabold text-2xl">
                404
              </div>
              <h1 className="text-3xl font-bold text-[#2D231E] mb-2">Page Not Found</h1>
              <p className="text-[#7D6E63] text-sm mb-6">
                The page or citizen service you are looking for does not exist or has moved.
              </p>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard" className="px-5 py-2.5 bg-[#59463B] text-white rounded-lg text-sm font-semibold hover:bg-[#2D231E] transition-colors">
                  Go to Dashboard
                </a>
                <a href="/" className="px-5 py-2.5 border border-[#D6CCC2] rounded-lg text-sm font-semibold text-[#43342B] hover:bg-[#FAF7F2]">
                  Home
                </a>
              </div>
            </div>
          </div>}/>
    </Routes>);
}
export default function App() {
    return (<BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <SavedProvider>
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
              </SavedProvider>
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>);
}
