import { Toaster as HotToaster } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <HotToaster 
      position="bottom-right" 
      containerStyle={{
        bottom: 48,
        right: 48,
      }}
      toastOptions={{
        style: {
          borderRadius: '12px',
          padding: '16px 24px',
          fontWeight: 500,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        },
        success: {
          style: {
            background: '#10b981', // emerald-500
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444', // red-500
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },
      }}
    />
  );
};
