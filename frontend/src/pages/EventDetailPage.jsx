import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventDetail } from '../hooks/useEventDetail';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { reserveSeats } from '../api/reservationsApi';
import { confirmBooking } from '../api/bookingsApi';
import { useReservationTimer } from '../hooks/useReservationTimer';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import { MapPin, CalendarDays, CheckCircle2, Clock, Armchair } from 'lucide-react';

/* ── Seat Grid ─────────────────────────────────────────────── */
const SeatMap = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by row letter
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber.replace(/[0-9]/g, '');
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  const sortedRowLabels = Object.keys(rows).sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {/* Stage indicator */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-2) var(--space-4)',
        background: 'var(--color-accent-light)',
        color: 'var(--color-accent)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-4)',
      }}>
        STAGE
      </div>

      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 'var(--space-4)' }}>
        <div className="seat-grid-inner" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: 'max-content' }}>
        {sortedRowLabels.map((rowLabel) => {
          const rowSeats = rows[rowLabel].sort((a, b) => {
            const numA = parseInt(a.seatNumber.replace(/\D/g, ''), 10);
            const numB = parseInt(b.seatNumber.replace(/\D/g, ''), 10);
            return numA - numB;
          });

          return (
            <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 'min-content' }}>
              <span style={{
                width: 24, flexShrink: 0, textAlign: 'center',
                fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600,
              }}>
                {rowLabel}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'nowrap' }}>
            {rowSeats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seatNumber);
              const isAvailable = seat.status === 'available';
              const isReserved = seat.status === 'reserved';
              const isBooked = seat.status === 'booked';

              let bg = 'var(--color-surface-alt)';
              let border = '1px solid var(--color-border)';
              let color = 'var(--color-text-secondary)';
              let cursor = 'pointer';
              let shadow = 'none';

              if (isSelected) {
                bg = 'var(--color-accent)';
                border = '1px solid var(--color-accent)';
                color = '#fff';
                shadow = 'var(--shadow-glow)';
              } else if (isReserved) {
                bg = 'var(--color-seat-reserved-bg)';
                border = '1px solid rgba(245,158,11,0.3)';
                color = 'var(--color-seat-reserved)';
                cursor = 'not-allowed';
              } else if (isBooked) {
                bg = 'rgba(82,82,91,0.15)';
                border = '1px solid transparent';
                color = 'var(--color-text-muted)';
                cursor = 'not-allowed';
              }

              return (
                <motion.div
                  key={seat.seatNumber}
                  onClick={() => isAvailable && onToggleSeat(seat.seatNumber)}
                  whileHover={isAvailable ? { scale: 1.15, y: -2 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  style={{
                    width: 'var(--seat-size)', height: 'var(--seat-size)', flexShrink: 0,
                    background: bg, border, color,
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor, fontSize: '10px', fontWeight: 600,
                    userSelect: 'none',
                    boxShadow: shadow,
                    transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
                  }}
                  title={`Seat ${seat.seatNumber} — ${seat.status}`}
                >
                  {seat.seatNumber.replace(/[A-Z]/g, '')}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
        })}
        </div>
      </div>
    </div>
  );
};

/* ── Legend ─────────────────────────────────────────────────── */
const Legend = () => (
  <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
    {[
      { bg: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', label: 'Available' },
      { bg: 'var(--color-accent)', border: 'none', label: 'Selected' },
      { bg: 'var(--color-seat-reserved-bg)', border: '1px solid rgba(245,158,11,0.3)', label: 'Reserved' },
      { bg: 'rgba(82,82,91,0.15)', border: 'none', label: 'Booked' },
    ].map((item) => (
      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, background: item.bg, border: item.border || 'none' }} />
        {item.label}
      </div>
    ))}
  </div>
);

/* ── Page ──────────────────────────────────────────────────── */
const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useEventDetail(id);
  const { selectedSeats, toggleSeat, clearSelection } = useSeatSelection();

  const [reservation, setReservation] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { minutes, seconds, isExpired } = useReservationTimer(reservation?.expiresAt);

  useEffect(() => {
    if (isExpired && reservation) {
      setReservation(null);
      clearSelection();
      setActionError('Reservation expired. Please select seats again.');
      refetch();
    }
  }, [isExpired, reservation, clearSelection, refetch]);

  if (isLoading) return <Spinner fullPage />;
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
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to reserve seats');
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
      setShowSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
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

  const totalTime = 5 * 60; // 5 minutes in seconds
  const currentTimeLeft = minutes * 60 + seconds;
  const progress = totalTime > 0 ? (currentTimeLeft / totalTime) * 100 : 0;

  return (
    <div>
      {/* Event Hero Card */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0
        }}>
          <img 
            src={event.imageUrl?.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'}${event.imageUrl}` : (event.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1170&auto=format&fit=crop')}
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }}
          />
        </div>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'var(--gradient-accent)', zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)', fontWeight: 700,
            letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-4)',
          }}>
          {event.name}
        </h1>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            <MapPin size={16} /> {event.venue}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            <CalendarDays size={16} /> {formatDate(event.dateTime)}
          </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              <Armchair size={16} /> {event.totalSeats} total seats
            </div>
          </div>
        </div>
      </div>

      <ErrorBanner message={actionError} />

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => {}} title="">
        <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          >
            <CheckCircle2 size={64} color="var(--color-success)" style={{ marginBottom: 'var(--space-4)' }} />
          </motion.div>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Booking Confirmed!</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Redirecting to your bookings...
          </p>
        </div>
      </Modal>

      {!reservation ? (
        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Select Seats</h2>
            {selectedSeats.length > 0 && (
              <span className="badge badge-accent">
                {selectedSeats.length} selected: {selectedSeats.join(', ')}
              </span>
            )}
          </div>

          <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <Legend />
            <Button
              onClick={handleReserve}
              disabled={selectedSeats.length === 0}
              isLoading={isProcessing}
              size="lg"
            >
              Reserve {selectedSeats.length > 0 ? `${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}` : 'Seats'}
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-active)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Clock size={18} color="var(--color-accent)" />
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Confirm Booking</h2>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Your seats are held temporarily. Confirm before the timer expires.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            {reservation.seatNumbers.map((sn) => (
              <span key={sn} className="badge badge-accent" style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
                {sn}
              </span>
            ))}
          </div>

          {/* Timer */}
          <div style={{
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Time remaining</span>
              <span style={{
                fontSize: 'var(--text-2xl)', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                color: minutes === 0 && seconds < 30 ? 'var(--color-error)' : 'var(--color-text-primary)',
              }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <div style={{
              height: 4, background: 'var(--color-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: progress < 20 ? 'var(--color-error)' : 'var(--gradient-accent)',
                  borderRadius: 'var(--radius-full)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            isLoading={isProcessing}
            fullWidth
            size="lg"
            icon={!isProcessing && <CheckCircle2 size={18} />}
          >
            Confirm Booking
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default EventDetailPage;
