import React from 'react';

const sizeMap = {
  sm: { width: 16, height: 16, stroke: 2 },
  md: { width: 24, height: 24, stroke: 2 },
  lg: { width: 40, height: 40, stroke: 2.5 },
};

const Spinner = ({ size = 'md', color = 'var(--color-accent)', fullPage = false }) => {
  const { width, height, stroke } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="50"
        strokeDashoffset="15"
        opacity="0.9"
      />
    </svg>
  );

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
      {spinner}
    </div>
  );
};

export default Spinner;
