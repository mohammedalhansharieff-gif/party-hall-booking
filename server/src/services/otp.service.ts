import crypto from 'crypto';
import { sendLoginOtpEmail } from './email.service';
import { sendEmailJsOtp } from './emailjs.service';

export interface PendingUser {
  name: string;
  email: string;
  passwordHash: string;
}

export interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
  userData: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  type: 'LOGIN' | 'SIGNUP';
  pendingUser?: PendingUser;
}

// In-memory OTP storage keyed by normalized email
const otpCache = new Map<string, OtpEntry>();

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of otpCache.entries()) {
    if (entry.expiresAt < now) {
      otpCache.delete(email);
    }
  }
}, 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export const getOtpEntry = (email: string): OtpEntry | undefined => {
  return otpCache.get(email.toLowerCase().trim());
};

export const createAndSendOtp = async (
  email: string,
  user: { id?: number; email: string; name: string; role?: string },
  type: 'LOGIN' | 'SIGNUP' = 'LOGIN',
  pendingPasswordHash?: string
): Promise<string> => {
  const normalizedEmail = email.toLowerCase().trim();

  // Generate a cryptographically secure random 6-digit OTP (100000 - 999999)
  const otpNumber = crypto.randomInt(100000, 1000000);
  const otp = otpNumber.toString();

  // Strictly 5 minutes expiration
  const expiresAt = Date.now() + 5 * 60 * 1000;

  console.log(`[OTP Service] Preparing 6-digit OTP for ${normalizedEmail} (Expires in 5 minutes). Dispatching via EmailJS...`);

  // 1. Try sending via EmailJS
  const emailJsResult = await sendEmailJsOtp(normalizedEmail, otp, user.name);

  let emailDelivered = emailJsResult.success;
  let deliveryError = emailJsResult.error;

  // 2. If EmailJS not successful or not configured, try SMTP fallback
  if (!emailDelivered) {
    const smtpResult = await sendLoginOtpEmail(normalizedEmail, otp, user.name);
    if (smtpResult.success) {
      emailDelivered = true;
      deliveryError = undefined;
    } else if (!deliveryError) {
      deliveryError = smtpResult.error;
    }
  }

  // 3. If email delivery failed completely, DO NOT open OTP screen: throw clear error!
  if (!emailDelivered) {
    console.error(`[OTP Service] ❌ Email dispatch failed for ${normalizedEmail}: ${deliveryError}`);
    throw new Error(
      deliveryError ||
        'Unable to deliver OTP email. Please ensure your EmailJS credentials (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY) are configured in server/.env'
    );
  }

  // Store in cache ONLY upon successful dispatch
  otpCache.set(normalizedEmail, {
    otp,
    expiresAt,
    attempts: 0,
    userData: {
      id: user.id || 0,
      email: normalizedEmail,
      name: user.name,
      role: user.role || 'USER',
    },
    type,
    pendingUser:
      type === 'SIGNUP' && pendingPasswordHash
        ? {
            name: user.name,
            email: normalizedEmail,
            passwordHash: pendingPasswordHash,
          }
        : undefined,
  });

  console.log(`[OTP Service] ✅ OTP securely dispatched to Gmail and cached for ${normalizedEmail} (valid for 5 minutes).`);
  return otp;
};

export const verifyOtpCode = async (
  email: string,
  enteredOtp: string
): Promise<{
  success: boolean;
  user?: { id: number; email: string; name: string; role: string };
  type?: 'LOGIN' | 'SIGNUP';
  pendingUser?: PendingUser;
  error?: string;
}> => {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = enteredOtp.trim();

  // Validate format: must be exactly 6 digits
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

  // Reject expired codes
  if (Date.now() > entry.expiresAt) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: 'Verification code has expired (valid for 5 minutes). Please request a new code.',
    };
  }

  // Reject after excessive attempts
  entry.attempts += 1;
  if (entry.attempts > 5) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. Code invalidated. Please request a new code.',
    };
  }

  // Reject mismatched code
  if (entry.otp !== cleanOtp) {
    const remaining = 5 - entry.attempts;
    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Code matches! Delete immediately from cache so it cannot be reused
  const user = entry.userData;
  const type = entry.type;
  const pendingUser = entry.pendingUser;
  otpCache.delete(normalizedEmail);

  return { success: true, user, type, pendingUser };
};
