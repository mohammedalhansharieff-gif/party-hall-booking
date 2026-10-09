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

    const payload = {
      user_id: publicKey,
      accessToken: privateKey || undefined,
      service_id: serviceId,
      template_id: templateId,
      template_params: templateParams,
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ENV.CLIENT_URL || 'http://localhost:5173',
        'User-Agent': 'GrandVenues/1.0',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (response.status === 200) {
      console.log(`[EmailJS] ✅ OTP email dispatched successfully to ${toEmail} (status 200)`);
      return {
        success: true,
        status: 200,
        text: responseText,
      };
    } else {
      console.error(`[EmailJS Error] Failed sending OTP to ${toEmail} (status ${response.status}):`, responseText);
      return {
        success: false,
        status: response.status,
        error: `EmailJS error (${response.status}): ${responseText}`,
      };
    }
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error(`[EmailJS Error] Network error sending OTP to ${toEmail}:`, errorMsg);
    return {
      success: false,
      error: `EmailJS network error: ${errorMsg}`,
    };
  }
};
