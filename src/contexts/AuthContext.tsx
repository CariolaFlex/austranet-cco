'use client';

// ============================================================
// Austranet CCO - Auth Context
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import { usuariosService } from '@/services/usuarios.service';
import { Usuario } from '@/types';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref para acceder siempre al firebaseUser más reciente dentro de refreshUser
  const firebaseUserRef = useRef<User | null>(null);

  /** Carga (o recarga) el documento Firestore del usuario dado */
  const loadUserDocument = useCallback(async (fbUser: User): Promise<void> => {
    const db = getFirestoreDb();
    try {
      // Intenta buscar por UID (camino principal)
      let snap = await getDoc(doc(db, 'usuarios', fbUser.uid));

      if (snap.exists()) {
        setUser({ id: snap.id, ...snap.data() } as Usuario);
        return;
      }

      // — Google Sign-In: auto-crear documento si no existe —
      const isGoogle = fbUser.providerData.some(
        (p) => p.providerId === 'google.com'
      );

      if (isGoogle) {
        const nuevoUsuario = await usuariosService.crearDocumento({
          uid: fbUser.uid,
          nombre: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuario',
          email: fbUser.email ?? '',
          // empresa y cargo se dejan vacíos; el usuario puede completar después
        });
        setUser(nuevoUsuario);
        return;
      }

      // Para email/password: el documento se crea en la página de registro.
      // Si llegamos aquí es porque onAuthStateChanged se disparó antes de que
      // el registro terminara de escribir el doc → dejamos user=null y el
      // registro llamará a refreshUser() una vez que el doc exista.
      console.warn('Documento de usuario no encontrado para:', fbUser.email);
      setUser(null);
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);           // bloquear UI mientras procesamos
      firebaseUserRef.current = fbUser;
      setFirebaseUser(fbUser);

      if (fbUser) {
        await loadUserDocument(fbUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserDocument]);

  /** Fuerza la recarga del doc Firestore sin cambiar loading global */
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
