import rateLimit from 'express-rate-limit'

const windowMs = 15 * 60 * 1000

export const apiLimiter = rateLimit({
  windowMs,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
})

export const loginLimiter = rateLimit({
  windowMs,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' },
})
