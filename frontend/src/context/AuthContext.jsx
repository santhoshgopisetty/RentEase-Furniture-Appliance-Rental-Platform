import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, phone, address) => {
    try {
      const { data } = await API.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
      });
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUserProfile = async (profileData) => {
    try {
      // In this app, we will reuse register user endpoint or just update local state.
      // Let's implement profile updates (optional but good). We will update local user state.
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
