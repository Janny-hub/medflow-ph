import { escapeHTML, renderClearFormIconButtonHTML } from './medflowViews';

export interface BakuNxtVaccineDef {
  id: string;
  code: string;
  name: string;
  targetAge: string;
  minDays: number;
  dose: string;
  route: string;
  site: string;
  sampleLot: string;
  sampleExpiry: string;
}

export interface BakuNxtDoseRecord {
  given: boolean;
  dateGiven: string;
  lotNumber: string;
  expiryDate: string;
  site: string;
  facility: string;
  remarks: string;
}

export interface BakuNxtPatientRecord {
  id: string;
  fsn: string;
  philhealthPin: string;
  facilityName: string;
  childName: string;
  sex: string;
  dob: string;
  birthTime: string;
  birthOrder: string;
  motherName: string;
  fatherName: string;
  contactNumber: string;
  address: string;
  fourPsStatus: string;
  placeOfDelivery: string;
  deliveryType: string;
  attendantAtBirth: string;
  birthWeightGrams: string;
  birthLengthCm: string;
  motherTdStatus: string;
  nbsStatus: string;
  nbsDate: string;
  nhstStatus: string;
  ebfMonth1: boolean;
  ebfMonth2: boolean;
  ebfMonth3: boolean;
  ebfMonth4: boolean;
  ebfMonth5: boolean;
  ebfMonth6: boolean;
  compFeedingDate: string;
  visitDate: string;
  tempCelsius: string;
  currentWeightKg: string;
  currentLengthCm: string;
  muacCm: string;
  nutritionalStatusWFA: string;
  nutritionalStatusLFA: string;
  nutritionalStatusWFL: string;
  contraAcuteIllness: boolean;
  contraAnaphylaxis: boolean;
  contraImmunocompromised: boolean;
  contraConvulsions: boolean;
  clinicalNotes: string;
  vitADate: string;
  mnpDate: string;
  dewormingDate: string;
  doses: Record<string, BakuNxtDoseRecord>;
  aefiObservation: string;
  aefiNotes: string;
  counselParacetamol: boolean;
  counselBcgScar: boolean;
  counselBringCard: boolean;
  counselDangerSigns: boolean;
  nextVisitDate: string;
  nextVisitVaccines: string;
  healthWorker: string;
  visitHistory?: Array<{ date: string; snapshot: any }>;
}

export const DOH_VACCINES: BakuNxtVaccineDef[] = [
  {
    id: 'bcg',
    code: 'BCG',
    name: 'Bacillus Calmette–Guérin (TB)',
    targetAge: 'At Birth (Within 24h)',
    minDays: 0,
    dose: '0.05 mL',
    route: 'Intradermal (ID)',
    site: 'Right Deltoid',
    sampleLot: 'BCG-2601A',
    sampleExpiry: '2027-06-30'
  },
  {
    id: 'hepb_bd',
    code: 'HepB-BD',
    name: 'Hepatitis B (Birth Dose)',
    targetAge: 'At Birth (Within 24h)',
    minDays: 0,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Right Anterolateral Thigh',
    sampleLot: 'HEPB-8841B',
    sampleExpiry: '2027-08-15'
  },
  {
    id: 'penta1',
    code: 'Penta 1',
    name: 'Pentavalent (DPT-HepB-Hib) Dose 1',
    targetAge: '6 Weeks (1½ Months)',
    minDays: 42,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Left Anterolateral Thigh',
    sampleLot: 'PNT-4092C',
    sampleExpiry: '2027-09-30'
  },
  {
    id: 'opv1',
    code: 'OPV 1',
    name: 'Oral Polio Vaccine (bOPV) Dose 1',
    targetAge: '6 Weeks (1½ Months)',
    minDays: 42,
    dose: '2 Drops',
    route: 'Oral (PO)',
    site: 'Mouth',
    sampleLot: 'OPV-1120D',
    sampleExpiry: '2027-05-31'
  },
  {
    id: 'pcv1',
    code: 'PCV 1',
    name: 'Pneumococcal Conjugate (PCV13) Dose 1',
    targetAge: '6 Weeks (1½ Months)',
    minDays: 42,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Right Anterolateral Thigh',
    sampleLot: 'PCV-7731E',
    sampleExpiry: '2027-11-30'
  },
  {
    id: 'penta2',
    code: 'Penta 2',
    name: 'Pentavalent (DPT-HepB-Hib) Dose 2',
    targetAge: '10 Weeks (2½ Months)',
    minDays: 70,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Left Anterolateral Thigh',
    sampleLot: 'PNT-4092C',
    sampleExpiry: '2027-09-30'
  },
  {
    id: 'opv2',
    code: 'OPV 2',
    name: 'Oral Polio Vaccine (bOPV) Dose 2',
    targetAge: '10 Weeks (2½ Months)',
    minDays: 70,
    dose: '2 Drops',
    route: 'Oral (PO)',
    site: 'Mouth',
    sampleLot: 'OPV-1120D',
    sampleExpiry: '2027-05-31'
  },
  {
    id: 'pcv2',
    code: 'PCV 2',
    name: 'Pneumococcal Conjugate (PCV13) Dose 2',
    targetAge: '10 Weeks (2½ Months)',
    minDays: 70,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Right Anterolateral Thigh',
    sampleLot: 'PCV-7731E',
    sampleExpiry: '2027-11-30'
  },
  {
    id: 'penta3',
    code: 'Penta 3',
    name: 'Pentavalent (DPT-HepB-Hib) Dose 3',
    targetAge: '14 Weeks (3½ Months)',
    minDays: 98,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Left Anterolateral Thigh',
    sampleLot: 'PNT-4095F',
    sampleExpiry: '2027-10-31'
  },
  {
    id: 'opv3',
    code: 'OPV 3',
    name: 'Oral Polio Vaccine (bOPV) Dose 3',
    targetAge: '14 Weeks (3½ Months)',
    minDays: 98,
    dose: '2 Drops',
    route: 'Oral (PO)',
    site: 'Mouth',
    sampleLot: 'OPV-1125G',
    sampleExpiry: '2027-07-31'
  },
  {
    id: 'pcv3',
    code: 'PCV 3',
    name: 'Pneumococcal Conjugate (PCV13) Dose 3',
    targetAge: '14 Weeks (3½ Months)',
    minDays: 98,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Right Anterolateral Thigh',
    sampleLot: 'PCV-7738H',
    sampleExpiry: '2027-12-31'
  },
  {
    id: 'ipv1',
    code: 'IPV 1',
    name: 'Inactivated Polio Vaccine Dose 1',
    targetAge: '14 Weeks (3½ Months)',
    minDays: 98,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Left Anterolateral Thigh (2.5cm apart)',
    sampleLot: 'IPV-5501J',
    sampleExpiry: '2027-10-15'
  },
  {
    id: 'ipv2',
    code: 'IPV 2',
    name: 'Inactivated Polio Vaccine Dose 2',
    targetAge: '9 Months',
    minDays: 270,
    dose: '0.5 mL',
    route: 'Intramuscular (IM)',
    site: 'Left Deltoid / Thigh',
    sampleLot: 'IPV-5509K',
    sampleExpiry: '2028-01-31'
  },
  {
    id: 'mcv1',
    code: 'MMR 1 (MCV1)',
    name: 'Measles, Mumps, Rubella Dose 1',
    targetAge: '9 Months',
    minDays: 270,
    dose: '0.5 mL',
    route: 'Subcutaneous (SC)',
    site: 'Right Deltoid / Upper Arm',
    sampleLot: 'MMR-9921L',
    sampleExpiry: '2028-03-31'
  },
  {
    id: 'mcv2',
    code: 'MMR 2 (MCV2)',
    name: 'Measles, Mumps, Rubella Dose 2',
    targetAge: '12 Months (1 Year)',
    minDays: 365,
    dose: '0.5 mL',
    route: 'Subcutaneous (SC)',
    site: 'Right Deltoid / Upper Arm',
    sampleLot: 'MMR-9984M',
    sampleExpiry: '2028-05-31'
  }
];

const BAKUNXT_STORAGE_KEY = 'bakunxt_ph_patients_v2';

