import axiosClient from '../axiosClient';

export const getAdminEvents = async () => {
  const response = await axiosClient.get('/admin/events');
  return response.data;
};

export const createAdminEvent = async (eventData) => {
  const response = await axiosClient.post('/admin/events', eventData);
  return response.data;
};

export const updateAdminEvent = async (id, eventData) => {
  const response = await axiosClient.put(`/admin/events/${id}`, eventData);
  return response.data;
};

export const deleteAdminEvent = async (id) => {
  const response = await axiosClient.delete(`/admin/events/${id}`);
  return response.data;
};
