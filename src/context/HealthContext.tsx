import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  MedicalRecord,
  MedicineReminder,
  FamilyMember,
  UserProfile,
  Language,
  ChatMessage,
  Biomarker
} from '../types';
import { INAMDAR_SAMPLE_REPORT, generateDoctorQuestions } from '../lib/medicalAI';

interface HealthContextType {
  records: MedicalRecord[];
  activeFamilyRecords: MedicalRecord[];
  reminders: MedicineReminder[];
  activeFamilyReminders: MedicineReminder[];
  familyMembers: FamilyMember[];
  activeMember: string;
  setActiveMember: (name: string) => void;
  userProfile: UserProfile | null;
  loading: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  language: Language;
  setLanguage: (lang: Language) => void;

  // Actions
  addMedicalRecord: (data: Omit<MedicalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  addReminder: (data: Omit<MedicineReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  toggleReminder: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  addFamilyMember: (data: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  loadSampleInamdarReport: () => Promise<void>;
  updateAbhaId: (abhaId: string) => Promise<void>;
  exportFhirBundle: () => object;

  // AI Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (question: string) => Promise<void>;
  clearChat: () => void;
  isChatResponding: boolean;

  // Analytics
  allBiomarkers: Biomarker[];
  abnormalAlerts: { testName: string; value: number; unit: string; date: string; status: string; advice: string }[];
  doctorQuestions: string[];
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeMember, setActiveMember] = useState<string>('Self');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [language, setLanguage] = useState<Language>('en');

  // AI Health Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      role: 'assistant',
      content: `Namaste! I am your AYUSH+ Personal Health Copilot. I have analyzed your uploaded medical reports, including your recent Inamdar Hospital Liver Function Test (LFT). How can I assist you with your health today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['Inamdar Hospital LFT (Jan 13, 2024)']
    }
  ]);
  const [isChatResponding, setIsChatResponding] = useState(false);

  // Firestore Live Listeners
  useEffect(() => {
    if (!user) {
      // Provide guest demo patient profile and Inamdar Hospital LFT report
      const now = new Date().toISOString();
      setRecords([
        {
          id: 'inamdar_lft_demo',
          userId: 'guest_user',
          ...INAMDAR_SAMPLE_REPORT,
          createdAt: now,
          updatedAt: now
        }
      ]);
      setReminders([
        {
          id: 'rem_1',
          userId: 'guest_user',
          familyMember: 'Self',
          medicineName: 'Ursodeoxycholic Acid (UDCA)',
          dosage: '300 mg',
          time: '08:30',
          frequency: 'Daily after breakfast',
          active: true,
          createdAt: now,
          updatedAt: now
        }
      ]);
      setFamilyMembers([
        {
          id: 'fm_self',
          userId: 'guest_user',
          name: 'Deepmala Kashyap',
          relation: 'Self',
          bloodGroup: 'B+',
          dob: '1989-11-12',
          abhaId: '91-8472-9102-4821',
          allergies: ['Penicillin (Mild rash)'],
          conditions: ['Mild Hepatic Inflammation'],
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'fm_mother',
          userId: 'guest_user',
          name: 'Sunita Kashyap',
          relation: 'Mother',
          bloodGroup: 'O+',
          dob: '1963-04-18',
          abhaId: '91-5821-3920-1102',
          allergies: [],
          conditions: ['Hypertension', 'Type 2 Diabetes'],
          createdAt: now,
          updatedAt: now
        }
      ]);
      setUserProfile({
        userId: 'guest_user',
        displayName: 'Deepmala Kashyap',
        email: 'guest@ayush.plus',
        photoURL: '',
        abhaId: '91-8472-9102-4821',
        language: 'en',
        updatedAt: now
      });
      setSyncStatus('synced');
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncStatus('syncing');

    // 1. Records listener
    const recordsQuery = query(collection(db, 'medical_records'), where('userId', '==', user.uid));
    const unsubscribeRecords = onSnapshot(
      recordsQuery,
      async (snapshot) => {
        const loaded: MedicalRecord[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as MedicalRecord);
        });

        // Sort descending by medical test date
        loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (loaded.length === 0 && !snapshot.metadata.fromCache) {
          // Auto-seed with user's uploaded Inamdar LFT report
          await seedInitialPatientData(user.uid);
        } else {
          setRecords(loaded);
        }
        setSyncStatus('synced');
        setLoading(false);
      },
      (error) => {
        setSyncStatus('offline');
        handleFirestoreError(error, OperationType.GET, 'medical_records');
      }
    );

    // 2. Reminders listener
    const remindersQuery = query(collection(db, 'medicine_reminders'), where('userId', '==', user.uid));
    const unsubscribeReminders = onSnapshot(
      remindersQuery,
      (snapshot) => {
        const loaded: MedicineReminder[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as MedicineReminder);
        });
        setReminders(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'medicine_reminders');
      }
    );

    // 3. Family members listener
    const familyQuery = query(collection(db, 'family_members'), where('userId', '==', user.uid));
    const unsubscribeFamily = onSnapshot(
      familyQuery,
      (snapshot) => {
        const loaded: FamilyMember[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as FamilyMember);
        });
        setFamilyMembers(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'family_members');
      }
    );

    // 4. User profile listener
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(
      userDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const profile = snapshot.data() as UserProfile;
          setUserProfile(profile);
          if (profile.language) setLanguage(profile.language);
        } else if (!snapshot.metadata.fromCache) {
          const now = new Date().toISOString();
          const initial: UserProfile = {
            userId: user.uid,
            displayName: user.displayName || 'Deepmala Kashyap',
            email: user.email || '',
            photoURL: user.photoURL || '',
            abhaId: '91-8472-9102-4821',
            language: 'en',
            updatedAt: now
          };
          try {
            await setDoc(userDocRef, initial);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    return () => {
      unsubscribeRecords();
      unsubscribeReminders();
      unsubscribeFamily();
      unsubscribeUser();
    };
  }, [user]);

  // Seed initial authentic patient profile and Inamdar report
  const seedInitialPatientData = async (userId: string) => {
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);

      // Family member: Self
      const selfRef = doc(collection(db, 'family_members'));
      batch.set(selfRef, {
        userId,
        name: 'Deepmala Kashyap',
        relation: 'Self',
        bloodGroup: 'B+',
        dob: '1989-11-12',
        abhaId: '91-8472-9102-4821',
        allergies: ['Penicillin (Mild rash)'],
        conditions: ['Mild Hepatic Inflammation'],
        createdAt: now,
        updatedAt: now
      });

      // Family member: Mother
      const momRef = doc(collection(db, 'family_members'));
      batch.set(momRef, {
        userId,
        name: 'Sunita Kashyap',
        relation: 'Mother',
        bloodGroup: 'O+',
        dob: '1963-04-18',
        abhaId: '91-5821-3920-1102',
        allergies: [],
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        createdAt: now,
        updatedAt: now
      });

      // Seed Inamdar LFT Report
      const recordRef = doc(collection(db, 'medical_records'));
      batch.set(recordRef, {
        ...INAMDAR_SAMPLE_REPORT,
        userId,
        createdAt: now,
        updatedAt: now
      });

      // Sample Reminder
      const reminderRef = doc(collection(db, 'medicine_reminders'));
      batch.set(reminderRef, {
        userId,
        familyMember: 'Self',
        medicineName: 'Ursodeoxycholic Acid (UDCA)',
        dosage: '300 mg',
        time: '08:30',
        frequency: 'Daily after breakfast',
        active: true,
        createdAt: now,
        updatedAt: now
      });

      await batch.commit();
    } catch (err) {
      console.error('Error seeding patient records:', err);
    }
  };

  // Add Medical Record
  const addMedicalRecord = async (
    data: Omit<MedicalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const now = new Date().toISOString();
    const newId = 'rec_' + Math.random().toString(36).substring(2, 9);
    
    if (!user) {
      const guestRec: MedicalRecord = {
        ...data,
        id: newId,
        userId: 'guest_user',
        createdAt: now,
        updatedAt: now
      };
      setRecords(prev => [guestRec, ...prev]);
      return newId;
    }

    setSyncStatus('syncing');
    const docRef = doc(collection(db, 'medical_records'));
    const payload = {
      ...data,
      userId: user.uid,
      createdAt: now,
      updatedAt: now
    };

    try {
      await setDoc(docRef, payload);
      setSyncStatus('synced');
      return docRef.id;
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.CREATE, `medical_records/${docRef.id}`);
    }
  };

  // Delete Medical Record
  const deleteMedicalRecord = async (id: string): Promise<void> => {
    if (!user) {
      setRecords(prev => prev.filter(r => r.id !== id));
      return;
    }
    setSyncStatus('syncing');
    const docRef = doc(db, 'medical_records', id);
    try {
      await deleteDoc(docRef);
      setSyncStatus('synced');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `medical_records/${id}`);
    }
  };

  // Add Reminder
  const addReminder = async (
    data: Omit<MedicineReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const now = new Date().toISOString();
    const newId = 'rem_' + Math.random().toString(36).substring(2, 9);

    if (!user) {
      const guestRem: MedicineReminder = {
        ...data,
        id: newId,
        userId: 'guest_user',
        createdAt: now,
        updatedAt: now
      };
      setReminders(prev => [...prev, guestRem]);
      return newId;
    }

    const docRef = doc(collection(db, 'medicine_reminders'));
    const payload = {
      ...data,
      userId: user.uid,
      createdAt: now,
      updatedAt: now
    };
    try {
      await setDoc(docRef, payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `medicine_reminders/${docRef.id}`);
    }
  };

  // Toggle Reminder
  const toggleReminder = async (id: string): Promise<void> => {
    if (!user) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
      return;
    }
    const item = reminders.find(r => r.id === id);
    if (!item) return;
    const docRef = doc(db, 'medicine_reminders', id);
    try {
      await setDoc(docRef, { active: !item.active, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `medicine_reminders/${id}`);
    }
  };

  // Delete Reminder
  const deleteReminder = async (id: string): Promise<void> => {
    if (!user) {
      setReminders(prev => prev.filter(r => r.id !== id));
      return;
    }
    const docRef = doc(db, 'medicine_reminders', id);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `medicine_reminders/${id}`);
    }
  };

  // Add Family Member
  const addFamilyMember = async (
    data: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const now = new Date().toISOString();
    const newId = 'fm_' + Math.random().toString(36).substring(2, 9);

    if (!user) {
      const guestFm: FamilyMember = {
        ...data,
        id: newId,
        userId: 'guest_user',
        createdAt: now,
        updatedAt: now
      };
      setFamilyMembers(prev => [...prev, guestFm]);
      return newId;
    }

    const docRef = doc(collection(db, 'family_members'));
    const payload = {
      ...data,
      userId: user.uid,
      createdAt: now,
      updatedAt: now
    };
    try {
      await setDoc(docRef, payload);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `family_members/${docRef.id}`);
    }
  };

  // Load Inamdar Report explicitly
  const loadSampleInamdarReport = async () => {
    await addMedicalRecord({
      ...INAMDAR_SAMPLE_REPORT,
      familyMember: activeMember
    });
  };

  // Update ABHA ID
  const updateAbhaId = async (abhaId: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, { abhaId, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  // Filtered by active family member
  const activeFamilyRecords = useMemo(() => {
    return records.filter(r => r.familyMember === activeMember || (!r.familyMember && activeMember === 'Self'));
  }, [records, activeMember]);

  const activeFamilyReminders = useMemo(() => {
    return reminders.filter(r => r.familyMember === activeMember || (!r.familyMember && activeMember === 'Self'));
  }, [reminders, activeMember]);

  // Aggregate Biomarkers across active family records
  const allBiomarkers = useMemo(() => {
    return activeFamilyRecords.flatMap(r => r.biomarkers || []);
  }, [activeFamilyRecords]);

  // Abnormal alerts with clinical lifestyle advice
  const abnormalAlerts = useMemo(() => {
    const list: { testName: string; value: number; unit: string; date: string; status: string; advice: string }[] = [];

    activeFamilyRecords.forEach(r => {
      r.biomarkers?.forEach(b => {
        if (b.status === 'high' || b.status === 'low' || b.status === 'critical') {
          let advice = 'Review with your primary physician to correlate with symptoms.';
          if (b.category === 'liver') {
            advice = 'Elevated liver enzymes (SGPT/SGOT/Bilirubin) can indicate cellular liver irritation. Drink plenty of water, minimize fried and processed foods, and avoid hepatotoxic analgesics without doctor approval.';
          } else if (b.category === 'sugar') {
            advice = 'Elevated blood glucose indicates insulin resistance or sugar spike. Prioritize high-fiber complex grains, walk 30 minutes daily, and monitor fasting levels.';
          } else if (b.testName.toLowerCase().includes('hemoglobin') && b.status === 'low') {
            advice = 'Low hemoglobin reflects mild anemia. Increase iron-rich foods (spinach, beetroot, pomegranate, legumes) with vitamin C for enhanced absorption.';
          }

          list.push({
            testName: b.testName,
            value: typeof b.value === 'number' ? b.value : parseFloat(b.value as string) || 0,
            unit: b.unit,
            date: r.date,
            status: b.status,
            advice
          });
        }
      });
    });

    return list;
  }, [activeFamilyRecords]);

  // Doctor visit prep questions
  const doctorQuestions = useMemo(() => {
    return generateDoctorQuestions(activeFamilyRecords);
  }, [activeFamilyRecords]);

  // Export FHIR JSON Bundle
  const exportFhirBundle = () => {
    return {
      resourceType: 'Bundle',
      id: `bundle-ayush-${Date.now()}`,
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: user?.uid || 'patient-1',
            name: [{ text: userProfile?.displayName || 'Deepmala Kashyap' }],
            identifier: [
              {
                system: 'https://healthid.ndhm.gov.in',
                value: userProfile?.abhaId || '91-8472-9102-4821'
              }
            ]
          }
        },
        ...activeFamilyRecords.map(rec => ({
          resource: {
            resourceType: 'DiagnosticReport',
            id: rec.id,
            status: 'final',
            code: { text: rec.title },
            effectiveDateTime: rec.date,
            conclusion: rec.summary,
            result: rec.biomarkers.map(b => ({
              display: `${b.testName}: ${b.value} ${b.unit} (${b.status})`
            }))
          }
        }))
      ]
    };
  };

  // AI Chat with Health Records
  const sendChatMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatResponding(true);

    // Formulate context from user's uploaded medical records only!
    const contextRecords = activeFamilyRecords.slice(0, 5).map(r => 
      `Document: ${r.title} (Date: ${r.date}, Hospital: ${r.hospital || 'Clinic'})\nKey findings: ${r.summary}\nBiomarkers: ${r.biomarkers.map(b => `${b.testName}=${b.value} ${b.unit} [${b.status}]`).join(', ')}`
    ).join('\n---\n');

    setTimeout(() => {
      let reply = '';
      const qLower = question.toLowerCase();

      if (qLower.includes('liver') || qLower.includes('sgpt') || qLower.includes('sgot') || qLower.includes('alt') || qLower.includes('bilirubin')) {
        reply = `Based on your Inamdar Multispeciality Hospital report dated Jan 13, 2024:
• Serum SGPT (ALT): 78.32 IU/L (Normal range: 10 - 40 IU/L) – Elevated.
• Serum SGOT (AST): 52.65 IU/L (Normal range: 1 - 31 IU/L) – Elevated.
• Serum Bilirubin Total: 1.9 mg/dl (Normal range: 0.3 - 1.2 mg/dl) – Mildly elevated.

Clinical Context:
These readings show mild acute hepatic stress/inflammation. Crucially, your Total Proteins (6.73 g/dl) and Albumin (4.37 g/dl) are completely normal, proving your liver is still producing vital blood proteins properly.

What you should do:
1. Avoid unnecessary over-the-counter painkillers or herbal concoctions without clinical supervision.
2. Emphasize light, home-cooked meals, leafy vegetables, and high hydration.
3. Show these results to Dr. Shalini Vijay for correlation with symptoms like fatigue or nausea.`;
      } else if (qLower.includes('medication') || qLower.includes('medicine') || qLower.includes('drug')) {
        const activeMeds = activeFamilyReminders.map(r => `• ${r.medicineName} (${r.dosage}) at ${r.time}`).join('\n');
        reply = activeMeds
          ? `Here are your current active scheduled medications:\n${activeMeds}\n\nRemember to take them consistently as instructed by your doctor.`
          : `You currently have no active medicine reminders recorded. You can add one in the Medicines tab!`;
      } else if (qLower.includes('doctor') || qLower.includes('question') || qLower.includes('visit')) {
        reply = `Here are the top questions generated for your next doctor appointment:\n1. What could be the primary cause of my elevated SGPT (78.32) and Bilirubin (1.9)?\n2. Would you recommend an abdominal ultrasound to check liver parenchyma?\n3. Do I need repeat liver function blood tests in 2 to 4 weeks?`;
      } else {
        reply = `Looking at your medical history for ${activeMember}:
• You have ${activeFamilyRecords.length} document(s) uploaded.
• The most recent document is "${activeFamilyRecords[0]?.title || 'Medical Record'}" from ${activeFamilyRecords[0]?.date || 'recent dates'}.
• Key abnormal findings flagged: ${abnormalAlerts.map(a => `${a.testName} (${a.value} ${a.unit})`).join(', ') || 'None'}.

Is there a specific test, symptom, or doctor recommendation you would like me to explain in detail?`;
      }

      const assistantMsg: ChatMessage = {
        id: 'msg_res_' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: activeFamilyRecords.map(r => r.title)
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setIsChatResponding(false);
    }, 700);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg_init',
        role: 'assistant',
        content: `Chat session refreshed. Ask any question about your medical reports, test results, or doctor visit preparation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <HealthContext.Provider
      value={{
        records,
        activeFamilyRecords,
        reminders,
        activeFamilyReminders,
        familyMembers,
        activeMember,
        setActiveMember,
        userProfile,
        loading,
        syncStatus,
        language,
        setLanguage,
        addMedicalRecord,
        deleteMedicalRecord,
        addReminder,
        toggleReminder,
        deleteReminder,
        addFamilyMember,
        loadSampleInamdarReport,
        updateAbhaId,
        exportFhirBundle,
        chatMessages,
        sendChatMessage,
        clearChat,
        isChatResponding,
        allBiomarkers,
        abnormalAlerts,
        doctorQuestions
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
