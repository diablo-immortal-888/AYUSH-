export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  title: string;
  description: string;
  advice: string;
}

const KNOWN_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: 'aspirin',
    drug2: 'ibuprofen',
    severity: 'severe',
    title: 'Increased Gastrointestinal Bleeding Risk',
    description: 'Combining multiple NSAIDs like Aspirin and Ibuprofen significantly increases the risk of stomach ulcers, gastric irritation, and bleeding.',
    advice: 'Avoid taking both together without explicit physician instruction. Use acetaminophen/paracetamol if pain relief is needed alongside prescribed aspirin.'
  },
  {
    drug1: 'metformin',
    drug2: 'alcohol',
    severity: 'severe',
    title: 'Risk of Lactic Acidosis and Hypoglycemia',
    description: 'Alcohol potentiates the effect of metformin on lactate metabolism and increases the risk of severe hypoglycemia.',
    advice: 'Avoid excessive alcohol consumption while on Metformin therapy.'
  },
  {
    drug1: 'paracetamol',
    drug2: 'alcohol',
    severity: 'moderate',
    title: 'Potential Liver Stress (Hepatotoxicity)',
    description: 'Regular or high alcohol intake combined with high doses of Paracetamol increases toxic metabolite production (NAPQI) in the liver.',
    advice: 'Do not exceed 2g - 3g daily of Paracetamol. Avoid alcohol during acute illness.'
  },
  {
    drug1: 'atorvastatin',
    drug2: 'clarithromycin',
    severity: 'severe',
    title: 'Increased Statin Toxicity & Muscle Breakdown',
    description: 'Clarithromycin strongly inhibits CYP3A4, causing dangerous accumulation of Atorvastatin and risk of rhabdomyolysis.',
    advice: 'Consult physician. Statins are usually temporarily withheld during a course of macrolide antibiotics.'
  },
  {
    drug1: 'ciprofloxacin',
    drug2: 'calcium',
    severity: 'moderate',
    title: 'Reduced Antibiotic Absorption',
    description: 'Calcium, magnesium, or iron binds with fluoroquinolones like Ciprofloxacin, cutting absorption by up to 50%.',
    advice: 'Take Ciprofloxacin at least 2 hours before or 4 hours after consuming milk, antacids, or mineral supplements.'
  },
  {
    drug1: 'omeprazole',
    drug2: 'clopidogrel',
    severity: 'moderate',
    title: 'Reduced Antiplatelet Efficacy',
    description: 'Omeprazole inhibits CYP2C19, potentially lowering the activation of Clopidogrel and increasing clot risk.',
    advice: 'Speak with your cardiologist. Pantoprazole is frequently preferred over omeprazole with clopidogrel.'
  }
];

export function checkDrugInteractions(medList: string[]): DrugInteraction[] {
  const normalized = medList.map(m => m.toLowerCase().trim());
  const results: DrugInteraction[] = [];

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const m1 = normalized[i];
      const m2 = normalized[j];

      for (const inter of KNOWN_INTERACTIONS) {
        const matchesOrder1 = m1.includes(inter.drug1) && m2.includes(inter.drug2);
        const matchesOrder2 = m1.includes(inter.drug2) && m2.includes(inter.drug1);

        if (matchesOrder1 || matchesOrder2) {
          results.push(inter);
        }
      }
    }
  }

  return results;
}
