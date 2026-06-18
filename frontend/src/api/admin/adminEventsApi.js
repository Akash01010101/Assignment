import axiosClient from '../axiosClient';

export const getAdminEvents = async () => {
  const response = await axiosClient.get('/admin/events');
  return response.data;
};

export const createAdminEvent = async (eventData) => {
  const formData = new FormData();
  formData.append('name', eventData.name);
  formData.append('venue', eventData.venue);
  formData.append('dateTime', eventData.dateTime);
  formData.append('totalSeats', eventData.totalSeats);
  if (eventData.seatsPerRow) formData.append('seatsPerRow', eventData.seatsPerRow);
  if (eventData.image) formData.append('image', eventData.image);

  const response = await axiosClient.post('/admin/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
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
