import React from 'react';

const SkeletonLoader = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return items.map((_, i) => (
      <div key={i} style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        <div className="skeleton" style={{ width: '60%', height: 20 }} />
        <div className="skeleton" style={{ width: '80%', height: 14 }} />
        <div className="skeleton" style={{ width: '40%', height: 14 }} />
        <div className="skeleton" style={{ width: '100%', height: 40, marginTop: 'var(--space-2)' }} />
      </div>
    ));
  }

  if (variant === 'table-row') {
    return items.map((_, i) => (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) 0',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div className="skeleton" style={{ width: '50%', height: 14 }} />
          <div className="skeleton" style={{ width: '30%', height: 12 }} />
        </div>
        <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 'var(--radius-full)' }} />
      </div>
    ));
  }

  if (variant === 'text') {
    return items.map((_, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className="skeleton" style={{ width: '90%', height: 14 }} />
        <div className="skeleton" style={{ width: '70%', height: 14 }} />
        <div className="skeleton" style={{ width: '80%', height: 14 }} />
      </div>
    ));
  }

  return null;
};

export default SkeletonLoader;
