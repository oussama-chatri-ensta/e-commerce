import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/actions/cartActions'
import { toggleFavorite } from '../redux/actions/favoritesActions'
import { closeCart, closeProduct, openCart, showToast } from '../redux/actions/uiActions'
import { FREE_DELIVERY_THRESHOLD } from '../data/products'
import formatDzd from '../utils/formatDzd'
import Rating from './Rating'
import { CartIcon, HeartIcon, MinusIcon, PlusIcon, XIcon } from './Icons'

export default function ProductModal() {
  const dispatch = useDispatch()
  const product = useSelector((state) => state.ui.product)
  const qtyInCart = useSelector(
    (state) => state.cart.items.find((item) => item.id === product?.id)?.qty ?? 0,
  )
  const saved = useSelector((state) => state.favorites.includes(product?.id))
  const [qty, setQty] = useState(1)
  const [image, setImage] = useState(0)

  useEffect(() => {
    setQty(1)
    setImage(0)
  }, [product?.id])

  useEffect(() => {
    if (!product) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeProduct())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [product, dispatch])

  if (!product) return null

  const soldOut = product.stock === 0
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const handleAdd = () => {
    dispatch(addToCart(product, qty))
    dispatch(openCart())
    dispatch(closeProduct())
    dispatch(showToast(qty > 1 ? `${qty} × ${product.title} added to cart` : `${product.title} added to cart`))
  }

  return (
    <div className="overlay modal-overlay" onClick={() => dispatch(closeProduct())}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="overlay-close"
          onClick={() => dispatch(closeProduct())}
          aria-label="Close product details"
        >
          <XIcon />
        </button>

        <div className="modal-media">
          <img src={product.images[image] ?? product.thumbnail} alt={product.title} />
          {product.images.length > 1 && (
            <div className="modal-thumbs">
              {product.images.map((thumb, index) => (
                <button
                  key={thumb}
                  type="button"
                  className={index === image ? 'modal-thumb active' : 'modal-thumb'}
                  onClick={() => setImage(index)}
                  aria-label={`Show photo ${index + 1}`}
                >
                  <img src={thumb} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-info">
          <p className="modal-cat">{product.sub} · {product.category}</p>
          <h2>{product.title}</h2>
          <Rating rating={product.rating} reviews={product.reviews} />

          <div className="modal-price">
            <span className="now">{formatDzd(product.price)}</span>
            {product.oldPrice && (
              <>
                <s className="was">{formatDzd(product.oldPrice)}</s>
                <span className="modal-save">-{discount}%</span>
              </>
            )}
          </div>

          <p className="modal-desc">{product.description}</p>

          <p className={soldOut ? 'modal-stock out' : 'modal-stock'}>
            {soldOut
              ? 'Currently sold out — come back soon.'
              : product.stock < 5
                ? `Hurry, only ${product.stock} left in stock.`
                : `In stock — ${product.stock} available.`}
          </p>

          <div className="modal-actions">
            <div className="qty-picker" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                disabled={qty === 1}
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((current) => Math.min(product.stock || 1, current + 1))}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
            <button type="button" className="btn primary" onClick={handleAdd} disabled={soldOut}>
              <CartIcon /> Add to cart
            </button>
            <button
              type="button"
              className={saved ? 'icon-btn saved' : 'icon-btn'}
              onClick={() => dispatch(toggleFavorite(product.id))}
              aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
            >
              <HeartIcon filled={saved} />
            </button>
          </div>

          {qtyInCart > 0 && <p className="modal-incart">{qtyInCart} × already in your cart.</p>}

          <p className="modal-note">
            Free delivery from {formatDzd(FREE_DELIVERY_THRESHOLD)} · paid on receipt · 7-day returns.
          </p>
        </div>
      </div>
    </div>
  )
}
