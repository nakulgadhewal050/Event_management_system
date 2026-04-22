import { Router } from 'express';
import dns from 'dns'

import {
  addGuest,
  deleteGuest,
  extendMembership,
  getGuests,
  getUserDashboard,
  getVendors,
  selectMembership,
} from '../controllers/user.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateObjectId } from '../middlewares/validate.middleware.js';

const router = Router();



// Apply middleware to all routes
router.use(protect, authorize('user'));

// User Routes
router.get('/dashboard', getUserDashboard);
router.get('/vendors', getVendors);

// Membership Routes
router.patch('/membership/select', selectMembership);
router.patch('/membership/extend', extendMembership);

// Guest Routes
router.get('/guests', getGuests);
router.post('/guests', addGuest);
router.delete('/guests/:id', validateObjectId('id'), deleteGuest);

export default router;