import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await axiosClient.post('/auth/register', { name, email, password });
  return response.data;
};
