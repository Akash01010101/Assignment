import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import ErrorBanner from '../common/ErrorBanner';

const easeLuxury = [0.22, 1, 0.36, 1];

/* ── Luxury Magnetic Button ──────────────────────────────────── */
const MagneticButton = ({ children, onClick, isLoading }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      disabled={isLoading}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: 'relative',
        width: '100%',
        padding: 'var(--space-4)',
        background: 'var(--gradient-accent)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        color: '#fff',
        fontWeight: 600,
        fontSize: 'var(--text-base)',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        boxShadow: 'var(--shadow-luxury-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        overflow: 'hidden',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {/* Animated Shine Sweep */}
      <motion.div
        animate={{ left: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear', delay: 1 }}
        style={{
          position: 'absolute', top: 0, bottom: 0, width: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />
      {isLoading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
      ) : (
        <>
          {children} <ArrowRight size={18} />
        </>
      )}
    </motion.button>
  );
};

/* ── Luxury Glass Input ──────────────────────────────────────── */
const GlassInput = ({ icon: Icon, label, type, placeholder, value, onChange, isPassword, showPassword, togglePassword }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{label}</label>
      <motion.div
        animate={{ 
          borderColor: isFocused ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
          boxShadow: isFocused ? '0 0 0 1px var(--color-accent), 0 0 20px rgba(200, 77, 255, 0.15)' : 'none',
          background: isFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(10px)',
          padding: '0 var(--space-4)',
          height: 56,
        }}
      >
        <Icon size={18} color={isFocused ? 'var(--color-accent)' : 'var(--color-text-muted)'} style={{ transition: 'color 0.2s' }} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 'var(--text-base)',
            padding: '0 var(--space-3)',
            outline: 'none',
            width: '100%'
          }}
        />
        {isPassword && (
          <motion.button
            type="button"
            onClick={togglePassword}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

/* ── Main Form Component ─────────────────────────────────────── */
const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15,15,18,0.7)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'var(--space-10)',
      boxShadow: 'var(--shadow-luxury)',
      width: '100%'
    }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '4px 12px', background: 'rgba(200,77,255,0.1)', border: '1px solid rgba(200,77,255,0.2)', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}
        >
          <Sparkles size={12} /> Exclusive Access
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 500, color: '#fff', marginBottom: 'var(--space-2)' }}
        >
          Welcome Back
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', margin: 0 }}
        >
          Enter your credentials to access your premium account.
        </motion.p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
            <ErrorBanner message={error} />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <GlassInput 
            icon={Mail} label="Email Address" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <GlassInput 
            icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            isPassword={true} showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: 'var(--space-2)' }}>
          <MagneticButton isLoading={loading} onClick={handleSubmit}>
            Sign In
          </MagneticButton>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ textAlign: 'center', marginTop: 'var(--space-8)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}
      >
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Request Access</Link>
      </motion.p>

      {/* Social Proof Footer inside Card */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        Trusted by 50,000+ elite attendees worldwide
      </motion.div>
    </div>
  );
};

export default LoginForm;
