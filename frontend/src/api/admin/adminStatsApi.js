import axiosClient from '../axiosClient';

export const getAdminStats = async () => {
  const response = await axiosClient.get('/admin/stats');
  return response.data;
};
