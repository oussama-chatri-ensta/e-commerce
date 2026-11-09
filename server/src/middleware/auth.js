import jwt from 'jsonwebtoken'
import { createRemoteJWKSet, jwtVerify } from 'jose'

let jwks

function oauthEnabled() {
  return Boolean(
    process.env.OAUTH_ISSUER &&
      process.env.OAUTH_AUDIENCE &&
      process.env.OAUTH_JWKS_URI,
  )
}

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(process.env.OAUTH_JWKS_URI))
  }

  return jwks
}

function bearerToken(req) {
  const header = req.headers.authorization || ''

  if (!header.startsWith('Bearer ')) {
    return null
  }

  return header.slice(7).trim() || null
}

async function authenticate(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })

    return { id: payload.sub }
  } catch {
    if (!oauthEnabled()) {
      return null
    }
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: process.env.OAUTH_ISSUER,
      audience: process.env.OAUTH_AUDIENCE,
    })

    return { id: payload.sub, issuer: payload.iss }
  } catch {
    return null
  }
}

export async function requireAuth(req, res, next) {
  const token = bearerToken(req)

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const user = await authenticate(token)

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  req.user = user
  next()
}
