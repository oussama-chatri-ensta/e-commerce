import mongoose from 'mongoose'
import Product from '../models/Product.js'

export async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
}

export async function getProduct(req, res) {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  const product = await Product.findById(id)

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json(product)
}

export async function createProduct(req, res) {
  const { name, description, price, category, imageUrl, stock } =
    req.body || {}

  const product = await Product.create({
    name,
    description,
    price,
    category,
    imageUrl,
    stock,
  })

  res.status(201).json(product)
}

export async function updateProduct(req, res) {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  const { name, description, price, category, imageUrl, stock } =
    req.body || {}

  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price, category, imageUrl, stock },
    { returnDocument: 'after', runValidators: true },
  )

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json(product)
}

export async function deleteProduct(req, res) {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  const product = await Product.findByIdAndDelete(id)

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json({ message: 'Product deleted' })
}
