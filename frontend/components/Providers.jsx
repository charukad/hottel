'use client';

import { Toaster } from 'react-hot-toast';

const Providers = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2d5a3d',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </>
  );
};

export default Providers;
