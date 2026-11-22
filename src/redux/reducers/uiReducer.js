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
  OPEN_AUTH_MODAL,
  CLOSE_AUTH_MODAL,
  OPEN_PRODUCT_FORM,
  CLOSE_PRODUCT_FORM,
} from '../actionTypes'

export const defaultUiState = {
  theme: 'light',
  search: '',
  category: 'All',
  sort: 'featured',
  cartOpen: false,
  favoritesOpen: false,
  authModalOpen: false,
  productFormOpen: false,
  editingProduct: null,
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
    case OPEN_AUTH_MODAL:
      return { ...state, authModalOpen: true }
    case CLOSE_AUTH_MODAL:
      return { ...state, authModalOpen: false }
    case OPEN_PRODUCT_FORM:
      return { ...state, productFormOpen: true, editingProduct: action.product || null }
    case CLOSE_PRODUCT_FORM:
      return { ...state, productFormOpen: false, editingProduct: null }
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
