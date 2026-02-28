'use client';

// ============================================================
// Austranet CCO - Auth Context
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import { Usuario } from '@/types';

const COLECCION_USUARIOS = 'usuarios';

interface AuthContextType {
  user: Usuario | null;
  firebaseUser: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Fuerza una re-lectura del documento Firestore del usuario actual.
   *  Útil después de crear/actualizar el doc en el flujo de registro. */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helper: convierte un snapshot de Firestore al tipo Usuario ──
function snapToUsuario(id: string, data: Record<string, unknown>): Usuario {
  return { id, ...data } as Usuario;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser]     = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref para acceder siempre al fbUser más reciente sin re-montar el listener
  const firebaseUserRef = useRef<User | null>(null);

  /**
   * Carga el documento de usuario desde Firestore.
   *
   * Estrategia de búsqueda:
   *   1. Por UID  (camino principal, más rápido, siempre correcto para nuevos usuarios)
   *   2. Por email (fallback para usuarios legacy con ID ≠ UID)
   *      → Si se encuentra por email y el ID no es el UID, MIGRA el doc al UID correcto.
   *   3. Si es Google y no existe doc → lo crea automáticamente.
   *   4. Si nada funciona → user = null (mostrará pantalla de error o redirect a /login)
   */
  const loadUserDocument = useCallback(async (fbUser: User): Promise<void> => {
    const db = getFirestoreDb();

    try {
      // ── 1. Buscar por UID ────────────────────────────────────
      let snap = await getDoc(doc(db, COLECCION_USUARIOS, fbUser.uid));

      // ── 2. Fallback por email para usuarios legacy ───────────
      if (!snap.exists() && fbUser.email) {
        const q = query(
          collection(db, COLECCION_USUARIOS),
          where('email', '==', fbUser.email)
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const legacyDoc = querySnap.docs[0];

          if (legacyDoc.id !== fbUser.uid) {
            // — Migración automática: copiar datos al doc con UID como ID —
            // Esto garantiza que futuras búsquedas por UID tengan éxito.
            const legacyData = legacyDoc.data();
            await setDoc(
              doc(db, COLECCION_USUARIOS, fbUser.uid),
              legacyData,
              { merge: false }  // Reemplaza completamente si existía algo parcial
            );
            // Releer el doc recién migrado
            snap = await getDoc(doc(db, COLECCION_USUARIOS, fbUser.uid));
          } else {
            // El doc YA tiene el UID como ID (no debería llegar aquí, pero por si acaso)
            snap = legacyDoc as typeof snap;
          }
        }
      }

      // ── 3. Usar el documento encontrado ─────────────────────
      if (snap.exists()) {
        setUser(snapToUsuario(snap.id, snap.data() as Record<string, unknown>));
        return;
      }

      // ── 4. Google Sign-In: auto-crear doc si no existe ───────
      const isGoogle = fbUser.providerData.some((p) => p.providerId === 'google.com');
      if (isGoogle) {
        const { usuariosService } = await import('@/services/usuarios.service');
        const nuevoUsuario = await usuariosService.crearDocumento({
          uid:    fbUser.uid,
          nombre: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuario',
          email:  fbUser.email ?? '',
        });
        setUser(nuevoUsuario);
        return;
      }

      // ── 5. Sin documento y sin proveedor Google ──────────────
      // Para registro email/password: el doc se crea en /registro y luego
      // se llama a refreshUser(). Si llegamos aquí sin doc, es un estado
      // transitorio; el registro page llamará refreshUser() justo después.
      console.warn('[AuthContext] Documento de usuario no encontrado:', fbUser.email);
      setUser(null);

    } catch (error) {
      console.error('[AuthContext] Error al cargar documento de usuario:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let initialCheckDone = false;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // Solo bloquear la UI (loading=true) en la verificación inicial.
      // Cambios de estado posteriores (renovación de token, etc.) se
      // resuelven silenciosamente para no interrumpir al usuario.
      if (!initialCheckDone) {
        setLoading(true);
      }

      firebaseUserRef.current = fbUser;
      setFirebaseUser(fbUser);

      if (fbUser) {
        await loadUserDocument(fbUser);
      } else {
        setUser(null);
      }

      if (!initialCheckDone) {
        setLoading(false);
        initialCheckDone = true;
      }
    });

    return () => unsubscribe();
  }, [loadUserDocument]);

  /** Fuerza la recarga del doc Firestore sin mostrar la pantalla de carga */
  const refreshUser = useCallback(async (): Promise<void> => {
    const fbUser = firebaseUserRef.current;
    if (!fbUser) return;
    await loadUserDocument(fbUser);
  }, [loadUserDocument]);

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
    firebaseUserRef.current = null;
    // Limpiar cookie de sesión del middleware
    if (typeof document !== 'undefined') {
      document.cookie = '__session=; path=/; max-age=0';
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
