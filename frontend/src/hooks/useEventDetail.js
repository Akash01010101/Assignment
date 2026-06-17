import { useState, useEffect, useCallback } from 'react';
import { getEventDetail } from '../api/eventsApi';

export const useEventDetail = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getEventDetail(id);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, isLoading, error, refetch: fetchDetail };
};
