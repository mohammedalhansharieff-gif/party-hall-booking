import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import hallRouter from './modules/halls/hall.router';
import availabilityRouter from './modules/availability/availability.router';
import bookingRouter from './modules/bookings/booking.router';
import adminRouter from './modules/admin/admin.router';
import {
  handleAdminLogin,
  handleAdminLogout,
  handleRegister,
  handleInitiateRegister,
  handleInitiateLogin,
  handleVerifyOtp,
  handleResendOtp,
} from './modules/admin/admin.controller';
import { validateRequest } from './middleware/validate.middleware';
import {
  adminLoginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from './modules/admin/admin.schema';

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost frontend or tools
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      if (origin === ENV.CLIENT_URL) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Uploads Directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth aliases according to plan specification (/api/auth/login)
app.post('/api/auth/send-otp', validateRequest(adminLoginSchema), handleInitiateLogin);
app.post('/api/auth/register-otp', validateRequest(registerSchema), handleInitiateRegister);
app.post('/api/auth/verify-otp', validateRequest(verifyOtpSchema), handleVerifyOtp);
app.post('/api/auth/resend-otp', validateRequest(resendOtpSchema), handleResendOtp);
app.post('/api/auth/login', validateRequest(adminLoginSchema), handleAdminLogin);
app.post('/api/auth/register', validateRequest(registerSchema), handleRegister);
app.post('/api/auth/logout', handleAdminLogout);

// Core Modules
app.use('/api/halls', hallRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
