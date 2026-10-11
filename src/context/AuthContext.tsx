import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface DeviceInfo {
  browser: string;
  os: string;
  type: 'Desktop' | 'Mobile' | 'Tablet';
  deviceId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  deviceInfo: DeviceInfo;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let type: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) { os = 'Android'; type = 'Mobile'; }
  else if (ua.includes('iPhone')) { os = 'iOS'; type = 'Mobile'; }
  else if (ua.includes('iPad')) { os = 'iPadOS'; type = 'Tablet'; }

  let storedId = localStorage.getItem('synctask_device_id');
  if (!storedId) {
    storedId = 'dev_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('synctask_device_id', storedId);
  }

  return { browser, os, type, deviceId: storedId };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo] = useState<DeviceInfo>(detectDeviceInfo);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatAuthError = (err: unknown): string => {
    if (!(err instanceof Error)) return 'Authentication failed';
    const msg = err.message;
    if (msg.includes('auth/invalid-email')) return 'Please enter a valid email address.';
    if (msg.includes('auth/email-already-in-use')) return 'This email is already registered. Please log in instead.';
    if (msg.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
    if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password') || msg.includes('auth/invalid-credential')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('auth/too-many-requests')) return 'Too many failed attempts. Please try again later.';
    if (msg.includes('auth/operation-not-allowed')) {
      return 'Email/Password provider is not yet enabled in the Firebase Console. You can also sign in with Google!';
    }
    return msg;
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      setError(null);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && res.user) {
        await updateProfile(res.user, { displayName: name });
      }
    } catch (err: unknown) {
      console.error('Sign up error:', err);
      const friendly = formatAuthError(err);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      const friendly = formatAuthError(err);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      const friendly = formatAuthError(err);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const friendly = formatAuthError(err);
      console.error('Google Sign In error:', err);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign out failed';
      setError(msg);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        deviceInfo,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        resetPassword,
        signOut,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
