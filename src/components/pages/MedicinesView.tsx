import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { checkDrugInteractions, DrugInteraction } from '../../lib/drugInteractions';

export const MedicinesView: React.FC = () => {
  const {
    activeFamilyReminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    activeMember
  } = useHealth();

  // New Reminder State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState('Daily after breakfast');

  // Interaction Checker State
  const [checkInput, setCheckInput] = useState('Paracetamol, Alcohol');
  const [interactionResults, setInteractionResults] = useState<DrugInteraction[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    await addReminder({
      familyMember: activeMember,
      medicineName: medName.trim(),
      dosage: dosage.trim() || 'Standard dose',
      time,
      frequency,
      active: true
    });

    setMedName('');
    setDosage('');
  };

  const handleRunInteractionCheck = () => {
    const list = checkInput.split(',').map(s => s.trim()).filter(Boolean);
    const results = checkDrugInteractions(list);
    setInteractionResults(results);
    setHasChecked(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Medicines, Reminders & Interaction Checker
        </h2>
        <p className="text-xs text-purple-600/70">
          Keep scheduled medication track and verify drug-drug cross-interactions for {activeMember}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Reminders Card */}
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Medicine Schedule
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {activeFamilyReminders.filter(r => r.active).length} Active
            </span>
          </div>

          {/* Add Reminder Form */}
          <form onSubmit={handleAdd} className="space-y-3 p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 mb-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ursodeoxycholic Acid, Pantoprazole"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 300 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Frequency & Timing
              </label>
              <input
                type="text"
                placeholder="e.g. Daily after breakfast"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={!medName.trim()}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              ＋ Add Reminder
            </button>
          </form>

          {/* List of Reminders */}
          <div className="space-y-2">
            {activeFamilyReminders.length === 0 ? (
              <p className="text-center py-6 text-xs text-purple-400">
                No medicine reminders set for {activeMember}.
              </p>
            ) : (
              activeFamilyReminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                    rem.active
                      ? 'bg-white border-purple-150 shadow-xs'
                      : 'bg-purple-50/20 border-purple-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition shrink-0 ${
                        rem.active ? 'bg-purple-600 text-white' : 'border border-purple-300'
                      }`}
                    >
                      {rem.active && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {rem.medicineName} {rem.dosage && `(${rem.dosage})`}
                      </span>
                      <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {rem.time} • {rem.frequency}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-purple-400 hover:text-rose-600 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drug Interaction Checker Card */}
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-purple-100 mb-4">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Drug-Drug Interaction Checker
              </h3>
              <p className="text-xs text-purple-600/70">
                Instant clinical safety cross-check
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Enter Medicines or Substances (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Paracetamol, Alcohol, Aspirin, Ibuprofen"
                value={checkInput}
                onChange={(e) => setCheckInput(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleRunInteractionCheck}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              Analyze Safety Interactions
            </button>
          </div>

          {/* Results */}
          {hasChecked && (
            <div className="space-y-2.5">
              {interactionResults.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No major known adverse cross-interactions detected between these items.</span>
                </div>
              ) : (
                interactionResults.map((inter, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800">
                        ⚠️ {inter.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                        {inter.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {inter.description}
                    </p>
                    <div className="p-2 rounded-xl bg-white/80 border border-rose-100 text-[11px] text-rose-900 font-semibold">
                      💡 Guidance: {inter.advice}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-purple-50/40 rounded-xl text-[10px] text-purple-700/80 leading-relaxed">
            Note: This checker covers common clinically validated interactions. Always consult a licensed pharmacist or physician for complete pharmaceutical regimens.
          </div>
        </div>
      </div>
    </div>
  );
};
