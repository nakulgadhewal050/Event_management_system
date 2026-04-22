import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getPublicProducts,
  updateProduct,
} from '../controllers/product.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/role.middleware.js'
import { validateObjectId } from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/', getPublicProducts)
router.get('/vendor/me', protect, authorize('vendor'), getMyProducts)
router.post('/', protect, authorize('vendor'), createProduct)
router.patch('/:id', protect, authorize('vendor'), validateObjectId('id'), updateProduct)
router.delete('/:id', protect, authorize('vendor'), validateObjectId('id'), deleteProduct)

export default router
