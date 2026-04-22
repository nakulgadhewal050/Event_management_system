import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://nakulgadhewal050_db_user:nakul123@cluster0.k7ksz7h.mongodb.net/event_management_system',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminName: process.env.ADMIN_NAME || 'System Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@ems.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
}
