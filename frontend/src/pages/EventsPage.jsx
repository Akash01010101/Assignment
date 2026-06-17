import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { formatDate } from '../utils/formatDate';

const EventsPage = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map((event) => (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--color-accent)' }}>{event.name}</h3>
              <p style={{ margin: '0.25rem 0', color: 'var(--color-text-muted)' }}>
                <strong>Venue:</strong> {event.venue}
              </p>
              <p style={{ margin: '0.25rem 0', color: 'var(--color-text-muted)' }}>
                <strong>Date:</strong> {formatDate(event.dateTime)}
              </p>
              <p style={{ margin: '0.25rem 0', color: 'var(--color-text-muted)' }}>
                <strong>Available Seats:</strong> {event.availableSeats} / {event.totalSeats}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <Link to={`/events/${event.id}`}>
                  <button style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'var(--color-surface-alt)', 
                    color: 'var(--color-accent)', 
                    border: '1px solid var(--color-accent)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    View Details & Book
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
