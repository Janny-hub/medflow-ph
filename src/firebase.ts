import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
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
  subscriptionAmountPhp?: number;
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

export async function flushOfflineSyncQueue(): Promise<void> {
  if (!isBrowserOnline()) return;

  try {
    const rawClinicians = localStorage.getItem(PENDING_CLINICIANS_SYNC_KEY);
    if (rawClinicians) {
      const map: Record<string, ClinicianAccount> = JSON.parse(rawClinicians);
      const entries = Object.values(map);
      for (const acc of entries) {
        await setDoc(doc(db, 'clinicians', acc.id), acc, { merge: true });
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
        await setDoc(doc(db, 'workspaces', item.clinicianId), item, { merge: true });
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
    await setDoc(doc(db, 'clinicians', account.id), account, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `clinicians/${account.id}`);
    queuePendingClinicianSync(account);
  }
}

export async function deleteClinicianFromFirestore(clinicianId: string): Promise<void> {
  if (!isBrowserOnline()) return;
  try {
    await deleteDoc(doc(db, 'clinicians', clinicianId));
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
    const snap = await getDocs(collection(db, 'clinicians'));
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

  try {
    await setDoc(
      doc(db, 'workspaces', clinicianId),
      {
        clinicianId,
        patientsJson: JSON.stringify(patients),
        updatedAt
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `workspaces/${clinicianId}`);
    queuePendingWorkspaceSync(clinicianId, patients, updatedAt);
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
    const snap = await getDoc(doc(db, 'workspaces', clinicianId));
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

/**
 * Uploads a patient attachment or generated PDF data URL to Firebase Cloud Storage
 * when online, returning the cloud download URL (or falling back to local dataUrl offline).
 */
export async function uploadAttachmentToFirebaseStorage(
  clinicianId: string,
  fileName: string,
  dataUrl: string
): Promise<{ storagePath: string; downloadUrl: string }> {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `clinicians/${clinicianId}/attachments/${Date.now()}_${safeName}`;
  if (!isBrowserOnline()) {
    return { storagePath, downloadUrl: dataUrl };
  }
  try {
    const fileRef = ref(storage, storagePath);
    await uploadString(fileRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(fileRef);
    return { storagePath, downloadUrl };
  } catch {
    return { storagePath, downloadUrl: dataUrl };
  }
}
