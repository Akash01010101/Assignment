import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ background: 'var(--color-surface)', padding: '1rem 0', borderBottom: '1px solid var(--color-surface-alt)' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          Ticket<span style={{ color: 'var(--color-accent)' }}>Booking</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/" style={{ color: 'var(--color-text-primary)' }}>Events</Link>
              <Link to="/my-bookings" style={{ color: 'var(--color-text-primary)' }}>My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: 'var(--color-accent)' }}>Admin Panel</Link>
              )}
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '1rem' }}>{user.name}</span>
              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="secondary">Login</Button></Link>
              <Link to="/register"><Button>Register</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
