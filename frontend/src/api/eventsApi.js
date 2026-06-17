import axiosClient from './axiosClient';

export const getEvents = async () => {
  const response = await axiosClient.get('/events');
  return response.data;
};

export const getEventDetail = async (id) => {
  const response = await axiosClient.get(`/events/${id}`);
  return response.data;
};
