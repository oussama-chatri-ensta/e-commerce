import { ADD_TO_CART, REMOVE_FROM_CART, SET_QTY, CLEAR_CART } from '../actionTypes'

const initialCartState = { items: [] }

function cartReducer(state = initialCartState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const existing = state.items.find((item) => item.id === action.product.id)
      if (!existing) {
        return { ...state, items: [...state.items, { ...action.product, qty: action.qty }] }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.product.id
            ? { ...item, qty: Math.min(item.qty + action.qty, action.product.stock) }
            : item,
        ),
      }
    }
    case REMOVE_FROM_CART:
      return { ...state, items: state.items.filter((item) => item.id !== action.productId) }
    case SET_QTY: {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((item) => item.id !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.productId
            ? { ...item, qty: Math.min(action.qty, item.stock) }
            : item,
        ),
      }
    }
    case CLEAR_CART:
      return initialCartState
    default:
      return state
  }
}

export default cartReducer
