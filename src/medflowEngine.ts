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
  formatOfficialParagraphsHTML,
  resolveAncTrimesterBundle,
  getPatientPrenatalVisits,
  buildAntenatalMedsFromDropdowns,
  buildRekordNiNanayHalfBondHTML,
  buildA4SoapRecordSheetHTML,
  buildSingleA6RxPadHTML,
  buildAntenatalCareHTML,
  buildSoapWorkspaceHTML,
  buildPrescriptionWorkspaceHTML,
  buildDiagnosticsWorkspaceHTML,
  buildPatientRecordsHTML,
  isClinicianSubscriptionExpired,
  getSubscriptionDaysRemaining,
  buildHiddenAdminPortalHTML,
  renderClearFormIconButtonHTML,
  buildA4IndividualTreatmentRecordHTML,
  buildCpgClinicalManagementFlashcardHTML
} from './medflowViews';
import {
  DOH_VACCINES,
  createBlankBakuNxtPatient,
  loadBakuNxtPatientsFromStorage,
  saveBakuNxtPatientsToStorage,
  calculateBakuNxtAgeText,
  classifyBakuNxtBirthWeight,
  evaluateBakuNxtCPAB,
  evaluateBakuNxtMilestones,
  buildBakuNxtWorkspaceHTML
} from './bakunxtModule';
import {
  classifyChildWHO,
  computeOptCompletedMonths,
  loadOptPlusRecordsFromStorage,
  saveOptPlusRecordsToStorage,
  createBlankOptPlusForm,
  buildOptPlusChildCardPrintableHTML,
  buildOptPlusWorkspaceHTML
} from './optplusModule';
import {
  ClinicianAccount,
  firebaseConfig,
  syncClinicianToFirestore,
  deleteClinicianFromFirestore,
  fetchAllCliniciansFromFirestore,
  syncWorkspaceToFirestore,
  fetchWorkspaceFromFirestore,
  markClinicianDeletedLocally,
  unmarkClinicianDeletedLocally,
  isClinicianDeletedLocally,
  markClinicianBannedLocally,
  unmarkClinicianBannedLocally,
  isClinicianBannedLocally,
  getPendingClinicianSyncMap
} from './firebase';

declare global {
  interface Window {
    [key: string]: any;
  }
}

const LEGACY_DUMMY_ACCOUNT_IDS = new Set([
  'doc-santos-001',
  'clerk-juan-002',
  'intern-bea-003'
]);

const ACCOUNTS_STORAGE_KEY = 'medflow_ph_clinician_accounts_v4';
const SESSION_STORAGE_KEY = 'medflow_ph_active_clinician_id_v4';
const ADMIN_PASSKEY_STORAGE_KEY = 'medflow_ph_admin_passkey_v1';
const AI_SOAP_STORAGE_KEY = 'medflow_ph_ai_soap_enabled_v1';

function getWorkspaceStorageKey(clinicianId: string): string {
  return `medflow_ph_workspace_${clinicianId}`;
}

function getWorkspaceTimestampKey(clinicianId: string): string {
  return `medflow_ph_workspace_ts_${clinicianId}`;
}

function addMonthsToDateStr(dateStr: string, monthsToAdd: number): string {
  const parts = (dateStr || '').split('-').map(Number);
  const y = parts[0] || new Date().getFullYear();
  const m = parts[1] || new Date().getMonth() + 1;
  const d = parts[2] || new Date().getDate();
  const dt = new Date(y, m - 1 + monthsToAdd, d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function formatReadableMonthDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || 'N/A';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (isNaN(dt.getTime())) return dateStr;
  return dt.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

function calculateMonthsBetweenDates(startStr: string, endStr: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endStr)) return 1;
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const startUtc = Date.UTC(sy, sm - 1, sd);
  const endUtc = Date.UTC(ey, em - 1, ed);
  const diffDays = Math.max(1, Math.round((endUtc - startUtc) / 86400000));
  return Math.max(1, Math.ceil(diffDays / 30));
}

