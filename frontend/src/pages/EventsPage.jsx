import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvents } from '../hooks/useEvents';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

const EventsPage = () => {
  const { data: events, isLoading, error } = useEvents();

  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)',
          marginBottom: 'var(--space-2)',
        }}>
          Upcoming Events
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Browse available events and book your seats
        </p>
      </div>

      {isLoading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
          gap: 'var(--space-4)',
          justifyContent: 'center'
        }}>
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : events.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-16) 0',
        }}>
          <CalendarDays size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-4)' }} />
          <h3 style={{ color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
            No upcoming events
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Check back later for new events.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 'var(--space-4)',
          justifyContent: 'center',
        }}>
          {events.map((event, i) => {
            const utilization = event.totalSeats > 0
              ? ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
              : 0;

            return (
              <motion.div
                key={event.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <Link to={`/events/${event.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <div className="card-elevated" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: 160, width: '100%', position: 'relative' }}>
                      <img 
                        src={event.imageUrl?.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${event.imageUrl}` : (event.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1170&auto=format&fit=crop')}
                        alt={event.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'var(--gradient-accent)' }} />
                    </div>
                    
                    <div style={{ padding: 'var(--space-6)' }}>
                      <h3 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 600,
                        marginBottom: 'var(--space-3)',
                        letterSpacing: 'var(--tracking-tight)',
                      }}>
                      {event.name}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        <MapPin size={14} /> {event.venue}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        <CalendarDays size={14} /> {formatDate(event.dateTime)}
                      </div>
                    </div>

                    {/* Seats progress bar */}
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          <Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {event.availableSeats} seats available
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {event.totalSeats} total
                        </span>
                      </div>
                      <div style={{
                        height: 4,
                        background: 'var(--color-surface-alt)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${utilization}%`,
                          background: utilization > 80 ? 'var(--gradient-warm)' : 'var(--gradient-accent)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.6s var(--ease-out)',
                        }} />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'var(--color-accent)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                    }}>
                      View & Book
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
