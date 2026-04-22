import { Router } from 'express';

import {
  cancelUserMembership,
  getDashboardStats,
  getUsers,
  getVendorRequests,
  toggleUserStatus,
  updateVendorRequestStatus,
} from '../controllers/admin.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateObjectId } from '../middlewares/validate.middleware.js';

const router = Router();

// Apply middleware to all routes
router.use(protect, authorize('admin'));

// Dashboard Routes
router.get('/dashboard', getDashboardStats);

// User Management Routes
router.get('/users', getUsers);
router.patch('/users/:id/status', validateObjectId('id'), toggleUserStatus);
router.patch(
  '/users/:userId/membership/cancel',
  validateObjectId('userId'),
  cancelUserMembership
);

// Vendor Request Routes
router.get('/requests', getVendorRequests);
router.patch(
  '/requests/:id/status',
  validateObjectId('id'),
  updateVendorRequestStatus
);

export default router;