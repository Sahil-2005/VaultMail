import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vaultmail_token');
    if (token) {
      // Validate token and fetch user
      apiFetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('vaultmail_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('vaultmail_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vaultmail_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
