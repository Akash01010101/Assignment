import React, { useState, useEffect } from 'react';
import { getBusinessApplications, approveBusiness, rejectBusiness } from '../../api/admin/adminBusinessApi';
import ErrorBanner from '../../components/common/ErrorBanner';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { Building2, Check, X, Mail, Globe, MapPin, Phone, User } from 'lucide-react';

const AdminBusinessAccountsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getBusinessApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBusiness(id);
      // Update local state
      setApplications(apps => apps.map(app => app._id === id ? { ...app, role: 'organizer', businessProfile: { ...app.businessProfile, status: 'approved' } } : app));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve application');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBusiness(id);
      // Update local state
      setApplications(apps => apps.map(app => app._id === id ? { ...app, businessProfile: { ...app.businessProfile, status: 'rejected' } } : app));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject application');
    }
  };

  if (loading) return <Spinner fullPage />;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-success">Approved</span>;
      case 'rejected': return <span className="badge badge-error">Rejected</span>;
      default: return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)', margin: 0 }}>
            Business Applications
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>Review and manage organizer accounts</p>
        </div>
      </div>

      <ErrorBanner message={error} />

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>No business applications found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {applications.map((app, i) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      {app.businessProfile?.companyName || 'Unknown Company'}
                      {getStatusBadge(app.businessProfile?.status)}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                      {app.businessProfile?.businessType} • Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {app.businessProfile?.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button variant="outline" size="sm" onClick={() => handleReject(app._id)} icon={<X size={16} />}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(app._id)} icon={<Check size={16} />}>
                      Approve
                    </Button>
                  </div>
                )}
              </div>

              <div className="divider" style={{ margin: 0 }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>CONTACT PERSON</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} color="var(--color-text-muted)" /> {app.name}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>EMAIL</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} color="var(--color-text-muted)" /> {app.email}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>PHONE</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} color="var(--color-text-muted)" /> {app.businessProfile?.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>LOCATION</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="var(--color-text-muted)" /> {app.businessProfile?.location || 'N/A'}
                  </p>
                </div>
                {app.businessProfile?.companyWebsite && (
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 2 }}>WEBSITE</p>
                    <a href={app.businessProfile.companyWebsite} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Globe size={14} /> {app.businessProfile.companyWebsite}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBusinessAccountsPage;
