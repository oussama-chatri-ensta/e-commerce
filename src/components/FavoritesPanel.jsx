import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, clearCart } from '../redux/actions/cartActions'
import { clearFavorites } from '../redux/actions/favoritesActions'
import { closeFavorites, openProduct, showToast } from '../redux/actions/uiActions'
import products from '../data/products'
import formatDzd from '../utils/formatDzd'
import Rating from './Rating'
import { CartIcon, HeartIcon, TrashIcon, XIcon } from './Icons'

export default function FavoritesPanel() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.favoritesOpen)
  const favorites = useSelector((state) => state.favorites)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeFavorites())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, dispatch])

  if (!open) return null

  const saved = products.filter((product) => favorites.includes(product.id))

  const handleRemove = (product) => {
    dispatch(toggleFavorite(product.id))
    dispatch(showToast(`${product.title} removed from favourites`, 'info'))
  }

  const moveAllToCart = () => {
    saved.forEach((product) => dispatch(addToCart(product)))
    dispatch(showToast(`${saved.length} favourite${saved.length === 1 ? '' : 's'} moved to your cart`))
    dispatch(clearFavorites())
    dispatch(closeFavorites())
  }

  return (
    <div className="overlay favorites-overlay" onClick={() => dispatch(closeFavorites())}>
      <aside className="favorites" aria-label="Saved favourites" onClick={(event) => event.stopPropagation()}>
        <div className="favorites-head">
          <h2>Favourites <span>({favorites.length})</span></h2>
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(closeFavorites())}
            aria-label="Close favourites"
          >
            <XIcon />
          </button>
        </div>

        {saved.length === 0 ? (
          <div className="favorites-empty">
            <HeartIcon />
            <p>Nothing saved yet — tap the heart on any product.</p>
            <a href="#catalog" onClick={() => dispatch(closeFavorites())}>Browse the souq</a>
          </div>
        ) : (
          <>
            <ul className="favorites-list">
              {saved.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="favorites-item"
                    onClick={() => {
                      dispatch(closeFavorites())
                      dispatch(openProduct(product))
                    }}
                  >
                    <img src={product.thumbnail} alt={product.title} />
                    <span>
                      <b>{product.title}</b>
                      <Rating rating={product.rating} />
                      <small>{formatDzd(product.price)}</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleRemove(product)}
                    aria-label={`Remove ${product.title} from favourites`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>

            <div className="favorites-foot">
              <button type="button" className="btn primary block" onClick={moveAllToCart}>
                <CartIcon /> Move all to cart
              </button>
              <button type="button" className="btn ghost block" onClick={() => dispatch(clearFavorites())}>
                Clear favourites
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
