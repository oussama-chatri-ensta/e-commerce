import products from '../../data/products'

const discountOf = (product) => (product.oldPrice ? 1 - product.price / product.oldPrice : 0)

// Reads the ui slice, keeps every other module (Header, Toolbar, grid, empty
// state) in sync without passing props through App.
export default function selectVisibleProducts(state) {
  const { search, category, sort } = state.ui
  const query = search.trim().toLowerCase()

  const list = products.filter((product) => {
    if (category !== 'All' && product.category !== category) return false
    if (!query) return true
    return (
      product.title.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.sub.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })

  switch (sort) {
    case 'price-asc':
      return [...list].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...list].sort((a, b) => b.price - a.price)
    case 'rating':
      return [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case 'discount':
      return [...list].sort((a, b) => discountOf(b) - discountOf(a))
    default:
      return list
  }
}
