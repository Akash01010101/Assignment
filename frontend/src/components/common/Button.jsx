import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: { background: 'var(--color-accent)', color: '#fff' },
    secondary: { background: 'var(--color-surface-alt)', color: 'var(--color-text-primary)' },
    danger: { background: 'var(--color-error)', color: '#fff' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
