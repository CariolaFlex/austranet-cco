'use client';

// ============================================================
// Austranet CCO - Auth Context
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import { Usuario } from '@/types';

interface AuthContextType {
  user: Usuario | null;
  firebaseUser: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase se inicializa DENTRO de useEffect para evitar errores SSR
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Primero intenta buscar por UID
          let userDoc = await getDoc(doc(db, 'usuarios', fbUser.uid));

          // Si no existe, busca por email
          if (!userDoc.exists() && fbUser.email) {
            const q = query(collection(db, 'usuarios'), where('email', '==', fbUser.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              userDoc = querySnapshot.docs[0];
            }
          }

          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() } as Usuario;
            setUser(userData);
          } else {
            console.error('No se encontró documento de usuario para:', fbUser.email);
            setUser(null);
          }
        } catch (error) {
          console.error('Error obteniendo datos de usuario:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
