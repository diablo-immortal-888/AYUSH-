import React from 'react';
import {
  Home,
  Clock,
  Heart,
  LineChart,
  Sparkles,
  Pill,
  Users,
  ClipboardList,
  Settings,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export type AyushPage =
  | 'dashboard'
  | 'timeline'
  | 'profile'
  | 'trends'
  | 'chat'
  | 'medicines'
  | 'family'
  | 'doctor'
  | 'settings';

interface AyushSidebarProps {
  currentPage: AyushPage;
  onSelectPage: (page: AyushPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AyushSidebar: React.FC<AyushSidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onClose
}) => {
  const { abnormalAlerts, activeFamilyRecords, activeFamilyReminders } = useHealth();

  const navItems: { id: AyushPage; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'timeline', label: 'Health Timeline', icon: <Clock className="w-4 h-4" />, badge: activeFamilyRecords.length },
    { id: 'profile', label: 'Health Profile', icon: <Heart className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends & Insights', icon: <LineChart className="w-4 h-4" /> },
    { id: 'chat', label: 'Ask Health Agent', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
    { id: 'medicines', label: 'Medicines & Alerts', icon: <Pill className="w-4 h-4" />, badge: activeFamilyReminders.length || undefined },
    { id: 'family', label: 'Family Profiles', icon: <Users className="w-4 h-4" /> },
    { id: 'doctor', label: 'Doctor Visit Prep', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & ABHA', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleSelect = (page: AyushPage) => {
    onSelectPage(page);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-purple-950/20 backdrop-blur-xs z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#F7F3FC] border-r border-purple-100 z-40 transition-transform duration-200 ease-in-out overflow-y-auto flex flex-col justify-between p-3 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Workspace
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'text-purple-950/80 hover:bg-purple-100/70 hover:text-purple-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-purple-600'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Abnormal Indicators summary */}
          {abnormalAlerts.length > 0 && (
            <div
              onClick={() => handleSelect('dashboard')}
              className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl cursor-pointer hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{abnormalAlerts.length} Flagged Values</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-[11px] text-rose-600/80 leading-tight">
                Mild hepatic indicators (SGPT/SGOT, Bilirubin) flagged for attention.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Privacy Statement */}
        <div className="pt-4 border-t border-purple-200/60 space-y-2">
          <div className="p-3 bg-purple-100/50 rounded-2xl border border-purple-200/60 text-[11px] text-purple-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-0.5 text-purple-950">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Zero-Leak Privacy</span>
            </div>
            Your health records are encrypted and isolated strictly to your Google account. Public datasets are never mixed with your profile.
          </div>
        </div>
      </aside>
    </>
  );
};