export function createBlankBakuNxtPatient(doctorInfo?: any): BakuNxtPatientRecord {
  const doses: Record<string, BakuNxtDoseRecord> = {};
  DOH_VACCINES.forEach((v) => {
    doses[v.id] = {
      given: false,
      dateGiven: '',
      lotNumber: '',
      expiryDate: '',
      site: v.site,
      facility: doctorInfo?.facility || doctorInfo?.clinic || '',
      remarks: ''
    };
  });

  const defaultFacility = doctorInfo?.facility || doctorInfo?.clinic || '';
  const defaultWorker = doctorInfo?.name
    ? `${doctorInfo.name}${doctorInfo.role ? ` (${doctorInfo.role})` : ''}`
    : '';

  return {
    id: 'EPI-' + Date.now().toString().slice(-6),
    fsn: '',
    philhealthPin: '',
    facilityName: defaultFacility,
    childName: '',
    sex: 'Male',
    dob: '',
    birthTime: '',
    birthOrder: '',
    motherName: '',
    fatherName: '',
    contactNumber: '',
    address: '',
    fourPsStatus: 'Non-4Ps / PhilHealth Direct',
    placeOfDelivery: 'Hospital / Lying-In (Facility-Based)',
    deliveryType: 'Normal Spontaneous Vaginal Delivery (NSVD)',
    attendantAtBirth: 'Physician / Midwife',
    birthWeightGrams: '',
    birthLengthCm: '',
    motherTdStatus: 'Td2+ (2 or more doses) - CPAB',
    nbsStatus: 'Done - Normal',
    nbsDate: '',
    nhstStatus: 'Done - Pass',
    ebfMonth1: false,
    ebfMonth2: false,
    ebfMonth3: false,
    ebfMonth4: false,
    ebfMonth5: false,
    ebfMonth6: false,
    compFeedingDate: '',
    visitDate: new Date().toISOString().split('T')[0],
    tempCelsius: '',
    currentWeightKg: '',
    currentLengthCm: '',
    muacCm: '',
    nutritionalStatusWFA: 'Normal (WFA)',
    nutritionalStatusLFA: 'Normal (LFA)',
    nutritionalStatusWFL: 'Normal (WFL)',
    contraAcuteIllness: false,
    contraAnaphylaxis: false,
    contraImmunocompromised: false,
    contraConvulsions: false,
    clinicalNotes: '',
    vitADate: '',
    mnpDate: '',
    dewormingDate: '',
    doses,
    aefiObservation: 'Observed for 30 minutes post-vaccination — No immediate AEFI noted',
    aefiNotes: '',
    counselParacetamol: true,
    counselBcgScar: true,
    counselBringCard: true,
    counselDangerSigns: true,
    nextVisitDate: '',
    nextVisitVaccines: '',
    healthWorker: defaultWorker,
    visitHistory: []
  };
}

export function calculateBakuNxtAgeText(dobStr: string): { label: string; totalDays: number } {
  if (!dobStr) return { label: 'Enter Date of Birth', totalDays: 0 };
  const dob = new Date(dobStr);
  const now = new Date();
  const diffMs = now.getTime() - dob.getTime();
  if (diffMs < 0) return { label: 'Future Date Selected', totalDays: 0 };
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const months = Math.floor(totalDays / 30.4375);

  let label = '';
  if (totalDays < 30) {
    label = `${totalDays} days old (${weeks} wks)`;
  } else if (months < 24) {
    const remWeeks = Math.floor((totalDays % 30.4375) / 7);
    label = `${months} mo${months === 1 ? '' : 's'}, ${remWeeks} wk${remWeeks === 1 ? '' : 's'} (${weeks} wks total)`;
  } else {
    const yrs = Math.floor(months / 12);
    const remMos = months % 12;
    label = `${yrs} yr${yrs === 1 ? '' : 's'}, ${remMos} mo${remMos === 1 ? '' : 's'}`;
  }
  return { label, totalDays };
}

