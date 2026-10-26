import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import selectVisibleProducts from '../redux/selectors/selectVisibleProducts'
import { setCategory, setSearch } from '../redux/actions/uiActions'
import { SearchIcon } from './Icons'

export default function ProductGrid() {
  const dispatch = useDispatch()
  const visible = useSelector(selectVisibleProducts)

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
