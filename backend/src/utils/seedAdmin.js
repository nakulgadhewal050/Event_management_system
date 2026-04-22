import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { env } from '../config/env.js'
import User from '../models/User.js'

async function seedAdmin() {
  await connectDB()

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() })

  if (existingAdmin) {
    console.log('Admin already exists. Seed skipped.')
    await mongoose.connection.close()
    return
  }

  await User.create({
    name: env.adminName,
    email: env.adminEmail,
    password: env.adminPassword,
    role: 'admin',
    isActive: true,
  })

  console.log('Admin created successfully.')
  await mongoose.connection.close()
}

seedAdmin().catch(async (error) => {
  console.error('Seed failed:', error)
  await mongoose.connection.close()
  process.exit(1)
})
