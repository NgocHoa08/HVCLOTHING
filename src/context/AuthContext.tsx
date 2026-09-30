import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext, type AuthUser } from './auth-context';
import { firebaseAuth, firebaseDb } from '../lib/firebase';

const toAuthUser = async (firebaseUser: FirebaseUser): Promise<AuthUser> => {
  let role: AuthUser['role'] = 'customer';
  if (firebaseDb) {
    try {
      const adminRecord = await getDoc(doc(firebaseDb, 'admins', firebaseUser.uid));
      if (adminRecord.exists()) role = 'admin';
    } catch {
      role = 'customer';
    }
  }
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: firebaseUser.displayName ?? undefined,
    role,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(Boolean(firebaseAuth));

  useEffect(() => {
    if (!firebaseAuth) return;

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        setUser(firebaseUser ? await toAuthUser(firebaseUser) : null);
      } catch {
        setUser(firebaseUser ? {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? undefined,
          role: 'customer',
        } : null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    if (!firebaseAuth) throw new Error('Chưa cấu hình Firebase. Hãy điền thông tin VITE_FIREBASE_* trong file .env.');
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    const signedInUser = await toAuthUser(credential.user);
    setUser(signedInUser);
    return signedInUser;
  };

  const register = async (name: string, email: string, password: string) => {
    if (!firebaseAuth) throw new Error('Chưa cấu hình Firebase. Hãy điền thông tin VITE_FIREBASE_* trong file .env.');
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
    await updateProfile(credential.user, { displayName: name.trim() });
    const registeredUser = await toAuthUser(credential.user);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};