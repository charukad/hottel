'use client';

import { Toaster } from 'react-hot-toast';
import ScrollProgress from './ui/ScrollProgress';

const Providers = ({ children }) => {
  return (
    <>
      <ScrollProgress />
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 46, 35, 0.9)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            fontSize: '0.9rem',
          },
        }}
      />
    </>
  );
};

export default Providers;
