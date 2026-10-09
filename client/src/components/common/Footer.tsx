import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Instagram,
  Facebook,
  Twitter,
  X,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [policyModal, setPolicyModal] = useState<{ title: string; content: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    toast.success('Thank you for subscribing! Exclusive venue offers are on their way.');
    setEmail('');
  };

  const policies: Record<string, { title: string; content: string }> = {
    booking: {
      title: 'Booking & Slot Reservation Policy',
      content:
        'All reservations are confirmed through our atomic lock concurrency system to ensure zero double-booking collisions. Morning slots run 09:00 AM – 02:00 PM, Evening slots run 06:00 PM – 11:00 PM, and Full Day slots run 09:00 AM – 11:00 PM. Full day holds prevent any overlapping reservations for the specified date.',
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      content:
        'Cancellations made at least 14 days prior to your scheduled event date are eligible for a 100% full refund or a complimentary date rescheduling. Cancellations made between 7 and 13 days prior are eligible for a 50% refund or date transfer credit. Cancellations within 7 days are non-refundable.',
    },
    privacy: {
      title: 'Privacy Policy',
      content:
        'GrandVenues respects your privacy. We collect client contact and event information strictly for reservation coordination, verification receipts, and security passes. Your personal information is encrypted and never shared or sold to third parties.',
    },
    terms: {
      title: 'Terms of Service',
      content:
        'By reserving a venue on GrandVenues, clients agree to adhere to banquet hall noise regulations, capacity limits, and venue property guidelines. Any custom decor or catering setups should be coordinated with the venue manager desk prior to the event commencement.',
    },
  };

  return (
    <>
      <footer className="bg-[#17191C] text-slate-300 pt-16 pb-12 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <h3 className="text-white font-serif font-bold text-2xl tracking-[0.12em] uppercase">
                GrandVenues
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Premier banquet & wedding hall reservation system. Live slot availability, instant online booking, and curated celebration spaces.
              </p>
              <div className="pt-2 text-xs text-slate-500">
                <p>Central City • 560001</p>
                <p>reservations@grandvenues.com</p>
              </div>
            </div>

            {/* Column 2: WE CARE */}
            <div className="space-y-4">
              <h4 className="text-[#C5A46D] font-bold text-xs uppercase tracking-[0.2em]">
                We Care
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>
                  <a href="/#faq" className="hover:text-[#C5A46D] transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:reservations@grandvenues.com"
                    className="hover:text-[#C5A46D] transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link to="/check-booking" className="hover:text-[#C5A46D] transition-colors">
                    Track Your Booking
                  </Link>
                </li>
                <li>
                  <Link to="/halls" className="hover:text-[#C5A46D] transition-colors">
                    Explore Banquet Halls
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-[#C5A46D] transition-colors">
                    Manager Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: COMPANY POLICY */}
            <div className="space-y-4">
              <h4 className="text-[#C5A46D] font-bold text-xs uppercase tracking-[0.2em]">
                Company Policy
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li>
                  <button
                    onClick={() => setPolicyModal(policies.booking)}
                    className="hover:text-[#C5A46D] transition-colors text-left"
                  >
                    Booking & Slot Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyModal(policies.refund)}
                    className="hover:text-[#C5A46D] transition-colors text-left"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyModal(policies.privacy)}
                    className="hover:text-[#C5A46D] transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyModal(policies.terms)}
                    className="hover:text-[#C5A46D] transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: SUBSCRIBE TODAY! */}
            <div className="space-y-4">
              <h4 className="text-[#C5A46D] font-bold text-xs uppercase tracking-[0.2em]">
                Subscribe Today!
              </h4>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-2.5 rounded-sm bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A46D]"
                />
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#9E7D4F] hover:bg-[#8C6E40] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md active:scale-95"
                >
                  Sign Up
                </button>
              </form>

              {/* Social Icons matching screenshot */}
              <div className="flex items-center space-x-4 pt-3 text-slate-400">
                <a
                  href="mailto:reservations@grandvenues.com"
                  aria-label="Email"
                  className="hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar matching screenshot */}
          <div className="border-t border-white/5 pt-8 flex items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} GrandVenues.</p>
          </div>
        </div>
      </footer>



      {/* Policy Modal */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#17191C] border border-white/15 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">{policyModal.title}</h3>
              <button
                onClick={() => setPolicyModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{policyModal.content}</p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPolicyModal(null)}
                className="px-5 py-2 bg-[#9E7D4F] hover:bg-[#8C6E40] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
