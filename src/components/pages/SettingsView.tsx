import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Download,
  Globe,
  Database,
  Lock,
  FileCode,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Language } from '../../types';

export const SettingsView: React.FC = () => {
  const { exportFhirBundle, language, setLanguage, activeMember } = useHealth();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadFhir = () => {
    const bundle = exportFhirBundle();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AYUSH_FHIR_Bundle_${activeMember}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Settings, ABHA & Health Data Portability
        </h2>
        <p className="text-xs text-purple-600/70">
          Configure security preferences, export FHIR bundles, and review privacy architecture.
        </p>
      </div>

      {/* 1. ABDM / FHIR Data Export */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 mb-4">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              ABDM & FHIR Health Data Portability
            </h3>
            <p className="text-xs text-purple-600/70">
              Compliant with Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR standards
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          You can download a complete structured JSON bundle of your health profile, pathology reports, and extracted clinical biomarkers. This file can be shared with hospitals or imported into ABDM-compliant Personal Health Records (PHR) systems.
        </p>

        <button
          onClick={handleDownloadFhir}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
        >
          {downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
          <span>{downloadSuccess ? 'Downloaded FHIR Bundle!' : 'Download FHIR JSON Bundle'}</span>
        </button>
      </div>

      {/* 2. Language Preferences */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 mb-4">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Language & Regional Dialect
            </h3>
            <p className="text-xs text-purple-600/70">
              AI summaries and voice responses will adapt to your chosen language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'en', label: 'English', sub: 'Default' },
            { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
            { id: 'ta', label: 'தமிழ்', sub: 'Tamil' },
            { id: 'te', label: 'తెలుగు', sub: 'Telugu' }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as Language)}
              className={`p-3 rounded-2xl border text-center transition ${
                language === lang.id
                  ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-xs'
                  : 'border-purple-100 text-slate-600 hover:bg-purple-50/50'
              }`}
            >
              <div className="text-sm">{lang.label}</div>
              <div className="text-[10px] text-purple-400 mt-0.5">{lang.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Security and Zero-Leak Privacy */}
      <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Data Privacy & Isolation Architecture
            </h3>
            <p className="text-xs text-purple-600/70">
              Zero-leakage security boundaries
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-50/50">
            <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Strict Account Isolation:</strong> Every medical report, prescription, and biomarker is bound to your private Google user identifier in Firebase Firestore with server-enforced security rules. No user can ever see another user's health profile.
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-50/50">
            <Database className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Private Context Grounding:</strong> The AYUSH+ Health Agent references only your own uploaded documents. Public datasets or other users' profiles are never intermingled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
