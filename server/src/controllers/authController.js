import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function register(req, res) {
  const { name, email, password } = req.body || {}

  if (
    !name ||
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res
      .status(400)
      .json({ message: 'Name, email and password are required' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Invalid email address' })
  }

  const existing = await User.findOne({ email: normalizedEmail })

  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
  })

  res.status(201).json({ id: user._id, name: user.name, email: user.email })
}

export async function login(req, res) {
  const { email, password } = req.body || {}

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select('+passwordHash')

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}
