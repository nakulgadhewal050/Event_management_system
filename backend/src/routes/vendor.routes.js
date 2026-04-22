import { Router } from 'express';

import {
  createRequestItem,
  extendMembership,
  getVendorDashboard,
  getVendorRequests,
  selectMembership,
  updateVendorProfile,
} from '../controllers/vendor.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// Apply middleware to all routes
router.use(protect, authorize('vendor'));

// Vendor Routes
router.get('/dashboard', getVendorDashboard);
router.patch('/profile', updateVendorProfile);
router.patch('/membership/select', selectMembership);
router.patch('/membership/extend', extendMembership);
router.get('/requests', getVendorRequests);
router.post('/requests', createRequestItem);

export default router;