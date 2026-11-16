import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  disableNetwork,
  enableNetwork,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence internal @firebase/firestore 10-second WebChannel timeout console errors
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export { firebaseConfig };

let firestoreSdkOnline = false;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  void errInfo;
}

const FIRESTORE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${encodeURIComponent(
  firebaseConfig.firestoreDatabaseId || '(default)'
)}/documents`;

function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Firestore SDK timeout')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function toFirestoreValue(val: unknown): Record<string, unknown> {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  return { stringValue: String(val) };
}

function fromFirestoreFields<T>(fields: Record<string, Record<string, unknown>> | undefined): T {
  const out: Record<string, unknown> = {};
  if (!fields) return out as T;
  for (const [key, valObj] of Object.entries(fields)) {
    if ('stringValue' in valObj) out[key] = valObj.stringValue;
    else if ('integerValue' in valObj) out[key] = Number(valObj.integerValue);
    else if ('doubleValue' in valObj) out[key] = Number(valObj.doubleValue);
    else if ('booleanValue' in valObj) out[key] = Boolean(valObj.booleanValue);
    else if ('nullValue' in valObj) out[key] = undefined;
  }
  return out as T;
}

export async function probeFirestoreConnectivity(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    firestoreSdkOnline = false;
    await disableNetwork(db).catch(() => {});
    return false;
  }
  try {
    const probeUrl = `${FIRESTORE_REST_BASE}/test/connection?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
    const res = await fetchWithTimeout(probeUrl, { method: 'GET' }, 3000);
    if (res.ok || res.status === 404) {
      if (!firestoreSdkOnline) {
        firestoreSdkOnline = true;
        await enableNetwork(db).catch(() => {});
        await withTimeout(getDocFromServer(doc(db, 'test', 'connection')), 3000).catch(() => {});
      }
      return true;
    }
    firestoreSdkOnline = false;
    await disableNetwork(db).catch(() => {});
    return false;
  } catch {
    firestoreSdkOnline = false;
    await disableNetwork(db).catch(() => {});
    return false;
  }
}

async function testConnection(): Promise<void> {
  await disableNetwork(db).catch(() => {});
  const connected = await probeFirestoreConnectivity();
  if (connected) {
    void flushOfflineSyncQueue();
  }
}
void testConnection();

export interface ClinicianAccount {
  id: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  name: string;
  role: 'Doctor' | 'Medical Clerk' | 'Medical Intern';
  specialty: string;
  facility: string;
  address: string;
  school: string;
  supervisingDoctor: string;
  prc: string;
  ptr: string;
  s2: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'banned';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionMonths?: number;
  subscriptionAmountPhp?: number;
  gcashReference?: string;
  gcashReceiptDataUrl?: string;
  createdAt: string;
}

export interface PendingWorkspaceSyncItem {
  clinicianId: string;
  patientsJson: string;
  bakunxtJson?: string;
  optplusJson?: string;
  updatedAt: string;
}

export interface RemoteWorkspaceSnapshot {
  patients: unknown[];
  bakunxtPatients?: unknown[];
  optplusRecords?: unknown[];
  updatedAt: string;
}

const PENDING_CLINICIANS_SYNC_KEY = 'medflow_ph_pending_clinicians_sync';
const PENDING_WORKSPACES_SYNC_KEY = 'medflow_ph_pending_workspaces_sync';

function isBrowserOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

function hasPendingSyncItems(): boolean {
  try {
    const rawClinicians = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
    if (rawClinicians) {
      const map = JSON.parse(rawClinicians) as Record<string, unknown>;
      if (Object.keys(map).length > 0) return true;
    }
    const rawWorkspaces = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
    if (rawWorkspaces) {
      const map = JSON.parse(rawWorkspaces) as Record<string, unknown>;
      if (Object.keys(map).length > 0) return true;
    }
  } catch {
    // Ignore parse errors
  }
  return false;
}

