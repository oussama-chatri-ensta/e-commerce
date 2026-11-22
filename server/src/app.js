import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { errorHandler, notFound } from './middleware/error.js'

const app = express()

const clientOrigin = process.env.CLIENT_ORIGIN
app.use(
  cors({
    origin: clientOrigin
      ? [clientOrigin, /\.vercel\.app$/, 'http://localhost:5173']
      : true,
  }),
)

app.use(express.json())
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
