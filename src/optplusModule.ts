import { escapeHTML, renderClearFormIconButtonHTML } from './medflowViews';

export interface OptPlusWhoClassification {
  zWFA: number;
  wfaLabel: string;
  wfaCode: string;
  wfaTone: 'normal' | 'moderate' | 'severe' | 'over' | 'neutral';
  zHFA: number;
  hfaLabel: string;
  hfaCode: string;
  hfaTone: 'normal' | 'moderate' | 'severe' | 'over' | 'neutral';
  zWFH: number;
  wfhLabel: string;
  wfhCode: string;
  wfhTone: 'normal' | 'moderate' | 'severe' | 'over' | 'neutral';
}

export interface OptPlusChildRecord {
  id: string;
  region?: string;
  province: string;
  city: string;
  barangay: string;
  optYear: string;
  purok: string;
  measureDate: string;
  measurer: string;
  childName: string;
  sex: 'Male' | 'Female';
  dob: string;
  ageMonths: number;
  motherName: string;
  is4ps: 'Yes' | 'No';
  isIp: 'Yes' | 'No';
  weight: number;
  height: number;
  muac: string;
  edema: string;
  srvVitA: boolean;
  srvDeworm: boolean;
  srvIycf: boolean;
  remarks: string;
  who: OptPlusWhoClassification;
  visitHistory?: Array<{ date: string; snapshot: any }>;
}

const OPTPLUS_STORAGE_KEY = 'optplus_ph_records_v3';

const WHO_REF_CURVES: Record<'Male' | 'Female', { points: number[][] }> = {
  Male: {
    points: [
      [0, 3.35, 0.42, 49.9, 1.89],
      [3, 6.38, 0.72, 61.4, 2.05],
      [6, 7.93, 0.86, 67.6, 2.18],
      [9, 8.9, 0.96, 72.0, 2.3],
      [12, 9.65, 1.05, 75.7, 2.42],
      [18, 10.94, 1.2, 82.3, 2.68],
      [24, 12.15, 1.36, 87.8, 3.05],
      [30, 13.3, 1.52, 92.4, 3.3],
      [36, 14.34, 1.68, 96.1, 3.55],
      [42, 15.34, 1.85, 99.9, 3.8],
      [48, 16.35, 2.04, 103.3, 4.05],
      [54, 17.34, 2.22, 106.7, 4.28],
      [60, 18.34, 2.42, 110.0, 4.5]
    ]
  },
  Female: {
    points: [
      [0, 3.23, 0.4, 49.1, 1.86],
      [3, 5.85, 0.68, 59.8, 2.02],
      [6, 7.3, 0.82, 65.7, 2.16],
      [9, 8.24, 0.92, 70.1, 2.28],
      [12, 8.95, 1.01, 74.0, 2.4],
      [18, 10.23, 1.16, 80.7, 2.65],
      [24, 11.48, 1.32, 86.4, 3.0],
      [30, 12.69, 1.49, 91.1, 3.26],
      [36, 13.85, 1.66, 95.1, 3.52],
      [42, 14.98, 1.84, 99.0, 3.78],
      [48, 16.08, 2.04, 102.7, 4.02],
      [54, 17.17, 2.25, 106.2, 4.26],
      [60, 18.23, 2.46, 109.4, 4.48]
    ]
  }
};

function interpolateAgeRef(sex: string, ageMonths: number) {
  const key = sex === 'Female' ? 'Female' : 'Male';
  const pts = WHO_REF_CURVES[key].points;
  const clamped = Math.max(0, Math.min(60, ageMonths));
  for (let i = 0; i < pts.length - 1; i++) {
    const [a0, w0, ws0, h0, hs0] = pts[i];
    const [a1, w1, ws1, h1, hs1] = pts[i + 1];
    if (clamped >= a0 && clamped <= a1) {
      const t = (clamped - a0) / (a1 - a0);
      return {
        wtMed: w0 + t * (w1 - w0),
        wtSD: ws0 + t * (ws1 - ws0),
        htMed: h0 + t * (h1 - h0),
        htSD: hs0 + t * (hs1 - hs0)
      };
    }
  }
  const last = pts[pts.length - 1];
  return { wtMed: last[1], wtSD: last[2], htMed: last[3], htSD: last[4] };
}

function expectedWeightForHeight(sex: string, heightCm: number) {
  const h = Math.max(45, Math.min(125, heightCm));
  const base =
    sex === 'Female'
      ? 0.00145 * h * h - 0.044 * h + 1.65
      : 0.00148 * h * h - 0.043 * h + 1.72;
  const sd = Math.max(0.32, base * 0.088);
  return { med: base, sd };
}

export function classifyChildWHO(params: {
  sex: string;
  ageMonths: number;
  weight: number;
  height: number;
  muac: string;
  edema: string;
}): OptPlusWhoClassification {
  const { sex, ageMonths, weight, height, muac, edema } = params;
  const ref = interpolateAgeRef(sex, ageMonths);
  const zWFA = Number(((weight - ref.wtMed) / ref.wtSD).toFixed(2));
  const zHFA = Number(((height - ref.htMed) / ref.htSD).toFixed(2));

  const wfhRef = expectedWeightForHeight(sex, height);
  const zWFH = Number(((weight - wfhRef.med) / wfhRef.sd).toFixed(2));

  // 1. Weight-for-Age (WFA)
  let wfaLabel = 'Normal';
  let wfaCode = 'N';
  let wfaTone: OptPlusWhoClassification['wfaTone'] = 'normal';
  if (zWFA < -3) {
    wfaLabel = 'Severely Underweight';
    wfaCode = 'SUW';
    wfaTone = 'severe';
  } else if (zWFA < -2) {
    wfaLabel = 'Underweight';
    wfaCode = 'UW';
    wfaTone = 'moderate';
  } else if (zWFA > 2) {
    wfaLabel = 'Overweight';
    wfaCode = 'OW';
    wfaTone = 'over';
  }

  // 2. Length/Height-for-Age (L/HFA)
  let hfaLabel = 'Normal';
  let hfaCode = 'N';
  let hfaTone: OptPlusWhoClassification['hfaTone'] = 'normal';
  if (zHFA < -3) {
    hfaLabel = 'Severely Stunted';
    hfaCode = 'SSt';
    hfaTone = 'severe';
  } else if (zHFA < -2) {
    hfaLabel = 'Stunted';
    hfaCode = 'St';
    hfaTone = 'moderate';
  } else if (zHFA > 2) {
    hfaLabel = 'Tall';
    hfaCode = 'T';
    hfaTone = 'over';
  }

  // 3. Weight-for-Length/Height (WFL/H) + MUAC/Edema SAM/MAM override per DOH PIMAM
  const muacNum = parseFloat(muac);
  const hasEdema = Boolean(edema && edema !== 'None');
  const isSAMByMuac = ageMonths >= 6 && !isNaN(muacNum) && muacNum > 0 && muacNum < 11.5;
  const isMAMByMuac = ageMonths >= 6 && !isNaN(muacNum) && muacNum >= 11.5 && muacNum < 12.5;

  let wfhLabel = 'Normal';
  let wfhCode = 'N';
  let wfhTone: OptPlusWhoClassification['wfhTone'] = 'normal';
  if (hasEdema || zWFH < -3 || isSAMByMuac) {
    wfhLabel = 'Severely Wasted (SAM)';
    wfhCode = 'SW';
    wfhTone = 'severe';
  } else if (zWFH < -2 || isMAMByMuac) {
    wfhLabel = 'Moderately Wasted (MAM)';
    wfhCode = 'MW';
    wfhTone = 'moderate';
  } else if (zWFH > 3) {
    wfhLabel = 'Obese';
    wfhCode = 'Ob';
    wfhTone = 'over';
  } else if (zWFH > 2) {
    wfhLabel = 'Overweight';
    wfhCode = 'OW';
    wfhTone = 'over';
  }

  return {
    zWFA,
    wfaLabel,
    wfaCode,
    wfaTone,
    zHFA,
    hfaLabel,
    hfaCode,
    hfaTone,
    zWFH,
    wfhLabel,
    wfhCode,
    wfhTone
  };
}