export function initMedFlowEngine(): void {
  // Purge all legacy/dummy storage keys so the login screen starts completely clean
  [
    'medflow_ph_clinician_accounts_v1',
    'medflow_ph_clinician_accounts_v2',
    'medflow_ph_clinician_accounts_v3',
    'medflow_ph_active_clinician_id_v1',
    'medflow_ph_active_clinician_id_v2',
    'medflow_ph_active_clinician_id_v3'
  ].forEach((k) => localStorage.removeItem(k));
  LEGACY_DUMMY_ACCOUNT_IDS.forEach((dummyId) => {
    localStorage.removeItem(getWorkspaceStorageKey(dummyId));
    localStorage.removeItem(getWorkspaceTimestampKey(dummyId));
  });

  const todayInitStr = new Date().toISOString().split('T')[0];
  const defaultOneMonthEndStr = addMonthsToDateStr(todayInitStr, 1);

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
    signupSubStartDate: todayInitStr,
    signupSubEndDate: defaultOneMonthEndStr,
    signupSubMonths: 1,
    signupGcashReceiptDataUrl: '',
    signupGcashReceiptName: '',
    registrationDefaultType: 'regular',
    clinicianAccounts: [] as ClinicianAccount[],
    doctor: {
      id: '',
      username: '',
      email: '',
      name: '',
      role: 'Doctor',
      specialty: '',
      facility: '',
      clinic: '',
      address: '',
      phone: '',
      school: '',
      supervisingDoctor: '',
      prc: '',
      ptr: '',
      s2: ''
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
    globalPatientSearchQuery: '',
    globalPatientSearchOpen: false,
    registryOpenFolderPatientId: '',
    registryPreviewPatientId: '',
    registryPreviewDocType: '',
    adminPortalUnlocked: sessionStorage.getItem('medflow_ph_admin_unlocked') === 'true',
    adminFilterTab: 'all',
    adminSearchQuery: '',
    followUpExpanded: false,
    pendingAttachments: [],
    bakunxtActiveTab: 'intake',
    bakunxtPatients: [] as any[],
    bakunxtCurrentPatient: null as any,
    bakunxtSearchQuery: '',
    optplusActiveTab: 'intake',
    optplusRecords: loadOptPlusRecordsFromStorage(),
    optplusForm: createBlankOptPlusForm(),
    optplusFilters: {
      search: '',
      status: 'ALL',
      purok: 'ALL',
      fourPs: 'ALL'
    },
    optplusGoals: {
      totalPop: 3500,
      popFactor: 10.8,
      manualTarget: '',
      targetCovPct: 95,
      daysLeft: 15,
      stuntRedPct: 25,
      wasteRedPct: 50,
      uwRedPct: 30
    }
  };

  const initialBakuNxtPatients = loadBakuNxtPatientsFromStorage();
  appState.bakunxtPatients = initialBakuNxtPatients;
  appState.bakunxtCurrentPatient = createBlankBakuNxtPatient(appState.doctor);

  window.appState = appState;

  function isHiddenAdminPortalRoute(): boolean {
    const params = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || '').toLowerCase();
    return (
      params.get('portal') === 'admin' ||
      params.has('admin') ||
      hash === '#admin' ||
      hash === '#admin-portal'
    );
  }

  function canClinicianAccessApp(acc: ClinicianAccount | null): boolean {
    if (!acc) return false;
    if (isClinicianDeletedLocally(acc.id, acc.email, acc.username)) return false;
    if (isClinicianBannedLocally(acc.id, acc.email, acc.username)) return false;
    if (acc.approvalStatus !== 'approved') return false;
    const existsInRegistry = appState.clinicianAccounts.some(
      (a: ClinicianAccount) => a.id === acc.id && a.approvalStatus === 'approved'
    );
    if (!existsInRegistry) return false;
    if (isClinicianSubscriptionExpired(acc)) return false;
    return true;
  }

  function sanitizeAndFilterClinicianAccounts(accounts: ClinicianAccount[]): ClinicianAccount[] {
    const pendingSyncMap = getPendingClinicianSyncMap();
    const cleaned: ClinicianAccount[] = [];
    for (const rawAcc of accounts) {
      if (!rawAcc || !rawAcc.id || LEGACY_DUMMY_ACCOUNT_IDS.has(rawAcc.id)) continue;
      if (isClinicianDeletedLocally(rawAcc.id, rawAcc.email, rawAcc.username)) continue;
      const pendingLocal = pendingSyncMap[rawAcc.id];
      const acc: ClinicianAccount = pendingLocal ? { ...rawAcc, ...pendingLocal } : { ...rawAcc };
      if (isClinicianBannedLocally(acc.id, acc.email, acc.username)) {
        acc.approvalStatus = 'banned';
      }
      cleaned.push(acc);
    }
    return cleaned;
  }

  function enforceActiveSessionValidity(): boolean {
    const active = appState.activeClinician;
    if (!active) return false;

    if (isClinicianDeletedLocally(active.id, active.email, active.username)) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(getWorkspaceStorageKey(active.id));
      localStorage.removeItem(getWorkspaceTimestampKey(active.id));
      updateHeaderDoctorName();
      if (!isHiddenAdminPortalRoute()) {
        renderAuthScreen();
      }
      return false;
    }

    const inRegistry = appState.clinicianAccounts.find((a: ClinicianAccount) => a.id === active.id);
    if (!inRegistry) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      updateHeaderDoctorName();
      if (!isHiddenAdminPortalRoute()) {
        renderAuthScreen();
      }
      return false;
    }

    if (isClinicianBannedLocally(inRegistry.id, inRegistry.email, inRegistry.username) || inRegistry.approvalStatus === 'banned') {
      inRegistry.approvalStatus = 'banned';
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      updateHeaderDoctorName();
      if (!isHiddenAdminPortalRoute()) {
        renderAuthScreen();
      }
      return false;
    }

    appState.activeClinician = inRegistry;
    return canClinicianAccessApp(inRegistry);
  }

  function loadClinicianAccounts(): void {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(parsed);
        } else {
          appState.clinicianAccounts = [];
        }
      } else {
        appState.clinicianAccounts = [];
      }
    } catch {
      appState.clinicianAccounts = [];
    }
    saveClinicianAccounts();

    // Background sync with Firestore to pull any real registered accounts (respecting local offline bans & deletions)
    fetchAllCliniciansFromFirestore().then((remoteAccounts) => {
      if (remoteAccounts && remoteAccounts.length > 0) {
        const pendingSyncMap = getPendingClinicianSyncMap();
        const mergedMap = new Map<string, ClinicianAccount>();
        appState.clinicianAccounts.forEach((acc: ClinicianAccount) => {
          if (acc && !LEGACY_DUMMY_ACCOUNT_IDS.has(acc.id) && !isClinicianDeletedLocally(acc.id, acc.email, acc.username)) {
            mergedMap.set(acc.id, acc);
          }
        });
        remoteAccounts.forEach((rem: ClinicianAccount) => {
          if (rem && !LEGACY_DUMMY_ACCOUNT_IDS.has(rem.id) && !isClinicianDeletedLocally(rem.id, rem.email, rem.username)) {
            const localPending = pendingSyncMap[rem.id];
            const finalAcc: ClinicianAccount = localPending ? { ...rem, ...localPending } : { ...rem };
            if (isClinicianBannedLocally(finalAcc.id, finalAcc.email, finalAcc.username)) {
              finalAcc.approvalStatus = 'banned';
            }
            mergedMap.set(finalAcc.id, finalAcc);
          }
        });
        appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(Array.from(mergedMap.values()));
        saveClinicianAccounts();
        if (appState.activeClinician) {
          const updatedSelf = mergedMap.get(appState.activeClinician.id);
          if (!updatedSelf || isClinicianDeletedLocally(appState.activeClinician.id, appState.activeClinician.email, appState.activeClinician.username)) {
            appState.activeClinician = null;
            localStorage.removeItem(SESSION_STORAGE_KEY);
            updateHeaderDoctorName();
            if (!isHiddenAdminPortalRoute()) {
              renderAuthScreen();
            }
          } else if (updatedSelf.approvalStatus === 'banned' || isClinicianBannedLocally(updatedSelf.id, updatedSelf.email, updatedSelf.username)) {
            appState.activeClinician = null;
            localStorage.removeItem(SESSION_STORAGE_KEY);
            updateHeaderDoctorName();
            if (!isHiddenAdminPortalRoute()) {
              renderAuthScreen();
            }
          } else {
            appState.activeClinician = updatedSelf;
            syncDoctorFromClinician(updatedSelf);
            updateHeaderDoctorName();
            if (!isHiddenAdminPortalRoute() && !canClinicianAccessApp(updatedSelf)) {
              renderAuthScreen();
            }
          }
        }
        if (isHiddenAdminPortalRoute()) {
          renderHiddenAdminPortal();
        }
      }
    });
  }

  function saveClinicianAccounts(): void {
    try {
      appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(appState.clinicianAccounts || []);
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
        appState.patients = [];
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
      if (appState.activeClinician?.id !== clinicianId) return;

      const hasLocalData =
        (Array.isArray(appState.patients) && appState.patients.length > 0) ||
        (Array.isArray(appState.bakunxtPatients) && appState.bakunxtPatients.length > 0) ||
        (Array.isArray(appState.optplusRecords) && appState.optplusRecords.length > 0);

      if (!remoteResult) {
        if (hasLocalData) {
          syncWorkspaceToFirestore(
            clinicianId,
            appState.patients || [],
            appState.bakunxtPatients || [],
            appState.optplusRecords || []
          );
        }
        return;
      }

      const localTs = localStorage.getItem(getWorkspaceTimestampKey(clinicianId)) || '';
      const remoteTs = remoteResult.updatedAt || '';
      const remoteIsNewer = Boolean(remoteTs && (!localTs || remoteTs > localTs));

      if (Array.isArray(remoteResult.patients) && (appState.patients.length === 0 || remoteIsNewer)) {
        if (remoteResult.patients.length > 0 || remoteIsNewer) {
          appState.patients = remoteResult.patients;
          appState.patients.forEach((p: any) => {
            if (!p.aiSoap) p.aiSoap = generateLiveAISoapFromPatient(p);
          });
          if (!appState.activePatientId && appState.patients.length > 0) {
            appState.activePatientId = appState.patients[0].id;
          }
          localStorage.setItem(getWorkspaceStorageKey(clinicianId), JSON.stringify(appState.patients));
        }
      }

      if (
        Array.isArray(remoteResult.bakunxtPatients) &&
        ((appState.bakunxtPatients || []).length === 0 || remoteIsNewer)
      ) {
        if (remoteResult.bakunxtPatients.length > 0 || remoteIsNewer) {
          appState.bakunxtPatients = remoteResult.bakunxtPatients;
          saveBakuNxtPatientsToStorage(appState.bakunxtPatients);
        }
      }

      if (
        Array.isArray(remoteResult.optplusRecords) &&
        ((appState.optplusRecords || []).length === 0 || remoteIsNewer)
      ) {
        if (remoteResult.optplusRecords.length > 0 || remoteIsNewer) {
          appState.optplusRecords = remoteResult.optplusRecords;
          saveOptPlusRecordsToStorage(appState.optplusRecords);
        }
      }

      if (remoteIsNewer && remoteTs) {
        localStorage.setItem(getWorkspaceTimestampKey(clinicianId), remoteTs);
        if (appState.currentView === 'records') {
          renderPatientRecords();
        }
        updateSidebarGlobalSearchUI();
      } else if (hasLocalData && (!remoteTs || (localTs && localTs > remoteTs))) {
        syncWorkspaceToFirestore(
          clinicianId,
          appState.patients || [],
          appState.bakunxtPatients || [],
          appState.optplusRecords || []
        );
      }
      updateSidebarGlobalSearchUI();
    });
    updateSidebarGlobalSearchUI();
  }

  function saveState(): void {
    if (!appState.activeClinician) return;
    if (!enforceActiveSessionValidity()) return;
    const cid = appState.activeClinician.id;
    try {
      const nowIso = new Date().toISOString();
      localStorage.setItem(getWorkspaceStorageKey(cid), JSON.stringify(appState.patients));
      localStorage.setItem(getWorkspaceTimestampKey(cid), nowIso);
      syncWorkspaceToFirestore(
        cid,
        appState.patients || [],
        appState.bakunxtPatients || [],
        appState.optplusRecords || []
      );
      updateSidebarGlobalSearchUI();
    } catch (e) {
      console.error('Error saving isolated clinician state:', e);
    }
  }

  function getActivePatient(): any {
    return appState.patients.find((p: any) => p.id === appState.activePatientId) || appState.patients[0] || null;
  }

  function getActiveAncPatient(): any {
    const current = appState.patients.find((p: any) => p.id === appState.activePatientId);
    if (current && current.patientType === 'antenatal') return current;
    const firstAnc = appState.patients.find((p: any) => p.patientType === 'antenatal') || null;
    if (firstAnc) {
      appState.activePatientId = firstAnc.id;
    }
    return firstAnc;
  }

  function getActiveOpdPatient(): any {
    const current = appState.patients.find((p: any) => p.id === appState.activePatientId);
    if (current && current.patientType !== 'antenatal') return current;
    const firstOpd = appState.patients.find((p: any) => p.patientType !== 'antenatal') || null;
    if (firstOpd) {
      appState.activePatientId = firstOpd.id;
    }
    return firstOpd;
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
    const beforeComma = fullName.split(',')[0].trim();
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
    if (!appState.activeClinician || isHiddenAdminPortalRoute() || !canClinicianAccessApp(appState.activeClinician)) {
      if (actionsEl) actionsEl.style.display = 'none';
      return;
    }
    if (actionsEl) actionsEl.style.display = 'flex';
  }

  function updateBottomNavHighlight(): void {
    const navIds = ['home', 'registration', 'anc', 'soap', 'rx', 'diagnostics', 'records', 'cpg', 'bakunxt', 'optplus'];
    navIds.forEach((id) => {
      const btn = document.getElementById(`bnav-${id}`);
      if (!btn) return;
      if (appState.currentView === id) {
        btn.className = 'w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 shrink-0 bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-sm cursor-pointer';
      } else {
        btn.className = 'w-full justify-start whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 shrink-0 text-slate-600 hover:text-teal-900 hover:bg-teal-50/80 cursor-pointer';
      }
    });
    updateSidebarGlobalSearchUI();
  }

  // ============================================================================
  // GLOBAL PATIENT SEARCH BAR & QUICK SWITCHER IN SIDEBAR NAVIGATION
  // ============================================================================
  interface GlobalSearchPatientEntry {
    id: string;
    name: string;
    category: 'regular' | 'antenatal' | 'immunization' | 'optplus';
    badgeLabel: string;
    badgeClass: string;
    subtitle: string;
    searchText: string;
    isActive: boolean;
  }

  function getAllGlobalPatientSearchItems(): GlobalSearchPatientEntry[] {
    const items: GlobalSearchPatientEntry[] = [];
    const activeOpdAncId = appState.activePatientId;
    const activeBakuId = appState.bakunxtCurrentPatient?.id || '';
    const activeOptId = appState.optplusForm?.id || '';

    for (const p of appState.patients || []) {
      if (!p || !p.id) continue;
      const isAnc = p.patientType === 'antenatal';
      const sexInitial = (p.sex || 'U').charAt(0).toUpperCase();
      const agePart = p.age !== undefined && p.age !== '' ? `${p.age}y` : '';
      const ccPart = p.chiefComplaint || (isAnc ? 'Prenatal Visit' : 'Outpatient Consult');
      items.push({
        id: p.id,
        name: p.name || 'Unnamed Patient',
        category: isAnc ? 'antenatal' : 'regular',
        badgeLabel: isAnc ? 'ANC' : 'OPD',
        badgeClass: isAnc
          ? 'bg-teal-100 text-teal-900 border-teal-300'
          : 'bg-slate-100 text-slate-800 border-slate-300',
        subtitle: `${p.id} • ${agePart ? `${agePart}/${sexInitial}` : sexInitial} • ${ccPart}`,
        searchText: `${p.name || ''} ${p.id || ''} ${p.chiefComplaint || ''} ${p.address || ''} ${p.contact || ''} ${p.philhealth || ''} ${isAnc ? 'anc antenatal prenatal maternal' : 'opd general outpatient'}`.toLowerCase(),
        isActive: activeOpdAncId === p.id
      });
    }

    for (const b of appState.bakunxtPatients || []) {
      if (!b || !b.id) continue;
      items.push({
        id: b.id,
        name: b.childName || 'Unnamed Child',
        category: 'immunization',
        badgeLabel: 'EPI',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
        subtitle: `${b.fsn || b.id} • ${b.sex || 'Child'} • Mother: ${b.motherName || '—'}`,
        searchText: `${b.childName || ''} ${b.id || ''} ${b.fsn || ''} ${b.motherName || ''} ${b.fatherName || ''} ${b.address || ''} epi bakunxt immunization vaccine`.toLowerCase(),
        isActive: activeBakuId === b.id
      });
    }

    for (const o of appState.optplusRecords || []) {
      if (!o || !o.id) continue;
      items.push({
        id: o.id,
        name: o.childName || 'Unnamed Child',
        category: 'optplus',
        badgeLabel: 'OPT+',
        badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
        subtitle: `${o.id} • ${o.ageMonths ?? 0}m • Brgy. ${o.barangay || '—'}`,
        searchText: `${o.childName || ''} ${o.id || ''} ${o.motherName || ''} ${o.barangay || ''} ${o.purok || ''} optplus nutrition growth`.toLowerCase(),
        isActive: activeOptId === o.id
      });
    }

    return items;
  }

  function updateSidebarGlobalSearchUI(): void {
    const badgeEl = document.getElementById('sidebar-total-patients-badge');
    const clearBtn = document.getElementById('sidebar-global-search-clear');
    const chipEl = document.getElementById('sidebar-active-patient-chip');
    const resultsEl = document.getElementById('sidebar-global-search-results');
    const searchInput = document.getElementById('sidebar-global-patient-search') as HTMLInputElement | null;

    const allItems = getAllGlobalPatientSearchItems();
    if (badgeEl) {
      badgeEl.textContent = `${allItems.length} ${allItems.length === 1 ? 'Record' : 'Records'}`;
    }

    const query = (appState.globalPatientSearchQuery || '').trim();
    if (searchInput && document.activeElement !== searchInput && searchInput.value !== query) {
      searchInput.value = query;
    }

    if (clearBtn) {
      if (query.length > 0 || appState.globalPatientSearchOpen) {
        clearBtn.classList.remove('hidden');
        clearBtn.classList.add('flex');
      } else {
        clearBtn.classList.add('hidden');
        clearBtn.classList.remove('flex');
      }
    }

    // Update Active Patient Context Chip
    if (chipEl) {
      let activeEntry: GlobalSearchPatientEntry | null = null;
      if (appState.currentView === 'bakunxt' && appState.bakunxtCurrentPatient?.childName) {
        activeEntry = allItems.find((i) => i.category === 'immunization' && i.id === appState.bakunxtCurrentPatient.id) || null;
      } else if (appState.currentView === 'optplus' && appState.optplusForm?.childName) {
        activeEntry = allItems.find((i) => i.category === 'optplus' && i.id === appState.optplusForm.id) || null;
      } else if (appState.currentView === 'anc') {
        const ancP = getActiveAncPatient();
        if (ancP) activeEntry = allItems.find((i) => i.id === ancP.id) || null;
      } else {
        const curP = getActivePatient();
        if (curP) activeEntry = allItems.find((i) => i.id === curP.id) || null;
      }

      if (activeEntry) {
        chipEl.innerHTML = `
          <div class="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50/80 border border-teal-200/80 text-[11px]">
            <button
              type="button"
              onclick="selectPatientFromGlobalSearch('${escapeHTML(activeEntry.id)}', '${activeEntry.category}', 'workspace')"
              class="flex items-center gap-1.5 min-w-0 text-left flex-1 cursor-pointer group"
              title="Active Patient: ${escapeHTML(activeEntry.name)} — Click to open clinical workspace"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0"></span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${activeEntry.badgeClass} shrink-0">${escapeHTML(activeEntry.badgeLabel)}</span>
              <span class="font-bold text-slate-900 group-hover:text-teal-800 truncate">${escapeHTML(activeEntry.name)}</span>
            </button>
            <button
              type="button"
              onclick="selectPatientFromGlobalSearch('${escapeHTML(activeEntry.id)}', '${activeEntry.category}', 'folder')"
              class="px-1.5 py-0.5 rounded-md bg-white hover:bg-teal-700 text-teal-800 hover:text-white border border-teal-200 text-[9.5px] font-bold transition shrink-0 cursor-pointer"
              title="Open Patient Folder in Records"
            >
              Folder
            </button>
          </div>
        `;
      } else {
        chipEl.innerHTML = `
          <div class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-[10.5px] text-slate-400 font-medium">
            No active patient selected
          </div>
        `;
      }
    }

    if (!resultsEl) return;

    if (!appState.globalPatientSearchOpen && query.length === 0) {
      resultsEl.classList.add('hidden');
      resultsEl.innerHTML = '';
      return;
    }

    const qLower = query.toLowerCase();
    const matched = qLower
      ? allItems.filter((item) => item.searchText.includes(qLower))
      : allItems.slice(0, 15);

    resultsEl.classList.remove('hidden');

    if (matched.length === 0) {
      resultsEl.innerHTML = `
        <div class="p-3 text-center text-xs text-slate-500 space-y-1.5">
          <p class="font-semibold text-slate-700">No matching patient found</p>
          <p class="text-[10.5px] text-slate-400">Try searching by patient name, ID, chief complaint, or barangay.</p>
          <button
            type="button"
            onclick="clearGlobalPatientSearch(); switchView('registration')"
            class="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[10.5px] font-bold transition cursor-pointer"
          >
            + Register New Patient
          </button>
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = matched
      .map(
        (item) => `
        <div class="p-2 hover:bg-teal-50/70 transition flex items-center justify-between gap-1.5 ${
          item.isActive ? 'bg-teal-50/50' : 'bg-white'
        }">
          <button
            type="button"
            onclick="selectPatientFromGlobalSearch('${escapeHTML(item.id)}', '${item.category}', 'workspace')"
            class="flex-1 min-w-0 text-left cursor-pointer"
            title="Switch to ${escapeHTML(item.name)}"
          >
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${item.badgeClass} shrink-0">
                ${escapeHTML(item.badgeLabel)}
              </span>
              <span class="text-xs font-extrabold text-slate-900 truncate">${escapeHTML(item.name)}</span>
            </div>
            <div class="text-[10px] text-slate-500 truncate mt-0.5">${escapeHTML(item.subtitle)}</div>
          </button>
          <button
            type="button"
            onclick="event.stopPropagation(); selectPatientFromGlobalSearch('${escapeHTML(item.id)}', '${item.category}', 'folder')"
            class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-700 text-slate-700 hover:text-white text-[9.5px] font-bold transition shrink-0 cursor-pointer"
            title="View Patient Files in Patient Records"
          >
            Folder
          </button>
        </div>
      `
      )
      .join('');
  }

  window.handleGlobalPatientSearchInput = (val: string) => {
    appState.globalPatientSearchQuery = val || '';
    appState.globalPatientSearchOpen = true;
    updateSidebarGlobalSearchUI();
  };

  window.handleGlobalPatientSearchFocus = () => {
    appState.globalPatientSearchOpen = true;
    updateSidebarGlobalSearchUI();
  };

  window.clearGlobalPatientSearch = () => {
    appState.globalPatientSearchQuery = '';
    appState.globalPatientSearchOpen = false;
    const searchInput = document.getElementById('sidebar-global-patient-search') as HTMLInputElement | null;
    if (searchInput) searchInput.value = '';
    updateSidebarGlobalSearchUI();
  };

  window.handleGlobalPatientSearchKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      window.clearGlobalPatientSearch();
      (e.target as HTMLInputElement)?.blur();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const qLower = (appState.globalPatientSearchQuery || '').trim().toLowerCase();
      const allItems = getAllGlobalPatientSearchItems();
      const matched = qLower ? allItems.filter((item) => item.searchText.includes(qLower)) : allItems;
      if (matched.length > 0) {
        window.selectPatientFromGlobalSearch(matched[0].id, matched[0].category, 'workspace');
      }
    }
  };

  window.selectPatientFromGlobalSearch = (
    recordId: string,
    category: 'regular' | 'antenatal' | 'immunization' | 'optplus',
    action: 'workspace' | 'folder' = 'workspace'
  ) => {
    if (!recordId) return;
    appState.globalPatientSearchOpen = false;
    appState.globalPatientSearchQuery = '';
    const searchInput = document.getElementById('sidebar-global-patient-search') as HTMLInputElement | null;
    if (searchInput) searchInput.value = '';

    if (action === 'folder') {
      if (category === 'regular' || category === 'antenatal') {
        appState.activePatientId = recordId;
      }
      appState.recordsActiveTab = category;
      const found = findAnyRegistryRecord(recordId);
      appState.registryOpenFolderPatientId = recordId;
      appState.registryOpenVisitFolderKey = `${recordId}__${found.defaultDate}`;
      switchView('records');
      showToast(`Opened patient folder in Patient Records.`);
      return;
    }

    if (category === 'immunization') {
      const b = (appState.bakunxtPatients || []).find((x: any) => x.id === recordId);
      if (b) {
        appState.bakunxtCurrentPatient = JSON.parse(JSON.stringify(b));
        appState.bakunxtActiveTab = 'intake';
        switchView('bakunxt');
        showToast(`Switched to ${b.childName} in BakuNxt Immunization.`);
      }
      return;
    }

    if (category === 'optplus') {
      const o = (appState.optplusRecords || []).find((x: any) => x.id === recordId);
      if (o) {
        window.optplusEditRecord(o.id);
        switchView('optplus');
        showToast(`Switched to ${o.childName} in OPTPlus Nutrition.`);
      }
      return;
    }

    // OPD or Antenatal Patient
    const p = (appState.patients || []).find((x: any) => x.id === recordId);
    if (!p) return;
    appState.activePatientId = p.id;
    saveState();

    const curView = appState.currentView;
    if (category === 'antenatal') {
      if (['anc', 'soap', 'rx', 'diagnostics'].includes(curView)) {
        switchView(curView);
      } else if (curView === 'records') {
        appState.recordsActiveTab = 'antenatal';
        const found = findAnyRegistryRecord(p.id);
        appState.registryOpenFolderPatientId = p.id;
        appState.registryOpenVisitFolderKey = `${p.id}__${found.defaultDate}`;
        switchView('records');
      } else {
        switchView('anc');
      }
      showToast(`Switched active patient to ${p.name} (Antenatal Care).`);
    } else {
      if (['soap', 'rx', 'diagnostics'].includes(curView)) {
        switchView(curView);
      } else if (curView === 'records') {
        appState.recordsActiveTab = 'regular';
        const found = findAnyRegistryRecord(p.id);
        appState.registryOpenFolderPatientId = p.id;
        appState.registryOpenVisitFolderKey = `${p.id}__${found.defaultDate}`;
        switchView('records');
      } else {
        switchView('soap');
      }
      showToast(`Switched active patient to ${p.name}.`);
    }
  };

  document.addEventListener('click', (e: MouseEvent) => {
    const wrapper = document.getElementById('sidebar-global-search-wrapper');
    if (wrapper && !wrapper.contains(e.target as Node)) {
      if (appState.globalPatientSearchOpen) {
        appState.globalPatientSearchOpen = false;
        updateSidebarGlobalSearchUI();
      }
    }
  });

  // ============================================================================
  // HIDDEN ADMINISTRATOR PORTAL (DIRECT LINK ONLY: ?portal=admin OR #admin)
  // ============================================================================
  function renderHiddenAdminPortal(): void {
    const main = document.getElementById('main-workspace');
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';
    updateHeaderDoctorName();
    if (!main) return;
    main.innerHTML = buildHiddenAdminPortalHTML(appState, firebaseConfig);
  }

  window.toggleAdminForgotPassword = (show: boolean) => {
    appState.adminForgotMode = Boolean(show);
    renderHiddenAdminPortal();
  };

  window.handleAdminForgotPasswordReset = (e: Event) => {
    e.preventDefault();
    const emailInput = ((document.getElementById('admin-recovery-email') as HTMLInputElement)?.value || '').trim().toLowerCase();
    const newPass = ((document.getElementById('admin-recovery-new-pass') as HTMLInputElement)?.value || '').trim();
    const confirmPass = ((document.getElementById('admin-recovery-confirm-pass') as HTMLInputElement)?.value || '').trim();

    if (emailInput !== 'artjanny303@gmail.com') {
      showToast('Please enter the registered Administrator email (artjanny303@gmail.com).', 'warning');
      return;
    }
    if (!newPass || newPass.length < 4) {
      showToast('New Admin password must be at least 4 characters.', 'warning');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New Admin password and confirmation do not match.', 'warning');
      return;
    }

    localStorage.setItem(ADMIN_PASSKEY_STORAGE_KEY, newPass);
    appState.adminForgotMode = false;
    appState.adminPortalUnlocked = true;
    sessionStorage.setItem('medflow_ph_admin_unlocked', 'true');
    renderHiddenAdminPortal();
    showToast('Admin Portal password reset & unlocked successfully.');
  };

  window.handleAdminResetToDefaultPasskey = () => {
    localStorage.setItem(ADMIN_PASSKEY_STORAGE_KEY, 'admin199');
    appState.adminForgotMode = false;
    appState.adminPortalUnlocked = true;
    sessionStorage.setItem('medflow_ph_admin_unlocked', 'true');
    renderHiddenAdminPortal();
    showToast('Admin Portal password restored to default (admin199) and unlocked.');
  };

  window.handleAdminPortalLogin = (e: Event) => {
    e.preventDefault();
    const passInput = ((document.getElementById('admin-portal-passkey') as HTMLInputElement)?.value || '').trim();
    const customPasskey = localStorage.getItem(ADMIN_PASSKEY_STORAGE_KEY) || 'admin199';
    if (passInput === customPasskey || passInput === 'admin199' || passInput.toLowerCase() === 'artjanny303@gmail.com') {
      appState.adminPortalUnlocked = true;
      sessionStorage.setItem('medflow_ph_admin_unlocked', 'true');
      renderHiddenAdminPortal();
      showToast('Admin Portal unlocked.');
    } else {
      showToast('Invalid Admin Password.', 'warning');
    }
  };

  window.handleAdminPasswordChange = (e: Event) => {
    e.preventDefault();
    const newPass = ((document.getElementById('admin-new-portal-passkey') as HTMLInputElement)?.value || '').trim();
    const confirmPass = ((document.getElementById('admin-confirm-portal-passkey') as HTMLInputElement)?.value || '').trim();
    if (!newPass || newPass.length < 4) {
      showToast('New Admin password must be at least 4 characters.', 'warning');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New Admin password and confirmation do not match.', 'warning');
      return;
    }
    localStorage.setItem(ADMIN_PASSKEY_STORAGE_KEY, newPass);
    renderHiddenAdminPortal();
    showToast('Admin Portal password updated successfully.');
  };

  window.adminChangeClinicianPassword = (clinicianId: string) => {
    const idx = appState.clinicianAccounts.findIndex((a: ClinicianAccount) => a.id === clinicianId);
    if (idx < 0) return;
    const passInput = document.getElementById(`admin-user-pass-${clinicianId}`) as HTMLInputElement | null;
    const newPassword = (passInput?.value || '').trim();
    if (!newPassword || newPassword.length < 4) {
      showToast('Please enter a new password (at least 4 characters).', 'warning');
      return;
    }
    const updated: ClinicianAccount = {
      ...appState.clinicianAccounts[idx],
      passwordHash: newPassword
    };
    appState.clinicianAccounts[idx] = updated;
    if (appState.activeClinician?.id === clinicianId) {
      appState.activeClinician = updated;
    }
    saveClinicianAccounts();
    syncClinicianToFirestore(updated);
    renderHiddenAdminPortal();
    showToast(`Updated password for ${updated.name}.`);
  };

  window.setAdminFilterTab = (tab: string) => {
    appState.adminFilterTab = tab;
    renderHiddenAdminPortal();
  };

  window.updateAdminSearchQuery = (val: string) => {
    appState.adminSearchQuery = val;
    renderHiddenAdminPortal();
    const input = document.querySelector('input[oninput="updateAdminSearchQuery(this.value)"]') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.setSelectionRange(val.length, val.length);
    }
  };

  window.setAdminPresetMonths = (clinicianId: string, months: number) => {
    const startInput = document.getElementById(`admin-sub-start-${clinicianId}`) as HTMLInputElement | null;
    const endInput = document.getElementById(`admin-sub-end-${clinicianId}`) as HTMLInputElement | null;
    const todayStr = new Date().toISOString().split('T')[0];
    const startVal = startInput?.value && /^\d{4}-\d{2}-\d{2}$/.test(startInput.value) ? startInput.value : todayStr;
    if (startInput) startInput.value = startVal;
    const endStr = addMonthsToDateStr(startVal, months);
    if (endInput) endInput.value = endStr;
  };

  window.adminApproveAndSetSubscription = (clinicianId: string) => {
    const idx = appState.clinicianAccounts.findIndex((a: ClinicianAccount) => a.id === clinicianId);
    if (idx < 0) return;
    const startInput = document.getElementById(`admin-sub-start-${clinicianId}`) as HTMLInputElement | null;
    const endInput = document.getElementById(`admin-sub-end-${clinicianId}`) as HTMLInputElement | null;
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultEnd = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const startDate = startInput?.value || todayStr;
    const endDate = endInput?.value || defaultEnd;

    if (endDate < startDate) {
      showToast('End Date cannot be earlier than Start Date.', 'warning');
      return;
    }

    const monthsCount = calculateMonthsBetweenDates(startDate, endDate);
    const currentAcc = appState.clinicianAccounts[idx];
    unmarkClinicianBannedLocally(currentAcc.id, currentAcc.email, currentAcc.username);
    unmarkClinicianDeletedLocally(currentAcc.id, currentAcc.email, currentAcc.username);

    const updated: ClinicianAccount = {
      ...currentAcc,
      approvalStatus: 'approved',
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      subscriptionMonths: monthsCount,
      subscriptionAmountPhp: monthsCount * 199
    };

    appState.clinicianAccounts[idx] = updated;
    if (appState.activeClinician?.id === clinicianId) {
      appState.activeClinician = updated;
    }
    saveClinicianAccounts();
    syncClinicianToFirestore(updated);
    renderHiddenAdminPortal();
    showToast(`Approved ${updated.name} (${monthsCount} mo • ₱${monthsCount * 199}: ${startDate} to ${endDate})`);
  };

  window.adminBanClinicianAccount = (clinicianId: string) => {
    const idx = appState.clinicianAccounts.findIndex((a: ClinicianAccount) => a.id === clinicianId);
    if (idx < 0) return;
    const targetAcc = appState.clinicianAccounts[idx];
    markClinicianBannedLocally(targetAcc.id, targetAcc.email, targetAcc.username);

    const updated: ClinicianAccount = {
      ...targetAcc,
      approvalStatus: 'banned'
    };
    appState.clinicianAccounts[idx] = updated;
    if (appState.activeClinician?.id === clinicianId || localStorage.getItem(SESSION_STORAGE_KEY) === clinicianId) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    saveClinicianAccounts();
    syncClinicianToFirestore(updated);
    renderHiddenAdminPortal();
    showToast(`Banned & suspended account: ${updated.name}. Offline and online sign-in blocked.`, 'warning');
  };

  window.adminDeleteClinicianAccount = (clinicianId: string) => {
    const target = appState.clinicianAccounts.find((a: ClinicianAccount) => a.id === clinicianId);
    markClinicianDeletedLocally(clinicianId, target?.email, target?.username);
    appState.clinicianAccounts = appState.clinicianAccounts.filter((a: ClinicianAccount) => a.id !== clinicianId);
    if (appState.activeClinician?.id === clinicianId || localStorage.getItem(SESSION_STORAGE_KEY) === clinicianId) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    localStorage.removeItem(getWorkspaceStorageKey(clinicianId));
    localStorage.removeItem(getWorkspaceTimestampKey(clinicianId));
    saveClinicianAccounts();
    void deleteClinicianFromFirestore(clinicianId, target?.email, target?.username);
    renderHiddenAdminPortal();
    showToast(`Permanently deleted account ${target?.name || clinicianId}. Offline and online login revoked.`);
  };

  window.refreshAdminPortalAccounts = async () => {
    showToast('Syncing clinician accounts from Firestore...');
    const remoteAccounts = await fetchAllCliniciansFromFirestore();
    if (remoteAccounts && remoteAccounts.length > 0) {
      const pendingSyncMap = getPendingClinicianSyncMap();
      const mergedMap = new Map<string, ClinicianAccount>();
      appState.clinicianAccounts.forEach((acc: ClinicianAccount) => {
        if (acc && !LEGACY_DUMMY_ACCOUNT_IDS.has(acc.id) && !isClinicianDeletedLocally(acc.id, acc.email, acc.username)) {
          mergedMap.set(acc.id, acc);
        }
      });
      remoteAccounts.forEach((rem: ClinicianAccount) => {
        if (rem && !LEGACY_DUMMY_ACCOUNT_IDS.has(rem.id) && !isClinicianDeletedLocally(rem.id, rem.email, rem.username)) {
          const localPending = pendingSyncMap[rem.id];
          const finalAcc: ClinicianAccount = localPending ? { ...rem, ...localPending } : { ...rem };
          if (isClinicianBannedLocally(finalAcc.id, finalAcc.email, finalAcc.username)) {
            finalAcc.approvalStatus = 'banned';
          }
          mergedMap.set(finalAcc.id, finalAcc);
        }
      });
      appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(Array.from(mergedMap.values()));
      saveClinicianAccounts();
    }
    renderHiddenAdminPortal();
    showToast('Admin registry synced.');
  };

  window.copyAdminPortalLink = () => {
    const adminUrl = `${window.location.origin}${window.location.pathname}?portal=admin`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(adminUrl).then(() => {
        showToast(`Copied Admin Portal link: ${adminUrl}`);
      });
    } else {
      showToast(`Admin Portal Link: ${adminUrl}`);
    }
  };

  window.copyFreePlanFirestoreRules = () => {
    const rulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clinicians/{clinicianId} {
      allow read, create, update, delete: if true;
    }
    match /workspaces/{clinicianId} {
      allow read, create, update: if true;
    }
  }
}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rulesText).then(() => {
        showToast('Copied Free-Plan Firestore Database Rules to clipboard!');
      });
    } else {
      showToast('Firestore Rules ready in firestore.rules file.');
    }
  };

  window.exitAdminPortal = () => {
    window.history.pushState({}, '', window.location.pathname);
    if (canClinicianAccessApp(appState.activeClinician)) {
      switchView('home');
    } else {
      renderAuthScreen();
    }
  };

  // ============================================================================
  // MULTI-USER AUTHENTICATION (SIGN IN & REGISTRATION FOR DOCTORS, CLERKS, INTERNS)
  // ============================================================================
  function renderAuthScreen(): void {
    if (isHiddenAdminPortalRoute()) {
      renderHiddenAdminPortal();
      return;
    }

    const main = document.getElementById('main-workspace');
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';
    updateHeaderDoctorName();
    if (!main) return;

    // 1. Check if account is Banned or Rejected
    if (
      appState.activeClinician &&
      (appState.activeClinician.approvalStatus === 'banned' ||
        appState.activeClinician.approvalStatus === 'rejected')
    ) {
      const c = appState.activeClinician;
      main.innerHTML = `
        <div class="max-w-xl mx-auto my-8 bg-white rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden">
          <div class="bg-slate-900 p-6 text-white">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 mb-2">Access Restricted</span>
            <h2 class="text-xl font-extrabold">Account Banned / Suspended</h2>
            <p class="text-xs text-slate-300 mt-1">This clinician account has been suspended or declined by the Administrator.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-1.5">
              <p><strong>Clinician:</strong> ${escapeHTML(c.name)} (${escapeHTML(c.role)})</p>
              <p><strong>Username / Email:</strong> ${escapeHTML(c.username)} • ${escapeHTML(c.email)}</p>
              <p><strong>Assigned Facility:</strong> ${escapeHTML(c.facility)}</p>
              <p><strong>Status:</strong> <span class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold uppercase text-[10px]">${escapeHTML(c.approvalStatus)}</span></p>
            </div>
            <p class="text-xs text-slate-600">
              Please contact the Administrator to reactivate your ₱199/month subscription and restore access to your workspace.
            </p>
            <div class="flex gap-2.5 pt-2">
              <button onclick="checkPendingDoctorStatus()" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer">
                Check Account Status
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

    // 2. Check if Subscription is Due / Expired
    if (
      appState.activeClinician &&
      appState.activeClinician.approvalStatus === 'approved' &&
      isClinicianSubscriptionExpired(appState.activeClinician)
    ) {
      const c = appState.activeClinician;
      main.innerHTML = `
        <div class="max-w-xl mx-auto my-8 bg-white rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 p-6 text-white">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 mb-2">₱199 / Month Subscription Due</span>
            <h2 class="text-xl font-extrabold">Subscription Expired — Workspace Locked</h2>
            <p class="text-xs text-teal-100 mt-1">Your monthly subscription period has ended. Please renew via GCash (₱199/month) to continue using the app.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-1.5">
              <p><strong>Clinician:</strong> ${escapeHTML(c.name)} (${escapeHTML(c.role)})</p>
              <p><strong>Assigned Facility:</strong> ${escapeHTML(c.facility)}</p>
              <p><strong>Subscription Plan:</strong> ₱199.00 PHP / Month</p>
              <p><strong>Start Date:</strong> ${escapeHTML(c.subscriptionStartDate || 'N/A')}</p>
              <p><strong>Due / End Date:</strong> <span class="font-extrabold text-slate-900">${escapeHTML(c.subscriptionEndDate || 'Expired')}</span></p>
              <p><strong>Status:</strong> <span class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold uppercase text-[10px]">Subscription Due / Locked</span></p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button onclick="checkPendingDoctorStatus()" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer">
                Check Renewal Status
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

    // 3. Check if logged in as a Pending Enrollment Clinician
    if (appState.activeClinician && appState.activeClinician.approvalStatus === 'pending') {
      const c = appState.activeClinician;
      const isTrainee = c.role === 'Medical Clerk' || c.role === 'Medical Intern';
      const monthsAvailed = c.subscriptionMonths || 1;
      const totalPaymentPhp = c.subscriptionAmountPhp || monthsAvailed * 199;
      main.innerHTML = `
        <div class="max-w-xl mx-auto my-8 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 text-white">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 mb-2">Subscription Enrollment (₱199 / Month via GCash)</span>
            <h2 class="text-xl font-extrabold">Account Pending Admin Enrollment Approval</h2>
            <p class="text-xs text-teal-100 mt-1">Your registration has been submitted. Please ensure your GCash subscription payment (₱${Number(totalPaymentPhp).toLocaleString()}.00 PHP) is settled before Admin enrollment activation.</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-1.5">
              <p class="font-bold text-sm text-slate-900">Submitted Clinician &amp; Subscription Details:</p>
              <p><strong>Name &amp; Role:</strong> ${escapeHTML(c.name)} (${escapeHTML(c.role)})</p>
              <p><strong>Username / Email:</strong> ${escapeHTML(c.username)} • ${escapeHTML(c.email)}</p>
              <p><strong>Phone Number:</strong> ${escapeHTML(c.phone)}</p>
              <p><strong>Assigned Facility:</strong> ${escapeHTML(c.facility)} (${escapeHTML(c.address)})</p>
              ${
                isTrainee
                  ? `<p><strong>School &amp; Supervising MD:</strong> ${escapeHTML(c.school || 'N/A')} • Supv: ${escapeHTML(c.supervisingDoctor || 'N/A')}</p>`
                  : `<p><strong>PRC / PTR / S2:</strong> PRC #${escapeHTML(c.prc || 'Pending')} | PTR #${escapeHTML(c.ptr || 'N/A')} | S2 #${escapeHTML(c.s2 || 'N/A')}</p>`
              }
              <p><strong>Starting Date &amp; Month:</strong> ${escapeHTML(formatReadableMonthDate(c.subscriptionStartDate || ''))} (${escapeHTML(c.subscriptionStartDate || 'N/A')})</p>
              <p><strong>End Date &amp; Month:</strong> ${escapeHTML(formatReadableMonthDate(c.subscriptionEndDate || ''))} (${escapeHTML(c.subscriptionEndDate || 'N/A')})</p>
              <p><strong>Months Availed:</strong> ${monthsAvailed} Month${monthsAvailed > 1 ? 's' : ''} (₱199.00 / month)</p>
              <p><strong>Total Payment Due via GCash Before Enrollment:</strong> <span class="font-extrabold text-teal-800">₱${Number(totalPaymentPhp).toLocaleString()}.00 PHP</span></p>
              ${c.gcashReference ? `<p><strong>GCash Reference / Details:</strong> ${escapeHTML(c.gcashReference)}</p>` : ''}
              <p><strong>Enrollment Status:</strong> <span class="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold uppercase text-[10px]">Pending Admin Approval</span></p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button onclick="checkPendingDoctorStatus()" class="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer">
                Check Approval &amp; Subscription Status
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
    const subStart = appState.signupSubStartDate || todayInitStr;
    const subEnd = appState.signupSubEndDate || defaultOneMonthEndStr;
    const subMonths = Number(appState.signupSubMonths) || calculateMonthsBetweenDates(subStart, subEnd);
    const totalPaymentPhp = subMonths * 199;

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
            <form onsubmit="handleClinicianSignIn(event)" class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">1</span>
                  <span class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Clinician Sign In</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">MedFlow PH Access</span>
                  ${renderClearFormIconButtonHTML('clearSignInForm()', 'Clear Sign In Form')}
                </div>
              </div>
              <div class="p-5 space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address or Username <span class="text-teal-700">*</span></label>
                  <input id="signin-identifier" type="text" required placeholder="Enter your registered email or username"
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
                  <button type="button" onclick="setAuthMode('signup')" class="text-teal-700 font-bold hover:underline cursor-pointer">Sign Up (₱199/month) →</button>
                </p>
              </div>
            </form>
          ` : `
            <form onsubmit="handleClinicianSignUp(event)" class="space-y-5">
              <!-- Section 1: Role Selector + Account Login Credentials -->
              <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">1</span>
                    <h4 class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Clinician Role &amp; Account Identification</h4>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">Account Setup</span>
                    ${renderClearFormIconButtonHTML('clearSignUpForm()', 'Clear Registration Form')}
                  </div>
                </div>
                <div class="p-5 space-y-4">
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

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Full Name &amp; Title <span class="text-teal-700">*</span></label>
                      <input id="signup-name" type="text" required placeholder="${isTrainee ? `Enter full name (${role})` : 'Enter full name & MD title'}"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Username <span class="text-teal-700">*</span></label>
                      <input id="signup-username" type="text" required placeholder="Enter preferred username"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Email Address <span class="text-teal-700">*</span></label>
                      <input id="signup-email" type="email" required placeholder="Enter active email address"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Phone / Mobile Number <span class="text-teal-700">*</span></label>
                      <input id="signup-phone" type="text" required placeholder="09XX-XXX-XXXX"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Create Password <span class="text-teal-700">*</span></label>
                      <input id="signup-password" type="password" required minlength="4" placeholder="Create password"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Specialty / Department Rotation</label>
                      <input id="signup-specialty" type="text" placeholder="${isTrainee ? 'e.g., Internal Medicine / OB-GYN Rotation' : 'e.g., Primary Care / Internal Medicine'}"
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Assigned Facility & Address -->
              <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">2</span>
                    <p class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Assigned Facility &amp; Document Header Information</p>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">RHU / Hospital / Clinic</span>
                </div>
                <div class="p-4 bg-teal-50/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Assigned Facility / Hospital / Clinic <span class="text-teal-700">*</span></label>
                    <input id="signup-facility" type="text" required placeholder="Enter assigned hospital, RHU, or clinic"
                      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Facility / Clinic Address <span class="text-teal-700">*</span></label>
                    <input id="signup-address" type="text" required placeholder="Enter complete facility address"
                      class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                  </div>
                </div>
              </div>

              <!-- Section 3: Conditional Fields for Medical Clerk / Medical Intern / Doctor -->
              ${isTrainee ? `
                <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                  <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">3</span>
                      <p class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">${escapeHTML(role)} Affiliation &amp; Supervision</p>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">Academic Supervision</span>
                  </div>
                  <div class="p-4 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Current Affiliation School <span class="text-teal-700">*</span></label>
                      <input id="signup-school" type="text" required placeholder="Enter medical school name"
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">Supervising Doctor (Type or Edit) <span class="text-teal-700">*</span></label>
                      <input id="signup-supervising" type="text" required placeholder="Enter supervising physician name & PRC No."
                        class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold">
                    </div>
                  </div>
                </div>
              ` : `
                <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                  <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">3</span>
                      <p class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Physician License Credentials</p>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">SOAP, Rx &amp; Lab Signatory</span>
                  </div>
                  <div class="p-4 bg-slate-50 grid grid-cols-3 gap-2.5">
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">PRC License No. <span class="text-teal-700">*</span></label>
                      <input id="signup-prc" type="text" required placeholder="PRC License No."
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">PTR No.</label>
                      <input id="signup-ptr" type="text" placeholder="PTR No."
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">S2 License No.</label>
                      <input id="signup-s2" type="text" placeholder="S2 License No."
                        class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
                    </div>
                  </div>
                </div>
              `}

              <!-- Section 4: CHOOSE YOUR SUBSCRIPTION -->
              <div class="rounded-2xl border-2 border-teal-300 overflow-hidden bg-teal-50/80 shadow-2xs">
                <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">4</span>
                    <h4 class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">
                      Choose Your Subscription
                    </h4>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-white text-teal-900 text-[10px] font-extrabold uppercase shadow-2xs">
                    ₱199 / Month
                  </span>
                </div>
                <div class="p-4 space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">Starting Date <span class="text-teal-700">*</span></label>
                      <input
                        id="signup-sub-start"
                        type="date"
                        required
                        value="${escapeHTML(subStart)}"
                        onchange="handleSignupSubDateChange('start', this.value)"
                        class="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">Months <span class="text-teal-700">*</span></label>
                      <select
                        id="signup-sub-months"
                        onchange="handleSignupSubMonthsChange(this.value)"
                        class="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-xs font-bold text-slate-900"
                      >
                        ${[1, 2, 3, 4, 5, 6, 9, 12].map((m) => `
                          <option value="${m}" ${subMonths === m ? 'selected' : ''}>
                            ${m} Month${m > 1 ? 's' : ''} — ₱${(m * 199).toLocaleString()}.00
                          </option>
                        `).join('')}
                      </select>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">End Date <span class="text-teal-700">*</span></label>
                      <input
                        id="signup-sub-end"
                        type="date"
                        required
                        value="${escapeHTML(subEnd)}"
                        onchange="handleSignupSubDateChange('end', this.value)"
                        class="w-full px-3 py-2 rounded-xl border border-teal-300 bg-white text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <!-- Concise Total Amount Box & GCash Details -->
                  <div class="p-3.5 rounded-xl bg-white border border-teal-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="space-y-1">
                      <p class="text-xs font-bold text-slate-800">
                        Please pay total amount via GCash before enrollment.
                      </p>
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span class="font-bold text-teal-900">GCash: <span class="font-extrabold">09524400577</span></span>
                        <span class="font-bold text-slate-800">Account Name: <span class="font-extrabold">Jan Art Serna</span></span>
                      </div>
                    </div>
                    <div class="text-left sm:text-right shrink-0 bg-teal-900 text-white px-4 py-2.5 rounded-xl">
                      <span class="text-[9px] font-bold uppercase tracking-wider text-teal-200 block">Total Amount</span>
                      <span id="signup-sub-total-amount" class="text-lg font-extrabold">₱${totalPaymentPhp.toLocaleString()}.00 PHP</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">GCash Reference No. (Optional)</label>
                      <input
                        id="signup-gcash-ref"
                        type="text"
                        placeholder="Enter GCash Reference No."
                        class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label class="block text-[11px] font-bold text-slate-700 mb-1">Upload GCash Receipt Screenshot</label>
                      <input
                        id="signup-gcash-receipt"
                        type="file"
                        accept="image/*"
                        onchange="handleGcashReceiptUpload(event)"
                        class="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white file:text-[11px] file:font-bold cursor-pointer"
                      />
                      <div id="signup-gcash-receipt-preview" class="mt-1.5 ${appState.signupGcashReceiptDataUrl ? 'flex' : 'hidden'} items-center gap-2">
                        <img id="signup-gcash-receipt-img" src="${appState.signupGcashReceiptDataUrl || ''}" alt="GCash Receipt Preview" class="w-9 h-9 object-cover rounded-lg border border-teal-300" />
                        <span id="signup-gcash-receipt-name" class="text-[10px] font-bold text-teal-800 truncate">${escapeHTML(appState.signupGcashReceiptName || 'Receipt attached')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button id="signup-submit-btn" type="submit" class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition cursor-pointer">
                Submit Registration
              </button>
            </form>
          `}
        </div>
      </div>
    `;
  }

  function updateSignupSubscriptionDomSummary(): void {
    const startVal = appState.signupSubStartDate || todayInitStr;
    const endVal = appState.signupSubEndDate || defaultOneMonthEndStr;
    const months = Number(appState.signupSubMonths) || 1;
    const totalPhp = months * 199;

    const startInput = document.getElementById('signup-sub-start') as HTMLInputElement | null;
    if (startInput && startInput.value !== startVal) startInput.value = startVal;
    const endInput = document.getElementById('signup-sub-end') as HTMLInputElement | null;
    if (endInput && endInput.value !== endVal) endInput.value = endVal;
    const monthsSelect = document.getElementById('signup-sub-months') as HTMLSelectElement | null;
    if (monthsSelect && String(monthsSelect.value) !== String(months)) {
      monthsSelect.value = String(months);
    }

    const totalEl = document.getElementById('signup-sub-total-amount');
    if (totalEl) totalEl.textContent = `₱${totalPhp.toLocaleString()}.00 PHP`;
    const submitBtn = document.getElementById('signup-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Submit Registration';
    }
  }

  window.handleSignupSubMonthsChange = (monthsStr: string) => {
    const months = Math.max(1, parseInt(monthsStr, 10) || 1);
    appState.signupSubMonths = months;
    const startVal = (document.getElementById('signup-sub-start') as HTMLInputElement)?.value || appState.signupSubStartDate || todayInitStr;
    appState.signupSubStartDate = startVal;
    appState.signupSubEndDate = addMonthsToDateStr(startVal, months);
    updateSignupSubscriptionDomSummary();
  };

  window.handleSignupSubDateChange = (which: 'start' | 'end', val: string) => {
    if (!val) return;
    if (which === 'start') {
      appState.signupSubStartDate = val;
      const months = Number(appState.signupSubMonths) || 1;
      appState.signupSubEndDate = addMonthsToDateStr(val, months);
    } else {
      appState.signupSubEndDate = val;
      const startVal = (document.getElementById('signup-sub-start') as HTMLInputElement)?.value || appState.signupSubStartDate || todayInitStr;
      appState.signupSubStartDate = startVal;
      appState.signupSubMonths = calculateMonthsBetweenDates(startVal, val);
    }
    updateSignupSubscriptionDomSummary();
  };

  window.setAuthMode = (mode: string) => {
    appState.authMode = mode;
    renderAuthScreen();
  };

  window.setSignupRole = (role: string) => {
    appState.signupRole = role;
    renderAuthScreen();
  };

  window.handleGcashReceiptUpload = (e: Event) => {
    const input = e.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 700;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.78);
        appState.signupGcashReceiptDataUrl = compressedUrl;
        appState.signupGcashReceiptName = file.name;
        const previewWrap = document.getElementById('signup-gcash-receipt-preview');
        const previewImg = document.getElementById('signup-gcash-receipt-img') as HTMLImageElement | null;
        const previewName = document.getElementById('signup-gcash-receipt-name');
        if (previewWrap) {
          previewWrap.classList.remove('hidden');
          previewWrap.classList.add('flex');
        }
        if (previewImg) previewImg.src = compressedUrl;
        if (previewName) previewName.textContent = file.name;
        showToast('GCash receipt screenshot attached.');
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  window.handleClinicianSignIn = async (e: Event) => {
    e.preventDefault();
    const identifier = ((document.getElementById('signin-identifier') as HTMLInputElement)?.value || '').trim().toLowerCase();
    const password = ((document.getElementById('signin-password') as HTMLInputElement)?.value || '').trim();

    // Always re-read latest local accounts & revocation ledgers so offline bans/deletions take effect immediately
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }

    if (isClinicianDeletedLocally(undefined, identifier, identifier)) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showToast('This account has been deleted by the Administrator and can no longer sign in.', 'warning');
      return;
    }

    if (isClinicianBannedLocally(undefined, identifier, identifier)) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showToast('This account has been banned or suspended by the Administrator.', 'warning');
      return;
    }

    if (navigator.onLine) {
      const remoteList = await fetchAllCliniciansFromFirestore();
      if (remoteList && remoteList.length > 0) {
        const pendingSyncMap = getPendingClinicianSyncMap();
        const mergedMap = new Map<string, ClinicianAccount>();
        appState.clinicianAccounts.forEach((acc: ClinicianAccount) => {
          if (acc && !LEGACY_DUMMY_ACCOUNT_IDS.has(acc.id) && !isClinicianDeletedLocally(acc.id, acc.email, acc.username)) {
            mergedMap.set(acc.id, acc);
          }
        });
        remoteList.forEach((rem: ClinicianAccount) => {
          if (rem && !LEGACY_DUMMY_ACCOUNT_IDS.has(rem.id) && !isClinicianDeletedLocally(rem.id, rem.email, rem.username)) {
            const localPending = pendingSyncMap[rem.id];
            const finalAcc: ClinicianAccount = localPending ? { ...rem, ...localPending } : { ...rem };
            if (isClinicianBannedLocally(finalAcc.id, finalAcc.email, finalAcc.username)) {
              finalAcc.approvalStatus = 'banned';
            }
            mergedMap.set(finalAcc.id, finalAcc);
          }
        });
        appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(Array.from(mergedMap.values()));
        saveClinicianAccounts();
      }
    }

    const found = appState.clinicianAccounts.find(
      (a: ClinicianAccount) =>
        (a.username.toLowerCase() === identifier || a.email.toLowerCase() === identifier) &&
        a.passwordHash === password
    );

    if (!found || isClinicianDeletedLocally(found.id, found.email, found.username)) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showToast('Invalid Email/Username or Password, or account has been removed.', 'warning');
      return;
    }

    if (found.approvalStatus === 'banned' || isClinicianBannedLocally(found.id, found.email, found.username)) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showToast('This account has been banned or suspended by the Administrator.', 'warning');
      return;
    }

    if (found.approvalStatus === 'rejected') {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showToast('Your account enrollment was declined by the Administrator.', 'warning');
      return;
    }

    appState.activeClinician = found;
    localStorage.setItem(SESSION_STORAGE_KEY, found.id);
    syncDoctorFromClinician(found);
    loadClinicianWorkspace(found.id);
    updateHeaderDoctorName();

    if (found.approvalStatus === 'pending') {
      renderAuthScreen();
      showToast('Your account is awaiting Admin enrollment approval.', 'warning');
      return;
    }

    if (isClinicianSubscriptionExpired(found)) {
      renderAuthScreen();
      showToast(`Subscription expired on ${found.subscriptionEndDate}. Please renew (₱199/month).`, 'warning');
      return;
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    switchView('home');
    const daysLeft = getSubscriptionDaysRemaining(found);
    showToast(
      daysLeft !== null
        ? `Welcome back, ${found.name}! (${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining on subscription)`
        : `Welcome back, ${found.name}!`
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
    const subStartDate = ((document.getElementById('signup-sub-start') as HTMLInputElement)?.value || appState.signupSubStartDate || todayInitStr).trim();
    const subEndDate = ((document.getElementById('signup-sub-end') as HTMLInputElement)?.value || appState.signupSubEndDate || defaultOneMonthEndStr).trim();
    const subMonths = Math.max(1, Number(appState.signupSubMonths) || calculateMonthsBetweenDates(subStartDate, subEndDate));
    const totalPaymentPhp = subMonths * 199;
    const gcashRef = ((document.getElementById('signup-gcash-ref') as HTMLInputElement)?.value || '').trim();

    if (!name || !username || !email || !phone || !password || !facility) {
      showToast('Please complete all required registration fields.', 'warning');
      return;
    }

    if (isClinicianBannedLocally(undefined, email, username)) {
      showToast('This email or username has been banned by the Administrator.', 'warning');
      return;
    }

    if (subEndDate < subStartDate) {
      showToast('Subscription End Date cannot be earlier than Starting Date.', 'warning');
      return;
    }

    const duplicate = appState.clinicianAccounts.find(
      (a: ClinicianAccount) => a.username.toLowerCase() === username || a.email.toLowerCase() === email
    );
    if (duplicate) {
      showToast('Username or Email Address is already registered. Please sign in.', 'warning');
      return;
    }

    unmarkClinicianDeletedLocally(undefined, email, username);

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
      approvalStatus: 'pending',
      subscriptionStartDate: subStartDate,
      subscriptionEndDate: subEndDate,
      subscriptionMonths: subMonths,
      subscriptionAmountPhp: totalPaymentPhp,
      gcashReference: gcashRef,
      gcashReceiptDataUrl: appState.signupGcashReceiptDataUrl || '',
      createdAt: new Date().toISOString()
    };

    appState.signupGcashReceiptDataUrl = '';
    appState.signupGcashReceiptName = '';
    appState.clinicianAccounts.push(newAccount);
    saveClinicianAccounts();
    syncClinicianToFirestore(newAccount);

    localStorage.setItem(getWorkspaceStorageKey(newAccount.id), JSON.stringify([]));
    localStorage.setItem(getWorkspaceTimestampKey(newAccount.id), new Date().toISOString());
    syncWorkspaceToFirestore(newAccount.id, []);

    appState.activeClinician = newAccount;
    localStorage.setItem(SESSION_STORAGE_KEY, newAccount.id);
    syncDoctorFromClinician(newAccount);
    loadClinicianWorkspace(newAccount.id);
    updateHeaderDoctorName();

    renderAuthScreen();
    showToast(`Registration submitted! Total payment due via GCash: ₱${totalPaymentPhp.toLocaleString()}.00 (${subMonths} mo).`, 'success');
  };

  window.checkPendingDoctorStatus = async () => {
    showToast('Checking Admin approval & subscription status...');
    if (navigator.onLine) {
      const remoteList = await fetchAllCliniciansFromFirestore();
      if (remoteList && appState.activeClinician) {
        const match = remoteList.find((r) => r.id === appState.activeClinician.id);
        if (match) {
          appState.activeClinician = match;
          const idx = appState.clinicianAccounts.findIndex((x: ClinicianAccount) => x.id === match.id);
          if (idx >= 0) appState.clinicianAccounts[idx] = match;
          saveClinicianAccounts();
        }
      }
    } else if (appState.activeClinician) {
      const localMatch = appState.clinicianAccounts.find(
        (x: ClinicianAccount) => x.id === appState.activeClinician.id
      );
      if (localMatch) appState.activeClinician = localMatch;
    }

    if (
      appState.activeClinician &&
      isClinicianDeletedLocally(
        appState.activeClinician.id,
        appState.activeClinician.email,
        appState.activeClinician.username
      )
    ) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      renderAuthScreen();
      showToast('This account was deleted by the Administrator.', 'warning');
      return;
    }

    if (
      appState.activeClinician &&
      (appState.activeClinician.approvalStatus === 'banned' ||
        isClinicianBannedLocally(
          appState.activeClinician.id,
          appState.activeClinician.email,
          appState.activeClinician.username
        ))
    ) {
      appState.activeClinician = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      renderAuthScreen();
      showToast('Account is suspended/banned by Administrator.', 'warning');
      return;
    }

    if (canClinicianAccessApp(appState.activeClinician)) {
      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) bottomNav.style.display = '';
      switchView('home');
      showToast('Your subscription is active! Welcome to your workspace.');
      return;
    }

    renderAuthScreen();
    if (
      appState.activeClinician?.approvalStatus === 'approved' &&
      isClinicianSubscriptionExpired(appState.activeClinician)
    ) {
      showToast('Subscription is still expired/due. Please contact Admin.', 'warning');
    } else {
      showToast('Still awaiting Admin enrollment approval.', 'warning');
    }
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

  // ============================================================================
  // CLINICAL AI SOAP NARRATIVE ENGINE (SYNCS DOCTOR-ENCODED SYMPTOMS & DATA)
  // ============================================================================
  function generateLiveAISoapFromPatient(p: any): any {
    const ccRaw = (p.chiefComplaint || '').trim();
    const hpiRaw = (p.hpi || '').trim();
    const peRaw = (p.peFindings || '').trim();
    const labRaw = (p.labResults || '').trim();
    const comorbRaw = (p.comorbidities || '').trim();
    const combined = `${ccRaw} ${hpiRaw} ${peRaw} ${comorbRaw} ${labRaw}`.toLowerCase();
    const v = p.vitals || {};
    const anc = p.anc || {};

    const ageStr = p.age ? `${p.age}-year-old` : 'Adult';
    const sexStr = (p.sex || 'patient').toLowerCase();
    const civilStr = p.civilStatus ? `${p.civilStatus.toLowerCase()} ` : '';
    const visitNature = p.natureOfVisit || 'New Consultation';
    const pmhNarrative =
      comorbRaw && comorbRaw.toLowerCase() !== 'none reported'
        ? `Past medical history is significant for ${comorbRaw}.`
        : 'No known chronic medical comorbidities reported.';
    const allergyNarrative = p.allergies ? `Allergies: ${p.allergies}.` : 'Allergies: No Known Drug Allergies (NKDA).';
    const famSocialParts: string[] = [];
    if (p.familyHistory && p.familyHistory !== 'None') famSocialParts.push(`Family History: ${p.familyHistory}`);
    if (p.smokingStatus) famSocialParts.push(`Smoking: ${p.smokingStatus}`);
    if (p.alcoholIntake) famSocialParts.push(`Alcohol: ${p.alcoholIntake}`);
    const famSocialNarrative = famSocialParts.length > 0 ? ` ${famSocialParts.join(' | ')}.` : '';

    const vitalsNarrative =
      `Vital Signs: Blood pressure ${v.bp || '120/80'} mmHg, heart rate ${v.hr || '78'} bpm, respiratory rate ${v.rr || '18'} cpm, temperature ${v.temp || '36.7'}°C, SpO2 ${v.spo2 || '98'}%. ` +
      `Anthropometrics: Weight ${v.weight || '-'} kg, Height ${v.height || '-'} cm, BMI ${v.bmi || '-'} kg/m² (${v.bmiCategory || 'Normal'})${v.waistCircumference ? `, Waist Circumference ${v.waistCircumference} cm` : ''}.`;
    const peNarrative = peRaw || 'Conscious, coherent, ambulatory, not in cardiorespiratory distress. Anicteric sclerae, pink palpebral conjunctivae, clear breath sounds, regular cardiac rhythm, soft non-tender abdomen.';
    const labNarrative = labRaw ? ` Pertinent Laboratory/Diagnostic Results: ${labRaw}.` : '';

    if (
      p.patientType === 'antenatal' ||
      combined.includes('prenatal') ||
      combined.includes('antenatal') ||
      combined.includes('pregnant') ||
      combined.includes('aog')
    ) {
      const g = anc.gravida || 1;
      const para = anc.para || 0;
      const t = anc.term || 0;
      const pr = anc.preterm || 0;
      const ab = anc.abortion || 0;
      const l = anc.living || 0;
      const aog = anc.aogWeeks || '2nd Trimester';
      const edc = anc.edc || 'To be determined by Ultrasound';
      const dangerList =
        anc.dangerSigns && anc.dangerSigns.length > 0
          ? anc.dangerSigns.join(', ')
          : 'No maternal danger signs reported (no vaginal bleeding, severe headache, visual blurring, or epigastric pain)';

      return {
        confidence: '98% DOH/POGS Maternal CPG Narrative Match',
        subjectiveSummary:
          `Patient is a ${ageStr} ${civilStr}female, G${g}P${para} (${t}-${pr}-${ab}-${l}), currently at ${aog} Age of Gestation (EDC: ${edc}), presenting for ${visitNature.toLowerCase()} due to ${ccRaw || 'routine antenatal check-up'}. ` +
          `${hpiRaw ? `Clinical History: ${hpiRaw} ` : ''}` +
          `Maternal Danger Signs Screening: ${dangerList}. ${pmhNarrative} ${allergyNarrative}`,
        objectiveSummary:
          `${vitalsNarrative} ` +
          `Obstetric Physical Examination: Fundic height ${anc.fundicHeight || 'appropriate for gestational age'}, fetal heart tone ${anc.fht || '140–150 bpm'}, fetal presentation ${anc.presentation || 'Cephalic'}, fetal movement ${anc.fetalMovement || 'Present / Active'}, maternal edema ${anc.edema || 'None'}. ${peNarrative}${labNarrative}`,
        primaryImpression: `Pregnancy Uterine, ${aog} AOG by LMP, ${anc.presentation || 'Cephalic'}, Live Singleton; G${g}P${para} (${t}-${pr}-${ab}-${l}), ${anc.dangerSigns?.length ? 'High-Risk Pregnancy (With Danger Signs)' : 'Low-Risk Antenatal Care'} (ICD-10: Z34.8)`,
        differentials: [
          'Routine Antenatal Supervision (DOH Safe Motherhood / POGS CPG)',
          'Screen for Gestational Diabetes Mellitus (75g 2-Hr OGTT at 24–28 weeks)',
          'Monitor for Gestational Hypertension / Preeclampsia'
        ],
        suggestedPlan:
          `1. Continue daily maternal micronutrient supplementation: ${anc.ironFolate || 'Ferrous Sulfate 60mg Elemental Iron + Folic Acid 400mcg 1 tab PO OD'} and ${anc.calcium || 'Calcium Carbonate 500mg 1 tab PO TID'}.\n` +
          `2. Ensure Tetanus Diphtheria (${anc.tetanusStatus || 'Td'}) immunization and trimester-appropriate laboratory and obstetric ultrasound workup are completed.\n` +
          `3. Reinforce DOH Mother-Baby Birth & Emergency Plan (Planned Birthing Facility: ${anc.facilityBirthPlan || 'Accredited Birthing Facility'}).\n` +
          `4. Advise daily fetal kick counting (>=10 movements in 12 hours), maternal nutrition counseling, and immediate return if any maternal danger signs occur.`,
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

    // Match doctor-encoded symptoms & clinical data against all 39 Philippine CPGs
    let bestCpg: any = null;
    let bestScore = 0;
    const tokens = combined
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    for (const cpg of PH_CPG_CATALOG) {
      let score = 0;
      const titleLower = (cpg.title || '').toLowerCase();
      if (combined && titleLower.includes(combined.trim()) && combined.trim().length > 3) {
        score += 12;
      }
      for (const kw of cpg.keywords || []) {
        const kwLower = kw.toLowerCase();
        if (combined.includes(kwLower)) {
          score += kwLower.includes(' ') ? 8 : 5;
        }
      }
      for (const tok of tokens) {
        if (titleLower.includes(tok)) score += 3;
      }
      if (score > bestScore) {
        bestScore = score;
        bestCpg = cpg;
      }
    }

    const buildSuggestedMedsForCpg = (cpgItem: any): any[] => {
      const id = (cpgItem?.id || '').toLowerCase();
      if (id.includes('hypertension')) {
        return [
          { genericName: 'Losartan Potassium + Amlodipine Besilate 50mg/5mg Tablet', brandExample: 'Exforge / Co-Amlodin', sig: 'Take 1 tablet orally once daily in the morning', quantity: '#30' },
          { genericName: 'Atorvastatin Calcium 20mg Tablet', brandExample: 'Lipitor / Avamax', sig: 'Take 1 tablet orally once daily at bedtime', quantity: '#30' }
        ];
      }
      if (id.includes('diabetes') || id.includes('dm')) {
        return [
          { genericName: 'Metformin Hydrochloride 500mg Tablet', brandExample: 'Glucophage', sig: 'Take 1 tablet orally twice daily with meals', quantity: '#60' },
          { genericName: 'Dapagliflozin 10mg Tablet', brandExample: 'Forxiga', sig: 'Take 1 tablet orally once daily', quantity: '#30' }
        ];
      }
      if (id.includes('cap') || id.includes('pneumonia') || id.includes('ari')) {
        return [
          { genericName: 'Amoxicillin + Clavulanic Acid 625mg Tablet', brandExample: 'Augmentin', sig: 'Take 1 tablet orally every 8 hours for 7 days', quantity: '#21' },
          { genericName: 'Paracetamol 500mg Tablet', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for fever', quantity: '#15' }
        ];
      }
      if (id.includes('dengue')) {
        return [
          { genericName: 'Oral Rehydration Salts (ORS 75) Sachet', brandExample: 'Hydrite / Pedialyte', sig: 'Dissolve 1 sachet in 200mL water, take fréquently for hydration', quantity: '#10' },
          { genericName: 'Paracetamol 500mg Tablet (Avoid NSAIDs/Aspirin)', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for fever', quantity: '#15' }
        ];
      }
      if (id.includes('tb') || id.includes('tuberculosis')) {
        return [
          { genericName: 'Fixed-Dose Combination 4-FDC (HRZE: 75/150/400/275mg) Tablet', brandExample: 'DOH NTP Regimen 1', sig: 'Take weight-based daily dose orally once daily on an empty stomach', quantity: '#28' },
          { genericName: 'Pyridoxine (Vitamin B6) 25mg Tablet', brandExample: 'B-Complex', sig: 'Take 1 tablet orally once daily to prevent peripheral neuropathy', quantity: '#30' }
        ];
      }
      if (id.includes('asthma') || id.includes('copd')) {
        return [
          { genericName: 'Budesonide + Formoterol 160mcg/4.5mcg Inhaler', brandExample: 'Symbicort Rapihaler', sig: 'Inhale 1–2 puffs twice daily as maintenance and PRN for symptom relief', quantity: '#1 inhaler' }
        ];
      }
      if (id.includes('uti')) {
        return [
          { genericName: 'Nitrofurantoin Macrocrystals 100mg Capsule', brandExample: 'Macrodantin', sig: 'Take 1 capsule orally twice daily for 5 days', quantity: '#10' },
          { genericName: 'Paracetamol 500mg Tablet', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for dysuria/fever', quantity: '#10' }
        ];
      }
      if (id.includes('gout')) {
        return [
          { genericName: 'Colchicine 500mcg Tablet', brandExample: 'Goutnil / Rhea Colchicine', sig: 'Take 2 tablets initially then 1 tablet 1 hour later on Day 1', quantity: '#12' },
          { genericName: 'Febuxostat 40mg Tablet', brandExample: 'Adenuric / Uloric', sig: 'Take 1 tablet orally once daily after acute flare resolves', quantity: '#30' }
        ];
      }
      if (id.includes('gerd') || id.includes('dyspepsia') || id.includes('peptic')) {
        return [
          { genericName: 'Omeprazole 20mg Capsule', brandExample: 'Losec / Omepron', sig: 'Take 1 capsule orally once daily 30 minutes before breakfast for 4–8 weeks', quantity: '#30' },
          { genericName: 'Sodium Alginate + Sodium Bicarbonate + Calcium Carbonate Suspension', brandExample: 'Gaviscon', sig: 'Take 10mL orally after meals and at bedtime PRN', quantity: '#1 bottle' }
        ];
      }
      if (id.includes('diarrhea') || id.includes('age') || id.includes('cholera')) {
        return [
          { genericName: 'Reduced Osmolarity Oral Rehydration Salts (ORS 75)', brandExample: 'Hydrite', sig: 'Give after each loose stool as directed for hydration', quantity: '#10' },
          { genericName: 'Zinc Sulfate 20mg Dispersible Tablet', brandExample: 'E-Zinc', sig: 'Take 1 tablet orally once daily for 10–14 days', quantity: '#14' }
        ];
      }
      if (id.includes('leptospirosis')) {
        return [
          { genericName: 'Doxycycline 100mg Capsule', brandExample: 'Vibramycin', sig: 'Take 1 capsule orally every 12 hours for 7 days after meals', quantity: '#14' },
          { genericName: 'Paracetamol 500mg Tablet', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for fever/myalgia', quantity: '#15' }
        ];
      }
      return [
        { genericName: 'Paracetamol 500mg Tablet', brandExample: 'Biogesic', sig: 'Take 1 tablet orally every 6 hours PRN for fever or pain', quantity: '#12' },
        { genericName: 'Cetirizine Dihydrochloride 10mg Tablet', brandExample: 'Virlix / Alnix', sig: 'Take 1 tablet orally once daily at bedtime PRN', quantity: '#10' }
      ];
    };

    const narrativeSubj =
      `Patient is a ${ageStr} ${civilStr}${sexStr} presenting for a ${visitNature.toLowerCase()} with a chief complaint of ${ccRaw || 'clinical symptoms requiring evaluation'}. ` +
      `${hpiRaw ? `History of Present Illness: ${hpiRaw} ` : 'Patient reports onset of symptoms prompting today’s outpatient consultation. '}` +
      `${pmhNarrative} ${allergyNarrative}${famSocialNarrative}`;

    const narrativeObj = `${vitalsNarrative} Physical Examination: ${peNarrative}${labNarrative}`;

    if (bestCpg && bestScore >= 3) {
      const planLines = (bestCpg.soapPlanSummary || []).map((line: string, i: number) => `${i + 1}. ${line}`);
      if (p.healthEducation) {
        planLines.push(`${planLines.length + 1}. Health Education & Counseling: ${p.healthEducation}`);
      }
      const redFlagsList =
        bestCpg.pathway?.stepC?.redFlags || [
          'Persistent high-grade fever, tachypnea, or SpO2 < 94%',
          'Worsening symptoms despite initial therapy or inability to tolerate oral intake',
          'Altered sensorium, severe pain, or hemodynamic instability'
        ];

      return {
        confidence: `Synced with ${bestCpg.title} (${bestCpg.source || 'PH CPG'})`,
        subjectiveSummary: narrativeSubj,
        objectiveSummary: narrativeObj,
        primaryImpression: `${bestCpg.title} — Clinical Impression Correlated with Encoded Symptoms (${bestCpg.source || 'Philippine CPG'})`,
        differentials: [
          `Primary Guideline Reference: ${bestCpg.title}`,
          ...((bestCpg.scope?.excluded || []).slice(0, 2).map((ex: any) => `Rule out ${ex.label}: ${ex.action}`))
        ],
        suggestedPlan: planLines.join('\n'),
        suggestedMeds: buildSuggestedMedsForCpg(bestCpg),
        redFlags: redFlagsList
      };
    }

    return {
      confidence: 'Synced Narrative SOAP from Encoded Clinical Data',
      subjectiveSummary: narrativeSubj,
      objectiveSummary: narrativeObj,
      primaryImpression: `Clinical Evaluation for: ${ccRaw || 'Outpatient Consultation'} (Correlate with Philippine CPG & Targeted Workup)`,
      differentials: [
        'Primary Acute / Chronic Medical Condition per Encoded History & PE',
        'Consider Infectious, Inflammatory, or Metabolic Etiology',
        'Refer to Philippine CPG Library for specialty-specific staging'
      ],
      suggestedPlan:
        `1. Correlate clinical narrative (${ccRaw || 'presenting symptoms'}) and physical examination with targeted diagnostic workup (CBC, Urinalysis, Blood Chemistry as indicated).\n` +
        `2. Initiate evidence-based pharmacotherapy per DOH National Formulary / Generics Act (RA 6675).\n` +
        `3. Health Education & Counseling: ${p.healthEducation || 'Advise adequate oral hydration, nutrition, medication adherence, and return-to-clinic precautions.'}\n` +
        `4. Schedule follow-up consultation to review laboratory and imaging results.`,
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
    p.aiSoap = generateLiveAISoapFromPatient(p);
    const ai = p.aiSoap;

    return `
      <div class="-mx-5 -mt-5 mb-4 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-5 py-3.5 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div class="px-2.5 py-1 rounded-lg bg-white text-teal-900 flex items-center justify-center font-extrabold text-[10px] uppercase shadow-2xs">AI SOAP</div>
          <div>
            <h3 class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Clinical Narrative SOAP Generator</h3>
            <p class="text-[10px] text-teal-100 font-semibold">${escapeHTML(ai.confidence || 'Live Narrative Sync Active')}</p>
          </div>
        </div>
        ${renderClearFormIconButtonHTML('clearAiSoapForm()', 'Clear AI SOAP & Encoded Symptoms')}
      </div>

      <!-- Live Doctor Symptom & Clinical Data Encoder (Syncs Directly to Narrative SOAP) -->
      <div class="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2.5 mb-3.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-teal-900">Encoded Symptoms &amp; Clinical Data (Live Narrative Sync)</span>
          <button type="button" onclick="syncAiSoapNarrativeNow()" class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-2xs transition cursor-pointer">
            ↻ Sync &amp; Generate Narrative
          </button>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Chief Complaint / Presenting Symptoms</label>
          <input
            id="ai-encoder-cc"
            type="text"
            value="${escapeHTML(p.chiefComplaint || '')}"
            oninput="handleDoctorSymptomSync('chiefComplaint', this.value)"
            placeholder="e.g., 3-day high-grade fever, retro-orbital pain, myalgia (Dengue) or BP 160/100 dizziness"
            class="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Encoded HPI / Symptom Details &amp; Duration</label>
          <textarea
            id="ai-encoder-hpi"
            rows="2"
            oninput="handleDoctorSymptomSync('hpi', this.value)"
            placeholder="Encode symptom onset, progression, associated signs, prior meds..."
            class="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500"
          >${escapeHTML(p.hpi || '')}</textarea>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-700 uppercase mb-0.5">Pertinent Physical Exam / Lab Findings</label>
          <input
            id="ai-encoder-pe"
            type="text"
            value="${escapeHTML(p.peFindings || '')}"
            oninput="handleDoctorSymptomSync('peFindings', this.value)"
            placeholder="Encode pertinent physical exam findings..."
            class="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div class="space-y-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">S — Generated Narrative Subjective</span>
          <p id="ai-narrative-subj" class="text-slate-800 leading-relaxed">${escapeHTML(ai.subjectiveSummary)}</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">O — Generated Narrative Objective</span>
          <p id="ai-narrative-obj" class="text-slate-800 text-[11px] leading-relaxed">${escapeHTML(ai.objectiveSummary)}</p>
        </div>

        <div class="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-teal-800">A — Generated Clinical Impression</span>
            <button onclick="adoptAiAssessment()" class="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">Use in Note →</button>
          </div>
          <p id="ai-narrative-assess" class="font-bold text-slate-900 text-xs">${escapeHTML(ai.primaryImpression)}</p>
          <div class="mt-2 pt-2 border-t border-teal-200/60">
            <span class="text-[10px] font-semibold text-teal-800 uppercase">Differentials / Considerations:</span>
            <ul id="ai-narrative-diffs" class="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
              ${(ai.differentials || []).map((d: string) => `<li>${escapeHTML(d)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-800">P — Generated Narrative Management Plan</span>
            <button onclick="adoptAiPlan()" class="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">Append to Plan →</button>
          </div>
          <p id="ai-narrative-plan" class="text-slate-800 whitespace-pre-line leading-relaxed text-[11px]">${escapeHTML(ai.suggestedPlan)}</p>
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
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-800 block mb-1">Clinical Red Flags &amp; Precautions</span>
          <ul class="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
            ${(ai.redFlags || []).map((rf: string) => `<li>${escapeHTML(rf)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  window.handleDoctorSymptomSync = (field: 'chiefComplaint' | 'hpi' | 'peFindings', val: string) => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    p[field] = val;
    p.aiSoap = generateLiveAISoapFromPatient(p);
    if (appState.aiSoapEnabled !== false) {
      if (!p.doctorSoap) {
        p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
      }
      p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
      p.doctorSoap.objective = p.aiSoap.objectiveSummary;
      p.doctorSoap.assessment = p.aiSoap.primaryImpression;
      p.doctorSoap.plan = p.aiSoap.suggestedPlan;
      if (!Array.isArray(p.doctorSoap.medications) || p.doctorSoap.medications.length === 0) {
        p.doctorSoap.medications = JSON.parse(JSON.stringify(p.aiSoap.suggestedMeds || []));
      }

      // Live DOM sync without losing cursor focus in the encoder input
      const subjNarrativeEl = document.getElementById('ai-narrative-subj');
      if (subjNarrativeEl) subjNarrativeEl.textContent = p.aiSoap.subjectiveSummary;
      const objNarrativeEl = document.getElementById('ai-narrative-obj');
      if (objNarrativeEl) objNarrativeEl.textContent = p.aiSoap.objectiveSummary;
      const assessNarrativeEl = document.getElementById('ai-narrative-assess');
      if (assessNarrativeEl) assessNarrativeEl.textContent = p.aiSoap.primaryImpression;
      const planNarrativeEl = document.getElementById('ai-narrative-plan');
      if (planNarrativeEl) planNarrativeEl.textContent = p.aiSoap.suggestedPlan;

      const rightSubj = document.querySelector('textarea[oninput*="\'subjective\'"]') as HTMLTextAreaElement | null;
      if (rightSubj) rightSubj.value = p.doctorSoap.subjective;
      const rightObj = document.querySelector('textarea[oninput*="\'objective\'"]') as HTMLTextAreaElement | null;
      if (rightObj) rightObj.value = p.doctorSoap.objective;
      const rightAssess = document.getElementById('doctor-soap-assessment') as HTMLTextAreaElement | null;
      if (rightAssess) rightAssess.value = p.doctorSoap.assessment;
      const rightPlan = document.getElementById('doctor-soap-plan') as HTMLTextAreaElement | null;
      if (rightPlan) rightPlan.value = p.doctorSoap.plan;

      const a4Preview = document.getElementById('soap-printable-a4');
      if (a4Preview) {
        a4Preview.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'CONS');
      }
    }
    saveState();
  };

  window.syncAiSoapNarrativeNow = () => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    p.aiSoap = generateLiveAISoapFromPatient(p);
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
    p.doctorSoap.objective = p.aiSoap.objectiveSummary;
    p.doctorSoap.assessment = p.aiSoap.primaryImpression;
    p.doctorSoap.plan = p.aiSoap.suggestedPlan;
    if (!Array.isArray(p.doctorSoap.medications) || p.doctorSoap.medications.length === 0) {
      p.doctorSoap.medications = JSON.parse(JSON.stringify(p.aiSoap.suggestedMeds || []));
    }
    saveState();
    renderSoapWorkspace();
    showToast('Synced encoded symptoms & generated Narrative SOAP!');
  };

  window.toggleAiSoapAssistance = () => {
    appState.aiSoapEnabled = !appState.aiSoapEnabled;
    localStorage.setItem(AI_SOAP_STORAGE_KEY, String(appState.aiSoapEnabled));
    const p = getActiveOpdPatient() || getActivePatient();
    if (appState.aiSoapEnabled && p) {
      p.aiSoap = generateLiveAISoapFromPatient(p);
      if (!p.doctorSoap) {
        p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
      }
      p.doctorSoap.subjective = p.aiSoap.subjectiveSummary;
      p.doctorSoap.objective = p.aiSoap.objectiveSummary;
      p.doctorSoap.assessment = p.aiSoap.primaryImpression;
      p.doctorSoap.plan = p.aiSoap.suggestedPlan;
      if (!Array.isArray(p.doctorSoap.medications) || p.doctorSoap.medications.length === 0) {
        p.doctorSoap.medications = JSON.parse(JSON.stringify(p.aiSoap.suggestedMeds || []));
      }
      saveState();
    }
    if (appState.currentView === 'soap') {
      renderSoapWorkspace();
    } else if (appState.currentView === 'home') {
      renderHome();
    }
    showToast(
      appState.aiSoapEnabled
        ? 'AI SOAP Activated — Synced encoded symptoms & generated narrative SOAP!'
        : 'AI SOAP Deactivated — Using Offline Philippine CPG Mode'
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

  window.handleConsultationDateChange = (newDate: string) => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient() || getActivePatient();
    if (!p || !newDate) return;
    p.consultationDate = newDate;
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.consultationDate = newDate;
    saveState();
    const soapPreview = document.getElementById('soap-printable-a4');
    if (soapPreview) {
      soapPreview.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'CONS');
    }
    const ancPreviewEl = document.getElementById('anc-printable-a4');
    if (ancPreviewEl) {
      ancPreviewEl.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'ANC');
    }
    showToast(`Consultation date set to ${newDate}`);
  };

  window.handleNatureOfVisitChange = (newNature: string) => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient() || getActivePatient();
    if (!p || !newNature) return;
    p.natureOfVisit = newNature;
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.natureOfVisit = newNature;
    saveState();
  };

  window.savePatientConsultationSnapshot = () => {
    const p = getActivePatient();
    if (!p) return;
    if (!Array.isArray(p.consultationHistory)) p.consultationHistory = [];
    const today = p.consultationDate || new Date().toISOString().split('T')[0];
    if (p.doctorSoap) {
      p.doctorSoap.consultationDate = today;
      p.doctorSoap.natureOfVisit = p.natureOfVisit || 'New Consultation';
    }
    const snapshotEntry = {
      date: today,
      type: p.natureOfVisit || (p.patientType === 'antenatal' ? 'Antenatal Visit' : 'Outpatient Consultation'),
      chiefComplaint: p.chiefComplaint || 'Consultation',
      vitalsSummary: `BP ${p.vitals?.bp || '-'}, HR ${p.vitals?.hr || '-'}, Temp ${p.vitals?.temp || '-'}°C, Wt ${p.vitals?.weight || '-'}kg`,
      assessment: p.doctorSoap?.assessment || p.chiefComplaint || 'Pending Assessment',
      planSummary: p.doctorSoap?.plan || '',
      medsSummary: (p.doctorSoap?.medications || []).map((m: any) => `${m.genericName} (${m.sig})`).join('; ') || 'None',
      doctorSoap: JSON.parse(JSON.stringify(p.doctorSoap || {})),
      diagnostics: JSON.parse(JSON.stringify(p.diagnostics || { labs: [], imaging: [], clinicalImpression: '', notes: '' })),
      vitals: JSON.parse(JSON.stringify(p.vitals || {})),
      anc: JSON.parse(JSON.stringify(p.anc || {}))
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
        ? `Saved ${p.name}'s record (${today}) to offline storage & cloud`
        : `Saved ${p.name}'s record (${today}) offline (will auto-sync when online)`
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
    if (printEl) {
      printEl.innerHTML = formatOfficialParagraphsHTML(
        p.doctorSoap.assessment,
        'No diagnosis recorded.',
        'text-xs font-extrabold text-slate-900'
      );
    }
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
    if (printEl) {
      printEl.innerHTML = formatOfficialParagraphsHTML(
        p.doctorSoap.plan,
        'No non-pharmacologic plan recorded.',
        'text-xs text-slate-800'
      );
    }
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
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
    if (!p) return;
    if (!p.doctorSoap) p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    p.doctorSoap[field] = value;
    saveState();
    const printEl = document.getElementById(`print-soap-${field}`);
    if (printEl) {
      if (field === 'followUpDate') {
        printEl.textContent = value;
      } else {
        const extraCls = field === 'assessment' ? 'text-xs font-extrabold text-slate-900' : 'text-xs text-slate-800';
        printEl.innerHTML = formatOfficialParagraphsHTML(value, '—', extraCls);
      }
    }
    const ancPreviewEl = document.getElementById('anc-printable-a4');
    if (ancPreviewEl && appState.currentView === 'anc') {
      ancPreviewEl.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'ANC');
    }
  };

  window.addBlankDoctorMed = () => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
    if (!p) return;
    if (!p.doctorSoap) p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    if (!Array.isArray(p.doctorSoap.medications)) p.doctorSoap.medications = [];
    p.doctorSoap.medications.push({
      genericName: '',
      brandExample: '',
      sig: 'Take 1 tablet orally once daily',
      quantity: '#30'
    });
    saveState();
    if (appState.currentView === 'anc') renderAntenatalCare();
    else if (appState.currentView === 'rx') renderPrescriptionWorkspace();
    else renderSoapWorkspace();
  };

  window.updateDoctorMed = (idx: number, key: string, value: string) => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
    if (!p || !p.doctorSoap?.medications?.[idx]) return;
    p.doctorSoap.medications[idx][key] = value;
    saveState();
    const soapPreview = document.getElementById('soap-printable-a4');
    if (soapPreview) {
      soapPreview.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'CONS');
    }
    const ancPreviewEl = document.getElementById('anc-printable-a4');
    if (ancPreviewEl) {
      ancPreviewEl.innerHTML = buildA4SoapRecordSheetHTML(appState.doctor, p, 'ANC');
    }
    const meds = p.doctorSoap?.medications || [];
    const mode = appState.rxPrintMode || 'single-a6';
    const rxHtml =
      mode === 'dual-a6'
        ? `
          <div class="paper-dual-a6-half paper-dual-a6-divider">
            <div class="text-[8px] font-bold uppercase tracking-widest text-teal-700 mb-1">Patient Copy</div>
            ${buildSingleA6RxPadHTML(appState.doctor, p, meds)}
          </div>
          <div class="paper-dual-a6-half">
            <div class="text-[8px] font-bold uppercase tracking-widest text-slate-700 mb-1">Pharmacy / Clinic Copy</div>
            ${buildSingleA6RxPadHTML(appState.doctor, p, meds)}
          </div>
        `
        : buildSingleA6RxPadHTML(appState.doctor, p, meds);

    const rxPreview = document.getElementById('rx-printable-sheet');
    if (rxPreview) rxPreview.innerHTML = rxHtml;
    const ancRxPreview = document.getElementById('anc-rx-printable-sheet');
    if (ancRxPreview) ancRxPreview.innerHTML = rxHtml;
  };

  window.removeDoctorMed = (idx: number) => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
    if (!p || !Array.isArray(p.doctorSoap?.medications)) return;
    p.doctorSoap.medications.splice(idx, 1);
    saveState();
    if (appState.currentView === 'anc') renderAntenatalCare();
    else if (appState.currentView === 'rx') renderPrescriptionWorkspace();
    else renderSoapWorkspace();
    showToast('Removed medication from list');
  };

  // ============================================================================
  // VIEW ROUTING
  // ============================================================================
  function switchView(viewName: string): void {
    if (isHiddenAdminPortalRoute()) {
      renderHiddenAdminPortal();
      return;
    }
    if (!enforceActiveSessionValidity() || !canClinicianAccessApp(appState.activeClinician)) {
      renderAuthScreen();
      return;
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.style.display = '';
    updateHeaderDoctorName();

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
    else if (viewName === 'bakunxt') renderBakuNxtWorkspace();
    else if (viewName === 'optplus') renderOptPlusWorkspace();
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

        <!-- 7 Primary Workflow Cards: Antenatal Care, BakuNxt & OPTPlus Together, with Patient Records & CPGs Last -->
        <div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <button onclick="startNewPatientRegistration('regular')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">New Patient Registration</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Start Intake</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="openReturningPatientModal()" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">Returning Patient</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Select Returning</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('anc')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">Antenatal Care (ANC)</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open ANC Module</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('bakunxt')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">BakuNxt (Immunization Program)</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open EPI Module</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('optplus')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">OPTPlus (Nutrition Program)</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open OPT+ Module</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('records')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">Patient Records</h4>
              </div>
              <div class="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700">
                <span>Open Registry</span>
                <span>→</span>
              </div>
            </button>

            <button onclick="switchView('cpg')" class="group text-center bg-white hover:bg-teal-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between cursor-pointer">
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 class="text-sm font-bold text-slate-900">Philippine CPGs</h4>
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
                            <td class="py-3.5 px-4">${p.patientType === 'antenatal' ? 'Antenatal / OB' : 'General OPD'}</td>
                            <td class="py-3.5 px-4 text-slate-700 max-w-xs truncate">${escapeHTML(p.doctorSoap?.assessment || p.chiefComplaint)}</td>
                            <td class="py-3.5 px-5 text-right">
                              <button onclick="openPatientWorkspace('${escapeHTML(p.id)}', '${p.patientType === 'antenatal' ? 'anc' : 'soap'}')" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer">Open Chart</button>
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

  window.startNewPatientRegistration = (defaultType?: string) => {
    appState.pendingAttachments = [];
    appState.registrationDefaultType = defaultType === 'antenatal' ? 'antenatal' : 'regular';
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
    appState.registrationDefaultType = type;
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

  window.handleRegSexChange = (sexVal: string) => {
    const obBlock = document.getElementById('reg-obgyn-history-block');
    if (obBlock) {
      obBlock.style.display = sexVal === 'Female' ? 'block' : 'none';
    }
  };

  function renderRegistration(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    const initType = appState.registrationDefaultType === 'antenatal' ? 'antenatal' : 'regular';

    main.innerHTML = `
      <div class="space-y-6">
        <!-- Uniform Teal Banner Title -->
        <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-md border border-teal-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h2 class="medflow-title text-xl sm:text-2xl font-extrabold tracking-wide">New Patient Registration</h2>
          </div>
          <button onclick="switchView('home')" class="self-start sm:self-auto px-4 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition cursor-pointer">
            ← Back to Home
          </button>
        </div>

        <div class="w-full">
        <form onsubmit="handleSaveRegistration(event)" class="space-y-6">
          <!-- Pathway Selector Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <input type="hidden" id="reg-patient-type" value="${initType}">
            <div class="flex flex-col sm:flex-row gap-3">
              <button type="button" id="btn-type-regular" onclick="toggleRegPatientType('regular')" class="${initType === 'regular' ? 'flex-1 py-3 px-4 rounded-xl border-2 border-teal-600 bg-teal-50/70 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer' : 'flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer'}">
                <span>General Outpatient</span>
              </button>
              <button type="button" id="btn-type-antenatal" onclick="toggleRegPatientType('antenatal')" class="${initType === 'antenatal' ? 'flex-1 py-3 px-4 rounded-xl border-2 border-teal-600 bg-teal-50/70 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer' : 'flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer'}">
                <span>Antenatal and Maternal Care</span>
              </button>
            </div>
          </div>

          <!-- SECTION I: PATIENT DEMOGRAPHICS & IDENTIFICATION -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">1</span>
                <h3 class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">
                  Patient Demographics &amp; Identification
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">DOH ITR Standard</span>
                ${renderClearFormIconButtonHTML('clearPatientRegistrationForm()', 'Clear Registration Form')}
              </div>
            </div>

            <div class="p-6 space-y-4">
              <!-- Identifiers: Family Serial No., Household No., PhilHealth PIN -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-teal-50/50 border border-teal-200">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Family Serial Number</label>
                  <input id="reg-family-serial" type="text" placeholder="e.g., FSN-2026-00142" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Household Number</label>
                  <input id="reg-household-no" type="text" placeholder="e.g., HH-0482" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">PhilHealth Identification No. (PIN)</label>
                  <input id="reg-philhealth" type="text" placeholder="XX-XXXXXXXXX-X" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold">
                </div>
              </div>

              <!-- Personal Details & Mother's Maiden Name -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name (Last, First, Middle) <span class="text-teal-700">*</span></label>
                  <input id="reg-name" type="text" required placeholder="Enter patient's full name" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input id="reg-dob" type="date" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Age <span class="text-teal-700">*</span></label>
                    <input id="reg-age" type="number" required min="0" max="120" placeholder="Age" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Sex <span class="text-teal-700">*</span></label>
                    <select id="reg-sex" onchange="handleRegSexChange(this.value)" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="Male" ${initType === 'regular' ? 'selected' : ''}>Male</option>
                      <option value="Female" ${initType === 'antenatal' ? 'selected' : ''}>Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Civil Status</label>
                  <select id="reg-civil" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Common-Law / Live-In">Common-Law / Live-In</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                  <input id="reg-occupation" type="text" placeholder="e.g., Teacher, Farmer, Self-Employed" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Educational Attainment</label>
                  <select id="reg-education" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="College / Postgraduate">College / Postgraduate</option>
                    <option value="High School / Senior High">High School / Senior High</option>
                    <option value="Vocational / Technical">Vocational / Technical</option>
                    <option value="Elementary">Elementary</option>
                    <option value="No Formal Schooling">No Formal Schooling</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Contact / Mobile Number</label>
                  <input id="reg-contact" type="text" placeholder="09XX-XXX-XXXX" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Zone / Purok / Street</label>
                  <input id="reg-zone-purok" type="text" placeholder="e.g., Purok 3, Zone 2" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Barangay</label>
                  <input id="reg-barangay" type="text" placeholder="e.g., Brgy. San Isidro" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">City / Municipality &amp; Province</label>
                  <input id="reg-address" type="text" placeholder="e.g., Quezon City, Metro Manila" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Mother's Maiden Name</label>
                  <input id="reg-mothers-maiden" type="text" placeholder="First, Middle, Maiden Surname" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION II: MEDICAL, FAMILY, SOCIAL & OB-GYN HISTORY -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">2</span>
                <h3 class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">
                  Medical, Family, Social &amp; OB-GYN History
                </h3>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">Clinical History Baseline</span>
            </div>

            <div class="p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Known Allergies (Drugs / Food)</label>
                  <input id="reg-allergies" type="text" value="No Known Drug Allergies (NKDA)" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Chronic Conditions / Comorbidities</label>
                  <input id="reg-comorbidities" type="text" placeholder="e.g., Hypertension, Diabetes, Asthma, TB" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Previous Surgeries</label>
                  <input id="reg-surgeries" type="text" placeholder="e.g., Appendectomy (2019) or None" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Previous Hospitalizations</label>
                  <input id="reg-hospitalizations" type="text" placeholder="e.g., Dengue (2022) or None" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Family History (Hereditary Illnesses)</label>
                  <input id="reg-family-history" type="text" placeholder="e.g., Hypertension, Diabetes Mellitus, Cancer, Goiter" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Smoking Status</label>
                  <select id="reg-smoking" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Non-Smoker">Non-Smoker</option>
                    <option value="Current Smoker">Current Smoker</option>
                    <option value="Former Smoker">Former Smoker</option>
                    <option value="Secondhand Smoke Exposure">Secondhand Smoke Exposure</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Alcohol Intake</label>
                  <select id="reg-alcohol" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Non-Drinker">Non-Drinker</option>
                    <option value="Occasional / Social Drinker">Occasional / Social Drinker</option>
                    <option value="Regular Alcohol Intake">Regular Alcohol Intake</option>
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Physical Activity</label>
                  <select id="reg-activity" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Adequate (≥150 mins/week moderate activity)">Adequate (≥150 mins/week moderate activity)</option>
                    <option value="Light / Occasional Physical Activity">Light / Occasional Physical Activity</option>
                    <option value="Sedentary Lifestyle">Sedentary Lifestyle</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Person with Disability (PWD) Status</label>
                  <select id="reg-pwd" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                    <option value="Non-PWD">Non-PWD</option>
                    <option value="Registered PWD (Physical / Orthopedic)">Registered PWD (Physical / Orthopedic)</option>
                    <option value="Registered PWD (Visual / Hearing / Speech)">Registered PWD (Visual / Hearing / Speech)</option>
                    <option value="Registered PWD (Psychosocial / Chronic Illness)">Registered PWD (Psychosocial / Chronic Illness)</option>
                  </select>
                </div>
              </div>

              <!-- OB-GYN History (For Female Patients) -->
              <div id="reg-obgyn-history-block" style="display: ${initType === 'antenatal' ? 'block' : 'none'};" class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 block">OB-GYN History (For Female Patients)</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Gravida / Para (OB Score)</label>
                    <input id="reg-ob-score" type="text" placeholder="e.g., G2P1 (1-0-0-1)" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Menarche (Age at First Menses)</label>
                    <input id="reg-menarche" type="text" placeholder="e.g., 12 years old" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Menstrual Cycle Regularity</label>
                    <select id="reg-menstrual-regularity" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                      <option value="Regular (28–30 days)">Regular (28–30 days)</option>
                      <option value="Irregular Cycle">Irregular Cycle</option>
                      <option value="Amenorrhea / Pregnant">Amenorrhea / Pregnant</option>
                      <option value="Post-Menopausal">Post-Menopausal</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Family Planning Method Used</label>
                    <input id="reg-fp-method" type="text" placeholder="e.g., None, OCP, IUD, DMPA, Implant" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION III: VITAL SIGNS AND ANTHROPOMETRIC -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-white text-teal-900 font-extrabold text-xs flex items-center justify-center shadow-2xs">3</span>
                <span class="medflow-title text-sm sm:text-[15px] font-extrabold uppercase tracking-wide text-white">Vital Signs and Anthropometric</span>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-teal-100">Auto-BMI Computation</span>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">BP (mmHg)</label>
                  <input id="reg-bp" type="text" placeholder="120/80" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">HR (bpm)</label>
                  <input id="reg-hr" type="text" placeholder="78" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">RR (cpm)</label>
                  <input id="reg-rr" type="text" placeholder="18" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Temp (°C)</label>
                  <input id="reg-temp" type="text" placeholder="36.8" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">SpO2 (%)</label>
                  <input id="reg-spo2" type="text" placeholder="98" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Weight (kg)</label>
                  <input id="reg-weight" type="number" step="0.1" oninput="updateRegBMI()" placeholder="65" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Height (cm)</label>
                  <input id="reg-height" type="number" step="0.1" oninput="updateRegBMI()" placeholder="162" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-teal-700 mb-1">BMI (kg/m²)</label>
                  <input id="reg-bmi" type="text" readonly placeholder="Auto" class="w-full px-2.5 py-2 rounded-xl border border-teal-300 bg-teal-50/60 text-teal-900 font-bold text-xs">
                  <span id="reg-bmi-cat" class="block text-[9px] text-teal-700 font-medium mt-0.5 truncate">Enter Wt &amp; Ht</span>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">Waist (cm)</label>
                  <input id="reg-waist" type="number" step="0.1" placeholder="80" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs">
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-end gap-3">
            <button type="button" onclick="switchView('home')" class="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              Save Patient &amp; Proceed →
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
    const waist = (document.getElementById('reg-waist') as HTMLInputElement)?.value || '';
    const bmiObj = calculateBMIValue(w, h);
    const newId = `PT-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayDateStr = new Date().toISOString().split('T')[0];

    const zonePurok = ((document.getElementById('reg-zone-purok') as HTMLInputElement)?.value || '').trim();
    const barangay = ((document.getElementById('reg-barangay') as HTMLInputElement)?.value || '').trim();
    const cityMunicipality = ((document.getElementById('reg-address') as HTMLInputElement)?.value || '').trim();
    const fullAddress = [zonePurok, barangay, cityMunicipality].filter(Boolean).join(', ');

    const newPatient: any = {
      id: newId,
      patientType: pType,
      familySerialNo: ((document.getElementById('reg-family-serial') as HTMLInputElement)?.value || '').trim(),
      householdNo: ((document.getElementById('reg-household-no') as HTMLInputElement)?.value || '').trim(),
      philhealth: ((document.getElementById('reg-philhealth') as HTMLInputElement)?.value || '').trim(),
      name: (document.getElementById('reg-name') as HTMLInputElement).value.trim(),
      age: (document.getElementById('reg-age') as HTMLInputElement).value.trim(),
      sex: (document.getElementById('reg-sex') as HTMLSelectElement).value,
      dob: (document.getElementById('reg-dob') as HTMLInputElement).value,
      civilStatus: (document.getElementById('reg-civil') as HTMLSelectElement).value,
      occupation: ((document.getElementById('reg-occupation') as HTMLInputElement)?.value || '').trim(),
      educationalAttainment: ((document.getElementById('reg-education') as HTMLSelectElement)?.value || '').trim(),
      contact: (document.getElementById('reg-contact') as HTMLInputElement).value.trim(),
      zonePurok,
      barangay,
      address: fullAddress || cityMunicipality,
      mothersMaidenName: ((document.getElementById('reg-mothers-maiden') as HTMLInputElement)?.value || '').trim(),
      consultationDate: todayDateStr,
      natureOfVisit: 'New Consultation',
      allergies: (document.getElementById('reg-allergies') as HTMLInputElement).value.trim() || 'No Known Drug Allergies (NKDA)',
      comorbidities: (document.getElementById('reg-comorbidities') as HTMLInputElement).value.trim() || 'None reported',
      previousSurgeries: ((document.getElementById('reg-surgeries') as HTMLInputElement)?.value || '').trim() || 'None',
      previousHospitalizations: ((document.getElementById('reg-hospitalizations') as HTMLInputElement)?.value || '').trim() || 'None',
      familyHistory: ((document.getElementById('reg-family-history') as HTMLInputElement)?.value || '').trim() || 'None reported',
      smokingStatus: ((document.getElementById('reg-smoking') as HTMLSelectElement)?.value || 'Non-Smoker').trim(),
      alcoholIntake: ((document.getElementById('reg-alcohol') as HTMLSelectElement)?.value || 'Non-Drinker').trim(),
      physicalActivity: ((document.getElementById('reg-activity') as HTMLSelectElement)?.value || 'Adequate').trim(),
      pwdStatus: ((document.getElementById('reg-pwd') as HTMLSelectElement)?.value || 'Non-PWD').trim(),
      obScore: ((document.getElementById('reg-ob-score') as HTMLInputElement)?.value || '').trim(),
      menarche: ((document.getElementById('reg-menarche') as HTMLInputElement)?.value || '').trim(),
      menstrualRegularity: ((document.getElementById('reg-menstrual-regularity') as HTMLSelectElement)?.value || '').trim(),
      familyPlanningMethod: ((document.getElementById('reg-fp-method') as HTMLInputElement)?.value || '').trim(),
      vitals: {
        bp: (document.getElementById('reg-bp') as HTMLInputElement).value.trim() || '120/80',
        hr: (document.getElementById('reg-hr') as HTMLInputElement).value.trim() || '78',
        rr: (document.getElementById('reg-rr') as HTMLInputElement).value.trim() || '18',
        temp: (document.getElementById('reg-temp') as HTMLInputElement).value.trim() || '36.7',
        spo2: (document.getElementById('reg-spo2') as HTMLInputElement).value.trim() || '98',
        weight: w,
        height: h,
        bmi: bmiObj.bmi,
        bmiCategory: bmiObj.category,
        waistCircumference: waist
      },
      chiefComplaint: pType === 'antenatal' ? 'Prenatal Consultation' : '',
      hpi: '',
      peFindings: 'Conscious, coherent, not in cardiorespiratory distress. Anicteric sclerae, pink palpebral conjunctivae. Clear breath sounds, normal cardiac rate and regular rhythm. Abdomen soft, non-tender.',
      labResults: '',
      healthEducation: '',
      referralNotes: '',
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
              otherVaccine: 'None',
              facilityBirthPlan: '', philhealthStatus: 'Active Member',
              emergencyTransport: '', bloodDonorName: '', companionName: '', obNotes: ''
            }
          : {},
      aiSoap: null,
      doctorSoap: {
        consultationDate: todayDateStr,
        natureOfVisit: 'New Consultation',
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

    if (pType === 'antenatal') {
      newPatient.doctorSoap.assessment = newPatient.aiSoap.primaryImpression;
      newPatient.doctorSoap.plan = newPatient.aiSoap.suggestedPlan;
      newPatient.doctorSoap.medications = buildAntenatalMedsFromDropdowns(newPatient.anc);
      newPatient.diagnostics.clinicalImpression = newPatient.aiSoap.primaryImpression;
    } else if (appState.aiSoapEnabled !== false) {
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
        date: newPatient.consultationDate || todayDateStr,
        type: newPatient.natureOfVisit || (pType === 'antenatal' ? 'Antenatal Visit' : 'New Consultation'),
        chiefComplaint: newPatient.chiefComplaint || 'Consultation',
        vitalsSummary: `BP ${newPatient.vitals.bp}, HR ${newPatient.vitals.hr}, Temp ${newPatient.vitals.temp}°C, Wt ${newPatient.vitals.weight || '-'}kg`,
        assessment: newPatient.doctorSoap.assessment || 'Clinical Evaluation in Progress',
        planSummary: newPatient.doctorSoap.plan || '',
        medsSummary:
          (newPatient.doctorSoap.medications || []).map((m: any) => `${m.genericName} (${m.sig})`).join('; ') || 'None',
        doctorSoap: JSON.parse(JSON.stringify(newPatient.doctorSoap)),
        diagnostics: JSON.parse(JSON.stringify(newPatient.diagnostics)),
        vitals: JSON.parse(JSON.stringify(newPatient.vitals)),
        anc: JSON.parse(JSON.stringify(newPatient.anc || {}))
      }
    ];

    appState.patients.unshift(newPatient);
    appState.activePatientId = newPatient.id;
    saveState();

    if (pType === 'antenatal') {
      appState.ancActiveTab = 'ob-dating';
      showToast(`Registered ${newPatient.name} — Opening Antenatal Care`);
      switchView('anc');
    } else {
      showToast(`Registered ${newPatient.name} — Proceeding to SOAP Consultation`);
      switchView('soap');
    }
  };

  // ============================================================================
  // ANTENATAL CARE (5-STEP ALL-IN-ONE PATHWAY) & GENERAL OPD HANDLERS
  // ============================================================================
  function renderAntenatalCare(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildAntenatalCareHTML(appState, getActiveAncPatient());
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
    if (!Array.isArray(p.doctorSoap.medications) || p.doctorSoap.medications.length === 0) {
      p.doctorSoap.medications = buildAntenatalMedsFromDropdowns(p.anc);
    }
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
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc[key] = value;
    syncAncPatientOwnSoap(p);
    saveState();
  };

  // Step 3 Dropdown: Choosing a Trimester Screening Package directly populates and generates the Lab & Imaging Request Sheet inside Step 3
  window.selectAncTrimesterPackage = (trimesterCode: string) => {
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc.trimester = trimesterCode;
    appState.ancScreeningFilter = trimesterCode;

    const bundle = resolveAncTrimesterBundle(trimesterCode);
    if (!p.diagnostics) p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', priority: 'Routine', notes: '' };
    p.diagnostics.labs = [...(bundle.labs || [])];
    p.diagnostics.imaging = [...(bundle.imaging || [])];
    if (!p.diagnostics.clinicalImpression) {
      p.diagnostics.clinicalImpression = p.doctorSoap?.assessment || `Pregnancy Uterine (${trimesterCode} Trimester Screening)`;
    }

    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
    showToast(`Generated ${bundle.key} Lab & Imaging Request directly for ${p.name}`);
  };

  // Step 4 Dropdown: Choosing a Medication / Vaccine option in the dropdown directly generates the Maternal Prescription (Rx) inside Step 4
  window.updateAncMedicationDropdown = (field: string, value: string) => {
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc[field] = value;
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.medications = buildAntenatalMedsFromDropdowns(p.anc);
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
    showToast('Updated Maternal Prescription (Rx Pad) from selected regimen');
  };

  // Step 5 Final Action: Save Antenatal Patient's Record and complete the Antenatal consultation
  window.completeAndSaveAntenatalRecord = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    syncAncPatientOwnSoap(p);
    window.savePatientConsultationSnapshot();
    appState.recordsActiveTab = 'antenatal';
    appState.registryOpenFolderPatientId = p.id;
    switchView('records');
    showToast(`Saved ${p.name}'s complete Antenatal Record (SOAP, Lab Request, Rx & Rekord ni Nanay) to Patient Records Registry!`);
  };

  // General OPD Sequential Progression Handlers
  window.saveSoapAndProceedToRx = () => {
    const p = getActiveOpdPatient();
    if (!p) return;
    window.savePatientConsultationSnapshot();
    switchView('rx');
    showToast(`SOAP saved — Proceeding to Step 3: Medical Prescription (Rx)`);
  };

  window.saveRxAndProceedToDiagnostics = () => {
    const p = getActiveOpdPatient();
    if (!p) return;
    window.savePatientConsultationSnapshot();
    switchView('diagnostics');
    showToast(`Prescription saved — Proceeding to Step 4: Laboratory & Imaging`);
  };

  window.completeAndSaveOpdRecord = () => {
    const p = getActiveOpdPatient();
    if (!p) return;
    window.savePatientConsultationSnapshot();
    appState.recordsActiveTab = 'regular';
    appState.registryOpenFolderPatientId = p.id;
    switchView('records');
    showToast(`Saved ${p.name}'s complete General OPD Record (SOAP, Prescription & Lab/Imaging Request) to Patient Records Registry!`);
  };

  window.addAncPrenatalVisit = () => {
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
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

    const aogEl = document.getElementById('anc-aog-input') as HTMLInputElement | null;
    if (aogEl) aogEl.value = p.anc.aogWeeks || '';
    const edcEl = document.getElementById('anc-edc-input') as HTMLInputElement | null;
    if (edcEl) edcEl.value = p.anc.edc || '';
    const trimEl = document.getElementById('anc-trimester-select') as HTMLSelectElement | null;
    if (trimEl && p.anc.trimester) trimEl.value = p.anc.trimester;
  }

  window.handleAncLmpDropdownChange = () => {
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc.trimester = trimVal;
    appState.ancScreeningFilter = trimVal;
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
  };

  window.toggleAncDangerSign = (sign: string) => {
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
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
    const p = getActiveAncPatient();
    if (!p) return;
    syncAncPatientOwnSoap(p);
    saveState();
    appState.ancActiveTab = 'ob-pe';
    renderAntenatalCare();
    showToast('Synced Antenatal data into Maternal SOAP Note (Step 2)');
  };

  function renderSoapWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    const p = getActiveOpdPatient();
    const aiHTML = p ? buildAiSoapLeftInnerHTML(p) : '';
    main.innerHTML = buildSoapWorkspaceHTML(appState, p, aiHTML);
  }

  function renderPrescriptionWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildPrescriptionWorkspaceHTML(appState, getActiveOpdPatient());
  }

  window.setRxPrintMode = (mode: string) => {
    appState.rxPrintMode = mode;
    if (appState.currentView === 'anc') renderAntenatalCare();
    else renderPrescriptionWorkspace();
  };

  function renderDiagnosticsWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    main.innerHTML = buildDiagnosticsWorkspaceHTML(appState, getActiveOpdPatient());
  }

  window.setDiagActiveTab = (tab: string) => {
    appState.diagActiveTab = tab;
    renderDiagnosticsWorkspace();
  };

  window.toggleDiagnosticTest = (category: 'labs' | 'imaging', item: string) => {
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
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
    const p = appState.currentView === 'anc' ? getActiveAncPatient() : getActiveOpdPatient();
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

  window.openRecordsOnTab = (tab: string) => {
    appState.recordsActiveTab = tab;
    switchView('records');
  };

  window.deletePatientRecord = (id: string) => {
    const wasInPatients = appState.patients.some((p: any) => p.id === id);
    const wasInBakuNxt = (appState.bakunxtPatients || []).some((p: any) => p.id === id);
    const wasInOptPlus = (appState.optplusRecords || []).some((p: any) => p.id === id);

    if (wasInPatients) {
      appState.patients = appState.patients.filter((p: any) => p.id !== id);
      if (appState.activePatientId === id) {
        appState.activePatientId = appState.patients[0]?.id || null;
      }
    }
    if (wasInBakuNxt) {
      appState.bakunxtPatients = (appState.bakunxtPatients || []).filter((p: any) => p.id !== id);
      saveBakuNxtPatientsToStorage(appState.bakunxtPatients);
      if (appState.bakunxtCurrentPatient?.id === id) {
        appState.bakunxtCurrentPatient = createBlankBakuNxtPatient(appState.doctor);
      }
    }
    if (wasInOptPlus) {
      appState.optplusRecords = (appState.optplusRecords || []).filter((p: any) => p.id !== id);
      saveOptPlusRecordsToStorage(appState.optplusRecords);
      if (appState.optplusForm?.id === id) {
        appState.optplusForm = createBlankOptPlusForm(appState.doctor);
      }
    }
    if (wasInPatients || wasInBakuNxt || wasInOptPlus) {
      saveState();
    }

    if (appState.registryPreviewPatientId === id) {
      appState.registryPreviewPatientId = '';
      appState.registryPreviewDocType = '';
      appState.registryPreviewVisitDate = '';
    }
    renderPatientRecords();
    showToast('Deleted patient folder from registry');
  };

  function findAnyRegistryRecord(patientId: string): { rec: any; defaultDate: string; category: string } {
    const todayFallback = new Date().toISOString().split('T')[0];
    const p = appState.patients.find((x: any) => x.id === patientId);
    if (p) {
      const d = p.consultationHistory?.[0]?.date || p.consultationDate || todayFallback;
      return { rec: p, defaultDate: d, category: p.patientType === 'antenatal' ? 'antenatal' : 'regular' };
    }
    const b = (appState.bakunxtPatients || []).find((x: any) => x.id === patientId);
    if (b) {
      const d = b.visitHistory?.[0]?.date || b.visitDate || todayFallback;
      return { rec: b, defaultDate: d, category: 'immunization' };
    }
    const o = (appState.optplusRecords || []).find((x: any) => x.id === patientId);
    if (o) {
      const d = o.visitHistory?.[0]?.date || o.measureDate || todayFallback;
      return { rec: o, defaultDate: d, category: 'optplus' };
    }
    return { rec: null, defaultDate: todayFallback, category: 'regular' };
  }

  window.toggleRegistryPatientFolder = (patientId: string) => {
    if (appState.registryOpenFolderPatientId === patientId) {
      appState.registryOpenFolderPatientId = '__NONE__';
      if (appState.registryPreviewPatientId === patientId) {
        appState.registryPreviewPatientId = '';
        appState.registryPreviewDocType = '';
        appState.registryPreviewVisitDate = '';
      }
    } else {
      appState.registryOpenFolderPatientId = patientId;
      const found = findAnyRegistryRecord(patientId);
      appState.registryOpenVisitFolderKey = `${patientId}__${found.defaultDate}`;
    }
    renderPatientRecords();
  };

  window.toggleRegistryVisitSubfolder = (patientId: string, visitDate: string) => {
    const key = `${patientId}__${visitDate}`;
    if (appState.registryOpenVisitFolderKey === key) {
      appState.registryOpenVisitFolderKey = '__CLOSED__';
    } else {
      appState.registryOpenVisitFolderKey = key;
    }
    renderPatientRecords();
  };

  window.startNewConsultationVisitForPatient = (patientId: string) => {
    const b = (appState.bakunxtPatients || []).find((x: any) => x.id === patientId);
    if (b) {
      appState.bakunxtCurrentPatient = JSON.parse(JSON.stringify(b));
      appState.bakunxtActiveTab = 'intake';
      switchView('bakunxt');
      showToast(`Opened ${b.childName} in BakuNxt Immunization Intake.`);
      return;
    }
    const o = (appState.optplusRecords || []).find((x: any) => x.id === patientId);
    if (o) {
      window.optplusEditRecord(o.id);
      switchView('optplus');
      return;
    }
    const p = appState.patients.find((x: any) => x.id === patientId);
    if (!p) return;
    appState.activePatientId = p.id;
    p.natureOfVisit = 'Follow-Up';
    saveState();
    switchView(p.patientType === 'antenatal' ? 'anc' : 'soap');
    showToast(`Opened ${p.name} for a new consultation visit — set the Consultation Date in SOAP to create a new visit folder.`);
  };

  window.openRegistryPatientPdf = (patientId: string, docType: string, visitDate?: string) => {
    appState.registryOpenFolderPatientId = patientId;
    const found = findAnyRegistryRecord(patientId);
    const resolvedDate = visitDate || found.defaultDate;
    appState.registryOpenVisitFolderKey = `${patientId}__${resolvedDate}`;

    if (
      appState.registryPreviewPatientId === patientId &&
      appState.registryPreviewDocType === docType &&
      appState.registryPreviewVisitDate === resolvedDate
    ) {
      appState.registryPreviewPatientId = '';
      appState.registryPreviewDocType = '';
      appState.registryPreviewVisitDate = '';
    } else {
      appState.registryPreviewPatientId = patientId;
      appState.registryPreviewDocType = docType;
      appState.registryPreviewVisitDate = resolvedDate;
    }
    renderPatientRecords();
  };

  window.closeRegistryPatientPdf = () => {
    appState.registryPreviewPatientId = '';
    appState.registryPreviewDocType = '';
    appState.registryPreviewVisitDate = '';
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

    let stageContainer: HTMLDivElement | null = null;
    let masterStyleEl: HTMLStyleElement | null = null;
    const nativeGetComputedStyle = window.getComputedStyle.bind(window);

    // Fix html2canvas-pro 2.6.4 bug where context.config.window.getComputedStyle(clonedEl)
    // calls the outer window's getComputedStyle on an element inside the cloned iframe document,
    // which in Chromium ignores all iframe stylesheets unless routed to the element's owner window.
    window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) => {
      try {
        const ownerWin = elt?.ownerDocument?.defaultView;
        if (ownerWin && ownerWin !== window) {
          return ownerWin.getComputedStyle(elt, pseudoElt ?? null);
        }
      } catch {
        // Fallback to nativeGetComputedStyle
      }
      return nativeGetComputedStyle(elt, pseudoElt ?? null);
    }) as typeof window.getComputedStyle;

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

      // Exact physical paper widths in CSS pixels at 96 DPI:
      // A6 portrait (105mm x 148mm) -> 397px wide
      // A5 landscape / Dual-A6 / Half-Bond (210mm x 148mm) -> 794px wide
      // A4 portrait (210mm x 297mm) -> 794px wide
      const targetWidthPx = formatType === 'a6' ? 397 : 794;
      const targetMinHeightPx = formatType === 'a6' || formatType === 'a5-landscape' ? 559 : 1122;

      // Collect all compiled CSS rules from active document.styleSheets so the cloned iframe
      // has every Tailwind v4 & index.css rule without relying on <link> fetches inside about:blank
      let combinedCssRulesText = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules;
          if (!rules) continue;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule && typeof rule.cssText === 'string' && !rule.cssText.trim().startsWith('@import')) {
              combinedCssRulesText += rule.cssText + '\n';
            }
          }
        } catch {
          // Ignore cross-origin stylesheet security errors
        }
      }

      if (combinedCssRulesText) {
        masterStyleEl = document.createElement('style');
        masterStyleEl.id = 'medflow-pdf-master-style';
        masterStyleEl.textContent = combinedCssRulesText;
        document.head.appendChild(masterStyleEl);
      }

      stageContainer = document.createElement('div');
      stageContainer.id = 'medflow-pdf-stage-container';
      stageContainer.className = 'pdf-capture-clean';
      stageContainer.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: ${targetWidthPx}px;
        min-width: ${targetWidthPx}px;
        max-width: ${targetWidthPx}px;
        background: #ffffff;
        z-index: -9999;
        pointer-events: none;
        overflow: visible;
      `;
      document.body.appendChild(stageContainer);

      const ignoredProps = new Set([
        'all',
        'd',
        'content',
        'transition',
        'transition-property',
        'transition-duration',
        'transition-delay',
        'transition-timing-function',
        'animation',
        'animation-name',
        'animation-duration',
        'animation-delay',
        'animation-iteration-count',
        'animation-direction',
        'animation-fill-mode',
        'animation-play-state',
        'inline-size',
        'block-size',
        'min-inline-size',
        'max-inline-size',
        'min-block-size',
        'max-block-size',
        'margin-block-start',
        'margin-block-end',
        'margin-inline-start',
        'margin-inline-end',
        'padding-block-start',
        'padding-block-end',
        'padding-inline-start',
        'padding-inline-end',
        'letter-spacing',
        'word-spacing',
        'font-variant',
        'font-variant-ligatures',
        'font-variant-numeric',
        'font-feature-settings',
        'font-kerning',
        'text-rendering',
        'line-break',
        'hyphens',
        'height'
      ]);

      const svgPresentationProps = [
        'width',
        'height',
        'fill',
        'stroke',
        'stroke-width',
        'stroke-linecap',
        'stroke-linejoin',
        'color',
        'opacity',
        'display'
      ];

      // Two-pass computed style inliner: reads exact resolved styles from the real browser DOM
      // while staged at physical paper width, then writes them directly onto each element's style attribute.
      const inlineComputedStylesOnTree = (rootEl: HTMLElement) => {
        const allNodes = [rootEl, ...Array.from(rootEl.querySelectorAll('*'))];
        const computedEntries: Array<{ node: Element; cssText: string }> = [];

        // Pass 1: Read computed styles from the live DOM before mutating any inline styles
        for (const node of allNodes) {
          const cs = nativeGetComputedStyle(node);
          if (!cs) continue;

          if (node instanceof SVGElement) {
            const parts: string[] = [];
            for (const prop of svgPresentationProps) {
              const val = cs.getPropertyValue(prop);
              if (val) parts.push(`${prop}:${val}`);
            }
            if (parts.length > 0) {
              computedEntries.push({ node, cssText: parts.join(';') + ';' });
            }
          } else if (node instanceof HTMLElement) {
            const parts: string[] = [];
            for (let i = 0; i < cs.length; i++) {
              const prop = cs.item(i);
              if (!prop || ignoredProps.has(prop) || prop.startsWith('--') || prop.startsWith('-webkit-locale')) {
                continue;
              }
              const val = cs.getPropertyValue(prop);
              if (val) {
                parts.push(`${prop}:${val}`);
              }
            }
            parts.push('letter-spacing:normal');
            parts.push('word-spacing:normal');
            parts.push('font-variant-numeric:normal');
            if (parts.length > 0) {
              computedEntries.push({ node, cssText: parts.join(';') + ';' });
            }
          }
        }

        // Pass 2: Write inlined computed styles onto every node
        for (const entry of computedEntries) {
          if (entry.node instanceof HTMLElement || entry.node instanceof SVGElement) {
            entry.node.style.cssText = entry.cssText;
          }
        }

        // Lock root paper dimensions cleanly
        rootEl.style.margin = '0px';
        rootEl.style.width = `${targetWidthPx}px`;
        rootEl.style.minWidth = `${targetWidthPx}px`;
        rootEl.style.maxWidth = `${targetWidthPx}px`;
        rootEl.style.minHeight = `${targetMinHeightPx}px`;
        rootEl.style.backgroundColor = '#ffffff';
        rootEl.style.boxShadow = 'none';
        rootEl.style.border = 'none';
        rootEl.style.boxSizing = 'border-box';
      };

      const renderNodeToPdfPage = async (sourceNode: HTMLElement) => {
        if (!stageContainer) return;
        stageContainer.innerHTML = '';

        const clone = sourceNode.cloneNode(true) as HTMLElement;
        clone.style.margin = '0';
        clone.style.width = `${targetWidthPx}px`;
        clone.style.minWidth = `${targetWidthPx}px`;
        clone.style.maxWidth = `${targetWidthPx}px`;
        clone.style.minHeight = `${targetMinHeightPx}px`;
        clone.style.background = '#ffffff';
        clone.style.boxSizing = 'border-box';
        stageContainer.appendChild(clone);

        // Wait for fonts and two animation frames so layout and paragraph metrics settle cleanly
        if (document.fonts && document.fonts.ready) {
          try {
            await document.fonts.ready;
          } catch {
            // ignore font readiness error
          }
        }
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        // Bake exact computed styles from the real DOM onto every node in the cloned paper sheet
        inlineComputedStylesOnTree(clone);

        const canvas = await html2canvas(clone, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: targetWidthPx,
          windowWidth: 1280,
          ignoreElements: (node: Element) => {
            if (node.id === 'root' || node.id === 'toast-container' || node.id === 'modal-overlay') {
              return true;
            }
            if (node.tagName === 'LINK' && (node as HTMLLinkElement).rel?.toLowerCase().includes('stylesheet')) {
              return true;
            }
            if (node.tagName === 'STYLE' && node.id !== 'medflow-pdf-master-style') {
              return true;
            }
            return false;
          },
          onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
            if (combinedCssRulesText && clonedDoc.head && !clonedDoc.getElementById('medflow-pdf-master-style')) {
              const styleTag = clonedDoc.createElement('style');
              styleTag.id = 'medflow-pdf-master-style';
              styleTag.textContent = combinedCssRulesText;
              clonedDoc.head.appendChild(styleTag);
            }
            if (clonedDoc.body) {
              clonedDoc.body.style.margin = '0';
              clonedDoc.body.style.padding = '0';
              clonedDoc.body.style.backgroundColor = '#ffffff';
              clonedDoc.body.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
              clonedDoc.body.style.letterSpacing = 'normal';
              clonedDoc.body.style.wordSpacing = 'normal';
            }
            if (clonedEl?.parentElement) {
              clonedEl.parentElement.style.left = '0px';
              clonedEl.parentElement.style.top = '0px';
            }
          }
        });

        const imgWidthMm = pageWidthMm;
        const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

        // If the content is a single-page clinical record (within 40% of physical sheet height), fit cleanly onto 1 page so signature blocks are never orphaned
        if (imgHeightMm <= pageHeightMm * 1.4) {
          const finalH = Math.min(imgHeightMm, pageHeightMm);
          const finalW = imgHeightMm > pageHeightMm ? (canvas.width * finalH) / canvas.height : imgWidthMm;
          const offsetX = (pageWidthMm - finalW) / 2;
          const imgData = canvas.toDataURL('image/jpeg', 0.96);
          pdf.addImage(imgData, 'JPEG', offsetX, 0, finalW, finalH);
        } else {
          // Multi-page vertical slicing for extra-long clinical masterlists with clean top/bottom page margins
          const topBottomMarginMm = 6;
          const usablePageHeightMm = pageHeightMm - topBottomMarginMm * 2;
          const pageCanvasHeightPx = Math.floor((usablePageHeightMm * canvas.width) / imgWidthMm);
          let renderedHeightPx = 0;
          let sliceIndex = 0;

          while (renderedHeightPx < canvas.height) {
            if (sliceIndex > 0) pdf.addPage();
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
              pdf.addImage(sliceData, 'JPEG', 0, sliceIndex === 0 ? 0 : topBottomMarginMm, imgWidthMm, sliceHeightMm);
            }
            renderedHeightPx += sliceHeightPx;
            sliceIndex++;
          }
        }
      };

      // Check if container holds multiple explicit pages (e.g., Export All Patients SOAP PDF)
      const childPages = Array.from(el.querySelectorAll(':scope > .pdf-page-break')) as HTMLElement[];

      if (childPages.length > 0) {
        for (let i = 0; i < childPages.length; i++) {
          if (i > 0) pdf.addPage();
          await renderNodeToPdfPage(childPages[i]);
        }
      } else {
        await renderNodeToPdfPage(el);
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
    } finally {
      window.getComputedStyle = nativeGetComputedStyle;
      if (masterStyleEl && masterStyleEl.parentNode) {
        masterStyleEl.parentNode.removeChild(masterStyleEl);
      }
      if (stageContainer && stageContainer.parentNode) {
        stageContainer.parentNode.removeChild(stageContainer);
      }
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

    window.setCpgFlashcardPillar = (cpgId: string, pillar: string) => {
      if (!appState.cpgFlashcardPillarMap) appState.cpgFlashcardPillarMap = {};
      appState.cpgFlashcardPillarMap[cpgId] = pillar;
      refreshActiveCpgAndSoapViews();
    };

    window.toggleCpgFlashcardQuizMode = (cpgId: string) => {
      if (!appState.cpgFlashcardQuizModeMap) appState.cpgFlashcardQuizModeMap = {};
      if (!appState.cpgFlashcardQuizMap) appState.cpgFlashcardQuizMap = {};
      const nextVal = !appState.cpgFlashcardQuizModeMap[cpgId];
      appState.cpgFlashcardQuizModeMap[cpgId] = nextVal;
      appState.cpgFlashcardQuizMap[cpgId] = nextVal;
      if (!nextVal && appState.cpgFlashcardRevealedMap) {
        appState.cpgFlashcardRevealedMap[cpgId] = {};
      }
      refreshActiveCpgAndSoapViews();
    };

    window.revealCpgFlashcardSection = (cpgId: string, sectionKey: string) => {
      if (!appState.cpgFlashcardRevealedMap) appState.cpgFlashcardRevealedMap = {};
      if (!appState.cpgFlashcardRevealedMap[cpgId]) appState.cpgFlashcardRevealedMap[cpgId] = {};
      appState.cpgFlashcardRevealedMap[cpgId][sectionKey] = !appState.cpgFlashcardRevealedMap[cpgId][sectionKey];
      refreshActiveCpgAndSoapViews();
    };

    function formatCpgDiagnosticsText(cm: any): string {
      if (!cm) return '';
      if (Array.isArray(cm.diagnostics)) {
        return cm.diagnostics.map((d: any) => `  • ${d.label}: ${d.detail}`).join('\n');
      }
      return String(cm.diagnostics || '');
    }

    function formatCpgSituationsText(cm: any): string {
      if (!cm || !Array.isArray(cm.treatmentPerSituation)) return '';
      return cm.treatmentPerSituation
        .map((s: any) => `  • Situation ${s.number ?? s.situationNumber} (${s.situation ?? s.situationTitle}): ${s.protocol ?? s.management}`)
        .join('\n');
    }

    function formatCpgCounselingText(cm: any): string {
      if (!cm) return '';
      if (Array.isArray(cm.counselingAndRedFlags)) {
        return cm.counselingAndRedFlags
          .map((c: any) => `  • ${c.isRedFlag ? '[RED FLAG] ' : ''}${c.label}: ${c.detail}`)
          .join('\n');
      }
      return String(cm.counselingAndRedFlags || '');
    }

    window.applyFullClinicalManagementToSoap = (cpgId: string) => {
      const cpg = PH_CPG_CATALOG.find((c: any) => c.id === cpgId);
      const p = getActivePatient();
      if (!cpg || !p) {
        showToast('Select or register a patient first to apply CPG Clinical Management', 'warning');
        return;
      }
      const cm = cpg.clinicalManagement;
      if (!cm) {
        window.applyCpgToSoapPlan(cpgId);
        return;
      }

      const condTitle = cm.title || cm.conditionTitle || cpg.title;
      const society = cm.societySource || cm.sourceSociety || cpg.source || 'PH CPG';

      const fullBlock = [
        `[CPG Condition #${cm.conditionNumber}: ${condTitle} — ${society}]`,
        `1. DIAGNOSTICS:\n${formatCpgDiagnosticsText(cm)}`,
        `2. TREATMENT PER SITUATION:\n${formatCpgSituationsText(cm)}`,
        `3. COUNSELING & RED FLAGS:\n${formatCpgCounselingText(cm)}`
      ].join('\n');

      p.doctorSoap.plan = p.doctorSoap.plan
        ? `${p.doctorSoap.plan}\n\n${fullBlock}`
        : fullBlock;

      if (!p.doctorSoap.assessment) {
        p.doctorSoap.assessment = condTitle;
      }

      saveState();
      showToast(`Applied Full 3-Pillar Clinical Management (#${cm.conditionNumber} ${condTitle}) to ${p.name}'s SOAP`);
      if (appState.currentView !== 'soap' && appState.currentView !== 'anc') {
        switchView('soap');
      } else {
        switchView(appState.currentView);
      }
    };

    window.applySingleCpgSituationToSoap = (cpgId: string, situationNumber: number) => {
      const cpg = PH_CPG_CATALOG.find((c: any) => c.id === cpgId);
      const p = getActivePatient();
      if (!cpg || !p || !cpg.clinicalManagement) {
        showToast('Select or register a patient first to add regimen to SOAP', 'warning');
        return;
      }
      const cm = cpg.clinicalManagement;
      const sit = (cm.treatmentPerSituation || []).find(
        (s: any) => Number(s.number ?? s.situationNumber) === Number(situationNumber)
      );
      if (!sit) return;

      const condTitle = cm.title || cm.conditionTitle || cpg.title;
      const sitNum = sit.number ?? sit.situationNumber;
      const sitTitle = sit.situation ?? sit.situationTitle;
      const sitProtocol = sit.protocol ?? sit.management;

      const sitLine = [
        `[${condTitle} — Situation ${sitNum}: ${sitTitle}]`,
        `• Regimen: ${sitProtocol}`,
        `• Counseling & Red Flags:\n${formatCpgCounselingText(cm)}`
      ].join('\n');

      p.doctorSoap.plan = p.doctorSoap.plan
        ? `${p.doctorSoap.plan}\n\n${sitLine}`
        : sitLine;

      if (!p.doctorSoap.assessment) {
        p.doctorSoap.assessment = `${condTitle} (${sitTitle})`;
      }

      saveState();
      showToast(`Added Situation ${sitNum} (${sitTitle}) regimen to ${p.name}'s SOAP Plan`);
      if (appState.currentView === 'soap') {
        switchView('soap');
      }
    };

    function refreshActiveCpgAndSoapViews(): void {
      const cpgContainer = document.getElementById('cpg-cards-container');
      if (cpgContainer) {
        cpgContainer.innerHTML = buildCpgCardsHTML();
      }
      if (appState.currentView === 'soap') {
        switchView(appState.currentView);
      }
    }

  function buildSingleCpgAccordionItem(cpg: any, isSearching: boolean): string {
    const isDiseaseOpen = isSearching || appState.openCpgIds.includes(cpg.id);
    const hasThreeColSnapshot = Array.isArray(cpg.snapshotHeaders) && cpg.snapshotHeaders.length === 3;
    const snapshotRows = Array.isArray(cpg.snapshot) ? cpg.snapshot : [];
    const includedList = Array.isArray(cpg.scope?.included) ? cpg.scope.included : [];
    const excludedList = Array.isArray(cpg.scope?.excluded) ? cpg.scope.excluded : [];
    const pathway = cpg.pathway || {};
    const cm = cpg.clinicalManagement;

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
              <div class="flex flex-wrap items-center gap-2">
                ${cm ? `<span class="px-2 py-0.5 rounded-md bg-teal-900 text-teal-200 text-[10px] font-black uppercase tracking-wider">CPG #${cm.conditionNumber}</span>` : ''}
                <h3 class="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition">${escapeHTML(cpg.title)}</h3>
              </div>
              <p class="text-xs text-slate-500 line-clamp-1"><strong>Source:</strong> ${escapeHTML(cpg.source || '')}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button onclick="event.stopPropagation(); applyFullClinicalManagementToSoap('${escapeHTML(cpg.id)}')" class="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition cursor-pointer">
              + Apply Protocol to SOAP
            </button>
            <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 ${isDiseaseOpen ? 'rotate-180 text-teal-700' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </div>
        </div>

        <!-- CPG Data and Information Container (Revealed when disease is clicked) -->
        ${isDiseaseOpen ? `
          <div id="cpg-detail-${escapeHTML(cpg.id)}" class="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 space-y-6">
            <!-- 1. Quick Snapshot Table (At-a-Glance) -->
            ${snapshotRows.length > 0 ? `
              <div>
                <h5 class="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">1. Quick Snapshot</h5>
                <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
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

            <!-- Included & Excluded Populations (Directly Under Quick Snapshot) -->
            ${(includedList.length > 0 || excludedList.length > 0) ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                  <h5 class="text-xs font-bold uppercase tracking-wider text-teal-900">Included Populations</h5>
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
            ` : ''}

            <!-- 2. Clinical Action Pathway -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h5 class="text-xs font-bold uppercase tracking-wider text-slate-800">2. Clinical Action Pathway (Step-by-Step Workflow)</h5>
              </div>
              ${Array.isArray(pathway.orderedSteps) ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  ${pathway.orderedSteps.map((st: any) => `
                    <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div class="text-xs sm:text-sm font-bold text-teal-900">${escapeHTML(st.step)}</div>
                      <p class="text-xs text-slate-700 mt-1 leading-relaxed">${escapeHTML(st.detail)}</p>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  ${pathway.stepA ? `
                    <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                      <div class="text-xs sm:text-sm font-bold text-teal-900">${escapeHTML(pathway.stepA.title)}</div>
                      ${pathway.stepA.subtitle ? `<p class="text-xs text-slate-600">${escapeHTML(pathway.stepA.subtitle)}</p>` : ''}
                      <ul class="list-disc pl-5 text-xs text-slate-700 space-y-1">
                        ${(pathway.stepA.items || []).map((it: any) => `<li><strong>${escapeHTML(it.label)}:</strong> ${escapeHTML(it.detail)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                  ${pathway.stepB ? `
                    <div class="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                      <div class="text-xs sm:text-sm font-bold text-teal-900">${escapeHTML(pathway.stepB.title)}</div>
                      <ul class="list-disc pl-5 text-xs text-slate-700 space-y-1">
                        ${(pathway.stepB.steps || []).map((st: any) => `<li><strong>${escapeHTML(st.step)}:</strong> ${escapeHTML(st.detail)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                  ${pathway.stepC && Array.isArray(pathway.stepC.triageTable) && pathway.stepC.triageTable.length > 0 ? `
                    <div class="lg:col-span-2 p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2">
                      <div class="text-xs sm:text-sm font-bold text-slate-900">${escapeHTML(pathway.stepC.title || 'Triage & Severity Matrix')}</div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        ${pathway.stepC.triageTable.map((t: any) => `
                          <div class="p-3 rounded-lg border ${t.urgent ? 'bg-teal-900 text-white border-teal-800' : 'bg-white border-slate-200 text-slate-800'} text-xs">
                            <div class="font-extrabold uppercase">${escapeHTML(t.scenario)} → ${escapeHTML(t.classification)}</div>
                            <p class="mt-1">${escapeHTML(t.action)}</p>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              `}
            </div>

            <!-- 3. SEPARATE CLINICAL CONDITION MANAGEMENT FLASHCARD TABLE (Directly After Clinical Pathway) -->
            <div class="pt-1">
              ${buildCpgClinicalManagementFlashcardHTML(cpg, appState, false)}
            </div>
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
      <div class="space-y-5">
        <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-md border border-teal-600/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 class="medflow-title text-xl sm:text-2xl font-extrabold tracking-wide">Philippine Clinical Practice Guidelines (CPG) Library</h2>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div class="relative">
            <input
              type="text"
              value="${escapeHTML(appState.cpgSearchQuery)}"
              oninput="updateCpgSearch(this.value)"
              placeholder="Search all 41 Philippine CPGs by disease, Condition #, ICD-10, or drug name (e.g., Losartan, Dengue, PTB, GDM, Leptospirosis, Rabies, Preeclampsia)..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Category Accordions -> Disease Rows -> CPG Details & Flashcard Tables -->
        <div id="cpg-cards-container" class="space-y-3">
          ${buildCpgCardsHTML()}
        </div>
      </div>
    `;
  }

  // ============================================================================
  // ICON-ONLY CLEAR FORM HANDLERS FOR ALL FORMS
  // ============================================================================
  window.clearSignInForm = () => {
    const idEl = document.getElementById('signin-identifier') as HTMLInputElement | null;
    const pwEl = document.getElementById('signin-password') as HTMLInputElement | null;
    if (idEl) idEl.value = '';
    if (pwEl) pwEl.value = '';
    showToast('Cleared Sign-In form.');
  };

  window.clearSignUpForm = () => {
    appState.signupGcashReceiptDataUrl = '';
    appState.signupGcashReceiptName = '';
    appState.signupSubStartDate = todayInitStr;
    appState.signupSubEndDate = defaultOneMonthEndStr;
    appState.signupSubMonths = 1;
    renderAuthScreen();
    showToast('Cleared Registration form.');
  };

  window.clearPatientRegistrationForm = () => {
    renderRegistration();
    showToast('Cleared Patient Registration & ITR form.');
  };

  window.clearAncStep1Form = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    p.anc = {
      ...(p.anc || {}),
      gravida: 0,
      para: 0,
      term: 0,
      preterm: 0,
      abortion: 0,
      living: 0,
      bloodType: '',
      philhealthStatus: '',
      lmp: '',
      aogWeeks: '',
      edc: '',
      trimester: '1st',
      dangerSigns: []
    };
    syncAncPatientOwnSoap(p);
    saveState();
    renderAntenatalCare();
    showToast('Cleared Antenatal Step 1 form.');
  };

  window.clearAncStep2Form = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    p.anc = {
      ...(p.anc || {}),
      fht: '',
      fundicHeight: '',
      presentation: 'Cephalic',
      fetalMovement: 'Present / Active (>=10 kicks/12h)',
      edema: 'None'
    };
    if (p.doctorSoap) {
      p.doctorSoap.subjective = '';
      p.doctorSoap.objective = '';
      p.doctorSoap.assessment = '';
      p.doctorSoap.plan = '';
    }
    saveState();
    renderAntenatalCare();
    showToast('Cleared Antenatal Step 2 form.');
  };

  window.clearAncStep3Form = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.diagnostics) p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', priority: 'Routine', notes: '' };
    p.diagnostics.labs = [];
    p.diagnostics.imaging = [];
    saveState();
    renderAntenatalCare();
    showToast('Cleared Antenatal Step 3 Lab & Imaging selection.');
  };

  window.clearAncStep4Form = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc.ironFolate = 'None';
    p.anc.calcium = 'None';
    p.anc.tetanusStatus = 'Not Yet Given';
    p.anc.deworming = 'Not Yet Given';
    p.anc.otherVaccine = 'None';
    if (p.doctorSoap) p.doctorSoap.medications = [];
    saveState();
    renderAntenatalCare();
    showToast('Cleared Antenatal Step 4 Prescription form.');
  };

  window.clearAncStep5Form = () => {
    const p = getActiveAncPatient();
    if (!p) return;
    if (!p.anc) p.anc = {};
    p.anc.facilityBirthPlan = '';
    p.anc.emergencyTransport = '';
    p.anc.bloodDonorName = '';
    p.anc.companionName = '';
    p.anc.obNotes = '';
    saveState();
    renderAntenatalCare();
    showToast('Cleared Antenatal Step 5 Birth Plan form.');
  };

  window.clearAiSoapForm = () => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    p.chiefComplaint = '';
    p.hpi = '';
    p.peFindings = '';
    p.aiSoap = generateLiveAISoapFromPatient(p);
    saveState();
    renderSoapWorkspace();
    showToast('Cleared AI SOAP encoded symptoms.');
  };

  window.clearOfficialSoapForm = () => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    p.doctorSoap = {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      followUpDate: '',
      medications: []
    };
    saveState();
    renderSoapWorkspace();
    showToast('Cleared Official SOAP form.');
  };

  window.clearPrescriptionForm = () => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    if (!p.doctorSoap) {
      p.doctorSoap = { subjective: '', objective: '', assessment: '', plan: '', followUpDate: '', medications: [] };
    }
    p.doctorSoap.medications = [];
    saveState();
    renderPrescriptionWorkspace();
    showToast('Cleared Medical Prescription form.');
  };

  window.clearDiagnosticsForm = () => {
    const p = getActiveOpdPatient() || getActivePatient();
    if (!p) return;
    p.diagnostics = { labs: [], imaging: [], clinicalImpression: '', priority: 'Routine', notes: '' };
    saveState();
    renderDiagnosticsWorkspace();
    showToast('Cleared Laboratory & Imaging Request form.');
  };

  // ============================================================================
  // SECTION 14: BAKUNXT PH — NATIONAL IMMUNIZATION PROGRAM (EPI) MODULE
  // ============================================================================
  function renderBakuNxtWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    if (!appState.bakunxtCurrentPatient) {
      appState.bakunxtCurrentPatient = createBlankBakuNxtPatient(appState.doctor);
    }
    main.innerHTML = buildBakuNxtWorkspaceHTML(appState);
  }

  function updateBakuNxtLiveDomSummaries(): void {
    const p = appState.bakunxtCurrentPatient;
    if (!p) return;
    const ageObj = calculateBakuNxtAgeText(p.dob);
    const bwClass = classifyBakuNxtBirthWeight(p.birthWeightGrams);
    const cpabObj = evaluateBakuNxtCPAB(p.motherTdStatus);
    const milestone = evaluateBakuNxtMilestones(p);

    const ageEl = document.getElementById('bakunxt-live-age-display');
    if (ageEl) ageEl.textContent = ageObj.label;

    const bwEl = document.getElementById('bakunxt-live-bw-badge');
    if (bwEl) {
      bwEl.textContent = `Birth Wt: ${bwClass.text}`;
      bwEl.className = `inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1.5 ${bwClass.color}`;
    }

    const dosesEl = document.getElementById('bakunxt-live-doses-count');
    if (dosesEl) dosesEl.textContent = `${milestone.dosesCount} / ${milestone.totalVaccines}`;

    const ficEl = document.getElementById('bakunxt-live-fic-badge');
    if (ficEl) {
      ficEl.textContent = milestone.statusBadge;
      ficEl.className = `inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${milestone.statusColor}`;
    }

    const cpabEl = document.getElementById('bakunxt-live-cpab-badge');
    if (cpabEl) {
      cpabEl.textContent = cpabObj.label;
      cpabEl.className = `inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${
        cpabObj.isCPAB
          ? 'bg-teal-50 text-teal-800 border-teal-200'
          : 'bg-amber-50 text-amber-800 border-amber-200'
      }`;
    }

    const tempVal = parseFloat(p.tempCelsius);
    const tempAlertEl = document.getElementById('bakunxt-temp-alert-text');
    if (tempAlertEl) {
      if (!isNaN(tempVal) && tempVal >= 38.0) {
        tempAlertEl.textContent = '⚠️ FEVER (≥38.0°C): Evaluate / Defer Live Vaccines';
        tempAlertEl.className = 'text-[10px] font-bold mt-1 text-red-600';
      } else {
        tempAlertEl.textContent = 'Normal (< 38.0°C) — Safe to Vaccinate';
        tempAlertEl.className = 'text-[10px] font-bold mt-1 text-teal-700';
      }
    }

    const muacVal = parseFloat(p.muacCm);
    const muacEl = document.getElementById('bakunxt-muac-status-text');
    if (muacEl) {
      if (isNaN(muacVal) || muacVal <= 0) {
        muacEl.textContent = 'Normal (≥ 12.5 cm)';
        muacEl.className = 'inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 bg-teal-50 text-teal-800 border-teal-200';
      } else if (muacVal < 11.5) {
        muacEl.textContent = 'RED (< 11.5 cm) — Severe Acute Malnutrition (SAM)';
        muacEl.className = 'inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 bg-red-50 text-red-800 border-red-200';
      } else if (muacVal < 12.5) {
        muacEl.textContent = 'YELLOW (11.5–12.4 cm) — Moderate Acute Malnutrition (MAM)';
        muacEl.className = 'inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 bg-amber-50 text-amber-800 border-amber-200';
      } else {
        muacEl.textContent = 'GREEN (≥ 12.5 cm) — Normal Nutritional Status';
        muacEl.className = 'inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-1 bg-teal-50 text-teal-800 border-teal-200';
      }
    }
  }

  window.switchBakuNxtTab = (tabName: 'intake' | 'registry' | 'itr' | 'passport') => {
    appState.bakunxtActiveTab = tabName;
    renderBakuNxtWorkspace();
  };

  window.bakunxtSyncFormField = (field: string, value: any) => {
    if (!appState.bakunxtCurrentPatient) {
      appState.bakunxtCurrentPatient = createBlankBakuNxtPatient(appState.doctor);
    }
    appState.bakunxtCurrentPatient[field] = value;
    updateBakuNxtLiveDomSummaries();
  };

  window.bakunxtToggleVaccineGiven = (vacId: string, isChecked: boolean) => {
    if (!appState.bakunxtCurrentPatient) return;
    const vDef = DOH_VACCINES.find((v) => v.id === vacId);
    const doseObj = appState.bakunxtCurrentPatient.doses[vacId];
    if (!doseObj || !vDef) return;
    doseObj.given = isChecked;
    if (isChecked) {
      if (!doseObj.dateGiven) {
        doseObj.dateGiven = new Date().toISOString().split('T')[0];
      }
      if (!doseObj.site) doseObj.site = vDef.site;
      if (!doseObj.facility) {
        doseObj.facility = appState.bakunxtCurrentPatient.facilityName || '';
      }
    }
    renderBakuNxtWorkspace();
  };

  window.bakunxtUpdateDoseField = (vacId: string, key: string, val: string) => {
    if (!appState.bakunxtCurrentPatient?.doses?.[vacId]) return;
    appState.bakunxtCurrentPatient.doses[vacId][key] = val;
    if (key === 'dateGiven' && val) {
      appState.bakunxtCurrentPatient.doses[vacId].given = true;
      renderBakuNxtWorkspace();
    }
  };

  window.bakunxtResetNewPatient = () => {
    appState.bakunxtCurrentPatient = createBlankBakuNxtPatient(appState.doctor);
    appState.bakunxtActiveTab = 'intake';
    renderBakuNxtWorkspace();
    showToast('Started a clean BakuNxt EPI patient intake form.');
  };

  window.bakunxtSaveCurrentPatient = (silent = false): boolean => {
    const p = appState.bakunxtCurrentPatient;
    if (!p) return false;
    if (!p.childName || !p.childName.trim()) {
      showToast("Please enter the Child's Full Name before saving.", 'warning');
      const nameInput = document.getElementById('f_childName');
      if (nameInput) nameInput.focus();
      return false;
    }

    const vDate = p.visitDate || new Date().toISOString().split('T')[0];
    p.visitDate = vDate;
    const idx = appState.bakunxtPatients.findIndex((item: any) => item.id === p.id);
    const existingVisits = idx >= 0 && Array.isArray(appState.bakunxtPatients[idx].visitHistory)
      ? [...appState.bakunxtPatients[idx].visitHistory]
      : Array.isArray(p.visitHistory)
        ? [...p.visitHistory]
        : [];

    const snapshotCopy = JSON.parse(JSON.stringify(p));
    delete snapshotCopy.visitHistory;
    const vIdx = existingVisits.findIndex((v: any) => v.date === vDate);
    if (vIdx >= 0) {
      existingVisits[vIdx] = { date: vDate, snapshot: snapshotCopy };
    } else {
      existingVisits.unshift({ date: vDate, snapshot: snapshotCopy });
    }
    p.visitHistory = existingVisits;

    const fullSnapshot = JSON.parse(JSON.stringify(p));
    if (idx >= 0) {
      appState.bakunxtPatients[idx] = fullSnapshot;
    } else {
      appState.bakunxtPatients.unshift(fullSnapshot);
    }
    saveBakuNxtPatientsToStorage(appState.bakunxtPatients);
    saveState();
    if (!silent) {
      appState.recordsActiveTab = 'immunization';
      appState.registryOpenFolderPatientId = p.id;
      appState.registryOpenVisitFolderKey = `${p.id}__${vDate}`;
      switchView('records');
      showToast(`Saved ${p.childName}'s Immunization Folder (ITR & Vaccine Card) to Patient Records!`);
    }
    return true;
  };

  window.bakunxtSaveAndOpenTab = (targetTab: 'itr' | 'passport') => {
    const ok = window.bakunxtSaveCurrentPatient(true);
    if (ok) {
      appState.bakunxtActiveTab = targetTab;
      renderBakuNxtWorkspace();
      showToast(
        targetTab === 'itr'
          ? 'Generated Official DOH Individual Treatment Record (ITR).'
          : 'Generated BakuNxt Baby Vaccine Card.'
      );
    }
  };

  window.bakunxtSelectPatient = (id: string, targetTab: 'intake' | 'itr' | 'passport' = 'intake') => {
    const found = appState.bakunxtPatients.find((x: any) => x.id === id);
    if (!found) return;
    appState.bakunxtCurrentPatient = JSON.parse(JSON.stringify(found));
    appState.bakunxtActiveTab = targetTab;
    renderBakuNxtWorkspace();
    showToast(`Loaded record: ${found.childName}`);
  };

  window.bakunxtDeletePatient = (id: string) => {
    window.deletePatientRecord(id);
  };

  window.bakunxtDownloadITRPdf = () => {
    const p = appState.bakunxtCurrentPatient || {};
    const rawName = (p.childName || 'Infant_Record').replace(/[^a-zA-Z0-9_-]/g, '_');
    window.downloadPdfElement('itr-document-sheet', `BakuNxt_Official_ITR_${rawName}.pdf`, 'a4');
  };

  window.bakunxtDownloadPassportPdf = () => {
    const p = appState.bakunxtCurrentPatient || {};
    const rawName = (p.childName || 'Baby_Card').replace(/[^a-zA-Z0-9_-]/g, '_');
    window.downloadPdfElement('baby-passport-card', `BakuNxt_Baby_Vaccine_Card_${rawName}.pdf`, 'a4');
  };

  // ============================================================================
  // SECTION 15: OPTPLUS PH — OPERATION TIMBANG PLUS (NUTRITION PROGRAM) MODULE
  // ============================================================================
  function renderOptPlusWorkspace(): void {
    const main = document.getElementById('main-workspace');
    if (!main) return;
    if (!appState.optplusForm) {
      appState.optplusForm = createBlankOptPlusForm(appState.doctor);
    }
    if (!Array.isArray(appState.optplusRecords)) {
      appState.optplusRecords = loadOptPlusRecordsFromStorage();
    }
    main.innerHTML = buildOptPlusWorkspaceHTML(appState);
  }

  function updateOptPlusLiveIntakeDom(): void {
    const f = appState.optplusForm || {};
    const ageMonths = computeOptCompletedMonths(f.dob, f.measureDate);
    const agePill = document.getElementById('optplus-age-validation-pill');
    const ageDisplay = document.getElementById('optplus-child-age-display') as HTMLInputElement | null;
    const modeDisplay = document.getElementById('optplus-height-mode-display') as HTMLInputElement | null;

    if (ageDisplay) {
      ageDisplay.value = ageMonths !== null && ageMonths >= 0 ? String(ageMonths) : '—';
    }
    if (modeDisplay) {
      modeDisplay.value = ageMonths !== null && ageMonths >= 24 ? 'Standing' : 'Recumbent';
    }
    if (agePill) {
      if (ageMonths === null || ageMonths < 0) {
        agePill.textContent = 'Age: —';
        agePill.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-900/60 text-teal-100 border border-teal-500/40';
      } else if (ageMonths <= 59) {
        agePill.textContent = `Eligible (${ageMonths} mos)`;
        agePill.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-teal-900 shadow-2xs';
      } else {
        agePill.textContent = `Over 59 mos (${ageMonths}m)`;
        agePill.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-2xs';
      }
    }

    const weightNum = parseFloat(f.weight);
    const heightNum = parseFloat(f.height);
    const hasValidMetrics =
      ageMonths !== null &&
      ageMonths >= 0 &&
      !isNaN(weightNum) &&
      weightNum > 0 &&
      !isNaN(heightNum) &&
      heightNum > 0;

    const liveWho = hasValidMetrics
      ? classifyChildWHO({
          sex: f.sex || 'Male',
          ageMonths: ageMonths!,
          weight: weightNum,
          height: heightNum,
          muac: f.muac || '',
          edema: f.edema || 'None'
        })
      : null;

    const liveToneBadgeClass = (tone?: string) => {
      const map: Record<string, string> = {
        normal: 'bg-teal-500/20 text-teal-200 border border-teal-400/40',
        moderate: 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
        severe: 'bg-rose-500/25 text-rose-200 border border-rose-400/50',
        over: 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
      };
      return map[tone || ''] || 'bg-slate-700 text-slate-300';
    };

    const actionTag = document.getElementById('optplus-overall-action-tag');
    if (actionTag) {
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
      actionTag.textContent = actionTagText;
      actionTag.className = `text-xs font-extrabold px-2.5 py-1 rounded-lg ${actionTagClass}`;
    }

    const wfaZ = document.getElementById('optplus-wfa-z');
    const wfaBadge = document.getElementById('optplus-wfa-badge');
    const wfaCode = document.getElementById('optplus-wfa-code');
    if (wfaZ) wfaZ.textContent = liveWho ? `${liveWho.zWFA >= 0 ? '+' : ''}${liveWho.zWFA} SD` : '—';
    if (wfaBadge) {
      wfaBadge.textContent = liveWho ? liveWho.wfaLabel : '—';
      wfaBadge.className = `inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.wfaTone)}`;
    }
    if (wfaCode) wfaCode.textContent = liveWho ? `Code: ${liveWho.wfaCode}` : '—';

    const hfaZ = document.getElementById('optplus-hfa-z');
    const hfaBadge = document.getElementById('optplus-hfa-badge');
    const hfaCode = document.getElementById('optplus-hfa-code');
    if (hfaZ) hfaZ.textContent = liveWho ? `${liveWho.zHFA >= 0 ? '+' : ''}${liveWho.zHFA} SD` : '—';
    if (hfaBadge) {
      hfaBadge.textContent = liveWho ? liveWho.hfaLabel : '—';
      hfaBadge.className = `inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.hfaTone)}`;
    }
    if (hfaCode) hfaCode.textContent = liveWho ? `Code: ${liveWho.hfaCode}` : '—';

    const wfhZ = document.getElementById('optplus-wfh-z');
    const wfhBadge = document.getElementById('optplus-wfh-badge');
    const wfhCode = document.getElementById('optplus-wfh-code');
    if (wfhZ) wfhZ.textContent = liveWho ? `${liveWho.zWFH >= 0 ? '+' : ''}${liveWho.zWFH} SD` : '—';
    if (wfhBadge) {
      wfhBadge.textContent = liveWho ? liveWho.wfhLabel : '—';
      wfhBadge.className = `inline-block px-2 py-0.5 rounded text-[11px] font-bold ${liveToneBadgeClass(liveWho?.wfhTone)}`;
    }
    if (wfhCode) wfhCode.textContent = liveWho ? `Code: ${liveWho.wfhCode}` : '—';
  }

  window.switchOptPlusTab = (tab: 'intake' | 'goals') => {
    appState.optplusActiveTab = tab;
    renderOptPlusWorkspace();
  };

  window.optplusSyncFormField = (field: string, value: any) => {
    if (!appState.optplusForm) appState.optplusForm = createBlankOptPlusForm(appState.doctor);
    appState.optplusForm[field] = value;
    updateOptPlusLiveIntakeDom();
  };

  window.optplusResetIntakeForm = () => {
    const prevBrgy = appState.optplusForm?.barangay || '';
    const prevCity = appState.optplusForm?.city || '';
    const prevProv = appState.optplusForm?.province || '';
    appState.optplusForm = createBlankOptPlusForm(appState.doctor);
    appState.optplusForm.barangay = prevBrgy;
    appState.optplusForm.city = prevCity;
    appState.optplusForm.province = prevProv;
    if (appState.currentView === 'optplus') {
      renderOptPlusWorkspace();
      showToast('Cleared OPT+ Child Intake Form.');
    }
  };

  window.optplusSaveChildRecord = () => {
    const f = appState.optplusForm || {};
    const childName = (f.childName || '').trim();
    if (!childName) {
      showToast("Please enter the Child's Full Name.", 'warning');
      return;
    }
    const measureDate = f.measureDate || new Date().toISOString().split('T')[0];
    const ageMonths = computeOptCompletedMonths(f.dob, measureDate);
    if (ageMonths === null || ageMonths < 0 || ageMonths > 59) {
      showToast('Child must be 0 to 59 completed months old for OPT Plus.', 'warning');
      return;
    }
    const weight = parseFloat(f.weight);
    const height = parseFloat(f.height);
    if (!weight || !height) {
      showToast('Please enter valid Weight (kg) and Length/Height (cm).', 'warning');
      return;
    }

    const sex: 'Male' | 'Female' = f.sex === 'Female' ? 'Female' : 'Male';
    const muac = (f.muac || '').trim();
    const edema = f.edema || 'None';
    const who = classifyChildWHO({
      sex,
      ageMonths,
      weight,
      height,
      muac,
      edema
    });

    const editId = f.id || '';
    const recordId = editId || `OPT-${Date.now().toString(36).toUpperCase()}`;
    const existingIdx = (appState.optplusRecords || []).findIndex((r: any) => r.id === recordId);
    const existingVisits =
      existingIdx >= 0 && Array.isArray(appState.optplusRecords[existingIdx].visitHistory)
        ? [...appState.optplusRecords[existingIdx].visitHistory]
        : [];

    const recordObj: any = {
      id: recordId,
      region: '',
      province: (f.province || '').trim(),
      city: (f.city || '').trim(),
      barangay: (f.barangay || '').trim(),
      optYear: f.optYear || String(new Date().getFullYear()),
      purok: (f.purok || '').trim(),
      measureDate,
      measurer: (f.measurer || '').trim() || (appState.doctor?.name || ''),
      childName,
      sex,
      dob: f.dob,
      ageMonths,
      motherName: (f.motherName || '').trim(),
      is4ps: (f.is4ps === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No',
      isIp: (f.isIp === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No',
      weight,
      height,
      muac,
      edema,
      srvVitA: Boolean(f.srvVitA),
      srvDeworm: Boolean(f.srvDeworm),
      srvIycf: Boolean(f.srvIycf),
      remarks: (f.remarks || '').trim(),
      who
    };

    const snapshotCopy = JSON.parse(JSON.stringify(recordObj));
    const vIdx = existingVisits.findIndex((v: any) => v.date === measureDate);
    if (vIdx >= 0) {
      existingVisits[vIdx] = { date: measureDate, snapshot: snapshotCopy };
    } else {
      existingVisits.unshift({ date: measureDate, snapshot: snapshotCopy });
    }
    recordObj.visitHistory = existingVisits;

    if (existingIdx >= 0) {
      appState.optplusRecords[existingIdx] = recordObj;
    } else {
      appState.optplusRecords.unshift(recordObj);
    }

    saveOptPlusRecordsToStorage(appState.optplusRecords);
    saveState();
    const savedBrgy = recordObj.barangay;
    const savedCity = recordObj.city;
    const savedProv = recordObj.province;
    appState.optplusForm = createBlankOptPlusForm(appState.doctor);
    appState.optplusForm.barangay = savedBrgy;
    appState.optplusForm.city = savedCity;
    appState.optplusForm.province = savedProv;

    appState.recordsActiveTab = 'optplus';
    appState.registryOpenFolderPatientId = recordObj.id;
    appState.registryOpenVisitFolderKey = `${recordObj.id}__${measureDate}`;
    switchView('records');
    showToast(`Saved ${recordObj.childName}'s OPTPlus Folder to Patient Records!`);
  };

  window.optplusEditRecord = (id: string) => {
    const rec = (appState.optplusRecords || []).find((r: any) => r.id === id);
    if (!rec) return;
    appState.optplusForm = {
      id: rec.id,
      barangay: rec.barangay || '',
      city: rec.city || '',
      province: rec.province || '',
      optYear: rec.optYear || String(new Date().getFullYear()),
      measureDate: rec.measureDate,
      measurer: rec.measurer || (appState.doctor?.name || ''),
      childName: rec.childName,
      sex: rec.sex,
      dob: rec.dob,
      motherName: rec.motherName,
      purok: rec.purok,
      is4ps: rec.is4ps || 'No',
      isIp: rec.isIp || 'No',
      remarks: rec.remarks || '',
      weight: String(rec.weight),
      height: String(rec.height),
      muac: rec.muac ? String(rec.muac) : '',
      edema: rec.edema || 'None',
      srvVitA: Boolean(rec.srvVitA),
      srvDeworm: Boolean(rec.srvDeworm),
      srvIycf: Boolean(rec.srvIycf)
    };
    appState.optplusActiveTab = 'intake';
    renderOptPlusWorkspace();
    showToast(`Editing OPT+ record: ${rec.childName}`);
  };

  window.optplusDeleteRecord = (id: string) => {
    window.deletePatientRecord(id);
  };

  window.optplusUpdateGoalParam = (key: string, val: any) => {
    if (!appState.optplusGoals) {
      appState.optplusGoals = {
        totalPop: 3500,
        popFactor: 10.8,
        manualTarget: '',
        targetCovPct: 95,
        daysLeft: 15,
        stuntRedPct: 25,
        wasteRedPct: 50,
        uwRedPct: 30
      };
    }
    appState.optplusGoals[key] = val;
    renderOptPlusWorkspace();
  };

  function showOptPlusCardInModal(rec: any): void {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    const rawName = (rec.childName || 'Child_Card').replace(/[^a-zA-Z0-9_-]/g, '_');
    content.innerHTML = `
      <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b border-teal-600/30 px-6 py-4 flex items-center justify-between gap-3 rounded-t-2xl">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-teal-100 block">Individual Child Growth &amp; Nutrition Card</span>
          <h3 class="medflow-title text-sm sm:text-[15px] font-extrabold text-white">${escapeHTML(rec.childName)} (${escapeHTML(rec.id)})</h3>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="optplusDownloadChildCardPdf('${escapeHTML(rawName)}')" class="px-3.5 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer">
            Download PDF
          </button>
          <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-lg bg-teal-950/50 hover:bg-teal-950 text-teal-100 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer">✕</button>
        </div>
      </div>
      <div class="p-4 sm:p-6 bg-slate-100 max-h-[78vh] overflow-y-auto rounded-b-2xl">
        ${buildOptPlusChildCardPrintableHTML(rec)}
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  window.optplusOpenChildCardModal = (id: string) => {
    const rec = (appState.optplusRecords || []).find((r: any) => r.id === id);
    if (!rec) return;
    showOptPlusCardInModal(rec);
  };

  window.optplusPreviewCurrentFormCard = () => {
    const f = appState.optplusForm || {};
    const measureDate = f.measureDate || new Date().toISOString().split('T')[0];
    const rawAge = computeOptCompletedMonths(f.dob, measureDate);
    const ageMonths = rawAge !== null && rawAge >= 0 ? Math.min(59, rawAge) : 0;
    const sex: 'Male' | 'Female' = f.sex === 'Female' ? 'Female' : 'Male';
    const weight = parseFloat(f.weight) || 0;
    const height = parseFloat(f.height) || 0;
    const muac = (f.muac || '').trim() || '';
    const edema = f.edema || 'None';
    const who = classifyChildWHO({ sex, ageMonths, weight: weight || 8.5, height: height || 72, muac, edema });

    const tempRec = {
      id: f.id || 'OPT-PREVIEW',
      region: '',
      province: f.province || '—',
      city: f.city || '—',
      barangay: f.barangay || '—',
      optYear: f.optYear || String(new Date().getFullYear()),
      purok: f.purok || '—',
      measureDate,
      measurer: f.measurer || (appState.doctor?.name || '—'),
      childName: (f.childName || '').trim() || '—',
      sex,
      dob: f.dob || '—',
      ageMonths,
      motherName: f.motherName || '—',
      is4ps: (f.is4ps === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No',
      isIp: (f.isIp === 'Yes' ? 'Yes' : 'No') as 'Yes' | 'No',
      weight,
      height,
      muac,
      edema,
      srvVitA: Boolean(f.srvVitA),
      srvDeworm: Boolean(f.srvDeworm),
      srvIycf: Boolean(f.srvIycf),
      remarks: f.remarks || '',
      who
    };
    showOptPlusCardInModal(tempRec);
  };

  window.optplusDownloadChildCardPdf = (rawName = 'Child_Card') => {
    window.downloadPdfElement('optplus-child-card-printable', `OPTPlus_Child_Nutrition_Card_${rawName}.pdf`, 'a4');
  };

  window.optplusExportForm1APdf = () => {
    const brgy = (appState.optplusForm?.barangay || 'Barangay').replace(/[^a-zA-Z0-9_-]/g, '_');
    window.downloadPdfElement('optplus-form1a-sheet', `OPTPlus_Form1A_Masterlist_${brgy}.pdf`, 'a4');
  };

  window.optplusExportGoalReportPdf = () => {
    const brgy = (appState.optplusForm?.barangay || 'Barangay').replace(/[^a-zA-Z0-9_-]/g, '_');
    window.downloadPdfElement('optplus-goal-report-sheet', `OPTPlus_BNAP_Goal_Computation_${brgy}.pdf`, 'a4');
  };

  window.optplusExportMasterlistCSV = () => {
    const records = appState.optplusRecords || [];
    const headers = [
      'OPT_ID',
      'Child_Name',
      'Sex',
      'DOB',
      'Date_Measured',
      'Age_Months',
      'Purok',
      'Mother_Caregiver',
      '4Ps',
      'IP',
      'Weight_kg',
      'Height_cm',
      'MUAC_cm',
      'Edema',
      'WFA_Status',
      'WFA_Z',
      'LHFA_Status',
      'LHFA_Z',
      'WFLH_Status',
      'WFLH_Z',
      'Vit_A',
      'Dewormed',
      'IYCF',
      'Remarks'
    ];
    const rows = records.map((r: any) => {
      const w = r.who || classifyChildWHO({
        sex: r.sex,
        ageMonths: r.ageMonths,
        weight: r.weight,
        height: r.height,
        muac: r.muac || '',
        edema: r.edema || 'None'
      });
      const cols = [
        r.id,
        r.childName,
        r.sex,
        r.dob,
        r.measureDate,
        r.ageMonths,
        r.purok,
        r.motherName,
        r.is4ps,
        r.isIp,
        r.weight,
        r.height,
        r.muac || '',
        r.edema || 'None',
        w.wfaCode,
        w.zWFA,
        w.hfaCode,
        w.zHFA,
        w.wfhCode,
        w.zWFH,
        r.srvVitA ? 'Yes' : 'No',
        r.srvDeworm ? 'Yes' : 'No',
        r.srvIycf ? 'Yes' : 'No',
        r.remarks || ''
      ];
      return cols.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OPTPlus_Form1A_Masterlist_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Exported OPT+ Form 1A Masterlist CSV.');
  };

  // ============================================================================
  // INITIALIZE SESSION OR SHOW SIGN-IN / SIGN-UP / HIDDEN ADMIN PORTAL
  // ============================================================================
  loadClinicianAccounts();
  const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (savedSessionId) {
    if (isClinicianDeletedLocally(savedSessionId) || isClinicianBannedLocally(savedSessionId)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      appState.activeClinician = null;
    } else {
      const found = appState.clinicianAccounts.find((a: ClinicianAccount) => a.id === savedSessionId);
      if (
        found &&
        !isClinicianDeletedLocally(found.id, found.email, found.username) &&
        !isClinicianBannedLocally(found.id, found.email, found.username) &&
        found.approvalStatus !== 'banned'
      ) {
        appState.activeClinician = found;
        syncDoctorFromClinician(found);
        loadClinicianWorkspace(found.id);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        appState.activeClinician = null;
      }
    }
  }

  // Listen for cross-tab storage changes (e.g., Admin bans or deletes an account while user is open in another tab offline)
  window.addEventListener('storage', (ev: StorageEvent) => {
    if (
      ev.key === ACCOUNTS_STORAGE_KEY ||
      ev.key === SESSION_STORAGE_KEY ||
      ev.key === 'medflow_ph_deleted_clinicians_tombstones_v1' ||
      ev.key === 'medflow_ph_banned_clinicians_ledger_v1'
    ) {
      try {
        const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            appState.clinicianAccounts = sanitizeAndFilterClinicianAccounts(parsed);
          }
        }
      } catch {
        // Ignore parse errors
      }
      if (!isHiddenAdminPortalRoute()) {
        if (!enforceActiveSessionValidity()) {
          renderAuthScreen();
        }
      }
    }
  });

  window.addEventListener('hashchange', () => {
    if (isHiddenAdminPortalRoute()) {
      renderHiddenAdminPortal();
    } else if (enforceActiveSessionValidity() && canClinicianAccessApp(appState.activeClinician)) {
      switchView(appState.currentView || 'home');
    } else {
      renderAuthScreen();
    }
  });

  window.addEventListener('popstate', () => {
    if (isHiddenAdminPortalRoute()) {
      renderHiddenAdminPortal();
    } else if (enforceActiveSessionValidity() && canClinicianAccessApp(appState.activeClinician)) {
      switchView(appState.currentView || 'home');
    } else {
      renderAuthScreen();
    }
  });

  updateHeaderDoctorName();
  if (isHiddenAdminPortalRoute()) {
    renderHiddenAdminPortal();
  } else if (enforceActiveSessionValidity() && canClinicianAccessApp(appState.activeClinician)) {
    switchView('home');
  } else {
    renderAuthScreen();
  }
}
