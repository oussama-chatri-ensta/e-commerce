import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDb } from './config/db.js'
import Product from './models/Product.js'

const products = [
  {
    name: "Dior J'adore",
    description:
      'A floral fragrance with ylang-ylang, rose and jasmine. Feminine and long lasting.',
    price: 32500,
    category: 'Beauty',
    imageUrl:
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
    stock: 98,
  },
  {
    name: 'Apple Watch Series 4 Gold',
    description:
      'Smartwatch with heart rate monitoring, fitness tracking and a retina display.',
    price: 34900,
    category: 'Electronics',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp',
    stock: 33,
  },
  {
    name: 'Men Check Shirt',
    description:
      'Classic check shirt with a regular fit, suitable for everyday wear.',
    price: 5900,
    category: 'Fashion',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp',
    stock: 95,
  },
  {
    name: 'Annibale Colombo Sofa',
    description:
      'Comfortable three-seat sofa with premium upholstery and a solid frame.',
    price: 689000,
    category: 'Home & Living',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp',
    stock: 60,
  },
  {
    name: 'Baseball Ball',
    description:
      'Standard leather baseball designed for training and matches.',
    price: 1900,
    category: 'Sports & Outdoors',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp',
    stock: 100,
  },
  {
    name: 'Spice Rack',
    description:
      'Compact spice rack that keeps your kitchen essentials organised.',
    price: 4900,
    category: 'Home & Living',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/kitchen-accessories/spice-rack/thumbnail.webp',
    stock: 79,
  },
  {
    name: 'Pan',
    description:
      'Non-stick frying pan for quick everyday cooking and easy cleaning.',
    price: 4500,
    category: 'Home & Living',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/kitchen-accessories/pan/thumbnail.webp',
    stock: 90,
  },
  {
    name: 'Gucci Bloom Eau de',
    description:
      'Floral fragrance with tuberose, jasmine and Rangoon creeper notes.',
    price: 22500,
    category: 'Beauty',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp',
    stock: 91,
  },
  {
    name: 'iPhone 13 Pro',
    description:
      'Apple smartphone with a 6.1 inch display, triple camera and 128 GB storage.',
    price: 105000,
    category: 'Electronics',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp',
    stock: 56,
  },
  {
    name: 'Green Crystal Earring',
    description:
      'Elegant earring with a green crystal, a simple accessory for special occasions.',
    price: 3500,
    category: 'Fashion',
    imageUrl:
      'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp',
    stock: 54,
  },
]

async function seed() {
  await connectDb()
  await Product.deleteMany()
  await Product.insertMany(products)
  console.log(`Seeded ${products.length} products`)
  await mongoose.disconnect()
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err.message)
  await mongoose.disconnect()
  process.exit(1)
})
