import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminBookings } from '../../api/admin/adminBookingsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatDate';
import { ChevronLeft, ChevronRight, Ticket, User, CalendarDays } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] } }),
};

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAdminBookings({ page, limit });
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page]);

  const totalPages = Math.ceil(total / limit);

  if (loading && bookings.length === 0) return <Spinner fullPage />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-1)' }}>
          All Bookings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>{total} confirmed bookings</p>
      </div>

      {/* Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
          gap: 'var(--space-4)',
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-alt)',
        }}>
          {['User', 'Event', 'Booked On', 'Seats'].map((h) => (
            <span key={h} style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {bookings.length > 0 ? bookings.map((booking, i) => (
          <motion.div
            key={booking.reservationId}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
              gap: 'var(--space-4)',
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              alignItems: 'center',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{booking.user?.name || 'Unknown'}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{booking.user?.email}</div>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {booking.event?.name || 'Unknown Event'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {formatDate(booking.bookedAt)}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
              {booking.seatNumbers.map((sn) => (
                <span key={sn} className="badge badge-accent">{sn}</span>
              ))}
            </div>
          </motion.div>
        )) : (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
            <Ticket size={32} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-2)' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No bookings found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
