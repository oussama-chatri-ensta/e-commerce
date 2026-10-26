import { useDispatch, useSelector } from 'react-redux'
import { openProduct, showToast } from '../redux/actions/uiActions'
import {
  addToCart,
  clearCart,
  removeFromCart,
  setQty,
} from '../redux/actions/cartActions'
import formatDzd from '../utils/formatDzd'
import { MinusIcon, PlusIcon, TrashIcon } from './Icons'

export default function CartItem({ item }) {
  const dispatch = useDispatch()

  const handleDecrease = () => {
    if (item.qty === 1) {
      dispatch(removeFromCart(item.id))
      dispatch(showToast(`${item.title} removed from cart`, 'info'))
    } else {
      dispatch(setQty(item.id, item.qty - 1))
    }
  }

  const handleIncrease = () => {
    if (item.qty === item.stock) {
      dispatch(showToast(`Only ${item.stock} × ${item.title} in stock`, 'info'))
    } else {
      dispatch(setQty(item.id, item.qty + 1))
    }
  }

  const handleRemove = () => {
    dispatch(removeFromCart(item.id))
    dispatch(showToast(`${item.title} removed from cart`, 'info'))
  }

  return (
    <li className="cart-item">
      <button
        type="button"
        className="cart-item-media"
        onClick={() => {
          dispatch(closeCart())
          dispatch(openProduct(item))
        }}
        aria-label={`View ${item.title}`}
      >
        <img src={item.thumbnail} alt={item.title} />
      </button>

      <div className="cart-item-info">
        <p className="cart-item-title">{item.title}</p>
        <p className="cart-item-price">{formatDzd(item.price)}</p>
        <div className="qty-picker small" aria-label={`Quantity of ${item.title}`}>
          <button type="button" onClick={handleDecrease} aria-label="Decrease quantity">
            <MinusIcon />
          </button>
          <span>{item.qty}</span>
          <button type="button" onClick={handleIncrease} aria-label="Increase quantity">
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className="cart-item-side">
        <button
          type="button"
          className="cart-item-remove"
          onClick={handleRemove}
          aria-label={`Remove ${item.title} from cart`}
        >
          <TrashIcon />
        </button>
        <p className="cart-item-total">{formatDzd(item.price * item.qty)}</p>
      </div>
    </li>
  )
}
