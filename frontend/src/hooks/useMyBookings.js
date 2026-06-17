import { useState, useEffect } from 'react';
import { getMyBookings } from '../api/bookingsApi';

export const useMyBookings = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings();
        setData(response.bookings);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { data, isLoading, error };
};
