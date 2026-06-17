import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const PageContainer = ({ children, noPadding = false }) => {
  return (
    <motion.main
      className="container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        padding: noPadding ? 0 : 'var(--space-8) var(--space-6)',
        minHeight: 'calc(100vh - var(--header-height))',
      }}
    >
      {children}
    </motion.main>
  );
};

export default PageContainer;
