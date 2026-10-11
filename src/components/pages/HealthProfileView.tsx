import React, { useState } from 'react';
import {
  Heart,
  User,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Pill,
  FlaskConical,
  Plus,
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const HealthProfileView: React.FC = () => {
  const {
    familyMembers,
    activeMember,
    activeFamilyRecords,
    activeFamilyReminders,
    allBiomarkers,
    updateAbhaId,
    userProfile
  } = useHealth();

  const activeFamily = familyMembers.find(f => f.relation === activeMember);
  const [isEditingAbha, setIsEditingAbha] = useState(false);
  const [abhaInput, setAbhaInput] = useState(activeFamily?.abhaId || '91-8472-9102-4821');

  const handleSaveAbha = async () => {
    if (abhaInput.trim()) {
      await updateAbhaId(abhaInput.trim());
      setIsEditingAbha(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Unified Health Profile
        </h2>
        <p className="text-xs text-purple-600/70">
          Comprehensive, private clinical record for {activeMember} ({activeFamily?.name || 'Deepmala Kashyap'})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Personal info & ABHA ID Card */}
        <div className="space-y-6">
          {/* Personal Card */}
          <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm shadow-purple-500/5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-purple-50">
              Personal Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-600/80">Full Name</span>
                <span className="font-bold text-slate-900">{activeFamily?.name || 'Deepmala Kashyap'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600/80">Relationship</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  {activeMember}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600/80">Blood Group</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {activeFamily?.bloodGroup || 'B+'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600/80">Date of Birth</span>
                <span className="font-semibold text-slate-900">{activeFamily?.dob || '1989-11-12'}</span>
              </div>
            </div>
          </div>

          {/* ABHA / ABDM Readiness Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                ABDM / ABHA ID
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>

            <p className="text-[11px] text-purple-200 mb-1">Ayushman Bharat Health Account</p>
            <div className="text-lg font-mono font-black tracking-wider mb-3">
              {activeFamily?.abhaId || '91-8472-9102-4821'}
            </div>

            {isEditingAbha ? (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white text-slate-900 outline-none font-mono"
                  placeholder="e.g. 91-8472-9102-4821"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAbha}
                    className="flex-1 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingAbha(false)}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingAbha(true)}
                className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition text-center"
              >
                Link / Edit ABHA ID
              </button>
            )}
          </div>

          {/* Known Allergies & Chronic Conditions */}
          <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm shadow-purple-500/5 text-xs space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                Allergies & Drug Sensitivities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeFamily?.allergies && activeFamily.allergies.length > 0 ? (
                  activeFamily.allergies.map((alg, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                      ⚠️ {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">No known drug allergies reported.</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-purple-50">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                Diagnoses & Chronic Conditions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeFamily?.conditions && activeFamily.conditions.length > 0 ? (
                  activeFamily.conditions.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 font-semibold">
                      • {c}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">No active chronic conditions.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest Lab Values & Active Medicines */}
        <div className="md:col-span-2 space-y-6">
          {/* Latest Lab Values Table */}
          <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Latest Lab Values & Biochemical Markers
                  </h3>
                  <p className="text-xs text-purple-600/70">
                    Aggregated from all verified pathology reports
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-purple-100 text-xs">
              <table className="w-full text-left">
                <thead className="bg-purple-50 text-purple-900 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Latest Result</th>
                    <th className="py-2.5 px-3">Biological Reference</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {allBiomarkers.map((b, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{b.testName}</td>
                      <td className={`py-2.5 px-3 font-mono font-bold ${b.status === 'high' ? 'text-rose-600' : 'text-slate-900'}`}>
                        {b.value}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{b.referenceRange}</td>
                      <td className="py-2.5 px-3 text-slate-500">{b.unit}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : b.status === 'low'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Medicines */}
          <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-purple-600" />
              <span>Current Prescriptions & Regimens</span>
            </h3>

            <div className="space-y-2 text-xs">
              {activeFamilyReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{rem.medicineName}</span>
                    <span className="text-purple-600 ml-2 font-medium">({rem.dosage})</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rem.frequency} at {rem.time}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
