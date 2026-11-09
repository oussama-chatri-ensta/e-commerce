import 'dotenv/config'
import app from './app.js'
import { connectDb } from './config/db.js'

const port = process.env.PORT || 3000

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from the environment')
    process.exit(1)
  }

  try {
    await connectDb()
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Could not start the API:', err.message)
    process.exit(1)
  }
}

start()
