import dns from 'node:dns'
import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
  await mongoose.connect(env.mongoUri)
  // Keep startup logging short and explicit.
  console.log(`MongoDB connected at ${mongoose.connection.host}`)
}
