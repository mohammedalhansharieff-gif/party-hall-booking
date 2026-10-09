import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

if (ENV.EMAIL_USER && ENV.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASS,
    },
  });
}

export interface BookingEmailData {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  hallName: string;
  date: string;
  timeSlotLabel: string;
  timeSlotTime: string;
  totalAmount: number;
  guestCount?: number | null;
  location?: string | null;
}

export const sendBookingReceivedEmail = async (data: BookingEmailData) => {
  const subject = `Booking Request Received — ${data.bookingRef}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Party & Wedding Hall Booking System</h2>
      <p>Dear <strong>${data.customerName}</strong>,</p>
      <p>Thank you for choosing <strong>${data.hallName}</strong>! We have received your booking request.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Booking Reference:</strong> <span style="color: #4f46e5; font-weight: bold;">${data.bookingRef}</span></p>
        <p><strong>Venue:</strong> ${data.hallName}</p>
        <p><strong>Event Date:</strong> ${data.date}</p>
        <p><strong>Time Slot:</strong> ${data.timeSlotLabel} (${data.timeSlotTime})</p>
        <p><strong>Guests:</strong> ${data.guestCount || 'Not specified'}</p>
        <p><strong>Total Amount:</strong> ₹${data.totalAmount.toLocaleString('en-IN')}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">
        <em>Note: Our team will review your booking and confirm within 24 hours. You can check your booking status online using your reference number.</em>
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">Need help? Reply to this email or contact support.</p>
    </div>
  `;

  await sendMail(data.customerEmail, subject, html);
};

export const sendBookingConfirmedEmail = async (data: BookingEmailData) => {
  const subject = `✅ Your Booking is Confirmed — ${data.bookingRef}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #16a34a;">🎉 Booking Confirmed!</h2>
      <p>Dear <strong>${data.customerName}</strong>,</p>
      <p>Great news! Your booking for <strong>${data.hallName}</strong> has been officially confirmed.</p>
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Booking Ref:</strong> ${data.bookingRef}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time Slot:</strong> ${data.timeSlotLabel} (${data.timeSlotTime})</p>
        <p><strong>Venue Address:</strong> ${data.location || 'Central City Hall Complex'}</p>
        <p><strong>Amount:</strong> ₹${data.totalAmount.toLocaleString('en-IN')}</p>
      </div>
      <h4>Arrival Instructions:</h4>
      <ul>
        <li>Please arrive at least 30 minutes before your slot begins.</li>
        <li>Present this confirmation email or booking reference at the venue entrance.</li>
        <li>For decorations and catering setup, please coordinate with venue staff.</li>
      </ul>
      <p style="font-size: 12px; color: #94a3b8;">We look forward to hosting your wonderful event!</p>
    </div>
  `;

  await sendMail(data.customerEmail, subject, html);
};

export const sendAdminNewBookingAlert = async (data: BookingEmailData) => {
  const adminEmail = ENV.EMAIL_USER || 'admin@hallbooking.com';
  const subject = `🔔 New Booking Request — ${data.hallName} on ${data.date}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0;">
      <h3 style="color: #d97706;">New Booking Alert</h3>
      <p>A new booking request has been submitted:</p>
      <ul>
        <li><strong>Ref:</strong> ${data.bookingRef}</li>
        <li><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</li>
        <li><strong>Hall:</strong> ${data.hallName}</li>
        <li><strong>Date:</strong> ${data.date} (${data.timeSlotLabel})</li>
        <li><strong>Amount:</strong> ₹${data.totalAmount}</li>
      </ul>
      <p><a href="${ENV.CLIENT_URL}/admin/bookings" style="display:inline-block; padding:8px 16px; background:#4f46e5; color:#fff; text-decoration:none; border-radius:4px;">View in Admin Panel</a></p>
    </div>
  `;

  await sendMail(adminEmail, subject, html);
};

export const sendBookingCancelledEmail = async (data: BookingEmailData & { reason?: string }) => {
  const subject = `Booking Cancelled — ${data.bookingRef}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0;">
      <h3 style="color: #dc2626;">Booking Cancellation Notice</h3>
      <p>Dear <strong>${data.customerName}</strong>,</p>
      <p>Your booking <strong>${data.bookingRef}</strong> for <strong>${data.hallName}</strong> on <strong>${data.date}</strong> has been cancelled.</p>
      ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
      <p>If any refund is applicable as per our policy, it will be processed to the original payment method within 5-7 business days.</p>
      <p style="font-size: 12px; color: #94a3b8;">If you believe this was an error, please reach out to our team.</p>
    </div>
  `;

  await sendMail(data.customerEmail, subject, html);
};

const sendMail = async (to: string, subject: string, html: string) => {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Hall Booking System" <${ENV.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
    } catch (err) {
      console.error('[Email Error]', err);
    }
  } else {
    console.log(`\n================== [MOCK EMAIL SIMULATOR] ==================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: (HTML formatted notification simulated successfully)`);
    console.log(`===========================================================\n`);
  }
};
