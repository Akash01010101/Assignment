import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: {
    background: 'var(--gradient-accent)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  success: {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
  },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: 'var(--text-xs)' },
  md: { padding: '10px 20px', fontSize: 'var(--text-sm)' },
  lg: { padding: '14px 28px', fontSize: 'var(--text-base)' },
};

const LoadingSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.6s linear infinite' }}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" opacity="0.8" />
  </svg>
);

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  icon,
  style = {},
  className = '',
  ...props
}) => {
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        lineHeight: 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: 'var(--tracking-wide)',
        transition: 'background var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
        ...variantStyle,
        ...sizeStyle,
        ...style,
      }}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : icon}
      {children}
    </motion.button>
  );
};

export default Button;
