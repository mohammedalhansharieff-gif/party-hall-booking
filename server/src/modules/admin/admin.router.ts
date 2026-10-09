import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  handleAdminLogin,
  handleAdminLogout,
  handleGetMe,
  handleGetAdminBookings,
  handleGetAdminBookingById,
  handleConfirmBooking,
  handleCancelBooking,
  handleExportBookings,
  handleGetDashboardStats,
  handleGetAdminHalls,
  handleCreateHall,
  handleUpdateHall,
  handleDeleteHall,
  handleUploadImage,
} from './admin.controller';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { adminLoginSchema, updateBookingStatusSchema } from './admin.schema';
import { createHallSchema, updateHallSchema } from '../halls/hall.schema';

const router = Router();

// Configure Multer storage
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `hall-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public Auth routes
router.post('/auth/login', validateRequest(adminLoginSchema), handleAdminLogin);
router.post('/auth/logout', handleAdminLogout);

// Protected routes
router.use(authenticateAdmin as any);

router.get('/auth/me', handleGetMe as any);

// Dashboard
router.get('/stats', handleGetDashboardStats);

// Bookings
router.get('/bookings', handleGetAdminBookings);
router.get('/bookings/export', handleExportBookings);
router.get('/bookings/:id', handleGetAdminBookingById);
router.patch('/bookings/:id/confirm', handleConfirmBooking);
router.patch('/bookings/:id/cancel', validateRequest(updateBookingStatusSchema), handleCancelBooking);

// Halls
router.get('/halls', handleGetAdminHalls);
router.post('/halls', validateRequest(createHallSchema), handleCreateHall);
router.put('/halls/:id', validateRequest(updateHallSchema), handleUpdateHall);
router.delete('/halls/:id', handleDeleteHall);

// Image Upload
router.post('/upload', upload.single('image'), handleUploadImage);

export default router;
