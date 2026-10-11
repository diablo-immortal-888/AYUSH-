import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider, useHealth } from './context/HealthContext';
import { AyushNavbar } from './components/AyushNavbar';
import { AyushSidebar, AyushPage } from './components/AyushSidebar';
import { DashboardView } from './components/pages/DashboardView';
import { TimelineView } from './components/pages/TimelineView';
import { HealthProfileView } from './components/pages/HealthProfileView';
import { TrendsView } from './components/pages/TrendsView';
import { HealthAgentChat } from './components/pages/HealthAgentChat';
import { MedicinesView } from './components/pages/MedicinesView';
import { FamilyProfilesView } from './components/pages/FamilyProfilesView';
import { DoctorPrepView } from './components/pages/DoctorPrepView';
import { SettingsView } from './components/pages/SettingsView';
import { ReportUploadModal } from './components/ReportUploadModal';
import { AuthModal } from './components/AuthModal';
import { ShieldCheck, Heart, Sparkles, LogIn } from 'lucide-react';

const MainAyushApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AyushPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7FD] text-slate-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Top Navbar */}
      <AyushNavbar
        onOpenUpload={() => setUploadModalOpen(true)}
        onOpenDoctorPrep={() => setCurrentPage('doctor')}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Guest Notice Banner if not signed in */}
      {!user && !authLoading && (
        <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-3 shadow-sm print:hidden">
          <div className="flex items-center gap-2 max-w-2xl">
            <ShieldCheck className="w-4 h-4 text-purple-200 shrink-0" />
            <span>
              <strong>Private Account Mode:</strong> Sign in with Google or Email to securely synchronize your health records, ABHA IDs, and family profiles.
            </span>
          </div>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-3.5 py-1.5 bg-white text-purple-800 hover:bg-purple-50 rounded-xl font-bold shadow-xs transition"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <AyushSidebar
          currentPage={currentPage}
          onSelectPage={(p) => setCurrentPage(p)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0">
          {currentPage === 'dashboard' && (
            <DashboardView
              onOpenUpload={() => setUploadModalOpen(true)}
              onNavigate={(p) => setCurrentPage(p)}
            />
          )}

          {currentPage === 'timeline' && <TimelineView />}
          {currentPage === 'profile' && <HealthProfileView />}
          {currentPage === 'trends' && <TrendsView />}
          {currentPage === 'chat' && <HealthAgentChat />}
          {currentPage === 'medicines' && <MedicinesView />}
          {currentPage === 'family' && <FamilyProfilesView />}
          {currentPage === 'doctor' && <DoctorPrepView />}
          {currentPage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <ReportUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <MainAyushApp />
      </HealthProvider>
    </AuthProvider>
  );
}
