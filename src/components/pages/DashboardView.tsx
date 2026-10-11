import React, { useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Pill,
  ClipboardList,
  Heart,
  TrendingUp,
  FlaskConical,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { speechService } from '../../lib/speech';

interface DashboardViewProps {
  onOpenUpload: () => void;
  onNavigate: (page: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenUpload, onNavigate }) => {
  const {
    activeFamilyRecords,
    activeFamilyReminders,
    abnormalAlerts,
    activeMember,
    familyMembers,
    language
  } = useHealth();

  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const activeFamily = familyMembers.find(f => f.relation === activeMember);
  const latestRecord = activeFamilyRecords[0];

  const handleSpeak = (key: string, text: string) => {
    if (speakingKey === key) {
      speechService.stop();
      setSpeakingKey(null);
    } else {
      setSpeakingKey(key);
      speechService.speak(text, language, () => setSpeakingKey(null));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* Patient Profile Banner */}
      <div className="bg-gradient-to-r from-purple-100/80 via-violet-100/60 to-purple-50 rounded-3xl p-5 sm:p-6 border border-purple-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-purple-500/20">
            {activeFamily?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">
                {activeFamily?.name || 'Deepmala Kashyap'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-200 text-purple-900">
                {activeMember}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-purple-700/80 mt-1 font-medium">
              <span>Blood Group: <strong>{activeFamily?.bloodGroup || 'B+'}</strong></span>
              <span>•</span>
              <span>ABHA ID: <strong>{activeFamily?.abhaId || '91-8472-9102-4821'}</strong></span>
              <span>•</span>
              <span>Total Reports: <strong>{activeFamilyRecords.length}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('chat')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Ask Health Agent</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medical Report</span>
          </button>
        </div>
      </div>

      {/* Abnormal Value Alerts (High Attention) */}
      {abnormalAlerts.length > 0 && (
        <div className="bg-white rounded-3xl border border-rose-200/90 p-5 sm:p-6 shadow-sm shadow-rose-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Abnormal Parameter Alerts ({abnormalAlerts.length})
                </h3>
                <p className="text-xs text-rose-600 font-medium">
                  Automatically extracted and flagged from your recent lab reports
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const combinedAdvice = abnormalAlerts.map(a => `${a.testName} is ${a.value} ${a.unit}. ${a.advice}`).join(' ');
                handleSpeak('all_alerts', combinedAdvice);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
            >
              {speakingKey === 'all_alerts' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{speakingKey === 'all_alerts' ? 'Stop Voice' : 'Listen to Alerts'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {abnormalAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {alert.testName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                      {alert.status}
                    </span>
                  </div>
                  <div className="text-lg font-black text-rose-600 mb-2 font-mono">
                    {alert.value} <span className="text-xs font-semibold text-rose-500">{alert.unit}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    {alert.advice}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-200/40 text-[11px] text-rose-600/80 font-medium">
                  <span>Report Date: {alert.date}</span>
                  <button
                    onClick={() => handleSpeak(`alert_${idx}`, `${alert.testName} is ${alert.value} ${alert.unit}. ${alert.advice}`)}
                    className="flex items-center gap-1 font-bold text-rose-700 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-rose-50/30 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
            <span className="font-bold text-rose-600 uppercase">Disclaimer:</span>
            <span>AI alerts are informational aids and not medical diagnoses. Always consult a qualified clinician.</span>
          </div>
        </div>
      )}

      {/* Latest Report Details Card */}
      {latestRecord && (
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Latest Lab Report Analysis
                </h3>
                <p className="text-xs text-purple-500 font-medium">
                  {latestRecord.title} • {latestRecord.hospital}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeak('latest_summary', language === 'hi' && latestRecord.summaryHi ? latestRecord.summaryHi : latestRecord.summary)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 transition"
            >
              {speakingKey === 'latest_summary' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{speakingKey === 'latest_summary' ? 'Stop Voice' : 'Speak Summary'}</span>
            </button>
          </div>

          {/* AI Clinical Summary Box */}
          <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl mb-5 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Simple Language Health Summary ({language === 'hi' ? 'हिन्दी' : 'English'}):</span>
            </div>
            {language === 'hi' && latestRecord.summaryHi ? latestRecord.summaryHi : latestRecord.summary}
          </div>

          {/* Biomarkers Table */}
          {latestRecord.biomarkers && latestRecord.biomarkers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Biomarkers & Reference Ranges
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-purple-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50/80 text-purple-900 font-bold border-b border-purple-100">
                    <tr>
                      <th className="py-2.5 px-3">Test Parameter</th>
                      <th className="py-2.5 px-3">Result</th>
                      <th className="py-2.5 px-3">Biological Reference</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {latestRecord.biomarkers.map((b, i) => (
                      <tr key={i} className="hover:bg-purple-50/30 transition">
                        <td className="py-2 px-3 font-semibold text-slate-900">{b.testName}</td>
                        <td className={`py-2 px-3 font-mono font-bold ${b.status === 'high' ? 'text-rose-600' : 'text-slate-800'}`}>
                          {b.value}
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-mono">{b.referenceRange}</td>
                        <td className="py-2 px-3 text-slate-500">{b.unit}</td>
                        <td className="py-2 px-3 text-right">
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
          )}
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('trends')}
          className="p-5 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-0.5">Biomarker Trend Graphs</h4>
          <p className="text-xs text-purple-600/70">
            Track liver enzymes, blood glucose, and vitals over time.
          </p>
        </div>

        <div
          onClick={() => onNavigate('doctor')}
          className="p-5 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <ClipboardList className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-0.5">Doctor Visit Prep</h4>
          <p className="text-xs text-purple-600/70">
            Auto-generate high-yield questions to ask your doctor with print ready PDF.
          </p>
        </div>

        <div
          onClick={() => onNavigate('medicines')}
          className="p-5 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <Pill className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-0.5">Medicines & Interaction Checker</h4>
          <p className="text-xs text-purple-600/70">
            Check drug interaction warnings and maintain daily schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
