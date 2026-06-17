import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminEventSeats, releaseSeat } from '../../api/admin/adminSeatsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Button from '../../components/common/Button';

const AdminEventSeatsPage = () => {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const data = await getAdminEventSeats(id);
      setSeats(data.seats);
    } catch (err) {
      setError('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [id]);

  const handleRelease = async (seatId) => {
    if (!window.confirm('Are you sure you want to release this seat? This will cancel any active reservation for it.')) return;
    try {
      await releaseSeat(seatId);
      fetchSeats(); // refresh
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to release seat');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin/events">&larr; Back to Events</Link>
        <h1 style={{ margin: 0 }}>Manage Seats</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {seats.map((seat) => (
          <div key={seat._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                Seat {seat.seatNumber}
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: seat.status === 'available' ? 'var(--color-text-muted)' : 
                       seat.status === 'reserved' ? 'var(--color-accent-dark)' : 'var(--color-error)'
              }}>
                Status: {seat.status.toUpperCase()}
              </div>
            </div>
            
            {seat.status === 'reserved' && (
              <Button variant="danger" onClick={() => handleRelease(seat._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Release
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventSeatsPage;
