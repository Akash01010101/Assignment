import React from 'react';
import { useMyBookings } from '../hooks/useMyBookings';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { formatDate } from '../utils/formatDate';

const MyBookingsPage = () => {
  const { data: bookings, isLoading, error } = useMyBookings();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="card">
          <p>You haven't booked any tickets yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking.reservationId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-accent)' }}>
                  {booking.event.name}
                </h3>
                <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-muted)' }}>
                  {booking.event.venue} • {formatDate(booking.event.dateTime)}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Booked on: {formatDate(booking.bookedAt)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Seats</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {booking.seatNumbers.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
