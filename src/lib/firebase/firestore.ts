// ============================================================
// Austranet CCO - Firestore Service
// ============================================================

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryConstraint,
  Firestore,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseApp } from './config';

let db: Firestore;

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

// Helper to convert Firestore timestamps to Date objects
export function convertTimestamps<T extends DocumentData>(data: T): T {
  const converted = { ...data };
  for (const key in converted) {
    const value = converted[key] as unknown;
    if (value && typeof value === 'object' && 'toDate' in value && typeof (value as Timestamp).toDate === 'function') {
      (converted as Record<string, unknown>)[key] = (value as Timestamp).toDate();
    } else if (typeof value === 'object' && value !== null) {
      (converted as Record<string, unknown>)[key] = convertTimestamps(value as DocumentData);
    }
  }
  return converted;
}

// Generic get document with type safety
export async function getDocument<T>(
  collectionPath: string,
  documentId: string
): Promise<T | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionPath, documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return { id: docSnap.id, ...convertTimestamps(data) } as T;
}

// Generic get documents with query constraints
export async function getDocuments<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getFirestoreDb();
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as T[];
}

// Generic add document
export async function addDocument<T extends DocumentData>(
  collectionPath: string,
  data: Omit<T, 'id'>,
  userId: string
): Promise<string> {
  const db = getFirestoreDb();
  const collectionRef = collection(db, collectionPath);

  const docData = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: userId,
    updatedBy: userId,
  };

  const docRef = await addDoc(collectionRef, docData);
  return docRef.id;
}

// Generic update document
export async function updateDocument<T extends DocumentData>(
  collectionPath: string,
  documentId: string,
  data: Partial<T>,
  userId: string
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionPath, documentId);

  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });
}

// Soft delete document (sets deletedAt timestamp)
export async function softDeleteDocument(
  collectionPath: string,
  documentId: string,
  userId: string
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionPath, documentId);

  await updateDoc(docRef, {
    deletedAt: Timestamp.now(),
    deletedBy: userId,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });
}

// Hard delete document
export async function hardDeleteDocument(
  collectionPath: string,
  documentId: string
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionPath, documentId);
  await deleteDoc(docRef);
}

// Batch write operations
export async function batchWrite(
  operations: Array<{
    type: 'add' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: DocumentData;
  }>
): Promise<void> {
  const db = getFirestoreDb();
  const batch = writeBatch(db);

  for (const op of operations) {
    const collectionRef = collection(db, op.collection);

    if (op.type === 'add' && op.data) {
      const docRef = doc(collectionRef);
      batch.set(docRef, op.data);
    } else if (op.type === 'update' && op.id && op.data) {
      const docRef = doc(db, op.collection, op.id);
      batch.update(docRef, op.data);
    } else if (op.type === 'delete' && op.id) {
      const docRef = doc(db, op.collection, op.id);
      batch.delete(docRef);
    }
  }

  await batch.commit();
}

// Subscribe to document changes (real-time)
export function subscribeToDocument<T>(
  collectionPath: string,
  documentId: string,
  callback: (data: T | null) => void
): () => void {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionPath, documentId);

  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...convertTimestamps(doc.data()) } as T);
    } else {
      callback(null);
    }
  });
}

// Subscribe to collection changes (real-time)
export function subscribeToCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): () => void {
  const db = getFirestoreDb();
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    })) as T[];
    callback(data);
  });
}

// Export commonly used Firestore functions
export {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  db,
};
