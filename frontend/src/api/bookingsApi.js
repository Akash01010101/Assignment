import axiosClient from './axiosClient';

export const confirmBooking = async (reservationId) => {
  const response = await axiosClient.post('/bookings', { reservationId });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axiosClient.get('/bookings/me');
  return response.data;
};