function queuePendingClinicianSync(account: ClinicianAccount): void {
  try {
    const raw = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
    const map: Record<string, ClinicianAccount> = raw ? JSON.parse(raw) : {};
    map[account.id] = account;
    localStorage.setItem(PENDING_CLINICIANS_SYNC_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

function removeSyncedClinicianFromQueue(clinicianId: string, syncedCreatedAt: string): void {
  try {
    const raw = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
    if (!raw) return;
    const map: Record<string, ClinicianAccount> = JSON.parse(raw);
    if (map[clinicianId] && map[clinicianId].createdAt === syncedCreatedAt) {
      delete map[clinicianId];
      if (Object.keys(map).length === 0) {
        localStorage.removeItem(PENDING_CLINICIANS_SYNC_KEY);
      } else {
        localStorage.setItem(PENDING_CLINICIANS_SYNC_KEY, JSON.stringify(map));
      }
    }
  } catch {
    // Ignore storage errors
  }
}

function queuePendingWorkspaceSync(
  clinicianId: string,
  patients: unknown[],
  bakunxtPatients: unknown[] | undefined,
  optplusRecords: unknown[] | undefined,
  updatedAt: string
): PendingWorkspaceSyncItem {
  const item: PendingWorkspaceSyncItem = {
    clinicianId,
    patientsJson: JSON.stringify(patients ?? []),
    updatedAt
  };
  if (Array.isArray(bakunxtPatients)) {
    item.bakunxtJson = JSON.stringify(bakunxtPatients);
  }
  if (Array.isArray(optplusRecords)) {
    item.optplusJson = JSON.stringify(optplusRecords);
  }
  try {
    const raw = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
    const map: Record<string, PendingWorkspaceSyncItem> = raw ? JSON.parse(raw) : {};
    map[clinicianId] = item;
    localStorage.setItem(PENDING_WORKSPACES_SYNC_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
  return item;
}

function removeSyncedWorkspaceFromQueue(clinicianId: string, syncedUpdatedAt: string): void {
  try {
    const raw = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
    if (!raw) return;
    const map: Record<string, PendingWorkspaceSyncItem> = JSON.parse(raw);
    if (map[clinicianId] && map[clinicianId].updatedAt === syncedUpdatedAt) {
      delete map[clinicianId];
      if (Object.keys(map).length === 0) {
        localStorage.removeItem(PENDING_WORKSPACES_SYNC_KEY);
      } else {
        localStorage.setItem(PENDING_WORKSPACES_SYNC_KEY, JSON.stringify(map));
      }
    }
  } catch {
    // Ignore storage errors
  }
}

async function restUpsertDoc(collectionName: string, docId: string, data: Record<string, unknown>): Promise<void> {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  const url = `${FIRESTORE_REST_BASE}/${collectionName}/${encodeURIComponent(docId)}?key=${encodeURIComponent(
    firebaseConfig.apiKey
  )}`;
  const res = await fetchWithTimeout(
    url,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    },
    3500
  );
  if (!res.ok) {
    throw new Error(`Firestore REST PATCH failed (${res.status})`);
  }
}

let isFlushingSyncQueue = false;
let pendingFlushRequested = false;
let workspaceSyncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleBackgroundSyncFlush(delayMs = 450): void {
  if (workspaceSyncDebounceTimer !== null) {
    clearTimeout(workspaceSyncDebounceTimer);
  }
  workspaceSyncDebounceTimer = setTimeout(() => {
    workspaceSyncDebounceTimer = null;
    void flushOfflineSyncQueue();
  }, delayMs);
}

export async function flushOfflineSyncQueue(): Promise<void> {
  if (!isBrowserOnline()) return;

  if (isFlushingSyncQueue) {
    pendingFlushRequested = true;
    return;
  }

  if (!hasPendingSyncItems() && firestoreSdkOnline) {
    return;
  }

  isFlushingSyncQueue = true;
  try {
    if (!firestoreSdkOnline) {
      const reachable = await probeFirestoreConnectivity();
      if (!reachable) return;
    }

    try {
      const rawClinicians = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
      if (rawClinicians) {
        const map: Record<string, ClinicianAccount> = JSON.parse(rawClinicians);
        const entries = Object.values(map);
        for (const acc of entries) {
          if (!isBrowserOnline()) break;
          try {
            await restUpsertDoc('clinicians', acc.id, acc as unknown as Record<string, unknown>);
            removeSyncedClinicianFromQueue(acc.id, acc.createdAt);
          } catch (err) {
            if (firestoreSdkOnline) {
              await withTimeout(setDoc(doc(db, 'clinicians', acc.id), acc, { merge: true }), 3500);
              removeSyncedClinicianFromQueue(acc.id, acc.createdAt);
            } else {
              throw err;
            }
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'clinicians');
    }

    try {
      const rawWorkspaces = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
      if (rawWorkspaces) {
        const map: Record<string, PendingWorkspaceSyncItem> = JSON.parse(rawWorkspaces);
        const entries = Object.values(map);
        for (const item of entries) {
          if (!isBrowserOnline()) break;
          const payload: Record<string, unknown> = {
            clinicianId: item.clinicianId,
            patientsJson: item.patientsJson,
            updatedAt: item.updatedAt
          };
          if (typeof item.bakunxtJson === 'string') {
            payload.bakunxtJson = item.bakunxtJson;
          }
          if (typeof item.optplusJson === 'string') {
            payload.optplusJson = item.optplusJson;
          }
          try {
            await restUpsertDoc('workspaces', item.clinicianId, payload);
            removeSyncedWorkspaceFromQueue(item.clinicianId, item.updatedAt);
          } catch (err) {
            if (firestoreSdkOnline) {
              await withTimeout(setDoc(doc(db, 'workspaces', item.clinicianId), payload, { merge: true }), 3500);
              removeSyncedWorkspaceFromQueue(item.clinicianId, item.updatedAt);
            } else {
              throw err;
            }
          }
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'workspaces');
    }
  } finally {
    isFlushingSyncQueue = false;
    if (pendingFlushRequested && isBrowserOnline()) {
      pendingFlushRequested = false;
      scheduleBackgroundSyncFlush(250);
    } else {
      pendingFlushRequested = false;
    }
  }
}

let backgroundSyncStarted = false;

export function startBackgroundSyncService(): void {
  if (backgroundSyncStarted || typeof window === 'undefined') return;
  backgroundSyncStarted = true;

  window.addEventListener('online', () => {
    void flushOfflineSyncQueue();
  });

  window.addEventListener('offline', () => {
    firestoreSdkOnline = false;
    void disableNetwork(db).catch(() => {});
  });

  window.addEventListener('focus', () => {
    if (isBrowserOnline() && (hasPendingSyncItems() || !firestoreSdkOnline)) {
      void flushOfflineSyncQueue();
    }
  });

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && isBrowserOnline() && (hasPendingSyncItems() || !firestoreSdkOnline)) {
        void flushOfflineSyncQueue();
      }
    });
  }

  setInterval(() => {
    if (isBrowserOnline() && (hasPendingSyncItems() || !firestoreSdkOnline)) {
      void flushOfflineSyncQueue();
    }
  }, 15000);
}

startBackgroundSyncService();

export async function syncClinicianToFirestore(account: ClinicianAccount): Promise<void> {
  queuePendingClinicianSync(account);
  if (!isBrowserOnline()) {
    return;
  }
  try {
    await restUpsertDoc('clinicians', account.id, account as unknown as Record<string, unknown>);
    removeSyncedClinicianFromQueue(account.id, account.createdAt);
    firestoreSdkOnline = true;
  } catch {
    if (!firestoreSdkOnline) {
      scheduleBackgroundSyncFlush(1500);
      return;
    }
    try {
      await withTimeout(setDoc(doc(db, 'clinicians', account.id), account, { merge: true }), 3500);
      removeSyncedClinicianFromQueue(account.id, account.createdAt);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `clinicians/${account.id}`);
      scheduleBackgroundSyncFlush(2000);
    }
  }
}

export async function deleteClinicianFromFirestore(clinicianId: string): Promise<void> {
  if (!isBrowserOnline()) return;
  try {
    const url = `${FIRESTORE_REST_BASE}/clinicians/${encodeURIComponent(clinicianId)}?key=${encodeURIComponent(
      firebaseConfig.apiKey
    )}`;
    const res = await fetchWithTimeout(url, { method: 'DELETE' }, 3500);
    if (!res.ok && firestoreSdkOnline) {
      await withTimeout(deleteDoc(doc(db, 'clinicians', clinicianId)), 3500);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `clinicians/${clinicianId}`);
  }
}

export async function fetchAllCliniciansFromFirestore(): Promise<ClinicianAccount[]> {
  if (!isBrowserOnline()) {
    return [];
  }
  try {
    await flushOfflineSyncQueue();
    const url = `${FIRESTORE_REST_BASE}/clinicians?pageSize=200&key=${encodeURIComponent(firebaseConfig.apiKey)}`;
    const res = await fetchWithTimeout(url, { method: 'GET' }, 3500);
    if (res.ok) {
      firestoreSdkOnline = true;
      const json = (await res.json()) as {
        documents?: Array<{ fields?: Record<string, Record<string, unknown>> }>;
      };
      const list: ClinicianAccount[] = [];
      for (const docItem of json.documents || []) {
        const parsed = fromFirestoreFields<ClinicianAccount>(docItem.fields);
        if (parsed && parsed.id) {
          list.push(parsed);
        }
      }
      return list;
    }
    if (!firestoreSdkOnline) {
      return [];
    }
    const snap = await withTimeout(getDocs(collection(db, 'clinicians')), 3500);
    const list: ClinicianAccount[] = [];
    snap.forEach((d) => {
      list.push(d.data() as ClinicianAccount);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'clinicians');
    return [];
  }
}

export async function syncWorkspaceToFirestore(
  clinicianId: string,
  patients: unknown[],
  bakunxtPatients?: unknown[],
  optplusRecords?: unknown[]
): Promise<void> {
  if (!clinicianId) return;
  const updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(`medflow_ph_workspace_ts_${clinicianId}`, updatedAt);
  } catch {
    // Ignore storage errors
  }

  // Always enqueue the latest snapshot immediately in localStorage so no record update is ever lost offline
  queuePendingWorkspaceSync(clinicianId, patients, bakunxtPatients, optplusRecords, updatedAt);

  if (!isBrowserOnline()) {
    return;
  }

  // Schedule a debounced background flush so rapid form edits coalesce into a clean Firestore write
  scheduleBackgroundSyncFlush(450);
}

function parseRemoteWorkspaceFields(data: {
  clinicianId?: string;
  patientsJson?: string;
  bakunxtJson?: string;
  optplusJson?: string;
  updatedAt?: string;
}): RemoteWorkspaceSnapshot | null {
  if (!data || typeof data.patientsJson !== 'string') return null;
  let patients: unknown[] = [];
  let bakunxtPatients: unknown[] | undefined;
  let optplusRecords: unknown[] | undefined;

  try {
    const parsedPatients = JSON.parse(data.patientsJson);
    if (Array.isArray(parsedPatients)) patients = parsedPatients;
  } catch {
    patients = [];
  }

  if (typeof data.bakunxtJson === 'string' && data.bakunxtJson.trim()) {
    try {
      const parsedBaku = JSON.parse(data.bakunxtJson);
      if (Array.isArray(parsedBaku)) bakunxtPatients = parsedBaku;
    } catch {
      // Ignore malformed JSON
    }
  }

  if (typeof data.optplusJson === 'string' && data.optplusJson.trim()) {
    try {
      const parsedOpt = JSON.parse(data.optplusJson);
      if (Array.isArray(parsedOpt)) optplusRecords = parsedOpt;
    } catch {
      // Ignore malformed JSON
    }
  }

  return {
    patients,
    bakunxtPatients,
    optplusRecords,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : ''
  };
}

export async function fetchWorkspaceFromFirestore(
  clinicianId: string
): Promise<RemoteWorkspaceSnapshot | null> {
  if (!isBrowserOnline()) {
    return null;
  }
  try {
    await flushOfflineSyncQueue();
    const url = `${FIRESTORE_REST_BASE}/workspaces/${encodeURIComponent(clinicianId)}?key=${encodeURIComponent(
      firebaseConfig.apiKey
    )}`;
    const res = await fetchWithTimeout(url, { method: 'GET' }, 3500);
    if (res.ok) {
      firestoreSdkOnline = true;
      const json = (await res.json()) as { fields?: Record<string, Record<string, unknown>> };
      const data = fromFirestoreFields<{
        clinicianId?: string;
        patientsJson?: string;
        bakunxtJson?: string;
        optplusJson?: string;
        updatedAt?: string;
      }>(json.fields);
      return parseRemoteWorkspaceFields(data);
    } else if (res.status === 404) {
      return null;
    }

    if (!firestoreSdkOnline) {
      return null;
    }

    const snap = await withTimeout(getDoc(doc(db, 'workspaces', clinicianId)), 3500);
    if (snap.exists()) {
      const data = snap.data() as {
        clinicianId?: string;
        patientsJson?: string;
        bakunxtJson?: string;
        optplusJson?: string;
        updatedAt?: string;
      };
      return parseRemoteWorkspaceFields(data);
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `workspaces/${clinicianId}`);
    return null;
  }
}
