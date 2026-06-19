import { useState, useEffect, useCallback } from 'react';
import { getMyBookings } from '../api/bookingsApi';

export const useMyBookings = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyBookings();
      setData(response.bookings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { data, isLoading, error, refetch: fetchBookings };
};
