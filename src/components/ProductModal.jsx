import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/actions/cartActions'
import { toggleFavorite } from '../redux/actions/favoritesActions'
import { deleteProductSuccess } from '../redux/actions/productsActions'
import {
  closeCart,
  closeProduct,
  openCart,
  openProductForm,
  showToast,
} from '../redux/actions/uiActions'
import { deleteProduct } from '../api'
import { FREE_DELIVERY_THRESHOLD } from '../data/products'
import formatDzd from '../utils/formatDzd'
import Rating from './Rating'
import { CartIcon, EditIcon, HeartIcon, MinusIcon, PlusIcon, TrashIcon, XIcon } from './Icons'

export default function ProductModal() {
  const dispatch = useDispatch()
  const product = useSelector((state) => state.ui.product)
  const token = useSelector((state) => state.auth.token)
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

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.thumbnail || product.imageUrl]

  const handleAdd = () => {
    dispatch(addToCart(product, qty))
    dispatch(openCart())
    dispatch(closeProduct())
    dispatch(
      showToast(
        qty > 1
          ? `${qty} × ${product.title} added to cart`
          : `${product.title} added to cart`,
      ),
    )
  }

  const handleEdit = () => {
    dispatch(closeProduct())
    dispatch(openProductForm(product))
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.title}"?`)
    if (!confirmed) return

    try {
      const id = product._id || product.id
      await deleteProduct(id, token)
      dispatch(deleteProductSuccess(id))
      dispatch(closeProduct())
      dispatch(showToast(`"${product.title}" deleted`, 'info'))
    } catch (err) {
      dispatch(showToast(err.message || 'Could not delete product', 'info'))
    }
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
          <img src={images[image] ?? product.thumbnail} alt={product.title} />
          {images.length > 1 && (
            <div className="modal-thumbs">
              {images.map((thumb, index) => (
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
          <p className="modal-cat">
            {product.sub || product.category} · {product.category}
          </p>
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
            <button
              type="button"
              className="btn primary"
              onClick={handleAdd}
              disabled={soldOut}
            >
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

          {token && (
            <div className="modal-admin-row">
              <button type="button" className="btn ghost small" onClick={handleEdit}>
                <EditIcon /> Edit product
              </button>
              <button type="button" className="btn ghost small danger" onClick={handleDelete}>
                <TrashIcon /> Delete product
              </button>
            </div>
          )}

          {qtyInCart > 0 && <p className="modal-incart">{qtyInCart} × already in your cart.</p>}

          <p className="modal-note">
            Free delivery from {formatDzd(FREE_DELIVERY_THRESHOLD)} · paid on receipt · 7-day returns.
          </p>
        </div>
      </div>
    </div>
  )
}
