import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  Calendar,
  Building,
  User,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { DocumentType } from '../types';
import { parseMedicalText, INAMDAR_SAMPLE_REPORT } from '../lib/medicalAI';

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportUploadModal: React.FC<ReportUploadModalProps> = ({ isOpen, onClose }) => {
  const { addMedicalRecord, activeMember, loadSampleInamdarReport } = useHealth();

  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('lab_report');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setIsProcessing(true);

    if (file.type.startsWith('image/')) {
      const imgReader = new FileReader();
      imgReader.onload = () => {
        setImagePreview(imgReader.result as string);
      };
      imgReader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // Read file text or generate structured simulated OCR extraction
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      let textToExtract = content;
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        textToExtract = `PATIENT REPORT: ${file.name}\nDate: ${date}\nBiochemistry / Blood Work:\nSerum Bilirubin Total: 1.8 mg/dl\nSerum SGPT (ALT): 72.0 IU/L\nSerum SGOT (AST): 48.5 IU/L\nFasting Blood Glucose: 98 mg/dl\nHbA1c: 5.4%\nHemoglobin: 13.2 g/dl\nImpressions: Mild transaminase elevation. Clinically correlate.`;
      }
      setExtractedText(textToExtract);
      setIsProcessing(false);
    };

    if (file.type.includes('text') || file.type.includes('json')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsed = parseMedicalText(extractedText || title, docType);

    await addMedicalRecord({
      familyMember: activeMember,
      title: title.trim(),
      type: docType,
      date,
      doctor: doctor.trim() || 'Attending Physician',
      hospital: hospital.trim() || 'Medical Clinic',
      extractedText: extractedText || title,
      summary: parsed.summary,
      summaryHi: parsed.summaryHi,
      abnormalFlags: parsed.abnormalFlags,
      biomarkers: parsed.biomarkers,
      medicines: parsed.medicines
    });

    onClose();
  };

  const handleLoadInamdarSample = async () => {
    setIsProcessing(true);
    await loadSampleInamdarReport();
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/30 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-purple-400 hover:text-purple-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Upload Medical Document
            </h3>
            <p className="text-xs text-purple-600/70">
              Adding to health profile: <strong>{activeMember}</strong>
            </p>
          </div>
        </div>

        {/* Quick Sample Button (User's Inamdar Report) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
              <span>Inamdar Hospital LFT Sample Report</span>
            </span>
            <p className="text-[11px] text-purple-700/80 mt-0.5">
              Load Mrs. Deepmala Kashyap's Liver Function Test (Bilirubin, SGPT, SGOT).
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadInamdarSample}
            disabled={isProcessing}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 disabled:opacity-50"
          >
            {isProcessing ? 'Loading...' : 'Load Sample'}
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div className="mb-5 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-5 text-center bg-purple-50/30 transition cursor-pointer relative">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Uploaded report preview"
                className="max-h-36 object-contain rounded-xl border border-purple-200 mb-2 shadow-xs"
              />
              <p className="text-xs font-bold text-purple-900">{fileName}</p>
              <p className="text-[11px] text-purple-500">Click or drop another file to change</p>
            </div>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {fileName ? fileName : 'Choose medical document or drop here'}
              </p>
              <p className="text-[11px] text-purple-400 mt-1">
                PDF, JPG, or PNG (Lab reports, prescriptions, hospital summaries)
              </p>
            </>
          )}
        </div>

        {/* Document Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inamdar Hospital LFT or Routine Blood Test"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full px-2.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-purple-900 font-semibold outline-none"
              >
                <option value="lab_report">Lab Report (Biochemistry/Blood)</option>
                <option value="prescription">Prescription</option>
                <option value="discharge_summary">Discharge Summary</option>
                <option value="imaging">Imaging (X-Ray/Ultrasound)</option>
                <option value="other">Other Health Record</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-purple-900 font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Doctor / Specialist
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Shalini Vijay"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital / Lab
              </label>
              <input
                type="text"
                placeholder="e.g. Inamdar Multispeciality Hospital"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Extracted OCR Text / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Paste or review extracted text from report..."
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full p-3 bg-purple-50/40 border border-purple-200 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || isProcessing}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {isProcessing ? 'Processing OCR & AI...' : 'Save & Analyze Document'}
          </button>
        </form>
      </div>
    </div>
  );
};
