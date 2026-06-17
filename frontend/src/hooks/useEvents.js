import { useState, useEffect } from 'react';
import { getEvents } from '../api/eventsApi';

export const useEvents = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setData(response.events);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { data, isLoading, error };
};
