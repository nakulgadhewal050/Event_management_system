import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

async function startServer() {
  await connectDB()

  app.listen(env.port, () => {
    console.log(`Backend server running on port ${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start backend:', error)
  process.exit(1)
})
