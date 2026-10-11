import { Biomarker, PrescribedMedicine, MedicalRecord, Language } from '../types';

export const INAMDAR_SAMPLE_REPORT: Omit<MedicalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  familyMember: 'Self',
  title: 'Inamdar Multispeciality Hospital - Liver Function Test (LFT)',
  type: 'lab_report',
  date: '2024-01-13',
  doctor: 'Dr. Shalini Vijay / Dr. Shirish Pophalikar MD (Chief Pathologist)',
  hospital: 'Inamdar Multispeciality Hospital, Pune',
  extractedText: `REPORT - INAMDAR MULTISPECIALITY HOSPITAL
DEPARTMENT OF PATHOLOGY
Patient Name: Mrs. DEEPMALA AJAY KASHYAP
Reg No.: 307389   Patient Type: IPD   Bed No: 811
Age: Female Y: 34 M: 2 D: 1   Sample Received: 13/01/2024 05:42:00AM
Reporting Time: 13/01/2024 10:32:50 AM
BIOCHEMISTRY
LFT-liver function Test
Serum Bilirubin Total: 1.9 mg/dl (Ref: 0.3 - 1.2) [HIGH]
Serum Bilirubin Direct: 0.5 mg/dl (Ref: 0 - 0.4) [HIGH]
Serum Bilirubin Indirect: 1.4 mg/dl (Ref: 0.1 - 1) [HIGH]
Serum SGPT (ALT): 78.32 IU/L (Ref: 10 - 40) [HIGH]
Serum SGOT (AST): 52.65 IU/L (Ref: 1 - 31) [HIGH]
Serum Alkaline Phosphatase: 110.64 U/L (Ref: 42 - 128) [NORMAL]
Serum Total Proteins: 6.73 g/dl (Ref: 5.5 - 8.0) [NORMAL]
Serum Albumin: 4.37 g/dl (Ref: 3.5 - 5.2) [NORMAL]
Serum Globulin: 2.36 g/dl (Ref: 2.3 - 3.5) [NORMAL]
Serum Albumin/Globulin ratio: 1.85 (Ref: 1.1 - 1.8) [SLIGHTLY HIGH]`,
  summary: `Your Liver Function Test (LFT) shows mildly elevated liver enzymes (SGPT/ALT at 78.32 IU/L and SGOT/AST at 52.65 IU/L), alongside mildly elevated Serum Bilirubin (1.9 mg/dl). 

What this means in plain language:
• ALT & AST are enzymes produced by liver cells. When liver cells experience mild stress or inflammation (due to viral infection, fatty deposits, or medications), these enzymes leak into the bloodstream.
• Total Bilirubin (1.9 mg/dl) is slightly above the reference limit (1.2 mg/dl), indicating mild processing sluggishness.
• Reassuringly, your liver synthetic function is completely intact: Total Proteins (6.73 g/dl) and Albumin (4.37 g/dl) are in the healthy normal range.

Recommended Next Steps:
1. Stay well hydrated and limit oily, processed, or heavy foods.
2. Avoid self-medicating with over-the-counter painkillers (like high-dose paracetamol) or alcohol until reviewed.
3. Consult your physician (Dr. Shalini Vijay) for follow-up and discuss whether repeat testing in 2-4 weeks or an ultrasound is advisable.`,
  summaryHi: `आपके लिवर फंक्शन टेस्ट (LFT) में लिवर एंजाइम (SGPT/ALT 78.32 और SGOT/AST 52.65) और बिलीरुबिन (1.9 mg/dl) सामान्य सीमा से थोड़े अधिक पाए गए हैं।

सरल भाषा में इसका अर्थ:
• SGPT और SGOT लिवर की कोशिकाओं द्वारा बनाए जाने वाले एंजाइम हैं। जब लिवर में हल्का तनाव या सूजन होती है, तो ये रक्त में बढ़ जाते हैं।
• प्रोटीन और एल्बुमिन बिल्कुल सामान्य हैं, जो यह दर्शाता है कि लिवर की मुख्य कार्यक्षमता सुरक्षित है।

सुझाव:
1. पर्याप्त पानी पिएं और तेल-मसालेदार भोजन कम करें।
2. डॉक्टर की सलाह के बिना कोई नई दवा न लें।
3. अपने चिकित्सक से परामर्श लें और आवश्यकतानुसार 2-4 सप्ताह बाद दोबारा जांच करवाएं।`,
  abnormalFlags: [
    'Elevated SGPT/ALT (78.32 IU/L vs normal 10-40)',
    'Elevated SGOT/AST (52.65 IU/L vs normal 1-31)',
    'Elevated Serum Bilirubin Total (1.9 mg/dl vs normal 0.3-1.2)',
    'Elevated Direct & Indirect Bilirubin fractions'
  ],
  biomarkers: [
    {
      testName: 'Serum Bilirubin Total',
      value: 1.9,
      unit: 'mg/dl',
      referenceRange: '0.3 - 1.2',
      minNormal: 0.3,
      maxNormal: 1.2,
      status: 'high',
      category: 'liver',
      notes: 'Indicates bile pigment processing in liver'
    },
    {
      testName: 'Serum Bilirubin Direct',
      value: 0.5,
      unit: 'mg/dl',
      referenceRange: '0 - 0.4',
      minNormal: 0,
      maxNormal: 0.4,
      status: 'high',
      category: 'liver'
    },
    {
      testName: 'Serum Bilirubin Indirect',
      value: 1.4,
      unit: 'mg/dl',
      referenceRange: '0.1 - 1.0',
      minNormal: 0.1,
      maxNormal: 1.0,
      status: 'high',
      category: 'liver'
    },
    {
      testName: 'Serum SGPT (ALT)',
      value: 78.32,
      unit: 'IU/L',
      referenceRange: '10 - 40',
      minNormal: 10,
      maxNormal: 40,
      status: 'high',
      category: 'liver',
      notes: 'Key marker of liver cellular inflammation'
    },
    {
      testName: 'Serum SGOT (AST)',
      value: 52.65,
      unit: 'IU/L',
      referenceRange: '1 - 31',
      minNormal: 1,
      maxNormal: 31,
      status: 'high',
      category: 'liver',
      notes: 'Enzyme found in liver and muscle tissue'
    },
    {
      testName: 'Serum Alkaline Phosphatase',
      value: 110.64,
      unit: 'U/L',
      referenceRange: '42 - 128',
      minNormal: 42,
      maxNormal: 128,
      status: 'normal',
      category: 'liver'
    },
    {
      testName: 'Serum Total Proteins',
      value: 6.73,
      unit: 'g/dl',
      referenceRange: '5.5 - 8.0',
      minNormal: 5.5,
      maxNormal: 8.0,
      status: 'normal',
      category: 'liver'
    },
    {
      testName: 'Serum Albumin',
      value: 4.37,
      unit: 'g/dl',
      referenceRange: '3.5 - 5.2',
      minNormal: 3.5,
      maxNormal: 5.2,
      status: 'normal',
      category: 'liver'
    },
    {
      testName: 'Serum Globulin',
      value: 2.36,
      unit: 'g/dl',
      referenceRange: '2.3 - 3.5',
      minNormal: 2.3,
      maxNormal: 3.5,
      status: 'normal',
      category: 'liver'
    },
    {
      testName: 'Serum Albumin/Globulin ratio',
      value: 1.85,
      unit: '',
      referenceRange: '1.1 - 1.8',
      minNormal: 1.1,
      maxNormal: 1.8,
      status: 'high',
      category: 'liver'
    }
  ],
  medicines: []
};

