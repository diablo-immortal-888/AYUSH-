export type DocumentType = 'lab_report' | 'prescription' | 'discharge_summary' | 'imaging' | 'other';
export type BiomarkerStatus = 'normal' | 'high' | 'low' | 'critical';
export type Language = 'en' | 'hi' | 'ta' | 'te';

export interface Biomarker {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  minNormal?: number;
  maxNormal?: number;
  status: BiomarkerStatus;
  category: 'liver' | 'sugar' | 'cbc' | 'lipid' | 'renal' | 'thyroid' | 'other';
  notes?: string;
}

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  familyMember: string;
  title: string;
  type: DocumentType;
  date: string;
  doctor?: string;
  hospital?: string;
  extractedText: string;
  summary: string;
  summaryHi?: string;
  abnormalFlags: string[];
  biomarkers: Biomarker[];
  medicines: PrescribedMedicine[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineReminder {
  id: string;
  userId: string;
  familyMember: string;
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: string;
  bloodGroup: string;
  dob: string;
  abhaId?: string;
  allergies: string[];
  conditions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  abhaId?: string;
  language?: Language;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentHi?: string;
  timestamp: string;
  sources?: string[];
}
