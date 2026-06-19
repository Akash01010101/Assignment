import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyBookings } from '../hooks/useMyBookings';
import { useMyReservations } from '../hooks/useMyReservations';
import { useReservationTimer } from '../hooks/useReservationTimer';
import { confirmBooking } from '../api/bookingsApi';
import Spinner from '../components/common/Spinner';
import ErrorBanner from '../components/common/ErrorBanner';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatDate';
import { Ticket, CalendarDays, MapPin, Armchair, ArrowRight, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Single Reservation Card ──────────────────────────────── */
const ReservationCard = ({ reservation, index, onConfirmed }) => {
  const { minutes, seconds, isExpired } = useReservationTimer(reservation.expiresAt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const expired = reservation.isExpired || isExpired;

  const totalTime = 10 * 60; // matches RESERVATION_TTL_MINUTES default
  const currentTimeLeft = minutes * 60 + seconds;
  const progress = totalTime > 0 ? (currentTimeLeft / totalTime) * 100 : 0;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await confirmBooking(reservation.id);
      setConfirmed(true);
      setTimeout(() => onConfirmed(), 1200);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to confirm booking';
      if (err.response?.status === 410) {
        setError('This reservation has expired.');
      } else {
        setError(msg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
        style={{
          border: '1px solid var(--color-success)',
          textAlign: 'center',
          padding: 'var(--space-6)',
        }}
      >
        <CheckCircle2 size={32} color="var(--color-success)" style={{ marginBottom: 'var(--space-2)' }} />
        <p style={{ fontWeight: 600, color: 'var(--color-success)', margin: 0 }}>Booking Confirmed!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="card"
      style={{
        border: expired
          ? '1px solid var(--color-border)'
          : '1px solid var(--color-border-active)',
        opacity: expired ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      {!expired && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'var(--gradient-accent)',
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        {/* Event info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            {expired ? (
              <AlertTriangle size={16} color="var(--color-text-muted)" />
            ) : (
              <Clock size={16} color="var(--color-accent)" />
            )}
            <span className={`badge ${expired ? '' : 'badge-accent'}`} style={expired ? {
              background: 'rgba(82,82,91,0.15)',
              color: 'var(--color-text-muted)',
            } : {}}>
              {expired ? 'Expired' : 'Active Reservation'}
            </span>
          </div>

          <h3 style={{
            fontSize: 'var(--text-base)', fontWeight: 600,
            marginBottom: 'var(--space-2)',
          }}>
            {reservation.event?.name || 'Unknown Event'}
          </h3>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              <MapPin size={12} /> {reservation.event?.venue}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              <CalendarDays size={12} /> {formatDate(reservation.event?.dateTime)}
            </span>
          </div>

          {/* Seat badges */}
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            <Armchair size={12} style={{ color: 'var(--color-text-muted)', marginTop: 2, marginRight: 2 }} />
            {reservation.seatNumbers.map((sn) => (
              <span key={sn} className={`badge ${expired ? '' : 'badge-accent'}`} style={expired ? {
                background: 'rgba(82,82,91,0.15)',
                color: 'var(--color-text-muted)',
              } : {}}>
                {sn}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: timer or expired + action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-3)', minWidth: 160 }}>
          {!expired ? (
            <>
              {/* Timer */}
              <div style={{
                background: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3) var(--space-4)',
                width: '100%',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Time left</span>
                  <span style={{
                    fontSize: 'var(--text-lg)', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    color: minutes === 0 && seconds < 30 ? 'var(--color-error)' : 'var(--color-text-primary)',
                  }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
                <div style={{
                  height: 3, background: 'var(--color-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden',
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

              {/* Confirm button */}
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                isLoading={isProcessing}
                size="sm"
                icon={!isProcessing && <CheckCircle2 size={14} />}
                style={{ width: '100%' }}
              >
                Confirm Booking
              </Button>
            </>
          ) : (
            <div style={{
              background: 'rgba(82,82,91,0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'center',
              width: '100%',
            }}>
              <AlertTriangle size={20} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-1)' }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Reservation expired. Seats have been released.
              </p>
            </div>
          )}

          {error && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', margin: 0, textAlign: 'right' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Page ──────────────────────────────────────────────────── */
const MyBookingsPage = () => {
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useMyBookings();
  const { data: reservations, isLoading: reservationsLoading, error: reservationsError, refetch: refetchReservations } = useMyReservations();

  const isLoading = bookingsLoading || reservationsLoading;
  const error = bookingsError || reservationsError;

  const handleConfirmed = () => {
    refetchBookings();
    refetchReservations();
  };

  if (error) return <ErrorBanner message={error} />;

  // Separate active vs expired reservations
  const activeReservations = reservations.filter((r) => !r.isExpired && r.expiresAt && new Date(r.expiresAt) > new Date());
  const expiredReservations = reservations.filter((r) => r.isExpired || !r.expiresAt || new Date(r.expiresAt) <= new Date());

  const hasReservations = reservations.length > 0;

  return (
    <div>
      {/* ── Page Title ── */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)', fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)',
        }}>
          My Bookings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Your confirmed event tickets & pending reservations
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : (
        <>
          {/* ── Active Reservations Section ── */}
          {activeReservations.length > 0 && (
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Clock size={18} color="var(--color-accent)" />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
                  Pending Reservations
                </h2>
                <span className="badge badge-accent" style={{ fontSize: 'var(--text-xs)' }}>
                  {activeReservations.length}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-4) 0' }}>
                These seats are held for you. Confirm before the timer expires!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {activeReservations.map((res, i) => (
                  <ReservationCard
                    key={res.id}
                    reservation={res}
                    index={i}
                    onConfirmed={handleConfirmed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Expired Reservations Section ── */}
          {expiredReservations.length > 0 && (
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size={18} color="var(--color-text-muted)" />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0, color: 'var(--color-text-secondary)' }}>
                  Expired Reservations
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {expiredReservations.map((res, i) => (
                  <ReservationCard
                    key={res.id}
                    reservation={{ ...res, isExpired: true }}
                    index={i}
                    onConfirmed={handleConfirmed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Divider (only if we have both reservations and bookings) ── */}
          {hasReservations && bookings.length > 0 && (
            <div style={{
              height: 1,
              background: 'var(--color-border)',
              margin: 'var(--space-4) 0 var(--space-8)',
            }} />
          )}

          {/* ── Confirmed Bookings Section ── */}
          {bookings.length === 0 && !hasReservations ? (
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
          ) : bookings.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Ticket size={18} color="var(--color-accent)" />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>
                  Confirmed Bookings
                </h2>
                <span className="badge badge-accent" style={{ fontSize: 'var(--text-xs)' }}>
                  {bookings.length}
                </span>
              </div>
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookingsPage;
