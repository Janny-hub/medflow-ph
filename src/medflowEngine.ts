import {
  PH_LAB_CATALOG,
  PH_IMAGING_CATALOG,
  ANC_TRIMESTER_TESTS,
  ANC_DANGER_SIGNS,
  PH_CPG_CATALOG
} from './catalogs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  escapeHTML,
  resolveAncTrimesterBundle,
  renderPatientSelectorBannerHTML,
  getPatientPrenatalVisits,
  buildRekordNiNanayHalfBondHTML,
  buildA4SoapRecordSheetHTML,
  buildSingleA6RxPadHTML,
  buildAntenatalCareHTML,
  buildSoapWorkspaceHTML,
  buildPrescriptionWorkspaceHTML,
  buildDiagnosticsWorkspaceHTML,
  buildPatientRecordsHTML
} from './medflowViews';
import {
  ClinicianAccount,
  syncClinicianToFirestore,
  fetchAllCliniciansFromFirestore,
  syncWorkspaceToFirestore,
  fetchWorkspaceFromFirestore
} from './firebase';

declare global {
  interface Window {
    [key: string]: any;
  }
}

const DEFAULT_SAMPLE_PATIENTS = [
  {
    id: 'PT-2025-1001',
    patientType: 'regular',
    name: 'Juan Dela Cruz',
    age: 54,
    sex: 'Male',
    dob: '1971-03-14',
    civilStatus: 'Married',
    contact: '0917-555-0192',
    address: 'Brgy. San Antonio, Pasig City, Metro Manila',
    philhealth: '12-094817263-4',
    allergies: 'No Known Drug Allergies (NKDA)',
    comorbidities: 'Hypertension (5 yrs), Dyslipidemia',
    consultationDate: new Date().toISOString().split('T')[0],
    vitals: {
      bp: '152/94',
      hr: '82',
      rr: '18',
      temp: '36.7',
      spo2: '98',
      weight: '78',
      height: '165',
      bmi: '28.7',
      bmiCategory: 'Obese I (Asia-Pacific)'
    },
    chiefComplaint: 'Occasional nape heaviness and elevated home BP monitoring (150-160/90-95 mmHg) for 1 week',
    hpi: '54-year-old Filipino male with known hypertension for 5 years, previously on intermittent Amlodipine 5mg OD with poor compliance over the past 2 months. Reports occasional morning nape heaviness ("mabigat ang batok") and mild dizziness after salty meals. Denies chest pain, dyspnea, orthopnea, visual blurring, or focal weakness.',
    peFindings: 'Conscious, coherent, not in cardiorespiratory distress. BP 152/94 mmHg (repeat 150/92 mmHg). Anicteric sclerae, pink palpebral conjunctivae. Neck supple, no JVD. Chest symmetrical, clear breath sounds. Heart adynamic precordium, normal rate, regular rhythm, no murmurs. Abdomen soft, non-tender. No bipedal edema.',
    anc: {},
    aiSoap: null,
    doctorSoap: {
      subjective: '54-year-old Filipino male presenting with 1-week history of occasional morning nape heaviness and elevated home BP readings (150-160/90-95 mmHg). Known hypertensive with sub-optimal adherence to Amlodipine 5mg OD. No chest pain, dyspnea, or neurologic deficits.',
      objective: 'BP: 152/94 mmHg | HR: 82 bpm | RR: 18 cpm | Temp: 36.7 °C | SpO2: 98% | Wt: 78 kg | Ht: 165 cm | BMI: 28.7 kg/m² (Obese I Asia-Pacific).\nPE: Awake, coherent, not in distress. Clear breath sounds, regular cardiac rhythm, no murmurs, no bipedal edema.',
      assessment: 'Essential Hypertension, Stage 2, Uncontrolled (ICD-10: I10); Overweight/Obese Class I (Asia-Pacific Criteria); Screen for Type 2 Diabetes Mellitus & Dyslipidemia',
      plan: '1. Initiate single-pill combination therapy per PSH CPG: Losartan 50mg + Amlodipine 5mg 1 tablet PO OD in the morning.\n2. Request baseline diagnostics: FBS, HbA1c, Lipid Profile, Serum Creatinine with eGFR, Serum K+, Urinalysis, and 12-Lead ECG.\n3. Advise DASH diet (<2g sodium/day), limit bagoong/patis/processed meats, and 150 mins/week brisk walking.\n4. Home BP diary twice daily; follow up in 2 weeks with lab results.',
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      medications: [
        { genericName: 'Losartan Potassium + Amlodipine Besilate 50mg/5mg Tablet', brandExample: 'Exforge / Co-Amlodin', sig: 'Take 1 tablet orally once daily in the morning', quantity: '#30' },
        { genericName: 'Atorvastatin Calcium 20mg Tablet', brandExample: 'Lipitor / Avamax', sig: 'Take 1 tablet orally once daily at bedtime', quantity: '#30' }
      ]
    },
    diagnostics: {
      labs: ['Fasting Blood Sugar (FBS)', 'HbA1c (Glycosylated Hemoglobin)', 'Lipid Profile (Total, HDL, LDL, Triglycerides)', 'Creatinine (Serum) & eGFR', 'Electrolytes (Na, K, Cl, iCa, Mg)', 'Routine Urinalysis (UA)'],
      imaging: ['12-Lead Electrocardiogram (ECG)', 'Chest X-Ray (PA View)'],
      clinicalImpression: 'Essential Hypertension Stage 2 (I10); Dyslipidemia',
      notes: 'Advise 8 to 10 hours fasting (water only) prior to blood extraction for FBS and Lipid Profile.'
    },
    consultationHistory: [],
    attachments: []
  },
  {
    id: 'PT-2025-1002',
    patientType: 'antenatal',
    name: 'Maria Teresa Villanueva',
    age: 28,
    sex: 'Female',
    dob: '1997-06-20',
    civilStatus: 'Married',
    contact: '0918-234-8891',
    address: 'Brgy. Poblacion, Makati City, Metro Manila',
    philhealth: '19-203948172-1',
    allergies: 'No Known Drug Allergies (NKDA)',
    comorbidities: 'None (Low-Risk Pregnancy)',
    consultationDate: new Date().toISOString().split('T')[0],
    vitals: {
      bp: '110/70',
      hr: '80',
      rr: '18',
      temp: '36.6',
      spo2: '99',
      weight: '61',
      height: '156',
      bmi: '25.1',
      bmiCategory: 'Obese I (Asia-Pacific)'
    },
    chiefComplaint: 'Routine 2nd Trimester Antenatal Care Check-up at 26 weeks AOG',
    hpi: '28-year-old G2P1 (1001) at 26 weeks and 2 days AOG by LMP presenting for routine 2nd trimester prenatal check-up. Good fetal movement perceived daily. Compliant with daily Ferrous Sulfate + Folic Acid and Calcium Carbonate. Denies vaginal bleeding, watery discharge, dysuria, headache, visual blurring, or epigastric pain.',
    peFindings: 'Conscious, coherent, pink conjunctivae. BP 110/70 mmHg. Abdomen globular, Fundic Height 26 cm, Fetal Heart Tone 144 bpm at RLQ, Cephalic presentation. No bipedal edema.',
    anc: {
      gravida: 2,
      para: 1,
      term: 1,
      preterm: 0,
      abortion: 0,
      living: 1,
      lmp: '2024-11-10',
      aogWeeks: '26 weeks 2 days',
      edc: '2025-08-17',
      trimester: '2nd',
      fht: '144 bpm (RLQ)',
      fundicHeight: '26 cm',
      presentation: 'Cephalic',
      fetalMovement: 'Present / Active (>=10 kicks/12h)',
      edema: 'None',
      bloodType: 'O+ (Rh Positive)',
      dangerSigns: [],
      ironFolate: 'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg 1 tab PO OD',
      calcium: 'Calcium Carbonate 500mg 1 tab PO TID with meals',
      tetanusStatus: 'Td2 Completed',
      deworming: 'Albendazole 400mg single dose given (2nd Trimester)',
      facilityBirthPlan: 'Ospital ng Makati (Level 3 Birthing Facility)',
      philhealthStatus: 'Active Member (MCP Eligible)',
      emergencyTransport: 'Family vehicle / Barangay Emergency Ambulance',
      bloodDonorName: 'Mark Villanueva (Husband, O+)',
      companionName: 'Mark Villanueva (Husband)',
      obNotes: 'Instructed on Cardiff Count-to-Ten fetal kick counting starting at 28 weeks.'
    },
    aiSoap: null,
    doctorSoap: {
      subjective: '28-year-old G2P1 (1001) at 26 weeks 2 days AOG presenting for routine 2nd trimester prenatal visit. Good fetal movements. No maternal danger signs.',
      objective: 'BP: 110/70 mmHg | HR: 80 bpm | Wt: 61 kg | FH: 26 cm | FHT: 144 bpm | Presentation: Cephalic | Edema: None.',
      assessment: 'Pregnancy Uterine, 26 weeks 2 days AOG by LMP, Cephalic, Live Singleton, in Latent/Not in Labor; G2P1 (1001), Low-Risk Antenatal Care (ICD-10: Z34.8)',
      plan: '1. Continue Ferrous Sulfate 60mg + Folic Acid 400mcg 1 tab PO OD.\n2. Continue Calcium Carbonate 500mg 1 tab PO TID.\n3. Request 75g 2-Hour Oral Glucose Tolerance Test (OGTT) for universal GDM screening (POGS guideline).\n4. Repeat CBC and Urinalysis; Congenital Anomaly Scan (CAS) completed/reviewed.\n5. Follow up in 4 weeks or immediately if any DOH Maternal Danger Signs occur.',
      followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      medications: [
        { genericName: 'Ferrous Sulfate + Folic Acid 60mg/400mcg Tablet', brandExample: 'Hemarate FA / Sangobion', sig: 'Take 1 tablet orally once daily before meals', quantity: '#30' },
        { genericName: 'Calcium Carbonate 500mg Tablet', brandExample: 'Caltrate / Calvin Plus', sig: 'Take 1 tablet orally three times daily with meals', quantity: '#60' }
      ]
    },
    diagnostics: {
      labs: ['75g Oral Glucose Tolerance Test (OGTT - 2 Hr)', 'Complete Blood Count with Platelet (CBC + PC)', 'Routine Urinalysis (UA)'],
      imaging: ['Congenital Anomaly Scan (CAS)'],
      clinicalImpression: 'Pregnancy Uterine 26 2/7 wks AOG, G2P1 (1001), Routine 2nd Trimester Screening',
      notes: '8 hours fasting required prior to 75g 2-hour OGTT.'
    },
    consultationHistory: [],
    attachments: []
  }
];

const INITIAL_DEMO_CLINICIANS: ClinicianAccount[] = [
  {
    id: 'doc-santos-001',
    username: 'dr.santos',
    email: 'maria.santos@medflow.ph',
    phone: '+63 (02) 8554-8400 / 0917-800-1122',
    passwordHash: 'password123',
    name: 'Dr. Maria Clara Santos, MD, FPCP',
    role: 'Doctor',
    specialty: 'Internal Medicine & Primary Care',
    facility: 'Philippine General Hospital - Out-Patient Department',
    address: 'Taft Avenue, Ermita, Manila 1000, Philippines',
    school: '',
    supervisingDoctor: '',
    prc: '0128492',
    ptr: '8492011',
    s2: 'S2-094812-PH',
    approvalStatus: 'approved',
    createdAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'clerk-juan-002',
    username: 'clerk.juan',
    email: 'juan.reyes@upm.edu.ph',
    phone: '0917-332-9940',
    passwordHash: 'password123',
    name: 'Juan Miguel Reyes, Clinical Clerk',
    role: 'Medical Clerk',
    specialty: 'Clinical Clerkship — Internal Medicine & OB-GYN Rotation',
    facility: 'Philippine General Hospital - Ward 1 / OPD',
    address: 'Taft Avenue, Ermita, Manila 1000',
    school: 'University of the Philippines College of Medicine (UPCM)',
    supervisingDoctor: 'Dr. Maria Clara Santos, MD, FPCP (PRC #0128492)',
    prc: 'CLERK-UPCM-2025',
    ptr: 'N/A (Clinical Clerk)',
    s2: 'N/A',
    approvalStatus: 'approved',
    createdAt: '2025-01-12T08:00:00.000Z'
  },
  {
    id: 'intern-bea-003',
    username: 'intern.bea',
    email: 'bea.mendoza@ust.edu.ph',
    phone: '0918-771-4021',
    passwordHash: 'password123',
    name: 'Beatriz Mendoza, MD (PGI)',
    role: 'Medical Intern',
    specialty: 'Post-Graduate Internship — Community & Primary Care',
    facility: 'Ospital ng Makati - Department of Family & Community Medicine',
    address: 'Sampaguita St., Pembo, Makati City',
    school: 'UST Faculty of Medicine and Surgery',
    supervisingDoctor: 'Dr. Roberto Villanueva, MD, FPAFP (PRC #0109384)',
    prc: 'PGI-2025-088',
    ptr: 'N/A (Medical Intern)',
    s2: 'N/A',
    approvalStatus: 'approved',
    createdAt: '2025-01-15T08:00:00.000Z'
  }
];

const ACCOUNTS_STORAGE_KEY = 'medflow_ph_clinician_accounts_v2';
const SESSION_STORAGE_KEY = 'medflow_ph_active_clinician_id_v2';
const AI_SOAP_STORAGE_KEY = 'medflow_ph_ai_soap_enabled_v1';

function getWorkspaceStorageKey(clinicianId: string): string {
  return `medflow_ph_workspace_${clinicianId}`;
}

function getWorkspaceTimestampKey(clinicianId: string): string {
  return `medflow_ph_workspace_ts_${clinicianId}`;
}

