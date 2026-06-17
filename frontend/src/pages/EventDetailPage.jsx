import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventDetail } from '../hooks/useEventDetail';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { reserveSeats } from '../api/reservationsApi';
import { confirmBooking } from '../api/bookingsApi';
import { useReservationTimer } from '../hooks/useReservationTimer';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatDate';

const SeatMap = ({ seats, selectedSeats, onToggleSeat }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
      {seats.map((seat) => {
        const isSelected = selectedSeats.includes(seat.seatNumber);
        const isAvailable = seat.status === 'available';
        
        let bgColor = 'var(--color-seat-booked)';
        let cursor = 'not-allowed';
        
        if (isAvailable) {
          bgColor = isSelected ? 'var(--color-seat-selected)' : 'var(--color-seat-available)';
          cursor = 'pointer';
        } else if (seat.status === 'reserved') {
          bgColor = 'var(--color-seat-reserved)';
        }

        return (
          <div
            key={seat.seatNumber}
            onClick={() => isAvailable && onToggleSeat(seat.seatNumber)}
            style={{
              width: '40px',
              height: '40px',
              background: bgColor,
              border: `1px solid ${isAvailable ? 'var(--color-seat-available-border)' : 'transparent'}`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor,
              fontSize: '0.8rem',
              color: isAvailable && !isSelected ? 'var(--color-text-primary)' : '#fff',
              userSelect: 'none',
              transition: 'all 0.2s'
            }}
            title={`Seat ${seat.seatNumber} - ${seat.status}`}
          >
            {seat.seatNumber}
          </div>
        );
      })}
    </div>
  );
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useEventDetail(id);
  const { selectedSeats, toggleSeat, clearSelection } = useSeatSelection();
  
  const [reservation, setReservation] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { minutes, seconds, isExpired } = useReservationTimer(reservation?.expiresAt);

  useEffect(() => {
    if (isExpired && reservation) {
      setReservation(null);
      clearSelection();
      setActionError('Reservation expired. Please select seats again.');
      refetch();
    }
  }, [isExpired, reservation, clearSelection, refetch]);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!data) return null;

  const { event, seats } = data;

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      const res = await reserveSeats(event.id, selectedSeats);
      setReservation(res.reservation);
      refetch(); // Get updated seat statuses
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to reserve seats');
      // If conflict, refetch to show latest availability
      if (err.response?.status === 409) {
        clearSelection();
        refetch();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!reservation) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await confirmBooking(reservation.id);
      navigate('/my-bookings');
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to confirm booking');
      if (err.response?.status === 410 || err.response?.status === 409) {
        setReservation(null);
        clearSelection();
        refetch();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0, color: 'var(--color-accent)' }}>{event.name}</h1>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Date:</strong> {formatDate(event.dateTime)}</p>
      </div>

      <ErrorBanner message={actionError} />

      {!reservation ? (
        <div className="card">
          <h2>Select Seats</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Selected: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'} (Max 10)
          </p>
          <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              onClick={handleReserve} 
              disabled={selectedSeats.length === 0 || isProcessing}
            >
              {isProcessing ? 'Reserving...' : 'Reserve Selected Seats'}
            </Button>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '15px', height: '15px', background: 'var(--color-seat-available)', border: '1px solid var(--color-seat-available-border)' }}></div> Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '15px', height: '15px', background: 'var(--color-seat-selected)' }}></div> Selected
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '15px', height: '15px', background: 'var(--color-seat-reserved)' }}></div> Reserved
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '15px', height: '15px', background: 'var(--color-seat-booked)' }}></div> Booked
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ border: '2px solid var(--color-accent)' }}>
          <h2>Confirm Booking</h2>
          <p>You have reserved the following seats:</p>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '1rem 0' }}>
            {reservation.seatNumbers.join(', ')}
          </div>
          
          <div style={{ 
            background: 'var(--color-surface-alt)', 
            padding: '1rem', 
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <span>Time remaining to confirm:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: minutes === 0 && seconds < 30 ? 'var(--color-error)' : 'inherit' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <Button 
            onClick={handleConfirm} 
            disabled={isProcessing}
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
          >
            {isProcessing ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
