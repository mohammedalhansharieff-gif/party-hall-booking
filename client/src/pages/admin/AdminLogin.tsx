import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('admin@hallbooking.com');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#FCFAF7] rounded-3xl border border-slate-200/90 shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Venue Management Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access admin bookings, calendar management, and hall tariffs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hallbooking.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          {/* Seed credentials hint */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">Default Seed Credentials:</p>
            <p>Email: <span className="font-mono text-indigo-600">admin@hallbooking.com</span></p>
            <p>Password: <span className="font-mono text-indigo-600">admin123</span></p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] hover:brightness-105 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md shadow-amber-900/15 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
