import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import selectVisibleProducts from '../redux/selectors/selectVisibleProducts'
import { setCategory, setSearch } from '../redux/actions/uiActions'
import {
  fetchProductsFailure,
  fetchProductsStart,
  fetchProductsSuccess,
} from '../redux/actions/productsActions'
import { fetchProducts } from '../api'
import { SearchIcon, RefreshIcon } from './Icons'

export default function ProductGrid() {
  const dispatch = useDispatch()
  const visible = useSelector(selectVisibleProducts)
  const loading = useSelector((state) => state.products.loading)
  const error = useSelector((state) => state.products.error)
  const allProducts = useSelector((state) => state.products.items)

  const load = async () => {
    dispatch(fetchProductsStart())
    try {
      const data = await fetchProducts()
      dispatch(fetchProductsSuccess(data))
    } catch (err) {
      dispatch(fetchProductsFailure(err.message || 'Could not connect to API'))
    }
  }

  useEffect(() => {
    // Only load if items haven't been fetched yet
    if (allProducts.length === 0 && !error) {
      load()
    }
  }, [])

  if (loading && allProducts.length === 0) {
    return (
      <div className="container status-box">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading products from database…</p>
      </div>
    )
  }

  if (error && allProducts.length === 0) {
    return (
      <div className="container status-box error-box">
        <p>Failed to load products: {error}</p>
        <button type="button" className="btn ghost" onClick={load}>
          <RefreshIcon /> Retry
        </button>
      </div>
    )
  }

  if (visible.length === 0) {
    return (
      <div className="container empty-state">
        <SearchIcon />
        <p>No products match your filters right now.</p>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            dispatch(setSearch(''))
            dispatch(setCategory('All'))
          }}
        >
          Clear search &amp; filters
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
