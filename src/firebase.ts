import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
  approvalStatus: 'pending' | 'approved' | 'rejected';
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
  } catch {
    // Keep in queue for next online event
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
  } catch {
    // Keep in queue for next online event
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
  } catch {
    queuePendingClinicianSync(account);
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
  } catch {
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
  } catch {
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
  } catch {
    return null;
  }
}
