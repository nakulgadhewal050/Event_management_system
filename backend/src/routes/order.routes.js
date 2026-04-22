import { Router } from 'express'
import { checkout, getMyOrders, updateOrderStatus } from '../controllers/order.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/role.middleware.js'
import { validateObjectId } from '../middlewares/validate.middleware.js'

const router = Router()

router.use(protect)

router.post('/checkout', authorize('user'), checkout)
router.get('/my', getMyOrders)
router.patch('/:id/status', authorize('vendor', 'admin'), validateObjectId('id'), updateOrderStatus)

export default router
