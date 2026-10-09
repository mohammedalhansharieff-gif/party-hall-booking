import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { SignInCard2 } from './components/ui/sign-in-card-2';
import { useAuthStore } from './store/authStore';

export const App: React.FC = () => {
  const { token, checkAuth } = useAuthStore();
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin/login';

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Gatekeeper: If user is not logged in, redirect them immediately to login/signup
  if (!token && !isAuthPage) {
    return (
      <>
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
        <Routes>
          <Route path="/login" element={<SignInCard2 />} />
          <Route path="/signup" element={<SignInCard2 />} />
          <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
        </Routes>
      </>
    );
  }

  // If visiting the auth page standalone (login / signup)
  if (isAuthPage) {
    return (
      <>
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
        <Routes>
          <Route path="/login" element={<SignInCard2 />} />
          <Route path="/signup" element={<SignInCard2 />} />
          <Route path="/admin/login" element={<SignInCard2 />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // Authenticated: The entire website is accessible with luxury styling, navigation, and footer
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EDE0] font-sans text-slate-800 relative">
      {/* Background silk gradient */}
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
          {/* Main Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/halls" element={<Halls />} />
          <Route path="/halls/:id" element={<HallDetail />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/check-booking" element={<CheckBooking />} />
          <Route path="/demo/gradient" element={<AnimatedGradientDemo />} />
          <Route path="/demo/sign-in" element={<SignInCard2 />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/halls" element={<AdminHalls />} />
          <Route path="/admin/legacy-login" element={<AdminLogin />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
