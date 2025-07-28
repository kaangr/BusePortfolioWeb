import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_PASSWORD = 'Busem123!';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 dakika

interface AuthContextType {
  isAuthenticated: boolean;
  isLocked: boolean;
  remainingAttempts: number;
  lockoutTimeRemaining: number;
  login: (password: string) => boolean;
  logout: () => void;
}

interface AuthState {
  failedAttempts: number;
  lastFailedAttempt: number;
  isLocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem('admin-auth');
    return saved === 'true';
  });

  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('admin-auth-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        
        // Eğer lockout süresi dolmuşsa state'i temizle
        if (parsed.isLocked && (now - parsed.lastFailedAttempt) > LOCKOUT_DURATION) {
          return { failedAttempts: 0, lastFailedAttempt: 0, isLocked: false };
        }
        
        return parsed;
      } catch {
        return { failedAttempts: 0, lastFailedAttempt: 0, isLocked: false };
      }
    }
    return { failedAttempts: 0, lastFailedAttempt: 0, isLocked: false };
  });

  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  // Lockout timer
  useEffect(() => {
    if (authState.isLocked) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timePassed = now - authState.lastFailedAttempt;
        const remaining = Math.max(0, LOCKOUT_DURATION - timePassed);
        
        setLockoutTimeRemaining(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          setAuthState(prev => ({ ...prev, isLocked: false, failedAttempts: 0 }));
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [authState.isLocked, authState.lastFailedAttempt]);

  // Auth state'i localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('admin-auth-state', JSON.stringify(authState));
  }, [authState]);

  // Session auth'u sessionStorage'a kaydet
  useEffect(() => {
    sessionStorage.setItem('admin-auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (password: string): boolean => {
    // Lockout kontrolü
    if (authState.isLocked) {
      return false;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthState({ failedAttempts: 0, lastFailedAttempt: 0, isLocked: false });
      return true;
    } else {
      const newFailedAttempts = authState.failedAttempts + 1;
      const now = Date.now();
      
      const newAuthState: AuthState = {
        failedAttempts: newFailedAttempts,
        lastFailedAttempt: now,
        isLocked: newFailedAttempts >= MAX_ATTEMPTS
      };
      
      setAuthState(newAuthState);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
  };

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - authState.failedAttempts);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLocked: authState.isLocked,
      remainingAttempts,
      lockoutTimeRemaining,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 