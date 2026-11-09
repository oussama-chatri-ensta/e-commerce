import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { errorHandler, notFound } from './middleware/error.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
