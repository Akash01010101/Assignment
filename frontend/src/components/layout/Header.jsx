import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, Ticket, LogOut, Shield, CalendarDays, BookOpen, User, ChevronDown } from 'lucide-react';

const easeLuxury = [0.22, 1, 0.36, 1];

/* ── Magnetic Link Interaction ───────────────────────────────── */
const MagneticLink = ({ children, to, isActive, isDashboard }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        style={{
          position: 'relative',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          color: isActive || isDashboard ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          fontWeight: isActive || isDashboard ? 600 : 500,
          fontSize: 'var(--text-sm)',
          transition: 'color var(--duration-fast)',
          zIndex: 1,
        }}
      >
        {isDashboard && <Shield size={14} color="var(--color-accent)" />}
        {children}
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--color-border)',
              borderRadius: 'var(--radius-full)',
              zIndex: -1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};



/* ── VIP Profile Dropdown ────────────────────────────────────── */
const UserDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          padding: '4px 12px 4px 4px', borderRadius: 'var(--radius-full)',
          cursor: 'pointer', color: 'var(--color-text-primary)'
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-full)',
          background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 'var(--text-sm)', color: '#fff',
          boxShadow: '0 0 15px rgba(200, 77, 255, 0.4)'
        }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <ChevronDown size={14} style={{ opacity: 0.6 }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: easeLuxury }}
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 'var(--space-2)',
              width: 240, background: 'var(--color-glass)', backdropFilter: 'blur(30px)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-2)', boxShadow: 'var(--shadow-luxury)', zIndex: 100
            }}
          >
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{user.email}</div>
              <div style={{ display: 'inline-block', marginTop: 'var(--space-2)', padding: '2px 8px', background: 'rgba(200,77,255,0.1)', border: '1px solid rgba(200,77,255,0.2)', borderRadius: 'var(--radius-full)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
                VIP Member
              </div>
            </div>
            
            <Link to="/my-bookings" style={{ textDecoration: 'none' }} onClick={() => setOpen(false)}>
              <motion.div whileHover={{ background: 'var(--color-surface-hover)' }} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <BookOpen size={16} /> <span style={{ fontSize: 'var(--text-sm)' }}>My Bookings</span>
              </motion.div>
            </Link>
            
            <motion.div onClick={() => { logout(); setOpen(false); }} whileHover={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', cursor: 'pointer', marginTop: 'var(--space-1)' }}>
              <LogOut size={16} /> <span style={{ fontSize: 'var(--text-sm)' }}>Sign Out</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Header Component ───────────────────────────────────── */
export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const isScrolled = useTransform(scrollY, [0, 50], [0, 1]);
  const headerWidth = useTransform(scrollY, [0, 100], ['100%', '85%']);
  const headerY = useTransform(scrollY, [0, 100], [0, 20]);
  
  // Use state to track scroll to apply class or style correctly for light/dark
  const [scrolledTheme, setScrolledTheme] = useState(false);
  useEffect(() => {
    return scrollY.onChange((latest) => setScrolledTheme(latest > 50));
  }, [scrollY]);

  // Spring configurations for smooth fluid layout changes
  const springWidth = useSpring(headerWidth, { stiffness: 200, damping: 30 });
  const springY = useSpring(headerY, { stiffness: 200, damping: 30 });

  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'center' }}>
        <motion.header
          style={{
            width: springWidth,
            y: springY,
            background: scrolledTheme ? 'var(--color-glass)' : 'transparent',
            backdropFilter: scrolledTheme ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolledTheme ? 'blur(20px)' : 'none',
            border: '1px solid',
            borderColor: scrolledTheme ? 'var(--color-border)' : 'transparent',
            borderRadius: 'var(--radius-full)',
            boxShadow: scrolledTheme ? 'var(--shadow-md)' : 'none',
            height: 72,
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--space-6)',
            maxWidth: 1400,
            marginTop: 'var(--space-4)',
            transition: 'border-radius 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            
            {/* Logo */}
            <Link to={user ? '/events' : '/'} style={{ textDecoration: 'none' }}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(200, 77, 255, 0.4)',
                }}>
                  <Ticket size={18} color="#fff" />
                </div>
                <span className="logo-text" style={{ 
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xl)', 
                  letterSpacing: '0.02em', color: 'var(--color-text-primary)' 
                }}>
                  Sort My Scene Assignment<span style={{ color: 'var(--color-accent)' }}>™</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', marginRight: 'var(--space-4)' }}>
                    <MagneticLink to="/events" isActive={isActive('/events')}>
                      <CalendarDays size={14} /> Showcase
                    </MagneticLink>
                    {(user.role === 'admin' || user.role === 'organizer') && (
                      <MagneticLink to="/admin" isActive={isActive('/admin') || location.pathname.startsWith('/admin')} isDashboard={true}>
                        Dashboard
                      </MagneticLink>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <UserDropdown user={user} logout={logout} />
                  </div>
                </>
              ) : (
                <>
                  <MagneticLink to="/business-account">
                    List your Event
                  </MagneticLink>
                  <MagneticLink to="/login">
                    Sign In
                  </MagneticLink>
                  <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 var(--space-4)' }} />
                  <Link to="/register" style={{ textDecoration: 'none', marginLeft: 'var(--space-4)' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: 'var(--space-2) var(--space-6)',
                        background: 'var(--gradient-accent)',
                        borderRadius: 'var(--radius-full)',
                        color: '#fff', fontWeight: 600, fontSize: 'var(--text-sm)',
                        boxShadow: 'var(--shadow-luxury-glow)',
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
                      }}
                    >
                      Get Started
                    </motion.div>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'none', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                width: 44, height: 44, borderRadius: 'var(--radius-full)',
                alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)', cursor: 'pointer'
              }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </motion.header>
      </div>

      {/* Cinematic Full-Screen Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeLuxury }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'var(--color-glass)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
              display: 'flex', flexDirection: 'column', padding: 'var(--space-6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ticket size={18} color="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>Sort My Scene Assignment</span>
              </div>
              <motion.button
                onClick={() => setMobileOpen(false)}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <motion.nav
              initial="hidden" animate="visible" exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', flex: 1, justifyContent: 'center' }}
            >
              {user ? (
                <>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                    <Link to="/events" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: isActive('/events') ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>Showcase</Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                    <Link to="/my-bookings" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: isActive('/my-bookings') ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>My Bookings</Link>
                  </motion.div>
                  {(user.role === 'admin' || user.role === 'organizer') && (
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                      <Link to="/admin" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: isActive('/admin') ? 'var(--color-accent)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>Dashboard <Shield size={32} /></Link>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                    <Link to="/business-account" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: 'var(--color-text-muted)' }}>List Event</Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                    <Link to="/login" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: 'var(--color-text-muted)' }}>Sign In</Link>
                  </motion.div>
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: easeLuxury } } }}>
                    <Link to="/register" style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 500, color: 'var(--color-accent)' }}>Get Started</Link>
                  </motion.div>
                </>
              )}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ease: easeLuxury }}
              style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            >
              {user && (
                <button onClick={() => { logout(); setMobileOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-lg)', cursor: 'pointer' }}>
                  <LogOut size={20} /> Sign Out
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .logo-text { display: none !important; }
        }
      `}</style>
    </>
  );
}
