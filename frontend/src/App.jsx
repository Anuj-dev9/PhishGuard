import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import EmailProtectionPage from "./pages/EmailProtectionPage";
import SmsProtectionPage from "./pages/SmsProtectionPage";
import ThreatIntelligencePage from "./pages/ThreatIntelligencePage";
import ThreatDetailsPage from "./pages/ThreatDetailsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyzePage from "./pages/AnalyzePage";
import Layout from "./components/Layout";

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/signin" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const s = localStorage.getItem("phishguardSession");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const handleAuth = (nextSession) => {
    localStorage.setItem("phishguardSession", JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("phishguardSession");
    setSession(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={session ? <Navigate to="/dashboard" /> : <SignInPage onAuth={handleAuth} />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <SignUpPage onAuth={handleAuth} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Legacy auth route */}
        <Route path="/auth" element={<Navigate to="/signin" replace />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/email-protection" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <EmailProtectionPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/sms-protection" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <SmsProtectionPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/threat-intelligence" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <ThreatIntelligencePage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/analyze" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <AnalyzePage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/threat/:id" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <ThreatDetailsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute session={session}>
            <Layout user={session?.user} onLogout={handleLogout}>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
