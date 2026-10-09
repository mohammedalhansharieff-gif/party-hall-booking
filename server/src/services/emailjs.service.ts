import emailjs from '@emailjs/nodejs';
import { ENV } from '../config/env';

export interface EmailJsResult {
  success: boolean;
  status?: number;
  text?: string;
  error?: string;
}

export const sendEmailJsOtp = async (
  toEmail: string,
  otp: string,
  name?: string
): Promise<EmailJsResult> => {
  const serviceId = ENV.EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || '';
  const templateId = ENV.EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || '';
  const publicKey = ENV.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || '';
  const privateKey = ENV.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_PRIVATE_KEY || '';

  if (!serviceId || !templateId || !publicKey) {
    const missing: string[] = [];
    if (!serviceId) missing.push('EMAILJS_SERVICE_ID');
    if (!templateId) missing.push('EMAILJS_TEMPLATE_ID');
    if (!publicKey) missing.push('EMAILJS_PUBLIC_KEY');
    return {
      success: false,
      error: `EmailJS credentials missing: ${missing.join(', ')} not configured in server/.env`,
    };
  }

  try {
    const templateParams = {
      // Recipient email aliases to ensure exact match with any EmailJS template configuration
      to_email: toEmail,
      email: toEmail,
      recipient_email: toEmail,
      user_email: toEmail,
      to: toEmail,

      // Recipient name aliases
      to_name: name || 'Valued Guest',
      name: name || 'Valued Guest',
      user_name: name || 'Valued Guest',

      // OTP verification code aliases
      otp,
      passcode: otp,
      verification_code: otp,
      code: otp,
      token: otp,
      pin: otp,

      // Expiry duration aliases
      expiry: '5 minutes',
      expires_in: '5 minutes',
      validity: '5 minutes',

      // Brand and contact metadata
      from_name: 'GrandVenues Reservations',
      company_name: 'GrandVenues',
      reply_to: 'support@grandvenues.com',
      message: `Your GrandVenues 6-digit verification code is: ${otp}. This code is valid for 5 minutes.`,
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey,
        privateKey: privateKey || undefined,
      }
    );

    console.log(`[EmailJS] ✅ OTP email dispatched to ${toEmail} (status ${response.status})`);
    return {
      success: true,
      status: response.status,
      text: response.text,
    };
  } catch (error: any) {
    const errorMsg = error?.text || error?.message || String(error);
    console.error(`[EmailJS Error] Failed sending OTP to ${toEmail}:`, errorMsg);
    return {
      success: false,
      error: `EmailJS delivery error: ${errorMsg}`,
    };
  }
};
