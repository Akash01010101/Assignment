import axiosClient from './axiosClient';

export const reserveSeats = async (eventId, seatNumbers) => {
  const response = await axiosClient.post('/reserve', { eventId, seatNumbers });
  return response.data;
};

export const getMyReservations = async () => {
  const response = await axiosClient.get('/reserve/me');
  return response.data;
};
