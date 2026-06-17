import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, Briefcase, MapPin, Globe, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import ErrorBanner from '../components/common/ErrorBanner';
import { Link } from 'react-router-dom';

const BusinessAccountPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    companyWebsite: '',
    businessType: 'Event Organizer',
    location: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate API call for business account creation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (success) {
    return (
      <div style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) 0' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: 500, textAlign: 'center' }}>
          <ShieldCheck size={64} color="var(--color-success)" style={{ margin: '0 auto var(--space-6)' }} />
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Application Received</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
            Thank you for applying for a Business Account. Our team will review your details and you will receive an email confirmation within 24-48 hours.
          </p>
          <Link to="/">
            <Button size="lg" fullWidth>Return to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 700 }}
      >
        <div style={{ height: 4, background: 'var(--gradient-hero)', borderRadius: 'var(--radius-full) var(--radius-full) 0 0' }} />

        <div className="card" style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-xl)',
              background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-4)',
            }}>
              <Building2 size={28} />
            </div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)' }}>
              Create a Business Account
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Join our network of elite event organizers and manage your events seamlessly.
            </p>
          </div>

          <ErrorBanner message={error} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Personal Details */}
            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <User size={16} color="var(--color-accent)" /> Contact Person
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="input-group">
                  <label>First Name</label>
                  <input name="firstName" type="text" className="input-field" placeholder="Jane" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input name="lastName" type="text" className="input-field" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Lock size={16} color="var(--color-accent)" /> Account Credentials
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="input-group">
                  <label>Work Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input name="email" type="email" className="input-field" style={{ paddingLeft: 38 }} placeholder="jane@company.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input name="password" type="password" className="input-field" style={{ paddingLeft: 38 }} placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={8} />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Briefcase size={16} color="var(--color-accent)" /> Business Profile
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="input-group">
                  <label>Company/Organization Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input name="companyName" type="text" className="input-field" style={{ paddingLeft: 38 }} placeholder="Acme Events LLC" value={form.companyName} onChange={handleChange} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label>Business Type</label>
                    <select name="businessType" className="input-field" value={form.businessType} onChange={handleChange} required>
                      <option value="Event Organizer">Event Organizer</option>
                      <option value="Venue Owner">Venue Owner</option>
                      <option value="Ticketing Agency">Ticketing Agency</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input name="phoneNumber" type="tel" className="input-field" style={{ paddingLeft: 38 }} placeholder="+1 (555) 000-0000" value={form.phoneNumber} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label>Company Website</label>
                    <div style={{ position: 'relative' }}>
                      <Globe size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input name="companyWebsite" type="url" className="input-field" style={{ paddingLeft: 38 }} placeholder="https://example.com" value={form.companyWebsite} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>City/Location</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input name="location" type="text" className="input-field" style={{ paddingLeft: 38 }} placeholder="New York, NY" value={form.location} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <Button type="submit" fullWidth isLoading={loading} size="lg" icon={!loading && <ArrowRight size={18} />}>
                Submit Application
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            By creating an account, you agree to our <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          form > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BusinessAccountPage;
