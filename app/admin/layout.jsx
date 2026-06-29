import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Admin Dashboard | Mountain Breeze Villa',
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <Layout>
        {children}
        <Toaster position="top-right" />
      </Layout>
    </AuthProvider>
  );
}