export function classifyBakuNxtBirthWeight(gramsStr: string): { text: string; color: string } {
  const g = parseFloat(gramsStr);
  if (isNaN(g) || g <= 0) {
    return { text: 'Not Recorded', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
  if (g < 1500) {
    return { text: 'Very Low Birth Weight (< 1,500 g)', color: 'bg-red-50 text-red-800 border-red-200' };
  }
  if (g < 2500) {
    return { text: 'Low Birth Weight (< 2,500 g)', color: 'bg-amber-50 text-amber-800 border-amber-200' };
  }
  return { text: 'Normal Birth Weight (≥ 2,500 g)', color: 'bg-teal-50 text-teal-800 border-teal-200' };
}

export function evaluateBakuNxtCPAB(tdStatus: string): { isCPAB: boolean; label: string } {
  if (!tdStatus) return { isCPAB: false, label: 'Unknown' };
  if (tdStatus.includes('CPAB')) {
    return { isCPAB: true, label: 'CPAB — Protected at Birth' };
  }
  return { isCPAB: false, label: 'Not CPAB — Needs Td Catch-Up' };
}

export function evaluateBakuNxtMilestones(patient: BakuNxtPatientRecord) {
  const d = patient.doses || {};
  const ficRequired = ['bcg', 'penta1', 'penta2', 'penta3', 'opv1', 'opv2', 'opv3', 'mcv1', 'mcv2'];
  const cicRequired = DOH_VACCINES.map((v) => v.id);

  const isFIC = ficRequired.every((id) => d[id] && d[id].given);
  const isCIC = cicRequired.every((id) => d[id] && d[id].given);
  const dosesCount = cicRequired.filter((id) => d[id] && d[id].given).length;

  let statusBadge = 'In Progress / On Schedule';
  let statusColor = 'bg-teal-50 text-teal-800 border-teal-200';
  if (isCIC) {
    statusBadge = 'CIC & FIC (Completely Immunized Child)';
    statusColor = 'bg-teal-700 text-white border-teal-800';
  } else if (isFIC) {
    statusBadge = 'FIC (Fully Immunized Child)';
    statusColor = 'bg-teal-600 text-white border-teal-700';
  }

  const missingFIC = ficRequired
    .filter((id) => !d[id] || !d[id].given)
    .map((id) => {
      const v = DOH_VACCINES.find((x) => x.id === id);
      return v ? v.code : id;
    });

  return {
    isFIC,
    isCIC,
    dosesCount,
    totalVaccines: DOH_VACCINES.length,
    statusBadge,
    statusColor,
    missingFIC
  };
}

export function loadBakuNxtPatientsFromStorage(): BakuNxtPatientRecord[] {
  try {
    localStorage.removeItem('bakunxt_ph_patients_v1');
    const raw = localStorage.getItem(BAKUNXT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((r: any) => r && r.id !== 'EPI-260891');
      }
    }
  } catch (e) {
    console.error('Failed to load BakuNxt storage', e);
  }
  return [];
}

export function saveBakuNxtPatientsToStorage(patients: BakuNxtPatientRecord[]): void {
  try {
    localStorage.setItem(BAKUNXT_STORAGE_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Failed to save BakuNxt storage', e);
  }
}

export function buildBakuNxtItrSheetHTML(p: BakuNxtPatientRecord): string {
  const ageObj = calculateBakuNxtAgeText(p.dob);
  const bwClass = classifyBakuNxtBirthWeight(p.birthWeightGrams);
  const milestone = evaluateBakuNxtMilestones(p);
  const ebfMonthsCount = [
    p.ebfMonth1,
    p.ebfMonth2,
    p.ebfMonth3,
    p.ebfMonth4,
    p.ebfMonth5,
    p.ebfMonth6
  ].filter(Boolean).length;

  const contraArr: string[] = [];
  if (p.contraAcuteIllness) contraArr.push('Moderate/Severe Acute Illness');
  if (p.contraAnaphylaxis) contraArr.push('Hx of Severe Allergy');
  if (p.contraImmunocompromised) contraArr.push('Immunocompromised');
  if (p.contraConvulsions) contraArr.push('Hx of Seizures');
  const contraSummary =
    contraArr.length > 0 ? contraArr.join('; ') : 'Cleared — No Contraindications';

  return `
    <!-- Official Header -->
    <div class="border-b-2 border-slate-900 pb-3 mb-3 flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full border-2 border-teal-800 bg-teal-50 flex items-center justify-center text-teal-900 font-black text-xs shrink-0">
          DOH
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-slate-600">Republic of the Philippines • Department of Health</div>
          <h2 class="text-base font-black uppercase tracking-tight text-slate-900">National Immunization Program — Individual Treatment Record (ITR)</h2>
          <div class="text-xs font-bold text-teal-800">${escapeHTML(p.facilityName || 'Rural Health Unit / Barangay Health Station')}</div>
        </div>
      </div>
      <div class="text-right border border-slate-800 rounded-lg px-3 py-1.5 bg-slate-50 shrink-0">
        <div class="text-[9px] font-bold uppercase text-slate-500">Family Serial Number</div>
        <div class="text-xs font-black text-slate-900">${escapeHTML(p.fsn || '—')}</div>
        <div class="text-[9px] text-slate-500">Record ID: ${escapeHTML(p.id || '—')}</div>
      </div>
    </div>

    <!-- I. Patient & Family Demographics -->
    <div class="mb-3">
      <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1.5">
        I. Client &amp; Family Identification
      </div>
      <div class="grid grid-cols-4 gap-2 border border-slate-300 p-2.5 bg-slate-50/50 text-[11px]">
        <div class="col-span-2">
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Child's Full Name (Last, First, Middle)</span>
          <span class="font-extrabold text-slate-900 text-xs">${escapeHTML(p.childName || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Date &amp; Time of Birth</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.dob ? `${p.dob}${p.birthTime ? ` (${p.birthTime})` : ''}` : '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Sex &amp; Current Age</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.sex || '—'} • ${ageObj.label}`)}</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Mother's Full Maiden Name</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.motherName || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Father / Guardian</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.fatherName || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Contact Number</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.contactNumber || '—')}</span>
        </div>
        <div class="col-span-2">
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Complete Address</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.address || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">PhilHealth PIN</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.philhealthPin || 'N/A')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">4Ps / NHTS-PR Status</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.fourPsStatus || '—')}</span>
        </div>
      </div>
    </div>

    <!-- II. Birth & Maternal Protection Baseline -->
    <div class="mb-3">
      <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1.5">
        II. Birth, Maternal Protection (CPAB) &amp; Newborn Baseline
      </div>
      <div class="grid grid-cols-4 gap-2 border border-slate-300 p-2.5 text-[11px]">
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Place &amp; Type of Delivery</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.placeOfDelivery || '—'} (${p.deliveryType || ''})`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Birth Weight &amp; Classification</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.birthWeightGrams || '—'} g (${bwClass.text})`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Birth Length &amp; Order</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.birthLengthCm || '—'} cm • ${p.birthOrder || '—'} Child`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Mother Tetanus / CPAB Status</span>
          <span class="font-bold text-teal-800">${escapeHTML(p.motherTdStatus || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Newborn Screening (ENBS)</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.nbsStatus || '—'} ${p.nbsDate ? `(${p.nbsDate})` : ''}`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Newborn Hearing Test</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.nhstStatus || '—')}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Exclusive Breastfeeding (1-6m)</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${ebfMonthsCount} of 6 Months Logged`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Complementary Feeding</span>
          <span class="font-bold text-slate-900">${escapeHTML(p.compFeedingDate || 'Not yet started')}</span>
        </div>
      </div>
    </div>

    <!-- III. Pre-Vaccination Clinical & Nutritional Assessment -->
    <div class="mb-3">
      <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1.5">
        III. Pre-Vaccination Clinical Screening, Growth &amp; Micronutrient Log
      </div>
      <div class="grid grid-cols-5 gap-2 border border-slate-300 p-2.5 text-[11px]">
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Visit Date &amp; Temp</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.visitDate || '—'} • ${p.tempCelsius || '—'} °C`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Current Wt / Length / MUAC</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.currentWeightKg || '—'} kg / ${p.currentLengthCm || '—'} cm / ${p.muacCm || '—'} cm`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">WHO Growth Status</span>
          <span class="font-bold text-slate-900">${escapeHTML(`${p.nutritionalStatusWFA}, ${p.nutritionalStatusLFA}, ${p.nutritionalStatusWFL}`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Vit A / MNP / Deworming</span>
          <span class="font-bold text-slate-900">${escapeHTML(`VitA: ${p.vitADate || '—'} | MNP: ${p.mnpDate || '—'}`)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-semibold block text-[9px] uppercase">Contraindication Screen</span>
          <span class="font-bold text-teal-800">${escapeHTML(contraSummary)}</span>
        </div>
        <div class="col-span-5 pt-1 border-t border-slate-200">
          <span class="text-slate-500 font-semibold text-[9px] uppercase">Clinical Assessment Notes: </span>
          <span class="text-slate-800 font-medium">${escapeHTML(p.clinicalNotes || '—')}</span>
        </div>
      </div>
    </div>

    <!-- IV. Official Immunization Table -->
    <div class="mb-3">
      <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-1 flex items-center justify-between">
        <span>IV. Official National Immunization Program (EPI) Vaccination &amp; Logistics Log</span>
        <span>Milestone: ${escapeHTML(milestone.statusBadge)}</span>
      </div>
      <table class="w-full border-collapse border border-slate-400 text-[10px]">
        <thead>
          <tr class="bg-slate-100 text-slate-800 font-bold uppercase">
            <th class="border border-slate-300 py-1 px-2 text-left">Antigen / Vaccine</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Target Age</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Dose &amp; Route</th>
            <th class="border border-slate-300 py-1 px-2 text-center">Status</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Date Given</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Lot / Batch No.</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Expiry Date</th>
            <th class="border border-slate-300 py-1 px-2 text-left">Site &amp; Facility</th>
          </tr>
        </thead>
        <tbody>
          ${DOH_VACCINES.map((v) => {
            const dRec = (p.doses && p.doses[v.id]) || {
              given: false,
              dateGiven: '',
              lotNumber: '',
              expiryDate: '',
              site: v.site,
              facility: ''
            };
            return `
              <tr class="${dRec.given ? 'bg-teal-50/40' : ''}">
                <td class="border border-slate-300 py-1 px-2 font-bold text-slate-900">${escapeHTML(v.code)} — <span class="font-normal">${escapeHTML(v.name)}</span></td>
                <td class="border border-slate-300 py-1 px-2 text-slate-700">${escapeHTML(v.targetAge)}</td>
                <td class="border border-slate-300 py-1 px-2 text-slate-700">${escapeHTML(`${v.dose} (${v.route})`)}</td>
                <td class="border border-slate-300 py-1 px-2 text-center font-bold ${dRec.given ? 'text-teal-800' : 'text-slate-400'}">${dRec.given ? 'GIVEN' : 'PENDING'}</td>
                <td class="border border-slate-300 py-1 px-2 font-semibold text-slate-900">${escapeHTML(dRec.given ? dRec.dateGiven || 'Recorded' : '—')}</td>
                <td class="border border-slate-300 py-1 px-2 text-slate-700">${escapeHTML(dRec.given ? dRec.lotNumber || '—' : '—')}</td>
                <td class="border border-slate-300 py-1 px-2 text-slate-700">${escapeHTML(dRec.given ? dRec.expiryDate || '—' : '—')}</td>
                <td class="border border-slate-300 py-1 px-2 text-slate-700">${escapeHTML(dRec.given ? `${dRec.site || v.site} (${dRec.facility || 'RHU'})` : '—')}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- V. Post-Vaccination & Sign-Off -->
    <div class="grid grid-cols-3 gap-3 border border-slate-300 p-2.5 text-[11px] bg-slate-50/50">
      <div>
        <span class="text-slate-500 font-semibold block text-[9px] uppercase">Post-Vaccination Observation / AEFI</span>
        <span class="font-bold text-slate-900">${escapeHTML(p.aefiObservation || '—')}</span>
        <div class="text-[10px] text-slate-600 mt-0.5">Notes: ${escapeHTML(p.aefiNotes || 'None')}</div>
      </div>
      <div>
        <span class="text-slate-500 font-semibold block text-[9px] uppercase">Next Scheduled Visit &amp; Due Vaccines</span>
        <span class="font-extrabold text-teal-800">${escapeHTML(p.nextVisitDate || 'All 1st-Year Vaccines Completed')}</span>
        <div class="text-[10px] text-slate-700 font-medium mt-0.5">${escapeHTML(p.nextVisitVaccines || '—')}</div>
      </div>
      <div class="border-l border-slate-300 pl-3 flex flex-col justify-between">
        <span class="text-slate-500 font-semibold block text-[9px] uppercase">Administering Health Worker Sign-Off</span>
        <div class="mt-3 pt-1 border-t border-slate-400 font-extrabold text-slate-900">${escapeHTML(p.healthWorker || 'Health Worker on Duty')}</div>
        <div class="text-[9px] text-slate-500">Signature over Printed Name &amp; License No.</div>
      </div>
    </div>
  `;
}

export function buildBakuNxtPassportSheetHTML(p: BakuNxtPatientRecord): string {
  const ageObj = calculateBakuNxtAgeText(p.dob);
  const milestone = evaluateBakuNxtMilestones(p);

  return `
    <!-- Passport Header Banner -->
    <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shrink-0">
            <svg class="w-7 h-7 text-teal-200" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-teal-400 text-slate-950">Official Parent Copy</span>
              <span class="text-[11px] font-semibold text-teal-100">${escapeHTML(p.facilityName || 'Rural Health Unit')}</span>
            </div>
            <h2 class="text-xl font-black tracking-tight mt-0.5">BAKUNXT BABY VACCINE CARD</h2>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 border border-white/20 text-right">
          <div class="text-[9px] uppercase tracking-wider text-teal-200 font-bold">Immunization Status</div>
          <div class="text-sm font-black text-white mt-0.5">
            ${escapeHTML(milestone.isCIC ? '★ CIC & FIC COMPLETED' : milestone.isFIC ? '★ FULLY IMMUNIZED (FIC)' : 'ON TRACK / IN PROGRESS')}
          </div>
          <div class="text-[11px] text-teal-100 font-semibold">${milestone.dosesCount} of ${milestone.totalVaccines} Doses Completed</div>
        </div>
      </div>
    </div>

    <!-- Baby Profile Strip -->
    <div class="p-5 bg-teal-50/50 border-b border-teal-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs">
          <div class="text-[9px] font-bold uppercase text-teal-700">Child's Full Name</div>
          <div class="text-xs font-black text-slate-900 mt-0.5">${escapeHTML(p.childName || '—')}</div>
          <div class="text-[10px] text-slate-500 mt-0.5">FSN: ${escapeHTML(p.fsn || '—')}</div>
        </div>
        <div class="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs">
          <div class="text-[9px] font-bold uppercase text-teal-700">Date of Birth &amp; Age</div>
          <div class="text-xs font-black text-slate-900 mt-0.5">${escapeHTML(p.dob || '—')}</div>
          <div class="text-[10px] text-teal-700 font-bold mt-0.5">${escapeHTML(ageObj.label)}</div>
        </div>
        <div class="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs">
          <div class="text-[9px] font-bold uppercase text-teal-700">Sex &amp; Birth Weight</div>
          <div class="text-xs font-black text-slate-900 mt-0.5">${escapeHTML(`${p.sex || '—'} • ${p.birthWeightGrams || '—'} g`)}</div>
          <div class="text-[10px] text-slate-500 mt-0.5">${escapeHTML(p.placeOfDelivery || 'Facility Delivery')}</div>
        </div>
        <div class="bg-white p-3 rounded-xl border border-teal-200 shadow-2xs">
          <div class="text-[9px] font-bold uppercase text-teal-700">Mother's Name &amp; Contact</div>
          <div class="text-xs font-black text-slate-900 mt-0.5">${escapeHTML(p.motherName || '—')}</div>
          <div class="text-[10px] text-slate-600 font-semibold mt-0.5">${escapeHTML(p.contactNumber || '—')}</div>
        </div>
      </div>

      <!-- Next Appointment Highlight Box -->
      <div class="mt-3 bg-teal-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-teal-700 text-teal-100 flex items-center justify-center font-black text-xs shrink-0">
            📅
          </div>
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-teal-200">Next Scheduled Bakuna Visit (Petsa ng Susunod na Bakuna)</div>
            <div class="text-xs font-extrabold text-white">${escapeHTML(p.nextVisitDate || 'Completed 1st Year Schedule')} — <span class="font-semibold text-teal-200">${escapeHTML(p.nextVisitVaccines || 'Routine Growth Monitoring')}</span></div>
          </div>
        </div>
        <span class="text-[10px] font-bold bg-white/15 text-teal-100 px-2.5 py-1 rounded-lg border border-white/20 shrink-0">
          Always bring this card!
        </span>
      </div>
    </div>

    <!-- Visual Milestone Cards Grid -->
    <div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
          Philippine EPI Vaccine Checklist (Birth to 12 Months)
        </h3>
        <div class="flex items-center gap-3 text-[10px] font-bold">
          <span class="inline-flex items-center gap-1 text-teal-700"><span class="w-2 h-2 rounded-full bg-teal-600"></span> Completed Dose</span>
          <span class="inline-flex items-center gap-1 text-slate-400"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Upcoming / Pending</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        ${DOH_VACCINES.map((v) => {
          const dRec = (p.doses && p.doses[v.id]) || {
            given: false,
            dateGiven: '',
            lotNumber: '',
            expiryDate: '',
            site: v.site,
            facility: ''
          };
          const isDone = dRec.given;
          return `
            <div class="rounded-xl p-3 border ${
              isDone
                ? 'bg-teal-50/70 border-teal-300'
                : 'bg-slate-50 border-slate-200'
            } flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    isDone
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }">
                    ${isDone ? '✓ GIVEN' : 'PENDING'}
                  </span>
                  <span class="text-[9px] font-bold text-slate-500">${escapeHTML(v.targetAge)}</span>
                </div>
                <div class="font-black text-slate-900 text-xs mt-1.5">${escapeHTML(v.code)}</div>
                <div class="text-[10px] text-slate-600 font-medium leading-tight">${escapeHTML(v.name)}</div>
              </div>
              <div class="mt-2 pt-2 border-t ${
                isDone ? 'border-teal-200' : 'border-slate-200'
              } text-[10px] space-y-0.5">
                <div class="flex justify-between">
                  <span class="text-slate-500">Date Given:</span>
                  <span class="font-extrabold ${isDone ? 'text-teal-900' : 'text-slate-400'}">${escapeHTML(isDone ? dRec.dateGiven || 'Recorded' : 'Not yet given')}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Lot / Site:</span>
                  <span class="font-semibold text-slate-700">${escapeHTML(isDone ? `${dRec.lotNumber || '—'} • ${dRec.site || v.site}` : `${v.dose} ${v.route}`)}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Footer Reminders & Signature -->
    <div class="bg-slate-900 text-white p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
      <div class="md:col-span-2 space-y-1">
        <div class="text-teal-300 font-extrabold uppercase tracking-wider text-[10px]">
          Paalala sa Magulang (Parent Care Guide)
        </div>
        <p class="text-slate-300 leading-relaxed">
          • Normal ang bahagyang lagnat o pamamaga sa bakuna; maaaring bigyan ng Paracetamol drops ayon sa timbang.<br>
          • Huwag lagyan ng alcohol, gamot, o pisain ang BCG scar sa kanang braso.<br>
          • Dalhin palagi ang BakuNxt Baby Vaccine Card tuwing pupunta sa Health Center o Doktor.
        </p>
      </div>
      <div class="bg-slate-800 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
        <div class="text-[9px] uppercase text-slate-400 font-bold">Certified By Health Worker</div>
        <div class="font-bold text-white text-xs mt-2 pt-1.5 border-t border-slate-600">${escapeHTML(p.healthWorker || 'NIP Nurse / Midwife')}</div>
        <div class="text-[10px] text-teal-300">${escapeHTML(p.address || '')}</div>
      </div>
    </div>
  `;
}

export function buildBakuNxtWorkspaceHTML(appState: any): string {
  const activeTab: 'intake' | 'itr' | 'passport' =
    appState.bakunxtActiveTab === 'itr' || appState.bakunxtActiveTab === 'passport'
      ? appState.bakunxtActiveTab
      : 'intake';
  const p: BakuNxtPatientRecord = appState.bakunxtCurrentPatient || createBlankBakuNxtPatient(appState.doctor);

  const ageObj = calculateBakuNxtAgeText(p.dob);
  const bwClass = classifyBakuNxtBirthWeight(p.birthWeightGrams);
  const cpabObj = evaluateBakuNxtCPAB(p.motherTdStatus);
  const milestone = evaluateBakuNxtMilestones(p);

  const tempVal = parseFloat(p.tempCelsius);
  const isFever = !isNaN(tempVal) && tempVal >= 38.0;

  const muacVal = parseFloat(p.muacCm);
  let muacLabel = 'Normal (≥ 12.5 cm)';
  let muacClass = 'bg-teal-50 text-teal-800 border-teal-200';
  if (!isNaN(muacVal) && muacVal > 0) {
    if (muacVal < 11.5) {
      muacLabel = 'RED (< 11.5 cm) — Severe Acute Malnutrition (SAM)';
      muacClass = 'bg-red-50 text-red-800 border-red-200';
    } else if (muacVal < 12.5) {
      muacLabel = 'YELLOW (11.5–12.4 cm) — Moderate Acute Malnutrition (MAM)';
      muacClass = 'bg-amber-50 text-amber-800 border-amber-200';
    }
  }

  return `
    <div class="space-y-6">
      <!-- MedFlow Standard Teal-to-Slate Header Banner -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-teal-600/90 border border-teal-400/40 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">BakuNxt PH — National Immunization Program (EPI)</h2>
          </div>
        </div>
        <div class="flex items-center gap-2 self-start lg:self-auto">
          <button type="button" onclick="openRecordsOnTab('immunization')" class="px-3.5 py-2 rounded-xl bg-teal-700/80 hover:bg-teal-600 text-white border border-teal-400/30 text-xs font-bold shadow-xs transition cursor-pointer">
            View Immunization Folders
          </button>
          <button type="button" onclick="switchView('home')" class="px-4 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition cursor-pointer">
            ← Back to Home
          </button>
        </div>
      </div>

      <!-- BakuNxt Sub-Navigation Bar + Action Controls -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 no-print">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onclick="switchBakuNxtTab('intake')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'intake'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
            }"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Patient Intake</span>
          </button>

          <button
            type="button"
            onclick="switchBakuNxtTab('itr')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'itr'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
            }"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Official ITR PDF</span>
          </button>

          <button
            type="button"
            onclick="switchBakuNxtTab('passport')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
            }"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span>Baby Vaccine Card</span>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${renderClearFormIconButtonHTML('bakunxtResetNewPatient()', 'Clear / New Patient Form')}
          <button
            type="button"
            onclick="bakunxtSaveCurrentPatient()"
            class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Save Patient Record
          </button>
        </div>
      </div>

      ${
        activeTab === 'intake'
          ? `
        <!-- =================================================================== -->
        <!-- TAB 1: PATIENT INTAKE & CLINICAL VACCINATION FORM                   -->
        <!-- =================================================================== -->
        <div class="space-y-6 no-print">
          <!-- Live Milestone & Age Summary Strip -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Calculated Age Today</div>
                <div id="bakunxt-live-age-display" class="text-sm font-extrabold text-slate-900 mt-1">${escapeHTML(ageObj.label)}</div>
                <div id="bakunxt-live-bw-badge" class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1.5 ${bwClass.color}">
                  Birth Wt: ${escapeHTML(bwClass.text)}
                </div>
              </div>

              <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Doses Administered</div>
                <div class="flex items-baseline gap-2 mt-1">
                  <span id="bakunxt-live-doses-count" class="text-lg font-extrabold text-teal-700">${milestone.dosesCount} / ${milestone.totalVaccines}</span>
                  <span class="text-xs text-slate-500 font-medium">NIP Doses</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">Auto-syncs to ITR &amp; Baby Card</div>
              </div>

              <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">DOH Milestone Status</div>
                <div class="mt-1.5">
                  <span id="bakunxt-live-fic-badge" class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${milestone.statusColor}">
                    ${escapeHTML(milestone.statusBadge)}
                  </span>
                </div>
                <div class="text-[10px] text-slate-500 mt-1">FIC = BCG, 3 Penta, 3 OPV, 2 MMR</div>
              </div>

              <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Maternal Tetanus (CPAB)</div>
                <div class="mt-1.5">
                  <span id="bakunxt-live-cpab-badge" class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    cpabObj.isCPAB
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }">
                    ${escapeHTML(cpabObj.label)}
                  </span>
                </div>
                <div class="text-[10px] text-slate-500 mt-1">Child Protected at Birth Status</div>
              </div>
            </div>
          </div>

          <form id="bakunxt-epi-intake-form" onsubmit="event.preventDefault(); bakunxtSaveCurrentPatient();" class="space-y-6">
            <!-- SECTION 1: CLIENT & FAMILY IDENTIFICATION -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Client &amp; Family Identification</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">DOH FHSIS / PhilHealth Konsulta</span>
              </div>

              <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Family Serial Number (FSN) <span class="text-teal-700">*</span></label>
                  <input type="text" id="f_fsn" value="${escapeHTML(p.fsn)}" oninput="bakunxtSyncFormField('fsn', this.value)" required placeholder="e.g. FSN-2026-0104" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">PhilHealth PIN / Dependent ID</label>
                  <input type="text" id="f_philhealthPin" value="${escapeHTML(p.philhealthPin)}" oninput="bakunxtSyncFormField('philhealthPin', this.value)" placeholder="12-digit PIN (Optional)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div class="lg:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">Child's Full Name (Last, First, Middle) <span class="text-teal-700">*</span></label>
                  <input type="text" id="f_childName" value="${escapeHTML(p.childName)}" oninput="bakunxtSyncFormField('childName', this.value)" required placeholder="e.g. Dela Cruz, Mateo Gabriel Santos" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Sex <span class="text-teal-700">*</span></label>
                  <select id="f_sex" onchange="bakunxtSyncFormField('sex', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="Male" ${p.sex === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${p.sex === 'Female' ? 'selected' : ''}>Female</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Date of Birth <span class="text-teal-700">*</span></label>
                  <input type="date" id="f_dob" value="${escapeHTML(p.dob)}" onchange="bakunxtSyncFormField('dob', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Time of Birth</label>
                  <input type="time" id="f_birthTime" value="${escapeHTML(p.birthTime)}" onchange="bakunxtSyncFormField('birthTime', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">4Ps / NHTS-PR Indigent Status</label>
                  <select id="f_fourPsStatus" onchange="bakunxtSyncFormField('fourPsStatus', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="Non-4Ps / PhilHealth Direct" ${p.fourPsStatus === 'Non-4Ps / PhilHealth Direct' ? 'selected' : ''}>Non-4Ps / PhilHealth Direct</option>
                    <option value="4Ps / NHTS-PR Beneficiary" ${p.fourPsStatus === '4Ps / NHTS-PR Beneficiary' ? 'selected' : ''}>4Ps / NHTS-PR Beneficiary</option>
                    <option value="Indigenous People (IP) / Geographically Isolated" ${p.fourPsStatus === 'Indigenous People (IP) / Geographically Isolated' ? 'selected' : ''}>Indigenous People (IP) / GIDA</option>
                  </select>
                </div>

                <div class="lg:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">Mother's Full Maiden Name <span class="text-teal-700">*</span></label>
                  <input type="text" id="f_motherName" value="${escapeHTML(p.motherName)}" oninput="bakunxtSyncFormField('motherName', this.value)" required placeholder="e.g. Santos, Maria Clara" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Father / Guardian's Full Name</label>
                  <input type="text" id="f_fatherName" value="${escapeHTML(p.fatherName)}" oninput="bakunxtSyncFormField('fatherName', this.value)" placeholder="e.g. Dela Cruz, Juan Paolo" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Parent Contact / SMS Number <span class="text-teal-700">*</span></label>
                  <input type="tel" id="f_contactNumber" value="${escapeHTML(p.contactNumber)}" oninput="bakunxtSyncFormField('contactNumber', this.value)" required placeholder="e.g. 0917-123-4567" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>

                <div class="lg:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">Complete Address (Purok/Sitio, Barangay, Municipality/City, Province) <span class="text-teal-700">*</span></label>
                  <input type="text" id="f_address" value="${escapeHTML(p.address)}" oninput="bakunxtSyncFormField('address', this.value)" required placeholder="e.g. Purok 4, Brgy. San Isidro, Quezon City, Metro Manila" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div class="lg:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 mb-1">Health Facility / RHU / Barangay Health Station Name</label>
                  <input type="text" id="f_facilityName" value="${escapeHTML(p.facilityName)}" oninput="bakunxtSyncFormField('facilityName', this.value)" placeholder="e.g. Rural Health Unit I - Brgy. San Isidro BHS" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
              </div>
            </div>

            <!-- SECTION 2: BIRTH & MATERNAL PROTECTION BASELINE -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Birth &amp; Maternal Protection Baseline (CPAB &amp; IYCF)</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">Newborn &amp; Maternal Baseline</span>
              </div>

              <div class="p-6 space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Place of Delivery</label>
                    <select id="f_placeOfDelivery" onchange="bakunxtSyncFormField('placeOfDelivery', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Hospital / Lying-In (Facility-Based)" ${p.placeOfDelivery === 'Hospital / Lying-In (Facility-Based)' ? 'selected' : ''}>Hospital / Lying-In (Facility-Based)</option>
                      <option value="RHU / Birthing Home" ${p.placeOfDelivery === 'RHU / Birthing Home' ? 'selected' : ''}>RHU / Birthing Home</option>
                      <option value="Home Delivery" ${p.placeOfDelivery === 'Home Delivery' ? 'selected' : ''}>Home Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Type of Delivery</label>
                    <select id="f_deliveryType" onchange="bakunxtSyncFormField('deliveryType', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Normal Spontaneous Vaginal Delivery (NSVD)" ${p.deliveryType === 'Normal Spontaneous Vaginal Delivery (NSVD)' ? 'selected' : ''}>Normal Spontaneous Vaginal Delivery (NSVD)</option>
                      <option value="Cesarean Section (CS)" ${p.deliveryType === 'Cesarean Section (CS)' ? 'selected' : ''}>Cesarean Section (CS)</option>
                      <option value="Assisted Vaginal Delivery" ${p.deliveryType === 'Assisted Vaginal Delivery' ? 'selected' : ''}>Assisted Vaginal Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Birth Weight (grams)</label>
                    <input type="number" id="f_birthWeightGrams" value="${escapeHTML(p.birthWeightGrams)}" oninput="bakunxtSyncFormField('birthWeightGrams', this.value)" placeholder="e.g. 3150" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Birth Length (cm) &amp; Birth Order</label>
                    <div class="grid grid-cols-2 gap-2">
                      <input type="number" step="0.1" id="f_birthLengthCm" value="${escapeHTML(p.birthLengthCm)}" oninput="bakunxtSyncFormField('birthLengthCm', this.value)" placeholder="cm (e.g. 49)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                      <input type="text" id="f_birthOrder" value="${escapeHTML(p.birthOrder)}" oninput="bakunxtSyncFormField('birthOrder', this.value)" placeholder="Order (1st)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Skilled Birth Attendant</label>
                    <select id="f_attendantAtBirth" onchange="bakunxtSyncFormField('attendantAtBirth', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Physician / Midwife" ${p.attendantAtBirth === 'Physician / Midwife' ? 'selected' : ''}>Physician / Midwife</option>
                      <option value="Physician" ${p.attendantAtBirth === 'Physician' ? 'selected' : ''}>Physician</option>
                      <option value="Registered Midwife" ${p.attendantAtBirth === 'Registered Midwife' ? 'selected' : ''}>Registered Midwife</option>
                      <option value="Registered Nurse" ${p.attendantAtBirth === 'Registered Nurse' ? 'selected' : ''}>Registered Nurse</option>
                      <option value="Traditional Birth Attendant (Hilot)" ${p.attendantAtBirth === 'Traditional Birth Attendant (Hilot)' ? 'selected' : ''}>Traditional Birth Attendant (Hilot)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Mother's Td / Tetanus Status (CPAB)</label>
                    <select id="f_motherTdStatus" onchange="bakunxtSyncFormField('motherTdStatus', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Td2+ (2 or more doses) - CPAB" ${p.motherTdStatus === 'Td2+ (2 or more doses) - CPAB' ? 'selected' : ''}>Td2+ (2 or more doses) — CPAB</option>
                      <option value="Td3 to Td5 Completed - CPAB" ${p.motherTdStatus === 'Td3 to Td5 Completed - CPAB' ? 'selected' : ''}>Td3 to Td5 Completed — CPAB</option>
                      <option value="Td1 Only - Not CPAB" ${p.motherTdStatus === 'Td1 Only - Not CPAB' ? 'selected' : ''}>Td1 Only — Not CPAB</option>
                      <option value="No Td / Unknown - Not CPAB" ${p.motherTdStatus === 'No Td / Unknown - Not CPAB' ? 'selected' : ''}>No Td / Unknown — Not CPAB</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Newborn Screening (ENBS) &amp; Date</label>
                    <div class="grid grid-cols-2 gap-2">
                      <select id="f_nbsStatus" onchange="bakunxtSyncFormField('nbsStatus', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                        <option value="Done - Normal" ${p.nbsStatus === 'Done - Normal' ? 'selected' : ''}>Done - Normal</option>
                        <option value="Done - Awaiting Result" ${p.nbsStatus === 'Done - Awaiting Result' ? 'selected' : ''}>Done - Pending</option>
                        <option value="Positive / Recall" ${p.nbsStatus === 'Positive / Recall' ? 'selected' : ''}>Positive / Recall</option>
                        <option value="Not Done" ${p.nbsStatus === 'Not Done' ? 'selected' : ''}>Not Done</option>
                      </select>
                      <input type="date" id="f_nbsDate" value="${escapeHTML(p.nbsDate)}" onchange="bakunxtSyncFormField('nbsDate', this.value)" class="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Newborn Hearing Screening</label>
                    <select id="f_nhstStatus" onchange="bakunxtSyncFormField('nhstStatus', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Done - Pass" ${p.nhstStatus === 'Done - Pass' ? 'selected' : ''}>Done — Pass</option>
                      <option value="Done - Refer" ${p.nhstStatus === 'Done - Refer' ? 'selected' : ''}>Done — Refer</option>
                      <option value="Pending / Not Done" ${p.nhstStatus === 'Pending / Not Done' ? 'selected' : ''}>Pending / Not Done</option>
                    </select>
                  </div>
                </div>

                <!-- Exclusive Breastfeeding (EBF) & Complementary Feeding Row -->
                <div class="bg-teal-50/50 border border-teal-200 rounded-xl p-4">
                  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div class="text-xs font-extrabold uppercase tracking-wider text-teal-900">
                        Exclusive Breastfeeding (EBF) Monthly Tracking (1st to 6th Month)
                      </div>
                      <p class="text-[11px] text-slate-600 mt-0.5">Check each month the infant received breastmilk exclusively without water, formula, or solid food.</p>
                      <div class="flex flex-wrap gap-3 mt-2.5">
                        ${[1, 2, 3, 4, 5, 6]
                          .map((m) => {
                            const key = `ebfMonth${m}` as keyof BakuNxtPatientRecord;
                            const isChecked = Boolean(p[key]);
                            return `
                              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-teal-200 cursor-pointer">
                                <input type="checkbox" id="f_ebfMonth${m}" ${isChecked ? 'checked' : ''} onchange="bakunxtSyncFormField('ebfMonth${m}', this.checked)" class="rounded text-teal-600 focus:ring-teal-500">
                                <span>Month ${m}</span>
                              </label>
                            `;
                          })
                          .join('')}
                      </div>
                    </div>

                    <div class="lg:w-72 shrink-0">
                      <label class="block text-xs font-bold text-slate-700 mb-1">Complementary Feeding Started (≥ 6 mos)</label>
                      <input type="date" id="f_compFeedingDate" value="${escapeHTML(p.compFeedingDate)}" onchange="bakunxtSyncFormField('compFeedingDate', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 3: PRE-VACCINATION CLINICAL, GROWTH & NUTRITION ASSESSMENT -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Pre-Vaccination Clinical, Growth &amp; Nutrition Assessment</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">WHO Growth &amp; Safety Screening</span>
              </div>

              <div class="p-6 space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Encounter / Visit Date</label>
                    <input type="date" id="f_visitDate" value="${escapeHTML(p.visitDate)}" onchange="bakunxtSyncFormField('visitDate', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Axillary Temp (°C)</label>
                    <input type="number" step="0.1" id="f_tempCelsius" value="${escapeHTML(p.tempCelsius)}" oninput="bakunxtSyncFormField('tempCelsius', this.value)" placeholder="36.8" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    <div id="bakunxt-temp-alert-text" class="text-[10px] font-bold mt-1 ${isFever ? 'text-red-600' : 'text-teal-700'}">
                      ${isFever ? '⚠️ FEVER (≥38.0°C): Evaluate / Defer Live Vaccines' : 'Normal (< 38.0°C) — Safe to Vaccinate'}
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Current Weight (kg)</label>
                    <input type="number" step="0.01" id="f_currentWeightKg" value="${escapeHTML(p.currentWeightKg)}" oninput="bakunxtSyncFormField('currentWeightKg', this.value)" placeholder="e.g. 6.5" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Current Length / Height (cm)</label>
                    <input type="number" step="0.1" id="f_currentLengthCm" value="${escapeHTML(p.currentLengthCm)}" oninput="bakunxtSyncFormField('currentLengthCm', this.value)" placeholder="e.g. 63.0" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">MUAC (cm) [≥6 mos]</label>
                    <input type="number" step="0.1" id="f_muacCm" value="${escapeHTML(p.muacCm)}" oninput="bakunxtSyncFormField('muacCm', this.value)" placeholder="e.g. 13.5" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    <div id="bakunxt-muac-status-text" class="inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 ${muacClass}">
                      ${escapeHTML(muacLabel)}
                    </div>
                  </div>
                </div>

                <!-- WHO Growth Standards & Micronutrient Supplementation -->
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Weight-for-Age (WFA)</label>
                    <select id="f_nutritionalStatusWFA" onchange="bakunxtSyncFormField('nutritionalStatusWFA', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Normal (WFA)" ${p.nutritionalStatusWFA === 'Normal (WFA)' ? 'selected' : ''}>Normal (WFA)</option>
                      <option value="Underweight" ${p.nutritionalStatusWFA === 'Underweight' ? 'selected' : ''}>Underweight</option>
                      <option value="Severely Underweight" ${p.nutritionalStatusWFA === 'Severely Underweight' ? 'selected' : ''}>Severely Underweight</option>
                      <option value="Overweight" ${p.nutritionalStatusWFA === 'Overweight' ? 'selected' : ''}>Overweight</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Length/Height-for-Age</label>
                    <select id="f_nutritionalStatusLFA" onchange="bakunxtSyncFormField('nutritionalStatusLFA', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Normal (LFA)" ${p.nutritionalStatusLFA === 'Normal (LFA)' ? 'selected' : ''}>Normal (LFA)</option>
                      <option value="Stunted" ${p.nutritionalStatusLFA === 'Stunted' ? 'selected' : ''}>Stunted</option>
                      <option value="Severely Stunted" ${p.nutritionalStatusLFA === 'Severely Stunted' ? 'selected' : ''}>Severely Stunted</option>
                      <option value="Tall" ${p.nutritionalStatusLFA === 'Tall' ? 'selected' : ''}>Tall</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Weight-for-Length (WFL)</label>
                    <select id="f_nutritionalStatusWFL" onchange="bakunxtSyncFormField('nutritionalStatusWFL', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Normal (WFL)" ${p.nutritionalStatusWFL === 'Normal (WFL)' ? 'selected' : ''}>Normal (WFL)</option>
                      <option value="Moderately Wasted (MAM)" ${p.nutritionalStatusWFL === 'Moderately Wasted (MAM)' ? 'selected' : ''}>Moderately Wasted (MAM)</option>
                      <option value="Severely Wasted (SAM)" ${p.nutritionalStatusWFL === 'Severely Wasted (SAM)' ? 'selected' : ''}>Severely Wasted (SAM)</option>
                      <option value="Overweight / Obese" ${p.nutritionalStatusWFL === 'Overweight / Obese' ? 'selected' : ''}>Overweight / Obese</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Vitamin A (100k/200k IU)</label>
                    <input type="date" id="f_vitADate" value="${escapeHTML(p.vitADate)}" onchange="bakunxtSyncFormField('vitADate', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">MNP / Iron Drops Given</label>
                    <input type="date" id="f_mnpDate" value="${escapeHTML(p.mnpDate)}" onchange="bakunxtSyncFormField('mnpDate', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Deworming (≥ 12 mos)</label>
                    <input type="date" id="f_dewormingDate" value="${escapeHTML(p.dewormingDate)}" onchange="bakunxtSyncFormField('dewormingDate', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                </div>

                <!-- Contraindications Screening -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div class="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                    Medical / Allergy Contraindication Screening (Leave unchecked if none)
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <label class="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="checkbox" id="f_contraAcuteIllness" ${p.contraAcuteIllness ? 'checked' : ''} onchange="bakunxtSyncFormField('contraAcuteIllness', this.checked)" class="rounded text-teal-600">
                      <span class="font-medium text-slate-700">Moderate/Severe Acute Illness or Fever ≥38.0°C</span>
                    </label>
                    <label class="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="checkbox" id="f_contraAnaphylaxis" ${p.contraAnaphylaxis ? 'checked' : ''} onchange="bakunxtSyncFormField('contraAnaphylaxis', this.checked)" class="rounded text-teal-600">
                      <span class="font-medium text-slate-700">Prior Severe Allergic Reaction / Anaphylaxis</span>
                    </label>
                    <label class="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="checkbox" id="f_contraImmunocompromised" ${p.contraImmunocompromised ? 'checked' : ''} onchange="bakunxtSyncFormField('contraImmunocompromised', this.checked)" class="rounded text-teal-600">
                      <span class="font-medium text-slate-700">Severe Immunodeficiency (Caution: Live Vaccines)</span>
                    </label>
                    <label class="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer">
                      <input type="checkbox" id="f_contraConvulsions" ${p.contraConvulsions ? 'checked' : ''} onchange="bakunxtSyncFormField('contraConvulsions', this.checked)" class="rounded text-teal-600">
                      <span class="font-medium text-slate-700">History of Uncontrolled Seizures / Encephalopathy</span>
                    </label>
                  </div>
                  <div class="mt-3">
                    <input type="text" id="f_clinicalNotes" value="${escapeHTML(p.clinicalNotes)}" oninput="bakunxtSyncFormField('clinicalNotes', this.value)" placeholder="Additional clinical assessment, respiratory/hydration check, or deferral notes..." class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 4: ACTUAL VACCINATION & COLD-CHAIN LOGISTICS MATRIX -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">4</span>
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Actual Vaccination &amp; Cold-Chain Logistics Log (DOH Philippine EPI)</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">DOH EPI Schedule</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider">
                      <th class="py-3 px-4 w-28 text-center">Status</th>
                      <th class="py-3 px-3">Vaccine &amp; Dose / Route</th>
                      <th class="py-3 px-3">Target Schedule</th>
                      <th class="py-3 px-3 w-36">Date Given</th>
                      <th class="py-3 px-3 w-36">Lot / Batch No.</th>
                      <th class="py-3 px-3 w-36">Expiry Date</th>
                      <th class="py-3 px-3 w-44">Injection Site</th>
                      <th class="py-3 px-3 w-44">Administered By / Facility</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 text-xs">
                    ${DOH_VACCINES.map((v) => {
                      const dRec = p.doses[v.id] || {
                        given: false,
                        dateGiven: '',
                        lotNumber: '',
                        expiryDate: '',
                        site: v.site,
                        facility: 'RHU I',
                        remarks: ''
                      };
                      const rowBg = dRec.given ? 'bg-teal-50/40' : 'hover:bg-slate-50';
                      return `
                        <tr class="${rowBg} transition">
                          <td class="py-2.5 px-4 text-center">
                            <label class="inline-flex items-center justify-center cursor-pointer gap-1.5 px-2.5 py-1 rounded-lg border ${
                              dRec.given
                                ? 'bg-teal-600 text-white border-teal-700'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            } font-bold text-[11px] transition">
                              <input type="checkbox" ${dRec.given ? 'checked' : ''} onchange="bakunxtToggleVaccineGiven('${v.id}', this.checked)" class="sr-only">
                              <span>${dRec.given ? '✓ Given' : 'Pending'}</span>
                            </label>
                          </td>
                          <td class="py-2.5 px-3">
                            <div class="font-extrabold text-slate-900">${escapeHTML(v.code)} — <span class="font-semibold text-slate-700">${escapeHTML(v.name)}</span></div>
                            <div class="text-[11px] text-slate-500">${escapeHTML(v.dose)} • ${escapeHTML(v.route)}</div>
                          </td>
                          <td class="py-2.5 px-3">
                            <span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              ${escapeHTML(v.targetAge)}
                            </span>
                          </td>
                          <td class="py-2.5 px-3">
                            <input type="date" value="${escapeHTML(dRec.dateGiven || '')}" onchange="bakunxtUpdateDoseField('${v.id}', 'dateGiven', this.value)" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                          </td>
                          <td class="py-2.5 px-3">
                            <input type="text" value="${escapeHTML(dRec.lotNumber || '')}" oninput="bakunxtUpdateDoseField('${v.id}', 'lotNumber', this.value)" placeholder="${escapeHTML(v.sampleLot)}" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                          </td>
                          <td class="py-2.5 px-3">
                            <input type="date" value="${escapeHTML(dRec.expiryDate || '')}" onchange="bakunxtUpdateDoseField('${v.id}', 'expiryDate', this.value)" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                          </td>
                          <td class="py-2.5 px-3">
                            <input type="text" value="${escapeHTML(dRec.site || v.site)}" oninput="bakunxtUpdateDoseField('${v.id}', 'site', this.value)" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                          </td>
                          <td class="py-2.5 px-3">
                            <input type="text" value="${escapeHTML(dRec.facility || '')}" oninput="bakunxtUpdateDoseField('${v.id}', 'facility', this.value)" placeholder="RHU / BHS / Midwife" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION 5: POST-VACCINATION COUNSELING, AEFI & FOLLOW-UP -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">5</span>
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Post-Vaccination Counseling, AEFI &amp; Next-Visit Schedule</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">AEFI Surveillance &amp; Defaulter Prevention</span>
              </div>

              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">15–30 Minute Post-Vaccination Observation &amp; AEFI</label>
                    <select id="f_aefiObservation" onchange="bakunxtSyncFormField('aefiObservation', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                      <option value="Observed for 30 minutes post-vaccination — No immediate AEFI noted" ${p.aefiObservation === 'Observed for 30 minutes post-vaccination — No immediate AEFI noted' ? 'selected' : ''}>Observed 30 mins — No AEFI noted</option>
                      <option value="Mild local reaction / low-grade fever — Managed with Paracetamol" ${p.aefiObservation === 'Mild local reaction / low-grade fever — Managed with Paracetamol' ? 'selected' : ''}>Mild local reaction / low-grade fever</option>
                      <option value="Serious AEFI suspected — Referred & CIF initiated" ${p.aefiObservation === 'Serious AEFI suspected — Referred & CIF initiated' ? 'selected' : ''}>Serious AEFI suspected — CIF initiated</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Next Scheduled Vaccination Date <span class="text-teal-700">*</span></label>
                    <input type="date" id="f_nextVisitDate" value="${escapeHTML(p.nextVisitDate)}" onchange="bakunxtSyncFormField('nextVisitDate', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Vaccines Due on Next Visit</label>
                    <input type="text" id="f_nextVisitVaccines" value="${escapeHTML(p.nextVisitVaccines)}" oninput="bakunxtSyncFormField('nextVisitVaccines', this.value)" placeholder="e.g. Penta 2, OPV 2, PCV 2 (at 10 Weeks)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">AEFI Details &amp; Management (If any prior or current reaction)</label>
                    <input type="text" id="f_aefiNotes" value="${escapeHTML(p.aefiNotes)}" oninput="bakunxtSyncFormField('aefiNotes', this.value)" placeholder="None / Describe fever, swelling, irritability..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Administered By (Name, Designation &amp; PRC License No.)</label>
                    <input type="text" id="f_healthWorker" value="${escapeHTML(p.healthWorker)}" oninput="bakunxtSyncFormField('healthWorker', this.value)" placeholder="e.g. Maria Teresa D. Cruz, RN, RM — Public Health Nurse" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold">
                  </div>
                </div>

                <!-- 4 Key Messages Checklist -->
                <div class="bg-teal-50/60 border border-teal-200 rounded-xl p-4">
                  <div class="text-xs font-extrabold uppercase tracking-wider text-teal-900 mb-2">
                    DOH 4 Key Messages Delivered to Parent / Caregiver
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-slate-700">
                    <label class="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-teal-200 cursor-pointer">
                      <input type="checkbox" id="f_counselParacetamol" ${p.counselParacetamol ? 'checked' : ''} onchange="bakunxtSyncFormField('counselParacetamol', this.checked)" class="mt-0.5 rounded text-teal-600">
                      <span><strong>1. Expected Reactions:</strong> Mild fever/soreness; weight-based Paracetamol drops &amp; cool compress advised.</span>
                    </label>
                    <label class="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-teal-200 cursor-pointer">
                      <input type="checkbox" id="f_counselBcgScar" ${p.counselBcgScar ? 'checked' : ''} onchange="bakunxtSyncFormField('counselBcgScar', this.checked)" class="mt-0.5 rounded text-teal-600">
                      <span><strong>2. BCG Scar Care:</strong> Normal papule/ulcer in 2–6 wks; keep clean &amp; dry, do not squeeze or apply ointment.</span>
                    </label>
                    <label class="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-teal-200 cursor-pointer">
                      <input type="checkbox" id="f_counselBringCard" ${p.counselBringCard ? 'checked' : ''} onchange="bakunxtSyncFormField('counselBringCard', this.checked)" class="mt-0.5 rounded text-teal-600">
                      <span><strong>3. Safekeep Baby Card:</strong> Bring the BakuNxt Baby Vaccine Card on every health center visit.</span>
                    </label>
                    <label class="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-teal-200 cursor-pointer">
                      <input type="checkbox" id="f_counselDangerSigns" ${p.counselDangerSigns ? 'checked' : ''} onchange="bakunxtSyncFormField('counselDangerSigns', this.checked)" class="mt-0.5 rounded text-teal-600">
                      <span><strong>4. Danger Signs:</strong> Return immediately if fever &gt;48h, convulsions, or poor sucking/lethargy.</span>
                    </label>
                  </div>
                </div>

                <!-- Bottom Form Action Bar -->
                <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div class="text-xs text-slate-500">
                    All fields sync to the <strong class="text-slate-800">Official FHSIS ITR</strong> and <strong class="text-teal-700">BakuNxt Baby Vaccine Card</strong>.
                  </div>
                  <div class="flex flex-wrap gap-2.5">
                    <button type="button" onclick="bakunxtSaveAndOpenTab('itr')" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                      Save &amp; Generate ITR PDF
                    </button>
                    <button type="button" onclick="bakunxtSaveAndOpenTab('passport')" class="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                      Save &amp; View Baby Vaccine Card
                    </button>
                    <button type="submit" class="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                      Save Patient Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      `
          : ''
      }

      ${
        activeTab === 'itr'
          ? `
        <!-- =================================================================== -->
        <!-- TAB 2: OFFICIAL INDIVIDUAL TREATMENT RECORD (ITR) PDF PREVIEW       -->
        <!-- =================================================================== -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Official DOH / FHSIS Individual Treatment Record (ITR)</h3>
              <p class="text-xs text-slate-500">Standard A4 clinical record formatted for RHU/BHS filing and PDF export.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" onclick="switchBakuNxtTab('intake')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
                ← Back to Edit Intake
              </button>
              <button type="button" onclick="printDocumentElement('itr-document-sheet', 'A4 portrait')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer">
                Print ITR
              </button>
              <button type="button" onclick="bakunxtDownloadITRPdf()" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                Download Official ITR (.PDF)
              </button>
            </div>
          </div>

          <div class="overflow-x-auto pb-4">
            <div id="itr-document-sheet" class="paper-a4 print-only-target mx-auto bg-white text-slate-900 border border-slate-300 shadow-sm p-6 text-xs">
              ${buildBakuNxtItrSheetHTML(p)}
            </div>
          </div>
        </div>
      `
          : ''
      }

      ${
        activeTab === 'passport'
          ? `
        <!-- =================================================================== -->
        <!-- TAB 3: BAKUNXT BABY VACCINE CARD (PARENT-FRIENDLY PASSPORT)         -->
        <!-- =================================================================== -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">BakuNxt Baby Immunization Passport (Parent Copy)</h3>
              <p class="text-xs text-slate-500">Clean, visual DOH-aligned Baby Vaccine Card designed for parents and caregivers.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" onclick="switchBakuNxtTab('intake')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer">
                ← Back to Edit Intake
              </button>
              <button type="button" onclick="printDocumentElement('baby-passport-card', 'A4 portrait')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer">
                Print Card
              </button>
              <button type="button" onclick="bakunxtDownloadPassportPdf()" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                Download Baby Vaccine Card (.PDF)
              </button>
            </div>
          </div>

          <div class="overflow-x-auto pb-4">
            <div id="baby-passport-card" class="paper-a4 print-only-target mx-auto bg-white rounded-2xl border-2 border-teal-700 shadow-sm overflow-hidden">
              ${buildBakuNxtPassportSheetHTML(p)}
            </div>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
