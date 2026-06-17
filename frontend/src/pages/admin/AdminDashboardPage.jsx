import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminStats } from '../../api/admin/adminStatsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { CalendarDays, Ticket, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorBanner message={error} />;

  const statCards = [
    { label: 'Total Events', value: stats.totalEvents, icon: <CalendarDays size={20} />, gradient: 'var(--gradient-accent)' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Ticket size={20} />, gradient: 'var(--gradient-emerald)' },
    { label: 'Seat Utilization', value: stats.overallSeatUtilization, icon: <TrendingUp size={20} />, gradient: 'var(--gradient-warm)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Overview of your event platform
        </p>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        {[
          { to: '/admin/events', label: 'Manage Events', icon: <CalendarDays size={16} /> },
          { to: '/admin/bookings', label: 'View Bookings', icon: <Ticket size={16} /> },
        ].map((link, i) => (
          <motion.div key={link.to} variants={fadeUp} initial="hidden" animate="visible" custom={i}>
            <Link to={link.to} style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="card" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'border-color var(--duration-fast)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {link.icon}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{link.label}</span>
                </div>
                <ArrowRight size={14} color="var(--color-text-muted)" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {statCards.map((card, i) => (
          <motion.div key={card.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 2} className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>
                {card.label}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-md)',
                background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Top Events */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <BarChart3 size={18} color="var(--color-accent)" />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>Top Events by Bookings</h2>
        </div>
        {stats.topEventsByBookings && stats.topEventsByBookings.length > 0 ? (
          <div>
            {stats.topEventsByBookings.map((event, idx) => (
              <div key={event.eventId} style={{
                padding: 'var(--space-3) 0',
                borderBottom: idx !== stats.topEventsByBookings.length - 1 ? '1px solid var(--color-border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 'var(--radius-full)',
                    background: 'var(--color-surface-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)',
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{event.name}</span>
                </div>
                <span className="badge badge-accent">{event.bookedSeats} booked</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No booking data yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
