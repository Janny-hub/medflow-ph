import { CPG_MANAGEMENT_BY_ID } from './cpgClinicalManagementData';

    export const PH_LAB_CATALOG: Record<string, string[]> = {
      "Hematology": [
        "CBC with Platelet Count",
        "Peripheral Blood Smear (PBS)",
        "Reticulocyte Count",
        "Prothrombin Time (PT / INR)",
        "Activated Partial Thromboplastin Time (aPTT)",
        "Erythrocyte Sedimentation Rate (ESR)",
        "Bleeding Time & Clotting Time (BT/CT)",
        "D-Dimer (Quantitative)",
        "Serum Ferritin / Iron / TIBC"
      ],
      "Clinical Chemistry": [
        "Fasting Blood Sugar (FBS)",
        "Random Blood Sugar (RBS)",
        "2-Hour Post-Prandial Blood Sugar",
        "75g Oral Glucose Tolerance Test (OGTT)",
        "HbA1c (Glycosylated Hemoglobin)",
        "Lipid Profile (TC, TG, HDL, LDL, VLDL)",
        "Serum Creatinine with eGFR",
        "Blood Urea Nitrogen (BUN)",
        "Serum Uric Acid (SUA)",
        "Serum Electrolytes (Na, K, Cl, Ca)",
        "Serum Magnesium & Phosphorus",
        "AST (SGOT) & ALT (SGPT)",
        "Alkaline Phosphatase (ALP)",
        "Total, Direct & Indirect Bilirubin",
        "Total Protein, Albumin, Globulin (TPAG)",
        "Serum Amylase & Lipase",
        "Troponin I / Troponin T (High Sensitivity)",
        "NT-proBNP / BNP",
        "Lactate Dehydrogenase (LDH)",
        "TSH, FT3, FT4 (Thyroid Function Panel)",
        "C-Reactive Protein (CRP / hs-CRP)",
        "Procalcitonin"
      ],
      "Clinical Microscopy": [
        "Routine Urinalysis",
        "Urine Culture & Sensitivity (C/S)",
        "24-Hour Urine Protein / Creatinine",
        "Urine Albumin-to-Creatinine Ratio (uACR)",
        "Pregnancy Test (Urine / Serum Beta-hCG)",
        "Routine Fecalysis (Stool Exam)",
        "Fecal Occult Blood Test (FOBT)",
        "Stool Helicobacter pylori Antigen",
        "Semen Analysis"
      ],
      "Serology & Immunology": [
        "Dengue NS1 Antigen",
        "Dengue IgG / IgM Rapid Test",
        "Typhidot (Salmonella IgG/IgM)",
        "Leptospira IgM / MAT",
        "HBsAg (Hepatitis B Surface Antigen)",
        "Anti-HBs (Quantitative)",
        "Anti-HAV IgM / Anti-HCV",
        "HIV 1 & 2 Screening",
        "Syphilis (RPR / VDRL)",
        "ASO Titer / Rheumatoid Factor (RF)",
        "ANA (Antinuclear Antibody)",
        "SARS-CoV-2 Rapid Antigen / RT-PCR"
      ],
      "Microbiology": [
        "Gram Stain",
        "AFB Smear (Sputum x2)",
        "GeneXpert MTB/RIF Assay",
        "Blood Culture & Sensitivity (x2 sites)",
        "Wound / Discharge Culture & Sensitivity",
        "Sputum Culture & Sensitivity",
        "KOH Mount (Fungal Scraping)"
      ],
      "Blood Bank": [
        "Blood Typing (ABO & Rh)",
        "Crossmatching (Major & Minor)",
        "Direct & Indirect Coombs Test",
        "Packed RBC (PRBC) Preparation",
        "Fresh Frozen Plasma (FFP) / Platelet Concentrate"
      ]
    };

    export const PH_IMAGING_CATALOG: Record<string, string[]> = {
      "X-Ray (Radiography)": [
        "Chest X-Ray (PA View)",
        "Chest X-Ray (PA & Lateral)",
        "Chest X-Ray (AP / Portable)",
        "Chest X-Ray (Apicolordotic View)",
        "Abdominal X-Ray (Flat & Upright)",
        "KUB X-Ray",
        "Cervical / Thoracic / Lumbosacral Spine X-Ray",
        "Extremity / Joint X-Ray (AP & Lateral)"
      ],
      "Ultrasound (Sonography)": [
        "Whole Abdomen Ultrasound",
        "Hepatobiliary Tree & Pancreas (HBT) UTZ",
        "KUB & Prostate / Pelvic Ultrasound",
        "Transvaginal / Transabdominal Ultrasound",
        "Congenital Anomaly Scan (CAS)",
        "Biophysical Profile (BPP) / Pelvic Ultrasound",
        "Thyroid / Neck Ultrasound",
        "Breast & Axillary Ultrasound",
        "Venous Duplex Scan (Lower Extremities)",
        "Carotid Arterial Duplex Scan"
      ],
      "CT Scan & MRI": [
        "Cranial CT Scan (Plain)",
        "Cranial CT Scan (With IV Contrast)",
        "Chest CT Scan (High-Resolution / Plain)",
        "Whole Abdomen CT Scan (Triple Contrast)",
        "CT Stonogram (Plain KUB CT)",
        "Brain / Spine MRI (Plain & Contrast)"
      ],
      "Cardiopulmonary Diagnostics": [
        "12-Lead Electrocardiogram (ECG)",
        "2D Echocardiogram with Doppler",
        "Non-Stress Test (NST)"
      ]
    };

    export const ANC_TRIMESTER_TESTS: Record<string, any> = {
      "1st Visit (Baseline)": {
        labs: {
          "Hematology": ["CBC with Platelet Count", "Blood Typing (ABO & Rh)"],
          "Clinical Microscopy": ["Routine Urinalysis"],
          "Serology & Immunology": ["HIV 1 & 2 Screening", "HBsAg (Hepatitis B Surface Antigen)", "Syphilis (RPR / VDRL)"],
          "Clinical Chemistry": ["Fasting Blood Sugar (FBS)"]
        },
        imaging: {
          "Ultrasound (Sonography)": ["Transvaginal / Transabdominal Ultrasound"]
        },
        items: [
          "CBC with Platelet Count (screens for anemia/infection)",
          "Blood Typing & Rh Factor",
          "Urinalysis (UTI, proteinuria, glucosuria)",
          "Triple Elimination Panel: HIV, HBsAg, Syphilis (RPR/VDRL)",
          "Fasting Blood Sugar (FBS) (for high-risk patients)",
          "Transvaginal / Pelvic Ultrasound (viability, AOG, singleton vs. multiple)"
        ]
      },
      "2nd Trimester (24–28 weeks)": {
        labs: {
          "Clinical Chemistry": ["75g Oral Glucose Tolerance Test (OGTT)"],
          "Hematology": ["CBC with Platelet Count"],
          "Clinical Microscopy": ["Routine Urinalysis"]
        },
        imaging: {
          "Ultrasound (Sonography)": ["Congenital Anomaly Scan (CAS)"]
        },
        items: [
          "75g Oral Glucose Tolerance Test (OGTT) (Gestational Diabetes screening)",
          "Congenital Anomaly Scan (CAS) (18–24 weeks fetal anatomy scan)",
          "Repeat CBC with Platelet Count & Routine Urinalysis"
        ]
      },
      "3rd Trimester (32–36+ weeks)": {
        labs: {
          "Hematology": ["CBC with Platelet Count"],
          "Clinical Microscopy": ["Routine Urinalysis"]
        },
        imaging: {
          "Ultrasound (Sonography)": ["Biophysical Profile (BPP) / Pelvic Ultrasound"],
          "Cardiopulmonary Diagnostics": ["Non-Stress Test (NST)"]
        },
        items: [
          "Biophysical Profile (BPP) / Pelvic Ultrasound (fetal growth, AFI, placenta)",
          "Repeat CBC with Platelet Count & Routine Urinalysis",
          "Non-Stress Test (NST) (if indicated for high-risk or decreased fetal movement)"
        ]
      }
    };

    export const ANC_DANGER_SIGNS: string[] = [
      "Vaginal bleeding / spotting",
      "Severe headache",
      "Blurring of vision / scotoma",
      "Severe abdominal / epigastric pain",
      "High fever / chills",
      "Foul-smelling vaginal discharge",
      "Painful urination (dysuria)",
      "Decreased or absent fetal movement"
    ];

    export const PH_CPG_CATALOG: any[] = [
      {
        id: "cpg-htn-adults",
        category: "Cardiovascular",
        title: "Hypertension in Adults (Philippines)",
        source: "Philippine CPG for the Management of Hypertension (PSH/PHA) & 2024 Philippine CPG on Acute Severe Blood Pressure Elevation",
        intendedUsers: "Primary Care Physicians, Internists, Emergency & Outpatient Clinicians",
        keywords: ["adult hypertension", "hypertension", "htn", "high blood pressure", "bp", "psh", "pha", "hypertensive emergency", "hypertensive urgency"],
        snapshot: [
          { parameter: "Diagnostic Cutoff", value: "≥ 140/90 mm Hg (office BP on ≥ 2 separate visits, or 1 visit if organ damage is present)" },
          { parameter: "Treatment Threshold", value: "≥ 140/90 mm Hg (most adults); ≥ 150/90 mm Hg (age ≥ 80 years)" },
          { parameter: "Target BP Goal", value: "< 130/80 mm Hg (most adults); < 140/90 mm Hg (age ≥ 80 years)" },
          { parameter: "Safety Floor", value: "Do not lower below 120/70 mm Hg (increases risk of adverse events)" },
          { parameter: "First-Line Therapy", value: "Low-dose 2-drug combination (RAAS Blocker + CCB or Thiazide/Thiazide-like diuretic)" }
        ],
        scope: {
          included: [
            "Adult Filipinos (≥ 19 years old) with primary or comorbid hypertension (Diabetes Mellitus, Chronic Kidney Disease [CKD], or prior Stroke)."
          ],
          excluded: [
            { label: "Pregnancy (Gestational HTN / Preeclampsia)", action: "Use specialized Obstetric Hypertension guidelines." },
            { label: "Pediatric Patients (< 19 years old)", action: "Use Pediatric Blood Pressure percentiles." },
            { label: "Acute Severe BP Elevation (≥ 180/120 mm Hg)", action: "Switch immediately to the Acute Severe BP Triage pathway (see Section 3)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Start Dual Therapy Early", detail: "Initiate a low-dose two-drug combination—preferably as a Single-Pill Combination (SPC)—for patients with BP ≥ 140/90 mm Hg (and mandatory for BP ≥ 160/100 mm Hg) to achieve faster control and improve adherence." },
            { title: "Never Combine Two RAAS Blockers", detail: "Do not prescribe an ACE inhibitor and an ARB together." },
            { title: "No Sublingual Drugs in Severe BP", detail: "Strongly avoid sublingual nifedipine or captopril for acute severe BP elevation; rapid drops can trigger stroke or myocardial ischemia." }
          ],
          conditional: [
            { title: "3-Month Lifestyle Trial First", detail: "May be offered to low-risk patients with Grade 1 hypertension (140–159 / 90–99 mm Hg) who have no Hypertension-Mediated Organ Damage (HMOD) or diabetes." },
            { title: "Out-of-Office BP Monitoring", detail: "Suggest Home BP Monitoring (HBPM) or 24-hour Ambulatory BP Monitoring (ABPM) to rule out white-coat hypertension, guided by patient access to a validated upper-arm digital monitor." }
          ]
        },
        pathway: {
          stepA: {
            title: "Step A: Baseline Workup (Every Newly Diagnosed Patient)",
            subtitle: "Order at initial consultation to assess cardiovascular risk and organ damage:",
            items: [
              { label: "Blood Tests", detail: "Fasting Blood Sugar (FBS), Lipid Profile, Serum Creatinine (with eGFR), Serum Sodium & Potassium" },
              { label: "Urine & Cardiac", detail: "Urinalysis (proteinuria/hematuria), 12-Lead ECG" }
            ]
          },
          stepB: {
            title: "Step B: Outpatient Medication Escalation",
            steps: [
              { step: "Step 1 (Dual Therapy)", detail: "Low-dose ACEi or ARB + CCB (or Thiazide/Thiazide-like diuretic)." },
              { step: "Step 2 (Triple Therapy)", detail: "Titrate to full dose, or combine all three classes (ACEi/ARB + CCB + Diuretic)." },
              { step: "Step 3 (Resistant HTN)", detail: "Add Spironolactone (check serum K⁺ and eGFR first) and screen for secondary causes." }
            ]
          },
          stepC: {
            title: "Step C: Triage for Acute Severe BP (≥ 180/120 mm Hg)",
            subtitle: "Screen immediately for Red Flag Symptoms (acute target organ damage):",
            redFlags: [
              "Chest pain or tightness (Acute Coronary Syndrome)",
              "Severe shortness of breath / orthopnea (Acute Pulmonary Edema)",
              "Weakness, numbness, slurred speech, or confusion (Stroke / Encephalopathy)",
              "Tearing chest or back pain (Aortic Dissection)"
            ],
            triageTable: [
              {
                scenario: "Red Flags PRESENT",
                classification: "Hypertensive Emergency",
                action: "Refer immediately to ER / ICU. Start IV titration (e.g., IV Nicardipine or IV Nitrates). Avoid lowering SBP by ≥ 60 mm Hg in 1 hour.",
                urgent: true
              },
              {
                scenario: "Red Flags ABSENT",
                classification: "Hypertensive Urgency",
                action: "Manage outpatient. Rest quietly for 2 hours, start/adjust oral maintenance meds, lower BP gradually over 24–48 hours, and follow up within 1 week.",
                urgent: false
              }
            ]
          }
        },
        practiceNotes: [
          { title: "Local Diet Counseling", detail: "Limit sodium to < 2,000–2,300 mg/day. Advise reducing toyo (soy sauce), patis (fish sauce), bagoong, buro, instant noodles, and canned goods. Encourage potassium-rich local foods (malunggay, kangkong, saba banana) unless the patient has advanced CKD." },
          { title: "Cost & PhilHealth Access", detail: "If Single-Pill Combinations (SPCs) are too costly out-of-pocket, prescribe two separate generic tablets. Amlodipine, Losartan, and Hydrochlorothiazide are standard formulary items available free at Barangay Health Stations / RHUs via the PhilHealth Konsulta package and DOH Hypertension & Diabetes Clubs." },
          { title: "Follow-Up Schedule", detail: "Reassess every 2–4 weeks during dose titration until target BP is reached, then every 3–6 months once stable. Always review the patient's written Home BP log." }
        ],
        soapPlanSummary: [
          "Baseline Workup: FBS, Lipid Profile, Serum Creatinine (with eGFR), Serum Na & K, Urinalysis, 12-Lead ECG.",
          "Outpatient Therapy: Initiate low-dose 2-drug combination (ACEi/ARB + CCB or Thiazide/Thiazide-like diuretic); target BP < 130/80 mm Hg (< 140/90 mm Hg if age ≥ 80 yrs); safety floor 120/70 mm Hg.",
          "Counseling & Follow-Up: Low-sodium diet (< 2,000–2,300 mg/day; limit toyo, patis, bagoong, instant/canned foods), Home BP log, follow-up in 2–4 weeks."
        ]
      },
      {
        id: "cpg-t2dm-adults",
        category: "Endocrine & Metabolic",
        title: "Type 2 Diabetes Mellitus (Adults)",
        source: "UNITE for Diabetes Philippines / PCEDM CPG & DOH Periodic Health Examination (PHEX)",
        intendedUsers: "Primary Care Physicians, Internists, Endocrinologists & Outpatient Clinicians",
        keywords: ["type 2 diabetes", "diabetes mellitus", "t2dm", "dm", "fbs", "hba1c", "ogtt", "metformin", "sglt2", "unite for diabetes", "pcedm"],
        snapshot: [
          { parameter: "Diagnostic Cutoff", value: "FBS ≥ 126 mg/dL, 2-hr 75g OGTT ≥ 200 mg/dL, HbA1c ≥ 6.5%, or RBS ≥ 200 mg/dL with classic symptoms" },
          { parameter: "Screening Cutoff", value: "Age ≥ 40 years, or younger if overweight/obese (BMI ≥ 23 kg/m²) with ≥ 1 risk factor" },
          { parameter: "Glycemic Target", value: "HbA1c < 7.0% (general adults); 7.5%–8.0% if frail, elderly, or high hypoglycemia risk" },
          { parameter: "First-Line Drug", value: "Metformin (unless eGFR < 30 mL/min/1.73m²); add SGLT2i or GLP-1 RA early if ASCVD, HF, or CKD is present" }
        ],
        scope: {
          included: [
            "Non-pregnant Filipino adults (≥ 19 years) with prediabetes or Type 2 DM."
          ],
          excluded: [
            { label: "Type 1 DM & Gestational DM", action: "Screen GDM at 24–28 weeks AOG using 75g OGTT." },
            { label: "Acute Hyperglycemic Crises (DKA / HHS)", action: "Refer immediately to Emergency Room (ER) for IV hydration and insulin protocol." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Screen & Initiate First-Line Early", detail: "Screen asymptomatic adults aged ≥ 40 using Fasting Plasma Glucose; initiate Metformin alongside medical nutrition therapy at diagnosis." },
            { title: "Cardiorenal Protection with SGLT2i", detail: "Add an SGLT2 inhibitor (e.g., Empagliflozin/Dapagliflozin) for patients with coexisting CKD or Heart Failure regardless of baseline HbA1c." }
          ],
          conditional: [
            { title: "HbA1c Screening & Second-Line Selection", detail: "Using HbA1c for routine screening depends on cost and assay standardization variability; choose second-line agents (DPP-4i, Sulfonylurea, SGLT2i, or Basal Insulin) based on hypoglycemia risk, weight impact, and out-of-pocket budget." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Baseline & Annual Complication Screen", detail: "HbA1c, Lipid Profile, Serum Creatinine + eGFR, Urine Albumin-to-Creatinine Ratio (UACR), 12-lead ECG, dilated retinal exam, and monofilament foot exam." },
            { step: "2. Step 1 (First-Line Therapy)", detail: "Lifestyle modification + Metformin (start 500 mg OD/BID with meals, titrate to max 2,000 mg/day)." },
            { step: "3. Step 2 (If HbA1c > 7.0% after 3 months, or initial HbA1c ≥ 8.5%)", detail: "Add a second agent tailored to comorbidities (ASCVD/HF/CKD → SGLT2i; budget-constrained without cardiac/renal disease → second-generation Sulfonylurea like Gliclazide or DPP-4i)." },
            { step: "4. Step 3 (If HbA1c ≥ 9.0%–10.0% with catabolic symptoms)", detail: "Initiate Basal Insulin (10 units or 0.1–0.2 units/kg at bedtime)." }
          ]
        },
        practiceNotes: [
          { title: "Diet Counseling", detail: "Replace polished white rice portions with unpolished/brown rice, corn grits (mais), or root crops in controlled portions; eliminate sugar-sweetened beverages (3-in-1 coffee, iced tea, soft drinks)." },
          { title: "PhilHealth / RHU Access", detail: "Metformin and Gliclazide are routinely available free under PhilHealth Konsulta and DOH Hypertension & Diabetes Clubs." }
        ],
        soapPlanSummary: [
          "Baseline & Annual Complication Screen: HbA1c, Lipid Profile, Serum Creatinine + eGFR, UACR, 12-lead ECG, dilated retinal exam, and monofilament foot exam.",
          "Glycemic Therapy: Lifestyle modification + Metformin 500 mg OD/BID with meals (target HbA1c < 7.0%); add SGLT2i if ASCVD, HF, or CKD is present.",
          "Diet & PhilHealth Counseling: Portion-controlled brown rice/corn grits, avoid sugary drinks (3-in-1 coffee/soft drinks); enroll in PhilHealth Konsulta / DOH Diabetes Club."
        ]
      },
      {
        id: "cpg-dyslipidemia-adults",
        category: "Cardiovascular",
        title: "Dyslipidemia (Adults)",
        source: "Philippine CPG for the Management of Dyslipidemia (PHA / PSH / PCEDM)",
        intendedUsers: "Primary Care Physicians, Internists, Cardiologists & Outpatient Clinicians",
        keywords: ["dyslipidemia", "cholesterol", "ldl", "statin", "atorvastatin", "rosuvastatin", "triglycerides", "lipid profile", "pha", "pcedm"],
        snapshotHeaders: ["Risk Category", "Target LDL-C Goal", "Primary Therapy"],
        snapshot: [
          { col1: "Very High Risk (Clinical ASCVD, ACS, Stroke, or DM + target organ damage)", col2: "< 55 mg/dL", col3: "High-Intensity Statin (Atorvastatin 40–80 mg or Rosuvastatin 20–40 mg)" },
          { col1: "High Risk (Diabetes without organ damage, CKD Stage 3–4, or Familial Hypercholesterolemia)", col2: "< 70 mg/dL", col3: "High- or Moderate-Intensity Statin" },
          { col1: "Primary Prevention (Age ≥ 45 + ≥ 2 risk factors & LDL-C ≥ 130 mg/dL)", col2: "< 100 mg/dL", col3: "Moderate-Intensity Statin (Atorvastatin 10–20 mg or Rosuvastatin 5–10 mg)" }
        ],
        scope: {
          included: [
            "Filipino adults (≥ 19 years) evaluated for primary or secondary cardiovascular risk reduction."
          ],
          excluded: [
            { label: "Pregnant or Lactating Women", action: "Statins are contraindicated during pregnancy and lactation." },
            { label: "Acute Decompensated Liver Disease / Severe Myopathy", action: "Avoid statins in active liver failure or unexplained rhabdomyolysis." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Lifestyle & Smoking Cessation", detail: "Advise smoking/vaping cessation and ≥ 150 minutes/week of moderate-to-vigorous aerobic exercise for all patients." },
            { title: "High-Intensity Statin in ACS & Primary Risk Stratification", detail: "Initiate early maximally tolerated high-intensity statin immediately in Acute Coronary Syndrome (ACS); treat adults aged ≥ 45 with ≥ 2 risk factors (male, smoker, HTN, BMI ≥ 25, family history of premature CHD, proteinuria, LVH, postmenopausal) when LDL-C ≥ 130 mg/dL." }
          ],
          conditional: [
            { title: "Ezetimibe Add-On & FH Screening", detail: "Adding Ezetimibe if LDL-C remains above target despite maximally tolerated statin therapy; screening for Familial Hypercholesterolemia at ages 9–11 and 17–21." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen & Risk Stratify", detail: "Order fasting or non-fasting Lipid Profile (TC, LDL-C, HDL-C, Triglycerides) + baseline ALT and Creatinine." },
            { step: "2. Initiate Statin", detail: "Match statin intensity to the risk table above." },
            { step: "3. Reassess in 6–12 Weeks", detail: "Repeat lipid profile to verify LDL-C reduction. Routine CK or liver enzyme monitoring is not needed unless symptomatic (muscle pain/weakness, jaundice)." },
            { step: "4. Escalate", detail: "If LDL-C target is unmet on maximum statin dose, add Ezetimibe 10 mg OD. If Triglycerides ≥ 500 mg/dL, prioritize Fenofibrate to prevent acute pancreatitis." }
          ]
        },
        practiceNotes: [
          { title: "Local Diet", detail: "Limit deep-fried street foods, fatty pork cuts (liempo, chicharon), coconut cream (gata) in excess, and organ meats." },
          { title: "Cost & Generics", detail: "Generic Atorvastatin and Simvastatin are widely covered under PhilHealth Konsulta and senior citizen discounts." }
        ],
        soapPlanSummary: [
          "Baseline Workup: Lipid Profile (TC, LDL-C, HDL-C, Triglycerides), baseline ALT, and Serum Creatinine.",
          "Lipid-Lowering Therapy: Initiate risk-stratified Statin therapy (Atorvastatin/Rosuvastatin); repeat Lipid Profile in 6–12 weeks.",
          "Lifestyle Counseling: Limit deep-fried foods, fatty pork (liempo/chicharon), excess gata, and organ meats; ≥ 150 min/week aerobic exercise."
        ]
      },
      {
        id: "cpg-cap-adults",
        category: "Pulmonary & Infectious",
        title: "Community-Acquired Pneumonia in Adults (CAP)",
        source: "Philippine CPG on Adult CAP (PSMID / PCCP / PAFP) & PhilHealth Circular 2024-0027",
        intendedUsers: "Primary Care Physicians, Internists, Emergency & Hospitalist Clinicians",
        keywords: ["pneumonia", "cap", "community-acquired pneumonia", "cough", "psmid", "pccp", "amoxicillin", "co-amoxiclav", "ceftriaxone", "azithromycin"],
        snapshotHeaders: ["Risk Stratification", "Clinical Criteria", "Site of Care & Empiric Regimen"],
        snapshot: [
          { col1: "Low-Risk CAP", col2: "Stable vitals (RR < 30, HR < 125, BP ≥ 90/60), normal sensorium, no unstable comorbidities", col3: "Outpatient: Amoxicillin 1 g TID OR Co-amoxiclav 625 mg TID / 1 g BID (add Azithromycin if atypical suspected)" },
          { col1: "Moderate-Risk CAP", col2: "RR ≥ 30, HR > 125, BP < 90/60, acute confusion, or unstable comorbid illness", col3: "Inpatient (Ward): IV β-lactam (Ceftriaxone or Ampicillin-Sulbactam) + Oral/IV Macrolide (Azithromycin)" },
          { col1: "High-Risk CAP", col2: "Septic shock requiring vasopressors OR acute respiratory failure requiring mechanical ventilation", col3: "Inpatient (ICU): IV Anti-pseudomonal β-lactam (Piperacillin-Tazobactam / Cefepime) + Macrolide or Respiratory Fluoroquinolone" }
        ],
        scope: {
          included: [
            "Immunocompetent Filipino adults (≥ 18 years) with acute cough (< 2 weeks), abnormal vital signs/fever, and focal chest findings."
          ],
          excluded: [
            { label: "Pediatric Patients (< 18 years)", action: "Use Pediatric Community-Acquired Pneumonia (PCAP) guidelines." },
            { label: "Immunocompromised, HAP & PTB Co-Infection", action: "Exclude HIV, active chemotherapy, chronic steroids ≥ 20 mg/day prednisone for > 30 days, Hospital-Acquired Pneumonia, and Pulmonary TB." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Timely Empiric Antibiotics & Duration", detail: "Administer the first antibiotic dose within 4 hours of diagnosis; treat clinically stable low-to-moderate risk CAP for 5 days." },
            { title: "Avoid Unnecessary Outpatient Microbiologic & Repeat CXR Tests", detail: "Do not order routine sputum Gram stain/culture for low-risk outpatient CAP; do not repeat a chest X-ray before discharge if the patient is clinically improving." }
          ],
          conditional: [
            { title: "Microbiologic Workup in Moderate-to-High Risk CAP", detail: "Obtain sputum Gram stain/culture and blood cultures prior to antibiotics in moderate-to-high risk CAP or suspected multidrug-resistant organism (MDRO) risk." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm & Stratify", detail: "Chest X-ray (PA/Lateral) to confirm pulmonary infiltrates; check pulse oximetry (SpO₂) and vital signs to classify Low vs. Moderate vs. High risk." },
            { step: "2. Start Empiric Antibiotics Immediately", detail: "Administer initial antibiotic dose within 4 hours of diagnosis." },
            { step: "3. 48–72 Hour Check", detail: "Reassess fever curve, respiratory rate, and oral intake. Switch IV to oral antibiotics once hemodynamically stable and afebrile for 48 hours." },
            { step: "4. Post-Treatment Follow-Up", detail: "Order a follow-up chest X-ray 6–8 weeks post-treatment in smokers or patients > 50 years to exclude underlying lung malignancy or PTB." }
          ]
        },
        practiceNotes: [
          { title: "Rule Out PTB", detail: "Because the Philippines is TB-endemic, any cough lasting ≥ 2 weeks requires sputum Xpert MTB/RIF testing alongside CAP evaluation." },
          { title: "Prevention", detail: "Strongly recommend Pneumococcal (PCV13/PPSV23) and annual Influenza vaccines for adults ≥ 60 years and those with chronic cardiopulmonary/metabolic diseases." }
        ],
        soapPlanSummary: [
          "Diagnostics: Chest X-Ray (PA/Lateral) and pulse oximetry (SpO₂) to stratify CAP severity.",
          "Empiric Therapy: Start Amoxicillin 1 g TID or Co-Amoxiclav 625 mg TID (add Azithromycin if atypical suspected) for 5 days.",
          "Monitoring & Follow-Up: Reassess in 48–72 hours; advise Pneumococcal & Influenza vaccination; if cough ≥ 2 weeks, obtain sputum Xpert MTB/RIF."
        ]
      },
      {
        id: "cpg-ptb-adults",
        category: "Pulmonary & Infectious",
        title: "Pulmonary Tuberculosis in Adults (PTB)",
        source: "Philippine CPG for Adult Tuberculosis (PhilCAT / PSMID / PCCP) & DOH NTP Manual of Procedures (6th Ed.)",
        intendedUsers: "Primary Care Physicians, TB-DOTS Clinicians, Internists & Pulmonologists",
        keywords: ["tuberculosis", "ptb", "tb", "xpert", "genexpert", "hrze", "philcat", "ntp", "dots", "cough", "koch"],
        snapshot: [
          { parameter: "Presumptive TB", value: "Cough ≥ 2 weeks (any duration if PLHIV or high-risk contact), unexplained fever, night sweats, weight loss, or TB-suggestive CXR" },
          { parameter: "Primary Diagnostic Test", value: "Xpert MTB/RIF or Xpert Ultra (rapid molecular test detecting M. tuberculosis and Rifampicin resistance)" },
          { parameter: "Standard Drug-Susceptible Regimen", value: "2HRZE / 4HR (2 months Isoniazid, Rifampicin, Pyrazinamide, Ethambutol + 4 months Isoniazid, Rifampicin)" },
          { parameter: "Target Turnaround Time", value: "≤ 5 working days from sputum collection to treatment initiation" }
        ],
        scope: {
          included: [
            "Filipino adults (≥ 15 years per NTP program classification) with presumptive or confirmed pulmonary or extrapulmonary TB."
          ],
          excluded: [
            { label: "Pediatric TB (< 15 years)", action: "Uses weight-based dispersible FDCs and gastric aspirate/stool Xpert algorithms." },
            { label: "Rifampicin-Resistant / MDR-TB (RR/MDR-TB)", action: "Refer immediately to a Programmatic Management of Drug-Resistant TB (PMDT) treatment center." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Xpert MTB/RIF First & Daily FDC Regimen", detail: "Use Xpert MTB/RIF as the initial diagnostic test rather than smear microscopy alone; treat new drug-susceptible PTB with daily Fixed-Dose Combinations (FDCs) for 6 months (extend continuation phase to 10 months for CNS, bone, or joint TB)." },
            { title: "Universal Comorbidity Screening", detail: "Screen all TB patients for HIV and Diabetes Mellitus." }
          ],
          conditional: [
            { title: "Clinical TB Diagnosis & Adherence Support", detail: "Clinical diagnosis of TB (based on CXR and clinical judgment) when bacteriologic tests are negative or inaccessible; Digital Adherence Technologies (video-DOT) vs. facility/community-based DOT." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Collect Specimen", detail: "Obtain 1 spot sputum sample (plus baseline CXR) and send for Xpert MTB/RIF. (Use Smear Microscopy or TB-LAMP only if Xpert is unavailable)." },
            { step: "2. Initiate Treatment (2HRZE/4HR)", detail: "Dose daily using 4-FDC tablets (150/75/400/275 mg) based on body weight (30–37 kg: 2 tabs; 38–54 kg: 3 tabs; 55–70 kg: 4 tabs; >70 kg: 5 tabs). Add Pyridoxine (Vitamin B6) if pregnant, diabetic, alcoholic, or malnourished." },
            { step: "3. Monitor & Contact Trace", detail: "Repeat sputum smear microscopy at the end of Month 2, Month 5, and Month 6 to verify bacteriological conversion. Screen all household contacts and offer TB Preventive Treatment (TPT) (e.g., 3HP or 6H) once active TB is ruled out." }
          ]
        },
        practiceNotes: [
          { title: "Mandatory Notification (RA 10767)", detail: "Private physicians are legally required to notify all diagnosed TB cases via the DOH Integrated Tuberculosis Information System (ITIS)." },
          { title: "Free Diagnostics & Meds", detail: "Xpert testing and full-course FDC anti-TB medications are 100% free at all DOH-accredited TB-DOTS centers and RHUs." }
        ],
        soapPlanSummary: [
          "Diagnostics: Collect 1 spot sputum sample for GeneXpert MTB/RIF + Chest X-Ray; screen for HIV and Diabetes Mellitus (FBS/HbA1c).",
          "Treatment Regimen: Start weight-based 4-FDC (2HRZE/4HR) under TB-DOTS; add Pyridoxine (Vitamin B6) if indicated.",
          "Notification & Contact Tracing: Notify case via DOH ITIS (RA 10767) and evaluate household contacts for TB Preventive Treatment (TPT)."
        ]
      },
      {
        id: "cpg-bronchial-asthma",
        category: "Pulmonary & Infectious",
        title: "Bronchial Asthma (Primary Care)",
        source: "PAFP Clinical Practice Guideline on Bronchial Asthma & PhilHealth Circular 2024-0009",
        intendedUsers: "Primary Care Physicians, Family Medicine Practitioners, Internists & Pediatricians",
        keywords: ["asthma", "bronchial asthma", "wheezing", "inhaler", "budesonide", "formoterol", "salbutamol", "pafp", "gina", "mart"],
        snapshot: [
          { parameter: "Diagnostic Confirmation", value: "History of variable respiratory symptoms + Spirometry (≥ 12% and ≥ 200 mL FEV₁ reversibility) or PEF bronchodilator response (≥ 20% increase 15 min post-SABA)" },
          { parameter: "Core Controller Rule", value: "Never treat asthma with SABA alone; all patients need an Inhaled Corticosteroid (ICS)-containing regimen" },
          { parameter: "Preferred Track (GINA / PAFP)", value: "ICS-Formoterol (e.g., Budesonide-Formoterol) as both maintenance and reliever therapy (MART)" },
          { parameter: "Acute Exacerbation Red Flags", value: "Inability to speak in full sentences, RR > 30, HR > 120, SpO₂ < 90%, silent chest, or drowsiness" }
        ],
        scope: {
          included: [
            "Children > 5 years, adolescents, and adults presenting in primary care with episodic wheezing, dyspnea, chest tightness, or cough."
          ],
          excluded: [
            { label: "Children ≤ 5 years", action: "Use preschool wheezing pathways." },
            { label: "COPD / Asthma-COPD Overlap & Life-Threatening Exacerbations", action: "Differentiate fixed airflow obstruction in older smokers; refer life-threatening exacerbations immediately to ER." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Objective Lung Function & Written Asthma Action Plan", detail: "Perform objective lung function testing (spirometry or peak flow reversibility) at initial diagnosis; provide a written Asthma Action Plan and verify inhaler technique at every visit." },
            { title: "Antibiotic Stewardship", detail: "Do NOT prescribe antibiotics for asthma exacerbations unless clear bacterial infection is present." }
          ],
          conditional: [
            { title: "Step-Down & Track Selection", detail: "Step-down of controller dose after 3 months of well-controlled asthma; choosing between ICS-Formoterol MART vs. daily maintenance ICS + SABA reliever based on inhaler affordability and availability." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Assess Symptom Control (Past 4 Weeks)", detail: "Ask 4 questions: (1) Daytime symptoms > 2×/week? (2) Any night waking due to asthma? (3) Reliever needed > 2×/week? (4) Any activity limitation? (0 = Well-controlled; 1–2 = Partly controlled; 3–4 = Uncontrolled)." },
            { step: "2. Stepwise Controller Therapy", detail: "Step 1–2 (Mild): As-needed low-dose ICS-Formoterol (or low-dose ICS taken whenever SABA is used). Step 3 (Moderate): Daily low-dose ICS-Formoterol maintenance + reliever. Step 4 (Severe): Medium-dose ICS-Formoterol + refer to pulmonologist/allergist." },
            { step: "3. Acute Mild-to-Moderate Exacerbation (Outpatient)", detail: "Give Salbutamol MDI (4–10 puffs via spacer every 20 minutes for 1 hour) + Oral Prednisone (40–50 mg/day for 5–7 days). Refer to ER immediately if poor response after 1 hour." }
          ]
        },
        practiceNotes: [
          { title: "Spacer Use", detail: "Always recommend a valved holding chamber (spacer) with pressurized Metered-Dose Inhalers (pMDIs)—improves lung deposition and prevents oral thrush." },
          { title: "Trigger Avoidance & PhilHealth Access", detail: "Counsel against mosquito coils (katol), wood/charcoal cooking smoke, indoor tobacco/vape smoke, and dust mites. Salbutamol and Budesonide/Fluticasone inhalers are included in the PhilHealth Konsulta drug list." }
        ],
        soapPlanSummary: [
          "Controller Regimen: Initiate ICS-containing regimen (ICS-Formoterol MART or daily ICS + SABA reliever with spacer); avoid SABA monotherapy.",
          "Education & Action Plan: Provide written Asthma Action Plan, verify MDI + spacer technique, and avoid katol, cooking smoke, and tobacco/vape exposure.",
          "Follow-Up: Reassess asthma symptom control in 2–4 weeks (or within 48 hours if recovering from an acute exacerbation)."
        ]
      },
      {
        id: "cpg-acute-ischemic-stroke",
        category: "Neurology & Emergency",
        title: "Acute Ischemic Stroke (Emergency & Secondary Prevention)",
        source: "Stroke Society of the Philippines (SSP) CPG & PhilHealth Circular 2024-0030",
        intendedUsers: "Emergency Physicians, Internists, Neurologists & Primary Care Clinicians",
        keywords: ["stroke", "ischemic stroke", "cva", "alteplase", "rt-pa", "fast", "nihss", "ssp", "cranial ct", "aspirin", "clopidogrel"],
        snapshot: [
          { parameter: "Mandatory First Test", value: "Urgent Non-Contrast Cranial CT Scan immediately upon arrival (to rule out intracranial hemorrhage)" },
          { parameter: "Thrombolysis Window", value: "IV Alteplase (rt-PA) within ≤ 4.5 hours of symptom onset / Last Known Well" },
          { parameter: "BP Limit (If Thrombolysis)", value: "Must lower BP to < 185/110 mm Hg before IV rt-PA, and maintain < 180/105 mm Hg for 24 hours" },
          { parameter: "BP Limit (No Thrombolysis)", value: "Permissive Hypertension: Do not lower BP unless ≥ 220/120 mm Hg during the first 24–48 hours" }
        ],
        scope: {
          included: [
            "Adults presenting with sudden focal neurological deficits (FAST: Face drooping, Arm weakness, Speech difficulty)."
          ],
          excluded: [
            { label: "Intracerebral / Subarachnoid Hemorrhage on CT", action: "Requires immediate neurosurgical referral and hemorrhagic stroke BP targets." },
            { label: "Stroke Mimics", action: "Exclude hypoglycemia, post-ictal paralysis (seizures), and complicated migraine." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Hyperacute Triage, CT & Reperfusion", detail: "Check capillary blood glucose (CBG) immediately in all suspected stroke patients; perform urgent non-contrast brain CT before giving any antiplatelet or thrombolytic; administer IV Alteplase to eligible patients within 4.5 hours." },
            { title: "Antiplatelet & Dysphagia Protocol", detail: "Start Aspirin (160–325 mg) within 24–48 hours (delayed by 24 hours if IV rt-PA was given); perform dysphagia screening before giving any oral food, water, or pills." }
          ],
          conditional: [
            { title: "Short-Term DAPT in Minor Stroke / High-Risk TIA", detail: "Short-term Dual Antiplatelet Therapy (DAPT: Aspirin + Clopidogrel for 21 days) in minor non-cardioembolic ischemic stroke (NIHSS ≤ 3) or high-risk TIA, followed by single antiplatelet therapy." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. 0–15 Minutes (Triage)", detail: "Stabilize ABCs, check CBG, establish IV access, record exact Last Known Well time, and calculate NIHSS score." },
            { step: "2. 15–45 Minutes (Imaging)", detail: "Urgent Non-Contrast Cranial CT." },
            { step: "3. Hyperacute Reperfusion", detail: "If ischemic stroke within 4.5 hours and no contraindications, administer IV Alteplase (0.9 mg/kg, max 90 mg; 10% bolus, 90% over 1 hour) and refer/admit to an Acute Stroke Unit." },
            { step: "4. Secondary Prevention Workup", detail: "12-lead ECG / Holter (to detect Atrial Fibrillation → switch to oral anticoagulation), carotid duplex ultrasound, lipid profile, and HbA1c. Start high-intensity statin + antihypertensive after the acute phase." }
          ]
        },
        practiceNotes: [
          { title: "Stroke-Ready Referral", detail: "If your facility lacks a CT scanner or IV thrombolysis capability, transfer immediately to the nearest SSP-certified Stroke-Ready Hospital without delaying for unnecessary lab workups." },
          { title: "PhilHealth Coverage", detail: "PhilHealth provides dedicated inpatient benefit packages for both ischemic and hemorrhagic stroke (including thrombolysis coverage under updated PhilHealth circulars)." }
        ],
        soapPlanSummary: [
          "Emergency Action: Check CBG immediately, record Last Known Well time, and obtain urgent Non-Contrast Cranial CT (or transfer immediately to nearest SSP Stroke-Ready Hospital).",
          "Acute Management: Keep NPO pending dysphagia screening; maintain permissive hypertension (< 220/120 mm Hg if no rt-PA; < 185/110 mm Hg if eligible for IV Alteplase within 4.5 hrs).",
          "Secondary Prevention: Start Aspirin 160–325 mg (24h post-rt-PA if thrombolyzed), High-Intensity Statin, 12-Lead ECG / Holter, Carotid Duplex, Lipid Profile, and HbA1c."
        ]
      },
      {
        id: "cpg-pcap-peds",
        category: "Pediatrics",
        title: "Pediatric Community-Acquired Pneumonia (PCAP)",
        source: "PAPP-PIDSP Clinical Practice Guidelines in the Evaluation and Management of PCAP & PhilHealth Circular 2024-0005",
        intendedUsers: "Pediatricians, Primary Care Physicians, Emergency & Hospital Clinicians",
        keywords: ["pcap", "pediatric pneumonia", "pneumonia in children", "tachypnea", "amoxicillin", "papp", "pidsp", "chest indrawing"],
        snapshot: [
          { parameter: "Age-Specific Tachypnea", value: "3–12 mos: ≥ 50 bpm | > 1–5 yrs: ≥ 40 bpm | > 5–12 yrs: ≥ 30 bpm | > 12 yrs: ≥ 20 bpm" },
          { parameter: "Key Clinical Predictors", value: "Cough or fever PLUS tachypnea, chest indrawing/retractions, nasal flaring, or SpO₂ < 95% at room air" },
          { parameter: "Non-Severe (Outpatient)", value: "Amoxicillin (40–50 mg/kg/day in 3 doses, or 80–90 mg/kg/day in 2 doses) for 5–7 days" },
          { parameter: "Severe (Inpatient)", value: "IV Ampicillin (150–200 mg/kg/day) or IV Penicillin G (unimmunized/severe: IV Ceftriaxone 75–100 mg/kg/day)" }
        ],
        scope: {
          included: [
            "Immunocompetent infants and children aged 3 months to 18 years with uncomplicated community-acquired pneumonia in outpatient or inpatient settings."
          ],
          excluded: [
            { label: "Neonates & Infants < 3 Months", action: "Require immediate hospital admission for neonatal sepsis/pneumonia workup." },
            { label: "Immunocompromised, HAP & Suspected PTB", action: "Exclude immunocompromised hosts, healthcare-associated pneumonia, and suspected Pulmonary TB." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Diagnostic Aid for Severe PCAP", detail: "Perform Chest X-ray (or Point-of-Care Chest Ultrasound [POCUS] by a skilled operator) as the initial diagnostic aid for patients classified with Severe PCAP." },
            { title: "First-Line Empiric Oral Therapy", detail: "Administer Amoxicillin as first-line empiric oral therapy for non-severe bacterial PCAP." },
            { title: "Primary Immunization", detail: "Ensure primary immunization with PCV (Pneumococcal Conjugate Vaccine) and Hib vaccines to prevent PCAP." }
          ],
          conditional: [
            { title: "Avoid Routine Outpatient Labs/CXR", detail: "Routine Chest X-ray, CBC, or blood cultures are not required for non-severe outpatient PCAP." },
            { title: "Atypical Coverage in School-Aged Children", detail: "Adding a macrolide (Azithromycin/Clarithromycin) when Mycoplasma or Chlamydophila (atypical pneumonia) is strongly suspected—typically in school-aged children (> 5 years) with subacute cough." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Classify Severity & Triage", detail: "Non-Severe PCAP (Outpatient): Cough/fever + tachypnea, able to feed/drink, SpO₂ ≥ 95%, no chest indrawing or danger signs. Severe PCAP (Admit Immediately): Any general danger sign (inability to drink/breastfeed, persistent vomiting, convulsions, lethargy/unconsciousness), chest indrawing, nasal flaring, grunting, cyanosis, SpO₂ < 95%, or severe malnutrition." },
            { step: "2. Initiate Empiric Therapy", detail: "Outpatient: Oral Amoxicillin (80–90 mg/kg/day divided BID if high pneumococcal resistance is suspected, or 40–50 mg/kg/day divided TID). Inpatient (Severe): Start oxygen to keep SpO₂ ≥ 95%; start IV Ampicillin (fully immunized) or IV Ceftriaxone/Cefotaxime (unimmunized, critically ill, or β-lactamase-producing H. influenzae suspected). Add IV Oxacillin/Clindamycin if Staphylococcus aureus (pneumatocele/empyema) is suspected." },
            { step: "3. 48–72 Hour Reassessment", detail: "Re-evaluate outpatients within 48 hours. If fever persists or tachypnea/retractions worsen, admit for IV antibiotics and chest radiography." }
          ]
        },
        practiceNotes: [
          { title: "Avoid Unnecessary Cough Meds", detail: "Strongly advise parents against OTC antitussives, mucolytics, antihistamines, or oral bronchodilators (unless coexisting reactive airway disease/asthma is present)." },
          { title: "Public Health Access", detail: "Amoxicillin suspension/tablets and PCV13 childhood immunizations are provided free at Barangay Health Stations and RHUs under the DOH National Immunization Program." }
        ],
        soapPlanSummary: [
          "Severity Triage: Assessed respiratory rate by age, SpO₂ (≥ 95%), chest indrawing, and general danger signs.",
          "Empiric Therapy: Start Oral Amoxicillin (40–50 mg/kg/day TID or 80–90 mg/kg/day BID) for 5–7 days; avoid OTC antitussives, mucolytics, and antihistamines.",
          "Follow-Up & Red Flags: Reassess within 48 hours; return immediately if chest indrawing, fast breathing, inability to drink, or lethargy develops."
        ]
      },
      {
        id: "cpg-dengue-peds",
        category: "Pediatrics",
        title: "Dengue in Children",
        source: "PPS-PIDSP Clinical Practice Guidelines on Dengue in Children & DOH Revised Dengue Clinical Management Guidelines",
        intendedUsers: "Primary Care Physicians, Pediatricians, Emergency & Inpatient Clinicians",
        keywords: ["pediatric dengue", "dengue in children", "dengue", "ns1", "warning signs", "dss", "pps", "pidsp", "oresol", "tourniquet"],
        snapshotHeaders: ["Classification", "Clinical & Lab Criteria", "Care Setting & Fluid Strategy"],
        snapshot: [
          { col1: "Group A (Dengue without Warning Signs)", col2: "Fever 2–7 days + ≥ 2 criteria (nausea/vomiting, rash, aches/pains, leukopenia, (+) tourniquet test); able to tolerate oral fluids, normal urine output, stable Hct", col3: "Outpatient: Aggressive oral hydration (ORS, water, fruit juice, soup) + daily CBC/Hct monitoring" },
          { col1: "Group B (Dengue with Warning Signs)", col2: "Abdominal pain/tenderness, persistent vomiting, clinical fluid accumulation, mucosal bleed, lethargy/restlessness, liver enlargement > 2 cm, or ↑ Hct with rapid ↓ Platelet", col3: "Inpatient Admission: Start Isotonic Crystalloids (0.9% NaCl or Plain LR) at 5–7 mL/kg/hr for 1–2 hrs, then titrate down based on Hct & urine output" },
          { col1: "Group C (Severe Dengue)", col2: "Severe plasma leakage leading to Dengue Shock Syndrome (DSS) (pulse pressure ≤ 20 mm Hg, cold extremities, delayed cap refill) or fluid overload with respiratory distress; severe bleeding; severe organ impairment", col3: "ICU / Resuscitation: Immediate Isotonic Crystalloid bolus (10–20 mL/kg over 15–60 min depending on compensated vs. hypotensive shock)" }
        ],
        scope: {
          included: [
            "Pediatric patients presenting with suspected or laboratory-confirmed dengue virus infection across febrile, critical (defervescence), and recovery phases."
          ],
          excluded: [
            { label: "Adult Dengue Patients", action: "Use adult fluid maintenance formulas (e.g., Holliday-Segar vs. ideal body weight adjustments in obese adults)." },
            { label: "Concurrent Bacterial Sepsis / Meningitis", action: "Evaluate and treat coexisting invasive bacterial infections appropriately." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Admit Persistent Vomiting or Any Warning Sign", detail: "Admit any child with persistent vomiting (unable to tolerate oral rehydration) or any Warning Sign." },
            { title: "Use Isotonic IV Fluids Only", detail: "Use Isotonic IV fluids (Plain Lactated Ringer's or 0.9% Normal Saline)—strongly avoid hypotonic fluids (e.g., D5 0.3% NaCl), which cause dangerous hyponatremia." },
            { title: "Avoid Prophylactic Platelets, Routine PT/PTT & NSAIDs", detail: "Do NOT give prophylactic platelet transfusions for thrombocytopenia (< 50,000/mm³) when there is minimal or no active bleeding; do NOT order routine PT/PTT coagulation tests in uncomplicated dengue; never prescribe NSAIDs (Ibuprofen, Mefenamic Acid) or Aspirin due to severe bleeding and Reye syndrome risk." }
          ],
          conditional: [
            { title: "Outpatient Group A Eligibility", detail: "Outpatient management for Group A patients only if caregivers can reliably monitor warning signs at home and return daily for CBC/hematocrit checks." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm & Phase-Check", detail: "Days 1–3 (Febrile Phase): Order Dengue NS1 Antigen + baseline CBC (establish baseline Hematocrit). Day 4+ / Defervescence (Critical Phase): Order Dengue IgM/IgG + serial CBC/Hematocrit. Watch closely when fever drops—this is when plasma leakage begins." },
            { step: "2. Manage Group A (Outpatient)", detail: "Prescribe Paracetamol (10–15 mg/kg/dose every 4–6 hours) + tepid sponge bath. Give a written Warning Signs Checklist and mandate daily follow-up CBC." },
            { step: "3. Manage Group B (Inpatient Titration)", detail: "Start Plain LR or 0.9% NaCl: 5–7 mL/kg/hr (1–2 hrs) → 3–5 mL/kg/hr (2–4 hrs) → 2–3 mL/kg/hr. Target urine output of 0.5–1 mL/kg/hr. Taper IV fluids at 24–48 hours once Hct stabilizes and oral intake resumes to prevent fluid overload during the recovery phase." },
            { step: "4. Manage Significant Bleeding", detail: "Transfuse Packed RBCs (5–10 mL/kg) or fresh whole blood if occult/overt bleeding causes dropping hematocrit with hemodynamic instability." }
          ]
        },
        practiceNotes: [
          { title: "Avoid Herbal/Unproven Remedies & Dark Foods", detail: "Advise parents that tawa-tawa tea or papaya leaf extract does not replace oral rehydration salts (ORS) or medical monitoring, and dark-colored drinks/foods (chocolate, red gelatin, dinuguan) should be avoided so they are not confused with melena or coffee-ground vomitus." },
          { title: "PhilHealth Coverage", detail: "Dengue Fever and Severe Dengue have dedicated PhilHealth inpatient case rate packages." }
        ],
        soapPlanSummary: [
          "Diagnostics: Order Dengue NS1 (Days 1–3) or Dengue IgM/IgG (Day 4+) + daily serial CBC with Hematocrit and Platelet count.",
          "Hydration & Antipyretics: Group A aggressive oral hydration (ORS, water, clear soup) + Paracetamol 10–15 mg/kg/dose q4–6h PRN; strictly avoid NSAIDs/Aspirin and dark-colored foods/drinks.",
          "Warning Signs & Follow-Up: Watch closely during defervescence for abdominal pain, persistent vomiting, mucosal bleeding, or lethargy; return daily for CBC."
        ]
      },
      {
        id: "cpg-age-peds",
        category: "Pediatrics",
        title: "Acute Gastroenteritis in Children (AGE)",
        source: "PPS-PIDSP Clinical Practice Guidelines on Acute Infectious Diarrhea in Children & DOH IMCI Guidelines",
        intendedUsers: "Primary Care Physicians, Pediatricians, Rural Health Unit (RHU) & Emergency Clinicians",
        keywords: ["age", "acute gastroenteritis", "diarrhea", "dehydration", "ors", "oresol", "zinc", "plan a", "plan b", "plan c", "imci", "pidsp"],
        snapshotHeaders: ["Dehydration Status", "Clinical Signs", "Rehydration Plan"],
        snapshot: [
          { col1: "No Dehydration (Plan A)", col2: "Alert, normal eyes, tears present, moist tongue, drinks normally, skin pinch goes back quickly", col3: "Outpatient: Low-Osmolarity ORS after each loose stool (50–100 mL if < 2 yrs; 100–200 mL if ≥ 2 yrs) + Zinc" },
          { col1: "Some Dehydration (Plan B)", col2: "Restless/irritable, sunken eyes, absent tears, dry tongue, drinks eagerly/thirsty, skin pinch goes back slowly (< 2 sec)", col3: "Observation / Clinic: Low-Osmolarity ORS 75 mL/kg over 4 hours; reassess after 4 hours" },
          { col1: "Severe Dehydration (Plan C)", col2: "Lethargic/unconscious, deeply sunken eyes, unable to drink/drinks poorly, skin pinch goes back very slowly (≥ 2 sec)", col3: "Emergency IV: Plain Lactated Ringer's (or 0.9% NaCl) 100 mL/kg divided by age (see Pathway below)" }
        ],
        scope: {
          included: [
            "Infants and children aged 1 month to 18 years presenting with acute diarrhea (≥ 3 loose/watery stools in 24 hours lasting < 14 days)."
          ],
          excluded: [
            { label: "Persistent / Chronic Diarrhea (≥ 14 days)", action: "Evaluate for chronic enteropathy, parasitic infection, or malabsorption." },
            { label: "Severe Acute Malnutrition (SAM) & Surgical Abdomen", action: "SAM uses specialized ReSoMal and slower IV fluid protocols to prevent heart failure; exclude intussusception and acute appendicitis." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Low-Osmolarity ORS & Oral Zinc", detail: "Use Reduced-Osmolarity Oral Rehydration Salts (ORS: 245 mOsm/L) as first-line therapy for mild-to-moderate dehydration; administer Oral Zinc supplementation for 10–14 days (10 mg/day for infants < 6 months; 20 mg/day for children ≥ 6 months) to reduce stool duration and recurrence." },
            { title: "Continued Feeding", detail: "Continue age-appropriate feeding (including breastmilk) immediately once initial rehydration is achieved—do not routinely dilute milk formula or enforce bowel rest." },
            { title: "Avoid Routine Antibiotics, Antimotility & Metoclopramide", detail: "Do NOT prescribe empiric antibiotics for routine acute watery diarrhea (majority are viral, e.g., Rotavirus/Norovirus); never give antimotility drugs (Loperamide) or antiemetics like Metoclopramide to children." }
          ],
          conditional: [
            { title: "Probiotics, Racecadotril & Single-Dose Oral Ondansetron", detail: "Specific probiotics (Lactobacillus rhamnosus GG or Saccharomyces boulardii) or Racecadotril as adjuncts to ORS to shorten diarrhea duration by ~1 day, balanced against out-of-pocket cost; single-dose Oral Ondansetron (0.15 mg/kg) to facilitate oral rehydration in children with persistent vomiting that blocks ORS intake." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Assess Hydration & Screen for Red Flags", detail: "Check mental status, eyes, thirst, skin turgor, capillary refill, and weight. Screen for dysentery (bloody stools), high fever, severe abdominal distension, or bilious vomiting." },
            { step: "2. Execute Rehydration Plan", detail: "Plan B (75 mL/kg ORS over 4 hrs): Give small, frequent sips via spoon/cup (5 mL every 1–2 min if vomiting). If child vomits, wait 10 minutes and resume slower. Plan C (100 mL/kg Plain LR IV): Infants < 12 months: 30 mL/kg in 1 hour, then 70 mL/kg in 5 hours (Total: 6 hours). Children ≥ 12 months: 30 mL/kg in 30 minutes, then 70 mL/kg in 2.5 hours (Total: 3 hours). Start ORS (5 mL/kg/hr) as soon as the child can drink." },
            { step: "3. Targeted Antibiotics ONLY When Indicated", detail: "Bloody Diarrhea / Shigellosis: Azithromycin (10 mg/kg Day 1, then 5 mg/kg Days 2–5) or Cefixime (8 mg/kg/day for 5 days). Suspected Cholera (profuse rice-water stools + severe dehydration in endemic/outbreak area): Azithromycin (20 mg/kg single dose) or Doxycycline (if ≥ 8 years). Confirmed Amoebiasis (trophozoites with ingested RBCs on stool exam): Metronidazole (30–50 mg/kg/day TID for 7–10 days)." }
          ]
        },
        practiceNotes: [
          { title: "Homemade ORS Warning", detail: "Strongly discourage parents from using commercial sports drinks, sodas, or sweetened juices (high osmolarity worsens osmotic diarrhea). Instruct them to dissolve 1 packet of DOH Oresol in 1 liter of clean boiled/potable water (discard after 24 hours)." },
          { title: "Free RHU Supplies", detail: "Oresol packets and Zinc sulfate syrup/dispersible tablets are available free at all Barangay Health Stations and RHUs." }
        ],
        soapPlanSummary: [
          "Rehydration Plan: Administer Reduced-Osmolarity ORS (Plan A after each loose stool, or Plan B 75 mL/kg over 4 hours); avoid sports drinks, sodas, and sweetened juices.",
          "Supplementation & Feeding: Oral Zinc for 10–14 days (10 mg/day if < 6 mos; 20 mg/day if ≥ 6 mos); continue breastfeeding and age-appropriate feeding; avoid Loperamide and routine antibiotics.",
          "Red Flags & Follow-Up: Return immediately if bloody stools, persistent vomiting, inability to drink, sunken eyes, or lethargy develops."
        ]
      },
      {
        id: "cpg-gdm-obstetrics",
        category: "Obstetrics & Maternal Health",
        title: "Gestational Diabetes Mellitus (GDM)",
        source: "POGS Clinical Practice Guidelines on Diabetes Mellitus in Pregnancy & UNITE for Diabetes Philippines",
        intendedUsers: "OB-GYNs, Primary Care Physicians, Family Medicine & RHU Clinicians",
        keywords: ["gdm", "gestational diabetes", "diabetes in pregnancy", "75g ogtt", "ogtt", "pogs", "unite for diabetes", "insulin", "nph", "macrosomia"],
        snapshot: [
          { parameter: "Universal Screening Window", value: "24–28 weeks Age of Gestation (AOG) using a One-Step 75g Oral Glucose Tolerance Test (OGTT)" },
          { parameter: "Early Screening (1st Visit)", value: "Screen at first prenatal visit if high-risk (previous GDM, macrosomia ≥ 4.0 kg, BMI ≥ 25 kg/m², PCOS, strong 1st-degree family history of DM)" },
          { parameter: "GDM Diagnostic Cutoffs (75g OGTT)", value: "Any ONE value met or exceeded: Fasting ≥ 92 mg/dL (5.1 mmol/L) | 1-Hour ≥ 180 mg/dL (10.0 mmol/L) | 2-Hour ≥ 153 mg/dL (8.5 mmol/L)" },
          { parameter: "Overt Diabetes in Pregnancy", value: "Fasting ≥ 126 mg/dL, 2-hr 75g OGTT ≥ 200 mg/dL, HbA1c ≥ 6.5%, or RBS ≥ 200 mg/dL with symptoms" },
          { parameter: "Glycemic Targets", value: "Fasting: < 95 mg/dL | 1-hr postprandial: < 140 mg/dL | 2-hr postprandial: < 120 mg/dL" }
        ],
        scope: {
          included: [
            "Pregnant Filipino women with hyperglycemia first recognized during pregnancy (GDM) or overt diabetes diagnosed during pregnancy."
          ],
          excluded: [
            { label: "Pre-Existing Type 1 or Type 2 Diabetes Mellitus", action: "Manage under pre-gestational diabetes protocols (preconception folate 5 mg/day, baseline retinal/renal exams, and immediate discontinuation of teratogenic drugs like ACEi/ARBs and statins)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Universal Screening at 24–28 Weeks AOG", detail: "Perform universal screening for all pregnant Filipino women at 24–28 weeks AOG (Filipinos are an ethnic group at high baseline risk for insulin resistance)." },
            { title: "First-Line Medical Nutrition Therapy (MNT) & Activity", detail: "Start Medical Nutrition Therapy (MNT) and moderate physical activity (e.g., 30 minutes of brisk walking daily if no obstetric contraindications) as initial first-line therapy for 1–2 weeks." },
            { title: "Gold-Standard Pharmacotherapy & Postpartum Reclassification", detail: "Use Human Insulin (NPH, Regular, or pregnancy-approved rapid-acting analogs) when lifestyle therapy fails to achieve glycemic targets; perform a postpartum 75g OGTT at 6–12 weeks after delivery to reclassify maternal glycemic status." }
          ],
          conditional: [
            { title: "Metformin as Alternative Second-Line Option", detail: "Use of Metformin when a patient refuses insulin, cannot safely administer injections, or cannot afford insulin—while counseling that Metformin crosses the placenta and ~30–40% of patients still require supplemental insulin." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen & Diagnose", detail: "Order 75g OGTT (after an 8–14 hour overnight fast). If normal at the 1st prenatal visit in a high-risk patient, repeat the 75g OGTT at 24–28 weeks AOG." },
            { step: "2. Initiate MNT & Self-Monitoring (Weeks 1–2)", detail: "Prescribe a personalized diabetic meal plan (3 small-to-moderate meals + 2–3 snacks; avoiding prolonged fasting to prevent maternal ketosis). Instruct Self-Monitoring of Blood Glucose (SMBG) 4 times daily (Fasting + 1-hr or 2-hr post-meals)." },
            { step: "3. Escalate to Pharmacotherapy", detail: "If ≥ 20%–30% of SMBG readings exceed target after 1–2 weeks of strict MNT, start Insulin (typical starting total daily dose: 0.7–1.0 units/kg/day divided across basal NPH and pre-meal Regular insulin, titrated every 3–7 days)." },
            { step: "4. Fetal Surveillance & Delivery Timing", detail: "Order Congenital Anomaly Scan (CAS) at 18–24 weeks (especially if overt diabetes). Begin NST / BPP at 32 weeks AOG if on insulin or poorly controlled (or 36 weeks if diet-controlled). Delivery Timing: Diet-controlled GDM with normal fetal growth → deliver at 39 0/7 to 40 6/7 weeks; Insulin-controlled GDM → deliver at 39 0/7 to 39 6/7 weeks (earlier at 37–38 weeks if poorly controlled). Consider scheduled Cesarean section if estimated fetal weight is ≥ 4,000–4,500 g to prevent shoulder dystocia." }
          ]
        },
        practiceNotes: [
          { title: "Filipino Diet Coaching", detail: "Advise patients to strictly limit white rice to 1/2 to 1 cup per meal paired with high-fiber vegetables (malunggay, ampalaya, sitaw) and lean protein (bangus, tilapia, skinless chicken), and completely eliminate sweetened 3-in-1 coffee, soft drinks, fruit juices, and sweet pastries (pan de sal with sweet spreads)." },
          { title: "Postpartum Follow-Up", detail: "Because > 50% of Filipino women with GDM develop Type 2 DM within 5–10 years, counsel exclusive breastfeeding (which improves maternal insulin sensitivity), perform a 75g OGTT at 6–12 weeks postpartum, and repeat diabetes screening every 1–3 years lifelong." }
        ],
        soapPlanSummary: [
          "Screening & Monitoring: 75g OGTT (8–14 hr fast); initiate 4×/day SMBG (targets: Fasting < 95 mg/dL, 1-hr PP < 140 mg/dL, 2-hr PP < 120 mg/dL).",
          "Medical Nutrition Therapy & Escalation: Limit white rice to 1/2–1 cup/meal + high-fiber vegetables and lean fish/poultry; eliminate 3-in-1 coffee, sodas, and sweet pastries; start Human Insulin if ≥ 20%–30% readings exceed target after 1–2 weeks.",
          "Fetal Surveillance & Postpartum Plan: CAS at 18–24 weeks, NST/BPP starting 32–36 weeks AOG; schedule 6–12 weeks postpartum 75g OGTT and encourage exclusive breastfeeding."
        ]
      },
      {
        id: "cpg-preeclampsia-eclampsia",
        category: "Obstetrics & Maternal Health",
        title: "Preeclampsia and Eclampsia",
        source: "POGS Clinical Practice Guidelines on Hypertension in Pregnancy & DOH Maternal Health Protocols",
        intendedUsers: "OB-GYNs, Primary Care Physicians, Rural Health Unit (RHU) & Emergency Clinicians",
        keywords: ["preeclampsia", "eclampsia", "gestational hypertension", "hellp", "magnesium sulfate", "mgso4", "hydralazine", "labetalol", "nifedipine", "pogs", "cemonc"],
        snapshot: [
          { parameter: "Diagnostic Criteria", value: "New-onset BP ≥ 140/90 mm Hg after 20 weeks AOG (2 readings ≥ 4 hrs apart) PLUS proteinuria (≥ 300 mg/24 hr, UPCR ≥ 0.3, or dipstick ≥ 2+) OR severe features" },
          { parameter: "Severe Features", value: "BP ≥ 160/110 mm Hg, Platelets < 100,000/μL, AST/ALT ≥ 2× upper limit, Serum Creatinine > 1.1 mg/dL (or doubling), Pulmonary Edema, or new-onset headache/visual disturbances" },
          { parameter: "Eclampsia", value: "New-onset generalized tonic-clonic seizures or coma in a patient with preeclampsia (can occur antepartum, intrapartum, or up to 6 weeks postpartum)" },
          { parameter: "Seizure Prophylaxis & Tx", value: "Magnesium Sulfate (MgSO₄) (Zuspan IV or Pritchard IV/IM regimen)—drug of choice" },
          { parameter: "Acute Severe BP Drugs", value: "IV Hydralazine, IV Labetalol, or Oral Immediate-Release Nifedipine (target BP: 140–150 / 90–100 mm Hg)" }
        ],
        scope: {
          included: [
            "Pregnant and postpartum women (up to 6 weeks post-delivery) presenting with Gestational Hypertension, Preeclampsia (with or without severe features), Chronic Hypertension with Superimposed Preeclampsia, HELLP Syndrome, or Eclampsia."
          ],
          excluded: [
            { label: "Uncomplicated Chronic Hypertension (< 20 weeks AOG without superimposed preeclampsia)", action: "Manage with pregnancy-safe oral maintenance therapy (Methyldopa, Labetalol, or Extended-Release Nifedipine; ACE inhibitors, ARBs, and Atenolol are strictly contraindicated)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Prevention in High-Risk Women", detail: "Prescribe Low-Dose Aspirin (80–150 mg at bedtime) starting at 12–16 weeks AOG until 36–37 weeks, plus Calcium supplementation (1.5–2.0 g/day) starting at 20 weeks in populations with low dietary calcium intake (standard in the Philippines)." },
            { title: "Magnesium Sulfate (MgSO₄) & Urgent Antihypertensives", detail: "Administer MgSO₄ immediately to all women with Eclampsia or Preeclampsia with Severe Features to prevent/control seizures (superior to Diazepam or Phenytoin); treat acute severe hypertension (≥ 160/110 mm Hg sustained for ≥ 15 minutes) within 30–60 minutes to prevent maternal hemorrhagic stroke." },
            { title: "Definitive Delivery Timing", detail: "Deliver at ≥ 37 0/7 weeks for preeclampsia without severe features, and at ≥ 34 0/7 weeks (or immediately after maternal stabilization regardless of AOG if unstable/eclampsia/HELLP) for preeclampsia with severe features." }
          ],
          conditional: [
            { title: "Expectant Management (24 0/7 to 33 6/7 Weeks)", detail: "Expectant management between 24 0/7 and 33 6/7 weeks in carefully selected, stable patients with severe preeclampsia only in a tertiary hospital with NICU and ICU capability, after administering antenatal corticosteroids (Betamethasone or Dexamethasone) for fetal lung maturity." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Baseline Preeclampsia Labs", detail: "Order CBC with Platelet count, AST/ALT, Serum Creatinine, Serum Uric Acid, LDH, and Urine Protein-to-Creatinine Ratio (UPCR) or 24-hour urine protein." },
            { step: "2. Stabilize Acute Severe BP (≥ 160/110 mm Hg)", detail: "Oral Nifedipine (Immediate-Release): 10 mg PO; repeat 10–20 mg every 20–30 minutes if needed (max 50 mg). IV Hydralazine: 5 mg IV slow push; repeat 5–10 mg every 20 minutes (max 20 mg). IV Labetalol: 20 mg IV over 2 min → 40 mg → 80 mg every 10–20 min (max 300 mg)." },
            { step: "3. Administer Magnesium Sulfate (MgSO₄) Protocol", detail: "Loading Dose: 4 g IV slowly over 15–20 minutes (or Pritchard: 4 g IV + 10 g deep IM [5 g per buttock]). Maintenance: 1–2 g/hr continuous IV infusion (or 5 g deep IM q4h) until 24 hours postpartum. Hourly Toxicity Check: (1) Patellar reflexes present, (2) RR ≥ 12–16/min, (3) Urine output ≥ 30 mL/hr. Keep Calcium Gluconate (1 g IV over 3–5 min) at bedside." },
            { step: "4. Eclampsia Seizure Emergency", detail: "Turn patient to left lateral decubitus position, protect airway, give high-flow O₂, administer MgSO₄ loading dose, control BP, and plan prompt delivery once stabilized." }
          ]
        },
        practiceNotes: [
          { title: "Primary Care / Lying-In Referral Protocol", detail: "Birthing homes and RHUs must not attempt outpatient management of preeclampsia. Under DOH maternal health protocols, primary care staff must give the loading dose of MgSO₄ and initial oral Nifedipine/Hydralazine prior to immediate ambulance transfer to a CEmONC (Comprehensive Emergency Obstetric and Newborn Care) hospital." },
          { title: "Postpartum Vigilance", detail: "Warn discharged patients to return immediately for severe headache, visual blurring, epigastric/right upper quadrant pain, or shortness of breath—up to 30% of eclampsia cases occur postpartum." }
        ],
        soapPlanSummary: [
          "Baseline Preeclampsia Labs: Order CBC with Platelet count, AST/ALT, Serum Creatinine, Serum Uric Acid, LDH, and UPCR / 24-hour urine protein.",
          "Seizure Prophylaxis & Acute BP Control: Administer MgSO₄ loading dose (4 g IV over 15–20 min; Pritchard +10 g IM if no IV infusion pump) and treat BP ≥ 160/110 mm Hg with Oral IR Nifedipine 10 mg, IV Hydralazine 5 mg, or IV Labetalol 20 mg.",
          "CEmONC Referral & Counseling: Transfer immediately to a CEmONC-capable hospital for definitive obstetric management; educate on postpartum danger signs (headache, visual blurring, epigastric pain, dyspnea)."
        ]
      },
      {
        id: "cpg-leptospirosis-adults",
        category: "Pulmonary & Infectious",
        title: "Leptospirosis (Adults)",
        source: "PSMID Clinical Practice Guidelines on the Diagnosis, Management, and Prevention of Leptospirosis & DOH Leptospirosis Guidelines",
        intendedUsers: "Primary Care Physicians, Internists, Emergency & Rural Health Unit (RHU) Clinicians",
        keywords: ["leptospirosis", "lepto", "floodwater", "doxycycline", "weil", "calf pain", "conjunctival suffusion", "psmid", "prophylaxis"],
        snapshot: [
          { parameter: "Suspected Case Criteria", value: "Acute febrile illness (≥ 2 days) + exposure to floodwater, mud, or animal urine within 2–30 days + ≥ 2 symptoms (myalgia/calf tenderness, conjunctival suffusion, headache, jaundice, oliguria/anuria, bleeding)" },
          { parameter: "Mild Leptospirosis (Outpatient)", value: "Doxycycline 100 mg PO BID for 7 days (Alt: Amoxicillin 500 mg TID or Azithromycin 1 g Day 1 then 500 mg OD for 2 days)" },
          { parameter: "Moderate-to-Severe (Inpatient)", value: "IV Penicillin G 1.5 million units IV q6h OR IV Ceftriaxone 1 g IV q24h OR IV Cefotaxime 1 g IV q6h for 7 days" },
          { parameter: "Post-Exposure Prophylaxis", value: "Low-risk (single exposure, no wounds): Doxycycline 200 mg single dose within 24–72 hrs | Moderate-risk (single exposure + cuts/wounds): Doxycycline 200 mg OD for 3–5 days | High-risk (continuous exposure): Doxycycline 200 mg once weekly until exposure ends" }
        ],
        scope: {
          included: [
            "Filipino adolescents and adults presenting with suspected or confirmed mild-to-severe leptospirosis or recent floodwater/contaminated soil exposure."
          ],
          excluded: [
            { label: "Pregnant / Lactating Women & Children < 8 Years", action: "Doxycycline is contraindicated; use Amoxicillin or Azithromycin for mild disease/prophylaxis, and IV Penicillin G or IV Ceftriaxone for severe disease." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Start Empiric Antibiotics Immediately", detail: "Initiate empiric antibiotics immediately upon clinical suspicion—do NOT wait for confirmatory serology (MAT/IgM), as early treatment within 4–5 days prevents progression to Weil's disease." },
            { title: "Immediate Hospital Admission for Red Flags", detail: "Admit immediately any patient with unstable vital signs, jaundice/icterus, oliguria/anuria, dyspnea/hemoptysis (pulmonary hemorrhage), altered sensorium, or inability to tolerate oral intake." },
            { title: "Post-Exposure Doxycycline Prophylaxis", detail: "Administer post-exposure Doxycycline prophylaxis to individuals exposed to floodwaters during typhoons/monsoons." }
          ],
          conditional: [
            { title: "Confirmatory Testing & Early Renal Replacement Therapy", detail: "Using rapid IgM lateral flow assays or PCR for confirmation when available (noting serology is often negative during the first 5–7 days of illness); early initiation of Renal Replacement Therapy (Hemodialysis) for acute kidney injury complicated by refractory hyperkalemia, severe metabolic acidosis, uremia, or volume overload." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Triage Mild vs. Moderate-to-Severe", detail: "Mild (Outpatient): Stable vitals, anicteric (no jaundice), normal urine output, clear lungs, tolerating oral fluids/meds. Moderate-to-Severe (Inpatient): Presence of any Red Flag: jaundice, urine output < 0.5 mL/kg/hr (oliguria/anuria), tachypnea/crackles/hemoptysis, hypotension, meningismus, or persistent vomiting." },
            { step: "2. Baseline Lab Workup", detail: "Outpatient: CBC with platelet count, Urinalysis, Serum Creatinine (if accessible). Inpatient: CBC, Serum Creatinine, BUN, Sodium/Potassium, AST/ALT, Bilirubin, Chest X-ray (screen for alveolar hemorrhage), and 12-lead ECG." },
            { step: "3. Initiate Therapy & Monitor", detail: "Start empiric oral or IV antibiotics immediately. Watch briefly for a Jarisch-Herxheimer reaction (transient fever spike/rigors within hours of first antibiotic dose). Follow up mild outpatients in 48 hours to check urine output, sclerae, and respiratory status." }
          ]
        },
        practiceNotes: [
          { title: "Differentiate from Dengue", detail: "Both peak during the Philippine rainy season and cause fever, thrombocytopenia, and myalgia. Calf pain, conjunctival suffusion (red eyes without pus), neutrophilia, and elevated creatinine favor Leptospirosis; retro-orbital pain, petechial rash, and rising hematocrit favor Dengue. (Co-infection is possible—when in doubt after flood exposure, cover empirically with Doxycycline while monitoring Dengue warning signs)." },
          { title: "Free RHU Prophylaxis", detail: "Doxycycline 100 mg capsules are distributed free at Barangay Health Stations and RHUs during flood events." }
        ],
        soapPlanSummary: [
          "Diagnostics: Order CBC with Platelet Count, Routine Urinalysis, and Serum Creatinine (plus LFTs, Electrolytes, CXR, and 12-Lead ECG if moderate-to-severe).",
          "Empiric Therapy: Start Doxycycline 100 mg PO BID for 7 days immediately (or Amoxicillin/Azithromycin if pregnant/lactating; IV Penicillin G or IV Ceftriaxone if hospitalized).",
          "Monitoring & Red Flags: Reassess in 48 hours for urine output, jaundice, or respiratory symptoms; refer immediately to ER if oliguria (< 0.5 mL/kg/hr), icterus, dyspnea, or hemoptysis develops."
        ]
      },
      {
        id: "cpg-typhoid-fever",
        category: "Pulmonary & Infectious",
        title: "Typhoid Fever (Enteric Fever)",
        source: "PSMID Clinical Practice Guidelines on the Diagnosis and Management of Typhoid Fever",
        intendedUsers: "Primary Care Physicians, Pediatricians, Internists, Emergency & Hospital Clinicians",
        keywords: ["typhoid", "typhoid fever", "enteric fever", "salmonella", "widal", "typhidot", "blood culture", "azithromycin", "ceftriaxone", "psmid"],
        snapshot: [
          { parameter: "Suspected Case Criteria", value: "Sustained/step-ladder fever (≥ 38°C for ≥ 3 days) without an obvious localizing focus + headache, malaise, abdominal pain, constipation or diarrhea, relative bradycardia, or coated tongue" },
          { parameter: "Gold-Standard Diagnostic", value: "Blood Culture (highest yield in Week 1 of illness; collect prior to antibiotics)" },
          { parameter: "Uncomplicated (Outpatient)", value: "Azithromycin 1 g PO Day 1, then 500 mg OD for 6 days (or 500 mg OD for 7 days) | Alternative: Cefixime 200 mg PO BID for 7–14 days (Pediatrics: Azithromycin 20 mg/kg/day OD for 7 days)" },
          { parameter: "Severe / Complicated (Inpatient)", value: "IV Ceftriaxone 2 g IV q24h (or 1 g q12h) for 10–14 days (Pediatrics: 75–100 mg/kg/day)" }
        ],
        scope: {
          included: [
            "Children and adults presenting with suspected or culture-confirmed uncomplicated or severe enteric fever (Salmonella enterica serovar Typhi or Paratyphi)."
          ],
          excluded: [
            { label: "Acute Surgical Abdomen (Intestinal Perforation / Severe Lower GI Bleeding)", action: "Requires immediate surgical consult, NPO, IV resuscitation, and broad-spectrum anaerobic + Gram-negative coverage." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Blood Culture First & Avoid Sole Widal Diagnosis", detail: "Obtain Blood Cultures before starting antibiotics whenever laboratory facilities are available; do NOT use the Widal Test as the sole basis to diagnose typhoid fever or initiate treatment (high false-positive rates in endemic areas like the Philippines due to prior exposure/cross-reactivity)." },
            { title: "Avoid Empiric Fluoroquinolones & Targeted Dexamethasone Use", detail: "Avoid routine empiric Fluoroquinolones (Ciprofloxacin/Ofloxacin) as first-line therapy in South/Southeast Asia unless susceptibility is confirmed by culture, due to widespread nalidixic acid/fluoroquinolone resistance; add IV Dexamethasone (3 mg/kg initial dose, then 1 mg/kg q6h for 48 hours) ONLY in severe typhoid complicated by delirium, obtundation, stupor, coma, or shock." }
          ],
          conditional: [
            { title: "Adjunct Week 2+ Serology & Stool/Urine Cultures", detail: "Using Typhidot (IgM) or stool/urine cultures as adjuncts in Week 2+ when blood cultures are negative or unavailable, interpreted strictly alongside clinical findings." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Rule Out Other Endemic Febrile Illnesses", detail: "Order CBC (look for leukopenia/normal WBC with eosinopenia), Blood Culture (2 sets), Urinalysis, and Dengue/Malaria/Leptospirosis screening based on local epidemiology." },
            { step: "2. Triage Outpatient vs. Inpatient", detail: "Outpatient: Alert, hemodynamically stable, able to retain oral fluids and medications, no abdominal rigidity/guarding. Inpatient: Persistent vomiting, severe dehydration, abdominal tenderness/guarding, GI bleeding (melena/hematochezia), altered mental status, or fever persisting > 5 days on outpatient therapy." },
            { step: "3. Antibiotic Course & Fever Curve Expectation", detail: "Start Azithromycin (preferred oral agent due to high intracellular concentration and low relapse rate) or IV Ceftriaxone (if hospitalized). Counsel on Defervescence: Fever typically takes 4 to 6 days of appropriate antibiotic therapy to resolve completely—do not prematurely switch antibiotics on Day 2 or 3 unless the patient clinically deteriorates." }
          ]
        },
        practiceNotes: [
          { title: "Water, Sanitation & Food Handlers", detail: "Advise strict handwashing with soap and drinking boiled or purified water. If the patient is a food handler, they must abstain from food preparation until asymptomatic and cleared per local sanitation rules to prevent outbreaks." },
          { title: "Vaccination", detail: "Recommend Typhoid vaccine (Vi polysaccharide) for food handlers, household contacts of carriers, and travelers to endemic communities." }
        ],
        soapPlanSummary: [
          "Diagnostics: Collect Blood Culture (x2 sets prior to antibiotics), CBC with Platelet Count, Routine Urinalysis, and rule out Dengue/Leptospirosis.",
          "Targeted Therapy: Start Azithromycin 1 g PO Day 1 then 500 mg OD for 6 days (or Cefixime 200 mg BID for 7–14 days); counsel that fever takes 4–6 days to resolve.",
          "Sanitation & Red Flags: Drink boiled/purified water, strict handwashing, abstain from food handling until cleared; return immediately for severe abdominal pain, melena, or persistent vomiting."
        ]
      },
      {
        id: "cpg-uti-uncomplicated",
        category: "Pulmonary & Infectious",
        title: "Uncomplicated Urinary Tract Infection (Acute Cystitis & Pyelonephritis)",
        source: "PSMID Philippine Clinical Practice Guidelines on the Diagnosis and Management of Urinary Tract Infections",
        intendedUsers: "Primary Care Physicians, Internists, OB-GYNs, Emergency & RHU Clinicians",
        keywords: ["uti", "urinary tract infection", "cystitis", "pyelonephritis", "dysuria", "nitrofurantoin", "fosfomycin", "cefuroxime", "asymptomatic bacteriuria", "psmid"],
        snapshotHeaders: ["Condition", "Clinical Presentation", "First-Line Empiric Regimen"],
        snapshot: [
          {
            col1: "Acute Uncomplicated Cystitis (Non-Pregnant Women)",
            col2: "Dysuria, urinary frequency, urgency, suprapubic pain; NO fever, flank pain, or CVA tenderness",
            col3: "Nitrofurantoin (Macrocrystals/Monohydrate) 100 mg PO BID for 5 days (avoid if eGFR < 30) | Fosfomycin Trometamol 3 g PO single dose | Pivmecillinam 400 mg PO BID for 3–5 days (2nd-line: Cefuroxime 250–500 mg BID for 5–7 days)"
          },
          {
            col1: "Acute Uncomplicated Pyelonephritis",
            col2: "Fever (≥ 38°C), chills, flank pain, costovertebral angle (CVA) tenderness, nausea/vomiting",
            col3: "Outpatient (Mild): Ceftriaxone 1 g IV/IM single dose, followed by oral Cefixime 400 mg OD or Cefuroxime 500 mg BID (or Ciprofloxacin 500 mg BID if local resistance < 10%) for 7–10 days | Inpatient (Moderate-Severe): IV Ceftriaxone 1–2 g q24h or IV Ertapenem 1 g q24h"
          },
          {
            col1: "Asymptomatic Bacteriuria (ASB) in Pregnancy",
            col2: "Positive urine culture (≥ 10⁵ CFU/mL) without urinary symptoms during pregnancy",
            col3: "Nitrofurantoin 100 mg BID for 5–7 days (avoid at term ≥ 38 wks) | Fosfomycin 3 g single dose | Cefuroxime 250 mg BID or Amoxicillin-Clavulanate 625 mg BID for 5–7 days"
          }
        ],
        scope: {
          included: [
            "Healthy, non-pregnant premenopausal women with acute uncomplicated cystitis or pyelonephritis, and pregnant women screened for asymptomatic bacteriuria or acute cystitis."
          ],
          excluded: [
            { label: "Complicated UTI", action: "All UTIs in men, patients with indwelling urinary catheters, structural/functional urinary tract abnormalities (nephrolithiasis, BPH, neurogenic bladder), poorly controlled diabetes, renal transplant, or immunocompromised states—require mandatory Urine Culture and 7–14 days of targeted therapy." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Asymptomatic Bacteriuria (ASB) Stewardship", detail: "Do NOT screen for or treat Asymptomatic Bacteriuria (ASB) in non-pregnant women, elderly patients, diabetics, or catheterized patients—treating ASB drives antibiotic resistance without clinical benefit; DO screen and treat ASB in Pregnant Women (ideally at 12–16 weeks AOG) to prevent maternal pyelonephritis and preterm birth." },
            { title: "Avoid High-Resistance Oral Agents & Culture Upper/Pregnant UTIs", detail: "Avoid empiric Cotrimoxazole (TMP-SMX), Ampicillin/Amoxicillin alone, and Fluoroquinolones for uncomplicated cystitis in the Philippines due to high E. coli resistance rates (> 20%–40%) and FDA/DOH safety warnings on fluoroquinolones; obtain a Urine Culture & Sensitivity before antibiotics in all cases of Acute Pyelonephritis and all UTIs in Pregnancy." }
          ],
          conditional: [
            { title: "Symptom-Based Empiric Therapy in Sporadic Simple Cystitis", detail: "Starting empiric antibiotics based on classic symptoms alone (without urinalysis or urine culture) in healthy, non-pregnant women with a first or sporadic episode of uncomplicated cystitis." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen for Complicated / Upper Tract Red Flags", detail: "Check temperature, flank/CVA tenderness, pregnancy status, and history of recurrent UTIs (≥ 2 in 6 months or ≥ 3 in 1 year)." },
            { step: "2. Diagnostic Testing", detail: "Simple Cystitis (Non-Pregnant): Urinalysis optional (pyuria ≥ 10 WBC/hpf or positive leukocyte esterase/nitrite); urine culture not needed unless symptoms fail to resolve or recur within 2–4 weeks. Pyelonephritis / Pregnancy / Recurrent UTI: Collect midstream clean-catch Urine Culture prior to first antibiotic dose." },
            { step: "3. Treat & Follow-Up", detail: "Prescribe first-line targeted oral agent (Nitrofurantoin or Fosfomycin for cystitis). Offer Phenazopyridine (100–200 mg TID for max 2 days) if severe dysuria, warning the patient of harmless orange urine discoloration. For Pregnant Women, perform a Test-of-Cure urine culture 1–2 weeks after completing antibiotics." }
          ]
        },
        practiceNotes: [
          { title: "Over-Diagnosis of \"UTI\" on Urinalysis", detail: "Remind clinicians and patients that squamous epithelial cells with mild leukocytes (e.g., 5–8 WBC/hpf) without urinary symptoms usually reflects contaminated urine collection or vaginitis, not a true UTI—avoid unnecessary antibiotic prescriptions." },
          { title: "Cost & Availability", detail: "Nitrofurantoin 100 mg capsules and Cefuroxime 500 mg tablets are widely available and affordable in Philippine generics pharmacies and RHU formularies." }
        ],
        soapPlanSummary: [
          "Diagnostics: Routine Urinalysis (collect midstream clean-catch Urine Culture & Sensitivity prior to antibiotics if pyelonephritis, pregnant, or recurrent UTI).",
          "Empiric Therapy: Acute Uncomplicated Cystitis → Nitrofurantoin 100 mg PO BID for 5 days or Fosfomycin 3 g single dose (avoid empiric TMP-SMX, Ampicillin/Amoxicillin alone, and Fluoroquinolones).",
          "Counseling & Follow-Up: Increase oral hydration; return immediately if fever, chills, or flank pain develops; perform Test-of-Cure urine culture in 1–2 weeks if pregnant."
        ]
      },
      {
        id: "cpg-ckd-adults",
        category: "Renal & Nephrology",
        title: "Chronic Kidney Disease (CKD) in Adults",
        source: "PSN Clinical Practice Guidelines on Chronic Kidney Disease & KDIGO-Adapted Philippine Renal Care Protocols",
        intendedUsers: "Primary Care Physicians, Internists, Nephrologists, Family Medicine & RHU Clinicians",
        keywords: ["ckd", "chronic kidney disease", "egfr", "uacr", "creatinine", "proteinuria", "albuminuria", "psn", "kdigo", "sglt2", "finerenone", "nephrology"],
        snapshot: [
          { parameter: "Diagnostic Criteria", value: "Abnormalities of kidney structure or function present for ≥ 3 months: eGFR < 60 mL/min/1.73m² OR markers of kidney damage (UACR ≥ 30 mg/g, persistent hematuria/proteinuria, or structural ultrasound findings)" },
          { parameter: "Mandatory Screening Group", value: "Annually in patients with Diabetes Mellitus, Hypertension, cardiovascular disease, or family history of kidney failure" },
          { parameter: "Core Nephroprotective Pillars", value: "1. RAAS Blocker (ACEi or ARB, titrated to max tolerated dose if albuminuric) | 2. SGLT2 Inhibitor (Empagliflozin/Dapagliflozin if eGFR ≥ 20 mL/min/1.73m²) | 3. Non-steroidal MRA (Finerenone) in Type 2 DM + persistent albuminuria" },
          { parameter: "Blood Pressure Target", value: "< 130/80 mm Hg (or < 120 mm Hg systolic if tolerated using standardized measurement)" },
          { parameter: "Nephrology Referral Cutoff", value: "eGFR < 30 mL/min/1.73m² (Stage G4–G5), severe albuminuria (UACR ≥ 300 mg/g), rapid eGFR decline (> 5 mL/min/year), or refractory hyperkalemia/anemia" }
        ],
        scope: {
          included: [
            "Non-dialysis adult Filipinos (≥ 19 years) with CKD Stages G1–G5 (eGFR ≥ 90 down to < 15 mL/min/1.73m²) and albuminuria categories A1–A3."
          ],
          excluded: [
            { label: "Acute Kidney Injury (AKI)", action: "Rapid rise in serum creatinine over hours to days; requires immediate identification/reversal of pre-renal, intrinsic, or post-renal causes." },
            { label: "Nephrotic Syndrome Flares & Maintenance Dialysis (ESRD)", action: "Nephrotic flares requiring kidney biopsy and ESRD patients already on Hemodialysis or Peritoneal Dialysis follow specialized nephrology/dialysis protocols." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Screen High-Risk Adults with eGFR + UACR", detail: "Screen high-risk adults using both Serum Creatinine (for eGFR via CKD-EPI) and Urine Albumin-to-Creatinine Ratio (UACR)—serum creatinine alone misses early Stage G1–G2 diabetic/hypertensive kidney disease." },
            { title: "RAAS Blocker & SGLT2 Inhibitor Protection", detail: "Initiate an ACE inhibitor or ARB in all CKD patients with moderately-to-severely increased albuminuria (UACR ≥ 30 mg/g), whether diabetic or non-diabetic; start an SGLT2 inhibitor in adults with CKD (eGFR ≥ 20 mL/min/1.73m²) with Type 2 DM or UACR ≥ 200 mg/g to slow eGFR decline and reduce heart failure hospitalization." },
            { title: "Cardiovascular Statin & Nephrotoxin Avoidance", detail: "Prescribe a Statin (or Statin/Ezetimibe combination) for all adults aged ≥ 50 years with non-dialysis CKD (Stages G3–G5) to prevent atherosclerotic cardiovascular events—the leading cause of death in CKD; strictly avoid NSAIDs (Mefenamic acid, Ibuprofen, Celecoxib, Naproxen) and nephrotoxic herbal supplements." }
          ],
          conditional: [
            { title: "Finerenone & Dietary Protein Moderation", detail: "Initiating Finerenone (non-steroidal MRA) in patients with Type 2 DM, eGFR ≥ 25 mL/min/1.73m², normal serum potassium (≤ 4.8 mmol/L), and persistent albuminuria despite maximum RAASi + SGLT2i therapy; dietary protein moderation (0.8 g/kg/day in non-dialysis CKD G3–G5) balanced against malnutrition risk." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Chronicity & Stage (CGA Classification)", detail: "Verify abnormal eGFR or UACR persists for ≥ 3 months; order Renal Ultrasound to assess kidney size, echogenicity, and rule out obstruction." },
            { step: "2. Screen for CKD Complications (Starting at Stage G3, eGFR < 60)", detail: "Anemia: CBC, Serum Ferritin, Transferrin Saturation (TSAT); treat iron deficiency first before ESAs. Mineral & Bone Disorder (CKD-MBD): Serum Calcium, Phosphorus, iPTH, and Vitamin D. Electrolytes & Acidosis: Serum Potassium and Bicarbonate (treat metabolic acidosis if serum HCO₃⁻ < 22 mmol/L with oral Sodium Bicarbonate)." },
            { step: "3. Renoprotective Titration & Safety Check", detail: "Start ACEi/ARB and SGLT2i. Recheck Serum Creatinine and Potassium 2–4 weeks after starting or increasing RAAS blockers (a ≤ 30% rise in creatinine without hyperkalemia > 5.5 mmol/L is expected and safe—do not discontinue unnecessarily). Adjust renally cleared medications (reduce Metformin max dose to 1,000 mg/day if eGFR 30–44; stop Metformin if eGFR < 30; reduce Gabapentin/Pregabalin, Allopurinol, and antibiotic doses)." },
            { step: "4. Timely Kidney Replacement Planning", detail: "Refer to a nephrologist at eGFR < 30 mL/min/1.73m² to educate early on Peritoneal Dialysis (PD First), preemptive arteriovenous (AV) fistula creation, or kidney transplantation—avoiding emergent crash dialysis via temporary central catheters." }
          ]
        },
        practiceNotes: [
          { title: "Preventing Toxic Exposures", detail: "Explicitly counsel Filipino patients against over-the-counter pain relievers (especially mefenamic acid for body aches/gout) and unregulated herbal teas/capsules marketed as \"kidney cleansers.\" Limit sodium to < 2,000 mg/day (toyo, patis, bagoong, instant noodles)." },
          { title: "PhilHealth Dialysis & Transplant Support", detail: "For patients progressing to Stage G5 ESRD, PhilHealth covers up to 156 hemodialysis sessions per year (via the expanded PhilHealth Hemodialysis Package), alongside dedicated Z-Benefit packages for Peritoneal Dialysis and Kidney Transplantation." }
        ],
        soapPlanSummary: [
          "Diagnostics & Staging: Verify chronicity (≥ 3 months) with Serum Creatinine (eGFR), UACR, Routine Urinalysis, and KUB/Renal Ultrasound (plus CBC, Ferritin/TSAT, Ca/Phos, Na/K/HCO₃⁻ if Stage G3+).",
          "Nephroprotection: Titrate ACEi/ARB to maximally tolerated dose + SGLT2 inhibitor (if eGFR ≥ 20 mL/min/1.73m²) + Statin (if age ≥ 50 yrs); recheck Serum Creatinine and Potassium in 2–4 weeks.",
          "Renal Safety & Referral: Strictly avoid NSAIDs (mefenamic acid/ibuprofen) and herbal supplements; limit sodium < 2,000 mg/day; refer to Nephrology if eGFR < 30 mL/min/1.73m² or UACR ≥ 300 mg/g."
        ]
      },
      {
        id: "cpg-heart-failure-adults",
        category: "Cardiovascular",
        title: "Heart Failure in Adults (HFrEF & HFpEF)",
        source: "PHA Clinical Practice Guidelines for the Diagnosis and Management of Heart Failure",
        intendedUsers: "Primary Care Physicians, Internists, Cardiologists, Emergency & Hospital Clinicians",
        keywords: ["heart failure", "hfref", "hfpef", "hfmref", "chf", "2d echo", "nt-probnp", "bnp", "gdmt", "sacubitril", "valsartan", "furosemide", "carvedilol", "bisoprolol", "pha", "rhd"],
        snapshot: [
          { parameter: "Core Classification", value: "HFrEF (Reduced EF): LVEF ≤ 40% | HFmrEF (Mildly Reduced EF): LVEF 41%–49% | HFpEF (Preserved EF): LVEF ≥ 50% + objective structural/diastolic dysfunction or elevated natriuretic peptides" },
          { parameter: "Key Diagnostic Tests", value: "Transthoracic Echocardiogram (2D Echo with Doppler) + NT-proBNP (≥ 125 pg/mL outpatient; ≥ 300 pg/mL acute) or BNP (≥ 35 pg/mL outpatient; ≥ 100 pg/mL acute) + 12-Lead ECG + Chest X-ray" },
          { parameter: "HFrEF 4-Pillar GDMT", value: "1. ARNI (Sacubitril/Valsartan) preferred—or ACEi / ARB | 2. Evidence-Based Beta-Blocker (Bisoprolol, Carvedilol, or Metoprolol Succinate) | 3. MRA (Spironolactone or Eplerenone) | 4. SGLT2 Inhibitor (Dapagliflozin or Empagliflozin)" },
          { parameter: "HFpEF Primary Therapy", value: "SGLT2 Inhibitor (Empagliflozin or Dapagliflozin) + Loop Diuretics for congestion + aggressive BP/AF/DM control" },
          { parameter: "Decongestion Agent", value: "Loop Diuretics (Furosemide or Torsemide) titrated to achieve euvolemia (symptom relief only; does not replace 4-pillar GDMT)" }
        ],
        scope: {
          included: [
            "Adult Filipinos (≥ 19 years) presenting with chronic symptomatic heart failure (NYHA Functional Class I–IV) or acute decompensated heart failure (ADHF)."
          ],
          excluded: [
            { label: "Cardiogenic Shock & Acute STEMI", action: "Requires immediate ICU inotropes/mechanical circulatory support or primary PCI/thrombolysis." },
            { label: "Severe Primary Valvular Heart Disease (e.g., Severe Rheumatic Mitral Stenosis)", action: "Highly prevalent in the Philippines; requires timely percutaneous balloon mitral commissurotomy or valve surgery." }
          ]
        },
        recommendations: {
          strong: [
            { title: "2D Echo & Rapid 4-Pillar GDMT Initiation in HFrEF", detail: "Perform 2D Echocardiography in all patients with suspected heart failure to measure LVEF and identify underlying etiology (ischemic, hypertensive, valvular, or cardiomyopathy); initiate all 4 foundational GDMT pillars simultaneously or in rapid sequence (within 2–4 weeks) at low starting doses in HFrEF, titrating every 2 weeks to target/maximally tolerated doses." },
            { title: "SGLT2 Inhibitors Across All Ejection Fractions & Drugs to Avoid", detail: "Prescribe an SGLT2 inhibitor (Dapagliflozin or Empagliflozin) across the entire ejection fraction spectrum (HFrEF, HFmrEF, and HFpEF); strictly avoid non-dihydropyridine CCBs (Diltiazem, Verapamil), NSAIDs, and Thiazolidinediones (Pioglitazone) in HFrEF due to negative inotropy and fluid retention." }
          ],
          conditional: [
            { title: "Ivabradine & Device Therapy (ICD / CRT)", detail: "Adding Ivabradine for symptomatic HFrEF patients in sinus rhythm with resting heart rate ≥ 70 bpm despite maximally tolerated beta-blocker therapy; Implantable Cardioverter-Defibrillator (ICD) or Cardiac Resynchronization Therapy (CRT) for persistent LVEF ≤ 35% after ≥ 3 months of optimal GDMT (balanced against device cost and patient goals)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Diagnosis & Identify Etiology", detail: "Evaluate signs/symptoms (orthopnea, paroxysmal nocturnal dyspnea, bipedal edema, elevated JVP, S3 gallop, bibasilar crackles). Order 12-Lead ECG, Chest X-ray, 2D Echo, NT-proBNP/BNP, CBC, Serum Creatinine/eGFR, Sodium/Potassium, Fasting Blood Sugar/HbA1c, Lipid Profile, and Thyroid Function (TSH)." },
            { step: "2. Relieve Congestion (If Volume Overloaded)", detail: "Start Oral Furosemide (20–40 mg OD/BID) for outpatient edema, or IV Furosemide (20–40 mg IV bolus, or 1–2.5× home daily oral dose) if hospitalized for acute pulmonary congestion." },
            { step: "3. Initiate & Uptitrate 4-Pillar GDMT (HFrEF)", detail: "Pillar 1: Sacubitril/Valsartan (24/26 mg or 49/51 mg BID—requires a 36-hour washout if switching from an ACEi to prevent angioedema) OR Enalapril / Losartan if budget-constrained. Pillar 2: Carvedilol (3.125 mg BID), Bisoprolol (1.25 mg OD), or Metoprolol Succinate (12.5–25 mg OD) once euvolemic/hemodynamically stable. Pillar 3: Spironolactone (12.5–25 mg OD) if eGFR > 30 and serum K⁺ < 5.0 mmol/L. Pillar 4: Dapagliflozin (10 mg OD) or Empagliflozin (10 mg OD)." },
            { step: "4. Monitor Labs & Self-Care Red Flags", detail: "Check Serum Potassium and Creatinine 1–2 weeks after starting/adjusting ARNI/ACEi/ARB or Spironolactone. Instruct daily morning weight monitoring—call/return if weight increases by ≥ 2 kg in 2–3 days." }
          ]
        },
        practiceNotes: [
          { title: "Budget-Conscious GDMT Substitution", detail: "Sacubitril/Valsartan can be cost-prohibitive for uninsured Filipino patients. When cost is a barrier, prioritize affordable generic Enalapril or Losartan + Carvedilol or Bisoprolol + Spironolactone (widely available in generic pharmacies and PhilHealth Konsulta formularies) rather than leaving the patient on Furosemide alone." },
          { title: "Screen for Rheumatic Heart Disease (RHD)", detail: "Always auscultate carefully for diastolic/systolic murmurs—post-streptococcal RHD remains a major cause of heart failure in young-to-middle-aged Filipinos and requires secondary Benzathine Penicillin G prophylaxis and echocardiographic valve evaluation." }
        ],
        soapPlanSummary: [
          "Diagnostics: Order 2D Echocardiogram with Doppler, 12-Lead ECG, Chest X-Ray, NT-proBNP/BNP, CBC, Creatinine/eGFR, Na/K, FBS/HbA1c, Lipid Profile, and TSH.",
          "GDMT & Decongestion: Initiate Loop Diuretic (Furosemide 20–40 mg) if congested + 4-pillar GDMT (ARNI or Enalapril/Losartan + Carvedilol/Bisoprolol + Spironolactone + Dapagliflozin/Empagliflozin); avoid Verapamil, Diltiazem, and NSAIDs.",
          "Monitoring & Counseling: Recheck Serum Potassium and Creatinine in 1–2 weeks; daily morning weight log (return if weight increases ≥ 2 kg in 2–3 days) and low-sodium fluid-managed diet."
        ]
      },
      {
        id: "cpg-mdd-adults",
        category: "Mental Health & Psychiatry",
        title: "Major Depressive Disorder (MDD) in Adults",
        source: "PPA Consensus Guidelines on the Management of Major Depressive Disorder & DOH mhGAP Intervention Guide",
        intendedUsers: "Primary Care Physicians, Family Medicine Clinicians, Psychiatrists & RHU Mental Health Providers",
        keywords: ["mdd", "major depressive disorder", "depression", "phq-2", "phq-9", "ssri", "sertraline", "escitalopram", "fluoxetine", "cbt", "mhgap", "ppa", "ncmh", "suicide"],
        snapshot: [
          { parameter: "Screening Tool", value: "PHQ-2 (initial 2-item screen) → PHQ-9 (if PHQ-2 ≥ 3): 5–9: Mild | 10–14: Moderate | 15–19: Moderately Severe | ≥ 20: Severe" },
          { parameter: "Diagnostic Threshold", value: "≥ 5 of 9 symptoms present nearly every day for ≥ 2 weeks (must include depressed mood OR anhedonia) causing functional impairment" },
          { parameter: "First-Line Treatment", value: "Mild MDD: Structured Psychotherapy (CBT / IPT) + psychoeducation & lifestyle activation | Moderate-to-Severe MDD: SSRI (Sertraline, Escitalopram, or Fluoxetine) + Psychotherapy" },
          { parameter: "Therapeutic Trial Window", value: "4 to 6 weeks at an adequate dose to assess response; continue maintenance for 6–12 months after full remission (first episode)" },
          { parameter: "Immediate Crisis / Referral", value: "Active suicidal intent/plan, psychotic features, catatonia, or suspected Bipolar Depression (prior mania/hypomania)" }
        ],
        scope: {
          included: [
            "Filipino adults (≥ 19 years) presenting with unipolar Major Depressive Disorder in primary care or outpatient settings."
          ],
          excluded: [
            { label: "Bipolar Disorder (Bipolar Depression)", action: "Always screen for past episodes of decreased need for sleep, grandiosity, racing thoughts, or impulsivity—never prescribe antidepressant monotherapy in Bipolar Disorder (triggers manic switch)." },
            { label: "Substance/Medication-Induced or Medical-Condition Depression", action: "Rule out hypothyroidism (TSH), severe anemia, Vitamin B12 deficiency, stroke, or alcohol/shabu/sedative withdrawal." },
            { label: "Perinatal / Postpartum Depression", action: "Requires specialized maternal-fetal risk-benefit counseling (Sertraline is generally preferred if pharmacotherapy is needed)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Universal Suicide Risk Screening", detail: "Screen EVERY patient for suicide risk at initial visit and at every follow-up, especially during the first 1–2 weeks after starting an antidepressant (when energy improves before mood)." },
            { title: "First-Line SSRIs & TCA Avoidance in High-Risk Patients", detail: "Initiate a Selective Serotonin Reuptake Inhibitor (SSRI)—specifically Sertraline (50–200 mg/day), Escitalopram (10–20 mg/day), or Fluoxetine (20–60 mg/day)—as first-line pharmacotherapy for moderate-to-severe MDD due to favorable safety and overdose profile; avoid Tricyclic Antidepressants (TCAs) (e.g., Amitriptyline) as first-line therapy in patients with suicide risk or cardiac conduction disease due to lethal overdose toxicity." },
            { title: "Gradual Tapering (Never Stop Abruptly)", detail: "Never stop SSRIs abruptly—taper gradually over 2–4 weeks to prevent discontinuation syndrome (dizziness, paresthesias/\"brain zaps\", irritability, insomnia)." }
          ],
          conditional: [
            { title: "Second-Line Switch to SNRI or Mirtazapine", detail: "Switching to an SNRI (Venlafaxine or Duloxetine—helpful if comorbid neuropathic pain) or Mirtazapine (helpful if severe insomnia or poor appetite/weight loss) when first-line SSRI fails after 6–8 weeks at optimal dose." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen & Assess Safety", detail: "Administer PHQ-9 and check baseline TSH, CBC, FBS, and Serum Creatinine/ALT. Ask Directly About Suicide: \"Have you had thoughts that you would be better off dead or of hurting yourself?\" If yes, assess intent, plan, and access to lethal means (medications, sharp objects, firearms). If High Suicide Risk: Do not leave the patient alone; involve trusted family/support person, remove lethal means, and arrange immediate psychiatric emergency admission." },
            { step: "2. Initiate First-Line Therapy (Outpatient)", detail: "Mild MDD (PHQ-9 5–9): Refer for Cognitive Behavioral Therapy (CBT) or Interpersonal Therapy (IPT), prescribe regular aerobic exercise (30 min, 3–5×/week), sleep hygiene, and schedule follow-up in 2 weeks. Moderate-to-Severe MDD (PHQ-9 ≥ 10): Start Sertraline 25–50 mg OD (or Escitalopram 5–10 mg OD) in the morning with food." },
            { step: "3. Follow-Up & Titration Schedule", detail: "Week 1–2: Reassess suicide risk, GI side effects (nausea, transient anxiety), and adherence. Week 4–6: Repeat PHQ-9. If < 25% symptom reduction, titrate SSRI dose upward; if partial response at Week 8, optimize dose or switch/augment and refer to a psychiatrist. Maintenance: Once asymptomatic (PHQ-9 < 5), continue the same effective dose for at least 6–12 months (or ≥ 2 years if ≥ 2 prior episodes) before gradual tapering." }
          ]
        },
        practiceNotes: [
          { title: "Culturally Sensitive Communication", detail: "Mental health stigma remains strong in the Philippines—frame MDD to patients and families as a treatable medical condition involving brain chemistry, not a personal weakness or lack of faith. Involve supportive family members in medication supervision when consented." },
          { title: "Free DOH Medicines & Crisis Lines", detail: "Under the Philippine Mental Health Act (RA 11036) and the DOH Medicine Access Program for Mental Health (MAP-MH), essential psychotropics (Fluoxetine, Sertraline, Escitalopram) are provided free at accredited RHUs and DOH hospitals. Provide the NCMH 24/7 Crisis Hotline (1553 Luzon-wide landline, or 0917-899-8727 / 0966-351-4518) on every discharge/clinic note." }
        ],
        soapPlanSummary: [
          "Screening & Baseline Workup: Administer PHQ-9 and direct suicide safety screen; order baseline TSH, CBC, FBS, Serum Creatinine, and ALT to exclude medical mimics.",
          "First-Line Therapy: Mild MDD → CBT/IPT + 30 min aerobic exercise 3–5×/week; Moderate-to-Severe MDD → Start Sertraline 25–50 mg OD (or Escitalopram 5–10 mg OD) in the morning with food + psychotherapy (screen out Bipolar Disorder first).",
          "Follow-Up & Crisis Support: Reassess suicide risk and tolerability in 1–2 weeks; repeat PHQ-9 at 4–6 weeks; provide NCMH 24/7 Crisis Hotline (1553 / 0917-899-8727 / 0966-351-4518) and DOH MAP-MH RHU access info."
        ]
      },
      {
        id: "cpg-epilepsy-all-ages",
        category: "Neurology & Emergency",
        title: "Epilepsy in Adults and Children",
        source: "PNA Clinical Practice Guidelines on the Diagnosis and Management of Epilepsy & ILAE Classification",
        intendedUsers: "Primary Care Physicians, Pediatricians, Internists, Neurologists & Emergency Clinicians",
        keywords: ["epilepsy", "seizure", "status epilepticus", "levetiracetam", "carbamazepine", "valproic acid", "sodium valproate", "lamotrigine", "diazepam", "midazolam", "phenytoin", "pna", "ilae", "hla-b*1502", "sjs"],
        snapshot: [
          { parameter: "Operational Definition", value: "≥ 2 unprovoked seizures occurring > 24 hours apart, OR 1 unprovoked seizure with high recurrence risk (≥ 60%, e.g., prior stroke, brain tumor, epileptiform EEG, or structural MRI lesion)" },
          { parameter: "First-Line Monotherapy (Focal Seizures)", value: "Levetiracetam, Carbamazepine, Oxcarbazepine, or Lamotrigine" },
          { parameter: "First-Line Monotherapy (Generalized Seizures)", value: "Valproic Acid (Sodium Valproate) (men & non-childbearing women), Levetiracetam, or Lamotrigine (preferred in women of childbearing age)" },
          { parameter: "Status Epilepticus Cutoff", value: "Continuous seizure activity ≥ 5 minutes OR ≥ 2 seizures without full recovery of consciousness between them" },
          { parameter: "First-Line Rescue (Status Epilepticus)", value: "IV Diazepam (0.15–0.2 mg/kg, max 10 mg) or IV Lorazepam (0.1 mg/kg, max 4 mg); if no IV access, IM Midazolam (10 mg if > 40 kg; 5 mg if 13–40 kg) or Rectal Diazepam" }
        ],
        scope: {
          included: [
            "Children and adults presenting with newly diagnosed or chronic unprovoked epilepsy, or acute status epilepticus in emergency/outpatient settings."
          ],
          excluded: [
            { label: "Acute Symptomatic (Provoked) Seizures", action: "Seizures caused directly by hypoglycemia, hyponatremia, hypocalcemia, uremia, CNS infection (meningitis/encephalitis), alcohol/drug withdrawal, or eclampsia—treat the underlying metabolic/infectious cause; long-term Anti-Seizure Medications (ASMs) are NOT indicated." },
            { label: "Simple Febrile Seizures (Ages 6 mos–5 yrs)", action: "Generalized seizure < 15 minutes occurring once in 24 hours during fever without CNS infection—reassure parents and treat fever; daily maintenance ASMs are not recommended." },
            { label: "Psychogenic Non-Epileptic Seizures (PNES) / Syncope", action: "Convulsive syncope or functional seizures—avoid unnecessary ASM escalation." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Mandatory 12-Lead ECG, Brain Imaging & EEG", detail: "Order a 12-Lead ECG in every patient with a first seizure/blackout to exclude cardiac arrhythmia/long QT syncope mimics; perform Brain MRI (epilepsy protocol preferred) or Cranial CT (if emergency/MRI unavailable) and Electroencephalogram (EEG) after a first unprovoked seizure." },
            { title: "Low-Dose Monotherapy & Valproate Teratogenicity Warning", detail: "Start with single-drug therapy (Monotherapy) at a low dose and titrate slowly until seizures stop or side effects occur; strictly avoid Valproic Acid in women and girls of childbearing potential unless all other ASMs fail, due to high teratogenicity (neural tube defects, neurodevelopmental delay)—if unavoidable, co-prescribe Folic Acid 4–5 mg/day and effective contraception." },
            { title: "Rapid Benzodiazepine Rescue in Status Epilepticus", detail: "Administer benzodiazepines within 5–10 minutes of onset for Status Epilepticus—delayed treatment leads to refractory seizures and neuronal injury." }
          ],
          conditional: [
            { title: "Gradual ASM Withdrawal After ≥ 2 Years Seizure-Free", detail: "Considering gradual ASM withdrawal over 3–6 months (under neurologist guidance) after a patient has been completely seizure-free for ≥ 2 years, weighed against driving/employment risks and EEG/MRI findings." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Seizure Type & Rule Out Provoked Causes", detail: "Obtain detailed eyewitness history (aura, focal onset vs. generalized tonic-clonic, tongue biting, post-ictal confusion). Check immediate Capillary Blood Glucose (CBG), Serum Electrolytes (Na⁺, Ca²⁺, Mg²⁺), CBC, Creatinine, Liver Enzymes (AST/ALT), 12-Lead ECG, EEG, and Brain Imaging." },
            { step: "2. Initiate Monotherapy (Outpatient)", detail: "Focal Onset: Start Levetiracetam (250–500 mg BID, titrate to 1,000–3,000 mg/day) OR Carbamazepine (100–200 mg BID, titrate slowly to 400–1,200 mg/day). Generalized Onset: Start Levetiracetam or Lamotrigine (titrate very slowly over 6–8 weeks to prevent Stevens-Johnson Syndrome) OR Sodium Valproate (250–500 mg BID in males/non-childbearing females)." },
            { step: "3. Manage Status Epilepticus (≥ 5 Minutes)", detail: "0–5 Min (Stabilize): Protect airway, position on side, give O₂, check CBG (if < 70 mg/dL, give Thiamine 100 mg IV + D50W 50 mL IV). 5–20 Min (First-Line): IV Diazepam 5–10 mg slow push (may repeat once in 5–10 min) OR IM Midazolam 10 mg. 20–40 Min (Second-Line Loading): Infuse IV Levetiracetam (40–60 mg/kg, max 4,500 mg over 10–15 min) OR IV Valproate (20–40 mg/kg, max 3,000 mg) OR IV Phenytoin (20 mg/kg at max 50 mg/min with cardiac monitoring). > 40 Min (Refractory): Intubate and transfer to ICU for continuous anesthetic infusion (Midazolam/Propofol)." }
          ]
        },
        practiceNotes: [
          { title: "HLA-B*1502 Severe Skin Reaction Warning", detail: "Filipinos (Southeast Asian ancestry) carry a higher risk of Stevens-Johnson Syndrome / Toxic Epidermal Necrolysis (SJS/TEN) with Carbamazepine and Phenytoin. Warn every patient and family to stop the medication immediately and go to the ER if any rash, fever, or mouth/eye sores develop during the first 8 weeks." },
          { title: "Safety, Lifestyle & Government Formulary Access", detail: "Instruct strict seizure precautions: no driving (until seizure-free per LTO medical clearance), no swimming alone, take showers instead of baths, avoid heights/open cooking fires, and avoid sleep deprivation or alcohol binges. Phenobarbital, Phenytoin, Carbamazepine, and Valproic Acid are included in the Philippine National Formulary and DOH MAP-MH / RHU essential drug lists for indigent patients." }
        ],
        soapPlanSummary: [
          "Diagnostics: Check CBG, Serum Electrolytes (Na, Ca, Mg), CBC, Creatinine, AST/ALT, 12-Lead ECG, EEG, and Brain MRI (or Cranial CT) to exclude provoked causes and arrhythmia mimics.",
          "First-Line ASM Monotherapy: Start low-dose monotherapy tailored to seizure type and childbearing potential (e.g., Levetiracetam 250–500 mg BID; avoid Valproate in women of childbearing age unless unavoidable with Folic Acid 4–5 mg/day).",
          "Safety & SJS/TEN Counseling: Warn to stop Carbamazepine/Phenytoin immediately and visit ER if any rash, fever, or mucosal sores occur in first 8 weeks; advise strict seizure safety precautions (no driving/swimming alone, showers over baths, avoid sleep deprivation/alcohol)."
        ]
      },
      {
        id: "cpg-sth-parasitism",
        category: "Pulmonary & Infectious",
        title: "Soil-Transmitted Helminthiasis (Intestinal Parasitism)",
        source: "DOH Integrated Helminth Control Program (IHCP) Guidelines & PSMID / PPS Pediatric Infectious Disease Protocols",
        intendedUsers: "Primary Care Physicians, Pediatricians, Rural Health Unit (RHU) & School Health Clinicians",
        keywords: ["helminth", "parasitism", "deworming", "ascaris", "trichuris", "hookworm", "pinworm", "enterobius", "albendazole", "mebendazole", "ivermectin", "kato-katz", "bulate", "ihcp"],
        snapshot: [
          { parameter: "Primary Endemic Pathogens", value: "Ascaris lumbricoides (roundworm), Trichuris trichiura (whipworm), Ancylostoma duodenale / Necator americanus (hookworms), and Enterobius vermicularis (pinworm)" },
          { parameter: "Diagnostic Test", value: "Direct Fecal Smear (DFS) and Kato-Katz Technique (quantifies egg intensity); Scotch Tape Swab (perianal morning swab for Enterobius)" },
          { parameter: "First-Line Deworming (Adults & Children ≥ 2 yrs)", value: "Albendazole 400 mg PO single dose | Mebendazole 500 mg PO single dose (or 100 mg BID for 3 days)" },
          { parameter: "Children Aged 12–23 Months", value: "Albendazole 200 mg PO single dose (or Mebendazole 500 mg single dose)" },
          { parameter: "Mass Drug Administration (MDA)", value: "Biannual (every 6 months) preventive deworming for preschool children (1–4 yrs), school-aged children (5–18 yrs), and women of reproductive age in endemic areas" }
        ],
        scope: {
          included: [
            "Children (≥ 12 months), adolescents, non-pregnant adults, and pregnant women (2nd/3rd trimester) in endemic Philippine communities presenting with abdominal discomfort, chronic iron-deficiency anemia, poor weight gain, or perianal pruritus."
          ],
          excluded: [
            { label: "Infants < 12 Months & First Trimester of Pregnancy", action: "Deworming is contraindicated in infants < 12 months and teratogenic in the 1st trimester (defer until 2nd or 3rd trimester)." },
            { label: "Surgical Complications of Ascariasis", action: "Acute intestinal obstruction (worm bolus), biliary ascariasis, or acute appendicitis require immediate hospital admission, NPO, IV hydration, and surgical evaluation before administering antihelminthics." },
            { label: "Protozoal Infections (Entamoeba histolytica, Giardia lamblia)", action: "Require Metronidazole or Tinidazole, not Albendazole/Mebendazole." }
          ]
        },
        recommendations: {
          strong: [
            { title: "First-Line Single-Dose Antihelminthic & Biannual MDA", detail: "Administer single-dose Albendazole 400 mg or Mebendazole 500 mg for confirmed intestinal helminthiasis and routine biannual MDA in endemic regions." },
            { title: "Iron-Deficiency Anemia & Household Pinworm Eradication", detail: "Screen and treat Iron-Deficiency Anemia (with Ferrous Sulfate) alongside deworming in patients with heavy Hookworm or Trichuris infection; for Enterobiasis (Pinworm), treat the entire household simultaneously with a single dose of Albendazole (400 mg) or Mebendazole (100 mg), and repeat the exact dose after 2 weeks to eradicate newly hatched larvae." }
          ],
          conditional: [
            { title: "3-Day Course for Heavy Trichuris trichiura", detail: "Using a 3-day course of Albendazole (400 mg OD × 3 days) or Mebendazole (100 mg BID × 3 days) for heavy Trichuris trichiura (whipworm) infections, which respond poorly to single-dose therapy." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen & Rule Out Red Flags", detail: "Check for pallor (anemia), stunted growth, perianal itching, and rule out acute abdominal distension, bilious vomiting, or obstipation (worm bolus obstruction)." },
            { step: "2. Diagnostic Workup", detail: "Order Direct Fecal Smear (DFS) (3 stool samples on separate days increases sensitivity) and CBC (look for eosinophilia and microcytic, hypochromic anemia)." },
            { step: "3. Administer Targeted Antihelminthic", detail: "Ascaris / Hookworm: Single-dose Albendazole 400 mg (chewed/crushed with a fatty meal to enhance absorption) or Mebendazole 500 mg. Strongyloidiasis (Strongyloides stercoralis): Ivermectin 200 mcg/kg PO OD for 1–2 days (mandatory screening before starting chronic corticosteroids/immunosuppressants to prevent fatal hyperinfection syndrome)." },
            { step: "4. Nutritional & Hygiene Counseling", detail: "Pair with iron supplementation if anemic; instruct regular handwashing with soap, trimming fingernails, wearing footwear outdoors (prevents hookworm skin penetration), and washing raw vegetables." }
          ]
        },
        practiceNotes: [
          { title: "Free DOH Deworming", detail: "Albendazole 400 mg chewable tablets are distributed free year-round at Barangay Health Stations, RHUs, and public schools during the DOH Oplan Goodbye Bulate campaigns." }
        ],
        soapPlanSummary: [
          "Diagnostics: Order Direct Fecal Smear (DFS) / Kato-Katz (or Scotch Tape Swab if pinworm suspected) and CBC to screen for eosinophilia and microcytic anemia.",
          "Targeted Deworming: Administer Albendazole 400 mg PO single dose (200 mg if 12–23 mos; 3-day course if heavy Trichuris; repeat in 2 weeks for entire household if Enterobius) + Ferrous Sulfate if anemic.",
          "Hygiene & Prevention: Advise handwashing with soap, trimmed fingernails, wearing footwear outdoors, washing raw produce, and biannual DOH Oplan Goodbye Bulate deworming."
        ]
      },
      {
        id: "cpg-schistosomiasis",
        category: "Pulmonary & Infectious",
        title: "Schistosomiasis (Schistosoma japonicum)",
        source: "DOH Schistosomiasis Control and Elimination Program (SCEP) & PSMID Guidelines",
        intendedUsers: "Primary Care Physicians, Internists, Rural Health Unit (RHU) & Endemic Province Clinicians",
        keywords: ["schistosomiasis", "schistosoma japonicum", "praziquantel", "oncomelania", "snail", "kato-katz", "pipestem fibrosis", "variceal", "scep", "psmid"],
        snapshot: [
          { parameter: "Endemic Philippine Regions", value: "28 endemic provinces across 12 regions—highest in Eastern Visayas (Leyte, Samar), Caraga (Agusan, Surigao), Northern Mindanao (Bukidnon, Lanao), Zamboanga Peninsula, Davao Region, SOCCSKSARGEN, Bicol (Sorsogon), and MIMAROPA (Oriental Mindoro)" },
          { parameter: "Freshwater Vector", value: "Oncomelania hupensis quadrasi (amphibious freshwater snail in rice paddies, streams, irrigation canals)" },
          { parameter: "Gold-Standard Diagnostic", value: "Kato-Katz Stool Examination (detects S. japonicum ova) + Abdominal Ultrasound (periportal/Symmers' pipestem fibrosis, hepatosplenomegaly)" },
          { parameter: "Drug of Choice (All Ages ≥ 4 yrs)", value: "Praziquantel 60 mg/kg/day PO divided into 2–3 doses (4–6 hours apart) for 1 day" },
          { parameter: "Emergency Complications", value: "Variceal Upper GI Bleeding (from portal hypertension) or Neuroschistosomiasis (focal seizures, transverse myelitis)" }
        ],
        scope: {
          included: [
            "Children (≥ 4 years), adults, and pregnant/lactating women living in or traveling to endemic Philippine provinces with freshwater exposure."
          ],
          excluded: [
            { label: "Children < 4 Years", action: "Consult pediatric infectious disease specialist for weight-adjusted dosing." },
            { label: "Ocular Cysticercosis / Neurocysticercosis", action: "Praziquantel is contraindicated if intraocular/uncontrolled cerebral cysts are suspected due to severe inflammatory edema." },
            { label: "Acute Variceal Hemorrhage", action: "Stabilize airway/circulation, start IV Octreotide + IV Ceftriaxone + endoscopic band ligation first before administering Praziquantel." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Targeted Treatment, Annual MDA & Maternal Safety", detail: "Treat all confirmed cases and conduct annual Mass Drug Administration (MDA) with Praziquantel (40 mg/kg single dose) in endemic barangays; Praziquantel is safe and recommended during pregnancy and lactation in endemic areas—untreated maternal schistosomiasis worsens severe anemia and low birth weight." },
            { title: "Portal Hypertension & Variceal Screening", detail: "Screen chronic patients with Abdominal Ultrasound and Upper GI Endoscopy (EGD) if splenomegaly or thrombocytopenia is present to detect esophageal varices early." }
          ],
          conditional: [
            { title: "Serological Testing (COPT / ELISA)", detail: "Using serological tests (COPT / ELISA) when Kato-Katz stool exams are repeatedly negative despite high clinical and geographic suspicion." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Take Geographic & Exposure History", detail: "Always ask patients from Visayas/Mindanao/Bicol/Mindoro about wading in rice fields, rivers, or streams. Screen for chronic bloody/mucoid diarrhea, right upper quadrant fullness, hepatosplenomegaly, or unexplained seizures." },
            { step: "2. Confirm & Stage Organ Involvement", detail: "Order Kato-Katz stool exam (3 specimens), CBC (eosinophilia, hypersplenism-induced thrombocytopenia), Liver Function Tests (AST/ALT, Albumin, PT/INR), and Hepatobiliary Ultrasound." },
            { step: "3. Administer Praziquantel (60 mg/kg in 1 Day)", detail: "Give divided into 2–3 doses (e.g., 20 mg/kg TID every 4–6 hours) with food to minimize nausea, dizziness, and abdominal cramping. Warn patients of transient side effects (dizziness, mild fever, urticaria) caused by dying adult worms; give Paracetamol or antihistamines if needed." },
            { step: "4. Follow-Up", detail: "Repeat Kato-Katz stool exam 6–12 weeks post-treatment to confirm parasitologic cure." }
          ]
        },
        practiceNotes: [
          { title: "Free DOH Supply", detail: "Praziquantel 600 mg tablets are supplied 100% free through DOH Regional Offices and Municipal Health Offices (MHOs) in all 28 endemic provinces." }
        ],
        soapPlanSummary: [
          "Diagnostics & Staging: Order Kato-Katz stool exam (x3 specimens), CBC, LFTs (AST/ALT, Albumin, PT/INR), and Hepatobiliary Ultrasound (plus EGD if splenomegaly/thrombocytopenia).",
          "Targeted Therapy: Administer Praziquantel 60 mg/kg/day PO divided into 2–3 doses (4–6 hours apart) for 1 day with food (free at MHO/RHU in endemic provinces).",
          "Monitoring & Follow-Up: Counsel on transient worm-lysis symptoms (dizziness/urticaria); repeat Kato-Katz stool exam 6–12 weeks post-treatment to verify cure."
        ]
      },
      {
        id: "cpg-malaria",
        category: "Pulmonary & Infectious",
        title: "Malaria (Plasmodium falciparum, P. vivax, P. knowlesi)",
        source: "DOH National Malaria Control and Elimination Program (NMCEP) & PSMID Malaria Guidelines",
        intendedUsers: "Primary Care Physicians, Emergency Clinicians, Rural Health Unit (RHU) & Palawan/Endemic Area Providers",
        keywords: ["malaria", "plasmodium", "falciparum", "vivax", "knowlesi", "artemether", "lumefantrine", "primaquine", "artesunate", "g6pd", "palawan", "nmcep", "rdt", "blood smear"],
        snapshot: [
          { parameter: "Primary Endemic Areas", value: "Palawan (accounts for > 90% of Philippine cases—especially Rizal, Brooke's Point, Bataraza, Puerto Princesa), plus sporadic foci in Sultan Kudarat, Mindoro, and Mindanao forested areas" },
          { parameter: "Mandatory Diagnostic Test", value: "Microscopy (Thick & Thin Blood Smears) OR Malaria Rapid Diagnostic Test (RDT) before starting antimalarials" },
          { parameter: "Uncomplicated P. falciparum / P. knowlesi", value: "Artemether-Lumefantrine (AL) PO BID for 3 days (dosed by weight) PLUS Single-Dose Primaquine (0.25 mg/kg) on Day 1 for transmission blocking" },
          { parameter: "Uncomplicated P. vivax / P. ovale", value: "Artemether-Lumefantrine (AL) for 3 days PLUS Primaquine (0.25–0.5 mg/kg/day) OD for 14 days (radical cure of liver hypnozoites—check G6PD first)" },
          { parameter: "Severe Malaria (Any Species)", value: "IV Artesunate 2.4 mg/kg (≥ 20 kg) or 3.0 mg/kg (< 20 kg) at 0, 12, and 24 hours, then OD until able to tolerate full 3-day oral AL" }
        ],
        scope: {
          included: [
            "Children and adults presenting with acute febrile illness and travel/residence in malaria-endemic Philippine provinces or international endemic regions."
          ],
          excluded: [
            { label: "Pregnancy (1st Trimester) & Breastfeeding for Primaquine", action: "Primaquine is strictly contraindicated in pregnancy and breastfeeding (causes severe fetal/infant hemolysis); treat pregnant women with Artemether-Lumefantrine (or Quinine + Clindamycin if AL unavailable) and defer Primaquine until after delivery/weaning." },
            { label: "G6PD Deficiency", action: "Contraindicates standard 14-day daily Primaquine (use modified weekly Primaquine 0.75 mg/kg once weekly for 8 weeks under close hematocrit monitoring)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Confirm Diagnosis Before Treatment & Use First-Line ACT", detail: "Confirm every suspected malaria case via blood smear microscopy or RDT before initiating treatment—never treat empirically without testing unless severe malaria is suspected and diagnostics are > 2 hours away; use Artemisinin-Based Combination Therapy (ACT — Artemether-Lumefantrine) as first-line treatment for all uncomplicated malaria in the Philippines (do NOT use Chloroquine for P. falciparum due to widespread resistance)." },
            { title: "IV Artesunate for Severe Malaria", detail: "Administer IV Artesunate immediately as first-line therapy for Severe Malaria (superior survival over IV Quinine)." }
          ],
          conditional: [
            { title: "G6PD Screening Prior to 14-Day Primaquine", detail: "Testing G6PD status before starting the 14-day Primaquine radical cure course for P. vivax (mandatory where available; if unavailable, counsel patients closely on dark/tea-colored urine and jaundice)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen for Severe Malaria Red Flags", detail: "Impaired consciousness/coma, prostration, > 2 convulsions in 24 hrs, acidosis, hypoglycemia (< 40 mg/dL), severe anemia (Hb < 5 g/dL children / < 7 g/dL adults), acute kidney injury, jaundice, pulmonary edema, shock, or hyperparasitemia (> 2%–5%)." },
            { step: "2. Confirm Species & Parasite Density", detail: "Obtain Thick/Thin Blood Smear and RDT." },
            { step: "3. Treat Uncomplicated Malaria (Outpatient)", detail: "Artemether-Lumefantrine (20/120 mg tabs): Give at 0, 8, 24, 36, 48, and 60 hours (6 doses over 3 days) with fatty food or milk (crucial for Lumefantrine absorption). Weight dosing: 5–14 kg: 1 tab/dose | 15–24 kg: 2 tabs/dose | 25–34 kg: 3 tabs/dose | ≥ 35 kg: 4 tabs/dose. Add Primaquine per species protocol above." },
            { step: "4. Follow-Up Smears", detail: "Repeat blood smear on Days 3, 7, 14, and 28 to verify parasite clearance and rule out recrudescence." }
          ]
        },
        practiceNotes: [
          { title: "Mandatory Notifiable Disease (RA 11332)", detail: "Every confirmed malaria case must be reported immediately to the local Epidemiology and Surveillance Unit (ESU) / RHU for active case detection and vector control." },
          { title: "Free DOH Antimalarials", detail: "RDTs, Artemether-Lumefantrine, Primaquine, and IV Artesunate are provided 100% free at DOH-accredited RHUs, Malaria Microscopy Centers, and government hospitals." }
        ],
        soapPlanSummary: [
          "Diagnostics: Obtain Malaria Thick & Thin Blood Smears + Malaria RDT (plus G6PD assay prior to 14-day Primaquine for P. vivax/ovale).",
          "Antimalarial Regimen: Uncomplicated → Weight-based Artemether-Lumefantrine (6 doses at 0, 8, 24, 36, 48, 60 hrs with fatty meal/milk) + Primaquine per species; Severe Malaria → Immediate IV Artesunate 2.4 mg/kg (3.0 mg/kg if < 20 kg) at 0, 12, 24 hrs.",
          "Notification & Follow-Up: Report immediately to ESU/RHU (RA 11332); repeat blood smears on Days 3, 7, 14, and 28."
        ]
      },
      {
        id: "cpg-rabies-pep",
        category: "Pulmonary & Infectious",
        title: "Animal Bites & Rabies Post-Exposure Prophylaxis (PEP)",
        source: "DOH National Rabies Prevention and Control Program (NRPCP) Revised Guidelines & PSMID Rabies CPG",
        intendedUsers: "Primary Care Physicians, Animal Bite Treatment Center (ABTC) Clinicians, Emergency & RHU Providers",
        keywords: ["rabies", "animal bite", "dog bite", "cat bite", "pep", "rig", "erig", "hrig", "anti-rabies", "arv", "abtc", "category i", "category ii", "category iii", "tandok", "tetanus"],
        snapshotHeaders: ["Exposure Category", "Type of Contact", "Required Management"],
        snapshot: [
          { col1: "Category I", col2: "Touching/feeding animals, licks on intact skin", col3: "Wash exposed skin with soap and water; NO vaccine or RIG needed" },
          { col1: "Category II", col2: "Nibbling of uncovered skin, minor scratches or abrasions without bleeding", col3: "Immediate wound washing + Anti-Rabies Vaccine (ARV) immediately (NO RIG needed)" },
          { col1: "Category III", col2: "Single or multiple transdermal bites or scratches (with bleeding), licks on broken skin/mucous membranes, all bites/scratches on head/neck, or any bat exposure", col3: "Immediate wound washing + Rabies Immunoglobulin (RIG) + Anti-Rabies Vaccine (ARV) immediately" }
        ],
        scope: {
          included: [
            "Any patient presenting with bite, scratch, or mucosal saliva exposure from dogs, cats, bats, or other warm-blooded mammals in the Philippines (where rabies remains endemic and 100% fatal once clinical symptoms appear)."
          ],
          excluded: [
            { label: "Clinical Rabies Encephalitis", action: "Hydrophobia, aerophobia, autonomic instability, agitation/paralysis—no proven cure; admit for compassionate palliative isolation and supportive care." },
            { label: "Non-Mammalian Bites (Snakes, Lizards, Birds, Insects)", action: "Do not transmit rabies; evaluate for snake envenomation, tetanus, and bacterial wound infection instead." }
          ]
        },
        recommendations: {
          strong: [
            { title: "15-Minute Soap & Water Washing + Never Suture Primary Bite Wounds", detail: "Wash every wound immediately with running water and soap/detergent for at least 15 minutes, followed by Povidone-Iodine or 70% alcohol (reduces rabies viral load by up to 90%); never suture primary animal bite wounds initially (if deep facial/vascular hemostasis is strictly required, infiltrate RIG first and wait 15–30 minutes before loose approximation sutures)." },
            { title: "Start Day 0 PEP Immediately & Administer Tetanus Prophylaxis", detail: "Do NOT delay PEP to observe the biting animal for 14 days in Category II or III exposures—start vaccination on Day 0 immediately (if the dog/cat remains healthy and alive at Day 14, Day 28 dose may be omitted); administer Tetanus Toxoid / Td (and TIG if unimmunized/dirty wound) to all Category II and III bite patients." }
          ],
          conditional: [
            { title: "Prophylactic Antibiotics for High-Risk Bite Wounds", detail: "Prescribing prophylactic Co-amoxiclav (625 mg TID for 3–5 days) (or Doxycycline + Metronidazole if penicillin-allergic) for deep puncture wounds, cat bites, hand/foot/face bites, or immunocompromised patients to prevent Pasteurella and polymicrobial cellulitis." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Immediate Wound Care (15 Minutes)", detail: "Flush thoroughly with soap and water + antiseptic (Povidone-Iodine or 70% alcohol); leave wound open." },
            { step: "2. Administer Rabies Immunoglobulin (RIG) — Category III Only (Within 7 Days of Day 0 Vaccine)", detail: "Human RIG (HRIG): 20 IU/kg single dose. Equine RIG (ERIG): 40 IU/kg single dose (routine skin test is no longer required by WHO/DOH, though emergency epinephrine must be ready). Infiltration Technique: Infiltrate as much of the calculated RIG dose as anatomically feasible directly into and around all bite wounds; inject any remaining volume IM at a site distant from the vaccine (never exceed calculated dose)." },
            { step: "3. Administer Anti-Rabies Vaccine (ARV — PCECV or PVRV)", detail: "Updated Thai Red Cross Intradermal (ID) Regimen (Standard DOH ABTC Protocol): 0.1 mL ID at 2 sites (both deltoids or anterolateral thighs in infants) on Days 0, 3, 7, and 28 (2-2-2-0-2). Essen IM Regimen: 1 full vial (0.5 mL or 1.0 mL) IM into deltoid on Days 0, 3, 7, 14, and 28 (1-1-1-1-1). Previously Immunized Patients (Completed Full PrEP or PEP): Give booster doses ONLY on Days 0 and 3 (0.1 mL ID at 1 site, or 1 vial IM); NO RIG is ever given." }
          ]
        },
        practiceNotes: [
          { title: "Avoid Traditional \"Tandok\" Remedies", detail: "Strongly counsel patients against traditional folk healing (tandok—applying animal horns/stones to \"suck out\" venom/rabies), garlic/vinegar poultices, or killing/eating the biting dog (which destroys observation capability and risks butcher transmission)." },
          { title: "Free ABTC & PhilHealth Animal Bite Package", detail: "PEP vaccines and ERIG are provided free at DOH-accredited Animal Bite Treatment Centers (ABTCs) and covered under the PhilHealth Animal Bite Treatment Package." }
        ],
        soapPlanSummary: [
          "Immediate Wound Care: Wash thoroughly with running water and soap for ≥ 15 minutes + Povidone-Iodine/70% alcohol; leave wound unsutured; administer Tetanus Toxoid / Td.",
          "Rabies PEP Protocol: Category II → Start ARV on Day 0 (Thai Red Cross ID 0.1 mL × 2 sites on Days 0, 3, 7, 28); Category III → Wound infiltration with ERIG (40 IU/kg) or HRIG (20 IU/kg) + ARV starting Day 0.",
          "Counseling & Follow-Up: Strongly advise against traditional 'tandok' or killing the biting animal; observe dog/cat for 14 days if healthy; return on Day 3 for next ARV dose."
        ]
      },
      {
        id: "cpg-scabies",
        category: "Dermatology & Primary Care",
        title: "Scabies (Sarcoptic Mange)",
        source: "PDS Clinical Practice Guidelines on Scabies & DOH Primary Care Dermatology Protocols",
        intendedUsers: "Primary Care Physicians, Pediatricians, Dermatologists & Rural Health Unit (RHU) Clinicians",
        keywords: ["scabies", "sarcoptic mange", "permethrin", "sulfur", "ivermectin", "nocturnal pruritus", "burrows", "pds", "post-scabies itch", "crusted scabies"],
        snapshot: [
          { parameter: "Classic Clinical Triad", value: "Intense nocturnal pruritus (worse at night/warmth) + characteristic burrows/papules in classic distribution (interdigital finger webs, wrists, elbows, axillae, periumbilical area, genitalia/buttocks; palms/soles/scalp in infants) + close contacts with similar itch" },
          { parameter: "First-Line Topical Therapy", value: "Permethrin 5% Cream/Lotion: Apply neck-to-toes (include scalp/face in infants & elderly), wash off after 8–14 hours, and repeat in 7–14 days" },
          { parameter: "Alternative Topical / Oral Regimens", value: "Precipitated Sulfur 5%–10% Ointment: Apply nightly for 3 consecutive nights (safe in infants < 2 mos & pregnancy) | Oral Ivermectin: 200 mcg/kg single dose, repeated on Day 7–14 (for institutional outbreaks, crusted scabies, or topical failure; avoid if < 15 kg or pregnant)" },
          { parameter: "Mandatory Household Rule", value: "Treat ALL household members and close physical contacts simultaneously on Day 1, even if completely asymptomatic" }
        ],
        scope: {
          included: [
            "Infants, children, non-pregnant adults, and pregnant/lactating women presenting with classic scabies in outpatient or institutional settings (schools, dormitories, jails, evacuation centers)."
          ],
          excluded: [
            { label: "Crusted (Norwegian) Scabies", action: "Hyperkeratotic, scaly plaques teeming with thousands of mites in immunocompromised, elderly, or neuropathic patients—requires combination therapy (Oral Ivermectin on Days 1, 2, 8, 9, and 15 + daily topical Permethrin 5% + keratolytic Salicylic Acid/Urea) and contact isolation." },
            { label: "Secondary Bacterial Impetiginization / Cellulitis", action: "Honey-crusted pustules or spreading erythema/fever—add targeted oral antibiotics (Cefalexin or Cloxacillin, or Co-amoxiclav) alongside scabicide therapy." }
          ]
        },
        recommendations: {
          strong: [
            { title: "First-Line Permethrin 5% & Simultaneous Household Treatment", detail: "Use Permethrin 5% cream as the first-line treatment of choice for classic scabies in patients aged ≥ 2 months, including pregnant and lactating women; treat all household and close contacts simultaneously—treating only the symptomatic patient leads to inevitable re-infestation." },
            { title: "Fomite Decontamination & Post-Scabies Itch Counseling", detail: "Decontaminate bedding, towels, and clothes worn in the last 3 days by washing in hot water (≥ 50°C), sun-drying, or sealing in a closed plastic bag for 72 hours (mites die off-host within 2–3 days); counsel patients on \"Post-Scabies Itch\": pruritus commonly persists for 2 to 4 weeks after successful mite eradication due to delayed hypersensitivity—do not repeatedly apply Permethrin unless new burrows appear after Day 14." }
          ],
          conditional: [
            { title: "Oral Ivermectin for Outbreaks or Topical Barriers", detail: "Prescribing Oral Ivermectin (200 mcg/kg on Days 1 and 8) when topical adherence is impractical, in mass shelter outbreaks, or when Permethrin is unaffordable/unavailable." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Diagnosis & Check for Secondary Infection", detail: "Inspect interdigital webs, flexor wrists, axillae, and groin/buttocks (plus palms/soles/scalp in babies). Look for pustules or regional lymphadenopathy." },
            { step: "2. Prescribe Scabicide & Exact Application Instructions", detail: "Apply Permethrin 5% on cool, dry skin (not right after a hot bath, which increases systemic absorption) from the jawline down to the soles of the feet, paying special attention under trimmed fingernails and skin folds. Leave on overnight (8–14 hours), bathe in the morning, and repeat the entire application 7 days later to kill newly hatched nymphs." },
            { step: "3. Manage Pruritus & Inflammation", detail: "Prescribe oral antihistamines (Cetirizine 10 mg OD or Hydroxyzine 25 mg at bedtime for nocturnal itch) and a mild-to-moderate topical corticosteroid (Hydrocortisone 1%–2.5% or Betamethasone Valerate 0.1%) after completing scabicide wash-off for persistent eczematous nodules." },
            { step: "4. Follow-Up at 2–4 Weeks", detail: "Re-evaluate only if new lesions/burrows emerge beyond 14 days." }
          ]
        },
        practiceNotes: [
          { title: "Budget-Friendly RHU Alternative", detail: "Permethrin 5% lotion can be costly for large Filipino households. When cost is a barrier, compounded 5%–10% Precipitated Sulfur in Petrolatum (applied nightly for 3 consecutive nights) is inexpensive, widely available in local pharmacies/RHUs, and safe for infants < 2 months and pregnant women." },
          { title: "Avoid Lindane & Veterinary Products", detail: "Warn patients never to apply veterinary ivermectin/amitraz or kerosene/gasoline to human skin." }
        ],
        soapPlanSummary: [
          "Scabicide Therapy: Apply Permethrin 5% cream/lotion neck-to-toes on cool, dry skin for 8–14 hours overnight, wash off in morning, and repeat on Day 7 (or Precipitated Sulfur 5%–10% ointment nightly × 3 nights if infant < 2 mos or budget-constrained).",
          "Mandatory Household & Fomite Protocol: Treat ALL household and close contacts simultaneously on Day 1; wash bedding/clothes worn in last 3 days in hot water (≥ 50°C), sun-dry, or seal in plastic bags for 72 hours.",
          "Symptomatic Relief & Counseling: Prescribe Cetirizine 10 mg OD or Hydroxyzine 25 mg QHS for pruritus; counsel that post-scabies itch can persist 2–4 weeks without needing repeat Permethrin unless new burrows appear after Day 14."
        ]
      },
      {
        id: "cpg-gout",
        category: "Rheumatology & Musculoskeletal",
        title: "Acute Gouty Arthritis & Chronic Gout",
        source: "PRA Clinical Practice Guidelines on the Management of Gout",
        intendedUsers: "Primary Care Physicians, Internists, Rheumatologists & Emergency Clinicians",
        keywords: ["gout", "gouty arthritis", "hyperuricemia", "podagra", "colchicine", "allopurinol", "febuxostat", "etoricoxib", "prednisone", "sua", "uric acid", "pra", "hla-b*5801"],
        snapshot: [
          { parameter: "Classic Presentation", value: "Hyperacute onset (reaches peak pain within < 24 hours) of severe, erythematous, hot, swollen monoarthritis—most classically the 1st metatarsophalangeal (MTP) joint (podagra), midfoot, ankle, or knee" },
          { parameter: "Acute Flare First-Line Drugs", value: "Start within 24 hours of flare onset (choose 1 based on comorbidities): NSAIDs (Etoricoxib 120 mg OD, Celecoxib 400 mg then 200 mg BID, Indomethacin 50 mg TID, or Naproxen 500 mg BID) | Low-Dose Colchicine: 1.0 mg (or 1.2 mg) immediately, followed 1 hour later by 0.5 mg (or 0.6 mg) (Max 1.5–1.8 mg Day 1; then 0.5 mg OD/BID until resolved) | Oral Corticosteroids: Prednisone 30–40 mg/day for 5–7 days (or intra-articular steroid injection)" },
          { parameter: "Urate-Lowering Therapy (ULT)", value: "Allopurinol (start 100 mg OD; 50 mg OD if eGFR < 60), titrated every 2–4 weeks to reach target serum uric acid (SUA)" },
          { parameter: "Target Serum Uric Acid (SUA)", value: "< 6.0 mg/dL (< 360 μmol/L) for all gout patients; < 5.0 mg/dL (< 300 μmol/L) if tophi, chronic gouty arthropathy, or frequent flares" }
        ],
        scope: {
          included: [
            "Filipino adults presenting with acute gouty flares, recurrent gout (≥ 2 flares/year), tophaceous gout, or gout with chronic kidney disease/urolithiasis."
          ],
          excluded: [
            { label: "Septic Arthritis (Critical Red Flag)", action: "Fever, rigors, systemic toxicity, or high-risk joint infection—perform urgent arthrocentesis (Gram stain, culture, cell count) and start empiric IV antibiotics immediately; never inject intra-articular steroids until septic arthritis is excluded." },
            { label: "Asymptomatic Hyperuricemia", action: "Elevated SUA without prior gout flares, tophi, or uric acid nephrolithiasis—do NOT routinely start Allopurinol or Febuxostat (treat comorbidities and diet instead)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Continue Existing ULT During Flares & Use Low-Dose Colchicine", detail: "Do NOT stop or change existing Allopurinol/Febuxostat during an acute gout flare—fluctuating serum uric acid worsens and prolongs the attack; avoid high-dose Colchicine regimens (e.g., hourly dosing until diarrhea)—low-dose Colchicine (1.0 mg + 0.5 mg) is equally effective with drastically lower GI/neuromuscular toxicity." },
            { title: "First-Line Allopurinol & Mandatory 3–6 Month Flare Prophylaxis", detail: "Start Allopurinol as first-line Urate-Lowering Therapy (ULT) in patients with ≥ 2 flares/year, ≥ 1 subcutaneous tophus, radiographic gouty erosions, or CKD Stage ≥ 3 / urolithiasis; co-prescribe anti-inflammatory flare prophylaxis (Colchicine 0.5 mg OD/BID or low-dose NSAID/Prednisone) for the first 3 to 6 months whenever initiating or titrating ULT to prevent mobilization flares." }
          ],
          conditional: [
            { title: "ULT Timing & Second-Line Febuxostat", detail: "Starting ULT during an acute flare (under cover of anti-inflammatory flare therapy) vs. waiting 2 weeks after flare resolution, based on patient adherence and follow-up reliability; switching to Febuxostat (40–80 mg OD) if Allopurinol is not tolerated or fails to reach target SUA (counseling on cardiovascular safety in patients with established ASCVD)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Assess Flare & Screen Comorbidities", detail: "Check Serum Creatinine/eGFR, Blood Pressure, Fasting Blood Sugar, and Lipid Profile (gout strongly clusters with metabolic syndrome and CKD in Filipinos)." },
            { step: "2. Treat Acute Flare Safely (Match Drug to Comorbidities)", detail: "Normal Renal/GI/Cardiac Function: Full-dose NSAID (e.g., Naproxen or Celecoxib + PPI) OR Low-dose Colchicine. CKD (eGFR < 30), Peptic Ulcer, or Heart Failure: Avoid NSAIDs and full-dose Colchicine → use Oral Prednisone (30–40 mg/day for 5–7 days) or intra-articular triamcinolone." },
            { step: "3. Initiate & Titrate ULT (\"Start Low, Go Slow\")", detail: "Start Allopurinol 100 mg OD (50 mg OD if CKD ≥ 3) alongside Colchicine 0.5 mg OD prophylaxis. Recheck SUA, Creatinine, and ALT every 2–4 weeks and increase Allopurinol by 100 mg increments (up to max 800 mg/day) until SUA is consistently < 6.0 mg/dL (< 5.0 mg/dL if tophaceous)." }
          ]
        },
        practiceNotes: [
          { title: "Allopurinol Hypersensitivity Syndrome (AHS) Warning", detail: "Filipinos (Han Chinese/Southeast Asian ancestry) have an elevated prevalence of HLA-B*5801, increasing the risk of fatal DRESS/SJS/TEN from Allopurinol—especially when started at 300 mg/day in CKD. Always start at 50–100 mg/day and instruct patients to stop Allopurinol immediately if any skin rash, fever, or mouth ulcers appear." },
          { title: "Filipino Diet Coaching", detail: "Limit purine-rich local staples: organ meats (bopis, isaw, dinuguan, liver), red meat, shellfish/seafood (hipon, alimango, pusit, sardines/anchovies/dilis), beer/alcohol, and high-fructose sweetened beverages. Encourage low-fat dairy, water hydration (≥ 2 L/day), and Vitamin C-rich foods." }
        ],
        soapPlanSummary: [
          "Diagnostics & Comorbidity Screen: Order Serum Uric Acid (SUA), Serum Creatinine/eGFR, FBS, and Lipid Profile.",
          "Acute Flare & ULT Regimen: Treat acute flare with low-dose Colchicine (1.0 mg then 0.5 mg 1 hr later), NSAID + PPI, or Prednisone 30–40 mg/day × 5–7 days (if CKD/PUD/HF); start Allopurinol 100 mg OD (50 mg OD if eGFR < 60) + Colchicine 0.5 mg OD prophylaxis for 3–6 months targeting SUA < 6.0 mg/dL.",
          "Safety & Diet Counseling: Stop Allopurinol immediately if skin rash, fever, or mouth ulcers develop (AHS/SJS warning); limit organ meats (bopis/isaw/dinuguan), seafood/shellfish, beer, and sugary drinks; drink ≥ 2 L water daily."
        ]
      },
      {
        id: "cpg-osteoarthritis",
        category: "Rheumatology & Musculoskeletal",
        title: "Osteoarthritis (Knee, Hip, and Hand OA)",
        source: "PRA Clinical Practice Guidelines on the Management of Osteoarthritis",
        intendedUsers: "Primary Care Physicians, Internists, Family Medicine, Physiatrists & Orthopedic Clinicians",
        keywords: ["osteoarthritis", "oa", "knee pain", "joint pain", "crepitus", "diclofenac gel", "duloxetine", "glucosamine", "arthroplasty", "pra", "triamcinolone"],
        snapshot: [
          { parameter: "Clinical Diagnosis (Knee OA)", value: "Age ≥ 45 years + activity-related joint pain + morning stiffness lasting < 30 minutes + crepitus, bony enlargement, or restricted range of motion (radiographs not required for typical presentation)" },
          { parameter: "Core Non-Pharmacologic Pillars", value: "1. Structured Exercise (quadriceps strengthening, low-impact aerobic exercise, Tai Chi) | 2. Weight Loss (≥ 5%–10% body weight reduction if overweight/obese) | 3. Self-Management & Assistive Devices (cane in contralateral hand, knee braces/insoles)" },
          { parameter: "First-Line Pharmacotherapy", value: "Knee/Hand OA: Topical NSAIDs (Diclofenac gel/patch, Ketoprofen gel) FIRST before oral drugs | Hip OA / Multi-Joint OA: Oral NSAIDs (lowest effective dose for shortest duration + PPI gastroprotection if GI risk)" },
          { parameter: "Second-Line / Adjuncts", value: "Duloxetine (30–60 mg OD for chronic/centralized OA pain), Topical Capsaicin (knee/hand), or Intra-Articular Corticosteroid Injection (short-term relief for acute knee/hip flares)" },
          { parameter: "Surgical Referral Cutoff", value: "Refractory severe pain and functional disability despite ≥ 3–6 months of optimal conservative therapy → refer for Total Joint Arthroplasty" }
        ],
        scope: {
          included: [
            "Filipino adults presenting with primary or post-traumatic osteoarthritis of the knee, hip, or hand in outpatient primary care."
          ],
          excluded: [
            { label: "Inflammatory Arthritis (Rheumatoid Arthritis, Lupus, Psoriatic Arthritis)", action: "Prolonged morning stiffness > 60 minutes, symmetric MCP/PIP/wrist synovitis, systemic fatigue/fever, or elevated ESR/CRP/RF/Anti-CCP—refer early to a rheumatologist for Disease-Modifying Antirheumatic Drugs (DMARDs)." },
            { label: "Acute Septic Arthritis or Crystal Arthritis (Gout/Pseudogout)", action: "Hot, acutely swollen, red joint with severe rest pain—perform joint aspiration before any steroid injection." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Structured Exercise, Weight Loss & Topical NSAIDs First", detail: "Prescribe land-based or aquatic exercise and weight loss (for patients with BMI ≥ 23 kg/m²) as mandatory foundational treatment—no pill replaces mechanical load reduction and muscle strengthening; use Topical NSAIDs ahead of oral NSAIDs for Knee and Hand OA (comparable pain relief with minimal GI, renal, or cardiovascular toxicity)." },
            { title: "Treatments Strongly Recommended AGAINST", detail: "Strongly recommend AGAINST: Glucosamine, Chondroitin sulfate, Diacerein, Opioid analgesics (Tramadol/Morphine for chronic OA), and routine arthroscopic lavage/debridement for degenerative knee OA without mechanical locking." }
          ],
          conditional: [
            { title: "Short-Term Paracetamol & Intra-Articular Corticosteroids", detail: "Paracetamol (Acetaminophen) up to 3 g/day for short-term rescue analgesia when both topical and oral NSAIDs are contraindicated (noting very modest efficacy); intra-articular Corticosteroid injection (Triamcinolone acetonide 40 mg) for acute knee/hip OA exacerbations with effusion (limit to ≤ 3–4 injections/year)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Clinical Assessment & Red-Flag Screen", detail: "Confirm mechanical pain pattern (worse with weight-bearing/stairs, relieved by rest; morning stiffness < 30 min). Rule out night/rest pain, unexplained weight loss, fever, or true joint locking." },
            { step: "2. Initiate Non-Pharmacologic Core Plan", detail: "Prescribe daily isometric/isotonic quadriceps sets, straight-leg raises, and low-impact walking/swimming (30 min, 5×/week). Teach cane use in the opposite (contralateral) hand to offload the painful knee/hip." },
            { step: "3. Stepwise Pharmacologic Escalation", detail: "Step 1 (Knee/Hand): Topical Diclofenac gel applied QID to the affected joint. Step 2 (Inadequate Relief or Hip OA): Add Oral NSAID (e.g., Celecoxib 200 mg OD or Naproxen 500 mg BID + Omeprazole 20 mg OD) for short intermittent courses (1–2 weeks), avoiding oral NSAIDs in CKD (eGFR < 30), active PUD, or uncontrolled heart failure/hypertension. Step 3 (Persistent Chronic Pain): Add Duloxetine (30 mg OD for 1 week, then 60 mg OD) or administer Intra-articular Corticosteroid for acute knee effusion." },
            { step: "4. Orthopedic Referral", detail: "Refer for surgical evaluation when pain severely limits walking, climbing stairs, or sleep despite full conservative management." }
          ]
        },
        practiceNotes: [
          { title: "Stop Expensive Unproven Supplements", detail: "Many Filipino patients spend significant out-of-pocket funds on imported Glucosamine/Chondroitin, collagen drinks, or herbal liniments—counsel clearly that Philippine and international guidelines advise against Glucosamine/Chondroitin due to lack of clinically meaningful benefit, helping redirect their budget toward proper footwear, physical therapy, or topical NSAIDs." },
          { title: "PhilHealth Z-Benefit Coverage", detail: "For end-stage disabling OA, Total Knee Replacement and Total Hip Replacement are covered under dedicated PhilHealth Z-Benefit Packages at contracted government and private hospitals." }
        ],
        soapPlanSummary: [
          "Non-Pharmacologic Core Plan: Daily quadriceps strengthening exercises + low-impact aerobic activity (30 min, 5×/week), weight loss target (≥ 5%–10% if BMI ≥ 23 kg/m²), and contralateral cane offloading.",
          "Stepwise Pharmacotherapy: Start Topical Diclofenac gel QID for Knee/Hand OA (avoid oral NSAIDs if CKD/PUD/HF; advise against Glucosamine, Chondroitin, Diacerein, and chronic opioids).",
          "Follow-Up & Surgical Referral: Reassess pain and function in 4–6 weeks; refer to Orthopedics for Total Joint Arthroplasty if refractory after 3–6 months of optimal conservative therapy (PhilHealth Z-Benefit eligible)."
        ]
      },
      {
        id: "cpg-thyroid-disorders",
        category: "Endocrine & Metabolic",
        title: "Thyroid Disorders (Hypothyroidism & Hyperthyroidism)",
        source: "PCEDM & Philippine Thyroid Association (PTA) Clinical Practice Guidelines on Thyroid Disorders",
        intendedUsers: "Primary Care Physicians, Internists, Endocrinologists, OB-GYNs & RHU Clinicians",
        keywords: ["thyroid", "hypothyroidism", "hyperthyroidism", "graves", "levothyroxine", "methimazole", "propylthiouracil", "ptu", "tsh", "ft4", "ft3", "thyroid storm", "myxedema", "pta", "pcedm", "goiter"],
        snapshotHeaders: ["Condition", "Key Lab Profile", "First-Line Management & Target Goal"],
        snapshot: [
          {
            col1: "Overt Primary Hypothyroidism",
            col2: "Elevated TSH (> 4.5–5.0 mIU/L) + Low Free T4 (FT4)",
            col3: "Levothyroxine (LT4) 1.6 mcg/kg/day PO OD (start low at 12.5–25 mcg/day if age > 60 or coronary artery disease) | Target TSH: 0.5–2.5 mIU/L (general adults) | 3.0–5.0 mIU/L (age ≥ 70 yrs)"
          },
          {
            col1: "Subclinical Hypothyroidism",
            col2: "Elevated TSH + Normal FT4",
            col3: "Treat with Levothyroxine if TSH ≥ 10 mIU/L, pregnant/planning pregnancy, or symptomatic with positive Anti-TPO antibodies"
          },
          {
            col1: "Overt Hyperthyroidism (Graves' / Toxic Nodular)",
            col2: "Suppressed TSH (< 0.1 mIU/L) + Elevated FT4 and/or Free T3 (FT3)",
            col3: "Methimazole 10–30 mg/day PO OD (1st-line for all non-pregnant patients & 2nd/3rd trimester pregnancy) | Propylthiouracil (PTU) 100–150 mg PO TID (1st trimester pregnancy or Thyroid Storm ONLY) | Beta-Blocker (Propranolol 20–40 mg TID/QID) for palpitations/tremor until euthyroid"
          },
          {
            col1: "Emergency Red Flags",
            col2: "Myxedema Coma (hypothermia, bradycardia, stupor) or Thyroid Storm (fever ≥ 38.5°C, tachycardia > 140 bpm, agitation/delirium, heart failure/jaundice)",
            col3: "Immediate ER / ICU Admission: Thyroid Storm: PTU 200 mg q4h + Lugol's Iodine (given 1 hour AFTER PTU) + IV Propranolol + IV Hydrocortisone 100 mg q8h | Myxedema Coma: IV Levothyroxine + IV Hydrocortisone + passive rewarming"
          }
        ],
        scope: {
          included: [
            "Non-pregnant and pregnant Filipino adults presenting with primary hypothyroidism, subclinical hypothyroidism, Graves' disease, toxic multinodular goiter, or toxic adenoma in primary care or outpatient settings."
          ],
          excluded: [
            { label: "Thyroid Nodules / Suspicious Thyroid Cancer", action: "Any solitary or dominant thyroid nodule ≥ 1 cm (or with hoarseness, rapid growth, cervical lymphadenopathy, or radiation history) requires High-Resolution Neck Ultrasound (TI-RADS) and Fine-Needle Aspiration Biopsy (FNAB)—do not prescribe Levothyroxine suppression therapy for benign euthyroid nodules." },
            { label: "Subacute / Postpartum Thyroiditis", action: "Transient thyrotoxic phase followed by hypothyroidism—treat symptomatic thyrotoxicosis with Propranolol + NSAIDs/Prednisone (Antithyroid drugs like Methimazole are ineffective because excess hormone comes from gland destruction, not synthesis)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "TSH Initial Screening & First-Line Methimazole Selection", detail: "Order Serum TSH as the single best initial screening test for suspected thyroid dysfunction, followed by Free T4 (and Free T3 if TSH is suppressed with normal FT4 to rule out T3 toxicosis); use Methimazole over PTU as first-line antithyroid therapy in virtually all patients (lower hepatotoxicity, once-daily dosing, faster euthyroidism)—except during the 1st trimester of pregnancy (where PTU is preferred to avoid Methimazole embryopathy) and Thyroid Storm (PTU blocks peripheral T4-to-T3 conversion)." },
            { title: "Trimester-Specific Pregnancy TSH Targets & Levothyroxine Adjustment", detail: "Maintain maternal TSH < 2.5 mIU/L in the 1st trimester and < 3.0 mIU/L in the 2nd/3rd trimesters; increase pre-existing Levothyroxine dose by ~25%–30% (e.g., 2 extra tablets per week) immediately upon a positive pregnancy test." }
          ],
          conditional: [
            { title: "Definitive Graves' Disease Options", detail: "Choosing between 12–18 months of Antithyroid Drugs (Methimazole) vs. Radioactive Iodine (RAI) ablation vs. Total/Near-Total Thyroidectomy for Graves' disease (noting RAI is contraindicated in pregnancy, lactation, and moderate-to-severe Graves' orbitopathy)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Diagnosis & Etiology", detail: "Order TSH and Free T4 (+ FT3 if hyperthyroid). For Hyperthyroidism, confirm Graves' disease via TRAb (TSH Receptor Antibody) or Thyroid Ultrasound with Doppler (diffuse hypervascularity = \"thyroid inferno\") or Radioactive Iodine Uptake (RAIU) scan (if non-pregnant/non-lactating)." },
            { step: "2. Initiate & Titrate Levothyroxine (Hypothyroidism)", detail: "Instruct strict administration on an empty stomach with plain water 30–60 minutes before breakfast (or at bedtime ≥ 3 hours after dinner), separated by ≥ 4 hours from calcium, iron supplements, antacids, and PPIs. Recheck TSH every 6–8 weeks during titration, then every 6–12 months once stable." },
            { step: "3. Initiate & Monitor Methimazole (Hyperthyroidism)", detail: "Obtain baseline CBC and Liver Function Tests (AST/ALT/Bilirubin) before starting Methimazole or PTU. Start Methimazole 10–30 mg OD + Propranolol 20–40 mg TID (taper Propranolol once FT4 normalizes). Recheck FT4 and FT3 every 4–6 weeks (TSH remains suppressed for months—do not use TSH to guide early dose titration) and taper Methimazole to a maintenance dose (5–10 mg/day) for 12–18 months." }
          ]
        },
        practiceNotes: [
          { title: "Mandatory Agranulocytosis & Hepatotoxicity Warning", detail: "Instruct every patient taking Methimazole or PTU to stop the drug immediately and get a stat CBC/LFTs if they develop fever, severe sore throat/mouth ulcers (agranulocytosis), or jaundice/dark urine/right upper quadrant pain (drug-induced liver injury)." },
          { title: "Iodized Salt & Local Diet", detail: "Under the Philippine ASIN Law (RA 8172), universal salt iodization prevents endemic goiter—advise hypothyroid/euthyroid patients to use iodized salt, while instructing active hyperthyroid patients to temporarily avoid iodine-rich seafood/seaweed (lato, guso, kelp) and iodinated contrast dyes." }
        ],
        soapPlanSummary: [
          "Diagnostics: Order Serum TSH and Free T4 (+ Free T3 if suppressed TSH; baseline CBC & AST/ALT/Bilirubin prior to antithyroid drugs; Thyroid Ultrasound / TRAb if indicated).",
          "Targeted Therapy: Hypothyroidism → Levothyroxine PO OD on empty stomach 30–60 min before breakfast (separated ≥ 4 hrs from iron/calcium/PPIs), recheck TSH in 6–8 weeks; Hyperthyroidism → Methimazole 10–30 mg OD (PTU in 1st trimester pregnancy) + Propranolol 20–40 mg TID, recheck FT4/FT3 in 4–6 weeks.",
          "Safety Counseling: If on Methimazole/PTU, stop immediately and obtain stat CBC/LFTs if fever, sore throat, mouth ulcers, or jaundice develops; avoid iodine-rich seaweed (lato/guso) during active hyperthyroidism."
        ]
      },
      {
        id: "cpg-acid-peptic-gerd-pud",
        category: "Gastroenterology & Hepatology",
        title: "Acid-Peptic Disease (GERD & Peptic Ulcer Disease)",
        source: "Philippine Society of Gastroenterology (PSG) Clinical Practice Guidelines on GERD and Peptic Ulcer Disease",
        intendedUsers: "Primary Care Physicians, Internists, Gastroenterologists & Emergency Clinicians",
        keywords: ["gerd", "peptic ulcer", "pud", "dyspepsia", "heartburn", "acid reflux", "h. pylori", "helicobacter pylori", "omeprazole", "ppi", "bismuth quadruple", "egd", "endoscopy", "psg", "gi bleeding"],
        snapshotHeaders: ["Condition", "Clinical Presentation", "First-Line Management & Duration"],
        snapshot: [
          {
            col1: "Uncomplicated GERD",
            col2: "Heartburn and/or acid regurgitation ≥ 2×/week WITHOUT alarm features",
            col3: "Standard-Dose PPI once daily 30–60 min before breakfast for 8 weeks (Omeprazole 20 mg, Esomeprazole 40 mg, Pantoprazole 40 mg, Lansoprazole 30 mg, or Rabeprazole 20 mg)"
          },
          {
            col1: "Peptic Ulcer Disease (PUD) — H. pylori Negative",
            col2: "Epigastric burning/gnawing pain (relieved or worsened by meals), commonly NSAID- or low-dose Aspirin-induced",
            col3: "Stop offending NSAID/Aspirin + Standard-Dose PPI OD for 4–8 weeks (4 wks duodenal ulcer; 8 wks gastric ulcer)"
          },
          {
            col1: "H. pylori Eradication (1st-Line Philippine Regimen)",
            col2: "Confirmed H. pylori infection (via Urea Breath Test, Stool Antigen, or Endoscopic Biopsy/RUT)",
            col3: "14-Day Bismuth Quadruple Therapy (Preferred due to high Philippine Clarithromycin resistance): PPI standard dose BID + Bismuth Subsalicylate/Subcitrate QID + Tetracycline 500 mg QID + Metronidazole 500 mg TID/QID for 14 days (Alt: Concomitant non-bismuth quadruple therapy for 14 days)"
          },
          {
            col1: "Upper GI Alarm Features (Red Flags)",
            col2: "Dysphagia, odynophagia, GI bleeding (hematemesis/melena), iron-deficiency anemia, unintentional weight loss (> 5%), persistent vomiting, palpable epigastric mass, or new-onset symptoms at age ≥ 45–50 years",
            col3: "Urgent Upper GI Endoscopy (EGD) Referral—do not mask symptoms with prolonged empiric PPIs before scoping"
          }
        ],
        scope: {
          included: [
            "Filipino adults presenting with uninvestigated dyspepsia, typical Gastroesophageal Reflux Disease (GERD), NSAID-induced gastropathy, or Helicobacter pylori-associated Peptic Ulcer Disease."
          ],
          excluded: [
            { label: "Acute Upper GI Bleeding (Hematemesis / Melena / Coffee-Ground Emesis)", action: "Admit immediately, establish 2 large-bore IV lines, crossmatch blood, give IV PPI loading dose (Omeprazole/Pantoprazole 80 mg IV bolus, followed by 8 mg/hr infusion or 40 mg IV q12h), and refer for urgent EGD within 24 hours." },
            { label: "Perforated Peptic Ulcer", action: "Sudden, severe board-like abdominal rigidity with free air under the diaphragm on upright Chest/Abdominal X-ray—immediate NPO, IV resuscitation, broad-spectrum IV antibiotics, and emergency surgical repair." },
            { label: "Cardiac Mimics", action: "Always perform a 12-Lead ECG in patients with acute retrosternal/epigastric burning and cardiovascular risk factors to rule out Acute Coronary Syndrome." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Early Endoscopy (EGD) for Alarm Signs or Age ≥ 45–50 Years", detail: "Refer patients with any Alarm Feature or new-onset dyspepsia at age ≥ 45–50 years (lowered age cutoff in Asian/Philippine guidelines due to gastric cancer risk) for prompt Esophagogastroduodenoscopy (EGD)." },
            { title: "Non-Invasive H. pylori Test-and-Treat & 14-Day Quadruple Therapy", detail: "Use a \"Test-and-Treat\" strategy for H. pylori using non-invasive tests (¹³C-Urea Breath Test or Monoclonal Stool Antigen Test) in young patients (< 45 years) with uninvestigated dyspepsia and no alarm signs—do NOT use H. pylori serology (IgG) as it cannot distinguish active from past infection; avoid standard Clarithromycin triple therapy empirically in the Philippines due to high local H. pylori resistance (> 15%–20%); prescribe 14-day quadruple therapy instead." },
            { title: "Mandatory Test-of-Cure Timing", detail: "Perform a Test-of-Cure (Urea Breath Test or Stool Antigen) ≥ 4 weeks after completing antibiotics and ≥ 2 weeks after stopping PPIs to avoid false-negative results." }
          ],
          conditional: [
            { title: "Step-Down Therapy After 8 Weeks in Non-Erosive GERD", detail: "Stepping down long-term PPI therapy after 8 weeks in non-erosive GERD to on-demand PPI therapy or H2-Receptor Antagonist (Famotidine 20 mg BID) to minimize cost and long-term PPI side effects (enteric infections, B12/magnesium malabsorption)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Triage for Alarm Signs & Cardiac Causes", detail: "Screen for GI bleeding, dysphagia, weight loss, anemia, and NSAID/Aspirin/steroid use. Perform 12-lead ECG if chest/epigastric pain is atypical." },
            { step: "2. Manage Uncomplicated GERD (No Alarm Signs)", detail: "Start Omeprazole 20 mg OD (30–60 min before breakfast) for 8 weeks. Pair with targeted lifestyle measures: elevate head of bed by 6–8 inches (using wedges/blocks, not extra pillows), avoid lying down within 2–3 hours after dinner, weight loss if overweight, and smoking/alcohol cessation." },
            { step: "3. Manage Dyspepsia / PUD", detail: "If age ≥ 45–50 or Alarm Signs present → Refer for EGD (with gastric biopsy for H. pylori and malignancy exclusion—all gastric ulcers require repeat EGD at 8–12 weeks to confirm healing). If age < 45 and No Alarm Signs → Perform Urea Breath Test or Stool Antigen (patient must be off PPIs for ≥ 2 weeks and antibiotics/bismuth for ≥ 4 weeks). If positive, prescribe 14-day Bismuth Quadruple Therapy." }
          ]
        },
        practiceNotes: [
          { title: "Filipino Trigger Foods & Habits", detail: "Counsel patients to avoid late-night heavy meals, lying flat immediately after eating, spicy/acidic dishes (sinigang, sisig, heavy vinegar/suka dips), fried/fatty foods (lechon, chicharon), excessive 3-in-1 coffee, carbonated sodas, and self-medicating with OTC Mefenamic Acid or Ibuprofen for headaches/body pain." },
          { title: "Affordable Generic PPIs", detail: "Generic Omeprazole 20 mg capsules are inexpensive and included in the PhilHealth Konsulta primary care formulary—remind patients to take Omeprazole before breakfast, as taking it after meals or at bedtime sharply reduces acid suppression efficacy." }
        ],
        soapPlanSummary: [
          "Triage & Diagnostics: Screen for upper GI alarm features and age ≥ 45–50 yrs (refer for urgent EGD if present); perform 12-Lead ECG if atypical chest/epigastric pain; order Stool H. pylori Antigen or ¹³C-Urea Breath Test if < 45 yrs without alarm signs.",
          "Targeted Therapy: Uncomplicated GERD/PUD → Omeprazole 20 mg PO OD 30–60 min before breakfast for 4–8 weeks (stop offending NSAIDs); H. pylori Positive → 14-Day Bismuth Quadruple Therapy (avoid empiric Clarithromycin triple therapy).",
          "Lifestyle & Red Flags: Elevate head of bed 6–8 inches, avoid lying down within 2–3 hrs after meals, avoid sinigang/sisig/vinegar, fatty foods, 3-in-1 coffee, sodas, and OTC mefenamic acid; return immediately for melena, hematemesis, or dysphagia."
        ]
      },
      {
        id: "cpg-chronic-hepatitis-b",
        category: "Gastroenterology & Hepatology",
        title: "Chronic Hepatitis B (Adults & Pregnancy)",
        source: "HSP Clinical Practice Guidelines on the Management of Hepatitis B in the Philippines & WHO-Adapted DOH Viral Hepatitis Guidelines",
        intendedUsers: "Primary Care Physicians, Internists, Gastroenterologists/Hepatologists, OB-GYNs & RHU Clinicians",
        keywords: ["hepatitis b", "hbv", "hbsag", "tenofovir", "tdf", "entecavir", "taf", "cirrhosis", "hcc", "afp", "mtct", "hbig", "hsp", "viral hepatitis", "apri", "fib-4"],
        snapshot: [
          { parameter: "Diagnostic Definition", value: "Persistence of Hepatitis B Surface Antigen (HBsAg) for ≥ 6 months" },
          { parameter: "Core Baseline Panel", value: "HBsAg, Anti-HBs, Anti-HBc (Total), HBeAg, Anti-HBe, Quantitative HBV DNA (PCR), ALT/AST, CBC with Platelet Count, Serum Albumin, Bilirubin, PT/INR, Liver Ultrasound, and Fibrosis Assessment (APRI, FIB-4, or FibroScan)" },
          { parameter: "First-Line Antivirals", value: "High-genetic-barrier oral nucleos(t)ide analogues: Tenofovir Disoproxil Fumarate (TDF) 300 mg PO OD (1st-line in pregnancy & lamivudine-experienced) | Entecavir (ETV) 0.5 mg PO OD (1.0 mg OD if decompensated cirrhosis) (preferred if renal/bone disease) | Tenofovir Alafenamide (TAF) 25 mg PO OD (preferred if renal impairment/osteoporosis; avoid in decompensated cirrhosis)" },
          { parameter: "Immediate Treatment Triggers", value: "Any Cirrhosis (compensated or decompensated) with detectable HBV DNA—treat indefinitely regardless of ALT | Significant Fibrosis (≥ F2) with HBV DNA > 2,000 IU/mL regardless of ALT | Persistent ALT > 2× ULN (ULN: ~35 U/L men, ~25 U/L women) + HBV DNA > 2,000 IU/mL (HBeAg-negative) or > 20,000 IU/mL (HBeAg-positive)" },
          { parameter: "HCC Surveillance Rule", value: "Liver Ultrasound + Serum Alpha-Fetoprotein (AFP) EVERY 6 MONTHS lifelong for all cirrhotic patients, Asian men ≥ 40 yrs, Asian women ≥ 50 yrs, or family history of HCC" }
        ],
        scope: {
          included: [
            "Filipino adults (≥ 19 years) and pregnant women with chronic HBV infection across immune-tolerant, immune-active, inactive carrier, and cirrhotic phases."
          ],
          excluded: [
            { label: "Uncomplicated Acute Hepatitis B", action: "> 95% of immunocompetent adults clear HBsAg spontaneously with supportive care—do NOT start antivirals unless Acute Liver Failure / severe protracted hepatitis is present (INR > 1.5, total bilirubin > 3 mg/dL [or direct > 1.5 mg/dL], hepatic encephalopathy, or ascites)." },
            { label: "HIV / HBV Co-Infection", action: "Never treat HIV/HBV co-infected patients with single-drug TDF or Entecavir alone (induces HIV resistance)—initiate full 3-drug ART containing TDF + Lamivudine (3TC)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Universal Prenatal Screening & MTCT Prevention", detail: "Screen all pregnant women at their first prenatal visit for HBsAg; for HBsAg-positive pregnant women with HBV DNA > 200,000 IU/mL (or HBeAg-positive where HBV DNA testing is unavailable), initiate Tenofovir (TDF 300 mg OD) starting at 28–32 weeks AOG through delivery, PLUS administer Hepatitis B Birth Dose Vaccine + HBIG (0.5 mL IM) to the newborn within 12 hours of birth." },
            { title: "Pre-Immunosuppression Prophylaxis, Resistance Avoidance & Contact Vaccination", detail: "Test HBsAg and Anti-HBc before starting systemic corticosteroids, Rituximab, or cancer chemotherapy and initiate prophylactic TDF or Entecavir in HBsAg-positive patients to prevent fatal HBV reactivation; avoid Lamivudine (3TC) or Adefovir as first-line monotherapy due to very high drug resistance rates; vaccinate all susceptible household and sexual contacts (HBsAg-negative / Anti-HBs-negative) with the 3-dose Hepatitis B vaccine series (0, 1, 6 months)." }
          ],
          conditional: [
            { title: "Periodic Monitoring of Untreated Phases", detail: "Monitoring untreated HBsAg-positive patients not yet meeting treatment criteria (\"inactive carriers\" or \"immune-tolerant\") every 3–6 months with ALT and every 6–12 months with HBV DNA and fibrosis scores, as disease phase can reactivate over time." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Chronicity & Stage Fibrosis", detail: "Verify HBsAg positivity ≥ 6 months; calculate APRI or FIB-4 score and perform Liver Ultrasound (plus Transient Elastography / FibroScan if available)." },
            { step: "2. Screen for Co-Infections & Immunity", detail: "Order Anti-HCV, HIV screening, and Anti-HAV Total (vaccinate against Hepatitis A if non-immune to prevent acute-on-chronic liver failure)." },
            { step: "3. Initiate First-Line Antiviral (If Criteria Met)", detail: "Prescribe TDF 300 mg OD or Entecavir 0.5 mg OD (taken on an empty stomach, 2 hours before or after a meal). Check baseline Serum Creatinine/eGFR and Serum Phosphorus before starting TDF and monitor every 6–12 months." },
            { step: "4. Long-Term Monitoring & HCC Surveillance", detail: "Monitor ALT and HBV DNA every 3–6 months until virologically suppressed, then every 6–12 months. Enforce strict 6-monthly Liver Ultrasound + AFP for early Hepatocellular Carcinoma detection—even after HBV DNA becomes undetectable." }
          ]
        },
        practiceNotes: [
          { title: "Anti-Discrimination & Employment (DOLE / HSP Guidelines)", detail: "Under Philippine labor and HSP guidelines, asymptomatic HBsAg-positive workers with normal liver function and no cirrhosis are fit to work—employers cannot legally deny employment or terminate workers solely due to reactive HBsAg (except specific invasive exposure-prone healthcare roles with high viral load)." },
          { title: "Free Newborn Vaccination", detail: "The Hepatitis B birth dose vaccine (within 24 hours of birth) is provided 100% free in all Philippine government hospitals, RHUs, and birthing homes under the DOH Expanded Program on Immunization." }
        ],
        soapPlanSummary: [
          "Baseline Panel & Co-Infections: Order HBeAg, Anti-HBe, Quantitative HBV DNA (PCR), ALT/AST, CBC with Platelets, Albumin, Bilirubin, PT/INR, Liver Ultrasound (APRI/FIB-4), Anti-HCV, HIV screen, and Anti-HAV Total.",
          "Antiviral & MTCT Protocol: Start Tenofovir (TDF) 300 mg PO OD or Entecavir 0.5 mg PO OD if treatment criteria met (if pregnant with HBV DNA > 200,000 IU/mL or HBeAg+, start TDF 300 mg OD at 28–32 wks AOG + newborn HepB vaccine & HBIG within 12 hrs of birth).",
          "Surveillance & Family Protection: Enforce 6-monthly Liver Ultrasound + Serum AFP for HCC surveillance; vaccinate susceptible household/sexual contacts (0, 1, 6 mos) and counsel against alcohol/hepatotoxic supplements."
        ]
      },
      {
        id: "cpg-hiv-sti",
        category: "Pulmonary & Infectious",
        title: "HIV & Sexually Transmitted Infections (Syphilis, Gonorrhea, Chlamydia, Vaginitis)",
        source: "DOH AO 2022-0024 (Revised ART Guidelines), PSMID Opportunistic Infections CPG & DOH STI Management Guidelines",
        intendedUsers: "Primary Care Physicians, OB-GYNs, Infectious Disease Clinicians & Social Hygiene Clinic / HIV Treatment Hub Providers",
        keywords: ["hiv", "sti", "std", "syphilis", "gonorrhea", "chlamydia", "vaginitis", "candidiasis", "bacterial vaginosis", "trichomoniasis", "tld", "dolutegravir", "prep", "benzathine penicillin", "ceftriaxone", "rpr", "ra 11166", "ohat"],
        snapshotHeaders: ["Condition", "Diagnostic Confirmation", "First-Line Philippine Regimen"],
        snapshot: [
          {
            col1: "HIV-1 Infection (Adults & Adolescents ≥ 30 kg)",
            col2: "Rapid HIV Diagnostic Algorithm (rHIVda: 3 sequential reactive rapid tests)",
            col3: "Same-Day Rapid ART Initiation: TLD (Tenofovir 300 mg + Lamivudine 300 mg + Dolutegravir 50 mg) 1 tablet PO OD lifelong"
          },
          {
            col1: "Syphilis (Treponema pallidum)",
            col2: "Non-treponemal (RPR / VDRL) + Treponemal (TPPA / TPHA / Rapid Syphilis Test)",
            col3: "Early Syphilis (Primary, Secondary, Early Latent < 1 yr): Benzathine Penicillin G 2.4 million units IM single dose | Late Latent (> 1 yr or unknown duration): Benzathine Penicillin G 2.4 million units IM weekly × 3 weeks (7.2M units total)"
          },
          {
            col1: "Uncomplicated Gonorrhea & Chlamydia (Urethritis / Cervicitis)",
            col2: "Gram stain (intracellular Gram-negative diplococci) or NAAT/PCR (treat syndromically if testing unavailable)",
            col3: "Dual Therapy: Ceftriaxone 500 mg IM single dose (1 g if weight ≥ 150 kg) PLUS Doxycycline 100 mg PO BID for 7 days (or Azithromycin 1 g PO single dose if pregnant)"
          },
          {
            col1: "Vaginal Discharge Syndromes",
            col2: "Wet mount / KOH prep + vaginal pH (or syndromic evaluation)",
            col3: "Vulvovaginal Candidiasis: Fluconazole 150 mg PO single dose (avoid oral fluconazole in pregnancy—use Clotrimazole vaginal suppository/cream for 7 days) | Bacterial Vaginosis / Trichomoniasis: Metronidazole 500 mg PO BID for 7 days"
          }
        ],
        scope: {
          included: [
            "Filipino adolescents (≥ 15 years may consent independently for HIV testing under RA 11166) and adults presenting for HIV screening, antiretroviral therapy (ART), PrEP, or common bacterial/protozoal/fungal STIs."
          ],
          excluded: [
            { label: "HIV with Suspected TB or Cryptococcal Meningitis", action: "Do not start ART on Day 0 if meningitis symptoms are present (headache, neck stiffness, altered sensorium)—start TB or antifungal treatment first and delay ART by 4–6 weeks to prevent fatal IRIS. For non-meningeal Pulmonary TB, start anti-TB meds first and initiate ART within 2 weeks." },
            { label: "Pelvic Inflammatory Disease (PID)", action: "Lower abdominal pain + cervical motion/uterine/adnexal tenderness—escalate to Ceftriaxone 500 mg IM single dose + Doxycycline 100 mg BID + Metronidazole 500 mg BID for 14 days (admit if pregnant, tubo-ovarian abscess, or severe vomiting/fever)." },
            { label: "Neurosyphilis / Ocular Syphilis", action: "Visual/hearing loss, cranial nerve palsies, or meningitis—requires lumbar puncture and IV Aqueous Penicillin G (18–24 million units/day for 10–14 days)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Same-Day ART (U=U) & Universal HIV/Syphilis Co-Screening", detail: "Initiate TLD on the same day of confirmed HIV diagnosis regardless of CD4 count or clinical stage (Undetectable = Untransmittable [U=U]); screen EVERY STI patient for HIV and Syphilis (and vice versa)." },
            { title: "Benzathine Penicillin G in Pregnancy & Partner Treatment", detail: "Benzathine Penicillin G is the ONLY proven effective treatment for Syphilis in Pregnancy—if a pregnant woman is penicillin-allergic, she must undergo penicillin desensitization (do not substitute Doxycycline or Azithromycin in pregnancy); treat all sexual partners within the past 60 days for Gonorrhea/Chlamydia/Trichomoniasis and within 90 days to 1 year for Syphilis, and instruct sexual abstinence for 7 days until both patient and partners complete therapy." }
          ],
          conditional: [
            { title: "Oral HIV Pre-Exposure Prophylaxis (PrEP)", detail: "Offering Oral HIV Pre-Exposure Prophylaxis (PrEP: TDF/FTC 300/200 mg OD or Event-Driven 2-1-1) to HIV-negative individuals at substantial ongoing risk (serodiscordant couples, MSM/transgender women, sex workers, people who inject drugs)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Pre-ART Baseline Workup (Do Not Delay TLD While Waiting for Results)", detail: "Screen clinically for Tuberculosis (4-symptom screen: cough, fever, night sweats, weight loss + Chest X-ray). Order CD4 Count, Serum Creatinine/eGFR, HBsAg, Anti-HCV, RPR/Syphilis test, CBC, and ALT. If CD4 < 200 cells/mm³, start Cotrimoxazole (TMP-SMX 800/160 mg 1 tab OD) prophylaxis against Pneumocystis pneumonia (PCP) and toxoplasmosis; if CD4 < 100, screen serum Cryptococcal Antigen (CrAg)." },
            { step: "2. Initiate Same-Day TLD & Adherence Counseling", detail: "Start TLD (TDF/3TC/DTG) 1 tablet once daily. Counsel women of childbearing potential on folate supplementation (400–800 mcg/day) and contraception options. Schedule clinical follow-up at Weeks 2, 4, 8, and 12, then every 6 months with multi-month dispensing (MMD) once stable." },
            { step: "3. Virologic Monitoring", detail: "Order HIV Viral Load (VL) at 6 months after ART initiation, then at 12 months, and annually thereafter. Target: < 50 copies/mL (undetectable); > 1,000 copies/mL on 2 consecutive tests (3 months apart with adherence support) defines virologic failure requiring resistance testing and second-line switch." }
          ]
        },
        practiceNotes: [
          { title: "Confidentiality & Legal Protection (RA 11166)", detail: "Under the Philippine HIV and AIDS Policy Act (RA 11166), HIV status is strictly confidential—disclosure without written patient consent is a criminal offense. Minors aged 15–17 years can legally consent to HIV testing without parental consent." },
          { title: "Free Treatment Hubs & OHAT Package", detail: "HIV testing, TLD antiretroviral therapy, viral load/CD4 monitoring, PrEP, and Benzathine Penicillin for syphilis are provided 100% free at DOH-accredited HIV Treatment Hubs, Primary HIV Care Clinics, and Local Social Hygiene Clinics (SHCs), supported by the PhilHealth Outpatient HIV/AIDS Treatment (OHAT) Package." }
        ],
        soapPlanSummary: [
          "Screening & Baseline Workup: Screen for HIV, Syphilis (RPR/TPPA), HBsAg, Anti-HCV, and 4-symptom TB screen + Chest X-Ray (plus CD4 Count, Serum Creatinine/eGFR, CBC, and ALT if HIV-reactive).",
          "Targeted Regimen: HIV-1 → Same-day TLD (TDF 300 mg + 3TC 300 mg + DTG 50 mg) 1 tab PO OD (defer 2–6 wks if active TB/cryptococcal meningitis); Uncomplicated Gonorrhea/Chlamydia → Ceftriaxone 500 mg IM single dose + Doxycycline 100 mg PO BID × 7 days; Early Syphilis → Benzathine Penicillin G 2.4M units IM single dose.",
          "Partner Management & Confidentiality: Notify and treat sexual partners (past 60 days for GC/CT/TV; 90 days–1 yr for Syphilis), advise 7-day abstinence, maintain strict RA 11166 confidentiality, and link to DOH Treatment Hub / Social Hygiene Clinic."
        ]
      },
      {
        id: "cpg-copd-adults",
        category: "Pulmonary & Infectious",
        title: "Chronic Obstructive Pulmonary Disease (COPD)",
        source: "PCCP Clinical Practice Guidelines on COPD & GOLD-Adapted Philippine Respiratory Protocols",
        intendedUsers: "Primary Care Physicians, Internists, Pulmonologists, Emergency & RHU Clinicians",
        keywords: ["copd", "chronic obstructive pulmonary disease", "gold abe", "spirometry", "fev1", "fvc", "laba", "lama", "tiotropium", "aecopd", "pccp", "biomass", "emphysema", "chronic bronchitis"],
        snapshot: [
          { parameter: "Mandatory Diagnostic Cutoff", value: "Post-Bronchodilator Spirometry: FEV₁/FVC < 0.70 (confirms persistent airflow limitation) in a patient with dyspnea, chronic cough/sputum, and exposure history (tobacco/vape or biomass fuel smoke)" },
          { parameter: "GOLD ABE Initial Therapy", value: "Group A (Low symptoms: mMRC 0–1 / CAT < 10; 0–1 moderate exacerbation, no hospitalization): Single Bronchodilator (LABA or LAMA preferred over SABA/SAMA) | Group B (High symptoms: mMRC ≥ 2 / CAT ≥ 10; 0–1 moderate exacerbation): Dual Bronchodilator (LABA + LAMA) (e.g., Tiotropium/Olodaterol or Indacaterol/Glycopyrronium) | Group E (≥ 2 moderate exacerbations OR ≥ 1 hospitalization): LABA + LAMA (add ICS [Triple Therapy: LABA + LAMA + ICS] if blood eosinophils ≥ 300 cells/μL)" },
          { parameter: "Acute Exacerbation (AECOPD)", value: "Short-Acting Bronchodilators (Salbutamol ± Ipratropium via MDI+spacer or nebulizer) + Oral Prednisone 40 mg OD for 5 days + Antibiotics for 5–7 days (if increased sputum purulence + increased dyspnea/volume)" },
          { parameter: "Target Oxygen Saturation", value: "Controlled Oxygen Therapy: Titrate via Venturi mask or nasal cannula to maintain SpO₂ 88%–92% (avoid high-flow O₂ that worsens hypercapnic acidosis)" }
        ],
        scope: {
          included: [
            "Filipino adults (typically ≥ 40 years) with smoking history (≥ 10 pack-years) or prolonged indoor biomass/wood-stove cooking exposure presenting with stable COPD or acute exacerbations."
          ],
          excluded: [
            { label: "Bronchial Asthma (Pure)", action: "Onset typically in childhood/young adulthood, marked symptom variability, and significant post-bronchodilator reversibility—requires Inhaled Corticosteroids (ICS) as mandatory foundation (whereas ICS monotherapy is contraindicated in COPD due to pneumonia risk)." },
            { label: "Active Pulmonary Tuberculosis (PTB) or Lung Cancer", action: "Always obtain a baseline Chest X-ray (and sputum Xpert MTB/RIF if cough ≥ 2 weeks or weight loss/hemoptysis) before diagnosing COPD in the Philippines." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Smoking & Vaping Cessation", detail: "Mandatory first-line intervention at every consultation—counseling plus pharmacotherapy (Varenicline, Nicotine Replacement Therapy, or Bupropion) is the most effective measure to slow FEV₁ decline." },
            { title: "Steroid Stewardship & 5-Day AECOPD Course", detail: "Never prescribe long-term daily oral steroids for stable COPD; limit acute exacerbation steroids to Oral Prednisone 40 mg/day for 5 days (non-inferior to 14-day courses and minimizes hyperglycemia/infection)." },
            { title: "Core Respiratory Vaccinations", detail: "Administer Annual Influenza, Pneumococcal (PCV13/PPSV23 or PCV20), COVID-19, and Tdap vaccines to all COPD patients." }
          ],
          conditional: [
            { title: "Pulmonary Rehabilitation Referral", detail: "Referring symptomatic patients (mMRC ≥ 2) to formal Pulmonary Rehabilitation (6–8 weeks of supervised exercise training and breathing techniques), balanced against facility availability and travel cost." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Diagnosis & Rule Out PTB/Heart Failure", detail: "Perform Post-Bronchodilator Spirometry, Chest X-ray, CBC (check blood eosinophil count to guide ICS decisions), pulse oximetry, and 12-lead ECG." },
            { step: "2. Classify (GOLD ABE) & Initiate Maintenance Inhalers", detail: "Start LABA + LAMA (or single LAMA like Tiotropium if Group A/budget-constrained). Add ICS (e.g., Budesonide or Fluticasone) ONLY if Group E with blood eosinophils ≥ 300 cells/μL (or ≥ 100 with persistent exacerbations) or coexisting Asthma-COPD Overlap. Verify Inhaler Technique (pMDI + spacer vs. dry powder inhaler) at every visit." },
            { step: "3. Manage Acute Exacerbation (AECOPD)", detail: "Outpatient: Nebulized/MDI Salbutamol + Ipratropium, Prednisone 40 mg OD × 5 days, and Co-amoxiclav 625 mg TID (or Azithromycin/Doxycycline) × 5 days if purulent sputum is present. Red Flags for Immediate ER Admission: Severe resting dyspnea, confusion/drowsiness (CO₂ narcosis), cyanosis, SpO₂ < 88% on room air, accessory muscle fatigue, or acute heart failure/arrhythmia (needs ABG and Non-Invasive Ventilation [BiPAP])." }
          ]
        },
        practiceNotes: [
          { title: "Biomass Smoke (\"Uling/Kahoy\") Exposure", detail: "Many non-smoking Filipino women—especially in rural provinces—develop COPD from years of cooking over wood or charcoal stoves; explicitly counsel switching to cleaner cooking fuels (LPG/electric) and improving kitchen ventilation." },
          { title: "Cost-Conscious Inhaler Selection", detail: "Dual LABA/LAMA combination inhalers can be expensive out-of-pocket; when cost is a barrier, Ipratropium/Salbutamol MDI with a spacer or generic Tiotropium provides reliable symptom relief." }
        ],
        soapPlanSummary: [
          "Diagnostics & Exclusion: Confirm with Post-Bronchodilator Spirometry (FEV₁/FVC < 0.70); obtain Chest X-Ray (and sputum GeneXpert MTB/RIF if cough ≥ 2 wks), CBC with eosinophil count, SpO₂, and 12-Lead ECG.",
          "Maintenance & Exacerbation Therapy: Classify GOLD ABE → Start LABA + LAMA (or LAMA monotherapy; add ICS only if Group E with eosinophils ≥ 300 cells/μL); for acute exacerbation, give Salbutamol + Ipratropium, Oral Prednisone 40 mg OD × 5 days, and antibiotic if purulent sputum.",
          "Prevention & Environmental Counseling: Mandatory smoking/vaping cessation, transition away from indoor wood/charcoal (uling/kahoy) cooking smoke, verify MDI + spacer technique, and administer Influenza & Pneumococcal vaccines."
        ]
      },
      {
        id: "cpg-acs-stemi-nstemi",
        category: "Cardiovascular",
        title: "Acute Coronary Syndrome (STEMI, NSTEMI & Unstable Angina)",
        source: "PHA Clinical Practice Guidelines on Acute Coronary Syndrome & PhilHealth Z-Benefit / Acute MI Case Rate Protocols",
        intendedUsers: "Emergency Physicians, Primary Care Physicians, Internists, Cardiologists & Ambulance/Triage Providers",
        keywords: ["acs", "acute coronary syndrome", "stemi", "nstemi", "unstable angina", "chest pain", "troponin", "ecg", "aspirin", "ticagrelor", "clopidogrel", "tenecteplase", "streptokinase", "pci", "pha", "myocardial infarction"],
        snapshot: [
          { parameter: "Mandatory 10-Minute Rule", value: "Obtain and interpret a 12-Lead ECG within ≤ 10 minutes of arrival for any patient with acute chest pain/pressure, epigastric discomfort, unexplained dyspnea, or diaphoresis" },
          { parameter: "STEMI ECG Criteria", value: "New ST-segment elevation at the J-point in ≥ 2 contiguous leads: ≥ 2 mm (V₂–V₃ men ≥ 40 yrs; ≥ 2.5 mm men < 40 yrs; ≥ 1.5 mm women) or ≥ 1 mm in other leads—or new LBBB/posterior MI (V₁–V₃ ST depression + tall R waves)" },
          { parameter: "Immediate Loading (\"MONA-B\" Updated)", value: "Aspirin: 160–325 mg chewed immediately (non-enteric coated) | P2Y12 Inhibitor: Ticagrelor 180 mg (preferred if PCI-capable) OR Clopidogrel 300–600 mg (300 mg if fibrinolysis; 75 mg if age > 75 receiving fibrinolysis) | High-Intensity Statin: Atorvastatin 80 mg or Rosuvastatin 40 mg STAT | Anticoagulation: Enoxaparin (30 mg IV bolus + 1 mg/kg SC q12h) or Unfractionated Heparin (UFH)" },
          { parameter: "STEMI Reperfusion Targets", value: "Primary PCI (Preferred): Door-to-Balloon ≤ 90 minutes (or ≤ 120 min if transferring from non-PCI hospital) | Fibrinolysis (If PCI > 120 min away): Door-to-Needle ≤ 30 minutes using Tenecteplase (TNK), Alteplase, or Streptokinase" }
        ],
        scope: {
          included: [
            "Filipino adults presenting within 12–24 hours of acute myocardial ischemia: ST-Elevation Myocardial Infarction (STEMI), Non-ST-Elevation Myocardial Infarction (NSTEMI), and Unstable Angina (UA)."
          ],
          excluded: [
            { label: "Acute Aortic Dissection (Critical Contraindication to Thrombolysis/Anticoagulants)", action: "Tearing interscapular back pain, blood pressure differential > 20 mm Hg between arms, or widened mediastinum on Chest X-ray—perform urgent CT Aortogram; NEVER give fibrinolytics or heparin." },
            { label: "Right Ventricular Infarction (V₄R ST Elevation in Inferior STEMI)", action: "Strictly avoid Nitrates (Nitroglycerin) and Morphine, which drop preload and cause catastrophic hypotension—treat hypotension with 0.9% NaCl IV fluid boluses." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Activate STEMI Reperfusion Immediately Without Waiting for Troponin", detail: "Never wait for Cardiac Troponin results to activate STEMI reperfusion—STEMI is a clinical + 12-lead ECG diagnosis; do NOT administer Fibrinolytics (Tenecteplase/Streptokinase) in NSTEMI or Unstable Angina (increases mortality and intracranial hemorrhage without benefit)." },
            { title: "Targeted Oxygen Stewardship", detail: "Do NOT give routine supplemental Oxygen if SpO₂ ≥ 90% (hyperoxia causes coronary vasoconstriction and increases infarct size)." },
            { title: "5 Core Post-ACS Secondary Prevention Medications", detail: "Discharge all post-ACS patients on: (1) Dual Antiplatelet Therapy (DAPT) for 12 months (Aspirin 80–100 mg + Ticagrelor/Clopidogrel), (2) High-Intensity Statin, (3) Beta-Blocker, (4) ACEi or ARB (especially if LVEF ≤ 40%, HTN, DM, or CKD), and (5) Sublingual Nitroglycerin PRN." }
          ],
          conditional: [
            { title: "Early Invasive Strategy in High-Risk NSTEMI", detail: "Routine early invasive coronary angiography within 24 hours for high-risk NSTEMI patients (GRACE score > 140, dynamic ST changes, or rising High-Sensitivity Troponin), balanced against cath-lab transfer availability." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. 0–10 Minutes (Triage & ECG)", detail: "Establish 2 IV lines, attach continuous cardiac monitor + defibrillator pads, record 12-Lead ECG (add right-sided V₄R and posterior V₇–V₉ leads if inferior MI or isolated V₁–V₃ ST depression), and draw High-Sensitivity Troponin, CBC, Creatinine, Electrolytes, PT/PTT, and Lipid Profile." },
            { step: "2. Immediate Anti-Ischemic & Antithrombotic Therapy", detail: "Chew Aspirin 160–325 mg + load Clopidogrel or Ticagrelor + give Atorvastatin 80 mg. Give Sublingual Nitroglycerin 0.4 mg every 5 min (max 3 doses) for ongoing ischemic pain ONLY if SBP > 90 mm Hg and no Inferior/RV infarct or recent PDE-5 inhibitor (Sildenafil/Tadalafil) use." },
            { step: "3. Execute Reperfusion (STEMI within 12 Hours of Symptom Onset)", detail: "At a PCI-Capable Hospital: Activate Cath Lab immediately for Primary PCI. At a Non-PCI Hospital / Clinic: If transfer to a PCI center will take > 120 minutes, screen for fibrinolytic contraindications (prior intracranial hemorrhage, ischemic stroke < 3 mos, active bleeding, severe uncontrolled BP > 180/110) and administer IV Tenecteplase (weight-adjusted single bolus) or IV Streptokinase (1.5 million units over 30–60 min), then transfer immediately for pharmaco-invasive angiography within 2–24 hours." }
          ]
        },
        practiceNotes: [
          { title: "Geographic Transfer Reality", detail: "Outside Metro Manila, Cebu, Davao, and major regional medical centers, traffic and island geography frequently delay Primary PCI beyond 120 minutes—timely fibrinolysis at the first emergency hospital saves lives and should never be withheld waiting for inter-island/long-distance transfer." },
          { title: "PhilHealth Z-Benefit & Case Rates", detail: "PhilHealth provides a dedicated Z-Benefit Package for Coronary Artery Bypass Graft (CABG) and inpatient packages for Acute Myocardial Infarction and Percutaneous Coronary Intervention (PCI) at accredited cardiac centers." }
        ],
        soapPlanSummary: [
          "Emergency Triage (≤ 10 Min): Obtain stat 12-Lead ECG (add V₄R and V₇–V₉ if inferior/posterior MI suspected); draw High-Sensitivity Troponin, CBC, Creatinine, Electrolytes, PT/PTT, and Lipid Profile.",
          "Acute Loading: Chew Aspirin 160–325 mg + P2Y12 inhibitor (Ticagrelor 180 mg or Clopidogrel 300–600 mg) + Atorvastatin 80 mg STAT + Anticoagulation (Enoxaparin/UFH); give O₂ only if SpO₂ < 90% and avoid Nitrates if Inferior/RV infarct or SBP ≤ 90 mmHg.",
          "Reperfusion & Transfer: Activate Primary PCI (Door-to-Balloon ≤ 90 min) or administer IV Fibrinolysis (Door-to-Needle ≤ 30 min if STEMI and PCI transfer > 120 min away) and transfer immediately to a PCI-capable cardiac center."
        ]
      },
      {
        id: "cpg-ida-vs-thalassemia",
        category: "Hematology",
        title: "Iron Deficiency Anemia (IDA) vs. Thalassemia Trait",
        source: "PSHBT Clinical Practice Guidelines on Iron Deficiency Anemia & DOH Maternal/Pediatric Micronutrient Protocols",
        intendedUsers: "Primary Care Physicians, Pediatricians, OB-GYNs, Internists & RHU Clinicians",
        keywords: ["anemia", "iron deficiency anemia", "ida", "thalassemia", "thalassemia trait", "mentzer index", "ferritin", "mcv", "microcytic", "ferrous sulfate", "hemoglobin electrophoresis", "pshbt"],
        snapshotHeaders: ["Parameter", "Iron Deficiency Anemia (IDA)", "Thalassemia Trait (α- or β-Minor)"],
        snapshot: [
          {
            col1: "Hemoglobin Cutoff (WHO)",
            col2: "Men: < 13.0 g/dL | Non-pregnant Women: < 12.0 g/dL | Pregnant Women: < 11.0 g/dL | Children 6–59 mos: < 11.0 g/dL",
            col3: "Mildly reduced or borderline normal (Hb 10.0–12.5 g/dL)"
          },
          {
            col1: "RBC Indices (MCV / RDW / RBC Count)",
            col2: "Low MCV (< 80 fL) | Elevated RDW (> 14.5% — anisocytosis) | Low RBC Count (< 4.5 million/μL) | Mentzer Index (MCV ÷ RBC) > 13",
            col3: "Markedly Low MCV (60–75 fL — out of proportion to mild anemia) | Normal/Near-Normal RDW (≤ 14.0%) | Normal or High RBC Count (> 5.0 million/μL) | Mentzer Index (MCV ÷ RBC) < 13"
          },
          {
            col1: "Confirmatory Lab Test",
            col2: "Serum Ferritin < 30 ng/mL (or < 100 ng/mL if chronic inflammation/infection present) + Low Transferrin Saturation (< 20%)",
            col3: "Normal/Elevated Serum Ferritin + Hemoglobin Electrophoresis / HPLC (HbA₂ > 3.5% in β-thalassemia trait; normal HbA₂ + genetic test for α-thalassemia trait)"
          },
          {
            col1: "First-Line Treatment",
            col2: "Oral Elemental Iron: Adults: 60–120 mg elemental iron/day (single daily or alternate-day dosing) for 3–6 months after Hb normalizes | Children: 3–6 mg/kg/day elemental iron",
            col3: "NO IRON THERAPY (unless concurrent confirmed IDA is also present); prescribe Folic Acid 1–5 mg OD + genetic/partner counseling"
          }
        ],
        scope: {
          included: [
            "Filipino infants, children, adolescents, pregnant women, and adults presenting with microcytic, hypochromic anemia (MCV < 80 fL, MCH < 27 pg) in primary care."
          ],
          excluded: [
            { label: "Symptomatic Severe Anemia / Hemodynamic Instability (Hb < 7.0 g/dL)", action: "Tachycardia, dyspnea, angina, or heart failure—admit for Packed RBC transfusion (slowly, 1 unit at a time, with Furosemide cover if cardiac/elderly)." },
            { label: "Unexplained IDA in Men or Postmenopausal Women (or Adults ≥ 45–50 yrs)", action: "Mandatory bidirectional endoscopy (EGD + Colonoscopy) to rule out occult gastrointestinal malignancy (colon/gastric cancer) or bleeding peptic ulcer—never treat with iron alone without finding the bleeding source." },
            { label: "Thalassemia Major / Hemoglobin H Disease", action: "Severe transfusion-dependent hemolytic anemia with hepatosplenomegaly and bone deformities—refer to a hematologist for chronic transfusion and iron chelation therapy." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Confirm Iron Deficiency Before Prolonged Oral Iron", detail: "Never prescribe prolonged oral iron without confirming iron deficiency (via Serum Ferritin or Mentzer Index/CBC indices) in Filipinos with microcytosis—Thalassemia trait is highly prevalent in the Philippines, and inappropriate iron causes secondary hepatic/cardiac iron overload." },
            { title: "Investigate Underlying Bleeding / Etiology", detail: "Investigate the underlying cause of IDA in every patient: Heavy menstrual bleeding (AUB) and pregnancy in reproductive-age women; hookworm/trichuris parasitism and cow's milk excess/poor complementary feeding in children; occult GI blood loss in men and older adults." },
            { title: "Single Daily or Alternate-Day Oral Iron Dosing", detail: "Use single daily or alternate-day dosing of oral iron (e.g., Ferrous Sulfate 325 mg [65 mg elemental iron] once daily or every other day) rather than TID dosing—hepcidin spikes after each dose block absorption of subsequent same-day doses and increase GI side effects." }
          ],
          conditional: [
            { title: "Intravenous (IV) Iron Switch", detail: "Switching to Intravenous (IV) Iron (e.g., Iron Sucrose or Ferric Carboxymaltose) when oral iron fails after 4 weeks due to severe GI intolerance, malabsorption (IBD/post-gastrectomy), CKD, or late 2nd/3rd trimester pregnancy requiring rapid Hb correction." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Screen CBC & Calculate Mentzer Index", detail: "Look at MCV, RBC count, and RDW. Calculate Mentzer Index = MCV ÷ RBC count (in millions) (> 13 favors IDA; < 13 favors Thalassemia Trait)." },
            { step: "2. Confirm Iron Stores & Rule Out Local Causes", detail: "Order Serum Ferritin (plus CRP if inflammation suspected), Direct Fecal Smear / Occult Blood, and Urinalysis. If Ferritin is normal/elevated with microcytosis → order Hemoglobin Electrophoresis / HPLC to confirm Thalassemia trait." },
            { step: "3. Treat Confirmed IDA & Verify Response", detail: "Give Ferrous Sulfate (65 mg elemental iron) OD or every other day on an empty stomach with water or Vitamin C (calamansi/orange juice)—avoid taking within 2 hours of coffee, tea, milk, calcium, or antacids. 4-Week Response Check: Repeat CBC at 4 weeks—hemoglobin should rise by ≥ 1.0–2.0 g/dL. Continue iron for 3 full months AFTER hemoglobin normalizes to replenish bone marrow ferritin stores (Ferritin > 50 ng/mL)." }
          ]
        },
        practiceNotes: [
          { title: "Pre-Marital / Reproductive Counseling for Thalassemia Carriers", detail: "When a Filipino patient is diagnosed with Thalassemia Trait, always recommend testing their partner—if both partners carry β-thalassemia or α⁰-thalassemia trait, each pregnancy has a 25% risk of severe Thalassemia Major or Hydrops Fetalis." },
          { title: "Free DOH Micronutrients", detail: "Ferrous Sulfate + Folic Acid tablets (for pregnant/postpartum women) and Iron drops/syrup (for infants/children) are provided 100% free at all Barangay Health Stations and RHUs." }
        ],
        soapPlanSummary: [
          "Diagnostics & Differentiation: Calculate Mentzer Index (MCV ÷ RBC); order Serum Ferritin (+ CRP), Direct Fecal Smear / FOBT, and Urinalysis (order Hemoglobin Electrophoresis / HPLC if Ferritin is normal/elevated to confirm Thalassemia Trait; refer for EGD + Colonoscopy if unexplained IDA in men or postmenopausal adults ≥ 45–50 yrs).",
          "Targeted Therapy: Confirmed IDA → Oral Ferrous Sulfate (65 mg elemental iron) OD or alternate-day on empty stomach with water/Vitamin C (avoid coffee/tea/milk/calcium/antacids within 2 hrs); Thalassemia Trait → Avoid iron overload, give Folic Acid 1–5 mg OD + partner carrier screening.",
          "Monitoring & Follow-Up: Repeat CBC in 4 weeks (expect Hb rise ≥ 1.0–2.0 g/dL) and continue oral iron for 3 full months after Hb normalizes to replenish marrow stores."
        ]
      },
      {
        id: "cpg-cancer-screening-adults",
        category: "Oncology & Preventive Care",
        title: "PCOS, Abnormal Uterine Bleeding (AUB) & Adult Cancer Screening (Breast, Cervical & Colorectal)",
        source: "POGS / DOH Philippine Periodic Health Examination (PHEX) / PSG CPGs on PCOS, AUB & Adult Cancer Screening",
        intendedUsers: "Primary Care Physicians, Family Medicine Clinicians, OB-GYNs, Internists & RHU Providers",
        keywords: ["pcos", "polycystic ovary syndrome", "aub", "abnormal uterine bleeding", "letrozole", "tranexamic acid", "rotterdam", "cancer screening", "breast cancer", "cervical cancer", "colorectal cancer", "crc", "mammography", "mammogram", "cbe", "hpv dna", "via", "pap smear", "fit", "colonoscopy", "phex", "bi-rads", "pogs", "psg"],
        snapshotHeaders: ["Condition / Cancer Type", "Target Population & Diagnostic Criteria", "First-Line Philippine Screening & Management"],
        snapshot: [
          {
            col1: "PCOS & Abnormal Uterine Bleeding (AUB)",
            col2: "PCOS: Rotterdam Criteria (≥ 2 of 3: oligo/anovulation, hyperandrogenism, polycystic ovaries on TVUS) | AUB (PALM-COEIN): Always rule out pregnancy (β-hCG) first; Endometrial Biopsy if age ≥ 45 yrs or unopposed estrogen",
            col3: "PCOS (not conceiving): Lifestyle (5%–10% wt loss) + COCPs (or cyclic MPA) + Metformin if IR | PCOS (conceiving): Letrozole 2.5–5 mg Cycle Days 3–7 | Stable AUB: Tranexamic Acid 1–1.3 g TID or Mefenamic Acid 500 mg TID or COCP/LNG-IUD"
          },
          {
            col1: "Breast & Cervical Cancer Screening",
            col2: "Breast: Average-risk women aged 50–69 yrs (shared decision at 40–49) | Cervical: Women aged 21–65 yrs",
            col3: "Breast: Biennial Screening Mammography + Annual CBE | Cervical (30–65 yrs): Primary HPV DNA q5y, VIA q3–5y at RHUs, or Pap Smear q3y (Ages 21–29: Pap Smear q3y)"
          },
          {
            col1: "Colorectal, Lung & Liver (HCC) Screening",
            col2: "Colorectal: Adults 50–75 yrs | Lung: Ages 50–80 with ≥ 20 pack-yr smoking | Liver: Chronic HBV or Cirrhosis",
            col3: "Colorectal: Annual FIT or Colonoscopy q10y (positive FIT mandates Colonoscopy) | Lung: Annual Low-Dose Chest CT | Liver: Ultrasound + AFP q6mos"
          }
        ],
        scope: {
          included: [
            "Filipino women with suspected Polycystic Ovary Syndrome (PCOS) or Abnormal Uterine Bleeding (AUB), and average-risk Filipino adults presenting for routine DOH PHEX cancer screening."
          ],
          excluded: [
            { label: "Breast Red Flags (Diagnostic Workup Required)", action: "Palpable dominant breast mass, skin dimpling (peau d'orange), nipple retraction, bloody nipple discharge, or axillary lymphadenopathy—refer immediately for Diagnostic Mammogram + Breast Ultrasound + Core Needle Biopsy." },
            { label: "Cervical / Endometrial Red Flags (Diagnostic Workup Required)", action: "ANY postmenopausal vaginal bleeding, post-coital bleeding, or visible cervical lesion—refer immediately for TVUS, Endometrial Biopsy, and Colposcopy." },
            { label: "Colorectal Red Flags (Diagnostic Workup Required)", action: "Rectal bleeding/hematochezia, unexplained iron-deficiency anemia, persistent change in bowel habits (> 4 weeks), or unintentional weight loss—refer directly for Diagnostic Colonoscopy (do not do FIT)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "PCOS Metabolic Workup & First-Line Letrozole for Ovulation Induction", detail: "Screen all PCOS patients with a 75g 2-hour OGTT and Fasting Lipid Profile; prescribeCOCPs for cycle regulation/endometrial protection if not attempting conception, and Letrozole (superior live-birth rate over Clomiphene) if attempting conception." },
            { title: "Cervical Cancer Screening & Primary HPV Vaccination", detail: "Screen women aged 30–65 with HPV DNA testing or VIA; administer HPV Vaccination to girls aged 9–14 years (2-dose schedule at 0 and 6 months) as primary prevention." },
            { title: "Colorectal Cancer Screening & Positive FIT Rule", detail: "Screen adults aged 50–75 using annual FIT or colonoscopy every 10 years; never repeat a positive FIT—every positive FIT mandates a diagnostic colonoscopy." }
          ],
          conditional: [
            { title: "Mammography at Ages 40–49 & CBE in Low-Resource Settings", detail: "Screening mammography for women aged 40–49 years via shared decision-making; using Clinical Breast Exam (CBE) in rural areas where mammography is inaccessible." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Evaluate PCOS & AUB Systematically (PALM-COEIN)", detail: "Order Urine/Serum β-hCG first in any reproductive-age woman with AUB, followed by CBC, TSH, and Transvaginal Ultrasound. Perform Endometrial Biopsy in women ≥ 45 years or younger women with unopposed estrogen/PCOS and persistent AUB." },
            { step: "2. Execute Age-Appropriate DOH PHEX Cancer Screening", detail: "Women 21–29: Pap Smear q3y. Women 30–65: HPV DNA test q5y or VIA q3–5y. Women 50–69: CBE + Biennial Mammogram. Adults 50–75: Annual quantitative FIT (if positive → Diagnostic Colonoscopy). Chronic HBV/Cirrhosis: Liver Ultrasound + AFP q6mos." },
            { step: "3. Link Abnormal Screens to Definitive Biopsy & PhilHealth Z-Benefits", detail: "Positive FIT → Colonoscopy; BI-RADS 4/5 → Core Needle Biopsy; Positive VIA or HPV 16/18 → Colposcopy or thermal ablation/cryotherapy." }
          ]
        },
        practiceNotes: [
          { title: "Free RHU Screening & HPV Immunization", detail: "VIA cervical screening, Clinical Breast Exams, and school-based/RHU HPV vaccines (for girls aged 9–14) are provided free at DOH-accredited RHUs and government hospitals." },
          { title: "PhilHealth Konsulta & Z-Benefit Packages", detail: "Confirmed Breast, Cervical, and Colorectal Cancers qualify for comprehensive PhilHealth Z-Benefit Packages and DOH Cancer Assistance Fund (CAF) access sites." }
        ],
        soapPlanSummary: [
          "PCOS / AUB Workup & Therapy: Rule out pregnancy (β-hCG); order CBC, TSH, TVUS, and 75g OGTT; treat PCOS with lifestyle + COCPs (or Letrozole if conceiving) and stable AUB with Tranexamic Acid 1 g TID or Mefenamic Acid 500 mg TID.",
          "Age-Appropriate Cancer Screening: Breast (Women 50–69: Biennial Mammogram + CBE) | Cervical (Women 30–65: HPV DNA q5y or VIA q3–5y; 21–29: Pap q3y) | Colorectal (Adults 50–75: Annual FIT or Colonoscopy q10y).",
          "Diagnostic Escalation Rule: Refer immediately for Endometrial Biopsy if postmenopausal bleeding or AUB ≥ 45 yrs, Core Biopsy if BI-RADS 4/5, and Colonoscopy for any positive FIT."
        ]
      },
      {
        id: "cpg-measles-rubeola",
        category: "Pediatrics",
        title: "Measles (Rubeola)",
        source: "PIDSP / PPS Clinical Practice Guidelines on Measles & DOH Measles Elimination and Outbreak Response Guidelines",
        intendedUsers: "Pediatricians, Primary Care Physicians, Emergency Clinicians & Rural Health Unit (RHU) Providers",
        keywords: ["measles", "rubeola", "koplik", "vitamin a", "mmr", "mcv", "maculopapular rash", "3 cs", "coryza", "conjunctivitis", "pidsp", "pps", "xerophthalmia", "ra 11332"],
        snapshot: [
          { parameter: "Suspected Case Definition (DOH)", value: "Any person with Fever (≥ 38°C) + Generalized Maculopapular (non-vesicular) Rash + at least ONE of the \"3 Cs\": Cough, Coryza (runny nose), or Conjunctivitis (red eyes)" },
          { parameter: "Pathognomonic Sign", value: "Koplik Spots (tiny bluish-white \"grains of sand\" on an erythematous base on the buccal mucosa opposite the lower molars—appear 1–2 days before rash)" },
          { parameter: "Rash Progression", value: "Starts on the face and hairline / behind the ears, spreads cephalocaudally (neck → trunk → extremities) over 3 days, and fades in the same order with brownish desquamation" },
          { parameter: "Mandatory Vitamin A Regimen", value: "Administer Oral Vitamin A immediately upon diagnosis (Day 1) and repeat on Day 2 (plus a 3rd dose 2–4 weeks later if eye signs of xerophthalmia/Bitot spots exist): Infants < 6 months: 50,000 IU PO OD × 2 days | Infants 6–11 months: 100,000 IU PO OD × 2 days | Children ≥ 12 months & Adults: 200,000 IU PO OD × 2 days" },
          { parameter: "Isolation Window", value: "Strict Airborne Isolation from 4 days before rash onset through 4 days after rash appears" }
        ],
        scope: {
          included: [
            "Unimmunized or partially immunized infants, children, and adults presenting with suspected or confirmed measles in outpatient, emergency, or hospital settings."
          ],
          excluded: [
            { label: "Pregnant Women & Severely Immunocompromised Patients (HIV with low CD4, active chemotherapy)", action: "High risk of fatal giant-cell pneumonia and encephalitis; MMR live vaccine is strictly contraindicated—administer Human Immune Globulin (IG) within 6 days of exposure and admit promptly if symptomatic." },
            { label: "Differential Exanthems", action: "Differentiate from Dengue (petechial rash, leukopenia/thrombocytopenia, no prominent 3 Cs), Rubella (milder 3-day rash, prominent posterior auricular/suboccipital lymphadenopathy), Roseola Infantum (high fever for 3–5 days that resolves right as the rash appears), and Kawasaki Disease (prolonged fever ≥ 5 days + mucocutaneous inflammation)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Mandatory 2-Dose High-Dose Vitamin A", detail: "Administer 2-dose High-Dose Vitamin A to every child diagnosed with measles—Vitamin A reduces measles mortality by > 50% and prevents corneal blindness (keratomalacia)." },
            { title: "Antibiotic Stewardship & Post-Exposure Prophylaxis (PEP)", detail: "Do NOT prescribe empiric prophylactic antibiotics for uncomplicated viral measles—reserve antibiotics strictly for confirmed or strongly suspected secondary bacterial complications (Pneumonia, Acute Otitis Media, or bacterial tracheitis); administer MMR vaccine within 72 hours of measles exposure to susceptible immunocompetent contacts aged ≥ 6 months (if given between 6–11 months, the child still needs the routine 2-dose MMR series at 12 and 15 months)." },
            { title: "Immediate Case Notification (RA 11332)", detail: "Report every suspected measles case within 24 hours to the Municipal/City Epidemiology and Surveillance Unit (MESU/CESU) and collect serum for Measles IgM (ideally Days 4–28 after rash onset)." }
          ],
          conditional: [
            { title: "Outpatient Home Isolation vs. Hospital Admission", detail: "Outpatient home isolation vs. hospital admission based on hydration status, ability to feed, and absence of respiratory or neurological red flags." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Immediate Airborne Triage & Masking", detail: "Place a surgical mask on the patient immediately upon clinic arrival and isolate in a separate well-ventilated room (measles virus remains airborne for up to 2 hours)." },
            { step: "2. Screen for Life-Threatening Complications (Admit Immediately If Present)", detail: "Respiratory: Tachypnea, chest indrawing, grunting, stridor (measles croup), or SpO₂ < 95% (secondary bacterial or viral pneumonia—leading cause of measles death). Neurological: Convulsions, lethargy, irritability, or altered sensorium (acute measles encephalitis). GI / Nutritional: Persistent vomiting, inability to drink/breastfeed, severe dehydration, severe acute malnutrition, or corneal clouding/ulceration." },
            { step: "3. Outpatient Supportive Care (Uncomplicated Measles)", detail: "Give Day 1 & Day 2 Vitamin A + Paracetamol (10–15 mg/kg q4–6h for fever—avoid Aspirin) + ORS / frequent breastfeeding + gentle saline eye cleaning. Instruct parents on strict home isolation for 4 days post-rash and review danger signs daily." }
          ]
        },
        practiceNotes: [
          { title: "Routine Immunization Schedule (DOH NIP)", detail: "Ensure every child receives 2 doses of Measles-Containing Vaccine (MCV / MMR) at 9 months and 12–15 months (or starting at 6 months during active DOH outbreak response campaigns) completely free at all Barangay Health Stations and RHUs." }
        ],
        soapPlanSummary: [
          "Infection Control & Notification: Enforce strict airborne isolation (through 4 days post-rash), collect serum Measles IgM (Days 4–28 post-rash), and notify MESU/CESU within 24 hours (RA 11332).",
          "Mandatory Vitamin A & Supportive Care: Administer age-based Oral Vitamin A on Day 1 and Day 2 (50,000 IU if < 6 mos; 100,000 IU if 6–11 mos; 200,000 IU if ≥ 12 mos) + Paracetamol 10–15 mg/kg q4–6h PRN + ORS/hydration; avoid empiric prophylactic antibiotics unless secondary pneumonia/otitis is present.",
          "Red Flags & Contact PEP: Return immediately for fast breathing, chest indrawing, stridor, convulsions, lethargy, or inability to drink; administer MMR PEP within 72 hours to susceptible contacts ≥ 6 mos."
        ]
      },
      {
        id: "cpg-kawasaki-disease",
        category: "Pediatrics",
        title: "Kawasaki Disease (Mucocutaneous Lymph Node Syndrome)",
        source: "PPS / Philippine Society of Pediatric Cardiology (PSPC) Clinical Practice Guidelines on Kawasaki Disease",
        intendedUsers: "Pediatricians, Primary Care Physicians, Emergency Physicians & Pediatric Cardiologists",
        keywords: ["kawasaki", "kawasaki disease", "ivig", "aspirin", "coronary artery aneurysm", "strawberry tongue", "conjunctivitis", "crash", "pspc", "pps", "2d echo", "incomplete kawasaki", "reye syndrome"],
        snapshot: [
          { parameter: "Complete Diagnostic Criteria", value: "Unexplained High Fever lasting ≥ 5 days PLUS ≥ 4 of 5 Principal Clinical Features (\"CRASH & Burn\"): 1. C — Conjunctivitis: Bilateral non-purulent bulbar conjunctival injection (limbic sparing) | 2. R — Rash: Polymorphous maculopapular/morbilliform/erythema multiforme-like rash (accentuated in groin/perineum) | 3. A — Adenopathy: Acute unilateral cervical lymphadenopathy (≥ 1 node ≥ 1.5 cm) | 4. S — Strawberry Tongue & Lips: Erythematous, cracked lips, strawberry tongue, diffuse oral/pharyngeal erythema | 5. H — Hands & Feet: Acute erythema and firm indurative edema of palms/soles (followed in Week 2–3 by periungual desquamation)" },
          { parameter: "Optimal Treatment Window", value: "Within the FIRST 10 DAYS of fever onset (ideally Days 5–7) to reduce Coronary Artery Aneurysm (CAA) risk from 25% down to < 4%" },
          { parameter: "First-Line Inpatient Regimen", value: "Intravenous Immunoglobulin (IVIG): 2 g/kg as a single IV infusion over 10–12 hours | High/Moderate-Dose Aspirin (ASA): 30–50 mg/kg/day (or 80–100 mg/kg/day) divided QID until afebrile for 48–72 hours → then step down to Low-Dose Aspirin (3–5 mg/kg/day OD) for 6–8 weeks (or lifelong if coronary aneurysms persist)" },
          { parameter: "Mandatory Cardiac Imaging", value: "2D Transthoracic Echocardiogram at Diagnosis (Baseline), Week 1–2, and Week 6–8 (evaluating internal lumen diameters + Z-scores of Left Main, LAD, LCX, and RCA)" }
        ],
        scope: {
          included: [
            "Infants and children (peak incidence 6 months to 5 years, though infants < 6 months and older children > 5 years are at highest risk of delayed diagnosis and coronary aneurysms) presenting with Complete or Incomplete (Atypical) Kawasaki Disease."
          ],
          excluded: [
            { label: "Multisystem Inflammatory Syndrome in Children (MIS-C)", action: "Post-COVID-19 hyperinflammatory syndrome with overlapping mucocutaneous features, marked GI symptoms, shock/myocardial dysfunction, and positive SARS-CoV-2 serology—requires combined IVIG + IV Methylprednisolone and pediatric cardiology/ICU co-management." },
            { label: "Infectious Mimics", action: "Differentiate from Measles (prominent cough/coryza, Koplik spots), Scarlet Fever / Group A Strep (exudative tonsillitis, sandpaper rash, rapid response to Penicillin/Amoxicillin within 24–48 hrs), Stevens-Johnson Syndrome (vesiculobullous/ulcerative hemorrhagic mucosal lesions), and Leptospirosis / Dengue." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Immediate Hospital Admission & Timely IVIG Initiation", detail: "Refer IMMEDIATELY for hospital admission any child with persistent fever ≥ 5 days and mucocutaneous features—Kawasaki Disease is the #1 cause of acquired heart disease in children in the Philippines and requires inpatient IVIG; do NOT delay IVIG waiting for a 2D Echocardiogram—if clinical criteria for Complete or Incomplete Kawasaki Disease are met, start IVIG 2 g/kg immediately and perform echocardiography as soon as feasible." },
            { title: "Incomplete (Atypical) Kawasaki Evaluation Algorithm", detail: "Evaluate for Incomplete (Atypical) Kawasaki Disease in any infant/child with unexplained fever ≥ 5 days (or infants < 6 months with unexplained fever ≥ 7 days) + 2–3 clinical criteria + CRP ≥ 3.0 mg/dL and/or ESR ≥ 40 mm/hr + ≥ 3 supplemental lab abnormalities (anemia for age, platelets ≥ 450,000/μL after Day 7, albumin ≤ 3.0 g/dL, elevated ALT, WBC ≥ 15,000/μL, or sterile pyuria ≥ 10 WBC/hpf on urine exam)." },
            { title: "Defer Live-Virus Vaccines for 11 Months Post-IVIG", detail: "Defer Live-Virus Vaccines (MMR & Varicella) for 11 Months after high-dose IVIG administration (passive antibodies neutralize live vaccine replication)." }
          ],
          conditional: [
            { title: "Adjunctive Corticosteroids in High-Risk Patients", detail: "Adding adjunctive Corticosteroids (Prednisolone or IV Methylprednisolone) to primary IVIG in high-risk patients (age < 1 year, shock/Macrophage Activation Syndrome, or baseline coronary artery dilation Z-score ≥ 2.5)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Baseline Labs & Cardiac Evaluation", detail: "Order CBC with platelet count (look for leukocytosis, normocytic anemia, and marked thrombocytosis in Week 2), CRP and ESR, AST/ALT, Serum Albumin, Sodium, Urinalysis (sterile pyuria), 12-Lead ECG, and 2D Echocardiogram." },
            { step: "2. Initiate Primary Therapy (Inpatient)", detail: "Infuse IVIG 2 g/kg over 10–12 hours + start Aspirin (30–50 mg/kg/day QID). Once afebrile for 48–72 hours, switch Aspirin to antiplatelet dose (3–5 mg/kg PO OD)." },
            { step: "3. Manage IVIG-Resistant Kawasaki Disease (~10%–15% of Cases)", detail: "If fever persists or recurs ≥ 36 hours after completing the initial IVIG infusion, administer a second dose of IVIG (2 g/kg) OR IV Methylprednisolone pulse (30 mg/kg/day for 3 days) / Infliximab (5 mg/kg IV) in consultation with a pediatric cardiologist." },
            { step: "4. Post-Discharge Follow-Up & Reye Syndrome Precaution", detail: "Repeat 2D Echo at 2 weeks and 6–8 weeks. If coronary arteries remain completely normal at 6–8 weeks, discontinue low-dose Aspirin. Give Annual Inactivated Influenza Vaccine to children on chronic Aspirin and instruct parents to hold Aspirin and seek urgent care if the child develops chickenpox (varicella) or influenza-like illness (Reye syndrome risk)." }
          ]
        },
        practiceNotes: [
          { title: "Avoiding Misdiagnosis as \"Drug Allergy\" or \"Bacterial Tonsillitis\"", detail: "A classic pitfall in Philippine clinics is treating a febrile child with Amoxicillin/Co-amoxiclav for presumed tonsillitis, then mistaking the emerging polymorphous Kawasaki rash and red eyes for an \"antibiotic drug allergy\"—always check for cracked red lips, strawberry tongue, non-purulent conjunctivitis, and swollen hands/feet when fever reaches Day 5." },
          { title: "IVIG Cost & PhilHealth / Malasakit Access", detail: "Because IVIG is expensive in the Philippines, refer uninsured families early to government tertiary pediatric centers (e.g., PGH, Philippine Children's Medical Center [PCMC], Vicente Sotto Memorial Medical Center) where PhilHealth inpatient case rates, PCSO, and Malasakit Centers subsidize IVIG vials." }
        ],
        soapPlanSummary: [
          "Immediate Admission & Workup: Refer urgently for hospital admission; order CBC with Platelets, CRP, ESR, AST/ALT, Serum Albumin, Sodium, Routine Urinalysis (sterile pyuria), 12-Lead ECG, and Baseline 2D Echocardiogram.",
          "Primary Inpatient Regimen (Start Within First 10 Days): Infuse IVIG 2 g/kg over 10–12 hours (do not delay waiting for 2D Echo) + Aspirin 30–50 mg/kg/day QID until afebrile 48–72 hrs, then Low-Dose Aspirin 3–5 mg/kg OD for 6–8 weeks.",
          "Cardiology Follow-Up & Precautions: Repeat 2D Echo at Week 1–2 and Week 6–8; defer MMR and Varicella live vaccines for 11 months post-IVIG; give annual Inactivated Influenza vaccine and hold Aspirin if varicella/flu develops (Reye syndrome precaution)."
        ]
      },
      {
        id: "cpg-neonatal-sepsis-jaundice",
        category: "Pediatrics",
        title: "Neonatal Sepsis & Neonatal Hyperbilirubinemia (Jaundice)",
        source: "PSNbM / PPS Clinical Practice Guidelines on Neonatal Sepsis and Neonatal Hyperbilirubinemia & DOH Essential Intrapartum and Newborn Care (EINC / Unang Yakap)",
        intendedUsers: "Pediatricians, Neonatologists, Primary Care Physicians, Birthing Home & Emergency Clinicians",
        keywords: ["neonatal sepsis", "neonatal jaundice", "hyperbilirubinemia", "kernicterus", "einc", "unang yakap", "psnbm", "pps", "phototherapy", "exchange transfusion", "g6pd", "ampicillin", "gentamicin"],
        snapshotHeaders: ["Condition", "Key Clinical & Diagnostic Criteria", "First-Line Management"],
        snapshot: [
          {
            col1: "Neonatal Sepsis (0–28 Days of Life)",
            col2: "Early-Onset (EOS: < 72 hrs): Maternal chorioamnionitis, PROM ≥ 18 hrs, maternal GBS colonization/UTI, preterm birth, or perinatal asphyxia | Late-Onset (LOS: ≥ 72 hrs): Community/nosocomial exposure | Danger Signs: Temperature instability (< 36.5°C or ≥ 38.0°C), poor suck/feeding, lethargy/irritability, tachypnea (≥ 60 bpm), chest indrawing, grunting, apnea, mottled skin, bulging fontanelle, or seizures",
            col3: "Immediate Hospital Admission + Empiric IV Antibiotics within 1 Hour (after drawing Blood Culture + CBC + CRP): First-Line (EOS & Community LOS): IV Ampicillin (50 mg/kg/dose q8–12h) PLUS IV Gentamicin (4–5 mg/kg/dose q24–48h per gestational age) | Suspected Meningitis / Hospital LOS: IV Cefotaxime (50 mg/kg/dose q6–12h) + IV Ampicillin (or IV Meropenem + Vancomycin/Amikacin for nosocomial MDROs)"
          },
          {
            col1: "Neonatal Jaundice (Hyperbilirubinemia)",
            col2: "Pathologic Jaundice Red Flags: Jaundice appearing in the FIRST 24 HOURS of life, total serum bilirubin (TSB) rising > 0.2 mg/dL/hr (> 5 mg/dL/day), Direct (Conjugated) Bilirubin > 1.0 mg/dL (acholic pale stools/dark urine), or persistence > 14 days (term) / > 21 days (preterm) | Acute Bilirubin Encephalopathy (Kernicterus): High-pitched cry, hypotonia → hypertonia/opisthotonos (arching back), retrocollis, fever, seizures",
            col3: "Intensive Phototherapy (blue-green LED light 430–490 nm, irradiance ≥ 30 μW/cm²/nm) plotted by postnatal age in hours and gestational age on the AAP / PSNbM Hour-Specific Nomogram | Double-Volume Exchange Transfusion (160 mL/kg): If TSB reaches exchange threshold despite intensive phototherapy OR any sign of Acute Bilirubin Encephalopathy"
          }
        ],
        scope: {
          included: [
            "Term and late-preterm neonates (≥ 35 weeks gestation, aged 0–28 days) presenting with suspected sepsis or unconjugated/conjugated hyperbilirubinemia in birthing clinics, RHUs, outpatient clinics, or hospital nurseries."
          ],
          excluded: [
            { label: "Preterm Infants (< 35 Weeks)", action: "Require gestational-age-specific NICU phototherapy/exchange thresholds (lower bilirubin thresholds for neurotoxicity) and specialized neonatal respiratory/fluid management." },
            { label: "Cholestatic / Conjugated Jaundice (Direct Bilirubin > 1.0 mg/dL or > 20% of TSB)", action: "Phototherapy is contraindicated (causes \"Bronze Baby\" syndrome and does not clear conjugated bilirubin)—refer urgently to a pediatric gastroenterologist/surgeon to rule out Biliary Atresia (requires Kasai portoenterostomy ideally before 60 days of life)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Avoid Visual Estimation Alone & Perform Expanded Newborn Screening", detail: "Never rely on visual assessment (Kramer's rule) alone to estimate bilirubin levels—measure Total and Direct Serum Bilirubin (TSB/DB) or Transcutaneous Bilirubin (TcB) in every jaundiced newborn, especially in darkly pigmented Filipino infants; perform Universal Newborn Screening (Expanded NBS) after 24 hours of life—specifically checking G6PD Deficiency (the #1 genetic cause of severe neonatal hyperbilirubinemia and kernicterus in Filipino infants) alongside ABO/Rh blood typing and Direct Coombs Test (DAT)." },
            { title: "Exclusive Breastfeeding & Antibiotic Timeliness in Sepsis", detail: "Continue frequent exclusive breastfeeding (8–12 times/24 hours) during phototherapy—dehydration reduces bilirubin clearance; avoid supplementing with plain water or dextrose water unless dehydrated; never wait for blood culture results to start IV antibiotics in suspected neonatal sepsis; perform Lumbar Puncture (CSF analysis/culture) in stable neonates with positive blood cultures or strong clinical sepsis signs." }
          ],
          conditional: [
            { title: "Early Discontinuation of Antibiotics in Well-Appearing Term Neonates", detail: "Discontinuing antibiotics at 36–48 hours in well-appearing term neonates initially treated for maternal chorioamnionitis/risk factors if blood cultures remain negative and serial CRP/CBC are normal." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Immediate Danger-Sign Triage (Any Neonate 0–28 Days)", detail: "Check temperature, respiratory rate, heart rate, capillary refill, pre-/post-ductal SpO₂, blood glucose (CBG—treat hypoglycemia < 45 mg/dL immediately with D10W 2 mL/kg IV bolus), and feeding vigor." },
            { step: "2. Manage Suspected Neonatal Sepsis", detail: "Draw Blood Culture (minimum 1 mL), CBC with differential (I:T ratio > 0.2), and CRP → give first dose of IV/IM Ampicillin + Gentamicin immediately (even prior to ambulance transfer from an RHU/lying-in clinic)." },
            { step: "3. Manage Neonatal Jaundice", detail: "Plot TSB vs. exact age in hours (and neurotoxicity risk factors: isoimmune hemolytic disease, G6PD deficiency, sepsis, acidosis, albumin < 3.0 g/dL). Start Intensive LED Phototherapy (neonate naked except eye shields and diaper, maximizing skin surface exposure). Recheck TSB in 4–6 hours if hemolytic/near exchange level, or 12–24 hours if routine; stop phototherapy once TSB falls 2–3 mg/dL below the initiation threshold and check a rebound TSB 12–24 hours later if hemolytic." }
          ]
        },
        practiceNotes: [
          { title: "G6PD Deficiency Counseling", detail: "Because G6PD deficiency affects ~1 in 50 Filipino newborns, instruct parents of diagnosed infants to strictly avoid naphthalene (mothballs), menthol/camphor ointments, fava beans, and contraindicated drugs (Cotrimoxazole, Nitrofurantoin, Primaquine, Aspirin, high-dose Vitamin K analogues) to prevent sudden hemolytic crisis." },
          { title: "PhilHealth Newborn Care Package", detail: "Covers Essential Newborn Care (Unang Yakap), Hepatitis B birth dose, BCG, Vitamin K, and Expanded Newborn Screening at accredited birthing homes and hospitals." }
        ],
        soapPlanSummary: [
          "Emergency Triage & Diagnostics: Assess vital signs, capillary refill, pre/post-ductal SpO₂, CBG (treat hypoglycemia < 45 mg/dL with D10W 2 mL/kg IV bolus); for suspected sepsis, draw Blood Culture (≥ 1 mL), CBC, and CRP; for jaundice, measure TSB/DB (do not rely on visual Kramer's rule)." ,
          "Targeted Therapeutics & Phototherapy: Sepsis → Start IV Ampicillin + Gentamicin within 1 hour; Jaundice → Start Intensive LED Phototherapy plotted on AAP/PSNbM hour-specific nomogram (continue exclusive breastfeeding 8–12×/day; prepare for Double-Volume Exchange Transfusion if TSB reaches exchange threshold or kernicterus signs appear).",
          "Screening & Counseling: Verify Expanded Newborn Screening (G6PD deficiency check); counsel parents of G6PD-deficient infants to strictly avoid naphthalene/mothballs, menthol, camphor, fava beans, and sulfonamides."
        ]
      },
      {
        id: "cpg-tetanus",
        category: "Emergency & Infectious",
        title: "Tetanus (Generalized & Neonatal Tetanus)",
        source: "PSMID Clinical Practice Guidelines on Tetanus & DOH Tetanus Elimination / Wound Prophylaxis Guidelines",
        intendedUsers: "Emergency Physicians, Primary Care Physicians, Surgeons, Intensivists & RHU Clinicians",
        keywords: ["tetanus", "neonatal tetanus", "lockjaw", "risus sardonicus", "opisthotonos", "tetanospasmin", "htig", "metronidazole", "diazepam", "magnesium sulfate", "psmid", "doh"],
        snapshot: [
          { parameter: "Classic Clinical Presentation", value: "Trismus (\"lockjaw\"), Risus Sardonicus (fixed sardonic grin), neck stiffness, dysphagia, rigid board-like abdomen, and painful generalized reflex spasms / opisthotonos triggered by light, noise, or touch—with completely clear sensorium" },
          { parameter: "Immediate Neutralization (Before Wound Debridement)", value: "Human Tetanus Immunoglobulin (HTIG): 500 IU IM single dose (or 3,000–6,000 IU IM if 500 IU unavailable; alternative: Equine Tetanus Antitoxin [ATS] 1,500–3,000 IU after negative skin test) PLUS Tetanus Toxoid (Td/TT) 0.5 mL IM at a separate injection site" },
          { parameter: "Antibiotic of Choice", value: "IV Metronidazole 500 mg IV q6–8h (Children: 30 mg/kg/day divided q6h) for 7–10 days (preferred over Penicillin G, which is a GABA antagonist and can worsen spasms)" },
          { parameter: "Spasm Control (1st-Line)", value: "IV Diazepam (5–10 mg IV bolus, then continuous infusion or titrated boluses up to 40–100+ mg/day) OR IV Midazolam (add IV Magnesium Sulfate infusion for autonomic instability and spasm reduction)" },
          { parameter: "Wound Prophylaxis Rule (Clean vs. Dirty/Tetanus-Prone)", value: "Clean Minor Wound + ≥ 3 prior doses: Give Td/Tdap ONLY if last dose was ≥ 10 years ago (NO TIG) | Dirty/Puncture/Rusty/Crushed Wound + ≥ 3 prior doses: Give Td/Tdap ONLY if last dose was ≥ 5 years ago (NO TIG) | Dirty/Tetanus-Prone Wound + < 3 or UNKNOWN prior doses: Give BOTH Td/Tdap AND HTIG (250 IU IM) immediately" }
        ],
        scope: {
          included: [
            "Neonates (umbilical stump infection—Neonatal Tetanus), children, and adults presenting with localized, cephalic, or generalized tetanus, as well as acute trauma/wound tetanus prophylaxis."
          ],
          excluded: [
            { label: "Drug-Induced Acute Dystonia (Oculogyric Crisis / Jaw Spasm)", action: "Sudden trismus/torticollis after taking Metoclopramide, Haloperidol, or Risperidone—resolves rapidly within minutes after IV/IM Diphenhydramine (25–50 mg) or Biperiden." },
            { label: "Strychnine Poisoning, Severe Hypocalcemic Tetany, or Meningitis", action: "Check serum calcium/electrolytes and meningeal/CSF signs." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Early Airway Protection & HTIG Before Debridement", detail: "Generalized tetanus rapidly causes laryngospasm and diaphragmatic/respiratory muscle paralysis—perform early elective endotracheal intubation or tracheostomy in a quiet, dark ICU room before an anoxic arrest occurs during a spasm; administer HTIG BEFORE surgical wound debridement (manipulating an infected wound releases massive tetanospasmin toxin into bloodstream; neutralize circulating toxin with HTIG first, then excise necrotic tissue and foreign bodies)." },
            { title: "IV Metronidazole & Lifelong Primary Vaccination", detail: "Use IV Metronidazole over Penicillin G as first-line antimicrobial eradication of Clostridium tetani; always vaccinate recovering tetanus patients: clinical tetanus infection does NOT confer natural immunity (the lethal toxin dose is too small to stimulate antibodies)—patients must complete a full 3-dose Td/Tdap primary series starting in the hospital." }
          ],
          conditional: [
            { title: "IV Magnesium Sulfate Infusion for Spasms & Autonomic Storm", detail: "Adding IV Magnesium Sulfate (40 mg/kg loading over 30 min, then 1–2 g/hr infusion maintaining patellar reflexes) as a benzodiazepine-sparing adjunct to control severe muscle spasms and sympathetic autonomic storms (labile hypertension/tachycardia)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Immediate ICU Triage & Quiet Environment", detail: "Place patient in a dark, quiet, low-stimulation isolation room; secure IV access and prepare airway/intubation equipment immediately." },
            { step: "2. Neutralize Toxin & Eradicate Bacteria (First Hour)", detail: "Give HTIG 500 IU IM + Td/Tdap 0.5 mL IM (opposite limb). Start IV Metronidazole 500 mg q6h × 7–10 days. Perform thorough wound debridement and irrigation (leave dirty wounds open to heal by secondary intention)." },
            { step: "3. Control Spasms & Autonomic Storm", detail: "Titrate IV Diazepam or Midazolam to abolish spasms without excessive respiratory depression (if mechanically ventilated, add neuromuscular blockade such as Vecuronium or Cisatracurium if spasms persist). Manage autonomic instability (alternating severe hypertension/tachycardia and hypotension/bradycardia) with IV Magnesium Sulfate, Labetalol (avoid unopposed beta-blockade), or Morphine—avoid Clonidine/Atropine swings. Provide high-calorie enteral nutrition (NGT) (tetanus causes extreme hypermetabolism up to 3,000–4,000 kcal/day) and DVT prophylaxis (Enoxaparin/UFH)." }
          ]
        },
        practiceNotes: [
          { title: "High-Risk Rural & Agricultural Exposures", detail: "In the Philippines, tetanus commonly follows barefoot puncture wounds from nails/bamboo/thorns, motorcycle road rash, dental extractions, or unsterile umbilical cord cutting (labaha/bamboo) in home deliveries." },
          { title: "Maternal Immunization Prevention", detail: "Administering Tetanus Diphtheria (Td) vaccines during prenatal visits (free at all RHUs) transfers protective maternal IgG across the placenta and prevents neonatal tetanus." }
        ],
        soapPlanSummary: [
          "Emergency ICU Management: Place patient in a dark, quiet isolation room; secure airway early (elective intubation/tracheostomy before laryngospasm/anoxic arrest occurs).",
          "Toxin Neutralization & Eradication: Administer Human Tetanus Immunoglobulin (HTIG) 500 IU IM BEFORE surgical wound debridement + Td/Tdap 0.5 mL IM (opposite limb); start IV Metronidazole 500 mg q6h × 7–10 days (avoid Penicillin G).",
          "Spasm Control & Wound Care: Titrate IV Diazepam/Midazolam + IV Magnesium Sulfate infusion; perform thorough wound debridement/irrigation; initiate full 3-dose primary Td/Tdap series upon recovery (tetanus infection does not confer natural immunity)."
        ]
      },
      {
        id: "cpg-masld-fatty-liver",
        category: "Hepatology & Endocrinology",
        title: "Fatty Liver Disease (MASLD / Metabolic Dysfunction-Associated Steatotic Liver Disease)",
        source: "Hepatology Society of the Philippines (HSP) Clinical Practice Guidelines on MASLD (formerly NAFLD) & AASLD/APASL-Adapted Protocols",
        intendedUsers: "Primary Care Physicians, Internists, Endocrinologists, Gastroenterologists & Executive Checkup Clinicians",
        keywords: ["masld", "nafld", "fatty liver", "mash", "fib-4", "fibroscan", "transient elastography", "alt", "ast", "statin", "silymarin", "hsp", "hepatology", "metabolic syndrome"],
        snapshot: [
          { parameter: "Diagnostic Criteria (MASLD)", value: "Hepatic Steatosis (on Liver Ultrasound, FibroScan CAP, or MRI) PLUS at least 1 of 5 Cardiometabolic Risk Factors (excluding significant alcohol intake [< 20 g/day women; < 30 g/day men]): 1. Overweight / Central Obesity: BMI ≥ 23 kg/m² (Asia-Pacific cutoff) OR waist circumference ≥ 90 cm (men) / ≥ 80 cm (women) | 2. Prediabetes or Type 2 DM: FBS ≥ 100 mg/dL, 2-hr OGTT ≥ 140 mg/dL, or HbA1c ≥ 5.7% | 3. Hypertension: BP ≥ 130/85 mm Hg or on antihypertensive therapy | 4. Elevated Triglycerides: ≥ 150 mg/dL or on lipid-lowering therapy | 5. HDL-C: ≤ 40 mg/dL (men) or ≤ 50 mg/dL (women)" },
          { parameter: "Mandatory 1st-Line Fibrosis Triage", value: "Calculate FIB-4 Index = [Age (yrs) × AST (U/L)] ÷ [Platelets (10⁹/L) × √(ALT (U/L))]: Low Risk (FIB-4 < 1.30 [or < 2.0 if age ≥ 65]): Manage in primary care; repeat FIB-4 every 1–2 years | Indeterminate Risk (FIB-4 1.30–2.67): Order Transient Elastography (FibroScan) (liver stiffness < 8.0 kPa = low risk; ≥ 8.0 kPa = refer to hepatologist) | High Risk (FIB-4 > 2.67): Refer directly to Hepatologist / Gastroenterologist for advanced fibrosis/cirrhosis workup" },
          { parameter: "Cornerstone Therapy (All Stages)", value: "Sustained Weight Loss via Diet & Exercise: ≥ 5% weight loss: Reduces liver fat (steatosis) | ≥ 7%–10% weight loss: Resolves steatohepatitis (MASH) and reverses liver fibrosis" },
          { parameter: "Targeted Pharmacotherapy (Biopsy/FibroScan-Confirmed MASH + Fibrosis)", value: "GLP-1 Receptor Agonists (Semaglutide / Liraglutide) or Tirzepatide (especially if Type 2 DM or obesity) | Pioglitazone (30–45 mg OD—proven histological MASH benefit in Type 2 DM/prediabetes) | Resmetirom (thyroid hormone receptor-β agonist for non-cirrhotic MASH with F2–F3 fibrosis where available)" }
        ],
        scope: {
          included: [
            "Filipino adults found to have \"fatty liver\" on abdominal ultrasound, elevated liver transaminases (ALT/AST), or metabolic syndrome in primary care."
          ],
          excluded: [
            { label: "Chronic Viral Hepatitis (HBV & HCV)", action: "ALWAYS test HBsAg and Anti-HCV in every patient with fatty liver or elevated ALT/AST—the Philippines is hyperendemic for Hepatitis B, and coexisting HBV + MASLD accelerates cirrhosis and liver cancer." },
            { label: "Alcohol-Associated Liver Disease (ALD) / MetALD", action: "Carefully quantify alcohol intake (1 standard drink = 1 bottle of beer [330 mL], 1 glass of wine, or 1 shot of gin/rum/brandy = ~10–14 g alcohol)—intake > 20–30 g/day requires strict alcohol abstinence counseling." },
            { label: "Drug-Induced Liver Injury (DILI) or Autoimmune/Wilson Disease", action: "Review all medications, herbal supplements, and weight-loss teas." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Calculate FIB-4 Regardless of Normal ALT & Statin Safety in MASLD", detail: "Do NOT rely on normal ALT/AST to exclude advanced liver fibrosis—up to 50% of patients with MASH and advanced fibrosis have completely normal liver enzymes; always calculate FIB-4 in patients with Type 2 DM, obesity, or ultrasound steatosis; statins are NOT hepatotoxic in fatty liver—cardiovascular disease is the #1 cause of death in MASLD patients, and statins safely reduce cardiovascular mortality (only withhold statins in decompensated Child-Pugh B/C cirrhosis)." },
            { title: "Avoid Unproven \"Liver Supplements\"", detail: "HSP guidelines emphasize that no over-the-counter liver supplement (Silymarin / Phospholipids / Herbal Detoxes) reverses liver fibrosis—redirect patient funds toward weight loss, metabolic control, and FibroScan screening." }
          ],
          conditional: [
            { title: "Vitamin E in Non-Diabetic MASH", detail: "Prescribing Vitamin E (800 IU/day) for biopsy-proven non-diabetic, non-cirrhotic MASH (weighing histological benefit against long-term prostate cancer and hemorrhagic stroke risks)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm MASLD & Exclude Co-Pathologies", detail: "Order HBsAg, Anti-HCV, CBC with Platelet Count, AST, ALT, Bilirubin, Albumin, PT/INR, FBS/HbA1c, Lipid Profile, and Serum Creatinine. Calculate FIB-4 Score at the point of care." },
            { step: "2. Risk-Stratify Fibrosis (2-Tier Pathway)", detail: "FIB-4 < 1.30: Reassure patient that advanced fibrosis is unlikely; manage aggressively in primary care with lifestyle + cardiometabolic control; repeat FIB-4 in 1–2 years. FIB-4 ≥ 1.30: Order Vibration-Controlled Transient Elastography (FibroScan) (or ELF blood test). If Liver Stiffness Measurement (LSM) is ≥ 8.0 kPa, refer to a hepatologist; if ≥ 12.0–15.0 kPa (compensated advanced chronic liver disease/cirrhosis), initiate 6-monthly Liver Ultrasound + AFP for HCC surveillance and screen for esophageal varices." },
            { step: "3. Prescribe Cardiometabolic & Lifestyle Plan", detail: "Target a 500–1,000 kcal/day energy deficit, eliminate sugar-sweetened drinks/fructose, cut white rice portions in half, and prescribe ≥ 150–300 minutes/week of moderate-to-vigorous aerobic + resistance exercise. Favor GLP-1 RAs, SGLT2 inhibitors, or Pioglitazone when treating coexisting Type 2 Diabetes." }
          ]
        },
        practiceNotes: [
          { title: "Correcting the \"Fatty Liver = Harmless / Needs Liver Vitamins\" Myth", detail: "In Philippine executive checkups, ultrasound reports reading \"Mild Fatty Liver\" are frequently dismissed or treated only with expensive herbal capsules while underlying prediabetes, dyslipidemia, and silent liver fibrosis go unaddressed. Use the FIB-4 calculator at every visit and counsel patients that 2–3 cups of unsweetened black coffee daily is actually associated with lower liver fibrosis progression." }
        ],
        soapPlanSummary: [
          "Diagnostics & Fibrosis Triage: Order HBsAg, Anti-HCV, CBC with Platelets, AST, ALT, Bilirubin, Albumin, PT/INR, FBS/HbA1c, Lipid Profile, Creatinine, and Abdominal Ultrasound; calculate FIB-4 Index at point of care (refer to Hepatologist if FIB-4 > 1.30 or FibroScan LSM ≥ 8.0 kPa).",
          "Lifestyle & Pharmacotherapy: Target ≥ 5%–10% weight loss (500–1,000 kcal deficit, eliminate sugary drinks, cut white rice portions in half) + ≥ 150–300 min/week exercise; prescribe GLP-1 RA, Pioglitazone, or SGLT2i if T2DM/obesity; safely prescribe Statins for dyslipidemia/cardiovascular protection (statins are not hepatotoxic in MASLD).",
          "Counseling & Surveillance: Correct the \"fatty liver needs liver vitamins/silymarin\" myth (redirect funds to weight loss and FibroScan); recommend 2–3 cups of unsweetened black coffee daily; enforce 6-monthly Ultrasound + AFP surveillance if advanced fibrosis/cirrhosis is present."
        ]
      },
      {
        id: "cpg-acute-severe-bp",
        category: "Cardiovascular",
        title: "Acute Severe Blood Pressure Elevation (≥ 180/120 mm Hg)",
        source: "2024 Philippine Clinical Practice Guidelines on the Management of Acute Severe Blood Pressure Elevation",
        intendedUsers: "Emergency Physicians, Primary Care Physicians, Internists & Hospitalist Clinicians",
        keywords: ["acute severe bp", "hypertensive emergency", "hypertensive urgency", "180/120", "nicardipine", "sublingual nifedipine", "target organ damage", "aortic dissection", "pulmonary edema"],
        snapshot: [
          { parameter: "Severe BP Threshold", value: "SBP ≥ 180 mm Hg AND/OR DBP ≥ 120 mm Hg confirmed on repeat measurement in both arms" },
          { parameter: "Critical Triage Question", value: "Is acute Target Organ Damage (TOD) present? (NO → Hypertensive Urgency [Outpatient Oral] | YES → Hypertensive Emergency [ER/ICU IV Titration])" },
          { parameter: "Hypertensive Urgency Goal", value: "Quiet rest for 2 hours + re-initiate/uptitrate oral maintenance therapy; lower BP gradually over 24–48 hours (NO IV drugs, NO sublingual nifedipine/captopril)" },
          { parameter: "Hypertensive Emergency Goal", value: "Continuous IV Nicardipine (5–15 mg/hr) or IV Nitroglycerin/Labetalol; reduce MAP by 15%–25% over 1–2 hours (never drop SBP by ≥ 60 mm Hg in 1 hour, except in Aortic Dissection where SBP < 120 & HR < 60 bpm in 20 min)" }
        ],
        scope: {
          included: [
            "Filipino adults presenting to outpatient clinics or emergency departments with acute severe blood pressure elevation (≥ 180/120 mm Hg)."
          ],
          excluded: [
            { label: "Severe Preeclampsia / Eclampsia in Pregnancy (BP ≥ 160/110 mm Hg)", action: "Switch to POGS Hypertension in Pregnancy protocol (IV MgSO₄ + Oral IR Nifedipine / IV Hydralazine / IV Labetalol)." },
            { label: "Hyperacute Ischemic Stroke", action: "Follow SSP Stroke permissive hypertension cutoffs (< 185/110 mm Hg if receiving IV rtPA; otherwise do not lower unless ≥ 220/120 mm Hg)." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Strictly Avoid Sublingual Nifedipine or Captopril", detail: "Never administer sublingual nifedipine or sublingual captopril—unpredictable precipitous BP drops cause watershed cerebral infarction and myocardial ischemia." },
            { title: "Manage Asymptomatic Hypertensive Urgency Outpatient", detail: "Patients with BP ≥ 180/120 mm Hg WITHOUT acute target organ damage should be rested in a quiet room and restarted/uptitrated on oral combination therapy rather than admitted for IV infusions." }
          ],
          conditional: [
            { title: "Targeted Organ-Specific Diagnostics", detail: "Order 12-Lead ECG, Chest X-Ray, Troponin, Creatinine, Urinalysis, or Cranial CT selectively when clinical symptoms or signs suggest acute target organ injury." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm Severe BP & Screen for Acute Target Organ Damage (TOD)", detail: "Recheck BP in both arms using an appropriately sized cuff. Screen immediately for chest pain (ACS), dyspnea/orthopnea (pulmonary edema), focal neuro deficits/confusion (stroke/encephalopathy), or tearing back pain (aortic dissection)." },
            { step: "2. Pathway A — No TOD (Hypertensive Urgency)", detail: "Rest quietly for 2 hours, re-initiate or uptitrate oral maintenance drugs (e.g., Amlodipine + Losartan), lower BP over 24–48 hours, and schedule follow-up within 3–7 days." },
            { step: "3. Pathway B — TOD Present (Hypertensive Emergency)", detail: "Admit to ER/ICU and start continuous IV Nicardipine (5 mg/hr, titrate by 2.5 mg/hr q5–15min up to 15 mg/hr), IV Nitroglycerin (for ACS/pulmonary edema), or IV Esmolol/Labetalol + Nicardipine (for aortic dissection)." }
          ]
        },
        practiceNotes: [
          { title: "Addressing Medication Non-Adherence", detail: "Most Philippine outpatient cases of BP ≥ 180/120 mm Hg occur in patients who stopped taking daily Losartan/Amlodipine once they felt well; counsel that daily maintenance prevents stroke and renal failure." }
        ],
        soapPlanSummary: [
          "Triage & Diagnostics: Confirm BP ≥ 180/120 mm Hg in both arms and screen for acute Target Organ Damage (order ECG, CXR, Troponin, Creatinine, Urinalysis, or Cranial CT if TOD symptoms present).",
          "Targeted Management: Hypertensive Urgency (no TOD) → 2-hour quiet rest + oral maintenance re-initiation/uptitration over 24–48 hrs (avoid sublingual nifedipine); Hypertensive Emergency (with TOD) → Admit to ER/ICU for continuous IV Nicardipine (5–15 mg/hr) or IV Nitroglycerin.",
          "Follow-Up & Precautions: Follow up within 3–7 days with twice-daily Home BP log; return to ER immediately if chest pain, dyspnea, slurred speech, unilateral weakness, or visual loss occurs."
        ]
      },
      {
        id: "cpg-allergic-rhinitis",
        category: "ENT & Allergy",
        title: "Allergic Rhinitis",
        source: "Philippine Society of Otolaryngology–Head and Neck Surgery (PSO-HNS) & ARIA-Adapted CPG on Allergic Rhinitis",
        intendedUsers: "Primary Care Physicians, ENT Specialists, Pediatricians, Allergists & Outpatient Clinicians",
        keywords: ["allergic rhinitis", "rhinitis", "sneezing", "rhinorrhea", "nasal congestion", "fluticasone", "mometasone", "cetirizine", "loratadine", "bilastine", "intranasal corticosteroid", "pso-hns", "aria"],
        snapshot: [
          { parameter: "Cardinal Clinical Features (≥ 2 for > 1 hr/day)", value: "Watery anterior rhinorrhea, paroxysmal sneezing, nasal obstruction/congestion, and nasal/ocular pruritus (+ pale/bluish boggy turbinates on anterior rhinoscopy)" },
          { parameter: "ARIA Classification", value: "Duration: Intermittent (< 4 days/wk OR < 4 consecutive wks) vs. Persistent (≥ 4 days/wk AND ≥ 4 consecutive wks) | Severity: Mild (normal sleep & work/school) vs. Moderate-Severe (impairs sleep, work, school, or daily activities)" },
          { parameter: "Mild Intermittent AR (1st-Line)", value: "2nd-Generation Non-Sedating Oral Antihistamine (Cetirizine 10 mg OD, Loratadine 10 mg OD, Levocetirizine 5 mg OD, Bilastine 20 mg OD, or Fexofenadine 120–180 mg OD) + Isotonic Nasal Saline Irrigation" },
          { parameter: "Moderate-Severe or Persistent AR (1st-Line)", value: "Intranasal Corticosteroid (INCS) Spray (Fluticasone Propionate, Fluticasone Furoate, or Mometasone Furoate OD for ≥ 2–4 weeks)" }
        ],
        scope: {
          included: [
            "Filipino children and adults presenting with intermittent or persistent allergic rhinitis in primary care or specialty clinics."
          ],
          excluded: [
            { label: "Unilateral Nasal Obstruction, Epistaxis, or Foul Purulent Discharge", action: "Refer to ENT for Nasal Endoscopy and Sinus CT to rule out sinonasal tumor, foreign body, or invasive fungal sinusitis." },
            { label: "Rhinitis Medicamentosa", action: "Rebound congestion from using topical Oxymetazoline/Phenylephrine nasal drops for > 3–5 days—stop decongestant drops immediately and bridge with Intranasal Corticosteroid spray." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Intranasal Corticosteroids for Moderate-Severe or Persistent AR", detail: "Prescribe Intranasal Corticosteroids (INCS) as the most effective first-line controller medication for nasal congestion and persistent symptoms." },
            { title: "Prefer 2nd-Generation Over 1st-Generation Oral Antihistamines", detail: "Always choose 2nd-generation non-sedating antihistamines over 1st-generation sedating antihistamines (Chlorpheniramine, Diphenhydramine), which impair cognition, school learning, and driving safety." }
          ],
          conditional: [
            { title: "Combination INCS + Intranasal Antihistamine or Leukotriene Receptor Antagonist", detail: "Stepping up to fixed-dose INCS + Intranasal Antihistamine (Azelastine/Fluticasone) in refractory rhinitis, or adding Montelukast 10 mg OD when Bronchial Asthma coexists (with neuropsychiatric side-effect counseling)." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Classify by ARIA Duration & Severity", detail: "Assess symptom days per week, consecutive weeks, sleep disturbance, and coexisting bronchial asthma or conjunctivitis." },
            { step: "2. Initiate Stepwise Pharmacotherapy + Saline Irrigation", detail: "Mild Intermittent → 2nd-Gen Oral Antihistamine + Saline Spray. Moderate-Severe Intermittent or Any Persistent AR → Daily Intranasal Corticosteroid (INCS) Spray for 2–4 weeks." },
            { step: "3. Verify Cross-Hand Nasal Spray Technique & Reassess at 2–4 Weeks", detail: "Demonstrate aiming the spray nozzle laterally toward the outer eye canthus (away from the nasal septum to prevent nosebleeds). Step up to INCS + Intranasal/Oral Antihistamine if uncontrolled." }
          ]
        },
        practiceNotes: [
          { title: "Tropical House Dust Mite & Trigger Control", detail: "In the humid Philippine climate, Dermatophagoides pteronyssinus and Blomia tropicalis house dust mites are the #1 perennial allergens; advise washing bedsheets weekly in hot water, sun-drying pillows, and avoiding mosquito coils (katol) and indoor smoke." }
        ],
        soapPlanSummary: [
          "ARIA Classification & Workup: Classify duration (Intermittent vs. Persistent) and severity (Mild vs. Moderate-Severe); evaluate for coexisting Bronchial Asthma.",
          "Stepwise Controller Therapy: Mild Intermittent → 2nd-Gen Oral Antihistamine (Cetirizine 10 mg OD / Loratadine 10 mg OD / Bilastine 20 mg OD) + Nasal Saline Irrigation; Moderate-Severe or Persistent → Intranasal Corticosteroid Spray (Fluticasone or Mometasone OD × 2–4 weeks).",
          "Spray Technique & Red Flags: Aim nasal spray laterally away from septum; limit topical decongestants to ≤ 3–5 days; refer to ENT if unilateral obstruction, recurrent epistaxis, anosmia, or orbital/facial swelling."
        ]
      },
      {
        id: "cpg-arf-rhd",
        category: "Cardiovascular",
        title: "Acute Rheumatic Fever & Rheumatic Heart Disease (with GAS Pharyngitis)",
        source: "PHA / PSPC / PIDSP Clinical Practice Guidelines on Group A Streptococcal Pharyngitis, Acute Rheumatic Fever (ARF) & Rheumatic Heart Disease (RHD)",
        intendedUsers: "Primary Care Physicians, Pediatricians, Internists, Cardiologists & RHU Providers",
        keywords: ["acute rheumatic fever", "arf", "rheumatic heart disease", "rhd", "strep throat", "gas pharyngitis", "tonsillopharyngitis", "jones criteria", "benzathine penicillin", "carditis", "chorea", "aso titer"],
        snapshot: [
          { parameter: "Primary Prevention (GAS Pharyngitis)", value: "Single-dose Benzathine Penicillin G IM (< 27 kg: 600,000 U; ≥ 27 kg: 1.2 MU) OR Oral Penicillin V / Amoxicillin (50 mg/kg/day max 1 g/day) × 10 FULL days" },
          { parameter: "2015 Revised Jones Criteria (High-Risk Endemic Philippines)", value: "Evidence of preceding GAS (elevated ASO/anti-DNase B or + throat culture/RADT) PLUS 2 Major OR 1 Major + 2 Minor Criteria | High-Risk Major: Carditis (clinical or subclinical on 2D Echo), Monoarthritis/Polyarthritis/Polyarthralgia, Chorea, Erythema marginatum, Subcutaneous nodules | High-Risk Minor: Monoarthralgia, Fever ≥ 38.0°C, ESR ≥ 30 mm/hr or CRP ≥ 3.0 mg/dL, Prolonged PR interval" },
          { parameter: "Acute ARF Anti-Inflammatory Regimen", value: "Arthritis/Arthralgia: High-dose Aspirin (50–75 mg/kg/day QID) or Naproxen (10–20 mg/kg/day BID) | Moderate-Severe Carditis + Heart Failure: Oral Prednisone (2 mg/kg/day max 60–80 mg × 2–3 wks, then taper with Aspirin overlap) + HF therapy" },
          { parameter: "Mandatory Secondary Prophylaxis", value: "Benzathine Penicillin G 1.2 MU IM (< 27 kg: 600,000 U IM) EVERY 21–28 DAYS (5 yrs/age 21 if no carditis; 10 yrs/age 21 if resolved carditis; ≥ 10 yrs/age 40 or lifelong if persistent valvular RHD)" }
        ],
        scope: {
          included: [
            "Filipino children, adolescents, and adults presenting with acute streptococcal tonsillopharyngitis, suspected Acute Rheumatic Fever (ARF), or chronic Rheumatic Heart Disease (RHD)."
          ],
          excluded: [
            { label: "Viral Pharyngitis (Presence of Cough, Rhinorrhea, Hoarseness, Conjunctivitis, or Oral Ulcers)", action: "Do NOT prescribe antibiotics for viral upper respiratory tract infections." },
            { label: "Infective Endocarditis or Septic Arthritis", action: "Draw 3 sets of blood cultures and perform arthrocentesis if febrile monoarthritis or unexplained fever in an RHD patient." }
          ]
        },
        recommendations: {
          strong: [
            { title: "Mandatory 2D Echocardiography in All Suspected ARF", detail: "Perform 2D Echocardiography with Doppler in every patient with suspected ARF to detect subclinical valvulitis (mitral/aortic regurgitation) even when no murmur is audible." },
            { title: "Uninterrupted Every-21-to-28-Day Benzathine Penicillin G Secondary Prophylaxis", detail: "Administer intramuscular Benzathine Penicillin G every 3–4 weeks as the gold standard to prevent recurrent ARF flares and progressive rheumatic mitral/aortic valve destruction." }
          ],
          conditional: [
            { title: "Corticosteroids for Severe Acute Rheumatic Carditis", detail: "Using oral Prednisone (2 mg/kg/day) over salicylates alone in patients with severe acute carditis and heart failure." }
          ]
        },
        pathway: {
          orderedSteps: [
            { step: "1. Confirm ARF via High-Risk Jones Criteria & 2D Echo", detail: "Order Throat Culture/RADT, ASO Titer, ESR, CRP, CBC, 12-Lead ECG (check PR interval), and 2D Echocardiogram." },
            { step: "2. Eradicate GAS & Control Acute Inflammation", detail: "Give Benzathine Penicillin G IM single dose (or 10 days oral Penicillin V/Amoxicillin) + High-dose Aspirin/Naproxen for joint symptoms (or Prednisone + diuretics/ACEi for severe carditis)." },
            { step: "3. Enroll in Registry for Monthly Secondary Prophylaxis & Dental Care", detail: "Schedule Benzathine Penicillin G IM every 21–28 days, maintain strict dental hygiene, and provide Infective Endocarditis prophylaxis prior to high-risk dental procedures." }
          ]
        },
        practiceNotes: [
          { title: "High-Risk Endemic Status of the Philippines", detail: "Because the Philippines is a high-risk endemic setting for ARF/RHD, aseptic Monoarthritis or Polyarthralgia counts as a Major Criterion, and Monoarthralgia or Fever ≥ 38.0°C counts as a Minor Criterion under the 2015 Revised Jones Criteria." }
        ],
        soapPlanSummary: [
          "Diagnostics & Staging: Order ASO Titer, ESR, CRP, Throat Culture, 12-Lead ECG, and mandatory 2D Echocardiography (apply 2015 High-Risk Jones Criteria).",
          "Acute Treatment: Eradicate GAS with single-dose Benzathine Penicillin G 1.2 MU IM (< 27 kg: 600,000 U) or 10-day Amoxicillin; treat arthritis with high-dose Aspirin/Naproxen and severe carditis with Prednisone 2 mg/kg/day + HF therapy.",
          "Secondary Prophylaxis & Counseling: Administer Benzathine Penicillin G 1.2 MU IM every 21–28 days long-term; enforce dental hygiene and IE prophylaxis; return to ER for orthopnea, atrial fibrillation, or unexplained fever."
        ]
      }
    ];

    // Attach verbatim 3-pillar Clinical Management Plan to every disease in PH_CPG_CATALOG
    PH_CPG_CATALOG.forEach((cpg: any) => {
      if (CPG_MANAGEMENT_BY_ID[cpg.id]) {
        cpg.clinicalManagement = CPG_MANAGEMENT_BY_ID[cpg.id];
      }
    });



