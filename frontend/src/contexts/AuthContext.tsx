import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = 'warm_calendar_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    // Mock user đã được tắt - user phải login để vào Calendar
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const response = await api.register({ email, password, displayName });
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Redirect to backend Google OAuth flow
    window.location.href = api.getGoogleOAuthUrl();
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: { displayName?: string; avatarUrl?: string }) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }
      const response = await api.updateProfile(data);
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [user]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      const { url } = await api.uploadAvatar(file);
      return { url, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, uploadAvatar, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}