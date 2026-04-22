import { Router } from 'express'
import { getMe, login, registerUser, registerVendor } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register/user', registerUser)
router.post('/register/vendor', registerVendor)
router.post('/login', login)
router.get('/me', protect, getMe)

export default router
