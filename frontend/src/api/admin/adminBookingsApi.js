import axiosClient from '../axiosClient';

export const getAdminBookings = async (params = {}) => {
  const response = await axiosClient.get('/admin/bookings', { params });
  return response.data;
};
