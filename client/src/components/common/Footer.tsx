import React from 'react';
import { Link } from 'react-router-dom';
import { Castle, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Castle className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">GrandVenues</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier party and wedding hall booking platform. Seamless online reservations, live slot availability, and trusted event coordination.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/halls" className="hover:text-indigo-400 transition-colors">
                  Available Banquet Halls
                </Link>
              </li>
              <li>
                <Link to="/check-booking" className="hover:text-indigo-400 transition-colors">
                  Check Booking Status
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition-colors">
                  Venue Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Hall Highlights */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Venue Features</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>• Grand Wedding Ballrooms</li>
              <li>• Open-Air Garden Lawns</li>
              <li>• Corporate Convention Halls</li>
              <li>• Climate Controlled Glass Pavilions</li>
              <li>• Ample Parking & Valet Services</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Venue Desk</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <span>Premier Convention Center Road, Central City, 560001</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 (800) 456-7890</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>reservations@grandvenues.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GrandVenues Systems. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with care for memorable celebrations</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