export function computeOptCompletedMonths(dobStr: string, measureStr: string): number | null {
  if (!dobStr || !measureStr) return null;
  const dob = new Date(dobStr + 'T00:00:00');
  const meas = new Date(measureStr + 'T00:00:00');
  if (isNaN(dob.getTime()) || isNaN(meas.getTime())) return null;

  let months = (meas.getFullYear() - dob.getFullYear()) * 12 + (meas.getMonth() - dob.getMonth());
  if (meas.getDate() < dob.getDate()) {
    months -= 1;
  }
  return months;
}

export function loadOptPlusRecordsFromStorage(): OptPlusChildRecord[] {
  try {
    localStorage.removeItem('optplus_ph_records_v1');
    localStorage.removeItem('optplus_ph_records_v2');
    const raw = localStorage.getItem(OPTPLUS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('OPTPlus storage read fallback:', e);
  }
  return [];
}

export function saveOptPlusRecordsToStorage(records: OptPlusChildRecord[]): void {
  try {
    localStorage.setItem(OPTPLUS_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('OPTPlus storage write error:', e);
  }
}

export function createBlankOptPlusForm(doctorInfo?: any) {
  const defaultMeasurer = doctorInfo?.name ? `${doctorInfo.name}` : '';
  return {
    id: '',
    barangay: '',
    city: '',
    province: '',
    optYear: String(new Date().getFullYear()),
    measureDate: new Date().toISOString().split('T')[0],
    measurer: defaultMeasurer,
    childName: '',
    sex: 'Male' as 'Male' | 'Female',
    dob: '',
    motherName: '',
    purok: '',
    is4ps: 'No' as 'Yes' | 'No',
    isIp: 'No' as 'Yes' | 'No',
    remarks: '',
    weight: '',
    height: '',
    muac: '',
    edema: 'None',
    srvVitA: false,
    srvDeworm: false,
    srvIycf: true
  };
}


export function buildOptPlusChildCardPrintableHTML(rec: OptPlusChildRecord): string {
  return `
    <div id="optplus-child-card-printable" class="bg-white text-slate-900 p-6 rounded-xl border border-slate-300 text-xs space-y-4">
      <div class="border-b-2 border-teal-800 pb-3 flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0">
            OPT+
          </div>
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-teal-800">Republic of the Philippines • DOH / National Nutrition Council</div>
            <div class="text-base font-extrabold text-slate-900">OPT Plus Child Growth &amp; Nutrition Card</div>
          </div>
        </div>
        <div class="text-right text-[11px] text-slate-600">
          <div class="font-extrabold text-slate-900">${escapeHTML(rec.barangay)}, ${escapeHTML(rec.city)}, ${escapeHTML(rec.province)}</div>
          <div>OPT Year ${escapeHTML(rec.optYear)} • Measured: ${escapeHTML(rec.measureDate)}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">Child Full Name</span> <strong class="text-slate-900">${escapeHTML(rec.childName)}</strong></div>
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">Sex / Completed Age</span> <strong class="text-slate-900">${escapeHTML(rec.sex)} • ${rec.ageMonths} mos</strong></div>
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth</span> <strong class="text-slate-900">${escapeHTML(rec.dob)}</strong></div>
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">Mother / Caregiver</span> <strong class="text-slate-900">${escapeHTML(rec.motherName)}</strong></div>
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">Purok / Sitio</span> <strong class="text-slate-900">${escapeHTML(rec.purok)}</strong></div>
        <div><span class="text-slate-500 block text-[10px] uppercase font-bold">4Ps / IP Group</span> <strong class="text-slate-900">4Ps: ${escapeHTML(rec.is4ps)} • IP: ${escapeHTML(rec.isIp)}</strong></div>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 rounded-xl border border-teal-200 bg-teal-50/40">
          <div class="text-[10px] text-teal-800 uppercase font-extrabold">Weight</div>
          <div class="text-base font-extrabold text-slate-900 mt-0.5">${Number(rec.weight).toFixed(2)} kg</div>
        </div>
        <div class="p-3 rounded-xl border border-teal-200 bg-teal-50/40">
          <div class="text-[10px] text-teal-800 uppercase font-extrabold">Length / Height</div>
          <div class="text-base font-extrabold text-slate-900 mt-0.5">${Number(rec.height).toFixed(1)} cm</div>
        </div>
        <div class="p-3 rounded-xl border border-teal-200 bg-teal-50/40">
          <div class="text-[10px] text-teal-800 uppercase font-extrabold">MUAC / Edema</div>
          <div class="text-base font-extrabold text-slate-900 mt-0.5">${escapeHTML(rec.muac || '—')} cm / ${escapeHTML(rec.edema)}</div>
        </div>
      </div>

      <table class="w-full text-xs border-collapse border border-slate-300">
        <thead class="bg-slate-900 text-white font-bold uppercase text-[10px]">
          <tr>
            <th class="p-2 text-left border border-slate-300">WHO-CGS Indicator</th>
            <th class="p-2 text-center border border-slate-300">Z-Score</th>
            <th class="p-2 text-left border border-slate-300">Classification</th>
            <th class="p-2 text-center border border-slate-300">Code</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="p-2 font-bold border border-slate-200">Weight-for-Age (WFA)</td>
            <td class="p-2 text-center font-mono border border-slate-200">${rec.who.zWFA >= 0 ? '+' : ''}${rec.who.zWFA} SD</td>
            <td class="p-2 font-extrabold border border-slate-200">${escapeHTML(rec.who.wfaLabel)}</td>
            <td class="p-2 text-center font-extrabold border border-slate-200">${escapeHTML(rec.who.wfaCode)}</td>
          </tr>
          <tr>
            <td class="p-2 font-bold border border-slate-200">Length/Height-for-Age (L/HFA)</td>
            <td class="p-2 text-center font-mono border border-slate-200">${rec.who.zHFA >= 0 ? '+' : ''}${rec.who.zHFA} SD</td>
            <td class="p-2 font-extrabold border border-slate-200">${escapeHTML(rec.who.hfaLabel)}</td>
            <td class="p-2 text-center font-extrabold border border-slate-200">${escapeHTML(rec.who.hfaCode)}</td>
          </tr>
          <tr>
            <td class="p-2 font-bold border border-slate-200">Weight-for-Length/Height (WFL/H)</td>
            <td class="p-2 text-center font-mono border border-slate-200">${rec.who.zWFH >= 0 ? '+' : ''}${rec.who.zWFH} SD</td>
            <td class="p-2 font-extrabold border border-slate-200">${escapeHTML(rec.who.wfhLabel)}</td>
            <td class="p-2 text-center font-extrabold border border-slate-200">${escapeHTML(rec.who.wfhCode)}</td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-wrap justify-between items-center gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
        <div>
          <strong>Nutrition Services:</strong>
          ${rec.srvVitA ? 'Vitamin A ✓ • ' : ''}${rec.srvDeworm ? 'Deworming ✓ • ' : ''}${rec.srvIycf ? 'IYCF Counseling ✓' : 'None'}
          ${rec.remarks ? ` | <strong>Remarks:</strong> ${escapeHTML(rec.remarks)}` : ''}
        </div>
        <div>Measured &amp; Encoded by: <strong class="text-slate-900">${escapeHTML(rec.measurer)}</strong></div>
      </div>
    </div>
  `;
}

export function buildOptPlusForm1ASheetHTML(records: OptPlusChildRecord[], meta?: any): string {
  const sampleMeta = meta || records[0] || {
    barangay: '—',
    city: '—',
    province: '—',
    optYear: String(new Date().getFullYear())
  };
  return `
    <div class="border-b-2 border-slate-900 pb-3 mb-3 flex items-start justify-between gap-4">
      <div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-teal-800">Republic of the Philippines • Department of Health • National Nutrition Council</div>
        <h3 class="text-base font-black uppercase tracking-tight text-slate-900">Operation Timbang Plus (OPT Plus) Form 1A — Barangay Masterlist</h3>
        <div class="text-xs font-semibold text-slate-600 mt-0.5">
          Barangay: <strong>${escapeHTML(sampleMeta.barangay || '—')}</strong> | City/Mun: <strong>${escapeHTML(sampleMeta.city || '—')}</strong> | Province: <strong>${escapeHTML(sampleMeta.province || '—')}</strong> | OPT Year: <strong>${escapeHTML(sampleMeta.optYear || '—')}</strong>
        </div>
      </div>
      <div class="text-right bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 shrink-0">
        <div class="text-[9px] font-bold uppercase text-slate-500">Total Children Listed</div>
        <div class="text-sm font-black text-teal-900">${records.length} Children (0–59m)</div>
      </div>
    </div>

    <table class="w-full border-collapse border border-slate-400 text-[10px]">
      <thead>
        <tr class="bg-slate-900 text-white font-bold uppercase">
          <th class="border border-slate-400 py-1.5 px-2 text-center">#</th>
          <th class="border border-slate-400 py-1.5 px-2 text-left">Child Full Name</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">Sex</th>
          <th class="border border-slate-400 py-1.5 px-2 text-left">DOB</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">Age(m)</th>
          <th class="border border-slate-400 py-1.5 px-2 text-left">Purok / Sitio</th>
          <th class="border border-slate-400 py-1.5 px-2 text-left">Mother / Caregiver</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">4Ps</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-right">Wt(kg)</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-right">Ht(cm)</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">WFA</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">L/HFA</th>
          <th class="border border-slate-400 py-1.5 px-1.5 text-center">WFL/H</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .map(
            (r, i) => `
          <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}">
            <td class="border border-slate-300 py-1 px-2 text-center font-mono">${i + 1}</td>
            <td class="border border-slate-300 py-1 px-2 font-bold text-slate-900">${escapeHTML(r.childName)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center">${r.sex === 'Male' ? 'M' : 'F'}</td>
            <td class="border border-slate-300 py-1 px-2">${escapeHTML(r.dob)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center font-bold">${r.ageMonths}</td>
            <td class="border border-slate-300 py-1 px-2">${escapeHTML(r.purok)}</td>
            <td class="border border-slate-300 py-1 px-2">${escapeHTML(r.motherName)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center">${escapeHTML(r.is4ps)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-right font-semibold">${Number(r.weight).toFixed(1)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-right font-semibold">${Number(r.height).toFixed(1)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center font-bold">${escapeHTML(r.who.wfaCode)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center font-bold">${escapeHTML(r.who.hfaCode)}</td>
            <td class="border border-slate-300 py-1 px-1.5 text-center font-bold">${escapeHTML(r.who.wfhCode)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

export function buildOptPlusWorkspaceHTML(appState: any): string {
  const activeTab: 'intake' | 'goals' = appState.optplusActiveTab === 'goals' ? 'goals' : 'intake';
  const records: OptPlusChildRecord[] = appState.optplusRecords || [];
  const form = appState.optplusForm || createBlankOptPlusForm(appState.doctor);
  const goals = appState.optplusGoals || {
    totalPop: 3500,
    popFactor: 10.8,
    manualTarget: '',
    targetCovPct: 95,
    daysLeft: 15,
    stuntRedPct: 25,
    wasteRedPct: 50,
    uwRedPct: 30
  };

  // Live form WHO calculation
  const ageMonths = computeOptCompletedMonths(form.dob, form.measureDate);
  const weightNum = parseFloat(form.weight);
  const heightNum = parseFloat(form.height);
  const hasValidMetrics =
    ageMonths !== null &&
    ageMonths >= 0 &&
    !isNaN(weightNum) &&
    weightNum > 0 &&
    !isNaN(heightNum) &&
    heightNum > 0;

  const liveWho = hasValidMetrics
    ? classifyChildWHO({
        sex: form.sex,
        ageMonths: ageMonths!,
        weight: weightNum,
        height: heightNum,
        muac: form.muac,
        edema: form.edema
      })
    : null;

  let actionTagText = 'Ready';
  let actionTagClass = 'bg-slate-800 text-slate-300';
  if (liveWho) {
    if (liveWho.wfhTone === 'severe' || liveWho.wfaTone === 'severe' || liveWho.hfaTone === 'severe') {
      actionTagText = 'Refer RHU / OTC';
      actionTagClass = 'bg-rose-600 text-white';
    } else if (
      liveWho.wfhTone === 'moderate' ||
      liveWho.wfaTone === 'moderate' ||
      liveWho.hfaTone === 'moderate'
    ) {
      actionTagText = 'Enroll SFP / Counsel';
      actionTagClass = 'bg-amber-500 text-slate-950';
    } else if (liveWho.wfhTone === 'over' || liveWho.wfaTone === 'over') {
      actionTagText = 'Diet Counseling';
      actionTagClass = 'bg-sky-500 text-white';
    } else {
      actionTagText = 'Normal Growth';
      actionTagClass = 'bg-teal-600 text-white';
    }
  }

  const liveToneBadgeClass = (tone?: string) => {
    const map: Record<string, string> = {
      normal: 'bg-teal-500/20 text-teal-200 border border-teal-400/40',
      moderate: 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
      severe: 'bg-rose-500/25 text-rose-200 border border-rose-400/50',
      over: 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
    };
    return map[tone || ''] || 'bg-slate-700 text-slate-300';
  };


  // Goal & BNAP Computation
  const totalPop = Math.max(1, Number(goals.totalPop) || 3500);
  const factorPct = Math.max(0.1, Number(goals.popFactor) || 10.8);
  const manualTarget = parseInt(String(goals.manualTarget), 10);
  const targetCovPct = Number(goals.targetCovPct) || 95;
  const daysLeft = Math.max(1, parseInt(String(goals.daysLeft), 10) || 15);

  const estEligible =
    !isNaN(manualTarget) && manualTarget > 0
      ? manualTarget
      : Math.round(totalPop * (factorPct / 100));
  const measuredCount = records.length;
  const coveragePct = estEligible > 0 ? (measuredCount / estEligible) * 100 : 0;
  const targetChildren = Math.ceil(estEligible * (targetCovPct / 100));
  const remainingToTarget = Math.max(0, targetChildren - measuredCount);
  const dailyQuota = Math.ceil(remainingToTarget / daysLeft);

  let normalAll = 0;
  let suw = 0;
  let uw = 0;
  let sst = 0;
  let st = 0;
  let sam = 0;
  let mam = 0;
  let owOb = 0;
  let eligibleVitA = 0;
  let eligibleDeworm = 0;
  let eligibleMnp = 0;

  records.forEach((r) => {
    const w = r.who;
    if (w.wfaCode === 'SUW') suw++;
    if (w.wfaCode === 'UW') uw++;
    if (w.hfaCode === 'SSt') sst++;
    if (w.hfaCode === 'St') st++;
    if (w.wfhCode === 'SW') sam++;
    if (w.wfhCode === 'MW') mam++;
    if (w.wfhCode === 'OW' || w.wfhCode === 'Ob' || w.wfaCode === 'OW') owOb++;
    if (w.wfaTone === 'normal' && w.hfaTone === 'normal' && w.wfhTone === 'normal') normalAll++;

    if (r.ageMonths >= 6 && r.ageMonths <= 59) eligibleVitA++;
    if (r.ageMonths >= 12 && r.ageMonths <= 59) eligibleDeworm++;
    if (
      r.ageMonths >= 6 &&
      r.ageMonths <= 23 &&
      (w.wfaCode !== 'N' || w.hfaCode !== 'N' || w.wfhCode !== 'N')
    ) {
      eligibleMnp++;
    }
  });

  const totalStunted = sst + st;
  const totalWasted = sam + mam;
  const totalUw = suw + uw;

  const stuntRedPct = Number(goals.stuntRedPct) || 25;
  const wasteRedPct = Number(goals.wasteRedPct) || 50;
  const uwRedPct = Number(goals.uwRedPct) || 30;

  const stuntGoal = Math.ceil(totalStunted * (stuntRedPct / 100));
  const wasteGoal = Math.ceil(totalWasted * (wasteRedPct / 100));
  const uwGoal = Math.ceil(totalUw * (uwRedPct / 100));

  const denom = Math.max(1, measuredCount);
  const prevalenceRows = [
    { label: 'Normal (All Indices)', count: normalAll, goal: 'Maintain', barColor: 'bg-teal-600' },
    { label: 'Stunted (St + SSt)', count: totalStunted, goal: `${stuntGoal} cases`, barColor: 'bg-amber-500' },
    { label: 'Wasted (MAM + SAM)', count: totalWasted, goal: `${wasteGoal} cases`, barColor: 'bg-rose-500' },
    { label: 'Underweight (UW + SUW)', count: totalUw, goal: `${uwGoal} cases`, barColor: 'bg-sky-500' },
    { label: 'Overweight / Obese', count: owOb, goal: 'Counsel', barColor: 'bg-indigo-500' }
  ];

  const sampleMeta = records[0] || {
    barangay: form.barangay || '—',
    city: form.city || '—',
    province: form.province || '—',
    optYear: form.optYear || String(new Date().getFullYear())
  };

  return `
    <div class="space-y-6">
      <!-- MedFlow Standard Teal-to-Slate Header Banner -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-teal-600/90 border border-teal-400/40 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">OPTPlus PH — Operation Timbang Plus (Nutrition Program)</h2>
          </div>
        </div>
        <div class="flex items-center gap-2 self-start lg:self-auto">
          <button type="button" onclick="openRecordsOnTab('optplus')" class="px-3.5 py-2 rounded-xl bg-teal-700/80 hover:bg-teal-600 text-white border border-teal-400/30 text-xs font-bold shadow-xs transition cursor-pointer">
            View OPTPlus Folders
          </button>
          <button type="button" onclick="switchView('home')" class="px-4 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition cursor-pointer">
            ← Back to Home
          </button>
        </div>
      </div>

      <!-- Sub-Navigation Bar + Action Controls -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 no-print">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onclick="switchOptPlusTab('intake')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'intake'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
            }"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>OPT Form (0–59 Mos)</span>
            ${form.id ? `<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-300 text-slate-950 font-extrabold">Editing</span>` : ''}
          </button>

          <button
            type="button"
            onclick="switchOptPlusTab('goals')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
            }"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Goal Computation</span>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${renderClearFormIconButtonHTML('optplusResetIntakeForm()', 'Clear OPT Plus Form')}
          <button
            type="button"
            onclick="optplusPreviewCurrentFormCard()"
            class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            Child Card PDF
          </button>
          <button
            type="button"
            onclick="optplusSaveChildRecord()"
            class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Save Record
          </button>
        </div>
      </div>

      ${
        activeTab === 'intake'
          ? `
        <!-- =================================================================== -->
        <!-- TAB 1: OPT PLUS CHILD INTAKE (0–59 MONTHS)                          -->
        <!-- =================================================================== -->
        <form onsubmit="event.preventDefault(); optplusSaveChildRecord();" class="space-y-6 no-print">
          <!-- SECTION 1: BARANGAY & SESSION -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Barangay &amp; Session</h3>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">DOH / NNC Operation Timbang Plus</span>
            </div>

            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Barangay <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.barangay)}" oninput="optplusSyncFormField('barangay', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">City / Municipality <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.city)}" oninput="optplusSyncFormField('city', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Province <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.province)}" oninput="optplusSyncFormField('province', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">OPT Year <span class="text-teal-700">*</span></label>
                <input type="number" value="${escapeHTML(form.optYear)}" oninput="optplusSyncFormField('optYear', this.value)" min="2020" max="2035" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Date Measured <span class="text-teal-700">*</span></label>
                <input type="date" value="${escapeHTML(form.measureDate)}" onchange="optplusSyncFormField('measureDate', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Measurer / BNS <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.measurer)}" oninput="optplusSyncFormField('measurer', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>

          <!-- SECTION 2: CHILD & HOUSEHOLD -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Child &amp; Household Identification</h3>
              </div>
              <span id="optplus-age-validation-pill" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                ageMonths === null || ageMonths < 0
                  ? 'bg-slate-800 text-slate-300'
                  : ageMonths <= 59
                  ? 'bg-teal-500/25 text-teal-200 border border-teal-400/40'
                  : 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
              }">
                ${
                  ageMonths === null || ageMonths < 0
                    ? 'Age: —'
                    : ageMonths <= 59
                    ? `Eligible (${ageMonths} mos)`
                    : `Over 59 mos (${ageMonths}m)`
                }
              </span>
            </div>

            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div class="lg:col-span-4">
                <label class="block text-xs font-bold text-slate-700 mb-1">Child Full Name (Last, First, M.I.) <span class="text-teal-700">*</span></label>
                <input type="text" id="optplus-child-name" value="${escapeHTML(form.childName)}" oninput="optplusSyncFormField('childName', this.value)" placeholder="Dela Cruz, Juan M." required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div class="lg:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Sex <span class="text-teal-700">*</span></label>
                <select onchange="optplusSyncFormField('sex', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="Male" ${form.sex === 'Male' ? 'selected' : ''}>Male (M)</option>
                  <option value="Female" ${form.sex === 'Female' ? 'selected' : ''}>Female (F)</option>
                </select>
              </div>
              <div class="lg:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">Date of Birth <span class="text-teal-700">*</span></label>
                <input type="date" value="${escapeHTML(form.dob)}" onchange="optplusSyncFormField('dob', this.value)" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-slate-700 mb-1">Age (Mos)</label>
                <input type="text" id="optplus-child-age-display" readonly value="${ageMonths !== null && ageMonths >= 0 ? ageMonths : '—'}" class="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-center text-slate-800" />
              </div>
              <div class="lg:col-span-3">
                <label class="block text-xs font-bold text-slate-700 mb-1">Mother / Caregiver <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.motherName)}" oninput="optplusSyncFormField('motherName', this.value)" placeholder="Maria S. Dela Cruz" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div class="lg:col-span-4">
                <label class="block text-xs font-bold text-slate-700 mb-1">Purok / Sitio <span class="text-teal-700">*</span></label>
                <input type="text" value="${escapeHTML(form.purok)}" oninput="optplusSyncFormField('purok', this.value)" placeholder="Purok 3 - Sampaguita" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div class="lg:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">4Ps / NHTS</label>
                <select onchange="optplusSyncFormField('is4ps', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="No" ${form.is4ps === 'No' ? 'selected' : ''}>No</option>
                  <option value="Yes" ${form.is4ps === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
              </div>
              <div class="lg:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">IP Group</label>
                <select onchange="optplusSyncFormField('isIp', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="No" ${form.isIp === 'No' ? 'selected' : ''}>No</option>
                  <option value="Yes" ${form.isIp === 'Yes' ? 'selected' : ''}>Yes</option>
                </select>
              </div>
              <div class="lg:col-span-4">
                <label class="block text-xs font-bold text-slate-700 mb-1">Remarks / Action</label>
                <input type="text" value="${escapeHTML(form.remarks)}" oninput="optplusSyncFormField('remarks', this.value)" placeholder="Optional clinical / nutrition note" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>

          <!-- SECTION 3: MEASUREMENTS, SERVICES & LIVE WHO-CGS CLASSIFICATION -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left 7 Cols: Anthropometrics & Services -->
            <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div class="bg-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                    <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Measurements &amp; Nutrition Services</h3>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-teal-300">Anthropometry &amp; Micronutrients</span>
                </div>

                <div class="p-6 grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Weight (kg) <span class="text-teal-700">*</span></label>
                    <input type="number" step="0.01" min="1.5" max="35" value="${escapeHTML(form.weight)}" oninput="optplusSyncFormField('weight', this.value)" placeholder="8.4" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Length / Ht (cm) <span class="text-teal-700">*</span></label>
                    <input type="number" step="0.1" min="40" max="130" value="${escapeHTML(form.height)}" oninput="optplusSyncFormField('height', this.value)" placeholder="71.2" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Mode</label>
                    <input type="text" id="optplus-height-mode-display" readonly value="${ageMonths !== null && ageMonths >= 24 ? 'Standing' : 'Recumbent'}" class="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">MUAC (cm)</label>
                    <input type="number" step="0.1" min="6" max="25" value="${escapeHTML(form.muac)}" oninput="optplusSyncFormField('muac', this.value)" placeholder="13.8" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-bold text-slate-700 mb-1">Edema</label>
                    <select onchange="optplusSyncFormField('edema', this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="None" ${form.edema === 'None' ? 'selected' : ''}>None</option>
                      <option value="+1" ${form.edema === '+1' ? 'selected' : ''}>+1</option>
                      <option value="+2" ${form.edema === '+2' ? 'selected' : ''}>+2</option>
                      <option value="+3" ${form.edema === '+3' ? 'selected' : ''}>+3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" ${form.srvVitA ? 'checked' : ''} onchange="optplusSyncFormField('srvVitA', this.checked)" class="rounded text-teal-600 focus:ring-teal-500" />
                    <span>Vitamin A</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" ${form.srvDeworm ? 'checked' : ''} onchange="optplusSyncFormField('srvDeworm', this.checked)" class="rounded text-teal-600 focus:ring-teal-500" />
                    <span>Deworming</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" ${form.srvIycf ? 'checked' : ''} onchange="optplusSyncFormField('srvIycf', this.checked)" class="rounded text-teal-600 focus:ring-teal-500" />
                    <span>IYCF Counseling</span>
                  </label>
                </div>
                <button type="submit" class="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                  ✓ Save Child Record
                </button>
              </div>
            </div>

            <!-- Right 5 Cols: Streamlined Live WHO-CGS Status Strip -->
            <div class="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-800 flex flex-col justify-between gap-4">
              <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span class="text-xs font-extrabold uppercase tracking-wider text-teal-400 block">WHO-CGS Live Classification</span>
                  <span class="text-[11px] text-slate-400">Auto-computes Z-scores &amp; PIMAM MUAC/Edema rules</span>
                </div>
                <span id="optplus-overall-action-tag" class="text-xs font-extrabold px-2.5 py-1 rounded-lg ${actionTagClass}">
                  ${escapeHTML(actionTagText)}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80">
                  <div class="flex items-center justify-between text-[10px] text-slate-400">
                    <span class="font-extrabold">WFA</span>
                    <span id="optplus-wfa-z" class="font-mono">${liveWho ? `${liveWho.zWFA >= 0 ? '+' : ''}${liveWho.zWFA} SD` : '—'}</span>
                  </div>
                  <div class="mt-2">
                    <span id="optplus-wfa-badge" class="inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.wfaTone)}">
                      ${escapeHTML(liveWho ? liveWho.wfaLabel : '—')}
                    </span>
                  </div>
                  <div id="optplus-wfa-code" class="text-[10px] font-mono text-slate-400 mt-1">
                    ${liveWho ? `Code: ${liveWho.wfaCode}` : '—'}
                  </div>
                </div>

                <div class="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80">
                  <div class="flex items-center justify-between text-[10px] text-slate-400">
                    <span class="font-extrabold">L/HFA</span>
                    <span id="optplus-hfa-z" class="font-mono">${liveWho ? `${liveWho.zHFA >= 0 ? '+' : ''}${liveWho.zHFA} SD` : '—'}</span>
                  </div>
                  <div class="mt-2">
                    <span id="optplus-hfa-badge" class="inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.hfaTone)}">
                      ${escapeHTML(liveWho ? liveWho.hfaLabel : '—')}
                    </span>
                  </div>
                  <div id="optplus-hfa-code" class="text-[10px] font-mono text-slate-400 mt-1">
                    ${liveWho ? `Code: ${liveWho.hfaCode}` : '—'}
                  </div>
                </div>

                <div class="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80">
                  <div class="flex items-center justify-between text-[10px] text-slate-400">
                    <span class="font-extrabold">WFL/H</span>
                    <span id="optplus-wfh-z" class="font-mono">${liveWho ? `${liveWho.zWFH >= 0 ? '+' : ''}${liveWho.zWFH} SD` : '—'}</span>
                  </div>
                  <div class="mt-2">
                    <span id="optplus-wfh-badge" class="inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.wfhTone)}">
                      ${escapeHTML(liveWho ? liveWho.wfhLabel : '—')}
                    </span>
                  </div>
                  <div id="optplus-wfh-code" class="text-[10px] font-mono text-slate-400 mt-1">
                    ${liveWho ? `Code: ${liveWho.wfhCode}` : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      `
          : ''
      }

      ${
        activeTab === 'goals'
          ? `
        <!-- =================================================================== -->
        <!-- TAB 3: STREAMLINED 2-COLUMN GOAL COMPUTATION & BNAP REPORT          -->
        <!-- =================================================================== -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
            <!-- LEFT COLUMN (4 Cols): Parameters & Annual Reduction Target Sliders -->
            <div class="lg:col-span-4 space-y-6">
              <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div class="bg-slate-900 px-5 py-3.5 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                    <h3 class="text-xs font-extrabold uppercase tracking-wider text-white">Target Parameters</h3>
                  </div>
                  <button type="button" onclick="optplusExportGoalReportPdf()" class="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-extrabold transition cursor-pointer">
                    Goal Report PDF
                  </button>
                </div>

                <div class="p-5 grid grid-cols-2 gap-3.5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Barangay Pop.</label>
                    <input type="number" value="${escapeHTML(goals.totalPop)}" min="50" oninput="optplusUpdateGoalParam('totalPop', this.value)" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">NNC Factor (%)</label>
                    <input type="number" value="${escapeHTML(goals.popFactor)}" step="0.1" min="1" max="30" oninput="optplusUpdateGoalParam('popFactor', this.value)" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-extrabold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Manual Target</label>
                    <input type="number" value="${escapeHTML(goals.manualTarget)}" placeholder="Auto (10.8%)" min="1" oninput="optplusUpdateGoalParam('manualTarget', this.value)" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Target Coverage %</label>
                    <select onchange="optplusUpdateGoalParam('targetCovPct', this.value)" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-extrabold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="80" ${Number(goals.targetCovPct) === 80 ? 'selected' : ''}>80%</option>
                      <option value="90" ${Number(goals.targetCovPct) === 90 ? 'selected' : ''}>90%</option>
                      <option value="95" ${Number(goals.targetCovPct) === 95 ? 'selected' : ''}>95%</option>
                      <option value="100" ${Number(goals.targetCovPct) === 100 ? 'selected' : ''}>100%</option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-bold text-slate-700 mb-1">Weighing Days Remaining</label>
                    <input type="number" value="${escapeHTML(goals.daysLeft)}" min="1" max="90" oninput="optplusUpdateGoalParam('daysLeft', this.value)" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
              </div>

              <!-- Annual Reduction Target Sliders -->
              <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div class="bg-slate-900 px-5 py-3.5 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                    <h3 class="text-xs font-extrabold uppercase tracking-wider text-white">Annual Reduction Targets (BNAP)</h3>
                  </div>
                </div>

                <div class="p-5 space-y-3.5">
                  <div class="bg-amber-50/70 rounded-xl p-3 border border-amber-200">
                    <div class="flex justify-between text-xs font-extrabold text-amber-900">
                      <span>Stunting Reduction %</span>
                      <span>${stuntRedPct}%</span>
                    </div>
                    <input type="range" min="5" max="100" step="5" value="${stuntRedPct}" onchange="optplusUpdateGoalParam('stuntRedPct', this.value)" class="w-full accent-teal-600 mt-1.5 cursor-pointer" />
                    <div class="flex justify-between text-[11px] text-slate-700 mt-1">
                      <span>Current Cases: <strong>${totalStunted}</strong></span>
                      <span>Rehab Goal: <strong class="text-amber-900">${stuntGoal}</strong></span>
                    </div>
                  </div>

                  <div class="bg-rose-50/70 rounded-xl p-3 border border-rose-200">
                    <div class="flex justify-between text-xs font-extrabold text-rose-900">
                      <span>Wasting Reduction %</span>
                      <span>${wasteRedPct}%</span>
                    </div>
                    <input type="range" min="10" max="100" step="5" value="${wasteRedPct}" onchange="optplusUpdateGoalParam('wasteRedPct', this.value)" class="w-full accent-teal-600 mt-1.5 cursor-pointer" />
                    <div class="flex justify-between text-[11px] text-slate-700 mt-1">
                      <span>Current Cases: <strong>${totalWasted}</strong></span>
                      <span>Rehab Goal: <strong class="text-rose-900">${wasteGoal}</strong></span>
                    </div>
                  </div>

                  <div class="bg-sky-50/70 rounded-xl p-3 border border-sky-200">
                    <div class="flex justify-between text-xs font-extrabold text-sky-900">
                      <span>Underweight Reduction %</span>
                      <span>${uwRedPct}%</span>
                    </div>
                    <input type="range" min="5" max="100" step="5" value="${uwRedPct}" onchange="optplusUpdateGoalParam('uwRedPct', this.value)" class="w-full accent-teal-600 mt-1.5 cursor-pointer" />
                    <div class="flex justify-between text-[11px] text-slate-700 mt-1">
                      <span>Current Cases: <strong>${totalUw}</strong></span>
                      <span>Rehab Goal: <strong class="text-sky-900">${uwGoal}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN (8 Cols): KPI Cards, Prevalence vs Target Table, Commodity Forecast -->
            <div class="lg:col-span-8 space-y-6">
              <!-- KPI Summary Cards -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Est. 0–59m Pop</span>
                  <p class="text-xl font-extrabold text-slate-900 mt-1">${estEligible.toLocaleString()}</p>
                </div>
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Measured</span>
                  <p class="text-xl font-extrabold text-teal-700 mt-1">${measuredCount.toLocaleString()}</p>
                </div>
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Coverage %</span>
                  <p class="text-xl font-extrabold text-teal-600 mt-1">${coveragePct.toFixed(1)}%</p>
                </div>
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Daily Quota</span>
                  <p class="text-xl font-extrabold text-slate-900 mt-1">${dailyQuota} / day</p>
                </div>
              </div>

              <!-- Prevalence vs Target Goal Table -->
              <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div class="bg-slate-900 px-6 py-3.5 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                    <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">Prevalence vs. Target Goal</h3>
                  </div>
                  <span class="text-xs font-mono font-bold text-teal-300">n = ${measuredCount}</span>
                </div>
                <div class="overflow-x-auto p-4">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 text-[11px] font-extrabold uppercase border-b border-slate-200">
                        <th class="py-2.5 px-3">Indicator</th>
                        <th class="py-2.5 px-3 text-center">Cases</th>
                        <th class="py-2.5 px-3 text-center">Prevalence</th>
                        <th class="py-2.5 px-3 text-center">Target Rehab</th>
                        <th class="py-2.5 px-3 w-36">Share</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      ${prevalenceRows
                        .map((row) => {
                          const pct = measuredCount > 0 ? (row.count / denom) * 100 : 0;
                          return `
                          <tr>
                            <td class="py-2.5 px-3 font-bold text-slate-900">${escapeHTML(row.label)}</td>
                            <td class="py-2.5 px-3 text-center font-extrabold">${row.count}</td>
                            <td class="py-2.5 px-3 text-center font-mono">${pct.toFixed(1)}%</td>
                            <td class="py-2.5 px-3 text-center font-extrabold text-teal-800">${escapeHTML(row.goal)}</td>
                            <td class="py-2.5 px-3">
                              <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full ${row.barColor}" style="width: ${Math.min(100, pct).toFixed(0)}%"></div>
                              </div>
                            </td>
                          </tr>
                        `;
                        })
                        .join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Commodity Forecast -->
              <div class="bg-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-800">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-teal-400">DOH / NNC Nutrition Commodity Forecast</h3>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">PIMAM &amp; Micronutrient Standards</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div class="bg-slate-800/90 rounded-xl p-3 border border-rose-500/30">
                    <span class="text-[10px] font-extrabold text-rose-400 uppercase">RUTF (SAM)</span>
                    <p class="text-base font-extrabold text-white mt-1">${(sam * 140).toLocaleString()}</p>
                    <span class="text-[10px] text-slate-400">${sam} SAM cases</span>
                  </div>
                  <div class="bg-slate-800/90 rounded-xl p-3 border border-amber-500/30">
                    <span class="text-[10px] font-extrabold text-amber-400 uppercase">RUSF (MAM)</span>
                    <p class="text-base font-extrabold text-white mt-1">${(mam * 60).toLocaleString()}</p>
                    <span class="text-[10px] text-slate-400">${mam} MAM cases</span>
                  </div>
                  <div class="bg-slate-800/90 rounded-xl p-3 border border-teal-500/30">
                    <span class="text-[10px] font-extrabold text-teal-300 uppercase">MNP Sachets</span>
                    <p class="text-base font-extrabold text-white mt-1">${(eligibleMnp * 60).toLocaleString()}</p>
                    <span class="text-[10px] text-slate-400">${eligibleMnp} children</span>
                  </div>
                  <div class="bg-slate-800/90 rounded-xl p-3 border border-sky-500/30">
                    <span class="text-[10px] font-extrabold text-sky-400 uppercase">Vit A Caps</span>
                    <p class="text-base font-extrabold text-white mt-1">${eligibleVitA.toLocaleString()}</p>
                    <span class="text-[10px] text-slate-400">6–59 mos</span>
                  </div>
                  <div class="col-span-2 sm:col-span-1 bg-slate-800/90 rounded-xl p-3 border border-indigo-500/30">
                    <span class="text-[10px] font-extrabold text-indigo-400 uppercase">Albendazole</span>
                    <p class="text-base font-extrabold text-white mt-1">${eligibleDeworm.toLocaleString()}</p>
                    <span class="text-[10px] text-slate-400">12–59 mos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Printable / Downloadable BNAP Goal Report Sheet -->
          <div class="overflow-x-auto pb-2">
            <div id="optplus-goal-report-sheet" class="paper-a4 print-only-target mx-auto bg-white text-slate-900 border border-slate-300 shadow-xs p-6 text-xs space-y-4">
              <div class="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
                <div>
                  <div class="text-[10px] font-bold uppercase tracking-widest text-teal-800">Republic of the Philippines • Department of Health • National Nutrition Council</div>
                  <h3 class="text-base font-black uppercase tracking-tight text-slate-900">OPT Plus Coverage &amp; BNAP Goal Computation Report</h3>
                  <div class="text-xs font-semibold text-slate-600 mt-0.5">
                    Barangay: <strong>${escapeHTML(sampleMeta.barangay)}</strong> | City/Mun: <strong>${escapeHTML(sampleMeta.city)}</strong> | OPT Year: <strong>${escapeHTML(sampleMeta.optYear)}</strong>
                  </div>
                </div>
                <div class="text-right bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5">
                  <div class="text-[9px] font-bold uppercase text-slate-500">Generated Date</div>
                  <div class="text-xs font-black text-slate-900">${new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-3 text-center">
                <div class="p-3 rounded-xl border border-slate-300 bg-slate-50">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Est. 0–59m Pop</div>
                  <div class="text-base font-black text-slate-900 mt-0.5">${estEligible.toLocaleString()}</div>
                </div>
                <div class="p-3 rounded-xl border border-slate-300 bg-slate-50">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Actual Measured</div>
                  <div class="text-base font-black text-teal-800 mt-0.5">${measuredCount.toLocaleString()}</div>
                </div>
                <div class="p-3 rounded-xl border border-slate-300 bg-slate-50">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Coverage Rate</div>
                  <div class="text-base font-black text-teal-700 mt-0.5">${coveragePct.toFixed(1)}%</div>
                </div>
                <div class="p-3 rounded-xl border border-slate-300 bg-slate-50">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Required Daily Quota</div>
                  <div class="text-base font-black text-slate-900 mt-0.5">${dailyQuota} / day</div>
                </div>
              </div>

              <div>
                <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mb-1">
                  I. Prevalence vs. Annual BNAP Rehabilitation Target (n = ${measuredCount})
                </div>
                <table class="w-full border-collapse border border-slate-300 text-xs">
                  <thead class="bg-slate-100 font-bold">
                    <tr>
                      <th class="border border-slate-300 p-2 text-left">Nutritional Indicator</th>
                      <th class="border border-slate-300 p-2 text-center">Current Cases</th>
                      <th class="border border-slate-300 p-2 text-center">Prevalence %</th>
                      <th class="border border-slate-300 p-2 text-center">Annual Rehab Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${prevalenceRows
                      .map((r) => {
                        const pct = measuredCount > 0 ? (r.count / denom) * 100 : 0;
                        return `
                        <tr>
                          <td class="border border-slate-300 p-2 font-bold">${escapeHTML(r.label)}</td>
                          <td class="border border-slate-300 p-2 text-center font-bold">${r.count}</td>
                          <td class="border border-slate-300 p-2 text-center font-mono">${pct.toFixed(1)}%</td>
                          <td class="border border-slate-300 p-2 text-center font-extrabold text-teal-800">${escapeHTML(r.goal)}</td>
                        </tr>
                      `;
                      })
                      .join('')}
                  </tbody>
                </table>
              </div>

              <div>
                <div class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 mb-1">
                  II. DOH / NNC Nutrition Commodity Requirements Forecast
                </div>
                <table class="w-full border-collapse border border-slate-300 text-xs">
                  <thead class="bg-slate-100 font-bold">
                    <tr>
                      <th class="border border-slate-300 p-2 text-left">Commodity Item</th>
                      <th class="border border-slate-300 p-2 text-center">Forecasted Quantity</th>
                      <th class="border border-slate-300 p-2 text-left">Target Beneficiary Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border border-slate-300 p-2 font-bold">Ready-to-Use Therapeutic Food (RUTF Sachets)</td>
                      <td class="border border-slate-300 p-2 text-center font-extrabold">${(sam * 140).toLocaleString()}</td>
                      <td class="border border-slate-300 p-2">${sam} Severely Wasted (SAM) cases</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-300 p-2 font-bold">Ready-to-Use Supplementary Food (RUSF Packs)</td>
                      <td class="border border-slate-300 p-2 text-center font-extrabold">${(mam * 60).toLocaleString()}</td>
                      <td class="border border-slate-300 p-2">${mam} Moderately Wasted (MAM) cases</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-300 p-2 font-bold">Micronutrient Powder (MNP Sachets)</td>
                      <td class="border border-slate-300 p-2 text-center font-extrabold">${(eligibleMnp * 60).toLocaleString()}</td>
                      <td class="border border-slate-300 p-2">${eligibleMnp} children (6–23 mos)</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-300 p-2 font-bold">Vitamin A Capsules (100,000 / 200,000 IU)</td>
                      <td class="border border-slate-300 p-2 text-center font-extrabold">${eligibleVitA.toLocaleString()}</td>
                      <td class="border border-slate-300 p-2">Eligible children (6–59 mos)</td>
                    </tr>
                    <tr>
                      <td class="border border-slate-300 p-2 font-bold">Albendazole 400mg Tablets (Deworming)</td>
                      <td class="border border-slate-300 p-2 text-center font-extrabold">${eligibleDeworm.toLocaleString()}</td>
                      <td class="border border-slate-300 p-2">Eligible children (12–59 mos)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}