export function initMedFlowEngine(): void {
  const savedAiPref = localStorage.getItem(AI_SOAP_STORAGE_KEY);
  const appState: any = {
    currentView: 'home',
    activeClinician: null as ClinicianAccount | null,
    bypassPendingInPreview: false,
    aiSoapEnabled: savedAiPref === null ? true : savedAiPref === 'true',
    soapCpgSearchQuery: '',
    soapSelectedCpgId: '',
    authMode: 'signin', // 'signin' | 'signup'
    signupRole: 'Doctor', // 'Doctor' | 'Medical Clerk' | 'Medical Intern'
    clinicianAccounts: [] as ClinicianAccount[],
    doctor: {
      id: 'doc-santos-001',
      username: 'dr.santos',
      email: 'maria.santos@medflow.ph',
      name: 'Dr. Maria Clara Santos, MD, FPCP',
      role: 'Doctor',
      specialty: 'Internal Medicine & Primary Care',
      facility: 'Philippine General Hospital - Out-Patient Department',
      clinic: 'Philippine General Hospital - Out-Patient Department',
      address: 'Taft Avenue, Ermita, Manila 1000, Philippines',
      phone: '+63 (02) 8554-8400',
      school: '',
      supervisingDoctor: '',
      prc: '0128492',
      ptr: '8492011',
      s2: 'S2-094812-PH'
    },
    patients: [],
    activePatientId: null,
    ancActiveTab: 'ob-dating',
    ancScreeningFilter: '1st',
    ancSelectedMilestoneId: '',
    diagActiveTab: 'labs',
    rxPrintMode: 'single-a6',
    cpgSearchQuery: '',
    cpgSelectedCategory: 'All',
    openCpgCategories: [] as string[],
    openCpgIds: [] as string[],
    recordsActiveTab: 'all',
    recordsSearchQuery: '',
    registryOpenFolderPatientId: '',
    registryPreviewPatientId: '',
    registryPreviewDocType: '',
    followUpExpanded: false,
    pendingAttachments: []
  };

  window.appState = appState;

  function loadClinicianAccounts(): void {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          appState.clinicianAccounts = parsed;
        } else {
          appState.clinicianAccounts = JSON.parse(JSON.stringify(INITIAL_DEMO_CLINICIANS));
        }
      } else {
        appState.clinicianAccounts = JSON.parse(JSON.stringify(INITIAL_DEMO_CLINICIANS));
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(appState.clinicianAccounts));
      }
    } catch {
      appState.clinicianAccounts = JSON.parse(JSON.stringify(INITIAL_DEMO_CLINICIANS));
    }

    // Seed demo workspace for dr.santos if not yet created
    const santosKey = getWorkspaceStorageKey('doc-santos-001');
    if (!localStorage.getItem(santosKey)) {
      localStorage.setItem(santosKey, JSON.stringify(DEFAULT_SAMPLE_PATIENTS));
    }

    // Background sync with Firestore to pull any newly registered or admin-approved accounts
    fetchAllCliniciansFromFirestore().then((remoteAccounts) => {
      if (remoteAccounts && remoteAccounts.length > 0) {
        const mergedMap = new Map<string, ClinicianAccount>();
        appState.clinicianAccounts.forEach((acc: ClinicianAccount) => mergedMap.set(acc.id, acc));
        remoteAccounts.forEach((rem: ClinicianAccount) => {
          mergedMap.set(rem.id, rem);
        });
        appState.clinicianAccounts = Array.from(mergedMap.values());
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(appState.clinicianAccounts));
        if (appState.activeClinician) {
          const updatedSelf = mergedMap.get(appState.activeClinician.id);
          if (updatedSelf) {
            appState.activeClinician = updatedSelf;
            syncDoctorFromClinician(updatedSelf);
            updateHeaderDoctorName();
          }
        }
      }
    });
  }

  function saveClinicianAccounts(): void {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(appState.clinicianAccounts));
    } catch (e) {
      console.error('Error saving clinician accounts:', e);
    }
  }

  function syncDoctorFromClinician(acc: ClinicianAccount): void {
    appState.doctor = {
      id: acc.id,
      username: acc.username,
      email: acc.email,
      name: acc.name,
      role: acc.role,
      specialty: acc.specialty || (acc.role === 'Doctor' ? 'General Medicine' : `${acc.role} Rotation`),
      facility: acc.facility,
      clinic: acc.facility,
      address: acc.address,
      phone: acc.phone,
      school: acc.school || '',
      supervisingDoctor: acc.supervisingDoctor || '',
      prc: acc.prc || '',
      ptr: acc.ptr || '',
      s2: acc.s2 || ''
    };
  }

  function loadClinicianWorkspace(clinicianId: string): void {
    try {
      const key = getWorkspaceStorageKey(clinicianId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        appState.patients = Array.isArray(parsed) ? parsed : [];
      } else {
        // Each new doctor/clerk starts with an isolated patient list (or sample patients only for demo dr.santos)
        appState.patients = clinicianId === 'doc-santos-001' ? JSON.parse(JSON.stringify(DEFAULT_SAMPLE_PATIENTS)) : [];
        localStorage.setItem(key, JSON.stringify(appState.patients));
      }
      appState.activePatientId = appState.patients[0]?.id || null;
      appState.patients.forEach((p: any) => {
        if (!p.aiSoap) p.aiSoap = generateLiveAISoapFromPatient(p);
      });
    } catch {
      appState.patients = [];
      appState.activePatientId = null;
    }

    // Also check Firestore workspace for this clinician when online, without overwriting newer offline saves
    fetchWorkspaceFromFirestore(clinicianId).then((remoteResult) => {
      if (
        remoteResult &&
        Array.isArray(remoteResult.patients) &&
        remoteResult.patients.length > 0 &&
        appState.activeClinician?.id === clinicianId
      ) {
        const localTs = localStorage.getItem(getWorkspaceTimestampKey(clinicianId)) || '';
        const remoteTs = remoteResult.updatedAt || '';
        // Only adopt remote patients if local workspace is empty OR remote timestamp is newer than local offline save
        if (appState.patients.length === 0 || (remoteTs && (!localTs || remoteTs > localTs))) {
          appState.patients = remoteResult.patients;
          appState.patients.forEach((p: any) => {
            if (!p.aiSoap) p.aiSoap = generateLiveAISoapFromPatient(p);
          });
          if (!appState.activePatientId && appState.patients.length > 0) {
            appState.activePatientId = appState.patients[0].id;
          }
          localStorage.setItem(getWorkspaceStorageKey(clinicianId), JSON.stringify(appState.patients));
          if (remoteTs) {
            localStorage.setItem(getWorkspaceTimestampKey(clinicianId), remoteTs);
          }
        } else if (localTs && (!remoteTs || localTs > remoteTs)) {
          // Local offline data is newer; sync it up to Firestore
          syncWorkspaceToFirestore(clinicianId, appState.patients);
        }
      }
    });
  }

  function saveState(): void {
    if (!appState.activeClinician) return;
    const cid = appState.activeClinician.id;
    try {
      const nowIso = new Date().toISOString();
      localStorage.setItem(getWorkspaceStorageKey(cid), JSON.stringify(appState.patients));
      localStorage.setItem(getWorkspaceTimestampKey(cid), nowIso);
      syncWorkspaceToFirestore(cid, appState.patients);
    } catch (e) {
      console.error('Error saving isolated clinician state:', e);
    }
  }

  function getActivePatient(): any {
    return appState.patients.find((p: any) => p.id === appState.activePatientId) || appState.patients[0] || null;
  }

  function showToast(message: string, type = 'success'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bgClass =
      type === 'success'
        ? 'bg-teal-900 text-white border-teal-700'
        : 'bg-slate-900 text-white border-slate-700';

    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border ${bgClass} text-xs font-medium transition-all duration-300`;
    toast.innerHTML = `
      <svg class="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>${escapeHTML(message)}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function extractDoctorSurname(fullName: string): string {
    if (!fullName) return 'Doctor';
    // Strip everything after the first comma (e.g., ", Clinical Clerk", ", MD, FPCP")
    const beforeComma = fullName.split(',')[0].trim();
    // Remove parenthetical suffixes and leading titles
    const cleaned = beforeComma
      .replace(/\(.*?\)/g, '')
      .replace(/^(Dr\.?|Dra\.?|MD|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '')
      .trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'Doctor';
    if (parts.length >= 2) {
      const secondLast = parts[parts.length - 2].toLowerCase();
      if (['dela', 'de', 'del', 'san', 'sta.', 'sta', 'sto.', 'sto'].includes(secondLast)) {
        return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
      }
    }
    return parts[parts.length - 1];
  }

  function updateHeaderDoctorName(): void {
    const actionsEl = document.getElementById('header-account-actions');
    if (!appState.activeClinician) {
      if (actionsEl) actionsEl.style.display = 'none';
      return;
    }
    if (actionsEl) actionsEl.style.display = 'flex';
  }

  function updateBottomNavHighlight(): void {
    const navIds = ['home', 'registration', 'anc', 'soap', 'rx', 'diagnostics', 'records', 'cpg'];
    navIds.forEach((id) => {
      const btn = document.getElementById(`bnav-${id}`);
      if (!btn) return;
      if (appState.currentView === id) {
        btn.className = 'md:flex-1 justify-center whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-teal-600 text-white shadow-sm cursor-pointer';
      } else {
        btn.className = 'md:flex-1 justify-center whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer';
      }
    });
  }

  // ============================================================================
  // MULTI-USER AUTHENTICATION (SIGN IN & REGISTRATION FOR DOCTORS, CLERKS, INTERNS)
  // ============================================================================
  function renderAuthScreen(): void {
    const main = document.getElementById('main-workspace');
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';
    if (!main) return;

    // Check if logged in as a Pending Approval Doctor
    if (appState.activeClinician && appState.activeClinician.role === 'Doctor' && appState.activeClinician.approvalStatus === 'pending' && !appState.bypassPendingInPreview) {
      const c = appState.activeClinician;
      main.innerHTML = `
        <div class="max-w-xl mx-auto my-8 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 text-white">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 mb-2">Subscription Enrollment Verification</span>
            <h2 class="text-xl font-extrabold">Doctor Account Pending Admin Approval</h2>
            <p class="text-xs text-teal-100 mt-1">All registered doctors must be approved by the Administrator before full subscription activation.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-1.5">
              <p class="font-bold text-sm text-slate-900">Registered Clinician Details (Synced to Database):</p>
              <p><strong>Name:</strong> ${escapeHTML(c.name)}</p>
              <p><strong>Username / Email:</strong> ${escapeHTML(c.username)} • ${escapeHTML(c.email)}</p>
              <p><strong>Phone Number:</strong> ${escapeHTML(c.phone)}</p>
              <p><strong>Assigned Facility:</strong> ${escapeHTML(c.facility)}</p>
              <p><strong>Facility Address:</strong> ${escapeHTML(c.address)}</p>
              <p><strong>PRC / PTR / S2:</strong> PRC #${escapeHTML(c.prc || 'Pending')} | PTR #${escapeHTML(c.ptr || 'N/A')} | S2 #${escapeHTML(c.s2 || 'N/A')}</p>
              <p><strong>Enrollment Status:</strong> <span class="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold uppercase text-[10px]">Pending Admin Approval</span></p>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Your account record (<code class="bg-slate-100 px-1.5 py-0.5 rounded font-semibold">${escapeHTML(c.id)}</code>) has been saved to the cloud database for the separate Admin Portal to review and approve your subscription.
            </p>
            <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button onclick="checkPendingDoctorStatus()" class="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer">
                Check Approval Status
              </button>
              <button onclick="enterPreviewModeForPendingDoctor()" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer">
                Test Workspace Now (Preview Mode)
              </button>
              <button onclick="handleSignOut()" class="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const mode = appState.authMode || 'signin';
    const role = appState.signupRole || 'Doctor';
    const isTrainee = role === 'Medical Clerk' || role === 'Medical Intern';

    main.innerHTML = `
      <div class="max-w-2xl mx-auto my-6 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col items-center justify-center mb-6">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_jyo0aejyo0aejyo0_8ff5abe4.jpg"
              alt="MedFlow Philippine Clinical Workflow"
              class="h-24 sm:h-28 w-auto object-contain"
            />
          </div>
          <div class="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button onclick="setAuthMode('signin')" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${mode === 'signin' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              Sign In
            </button>
            <button onclick="setAuthMode('signup')" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${mode === 'signup' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
              Sign Up
            </button>
          </div>

          ${mode === 'signin' ? `
            <form onsubmit="handleClinicianSignIn(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address or Username <span class="text-teal-700">*</span></label>
                <input id="signin-identifier" type="text" required placeholder="e.g., dr.santos or maria.santos@medflow.ph"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password <span class="text-teal-700">*</span></label>
                <input id="signin-password" type="password" required placeholder="Enter your password"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none">
              </div>
              <button type="submit" class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition cursor-pointer">
                Sign In
              </button>
              <p class="text-[11px] text-slate-500 text-center pt-1">
                New Doctor, Medical Clerk, or Intern?
                <button type="button" onclick="setAuthMode('signup')" class="text-teal-700 font-bold hover:underline cursor-pointer">Sign Up →</button>
              </p>

              <!-- Quick Demo Login Switcher -->
              <div class="pt-5 mt-5 border-t border-slate-200">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Quick Demo Sign-In (1-Click Test):</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button type="button" onclick="quickDemoLogin('dr.santos')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition text-xs cursor-pointer">
                    <span class="font-bold text-slate-900 block truncate">Dr. Maria Clara Santos</span>
                    <span class="text-[10px] text-teal-700 font-semibold">Doctor • PGH OPD</span>
                  </button>
                  <button type="button" onclick="quickDemoLogin('clerk.juan')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition text-xs cursor-pointer">
                    <span class="font-bold text-slate-900 block truncate">Juan Miguel Reyes</span>
                    <span class="text-[10px] text-teal-700 font-semibold">Clerk • UPCM / PGH</span>
                  </button>
                  <button type="button" onclick="quickDemoLogin('intern.bea')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition text-xs cursor-pointer">
                    <span class="font-bold text-slate-900 block truncate">Beatriz Mendoza</span>
                    <span class="text-[10px] text-teal-700 font-semibold">Intern • UST / OsMak</span>
                  </button>
                </div>
              </div>
            </form>
          ` : `
            <form onsubmit="handleClinicianSignUp(event)" class="space-y-4">

              <!-- Role Selector -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Select Clinical Role <span class="text-teal-700">*</span></label>
                <div class="grid grid-cols-3 gap-2">
                  ${['Doctor', 'Medical Clerk', 'Medical Intern'].map(r => `
                    <button type="button" onclick="setSignupRole('${r}')"
                      class="py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${role === r ? 'bg-teal-600 text-white border-teal-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}">
                      ${r}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Account Login Credentials -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Full Name & Title <span class="text-teal-700">*</span></label>
                  <input id="signup-name" type="text" required placeholder="${isTrainee ? 'e.g., Juan Dela Cruz, Clinical Clerk' : 'e.g., Dr. Juan Dela Cruz, MD'}"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Username <span class="text-teal-700">*</span></label>
                  <input id="signup-username" type="text" required placeholder="e.g., dr.juandelacruz"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address <span class="text-teal-700">*</span></label>
                  <input id="signup-email" type="email" required placeholder="clinician@hospital.ph"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Phone / Mobile Number <span class="text-teal-700">*</span></label>
                  <input id="signup-phone" type="text" required placeholder="e.g., 0917-555-0199"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Create Password <span class="text-teal-700">*</span></label>
                  <input id="signup-password" type="password" required minlength="4" placeholder="Create password"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Specialty / Department Rotation</label>
                  <input id="signup-specialty" type="text" placeholder="${isTrainee ? 'e.g., Internal Medicine Rotation' : 'e.g., Internal Medicine / Family Medicine'}"
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
              </div>

              <!-- Assigned Facility & Address (For Doctor, Clerk, and Intern) -->
              <div class="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2.5">
                <p class="text-[11px] font-extrabold uppercase tracking-wider text-teal-900">Assigned Facility & Document Header Information</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Assigned Facility / Hospital / Clinic <span class="text-teal-700">*</span></label>
                    <input id="signup-facility" type="text" required placeholder="e.g., Philippine General Hospital / RHU"
                      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Facility / Clinic Address <span class="text-teal-700">*</span></label>
                    <input id="signup-address" type="text" required placeholder="e.g., Taft Ave., Ermita, Manila"
                      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                  </div>
                </div>
              </div>

              <!-- Conditional Fields for Medical Clerk / Medical Intern -->
              ${isTrainee ? `
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">${escapeHTML(role)} Affiliation & Supervision</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Current Affiliation School <span class="text-teal-700">*</span></label>
                      <input id="signup-school" type="text" required placeholder="e.g., UP College of Medicine / UST FMS"
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Supervising Doctor (Type or Edit) <span class="text-teal-700">*</span></label>
                      <input id="signup-supervising" type="text" required placeholder="e.g., Dr. Roberto Reyes, MD (PRC #0114892)"
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                    </div>
                  </div>
                  <p class="text-[10px] text-slate-600">Note: You can also edit your Assigned Facility and Supervising Doctor anytime inside Clinician Settings.</p>
                </div>
              ` : `
                <!-- Conditional License Fields for Doctor -->
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">Physician License Credentials (Appears on SOAP, Rx & Lab Forms)</p>
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">PRC License No. <span class="text-teal-700">*</span></label>
                      <input id="signup-prc" type="text" required placeholder="0128492"
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">PTR No.</label>
                      <input id="signup-ptr" type="text" placeholder="8492011"
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">S2 License No.</label>
                      <input id="signup-s2" type="text" placeholder="S2-094812"
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                  </div>
                  <p class="text-[11px] text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-lg font-medium">
                    <strong>Admin Subscription Notice:</strong> Registered doctors require approval by the Administrator (via the separate Admin Portal).
                  </p>
                </div>
              `}

              <button type="submit" class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition cursor-pointer">
                Complete ${escapeHTML(role)} Registration
              </button>
            </form>
          `}
        </div>
      </div>
    `;
  }

  window.setAuthMode = (mode: string) => {
    appState.authMode = mode;
    renderAuthScreen();
  };

  window.setSignupRole = (role: string) => {
    appState.signupRole = role;
    renderAuthScreen();
  };

  window.quickDemoLogin = (username: string) => {
    const acc = appState.clinicianAccounts.find((a: ClinicianAccount) => a.username.toLowerCase() === username.toLowerCase());
    if (!acc) return;
    appState.activeClinician = acc;
    appState.bypassPendingInPreview = false;
    localStorage.setItem(SESSION_STORAGE_KEY, acc.id);
    syncDoctorFromClinician(acc);
    loadClinicianWorkspace(acc.id);
    updateHeaderDoctorName();
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    switchView('home');
    showToast(`Signed in as ${acc.name} (${acc.facility})`);
  };

  window.handleClinicianSignIn = (e: Event) => {
    e.preventDefault();
    const identifier = ((document.getElementById('signin-identifier') as HTMLInputElement)?.value || '').trim().toLowerCase();
    const password = ((document.getElementById('signin-password') as HTMLInputElement)?.value || '').trim();

    const found = appState.clinicianAccounts.find(
      (a: ClinicianAccount) =>
        (a.username.toLowerCase() === identifier || a.email.toLowerCase() === identifier) &&
        a.passwordHash === password
    );

    if (!found) {
      showToast('Invalid Email/Username or Password. Please check your credentials.', 'warning');
      return;
    }

    if (found.approvalStatus === 'rejected') {
      showToast('Your account enrollment was declined or removed by the Administrator.', 'warning');
      return;
    }

    appState.activeClinician = found;
    const hasOfflineOrPreviewAccess =
      !navigator.onLine || localStorage.getItem(`medflow_ph_doctor_access_${found.id}`) === 'true';
    appState.bypassPendingInPreview = hasOfflineOrPreviewAccess;
    localStorage.setItem(SESSION_STORAGE_KEY, found.id);
    syncDoctorFromClinician(found);
    loadClinicianWorkspace(found.id);
    updateHeaderDoctorName();

    if (found.role === 'Doctor' && found.approvalStatus === 'pending' && !appState.bypassPendingInPreview) {
      renderAuthScreen();
      showToast('Signed in — Doctor account is awaiting Admin subscription approval.', 'warning');
      return;
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    switchView('home');
    showToast(
      navigator.onLine
        ? `Welcome back, ${found.name}!`
        : `Signed in offline as ${found.name}`
    );
  };

  window.handleClinicianSignUp = (e: Event) => {
    e.preventDefault();
    const role = appState.signupRole as 'Doctor' | 'Medical Clerk' | 'Medical Intern';
    const name = ((document.getElementById('signup-name') as HTMLInputElement)?.value || '').trim();
    const username = ((document.getElementById('signup-username') as HTMLInputElement)?.value || '').trim().toLowerCase();
    const email = ((document.getElementById('signup-email') as HTMLInputElement)?.value || '').trim().toLowerCase();
    const phone = ((document.getElementById('signup-phone') as HTMLInputElement)?.value || '').trim();
    const password = ((document.getElementById('signup-password') as HTMLInputElement)?.value || '').trim();
    const specialty = ((document.getElementById('signup-specialty') as HTMLInputElement)?.value || '').trim();
    const facility = ((document.getElementById('signup-facility') as HTMLInputElement)?.value || '').trim();
    const address = ((document.getElementById('signup-address') as HTMLInputElement)?.value || '').trim();
    const school = ((document.getElementById('signup-school') as HTMLInputElement)?.value || '').trim();
    const supervisingDoctor = ((document.getElementById('signup-supervising') as HTMLInputElement)?.value || '').trim();
    const prc = ((document.getElementById('signup-prc') as HTMLInputElement)?.value || '').trim();
    const ptr = ((document.getElementById('signup-ptr') as HTMLInputElement)?.value || '').trim();
    const s2 = ((document.getElementById('signup-s2') as HTMLInputElement)?.value || '').trim();

    if (!name || !username || !email || !phone || !password || !facility) {
      showToast('Please complete all required registration fields.', 'warning');
      return;
    }

    const duplicate = appState.clinicianAccounts.find(
      (a: ClinicianAccount) => a.username.toLowerCase() === username || a.email.toLowerCase() === email
    );
    if (duplicate) {
      showToast('Username or Email Address is already registered. Please sign in.', 'warning');
      return;
    }

    const newAccount: ClinicianAccount = {
      id: `clinician-${Date.now()}`,
      username,
      email,
      phone,
      passwordHash: password,
      name,
      role,
      specialty: specialty || (role === 'Doctor' ? 'Primary Care & Internal Medicine' : `${role} Rotation`),
      facility,
      address,
      school: role === 'Doctor' ? '' : school,
      supervisingDoctor: role === 'Doctor' ? '' : supervisingDoctor,
      prc: role === 'Doctor' ? prc : `${role.toUpperCase().replace(/\s+/g, '-')}-ID`,
      ptr: role === 'Doctor' ? ptr : 'N/A',
      s2: role === 'Doctor' ? s2 : 'N/A',
      approvalStatus: role === 'Doctor' ? 'pending' : 'approved',
      createdAt: new Date().toISOString()
    };

    appState.clinicianAccounts.push(newAccount);
    saveClinicianAccounts();
    syncClinicianToFirestore(newAccount);

    localStorage.setItem(getWorkspaceStorageKey(newAccount.id), JSON.stringify([]));
    localStorage.setItem(getWorkspaceTimestampKey(newAccount.id), new Date().toISOString());
    syncWorkspaceToFirestore(newAccount.id, []);

    appState.activeClinician = newAccount;
    appState.bypassPendingInPreview = !navigator.onLine;
    localStorage.setItem(SESSION_STORAGE_KEY, newAccount.id);
    syncDoctorFromClinician(newAccount);
    loadClinicianWorkspace(newAccount.id);
    updateHeaderDoctorName();

    if (role === 'Doctor' && navigator.onLine) {
      renderAuthScreen();
      showToast('Doctor Registration submitted! Pending Admin approval.', 'success');
    } else {
      if (role === 'Doctor') {
        localStorage.setItem(`medflow_ph_doctor_access_${newAccount.id}`, 'true');
      }
      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) bottomNav.style.display = '';
      switchView('home');
      showToast(
        navigator.onLine
          ? `Registered & signed in as ${newAccount.name}!`
          : `Registered offline & signed in as ${newAccount.name}!`
      );
    }
  };

  window.checkPendingDoctorStatus = async () => {
    if (!navigator.onLine) {
      showToast('Currently offline — Click "Test Workspace Now" to use all features offline.', 'warning');
      return;
    }
    showToast('Checking Admin approval status from cloud database...');
    const remoteList = await fetchAllCliniciansFromFirestore();
    if (remoteList && appState.activeClinician) {
      const match = remoteList.find((r) => r.id === appState.activeClinician.id);
      if (match) {
        appState.activeClinician = match;
        const idx = appState.clinicianAccounts.findIndex((x: ClinicianAccount) => x.id === match.id);
        if (idx >= 0) appState.clinicianAccounts[idx] = match;
        saveClinicianAccounts();
        if (match.approvalStatus === 'approved') {
          const bottomNav = document.getElementById('bottom-nav');
          if (bottomNav) bottomNav.style.display = '';
          switchView('home');
          showToast('Your Doctor account has been approved by Admin!');
          return;
        }
      }
    }
    showToast('Still awaiting Admin approval in the external Admin Portal.', 'warning');
  };

  window.enterPreviewModeForPendingDoctor = () => {
    appState.bypassPendingInPreview = true;
    if (appState.activeClinician) {
      localStorage.setItem(`medflow_ph_doctor_access_${appState.activeClinician.id}`, 'true');
    }
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    switchView('home');
    showToast('Opened workspace with your registered Doctor & Facility credentials.');
  };

  window.handleSignOut = () => {
    appState.activeClinician = null;
    appState.bypassPendingInPreview = false;
    localStorage.removeItem(SESSION_STORAGE_KEY);
    closeModal();
    updateHeaderDoctorName();
    renderAuthScreen();
    showToast(
      navigator.onLine
        ? 'Signed out of clinician account.'
        : 'Signed out offline. You can sign back in anytime without internet.'
    );
  };

  window.loadSamplePatientsForCurrentClinician = () => {
    if (!appState.activeClinician) return;
    const cloned = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_PATIENTS)).map((pt: any, idx: number) => ({
      ...pt,
      id: `PT-${Date.now().toString().slice(-4)}-${idx + 1}`
    }));
    appState.patients = cloned;
    appState.activePatientId = cloned[0]?.id || null;
    saveState();
    switchView(appState.currentView);
    showToast('Loaded sample patients into your clinician workspace.');
  };

  // ============================================================================
  // CLINICAL SOAP LOGIC (PRESERVED FROM USER CODE)
  // ============================================================================
  function generateLiveAISoapFromPatient(p: any): any {
    const cc = (p.chiefComplaint || '').toLowerCase();
    const hpi = (p.hpi || '').toLowerCase();
    const combined = `${cc} ${hpi}`;
    const v = p.vitals || {};
    const anc = p.anc || {};

    if (p.patientType === 'antenatal' || combined.includes('prenatal') || combined.includes('antenatal') || combined.includes('pregnant') || combined.includes('aog')) {
      const g = anc.gravida || 1;
      const para = anc.para || 0;
      const t = anc.term || 0;
      const pr = anc.preterm || 0;
      const ab = anc.abortion || 0;
      const l = anc.living || 0;
      const aog = anc.aogWeeks || '2nd Trimester';
      const edc = anc.edc || 'To be determined by Ultrasound';
      const dangerList = anc.dangerSigns && anc.dangerSigns.length > 0 ? anc.dangerSigns.join(', ') : 'No maternal danger signs reported';

      return {
        confidence: '98% DOH/POGS Maternal CPG Match',
        subjectiveSummary: `${p.age}-year-old G${g}P${para} (${t}-${pr}-${ab}-${l}) at ${aog} AOG (EDC: ${edc}) presenting for ${p.chiefComplaint}. ${p.hpi || ''} Danger Signs Screening: ${dangerList}.`,
        objectiveSummary: `BP: ${v.bp || '-'} mmHg | HR: ${v.hr || '-'} bpm | Wt: ${v.weight || '-'} kg | BMI: ${v.bmi || '-'}. OB Exam: FH ${anc.fundicHeight || '-'} cm, FHT ${anc.fht || '-'} bpm, Presentation: ${anc.presentation || 'Cephalic'}, Fetal Movement: ${anc.fetalMovement || 'Active'}, Edema: ${anc.edema || 'None'}.`,
        primaryImpression: `Pregnancy Uterine, ${aog} AOG by LMP, ${anc.presentation || 'Cephalic'}, Live Singleton; G${g}P${para} (${t}-${pr}-${ab}-${l}), ${anc.dangerSigns?.length ? 'High-Risk Pregnancy (With Danger Signs)' : 'Low-Risk Antenatal Care'} (ICD-10: Z34.8)`,
        differentials: [
          'Routine Antenatal Supervision (DOH Safe Motherhood / POGS CPG)',
          'Screen for Gestational Diabetes Mellitus (75g 2-Hr OGTT at 24–28 weeks)',
          'Monitor for Gestational Hypertension / Preeclampsia'
        ],
        suggestedPlan:
          `1. Continue Daily Maternal Micronutrients: ${anc.ironFolate || 'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg OD'} and ${anc.calcium || 'Calcium Carbonate 500mg TID'}.\n` +
          `2. Ensure Tetanus Diphtheria (${anc.tetanusStatus || 'Td'}) immunization and trimester laboratory/ultrasound workup are up to date.\n` +
          `3. Reinforce DOH Mother-Baby Birth & Emergency Plan (Facility: ${anc.facilityBirthPlan || 'Accredited Birthing Facility'}).\n` +
          `4. Advise daily fetal kick counting (>=10 movements in 12 hours) and immediate consult if any maternal danger signs occur.`,
        suggestedMeds: [
          { genericName: 'Ferrous Sulfate + Folic Acid 60mg/400mcg Tablet', brandExample: 'Hemarate FA / Iberet', sig: 'Take 1 tablet orally once daily', quantity: '#30' },
          { genericName: 'Calcium Carbonate 500mg Tablet', brandExample: 'Caltrate / Calvin Plus', sig: 'Take 1 tablet orally three times daily with meals', quantity: '#60' }
        ],
        redFlags: [
          'Vaginal bleeding or passage of watery fluid (PROM)',
          'Severe headache, visual blurring, RUQ/epigastric pain, or BP >= 140/90 mmHg (Preeclampsia)',
          'Decreased or absent fetal movement (<10 kicks in 12 hours)'
        ]
      };
    }

    if (combined.includes('bp') || combined.includes('hypertension') || combined.includes('nape') || combined.includes('dizziness')) {
      return {
        confidence: '96% PSH / PhilPEN CPG Match',
        subjectiveSummary: `${p.age}-year-old ${p.sex} presenting with ${p.chiefComplaint}. ${p.hpi || ''}`,
        objectiveSummary: `BP: ${v.bp || '-'} mmHg | HR: ${v.hr || '-'} bpm | RR: ${v.rr || '-'} cpm | Temp: ${v.temp || '-'}°C | BMI: ${v.bmi || '-'} (${v.bmiCategory || '-'}). ${p.peFindings || ''}`,
        primaryImpression: 'Essential Hypertension, Stage 2, Uncontrolled (ICD-10: I10); Screen for Target Organ Damage & Metabolic Syndrome',
        differentials: [
          'Primary Essential Hypertension (PSH 2020 CPG)',
          'Hypertensive Urgency (if BP >180/120 mmHg without acute target organ damage)',
          'Type 2 Diabetes Mellitus / Dyslipidemia Comorbidity'
        ],
        suggestedPlan:
          '1. Initiate or optimize single-pill combination therapy (ARB + CCB: Losartan 50mg + Amlodipine 5mg 1 tab PO OD).\n' +
          '2. Order baseline workup: FBS, HbA1c, Lipid Profile, Serum Creatinine with eGFR, Serum Potassium, Routine Urinalysis, and 12-Lead ECG.\n' +
          '3. Lifestyle modification: Low-sodium DASH diet (<2g sodium/day), weight reduction, 30 mins moderate aerobic exercise 5x/week.\n' +
          '4. Maintain home BP monitoring log (morning and evening) and follow up in 2 weeks.',
        suggestedMeds: [
          { genericName: 'Losartan Potassium + Amlodipine Besilate 50mg/5mg Tablet', brandExample: 'Exforge / Co-Amlodin', sig: 'Take 1 tablet orally once daily in the morning', quantity: '#30' },
          { genericName: 'Atorvastatin Calcium 20mg Tablet', brandExample: 'Lipitor / Avamax', sig: 'Take 1 tablet orally once daily at bedtime', quantity: '#30' }
        ],
        redFlags: [
          'BP >= 180/120 mmHg accompanied by chest pain, dyspnea, or neurologic deficit',
          'Sudden unilateral weakness, facial droop, or slurred speech (Stroke BE-FAST)',
          'Decreased urine output or bipedal edema'
        ]
      };
    }

    return {
      confidence: '94% DOH / PhilHealth Primary Care Match',
      subjectiveSummary: `${p.age}-year-old ${p.sex} presenting with ${p.chiefComplaint || 'outpatient consultation'}. ${p.hpi || ''}`,
      objectiveSummary: `BP: ${v.bp || '-'} mmHg | HR: ${v.hr || '-'} bpm | RR: ${v.rr || '-'} cpm | Temp: ${v.temp || '-'}°C | SpO2: ${v.spo2 || '-'}% | BMI: ${v.bmi || '-'} (${v.bmiCategory || '-'}). ${p.peFindings || ''}`,
      primaryImpression: `Clinical Evaluation for: ${p.chiefComplaint || 'Primary Care Consultation'} (Verify ICD-10 in Philippine CPG Reference)`,
      differentials: [
        'Primary Acute / Chronic Medical Condition per History & PE',
        'Consider Infectious vs. Metabolic Etiology',
        'Refer to Philippine CPG Library tab for society-specific staging'
      ],
      suggestedPlan:
        '1. Correlate clinical history and physical examination with targeted diagnostic workup (CBC, Urinalysis, Chemistry as indicated).\n' +
        '2. Provide evidence-based pharmacotherapy per DOH National Formulary / Generics Act (RA 6675).\n' +
        '3. Advise supportive hydration, nutrition, and clear return-to-clinic precautions.\n' +
        '4. Schedule follow-up consultation to review laboratory and imaging results.',
      suggestedMeds: [
        { genericName: 'Paracetamol 500mg Tablet', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for fever or pain', quantity: '#12' }
      ],
      redFlags: [
        'Persistent high-grade fever, tachypnea, or SpO2 < 94%',
        'Inability to tolerate oral fluids or intractable vomiting',
        'Altered sensorium, severe pain, or hemodynamic instability'
      ]
    };
  }

  function buildAiSoapLeftInnerHTML(p: any): string {
    if (!p.aiSoap) p.aiSoap = generateLiveAISoapFromPatient(p);
    const ai = p.aiSoap;

    return `
      <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">SOAP</div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">Clinical SOAP Assistant</h3>
          </div>
        </div>
      </div>

      <div class="space-y-3.5 text-xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">S — Synthesized Subjective</span>
          <p class="text-slate-700 leading-relaxed">${escapeHTML(ai.subjectiveSummary)}</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">O — Synthesized Objective</span>
          <p class="text-slate-700 text-[11px] leading-relaxed">${escapeHTML(ai.objectiveSummary)}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-teal-800">A — Suggested Clinical Impression</span>
            <button onclick="adoptAiAssessment()" class="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">Use in Note →</button>
          </div>
          <p class="font-bold text-slate-900 text-xs">${escapeHTML(ai.primaryImpression)}</p>
          <div class="mt-2 pt-2 border-t border-teal-200/60">
            <span class="text-[10px] font-semibold text-teal-800 uppercase">Differentials / Considerations:</span>
            <ul class="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
              ${(ai.differentials || []).map((d: string) => `<li>${escapeHTML(d)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-800">P — Suggested Management Plan</span>
            <button onclick="adoptAiPlan()" class="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">Append to Plan →</button>
          </div>
          <p class="text-slate-800 whitespace-pre-line leading-relaxed text-[11px]">${escapeHTML(ai.suggestedPlan)}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-white border border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Suggested Generics Act (RA 6675) Regimen</span>
          <div class="space-y-2">
            ${(ai.suggestedMeds || []).map((m: any, idx: number) => `
              <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p class="font-bold text-slate-800 text-xs">${escapeHTML(m.genericName)} <span class="font-normal text-slate-500">(${escapeHTML(m.brandExample)})</span></p>
                  <p class="text-[11px] text-slate-600">Sig: ${escapeHTML(m.sig)} • <span class="font-semibold">${escapeHTML(m.quantity)}</span></p>
                </div>
                <button onclick="addAiMedToDoctorSoap(${idx})" class="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] shrink-0 transition cursor-pointer">
                  + Add Rx
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-100 border border-slate-300">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-800 block mb-1">Clinical Red Flags & Precautions</span>
          <ul class="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
            ${(ai.redFlags || []).map((rf: string) => `<li>${escapeHTML(rf)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  window.toggleAiSoapAssistance = () => {
    appState.aiSoapEnabled = !appState.aiSoapEnabled;
    localStorage.setItem(AI_SOAP_STORAGE_KEY, String(appState.aiSoapEnabled));
    if (appState.currentView === 'soap') {
      renderSoapWorkspace();
    } else if (appState.currentView === 'home') {
      renderHome();
    }
    showToast(
      appState.aiSoapEnabled
        ? 'AI SOAP Assistance Activated'
        : 'AI SOAP Assistance Deactivated — Using Offline Philippine CPG Mode'
    );
  };

  window.updateSoapCpgSearch = (val: string) => {
    appState.soapCpgSearchQuery = val;
    renderSoapWorkspace();
    const input = document.querySelector('input[oninput="updateSoapCpgSearch(this.value)"]') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  };

  window.selectSoapCpgItem = (cpgId: string) => {
    appState.soapSelectedCpgId = cpgId;
    renderSoapWorkspace();
  };

  window.applyCpgAssessmentOnly = (cpgId: string) => {
    const cpg = PH_CPG_CATALOG.find((c: any) => c.id === cpgId);
    const p = getActivePatient();
    if (!cpg || !p) return;
    p.doctorSoap.assessment = cpg.title;
    saveState();
    renderSoapWorkspace();
    showToast(`Applied "${cpg.title}" as SOAP Assessment`);
  };

  window.savePatientConsultationSnapshot = () => {
    const p = getActivePatient();
    if (!p) return;
    if (!Array.isArray(p.consultationHistory)) p.consultationHistory = [];
    const today = p.consultationDate || new Date().toISOString().split('T')[0];
    const snapshotEntry = {
      date: today,
      type: p.patientType === 'antenatal' ? 'Antenatal Visit' : 'Outpatient Consultation',
      chiefComplaint: p.chiefComplaint || 'Consultation',
      vitalsSummary: `BP ${p.vitals?.bp || '-'}, HR ${p.vitals?.hr || '-'}, Temp ${p.vitals?.temp || '-'}°C, Wt ${p.vitals?.weight || '-'}kg`,
      assessment: p.doctorSoap?.assessment || p.chiefComplaint || 'Pending Assessment',
      planSummary: p.doctorSoap?.plan || '',
      medsSummary: (p.doctorSoap?.medications || []).map((m: any) => `${m.genericName} (${m.sig})`).join('; ') || 'None'
    };
    const existingIdx = p.consultationHistory.findIndex((h: any) => h.date === today);
    if (existingIdx >= 0) {
      p.consultationHistory[existingIdx] = snapshotEntry;
    } else {
      p.consultationHistory.unshift(snapshotEntry);
    }
    saveState();
    showToast(
      navigator.onLine
        ? `Saved ${p.name}'s record to offline storage & cloud`
        : `Saved ${p.name}'s record offline (will auto-sync when online)`
    );
  };

  window.adoptAiAssessment = () => {
    const p = getActivePatient();
    if (!p || !p.aiSoap) return;
    p.doctorSoap.assessment = p.aiSoap.primaryImpression;
    saveState();
    const el = document.getElementById('doctor-soap-assessment') as HTMLTextAreaElement;
    if (el) el.value = p.doctorSoap.assessment;
    const printEl = document.getElementById('print-soap-assessment');
    if (printEl) printEl.textContent = p.doctorSoap.assessment;
    showToast('Adopted Assessment into Official SOAP Note');
  };

  window.adoptAiPlan = () => {
    const p = getActivePatient();
    if (!p || !p.aiSoap) return;
    p.doctorSoap.plan = p.doctorSoap.plan
      ? `${p.doctorSoap.plan}\n\n${p.aiSoap.suggestedPlan}`
      : p.aiSoap.suggestedPlan;
    saveState();
    const el = document.getElementById('doctor-soap-plan') as HTMLTextAreaElement;
    if (el) el.value = p.doctorSoap.plan;
    const printEl = document.getElementById('print-soap-plan');
    if (printEl) printEl.textContent = p.doctorSoap.plan;
    showToast('Appended Plan into Official SOAP Note');
  };

  window.adoptAllAiToDoctorSoap = () => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.aiSoap) p.aiSoap = generateLiveAISoapFromPatient(p);
    p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
    p.doctorSoap.objective = p.aiSoap.objectiveSummary;
    p.doctorSoap.assessment = p.aiSoap.primaryImpression;
    p.doctorSoap.plan = p.aiSoap.suggestedPlan;
    saveState();
    renderSoapWorkspace();
    showToast('Copied all SOAP sections to Official SOAP Note');
  };

  window.addAiMedToDoctorSoap = (idx: number) => {
    const p = getActivePatient();
    if (!p || !p.aiSoap || !p.aiSoap.suggestedMeds[idx]) return;
    const med = { ...p.aiSoap.suggestedMeds[idx] };
    p.doctorSoap.medications.push(med);
    saveState();
    renderSoapWorkspace();
    showToast(`Added ${med.genericName} to SOAP & Prescription`);
  };

  window.handleSoapFieldInput = (field: string, value: string) => {
    const p = getActivePatient();
    if (!p) return;
    p.doctorSoap[field] = value;
    saveState();
    const printEl = document.getElementById(`print-soap-${field}`);
    if (printEl) printEl.textContent = value;
  };

  window.addBlankDoctorMed = () => {
    const p = getActivePatient();
    if (!p) return;
    p.doctorSoap.medications.push({
      genericName: '',
      brandExample: '',
      sig: 'Take 1 tablet orally once daily',
      quantity: '#30'
    });
    saveState();
    if (appState.currentView === 'rx') renderPrescriptionWorkspace();
    else renderSoapWorkspace();
  };

  window.updateDoctorMed = (idx: number, key: string, value: string) => {
    const p = getActivePatient();
    if (!p || !p.doctorSoap.medications[idx]) return;
    p.doctorSoap.medications[idx][key] = value;
    saveState();
    const soapPreview = document.getElementById('soap-printable-a4');
    if (soapPreview) {
      soapPreview.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'CONS');
    }
    const rxPreview = document.getElementById('rx-printable-sheet');
    if (rxPreview) {
      const meds = p.doctorSoap?.medications || [];
      const mode = appState.rxPrintMode || 'single-a6';
      if (mode === 'dual-a6') {
        rxPreview.innerHTML = `
          <div class="paper-dual-a6-half paper-dual-a6-divider">
            <div class="text-[8px] font-bold uppercase tracking-widest text-teal-700 mb-1">Patient Copy</div>
            ${buildSingleA6RxPadHTML(appState.doctor, p, meds)}
          </div>
          <div class="paper-dual-a6-half">
            <div class="text-[8px] font-bold uppercase tracking-widest text-slate-700 mb-1">Pharmacy / Clinic Copy</div>
            ${buildSingleA6RxPadHTML(appState.doctor, p, meds)}
          </div>
        `;
      } else {
        rxPreview.innerHTML = buildSingleA6RxPadHTML(appState.doctor, p, meds);
      }
    }
  };

  window.removeDoctorMed = (idx: number) => {
    const p = getActivePatient();
    if (!p) return;
    p.doctorSoap.medications.splice(idx, 1);
    saveState();
    if (appState.currentView === 'rx') renderPrescriptionWorkspace();
    else renderSoapWorkspace();
    showToast('Removed medication from list');
  };

  // ============================================================================
  // VIEW ROUTING
  // ============================================================================
  function switchView(viewName: string): void {
    if (!appState.activeClinician) {
      renderAuthScreen();
      return;
    }
    if (appState.activeClinician.role === 'Doctor' && appState.activeClinician.approvalStatus === 'pending' && !appState.bypassPendingInPreview) {
      renderAuthScreen();
      return;
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';

    appState.currentView = viewName;
    updateBottomNavHighlight();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'home') renderHome();
    else if (viewName === 'registration') renderRegistration();
    else if (viewName === 'anc') renderAntenatalCare();
    else if (viewName === 'soap') renderSoapWorkspace();
    else if (viewName === 'rx') renderPrescriptionWorkspace();
    else if (viewName === 'diagnostics') renderDiagnosticsWorkspace();
    else if (viewName === 'records') renderPatientRecords();
    else if (viewName === 'cpg') renderCpgWorkspace();
  }

  window.switchView = switchView;

  window.selectActivePatient = (id: string) => {
    if (!id) return;
    appState.activePatientId = id;
    saveState();
    switchView(appState.currentView);
  };

  // ============================================================================
  // HOME VIEW (UNIFORM TEAL + SLATE TWO-COLOR PALETTE)
  // ============================================================================
  function renderHome(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const scheduledPatients = appState.patients
      .filter((p: any) => p.doctorSoap && p.doctorSoap.followUpDate)
      .sort((a: any, b: any) => a.doctorSoap.followUpDate.localeCompare(b.doctorSoap.followUpDate));

    const doc = appState.doctor;
    const isTrainee = doc.role === 'Medical Clerk' || doc.role === 'Medical Intern';
    const doctorSurname = extractDoctorSurname(doc.name);
    const totalPatientsCount = (appState.patients || []).length;
    const ancPatientsCount = (appState.patients || []).filter((p: any) => p.patientType === 'antenatal').length;
    const formattedToday = new Date().toLocaleDateString('en-PH', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    main.innerHTML = `
      <div class="space-y-8">
        <!-- Modern, Readable Teal & Slate Color Palette Hero Banner (Date at Upper Right, No Dr Icon) -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-100 via-teal-50 to-slate-100 border-2 border-teal-200/90 p-6 sm:p-8 shadow-sm">
          <!-- Subtle Palette Decorative Accents -->
          <div class="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-teal-300/25 blur-3xl"></div>
          <div class="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-slate-300/30 blur-3xl"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <!-- Left: Welcoming Greeting + Facility Cards -->
            <div class="space-y-3 max-w-3xl">
              <div>
                <h2 class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  <span class="italic font-semibold text-teal-800">Malusog na araw,</span> Dr. ${escapeHTML(doctorSurname)}!
                </h2>
                <p class="text-xs font-medium text-slate-700 mt-0.5">Welcome back to your clinical workspace.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-teal-200/90 text-slate-800 shadow-2xs">
                  <svg class="w-4 h-4 text-teal-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span><strong class="text-teal-950">Assigned Facility:</strong> ${escapeHTML(doc.facility || doc.clinic)}${doc.address ? ` (${escapeHTML(doc.address)})` : ''}</span>
                </div>

                ${
                  isTrainee && doc.school
                    ? `
                  <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-teal-200/90 text-slate-800 shadow-2xs">
                    <svg class="w-4 h-4 text-teal-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span><strong class="text-teal-950">Affiliation School:</strong> ${escapeHTML(doc.school)}</span>
                  </div>
                `
                    : ''
                }
              </div>
            </div>

            <!-- Right: Upper-Right Date Badge + Summary Stat Cards -->
            <div class="flex flex-col lg:items-end gap-3 shrink-0">
              <div class="self-start lg:self-end inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-teal-200 text-[11px] font-bold text-teal-900 shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-teal-600"></span>
                <span>${escapeHTML(formattedToday)}</span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="px-4 py-3 rounded-2xl bg-white border border-teal-200 text-center shadow-xs">
                  <span class="block text-lg sm:text-xl font-extrabold text-slate-900">${totalPatientsCount}</span>
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-teal-800 mt-0.5">Patients</span>
                </div>
                <div class="px-4 py-3 rounded-2xl bg-white border border-teal-200 text-center shadow-xs">
                  <span class="block text-lg sm:text-xl font-extrabold text-teal-700">${ancPatientsCount}</span>
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-teal-800 mt-0.5">Antenatal</span>
                </div>
                <div class="px-4 py-3 rounded-2xl bg-white border border-teal-200 text-center shadow-xs">
                  <span class="block text-lg sm:text-xl font-extrabold text-slate-900">${scheduledPatients.length}</span>
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">Follow-Ups</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5 Primary Workflow Cards (Centered Icons & Titles with Distinct Icon Colors) -->
        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button onclick="startNewPatientRegistration()" class="group text-center bg-white hover:bg-teal-50/40 p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-slate-900">New Patient Registration</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Start Intake</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="openReturningPatientModal()" class="group text-center bg-white hover:bg-teal-50/40 p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-slate-900">Returning Patient</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Select Returning</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('anc')" class="group text-center bg-white hover:bg-teal-50/40 p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-slate-900">Antenatal Care (ANC)</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open ANC Module</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('records')" class="group text-center bg-white hover:bg-teal-50/40 p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-slate-900">Patient Records</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open Registry</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('cpg')" class="group text-center bg-white hover:bg-teal-50/40 p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-slate-900">Philippine CPGs</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Browse CPGs</span>
                <span>→</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Scheduled Follow-Up Patients Accordion -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <button onclick="toggleFollowUpSection()" class="w-full px-6 py-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-5 h-5 text-teal-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Scheduled Follow-Up Patients</h3>
                <p class="text-xs text-slate-500">Click to ${appState.followUpExpanded ? 'hide' : 'view'} patients with upcoming or overdue follow-up dates</p>
              </div>
            </div>
            <div class="flex items-center gap-3 self-end sm:self-center">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                ${scheduledPatients.length} Scheduled
              </span>
            </div>
          </button>

          ${appState.followUpExpanded ? `
            <div class="border-t border-slate-200">
              ${scheduledPatients.length === 0 ? `
                <div class="p-8 text-center text-xs text-slate-400">No patients currently have a scheduled follow-up date set.</div>
              ` : `
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                        <th class="py-3 px-5">Follow-Up Date</th>
                        <th class="py-3 px-4">Patient</th>
                        <th class="py-3 px-4">Category</th>
                        <th class="py-3 px-4">Primary Assessment / Reason</th>
                        <th class="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-xs">
                      ${scheduledPatients.map((p: any) => {
                        const fDate = p.doctorSoap.followUpDate;
                        const isOverdue = fDate < todayStr;
                        const badgeClass = isOverdue
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-teal-50 text-teal-800 border-teal-200';
                        return `
                          <tr class="hover:bg-slate-50 transition-colors">
                            <td class="py-3.5 px-5 font-bold">
                              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${badgeClass}">
                                ${escapeHTML(fDate)}
                              </span>
                            </td>
                            <td class="py-3.5 px-4 font-bold text-slate-900">${escapeHTML(p.name)} (${escapeHTML(p.age)}/${escapeHTML(p.sex)})</td>
                            <td class="py-3.5 px-4">${p.patientType === 'antenatal' ? 'Antenatal / OB' : 'Regular'}</td>
                            <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate">${escapeHTML(p.doctorSoap?.assessment || p.chiefComplaint)}</td>
                            <td class="py-3.5 px-5 text-right">
                              <button onclick="openPatientWorkspace('${escapeHTML(p.id)}', 'soap')" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer">Open Chart</button>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  window.toggleFollowUpSection = () => {
    appState.followUpExpanded = !appState.followUpExpanded;
    renderHome();
  };

  window.startNewPatientRegistration = () => {
    appState.pendingAttachments = [];
    switchView('registration');
  };

  // ============================================================================
  // REGISTRATION & TRIAGE VIEW
  // ============================================================================
  function calculateBMIValue(weightKg: any, heightCm: any) {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (!w || !h || h <= 0) return { bmi: '', category: 'Enter Wt & Ht' };
    const hMeters = h / 100;
    const bmiVal = (w / (hMeters * hMeters)).toFixed(1);
    const num = parseFloat(bmiVal);
    let cat = 'Normal (Asia-Pacific)';
    if (num < 18.5) cat = 'Underweight (<18.5)';
    else if (num >= 18.5 && num <= 22.9) cat = 'Normal (18.5–22.9)';
    else if (num >= 23.0 && num <= 24.9) cat = 'Overweight (23.0–24.9)';
    else if (num >= 25.0 && num <= 29.9) cat = 'Obese I (25.0–29.9)';
    else if (num >= 30.0) cat = 'Obese II (≥30.0)';
    return { bmi: bmiVal, category: cat };
  }

  window.updateRegBMI = () => {
    const w = (document.getElementById('reg-weight') as HTMLInputElement)?.value;
    const h = (document.getElementById('reg-height') as HTMLInputElement)?.value;
    const res = calculateBMIValue(w, h);
    const bmiInput = document.getElementById('reg-bmi') as HTMLInputElement;
    const bmiCatEl = document.getElementById('reg-bmi-cat');
    if (bmiInput) bmiInput.value = res.bmi;
    if (bmiCatEl) bmiCatEl.textContent = res.category;
  };

  window.toggleRegPatientType = (type: string) => {
    const hiddenInput = document.getElementById('reg-patient-type') as HTMLInputElement;
    if (hiddenInput) hiddenInput.value = type;
    const btnReg = document.getElementById('btn-type-regular');
    const btnAnc = document.getElementById('btn-type-antenatal');
    const sexSelect = document.getElementById('reg-sex') as HTMLSelectElement;

    if (type === 'antenatal') {
      if (btnAnc) btnAnc.className = 'flex-1 py-3 px-4 rounded-xl border-2 border-teal-600 bg-teal-50/70 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer';
      if (btnReg) btnReg.className = 'flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer';
      if (sexSelect) sexSelect.value = 'Female';
    } else {
      if (btnReg) btnReg.className = 'flex-1 py-3 px-4 rounded-xl border-2 border-teal-600 bg-teal-50/70 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer';
      if (btnAnc) btnAnc.className = 'flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer';
    }
  };

  function renderRegistration(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    const today = new Date().toISOString().split('T')[0];

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Uniform Green Banner Title -->
        <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">New Patient Registration</h2>
          </div>
          <button onclick="switchView('home')" class="self-start sm:self-auto px-4 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition cursor-pointer">
            ← Back to Home
          </button>
        </div>

        <!-- Active Patient Card Below Banner (Full Width on Desktop) -->
        ${renderPatientSelectorBannerHTML(appState, getActivePatient())}

        <div class="w-full">
        <form onsubmit="handleSaveRegistration(event)" class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">1. Select Consultation Category</label>
            <input type="hidden" id="reg-patient-type" value="regular">
            <div class="flex flex-col sm:flex-row gap-3">
              <button type="button" id="btn-type-regular" onclick="toggleRegPatientType('regular')" class="flex-1 py-3 px-4 rounded-xl border-2 border-teal-600 bg-teal-50/70 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                <span>General / Outpatient Consultation</span>
              </button>
              <button type="button" id="btn-type-antenatal" onclick="toggleRegPatientType('antenatal')" class="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer">
                <span>Antenatal / Maternal Care (OB-GYN)</span>
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-200 mb-4">2. Patient Demographics</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name <span class="text-teal-700">*</span></label>
                <input id="reg-name" type="text" required placeholder="e.g., Pedro Penduko" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Age <span class="text-teal-700">*</span></label>
                <input id="reg-age" type="number" required min="0" max="120" placeholder="45" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Sex <span class="text-teal-700">*</span></label>
                <select id="reg-sex" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input id="reg-dob" type="date" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Civil Status</label>
                <select id="reg-civil" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Mobile / Contact No.</label>
                <input id="reg-contact" type="text" placeholder="0917-XXX-XXXX" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Consultation Date</label>
                <input id="reg-date" type="date" value="${today}" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div class="sm:col-span-3">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Complete Address</label>
                <input id="reg-address" type="text" placeholder="Barangay, City/Municipality, Province" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">PhilHealth PIN</label>
                <input id="reg-philhealth" type="text" placeholder="XX-XXXXXXXXX-X" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-200 mb-4">3. Vital Signs & Anthropometrics (Auto-BMI)</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">BP (mmHg)</label>
                <input id="reg-bp" type="text" placeholder="120/80" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">HR (bpm)</label>
                <input id="reg-hr" type="text" placeholder="78" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">RR (cpm)</label>
                <input id="reg-rr" type="text" placeholder="18" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Temp (°C)</label>
                <input id="reg-temp" type="text" placeholder="36.8" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">SpO2 (%)</label>
                <input id="reg-spo2" type="text" placeholder="98" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Weight (kg)</label>
                <input id="reg-weight" type="number" step="0.1" oninput="updateRegBMI()" placeholder="65" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Height (cm)</label>
                <input id="reg-height" type="number" step="0.1" oninput="updateRegBMI()" placeholder="162" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-teal-700 mb-1">BMI (kg/m²)</label>
                <input id="reg-bmi" type="text" readonly placeholder="Auto" class="w-full px-3 py-2 rounded-xl border border-teal-300 bg-teal-50/60 text-teal-900 font-bold text-xs">
                <span id="reg-bmi-cat" class="block text-[9px] text-teal-700 font-medium mt-0.5 truncate">Enter Wt & Ht</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-200 mb-4">4. Clinical Triage & History</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Known Allergies (Drugs / Food)</label>
                <input id="reg-allergies" type="text" value="No Known Drug Allergies (NKDA)" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Comorbidities / Past Medical History</label>
                <input id="reg-comorbidities" type="text" placeholder="e.g., Hypertension, Bronchial Asthma" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Chief Complaint <span class="text-teal-700">*</span></label>
                <input id="reg-cc" type="text" required placeholder="e.g., Fever and productive cough for 4 days OR Routine Prenatal Check-up" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">History of Present Illness (HPI)</label>
                <textarea id="reg-hpi" rows="3" placeholder="Brief narrative of symptom onset, character, severity, and prior medications taken..." class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"></textarea>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Pertinent Physical Examination Findings</label>
                <textarea id="reg-pe" rows="2" placeholder="Conscious, coherent, not in cardiorespiratory distress..." class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">Conscious, coherent, not in cardiorespiratory distress. Anicteric sclerae, pink palpebral conjunctivae. Clear breath sounds, normal cardiac rate and regular rhythm. Abdomen soft, non-tender.</textarea>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
            <button type="button" onclick="switchView('home')" class="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              Save Patient & Proceed →
            </button>
          </div>
        </form>
        </div>
      </div>
    `;
  }

  window.handleSaveRegistration = (e: Event) => {
    e.preventDefault();
    const pType = (document.getElementById('reg-patient-type') as HTMLInputElement)?.value || 'regular';
    const w = (document.getElementById('reg-weight') as HTMLInputElement)?.value || '';
    const h = (document.getElementById('reg-height') as HTMLInputElement)?.value || '';
    const bmiObj = calculateBMIValue(w, h);
    const newId = `PT-2025-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: any = {
      id: newId,
      patientType: pType,
      name: (document.getElementById('reg-name') as HTMLInputElement).value.trim(),
      age: (document.getElementById('reg-age') as HTMLInputElement).value.trim(),
      sex: (document.getElementById('reg-sex') as HTMLSelectElement).value,
      dob: (document.getElementById('reg-dob') as HTMLInputElement).value,
      civilStatus: (document.getElementById('reg-civil') as HTMLSelectElement).value,
      contact: (document.getElementById('reg-contact') as HTMLInputElement).value.trim(),
      consultationDate: (document.getElementById('reg-date') as HTMLInputElement).value,
      address: (document.getElementById('reg-address') as HTMLInputElement).value.trim(),
      philhealth: (document.getElementById('reg-philhealth') as HTMLInputElement).value.trim(),
      allergies: (document.getElementById('reg-allergies') as HTMLInputElement).value.trim() || 'No Known Drug Allergies (NKDA)',
      comorbidities: (document.getElementById('reg-comorbidities') as HTMLInputElement).value.trim() || 'None reported',
      vitals: {
        bp: (document.getElementById('reg-bp') as HTMLInputElement).value.trim() || '120/80',
        hr: (document.getElementById('reg-hr') as HTMLInputElement).value.trim() || '78',
        rr: (document.getElementById('reg-rr') as HTMLInputElement).value.trim() || '18',
        temp: (document.getElementById('reg-temp') as HTMLInputElement).value.trim() || '36.7',
        spo2: (document.getElementById('reg-spo2') as HTMLInputElement).value.trim() || '98',
        weight: w,
        height: h,
        bmi: bmiObj.bmi,
        bmiCategory: bmiObj.category
      },
      chiefComplaint: (document.getElementById('reg-cc') as HTMLInputElement).value.trim(),
      hpi: (document.getElementById('reg-hpi') as HTMLTextAreaElement).value.trim(),
      peFindings: (document.getElementById('reg-pe') as HTMLTextAreaElement).value.trim(),
      anc:
        pType === 'antenatal'
          ? {
              gravida: 1, para: 0, term: 0, preterm: 0, abortion: 0, living: 0,
              lmp: '', aogWeeks: '', edc: '', trimester: '1st',
              fht: '', fundicHeight: '', presentation: 'Cephalic', fetalMovement: 'Present / Active',
              edema: 'None', bloodType: '', dangerSigns: [],
              ironFolate: 'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg 1 tab OD',
              calcium: 'Calcium Carbonate 500mg 1 tab TID',
              tetanusStatus: 'TT1 / Td1', deworming: 'Not Yet Given',
              facilityBirthPlan: '', philhealthStatus: 'Active Member',
              emergencyTransport: '', bloodDonorName: '', companionName: '', obNotes: ''
            }
          : {},
      aiSoap: null,
      doctorSoap: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        followUpDate: '',
        medications: []
      },
      diagnostics: {
        labs: [],
        imaging: [],
        clinicalImpression: '',
        notes: ''
      },
      consultationHistory: [],
      attachments: []
    };

    newPatient.aiSoap = generateLiveAISoapFromPatient(newPatient);
    newPatient.doctorSoap.subjective = newPatient.aiSoap.subjectiveSummary;
    newPatient.doctorSoap.objective = newPatient.aiSoap.objectiveSummary;

    if (appState.aiSoapEnabled !== false) {
      newPatient.doctorSoap.assessment = newPatient.aiSoap.primaryImpression;
      newPatient.doctorSoap.plan = newPatient.aiSoap.suggestedPlan;
      newPatient.doctorSoap.medications = JSON.parse(JSON.stringify(newPatient.aiSoap.suggestedMeds));
      newPatient.diagnostics.clinicalImpression = newPatient.aiSoap.primaryImpression;
    } else {
      newPatient.doctorSoap.assessment = '';
      newPatient.doctorSoap.plan = '';
      newPatient.doctorSoap.medications = [];
      newPatient.diagnostics.clinicalImpression = '';
    }

    newPatient.consultationHistory = [
      {
        date: newPatient.consultationDate || new Date().toISOString().split('T')[0],
        type: pType === 'antenatal' ? 'Antenatal Visit' : 'Outpatient Consultation',
        chiefComplaint: newPatient.chiefComplaint || 'Consultation',
        vitalsSummary: `BP ${newPatient.vitals.bp}, HR ${newPatient.vitals.hr}, Temp ${newPatient.vitals.temp}°C, Wt ${newPatient.vitals.weight || '-'}kg`,
        assessment: newPatient.doctorSoap.assessment || 'Clinical Evaluation in Progress',
        planSummary: newPatient.doctorSoap.plan || '',
        medsSummary:
          (newPatient.doctorSoap.medications || []).map((m: any) => `${m.genericName} (${m.sig})`).join('; ') || 'None'
      }
    ];

    appState.patients.unshift(newPatient);
    appState.activePatientId = newPatient.id;
    saveState();

    if (pType === 'antenatal') {
      showToast(`Registered ${newPatient.name} (Saved Offline & Cloud) — Opening Antenatal Care`);
      switchView('anc');
    } else {
      showToast(
        appState.aiSoapEnabled !== false
          ? `Registered ${newPatient.name} — AI SOAP Generated`
          : `Registered ${newPatient.name} — Ready for Manual / Offline CPG Judgment`
      );
      switchView('soap');
    }
  };

  // ============================================================================
  // ANTENATAL CARE, SOAP, RX, DIAGNOSTICS, RECORDS HANDLERS
  // ============================================================================
  function renderAntenatalCare(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildAntenatalCareHTML(appState, getActivePatient());
  }

  window.setAncActiveTab = (tabId: string) => {
    appState.ancActiveTab = tabId;
    renderAntenatalCare();
  };

  window.setAncScreeningFilter = (filterVal: string) => {
    appState.ancScreeningFilter = filterVal;
    renderAntenatalCare();
  };

  function syncAncPatientOwnSoap(p: any): void {
    p.aiSoap = generateLiveAISoapFromPatient(p);
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
    p.doctorSoap.objective = p.aiSoap.objectiveSummary;
    p.doctorSoap.assessment = p.aiSoap.primaryImpression;
    p.doctorSoap.plan = p.aiSoap.suggestedPlan;
    const ancPreviewEl = document.getElementById('anc-printable-a4');
    if (ancPreviewEl) {
      ancPreviewEl.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'ANC');
    }
    const nanayEl = document.getElementById('nanay-rekord-printable-sheet');
    if (nanayEl) {
      nanayEl.innerHTML = buildRekordNiNanayHalfBondHTML(appState.doctor, p);
    }
  }

  window.updateAncField = (key: string, value: any) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc[key] = value;
    syncAncPatientOwnSoap(p);
    saveState();
  };

  window.addAncPrenatalVisit = () => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    const currentVisits = [...getPatientPrenatalVisits(p)];
    const nextNo = currentVisits.length + 1;
    const today = new Date().toISOString().split('T')[0];
    currentVisits.push({
      visitNo: nextNo,
      date: today,
      aog: `${p.anc.aogWeeks || ''} (${p.anc.trimester || '2nd'} Tri)`.trim(),
      bpWeight: `${p.vitals?.bp || '110/70'} mmHg • ${p.vitals?.weight || '-'} kg`,
      obExam: `FH: ${p.anc.fundicHeight || '-'} • FHT: ${p.anc.fht || '-'} • ${p.anc.presentation || 'Cephalic'}`,
      careSummary: `${p.anc.tetanusStatus || 'Td'} • Continue Iron+Folate & Calcium`,
      nextVisit: p.doctorSoap?.followUpDate || 'In 4 weeks'
    });
    p.anc.prenatalVisits = currentVisits;
    p.anc.prenatalVisitCount = currentVisits.length;
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
    showToast(`Added Prenatal Visit #${nextNo} to Rekord ni Nanay ${p.name}`);
  };

  window.updateAncPrenatalVisit = (idx: number, field: string, value: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    if (!Array.isArray(p.anc.prenatalVisits) || p.anc.prenatalVisits.length === 0) {
      p.anc.prenatalVisits = [...getPatientPrenatalVisits(p)];
    }
    if (!p.anc.prenatalVisits[idx]) return;
    p.anc.prenatalVisits[idx][field] = value;
    syncAncPatientOwnSoap(p);
    saveState();
  };

  window.removeAncPrenatalVisit = (idx: number) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    const currentVisits = [...getPatientPrenatalVisits(p)];
    if (currentVisits.length <= 1) {
      showToast('At least 1 prenatal visit record is kept on Rekord ni Nanay.', 'warning');
      return;
    }
    currentVisits.splice(idx, 1);
    currentVisits.forEach((v: any, i: number) => {
      v.visitNo = i + 1;
    });
    p.anc.prenatalVisits = currentVisits;
    p.anc.prenatalVisitCount = currentVisits.length;
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
    showToast('Removed prenatal visit row');
  };

  function computeAndApplyLmpDetails(p: any, lmpStr: string): void {
    if (!p.anc) p.anc = {};
    p.anc.lmp = lmpStr;
    if (lmpStr && /^\d{4}-\d{2}-\d{2}$/.test(lmpStr)) {
      const [y, m, d] = lmpStr.split('-').map(Number);
      const lmpDate = new Date(y, m - 1, d);
      if (!isNaN(lmpDate.getTime())) {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lmpDate.getTime()) / 86400000);
        if (diffDays >= 0) {
          const weeks = Math.floor(diffDays / 7);
          const days = diffDays % 7;
          p.anc.aogWeeks = `${weeks} weeks ${days} days`;
          if (weeks < 14) p.anc.trimester = '1st';
          else if (weeks < 28) p.anc.trimester = '2nd';
          else p.anc.trimester = '3rd';
          appState.ancScreeningFilter = p.anc.trimester;
        }
        const edcDate = new Date(lmpDate.getTime() + 280 * 86400000);
        const ey = edcDate.getFullYear();
        const em = String(edcDate.getMonth() + 1).padStart(2, '0');
        const ed = String(edcDate.getDate()).padStart(2, '0');
        p.anc.edc = `${ey}-${em}-${ed}`;
      }
    }
    syncAncPatientOwnSoap(p);
    saveState();

    // Update DOM inputs in-place so typing or selecting never loses focus
    const aogEl = document.getElementById('anc-aog-input') as HTMLInputElement | null;
    if (aogEl) aogEl.value = p.anc.aogWeeks || '';
    const edcEl = document.getElementById('anc-edc-input') as HTMLInputElement | null;
    if (edcEl) edcEl.value = p.anc.edc || '';
    const trimEl = document.getElementById('anc-trimester-select') as HTMLSelectElement | null;
    if (trimEl && p.anc.trimester) trimEl.value = p.anc.trimester;
  }

  window.handleAncLmpDropdownChange = () => {
    const p = getActivePatient();
    if (!p) return;
    const mEl = document.getElementById('anc-lmp-month') as HTMLSelectElement | null;
    const dEl = document.getElementById('anc-lmp-day') as HTMLSelectElement | null;
    const yEl = document.getElementById('anc-lmp-year') as HTMLSelectElement | null;
    const m = mEl?.value || '';
    const d = dEl?.value || '';
    const y = yEl?.value || '';
    if (y && m && d) {
      const maxDays = new Date(Number(y), Number(m), 0).getDate();
      const clampedDay = String(Math.min(Number(d), maxDays)).padStart(2, '0');
      if (dEl && dEl.value !== clampedDay) dEl.value = clampedDay;
      const fullDate = `${y}-${m}-${clampedDay}`;
      const dateInput = document.getElementById('anc-lmp-input') as HTMLInputElement | null;
      if (dateInput) dateInput.value = fullDate;
      computeAndApplyLmpDetails(p, fullDate);
    }
  };

  window.handleAncLmpDirectInput = (lmpStr: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (lmpStr && /^\d{4}-\d{2}-\d{2}$/.test(lmpStr)) {
      const [y, m, d] = lmpStr.split('-');
      const mEl = document.getElementById('anc-lmp-month') as HTMLSelectElement | null;
      const dEl = document.getElementById('anc-lmp-day') as HTMLSelectElement | null;
      const yEl = document.getElementById('anc-lmp-year') as HTMLSelectElement | null;
      if (mEl) mEl.value = m;
      if (dEl) dEl.value = d;
      if (yEl) yEl.value = y;
    }
    computeAndApplyLmpDetails(p, lmpStr);
  };

  window.handleAncLmpChange = (lmpStr: string) => {
    window.handleAncLmpDirectInput(lmpStr);
  };

  window.handleAncTrimesterChange = (trimVal: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc.trimester = trimVal;
    appState.ancScreeningFilter = trimVal;
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
  };

  window.toggleAncDangerSign = (sign: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    if (!Array.isArray(p.anc.dangerSigns)) p.anc.dangerSigns = [];
    const idx = p.anc.dangerSigns.indexOf(sign);
    if (idx >= 0) p.anc.dangerSigns.splice(idx, 1);
    else p.anc.dangerSigns.push(sign);
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
  };

  window.orderAllTrimesterTests = (targetTrimester?: string) => {
    const p = getActivePatient();
    if (!p) return;
    const tKey = targetTrimester || p.anc?.trimester || '1st';
    const bundle = resolveAncTrimesterBundle(tKey);
    if (!p.diagnostics) p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', notes: '' };
    (bundle.labs || []).forEach((l: string) => {
      if (!p.diagnostics.labs.includes(l)) p.diagnostics.labs.push(l);
    });
    (bundle.imaging || []).forEach((img: string) => {
      if (!p.diagnostics.imaging.includes(img)) p.diagnostics.imaging.push(img);
    });
    saveState();
    renderAntenatalCare();
    showToast(`Ordered all ${bundle.key} Labs & Ultrasound to Diagnostic Request`);
  };

  window.syncAncToSoapAndProceed = () => {
    const p = getActivePatient();
    if (!p) return;
    p.patientType = 'antenatal';
    p.aiSoap = generateLiveAISoapFromPatient(p);
    p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
    p.doctorSoap.objective = p.aiSoap.objectiveSummary;
    if (appState.aiSoapEnabled !== false) {
      p.doctorSoap.assessment = p.aiSoap.primaryImpression;
      p.doctorSoap.plan = p.aiSoap.suggestedPlan;
    }
    saveState();
    switchView('soap');
    showToast(
      appState.aiSoapEnabled !== false
        ? 'Synced Antenatal data into Official SOAP Note'
        : 'Synced Antenatal Subjective & Objective — Use Offline CPG Panel for Assessment & Plan'
    );
  };

  function renderSoapWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    const p = getActivePatient();
    const aiHTML = p ? buildAiSoapLeftInnerHTML(p) : '';
    main.innerHTML = buildSoapWorkspaceHTML(appState, p, aiHTML);
  }

  function renderPrescriptionWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildPrescriptionWorkspaceHTML(appState, getActivePatient());
  }

  window.setRxPrintMode = (mode: string) => {
    appState.rxPrintMode = mode;
    renderPrescriptionWorkspace();
  };

  function renderDiagnosticsWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildDiagnosticsWorkspaceHTML(appState, getActivePatient());
  }

  window.setDiagActiveTab = (tab: string) => {
    appState.diagActiveTab = tab;
    renderDiagnosticsWorkspace();
  };

  window.toggleDiagnosticTest = (category: 'labs' | 'imaging', item: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.diagnostics) p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', notes: '' };
    const list = p.diagnostics[category];
    const idx = list.indexOf(item);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(item);
    saveState();
    if (appState.currentView === 'anc') renderAntenatalCare();
    else renderDiagnosticsWorkspace();
  };

  window.updateDiagField = (field: string, val: string) => {
    const p = getActivePatient();
    if (!p) return;
    if (!p.diagnostics) p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', notes: '' };
    p.diagnostics[field] = val;
    saveState();
  };

  window.addCustomDiagnosticTest = () => {
    const p = getActivePatient();
    const input = document.getElementById('custom-diag-input') as HTMLInputElement;
    if (!p || !input || !input.value.trim()) return;
    const val = input.value.trim();
    const target = appState.diagActiveTab === 'imaging' ? 'imaging' : 'labs';
    if (!p.diagnostics[target].includes(val)) {
      p.diagnostics[target].push(val);
    }
    input.value = '';
    saveState();
    renderDiagnosticsWorkspace();
    showToast(`Added "${val}" to Diagnostic Request`);
  };

  function renderPatientRecords(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildPatientRecordsHTML(appState);
  }

  window.setRecordsTab = (tab: string) => {
    appState.recordsActiveTab = tab;
    renderPatientRecords();
  };

  window.updateRecordsSearch = (q: string) => {
    appState.recordsSearchQuery = q;
    renderPatientRecords();
  };

  window.openPatientWorkspace = (id: string, view: string) => {
    appState.activePatientId = id;
    saveState();
    closeModal();
    switchView(view);
  };

  window.deletePatientRecord = (id: string) => {
    appState.patients = appState.patients.filter((p: any) => p.id !== id);
    if (appState.activePatientId === id) {
      appState.activePatientId = appState.patients[0]?.id || null;
    }
    if (appState.registryPreviewPatientId === id) {
      appState.registryPreviewPatientId = '';
      appState.registryPreviewDocType = '';
    }
    saveState();
    renderPatientRecords();
    showToast('Deleted patient record from your registry');
  };

  window.toggleRegistryPatientFolder = (patientId: string) => {
    if (appState.registryOpenFolderPatientId === patientId) {
      appState.registryOpenFolderPatientId = '__NONE__';
      if (appState.registryPreviewPatientId === patientId) {
        appState.registryPreviewPatientId = '';
        appState.registryPreviewDocType = '';
      }
    } else {
      appState.registryOpenFolderPatientId = patientId;
    }
    renderPatientRecords();
  };

  window.openRegistryPatientPdf = (patientId: string, docType: string) => {
    appState.registryOpenFolderPatientId = patientId;
    if (
      appState.registryPreviewPatientId === patientId &&
      appState.registryPreviewDocType === docType
    ) {
      appState.registryPreviewPatientId = '';
      appState.registryPreviewDocType = '';
    } else {
      appState.registryPreviewPatientId = patientId;
      appState.registryPreviewDocType = docType;
    }
    renderPatientRecords();
  };

  window.closeRegistryPatientPdf = () => {
    appState.registryPreviewPatientId = '';
    appState.registryPreviewDocType = '';
    renderPatientRecords();
  };

  // ============================================================================
  // TARGETED PAPER DOCUMENT PRINT & PDF DOWNLOAD HELPERS
  // ============================================================================
  window.printDocumentElement = (elementId: string, pageSize = 'A4 portrait') => {
    const el = document.getElementById(elementId);
    if (!el) {
      window.print();
      return;
    }

    // Isolate target paper document so only it prints in browser print dialog
    document.querySelectorAll('.print-only-target').forEach((node) => {
      node.removeAttribute('data-active-print-target');
    });
    el.setAttribute('data-active-print-target', 'true');
    document.body.classList.add('printing-specific-element');

    let styleEl = document.getElementById('dynamic-print-page-style') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-print-page-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@media print { @page { size: ${pageSize}; margin: 6mm; } }`;

    const cleanup = () => {
      document.body.classList.remove('printing-specific-element');
      el.removeAttribute('data-active-print-target');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    window.print();
    setTimeout(cleanup, 1200);
  };

  window.downloadPdfElement = async (elementId: string, filename: string, formatType: string) => {
    const el = document.getElementById(elementId) as HTMLElement | null;
    if (!el) {
      showToast('Document element not found for PDF generation', 'warning');
      return;
    }

    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    showToast(`Generating ${safeFilename}...`);

    try {
      const isLandscape = formatType === 'a5-landscape';
      const pdfFormat = formatType === 'a6' ? 'a6' : formatType === 'a5-landscape' ? 'a5' : 'a4';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: pdfFormat
      });

      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();
      const marginMm = formatType === 'a6' ? 4 : 6;
      const usableWidthMm = pageWidthMm - marginMm * 2;
      const usableHeightMm = pageHeightMm - marginMm * 2;

      // Check if container holds multiple explicit pages (e.g., Export All Patients SOAP PDF)
      const childPages = Array.from(el.querySelectorAll(':scope > .pdf-page-break')) as HTMLElement[];

      if (childPages.length > 0) {
        for (let i = 0; i < childPages.length; i++) {
          if (i > 0) pdf.addPage();
          const pageNode = childPages[i];
          const canvas = await html2canvas(pageNode, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.96);
          const ratio = canvas.height / canvas.width;
          let renderW = usableWidthMm;
          let renderH = renderW * ratio;
          if (renderH > usableHeightMm) {
            renderH = usableHeightMm;
            renderW = renderH / ratio;
          }
          const offsetX = marginMm + (usableWidthMm - renderW) / 2;
          pdf.addImage(imgData, 'JPEG', offsetX, marginMm, renderW, renderH);
        }
      } else {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgWidthMm = usableWidthMm;
        const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

        if (imgHeightMm <= usableHeightMm * 1.08) {
          // Fits on a single page (scale slightly if within 8% tolerance)
          const finalH = Math.min(imgHeightMm, usableHeightMm);
          const finalW = imgHeightMm > usableHeightMm ? (canvas.width * finalH) / canvas.height : imgWidthMm;
          const offsetX = marginMm + (usableWidthMm - finalW) / 2;
          const imgData = canvas.toDataURL('image/jpeg', 0.96);
          pdf.addImage(imgData, 'JPEG', offsetX, marginMm, finalW, finalH);
        } else {
          // Multi-page vertical slicing for long documents
          const pageCanvasHeightPx = Math.floor((usableHeightMm * canvas.width) / imgWidthMm);
          let renderedHeightPx = 0;
          let pageIndex = 0;

          while (renderedHeightPx < canvas.height) {
            if (pageIndex > 0) pdf.addPage();
            const sliceHeightPx = Math.min(pageCanvasHeightPx, canvas.height - renderedHeightPx);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeightPx;
            const ctx = sliceCanvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
              ctx.drawImage(
                canvas,
                0,
                renderedHeightPx,
                canvas.width,
                sliceHeightPx,
                0,
                0,
                canvas.width,
                sliceHeightPx
              );
              const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.96);
              const sliceHeightMm = (sliceHeightPx * imgWidthMm) / canvas.width;
              pdf.addImage(sliceData, 'JPEG', marginMm, marginMm, imgWidthMm, sliceHeightMm);
            }
            renderedHeightPx += sliceHeightPx;
            pageIndex++;
          }
        }
      }

      // Trigger direct Blob download via anchor tag so it works reliably inside iframes and all browsers
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      showToast(`Downloaded ${safeFilename}`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      showToast('PDF download failed — opening print dialog instead.', 'warning');
      window.printDocumentElement(
        elementId,
        formatType === 'a5-landscape' ? 'A5 landscape' : formatType === 'a6' ? 'A6 portrait' : 'A4 portrait'
      );
    }
  };

  // ============================================================================
  // MODALS: CLINICIAN PROFILE / SETTINGS & RETURNING PATIENT LOOKUP
  // ============================================================================
  function closeModal(): void {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }
    if (content) content.innerHTML = '';
  }

  window.closeModal = closeModal;

  window.openDoctorSettingsModal = () => {
    if (!appState.activeClinician) {
      renderAuthScreen();
      return;
    }
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;

    const doc = appState.doctor;

    content.innerHTML = `
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">${escapeHTML(doc.role || 'Doctor')} Profile</span>
            <h3 class="text-base font-extrabold text-slate-900 mt-1">Clinician, Facility & Header Settings</h3>
            <p class="text-xs text-slate-500">Changes automatically appear on your SOAP Note, Lab Request, and Prescription PDFs.</p>
          </div>
          <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
        </div>

        <form onsubmit="saveDoctorSettingsModal(event)" class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Full Name & Title</label>
              <input id="modal-doc-name" type="text" required value="${escapeHTML(doc.name)}" class="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Role</label>
              <select id="modal-doc-role" class="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white">
                <option value="Doctor" ${doc.role === 'Doctor' ? 'selected' : ''}>Doctor / Physician</option>
                <option value="Medical Clerk" ${doc.role === 'Medical Clerk' ? 'selected' : ''}>Medical Clerk</option>
                <option value="Medical Intern" ${doc.role === 'Medical Intern' ? 'selected' : ''}>Medical Intern</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Specialty / Rotation</label>
              <input id="modal-doc-specialty" type="text" value="${escapeHTML(doc.specialty || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-300">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone / Contact No.</label>
              <input id="modal-doc-phone" type="text" value="${escapeHTML(doc.phone || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-300">
            </div>
          </div>

          <div class="p-3 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2.5">
            <p class="text-[11px] font-extrabold uppercase text-teal-900">Assigned Facility (Printed on SOAP, Lab Request & Rx)</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Assigned Facility / Clinic Name</label>
                <input id="modal-doc-facility" type="text" required value="${escapeHTML(doc.facility || doc.clinic || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Facility / Clinic Address</label>
                <input id="modal-doc-address" type="text" value="${escapeHTML(doc.address || '')}" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-100 border border-slate-200 space-y-2.5">
            <p class="text-[11px] font-extrabold uppercase text-slate-800">Clerk / Intern Affiliation & Supervising Doctor (Editable)</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Current Affiliation School</label>
                <input id="modal-doc-school" type="text" value="${escapeHTML(doc.school || '')}" placeholder="e.g., UP College of Medicine" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Supervising Doctor (Type or Edit)</label>
                <input id="modal-doc-supervising" type="text" value="${escapeHTML(doc.supervisingDoctor || '')}" placeholder="e.g., Dr. Maria Clara Santos, MD (PRC #0128492)" class="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">PRC No.</label>
              <input id="modal-doc-prc" type="text" value="${escapeHTML(doc.prc || '')}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">PTR No.</label>
              <input id="modal-doc-ptr" type="text" value="${escapeHTML(doc.ptr || '')}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">S2 No.</label>
              <input id="modal-doc-s2" type="text" value="${escapeHTML(doc.s2 || '')}" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300">
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <button type="button" onclick="handleSignOut()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer">
              Sign Out / Switch Clinician
            </button>
            <div class="flex gap-2">
              <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  };

  window.saveDoctorSettingsModal = (e: Event) => {
    e.preventDefault();
    if (!appState.activeClinician) return;
    const acc = appState.activeClinician;
    acc.name = (document.getElementById('modal-doc-name') as HTMLInputElement).value.trim();
    acc.role = (document.getElementById('modal-doc-role') as HTMLSelectElement).value as any;
    acc.specialty = (document.getElementById('modal-doc-specialty') as HTMLInputElement).value.trim();
    acc.phone = (document.getElementById('modal-doc-phone') as HTMLInputElement).value.trim();
    acc.facility = (document.getElementById('modal-doc-facility') as HTMLInputElement).value.trim();
    acc.address = (document.getElementById('modal-doc-address') as HTMLInputElement).value.trim();
    acc.school = (document.getElementById('modal-doc-school') as HTMLInputElement).value.trim();
    acc.supervisingDoctor = (document.getElementById('modal-doc-supervising') as HTMLInputElement).value.trim();
    acc.prc = (document.getElementById('modal-doc-prc') as HTMLInputElement).value.trim();
    acc.ptr = (document.getElementById('modal-doc-ptr') as HTMLInputElement).value.trim();
    acc.s2 = (document.getElementById('modal-doc-s2') as HTMLInputElement).value.trim();

    syncDoctorFromClinician(acc);
    saveClinicianAccounts();
    syncClinicianToFirestore(acc);
    updateHeaderDoctorName();
    closeModal();
    switchView(appState.currentView);
    showToast('Updated Clinician & Facility Details across all forms');
  };

  window.openReturningPatientModal = () => {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    const patients = appState.patients || [];

    content.innerHTML = `
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Select Returning Patient</h3>
            <p class="text-xs text-slate-500">Showing patients registered under ${escapeHTML(appState.doctor.name)}.</p>
          </div>
          <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
        </div>
        <div class="space-y-2 max-h-80 overflow-y-auto">
          ${patients.length === 0 ? `<p class="text-xs text-slate-400 italic py-4 text-center">No existing patients in your account yet.</p>` : ''}
          ${patients.map((p: any) => `
            <div class="p-3 rounded-xl border border-slate-200 hover:border-teal-400 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-extrabold text-slate-900">${escapeHTML(p.name)} <span class="font-normal text-slate-500">(${escapeHTML(p.age)}y/${escapeHTML(p.sex)})</span></p>
                <p class="text-[11px] text-slate-500">Last CC: ${escapeHTML(p.chiefComplaint || 'N/A')}</p>
              </div>
              <button onclick="openPatientWorkspace('${escapeHTML(p.id)}', '${p.patientType === 'antenatal' ? 'anc' : 'soap'}')" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer">
                Start Follow-Up →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  };

  // ============================================================================
  // SECTION 13: PHILIPPINE CPG WORKSPACE (SMALL ICON PER CATEGORY + 2-LEVEL ACCORDION)
  // ============================================================================
  window.updateCpgSearch = (val: string) => {
    appState.cpgSearchQuery = val;
    const container = document.getElementById('cpg-cards-container');
    if (container) container.innerHTML = buildCpgCardsHTML();
  };

  window.setCpgCategory = (cat: string) => {
    appState.cpgSelectedCategory = cat;
    if (cat !== 'All' && !appState.openCpgCategories.includes(cat)) {
      appState.openCpgCategories.push(cat);
    }
    renderCpgWorkspace();
  };

  window.toggleCpgCategoryAccordion = (cat: string) => {
    const idx = appState.openCpgCategories.indexOf(cat);
    if (idx > -1) {
      appState.openCpgCategories.splice(idx, 1);
    } else {
      appState.openCpgCategories.push(cat);
    }
    const container = document.getElementById('cpg-cards-container');
    if (container) container.innerHTML = buildCpgCardsHTML();
  };

  window.toggleCpgDiseaseDetails = (cpgId: string) => {
    const idx = appState.openCpgIds.indexOf(cpgId);
    if (idx > -1) {
      appState.openCpgIds.splice(idx, 1);
    } else {
      appState.openCpgIds.push(cpgId);
    }
    const container = document.getElementById('cpg-cards-container');
    if (container) container.innerHTML = buildCpgCardsHTML();
  };

  window.applyCpgToSoapPlan = (cpgId: string) => {
    const cpg = PH_CPG_CATALOG.find((c: any) => c.id === cpgId);
    const p = getActivePatient();
    if (!cpg || !p) {
      showToast('Select or register a patient first to apply CPG protocol', 'warning');
      return;
    }

    const summaryText = (cpg.soapPlanSummary || [])
      .map((line: string, i: number) => `${i + 1}. ${line}`)
      .join('\n');

    const protocolBlock = `[${cpg.title} CPG Protocol — ${cpg.source || 'PH CPG'}]\n${summaryText}`;

    p.doctorSoap.plan = p.doctorSoap.plan
      ? `${p.doctorSoap.plan}\n\n${protocolBlock}`
      : protocolBlock;

    if (!p.doctorSoap.assessment) {
      p.doctorSoap.assessment = cpg.title;
    }

    saveState();
    showToast(`Applied "${cpg.title}" CPG protocol to ${p.name}'s SOAP Plan`);
    switchView('soap');
  };

  function getCategoryIconSvg(cat: string): string {
    switch (cat) {
      case 'All':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`;
      case 'Cardiovascular':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h2l1.5-3 2 6 1.5-3h2"/></svg>`;
      case 'Endocrine & Metabolic':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>`;
      case 'Pulmonary & Infectious':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v7m0 0l-3 3m3-3l3 3M7 9c-2.5 1-4 3.5-4 6.5A3.5 3.5 0 006.5 19H9a2 2 0 002-2v-6M17 9c2.5 1 4 3.5 4 6.5a3.5 3.5 0 01-3.5 3.5H15a2 2 0 01-2-2v-6"/></svg>`;
      case 'Neurology & Emergency':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;
      case 'Pediatrics':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      case 'Obstetrics & Maternal Health':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
      case 'Renal & Nephrology':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`;
      case 'Mental Health & Psychiatry':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`;
      case 'Dermatology & Primary Care':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`;
      case 'Rheumatology & Musculoskeletal':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>`;
      case 'Gastroenterology & Hepatology':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      case 'Hematology':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`;
      case 'Oncology & Preventive Care':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      case 'Emergency & Infectious':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
      case 'Hepatology & Endocrinology':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`;
      case 'ENT & Allergy':
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>`;
      default:
        return `<svg class="w-4 h-4 shrink-0 text-teal-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
    }
  }

  function buildSingleCpgAccordionItem(cpg: any, isSearching: boolean): string {
    const isDiseaseOpen = isSearching || appState.openCpgIds.includes(cpg.id);
    const hasThreeColSnapshot = Array.isArray(cpg.snapshotHeaders) && cpg.snapshotHeaders.length === 3;
    const snapshotRows = Array.isArray(cpg.snapshot) ? cpg.snapshot : [];
    const includedList = Array.isArray(cpg.scope?.included) ? cpg.scope.included : [];
    const excludedList = Array.isArray(cpg.scope?.excluded) ? cpg.scope.excluded : [];
    const strongRecs = Array.isArray(cpg.recommendations?.strong) ? cpg.recommendations.strong : [];
    const conditionalRecs = Array.isArray(cpg.recommendations?.conditional) ? cpg.recommendations.conditional : [];
    const practiceNotes = Array.isArray(cpg.practiceNotes) ? cpg.practiceNotes : [];
    const pathway = cpg.pathway || {};

    return `
      <div class="bg-white rounded-xl border ${isDiseaseOpen ? 'border-teal-500 ring-2 ring-teal-500/10 shadow-sm' : 'border-slate-200 hover:border-teal-400'} overflow-hidden transition-all">
        <!-- Disease Row: Clicking reveals CPG data & info -->
        <div onclick="toggleCpgDiseaseDetails('${escapeHTML(cpg.id)}')" class="p-4 sm:p-5 hover:bg-teal-50/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none transition">
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg ${isDiseaseOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'} flex items-center justify-center shrink-0 mt-0.5 transition-colors">
              <svg class="w-3.5 h-3.5 transition-transform duration-200 ${isDiseaseOpen ? 'rotate-90' : ''}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div class="space-y-0.5">
              <h3 class="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition">${escapeHTML(cpg.title)}</h3>
              <p class="text-xs text-slate-500 line-clamp-1"><strong>Source:</strong> ${escapeHTML(cpg.source || '')}</p>
              ${!isDiseaseOpen ? `<p class="text-[11px] text-teal-700 font-medium">Click disease to view Quick Snapshot, Recommendations & Clinical Pathway</p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-3 self-end sm:self-center shrink-0">
            <button onclick="event.stopPropagation(); applyCpgToSoapPlan('${escapeHTML(cpg.id)}')" class="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition cursor-pointer">
              + Apply to SOAP
            </button>
            <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 ${isDiseaseOpen ? 'rotate-180 text-teal-700' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </div>
        </div>

        <!-- CPG Data and Information Container (Revealed when disease is clicked) -->
        ${isDiseaseOpen ? `
          <div id="cpg-detail-${escapeHTML(cpg.id)}" class="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 space-y-6">
            <div class="space-y-1">
              <span class="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold uppercase tracking-wider">${escapeHTML(cpg.category)}</span>
              <h4 class="text-base sm:text-lg font-bold text-slate-900">${escapeHTML(cpg.title)}</h4>
              <p class="text-xs text-slate-600"><strong>Source:</strong> ${escapeHTML(cpg.source || '')}</p>
              ${cpg.intendedUsers ? `<p class="text-xs text-slate-500"><strong>Intended Users:</strong> ${escapeHTML(cpg.intendedUsers)}</p>` : ''}
            </div>

            <!-- Quick Snapshot Table -->
            ${snapshotRows.length > 0 ? `
              <div>
                <h5 class="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">Quick Snapshot (At-a-Glance)</h5>
                <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table class="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        ${hasThreeColSnapshot ? `
                          <th class="py-2.5 px-4 w-1/4">${escapeHTML(cpg.snapshotHeaders[0])}</th>
                          <th class="py-2.5 px-4 w-1/3">${escapeHTML(cpg.snapshotHeaders[1])}</th>
                          <th class="py-2.5 px-4">${escapeHTML(cpg.snapshotHeaders[2])}</th>
                        ` : `
                          <th class="py-2.5 px-4 w-1/3">Parameter</th>
                          <th class="py-2.5 px-4">Standard Value / Action</th>
                        `}
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      ${snapshotRows.map((row: any) => hasThreeColSnapshot ? `
                        <tr class="hover:bg-slate-50">
                          <td class="py-2.5 px-4 font-bold text-slate-900 align-top">${escapeHTML(row.col1)}</td>
                          <td class="py-2.5 px-4 text-slate-700 align-top">${escapeHTML(row.col2)}</td>
                          <td class="py-2.5 px-4 text-slate-800 font-medium align-top">${escapeHTML(row.col3)}</td>
                        </tr>
                      ` : `
                        <tr class="hover:bg-slate-50">
                          <td class="py-2.5 px-4 font-bold text-slate-900 align-top">${escapeHTML(row.parameter)}</td>
                          <td class="py-2.5 px-4 text-slate-700 align-top">${escapeHTML(row.value)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- Scope & Exclusions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                <h5 class="text-xs font-bold uppercase tracking-wider text-teal-900">1. Included Populations</h5>
                <ul class="list-disc pl-4 space-y-1 text-xs sm:text-sm text-slate-800">
                  ${includedList.map((inc: string) => `<li>${escapeHTML(inc)}</li>`).join('')}
                </ul>
              </div>
              <div class="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2">
                <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900">Excluded / Switch Protocol</h5>
                <ul class="space-y-1.5 text-xs sm:text-sm text-slate-800">
                  ${excludedList.map((exc: any) => `<li><strong class="text-slate-900">${escapeHTML(exc.label)}:</strong> ${escapeHTML(exc.action)}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Strength of Recommendations -->
            <div class="space-y-3">
              <h5 class="text-xs font-bold uppercase tracking-wider text-slate-800">2. Strength of Recommendations</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div class="text-xs font-bold text-teal-800">Strong Recommendations (Directive)</div>
                  <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                    ${strongRecs.map((r: any) => `<li><strong class="text-slate-900">${escapeHTML(r.title)}:</strong> ${escapeHTML(r.detail)}</li>`).join('')}
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div class="text-xs font-bold text-slate-800">Conditional Recommendations (Shared Decision-Making)</div>
                  <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                    ${conditionalRecs.map((r: any) => `<li><strong class="text-slate-900">${escapeHTML(r.title)}:</strong> ${escapeHTML(r.detail)}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Clinical Action Pathway -->
            <div class="space-y-3">
              <h5 class="text-xs font-bold uppercase tracking-wider text-slate-800">3. Clinical Action Pathway</h5>
              ${Array.isArray(pathway.orderedSteps) ? `
                <div class="space-y-2.5">
                  ${pathway.orderedSteps.map((st: any) => `
                    <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                      <div class="text-xs sm:text-sm font-bold text-slate-900">${escapeHTML(st.step)}</div>
                      <p class="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">${escapeHTML(st.detail)}</p>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="space-y-3">
                  ${pathway.stepA ? `
                    <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div class="text-xs sm:text-sm font-bold text-slate-900">${escapeHTML(pathway.stepA.title)}</div>
                      ${pathway.stepA.subtitle ? `<p class="text-xs text-slate-600">${escapeHTML(pathway.stepA.subtitle)}</p>` : ''}
                      <ul class="list-disc pl-5 text-xs sm:text-sm text-slate-700 space-y-1">
                        ${(pathway.stepA.items || []).map((it: any) => `<li><strong>${escapeHTML(it.label)}:</strong> ${escapeHTML(it.detail)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                  ${pathway.stepB ? `
                    <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div class="text-xs sm:text-sm font-bold text-slate-900">${escapeHTML(pathway.stepB.title)}</div>
                      <ul class="list-disc pl-5 text-xs sm:text-sm text-slate-700 space-y-1">
                        ${(pathway.stepB.steps || []).map((st: any) => `<li><strong>${escapeHTML(st.step)}:</strong> ${escapeHTML(st.detail)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                  ${pathway.stepC ? `
                    <div class="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2">
                      <div class="text-xs sm:text-sm font-bold text-slate-900">${escapeHTML(pathway.stepC.title)}</div>
                      ${pathway.stepC.subtitle ? `<p class="text-xs text-slate-700">${escapeHTML(pathway.stepC.subtitle)}</p>` : ''}
                      ${Array.isArray(pathway.stepC.redFlags) ? `
                        <ul class="list-disc pl-5 text-xs sm:text-sm text-slate-800 space-y-1">
                          ${pathway.stepC.redFlags.map((rf: string) => `<li>${escapeHTML(rf)}</li>`).join('')}
                        </ul>
                      ` : ''}
                      ${Array.isArray(pathway.stepC.triageTable) ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                          ${pathway.stepC.triageTable.map((t: any) => `
                            <div class="p-3 rounded-lg border ${t.urgent ? 'bg-teal-900 text-white border-teal-800' : 'bg-white border-slate-200 text-slate-800'} text-xs">
                              <div class="font-extrabold uppercase">${escapeHTML(t.scenario)} → ${escapeHTML(t.classification)}</div>
                              <p class="mt-1">${escapeHTML(t.action)}</p>
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
              `}
            </div>

            <!-- Philippine Practice & Resource Notes -->
            ${practiceNotes.length > 0 ? `
              <div class="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                <h5 class="text-xs font-bold uppercase tracking-wider text-teal-900">4. Philippine Practice &amp; Resource Notes</h5>
                <ul class="space-y-1.5 text-xs sm:text-sm text-slate-800">
                  ${practiceNotes.map((note: any) => `<li><strong class="text-teal-950">${escapeHTML(note.title)}:</strong> ${escapeHTML(note.detail)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  function buildCpgCardsHTML(): string {
    const q = (appState.cpgSearchQuery || '').trim().toLowerCase();
    const selectedCat = appState.cpgSelectedCategory || 'All';
    const isSearching = q.length > 0;

    const filtered = PH_CPG_CATALOG.filter((cpg: any) => {
      const matchesCat = selectedCat === 'All' || cpg.category === selectedCat;
      if (!matchesCat) return false;
      if (!q) return true;
      const matchesQuery =
        (cpg.title || '').toLowerCase().includes(q) ||
        (cpg.source || '').toLowerCase().includes(q) ||
        (cpg.category || '').toLowerCase().includes(q) ||
        (cpg.keywords || []).some((k: string) => k.toLowerCase().includes(q));
      return matchesQuery;
    });

    if (filtered.length === 0) {
      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p class="text-sm font-bold text-slate-700">No Clinical Practice Guidelines matched "${escapeHTML(appState.cpgSearchQuery)}"</p>
          <p class="text-xs text-slate-400 mt-1">Try searching for Hypertension, Diabetes, Dengue, Tuberculosis, Pneumonia, Asthma, Stroke, Leptospirosis, Rabies, or Preeclampsia.</p>
        </div>
      `;
    }

    const groupedCategories: string[] = [];
    filtered.forEach((c: any) => {
      if (!groupedCategories.includes(c.category)) groupedCategories.push(c.category);
    });

    return groupedCategories
      .map((cat) => {
        const catItems = filtered.filter((c: any) => c.category === cat);
        const isCatOpen = isSearching || selectedCat === cat || appState.openCpgCategories.includes(cat);

        return `
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
            <!-- Category Accordion Header with Small Category Icon -->
            <button type="button" onclick="toggleCpgCategoryAccordion('${escapeHTML(cat)}')" class="w-full px-5 py-4 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 shadow-2xs flex items-center justify-center shrink-0">
                  ${getCategoryIconSvg(cat)}
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-extrabold text-slate-900">${escapeHTML(cat)}</h3>
                  <p class="text-[11px] text-slate-500">${catItems.length} Philippine Clinical Practice Guideline${catItems.length > 1 ? 's' : ''} • Click category to ${isCatOpen ? 'hide' : 'view'} diseases</p>
                </div>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  ${catItems.length} ${catItems.length === 1 ? 'Disease' : 'Diseases'}
                </span>
                <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <svg class="w-4 h-4 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            <!-- Diseases List Under Category -->
            ${isCatOpen ? `
              <div class="p-4 bg-slate-50/60 border-t border-slate-200 space-y-2.5">
                ${catItems.map((cpg: any) => buildSingleCpgAccordionItem(cpg, isSearching)).join('')}
              </div>
            ` : ''}
          </div>
        `;
      })
      .join('');
  }

  function renderCpgWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;

    main.innerHTML = `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Philippine Clinical Practice Guidelines (CPG) Library</h2>
          </div>
        </div>

        <!-- Search Bar Only -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div class="relative">
            <input
              type="text"
              value="${escapeHTML(appState.cpgSearchQuery)}"
              oninput="updateCpgSearch(this.value)"
              placeholder="Search Philippine CPGs by disease, ICD-10, drug name (e.g., Losartan, Dengue, PTB, GDM, Leptospirosis)..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Category Accordions -> Disease Rows -> CPG Details -->
        <div id="cpg-cards-container" class="space-y-3">
          ${buildCpgCardsHTML()}
        </div>
      </div>
    `;
  }

  // ============================================================================
  // INITIALIZE SESSION OR SHOW SIGN-IN / SIGN-UP
  // ============================================================================
  loadClinicianAccounts();
  const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (savedSessionId) {
    const found = appState.clinicianAccounts.find((a: ClinicianAccount) => a.id === savedSessionId);
    if (found) {
      appState.activeClinician = found;
      appState.bypassPendingInPreview =
        !navigator.onLine || localStorage.getItem(`medflow_ph_doctor_access_${found.id}`) === 'true';
      syncDoctorFromClinician(found);
      loadClinicianWorkspace(found.id);
    }
  }

  updateHeaderDoctorName();
  if (
    appState.activeClinician &&
    (appState.activeClinician.role !== 'Doctor' ||
      appState.activeClinician.approvalStatus === 'approved' ||
      appState.bypassPendingInPreview)
  ) {
    switchView('home');
  } else {
    renderAuthScreen();
  }
}
