// ============================================================
// Austranet CCO - Firebase Auth Service
// ============================================================

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  User,
  Auth,
} from 'firebase/auth';
import { getFirebaseApp } from './config';

let auth: Auth;

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Sign in with Google
export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Sign out
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

// Create new user with email and password
export async function createUser(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(result.user, { displayName });
  }

  // Send email verification
  await sendEmailVerification(result.user);

  return result.user;
}

// Get current user
export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth.currentUser;
}

/**
 * Retorna el UID del usuario autenticado.
 * Lanza error si no hay sesión activa — úsalo únicamente dentro de operaciones
 * de escritura en Firestore que requieren autenticación previa.
 */
export function getCurrentUserId(): string {
  const auth = getFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuario no autenticado');
  return uid;
}

/**
 * Retorna el nombre visible del usuario autenticado (displayName | email | 'Sistema').
 * Nunca lanza — si no hay sesión devuelve 'Sistema'.
 */
export function getCurrentUserName(): string {
  const auth = getFirebaseAuth();
  return auth.currentUser?.displayName || auth.currentUser?.email || 'Sistema';
}

// Export auth instance for direct access
export { auth };
