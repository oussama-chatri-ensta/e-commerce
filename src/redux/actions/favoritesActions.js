import { TOGGLE_FAVORITE, CLEAR_FAVORITES } from '../actionTypes'

export const toggleFavorite = (productId) => ({ type: TOGGLE_FAVORITE, productId })

export const clearFavorites = () => ({ type: CLEAR_FAVORITES })
