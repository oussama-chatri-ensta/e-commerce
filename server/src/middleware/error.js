export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' })
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' })
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((item) => item.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid input' })
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
