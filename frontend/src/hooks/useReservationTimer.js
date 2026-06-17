import { useState, useEffect } from 'react';

export const useReservationTimer = (expiresAt) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setIsExpired(false);
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ minutes: 0, seconds: 0 });
        setIsExpired(true);
      } else {
        setTimeLeft({
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return { ...timeLeft, isExpired };
};
