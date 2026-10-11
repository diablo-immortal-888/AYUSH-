import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  FileText,
  Calendar,
  Volume2,
  VolumeX,
  Trash2,
  AlertCircle,
  Building,
  User,
  FlaskConical,
  Sparkles,
  X
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { MedicalRecord, DocumentType } from '../../types';
import { speechService } from '../../lib/speech';

export const TimelineView: React.FC = () => {
  const { activeFamilyRecords, deleteMedicalRecord, language } = useHealth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filtered = activeFamilyRecords.filter((rec) => {
    if (typeFilter !== 'all' && rec.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = rec.title.toLowerCase().includes(q);
      const matchDoc = rec.doctor?.toLowerCase().includes(q);
      const matchHosp = rec.hospital?.toLowerCase().includes(q);
      const matchText = rec.extractedText.toLowerCase().includes(q);
      return matchTitle || matchDoc || matchHosp || matchText;
    }
    return true;
  });

  const handleSpeak = (rec: MedicalRecord) => {
    if (speakingId === rec.id) {
      speechService.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(rec.id);
      const textToSpeak = language === 'hi' && rec.summaryHi ? rec.summaryHi : rec.summary;
      speechService.speak(textToSpeak, language, () => setSpeakingId(null));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      {/* Header and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Health Records Timeline
          </h2>
          <p className="text-xs text-purple-600/70">
            Chronological archive of all uploaded diagnostic tests and prescriptions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-400"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-900 outline-none"
          >
            <option value="all">All Types</option>
            <option value="lab_report">Lab Reports</option>
            <option value="prescription">Prescriptions</option>
            <option value="discharge_summary">Discharge</option>
            <option value="imaging">Imaging</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-purple-200 p-8">
            <FileText className="w-10 h-10 text-purple-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No medical documents found</h4>
            <p className="text-xs text-purple-500/70 mt-1">
              Upload a lab report or prescription to start your chronological timeline.
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm shadow-purple-500/5 hover:border-purple-300 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">
                      {record.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-purple-600/80 font-medium mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.date}
                      </span>
                      <span>•</span>
                      <span>{record.hospital || 'Hospital'}</span>
                      {record.doctor && (
                        <>
                          <span>•</span>
                          <span>{record.doctor}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(record);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition"
                    title="Read clinical summary aloud"
                  >
                    {speakingId === record.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this health document?')) {
                        deleteMedicalRecord(record.id);
                      }
                    }}
                    className="p-2 text-purple-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Abnormal indicators chip */}
              {record.abnormalFlags && record.abnormalFlags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2.5">
                  {record.abnormalFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      ⚠️ {flag}
                    </span>
                  ))}
                </div>
              )}

              {/* Summary Snippet */}
              <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                {language === 'hi' && record.summaryHi ? record.summaryHi : record.summary}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/30 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-5 right-5 p-1 text-purple-400 hover:text-purple-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">
                {selectedRecord.type}
              </span>
              <span className="text-xs text-purple-400">{selectedRecord.date}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">{selectedRecord.title}</h3>
            <p className="text-xs text-purple-600 mb-4">{selectedRecord.hospital} • {selectedRecord.doctor}</p>

            {/* AI Summary */}
            <div className="mb-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Clinical Health Summary</span>
                </span>
                <button
                  onClick={() => handleSpeak(selectedRecord)}
                  className="flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speak</span>
                </button>
              </div>
              {language === 'hi' && selectedRecord.summaryHi ? selectedRecord.summaryHi : selectedRecord.summary}
            </div>

            {/* Biomarkers */}
            {selectedRecord.biomarkers && selectedRecord.biomarkers.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Extracted Lab Biomarkers
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-purple-100 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-purple-50 text-purple-900 font-bold">
                      <tr>
                        <th className="py-2 px-3">Test</th>
                        <th className="py-2 px-3">Result</th>
                        <th className="py-2 px-3">Reference Range</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {selectedRecord.biomarkers.map((b, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-slate-900">{b.testName}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${b.status === 'high' ? 'text-rose-600' : 'text-slate-800'}`}>
                            {b.value} {b.unit}
                          </td>
                          <td className="py-2 px-3 text-slate-500 font-mono">{b.referenceRange}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
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

            {/* Raw Extracted Text */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Raw Extracted OCR Text
              </h4>
              <pre className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-[11px] text-slate-600 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedRecord.extractedText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
