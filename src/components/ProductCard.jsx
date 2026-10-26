import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/actions/cartActions'
import { toggleFavorite } from '../redux/actions/favoritesActions'
import { openProduct, showToast } from '../redux/actions/uiActions'
import formatDzd from '../utils/formatDzd'
import Rating from './Rating'
import { CartIcon, HeartIcon } from './Icons'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const saved = useSelector((state) => state.favorites.includes(product.id))
  const cardRef = useRef(null)

  const handleTilt = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
  }

  const resetTilt = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const soldOut = product.stock === 0
  const runningLow = !soldOut && product.stock < 5
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const handleAdd = () => {
    dispatch(addToCart(product))
    dispatch(showToast(`${product.title} added to your cart`))
  }

  const handleSave = () => {
    dispatch(toggleFavorite(product.id))
    dispatch(
      showToast(
        saved ? `${product.title} removed from favourites` : `${product.title} saved to favourites`,
        saved ? 'info' : 'success',
      ),
    )
  }

  return (
    <article
      className="card"
      ref={cardRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
    >
      <div className="card-media">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          onClick={() => dispatch(openProduct(product))}
        />
        <div className="card-flags">
          {discount > 0 && <span className="flag sale">-{discount}%</span>}
          {runningLow && <span className="flag low">Low stock</span>}
          {soldOut && <span className="flag out">Sold out</span>}
        </div>
        <button
          type="button"
          className={saved ? 'card-save saved' : 'card-save'}
          aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
          aria-pressed={saved}
          onClick={handleSave}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>

      <div className="card-body">
        <p className="card-sub">{product.sub}</p>
        <h3>
          <button type="button" onClick={() => dispatch(openProduct(product))}>
            {product.title}
          </button>
        </h3>
        <Rating rating={product.rating} reviews={product.reviews} />

        <div className="card-buy">
          <div className="card-price">
            <span className="now">{formatDzd(product.price)}</span>
            {product.oldPrice && <s className="was">{formatDzd(product.oldPrice)}</s>}
          </div>
          <button
            type="button"
            className="card-add"
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={soldOut ? `${product.title} is sold out` : `Add ${product.title} to cart`}
          >
            <CartIcon />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  )
}
