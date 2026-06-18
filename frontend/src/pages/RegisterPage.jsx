import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const easeLuxury = [0.22, 1, 0.36, 1];

const RegisterPage = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      
      {/* ── FULL SCREEN BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop" 
          alt="Festival Experience"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) contrast(1.2)' }}
        />
        {/* Gradient overlays to ensure text/form readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }} />
      </div>

      {/* ── LEFT PANEL (Cinematic Showcase) ── */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: easeLuxury }}
        className="auth-left-panel"
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'var(--space-10)',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 'var(--space-10)', left: 'var(--space-10)', zIndex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(200, 77, 255, 0.4)' }}>
              <Ticket size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', color: '#fff', letterSpacing: '0.02em' }}>
              Sort My Scene Assignment<span style={{ color: 'var(--color-accent)' }}>™</span>
            </span>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: easeLuxury }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '4px 12px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-6)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }} />
              Membership Open
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, color: '#fff', lineHeight: 1.1, marginBottom: 'var(--space-6)' }}>
              Join the nightlife elite.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
              Create your profile to secure exclusive access to premium drops and VIP tables globally.
            </p>
          </motion.div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-10)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: easeLuxury }} style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-1)' }}>99.9%</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Checkout Success</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: easeLuxury }} style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-1)' }}>Zero</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Hidden Fees</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL (Auth Form) ── */}
      <div 
        className="auth-right-panel"
        style={{
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 'var(--space-6)',
          zIndex: 1
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, background: 'radial-gradient(circle at 50% 50%, rgba(200, 77, 255, 0.2) 0%, transparent 60%)', zIndex: 0 }} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeLuxury }}
          style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}
        >
          <RegisterForm />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
