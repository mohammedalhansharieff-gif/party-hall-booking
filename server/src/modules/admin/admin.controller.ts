import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import * as hallService from '../halls/hall.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const handleInitiateLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { email: userEmail, name } = await adminService.validateCredentialsAndSendOtp(email, password);

    return res.json({
      success: true,
      requiresOtp: true,
      message: `A 6-digit verification code has been sent to ${userEmail}`,
      email: userEmail,
      name,
    });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message });
    }
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.message || 'Failed to dispatch verification code to Gmail',
    });
  }
};

export const handleInitiateRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await adminService.initiateSignupAndSendOtp(name, email, password);

    return res.json({
      success: true,
      requiresOtp: true,
      isSignUp: true,
      message: `A 6-digit verification code has been sent to ${result.email}`,
      email: result.email,
      name: result.name,
    });
  } catch (error: any) {
    if (error.message && error.message.includes('already exists')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.message || 'Failed to dispatch registration verification code to Gmail',
    });
  }
};

export const handleVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const { admin, token } = await adminService.verifyOtpAndGenerateToken(email, otp);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      message: 'Verification successful',
      data: { admin, token },
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const handleResendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const { email: userEmail } = await adminService.resendOtpForUser(email);

    return res.json({
      success: true,
      message: `A new 6-digit verification code has been sent to ${userEmail}`,
      email: userEmail,
    });
  } catch (error: any) {
    if (error.message && (error.message.includes('No active') || error.message.includes('No account'))) {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.message || 'Failed to resend verification code to Gmail',
    });
  }
};

export const handleAdminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { admin, token } = await adminService.adminLogin(email, password);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      data: { admin, token },
    });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const { admin, token } = await adminService.registerUser(name, email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { admin, token },
    });
  } catch (error: any) {
    if (error.message === 'An account with this email already exists') {
      return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const handleAdminLogout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully' });
};

export const handleGetMe = async (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    data: req.admin,
  });
};

export const handleGetAdminBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, hallId, date, search } = req.query;
    const bookings = await adminService.getAdminBookings({
      status: status ? String(status) : undefined,
      hallId: hallId ? parseInt(String(hallId), 10) : undefined,
      date: date ? String(date) : undefined,
      search: search ? String(search) : undefined,
    });
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const handleGetAdminBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const booking = await adminService.getAdminBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const handleConfirmBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await adminService.confirmBooking(id);
    return res.json({ success: true, message: 'Booking confirmed successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const handleCancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;
    const updated = await adminService.cancelBooking(id, reason);
    return res.json({ success: true, message: 'Booking cancelled successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const handleExportBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csvData = await adminService.exportBookingsToCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings-export-${Date.now()}.csv"`);
    return res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

export const handleGetDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const handleGetAdminHalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const halls = await hallService.getHalls({ includeInactive: true });
    return res.json({ success: true, data: halls });
  } catch (error) {
    next(error);
  }
};

export const handleCreateHall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hall = await hallService.createHall(req.body);
    return res.status(201).json({ success: true, message: 'Hall created successfully', data: hall });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateHall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hall = await hallService.updateHall(id, req.body);
    return res.json({ success: true, message: 'Hall updated successfully', data: hall });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteHall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hall = await hallService.deleteHall(id);
    return res.json({ success: true, message: 'Hall deactivated successfully', data: hall });
  } catch (error) {
    next(error);
  }
};

export const handleUploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
    },
  });
};
