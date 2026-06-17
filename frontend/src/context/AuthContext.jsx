import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, registerBusiness as apiRegisterBusiness } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('eventBooking_auth');
    if (storedAuth) {
      const { user } = JSON.parse(storedAuth);
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    localStorage.setItem('eventBooking_auth', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    setUser(data.user);
    localStorage.setItem('eventBooking_auth', JSON.stringify(data));
  };

  const registerBusiness = async (formData) => {
    const data = await apiRegisterBusiness(formData);
    setUser(data.user);
    localStorage.setItem('eventBooking_auth', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventBooking_auth');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, registerBusiness, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
