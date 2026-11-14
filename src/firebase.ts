import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
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

const app = initializeApp(firebaseConfig);

// Suppress noisy internal WebChannel timeout console.errors while keeping offline resilience
setLogLevel('warn');

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export { firebaseConfig };

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
  console.warn('Firestore Notice: ', JSON.stringify(errInfo));
}

const FIRESTORE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${encodeURIComponent(
  firebaseConfig.firestoreDatabaseId || '(default)'
)}/documents`;

function withTimeout<T>(promise: Promise<T>, ms = 4500): Promise<T> {
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

async function testConnection(): Promise<void> {
  try {
    await withTimeout(getDocFromServer(doc(db, 'test', 'connection')), 4000);
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore operating in offline/REST fallback mode.');
    }
  }
}
testConnection();

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

const PENDING_CLINICIANS_SYNC_KEY = 'medflow_ph_pending_clinicians_sync';
const PENDING_WORKSPACES_SYNC_KEY = 'medflow_ph_pending_workspaces_sync';

function isBrowserOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
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

function queuePendingWorkspaceSync(clinicianId: string, patients: unknown[], updatedAt: string): void {
  try {
    const raw = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
    const map: Record<string, { clinicianId: string; patientsJson: string; updatedAt: string }> = raw ? JSON.parse(raw) : {};
    map[clinicianId] = {
      clinicianId,
      patientsJson: JSON.stringify(patients),
      updatedAt
    };
    localStorage.setItem(PENDING_WORKSPACES_SYNC_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
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
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) {
    throw new Error(`Firestore REST PATCH failed (${res.status})`);
  }
}

export async function flushOfflineSyncQueue(): Promise<void> {
  if (!isBrowserOnline()) return;

  try {
    const rawClinicians = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
    if (rawClinicians) {
      const map: Record<string, ClinicianAccount> = JSON.parse(rawClinicians);
      const entries = Object.values(map);
      for (const acc of entries) {
        await restUpsertDoc('clinicians', acc.id, acc as unknown as Record<string, unknown>);
      }
      localStorage.removeItem(PENDING_CLINICIANS_SYNC_KEY);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'clinicians');
  }

  try {
    const rawWorkspaces = localStorage.getItem(PENDING_WORKSPACES_SYNC_KEY);
    if (rawWorkspaces) {
      const map: Record<string, { clinicianId: string; patientsJson: string; updatedAt: string }> = JSON.parse(rawWorkspaces);
      const entries = Object.values(map);
      for (const item of entries) {
        await restUpsertDoc('workspaces', item.clinicianId, item as unknown as Record<string, unknown>);
      }
      localStorage.removeItem(PENDING_WORKSPACES_SYNC_KEY);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'workspaces');
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushOfflineSyncQueue();
  });
}

export async function syncClinicianToFirestore(account: ClinicianAccount): Promise<void> {
  if (!isBrowserOnline()) {
    queuePendingClinicianSync(account);
    return;
  }
  try {
    await restUpsertDoc('clinicians', account.id, account as unknown as Record<string, unknown>);
  } catch {
    try {
      await withTimeout(setDoc(doc(db, 'clinicians', account.id), account, { merge: true }), 4000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `clinicians/${account.id}`);
      queuePendingClinicianSync(account);
    }
  }
}

export async function deleteClinicianFromFirestore(clinicianId: string): Promise<void> {
  if (!isBrowserOnline()) return;
  try {
    const url = `${FIRESTORE_REST_BASE}/clinicians/${encodeURIComponent(clinicianId)}?key=${encodeURIComponent(
      firebaseConfig.apiKey
    )}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      await withTimeout(deleteDoc(doc(db, 'clinicians', clinicianId)), 4000);
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
    const res = await fetch(url);
    if (res.ok) {
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
    const snap = await withTimeout(getDocs(collection(db, 'clinicians')), 4000);
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

export async function syncWorkspaceToFirestore(clinicianId: string, patients: unknown[]): Promise<void> {
  const updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(`medflow_ph_workspace_ts_${clinicianId}`, updatedAt);
  } catch {
    // Ignore
  }

  if (!isBrowserOnline()) {
    queuePendingWorkspaceSync(clinicianId, patients, updatedAt);
    return;
  }

  const payload = {
    clinicianId,
    patientsJson: JSON.stringify(patients),
    updatedAt
  };

  try {
    await restUpsertDoc('workspaces', clinicianId, payload);
  } catch {
    try {
      await withTimeout(setDoc(doc(db, 'workspaces', clinicianId), payload, { merge: true }), 4000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `workspaces/${clinicianId}`);
      queuePendingWorkspaceSync(clinicianId, patients, updatedAt);
    }
  }
}

export async function fetchWorkspaceFromFirestore(
  clinicianId: string
): Promise<{ patients: unknown[]; updatedAt: string } | null> {
  if (!isBrowserOnline()) {
    return null;
  }
  try {
    await flushOfflineSyncQueue();
    const url = `${FIRESTORE_REST_BASE}/workspaces/${encodeURIComponent(clinicianId)}?key=${encodeURIComponent(
      firebaseConfig.apiKey
    )}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = (await res.json()) as { fields?: Record<string, Record<string, unknown>> };
      const data = fromFirestoreFields<{ clinicianId?: string; patientsJson?: string; updatedAt?: string }>(
        json.fields
      );
      if (data && typeof data.patientsJson === 'string') {
        return {
          patients: JSON.parse(data.patientsJson),
          updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : ''
        };
      }
    } else if (res.status === 404) {
      return null;
    }

    const snap = await withTimeout(getDoc(doc(db, 'workspaces', clinicianId)), 4000);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.patientsJson === 'string') {
        return {
          patients: JSON.parse(data.patientsJson),
          updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : ''
        };
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `workspaces/${clinicianId}`);
    return null;
  }
}
