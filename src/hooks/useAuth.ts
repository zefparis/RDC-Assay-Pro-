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
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};
