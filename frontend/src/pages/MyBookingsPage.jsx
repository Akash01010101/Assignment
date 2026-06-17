import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMyBookings } from '../hooks/useMyBookings';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import { Ticket, CalendarDays, MapPin, Armchair, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

const MyBookingsPage = () => {
  const { data: bookings, isLoading, error } = useMyBookings();

  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)', fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)',
        }}>
          My Bookings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Your confirmed event tickets
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <Ticket size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-4)' }} />
          <h3 style={{ color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
            No bookings yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
            Browse events and book your first tickets!
          </p>
          <Link to="/events">
            <button style={{
              background: 'var(--gradient-accent)',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}>
              Browse Events <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.reservationId}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{
                  fontSize: 'var(--text-base)', fontWeight: 600,
                  marginBottom: 'var(--space-2)',
                }}>
                  {booking.event?.name}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                    <MapPin size={12} /> {booking.event?.venue}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                    <CalendarDays size={12} /> {formatDate(booking.event?.dateTime)}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  <Armchair size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Seats
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {booking.seatNumbers.map((sn) => (
                    <span key={sn} className="badge badge-accent">{sn}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
