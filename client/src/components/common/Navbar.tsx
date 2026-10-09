import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Castle, CalendarCheck, ShieldCheck, Menu, X, LogOut, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#FCFAF7]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#835D12] via-[#A17619] to-[#C39626] flex items-center justify-center text-white shadow-md shadow-amber-900/15 group-hover:scale-105 transition-transform">
              <Castle className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                GrandVenues
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Party & Wedding Halls
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/halls"
              className={`text-sm font-semibold transition-colors ${
                isActive('/halls') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Halls
            </Link>
            <Link
              to="/check-booking"
              className={`text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                isActive('/check-booking') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Track Booking</span>
            </Link>

            {admin ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                <Link
                  to="/admin"
                  className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}

            <Link
              to="/halls"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-amber-900/15 hover:shadow-lg hover:shadow-amber-900/20 hover:brightness-105 transition-all active:scale-95"
            >
              Book a Venue
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/halls"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Browse Halls
          </Link>
          <Link
            to="/check-booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Track Booking
          </Link>
          {admin ? (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-500 hover:bg-slate-100"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
