import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ErrorBanner = ({ message, details, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: 'var(--color-error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
          }}
        >
          <AlertCircle size={18} color="var(--color-error)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0 }}>
              {message}
            </p>
            {details && Array.isArray(details) && (
              <ul style={{ margin: 'var(--space-2) 0 0 0', paddingLeft: 'var(--space-4)', color: 'var(--color-error)', fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                {details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-error)',
              cursor: 'pointer',
              padding: 'var(--space-1)',
              opacity: 0.6,
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorBanner;
