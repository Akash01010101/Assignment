import React, { useState, useEffect } from 'react';
import { getAdminBookings } from '../../api/admin/adminBookingsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { formatDate } from '../../utils/formatDate';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAdminBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Bookings</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.map((booking) => (
          <div key={booking.reservationId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{booking.event?.name || 'Unknown Event'}</h3>
              <p style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-muted)' }}>
                <strong>User:</strong> {booking.user?.name} ({booking.user?.email})
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                <strong>Booked on:</strong> {formatDate(booking.bookedAt)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Seats</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                {booking.seatNumbers.join(', ')}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p>No bookings found.</p>}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
