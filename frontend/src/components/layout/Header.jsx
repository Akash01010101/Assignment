import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Ticket, LogOut, User, Shield, CalendarDays, BookOpen } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
    fontWeight: isActive(path) ? 600 : 400,
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--duration-fast) var(--ease-out)',
    background: isActive(path) ? 'var(--color-surface-alt)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  });

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        background: scrolled ? 'rgba(9, 9, 11, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all var(--duration-base) var(--ease-out)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Logo */}
          <Link to={user ? '/events' : '/'} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-primary)',
            fontWeight: 700,
            fontSize: 'var(--text-lg)',
            letterSpacing: 'var(--tracking-tight)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ticket size={16} color="#fff" />
            </div>
            EventHub
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}
               className="desktop-nav">
            {user ? (
              <>
                <Link to="/events" style={navLinkStyle('/events')}>
                  <CalendarDays size={14} /> Events
                </Link>
                <Link to="/my-bookings" style={navLinkStyle('/my-bookings')}>
                  <BookOpen size={14} /> My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{
                    ...navLinkStyle('/admin'),
                    color: isActive('/admin') || location.pathname.startsWith('/admin') ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}>
                    <Shield size={14} /> Admin
                  </Link>
                )}
                <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 var(--space-2)' }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color var(--duration-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              padding: 'var(--space-2)',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            style={{
              position: 'fixed',
              top: 'var(--header-height)',
              right: 0,
              bottom: 0,
              width: '280px',
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              padding: 'var(--space-6)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {user ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  marginBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: 'var(--space-4)',
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: 'var(--text-sm)',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{user.email}</div>
                  </div>
                </div>
                <Link to="/events" style={navLinkStyle('/events')}><CalendarDays size={16} /> Events</Link>
                <Link to="/my-bookings" style={navLinkStyle('/my-bookings')}><BookOpen size={16} /> My Bookings</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" style={navLinkStyle('/admin')}><Shield size={16} /> Admin Panel</Link>
                )}
                <div style={{ marginTop: 'auto' }}>
                  <Button variant="ghost" fullWidth onClick={handleLogout} icon={<LogOut size={14} />}>Logout</Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="secondary" fullWidth>Login</Button></Link>
                <Link to="/register"><Button fullWidth>Get Started</Button></Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              top: 'var(--header-height)',
              background: 'rgba(0,0,0,0.4)',
              zIndex: 98,
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Header;
