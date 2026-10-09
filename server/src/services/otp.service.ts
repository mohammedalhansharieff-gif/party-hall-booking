import crypto from 'crypto';
import { sendLoginOtpEmail } from './email.service';
import { sendEmailJsOtp } from './emailjs.service';

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
  userData: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// In-memory OTP storage keyed by normalized email
const otpCache = new Map<string, OtpEntry>();

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of otpCache.entries()) {
    if (entry.expiresAt < now) {
      otpCache.delete(email);
    }
  }
}, 60 * 1000);

export const createAndSendOtp = async (
  email: string,
  user: { id: number; email: string; name: string; role: string }
): Promise<string> => {
  const normalizedEmail = email.toLowerCase().trim();

  // Generate 6-digit random number (100000 - 999999)
  const otpNumber = crypto.randomInt(100000, 1000000);
  const otp = otpNumber.toString();

  // Exactly 5 minutes expiry
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpCache.set(normalizedEmail, {
    otp,
    expiresAt,
    attempts: 0,
    userData: user,
  });

  console.log(`\n================== [GRANDVENUES LOGIN OTP] ==================`);
  console.log(`User: ${user.name} (${normalizedEmail})`);
  console.log(`6-Digit Verification Code: ${otp}`);
  console.log(`Expires in: 5 minutes`);
  console.log(`============================================================\n`);

  // 1. Try sending via EmailJS
  const emailJsSent = await sendEmailJsOtp(normalizedEmail, otp, user.name);

  // 2. Also dispatch via nodemailer if EmailJS not configured or as fallback
  if (!emailJsSent) {
    await sendLoginOtpEmail(normalizedEmail, otp, user.name);
  }

  return otp;
};

export const verifyOtpCode = (
  email: string,
  enteredOtp: string
): { success: boolean; user?: { id: number; email: string; name: string; role: string }; error?: string } => {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = enteredOtp.trim();

  // Validate format: must be 6 digits
  if (!/^\d{6}$/.test(cleanOtp)) {
    return { success: false, error: 'Verification code must be exactly 6 digits.' };
  }

  const entry = otpCache.get(normalizedEmail);

  if (!entry) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  if (Date.now() > entry.expiresAt) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  if (entry.otp !== cleanOtp) {
    const remaining = 5 - entry.attempts;
    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Valid! Delete OTP so it cannot be used again
  const user = entry.userData;
  otpCache.delete(normalizedEmail);

  return { success: true, user };
};
