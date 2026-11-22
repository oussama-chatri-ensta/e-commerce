let rawBase = import.meta.env.VITE_API_URL || '/api'
if (rawBase.endsWith('/')) rawBase = rawBase.slice(0, -1)
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`

function normalizeProduct(p) {
  if (!p) return null
  return {
    ...p,
    id: p._id || p.id,
    title: p.name || p.title,
    thumbnail: p.imageUrl || p.thumbnail,
    images: p.imageUrl ? [p.imageUrl] : (p.images || []),
    sub: p.category || p.sub || '',
    rating: p.rating || 4.2,
    reviews: p.reviews || 14,
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const errorMsg = data.message || `Request failed (${res.status})`
    throw new Error(errorMsg)
  }

  return data
}

export async function fetchProducts() {
  const list = await request('/products')
  return Array.isArray(list) ? list.map(normalizeProduct) : []
}

export async function createProduct(productData, token) {
  const data = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(productData),
  })
  return normalizeProduct(data)
}

export async function updateProduct(id, productData, token) {
  const data = await request(`/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(productData),
  })
  return normalizeProduct(data)
}

export async function deleteProduct(id, token) {
  return await request(`/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function loginUser(email, password) {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(name, email, password) {
  return await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
