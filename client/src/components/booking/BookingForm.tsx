import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Users, MessageSquare, CreditCard, Clock, ShieldCheck, Check } from 'lucide-react';
import { Hall, SlotAvailability } from '../../types';
import { createBooking, confirmPayment } from '../../api/bookings.api';

interface BookingFormProps {
  hall: Hall;
  date: string;
  slot: SlotAvailability;
}

interface FormInputs {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount?: number;
  specialRequests?: string;
  paymentMode: 'PAY_NOW' | 'PAY_LATER';
}

export const BookingForm: React.FC<BookingFormProps> = ({ hall, date, slot }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      guestCount: Math.min(200, hall.capacity),
      paymentMode: 'PAY_NOW',
    },
  });

  const selectedPaymentMode = watch('paymentMode');

  const onSubmit = async (values: FormInputs) => {
    setIsSubmitting(true);
    try {
      // 1. Create booking on server
      const res = await createBooking({
        hallId: hall.id,
        timeSlotId: slot.id,
        date,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        guestCount: values.guestCount ? Number(values.guestCount) : undefined,
        specialRequests: values.specialRequests,
      });

      const booking = res.data;
      const order = res.paymentOrder;

      if (values.paymentMode === 'PAY_NOW') {
        // If payment mode is PAY_NOW, execute payment (Mock or Razorpay)
        if (order.isMock) {
          toast.success('Mock payment gateway simulated successfully!');
          await confirmPayment(booking.bookingRef, {
            paymentId: `pay_mock_${Date.now()}`,
            orderId: order.orderId,
          });
        } else {
          // Razorpay standard modal integration
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: 'GrandVenues Hall Booking',
            description: `Booking for ${hall.name}`,
            order_id: order.orderId,
            handler: async (response: any) => {
              await confirmPayment(booking.bookingRef, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
              toast.success('Payment verified!');
              navigate(`/booking-success?ref=${booking.bookingRef}`);
            },
            prefill: {
              name: values.customerName,
              email: values.customerEmail,
              contact: values.customerPhone,
            },
            theme: { color: '#4f46e5' },
          };

          if ((window as any).Razorpay) {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setIsSubmitting(false);
            return;
          } else {
            // If script not loaded, auto-confirm as simulated
            await confirmPayment(booking.bookingRef, {
              paymentId: `pay_direct_${Date.now()}`,
              orderId: order.orderId,
            });
          }
        }
      }

      toast.success('Booking reservation submitted successfully!');
      navigate(`/booking-success?ref=${booking.bookingRef}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Customer Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                {...register('customerName', { required: 'Name is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-rose-500 mt-1">{errors.customerName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="e.g. john@example.com"
                {...register('customerEmail', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
              />
            </div>
            {errors.customerEmail && (
              <p className="text-xs text-rose-500 mt-1">{errors.customerEmail.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone / Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('customerPhone', {
                  required: 'Phone number is required',
                  minLength: { value: 10, message: 'Must be at least 10 digits' },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
              />
            </div>
            {errors.customerPhone && (
              <p className="text-xs text-rose-500 mt-1">{errors.customerPhone.message}</p>
            )}
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Guest Count (Max: {hall.capacity})
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                max={hall.capacity}
                placeholder={`Up to ${hall.capacity}`}
                {...register('guestCount', {
                  max: { value: hall.capacity, message: `Capacity limit is ${hall.capacity}` },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
              />
            </div>
            {errors.guestCount && (
              <p className="text-xs text-rose-500 mt-1">{errors.guestCount.message}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Special Requests / Catering & Stage Requirements
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={3}
              placeholder="e.g. Need additional floral stage arrangements, audio mic stands, or early setup access..."
              {...register('specialRequests')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Payment Preference
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`border rounded-xl p-4 flex items-start space-x-3 cursor-pointer transition-all ${
              selectedPaymentMode === 'PAY_NOW'
                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              value="PAY_NOW"
              {...register('paymentMode')}
              className="mt-1 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-semibold text-slate-900 text-sm flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Instant Online Payment</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Immediate confirmation & guaranteed slot hold via UPI, Card, or NetBanking.
              </p>
            </div>
          </label>

          <label
            className={`border rounded-xl p-4 flex items-start space-x-3 cursor-pointer transition-all ${
              selectedPaymentMode === 'PAY_LATER'
                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              value="PAY_LATER"
              {...register('paymentMode')}
              className="mt-1 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-semibold text-slate-900 text-sm flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Reserve Now (Pay at Venue)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Holds slot with Pending status subject to venue manager approval within 24h.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Price Summary Breakdown */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400">
          Booking Cost Summary
        </h4>
        <div className="space-y-2 text-sm border-b border-slate-800 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-300">Base Venue Rent ({slot.label} Slot)</span>
            <span className="font-semibold">₹{slot.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Cleaning & Maintenance Deposit</span>
            <span className="text-emerald-400 font-semibold">Included</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Taxes & Service Fees</span>
            <span className="text-slate-300">₹0 (Waived)</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-base font-bold text-slate-200">Total Payable Amount</span>
          <span className="text-2xl font-extrabold text-amber-400">
            ₹{slot.price.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] hover:brightness-105 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md shadow-amber-950/20 flex items-center justify-center space-x-2 text-base cursor-pointer"
        >
          {isSubmitting ? (
            <span>Processing Reservation...</span>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>
                {selectedPaymentMode === 'PAY_NOW' ? 'Pay & Confirm Booking' : 'Submit Booking Request'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
