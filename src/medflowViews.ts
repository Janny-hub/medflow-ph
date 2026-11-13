import {
  PH_LAB_CATALOG,
  PH_IMAGING_CATALOG,
  ANC_TRIMESTER_TESTS,
  ANC_DANGER_SIGNS,
  PH_CPG_CATALOG
} from './catalogs';

export function escapeHTML(str: any): string {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function findDiagnosticCategoryLabel(testName: string): string {
  for (const [cat, items] of Object.entries(PH_LAB_CATALOG)) {
    if (items.includes(testName)) return `${testName} (${cat})`;
  }
  for (const [cat, items] of Object.entries(PH_IMAGING_CATALOG)) {
    if (items.includes(testName)) return `${testName} (${cat})`;
  }
  return testName;
}

export function buildA4SoapRecordSheetHTML(doc: any, p: any, recordPrefix = 'CONS'): string {
  const ds = p.doctorSoap || { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
  const meds = ds.medications || [];
  const selectedLabs: string[] = p.diagnostics?.labs || [];
  const selectedImaging: string[] = p.diagnostics?.imaging || [];
  const allDiagnosticsWithCategory = [
    ...selectedLabs.map(findDiagnosticCategoryLabel),
    ...selectedImaging.map(findDiagnosticCategoryLabel)
  ];

  const isTrainee = doc.role === 'Medical Clerk' || doc.role === 'Medical Intern';
  const recNum = String(p.id || '001').replace(/[^0-9]/g, '').slice(-4) || '1001';
  const recordIdDisplay = p.patientType === 'antenatal' ? `ANC-${recNum}` : `${recordPrefix}-${recNum}`;
  const visitDate = p.consultationDate || new Date().toISOString().split('T')[0];

  const defaultObjective =
    ds.objective ||
    `Vital Signs: BP ${p.vitals?.bp || '-'} mmHg | HR ${p.vitals?.hr || '-'} bpm | RR ${p.vitals?.rr || '-'} cpm | Temp ${p.vitals?.temp || '-'}°C | SpO2 ${p.vitals?.spo2 || '-'}% | Wt ${p.vitals?.weight || '-'} kg | Ht ${p.vitals?.height || '-'} cm | BMI ${p.vitals?.bmi || '-'} kg/m² (${p.vitals?.bmiCategory || '-'}).\nPhysical Examination:\nGeneral: ${p.peFindings || 'Awake, alert, coherent, not in acute cardiorespiratory distress.'}`;

  return `
    <div class="flex flex-col justify-between min-h-[262mm] text-slate-900">
      <div>
        <!-- Top Clinic / Facility Header -->
        <div class="border-b-2 border-slate-900 pb-3 mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-tight">${escapeHTML(doc.facility || doc.clinic || 'MEDICAL & DIAGNOSTIC CLINIC')}</h2>
            ${doc.address ? `<p class="text-[11px] text-slate-600 mt-0.5">${escapeHTML(doc.address)}</p>` : ''}
            <p class="text-[11px] text-slate-600 mt-0.5">
              ${doc.phone ? `Contact: ${escapeHTML(doc.phone)}` : ''}
              ${isTrainee && doc.school ? `${doc.phone ? ' | ' : ''}Affiliation: ${escapeHTML(doc.school)}` : ''}
            </p>
          </div>
          <div class="text-left sm:text-right shrink-0">
            <span class="inline-block bg-slate-900 text-white text-[10.5px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded">OUTPATIENT CLINICAL RECORD (SOAP)</span>
            <p class="text-[10px] text-slate-500 mt-1">Record ID: ${escapeHTML(recordIdDisplay)} • Date: ${escapeHTML(visitDate)}</p>
          </div>
        </div>

        <!-- Patient Demographics Box -->
        <div class="bg-slate-50/90 border border-slate-300 rounded-lg p-3.5 mb-4 text-[11px] space-y-1.5">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-5">
              <span class="font-extrabold uppercase text-slate-900">PATIENT NAME:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.name)}</span>
            </div>
            <div class="sm:col-span-4">
              <span class="font-extrabold uppercase text-slate-900">AGE / SEX:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.age)} y/o / ${escapeHTML(p.sex)}</span>
            </div>
            <div class="sm:col-span-3">
              <span class="font-extrabold uppercase text-slate-900">PATIENT ID:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.id)}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-5">
              <span class="font-extrabold uppercase text-slate-900">ADDRESS:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.address || 'N/A')}</span>
            </div>
            <div class="sm:col-span-4">
              <span class="font-extrabold uppercase text-slate-900">CIVIL STATUS:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.civilStatus || 'Single')}</span>
            </div>
            <div class="sm:col-span-3">
              <span class="font-extrabold uppercase text-slate-900">PHILHEALTH:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.philhealth || 'N/A')}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-0.5">
            <div class="sm:col-span-7">
              <span class="font-extrabold uppercase text-slate-900">CHIEF COMPLAINT:</span>
              <span class="text-slate-800 ml-1">${escapeHTML(p.chiefComplaint || 'Routine consultation')}</span>
            </div>
            <div class="sm:col-span-5 sm:text-right">
              <span class="font-extrabold uppercase text-rose-700">ALLERGIES:</span>
              <span class="text-rose-700 ml-1">${escapeHTML(p.allergies || 'No Known Drug Allergies (NKDA)')}</span>
            </div>
          </div>
        </div>

        <!-- Boxed S-O-A-P Sections -->
        <div class="space-y-3 text-xs leading-relaxed">
          <!-- S -->
          <div class="border border-slate-300 rounded-lg overflow-hidden bg-white">
            <div class="bg-slate-100/90 border-b border-slate-300 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              S — SUBJECTIVE
            </div>
            <div class="p-3.5 text-slate-800 whitespace-pre-line" id="print-soap-subjective">${escapeHTML(ds.subjective || p.hpi || p.chiefComplaint || '')}</div>
          </div>

          <!-- O -->
          <div class="border border-slate-300 rounded-lg overflow-hidden bg-white">
            <div class="bg-slate-100/90 border-b border-slate-300 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              O — OBJECTIVE
            </div>
            <div class="p-3.5 text-slate-800 whitespace-pre-line" id="print-soap-objective">${escapeHTML(defaultObjective)}</div>
          </div>

          <!-- A -->
          <div class="border border-slate-300 rounded-lg overflow-hidden bg-white">
            <div class="bg-slate-100/90 border-b border-slate-300 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              A — ASSESSMENT / DIAGNOSIS
            </div>
            <div class="p-3.5 font-bold text-slate-900 whitespace-pre-line" id="print-soap-assessment">${escapeHTML(ds.assessment || '')}</div>
          </div>

          <!-- P -->
          <div class="border border-slate-300 rounded-lg overflow-hidden bg-white">
            <div class="bg-slate-100/90 border-b border-slate-300 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              P — PLAN
            </div>
            <div class="p-3.5 text-slate-800 space-y-3">
              <div class="whitespace-pre-line" id="print-soap-plan">${escapeHTML(ds.plan || '')}</div>

              ${meds.length > 0 ? `
                <div class="pt-2.5 border-t border-slate-200 text-[11.5px]">
                  <p class="font-bold text-slate-900 mb-1">Medications:</p>
                  <ol class="list-decimal list-inside space-y-0.5 text-slate-800">
                    ${meds.map((m: any) => `
                      <li>
                        ${escapeHTML(m.genericName)}${m.brandExample ? ` (${escapeHTML(m.brandExample)})` : ''} ${escapeHTML(m.quantity || '')} — ${escapeHTML(m.sig || '')}
                      </li>
                    `).join('')}
                  </ol>
                </div>
              ` : ''}

              ${allDiagnosticsWithCategory.length > 0 ? `
                <div class="pt-2.5 border-t border-slate-200 text-[11.5px]">
                  <p class="text-slate-800">
                    <strong class="text-slate-900">Requested Diagnostics:</strong>
                    ${escapeHTML(allDiagnosticsWithCategory.join(', '))}
                  </p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Signature & Confidential Footer -->
      <div class="pt-8 mt-8">
        <div class="border-t border-slate-300 pt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[11px]">
          <div class="text-slate-500 space-y-0.5">
            <p class="font-bold text-slate-600">Confidential Medical Record • MedFlow PH</p>
            <p>Follow-up Date: <span class="font-semibold text-slate-800">${escapeHTML(ds.followUpDate || 'As advised')}</span></p>
          </div>
          <div class="text-left sm:text-right min-w-[240px]">
            <div class="border-t-[1.5px] border-slate-900 pt-1.5">
              <p class="font-extrabold text-xs text-slate-900">${escapeHTML(doc.name)}</p>
              <p class="text-[11px] text-slate-600">
                ${isTrainee ? `${escapeHTML(doc.role)}${doc.school ? ` (${escapeHTML(doc.school)})` : ''}` : `Licensed Physician${doc.specialty ? ` (${escapeHTML(doc.specialty)})` : ''}`}
              </p>
              <p class="text-[10.5px] text-slate-700 mt-0.5">
                PRC Lic. No.: <strong>${escapeHTML(doc.prc || 'N/A')}</strong> • PTR No.: <strong>${escapeHTML(doc.ptr || 'N/A')}</strong>
              </p>
              ${isTrainee && doc.supervisingDoctor ? `
                <p class="text-[10.5px] text-slate-800 mt-0.5">
                  Supervising MD: <strong>${escapeHTML(doc.supervisingDoctor)}</strong>
                </p>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function buildDualLabImagingRequestSheetHTML(doc: any, p: any): string {
  const diag = p.diagnostics || { labs: [], imaging: [], clinicalImpression: '', priority: 'Routine', notes: '' };
  const selectedLabs: string[] = diag.labs || [];
  const selectedImaging: string[] = diag.imaging || [];
  const visitDate = p.consultationDate || new Date().toISOString().split('T')[0];
  const priority = diag.priority || 'Routine';
  const impression = diag.clinicalImpression || p.chiefComplaint || p.doctorSoap?.assessment || 'For diagnostic evaluation';
  const isTrainee = doc.role === 'Medical Clerk' || doc.role === 'Medical Intern';

  // Group selected labs by PH_LAB_CATALOG category
  const labGroupsHTML: string[] = [];
  const matchedLabs = new Set<string>();
  for (const [catName, items] of Object.entries(PH_LAB_CATALOG)) {
    const picked = items.filter((item) => selectedLabs.includes(item));
    if (picked.length > 0) {
      picked.forEach((i) => matchedLabs.add(i));
      labGroupsHTML.push(`
        <div class="mb-3">
          <div class="bg-slate-100 border-l-[3px] border-teal-700 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
            ${escapeHTML(catName.toUpperCase())}
          </div>
          <ul class="space-y-1 pl-1 text-[11px] font-bold text-slate-900">
            ${picked.map((item) => `<li class="flex items-start gap-1.5"><span class="font-normal text-slate-700 leading-none">☑</span><span>${escapeHTML(item)}</span></li>`).join('')}
          </ul>
        </div>
      `);
    }
  }
  const customLabs = selectedLabs.filter((item) => !matchedLabs.has(item));
  if (customLabs.length > 0) {
    labGroupsHTML.push(`
      <div class="mb-3">
        <div class="bg-slate-100 border-l-[3px] border-teal-700 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
          OTHER LABORATORY REQUESTS
        </div>
        <ul class="space-y-1 pl-1 text-[11px] font-bold text-slate-900">
          ${customLabs.map((item) => `<li class="flex items-start gap-1.5"><span class="font-normal text-slate-700 leading-none">☑</span><span>${escapeHTML(item)}</span></li>`).join('')}
        </ul>
      </div>
    `);
  }

  // Group selected imaging by PH_IMAGING_CATALOG category
  const imagingGroupsHTML: string[] = [];
  const matchedImaging = new Set<string>();
  for (const [catName, items] of Object.entries(PH_IMAGING_CATALOG)) {
    const picked = items.filter((item) => selectedImaging.includes(item));
    if (picked.length > 0) {
      picked.forEach((i) => matchedImaging.add(i));
      imagingGroupsHTML.push(`
        <div class="mb-3">
          <div class="bg-slate-100 border-l-[3px] border-teal-700 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
            ${escapeHTML(catName.toUpperCase())}
          </div>
          <ul class="space-y-1 pl-1 text-[11px] font-bold text-slate-900">
            ${picked.map((item) => `<li class="flex items-start gap-1.5"><span class="font-normal text-slate-700 leading-none">☑</span><span>${escapeHTML(item)}</span></li>`).join('')}
          </ul>
        </div>
      `);
    }
  }
  const customImaging = selectedImaging.filter((item) => !matchedImaging.has(item));
  if (customImaging.length > 0) {
    imagingGroupsHTML.push(`
      <div class="mb-3">
        <div class="bg-slate-100 border-l-[3px] border-teal-700 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
          OTHER IMAGING REQUESTS
        </div>
        <ul class="space-y-1 pl-1 text-[11px] font-bold text-slate-900">
          ${customImaging.map((item) => `<li class="flex items-start gap-1.5"><span class="font-normal text-slate-700 leading-none">☑</span><span>${escapeHTML(item)}</span></li>`).join('')}
        </ul>
      </div>
    `);
  }

  function buildRequestHalfColumn(bannerTitle: string, groupsContentHTML: string, emptyLabel: string): string {
    return `
      <div class="flex flex-col justify-between min-h-[142mm] p-5 text-slate-900">
        <div>
          <!-- Centered Facility Header -->
          <div class="text-center mb-2">
            <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900">${escapeHTML(doc.facility || doc.clinic || 'MEDICAL & DIAGNOSTIC CLINIC')}</h3>
            ${doc.address ? `<p class="text-[10px] text-slate-500 mt-0.5">${escapeHTML(doc.address)}</p>` : ''}
            ${doc.phone ? `<p class="text-[9.5px] text-slate-500">Contact: ${escapeHTML(doc.phone)}</p>` : ''}
          </div>

          <!-- Dark Banner -->
          <div class="bg-slate-900 text-white text-center font-extrabold text-[11px] uppercase tracking-widest py-1.5 mb-2.5">
            ${escapeHTML(bannerTitle)}
          </div>

          <!-- Patient & Impression Block -->
          <div class="border-b border-slate-300 pb-2.5 mb-3 text-[11px] space-y-0.5">
            <div class="flex justify-between gap-2">
              <span><strong>Patient:</strong> ${escapeHTML(p.name)}</span>
              <span><strong>Date:</strong> ${escapeHTML(visitDate)}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span><strong>Age/Sex:</strong> ${escapeHTML(p.age)}/${escapeHTML((p.sex || 'U').charAt(0).toUpperCase())}</span>
              <span><strong>Priority:</strong> ${escapeHTML(priority)}</span>
            </div>
            <div class="pt-0.5 leading-snug">
              <strong>Impression:</strong> ${escapeHTML(impression)}
            </div>
          </div>

          <!-- Categorized Checkboxes -->
          <div>
            ${groupsContentHTML || `<p class="text-xs text-slate-400 italic py-4">${escapeHTML(emptyLabel)}</p>`}
          </div>
        </div>

        <!-- Bottom Signature Footer -->
        <div class="pt-4 mt-4 border-t border-slate-200 flex justify-between items-end text-[10px]">
          <div class="text-slate-400 space-y-0.5">
            <p class="font-medium">ID: ${escapeHTML(p.id)}</p>
            <p>A6 Request Sheet</p>
          </div>
          <div class="text-right min-w-[175px]">
            <div class="border-t-[1.5px] border-slate-900 pt-1">
              <p class="font-extrabold text-[11px] text-slate-900">${escapeHTML(doc.name)}</p>
              <p class="text-[10px] text-slate-600">PRC Lic. No.: <strong>${escapeHTML(doc.prc || 'N/A')}</strong></p>
              ${isTrainee && doc.supervisingDoctor ? `<p class="text-[9.5px] text-slate-700">Supv. MD: <strong>${escapeHTML(doc.supervisingDoctor)}</strong></p>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-300 shadow-md max-w-[260mm] mx-auto">
      <div class="border-b md:border-b-0 md:border-r-2 border-dashed border-slate-300">
        ${buildRequestHalfColumn('LABORATORY REQUEST FORM', labGroupsHTML.join(''), 'No laboratory tests selected.')}
      </div>
      <div>
        ${buildRequestHalfColumn('IMAGING & DIAGNOSTIC REQUEST', imagingGroupsHTML.join(''), 'No imaging or diagnostic studies selected.')}
      </div>
    </div>
  `;
}

export function renderPatientSelectorBannerHTML(appState: any, activePatient: any): string {
  const patients = appState.patients || [];
  return `
    <div class="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6 no-print">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-2xs">
            ${activePatient ? escapeHTML(activePatient.name.charAt(0).toUpperCase()) : '?'}
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold uppercase tracking-widest text-teal-700 block">Active Patient Record</span>
            ${
              activePatient
                ? `<h3 class="text-sm sm:text-base font-extrabold text-slate-900 truncate">${escapeHTML(activePatient.name)}</h3>`
                : `<h3 class="text-sm font-bold text-slate-600">No Patient Selected</h3>`
            }
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <select onchange="selectActivePatient(this.value)" class="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
            ${patients.length === 0 ? `<option value="">-- No Patients Yet --</option>` : ''}
            ${patients.map((pt: any) => `
              <option value="${escapeHTML(pt.id)}" ${activePatient && activePatient.id === pt.id ? 'selected' : ''}>
                ${escapeHTML(pt.name)} (${escapeHTML(pt.age)}/${escapeHTML(pt.sex)})
              </option>
            `).join('')}
          </select>
          <button onclick="startNewPatientRegistration()" class="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer">
            + New
          </button>
        </div>
      </div>

      ${
        activePatient
          ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3.5 text-xs">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Age / Sex</span>
            <span class="font-bold text-slate-900 mt-0.5 block">${escapeHTML(activePatient.age)} yrs / ${escapeHTML(activePatient.sex)}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Category</span>
            <span class="font-bold text-teal-800 mt-0.5 block">${activePatient.patientType === 'antenatal' ? 'Antenatal / OB' : 'General / OPD'}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Visit Date</span>
            <span class="font-bold text-slate-900 mt-0.5 block">${escapeHTML(activePatient.consultationDate || '-')}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">BP / Heart Rate</span>
            <span class="font-bold text-slate-900 mt-0.5 block">${escapeHTML(activePatient.vitals?.bp || '-')} mmHg • ${escapeHTML(activePatient.vitals?.hr || '-')} bpm</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Wt / Ht / BMI</span>
            <span class="font-bold text-slate-900 mt-0.5 block">${escapeHTML(activePatient.vitals?.weight || '-')}kg • ${escapeHTML(activePatient.vitals?.height || '-')}cm (${escapeHTML(activePatient.vitals?.bmi || '-')})</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Chief Complaint</span>
            <span class="font-bold text-slate-900 mt-0.5 truncate block" title="${escapeHTML(activePatient.chiefComplaint || 'Routine consultation')}">${escapeHTML(activePatient.chiefComplaint || 'Routine consultation')}</span>
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
}

export function resolveAncTrimesterBundle(trimesterVal: string) {
  const t = (trimesterVal || '1st').toLowerCase();
  let matchedKey = '1st Visit (Baseline)';
  if (t.includes('2nd') || t.includes('24')) {
    matchedKey = '2nd Trimester (24–28 weeks)';
  } else if (t.includes('3rd') || t.includes('32')) {
    matchedKey = '3rd Trimester (32–36+ weeks)';
  }

  const raw = ANC_TRIMESTER_TESTS[matchedKey] || Object.values(ANC_TRIMESTER_TESTS)[0] || {};
  const labsList: string[] = Array.isArray(raw.labs)
    ? raw.labs
    : raw.labs && typeof raw.labs === 'object'
    ? (Object.values(raw.labs).flat() as string[])
    : [];
  const imagingList: string[] = Array.isArray(raw.imaging)
    ? raw.imaging
    : raw.imaging && typeof raw.imaging === 'object'
    ? (Object.values(raw.imaging).flat() as string[])
    : [];
  const itemsList: string[] = Array.isArray(raw.items) ? raw.items : [];

  return {
    key: matchedKey,
    label: `${matchedKey} Screening Workup`,
    labs: labsList,
    imaging: imagingList,
    items: itemsList
  };
}

const DOH_IRON_FOLATE_OPTIONS = [
  'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg 1 tab PO OD (Standard DOH Prophylaxis — 180 tabs)',
  'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg 1 tab PO BID (Therapeutic for Maternal Anemia Hb <11 g/dL)',
  'Folic Acid 400mcg (0.4mg) 1 tab PO OD (Pre-conception / 1st Trimester Neural Tube Defect Prevention)',
  'Folic Acid 4mg (4,000mcg) 1 tab PO OD (High-Risk / Prior Neural Tube Defect History)',
  'Iron Polymaltose Complex + Folic Acid 1 tab PO OD (Alternative for GI Intolerance)',
  'Deferred / Not Yet Started'
];

const DOH_CALCIUM_OPTIONS = [
  'Calcium Carbonate 500mg Elemental Calcium 1 tab PO TID with meals (1.5g/day DOH Preeclampsia Prevention from 20 wks)',
  'Calcium Carbonate 500mg Elemental Calcium 1 tab PO BID with meals (1.0g/day Maintenance)',
  'Calcium Carbonate 600mg + Vitamin D3 400 IU 1 tab PO BID with meals',
  'Not Yet Indicated (<20 Weeks AOG — Start at 20 Weeks)',
  'Deferred / Contraindicated'
];

const DOH_TETANUS_VACCINE_OPTIONS = [
  'Td1 — 1st Dose (Administer at first prenatal contact / as early as possible)',
  'Td2 — 2nd Dose (At least 4 weeks after Td1 • Protects current pregnancy / 3 yrs)',
  'Td3 — 3rd Dose (At least 6 months after Td2 • 5 years protection)',
  'Td4 — 4th Dose (At least 1 year after Td3 • 10 years protection)',
  'Td5 — 5th Dose (At least 1 year after Td4 • Lifetime Protection / Fully Immunized Mother)',
  'Tdap (Tetanus, Diphtheria, Acellular Pertussis) — 0.5 mL IM at 27–36 weeks AOG',
  'Pending / Not Yet Administered'
];

const DOH_DEWORMING_OPTIONS = [
  'Albendazole 400mg Chewable Tablet — Single PO Dose in 2nd or 3rd Trimester (DOH Standard)',
  'Mebendazole 500mg Tablet — Single PO Dose in 2nd or 3rd Trimester (DOH Alternative)',
  'Contraindicated in 1st Trimester (<14 wks AOG) — Scheduled for 2nd Trimester',
  'Completed Single Dose During Current Pregnancy',
  'Deferred / Not Indicated'
];

const DOH_OTHER_MATERNAL_VACCINES = [
  'Routine Tetanus Diphtheria (Td) Only',
  'Inactivated Influenza Vaccine (0.5 mL IM Single Dose — Any Trimester)',
  'Hepatitis B Vaccine Recombinant (3-Dose Series 0, 1, 6 mos for HBsAg-Negative High-Risk)',
  'Both Influenza + Hepatitis B Vaccines Administered',
  'Calcium + Iodine Capsule (Potassium Iodate 200mcg for Endemic Iodine Deficiency Area)'
];

export function getPatientPrenatalVisits(p: any): any[] {
  const anc = p?.anc || {};
  if (Array.isArray(anc.prenatalVisits) && anc.prenatalVisits.length > 0) {
    return anc.prenatalVisits;
  }
  const visitDate = p?.consultationDate || new Date().toISOString().split('T')[0];
  return [
    {
      visitNo: 1,
      date: visitDate,
      aog: `${anc.aogWeeks || 'Baseline'} (${anc.trimester || '1st'} Tri)`,
      bpWeight: `${p?.vitals?.bp || '-'} mmHg • ${p?.vitals?.weight || '-'} kg`,
      obExam: `FH: ${anc.fundicHeight || '-'} • FHT: ${anc.fht || '-'} • ${anc.presentation || 'Cephalic'}`,
      careSummary: `${anc.tetanusStatus || 'Td1'} • ${anc.ironFolate || 'Iron + Folic Acid'}`,
      nextVisit: p?.doctorSoap?.followUpDate || 'In 4 weeks'
    }
  ];
}

export function buildRekordNiNanayHalfBondHTML(doc: any, p: any): string {
  const anc = p.anc || {};
  const visits = getPatientPrenatalVisits(p);
  const visitCount = anc.prenatalVisitCount || visits.length;
  const isTrainee = doc.role === 'Medical Clerk' || doc.role === 'Medical Intern';
  const obScore = `G${anc.gravida ?? 1} P${anc.para ?? 0} (${anc.term ?? 0}-${anc.preterm ?? 0}-${anc.abortion ?? 0}-${anc.living ?? 0})`;
  const followUpDate = p.doctorSoap?.followUpDate || visits[visits.length - 1]?.nextVisit || 'As scheduled';
  const dangerSignsList: string[] = Array.isArray(anc.dangerSigns) ? anc.dangerSigns : [];
  const orderedLabs: string[] = Array.isArray(p.diagnostics?.labs) ? p.diagnostics.labs : [];
  const orderedImaging: string[] = Array.isArray(p.diagnostics?.imaging) ? p.diagnostics.imaging : [];
  const combinedWorkup = [...orderedLabs, ...orderedImaging];

  return `
    <div class="flex flex-col justify-between h-full text-slate-900 text-[10px] leading-snug">
      <div class="space-y-2">
        <!-- Top Half-Bond Header -->
        <div class="border-b-2 border-teal-800 pb-2 flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-teal-700 text-white text-[9px] font-extrabold uppercase tracking-wider">DOH Maternal Tracker</span>
              <span class="text-[9.5px] font-bold text-slate-600">${escapeHTML(doc.facility || doc.clinic || 'Maternal & Child Health Clinic')}</span>
            </div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              Rekord ni Nanay ${escapeHTML(p.name)}
            </h3>
            <p class="text-[9.5px] text-slate-500">
              Age: ${escapeHTML(p.age)} y/o • Address: ${escapeHTML(p.address || 'N/A')} • Contact: ${escapeHTML(p.contact || 'N/A')} • PhilHealth: ${escapeHTML(anc.philhealthStatus || p.philhealth || 'Active')}
            </p>
          </div>
          <div class="text-right shrink-0 bg-teal-50 border border-teal-300 rounded-xl px-3 py-1.5">
            <span class="block text-[8.5px] font-extrabold uppercase tracking-wider text-teal-800">Prenatal Visits</span>
            <span class="block text-base font-extrabold text-teal-950">${escapeHTML(visitCount)} Visit${Number(visitCount) === 1 ? '' : 's'}</span>
            <span class="block text-[8.5px] font-semibold text-teal-700">Next Visit: ${escapeHTML(followUpDate)}</span>
          </div>
        </div>

        <!-- ANC Step 1 & Step 2 Summary Strip: OB Scoring, Dating, Maternal Vitals & Fetal PE -->
        <div class="bg-slate-50 border border-slate-300 rounded-lg p-2 space-y-1.5">
          <div class="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">OB Score (GPTPAL)</span>
              <span class="font-extrabold text-teal-900">${escapeHTML(obScore)}</span>
            </div>
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">LMP Date</span>
              <span class="font-extrabold text-slate-900">${escapeHTML(anc.lmp || 'Not set')}</span>
            </div>
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">Current AOG / Tri</span>
              <span class="font-extrabold text-teal-800">${escapeHTML(anc.aogWeeks || '-')} (${escapeHTML(anc.trimester || '1st')} Tri)</span>
            </div>
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">Expected Delivery (EDC)</span>
              <span class="font-extrabold text-rose-700">${escapeHTML(anc.edc || 'Pending LMP')}</span>
            </div>
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">BP / Weight / Blood Type</span>
              <span class="font-extrabold text-slate-900">${escapeHTML(p.vitals?.bp || '-')} mmHg • ${escapeHTML(p.vitals?.weight || '-')} kg • ${escapeHTML(anc.bloodType || 'Pending')}</span>
            </div>
            <div>
              <span class="text-[8.5px] font-bold uppercase text-slate-500 block">FH / FHT / Lie</span>
              <span class="font-extrabold text-slate-900">FH ${escapeHTML(anc.fundicHeight || '-')}cm • FHT ${escapeHTML(anc.fht || '-')}bpm • ${escapeHTML(anc.presentation || 'Cephalic')}</span>
            </div>
          </div>
          <div class="pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[9px]">
            <span><strong>Fetal Movement:</strong> ${escapeHTML(anc.fetalMovement || 'Present / Active')} • <strong>Maternal Edema:</strong> ${escapeHTML(anc.edema || 'None')}</span>
            <span class="${dangerSignsList.length > 0 ? 'text-rose-700 font-extrabold' : 'text-teal-800 font-semibold'}">
              <strong>Danger Signs:</strong> ${dangerSignsList.length > 0 ? escapeHTML(dangerSignsList.join(', ')) : 'None reported (No vaginal bleeding, severe headache, or visual blurring)'}
            </span>
          </div>
        </div>

        <!-- Chronological Prenatal Visits Table Until Delivery -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[9px] font-extrabold uppercase tracking-wider text-teal-900">Chronological Prenatal Visits &amp; Maternal Monitoring Until Delivery</span>
            <span class="text-[8.5px] text-slate-500 font-semibold">Latest Consult Date: ${escapeHTML(p.consultationDate || '-')}</span>
          </div>
          <table class="w-full border-collapse border border-slate-300 text-[9px]">
            <thead>
              <tr class="bg-slate-100 text-slate-800 font-extrabold uppercase">
                <th class="border border-slate-300 px-1.5 py-1 text-center w-10">Visit</th>
                <th class="border border-slate-300 px-2 py-1 text-left w-20">Date</th>
                <th class="border border-slate-300 px-2 py-1 text-left w-28">AOG / Trimester</th>
                <th class="border border-slate-300 px-2 py-1 text-left w-28">BP &amp; Weight</th>
                <th class="border border-slate-300 px-2 py-1 text-left w-36">FH / FHT / Lie</th>
                <th class="border border-slate-300 px-2 py-1 text-left">Supplementation, Vaccines &amp; Lab Workup</th>
                <th class="border border-slate-300 px-2 py-1 text-left w-20">Next Visit</th>
              </tr>
            </thead>
            <tbody>
              ${visits.map((v: any, idx: number) => `
                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}">
                  <td class="border border-slate-300 px-1.5 py-1 text-center font-extrabold text-teal-900">#${escapeHTML(v.visitNo || idx + 1)}</td>
                  <td class="border border-slate-300 px-2 py-1 font-semibold text-slate-900">${escapeHTML(v.date || '-')}</td>
                  <td class="border border-slate-300 px-2 py-1 font-bold text-slate-800">${escapeHTML(v.aog || '-')}</td>
                  <td class="border border-slate-300 px-2 py-1 text-slate-800">${escapeHTML(v.bpWeight || '-')}</td>
                  <td class="border border-slate-300 px-2 py-1 text-slate-800">${escapeHTML(v.obExam || '-')}</td>
                  <td class="border border-slate-300 px-2 py-1 text-slate-800">${escapeHTML(v.careSummary || '-')}</td>
                  <td class="border border-slate-300 px-2 py-1 font-semibold text-teal-800">${escapeHTML(v.nextVisit || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Three-Column Summary from ANC Inputs: (1) Screening Workup, (2) Supplementation & Vaccines, (3) Birth & Emergency Plan -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="border border-slate-300 rounded-lg p-2 bg-white space-y-0.5">
            <span class="text-[8.5px] font-extrabold uppercase tracking-wider text-teal-900 block border-b border-slate-200 pb-0.5 mb-1">
              Trimester Screening Workup (${escapeHTML(anc.trimester || '1st')} Tri)
            </span>
            <p><strong>Labs (${orderedLabs.length}):</strong> ${orderedLabs.length > 0 ? escapeHTML(orderedLabs.join(', ')) : 'None selected'}</p>
            <p><strong>Ultrasound (${orderedImaging.length}):</strong> ${orderedImaging.length > 0 ? escapeHTML(orderedImaging.join(', ')) : 'None selected'}</p>
            ${combinedWorkup.length === 0 ? `<p class="text-slate-400 italic">Select tests in Trimester Screening Workup tab.</p>` : ''}
          </div>

          <div class="border border-slate-300 rounded-lg p-2 bg-white space-y-0.5">
            <span class="text-[8.5px] font-extrabold uppercase tracking-wider text-teal-900 block border-b border-slate-200 pb-0.5 mb-1">
              Supplementation &amp; Immunization
            </span>
            <p><strong>Iron + Folate:</strong> ${escapeHTML(anc.ironFolate || 'Ferrous Sulfate 60mg + Folic Acid 400mcg OD')}</p>
            <p><strong>Calcium:</strong> ${escapeHTML(anc.calcium || 'Calcium Carbonate 500mg TID')}</p>
            <p><strong>Tetanus (Td):</strong> ${escapeHTML(anc.tetanusStatus || 'Td1')} • <strong>Deworming:</strong> ${escapeHTML(anc.deworming || 'Scheduled')}</p>
            ${anc.otherVaccine ? `<p><strong>Other Vaccine:</strong> ${escapeHTML(anc.otherVaccine)}</p>` : ''}
          </div>

          <div class="border border-slate-300 rounded-lg p-2 bg-white space-y-0.5">
            <span class="text-[8.5px] font-extrabold uppercase tracking-wider text-teal-900 block border-b border-slate-200 pb-0.5 mb-1">
              Birth &amp; Emergency Plan (EDC: ${escapeHTML(anc.edc || 'TBA')})
            </span>
            <p><strong>Birthing Facility:</strong> ${escapeHTML(anc.facilityBirthPlan || 'Accredited Birthing Facility / Hospital')}</p>
            <p><strong>Companion:</strong> ${escapeHTML(anc.companionName || 'Family Member')} • <strong>Transport:</strong> ${escapeHTML(anc.emergencyTransport || 'Arranged')}</p>
            <p><strong>Blood Donor(s):</strong> ${escapeHTML(anc.bloodDonorName || 'Identified Family Donor')}</p>
            ${anc.obNotes ? `<p><strong>Notes:</strong> ${escapeHTML(anc.obNotes)}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Footer Signature -->
      <div class="pt-2 mt-2 border-t border-slate-300 flex items-end justify-between text-[9px]">
        <div class="text-slate-500">
          <p class="font-bold text-slate-700">Rekord ni Nanay ${escapeHTML(p.name)} • Half-Bond Maternal Tracker</p>
          <p>Bring this card on every prenatal visit and upon admission for delivery.</p>
        </div>
        <div class="text-right min-w-[170px] border-t border-slate-900 pt-0.5">
          <p class="font-extrabold text-slate-900 text-[9.5px]">${escapeHTML(doc.name)}</p>
          <p class="text-[8.5px] text-slate-600">PRC Lic. No.: <strong>${escapeHTML(doc.prc || 'N/A')}</strong>${isTrainee && doc.supervisingDoctor ? ` • Supv: ${escapeHTML(doc.supervisingDoctor)}` : ''}</p>
        </div>
      </div>
    </div>
  `;
}

export function buildAntenatalCareHTML(appState: any, p: any): string {
  if (!p) {
    return `
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Maternal &amp; Antenatal Care</h2>
      </div>
      ${renderPatientSelectorBannerHTML(appState, null)}
      <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p class="text-base font-bold text-slate-800">No Active Patient Selected</p>
        <p class="text-xs text-slate-500 mt-1 mb-4">Register a new maternal patient or select an existing patient to open the Antenatal Care Module.</p>
        <button onclick="startNewPatientRegistration()" class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer">+ Register Maternal Patient</button>
      </div>
    `;
  }

  const doc = appState.doctor;
  const anc = p.anc || {
    gravida: 1, para: 0, term: 0, preterm: 0, abortion: 0, living: 0,
    lmp: '', aogWeeks: '', edc: '', trimester: '1st',
    fht: '', fundicHeight: '', presentation: 'Cephalic', fetalMovement: 'Present / Active (>=10 kicks/12h)',
    edema: 'None', bloodType: '', dangerSigns: [],
    ironFolate: DOH_IRON_FOLATE_OPTIONS[0],
    calcium: DOH_CALCIUM_OPTIONS[0],
    tetanusStatus: DOH_TETANUS_VACCINE_OPTIONS[0],
    deworming: DOH_DEWORMING_OPTIONS[0],
    otherVaccine: DOH_OTHER_MATERNAL_VACCINES[0],
    facilityBirthPlan: '', philhealthStatus: 'Active Member',
    emergencyTransport: '', bloodDonorName: '', companionName: '', obNotes: ''
  };

  const activeAncTab = appState.ancActiveTab || 'ob-dating';
  const selectedLabs: string[] = p.diagnostics?.labs || [];
  const selectedImaging: string[] = p.diagnostics?.imaging || [];
  const currentTrimesterKey = anc.trimester || '1st';
  const visitDate = p.consultationDate || new Date().toISOString().split('T')[0];

  // Parse LMP year, month, day for full Month/Day/Year dropdowns + date picker
  const lmpParts = (anc.lmp || '').split('-');
  const lmpYear = lmpParts[0] || '';
  const lmpMonth = lmpParts[1] || '';
  const lmpDay = lmpParts[2] || '';

  const monthsList = [
    { val: '01', name: 'January' },
    { val: '02', name: 'February' },
    { val: '03', name: 'March' },
    { val: '04', name: 'April' },
    { val: '05', name: 'May' },
    { val: '06', name: 'June' },
    { val: '07', name: 'July' },
    { val: '08', name: 'August' },
    { val: '09', name: 'September' },
    { val: '10', name: 'October' },
    { val: '11', name: 'November' },
    { val: '12', name: 'December' }
  ];

  const daysInSelectedMonth = (() => {
    const y = parseInt(lmpYear, 10) || new Date().getFullYear();
    const m = parseInt(lmpMonth, 10) || 1;
    return new Date(y, m, 0).getDate();
  })();

  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return { val: d, label: `${i + 1}`, valid: i + 1 <= daysInSelectedMonth };
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => String(currentYear + 1 - i));

  const ancTabs = [
    { id: 'ob-dating', label: 'Obstetric Score & Dating' },
    { id: 'pe', label: 'Obstetric Physical Exam' },
    { id: 'danger', label: 'Maternal Danger Signs' },
    { id: 'screening', label: 'Screening Workup' },
    { id: 'immunization', label: 'Micronutrients & Immunization' },
    { id: 'birth-plan', label: 'Birth & Emergency Plan' }
  ];

  const trimesterWorkupCatalog = [
    {
      code: '1st',
      title: '1st Trimester (< 14 Weeks AOG)',
      bundle: resolveAncTrimesterBundle('1st')
    },
    {
      code: '2nd',
      title: '2nd Trimester (14 – 27 Weeks AOG)',
      bundle: resolveAncTrimesterBundle('2nd')
    },
    {
      code: '3rd',
      title: '3rd Trimester (28 – 40+ Weeks AOG)',
      bundle: resolveAncTrimesterBundle('3rd')
    }
  ];

  const screeningFilter = appState.ancScreeningFilter || currentTrimesterKey || '1st';

  const ensureOptionList = (defaults: string[], currentVal: string) => {
    if (currentVal && !defaults.includes(currentVal)) {
      return [currentVal, ...defaults];
    }
    return defaults;
  };

  return `
    <div class="space-y-6 no-print">
      <!-- Uniform Green Banner Title -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Maternal &amp; Antenatal Care</h2>
      </div>

      <!-- Active Patient Card Below Banner (Left-Side Half Screen) -->
      ${renderPatientSelectorBannerHTML(appState, p)}

      <!-- 6 Unnumbered Component Tabs -->
      <div class="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div class="flex flex-wrap gap-1.5">
          ${ancTabs.map(t => `
            <button type="button" onclick="setAncActiveTab('${t.id}')"
              class="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeAncTab === t.id ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
              ${escapeHTML(t.label)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- TAB 1: OBSTETRIC SCORE & DATING -->
      ${activeAncTab === 'ob-dating' ? `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Obstetric Score (G-P / T-P-A-L)
            </h3>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              ${[
                { key: 'gravida', label: 'Gravida (G)' },
                { key: 'para', label: 'Para (P)' },
                { key: 'term', label: 'Term (T)' },
                { key: 'preterm', label: 'Preterm (P)' },
                { key: 'abortion', label: 'Abortion (A)' },
                { key: 'living', label: 'Living (L)' }
              ].map(item => `
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">${item.label}</label>
                  <input type="number" min="0" max="20" value="${escapeHTML(anc[item.key] ?? 0)}"
                    oninput="updateAncField('${item.key}', Number(this.value))"
                    class="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-sm font-bold text-center text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none">
                </div>
              `).join('')}
            </div>
            <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Maternal Blood Type / Rh</label>
                <select onchange="updateAncField('bloodType', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                  ${['', 'O+ (Rh Positive)', 'A+ (Rh Positive)', 'B+ (Rh Positive)', 'AB+ (Rh Positive)', 'O- (Rh Negative)', 'A- (Rh Negative)', 'B- (Rh Negative)', 'AB- (Rh Negative)'].map(bt => `
                    <option value="${bt}" ${anc.bloodType === bt ? 'selected' : ''}>${bt || '-- Select Blood Type --'}</option>
                  `).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">PhilHealth Maternal Coverage</label>
                <input type="text" value="${escapeHTML(anc.philhealthStatus || '')}" placeholder="e.g., Active MCP / Accredited"
                  oninput="updateAncField('philhealthStatus', this.value)"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold">
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Menstrual Dating (Naegele's Rule Calculator)
            </h3>

            <!-- Full Month, Day (All Days of Month), and Year Dropdowns + Direct Date Input -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label class="block text-xs font-bold text-slate-800">Last Menstrual Period (LMP) — Select Month, Day & Year or Type Date</label>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <span class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Month</span>
                  <select id="anc-lmp-month" onchange="handleAncLmpDropdownChange()" class="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                    <option value="">Month</option>
                    ${monthsList.map(m => `<option value="${m.val}" ${lmpMonth === m.val ? 'selected' : ''}>${m.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <span class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Day (1–31)</span>
                  <select id="anc-lmp-day" onchange="handleAncLmpDropdownChange()" class="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                    <option value="">Day</option>
                    ${dayOptions.map(d => `<option value="${d.val}" ${lmpDay === d.val ? 'selected' : ''}>${d.label}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <span class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Year</span>
                  <select id="anc-lmp-year" onchange="handleAncLmpDropdownChange()" class="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                    <option value="">Year</option>
                    ${yearOptions.map(y => `<option value="${y}" ${lmpYear === y ? 'selected' : ''}>${y}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="pt-1 flex items-center gap-2">
                <span class="text-[11px] font-semibold text-slate-500 shrink-0">Or Calendar / Direct Date:</span>
                <input id="anc-lmp-input" type="date" value="${escapeHTML(anc.lmp || '')}"
                  oninput="handleAncLmpDirectInput(this.value)"
                  class="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Current Trimester</label>
                <select id="anc-trimester-select" onchange="handleAncTrimesterChange(this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-teal-900 bg-teal-50">
                  <option value="1st" ${anc.trimester === '1st' ? 'selected' : ''}>1st Trimester (&lt; 14 wks)</option>
                  <option value="2nd" ${anc.trimester === '2nd' ? 'selected' : ''}>2nd Trimester (14 – 27 wks)</option>
                  <option value="3rd" ${anc.trimester === '3rd' ? 'selected' : ''}>3rd Trimester (28 – 40+ wks)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Calculated AOG</label>
                <input id="anc-aog-input" type="text" value="${escapeHTML(anc.aogWeeks || '')}" placeholder="e.g., 26 weeks 3 days"
                  oninput="updateAncField('aogWeeks', this.value)"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-teal-800 bg-slate-50">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Estimated Date of Confinement (EDC)</label>
                <input id="anc-edc-input" type="date" value="${escapeHTML(anc.edc || '')}"
                  oninput="updateAncField('edc', this.value)"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50">
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 2: OBSTETRIC PHYSICAL EXAMINATION -->
      ${activeAncTab === 'pe' ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Obstetric Physical Examination (Leopold's Maneuvers & FHT)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fetal Heart Tone (bpm & Location)</label>
              <input type="text" value="${escapeHTML(anc.fht || '')}" placeholder="e.g., 144 bpm (RLQ)"
                oninput="updateAncField('fht', this.value)"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fundic Height (cm)</label>
              <input type="text" value="${escapeHTML(anc.fundicHeight || '')}" placeholder="e.g., 26 cm"
                oninput="updateAncField('fundicHeight', this.value)"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fetal Presentation / Lie</label>
              <select onchange="updateAncField('presentation', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                ${['Cephalic', 'Breech', 'Transverse', 'Oblique', 'Variable / Too Early to Assess'].map(opt => `
                  <option value="${opt}" ${anc.presentation === opt ? 'selected' : ''}>${opt}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fetal Movement</label>
              <select onchange="updateAncField('fetalMovement', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                ${['Present / Active (>=10 kicks/12h)', 'Decreased Fetal Movement (<10 kicks/12h)', 'Not Yet Perceived (<18 wks)'].map(opt => `
                  <option value="${opt}" ${anc.fetalMovement === opt ? 'selected' : ''}>${opt}</option>
                `).join('')}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Maternal Edema / Preeclampsia Signs</label>
              <select onchange="updateAncField('edema', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                ${['None', 'Trace Bipedal Edema (Physiologic)', 'Grade 1+ to 2+ Bipedal Edema', 'Generalized / Facial / Periorbital Edema (Evaluate for Preeclampsia)'].map(opt => `
                  <option value="${opt}" ${anc.edema === opt ? 'selected' : ''}>${opt}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: MATERNAL DANGER SIGNS -->
      ${activeAncTab === 'danger' ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            DOH Maternal Danger Signs Screening
          </h3>
          <p class="text-xs text-slate-500 mb-4">Select any maternal danger sign present during this consultation.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${ANC_DANGER_SIGNS.map((sign: string) => {
              const checked = (anc.dangerSigns || []).includes(sign);
              return `
                <label class="flex items-start gap-2.5 p-3 rounded-xl border ${checked ? 'bg-teal-50 border-teal-500 text-teal-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-700'} text-xs cursor-pointer">
                  <input type="checkbox" ${checked ? 'checked' : ''}
                    onchange="toggleAncDangerSign('${escapeHTML(sign)}')"
                    class="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500">
                  <span>${escapeHTML(sign)}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 4: TRIMESTER-SPECIFIC SCREENING WORKUP -->
      ${activeAncTab === 'screening' ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Trimester-Specific Screening Workup Selection</h3>
              <p class="text-xs text-slate-500 mt-0.5">Select the applicable trimester below and check the laboratory and ultrasound tests to order.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <select onchange="setAncScreeningFilter(this.value)" class="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-teal-900 bg-teal-50">
                <option value="1st" ${screeningFilter === '1st' ? 'selected' : ''}>1st Trimester Workup (&lt;14 wks)</option>
                <option value="2nd" ${screeningFilter === '2nd' ? 'selected' : ''}>2nd Trimester Workup (14–27 wks)</option>
                <option value="3rd" ${screeningFilter === '3rd' ? 'selected' : ''}>3rd Trimester Workup (28–40+ wks)</option>
                <option value="all" ${screeningFilter === 'all' ? 'selected' : ''}>Show All Trimesters (1st, 2nd &amp; 3rd)</option>
              </select>
              <button onclick="orderAllTrimesterTests('${screeningFilter === 'all' ? currentTrimesterKey : screeningFilter}')" class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shrink-0 cursor-pointer">
                + Order All Selected Trimester Tests
              </button>
            </div>
          </div>

          <div class="space-y-5">
            ${trimesterWorkupCatalog
              .filter(t => screeningFilter === 'all' || t.code === screeningFilter)
              .map(t => `
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-xs font-extrabold uppercase tracking-wider text-teal-900">${escapeHTML(t.title)}</h4>
                    <span class="text-[11px] font-semibold text-slate-500">DOH / POGS Standard</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Applicable Laboratory Tests</p>
                      <div class="space-y-1.5">
                        ${(t.bundle.labs || []).map((labName: string) => {
                          const isOrdered = selectedLabs.includes(labName);
                          return `
                            <label class="flex items-center justify-between p-2.5 rounded-lg bg-white border ${isOrdered ? 'border-teal-500 bg-teal-50/40' : 'border-slate-200'} text-xs cursor-pointer">
                              <span class="font-medium text-slate-800">${escapeHTML(labName)}</span>
                              <input type="checkbox" ${isOrdered ? 'checked' : ''} onchange="toggleDiagnosticTest('labs', '${escapeHTML(labName)}')" class="rounded text-teal-600">
                            </label>
                          `;
                        }).join('')}
                      </div>
                    </div>
                    <div>
                      <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Applicable OB Ultrasound / Monitoring</p>
                      <div class="space-y-1.5">
                        ${(t.bundle.imaging || []).map((imgName: string) => {
                          const isOrdered = selectedImaging.includes(imgName);
                          return `
                            <label class="flex items-center justify-between p-2.5 rounded-lg bg-white border ${isOrdered ? 'border-teal-500 bg-teal-50/40' : 'border-slate-200'} text-xs cursor-pointer">
                              <span class="font-medium text-slate-800">${escapeHTML(imgName)}</span>
                              <input type="checkbox" ${isOrdered ? 'checked' : ''} onchange="toggleDiagnosticTest('imaging', '${escapeHTML(imgName)}')" class="rounded text-teal-600">
                            </label>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 5: MATERNAL MICRONUTRIENTS & IMMUNIZATION (DOH DROPDOWNS) -->
      ${activeAncTab === 'immunization' ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Maternal Micronutrients &amp; Immunization (DOH Guidelines)</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Iron + Folic Acid Supplementation (DOH Protocol)</label>
              <select onchange="updateAncField('ironFolate', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-teal-500">
                ${ensureOptionList(DOH_IRON_FOLATE_OPTIONS, anc.ironFolate).map(opt => `
                  <option value="${escapeHTML(opt)}" ${anc.ironFolate === opt ? 'selected' : ''}>${escapeHTML(opt)}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Calcium Carbonate Supplementation (Preeclampsia Prevention)</label>
              <select onchange="updateAncField('calcium', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-teal-500">
                ${ensureOptionList(DOH_CALCIUM_OPTIONS, anc.calcium).map(opt => `
                  <option value="${escapeHTML(opt)}" ${anc.calcium === opt ? 'selected' : ''}>${escapeHTML(opt)}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tetanus Diphtheria (Td / Tdap) Vaccine Status</label>
              <select onchange="updateAncField('tetanusStatus', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-teal-500">
                ${ensureOptionList(DOH_TETANUS_VACCINE_OPTIONS, anc.tetanusStatus).map(opt => `
                  <option value="${escapeHTML(opt)}" ${anc.tetanusStatus === opt ? 'selected' : ''}>${escapeHTML(opt)}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Anti-Helminthic Deworming (2nd / 3rd Trimester)</label>
              <select onchange="updateAncField('deworming', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-teal-500">
                ${ensureOptionList(DOH_DEWORMING_OPTIONS, anc.deworming).map(opt => `
                  <option value="${escapeHTML(opt)}" ${anc.deworming === opt ? 'selected' : ''}>${escapeHTML(opt)}</option>
                `).join('')}
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-slate-700 mb-1">Additional Maternal Vaccines & Micronutrients (DOH / POGS)</label>
              <select onchange="updateAncField('otherVaccine', this.value)" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-teal-500">
                ${ensureOptionList(DOH_OTHER_MATERNAL_VACCINES, anc.otherVaccine || DOH_OTHER_MATERNAL_VACCINES[0]).map(opt => `
                  <option value="${escapeHTML(opt)}" ${(anc.otherVaccine || DOH_OTHER_MATERNAL_VACCINES[0]) === opt ? 'selected' : ''}>${escapeHTML(opt)}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 6: DOH BIRTH & EMERGENCY PLAN + REKORD NI NANAY -->
      ${activeAncTab === 'birth-plan' ? `
        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">DOH Mother-Baby Birth &amp; Emergency Plan</h3>
                <p class="text-xs text-slate-500 mt-0.5">All details entered here sync directly to <strong>Rekord ni Nanay ${escapeHTML(p.name)}</strong> below.</p>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-xs font-bold text-teal-900">Total Prenatal Visits:</label>
                <input type="number" min="1" max="30" value="${escapeHTML(anc.prenatalVisitCount || getPatientPrenatalVisits(p).length)}"
                  oninput="updateAncField('prenatalVisitCount', Number(this.value))"
                  class="w-20 px-2.5 py-1.5 rounded-lg border border-teal-400 bg-teal-50 text-xs font-extrabold text-center text-teal-950">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Planned Birthing Facility</label>
                <input type="text" value="${escapeHTML(anc.facilityBirthPlan || '')}" placeholder="e.g., Ospital ng Makati / Accredited Lying-In"
                  oninput="updateAncField('facilityBirthPlan', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Emergency Transport Plan</label>
                <input type="text" value="${escapeHTML(anc.emergencyTransport || '')}" placeholder="e.g., Family vehicle / Barangay Ambulance"
                  oninput="updateAncField('emergencyTransport', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Identified Blood Donor(s)</label>
                <input type="text" value="${escapeHTML(anc.bloodDonorName || '')}" placeholder="Name & Blood Type"
                  oninput="updateAncField('bloodDonorName', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Birth Companion of Choice</label>
                <input type="text" value="${escapeHTML(anc.companionName || '')}" placeholder="e.g., Husband / Mother"
                  oninput="updateAncField('companionName', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Additional OB Clinical Notes &amp; Delivery Reminders</label>
              <textarea rows="2" oninput="updateAncField('obNotes', this.value)"
                placeholder="Fetal movement count instructions, dietary counseling, signs of labor..."
                class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">${escapeHTML(anc.obNotes || '')}</textarea>
            </div>

            <!-- Interactive Prenatal Visits Log Editor -->
            <div class="pt-4 border-t border-slate-200 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 class="text-xs font-extrabold uppercase tracking-wider text-teal-900">Prenatal Visits Log (Pregnancy Until Delivery)</h4>
                  <p class="text-[11px] text-slate-500">Record each prenatal check-up date, AOG, maternal vitals, OB findings, and next appointment.</p>
                </div>
                <button type="button" onclick="addAncPrenatalVisit()" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs cursor-pointer">
                  + Log Prenatal Visit
                </button>
              </div>

              <div class="space-y-2">
                ${getPatientPrenatalVisits(p).map((v: any, idx: number) => `
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <div class="sm:col-span-1 font-extrabold text-teal-900 text-center">Visit #${idx + 1}</div>
                    <input type="date" value="${escapeHTML(v.date || '')}" oninput="updateAncPrenatalVisit(${idx}, 'date', this.value)"
                      class="sm:col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold" title="Visit Date">
                    <input type="text" value="${escapeHTML(v.aog || '')}" placeholder="AOG / Trimester" oninput="updateAncPrenatalVisit(${idx}, 'aog', this.value)"
                      class="sm:col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold">
                    <input type="text" value="${escapeHTML(v.bpWeight || '')}" placeholder="BP & Weight" oninput="updateAncPrenatalVisit(${idx}, 'bpWeight', this.value)"
                      class="sm:col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                    <input type="text" value="${escapeHTML(v.obExam || '')}" placeholder="FH / FHT / Lie" oninput="updateAncPrenatalVisit(${idx}, 'obExam', this.value)"
                      class="sm:col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                    <input type="text" value="${escapeHTML(v.careSummary || '')}" placeholder="Vaccines / Labs / Meds" oninput="updateAncPrenatalVisit(${idx}, 'careSummary', this.value)"
                      class="sm:col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs">
                    <div class="sm:col-span-1 flex items-center justify-end gap-1">
                      <button type="button" onclick="removeAncPrenatalVisit(${idx})" class="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer" title="Remove Visit">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- REKORD NI NANAY [PATIENT NAME] CARD & HALF-BONDPAPER PDF / PRINT -->
          <div class="bg-gradient-to-r from-teal-50 via-white to-slate-50 rounded-2xl border-2 border-teal-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200/80 pb-3">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  Half-Bondpaper Maternal Tracker (${escapeHTML(anc.prenatalVisitCount || getPatientPrenatalVisits(p).length)} Prenatal Visit${Number(anc.prenatalVisitCount || getPatientPrenatalVisits(p).length) === 1 ? '' : 's'})
                </span>
                <h3 class="text-base sm:text-lg font-extrabold text-slate-900">
                  Rekord ni Nanay ${escapeHTML(p.name)}
                </h3>
                <p class="text-xs text-slate-600">Generated directly from the patient's Antenatal Care (ANC) inputs until delivery.</p>
              </div>
              <div class="flex flex-wrap items-center gap-2 shrink-0">
                <button type="button" onclick="downloadPdfElement('nanay-rekord-printable-sheet', 'Rekord_ni_Nanay_${escapeHTML(p.name.replace(/\s+/g, '_'))}_${visitDate}.pdf', 'a5-landscape')"
                  class="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download Rekord ni Nanay PDF (Half-Bond)
                </button>
                <button type="button" onclick="printDocumentElement('nanay-rekord-printable-sheet', 'A5 landscape')"
                  class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print Half-Bond Card
                </button>
              </div>
            </div>

            <div id="nanay-rekord-printable-sheet" class="paper-half-bond print-only-target">
              ${buildRekordNiNanayHalfBondHTML(doc, p)}
            </div>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Printable / Downloadable Antenatal Clinical Record (SOAP) A4 Preview -->
    <div class="mt-8">
      <div class="flex items-center justify-between max-w-[210mm] mx-auto mb-2 no-print">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Official A4 Antenatal Clinical Record (SOAP) Preview</span>
        <div class="flex items-center gap-3">
          <button onclick="printDocumentElement('anc-printable-a4', 'A4 portrait')" class="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline flex items-center gap-1 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print A4 Record
          </button>
          <button onclick="downloadPdfElement('anc-printable-a4', 'Antenatal_Record_${escapeHTML(p.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''))}_${visitDate}.pdf', 'a4')" class="text-xs font-bold text-teal-700 hover:underline cursor-pointer">Download PDF ↓</button>
        </div>
      </div>
      <div id="anc-printable-a4" class="paper-a4 print-only-target">
        ${buildA4SoapRecordSheetHTML(doc, p, 'ANC')}
      </div>
    </div>
  `;
}

export function buildOfflineCpgReferencePanelHTML(appState: any, p: any): string {
  const q = (appState.soapCpgSearchQuery || '').trim().toLowerCase();
  const ccWords = (p?.chiefComplaint || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w: string) => w.length >= 4);

  const filtered = PH_CPG_CATALOG.filter((cpg: any) => {
    if (!q) return true;
    return (
      (cpg.title || '').toLowerCase().includes(q) ||
      (cpg.category || '').toLowerCase().includes(q) ||
      (cpg.source || '').toLowerCase().includes(q) ||
      (cpg.keywords || []).some((k: string) => k.toLowerCase().includes(q))
    );
  });

  // Sort CPGs matching the patient's Chief Complaint to the top when no manual query is entered
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (q) return 0;
    const aMatch = ccWords.some(
      (w: string) =>
        (a.title || '').toLowerCase().includes(w) ||
        (a.keywords || []).some((k: string) => k.toLowerCase().includes(w))
    );
    const bMatch = ccWords.some(
      (w: string) =>
        (b.title || '').toLowerCase().includes(w) ||
        (b.keywords || []).some((k: string) => k.toLowerCase().includes(w))
    );
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const selectedId = appState.soapSelectedCpgId || (sorted[0]?.id || '');
  const selectedCpg = PH_CPG_CATALOG.find((c: any) => c.id === selectedId) || sorted[0] || null;
  const hasThreeColSnapshot = Array.isArray(selectedCpg?.snapshotHeaders) && selectedCpg.snapshotHeaders.length === 3;
  const snapshotRows = Array.isArray(selectedCpg?.snapshot) ? selectedCpg.snapshot : [];
  const strongRecs = Array.isArray(selectedCpg?.recommendations?.strong) ? selectedCpg.recommendations.strong : [];
  const conditionalRecs = Array.isArray(selectedCpg?.recommendations?.conditional) ? selectedCpg.recommendations.conditional : [];

  return `
    <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">CPG</div>
        <div>
          <h3 class="text-sm font-extrabold text-slate-900">Offline CPG Decision Support</h3>
        </div>
      </div>
    </div>

    <div class="space-y-3 text-xs">
      <!-- Offline CPG Search Input -->
      <div class="relative">
        <input
          type="text"
          value="${escapeHTML(appState.soapCpgSearchQuery || '')}"
          oninput="updateSoapCpgSearch(this.value)"
          placeholder="Search 39 offline CPGs (e.g., Hypertension, Dengue, PTB, GDM, Asthma)..."
          class="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Quick Disease Selector Pills / List -->
      <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50">
        ${sorted.length === 0 ? `<p class="text-xs text-slate-400 italic py-2 text-center">No CPG matched "${escapeHTML(appState.soapCpgSearchQuery)}"</p>` : ''}
        ${sorted.map((c: any) => {
          const isSelected = selectedCpg && selectedCpg.id === c.id;
          return `
            <button
              type="button"
              onclick="selectSoapCpgItem('${escapeHTML(c.id)}')"
              class="w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-teal-600 text-white font-bold shadow-2xs'
                  : 'bg-white hover:bg-teal-50 text-slate-800 border border-slate-200/80'
              }"
            >
              <div class="min-w-0">
                <div class="truncate">${escapeHTML(c.title)}</div>
                <div class="text-[10px] truncate ${isSelected ? 'text-teal-100' : 'text-slate-500'}">${escapeHTML(c.category)} • ${escapeHTML(c.source || 'PH CPG')}</div>
              </div>
              <span class="text-[10px] font-bold shrink-0 ${isSelected ? 'text-white' : 'text-teal-700'}">View →</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Selected CPG Detailed Reference Card -->
      ${selectedCpg ? `
        <div class="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3 max-h-[420px] overflow-y-auto">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-teal-200/70 pb-2.5">
            <div>
              <span class="inline-block px-2 py-0.5 rounded bg-white text-teal-800 border border-teal-200 text-[10px] font-bold uppercase">${escapeHTML(selectedCpg.category)}</span>
              <h4 class="font-extrabold text-slate-900 text-xs sm:text-sm mt-1">${escapeHTML(selectedCpg.title)}</h4>
              <p class="text-[11px] text-slate-600">${escapeHTML(selectedCpg.source || '')}</p>
            </div>
            <div class="flex flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                onclick="applyCpgAssessmentOnly('${escapeHTML(selectedCpg.id)}')"
                class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 text-[11px] font-bold cursor-pointer"
              >
                + Use Diagnosis
              </button>
              <button
                type="button"
                onclick="applyCpgToSoapPlan('${escapeHTML(selectedCpg.id)}')"
                class="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-2xs cursor-pointer"
              >
                + Apply Plan to SOAP
              </button>
            </div>
          </div>

          ${snapshotRows.length > 0 ? `
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-900 block mb-1.5">Quick Snapshot & Diagnostic Criteria</span>
              <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      ${hasThreeColSnapshot ? `
                        <th class="py-1.5 px-2.5">${escapeHTML(selectedCpg.snapshotHeaders[0])}</th>
                        <th class="py-1.5 px-2.5">${escapeHTML(selectedCpg.snapshotHeaders[1])}</th>
                        <th class="py-1.5 px-2.5">${escapeHTML(selectedCpg.snapshotHeaders[2])}</th>
                      ` : `
                        <th class="py-1.5 px-2.5 w-1/3">Parameter</th>
                        <th class="py-1.5 px-2.5">Standard Value / Action</th>
                      `}
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    ${snapshotRows.map((row: any) => hasThreeColSnapshot ? `
                      <tr>
                        <td class="py-1.5 px-2.5 font-bold text-slate-900 align-top">${escapeHTML(row.col1)}</td>
                        <td class="py-1.5 px-2.5 text-slate-700 align-top">${escapeHTML(row.col2)}</td>
                        <td class="py-1.5 px-2.5 text-slate-800 align-top">${escapeHTML(row.col3)}</td>
                      </tr>
                    ` : `
                      <tr>
                        <td class="py-1.5 px-2.5 font-bold text-slate-900 align-top">${escapeHTML(row.parameter)}</td>
                        <td class="py-1.5 px-2.5 text-slate-700 align-top">${escapeHTML(row.value)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${(selectedCpg.soapPlanSummary || []).length > 0 ? `
            <div class="p-2.5 rounded-lg bg-white border border-slate-200">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">Standard CPG Management Protocol</span>
                <button type="button" onclick="applyCpgToSoapPlan('${escapeHTML(selectedCpg.id)}')" class="text-[10px] font-bold text-teal-700 hover:underline cursor-pointer">Insert into Plan →</button>
              </div>
              <ol class="list-decimal list-inside space-y-1 text-[11px] text-slate-700">
                ${(selectedCpg.soapPlanSummary || []).map((line: string) => `<li>${escapeHTML(line)}</li>`).join('')}
              </ol>
            </div>
          ` : ''}

          ${strongRecs.length > 0 || conditionalRecs.length > 0 ? `
            <div class="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Key Guideline Recommendations</span>
              <ul class="space-y-1 text-[11px] text-slate-700">
                ${strongRecs.map((r: any) => `<li><strong class="text-slate-900">[Strong] ${escapeHTML(r.title)}:</strong> ${escapeHTML(r.detail)}</li>`).join('')}
                ${conditionalRecs.map((r: any) => `<li><strong class="text-slate-800">[Conditional] ${escapeHTML(r.title)}:</strong> ${escapeHTML(r.detail)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

export function buildSoapWorkspaceHTML(appState: any, p: any, aiLeftHTML: string): string {
  if (!p) {
    return `
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">SOAP (Subjective, Objective, Assessment, Plan)</h2>
      </div>
      ${renderPatientSelectorBannerHTML(appState, null)}
      <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p class="text-base font-bold text-slate-800">No Active Patient Selected</p>
        <p class="text-xs text-slate-500 mt-1 mb-4">Select or register a patient to open the SOAP Workspace.</p>
        <button onclick="startNewPatientRegistration()" class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer">+ Register New Patient</button>
      </div>
    `;
  }

  const doc = appState.doctor;
  const ds = p.doctorSoap || { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
  const meds = ds.medications || [];
  const visitDate = p.consultationDate || new Date().toISOString().split('T')[0];
  const aiEnabled = appState.aiSoapEnabled !== false;

  return `
    <!-- Uniform Green Banner Title -->
    <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">SOAP (Subjective, Objective, Assessment, Plan)</h2>
      </div>
      <button
        type="button"
        onclick="toggleAiSoapAssistance()"
        role="switch"
        aria-checked="${aiEnabled}"
        class="self-start sm:self-auto flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer border shadow-2xs ${
          aiEnabled
            ? 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100'
            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
        }"
      >
        <span class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          aiEnabled ? 'bg-teal-600' : 'bg-slate-400'
        }">
          <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            aiEnabled ? 'translate-x-4' : 'translate-x-0'
          }"></span>
        </span>
        <span>${aiEnabled ? 'Deactivate AI SOAP' : 'Activate AI SOAP'}</span>
      </button>
    </div>

    <!-- Active Patient Card Below Banner (Left-Side Half Screen) -->
    ${renderPatientSelectorBannerHTML(appState, p)}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
      <!-- Left Column: Either AI SOAP Assistant OR Offline CPG Reference -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <div id="ai-soap-left-container">
            ${aiEnabled ? aiLeftHTML : buildOfflineCpgReferencePanelHTML(appState, p)}
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button onclick="switchView('cpg')" class="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            Browse Philippine CPGs
          </button>
          ${
            aiEnabled
              ? `<button onclick="adoptAllAiToDoctorSoap()" class="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition cursor-pointer">
                  Copy All to SOAP →
                </button>`
              : `<span></span>`
          }
        </div>
      </div>

      <!-- Right Column: Official SOAP -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Official SOAP</h3>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="savePatientConsultationSnapshot()" class="px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Save Record">
              <svg class="w-3.5 h-3.5 text-teal-700" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              Save Record
            </button>
            <button onclick="downloadPdfElement('soap-printable-a4', 'SOAP_${escapeHTML(p.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''))}_${visitDate}.pdf', 'a4')" class="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download SOAP PDF
            </button>
            <button onclick="printDocumentElement('soap-printable-a4', 'A4 portrait')" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print A4 SOAP
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">S — Subjective</label>
            <textarea rows="3" oninput="handleSoapFieldInput('subjective', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none">${escapeHTML(ds.subjective)}</textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">O — Objective</label>
            <textarea rows="3" oninput="handleSoapFieldInput('objective', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none">${escapeHTML(ds.objective)}</textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">A — Assessment / Diagnosis</label>
            <textarea id="doctor-soap-assessment" rows="2" oninput="handleSoapFieldInput('assessment', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none">${escapeHTML(ds.assessment)}</textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">P — Plan</label>
            <textarea id="doctor-soap-plan" rows="5" oninput="handleSoapFieldInput('plan', this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none">${escapeHTML(ds.plan)}</textarea>
          </div>
        </div>

        <!-- Follow-Up & Medications Linked to Rx -->
        <div class="pt-3 border-t border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Prescribed Medications</h4>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-[11px] font-bold text-slate-600">Follow-Up Date:</label>
              <input type="date" value="${escapeHTML(ds.followUpDate || '')}"
                onchange="handleSoapFieldInput('followUpDate', this.value)"
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs">
              <button onclick="addBlankDoctorMed()" class="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer">
                + Add Med
              </button>
            </div>
          </div>

          <div class="space-y-2">
            ${meds.length === 0 ? `<p class="text-xs text-slate-400 italic py-2">No medications listed yet. Click "+ Add Rx" from SOAP suggestions or "+ Add Med".</p>` : ''}
            ${meds.map((m: any, idx: number) => `
              <div class="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                <input type="text" value="${escapeHTML(m.genericName)}" placeholder="Generic Name & Strength"
                  oninput="updateDoctorMed(${idx}, 'genericName', this.value)"
                  class="col-span-12 sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white">
                <input type="text" value="${escapeHTML(m.brandExample)}" placeholder="Brand (e.g., Norvasc)"
                  oninput="updateDoctorMed(${idx}, 'brandExample', this.value)"
                  class="col-span-6 sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                <input type="text" value="${escapeHTML(m.sig)}" placeholder="Sig: 1 tab OD"
                  oninput="updateDoctorMed(${idx}, 'sig', this.value)"
                  class="col-span-6 sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                <input type="text" value="${escapeHTML(m.quantity)}" placeholder="#30"
                  oninput="updateDoctorMed(${idx}, 'quantity', this.value)"
                  class="col-span-9 sm:col-span-1 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-center">
                <button onclick="removeDoctorMed(${idx})" class="col-span-3 sm:col-span-1 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Official Printable / Downloadable A4 SOAP Sheet -->
    <div class="mt-8">
      <div class="flex flex-wrap items-center justify-between max-w-[210mm] mx-auto mb-2 gap-2 no-print">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Official A4 Outpatient Clinical Record (SOAP) Preview</span>
        <div class="flex items-center gap-3">
          <button onclick="printDocumentElement('soap-printable-a4', 'A4 portrait')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print SOAP Document
          </button>
          <button onclick="downloadPdfElement('soap-printable-a4', 'SOAP_${escapeHTML(p.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''))}_${visitDate}.pdf', 'a4')" class="text-xs font-bold text-teal-700 hover:underline cursor-pointer">Download PDF ↓</button>
        </div>
      </div>
      <div id="soap-printable-a4" class="paper-a4 print-only-target">
        ${buildA4SoapRecordSheetHTML(doc, p, 'CONS')}
      </div>
    </div>
  `;
}

export function buildSingleA6RxPadHTML(doc: any, p: any, meds: any[]): string {
  const isTrainee = doc.role === 'Medical Clerk' || doc.role === 'Medical Intern';
  return `
    <div>
      <!-- Clinic / Facility Header -->
      <div class="border-b-2 border-slate-900 pb-2 mb-2 text-center">
        <h3 class="text-xs font-extrabold uppercase tracking-tight text-slate-900">${escapeHTML(doc.facility || doc.clinic || 'Assigned Healthcare Facility')}</h3>
        <p class="text-[9px] text-slate-600 leading-tight">${escapeHTML(doc.address || '')}</p>
        <p class="text-[9px] font-semibold text-slate-800 mt-0.5">${escapeHTML(doc.name)} • ${escapeHTML(doc.specialty || doc.role || '')}</p>
        ${doc.phone ? `<p class="text-[8.5px] text-slate-600">Tel/Mobile: ${escapeHTML(doc.phone)}</p>` : ''}
        ${isTrainee && doc.school ? `<p class="text-[8.5px] text-teal-800 font-semibold">School: ${escapeHTML(doc.school)}</p>` : ''}
      </div>

      <!-- Patient Info -->
      <div class="text-[9.5px] border-b border-slate-300 pb-1.5 mb-2 space-y-0.5">
        <div class="flex justify-between gap-2">
          <span><strong>Patient:</strong> ${escapeHTML(p.name)}</span>
          <span><strong>Date:</strong> ${escapeHTML(p.consultationDate || new Date().toISOString().split('T')[0])}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span><strong>Age/Sex:</strong> ${escapeHTML(p.age)}y / ${escapeHTML(p.sex)}</span>
          <span><strong>Wt:</strong> ${escapeHTML(p.vitals?.weight || '-')} kg</span>
        </div>
        ${p.address ? `<div class="truncate"><strong>Address:</strong> ${escapeHTML(p.address)}</div>` : ''}
      </div>

      <!-- Rx Symbol & Meds -->
      <div class="my-1">
        <span class="text-2xl font-extrabold text-slate-900 tracking-tighter">℞</span>
      </div>
      <ol class="list-decimal list-inside space-y-2 text-[10px] text-slate-900">
        ${meds.length === 0 ? `<li class="list-none italic text-slate-400">No medications added yet.</li>` : ''}
        ${meds.map((m: any) => `
          <li class="leading-snug">
            <span class="font-bold uppercase">${escapeHTML(m.genericName)}</span>
            ${m.brandExample ? ` <span class="text-slate-600">(${escapeHTML(m.brandExample)})</span>` : ''}
            <span class="float-right font-bold">${escapeHTML(m.quantity)}</span>
            <div class="pl-3 text-[9.5px] text-slate-700 mt-0.5">Sig: ${escapeHTML(m.sig)}</div>
          </li>
        `).join('')}
      </ol>
    </div>

    <div>
      ${p.doctorSoap?.followUpDate ? `
        <p class="text-[9px] font-semibold text-slate-700 mb-1">Next Follow-Up: <span class="font-bold">${escapeHTML(p.doctorSoap.followUpDate)}</span></p>
      ` : ''}
      <div class="pt-2 border-t border-slate-300 mt-3 text-[10px] leading-tight text-slate-800">
        <div class="flex justify-between items-end gap-2">
          <div class="text-slate-400 text-[9px]">
            <p>ID: ${escapeHTML(p.id)}</p>
            <p>A6 Prescription</p>
          </div>
          <div class="text-right min-w-[140px] border-t-[1.5px] border-slate-900 pt-1">
            <p class="font-extrabold text-slate-900 text-[10.5px]">${escapeHTML(doc.name)}</p>
            <p class="text-[9px] text-slate-700">PRC Lic. No.: <strong>${escapeHTML(doc.prc || 'N/A')}</strong></p>
            ${doc.ptr ? `<p class="text-[9px] text-slate-700">PTR No.: <strong>${escapeHTML(doc.ptr)}</strong></p>` : ''}
            ${isTrainee && doc.supervisingDoctor ? `<p class="text-[8.5px] text-slate-800">Supv. MD: <strong>${escapeHTML(doc.supervisingDoctor)}</strong></p>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function buildPrescriptionWorkspaceHTML(appState: any, p: any): string {
  if (!p) {
    return `
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Medical Prescription</h2>
      </div>
      ${renderPatientSelectorBannerHTML(appState, null)}
      <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p class="text-base font-bold text-slate-800">No Active Patient Selected</p>
        <p class="text-xs text-slate-500 mt-1 mb-4">Select or register a patient to prepare and download their Prescription (Rx).</p>
      </div>
    `;
  }

  const doc = appState.doctor;
  const meds = p.doctorSoap?.medications || [];
  const mode = appState.rxPrintMode || 'single-a6';

  return `
    <!-- Uniform Green Banner Title -->
    <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
      <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Medical Prescription</h2>
    </div>

    <!-- Active Patient Card Below Banner (Left-Side Half Screen) -->
    ${renderPatientSelectorBannerHTML(appState, p)}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Rx Medication Editor -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs no-print space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Generics Act Rx Pad Builder</h3>
            <p class="text-xs text-slate-500">RA 6675 compliant (Generic name prominent, brand optional).</p>
          </div>
          <button onclick="addBlankDoctorMed()" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer">
            + Add Medication
          </button>
        </div>

        <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          ${meds.length === 0 ? `<p class="text-xs text-slate-400 italic py-4 text-center">No medications in prescription yet. Click "+ Add Medication" to add one.</p>` : ''}
          ${meds.map((m: any, idx: number) => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-teal-800 uppercase">Medication #${idx + 1}</span>
                <button onclick="removeDoctorMed(${idx})" class="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer">Remove</button>
              </div>
              <input type="text" value="${escapeHTML(m.genericName)}" placeholder="Generic Name + Strength (e.g., Losartan 50mg tab)"
                oninput="updateDoctorMed(${idx}, 'genericName', this.value)"
                class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white">
              <div class="grid grid-cols-2 gap-2">
                <input type="text" value="${escapeHTML(m.brandExample)}" placeholder="Brand Name (optional)"
                  oninput="updateDoctorMed(${idx}, 'brandExample', this.value)"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                <input type="text" value="${escapeHTML(m.quantity)}" placeholder="Qty (e.g., #30)"
                  oninput="updateDoctorMed(${idx}, 'quantity', this.value)"
                  class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
              </div>
              <input type="text" value="${escapeHTML(m.sig)}" placeholder="Sig / Instructions (e.g., 1 tab PO OD)"
                oninput="updateDoctorMed(${idx}, 'sig', this.value)"
                class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
            </div>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-slate-200 space-y-2">
          <label class="block text-xs font-bold text-slate-700">Paper Layout Format</label>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="setRxPrintMode('single-a6')" class="py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${mode === 'single-a6' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-300'}">
              Single A6 Pad (1/4 Bond)
            </button>
            <button onclick="setRxPrintMode('dual-a6')" class="py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${mode === 'dual-a6' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-300'}">
              2-in-1 Dual A6 (Half-Bond)
            </button>
          </div>
          <div class="flex gap-2 pt-2">
            <button onclick="downloadPdfElement('rx-printable-sheet', 'Prescription_${escapeHTML(p.name.replace(/\s+/g, '_'))}.pdf', '${mode === 'dual-a6' ? 'a5-landscape' : 'a6'}')" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer">
              Download Rx PDF
            </button>
            <button onclick="printDocumentElement('rx-printable-sheet', '${mode === 'dual-a6' ? 'A5 landscape' : 'A6 portrait'}')" class="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Rx
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Live Printable Rx Sheet Preview -->
      <div class="lg:col-span-7 flex flex-col items-center">
        <div class="w-full flex flex-wrap items-center justify-between gap-2 mb-2 no-print">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Live Prescription Preview (${mode === 'dual-a6' ? '2-in-1 Dual A6 Half-Bond' : 'Single A6 Pad'})</span>
          <div class="flex items-center gap-2.5">
            <button onclick="printDocumentElement('rx-printable-sheet', '${mode === 'dual-a6' ? 'A5 landscape' : 'A6 portrait'}')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print Prescription Document
            </button>
            <button onclick="downloadPdfElement('rx-printable-sheet', 'Prescription_${escapeHTML(p.name.replace(/\s+/g, '_'))}.pdf', '${mode === 'dual-a6' ? 'a5-landscape' : 'a6'}')" class="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
              Download PDF ↓
            </button>
          </div>
        </div>
        ${mode === 'dual-a6' ? `
          <div id="rx-printable-sheet" class="paper-dual-a6 print-only-target">
            <div class="paper-dual-a6-half paper-dual-a6-divider">
              <div class="text-[8px] font-bold uppercase tracking-widest text-teal-700 mb-1">Patient Copy</div>
              ${buildSingleA6RxPadHTML(doc, p, meds)}
            </div>
            <div class="paper-dual-a6-half">
              <div class="text-[8px] font-bold uppercase tracking-widest text-slate-700 mb-1">Pharmacy / Clinic Copy</div>
              ${buildSingleA6RxPadHTML(doc, p, meds)}
            </div>
          </div>
        ` : `
          <div id="rx-printable-sheet" class="paper-a6 print-only-target">
            ${buildSingleA6RxPadHTML(doc, p, meds)}
          </div>
        `}
      </div>
    </div>
  `;
}

export function buildDiagnosticsWorkspaceHTML(appState: any, p: any): string {
  if (!p) {
    return `
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Laboratory and Imaging</h2>
      </div>
      ${renderPatientSelectorBannerHTML(appState, null)}
      <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p class="text-base font-bold text-slate-800">No Active Patient Selected</p>
        <p class="text-xs text-slate-500 mt-1 mb-4">Select or register a patient to order Laboratory &amp; Imaging tests.</p>
      </div>
    `;
  }

  const doc = appState.doctor;
  const diag = p.diagnostics || { labs: [], imaging: [], clinicalImpression: '', priority: 'Routine', notes: '' };
  const selectedLabs: string[] = diag.labs || [];
  const selectedImaging: string[] = diag.imaging || [];
  const activeTab = appState.diagActiveTab || 'labs';
  const visitDate = p.consultationDate || new Date().toISOString().split('T')[0];

  return `
    <!-- Uniform Green Banner Title -->
    <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md mb-6 no-print">
      <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Laboratory and Imaging</h2>
    </div>

    <!-- Active Patient Card Below Banner (Left-Side Half Screen) -->
    ${renderPatientSelectorBannerHTML(appState, p)}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
      <!-- Left: Philippine Lab & Imaging Catalog Selector -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Philippine Hospital Lab & Imaging Catalog</h3>
            <p class="text-xs text-slate-500">Select tests to include in the dual Laboratory & Imaging Request Sheet.</p>
          </div>
          <div class="flex rounded-xl bg-slate-100 p-1">
            <button onclick="setDiagActiveTab('labs')" class="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeTab === 'labs' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}">
              Laboratory (${selectedLabs.length})
            </button>
            <button onclick="setDiagActiveTab('imaging')" class="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeTab === 'imaging' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}">
              Imaging (${selectedImaging.length})
            </button>
          </div>
        </div>

        <div class="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          ${Object.entries(activeTab === 'labs' ? PH_LAB_CATALOG : PH_IMAGING_CATALOG).map(([categoryName, items]: [string, string[]]) => `
            <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2.5">${escapeHTML(categoryName)}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${items.map((item: string) => {
                  const isChecked = (activeTab === 'labs' ? selectedLabs : selectedImaging).includes(item);
                  return `
                    <label class="flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${isChecked ? 'bg-teal-50 border-teal-500 text-teal-950 font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}">
                      <input type="checkbox" ${isChecked ? 'checked' : ''}
                        onchange="toggleDiagnosticTest('${activeTab}', '${escapeHTML(item)}')"
                        class="mt-0.5 rounded text-teal-600">
                      <span>${escapeHTML(item)}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right: Selected Orders & Request Metadata -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 class="text-base font-extrabold text-slate-900">Diagnostic Request Summary</h3>
          <div class="flex gap-2">
            <button onclick="downloadPdfElement('diag-printable-a4', 'Lab_Imaging_Request_${escapeHTML(p.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''))}_${visitDate}.pdf', 'a5-landscape')" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer">
              Download PDF
            </button>
            <button onclick="printDocumentElement('diag-printable-a4', 'A5 landscape')" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
              Print Sheet
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">Clinical Impression</label>
            <input type="text" value="${escapeHTML(diag.clinicalImpression || p.chiefComplaint || p.doctorSoap?.assessment || '')}"
              oninput="updateDiagField('clinicalImpression', this.value)"
              placeholder="e.g., 34/F with 3-day history of high-grade fever"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Priority</label>
            <select onchange="updateDiagField('priority', this.value)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-white">
              ${['Routine', 'Urgent', 'STAT'].map((pr) => `<option value="${pr}" ${(diag.priority || 'Routine') === pr ? 'selected' : ''}>${pr}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <input id="custom-diag-input" type="text" placeholder="Add custom lab or imaging test..." class="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs">
          <button onclick="addCustomDiagnosticTest()" class="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold cursor-pointer">+ Add</button>
        </div>

        <div class="space-y-2 max-h-64 overflow-y-auto">
          <p class="text-xs font-bold text-slate-700 uppercase">Selected Lab Tests (${selectedLabs.length})</p>
          ${selectedLabs.length === 0 ? `<p class="text-xs text-slate-400 italic">None selected</p>` : `
            <div class="flex flex-wrap gap-1.5">
              ${selectedLabs.map(l => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold">
                  ${escapeHTML(l)}
                  <button onclick="toggleDiagnosticTest('labs', '${escapeHTML(l)}')" class="text-teal-700 hover:text-slate-900 font-bold cursor-pointer">×</button>
                </span>
              `).join('')}
            </div>
          `}
          <p class="text-xs font-bold text-slate-700 uppercase pt-2">Selected Imaging Studies (${selectedImaging.length})</p>
          ${selectedImaging.length === 0 ? `<p class="text-xs text-slate-400 italic">None selected</p>` : `
            <div class="flex flex-wrap gap-1.5">
              ${selectedImaging.map(img => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold">
                  ${escapeHTML(img)}
                  <button onclick="toggleDiagnosticTest('imaging', '${escapeHTML(img)}')" class="text-slate-600 hover:text-slate-900 font-bold cursor-pointer">×</button>
                </span>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>

    <!-- Official Side-by-Side Dual A6 Laboratory & Imaging Request Sheet -->
    <div class="mt-8">
      <div class="flex items-center justify-between max-w-[260mm] mx-auto mb-2 no-print">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Official Dual A6 Laboratory & Imaging Request Sheet Preview</span>
        <button onclick="downloadPdfElement('diag-printable-a4', 'Lab_Imaging_Request_${escapeHTML(p.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, ''))}_${visitDate}.pdf', 'a5-landscape')" class="text-xs font-bold text-teal-700 hover:underline cursor-pointer">Download PDF ↓</button>
      </div>
      <div id="diag-printable-a4" class="print-only-target">
        ${buildDualLabImagingRequestSheetHTML(doc, p)}
      </div>
    </div>
  `;
}

export function buildPatientRecordsHTML(appState: any): string {
  const doc = appState.doctor;
  const search = (appState.recordsSearchQuery || '').trim().toLowerCase();
  const filterTab = appState.recordsActiveTab || 'all';
  const allPatients = appState.patients || [];
  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = allPatients.filter((p: any) => {
    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'antenatal' && p.patientType === 'antenatal') ||
      (filterTab === 'regular' && p.patientType !== 'antenatal');
    if (!matchesTab) return false;
    if (!search) return true;
    const hay = `${p.name} ${p.id} ${p.chiefComplaint || ''} ${p.doctorSoap?.assessment || ''}`.toLowerCase();
    return hay.includes(search);
  });

  const openFolderPatientId = appState.registryOpenFolderPatientId || (filtered[0]?.id || null);
  const selectedPdfPatientId = appState.registryPreviewPatientId || null;
  const selectedPdfType = appState.registryPreviewDocType || 'soap';

  const getPatientPdfFilesList = (p: any) => {
    const safeFirst = (p.name || 'Patient').split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') || 'Patient';
    const safeFull = (p.name || 'Patient').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Patient';
    const vDate = p.consultationDate || todayStr;
    const files = [
      {
        type: 'soap',
        filename: `SOAP_${safeFirst}_${vDate}.pdf`,
        label: 'Outpatient SOAP Record',
        sizeBadge: 'A4 Portrait',
        formatType: 'a4',
        pageSize: 'A4 portrait'
      },
      {
        type: 'rx',
        filename: `Prescription_${safeFull}_${vDate}.pdf`,
        label: 'Medical Prescription (Rx)',
        sizeBadge: 'A6 / Half-Bond',
        formatType: appState.rxPrintMode === 'dual-a6' ? 'a5-landscape' : 'a6',
        pageSize: appState.rxPrintMode === 'dual-a6' ? 'A5 landscape' : 'A6 portrait'
      },
      {
        type: 'labs',
        filename: `Lab_Imaging_Request_${safeFirst}_${vDate}.pdf`,
        label: 'Lab & Imaging Request',
        sizeBadge: 'Dual A6 Sheet',
        formatType: 'a5-landscape',
        pageSize: 'A5 landscape'
      }
    ];
    if (p.patientType === 'antenatal') {
      files.push(
        {
          type: 'anc-soap',
          filename: `Antenatal_Record_${safeFirst}_${vDate}.pdf`,
          label: 'Antenatal SOAP Record',
          sizeBadge: 'A4 Portrait',
          formatType: 'a4',
          pageSize: 'A4 portrait'
        },
        {
          type: 'nanay-rekord',
          filename: `Rekord_ni_Nanay_${safeFull}_${vDate}.pdf`,
          label: `Rekord ni Nanay ${p.name.split(' ')[0]}`,
          sizeBadge: 'Half-Bond (A5)',
          formatType: 'a5-landscape',
          pageSize: 'A5 landscape'
        }
      );
    }
    return files;
  };

  const renderInlineRegistryPdfPreview = (p: any, docType: string) => {
    const files = getPatientPdfFilesList(p);
    const activeFile = files.find((f) => f.type === docType) || files[0];
    const meds = p.doctorSoap?.medications || [];
    const rxMode = appState.rxPrintMode || 'single-a6';

    let sheetBodyHTML = '';
    let sheetPaperClass = 'paper-a4';

    if (activeFile.type === 'soap') {
      sheetPaperClass = 'paper-a4';
      sheetBodyHTML = buildA4SoapRecordSheetHTML(doc, p, 'CONS');
    } else if (activeFile.type === 'anc-soap') {
      sheetPaperClass = 'paper-a4';
      sheetBodyHTML = buildA4SoapRecordSheetHTML(doc, p, 'ANC');
    } else if (activeFile.type === 'nanay-rekord') {
      sheetPaperClass = 'paper-half-bond';
      sheetBodyHTML = buildRekordNiNanayHalfBondHTML(doc, p);
    } else if (activeFile.type === 'rx') {
      if (rxMode === 'dual-a6') {
        sheetPaperClass = 'paper-dual-a6';
        sheetBodyHTML = `
          <div class="paper-dual-a6-half paper-dual-a6-divider">
            <div class="text-[8px] font-bold uppercase tracking-widest text-teal-700 mb-1">Patient Copy</div>
            ${buildSingleA6RxPadHTML(doc, p, meds)}
          </div>
          <div class="paper-dual-a6-half">
            <div class="text-[8px] font-bold uppercase tracking-widest text-slate-700 mb-1">Pharmacy / Clinic Copy</div>
            ${buildSingleA6RxPadHTML(doc, p, meds)}
          </div>
        `;
      } else {
        sheetPaperClass = 'paper-a6';
        sheetBodyHTML = buildSingleA6RxPadHTML(doc, p, meds);
      }
    } else if (activeFile.type === 'labs') {
      sheetPaperClass = '';
      sheetBodyHTML = buildDualLabImagingRequestSheetHTML(doc, p);
    }

    return `
      <div class="mt-4 pt-4 border-t-2 border-teal-200 bg-slate-50/90 rounded-2xl p-4 sm:p-5 space-y-4">
        <!-- Inline PDF Viewer Toolbar (Stays inside Patient Records Registry Tab) -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs no-print">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
              PDF
            </div>
            <div class="min-w-0">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">Opened Inside Registry Folder • ${escapeHTML(p.name)}</span>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 truncate">${escapeHTML(activeFile.filename)}</h4>
            </div>
          </div>

          <!-- Switch Between Patient's PDF Files Inside Folder -->
          <div class="flex flex-wrap items-center gap-1.5">
            ${files.map((f) => `
              <button
                type="button"
                onclick="openRegistryPatientPdf('${escapeHTML(p.id)}', '${f.type}')"
                class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  f.type === activeFile.type
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-teal-50 text-slate-700'
                }"
              >
                ${escapeHTML(f.label)}
              </button>
            `).join('')}
          </div>

          <!-- Download / Print / Close Inline PDF Actions -->
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onclick="downloadPdfElement('registry-inline-pdf-sheet-${escapeHTML(p.id)}', '${escapeHTML(activeFile.filename)}', '${activeFile.formatType}')"
              class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download PDF
            </button>
            <button
              type="button"
              onclick="printDocumentElement('registry-inline-pdf-sheet-${escapeHTML(p.id)}', '${activeFile.pageSize}')"
              class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print
            </button>
            <button
              type="button"
              onclick="closeRegistryPatientPdf()"
              class="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Close Preview ✕
            </button>
          </div>
        </div>

        <!-- Inline Rendered Paper-Sized PDF Sheet -->
        <div class="overflow-x-auto py-2">
          <div id="registry-inline-pdf-sheet-${escapeHTML(p.id)}" class="${sheetPaperClass} print-only-target">
            ${sheetBodyHTML}
          </div>
        </div>
      </div>
    `;
  };

  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">Patient Records Registry</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          ${allPatients.length > 0 ? `
            <button onclick="downloadPdfElement('all-patients-soap-printable', 'MedFlow_All_Patients_SOAP_${todayStr}.pdf', 'a4')" class="px-4 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white border border-teal-400/30 text-xs font-bold shadow-xs cursor-pointer">
              Export All Patients SOAP PDF
            </button>
          ` : ''}
          <button onclick="startNewPatientRegistration()" class="px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs cursor-pointer">
            + Register New Patient
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          ${[
            { id: 'all', label: `All Patient Folders (${allPatients.length})` },
            { id: 'regular', label: `General / OPD (${allPatients.filter((x: any) => x.patientType !== 'antenatal').length})` },
            { id: 'antenatal', label: `Antenatal / OB (${allPatients.filter((x: any) => x.patientType === 'antenatal').length})` }
          ].map(t => `
            <button onclick="setRecordsTab('${t.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${filterTab === t.id ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}">
              ${t.label}
            </button>
          `).join('')}
        </div>
        <input type="text" value="${escapeHTML(appState.recordsSearchQuery || '')}"
          oninput="updateRecordsSearch(this.value)"
          placeholder="Search patient folder, ID, diagnosis, or PDF..."
          class="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
      </div>

      <div class="grid grid-cols-1 gap-4">
        ${filtered.length === 0 ? `
          <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center no-print">
            <p class="text-sm font-bold text-slate-700">No patient folders found.</p>
            <div class="flex justify-center gap-2 mt-4">
              <button onclick="startNewPatientRegistration()" class="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer">+ Register Patient</button>
            </div>
          </div>
        ` : filtered.map((p: any) => {
          const pdfFiles = getPatientPdfFilesList(p);
          const isFolderOpen = openFolderPatientId === p.id || selectedPdfPatientId === p.id;
          const isPreviewingThisPatient = selectedPdfPatientId === p.id;

          return `
            <div class="bg-white rounded-2xl border-2 ${isPreviewingThisPatient ? 'border-teal-600' : 'border-slate-200'} p-4 sm:p-5 shadow-xs transition">
              <!-- Patient Folder Header -->
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div class="flex items-start gap-3.5 cursor-pointer" onclick="toggleRegistryPatientFolder('${escapeHTML(p.id)}')">
                  <div class="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-sm sm:text-base font-extrabold text-slate-900">${escapeHTML(p.name)}</span>
                      <span class="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">${escapeHTML(p.age)}y / ${escapeHTML(p.sex)}</span>
                      <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${p.patientType === 'antenatal' ? 'bg-slate-800 text-white' : 'bg-teal-50 text-teal-800 border border-teal-200'}">
                        ${p.patientType === 'antenatal' ? 'Antenatal / Maternal Folder' : 'Outpatient Folder'}
                      </span>
                      <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-600 text-white">
                        ${pdfFiles.length} PDF Files in Folder
                      </span>
                    </div>
                    <p class="text-xs text-slate-600"><strong>CC:</strong> ${escapeHTML(p.chiefComplaint || 'N/A')} • <strong>Assessment:</strong> ${escapeHTML(p.doctorSoap?.assessment || 'Pending')}</p>
                    <p class="text-[11px] text-slate-400">ID: ${escapeHTML(p.id)} | BP: ${escapeHTML(p.vitals?.bp || '-')} | BMI: ${escapeHTML(p.vitals?.bmi || '-')} | Visit: ${escapeHTML(p.consultationDate || '-')}</p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onclick="toggleRegistryPatientFolder('${escapeHTML(p.id)}')"
                    class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                    <span>${isFolderOpen ? 'Hide Folder Files' : `Open Folder (${pdfFiles.length} PDFs)`}</span>
                  </button>
                  <button
                    type="button"
                    onclick="deletePatientRecord('${escapeHTML(p.id)}')"
                    class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- Patient Folder PDF Files Grid (Opens Directly Within This Tab When Clicked) -->
              ${isFolderOpen ? `
                <div class="mt-4 pt-3.5 border-t border-slate-100 no-print">
                  <div class="flex items-center justify-between mb-2.5">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-teal-800">
                      📁 ${escapeHTML(p.name)}'s Generated PDF Documents (Click any PDF file to open inside this tab)
                    </span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${p.patientType === 'antenatal' ? '5' : '3'} gap-2.5">
                    ${pdfFiles.map((file) => {
                      const isFileActive = isPreviewingThisPatient && selectedPdfType === file.type;
                      return `
                        <div
                          onclick="openRegistryPatientPdf('${escapeHTML(p.id)}', '${file.type}')"
                          class="group p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            isFileActive
                              ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                              : 'bg-slate-50 hover:bg-teal-50/70 text-slate-900 border-slate-200 hover:border-teal-400'
                          }"
                        >
                          <div class="flex items-start gap-2.5">
                            <div class="w-8 h-8 rounded-lg ${isFileActive ? 'bg-white/20 text-white' : 'bg-teal-600 text-white'} flex items-center justify-center font-extrabold text-[10px] shrink-0">
                              PDF
                            </div>
                            <div class="min-w-0">
                              <p class="text-xs font-extrabold truncate" title="${escapeHTML(file.filename)}">${escapeHTML(file.filename)}</p>
                              <p class="text-[10px] ${isFileActive ? 'text-teal-100' : 'text-slate-500'} truncate">${escapeHTML(file.label)} • ${escapeHTML(file.sizeBadge)}</p>
                            </div>
                          </div>
                          <div class="flex items-center justify-between pt-1.5 border-t ${isFileActive ? 'border-teal-500 text-white' : 'border-slate-200/80 text-teal-700'} text-[10.5px] font-bold">
                            <span>${isFileActive ? 'Viewing Below ↓' : 'Click to Open PDF →'}</span>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Inline PDF Document Viewer Inside This Patient's Folder -->
              ${isPreviewingThisPatient ? renderInlineRegistryPdfPreview(p, selectedPdfType) : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Multi-Page All-Patients SOAP Container for PDF Export -->
      ${allPatients.length > 0 ? `
        <div id="all-patients-soap-wrapper" class="fixed -left-[9999px] top-0 w-[210mm] opacity-0 pointer-events-none no-print" aria-hidden="true">
          <div id="all-patients-soap-printable" class="bg-white">
            ${allPatients.map((pt: any, index: number) => `
              <div class="paper-a4" style="${index < allPatients.length - 1 ? 'page-break-after: always;' : ''}">
                ${buildA4SoapRecordSheetHTML(doc, pt, 'CONS')}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function isClinicianSubscriptionExpired(acc: any): boolean {
  if (!acc) return true;
  if (!acc.subscriptionEndDate) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  return todayStr > acc.subscriptionEndDate;
}

export function getSubscriptionDaysRemaining(acc: any): number | null {
  if (!acc?.subscriptionEndDate || !/^\d{4}-\d{2}-\d{2}$/.test(acc.subscriptionEndDate)) {
    return null;
  }
  const todayStr = new Date().toISOString().split('T')[0];
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const [ey, em, ed] = acc.subscriptionEndDate.split('-').map(Number);
  const todayUtc = Date.UTC(ty, tm - 1, td);
  const endUtc = Date.UTC(ey, em - 1, ed);
  return Math.floor((endUtc - todayUtc) / 86400000);
}

export function buildHiddenAdminPortalHTML(appState: any, firebaseConfigObj: any): string {
  const isUnlocked = Boolean(appState.adminPortalUnlocked);
  const adminUrl = `${window.location.origin}${window.location.pathname}?portal=admin`;
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  if (!isUnlocked) {
    return `
      <div class="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 text-white">
          <span class="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-[10px] font-extrabold uppercase tracking-wider">
            Direct Link Only • Hidden Portal
          </span>
          <h2 class="text-xl font-extrabold tracking-tight mt-1.5">MedFlow Administrator Portal</h2>
          <p class="text-xs text-teal-100/90 mt-1">Enrollment Approval, ₱199/Month Subscription Control &amp; Clinician Registry</p>
        </div>
        <form onsubmit="handleAdminPortalLogin(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Admin Email or Passkey <span class="text-teal-700">*</span></label>
            <input
              id="admin-portal-passkey"
              type="password"
              required
              placeholder="Enter Admin Passkey (Default: admin199)"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <p class="text-[11px] text-slate-500 mt-1.5">Default Admin Passkey: <code class="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">admin199</code> (or your admin email <code class="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">artjanny303@gmail.com</code>)</p>
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            Unlock Admin Portal
          </button>
          <div class="pt-3 border-t border-slate-100 text-center">
            <a href="${window.location.pathname}" class="text-xs font-bold text-slate-500 hover:text-teal-700">
              ← Return to Clinician Sign-In
            </a>
          </div>
        </form>
      </div>
    `;
  }

  const allAccounts: any[] = Array.isArray(appState.clinicianAccounts) ? appState.clinicianAccounts : [];
  const filterTab = appState.adminFilterTab || 'all';
  const searchQ = (appState.adminSearchQuery || '').trim().toLowerCase();

  // Compute summary metrics
  const totalUsers = allAccounts.length;
  const totalDoctors = allAccounts.filter((a) => a.role === 'Doctor').length;
  const totalClerks = allAccounts.filter((a) => a.role === 'Medical Clerk').length;
  const totalInterns = allAccounts.filter((a) => a.role === 'Medical Intern').length;

  const pendingAccounts = allAccounts.filter((a) => a.approvalStatus === 'pending');
  const activeAccounts = allAccounts.filter(
    (a) => a.approvalStatus === 'approved' && !isClinicianSubscriptionExpired(a)
  );
  const expiredAccounts = allAccounts.filter(
    (a) => a.approvalStatus === 'approved' && isClinicianSubscriptionExpired(a)
  );
  const bannedOrRejectedAccounts = allAccounts.filter(
    (a) => a.approvalStatus === 'banned' || a.approvalStatus === 'rejected'
  );

  const monthlyRevenuePhp = activeAccounts.length * 199;

  const filteredAccounts = allAccounts.filter((acc) => {
    const expired = isClinicianSubscriptionExpired(acc);
    if (filterTab === 'pending' && acc.approvalStatus !== 'pending') return false;
    if (filterTab === 'active' && !(acc.approvalStatus === 'approved' && !expired)) return false;
    if (filterTab === 'expired' && !(acc.approvalStatus === 'approved' && expired)) return false;
    if (filterTab === 'banned' && !(acc.approvalStatus === 'banned' || acc.approvalStatus === 'rejected')) return false;

    if (!searchQ) return true;
    const hay = [
      acc.name,
      acc.username,
      acc.email,
      acc.phone,
      acc.role,
      acc.specialty,
      acc.facility,
      acc.address,
      acc.school,
      acc.supervisingDoctor,
      acc.prc,
      acc.ptr,
      acc.s2
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(searchQ);
  });

  return `
    <div class="space-y-6 pb-12">
      <!-- Top Admin Banner -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-300/30 text-[10px] font-extrabold uppercase tracking-wider">
              Hidden Admin Portal • ₱199 / Month Subscription Plan
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-teal-200 text-[10px] font-bold">
              Direct Link: ${escapeHTML(adminUrl)}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">
            Clinician Enrollment, Credentials &amp; Subscription Administration
          </h2>
          <p class="text-xs text-teal-100/90 mt-1">
            Approve sign-ups, set subscription start &amp; due dates (₱199/month), monitor user credentials, and ban or lock overdue accounts.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onclick="refreshAdminPortalAccounts()"
            class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            ↻ Sync Cloud Accounts
          </button>
          <button
            type="button"
            onclick="copyAdminPortalLink()"
            class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition cursor-pointer"
          >
            Copy Admin Link
          </button>
          <button
            type="button"
            onclick="exitAdminPortal()"
            class="px-3.5 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Exit to Clinical App →
          </button>
        </div>
      </div>

      <!-- User Tracking & Subscription Revenue Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Registered Users</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-3xl font-extrabold text-slate-900">${totalUsers}</span>
            <span class="text-xs font-bold text-teal-700">Clinicians</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <strong>${totalDoctors}</strong> Doctors • <strong>${totalClerks}</strong> Clerks • <strong>${totalInterns}</strong> Interns
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-teal-200 p-5 shadow-xs">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 block">Active Subscriptions (₱199/mo)</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-3xl font-extrabold text-teal-800">${activeAccounts.length}</span>
            <span class="text-sm font-extrabold text-teal-900">₱${monthlyRevenuePhp.toLocaleString()}/mo</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Rate: <strong>₱199.00 PHP / month</strong> per active clinician
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Pending Sign-Up Enrollments</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-3xl font-extrabold text-slate-900">${pendingAccounts.length}</span>
            <span class="text-xs font-bold text-teal-700">Awaiting Action</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Requires Admin approval &amp; subscription start/end dates
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">Due / Expired or Banned</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-3xl font-extrabold text-slate-900">${expiredAccounts.length + bannedOrRejectedAccounts.length}</span>
            <span class="text-xs font-bold text-slate-600">Locked Out</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <strong>${expiredAccounts.length}</strong> Subscription Due • <strong>${bannedOrRejectedAccounts.length}</strong> Banned/Declined
          </p>
        </div>
      </div>

      <!-- Filter Tabs & Search Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          ${[
            { id: 'all', label: `All Users (${totalUsers})` },
            { id: 'pending', label: `Pending Enrollment (${pendingAccounts.length})` },
            { id: 'active', label: `Active ₱199/mo (${activeAccounts.length})` },
            { id: 'expired', label: `Due / Expired (${expiredAccounts.length})` },
            { id: 'banned', label: `Banned / Declined (${bannedOrRejectedAccounts.length})` }
          ]
            .map(
              (t) => `
            <button
              type="button"
              onclick="setAdminFilterTab('${t.id}')"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterTab === t.id ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }"
            >
              ${t.label}
            </button>
          `
            )
            .join('')}
        </div>
        <div class="w-full md:w-80">
          <input
            type="text"
            value="${escapeHTML(appState.adminSearchQuery || '')}"
            oninput="updateAdminSearchQuery(this.value)"
            placeholder="Search name, PRC/PTR/S2, school, facility, email..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <!-- Clinician Accounts, Credentials & Subscription Control List -->
      <div class="space-y-4">
        ${
          filteredAccounts.length === 0
            ? `
          <div class="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p class="text-sm font-bold text-slate-700">No clinician accounts match this filter.</p>
            <p class="text-xs text-slate-400 mt-1">When doctors, clerks, or interns submit the Sign Up form, their enrollment and credentials appear here automatically.</p>
          </div>
        `
            : filteredAccounts
                .map((acc) => {
                  const expired = isClinicianSubscriptionExpired(acc);
                  const daysLeft = getSubscriptionDaysRemaining(acc);
                  const startVal = acc.subscriptionStartDate || todayStr;
                  const endVal = acc.subscriptionEndDate || defaultEndDate;
                  const isTrainee = acc.role === 'Medical Clerk' || acc.role === 'Medical Intern';

                  let statusBadgeHTML = '';
                  if (acc.approvalStatus === 'banned') {
                    statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase">BANNED / BLOCKED</span>`;
                  } else if (acc.approvalStatus === 'rejected') {
                    statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold uppercase">DECLINED</span>`;
                  } else if (acc.approvalStatus === 'pending') {
                    statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-300 text-[10px] font-extrabold uppercase">PENDING ENROLLMENT</span>`;
                  } else if (expired) {
                    statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full bg-slate-800 text-white text-[10px] font-extrabold uppercase">SUBSCRIPTION DUE / EXPIRED (LOCKED)</span>`;
                  } else {
                    statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full bg-teal-600 text-white text-[10px] font-extrabold uppercase">ACTIVE SUBSCRIBER (₱199/MO${daysLeft !== null ? ` • ${daysLeft}d left` : ''})</span>`;
                  }

                  return `
                    <div class="bg-white rounded-2xl border-2 ${
                      acc.approvalStatus === 'pending'
                        ? 'border-teal-500'
                        : acc.approvalStatus === 'banned' || expired
                        ? 'border-slate-400'
                        : 'border-slate-200'
                    } p-5 shadow-xs space-y-4">
                      <!-- Top Row: Identity, Role & Status -->
                      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                        <div class="flex items-start gap-3.5">
                          <div class="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-base shrink-0">
                            ${escapeHTML((acc.name || 'U').charAt(0).toUpperCase())}
                          </div>
                          <div>
                            <div class="flex flex-wrap items-center gap-2">
                              <h3 class="text-base font-extrabold text-slate-900">${escapeHTML(acc.name)}</h3>
                              <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">${escapeHTML(acc.role)}</span>
                              ${statusBadgeHTML}
                            </div>
                            <p class="text-xs text-slate-500 mt-0.5">
                              Username: <strong class="text-slate-800">${escapeHTML(acc.username)}</strong> •
                              Email: <strong class="text-slate-800">${escapeHTML(acc.email)}</strong> •
                              Phone: <strong class="text-slate-800">${escapeHTML(acc.phone || 'N/A')}</strong> •
                              Registered: ${escapeHTML((acc.createdAt || '').split('T')[0] || 'N/A')}
                            </p>
                          </div>
                        </div>
                        <div class="text-left lg:text-right shrink-0">
                          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Subscription Plan</span>
                          <span class="text-sm font-extrabold text-teal-800">₱${escapeHTML(acc.subscriptionAmountPhp || 199)}.00 PHP / Month</span>
                        </div>
                      </div>

                      <!-- Middle Row: Credentials & Facility Summary -->
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Assigned Facility &amp; Address</span>
                          <p class="font-bold text-slate-900">${escapeHTML(acc.facility || 'Not specified')}</p>
                          <p class="text-slate-600 text-[11px]">${escapeHTML(acc.address || 'No address provided')}</p>
                          <p class="text-slate-500 text-[11px]">Specialty/Rotation: <strong>${escapeHTML(acc.specialty || 'General')}</strong></p>
                        </div>

                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Submitted Credentials Summary</span>
                          ${
                            isTrainee
                              ? `
                            <p><strong>Affiliation School:</strong> ${escapeHTML(acc.school || 'N/A')}</p>
                            <p><strong>Supervising Doctor:</strong> ${escapeHTML(acc.supervisingDoctor || 'N/A')}</p>
                            <p><strong>Trainee ID:</strong> ${escapeHTML(acc.prc || 'N/A')}</p>
                          `
                              : `
                            <p><strong>PRC License No.:</strong> <span class="font-extrabold text-slate-900">${escapeHTML(acc.prc || 'N/A')}</span></p>
                            <p><strong>PTR No.:</strong> ${escapeHTML(acc.ptr || 'N/A')}</p>
                            <p><strong>S2 License No.:</strong> ${escapeHTML(acc.s2 || 'N/A')}</p>
                          `
                          }
                        </div>

                        <!-- Subscription Start Date & End Date Controls -->
                        <div class="p-3 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-900">Subscription Period (₱199/mo)</span>
                            <div class="flex items-center gap-1">
                              <button
                                type="button"
                                onclick="setAdminPresetMonths('${escapeHTML(acc.id)}', 1)"
                                class="px-2 py-0.5 rounded bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold cursor-pointer"
                                title="Set 1 Month from Start Date"
                              >+1 Mo</button>
                              <button
                                type="button"
                                onclick="setAdminPresetMonths('${escapeHTML(acc.id)}', 3)"
                                class="px-2 py-0.5 rounded bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold cursor-pointer"
                                title="Set 3 Months from Start Date"
                              >+3 Mos</button>
                              <button
                                type="button"
                                onclick="setAdminPresetMonths('${escapeHTML(acc.id)}', 12)"
                                class="px-2 py-0.5 rounded bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold cursor-pointer"
                                title="Set 1 Year from Start Date"
                              >+1 Yr</button>
                            </div>
                          </div>
                          <div class="grid grid-cols-2 gap-2">
                            <div>
                              <label class="block text-[10px] font-bold text-slate-700 mb-0.5">Start Date</label>
                              <input
                                type="date"
                                id="admin-sub-start-${escapeHTML(acc.id)}"
                                value="${escapeHTML(startVal)}"
                                class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label class="block text-[10px] font-bold text-slate-700 mb-0.5">End Date (Due Date)</label>
                              <input
                                type="date"
                                id="admin-sub-end-${escapeHTML(acc.id)}"
                                value="${escapeHTML(endVal)}"
                                class="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Bottom Row: Admin Enrollment & Enforcement Actions -->
                      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div class="text-[11px] text-slate-500">
                          ${
                            acc.subscriptionStartDate && acc.subscriptionEndDate
                              ? `Active Window: <strong>${escapeHTML(acc.subscriptionStartDate)}</strong> to <strong>${escapeHTML(acc.subscriptionEndDate)}</strong>`
                              : 'Set Start Date and End Date above, then click Accept Enrollment & Activate.'
                          }
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onclick="adminApproveAndSetSubscription('${escapeHTML(acc.id)}')"
                            class="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                          >
                            ✓ Accept Enrollment &amp; Save Subscription (₱199/mo)
                          </button>
                          ${
                            acc.approvalStatus !== 'banned'
                              ? `
                            <button
                              type="button"
                              onclick="adminBanClinicianAccount('${escapeHTML(acc.id)}')"
                              class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                            >
                              Ban / Suspend Account
                            </button>
                          `
                              : `
                            <button
                              type="button"
                              onclick="adminApproveAndSetSubscription('${escapeHTML(acc.id)}')"
                              class="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
                            >
                              Unban &amp; Restore Subscription
                            </button>
                          `
                          }
                          <button
                            type="button"
                            onclick="adminDeleteClinicianAccount('${escapeHTML(acc.id)}')"
                            class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </div>

      <!-- Firebase & Cloud Storage Connection Guide -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div class="border-b border-slate-100 pb-3">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">Cloud Infrastructure &amp; Storage</span>
          <h3 class="text-base font-extrabold text-slate-900">Firebase Firestore &amp; Firebase Cloud Storage Connection</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Connected Firebase Project ID</span>
            <p class="font-extrabold text-slate-900 mt-0.5">${escapeHTML(firebaseConfigObj?.projectId || 'Not configured')}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Connected Firestore Database</span>
            <p class="font-extrabold text-teal-800 mt-0.5 truncate">${escapeHTML(firebaseConfigObj?.firestoreDatabaseId || '(default)')}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Connected Firebase Storage Bucket</span>
            <p class="font-extrabold text-slate-900 mt-0.5">${escapeHTML(firebaseConfigObj?.storageBucket || 'Not configured')}</p>
          </div>
        </div>
        <div class="text-xs text-slate-600 space-y-1.5 leading-relaxed bg-teal-50/50 border border-teal-200 rounded-xl p-4">
          <p class="font-bold text-teal-950">How your app connects to Firebase Storage &amp; Firestore:</p>
          <p>1. <strong>Already Configured in App:</strong> The Firebase Web SDK (<code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firebase/firestore</code> and <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firebase/storage</code>) is initialized in <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">src/firebase.ts</code> using <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firebase-applet-config.json</code>.</p>
          <p>2. <strong>Automatic Attachment Uploads:</strong> When clinicians attach lab results, imaging files, or documents during patient registration, the app uploads them to <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">gs://${escapeHTML(firebaseConfigObj?.storageBucket || 'your-bucket')}/clinicians/{clinicianId}/attachments/</code> when online and stores an offline copy for offline access.</p>
          <p>3. <strong>Connecting Your Own External Firebase Project (if deploying outside AI Studio):</strong> Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" class="text-teal-700 font-bold underline">Firebase Console</a> → Project Settings → Your Apps (Web App), copy your <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firebaseConfig</code> values (<code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">projectId</code>, <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">apiKey</code>, <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">storageBucket</code>, <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firestoreDatabaseId</code>) into <code class="bg-white px-1.5 py-0.5 rounded border border-teal-200">firebase-applet-config.json</code>, and enable <strong>Build → Storage</strong> in the Firebase Console.</p>
        </div>
      </div>
    </div>
  `;
}

