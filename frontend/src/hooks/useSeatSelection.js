import { useState } from 'react';

export const useSeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }
      if (prev.length >= 10) return prev; // Max 10 limit logic handled mostly backend, but good to cap UI
      return [...prev, seatNumber];
    });
  };

  const clearSelection = () => setSelectedSeats([]);

  return { selectedSeats, toggleSeat, clearSelection };
};
