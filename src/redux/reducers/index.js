import cartReducer from './cartReducer'
import favoritesReducer from './favoritesReducer'
import uiReducer from './uiReducer'

// Hand-written combination: each reducer owns one slice of the global state.
export default function rootReducer(state = {}, action) {
  return {
    cart: cartReducer(state.cart, action),
    favorites: favoritesReducer(state.favorites, action),
    ui: uiReducer(state.ui, action),
  }
}
