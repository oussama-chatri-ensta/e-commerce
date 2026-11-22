const discountOf = (product) => (product.oldPrice ? 1 - product.price / product.oldPrice : 0)

export default function selectVisibleProducts(state) {
  const { search, category, sort } = state.ui
  const list = state.products?.items || []
  const query = search.trim().toLowerCase()

  const filtered = list.filter((product) => {
    if (category !== 'All' && product.category !== category) return false
    if (!query) return true
    return (
      (product.title || product.name || '').toLowerCase().includes(query) ||
      (product.brand || '').toLowerCase().includes(query) ||
      (product.sub || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query)
    )
  })

  switch (sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price)
    case 'rating':
      return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'discount':
      return [...filtered].sort((a, b) => discountOf(b) - discountOf(a))
    default:
      return filtered
  }
}
