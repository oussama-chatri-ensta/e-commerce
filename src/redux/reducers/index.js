import cartReducer from './cartReducer'
import favoritesReducer from './favoritesReducer'
import uiReducer from './uiReducer'
import productsReducer from './productsReducer'
import authReducer from './authReducer'

export default function rootReducer(state = {}, action) {
  return {
    cart: cartReducer(state.cart, action),
    favorites: favoritesReducer(state.favorites, action),
    ui: uiReducer(state.ui, action),
    products: productsReducer(state.products, action),
    auth: authReducer(state.auth, action),
  }
}
