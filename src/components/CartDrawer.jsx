import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../redux/actions/cartActions'
import { closeCart, closeProduct, showToast } from '../redux/actions/uiActions'
import { FREE_DELIVERY_THRESHOLD } from '../data/products'
import formatDzd from '../utils/formatDzd'
import CartItem from './CartItem'
import { CartIcon, XIcon } from './Icons'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.cartOpen)
  const items = useSelector((state) => state.cart.items)

  const count = items.reduce((total, item) => total + item.qty, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0)
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const delivery = subtotal === 0 || toFreeDelivery === 0 ? 0 : 900
  const total = subtotal + delivery

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeCart())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, dispatch])

  if (!open) return null

  const handleCheckout = () => {
    dispatch(clearCart())
    dispatch(closeProduct())
    dispatch(closeCart())
    dispatch(showToast('Order placed — pay cash on delivery. Thank you!'))
  }

  return (
    <div className="overlay cart-overlay" onClick={() => dispatch(closeCart())}>
      <aside className="cart" aria-label="Shopping cart" onClick={(event) => event.stopPropagation()}>
        <div className="cart-head">
          <h2>Your cart <span>({count} items)</span></h2>
          <button type="button" className="icon-btn" onClick={() => dispatch(closeCart())} aria-label="Close cart">
            <XIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <CartIcon />
            <p>Your cart is empty.</p>
            <a href="#catalog" onClick={() => dispatch(closeCart())}>Browse the souq</a>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>

            <div className="cart-summary">
              {toFreeDelivery > 0 ? (
                <p className="cart-shipping-hint">
                  Add {formatDzd(toFreeDelivery)} more for free delivery (900 DA otherwise).
                </p>
              ) : (
                <p className="cart-shipping-hint ok">You reached free delivery — yalla!</p>
              )}

              <div className="cart-rows">
                <div><span>Subtotal</span><b>{formatDzd(subtotal)}</b></div>
                <div><span>Delivery</span><b>{delivery === 0 ? 'Free' : formatDzd(delivery)}</b></div>
                <div className="cart-total-row"><span>Total</span><b>{formatDzd(total)}</b></div>
              </div>

              <button type="button" className="btn primary block" onClick={handleCheckout}>
                Check out — cash on delivery
              </button>
              <button type="button" className="btn ghost block" onClick={() => dispatch(clearCart())}>
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
