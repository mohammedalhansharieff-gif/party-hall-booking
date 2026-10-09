import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Halls } from './pages/Halls';
import { HallDetail } from './pages/HallDetail';
import { BookingPage } from './pages/BookingPage';
import { BookingSuccess } from './pages/BookingSuccess';
import { CheckBooking } from './pages/CheckBooking';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminHalls } from './pages/admin/AdminHalls';
import { AnimatedGradient } from './components/ui/animated-gradient';
import AnimatedGradientDemo from './components/ui/demo';
import { useAuthStore } from './store/authStore';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EDE0] font-sans text-slate-800 relative">
      {/* Last layer background for all in rich viscous luxury beige */}
      <AnimatedGradient
        variant="beige"
        speed={0.25}
        opacity={0.96}
        interactive={true}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1610',
            color: '#FAF7F2',
            border: '1px solid rgba(195, 150, 38, 0.3)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/halls" element={<Halls />} />
          <Route path="/halls/:id" element={<HallDetail />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/check-booking" element={<CheckBooking />} />
          <Route path="/demo/gradient" element={<AnimatedGradientDemo />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedAdminRoute>
                <AdminBookings />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/halls"
            element={
              <ProtectedAdminRoute>
                <AdminHalls />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
