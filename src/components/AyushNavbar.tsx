import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Printer,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { Language } from '../types';

interface AyushNavbarProps {
  onOpenUpload: () => void;
  onOpenDoctorPrep: () => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export const AyushNavbar: React.FC<AyushNavbarProps> = ({
  onOpenUpload,
  onOpenDoctorPrep,
  onOpenAuth,
  onToggleSidebar
}) => {
  const { user, signOut } = useAuth();
  const {
    familyMembers,
    activeMember,
    setActiveMember,
    language,
    setLanguage,
    syncStatus,
    userProfile
  } = useHealth();

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-purple-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-purple-700 hover:bg-purple-50 rounded-xl transition"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
            <span className="font-black text-lg tracking-tighter">A+</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-slate-900 tracking-tight leading-none text-base">
              <span>AYUSH+</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">
                Health Copilot
              </span>
            </div>
            <p className="text-[11px] text-purple-500/80 font-medium">Your Health, in One Place</p>
          </div>
        </div>

        {/* Sync Pill */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 border border-purple-200 text-purple-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Private & Encrypted</span>
        </div>
      </div>

      {/* Right Toolbar: Active Profile, Language, Doctor Prep, Auth */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Family Member Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowMemberDropdown(!showMemberDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 transition"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate max-w-[100px]">{activeMember}</span>
            <ChevronDown className="w-3 h-3 text-purple-400" />
          </button>

          {showMemberDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-purple-100 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Switch Health Profile
              </div>
              {familyMembers.map((fm) => (
                <button
                  key={fm.id}
                  onClick={() => {
                    setActiveMember(fm.relation);
                    setShowMemberDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition ${
                    activeMember === fm.relation
                      ? 'bg-purple-50 font-bold text-purple-900'
                      : 'text-slate-700 hover:bg-purple-50/50'
                  }`}
                >
                  <span>{fm.name} ({fm.relation})</span>
                  {activeMember === fm.relation && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition"
        >
          <span>＋ Upload Report</span>
        </button>

        {/* User Account Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-purple-400 transition"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {(user.displayName || user.email || 'D').charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-purple-50">
                  <p className="font-bold text-slate-900 truncate">
                    {user.displayName || 'Deepmala Kashyap'}
                  </p>
                  <p className="text-purple-400 truncate text-[11px]">{user.email}</p>
                  <p className="text-[10px] text-purple-600 font-semibold mt-0.5">
                    ABHA: {userProfile?.abhaId || '91-8472-9102-4821'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenDoctorPrep();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2 text-purple-900 font-medium"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-600" />
                  <span>Doctor Visit Prep</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    signOut();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