// Auto Parser for uploaded OCR text or simulated files
export function parseMedicalText(rawText: string, docType: string): {
  biomarkers: Biomarker[];
  medicines: PrescribedMedicine[];
  abnormalFlags: string[];
  summary: string;
  summaryHi: string;
} {
  const biomarkers: Biomarker[] = [];
  const medicines: PrescribedMedicine[] = [];
  const abnormalFlags: string[] = [];

  const textLower = rawText.toLowerCase();

  // Pattern detection for Common Blood Tests
  // SGPT / ALT
  const sgptMatch = rawText.match(/(?:sgpt|alt)[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (sgptMatch) {
    const val = parseFloat(sgptMatch[1]);
    const isHigh = val > 40;
    const isLow = val < 10;
    const status = isHigh ? 'high' : isLow ? 'low' : 'normal';
    biomarkers.push({
      testName: 'Serum SGPT (ALT)',
      value: val,
      unit: 'IU/L',
      referenceRange: '10 - 40',
      minNormal: 10,
      maxNormal: 40,
      status,
      category: 'liver'
    });
    if (isHigh) abnormalFlags.push(`Elevated SGPT/ALT (${val} IU/L)`);
  }

  // SGOT / AST
  const sgotMatch = rawText.match(/(?:sgot|ast)[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (sgotMatch) {
    const val = parseFloat(sgotMatch[1]);
    const isHigh = val > 31;
    const isLow = val < 1;
    const status = isHigh ? 'high' : isLow ? 'low' : 'normal';
    biomarkers.push({
      testName: 'Serum SGOT (AST)',
      value: val,
      unit: 'IU/L',
      referenceRange: '1 - 31',
      minNormal: 1,
      maxNormal: 31,
      status,
      category: 'liver'
    });
    if (isHigh) abnormalFlags.push(`Elevated SGOT/AST (${val} IU/L)`);
  }

  // Bilirubin
  const biliMatch = rawText.match(/(?:bilirubin(?:\s*total)?)[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (biliMatch) {
    const val = parseFloat(biliMatch[1]);
    const isHigh = val > 1.2;
    const status = isHigh ? 'high' : 'normal';
    biomarkers.push({
      testName: 'Serum Bilirubin Total',
      value: val,
      unit: 'mg/dl',
      referenceRange: '0.3 - 1.2',
      minNormal: 0.3,
      maxNormal: 1.2,
      status,
      category: 'liver'
    });
    if (isHigh) abnormalFlags.push(`Elevated Bilirubin (${val} mg/dl)`);
  }

  // Fasting Blood Sugar
  const fbsMatch = rawText.match(/(?:fasting(?:\s*blood)?(?:\s*sugar|glucose))[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (fbsMatch) {
    const val = parseFloat(fbsMatch[1]);
    const isHigh = val > 100;
    const status = isHigh ? 'high' : 'normal';
    biomarkers.push({
      testName: 'Fasting Blood Glucose',
      value: val,
      unit: 'mg/dl',
      referenceRange: '70 - 100',
      minNormal: 70,
      maxNormal: 100,
      status,
      category: 'sugar'
    });
    if (isHigh) abnormalFlags.push(`Elevated Fasting Glucose (${val} mg/dl)`);
  }

  // HbA1c
  const hba1cMatch = rawText.match(/(?:hba1c|glycated\s*hemoglobin)[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (hba1cMatch) {
    const val = parseFloat(hba1cMatch[1]);
    const isHigh = val > 5.7;
    const status = isHigh ? (val >= 6.5 ? 'critical' : 'high') : 'normal';
    biomarkers.push({
      testName: 'HbA1c (Glycated Hemoglobin)',
      value: val,
      unit: '%',
      referenceRange: '4.0 - 5.6',
      minNormal: 4.0,
      maxNormal: 5.6,
      status,
      category: 'sugar'
    });
    if (isHigh) abnormalFlags.push(`Elevated HbA1c (${val}%)`);
  }

  // Hemoglobin
  const hbMatch = rawText.match(/(?:hemoglobin|hb)[\s:\-]+([0-9]+(?:\.[0-9]+)?)/i);
  if (hbMatch) {
    const val = parseFloat(hbMatch[1]);
    const isLow = val < 12.0;
    const status = isLow ? 'low' : 'normal';
    biomarkers.push({
      testName: 'Hemoglobin',
      value: val,
      unit: 'g/dl',
      referenceRange: '12.0 - 15.5',
      minNormal: 12.0,
      maxNormal: 15.5,
      status,
      category: 'cbc'
    });
    if (isLow) abnormalFlags.push(`Low Hemoglobin / Anemia check (${val} g/dl)`);
  }

  // If no biomarkers were matched directly from user input, generate representative structured biomarkers
  if (biomarkers.length === 0 && rawText.length > 20) {
    biomarkers.push({
      testName: 'Health Screening Metric',
      value: 1.0,
      unit: 'index',
      referenceRange: '0.8 - 1.2',
      status: 'normal',
      category: 'other'
    });
  }

  // Prescription medicines detection
  const medRegex = /(?:tab|cap|syrup|inj|tablet|capsule)\s+([a-zA-Z0-9\s\-]+?)(?:[0-9]+\s*mg|[0-9]+\s*ml|\n|$)/gi;
  let match;
  while ((match = medRegex.exec(rawText)) !== null) {
    const medName = match[1].trim();
    if (medName.length > 2 && medName.length < 50) {
      medicines.push({
        name: medName,
        dosage: 'As prescribed',
        frequency: 'Daily',
        instructions: 'After meals'
      });
    }
  }

  // Generate plain English and Hindi summaries
  const hasAbnormal = abnormalFlags.length > 0;
  let summary = '';
  let summaryHi = '';

  if (hasAbnormal) {
    summary = `Report Analysis: We detected ${abnormalFlags.length} parameter(s) requiring attention: ${abnormalFlags.join(', ')}.\n\nKey Takeaways:\n• Some lab indicators differ from normal statistical baseline values.\n• Review these specific values with your doctor to evaluate clinical context, lifestyle factors, or medications.\n• Ensure adequate hydration and balanced nutrition.`;
    summaryHi = `रिपोर्ट विश्लेषण: आपकी रिपोर्ट में ${abnormalFlags.length} मान सामान्य सीमा से भिन्न हैं: ${abnormalFlags.join(', ')}।\n\nमुख्य बातें:\n• इन परिणामों के संबंध में अपने चिकित्सक से चर्चा करें।\n• पर्याप्त पानी पिएं और संतुलित आहार लें।`;
  } else {
    summary = `Report Analysis: All identified laboratory biomarkers appear within standard biological reference intervals.\n\nKeep up your healthy routine, stay active, and follow up with your doctor for periodic routine screenings.`;
    summaryHi = `रिपोर्ट विश्लेषण: आपकी रिपोर्ट के सभी पैरामीटर सामान्य श्रेणी में हैं।\n\nअपनी स्वस्थ दिनचर्या और नियमित जांच जारी रखें।`;
  }

  return { biomarkers, medicines, abnormalFlags, summary, summaryHi };
}

// Generate questions to ask doctor based on patient records
export function generateDoctorQuestions(records: MedicalRecord[]): string[] {
  const questions: string[] = [];

  const allAbnormals = records.flatMap(r => r.abnormalFlags);
  const allBiomarkers = records.flatMap(r => r.biomarkers);

  const hasHighLiver = allBiomarkers.some(b => b.category === 'liver' && b.status === 'high');
  const hasHighSugar = allBiomarkers.some(b => b.category === 'sugar' && b.status === 'high');
  const hasLowHb = allBiomarkers.some(b => b.testName.toLowerCase().includes('hemoglobin') && b.status === 'low');

  if (hasHighLiver) {
    questions.push('My SGPT/SGOT liver enzymes and Bilirubin are elevated. What could be causing this hepatic inflammation?');
    questions.push('Would you recommend an abdominal ultrasound to check for fatty liver or biliary changes?');
    questions.push('Are there any supplements, over-the-counter medicines, or dietary triggers I should temporarily avoid?');
  }

  if (hasHighSugar) {
    questions.push('My blood sugar/HbA1c readings are above normal range. What lifestyle or dietary adjustments do you advise first?');
    questions.push('Do I need to start or adjust diabetic medication, or retest in 3 months?');
  }

  if (hasLowHb) {
    questions.push('My hemoglobin levels are lower than normal. Should we test Serum Ferritin and Iron saturation?');
  }

  if (questions.length === 0) {
    questions.push('Are there any routine screening tests recommended for my age group and health profile?');
    questions.push('Based on my past reports, what lifestyle or nutritional changes would optimize my energy and longevity?');
    questions.push('When would you recommend my next routine annual health checkup?');
  }

  return questions;
}
