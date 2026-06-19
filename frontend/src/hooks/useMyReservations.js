import { useState, useEffect, useCallback } from 'react';
import { getMyReservations } from '../api/reservationsApi';

export const useMyReservations = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyReservations();
      setData(res.reservations || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reservations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { data, isLoading, error, refetch: fetchReservations };
};
