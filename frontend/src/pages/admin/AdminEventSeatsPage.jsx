import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminEventSeats, releaseSeat } from '../../api/admin/adminSeatsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ArrowLeft, Armchair, Unlock } from 'lucide-react';

const AdminEventSeatsPage = () => {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [releaseTarget, setReleaseTarget] = useState(null);
  const [releasing, setReleasing] = useState(false);

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

  useEffect(() => { fetchSeats(); }, [id]);

  const handleRelease = async () => {
    if (!releaseTarget) return;
    setReleasing(true);
    try {
      await releaseSeat(releaseTarget._id);
      setReleaseTarget(null);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to release seat');
    } finally {
      setReleasing(false);
    }
  };

  // Group by row
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.seatNumber.replace(/[0-9]/g, '');
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  const counts = {
    available: seats.filter((s) => s.status === 'available').length,
    reserved: seats.filter((s) => s.status === 'reserved').length,
    booked: seats.filter((s) => s.status === 'booked').length,
  };

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Link to="/admin/events" style={{ color: 'var(--color-text-muted)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', margin: 0 }}>
            Manage Seats
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>{seats.length} seats total</p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
          {counts.available} Available
        </span>
        <span className="badge badge-warning" style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
          {counts.reserved} Reserved
        </span>
        <span className="badge badge-error" style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
          {counts.booked} Booked
        </span>
      </div>

      {/* Seat Grid */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', marginBottom: 'var(--space-6)' }}>
          STAGE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {Object.entries(rows).map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 24, textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {rowLabel}
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                {rowSeats.map((seat) => {
                  let bg, border, color;
                  if (seat.status === 'available') {
                    bg = 'var(--color-surface-alt)'; border = '1px solid var(--color-border)'; color = 'var(--color-text-secondary)';
                  } else if (seat.status === 'reserved') {
                    bg = 'var(--color-seat-reserved-bg)'; border = '1px solid rgba(245,158,11,0.3)'; color = 'var(--color-seat-reserved)';
                  } else {
                    bg = 'rgba(239,68,68,0.1)'; border = '1px solid rgba(239,68,68,0.2)'; color = 'var(--color-error)';
                  }

                  return (
                    <motion.div
                      key={seat._id}
                      whileHover={seat.status === 'reserved' ? { scale: 1.1 } : {}}
                      onClick={() => seat.status === 'reserved' && setReleaseTarget(seat)}
                      style={{
                        width: 36, height: 36,
                        background: bg, border, color,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: seat.status === 'reserved' ? 'pointer' : 'default',
                        fontSize: 'var(--text-xs)', fontWeight: 600,
                        transition: 'all 0.15s',
                      }}
                      title={`${seat.seatNumber} — ${seat.status}${seat.status === 'reserved' ? ' (click to release)' : ''}`}
                    >
                      {seat.seatNumber.replace(/[A-Z]/g, '')}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }} /> Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--color-seat-reserved-bg)', border: '1px solid rgba(245,158,11,0.3)' }} /> Reserved (click to release)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }} /> Booked
          </div>
        </div>
      </div>

      {/* Release Confirmation Modal */}
      <Modal isOpen={!!releaseTarget} onClose={() => setReleaseTarget(null)} title="Release Seat">
        <div style={{ textAlign: 'center' }}>
          <Armchair size={40} color="var(--color-warning)" style={{ marginBottom: 'var(--space-4)' }} />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Release seat <strong style={{ color: 'var(--color-text-primary)' }}>{releaseTarget?.seatNumber}</strong>?
            This will cancel the active reservation and make the seat available again.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Button variant="ghost" onClick={() => setReleaseTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleRelease} isLoading={releasing} icon={<Unlock size={14} />}>
              Release Seat
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminEventSeatsPage;
