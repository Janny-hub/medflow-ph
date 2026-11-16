// ============================================================================
// PHILIPPINE CPG CLINICAL MANAGEMENT REFERENCE (ALL 41 PRIORITY CONDITIONS)
// Extracted verbatim from "Philippine CPG Clinical Management Reference (41 Conditions)"
// Structured into the 3 Bedside Pillars:
//   1. Diagnostics
//   2. Treatment per Situation (Numbered Scenarios & Exact Dosing Regimens)
//   3. Counseling & Red Flags (Dietary/Lifestyle, Free RHU/PhilHealth Access & ER Triggers)
// ============================================================================

export interface CpgSituationProtocol {
  number: number;
  situation: string;
  protocol: string;
}

export interface CpgCounselingItem {
  label: string;
  detail: string;
  isRedFlag?: boolean;
}

export interface CpgClinicalManagementPlan {
  conditionNumber: number;
  cpgId: string;
  sectionGroup: string;
  title: string;
  societySource: string;
  diagnostics: Array<{ label: string; detail: string }>;
  treatmentPerSituation: CpgSituationProtocol[];
  counselingAndRedFlags: CpgCounselingItem[];
}

export const CPG_CLINICAL_MANAGEMENT_PLANS: CpgClinicalManagementPlan[] = [
  // ==========================================================================
  // I. CARDIOVASCULAR & RENAL CONDITIONS (1–6)
  // ==========================================================================
  {
    conditionNumber: 1,
    cpgId: "cpg-htn-adults",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Adult Hypertension",
    societySource: "PSH / PHA Hypertension CPG",
    diagnostics: [
      {
        label: "Confirm Diagnosis",
        detail: "Office BP ≥ 140/90 mm Hg on ≥ 2 separate visits (or 1 visit if Hypertension-Mediated Organ Damage [HMOD] is present). Use Home BP Monitoring (HBPM) or 24-hr ABPM to rule out white-coat hypertension."
      },
      {
        label: "Mandatory Baseline Workup",
        detail: "Fasting Blood Sugar (FBS), Lipid Profile, Serum Creatinine (with eGFR), Serum Sodium & Potassium, Urinalysis (proteinuria/hematuria), and 12-Lead ECG."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Low-Risk Grade 1 HTN (140–159/90–99 mm Hg without HMOD/DM)",
        protocol: "May offer a 3-month lifestyle trial first; if uncontrolled, start pharmacotherapy."
      },
      {
        number: 2,
        situation: "Step 1 — Initial Dual Therapy (BP ≥ 140/90 mm Hg or mandatory if ≥ 160/100 mm Hg)",
        protocol: "Start low-dose 2-drug Single-Pill Combination (SPC): RAAS Blocker (Losartan 50 mg or Telmisartan 40 mg or Enalapril 5–10 mg) + CCB (Amlodipine 5 mg) OR Thiazide/Thiazide-like diuretic (HCTZ 12.5 mg or Indapamide 1.5 mg). Target BP < 130/80 mm Hg (< 140/90 mm Hg if age ≥ 80 yrs); safety floor ≥ 120/70 mm Hg."
      },
      {
        number: 3,
        situation: "Step 2 — Uncontrolled on Dual Therapy",
        protocol: "Titrate to full-dose dual therapy OR escalate to Triple Therapy (ACEi/ARB + CCB + Thiazide/Thiazide-like Diuretic)."
      },
      {
        number: 4,
        situation: "Step 3 — Resistant HTN (Uncontrolled on 3 drugs)",
        protocol: "Add Spironolactone 25–50 mg OD (verify eGFR and Serum K⁺ < 4.5 mEq/L first) and evaluate for secondary hypertension."
      },
      {
        number: 5,
        situation: "Safety Rule",
        protocol: "Never combine an ACEi + ARB; never use sublingual nifedipine/captopril."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Local Diet Counseling",
        detail: "Restrict sodium to < 2,000–2,300 mg/day; avoid toyo, patis, bagoong, buro, instant noodles, and canned goods. Increase potassium-rich foods (malunggay, kangkong, saba banana) unless advanced CKD is present."
      },
      {
        label: "Follow-Up & Access",
        detail: "Review written Home BP log every 2–4 weeks during titration, then every 3–6 months. Separate generic Amlodipine, Losartan, and HCTZ are free at RHUs via PhilHealth Konsulta."
      },
      {
        label: "Red Flags (ER Referral)",
        detail: "BP ≥ 180/120 mm Hg with chest pain, acute dyspnea/pulmonary edema, focal neurologic deficits, or tearing back pain (Hypertensive Emergency).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 2,
    cpgId: "cpg-acute-severe-bp",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Acute Severe Blood Pressure Elevation (≥ 180/120 mm Hg)",
    societySource: "2024 Philippine CPG",
    diagnostics: [
      {
        label: "Immediate Triage Screen",
        detail: "Confirm BP ≥ 180/120 mm Hg in both arms and immediately screen for acute Target Organ Damage (TOD)."
      },
      {
        label: "If TOD Symptoms Present",
        detail: "Order stat 12-Lead ECG, Chest X-Ray, Cardiac Troponin, Serum Creatinine/Electrolytes, Urinalysis, and Non-Contrast Cranial CT (if stroke/encephalopathy suspected)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Hypertensive Urgency (BP ≥ 180/120 mm Hg WITHOUT acute target organ damage)",
        protocol: "Manage outpatient. Place patient in a quiet room to rest for 2 hours. Re-initiate or uptitrate oral maintenance medications (e.g., oral Amlodipine + Losartan). Lower BP gradually over 24–48 hours; do NOT give IV antihypertensives or sublingual nifedipine/captopril."
      },
      {
        number: 2,
        situation: "Hypertensive Emergency — General / Encephalopathy / Acute Renal Injury",
        protocol: "Admit to ER/ICU. Start continuous IV Nicardipine (5 mg/hr, titrate by 2.5 mg/hr every 5–15 min up to max 15 mg/hr). Reduce MAP by 15%–25% over the first 1–2 hours; do NOT lower SBP by ≥ 60 mm Hg within 1 hour."
      },
      {
        number: 3,
        situation: "Hypertensive Emergency with Acute Pulmonary Edema or ACS",
        protocol: "IV Nitroglycerin (5–200 mcg/min) + IV Furosemide (for pulmonary edema); avoid beta-blockers in acute pulmonary edema."
      },
      {
        number: 4,
        situation: "Hypertensive Emergency with Acute Aortic Dissection",
        protocol: "Rapidly lower SBP to < 120 mm Hg and HR < 60 bpm within 20 minutes using IV Esmolol/Labetalol FIRST, followed by IV Nicardipine/Nitroprusside."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Counseling",
        detail: "Educate patients that asymptomatic spikes are most often triggered by missed maintenance doses, high-sodium meals, pain, or anxiety—taking daily maintenance tablets prevents recurrence."
      },
      {
        label: "Follow-Up",
        detail: "Schedule outpatient follow-up within 3–7 days for Hypertensive Urgency with a twice-daily Home BP diary."
      },
      {
        label: "Red Flags",
        detail: "Chest pain, orthopnea/dyspnea, slurred speech, unilateral weakness, visual loss, confusion, seizures, or tearing interscapular pain.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 3,
    cpgId: "cpg-dyslipidemia-adults",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Dyslipidemia",
    societySource: "PHA / PSH / PCEDM Dyslipidemia CPG",
    diagnostics: [
      {
        label: "Screening & Baseline Workup",
        detail: "Fasting or non-fasting Lipid Profile (Total Cholesterol, LDL-C, HDL-C, Triglycerides), baseline ALT, Serum Creatinine, and FBS/HbA1c."
      },
      {
        label: "Surveillance",
        detail: "Repeat Lipid Profile 6–12 weeks after statin initiation or dose adjustment. Do NOT order routine CPK or repeat ALT unless the patient develops muscle pain/weakness or jaundice."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Very High Risk (Clinical ASCVD, ACS, Prior Stroke, PAD, or DM with target organ damage) — Target LDL-C < 55 mg/dL",
        protocol: "Start High-Intensity Statin immediately (Atorvastatin 40–80 mg OD or Rosuvastatin 20–40 mg OD)."
      },
      {
        number: 2,
        situation: "High Risk (Diabetes without organ damage, CKD Stage 3–4, or Familial Hypercholesterolemia) — Target LDL-C < 70 mg/dL",
        protocol: "Start High- or Moderate-Intensity Statin (Atorvastatin 20–40 mg OD or Rosuvastatin 10–20 mg OD)."
      },
      {
        number: 3,
        situation: "Primary Prevention (Age ≥ 45 yrs with ≥ 2 CV risk factors and LDL-C ≥ 130 mg/dL) — Target LDL-C < 100 mg/dL",
        protocol: "Start Moderate-Intensity Statin (Atorvastatin 10–20 mg OD or Rosuvastatin 5–10 mg OD)."
      },
      {
        number: 4,
        situation: "LDL-C Above Goal on Maximally Tolerated Statin",
        protocol: "Add Ezetimibe 10 mg OD."
      },
      {
        number: 5,
        situation: "Severe Hypertriglyceridemia (TG ≥ 500 mg/dL)",
        protocol: "Start Fenofibrate (145–160 mg OD) + strict fat/alcohol restriction to prevent acute pancreatitis."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Local Diet & Lifestyle",
        detail: "Limit deep-fried street foods, fatty pork cuts (liempo, chicharon, sisig), organ meats, and excess coconut cream (gata). Prescribe ≥ 150 min/week of moderate aerobic exercise and complete smoking/vaping cessation."
      },
      {
        label: "Contraindications",
        detail: "Statins are strictly contraindicated in pregnancy, lactation, and decompensated cirrhosis (but are SAFE and protective in fatty liver/MASLD)."
      },
      {
        label: "Red Flags",
        detail: "Severe diffuse myalgia, proximal muscle weakness, dark/cola-colored urine (rhabdomyolysis), or severe epigastric pain radiating to the back (hypertriglyceridemic pancreatitis).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 4,
    cpgId: "cpg-heart-failure-adults",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Heart Failure (HFrEF & HFpEF)",
    societySource: "PHA Heart Failure CPG",
    diagnostics: [
      {
        label: "Confirmatory Imaging",
        detail: "2D Echocardiography with Doppler to classify LVEF: HFrEF (≤ 40%), HFmrEF (41%–49%), or HFpEF (≥ 50%)."
      },
      {
        label: "Baseline Workup",
        detail: "12-Lead ECG, Chest X-Ray (cardiomegaly/congestion), NT-proBNP (≥ 125 pg/mL outpatient; ≥ 300 pg/mL acute) or BNP (≥ 35 pg/mL outpatient; ≥ 100 pg/mL acute), CBC, Serum Na/K, Creatinine/eGFR, FBS/HbA1c, Lipid Profile,TSH, and Iron studies (Ferritin, TSAT)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Chronic HFrEF (LVEF ≤ 40%) — Initiate All 4 Foundational GDMT Pillars",
        protocol: "(a) ARNI (Sacubitril/Valsartan; 36-hr washout if switching from ACEi) OR ACEi (Enalapril/Ramipril) OR ARB (Losartan/Valsartan); (b) Evidence-Based Beta-Blocker (Carvedilol, Bisoprolol, or Metoprolol Succinate CR/XL — start ONLY when euvolemic/compensated); (c) MRA (Spironolactone 12.5–50 mg OD if eGFR > 30 and K⁺ < 5.0); (d) SGLT2 Inhibitor (Dapagliflozin 10 mg OD or Empagliflozin 10 mg OD regardless of DM status)."
      },
      {
        number: 2,
        situation: "HFmrEF / HFpEF (LVEF > 40%)",
        protocol: "Start SGLT2 Inhibitor (Dapagliflozin or Empagliflozin 10 mg OD) + Loop Diuretic for congestion + aggressive control of HTN, AF, and ischemia."
      },
      {
        number: 3,
        situation: "Volume Overload / Congestion",
        protocol: "Oral Furosemide 20–40 mg OD/BID titrated to achieve dry weight."
      },
      {
        number: 4,
        situation: "Iron Deficiency in HFrEF (Ferritin < 100 ng/mL or 100–299 with TSAT < 20%)",
        protocol: "Give IV Ferric Carboxymaltose to improve functional capacity and reduce rehospitalization."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Self-Care & Diet",
        detail: "Instruct patient to record daily morning weights (after voiding, before breakfast); restrict sodium (< 2 g/day) and fluid (1.5–2 L/day if hyponatremic/congested). Avoid NSAIDs/coxibs, non-DHP CCBs (Verapamil/Diltiazem in HFrEF), and Thiazolidinediones."
      },
      {
        label: "Immunization",
        detail: "Ensure annual Influenza and Pneumococcal vaccination."
      },
      {
        label: "Red Flags",
        detail: "Weight gain > 2 kg in 3 days, resting dyspnea/orthopnea, frothy pink sputum, SpO₂ < 90%, syncope, or hypotension (SBP < 90 mm Hg with hypoperfusion).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 5,
    cpgId: "cpg-acs-stemi-nstemi",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Acute Coronary Syndrome (STEMI, NSTEMI & Unstable Angina)",
    societySource: "PHA ACS CPG",
    diagnostics: [
      {
        label: "Immediate Triage (< 10 Minutes of Arrival)",
        detail: "Acquire and interpret a 12-Lead ECG (check V3R–V4R if inferior MI; V7–V9 if posterior MI suspected)."
      },
      {
        label: "Biomarkers & Labs",
        detail: "High-sensitivity Cardiac Troponin I/T at 0 hr and 1–3 hr (do NOT wait for troponin results before reperfusing STEMI!), CBC, Creatinine, Electrolytes, PT/aPTT, Lipid Profile, and Portable Chest X-Ray."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Immediate Initial Bundle (All ACS Patients)",
        protocol: "Chewable non-enteric Aspirin 160–325 mg STAT + P2Y12 Inhibitor loading (Ticagrelor 180 mg OR Clopidogrel 300–600 mg [cap Clopidogrel at 75 mg without loading if age > 75 receiving fibrinolysis]) + High-Intensity Statin (Atorvastatin 80 mg or Rosuvastatin 40 mg STAT) + Sublingual/IV Nitrates for chest pain (CONTRAINDICATED in RV infarction, SBP < 90 mm Hg, or PDE-5 inhibitor use within 24–48 hrs). Give O₂ ONLY if SpO₂ < 90%."
      },
      {
        number: 2,
        situation: "STEMI with PCI-Capable Cath Lab ≤ 120 Minutes",
        protocol: "Transfer immediately for Primary PCI (goal ≤ 90 min if direct; ≤ 120 min if transferred) + IV Unfractionated Heparin or Enoxaparin."
      },
      {
        number: 3,
        situation: "STEMI Where Primary PCI Cannot Be Achieved Within 120 Minutes",
        protocol: "Administer IV Fibrinolysis (Streptokinase 1.5 MU over 30–60 min, Alteplase, or Tenecteplase) within ≤ 10 min of STEMI diagnosis (if symptom onset < 12 hrs and no contraindications) + Enoxaparin/Fondaparinux, then transfer to a PCI center (rescue PCI if failed; routine pharmaco-invasive angiography at 2–24 hrs if successful)."
      },
      {
        number: 4,
        situation: "NSTEMI / Unstable Angina",
        protocol: "NEVER give fibrinolytics. Administer DAPT + Anticoagulation (Enoxaparin 1 mg/kg SC q12h or Fondaparinux 2.5 mg SC OD) and risk-stratify by GRACE score for early invasive angiography (< 24 hrs if high risk)."
      },
      {
        number: 5,
        situation: "Post-Stabilization Secondary Prevention",
        protocol: "Continue DAPT × 12 months + High-Intensity Statin + Beta-Blocker + ACEi/ARB (+ MRA if LVEF ≤ 40%)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Counseling",
        detail: "Emphasize strict adherence to Dual Antiplatelet Therapy (DAPT)—premature discontinuation causes catastrophic stent thrombosis. Refer to Phase II Cardiac Rehabilitation and enforce complete smoking cessation."
      },
      {
        label: "Red Flags",
        detail: "Recurrent ischemic chest pain, cardiogenic shock (SBP < 90 mm Hg, cold clammy extremities, oliguria), acute pulmonary edema, sustained ventricular arrhythmias (VT/VF), or major GI/intracranial bleeding.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 6,
    cpgId: "cpg-ckd-adults",
    sectionGroup: "I. Cardiovascular & Renal Conditions",
    title: "Chronic Kidney Disease (CKD)",
    societySource: "PSN Chronic Kidney Disease CPG",
    diagnostics: [
      {
        label: "Confirm Diagnosis (Persisting > 3 Months)",
        detail: "eGFR < 60 mL/min/1.73m² (CKD-EPI) AND/OR Urine Albumin-to-Creatinine Ratio (UACR) ≥ 30 mg/g (or persistent proteinuria/hematuria on urinalysis)."
      },
      {
        label: "Baseline Workup",
        detail: "Kidney & Urinary Tract Ultrasound, Serum Electrolytes (Na, K, Cl, HCO₃, Ca, Phosphorus), CBC (for renal anemia), Fasting Blood Sugar/HbA1c, and Lipid Profile."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "CKD with Albuminuria (UACR ≥ 30 mg/g) or Hypertension",
        protocol: "Start maximum tolerated dose of ACEi or ARB (target BP < 130/80 mm Hg; check Serum Creatinine and K⁺ within 2–4 weeks—continue unless creatinine rises > 30%)."
      },
      {
        number: 2,
        situation: "CKD with eGFR ≥ 20 mL/min/1.73m² (Diabetic or Non-Diabetic with Albuminuria/HF)",
        protocol: "Add SGLT2 Inhibitor (Dapagliflozin 10 mg OD or Empagliflozin 10 mg OD); once initiated, may continue until dialysis."
      },
      {
        number: 3,
        situation: "Type 2 DM + CKD with Persistent Albuminuria Despite ACEi/ARB + SGLT2i",
        protocol: "Consider non-steroidal MRA (Finerenone) if Serum K⁺ ≤ 4.8 mEq/L."
      },
      {
        number: 4,
        situation: "Cardiovascular Risk Reduction (CKD G3–G5 not on dialysis)",
        protocol: "Prescribe Statin or Statin/Ezetimibe (e.g., Atorvastatin 20 mg OD)."
      },
      {
        number: 5,
        situation: "Advanced CKD (eGFR < 30 mL/min/1.73m² / Stage G4–G5)",
        protocol: "Discontinue Metformin; correct metabolic acidosis with Oral Sodium Bicarbonate; treat renal anemia (Iron supplementation + ESA after iron repletion); refer to a Nephrologist for AV fistula planning and PhilHealth Z-Benefit / 156-session hemodialysis enrollment."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Nephrotoxin Avoidance",
        detail: "Strictly forbid OTC NSAIDs (mefenamic acid, ibuprofen, naproxen, coxibs), unregulated herbal supplements/decoctions, and unnecessary iodinated IV contrast."
      },
      {
        label: "Dietary Counseling",
        detail: "Moderate protein (0.8 g/kg/day), low sodium (< 2 g/day), and low potassium/phosphorus diet if Stage G4–G5."
      },
      {
        label: "Red Flags (Urgent Dialysis Indications — AEIOU)",
        detail: "Refractory Acidosis, severe Hyperkalemia (K⁺ ≥ 6.5 mEq/L or ECG changes), Intoxication, diuretic-refractory Fluid Overload/Pulmonary Edema, or Uremic encephalopathy/pericarditis/bleeding.",
        isRedFlag: true
      }
    ]
  },

  // ==========================================================================
  // II. ENDOCRINE & METABOLIC CONDITIONS (7–9)
  // ==========================================================================
  {
    conditionNumber: 7,
    cpgId: "cpg-t2dm-adults",
    sectionGroup: "II. Endocrine & Metabolic Conditions",
    title: "Type 2 Diabetes Mellitus",
    societySource: "UNITE for Diabetes / PCEDM CPG",
    diagnostics: [
      {
        label: "Diagnostic Cutoffs",
        detail: "FBS ≥ 126 mg/dL, 2-hr 75g OGTT ≥ 200 mg/dL, HbA1c ≥ 6.5%, OR Random Blood Sugar ≥ 200 mg/dL with classic symptoms (confirm asymptomatic results with a repeat test)."
      },
      {
        label: "Baseline & Annual Complication Screen",
        detail: "HbA1c (every 3–6 mos), Fasting Lipid Profile, Serum Creatinine + eGFR, Urine Albumin-to-Creatinine Ratio (UACR), 12-Lead ECG, Dilated Funduscopy, and 10-g Monofilament Foot Exam."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Step 1 — Newly Diagnosed Uncomplicated T2DM (eGFR ≥ 30 mL/min/1.73m²)",
        protocol: "Start Medical Nutrition Therapy + Metformin 500 mg OD/BID with meals, titrating up to 2,000 mg/day (reduce max dose to 1,000 mg/day if eGFR 30–44; STOP if eGFR < 30). Target HbA1c < 7.0% (7.5%–8.0% in frail elderly)."
      },
      {
        number: 2,
        situation: "T2DM with Coexisting ASCVD, Heart Failure, or CKD (Regardless of Baseline HbA1c)",
        protocol: "Add an SGLT2 Inhibitor (Empagliflozin 10 mg OD or Dapagliflozin 10 mg OD) OR GLP-1 Receptor Agonist with proven CV benefit immediately alongside Metformin."
      },
      {
        number: 3,
        situation: "Step 2 — HbA1c > 7.0% After 3 Months of Metformin (or Initial HbA1c ≥ 8.5%) Without Cardiorenal Disease",
        protocol: "Add a second oral agent based on hypoglycemia risk, weight, and budget: DPP-4 Inhibitor (Sitagliptin/Linagliptin), SGLT2i, or 2nd-generation Sulfonylurea (Gliclazide MR 30–60 mg OD before breakfast; avoid Glibenclamide in the elderly)."
      },
      {
        number: 4,
        situation: "Step 3 — Symptomatic Severe Hyperglycemia (HbA1c ≥ 9.0%–10.0%, FBS ≥ 250–300 mg/dL, or Weight Loss/Ketosis)",
        protocol: "Start Basal Insulin (Insulin Glargine or NPH 10 units SC at bedtime or 0.1–0.2 U/kg/day) and titrate by 2 units every 3 days to reach fasting glucose 80–130 mg/dL."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Local Diet & Foot Care",
        detail: "Use the Pinggang Pinoy plate model; replace excess white rice with portion-controlled brown rice, corn grits (mais), or high-fiber vegetables; eliminate 3-in-1 coffee, soft drinks, and sweetened juices. Inspect feet daily and never walk barefoot."
      },
      {
        label: "Hypoglycemia Rule of 15",
        detail: "If CBG < 70 mg/dL, take 15 g fast-acting carbohydrate (3 tsp sugar in water or ½ glass regular soda), recheck CBG in 15 minutes, and eat a meal once normalized."
      },
      {
        label: "Red Flags",
        detail: "CBG > 250–300 mg/dL with nausea, vomiting, abdominal pain, Kussmaul breathing, or altered sensorium (DKA/HHS), or infected diabetic foot ulcer/gangrene.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 8,
    cpgId: "cpg-thyroid-disorders",
    sectionGroup: "II. Endocrine & Metabolic Conditions",
    title: "Thyroid Disorders (Hypothyroidism & Hyperthyroidism)",
    societySource: "PCEDM / PTA CPG",
    diagnostics: [
      {
        label: "Initial Laboratory Test",
        detail: "Serum TSH (most sensitive 1st-line test) + Free T4 (FT4) (add Free T3 if hyperthyroid with normal FT4)."
      },
      {
        label: "Additional Workup",
        detail: "If hyperthyroid, order Baseline CBC with differential and Liver Function Tests (ALT, AST, Bilirubin, ALP) BEFORE starting Methimazole/PTU. If thyroid nodule or palpable goiter is present, order High-Resolution Neck Ultrasound (with TI-RADS scoring; never order routine CT with iodinated contrast)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Overt Primary Hypothyroidism (High TSH + Low FT4)",
        protocol: "Start Levothyroxine (LT4) 1.6 mcg/kg/day PO on an empty stomach 30–60 minutes before breakfast (separate by ≥ 4 hours from iron, calcium, or PPIs). Recheck TSH in 6–8 weeks."
      },
      {
        number: 2,
        situation: "Hypothyroidism in Elderly (> 60 yrs) or Known Coronary Artery Disease",
        protocol: "\"Start low and go slow\" — initiate Levothyroxine at 12.5–25 mcg/day and titrate by 12.5–25 mcg every 4–6 weeks to avoid precipitating angina/arrhythmia."
      },
      {
        number: 3,
        situation: "Subclinical Hypothyroidism (Normal FT4)",
        protocol: "Treat with Levothyroxine if TSH ≥ 10 mIU/L, OR if TSH 4.5–9.9 mIU/L in patients who are pregnant/planning pregnancy, symptomatic, TPOAb-positive, or have ASCVD risk."
      },
      {
        number: 4,
        situation: "Overt Hyperthyroidism / Graves' Disease (Non-Pregnant)",
        protocol: "Start Methimazole 10–30 mg/day PO OD + Propranolol 10–40 mg TID–QID (or Atenolol 25–50 mg OD) for adrenergic control (tachycardia/tremor). Monitor FT4 and TSH every 4–6 weeks."
      },
      {
        number: 5,
        situation: "Hyperthyroidism in Pregnancy",
        protocol: "Use Propylthiouracil (PTU) during the 1st Trimester (to avoid Methimazole embryopathy), then switch back to Methimazole in the 2nd and 3rd Trimesters (to reduce PTU hepatotoxicity risk)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Critical Safety Counseling (Antithyroid Drugs)",
        detail: "Instruct patients taking Methimazole or PTU to STOP the drug immediately and report to the clinic for an urgent CBC with differential if they develop fever, sore throat, or mouth ulcers (agranulocytosis), or for LFTs if they develop jaundice, dark urine, or RUQ pain."
      },
      {
        label: "Red Flags (ER / ICU Referral)",
        detail: "Thyroid Storm (hyperpyrexia > 39°C, HR > 140 bpm/atrial fibrillation, agitation/delirium, GI/hepatic dysfunction) OR Myxedema Coma (hypothermia, bradycardia, obtundation).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 9,
    cpgId: "cpg-gdm-obstetrics",
    sectionGroup: "II. Endocrine & Metabolic Conditions",
    title: "Gestational Diabetes Mellitus (GDM)",
    societySource: "POGS Diabetes in Pregnancy CPG",
    diagnostics: [
      {
        label: "Universal Screening Timing",
        detail: "First Prenatal Visit (to detect overt pre-existing diabetes: FBS ≥ 126 mg/dL, HbA1c ≥ 6.5%, or 2-hr OGTT ≥ 200 mg/dL) AND at 24–28 Weeks AOG (if initial screen was normal)."
      },
      {
        label: "Confirmatory 75g 2-Hour OGTT Cutoffs (POGS/IADPSG — ≥ 1 abnormal value confirms GDM)",
        detail: "Fasting ≥ 92 mg/dL | 1-Hour ≥ 180 mg/dL | 2-Hour ≥ 153 mg/dL."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Step 1 — All Newly Diagnosed GDM Patients (1–2 Week Trial)",
        protocol: "Initiate Medical Nutrition Therapy (30–35 kcal/kg ideal weight; 40%–45% complex carbohydrates split across 3 meals + 2–3 snacks) + 30 min post-meal walking + Self-Monitoring of Blood Glucose (SMBG) 4× daily. Target CBG: Fasting < 95 mg/dL, 1-hr postprandial < 140 mg/dL, 2-hr postprandial < 120 mg/dL."
      },
      {
        number: 2,
        situation: "Step 2 — Glycemic Targets Unmet After 1–2 Weeks of MNT (First-Line Pharmacotherapy)",
        protocol: "Start Subcutaneous Insulin: NPH or Detemir at bedtime/morning for elevated fasting glucose + Rapid-Acting (Aspart/Lispro) or Regular Human Insulin before meals for postprandial spikes."
      },
      {
        number: 3,
        situation: "Alternative When Patient Refuses or Cannot Safely Administer Insulin",
        protocol: "After informed consent that it crosses the placenta, prescribe Metformin 500–2,000 mg/day. (Strictly avoid Sulfonylureas, DPP-4i, SGLT2i, and GLP-1 RAs in pregnancy)."
      },
      {
        number: 4,
        situation: "Fetal Surveillance & Delivery Timing",
        protocol: "Serial Fetal Biometry / Biophysical Profile starting at 28–32 weeks; deliver at 39 0/7–40 6/7 weeks if controlled on diet (A1GDM) or 39 0/7–39 6/7 weeks if controlled on insulin (A2GDM; earlier if poorly controlled)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Postpartum Follow-Up (Mandatory)",
        detail: "Perform a 75g 2-Hour OGTT at 6–12 weeks postpartum (using non-pregnant adult criteria) because Filipino women with GDM have a 50%–70% lifetime risk of developing Type 2 DM. Encourage exclusive breastfeeding."
      },
      {
        label: "Red Flags",
        detail: "Decreased fetal movement (< 10 kicks in 12 hours), persistent maternal CBG > 200 mg/dL, ketonuria, severe hypoglycemia, or new-onset BP ≥ 140/90 mm Hg (coexisting preeclampsia).",
        isRedFlag: true
      }
    ]
  },

  // ==========================================================================
  // III. RESPIRATORY & ENT CONDITIONS (10–14)
  // ==========================================================================
  {
    conditionNumber: 10,
    cpgId: "cpg-cap-adults",
    sectionGroup: "III. Respiratory & ENT Conditions",
    title: "Adult Community-Acquired Pneumonia (CAP)",
    societySource: "PSMID / PCCP / PAFP CPG",
    diagnostics: [
      {
        label: "Confirm & Stratify",
        detail: "Chest X-Ray (PA/Lateral) to document new pulmonary infiltrate + Pulse Oximetry (SpO₂) and Vital Signs to classify Low, Moderate, or High Risk."
      },
      {
        label: "Microbiology",
        detail: "Do NOT order routine sputum Gram stain/culture for Low-Risk outpatient CAP. Order Sputum Gram stain/culture and 2 sets of Blood Cultures BEFORE antibiotics in Moderate-to-High Risk hospitalized CAP. Order Sputum Xpert MTB/RIF if cough ≥ 2 weeks."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Low-Risk CAP Without Comorbidities (RR < 30, HR < 125, BP ≥ 90/60, normal sensorium — Outpatient)",
        protocol: "Amoxicillin 1 g PO TID × 5 days (add Azithromycin 500 mg PO OD × 3 days or Clarithromycin 500 mg BID × 5 days if atypical pathogen is suspected)."
      },
      {
        number: 2,
        situation: "Low-Risk CAP WITH Stable Comorbidities (DM, COPD, CKD, HF) or Antibiotic Use in Past 3 Months (Outpatient)",
        protocol: "Co-Amoxiclav 625 mg PO TID (or 1 g PO BID) OR Cefuroxime 500 mg PO BID × 5–7 days + Macrolide (Azithromycin 500 mg OD × 3 days)."
      },
      {
        number: 3,
        situation: "Moderate-Risk CAP (RR ≥ 30, HR > 125, BP < 90/60, confusion, or unstable comorbidity — Ward Admission)",
        protocol: "IV Ceftriaxone 2 g OD (or Ampicillin-Sulbactam 1.5 g IV q6h) + Azithromycin 500 mg IV/PO OD. Administer 1st dose within 4 hours; switch to oral once afebrile for 48 hrs and hemodynamically stable."
      },
      {
        number: 4,
        situation: "High-Risk CAP (Septic shock on vasopressors OR mechanical ventilation — ICU Admission)",
        protocol: "IV Anti-pseudomonal β-lactam (Piperacillin-Tazobactam 4.5 g IV q6h, Cefepime 2 g IV q8h, or Meropenem 1 g IV q8h) + IV Azithromycin 500 mg OD OR Levofloxacin 750 mg IV OD (avoid empirical Fluoroquinolones if PTB is not yet ruled out)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Reassessment & Prevention",
        detail: "Reassess outpatients at 48–72 hours for defervescence. Do NOT repeat Chest X-Ray prior to discharge if clinically improving; repeat CXR at 6–8 weeks only in smokers or age > 50 yrs to rule out malignancy/PTB. Administer Pneumococcal (PCV/PPSV23) and annual Influenza vaccines."
      },
      {
        label: "Red Flags",
        detail: "RR ≥ 30 cpm, SpO₂ < 90% on room air, SBP < 90 mm Hg, acute confusion/somnolence, inability to tolerate oral intake, or worsening fever after 72 hours of antibiotics.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 11,
    cpgId: "cpg-pcap-peds",
    sectionGroup: "III. Respiratory & ENT Conditions",
    title: "Pediatric Community-Acquired Pneumonia (PCAP)",
    societySource: "PAPP / PIDSP PCAP CPG",
    diagnostics: [
      {
        label: "Clinical Severity Staging",
        detail: "Assess age-specific tachypnea (< 2 mos: ≥ 60 cpm; 2–12 mos: ≥ 50 cpm; 1–5 yrs: ≥ 40 cpm; > 5 yrs: ≥ 30 cpm), chest indrawing, and SpO₂."
      },
      {
        label: "Workup by Stage",
        detail: "PCAP A/B (Non-Severe Outpatient): Clinical diagnosis — routine Chest X-Ray and CBC are NOT required. PCAP C (Severe) / PCAP D (Very Severe): Order Chest X-Ray (PA/Lateral), CBC, Blood Culture, and Pulse Oximetry."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "PCAP A / B (Non-Severe — Fast breathing ONLY, no chest indrawing, no danger signs, SpO₂ ≥ 95% — Outpatient)",
        protocol: "High-dose Oral Amoxicillin 40–50 mg/kg/day divided TID (or 80–90 mg/kg/day divided BID in high pneumococcal resistance areas) × 5–7 days + Paracetamol 10–15 mg/kg/dose q4–6h PRN for fever."
      },
      {
        number: 2,
        situation: "School-Age Child (≥ 5 Years) with Suspected Mycoplasma / Atypical Pneumonia",
        protocol: "Add or use Oral Azithromycin 10 mg/kg on Day 1, then 5 mg/kg/day OD on Days 2–5."
      },
      {
        number: 3,
        situation: "PCAP C (Severe — Lower chest wall indrawing, nasal flaring, grunting, or SpO₂ < 94% — Hospital Ward Admission)",
        protocol: "Supplemental Oxygen (keep SpO₂ ≥ 94%) + IV Penicillin G (100,000–200,000 U/kg/day divided q6h) OR IV Ampicillin (150–200 mg/kg/day divided q6h). If unimmunized for Hib/PCV, give IV Ceftriaxone (50–75 mg/kg/day OD) or Cefuroxime."
      },
      {
        number: 4,
        situation: "PCAP D (Very Severe — Cyanosis, apnea, inability to drink/breastfeed, lethargy, convulsions, or shock — PICU Admission)",
        protocol: "Airway/ventilatory support + IV Ceftriaxone (75–100 mg/kg/day) + IV Oxacillin/Clindamycin or Vancomycin (if Staphylococcus aureus / pneumatocele / empyema is suspected) + Oseltamivir if severe influenza."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Supportive Care & Safety",
        detail: "Ensure continued breastfeeding/oral hydration and nasal saline drops for blocked nostrils. Strictly avoid OTC cough/cold suppressants, antihistamines, and mucolytics in young children."
      },
      {
        label: "Mandatory Follow-Up",
        detail: "Re-evaluate all PCAP A/B outpatients after 48 hours of Amoxicillin."
      },
      {
        label: "Red Flags (Immediate ER Admission)",
        detail: "Subcostal/intercostal retractions, head bobbing, nasal flaring, grunting, central cyanosis, SpO₂ < 94%, inability to breastfeed/drink, persistent vomiting, lethargy, or seizures.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 12,
    cpgId: "cpg-bronchial-asthma",
    sectionGroup: "III. Respiratory & ENT Conditions",
    title: "Bronchial Asthma",
    societySource: "PAFP / GINA-Adapted Asthma CPG",
    diagnostics: [
      {
        label: "Confirm Variable Expiratory Airflow Limitation",
        detail: "Spirometry showing reduced FEV₁/FVC with positive bronchodilator reversibility (FEV₁ increase ≥ 12% and ≥ 200 mL post-SABA) OR Peak Expiratory Flow (PEF) variability > 10% in adults (> 13% in children)."
      },
      {
        label: "Acute Exacerbation Triage",
        detail: "Assess ability to speak in full sentences vs. phrases/words, RR, accessory muscle use, HR, SpO₂, and PEF (% personal best)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Preferred Track 1 Maintenance & Reliever Therapy (MART — Adolescents ≥ 12 yrs & Adults)",
        protocol: " NEVER prescribe SABA-only monotherapy. Step 1–2: As-needed low-dose ICS-Formoterol (Budesonide/Formoterol 160/4.5 mcg 1 inhalation PRN for symptoms). Step 3: Low-dose ICS-Formoterol 1 inhalation BID maintenance + 1 inhalation PRN reliever. Step 4: Medium-dose ICS-Formoterol 2 inhalations BID maintenance + 1 inhalation PRN reliever (max 12 inhalations/day)."
      },
      {
        number: 2,
        situation: "Alternative Track 2 (When Only SABA + Separate ICS Are Available at RHU)",
        protocol: "Whenever Salbutamol MDI is taken, the patient MUST take low-dose Inhaled Corticosteroid (Budesonide or Fluticasone) daily/concomitantly; step up to ICS-LABA (Fluticasone/Salmeterol) for Step 3–4."
      },
      {
        number: 3,
        situation: "Mild-to-Moderate Acute Asthma Exacerbation (Talks in phrases, RR < 30, HR 100–120, SpO₂ 90%–95%)",
        protocol: "Salbutamol MDI with spacer 4–10 puffs (or Nebulization 2.5–5 mg) every 20 minutes for 1 hour + Oral Prednisolone 40–50 mg OD × 5–7 days (1–2 mg/kg/day max 40 mg in children × 3–5 days) + Controlled O₂ to target SpO₂ 93%–95%."
      },
      {
        number: 4,
        situation: "Severe / Life-Threatening Exacerbation (Talks in words, sits hunched, RR > 30, HR > 120, SpO₂ < 90%, or silent chest)",
        protocol: "High-flow O₂ + Back-to-back Salbutamol + Ipratropium Bromide nebulization q20min + IV Hydrocortisone 100–200 mg (or Methylprednisolone) + single-dose IV Magnesium Sulfate 2 g infused over 20 minutes; prepare for intubation/ICU."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Inhaler Technique & Written Action Plan",
        detail: "Physically check inhaler + spacer technique at every visit and instruct patient to rinse mouth and spit after ICS use to prevent oral thrush. Eliminate triggers (tobacco/vape smoke, mosquito coils/katol, house dust mites)."
      },
      {
        label: "Danger of Oral Salbutamol",
        detail: "Never prescribe oral salbutamol tablets/syrup (ineffective and causes tachycardia/tremors)."
      },
      {
        label: "Red Flags",
        detail: "Silent chest, drowsiness/confusion, paradoxical thoracoabdominal movement, SpO₂ < 90%, or reliance on > 1 SABA canister per month.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 13,
    cpgId: "cpg-copd-adults",
    sectionGroup: "III. Respiratory & ENT Conditions",
    title: "Chronic Obstructive Pulmonary Disease (COPD)",
    societySource: "PCCP / GOLD-Adapted COPD CPG",
    diagnostics: [
      {
        label: "Mandatory Confirmatory Test",
        detail: "Post-Bronchodilator Spirometry demonstrating persistent airflow limitation: post-bronchodilator FEV₁/FVC < 0.70."
      },
      {
        label: "Baseline Workup & ABE Grouping",
        detail: "Chest X-Ray + Sputum Xpert MTB/RIF (to exclude PTB / post-TB bronchiectasis), CBC with differential (Blood Eosinophil Count in cells/µL), mMRC Dyspnea Scale / CAT Score, and 12-month exacerbation history."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Group A (0–1 moderate exacerbation not leading to hospitalization AND mMRC 0–1 / CAT < 10)",
        protocol: "Start a bronchodilator (short- or long-acting LABA or LAMA, e.g., Tiotropium 18 mcg DPI OD or Indacaterol)."
      },
      {
        number: 2,
        situation: "Group B (0–1 moderate exacerbation not leading to hospitalization AND mMRC ≥ 2 / CAT ≥ 10)",
        protocol: "Start Dual Long-Acting Bronchodilator therapy: LABA + LAMA single-inhaler combination (e.g., Indacaterol/Glycopyrronium, Umeclidinium/Vilanterol, or Tiotropium/Olodaterol)."
      },
      {
        number: 3,
        situation: "Group E (≥ 2 moderate exacerbations OR ≥ 1 hospitalization in the past year)",
        protocol: "Start LABA + LAMA. Escalate to Triple Therapy (LABA + LAMA + ICS) ONLY if Blood Eosinophils ≥ 300 cells/µL (or ≥ 100 cells/µL with recurrent exacerbations despite LABA+LAMA) or coexisting asthma. Avoid standalone ICS-LABA without LAMA due to increased pneumonia/TB risk."
      },
      {
        number: 4,
        situation: "Acute COPD Exacerbation (AECOPD)",
        protocol: "Controlled Venturi/nasal O₂ targeting SpO₂ 88%–92% (avoid hyperoxia-induced CO₂ retention) + Short-acting SABA + SAMA (Salbutamol + Ipratropium) nebulization/MDI + Oral Prednisone 40 mg OD × 5 days + Antibiotics × 5 days (Co-Amoxiclav, Macrolide, or Doxycycline) if increased sputum purulence + volume/dyspnea."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Smoking & Biomass Cessation",
        detail: "Enforce complete tobacco/vape cessation (DOH Quitline 1558) and improve kitchen ventilation for patients exposed to firewood/charcoal (kahoy/uling) smoke. Refer Group B and E patients to Pulmonary Rehabilitation."
      },
      {
        label: "Vaccination",
        detail: "Administer annual Influenza, Pneumococcal, COVID-19, RSV, and Tdap vaccines."
      },
      {
        label: "Red Flags (Immediate ER / Non-Invasive Ventilation BiPAP)",
        detail: "SpO₂ < 88%, acute respiratory acidosis (pH ≤ 7.35, PaCO₂ > 45 mm Hg), severe resting dyspnea, cyanosis, asterixis, or confusion/CO₂ narcosis.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 14,
    cpgId: "cpg-allergic-rhinitis",
    sectionGroup: "III. Respiratory & ENT Conditions",
    title: "Allergic Rhinitis",
    societySource: "PSO-HNS Allergic Rhinitis CPG",
    diagnostics: [
      {
        label: "Clinical Diagnosis & ARIA Classification",
        detail: "Diagnose clinically based on ≥ 2 of 4 cardinal symptoms (watery anterior rhinorrhea, paroxysmal sneezing, nasal obstruction/congestion, nasal/ocular pruritus) lasting > 1 hour on most days, plus pale/bluish boggy nasal turbinates on anterior rhinoscopy. Classify as Intermittent (< 4 days/wk or < 4 consecutive wks) vs. Persistent (≥ 4 days/wk AND ≥ 4 consecutive wks), and Mild vs. Moderate-Severe (impairs sleep, work, or school)."
      },
      {
        label: "When to Order Special Tests",
        detail: "Order Nasal Endoscopy or Sinus CT only for unilateral symptoms, polyps, or refractory rhinosinusitis; Skin Prick Test / Specific IgE if considering immunotherapy."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Mild Intermittent Allergic Rhinitis",
        protocol: "Start a 2nd-Generation Non-Sedating Oral Antihistamine: Cetirizine 10 mg OD, Loratadine 10 mg OD, Levocetirizine 5 mg OD, Bilastine 20 mg OD, or Fexofenadine 120–180 mg OD + Isotonic Nasal Saline Irrigation."
      },
      {
        number: 2,
        situation: "Moderate-to-Severe Intermittent OR Mild/Moderate-to-Severe Persistent Allergic Rhinitis (First-Line Controller)",
        protocol: "Start an Intranasal Corticosteroid (INCS) Spray: Fluticasone Propionate 2 sprays/nostril OD, Fluticasone Furoate 1–2 sprays/nostril OD, or Mometasone Furoate 2 sprays/nostril OD for ≥ 2–4 weeks (most effective medication for nasal congestion)."
      },
      {
        number: 3,
        situation: "Refractory Moderate-to-Severe Persistent Rhinitis",
        protocol: "Combine Intranasal Corticosteroid + Intranasal Antihistamine (Azelastine/Fluticasone or Olopatadine/Mometasone) or add a 2nd-generation oral antihistamine."
      },
      {
        number: 4,
        situation: "Coexisting Bronchial Asthma & Allergic Rhinitis",
        protocol: "Treat asthma per GINA guidelines + INCS; Montelukast 10 mg OD may be used as an adjunct in patients with both asthma and AR (counsel on neuropsychiatric side effects)."
      },
      {
        number: 5,
        situation: "Safety Rule",
        protocol: "Avoid 1st-generation sedating antihistamines (Chlorpheniramine, Diphenhydramine) due to sedation/impaired school/driving performance, and limit topical nasal decongestants (Oxymetazoline) to ≤ 3–5 days to prevent rhinitis medicamentosa."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Proper Nasal Spray Technique",
        detail: "Teach patient to blow nose gently, tilt head slightly forward, aim nozzle laterally toward the outer eye canthus (AWAY from the nasal septum to prevent epistaxis) using the contralateral hand, and breathe in gently."
      },
      {
        label: "Environmental Control",
        detail: "Wash bed linens weekly in hot water, encase pillows/mattresses against dust mites, and perform daily nasal saline douching."
      },
      {
        label: "Red Flags (ENT Referral)",
        detail: "Strictly unilateral nasal obstruction, recurrent unilateral epistaxis, purulent foul-smelling discharge, facial pain/swelling, anosmia, or visual/orbital changes (rule out sinonasal tumor or invasive fungal sinusitis).",
        isRedFlag: true
      }
    ]
  },

  // ==========================================================================
  // IV. INFECTIOUS, TROPICAL & ZOONOTIC DISEASES (15–28)
  // ==========================================================================
  {
    conditionNumber: 15,
    cpgId: "cpg-ptb-adults",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Pulmonary Tuberculosis in Adults (PTB)",
    societySource: "PhilCAT / PSMID / DOH NTP CPG",
    diagnostics: [
      {
        label: "Mandatory Primary Rapid Molecular Test",
        detail: "Sputum Xpert MTB/RIF (or Ultra / Truenat) for all patients with presumptive TB (cough ≥ 2 weeks, unexplained fever/night sweats, weight loss, hemoptysis, or Chest X-Ray suggestive of TB) to simultaneously confirm M. tuberculosis and Rifampicin susceptibility."
      },
      {
        label: "Baseline Pre-Treatment Workup",
        detail: "Chest X-Ray, Fasting Blood Sugar/HbA1c (mandatory bidirectional TB-DM screening), HIV Rapid Test (with counseling), Baseline ALT/AST, Bilirubin, Serum Creatinine, Serum Uric Acid, CBC, and Visual Acuity / Ishihara Color Vision test (prior to Ethambutol)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Drug-Susceptible Pulmonary TB (DS-TB) — Standard DOH NTP Regimen 1 (2HRZE / 4HR)",
        protocol: "Intensive Phase (2 Months): Daily Fixed-Dose Combination 4-FDC (Isoniazid 75 mg + Rifampicin 150 mg + Pyrazinamide 400 mg + Ethambutol 275 mg) taken on an empty stomach by weight band (30–37 kg: 2 tabs OD; 38–54 kg: 3 tabs OD; 55–70 kg: 4 tabs OD; > 70 kg: 5 tabs OD). Continuation Phase (4 Months): Daily 2-FDC (Isoniazid 75 mg + Rifampicin 150 mg) at the same weight-based tablet count OD."
      },
      {
        number: 2,
        situation: "Disseminated / CNS / Tuberculous Meningitis or Osteoarticular (Pott's) TB",
        protocol: "Regimen 1a (2HRZE / 10HR — 12 months total); add adjunctive Dexamethasone/Prednisolone taper for TB meningitis or pericarditis."
      },
      {
        number: 3,
        situation: "Neuropathy Prevention (All Patients on Isoniazid, Especially DM, HIV, Pregnant, Malnourished, CKD, or Alcohol Use)",
        protocol: "Co-prescribe Pyridoxine (Vitamin B6) 10–25 mg PO OD (50–100 mg/day if neuropathy develops)."
      },
      {
        number: 4,
        situation: "Rifampicin-Resistant / MDR-TB on Xpert MTB/RIF",
        protocol: "Do NOT start Regimen 1; refer immediately to a DOH Programmatic Management of Drug-Resistant TB (PMDT) treatment center for all-oral BPaLM / BPaL regimen."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Treatment Monitoring & Counseling",
        detail: "Obtain follow-up Sputum AFB Smear Microscopy at the end of Month 2, Month 5, and Month 6. Reassure the patient that Rifampicin turns urine, sweat, and tears orange-red (harmless), and that Rifampicin reduces the effectiveness of oral contraceptive pills (advise barrier or non-hormonal contraception). All TB diagnostics and 4-FDC/2-FDC packs are FREE at DOH TB-DOTS / RHU centers."
      },
      {
        label: "Red Flags (STOP HRZE Immediately)",
        detail: "Drug-Induced Liver Injury (jaundice, dark urine, RUQ pain, or ALT ≥ 3× ULN with symptoms / ≥ 5× ULN asymptomatic), decreased visual acuity or red-green color blindness (Ethambutol optic neuritis), or massive hemoptysis.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 16,
    cpgId: "cpg-dengue-peds",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Dengue in Children & Adults",
    societySource: "PPS / PIDSP / DOH Dengue CPG",
    diagnostics: [
      {
        label: "Early & Confirmatory Testing",
        detail: "Dengue NS1 Antigen (Days 1–5 of illness) and Dengue IgM/IgG Antibody (Day 5 onwards)."
      },
      {
        label: "Mandatory Serial Monitoring",
        detail: "Baseline and daily (or q6–12h in hospitalized patients) CBC with Hematocrit (Hct), White Blood Cell count, and Platelet Count. Watch for a rising Hematocrit ≥ 20% above baseline (hemoconcentration from plasma leakage) as fever defervesces on Days 3–7."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Group A — Dengue WITHOUT Warning Signs (Tolerating oral fluids, urinating every 4–6 hrs, no coexisting risk conditions — Outpatient)",
        protocol: "Encourage aggressive Oral Rehydration Solution (ORS 75), coconut water, soups, and fruit juices + Paracetamol 10–15 mg/kg/dose (adults 500 mg) q6h PRN for fever (max 4 g/day). Daily outpatient CBC/Hct/Platelet check until 48 hours afebrile."
      },
      {
        number: 2,
        situation: "Group B — Dengue WITH Warning Signs OR Coexisting Conditions (Pregnancy, Infancy, Elderly, DM, Obesity, Renal/Hemolytic Disease — Inpatient Ward)",
        protocol: "Obtain baseline Hct, then start isotonic IV crystalloid (0.9% NaCl or Plain Lactated Ringer's): 5–7 mL/kg/hr for 1–2 hrs → reduce to 3–5 mL/kg/hr for 2–4 hrs → reduce to 2–3 mL/kg/hr according to clinical response, Hct, and urine output (target ≥ 0.5–1.0 mL/kg/hr)."
      },
      {
        number: 3,
        situation: "Group C — Severe Dengue / Compensated Shock (Narrow pulse pressure ≤ 20 mm Hg, tachycardia, delayed capillary refill > 2 sec)",
        protocol: "Give isotonic crystalloid bolus 10–20 mL/kg over 1 hour; recheck Hct. If improving, taper IV fluids Step-Down over 24–48 hrs."
      },
      {
        number: 4,
        situation: "Group C — Hypotensive / Decompensated Dengue Shock",
        protocol: "Give 20 mL/kg isotonic crystalloid or colloid bolus over 15 minutes. If Hct rises, give second colloid bolus (10–20 mL/kg); if Hct falls abruptly from baseline, transfuse Packed RBCs (5–10 mL/kg) or Fresh Whole Blood (10–20 mL/kg) immediately for occult hemorrhage."
      },
      {
        number: 5,
        situation: "Absolute Contraindications",
        protocol: "NEVER give Aspirin, Ibuprofen, Mefenamic Acid, or other NSAIDs, IM injections, corticosteroids, or prophylactic platelet transfusions in stable non-bleeding thrombocytopenia."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Critical Phase Education",
        detail: "Warn families that the most dangerous period (Critical Phase of plasma leakage) occurs for 24–48 hours RIGHT WHEN THE FEVER DROPS (Days 3–7), not while the fever is high."
      },
      {
        label: "Red Flags (Dengue Warning Signs — Immediate ER Admission)",
        detail: "Severe abdominal pain or tenderness, persistent vomiting (≥ 3 episodes in 1 hr), mucosal bleeding (epistaxis, gum bleeding, hematemesis, melena, menorrhagia), lethargy or restlessness, clinical fluid accumulation (pleural effusion/ascites), hepatomegaly > 2 cm, or rising Hematocrit with rapid platelet drop.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 17,
    cpgId: "cpg-age-peds",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Acute Gastroenteritis in Children (AGE)",
    societySource: "PPS / PIDSP / DOH IMCI CPG",
    diagnostics: [
      {
        label: "Primary Clinical Assessment",
        detail: "Classify hydration status (No Dehydration, Some Dehydration, or Severe Dehydration) based on sensorium (alert vs. restless/irritable vs. lethargic/unconscious), sunken eyes, thirst (drinks normally vs. eagerly vs. unable to drink), and skin pinch (< 2 sec vs. slow vs. very slow ≥ 2 sec)."
      },
      {
        label: "Laboratory Workup",
        detail: "Routine stool exam/culture is NOT needed for watery diarrhea. Order Stool Microscopy / Culture only if bloody diarrhea (dysentery) or cholera (rice-water stools) is suspected; order Serum Electrolytes (Na, K), Creatinine, and RBS if Severe Dehydration."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Plan A — No Dehydration (Home Management)",
        protocol: "Give Reduced-Osmolarity ORS (75 mOsm/L Na, 245 mOsm/L total) after EVERY loose stool (< 2 yrs: 50–100 mL; ≥ 2 yrs: 100–200 mL) + continue breastfeeding and age-appropriate diet + Oral Zinc Sulfate supplementation × 10–14 days (< 6 mos: 10 mg elemental zinc OD; ≥ 6 mos: 20 mg elemental zinc OD)."
      },
      {
        number: 2,
        situation: "Plan B — Some Dehydration (Supervised 4-Hour Oral Rehydration in Clinic/ER)",
        protocol: "Administer Reduced-Osmolarity ORS at Weight (kg) × 75 mL over 4 hours in frequent small sips by spoon/cup + Zinc Sulfate. Reassess hydration status after 4 hours."
      },
      {
        number: 3,
        situation: "Plan C — Severe Dehydration (Lethargic/unconscious, unable to drink, skin pinch ≥ 2 sec — Emergency IV Resuscitation)",
        protocol: "Give IV Plain Lactated Ringer's (or 0.9% NaCl) 100 mL/kg divided as: Infants (< 12 mos): 30 mL/kg over 1 hour, then 70 mL/kg over 5 hours | Children (1–5 yrs): 30 mL/kg over 30 minutes, then 70 mL/kg over 2.5 hours. Start ORS (5 mL/kg/hr) as soon as the child can drink + Zinc Sulfate."
      },
      {
        number: 4,
        situation: "Specific Antimicrobial Indications Only (Do NOT give routine antibiotics)",
        protocol: "Bloody Diarrhea (Shigella dysentery): Ciprofloxacin 15 mg/kg PO BID × 3 days or Azithromycin 10 mg/kg OD × 3 days (or IV Ceftriaxone if hospitalized). Suspected Cholera: Azithromycin 20 mg/kg single dose (or Doxycycline in older children/adults). Confirmed Entamoeba histolytica trophozoites with ingested RBCs: Metronidazole 10 mg/kg TID × 7–10 days."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Feeding & Drug Safety",
        detail: "Do NOT withhold food or dilute milk formula during diarrhea. Avoid sports drinks, carbonated sodas, and undiluted fruit juices (high osmolarity worsens osmotic diarrhea). NEVER prescribe anti-motility drugs (Loperamide) in children (causes paralytic ileus and toxic megacolon)."
      },
      {
        label: "Red Flags",
        detail: "Lethargy, sunken fontanelle/eyes, absence of tears, no urine output for > 6–8 hours, intractable vomiting, high fever, gross blood in stool, or abdominal distension.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 18,
    cpgId: "cpg-leptospirosis-adults",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Leptospirosis",
    societySource: "PSMID / DOH Leptospirosis CPG",
    diagnostics: [
      {
        label: "Clinical Suspect Criteria",
        detail: "Acute febrile illness (≥ 2 days) with floodwater, mud, sewage, or agricultural exposure in the past 2–30 days PLUS ≥ 2 of: calf muscle tenderness (myalgia), conjunctival suffusion, oliguria/jaundice, severe headache, or meningeal signs."
      },
      {
        label: "Baseline & Organ-Function Workup",
        detail: "CBC with Platelet count, Urinalysis, Serum Creatinine, BUN, Serum Sodium & Potassium (hypokalemia is classic in non-oliguric leptospirosis), AST/ALT, Total & Direct Bilirubin, CPK-MM, Chest X-Ray, 12-Lead ECG, and Leptospira IgM / MAT / PCR (do NOT delay antibiotics while awaiting serology)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Post-Exposure Prophylaxis (PEP) After Floodwater Wading:",
        protocol: "(a) Low Risk (Single exposure, no cuts/wounds): Doxycycline 200 mg PO single dose within 24–72 hrs. (b) Moderate Risk (Single exposure WITH skin cuts/abrasions): Doxycycline 200 mg PO OD × 3–5 days. (c) High Risk (Continuous/repeated flood exposure): Doxycycline 200 mg PO once weekly until exposure ends."
      },
      {
        number: 2,
        situation: "Mild Leptospirosis (Stable vitals, anicteric, normal urine output & creatinine, no dyspnea — Outpatient)",
        protocol: "Doxycycline 100 mg PO BID × 7 days (taken with a full glass of water after meals). Alternatives (Pregnancy, Children < 8 yrs, or Doxycycline intolerance): Amoxicillin 500 mg PO q6h (or 1 g TID) × 7 days OR Azithromycin 500 mg PO OD × 3 days."
      },
      {
        number: 3,
        situation: "Moderate-to-Severe Leptospirosis / Weil's Disease (Jaundice, oliguria/AKI, hypotension, hemoptysis/dyspnea, or altered sensorium — Inpatient / ICU)",
        protocol: "Start IV Penicillin G 1.5 Million Units IV q6h OR IV Ceftriaxone 1 g IV q24h (or Cefotaxime 1 g IV q6h) × 7 days + aggressive fluid/electrolyte monitoring and early Nephrology consult."
      },
      {
        number: 4,
        situation: "Severe Pulmonary Hemorrhage Syndrome (SPHS) / ARDS",
        protocol: "Early ICU admission, lung-protective mechanical ventilation, and consider adjunctive IV Methylprednisolone pulse therapy per specialist protocol."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Prevention & Counseling",
        detail: "Advise wearing protective rubber boots and gloves when wading in floodwaters or farming, washing legs immediately with soap and clean water after flood exposure, and taking Doxycycline with food while remaining upright for 30 minutes to prevent pill esophagitis."
      },
      {
        label: "Red Flags (Immediate Hospitalization & Dialysis/ICU Readiness)",
        detail: "Decreased urine output (< 400 mL/day or < 0.5 mL/kg/hr), rising serum creatinine, icteric sclerae/jaundice, cough with blood-streaked sputum (hemoptysis), tachypnea/SpO₂ < 94%, hypotension, or Jarisch-Herxheimer reaction after initial antibiotic dose.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 19,
    cpgId: "cpg-typhoid-fever",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Typhoid Fever",
    societySource: "PSMID Typhoid Fever CPG",
    diagnostics: [
      {
        label: "Gold-Standard & Supportive Tests",
        detail: "Blood Culture (highest yield in Week 1 of step-ladder fever; obtain BEFORE starting antibiotics) + CBC with differential (classic leukopenia/normal WBC with relative lymphocytosis and eosinopenia) and ALT/AST."
      },
      {
        label: "Rapid Serology",
        detail: "Typhidot IgM (useful from Day 5 onwards as an adjunct, but interpret alongside clinical presentation; Widal test is discouraged due to poor specificity in endemic areas)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Uncomplicated Typhoid Fever (Tolerating oral intake, no danger signs — Outpatient)",
        protocol: "First-line Oral Azithromycin 1 g PO on Day 1, then 500 mg PO OD on Days 2–7 (or 1 g PO OD × 5 days; pediatric dose 10–20 mg/kg/day OD × 5–7 days) OR Oral Cefixime 200–400 mg PO BID (15–20 mg/kg/day divided BID) × 7–14 days. (If fluoroquinolone-susceptible strain is confirmed: Ciprofloxacin 500–750 mg PO BID × 7–10 days)."
      },
      {
        number: 2,
        situation: "Hospitalized / Complicated Typhoid Fever (Persistent vomiting, severe abdominal pain, high toxicity, or inability to take oral meds — Inpatient)",
        protocol: "Start IV Ceftriaxone 2 g IV OD (Adults; Pediatric: 50–75 mg/kg/day IV OD, max 2 g/day) for 10–14 days; step down to oral Azithromycin or Cefixime once afebrile for 48 hours."
      },
      {
        number: 3,
        situation: "Life-Threatening Severe Typhoid (Delirium, obtundation, stupor, coma, or shock)",
        protocol: "Add high-dose IV Dexamethasone (3 mg/kg slow IV infusion over 30 min initially, then 1 mg/kg IV q6h for 8 doses) immediately alongside IV Ceftriaxone."
      },
      {
        number: 4,
        situation: "Intestinal Perforation or Massive GI Hemorrhage (Typically Week 3 of Untreated Illness)",
        protocol: "NPO, nasogastric decompression, IV fluid resuscitation, blood transfusion, broadened anaerobic/Gram-negative coverage (add Metronidazole), and emergent surgical exploration."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Expected Fever Clearance & Diet",
        detail: "Counsel patients and families that fever in typhoid drops gradually (by lysis) over 4–5 days of effective antibiotic therapy—do NOT prematurely switch antibiotics at 48 hours if the patient is otherwise clinically stable. Advise a soft, low-fiber diet during acute illness, strict handwashing, and boiling drinking water."
      },
      {
        label: "Red Flags",
        detail: "Sudden severe abdominal pain with guarding/rigidity or loss of liver dullness (ileal perforation), melena/hematochezia, hypotension, or altered sensorium/encephalopathy.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 20,
    cpgId: "cpg-uti-uncomplicated",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Uncomplicated Urinary Tract Infection (UTI)",
    societySource: "PSMID UTI CPG",
    diagnostics: [
      {
        label: "Acute Uncomplicated Cystitis (Non-Pregnant Adult Female with Dysuria/Frequency/Urgency and NO Vaginal Discharge or Flank Pain)",
        detail: "May be diagnosed clinically; Urinalysis (> 5 WBC/hpf or positive leukocyte esterase/nitrite) supports diagnosis; Urine Culture is NOT routinely required."
      },
      {
        label: "Mandatory Urine Culture & Sensitivity (C/S) Indications",
        detail: "Acute Pyelonephritis, ALL Pregnant Women (screen at 1st prenatal visit), Complicated UTI (males, obstruction, stones, catheters, diabetes, CKD), or treatment failure/relapse."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Acute Uncomplicated Cystitis in Non-Pregnant Women (First-Line Regimens)",
        protocol: "Nitrofurantoin Macrocrystals/Monohydrate 100 mg PO BID (or Macrocrystals 100 mg PO QID) × 5 days (contraindicated if eGFR < 30 mL/min) OR Fosfomycin Trometamol 3 g sachet dissolved in water as a SINGLE PO dose. Alternative: Cefuroxime Axetil 250 mg PO BID × 5 days or Co-Amoxiclav 625 mg PO BID × 5–7 days. (Avoid empirical Ciprofloxacin and Co-trimoxazole for simple cystitis due to > 20%–40% E. coli resistance in the Philippines)."
      },
      {
        number: 2,
        situation: "Acute Uncomplicated Pyelonephritis — Mild/Moderate Outpatient (Tolerating oral fluids, hemodynamically stable)",
        protocol: "Obtain Urine C/S first, then start Ciprofloxacin 500 mg PO BID × 7 days OR Levofloxacin 750 mg PO OD × 5 days (optional initial single dose of IV Ceftriaxone 1 g before starting oral therapy) OR Cefuroxime 500 mg PO BID × 10–14 days."
      },
      {
        number: 3,
        situation: "Acute Pyelonephritis — Severe / Hospitalized (Vomiting, sepsis, pregnancy, or unstable)",
        protocol: "IV Ceftriaxone 1–2 g IV OD (or Ertapenem / Piperacillin-Tazobactam / Aminoglycoside if ESBL risk); switch to culture-guided oral therapy once afebrile for 48 hours to complete 10–14 days."
      },
      {
        number: 4,
        situation: "UTI or Asymptomatic Bacteriuria (ASB) in Pregnancy",
        protocol: "ALWAYS treat ASB in pregnancy (≥ 100,000 CFU/mL) for 5–7 days using Cefuroxime 250–500 mg BID, Cephalexin 500 mg QID, Co-Amoxiclav 625 mg BID, Fosfomycin 3 g single dose, or Nitrofurantoin (avoid Nitrofurantoin at term 38–42 wks due to neonatal G6PD hemolysis; strictly avoid Fluoroquinolones)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Stewardship Rule on Asymptomatic Bacteriuria",
        detail: "Do NOT screen for or treat Asymptomatic Bacteriuria (incidental pyuria/bacteriuria without urinary symptoms) in non-pregnant women, diabetic patients, elderly patients, or catheterized patients—only treat ASB in pregnancy and prior to urologic procedures with mucosal bleeding."
      },
      {
        label: "Red Flags",
        detail: "High-grade fever with chills/rigors, costovertebral angle (CVA) flank tenderness, intractable nausea/vomiting, hypotension/urosepsis, acute urinary retention, or UTI in pregnancy with uterine contractions.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 21,
    cpgId: "cpg-chronic-hepatitis-b",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Chronic Hepatitis B",
    societySource: "HSP / DOH Viral Hepatitis CPG",
    diagnostics: [
      {
        label: "Confirm Chronic Infection",
        detail: "HBsAg positive for > 6 months."
      },
      {
        label: "Baseline Staging & Co-Infection Workup",
        detail: "Quantitative HBV DNA viral load, HBeAg & Anti-HBe, ALT/AST, CBC with Platelet count, Bilirubin, Albumin, PT/INR, Serum Creatinine/eGFR, Anti-HCV, Anti-HIV, FIB-4 Index / FibroScan (Transient Elastography), and Baseline Liver Ultrasound + Alpha-Fetoprotein (AFP)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Decompensated OR Compensated Cirrhosis (Clinical cirrhosis, FibroScan/FIB-4 cirrhosis, or Ultrasound cirrhosis)",
        protocol: "Start lifelong oral antiviral therapy IMMEDIATELY if HBV DNA is detectable at ANY level, regardless of ALT or HBeAg status."
      },
      {
        number: 2,
        situation: "Non-Cirrhotic HBeAg-Positive OR HBeAg-Negative Chronic Hepatitis B",
        protocol: "Start antiviral therapy if HBV DNA > 20,000 IU/mL (HBeAg-positive) or > 2,000 IU/mL (HBeAg-negative) AND ALT > ULN (or significant fibrosis ≥ F2 on FibroScan/FIB-4, or family history of HCC/cirrhosis in age > 30–40 yrs)."
      },
      {
        number: 3,
        situation: "First-Line High-Barrier Nucleos(t)ide Analogues (NAs)",
        protocol: "Tenofovir Disoproxil Fumarate (TDF) 300 mg PO OD OR Entecavir (ETV) 0.5 mg PO OD on an empty stomach (1.0 mg OD in Lamivudine-experienced or decompensated cirrhosis) OR Tenofovir Alafenamide (TAF) 25 mg PO OD (preferred if eGFR < 60 mL/min, bone disease/osteoporosis, or age > 60 yrs)."
      },
      {
        number: 4,
        situation: "Prevention of Mother-to-Child Transmission (PMTCT in HBsAg-Positive Pregnant Women)",
        protocol: "If maternal HBV DNA > 200,000 IU/mL (or HBeAg-positive), start Maternal TDF 300 mg PO OD at 24–28 weeks AOG. For ALL infants born to HBsAg(+) mothers: administer Hepatitis B Birth-Dose Vaccine + Hepatitis B Immunoglobulin (HBIG 0.5 mL IM) in opposite thighs within ≤ 12–24 hours of birth."
      },
      {
        number: 5,
        situation: "Immunosuppression / Chemotherapy Prophylaxis",
        protocol: "Start TDF or Entecavir prophylaxis in HBsAg(+) patients prior to chemotherapy, Rituximab, or high-dose steroids."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "HCC Surveillance & Household Protection",
        detail: "Perform Liver Ultrasound + Serum AFP every 6 months in all cirrhotic patients, patients with a family history of HCC, and Asian males > 40 yrs / females > 50 yrs. Screen all household and sexual contacts with HBsAg and Anti-HBs and vaccinate seronegative contacts. Never abruptly stop TDF/ETV (causes fatal hepatic flares)."
      },
      {
        label: "Red Flags",
        detail: "Jaundice, ascites, pedal edema, hematemesis/melena (variceal bleeding), confusion/asterixis (hepatic encephalopathy), or a new liver mass/rising AFP.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 22,
    cpgId: "cpg-hiv-sti",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "HIV & Sexually Transmitted Infections",
    societySource: "DOH AO 2022-0024 / PSMID CPG",
    diagnostics: [
      {
        label: "HIV Diagnosis & Baseline Hub Workup",
        detail: "Voluntary confidential HIV Rapid Diagnostic Test (confirmed by rHIVda algorithm) → Baseline CD4 count, HIV Viral Load, Sputum Xpert MTB/RIF + Chest X-Ray (screen every PLHIV for active TB!), HBsAg, Anti-HCV, RPR/Syphilis RDT, Serum Creatinine, CBC, andALT."
      },
      {
        label: "STI Workup",
        detail: "NAAT or Gram stain for urethral/cervical discharge; RPR/VDRL + Treponemal test for syphilis."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Newly Diagnosed HIV (Treat-All Policy — Rapid ART within ≤ 7 Days)",
        protocol: "Once active TB meningitis and cryptococcal meningitis are excluded, initiate 1st-Line Fixed-Dose Combination TLD: Tenofovir Disoproxil Fumarate 300 mg + Lamivudine 300 mg + Dolutegravir 50 mg (1 tablet PO OD). (If on Rifampicin for TB co-infection, add an extra Dolutegravir 50 mg dose 12 hours after TLD so Dolutegravir is taken 50 mg BID)."
      },
      {
        number: 2,
        situation: "Opportunistic Infection Prophylaxis & TPT in PLHIV",
        protocol: "If CD4 ≤ 200 cells/mm³ (or WHO Stage 3/4), start Co-trimoxazole (TMP-SMX) 800/160 mg (1 forte tab) PO OD for PCP & Toxoplasmosis prophylaxis. If active TB is ruled out, give Tuberculosis Preventive Treatment (TPT: 3HP [weekly Isoniazid + Rifapentine × 12 doses] or 6H + Pyridoxine)."
      },
      {
        number: 3,
        situation: "Uncomplicated Anogenital / Pharyngeal Gonorrhea & Chlamydia (Dual Therapy)",
        protocol: "Ceftriaxone 500 mg IM single dose (1 g IM if weight ≥ 150 kg) + Doxycycline 100 mg PO BID × 7 days (or Azithromycin 1 g PO single dose in pregnancy)."
      },
      {
        number: 4,
        situation: "Syphilis (Treponema pallidum)",
        protocol: "Primary, Secondary, or Early Latent (< 1 yr): Benzathine Penicillin G 2.4 Million Units IM single dose (split 1.2 MU into each buttock). Late Latent (> 1 yr) or Unknown Duration: Benzathine Penicillin G 2.4 MU IM once weekly × 3 consecutive weeks (7.2 MU total). (In pregnancy, Penicillin G is the ONLY regimen that prevents congenital syphilis)."
      },
      {
        number: 5,
        situation: "HIV Pre-Exposure (PrEP) & Post-Exposure Prophylaxis (PEP)",
        protocol: "PrEP: TDF/FTC 300/200 mg PO OD (or 2-1-1 event-driven for cisgender MSM). PEP (within ≤ 72 hrs of exposure): TLD 1 tab PO OD × 28 days."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Confidentiality, Partner Management & Access",
        detail: "Strictly uphold RA 11166 (Philippine HIV and AIDS Policy Act) confidentiality; treat all sexual partners of STI patients within the past 60 days to prevent reinfection. Refer PLHIV to DOH Treatment Hubs (free TLD, Viral Load, CD4, and PhilHealth OHAT package)."
      },
      {
        label: "Red Flags",
        detail: "Subacute progressive dyspnea with exertional desaturation (PCP pneumonia), severe headache/neck stiffness/photophobia (Cryptococcal or TB meningitis), visual floaters/blindness (CMV retinitis), or Jarisch-Herxheimer reaction post-penicillin.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 23,
    cpgId: "cpg-measles-rubeola",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Measles (Rubeola)",
    societySource: "PIDSP / PPS / DOH Measles CPG",
    diagnostics: [
      {
        label: "Clinical Case Identification (Immediate Notification)",
        detail: "Fever + generalized maculopapular rash (cephalocaudal spread starting behind the ears/hairline) + ≥ 1 of the \"3 Cs\": Cough, Coryza, or Conjunctivitis (plus pathognomonic Koplik spots on buccal mucosa)."
      },
      {
        label: "Surveillance Lab",
        detail: "Collect Serum for Measles-Specific IgM ELISA and notify the City/Municipal Epidemiology & Surveillance Unit (CESU/MESU) within 24 hours (Category 1 Notifiable Disease under RA 11332)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Mandatory Vitamin A Megadose Therapy (Give to ALL Children with Measles on Day 1 & Day 2 to Reduce Mortality by 50%)",
        protocol: "Infants < 6 months: 50,000 IU PO on Day 1 and Day 2 | Infants 6–11 months: 100,000 IU PO on Day 1 and Day 2 | Children ≥ 12 months: 200,000 IU PO on Day 1 and Day 2. (Give a 3rd dose 2–4 weeks later if clinical signs of Vitamin A deficiency/xerophthalmia are present)."
      },
      {
        number: 2,
        situation: "Uncomplicated Measles (No pneumonia, no dehydration, feeding well — Home Airborne Isolation)",
        protocol: "Vitamin A megadose (Days 1 & 2) + Paracetamol 10–15 mg/kg/dose q4–6h PRN for fever (NEVER give Aspirin — Reye syndrome risk) + ORS/fluids + clean eye discharge with clean water (apply Tetracycline 1% eye ointment if purulent conjunctivitis)."
      },
      {
        number: 3,
        situation: "Measles Complicated by Non-Severe Pneumonia or Acute Otitis Media",
        protocol: "Add High-Dose Oral Amoxicillin (80–90 mg/kg/day divided BID–TID × 5–7 days) + Vitamin A."
      },
      {
        number: 4,
        situation: "Severe Complicated Measles (Severe Pneumonia, Stridor/Croup, Severe Dehydration, Corneal Ulceration, Encephalitis, or Severe Malnutrition — Hospital Airborne Isolation)",
        protocol: "Admit to Airborne Isolation Room; give O₂ + IV Ampicillin/Ceftriaxone (+ Oxacillin/Clindamycin if Staphylococcal pneumonia) + Vitamin A on Days 1, 2, and 14 + Zinc Sulfate if diarrhea."
      },
      {
        number: 5,
        situation: "Post-Exposure Prophylaxis for Susceptible Contacts",
        protocol: "Measles/MMR vaccine within ≤ 72 hours of exposure (if ≥ 6 mos old); Intramuscular Immunoglobulin (IG) within ≤ 6 days for pregnant women, immunocompromised contacts, or infants < 6 mos."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Airborne Isolation & Nutrition",
        detail: "Isolate the patient from onset of prodrome until 4 days after rash appearance (entire duration if immunocompromised). Maintain high-calorie feeding because measles causes post-infectious immune amnesia and severe malnutrition. Ensure routine DOH EPI vaccination (MMR at 9 mos and 12 mos)."
      },
      {
        label: "Red Flags",
        detail: "Fast breathing or chest indrawing, inspiratory stridor at rest, corneal clouding/ulceration (keratomalacia), lethargy, seizures (measles encephalitis), or inability to drink/breastfeed.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 24,
    cpgId: "cpg-tetanus",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Tetanus",
    societySource: "PSMID / DOH Tetanus CPG",
    diagnostics: [
      {
        label: "100% Clinical Diagnosis (Never Delay Treatment for Labs)",
        detail: "Acute onset of trismus (lockjaw), risus sardonicus, painful generalized muscle rigidity (board-like abdomen), and reflex spasms (opisthotonus) triggered by light/noise/touch in a conscious patient, often following a puncture wound (nail, bamboo, rust, road rash) or unsterile umbilical cord care (Neonatal Tetanus)."
      },
      {
        label: "Bedside Test",
        detail: "Spatula Test (touching posterior pharynx elicits reflex bite on the blade rather than gagging)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Step 1 — Neutralize Unbound Toxin (BEFORE Wound Debridement)",
        protocol: "Administer Human Tetanus Immunoglobulin (HTIG) 500 IU IM single dose (can infiltrate part around the wound and inject the rest gluteally). If HTIG is unavailable, give Equine Anti-Tetanus Serum (ATS) 3,000–5,000 IU IM after intradermal skin test (keep Epinephrine 1:1,000 at bedside) + Administer Tetanus Toxoid (Td or Tdap) 0.5 mL IM at a SEPARATE anatomical site (opposite deltoid)."
      },
      {
        number: 2,
        situation: "Step 2 — Eradicate Clostridium tetani & Debride Wound",
        protocol: "Start IV Metronidazole 500 mg IV q6h (or q8h; Pediatric: 30 mg/kg/day divided q6h) × 7–10 days (preferred over Penicillin G, which is a GABA antagonist that can worsen spasms). Perform thorough surgical wound debridement 1–2 hours after HTIG administration."
      },
      {
        number: 3,
        situation: "Step 3 — Control Muscle Spasms & Autonomic Instability (Dark, Quiet ICU Room)",
        protocol: "Titrate IV Diazepam (0.1–0.3 mg/kg IV q1–4h or continuous IV Midazolam infusion) PLUS IV Magnesium Sulfate (loading dose 40–70 mg/kg [2–4 g in adults] over 30 min, followed by 1–2 g/hr continuous infusion titrated to abolish spasms while preserving patellar reflex). Add IV Labetalol for sympathetic storms."
      },
      {
        number: 4,
        situation: "Step 4 — Early Airway Protection",
        protocol: "Perform early endotracheal intubation or tracheostomy in moderate-to-severe tetanus BEFORE laryngospasm causes anoxic cardiac arrest."
      },
      {
        number: 5,
        situation: "Wound Prophylaxis in Emergency Triage",
        protocol: "Clean minor wound: Give Td/Tdap if < 3 prior doses or last booster > 10 yrs ago. Dirty/tetanus-prone wound: Give Td/Tdap if < 3 doses or last booster > 5 yrs ago + add HTIG 250 IU IM if < 3 prior doses or unknown vaccine history."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Mandatory Full Vaccination After Recovery",
        detail: "Clinical tetanus infection does NOT confer natural immunity because the lethal toxin dose is too small to trigger an immune response—every survivor MUST complete a full 3-dose primary Td/Tdap series (at 0, 1, and 6 months). Promote maternal Td immunization during pregnancy to eliminate Neonatal Tetanus."
      },
      {
        label: "Red Flags (Poor Prognostic Indicators)",
        detail: "Incubation period < 7 days, period of onset (first trismus to first generalized spasm) < 48 hours, laryngospasm/apnea, or labile BP/tachycardia (autonomic storm).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 25,
    cpgId: "cpg-sth-parasitism",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Soil-Transmitted Helminthiasis (Intestinal Parasitism)",
    societySource: "DOH IHCP / PSMID CPG",
    diagnostics: [
      {
        label: "Confirmatory Test",
        detail: "Direct Fecal Smear (DFS) and Kato-Katz Quantitative Technique (gold standard to identify and quantify ova of Ascaris lumbricoides, Trichuris trichiura, and Hookworm [Ancylostoma/Necator])."
      },
      {
        label: "Supportive Workup",
        detail: "CBC with differential (eosinophilia during larval migration; microcytic hypochromic anemia in chronic hookworm/trichuriasis)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Ascaris lumbricoides or Hookworm Infection / Routine Mass Drug Administration (Children ≥ 24 mos & Adults)",
        protocol: "Albendazole 400 mg PO single dose (chewable tablet) OR Mebendazole 500 mg PO single dose (or 100 mg PO BID × 3 days)."
      },
      {
        number: 2,
        situation: "Young Children Aged 12–23 Months",
        protocol: "Albendazole 200 mg PO (½ of a 400 mg chewable tablet crushed and mixed with water) single dose OR Mebendazole 500 mg single dose."
      },
      {
        number: 3,
        situation: "Moderate-to-Heavy Trichuris trichiura (Whipworm) Infection",
        protocol: "Single-dose therapy has low cure rates for whipworm; prescribe Albendazole 400 mg PO OD × 3 consecutive days OR Mebendazole 100 mg PO BID × 3 consecutive days (add Ivermectin 200 mcg/kg/day if refractory)."
      },
      {
        number: 4,
        situation: "Strongyloides stercoralis Infection",
        protocol: "Ivermectin 200 mcg/kg PO OD × 2 days (alternative: Albendazole 400 mg PO BID × 7 days)."
      },
      {
        number: 5,
        situation: "Enterobius vermicularis (Pinworm — Perianal Pruritus)",
        protocol: "Albendazole 400 mg PO single dose (or Mebendazole 100 mg PO single dose) AND REPEAT in 2 weeks; treat all household members simultaneously."
      },
      {
        number: 6,
        situation: "Pregnant Women (2nd or 3rd Trimester in Hookworm-Endemic Areas)",
        protocol: "Albendazole 400 mg or Mebendazole 500 mg PO single dose AFTER the 1st trimester (contraindicated in the 1st trimester) + Iron/Folate supplementation."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "WASH & Deworming Counseling",
        detail: "Instruct parents to have children chew Albendazole tablets thoroughly before swallowing with water to prevent choking. Enforce wearing slippers/footwear outdoors (prevents hookworm larval skin penetration), washing hands and vegetables, and participating in DOH Biannual Mass Deworming (January & July)."
      },
      {
        label: "Red Flags (Surgical / Hospital Referral)",
        detail: "Bilious vomiting, severe colicky abdominal pain, abdominal distension, palpable \"ball of worms,\" or passage of worms per orem/nostrils (Ascaris intestinal obstruction or hepatobiliary ascariasis), rectal prolapse (heavy Trichuris), or severe anemia with heart failure.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 26,
    cpgId: "cpg-schistosomiasis",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Schistosomiasis (Schistosoma japonicum)",
    societySource: "DOH SCEP / PSMID CPG",
    diagnostics: [
      {
        label: "Confirmatory Parasitologic Test",
        detail: "Kato-Katz Stool Examination (minimum 2–3 slides across consecutive days) demonstrating characteristic oval, laterally knobbed S. japonicum eggs."
      },
      {
        label: "Organ & Complication Workup",
        detail: "Hepatobiliary Ultrasound (pathognomonic \"fish-scale\" or \"network/turtle-back\" Symmers pipestem periportal fibrosis, splenomegaly, portal vein dilation), CBC (pancytopenia from hypersplenism, eosinophilia), LFTs, and Brain/Spinal MRI with contrast if Neuroschistosomiasis (seizures/myelopathy) is suspected."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Confirmed Uncomplicated S. japonicum Infection (Higher Dose Required for S. japonicum than S. mansoni)",
        protocol: "Praziquantel 60 mg/kg/day PO divided into 2 or 3 doses (taken 4–6 hours apart on the same day, e.g., 30 mg/kg × 2 doses or 20 mg/kg × 3 doses) immediately AFTER a full carbohydrate meal."
      },
      {
        number: 2,
        situation: "DOH Mass Drug Administration (MDA) / Preventive Chemotherapy in Endemic Barangays (Leyte, Samar, Mindoro, Sorsogon, Bohol, Caraga, Davao, SOCCSKSARGEN, BARMM)",
        protocol: "Praziquantel 40 mg/kg PO (single or split dose after meals) using a height/weight dosing pole for residents aged ≥ 5 years (safe in pregnancy and lactation per WHO/DOH)."
      },
      {
        number: 3,
        situation: "Neuroschistosomiasis (Cerebral Seizures or Transverse Myelitis)",
        protocol: "ALWAYS start Corticosteroids (Dexamethasone or Prednisone 1 mg/kg/day) FIRST before giving Praziquantel (60 mg/kg/day × 3–5 days) + Antiepileptic drugs (e.g., Levetiracetam) to prevent fatal paradoxical perilesional cerebral edema from dying ova."
      },
      {
        number: 4,
        situation: "Acute Schistosomiasis (Katayama Syndrome — 2–8 weeks post-freshwater exposure)",
        protocol: "Oral Prednisone (20–40 mg/day × 5–7 days) to suppress hypersensitivity reaction, followed by Praziquantel 60 mg/kg, and repeat Praziquantel 4–6 weeks later once juvenile schistosomula mature."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Administration & Follow-Up",
        detail: "Always give Praziquantel AFTER a full meal to maximize bioavailability and minimize transient dizziness, nausea, or abdominal cramps (caused by dying adult flukes in mesenteric veins). Repeat Kato-Katz stool exam 4–6 weeks post-treatment to verify cure. Advise avoiding wading in Oncomelania hupensis quadrasi snail-infested freshwater canals/streams."
      },
      {
        label: "Red Flags",
        detail: "Hematemesis or melena (esophageal variceal bleeding from non-cirrhotic portal hypertension), massive ascites, new-onset focal seizures, increased ICP, or acute paraparesis/urinary retention.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 27,
    cpgId: "cpg-malaria",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Malaria",
    societySource: "DOH NMCEP / PSMID Malaria CPG",
    diagnostics: [
      {
        label: "Mandatory Parasitologic Confirmation Before Treatment",
        detail: "Thick and Thin Peripheral Blood Smears stained with Giemsa (gold standard for parasite density % parasitemia and species identification: P. falciparum, P. vivax, P. malariae, P. ovale, or zoonotic P. knowlesi) AND/OR Malaria Rapid Diagnostic Test (RDT: PfHRP2/pLDH). Screen all febrile patients with travel/residence in Palawan or Sultan Kudarat."
      },
      {
        label: "Additional Lab",
        detail: "G6PD Screening before giving Primaquine; CBC, RBS, Creatinine, Bilirubin, and Blood Gas/Lactate if severe."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Uncomplicated Plasmodium falciparum (or Mixed P. falciparum + P. vivax)",
        protocol: "First-line Artemether-Lumefantrine (AL: 20 mg / 120 mg FDC tablet) PO BID × 3 days (6 doses total at 0, 8, 24, 36, 48, and 60 hrs; adults ≥ 35 kg take 4 tablets per dose WITH food/milk to ensure Lumefantrine absorption) PLUS Single-Dose Primaquine (0.25 mg base/kg PO on Day 1 to kill gametocytes and block mosquito transmission; omit Primaquine in pregnancy and infants < 6 mos). (If mixed infection, give full 14-day Primaquine radical cure)."
      },
      {
        number: 2,
        situation: "Uncomplicated Plasmodium vivax or P. ovale",
        protocol: "Chloroquine (25 mg base/kg total over 3 days: 10 mg/kg Day 1, 10 mg/kg Day 2, 5 mg/kg Day 3) OR Artemether-Lumefantrine × 3 days PLUS Radical Cure with Primaquine (0.25–0.5 mg base/kg PO OD × 14 days to eradicate dormant liver hypnozoites after confirming normal G6PD; if G6PD-deficient, give 0.75 mg base/kg once weekly × 8 weeks under supervision)."
      },
      {
        number: 3,
        situation: "Uncomplicated P. malariae or P. knowlesi",
        protocol: "Artemether-Lumefantrine × 3 days (or Chloroquine × 3 days; no Primaquine needed; monitor P. knowlesi closely as it replicates every 24 hrs and rapidly turns severe)."
      },
      {
        number: 4,
        situation: "Uncomplicated Malaria in Pregnancy (All Trimesters)",
        protocol: "Artemether-Lumefantrine × 3 days is now WHO/DOH-recommended even in the 1st Trimester (Primaquine is strictly contraindicated throughout pregnancy)."
      },
      {
        number: 5,
        situation: "Severe / Cerebral Malaria (Any Species — Medical Emergency)",
        protocol: "Start Parenteral Artesunate 2.4 mg/kg IV/IM (3.0 mg/kg if weight < 20 kg) at 0 hr, 12 hr, and 24 hr, then once daily until able to swallow, followed by a complete 3-day oral Artemether-Lumefantrine course."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Monitoring & Prevention",
        detail: "Repeat blood smears on Days 3, 7, 14, 21, and 28 to verify parasite clearance. Advise sleeping under Long-Lasting Insecticidal Nets (LLINs) and using DEET repellent in Palawan/Mindanao forest fringes. All anti-malarials are FREE at DOH Malaria Centers."
      },
      {
        label: "Red Flags (Severe Malaria Criteria)",
        detail: "Impaired consciousness/coma (GCS < 11), generalized seizures, prostration, hypoglycemia (CBG < 40 mg/dL), severe anemia (Hb < 7 g/dL), acute kidney injury, hemoglobinuria (\"blackwater fever\"), pulmonary edema, shock, or hyperparasitemia (> 2%–5%).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 28,
    cpgId: "cpg-rabies-pep",
    sectionGroup: "IV. Infectious, Tropical & Zoonotic Diseases",
    title: "Animal Bites & Rabies Post-Exposure Prophylaxis (PEP)",
    societySource: "DOH NRPCP / PSMID CPG",
    diagnostics: [
      {
        label: "Clinical Exposure Categorization (No Lab Test Delays PEP!)",
        detail: "Classify immediately into Category I (Touching/feeding animal or licks on intact skin — no exposure), Category II (Nibbling of uncovered skin, minor scratches/abrasions WITHOUT bleeding), or Category III (Single or multiple transdermal bites/scratches WITH spontaneous or induced bleeding, licks on broken skin/mucous membranes, ANY bite on the head, face, neck, hands, or genitalia, or ANY bat exposure)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Immediate Wound Care (Mandatory for ALL Category II & III Exposures)",
        protocol: "Wash and flush all bite/scratch wounds vigorously under running water with soap or detergent for AT LEAST 15 MINUTES, then apply povidone-iodine or 70% alcohol. Do NOT scrub violently, do NOT apply garlic/tandok/vinegar, and AVOID primary wound suturing (if suturing is unavoidable for hemostasis/cosmesis, infiltrate RIG into the wound first and wait 1–2 hours before placing loose interrupted sutures)."
      },
      {
        number: 2,
        situation: "Category I Exposure",
        protocol: "Wash exposed skin with soap and water; NO rabies vaccine or RIG required."
      },
      {
        number: 3,
        situation: "Category II Exposure",
        protocol: "Wound care + Start Active Rabies Vaccine immediately: Updated Philippine IPC Intradermal (ID) Regimen (0.1 mL ID at 2 deltoid sites on Days 0, 3, and 7 [2-2-2-0-0]; DOH ABTCs may also add Day 28 [2-2-2-0-2] if animal is unavailable for 14-day observation) OR Intramuscular (IM) Essen Regimen (1 full vial IM deltoid on Days 0, 3, 7, 14, and 28; NEVER inject rabies vaccine in the gluteal/buttock area!)."
      },
      {
        number: 4,
        situation: "Category III Exposure",
        protocol: "Wound care + Active Rabies Vaccine (ID or IM) PLUS Rabies Immunoglobulin (RIG): HRIG 20 IU/kg OR ERIG (F(ab')2) 40 IU/kg infiltrated deeply into and around all wounds on Day 0 (if Day 0 was missed, RIG may still be given up to Day 7 after the first vaccine dose, never after Day 7)."
      },
      {
        number: 5,
        situation: "Previously Immunized Patient (Documented Complete Pre-P or PEP)",
        protocol: "NO RIG required. Give Booster Rabies Vaccine on Day 0 and Day 3 (0.1 mL ID or 1 vial IM) OR 4-site ID on Day 0."
      },
      {
        number: 6,
        situation: "Adjunctive Tetanus & Antibiotic Prophylaxis",
        protocol: "Give Td/Tdap + HTIG per wound tetanus status; prescribe Co-Amoxiclav 625 mg PO TID × 5–7 days for cat bites, deep puncture wounds, hand/face/genital bites, or crushed tissue."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Zero Contraindications & Animal Observation",
        detail: "Because clinical rabies is 100% fatal, pregnancy, lactation, infancy, and concurrent illness are NEVER contraindications to Rabies Vaccine or RIG. Observe domestic dogs/cats safely in a cage for 14 days. Strongly condemn faith-healer \"tandok\" (horn/stone suction). Refer patients to DOH-accredited Animal Bite Treatment Centers (ABTCs) for PhilHealth Animal Bite Package coverage."
      },
      {
        label: "Red Flags",
        detail: "Biting dog/cat dies, disappears, or shows erratic/rabid behavior within 14 days; patient develops paresthesia/pain at healed bite site, hydrophobia, aerophobia, or agitation (clinical rabies); or spreading wound cellulitis/abscess.",
        isRedFlag: true
      }
    ]
  },

  // ==========================================================================
  // V. MATERNAL, NEONATAL & PEDIATRIC SPECIAL CARE (29–32)
  // ==========================================================================
  {
    conditionNumber: 29,
    cpgId: "cpg-preeclampsia-eclampsia",
    sectionGroup: "V. Maternal, Neonatal & Pediatric Special Care",
    title: "Preeclampsia & Eclampsia",
    societySource: "POGS Hypertension in Pregnancy CPG",
    diagnostics: [
      {
        label: "Confirm Diagnosis (After 20 Weeks AOG)",
        detail: "BP ≥ 140/90 mm Hg on 2 occasions ≥ 4 hours apart PLUS Proteinuria (≥ 300 mg/24-hr urine, UPCR ≥ 0.3, or dipstick ≥ +2) OR any Severe Feature even without proteinuria."
      },
      {
        label: "Severe Features & Labs",
        detail: "Order CBC with Platelet count (< 100,000/mm³ = severe/HELLP), AST/ALT (≥ 2× ULN = severe), Serum Creatinine (> 1.1 mg/dL = severe), LDH, Uric Acid, Urinalysis/UPCR, and Fetal NST/Biophysical Profile + Umbilical Artery Doppler."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Prevention in High-Risk Pregnant Women (Prior preeclampsia, multifetal gestation, chronic HTN, DM, CKD, SLE, or ≥ 2 moderate risk factors)",
        protocol: "Prescribe Low-Dose Aspirin 81–150 mg PO OD at bedtime starting at 12–16 weeks AOG until 36 weeks + Calcium Carbonate 1.5–2.0 g elemental calcium/day."
      },
      {
        number: 2,
        situation: "Preeclampsia WITHOUT Severe Features (< 37 Weeks AOG)",
        protocol: "Expectant management with twice-weekly maternal BP/symptom/lab checks and fetal surveillance; start oral maintenance antihypertensive if BP ≥ 140/90 mm Hg (Methyldopa 250–500 mg BID–TID, Labetalol 100–400 mg BID–TID, or Extended-Release Nifedipine 30–60 mg OD; ACEi/ARBs are strictly CONTRAINDICATED). Deliver at 37 0/7 weeks."
      },
      {
        number: 3,
        situation: "Preeclampsia WITH Severe Features OR Eclampsia — Step A: Magnesium Sulfate (MgSO₄) Seizure Prophylaxis/Treatment",
        protocol: "Give IV Loading Dose 4 g MgSO₄ (diluted in 100 mL IVF infused over 15–20 min), followed by 1–2 g/hr continuous IV maintenance infusion (OR Pritchard IM Regimen at RHUs without infusion pumps: 4 g slow IV + 10 g IM [5 g in each buttock with 2% Lidocaine], then 5 g IM q4h in alternate buttocks) until 24 hours postpartum. If recurrent eclamptic seizure occurs, give an additional 2 g MgSO₄ IV over 5 min."
      },
      {
        number: 4,
        situation: "Step B: Acute Severe Hypertension (BP ≥ 160/110 mm Hg — Treat Within 30–60 Minutes to Prevent Maternal Stroke)",
        protocol: "Oral Immediate-Release Nifedipine 10 mg PO (repeat q20min up to 30 mg) OR IV Hydralazine 5–10 mg IV q20min OR IV Labetalol 20 mg → 40 mg → 80 mg IV q10–20min (or IV Nicardipine). Target BP: 140–150 / 90–100 mm Hg."
      },
      {
        number: 5,
        situation: "Step C: Definitive Delivery Timing in Severe Preeclampsia",
        protocol: "Deliver at ≥ 34 0/7 weeks after maternal stabilization (or immediately at any AOG if eclampsia, pulmonary edema, abruption, DIC, HELLP, or non-reassuring fetal status). If < 34 weeks, give Dexamethasone 6 mg IM q12h × 4 doses for fetal lung maturity."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Mandatory Hourly MgSO₄ Toxicity Monitoring",
        detail: "Before every repeat dose/hour of MgSO₄, verify: (1) Present Patellar Deep Tendon Reflexes (loss of reflex is the first sign of toxicity at 8–10 mEq/L), (2) Respiratory Rate ≥ 12–16 cpm, and (3) Urine Output ≥ 30 mL/hr. Keep the antidote Calcium Gluconate 10% (10 mL / 1 g slow IV over 3–5 min) at the bedside at all times. Avoid NSAIDs postpartum in severe preeclampsia."
      },
      {
        label: "Red Flags",
        detail: "Severe persistent headache, visual blurring/scotomata, severe RUQ/epigastric pain, dyspnea/SpO₂ < 94%, oliguria, vaginal bleeding (abruptio placentae), or generalized tonic-clonic seizures.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 30,
    cpgId: "cpg-kawasaki-disease",
    sectionGroup: "V. Maternal, Neonatal & Pediatric Special Care",
    title: "Kawasaki Disease",
    societySource: "PPS / PSPC Kawasaki Disease CPG",
    diagnostics: [
      {
        label: "Complete Kawasaki Criteria",
        detail: "Fever ≥ 5 days PLUS ≥ 4 of 5 principal features: (1) Bilateral bulbar non-exudative conjunctival injection, (2) Oral mucosal changes (strawberry tongue, cracked red lips), (3) Polymorphous rash (erythema/induration of BCG scar is a classic clue in Filipino infants!), (4) Extremity changes (erythema/edema of hands & feet; periungual desquamation in week 2–3), (5) Cervical lymphadenopathy (≥ 1.5 cm, usually unilateral)."
      },
      {
        label: "Incomplete KD & Mandatory Workup",
        detail: "Suspect Incomplete KD in any infant/child with Fever ≥ 5 days and 2–3 features if CRP ≥ 3.0 mg/dL and/or ESR ≥ 40 mm/hr plus ≥ 3 lab criteria (anemia, platelets ≥ 450,000 after Day 7, albumin ≤ 3.0 g/dL, elevated ALT, WBC ≥ 15,000, or sterile pyuria ≥ 10 WBC/hpf). Order 2D Echocardiography (at baseline, 1–2 weeks, and 4–6 weeks; never delay IVIG for Echo!)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Acute Phase Standard Therapy (Ideally Within ≤ 10 Days of Fever Onset to Prevent Coronary Artery Aneurysms)",
        protocol: "Administer Intravenous Immunoglobulin (IVIG) 2 g/kg as a SINGLE IV infusion over 10–12 hours PLUS Moderate-to-High-Dose Aspirin (30–50 mg/kg/day or 80–100 mg/kg/day PO divided QID) until the child has been afebrile for 48–72 hours."
      },
      {
        number: 2,
        situation: "Subacute / Convalescent Phase (Once Afebrile for 48–72 Hours)",
        protocol: "Step down to Low-Dose Antiplatelet Aspirin (3–5 mg/kg/day PO OD) and continue for 6–8 weeks (discontinue at 6–8 weeks ONLY if the 6-week 2D Echo confirms completely normal coronary arteries; continue indefinitely if coronary aneurysms persist)."
      },
      {
        number: 3,
        situation: "Delayed Presentation (> 10 Days of Illness)",
        protocol: "Still administer IVIG 2 g/kg + Aspirin if the child has persistent fever, elevated ESR/CRP, or coronary artery dilation on Echo."
      },
      {
        number: 4,
        situation: "IVIG-Resistant Kawasaki Disease (Persistent or recrudescent fever ≥ 36 hours after completing initial IVIG infusion — 10%–20% of cases)",
        protocol: "Administer a Second Dose of IVIG (2 g/kg IV over 10–12 hrs) OR IV Methylprednisolone pulse (30 mg/kg/day × 1–3 days) OR Infliximab (5 mg/kg IV) under Pediatric Cardiology/Rheumatology care."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Vaccine & Reye Syndrome Counseling",
        detail: "Defer live-attenuated viral vaccines (MMR and Varicella) for 11 months after high-dose IVIG (IVIG antibodies neutralize live vaccines). Give inactivated annual Influenza vaccine while on Aspirin, and temporarily switch Aspirin to Clopidogrel if exposed to varicella/influenza to prevent Reye syndrome."
      },
      {
        label: "Red Flags",
        detail: "Persistent fever ≥ 36 hours post-IVIG, Coronary Artery Z-score ≥ 2.5 (aneurysm) or Giant Aneurysm (Z ≥ 10 or ≥ 8 mm), hypotension/poor perfusion (Kawasaki Disease Shock Syndrome), or myocarditis/gallbladder hydrops.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 31,
    cpgId: "cpg-arf-rhd",
    sectionGroup: "V. Maternal, Neonatal & Pediatric Special Care",
    title: "Acute Rheumatic Fever & Rheumatic Heart Disease (with GAS Pharyngitis)",
    societySource: "PHA / PSPC / PIDSP CPG",
    diagnostics: [
      {
        label: "Primary Prevention (GAS Pharyngitis)",
        detail: "Apply Centor/McIsaac Score; confirm with Throat Swab Culture or Rapid Antigen Detection Test (RADT) in children 5–15 yrs without viral symptoms (no cough/coryza)."
      },
      {
        label: "ARF Diagnosis (2015 Revised Jones Criteria for Endemic High-Risk Philippines)",
        detail: "Evidence of preceding Group A Streptococcal infection (elevated ASO titer, anti-DNase B, or positive throat culture) PLUS 2 Major OR 1 Major + 2 Minor Criteria. High-Risk Major Criteria: Carditis (clinical OR subclinical valvulitis on 2D Echo), Monoarthritis, Polyarthritis, OR Polyarthralgia, Chorea (Sydenham), Erythema marginatum, Subcutaneous nodules. High-Risk Minor Criteria: Monoarthralgia, Fever ≥ 38.0°C, ESR ≥ 30 mm/hr and/or CRP ≥ 3.0 mg/dL, Prolonged PR interval on 12-Lead ECG. Mandatory Test: 2D Echocardiography with Doppler in all suspected ARF cases."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Primary Prevention (Acute Streptococcal Tonsillopharyngitis — Eradicate GAS to Prevent ARF)",
        protocol: "Single-dose Benzathine Penicillin G IM (< 27 kg: 600,000 U IM; ≥ 27 kg: 1.2 Million U IM) OR Oral Phenoxymethylpenicillin (Penicillin V) 250 mg (children) to 500 mg (adolescents/adults) PO BID–TID × 10 FULL days OR Oral Amoxicillin 50 mg/kg/day (max 1,000 mg/day) PO OD or divided BID × 10 FULL days. (If Penicillin-allergic: Azithromycin 12 mg/kg OD × 5 days or Cephalexin × 10 days)."
      },
      {
        number: 2,
        situation: "Acute Rheumatic Fever (ARF) — Step A: Eradicate Residual GAS (Even if Throat Culture is Negative)",
        protocol: "Administer Benzathine Penicillin G IM single dose (or 10 days of oral Penicillin V/Amoxicillin)."
      },
      {
        number: 3,
        situation: "ARF — Step B: Anti-Inflammatory & Heart Failure Management",
        protocol: "Arthritis / Arthralgia without Severe Carditis: High-dose Aspirin 50–75 mg/kg/day (up to 80–100 mg/kg/day) divided QID OR Naproxen 10–20 mg/kg/day divided BID until joint symptoms and CRP normalize (2–4 weeks), then taper. Moderate-to-Severe Carditis with Heart Failure: Oral Prednisone 2 mg/kg/day (max 60–80 mg/day) for 2–3 weeks, then taper over 2–3 weeks while overlapping with Aspirin during the taper to prevent rebound + Furosemide, ACEi, and Digoxin/Spironolactone as needed. Sydenham Chorea: Carbamazepine or Valproic Acid."
      },
      {
        number: 4,
        situation: "Secondary Prophylaxis (Mandatory Long-Term Prevention of Recurrent ARF & RHD Progression)",
        protocol: "Benzathine Penicillin G 1.2 Million U IM (< 27 kg: 600,000 U IM) EVERY 21–28 DAYS (every 3–4 weeks). (Oral alternative: Penicillin V 250 mg PO BID; if penicillin-allergic: Erythromycin 250 mg PO BID). Duration: ARF without carditis = 5 yrs or until age 21 (whichever is longer); ARF with carditis but no residual valve disease = 10 yrs or until age 21; ARF with persistent valvular RHD or valve surgery = ≥ 10 yrs or until age 40 (often lifelong)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Adherence & Dental Prophylaxis",
        detail: "Emphasize that missing monthly Benzathine Penicillin G injections allows silent recurrent strep infections that progressively destroy the mitral and aortic valves. Enforce strict oral hygiene and give Infective Endocarditis prophylaxis (Amoxicillin 2 g PO 30–60 min before invasive dental procedures) in patients with prosthetic valves or severe RHD."
      },
      {
        label: "Red Flags",
        detail: "New or worsening apical holosystolic/diastolic murmur, orthopnea/paroxysmal nocturnal dyspnea, atrial fibrillation, embolic stroke, or unexplained fever in an RHD patient (rule out Infective Endocarditis with 3 sets of blood cultures).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 32,
    cpgId: "cpg-neonatal-sepsis-jaundice",
    sectionGroup: "V. Maternal, Neonatal & Pediatric Special Care",
    title: "Neonatal Sepsis & Neonatal Hyperbilirubinemia (Jaundice)",
    societySource: "PSNbM / PPS / DOH EINC CPG",
    diagnostics: [
      {
        label: "Neonatal Sepsis Workup (Before Starting Antibiotics)",
        detail: "Blood Culture (minimum 1 mL blood), CBC with I/T ratio and Platelet count (after 4–6 hrs of life), CRP, Chest X-Ray (if respiratory distress), and Lumbar Puncture (CSF analysis/culture) in all hemodynamically stable neonates with suspected sepsis."
      },
      {
        label: "Neonatal Jaundice Workup",
        detail: "Total & Direct Serum Bilirubin (TSB) plotted on the hour-specific Bhutani/AAP normogram, Maternal and Infant ABO/Rh Blood Typing, Direct Coombs Test (DAT), CBC with Reticulocyte count & peripheral smear, and confirmation of Newborn Screening (ENBS for G6PD Deficiency and Congenital Hypothyroidism)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Early-Onset (< 72 hrs of life) OR Community-Acquired Neonatal Sepsis (First-Line Empiric IV Regimen)",
        protocol: "Admit to NICU; start IV Ampicillin (50 mg/kg/dose IV q8–12h; double to 100 mg/kg/dose if meningitis) PLUS IV Gentamicin (4–5 mg/kg/dose IV q24h, extended to q36–48h in preterms) OR IV Cefotaxime (50 mg/kg/dose IV q8–12h if meningitis is suspected; AVOID Ceftriaxone in hyperbilirubinemic neonates as it displaces bilirubin from albumin and precipitates with IV calcium!). Discontinue antibiotics at 36–48 hours if blood/CSF cultures are negative and infant is clinically well; treat culture-positive sepsis for 10–14 days (14–21 days for meningitis)."
      },
      {
        number: 2,
        situation: "Hospital-Acquired Late-Onset Neonatal Sepsis (> 72 hrs in NICU)",
        protocol: "Anti-pseudomonal β-lactam or Carbapenem (Piperacillin-Tazobactam, Cefepime, or Meropenem) + Amikacin (+ Vancomycin if MRSA/central line infection)."
      },
      {
        number: 3,
        situation: "Unconjugated Hyperbilirubinemia Reaching Phototherapy Threshold on Hour-Specific Normogram (OR Any Jaundice in the First 24 Hours of Life)",
        protocol: "Initiate Intensive Blue-Light LED Phototherapy (wavelength 460–490 nm, irradiance ≥ 30 µW/cm²/nm, maximizing exposed skin with eye shields and diaper only) + frequent breastfeeding every 2–3 hours (add IV fluids only if dehydrated; do NOT give plain water or glucose water)."
      },
      {
        number: 4,
        situation: "Isoimmune Hemolytic Disease (ABO/Rh Incompatibility) with Rapidly Rising TSBApproaching Exchange Threshold",
        protocol: "Administer IVIG 0.5–1.0 g/kg over 2 hours; perform Immediate Double-Volume Exchange Transfusion if TSB reaches exchange threshold or if any signs of Acute Bilirubin Encephalopathy (kernicterus) appear."
      },
      {
        number: 5,
        situation: "Conjugated Hyperbilirubinemia / Cholestasis (Direct Bilirubin > 1.0 mg/dL or > 20% of TSB, or Jaundice Persisting > 2 Weeks with Pale/Acholic Stools)",
        protocol: "Do NOT use phototherapy (causes \"bronze baby syndrome\"); refer urgently to Pediatric Gastroenterology/Surgery to rule out Biliary Atresia BEFORE 60 days of life (for Kasai portoenterostomy)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Debunking Dangerous Local Myths (\"Paaraw\" & \"Tiki-Tiki\")",
        detail: "Strictly counsel Filipino parents AGAINST relying on morning sunlight exposure (\"paaraw\") to treat significant neonatal jaundice (delays effective medical phototherapy and risks sunburn/hyperthermia). If G6PD Deficiency is confirmed on ENBS, provide the official DOH list of prohibited oxidative substances (mothballs/naphthalene, fava/patani beans, sulfonamides, nitrofurantoin, menthol). Enforce DOH Unang Yakap (EINC) and dry umbilical cord care."
      },
      {
        label: "Red Flags (Immediate NICU Admission)",
        detail: "Jaundice appearing within < 24 hours of birth, jaundice extending to palms and soles, pale/clay-colored stools or dark tea-colored urine, poor suck/refusal to breastfeed, lethargy, hypothermia (< 36.5°C) or fever (≥ 38.0°C), high-pitched cry, or retrocollis/opisthotonus (Acute Bilirubin Encephalopathy).",
        isRedFlag: true
      }
    ]
  },

  // ==========================================================================
  // VI. GI, HEPATOLOGY, RHEUMATOLOGY, DERMATOLOGY, HEMATOLOGY, NEURO/PSYCH, OB-GYN & PREVENTIVE (33–41)
  // ==========================================================================
  {
    conditionNumber: 33,
    cpgId: "cpg-acid-peptic-gerd-pud",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "GERD & Peptic Ulcer Disease (PUD)",
    societySource: "PSG GERD & PUD CPG",
    diagnostics: [
      {
        label: "Triage for Alarm Features First",
        detail: "If NO alarm features and age < 50 yrs with typical heartburn/regurgitation, diagnose GERD clinically and start an 8-week empiric PPI trial."
      },
      {
        label: "Mandatory Prompt Upper GI Endoscopy (EGD) Indications",
        detail: "Age ≥ 50 years with new-onset dyspepsia OR ANY Alarm Feature at any age (dysphagia, odynophagia, GI bleeding/melena/hematemesis, iron-deficiency anemia, unexplained weight loss, persistent vomiting, or epigastric mass)."
      },
      {
        label: "H. pylori Testing",
        detail: "Stool Antigen Test, Urea Breath Test, or Endoscopic Rapid Urease Test/Histology (withhold PPIs for ≥ 2 weeks and antibiotics/bismuth for ≥ 4 weeks prior to testing to prevent false negatives)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Uncomplicated GERD (No Alarm Features)",
        protocol: "Standard-dose Proton Pump Inhibitor (Omeprazole 20 mg, Pantoprazole 40 mg, Esomeprazole 20–40 mg, or Rabeprazole 20 mg) PO OD taken 30–60 minutes BEFORE breakfast × 8 weeks + Alginate/Antacid PRN for breakthrough reflux. If partial response at 4–8 weeks, increase to BID (before breakfast and dinner). Once healed, step down to lowest effective dose (unless LA Grade C/D esophagitis or Barrett's esophagus, which require long-term PPI)."
      },
      {
        number: 2,
        situation: "Confirmed Helicobacter pylori Infection — First-Line 14-Day Eradication Regimens (Always Treat for 14 Days!)",
        protocol: "(a) Bismuth Quadruple Therapy (Preferred in high clarithromycin resistance): PPI BID + Bismuth Subcitrate/Subsalicylate QID + Tetracycline 500 mg QID + Metronidazole 500 mg TID–QID × 14 days; OR (b) Concomitant / Standard Triple Therapy: PPI (Omeprazole 20 mg or Esomeprazole 40 mg) BID + Amoxicillin 1 g PO BID + Clarithromycin 500 mg PO BID (+ Metronidazole 500 mg BID if concomitant) × 14 days."
      },
      {
        number: 3,
        situation: "NSAID-Induced Peptic Ulcer Disease",
        protocol: "Discontinue NSAID immediately + PPI OD × 8 weeks (if NSAID must be continued, switch to a selective COX-2 inhibitor such as Celecoxib + daily PPI co-therapy). Test for H. pylori and eradicate if positive."
      },
      {
        number: 4,
        situation: "Mandatory Test of Cure",
        protocol: "Verify H. pylori eradication ≥ 4 weeks after completing therapy (and ≥ 2 weeks off PPIs) using Stool Antigen or Urea Breath Test; perform repeat EGD after 8–12 weeks for all Gastric Ulcers to rule out gastric adenocarcinoma."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Lifestyle & Medication Timing",
        detail: "Emphasize taking PPIs 30–60 minutes BEFORE the first meal of the day (not at bedtime on an empty stomach, as proton pumps must be activated by a meal). Advise avoiding late-night meals within 3 hours of lying down, elevating the head of the bed by 6–8 inches, weight loss if BMI ≥ 23, and stopping OTC NSAIDs/smoking."
      },
      {
        label: "Red Flags (Urgent Endoscopy / ER)",
        detail: "Hematemesis (coffee-ground or bright red), melena (black tarry stools), progressive dysphagia/odynophagia, unintentional weight loss, microcytic anemia, or sudden severe board-like abdominal pain (perforated peptic ulcer).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 34,
    cpgId: "cpg-masld-fatty-liver",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Fatty Liver Disease (MASLD)",
    societySource: "HSP MASLD CPG",
    diagnostics: [
      {
        label: "Confirm MASLD",
        detail: "Hepatic steatosis on Liver Ultrasound or FibroScan PLUS ≥ 1 Cardiometabolic Risk Factor (BMI ≥ 23 kg/m² or waist ≥ 90 cm [M] / ≥ 80 cm [F], Prediabetes/T2DM, BP ≥ 130/85 mm Hg, TG ≥ 150 mg/dL, or HDL ≤ 40 [M] / ≤ 50 [F] mg/dL) in the absence of excess alcohol (< 20 g/day women; < 30 g/day men)."
      },
      {
        label: "Mandatory Exclusion & Fibrosis Triage",
        detail: "Order HBsAg and Anti-HCV (mandatory in the HBV-endemic Philippines!), CBC with Platelets, AST, ALT, Bilirubin, Albumin, FBS/HbA1c, and Lipid Profile. Calculate FIB-4 Index = [Age × AST] ÷ [Platelets × √ALT] in every patient (even if ALT is normal!)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "All MASLD Stages — Cornerstone Weight Loss & Lifestyle Prescription",
        protocol: "Target ≥ 5% weight loss to reduce hepatic steatosis and ≥ 7%–10% sustained weight loss to resolve steatohepatitis (MASH) and reverse liver fibrosis (500–1,000 kcal/day deficit, eliminate fructose/sugary drinks, cut white rice portions in half, + ≥ 150–300 min/week aerobic and resistance exercise)."
      },
      {
        number: 2,
        situation: "Low Fibrosis Risk (FIB-4 < 1.30, or < 2.0 if age ≥ 65)",
        protocol: "Manage in primary care with lifestyle + aggressive cardiometabolic risk control; repeat FIB-4 every 1–2 years."
      },
      {
        number: 3,
        situation: "Indeterminate Fibrosis Risk (FIB-4 1.30–2.67)",
        protocol: "Order Vibration-Controlled Transient Elastography (FibroScan). If Liver Stiffness Measurement (LSM) < 8.0 kPa, manage in primary care; if LSM ≥ 8.0 kPa, refer to a Hepatologist/Gastroenterologist."
      },
      {
        number: 4,
        situation: "High Fibrosis Risk (FIB-4 > 2.67 or FibroScan LSM ≥ 12.0 kPa)",
        protocol: "Refer directly to Hepatologist; initiate 6-monthly Liver Ultrasound + AFP for HCC surveillance and screen for varices if cirrhosis is present."
      },
      {
        number: 5,
        situation: "Targeted Pharmacotherapy in MASH with Comorbidities",
        protocol: "If T2DM or obesity is present, prioritize GLP-1 Receptor Agonists (Semaglutide/Liraglutide), Tirzepatide, Pioglitazone (30–45 mg OD), or SGLT2 inhibitors. Prescribe Statins freely for dyslipidemia (statins are SAFE in MASLD and prevent CV death, the #1 killer in MASLD; only withhold in decompensated Child-Pugh B/C cirrhosis)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Debunking the \"Liver Supplement\" Myth",
        detail: "Counsel patients that over-the-counter \"liver vitamins\" (Silymarin, Essential Phospholipids, herbal detoxes) do NOT reverse liver fibrosis—redirect out-of-pocket expenses toward metabolic control, healthy nutrition, and FibroScan staging. Drinking 2–3 cups of unsweetened black coffee daily is associated with reduced liver fibrosis progression."
      },
      {
        label: "Red Flags",
        detail: "FIB-4 > 2.67, thrombocytopenia (platelets < 150,000/mm³ — earliest lab sign of portal hypertension), jaundice, ascites, splenomegaly, or coexisting HBsAg positivity.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 35,
    cpgId: "cpg-gout",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Acute Gouty Arthritis & Chronic Gout",
    societySource: "PRA Gout CPG",
    diagnostics: [
      {
        label: "Diagnosis & Baseline Workup",
        detail: "Classic acute monoarthritis (podagra at 1st MTP joint, ankle, or knee peaking within 24 hrs) or synovial fluid negatively birefringent needle-shaped MSU crystals. Order Serum Uric Acid (SUA — note that SUA may be transiently normal during an acute flare; repeat 2 weeks post-flare), Serum Creatinine + eGFR, CBC, ALT/AST, FBS/HbA1c, and Lipid Profile."
      },
      {
        label: "When to Aspirate Joint",
        detail: "Perform urgent Arthrocentesis (Gram stain, culture, cell count, crystal analysis) if Septic Arthritis cannot be ruled out (high fever, prosthetic joint, or immunocompromised)."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Acute Gouty Flare — CKD Stage 1–2 (Normal Renal Function, No Peptic Ulcer/CV Contraindications)",
        protocol: "(a) Low-Dose Colchicine (within 24–36 hrs of onset): 1.0 mg (two 0.5 mg tabs) PO initially, followed 1 hour later by 0.5 mg (1 tab) on Day 1 (max 1.5 mg on Day 1), then 0.5 mg OD–BID until flare resolves (NEVER use high-dose hourly Colchicine!); OR (b) Full-Dose NSAID / COX-2 Inhibitor (Naproxen 500 mg BID, Indomethacin 50 mg TID, Celecoxib, or Etoricoxib 120 mg OD × 5–7 days); OR (c) Oral Prednisone / Prednisolone 30–40 mg PO OD × 5 days."
      },
      {
        number: 2,
        situation: "Acute Gouty Flare in CKD Stage 3–5, Heart Failure, or Peptic Ulcer Disease",
        protocol: "STRICTLY AVOID NSAIDs/COX-2 inhibitors and avoid Colchicine in severe CKD (eGFR < 30). Treat the acute flare with Oral Prednisone 30–40 mg OD × 5 days OR Intra-articular Corticosteroid injection."
      },
      {
        number: 3,
        situation: "Golden Rule During an Acute Flare",
        protocol: "Do NOT newly initiate Allopurinol or Febuxostat in the middle of an acute flare (or if starting, ensure anti-inflammatory coverage); however, if the patient is ALREADY taking Allopurinol/Febuxostat, DO NOT STOP IT during the flare."
      },
      {
        number: 4,
        situation: "Long-Term Urate-Lowering Therapy (ULT — Indicated for tophi, ≥ 2 flares/yr, CKD Stage ≥ 2, or urolithiasis) — Target SUA < 6.0 mg/dL (< 5.0 mg/dL if tophaceous)",
        protocol: "Start Allopurinol 100 mg PO OD (start at ≤ 50 mg OD in CKD Stage ≥ 3) and titrate by 50–100 mg every 2–4 weeks to reach target SUA (Alternative: Febuxostat 40–80 mg OD, especially in CKD; use caution in established CVD) PLUS mandatory Flare Prophylaxis (Colchicine 0.5 mg OD or low-dose Prednisone) during the first 3–6 months of ULT initiation."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Allopurinol SCAR Warning & Local Diet",
        detail: "Filipinos have a high prevalence of the HLA-B*5801 allele—always start Allopurinol at a low dose (50–100 mg) and instruct the patient to STOP Allopurinol immediately at the first sign of ANY skin rash, itching, fever, or mouth/eye sores (Stevens-Johnson Syndrome / TEN / DRESS). Limit beer/hard liquor, organ meats (isaw, sisig, dinuguan, bopis), anchovies/sardines, and fructose-sweetened drinks; encourage > 2 L/day water intake. Do NOT treat asymptomatic hyperuricemia."
      },
      {
        label: "Red Flags",
        detail: "Fever/chills with a hot monoarticular joint (rule out Septic Arthritis), any skin rash/mucosal ulceration after starting Allopurinol, or acute flank pain/hematuria (uric acid nephrolithiasis).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 36,
    cpgId: "cpg-osteoarthritis",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Osteoarthritis (Knee, Hip & Hand)",
    societySource: "PRA Osteoarthritis CPG",
    diagnostics: [
      {
        label: "Clinical Diagnosis (Primary Method)",
        detail: "Age ≥ 45 years + activity-related mechanical joint pain (worse with weight-bearing/stairs, relieved by rest) + brief morning stiffness lasting < 30 minutes + bony enlargement/crepitus without joint warmth/erythema."
      },
      {
        label: "When to Order Imaging",
        detail: "Routine X-rays are not needed for typical presentations; order Weight-Bearing AP/Lateral Knee or Hip X-Rays (showing joint space narrowing, osteophytes, subchondral sclerosis) if atypical features exist or prior to orthopedic surgical referral."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Step 1 — Mandatory Core Non-Pharmacologic Therapy (All Patients)",
        protocol: "Structured quadriceps strengthening and low-impact aerobic exercise (walking, stationary cycling, swimming) + Weight loss of ≥ 5%–10% if BMI ≥ 23 kg/m² + Assistive cane held in the CONTRALATERAL hand (opposite the painful knee/hip) + Local heat/cold packs."
      },
      {
        number: 2,
        situation: "Step 2 — First-Line Pharmacotherapy for Knee & Hand OA (Safest Initial Drug, Especially in Elderly ≥ 65 yrs, HTN, CKD, or CVD)",
        protocol: "Topical NSAIDs (Diclofenac gel/patch or Ketoprofen gel applied 3–4× daily directly to the joint) — provides efficacy equivalent to oral NSAIDs with minimal systemic GI/renal/cardiac toxicity."
      },
      {
        number: 3,
        situation: "Step 3 — Moderate-to-Severe Flare or Hip OA Unresponsive to Topical NSAIDs (No CKD/Active Ulcer/Severe CVD)",
        protocol: "Oral NSAID at the lowest effective dose for the shortest duration: Naproxen 250–500 mg BID, Ibuprofen 400 mg TID, Meloxicam 7.5–15 mg OD, OR Selective COX-2 Inhibitor (Celecoxib 200 mg OD or Etoricoxib 60 mg OD) PLUS a Proton Pump Inhibitor (Omeprazole 20 mg OD) if GI risk factors exist. (Never combine two NSAIDs!)."
      },
      {
        number: 4,
        situation: "Persistent Joint Effusion or Contraindication to Systemic NSAIDs",
        protocol: "Intra-articular Corticosteroid injection (Triamcinolone Acetonide 40 mg; limit to ≤ 3–4 injections/year) OR Duloxetine (30–60 mg PO OD) / short-term weak opioid (Tramadol) for centralized chronic pain."
      },
      {
        number: 5,
        situation: "End-Stage Refractory OA",
        protocol: "Refer to Orthopedic Surgery for Total Knee or Hip Arthroplasty."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Medication Stewardship & Lifestyle",
        detail: "Counsel patients to avoid prolonged deep squatting (paglulupagi), kneeling on hard floors, and heavy lifting. Avoid chronic daily oral NSAID self-medication (a leading cause of GI bleeding and CKD in Filipino seniors) and counsel that OTC glucosamine/chondroitin has limited disease-modifying efficacy."
      },
      {
        label: "Red Flags (Rule Out Septic, Crystal, or Inflammatory Arthritis)",
        detail: "Hot, red, acutely swollen joint with fever, morning stiffness lasting > 60 minutes with symmetrical MCP/PIP swelling (Rheumatoid Arthritis), nocturnal bone pain with weight loss (malignancy), or acute locking/giving way.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 37,
    cpgId: "cpg-scabies",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Scabies",
    societySource: "PDS / DOH Dermatology CPG",
    diagnostics: [
      {
        label: "Clinical & Epidemiologic Diagnosis",
        detail: "Intense nocturnal pruritus + erythematous papules, vesicles, excoriations, or pathognomonic serpiginous burrows in classic web spaces (interdigital finger webs, flexor wrists, axillary folds, periumbilical area, beltline, buttocks, male genitalia; or palms, soles, scalp, and face in infants) PLUS itching in household contacts."
      },
      {
        label: "Confirmatory Bedside Test (If Uncertain)",
        detail: "Dermoscopy (\"delta-wing jet with contrail\" sign) or Mineral Oil Skin Scraping microscopy demonstrating Sarcoptes scabiei mites, ova, or scybala."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "First-Line Standard Treatment (Adults, Pregnant/Lactating Women, & Children ≥ 2 Months Old)",
        protocol: "Permethrin 5% Cream/Lotion applied thoroughly to clean, cool, dry skin from the NECK DOWN to the soles of the feet (in infants and toddlers < 2 years, also apply to the scalp, temples, and forehead, sparing periorbital/perioral areas). Leave on for 8–14 hours overnight, then wash off in the morning. MANDATORY REPEAT APPLICATION on Day 7–14 (to kill newly hatched nymphs)."
      },
      {
        number: 2,
        situation: "Alternative When Permethrin 5% is Unavailable or Cost-Prohibitive",
        protocol: "Sulfur 5%–10% Ointment (safe in infants < 2 months and pregnancy; apply nightly for 3 consecutive nights, washing off 24 hrs after last application) OR Benzyl Benzoate 10%–25% Emulsion OR Crotamiton 10% Cream/Lotion."
      },
      {
        number: 3,
        situation: "Oral Scabicide for Institutional Outbreaks, Refractory Classic Scabies, or Non-Adherent Groups (Children ≥ 15 kg & Non-Pregnant Adults)",
        protocol: "Oral Ivermectin 200 mcg/kg PO taken with food as a single dose, and REPEAT on Day 7–14 (Ivermectin is not ovicidal, so the 2nd dose is mandatory!)."
      },
      {
        number: 4,
        situation: "Crusted (Norwegian) Scabies (Immunocompromised / Elderly / Neurologic Patients)",
        protocol: "Combination Topical Permethrin 5% daily × 7 days (then twice weekly) + Oral Ivermectin 200 mcg/kg on Days 1, 2, 8, 9, and 15 + keratolytic (5%–10% Salicylic acid in petrolatum)."
      },
      {
        number: 5,
        situation: "Secondary Bacterial Impetiginization (Honey-Crusted Pustules / Pyoderma)",
        protocol: "Add Oral Cloxacillin or Cephalexin (25–50 mg/kg/day divided QID; adults 500 mg QID × 7 days) or Topical Mupirocin 2% to prevent Post-Streptococcal Glomerulonephritis (PSGN)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "The #1 Rule to Prevent Reinfestation",
        detail: "TREAT ALL HOUSEHOLD MEMBERS AND CLOSE PHYSICAL CONTACTS ON THE EXACT SAME NIGHT, EVEN IF COMPLETELY ASYMPTOMATIC! Wash all clothing, towels, and bedsheets used in the past 3 days in hot water and dry under direct hot sunlight (or seal non-washable items in a tied plastic bag for ≥ 72 hours). Reassure patients that post-scabetic itching can persist for 2–4 weeks after successful mite eradication (treat with Cetirizine/Hydroxyzine + emollients + mild topical steroid; do not repeatedly apply scabicides)."
      },
      {
        label: "Red Flags",
        detail: "Periorbital/facial edema, cola/tea-colored urine (hematuria), oliguria, or hypertension 1–3 weeks after impetiginized scabies (Acute Post-Streptococcal Glomerulonephritis — order Urinalysis, Creatinine, and C3 immediately), or spreading cellulitis/sepsis.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 38,
    cpgId: "cpg-ida-vs-thalassemia",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Iron Deficiency Anemia (IDA) vs. Thalassemia Trait",
    societySource: "PSHBT / DOH CPG",
    diagnostics: [
      {
        label: "Initial Microcytic Hypochromic Anemia Triage (MCV < 80 fL, MCH < 27 pg)",
        detail: "Compare RBC Count, RDW, and Mentzer Index (MCV ÷ RBC Count in millions): IDA: Low RBC count, High RDW (> 15%), Mentzer Index > 13. Thalassemia Trait: Normal/Elevated RBC count (> 5.0 × 10¹²/L), Normal RDW, Mentzer Index < 13."
      },
      {
        label: "Confirmatory Tests",
        detail: "Serum Ferritin (< 30 ng/mL confirms IDA; < 100 ng/mL if chronic inflammation/CKD/HF) + Peripheral Blood Smear + Reticulocyte count. If Ferritin is normal/elevated with microcytosis, order Hemoglobin Electrophoresis / Capillary Zone Electrophoresis / HPLC (HbA2 > 3.5% confirms Beta-Thalassemia trait). In men and postmenopausal women with confirmed IDA, order Fecal Immunochemical Test (FIT) and bidirectional GI Endoscopy (EGD + Colonoscopy) to rule out GI malignancy."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Confirmed Uncomplicated Iron Deficiency Anemia (IDA) — Oral Iron Replacement + Cause Eradication",
        protocol: "Adults: Oral Ferrous Sulfate 325 mg (65 mg elemental iron), Ferrous Fumarate, or Ferrous Gluconate — give 60–120 mg elemental iron PO OD or EVERY OTHER DAY (alternate-day morning dosing on an empty stomach lowers hepcidin, doubles fractional iron absorption, and reduces GI nausea/constipation). Children: 3–6 mg/kg/day of elemental iron PO. Duration: Recheck CBC in 2–4 weeks (expect Hb rise of ≥ 1–2 g/dL in 4 weeks); once Hb normalizes, CONTINUE oral iron for an additional 3–6 months to replenish bone marrow ferritin stores."
      },
      {
        number: 2,
        situation: "Indications for Intravenous (IV) Iron (Iron Sucrose or Ferric Carboxymaltose)",
        protocol: "Intolerance or failure of oral iron, malabsorption (IBD, celiac, post-bariatric surgery), moderate-to-severe IDA in the late 2nd/3rd trimester of pregnancy, ongoing blood loss exceeding oral absorption, or CKD/Heart Failure."
      },
      {
        number: 3,
        situation: "Confirmed Alpha- or Beta-Thalassemia Trait / Minor (Normal or High Ferritin)",
        protocol: "DO NOT PRESCRIBE IRON SUPPLEMENTS! (Iron will not raise Hb and causes toxic hepatic/cardiac hemosiderosis). Prescribe Folic Acid 1–5 mg PO OD to support ineffective erythropoiesis and provide partner screening/genetic counseling."
      },
      {
        number: 4,
        situation: "Transfusion-Dependent Thalassemia Major / HbE-Beta Thalassemia",
        protocol: "Regular leukoreduced Packed RBC transfusions (maintain pre-transfusion Hb 9.0–10.5 g/dL) + Iron Chelation Therapy (Deferasirox, Deferiprone, or Deferoxamine when Serum Ferritin > 1,000 ng/mL)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Administration & Dietary Counseling",
        detail: "Advise taking oral iron with Vitamin C (calamansi or orange juice) to enhance absorption, and separating iron by ≥ 2 hours from tea, coffee, milk, calcium tablets, and antacids/PPIs. Reassure patients that oral iron harmlessly turns stools black/dark green. Deworm endemic patients for hookworm (Albendazole 400 mg single dose)."
      },
      {
        label: "Red Flags",
        detail: "Hemodynamic instability, angina, or severe dyspnea with Hb < 7.0 g/dL (indicates urgent Packed RBC transfusion), IDA in a male or postmenopausal female (occult GI cancer until proven otherwise), or pancytopenia/blasts on smear (leukemia/aplastic anemia).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 39,
    cpgId: "cpg-acute-ischemic-stroke",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Acute Ischemic Stroke",
    societySource: "SSP / PhilHealth Stroke CPG",
    diagnostics: [
      {
        label: "Immediate Hyperacute Triage (BE-FAST + Document Exact \"Last Known Well\" Time)",
        detail: "Perform NIHSS score, STAT Fingerstick Capillary Blood Glucose (CBG — the #1 stroke mimic that must be checked before CT!), and STAT Non-Contrast Cranial CT Scan within ≤ 20–25 minutes of ER arrival to exclude Intracerebral Hemorrhage (ICH)."
      },
      {
        label: "Additional Workup",
        detail: "12-Lead ECG (screen for Atrial Fibrillation), CBC with Platelets, PT/INR, aPTT, Serum Creatinine/Electrolytes, Troponin, Lipid Profile, HbA1c, Carotid Duplex Ultrasound, and 2D Echo."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Eligible for IV Thrombolysis (Symptom Onset ≤ 4.5 Hours, No Hemorrhage on CT, No Contraindications, Door-to-Needle Goal ≤ 60 Min)",
        protocol: "Lower BP to < 185/110 mm Hg BEFORE starting infusion (and keep < 180/105 mm Hg for 24 hrs after) using IV Nicardipine or Labetalol. Administer IV Recombinant Tissue Plasminogen Activator (rtPA / Alteplase) 0.9 mg/kg (maximum total dose 90 mg): give 10% as an IV bolus over 1 minute, and infuse the remaining 90% over 60 minutes (OR Tenecteplase 0.25 mg/kg max 25 mg single IV bolus per stroke center protocol). STRICTLY WITHHOLD Aspirin, Clopidogrel, and Heparin for the first 24 hours until a 24-hour repeat Cranial CT confirms no hemorrhagic transformation!"
      },
      {
        number: 2,
        situation: "Anterior Circulation Large Vessel Occlusion (LVO Within 6–24 Hours)",
        protocol: "Refer immediately to a Comprehensive Stroke Center for Endovascular Mechanical Thrombectomy (do not delay IV Alteplase if within 4.5 hrs)."
      },
      {
        number: 3,
        situation: "Acute Ischemic Stroke NOT Receiving IV Thrombolysis",
        protocol: "(a) Permissive Hypertension: Do NOT lower BP during the first 24–48 hours unless BP ≥ 220/120 mm Hg (or an urgent comorbid emergency exists); if ≥ 220/120 mm Hg, lower by only 15% over 24 hrs. (b) Minor Non-Cardioembolic Stroke (NIHSS ≤ 3) or High-Risk TIA (ABCD² ≥ 4) Within 24 Hours: Give Dual Antiplatelet Therapy (DAPT: Aspirin 160–325 mg load then 81–100 mg OD + Clopidogrel 300 mg load then 75 mg OD) for 21 days ONLY, followed by single antiplatelet monotherapy thereafter. (c) Moderate-to-Severe Non-Cardioembolic Stroke: Aspirin 160–325 mg PO/NGT within 24–48 hours + High-Intensity Statin (Atorvastatin 40–80 mg or Rosuvastatin 20–40 mg OD)."
      },
      {
        number: 4,
        situation: "Cardioembolic Stroke Secondary to Non-Valvular Atrial Fibrillation",
        protocol: "Initiate Oral Anticoagulation with a Direct Oral Anticoagulant (Apixaban, Rivaroxaban, Dabigatran, or Edoxaban; or Warfarin INR 2.0–3.0 if moderate-to-severe rheumatic mitral stenosis or mechanical valve) timed by the \"1-3-6-12 Day Rule\" based on infarct size."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Mandatory Dysphagia Screen & Stroke Unit Care",
        detail: "Keep the patient NPO (nothing by mouth, including oral medications and water!) until a formal Bedside Water Swallow Screen is passed to prevent fatal aspiration pneumonia. Treat fever ≥ 37.5°C promptly with Paracetamol, keep CBG 140–180 mg/dL, start DVT prophylaxis, and mobilize with Early Physical/Occupational/Speech Rehabilitation. Utilize the PhilHealth Acute Stroke Z-Benefit / Case Rate."
      },
      {
        label: "Red Flags (Neurosurgical / ICU Emergency)",
        detail: "Drop in GCS ≥ 2 points or increase in NIHSS ≥ 4 points during/after rtPA (STOP rtPA infusion immediately and get STAT Cranial CT for symptomatic ICH), unequal pupils, Cushing's triad (bradycardia, hypertension, irregular respirations from malignant MCA edema or cerebellar herniation).",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 40,
    cpgId: "cpg-epilepsy-all-ages",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "Epilepsy & Major Depressive Disorder (Neurology & Psychiatry)",
    societySource: "PNA / PPA / DOH mhGAP CPG",
    diagnostics: [
      {
        label: "Epilepsy Workup",
        detail: "STAT Capillary Blood Glucose (CBG) and Serum Sodium/Calcium/Magnesium (in acute seizures) + Standard/Sleep-Deprived EEG + Brain MRI with Epilepsy Protocol (or Contrast CT if MRI unavailable) for focal onset, adult onset, or abnormal neuro exam."
      },
      {
        label: "Major Depressive Disorder (MDD) Workup",
        detail: "PHQ-9 Screening (≥ 10 = moderate-to-severe depression) + Mandatory Suicide Risk Assessment (Item 9) + Screen for prior Mania/Hypomania (Bipolar Disorder) + TSH, CBC, and metabolic panel to exclude organic mimics."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "Convulsive Status Epilepticus (Seizure Lasting ≥ 5 Minutes — Emergency Time-Critical Ladder)",
        protocol: "(a) 0–5 Min (Stabilize & Check CBG): Airway/O₂, recovery position, check CBG (if < 60 mg/dL, give IV Thiamine 100 mg + D50W 50 mL IV). (b) 5–20 Min (1st-Line Benzodiazepine): IV Lorazepam 0.1 mg/kg (max 4 mg) OR IV Diazepam 0.15–0.2 mg/kg (max 10 mg; repeat once after 5 min) OR IM Midazolam 10 mg (5 mg if 13–40 kg) if no IV access. (c) 20–40 Min (2nd-Line IV ASM): IV Levetiracetam 60 mg/kg (max 4,500 mg) over 15 min OR IV Valproate 40 mg/kg (max 3,000 mg) OR IV Phenytoin/Fosphenytoin 20 mg PE/kg at ≤ 50 mg/min on cardiac monitor. (d) > 40 Min (Refractory Status): Intubate + continuous IV Midazolam or Propofol in ICU."
      },
      {
        number: 2,
        situation: "Outpatient Epilepsy Maintenance Monotherapy (By Seizure Type & Sex)",
        protocol: "(a) Focal-Onset Seizures: Levetiracetam (500–1,500 mg BID), Lamotrigine, or Carbamazepine/Oxcarbazepine (screen or watch for HLA-B*1502 SJS/TEN with Carbamazepine/Phenytoin in Filipinos). (b) Generalized Tonic-Clonic / Myoclonic / Absence: Valproic Acid (highly effective in males, but STRICTLY AVOID Valproate in women and girls of childbearing potential due to 10% neural tube teratogenicity and 30%–40% neurodevelopmental impairment; use Levetiracetam or Lamotrigine + Folic Acid 4–5 mg OD in reproductive-age females; Ethosuximide for pure childhood absence)."
      },
      {
        number: 3,
        situation: "Mild Major Depressive Disorder (PHQ-9 5–9, No Suicidality)",
        protocol: "Structured Psychotherapy (CBT / Interpersonal Therapy / DOH mhGAP problem-solving), sleep hygiene, and aerobic exercise; reassess in 2–4 weeks."
      },
      {
        number: 4,
        situation: "Moderate-to-Severe MDD (PHQ-9 ≥ 10 — First-Line Antidepressant + Psychotherapy)",
        protocol: "Start an SSRI: Escitalopram 10 mg PO OD (start 5 mg × 1 wk), Sertraline 50 mg PO OD (preferred in cardiac disease & breastfeeding; start 25 mg × 1 wk), or Fluoxetine 20 mg PO OD (preferred in adolescents; SNRI Duloxetine/Venlafaxine if neuropathic pain). Continue for 6–12 months after full remission of a 1st episode (≥ 2 yrs or lifelong if recurrent)."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Critical Safety Rules",
        detail: "In Epilepsy, advise never stopping ASMs abruptly, avoiding unattested swimming/heights/driving until seizure-free, and never placing spoons/fingers inside a seizing patient's mouth. In MDD, counsel that SSRIs take 2–4 weeks for mood improvement while energy returns in Week 1–2 (monitor Youth < 25 yrs closely in the first 2 weeks for emergent suicidal activation), and never prescribe antidepressant monotherapy if Bipolar Disorder is suspected. Free Escitalopram, Fluoxetine, Sertraline, Levetiracetam, Valproate, and Carbamazepine are available at RHUs under the DOH Medicine Access Program for Mental Health (MAP-MH) and NCMH Crisis Hotline 1553."
      },
      {
        label: "Red Flags",
        detail: "Status epilepticus (≥ 5 min), any rash after starting Carbamazepine/Phenytoin/Lamotrigine (SJS/TEN), active suicidal intent/plan, psychotic features, or manic switch.",
        isRedFlag: true
      }
    ]
  },
  {
    conditionNumber: 41,
    cpgId: "cpg-cancer-screening-adults",
    sectionGroup: "VI. GI, Hepatology, Rheumatology, Dermatology, Hematology, Neuro/Psych, OB-GYN & Preventive",
    title: "PCOS, Abnormal Uterine Bleeding (AUB) & Adult Cancer Screening",
    societySource: "POGS / DOH PHEX / PSG CPG",
    diagnostics: [
      {
        label: "PCOS & AUB Workup",
        detail: "Rotterdam Criteria for PCOS (2 of 3: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on Transvaginal Ultrasound after excluding thyroid disease, hyperprolactinemia, and congenital adrenal hyperplasia). For AUB (PALM-COEIN), order Urine/Serum β-hCG first (rule out pregnancy!), CBC, TSH, Transvaginal Ultrasound, and Endometrial Biopsy in women aged ≥ 45 yrs (or < 45 yrs with unopposed estrogen/obesity/PCOS and persistent AUB)."
      },
      {
        label: "DOH PHEX Average-Risk Adult Cancer Screening",
        detail: "(1) Breast: Clinical Breast Exam + Biennial Mammography (with Breast Ultrasound in dense breasts) ages 50–69 (start at 40 if individualized risk). (2) Cervical: Primary HPV DNA Testing q5yrs (ages 30–65), Visual Inspection with Acetic Acid (VIA) q3–5yrs at RHUs, or Pap Smear q3yrs (ages 21–65). (3) Colorectal: Annual Fecal Immunochemical Test (FIT) OR Colonoscopy q10yrs starting at age 50. (4) Lung: Annual Low-Dose Chest CT for ages 50–80 with ≥ 20 pack-year smoking history. (5) Liver (HCC): Liver Ultrasound + AFP q6mos in Chronic HBV or Cirrhosis."
      }
    ],
    treatmentPerSituation: [
      {
        number: 1,
        situation: "PCOS Not Attempting Conception (Menstrual Irregularity, Hirsutism/Acne, & Endometrial Protection)",
        protocol: "First-line Lifestyle Modification (5%–10% weight loss) + Combined Oral Contraceptive Pills (COCPs) to regulate cycles, reduce androgen levels, and prevent endometrial hyperplasia (or Cyclic Oral Medroxyprogesterone Acetate 10 mg OD × 10–14 days every 1–3 months to induce withdrawal bleed if COCPs are contraindicated) + Metformin 500–1,500 mg/day if insulin resistance/prediabetes/BMI ≥ 25 (order 75g 2-hr OGTT & Lipid Profile in all PCOS patients)."
      },
      {
        number: 2,
        situation: "PCOS Attempting Conception (Anovulatory Infertility)",
        protocol: "First-line ovulation induction with Letrozole (2.5–5 mg PO OD on Cycle Days 3–7; superior live-birth rate over Clomiphene Citrate) + Folic Acid 400 mcg OD."
      },
      {
        number: 3,
        situation: "Acute Heavy Menstrual Bleeding (AUB)",
        protocol: "Hemodynamically Unstable: IV crystalloids, blood transfusion, high-dose IV Conjugated Equine Estrogen or multi-dose COCP taper / intrauterine balloon tamponade / surgical D&C. Hemodynamically Stable Non-Pregnant AUB: Tranexamic Acid 1 g–1.3 g PO TID during heavy bleeding days (up to 5 days) OR Mefenamic Acid 500 mg TID OR Combined Oral Contraceptive taper / Levonorgestrel-IUD (Mirena) + Oral/IV Iron replacement for anemia."
      },
      {
        number: 4,
        situation: "Abnormal Cancer Screening Test Result",
        protocol: "(a) Positive FIT: Refer for diagnostic Colonoscopy (do NOT simply repeat FIT). (b) BI-RADS 4 or 5 on Mammogram/Ultrasound: Refer for Core Needle Biopsy. (c) Positive VIA or High-Risk HPV 16/18: Refer for Colposcopy or same-day thermal ablation/cryotherapy per DOH Cervical Cancer protocol."
      }
    ],
    counselingAndRedFlags: [
      {
        label: "Prevention & PhilHealth Z-Benefits",
        detail: "Promote primary cancer prevention: HPV Vaccination (ages 9–14 yrs via DOH school/community immunization), Hepatitis B Birth-Dose + 3-dose vaccination, and tobacco/betel nut (nganga) cessation. Refer patients with confirmed breast, cervical, colorectal, or prostate cancer to DOH Cancer Assistance Fund (CAF) access sites and PhilHealth Z-Benefit packages."
      },
      {
        label: "Red Flags",
        detail: "ANY Postmenopausal Vaginal Bleeding (endometrial or cervical cancer until proven otherwise — requires urgent TVUS and endometrial biopsy), palpable hard fixed breast mass with skin dimpling/bloody nipple discharge, iron-deficiency anemia or hematochezia in age ≥ 50, or AUB with hypotension/orthostasis.",
        isRedFlag: true
      }
    ]
  }
];

// Map by cpgId and by conditionNumber for fast lookup across all views
export const CPG_MANAGEMENT_BY_ID: Record<string, CpgClinicalManagementPlan> = {};
for (const plan of CPG_CLINICAL_MANAGEMENT_PLANS) {
  CPG_MANAGEMENT_BY_ID[plan.cpgId] = plan;
}
// Also link cpg-mdd-adults directly to Condition #40 so both Epilepsy and MDD open the full PNA/PPA/DOH mhGAP Flashcard Table
if (CPG_MANAGEMENT_BY_ID["cpg-epilepsy-all-ages"]) {
  CPG_MANAGEMENT_BY_ID["cpg-mdd-adults"] = {
    ...CPG_MANAGEMENT_BY_ID["cpg-epilepsy-all-ages"],
    cpgId: "cpg-mdd-adults"
  };
}
