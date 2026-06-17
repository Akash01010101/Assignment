import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminEvents, deleteAdminEvent } from '../../api/admin/adminEventsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAdminEvents();
      setEvents(data.events);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteAdminEvent(id);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Manage Events</h1>
        {/* Placeholder for create event */}
        <Button onClick={() => alert('Create Event form not implemented in this demo')}>Create Event</Button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map((event) => (
          <div key={event.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{event.name}</h3>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {event.venue} • {formatDate(event.dateTime)}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                <span>Available: {event.availableSeats}</span>
                <span style={{ color: 'var(--color-accent)' }}>Reserved: {event.reservedSeats}</span>
                <span style={{ color: 'var(--color-error)' }}>Booked: {event.bookedSeats}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/admin/events/${event.id}/seats`}>
                <Button variant="secondary">Manage Seats</Button>
              </Link>
              <Button variant="danger" onClick={() => handleDelete(event.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage;
