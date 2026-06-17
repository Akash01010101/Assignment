import React from 'react';

const ErrorBanner = ({ message, details }) => {
  if (!message) return null;

  return (
    <div style={{ background: 'var(--color-error)', color: '#fff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
      <strong>Error:</strong> {message}
      {details && Array.isArray(details) && (
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          {details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ErrorBanner;
