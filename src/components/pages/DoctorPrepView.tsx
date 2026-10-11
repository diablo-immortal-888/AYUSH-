import React, { useState } from 'react';
import {
  ClipboardList,
  Printer,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  User,
  Calendar,
  Share2
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { speechService } from '../../lib/speech';

export const DoctorPrepView: React.FC = () => {
  const {
    activeFamilyRecords,
    activeFamilyReminders,
    abnormalAlerts,
    doctorQuestions,
    activeMember,
    familyMembers,
    language
  } = useHealth();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeFamily = familyMembers.find(f => f.relation === activeMember);

  const handlePrint = () => {
    window.print();
  };

  const handleSpeakQuestions = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const script = `Doctor Visit Preparation questions for ${activeMember}: ${doctorQuestions.join('. ')}`;
      speechService.speak(script, language, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none print:max-w-none print:p-0">
      {/* Top Header (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Doctor Visit Preparation Mode
          </h2>
          <p className="text-xs text-purple-600/70">
            High-yield clinical brief and targeted questions generated from your abnormal reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakQuestions}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 shadow-xs transition"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-purple-600" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen to Questions'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Doctor Brief (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Sheet */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0 space-y-6">
        {/* Printable Letterhead Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-purple-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-purple-900">AYUSH+</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                CLINICAL BRIEF
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Patient: {activeFamily?.name || 'Deepmala Kashyap'} ({activeMember})
            </h3>
            <p className="text-xs text-slate-500">
              DOB: {activeFamily?.dob || '1989-11-12'} • Blood: {activeFamily?.bloodGroup || 'B+'} • ABHA: {activeFamily?.abhaId || '91-8472-9102-4821'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <p>Brief Date: {new Date().toLocaleDateString()}</p>
            <p>Reports Evaluated: {activeFamilyRecords.length}</p>
          </div>
        </div>

        {/* 1. Flagged Lab Findings */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>1. Recent Flagged Abnormal Parameters</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {abnormalAlerts.map((a, i) => (
              <div key={i} className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                  <span>{a.testName}</span>
                  <span className="text-rose-600 font-mono">{a.value} {a.unit}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {a.advice}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Questions to Ask Doctor */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>2. High-Yield Questions to Ask Your Doctor</span>
          </h4>
          <div className="space-y-2 text-xs">
            {doctorQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-purple-50/60 border border-purple-150 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-900 font-semibold leading-relaxed">
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Current Medications */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            3. Active Scheduled Medications
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {activeFamilyReminders.map((rem) => (
              <span
                key={rem.id}
                className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-semibold"
              >
                {rem.medicineName} ({rem.dosage}) - {rem.frequency}
              </span>
            ))}
          </div>
        </div>

        {/* Doctor Signature Section for Print */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-400">
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
            <span>Physician Signature & Date</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
            <span>Clinical Notes / Recommended Follow-up</span>
          </div>
        </div>
      </div>
    </div>
  );
};
