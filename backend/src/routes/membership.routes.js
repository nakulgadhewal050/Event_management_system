import { Router } from 'express'
import {
  createMembership,
  getMembershipByNumber,
  listMemberships,
  toggleMembershipStatus,
  updateMembershipByNumber,
} from '../controllers/membership.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/role.middleware.js'
import { validateObjectId } from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/', protect, listMemberships)
router.post('/', protect, authorize('admin'), createMembership)
router.get('/number/:membershipNumber', protect, authorize('admin'), getMembershipByNumber)
router.patch('/number/:membershipNumber', protect, authorize('admin'), updateMembershipByNumber)
router.patch('/:id', protect, authorize('admin'), validateObjectId('id'), toggleMembershipStatus)

export default router
