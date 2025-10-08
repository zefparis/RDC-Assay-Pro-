import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    const onAuthChanged = () => {
      try {
        const t = localStorage.getItem('authToken');
        const uStr = localStorage.getItem('user');
        if (t && uStr) {
          const u = JSON.parse(uStr);
          setAuthState({ isAuthenticated: true, user: u, token: t });
        } else {
          setAuthState({ isAuthenticated: false, user: null, token: null });
        }
      } catch {
        setAuthState({ isAuthenticated: false, user: null, token: null });
      }
    };
    // Listen to custom event (same-tab) and storage (cross-tab)
    window.addEventListener('rdc-auth-changed', onAuthChanged);
    window.addEventListener('storage', onAuthChanged as any);
    return () => {
      window.removeEventListener('rdc-auth-changed', onAuthChanged);
      window.removeEventListener('storage', onAuthChanged as any);
    };
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('rdc-auth-changed'));
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('rdc-auth-changed'));
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};
