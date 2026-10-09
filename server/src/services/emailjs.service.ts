import emailjs from '@emailjs/nodejs';
import { ENV } from '../config/env';

export const sendEmailJsOtp = async (toEmail: string, otp: string, name?: string): Promise<boolean> => {
  const serviceId = ENV.EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || '';
  const templateId = ENV.EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || '';
  const publicKey = ENV.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || '';
  const privateKey = ENV.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_PRIVATE_KEY || '';

  if (!serviceId || !templateId || !publicKey) {
    console.log('[EmailJS Info] EmailJS credentials not set yet (EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY).');
    return false;
  }

  try {
    const templateParams = {
      to_email: toEmail,
      email: toEmail,
      recipient_email: toEmail,
      user_email: toEmail,
      to_name: name || 'Valued Guest',
      name: name || 'Valued Guest',
      otp: otp,
      passcode: otp,
      verification_code: otp,
      code: otp,
      expiry: '5 minutes',
      message: `Your GrandVenues verification code is ${otp}. This code is valid for 5 minutes.`,
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

    console.log(`[EmailJS] ✅ OTP dispatched via EmailJS to ${toEmail} (status ${response.status})`);
    return true;
  } catch (error: any) {
    console.error('[EmailJS Send Error]', error?.text || error?.message || error);
    return false;
  }
};
