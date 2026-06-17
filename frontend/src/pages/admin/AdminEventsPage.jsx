import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminEvents, createAdminEvent, deleteAdminEvent } from '../../api/admin/adminEventsApi';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';
import { Plus, Trash2, Grid3X3, CalendarDays, MapPin, Search } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] } }),
};

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create form state
  const [form, setForm] = useState({ name: '', venue: '', dateTime: '', totalSeats: '', seatsPerRow: '10' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

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

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminEvent(id);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      await createAdminEvent({
        name: form.name,
        venue: form.venue,
        dateTime: new Date(form.dateTime).toISOString(),
        totalSeats: parseInt(form.totalSeats),
        seatsPerRow: parseInt(form.seatsPerRow),
      });
      setShowCreateModal(false);
      setForm({ name: '', venue: '', dateTime: '', totalSeats: '', seatsPerRow: '10' });
      fetchEvents();
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Spinner fullPage />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-1)' }}>
            Manage Events
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>{events.length} events total</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={<Plus size={16} />}>
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--space-6)', maxWidth: 400 }}>
        <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="input-field"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filteredEvents.map((event, i) => (
          <motion.div key={event.id} variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="card" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 'var(--space-4)', flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                {event.name}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  <MapPin size={12} /> {event.venue}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  <CalendarDays size={12} /> {formatDate(event.dateTime)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span className="badge badge-success">{event.availableSeats} available</span>
                <span className="badge badge-warning">{event.reservedSeats} reserved</span>
                <span className="badge badge-error">{event.bookedSeats} booked</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Link to={`/admin/events/${event.id}/seats`}>
                <Button variant="secondary" size="sm" icon={<Grid3X3 size={14} />}>Seats</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleDelete(event.id, event.name)} icon={<Trash2 size={14} />}>
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
        {filteredEvents.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
            {searchQuery ? 'No events match your search.' : 'No events created yet.'}
          </p>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Event" maxWidth="520px">
        <ErrorBanner message={createError} />
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label>Event Name</label>
            <input className="input-field" placeholder="React Conf 2026" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Venue</label>
            <input className="input-field" placeholder="Convention Center" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              required
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label>Total Seats</label>
              <input type="number" className="input-field" placeholder="50" min="1" max="500" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} required />
            </div>
            <div className="input-group">
              <label>Seats per Row</label>
              <input type="number" className="input-field" placeholder="10" min="1" max="20" value={form.seatsPerRow} onChange={(e) => setForm({ ...form, seatsPerRow: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={createLoading}>Create Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEventsPage;
