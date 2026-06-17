import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/admin/adminStatsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';

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

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin/events" className="card" style={{ flex: 1, textAlign: 'center', color: 'var(--color-text-primary)' }}>
          <h3>Manage Events</h3>
        </Link>
        <Link to="/admin/bookings" className="card" style={{ flex: 1, textAlign: 'center', color: 'var(--color-text-primary)' }}>
          <h3>View Bookings</h3>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Events</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalEvents}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Bookings</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalBookings}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Overall Seat Utilization</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.overallSeatUtilization}</div>
        </div>
      </div>

      <div className="card">
        <h2>Top Events by Bookings</h2>
        {stats.topEventsByBookings.map((event, idx) => (
          <div key={event.eventId} style={{ padding: '0.75rem 0', borderBottom: idx !== stats.topEventsByBookings.length - 1 ? '1px solid var(--color-surface-alt)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
            <span>{event.name}</span>
            <span style={{ fontWeight: 'bold' }}>{event.bookedSeats} seats booked</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
