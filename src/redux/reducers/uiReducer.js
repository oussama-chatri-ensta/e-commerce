import {
  TOGGLE_THEME,
  SET_SEARCH,
  SET_CATEGORY,
  SET_SORT,
  OPEN_CART,
  CLOSE_CART,
  OPEN_PRODUCT,
  CLOSE_PRODUCT,
  SHOW_TOAST,
  HIDE_TOAST,
  OPEN_FAVORITES,
  CLOSE_FAVORITES,
} from '../actionTypes'

export const defaultUiState = {
  theme: 'light',
  search: '',
  category: 'All',
  sort: 'featured',
  cartOpen: false,
  favoritesOpen: false,
  product: null,
  toast: null,
}

function uiReducer(state = defaultUiState, action) {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }
    case SET_SEARCH:
      return { ...state, search: action.search }
    case SET_CATEGORY:
      return { ...state, category: action.category }
    case SET_SORT:
      return { ...state, sort: action.sort }
    case OPEN_CART:
      return { ...state, cartOpen: true }
    case CLOSE_CART:
      return { ...state, cartOpen: false }
    case OPEN_PRODUCT:
      return { ...state, product: action.product }
    case CLOSE_PRODUCT:
      return { ...state, product: null }
    case SHOW_TOAST:
      return { ...state, toast: { id: action.id, message: action.message, toastType: action.toastType } }
    case HIDE_TOAST:
      return { ...state, toast: null }
    case OPEN_FAVORITES:
      return { ...state, favoritesOpen: true }
    case CLOSE_FAVORITES:
      return { ...state, favoritesOpen: false }
    default:
      return state
  }
}

export default uiReducer
