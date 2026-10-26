import { useDispatch, useSelector } from 'react-redux'
import { CATEGORIES } from '../data/products'
import selectVisibleProducts from '../redux/selectors/selectVisibleProducts'
import { setCategory, setSort } from '../redux/actions/uiActions'

const SORTERS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'discount', label: 'Biggest discount' },
]

export default function Toolbar() {
  const dispatch = useDispatch()
  const category = useSelector((state) => state.ui.category)
  const sort = useSelector((state) => state.ui.sort)
  const visibleCount = useSelector((state) => selectVisibleProducts(state).length)

  return (
    <section id="catalog" className="container toolbar">
      <div className="toolbar-top">
        <h2 className="toolbar-title">
          Catalogue <span>— {visibleCount} product{visibleCount === 1 ? '' : 's'}</span>
        </h2>
        <div className="toolbar-controls">
          <select
            className="sort-select"
            value={sort}
            onChange={(event) => dispatch(setSort(event.target.value))}
            aria-label="Sort products"
          >
            {SORTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="chips">
        {['All', ...CATEGORIES].map((chip) => (
          <button
            key={chip}
            type="button"
            className={category === chip ? 'chip active' : 'chip'}
            onClick={() => dispatch(setCategory(chip))}
            aria-pressed={category === chip}
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  )
}
