import app from '../server/src/app.js'
import { connectDb } from '../server/src/config/db.js'

export default async function handler(req, res) {
  try {
    await connectDb()
  } catch (err) {
    console.error('Database connection error:', err.message)
    return res.status(500).json({ message: 'Database connection failed: ' + err.message })
  }

  return app(req, res)
}
