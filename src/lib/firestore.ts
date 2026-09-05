import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PortfolioSettings, Project, ProjectInput } from '../types/portfolio';
import { defaultSettings } from '../types/portfolio';

const projectsCollection = () => {
  if (!db) throw new Error('Firebase ainda não foi configurado.');
  return collection(db, 'projects');
};

function projectFromSnapshot(snapshot: { id: string; data: () => Record<string, unknown> }) {
  return { id: snapshot.id, ...snapshot.data() } as Project;
}

export async function getPublishedProjects() {
  const snapshot = await getDocs(query(projectsCollection(), where('published', '==', true)));
  return snapshot.docs
    .map(projectFromSnapshot)
    .sort((a, b) => a.order - b.order);
}

export async function getAllProjects() {
  const snapshot = await getDocs(query(projectsCollection(), orderBy('order', 'asc')));
  return snapshot.docs.map(projectFromSnapshot);
}

export async function getProject(id: string) {
  if (!db) throw new Error('Firebase ainda não foi configurado.');
  const snapshot = await getDoc(doc(db, 'projects', id));
  return snapshot.exists() ? projectFromSnapshot(snapshot) : null;
}

export async function saveProject(input: ProjectInput, id?: string) {
  if (!db) throw new Error('Firebase ainda não foi configurado.');
  const projectRef = id ? doc(db, 'projects', id) : doc(collection(db, 'projects'));
  const payload = { ...input, updatedAt: serverTimestamp(), ...(id ? {} : { createdAt: serverTimestamp() }) };

  if (input.featured) {
    const featured = await getDocs(query(projectsCollection(), where('featured', '==', true)));
    const batch = writeBatch(db);
    featured.docs.filter((item) => item.id !== projectRef.id).forEach((item) => batch.update(item.ref, { featured: false, updatedAt: serverTimestamp() }));
    batch.set(projectRef, payload, { merge: true });
    await batch.commit();
  } else if (id) {
    await updateDoc(projectRef, payload);
  } else {
    await setDoc(projectRef, payload);
  }

  return projectRef.id;
}

export async function deleteProject(id: string) {
  if (!db) throw new Error('Firebase ainda não foi configurado.');
  await deleteDoc(doc(db, 'projects', id));
}

export async function getSettings() {
  if (!db) return defaultSettings;
  const snapshot = await getDoc(doc(db, 'settings', 'public'));
  return snapshot.exists() ? { ...defaultSettings, ...snapshot.data() } as PortfolioSettings : defaultSettings;
}

export async function saveSettings(settings: PortfolioSettings) {
  if (!db) throw new Error('Firebase ainda não foi configurado.');
  await setDoc(doc(db, 'settings', 'public'), { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}
