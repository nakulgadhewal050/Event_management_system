import { Router } from 'express'
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cart.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/role.middleware.js'
import { validateObjectId } from '../middlewares/validate.middleware.js'

const router = Router()

router.use(protect, authorize('user'))

router.get('/', getCart)
router.post('/items', addCartItem)
router.patch('/items/:productId', validateObjectId('productId'), updateCartItem)
router.delete('/items/:productId', validateObjectId('productId'), removeCartItem)
router.delete('/', clearCart)

export default router
