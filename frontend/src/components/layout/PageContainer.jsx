import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      {children}
    </main>
  );
};

export default PageContainer;
