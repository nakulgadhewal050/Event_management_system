import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import cartRoutes from './routes/cart.routes.js'
import healthRoutes from './routes/health.routes.js'
import membershipRoutes from './routes/membership.routes.js'
import orderRoutes from './routes/order.routes.js'
import productRoutes from './routes/product.routes.js'
import userRoutes from './routes/user.routes.js'
import vendorRoutes from './routes/vendor.routes.js'

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1', healthRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/vendor', vendorRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/memberships', membershipRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
