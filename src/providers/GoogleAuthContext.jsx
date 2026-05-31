import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { googleAuthService } from '../services/googleAuthService';
import { SCHOOL_DRIVE_EMAIL } from '../config/googleDrive';

const GoogleAuthContext = createContext(null);

export function GoogleAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setSession(googleAuthService.getStoredSession());
    setLoading(false);
  }, []);

  const signIn = useCallback(async () => {
    setAuthError('');
    setLoading(true);
    try {
      const next = await googleAuthService.signIn();
      setSession(next);
      return next;
    } catch (err) {
      setAuthError(err.message || 'Google sign-in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await googleAuthService.signOut();
    setSession(null);
    setAuthError('');
  }, []);

  const ensureAccessToken = useCallback(
    async ({ interactive = false } = {}) => {
      const token = await googleAuthService.ensureAccessToken({ interactive });
      if (token && !session) {
        setSession(googleAuthService.getStoredSession());
      }
      return token;
    },
    [session]
  );

  const value = useMemo(
    () => ({
      isSignedIn: !!session?.accessToken,
      email: session?.email || '',
      accessToken: session?.accessToken || null,
      expectedEmail: SCHOOL_DRIVE_EMAIL,
      loading,
      authError,
      signIn,
      signOut,
      ensureAccessToken,
      isOnline: googleAuthService.isOnline(),
    }),
    [session, loading, authError, signIn, signOut, ensureAccessToken]
  );

  return (
    <GoogleAuthContext.Provider value={value}>{children}</GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const ctx = useContext(GoogleAuthContext);
  if (!ctx) {
    throw new Error('useGoogleAuth must be used within GoogleAuthProvider');
  }
  return ctx;
}
