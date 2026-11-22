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

let toastId = 0

export const toggleTheme = () => ({ type: TOGGLE_THEME })

export const setSearch = (search) => ({ type: SET_SEARCH, search })

export const setCategory = (category) => ({ type: SET_CATEGORY, category })

export const setSort = (sort) => ({ type: SET_SORT, sort })

export const openCart = () => ({ type: OPEN_CART })

export const closeCart = () => ({ type: CLOSE_CART })

export const openProduct = (product) => ({ type: OPEN_PRODUCT, product })

export const closeProduct = () => ({ type: CLOSE_PRODUCT })

export const openFavorites = () => ({ type: OPEN_FAVORITES })

export const closeFavorites = () => ({ type: CLOSE_FAVORITES })

export const openAuthModal = () => ({ type: OPEN_AUTH_MODAL })

export const closeAuthModal = () => ({ type: CLOSE_AUTH_MODAL })

export const openProductForm = (product = null) => ({ type: OPEN_PRODUCT_FORM, product })

export const closeProductForm = () => ({ type: CLOSE_PRODUCT_FORM })

export const showToast = (message, toastType = 'success') => ({
  type: SHOW_TOAST,
  id: ++toastId,
  message,
  toastType,
})

export const hideToast = () => ({ type: HIDE_TOAST })
