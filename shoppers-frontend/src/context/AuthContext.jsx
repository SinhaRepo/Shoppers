import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const TOKEN_KEY = 'shoppers_token';
const USER_KEY = 'shoppers_user';

const loadUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // On mount, refresh user from /api/auth/me if token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axiosInstance
        .get('/auth/me')
        .then((res) => {
          const userData = res.data;
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        });
    }
  }, []);

  // Listen for forced logout from axios interceptor (401)
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, name, email: userEmail, role } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      const userData = { name, email: userEmail, role };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsLoginOpen(false);
      toast.success(`Welcome back, ${name}`);
      return true;
    } catch (err) {
      const msg = err.response?.status === 401
        ? 'Invalid email or password'
        : 'Login failed. Please try again.';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      const { token, name: userName, email: userEmail, role } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      const userData = { name: userName, email: userEmail, role };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsRegisterOpen(false);
      toast.success(`Welcome, ${userName}!`);
      return true;
    } catch (err) {
      const msg = err.response?.status === 400
        ? 'Email already registered'
        : 'Registration failed. Please try again.';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    toast.success('Logged out');
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      isLoginOpen,
      setIsLoginOpen,
      isRegisterOpen,
      setIsRegisterOpen,
    }),
    [user, loading, login, register, logout, isAuthenticated, isLoginOpen, isRegisterOpen]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
