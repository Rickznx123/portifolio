import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, firebaseReady } from '../lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setIsAdmin(Boolean(nextUser));
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAdmin,
    configured: firebaseReady,
    login: async (email, password) => {
      if (!auth) throw new Error('Firebase ainda não foi configurado.');
      await signInWithEmailAndPassword(auth, email, password);
    },
    logout: async () => {
      if (auth) await signOut(auth);
    },
    resetPassword: async (email) => {
      if (!auth) throw new Error('Firebase ainda não foi configurado.');
      await sendPasswordResetEmail(auth, email);
    },
  }), [isAdmin, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
