import axiosClient from '../axiosClient';

export const getAdminEventSeats = async (eventId) => {
  const response = await axiosClient.get(`/admin/events/${eventId}/seats`);
  return response.data;
};

export const releaseSeat = async (seatId) => {
  const response = await axiosClient.patch(`/admin/seats/${seatId}/release`);
  return response.data;
};
