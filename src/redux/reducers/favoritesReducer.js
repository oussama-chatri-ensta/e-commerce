import { TOGGLE_FAVORITE, CLEAR_FAVORITES } from '../actionTypes'

const initialFavoritesState = []

function favoritesReducer(state = initialFavoritesState, action) {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      if (state.includes(action.productId)) {
        return state.filter((id) => id !== action.productId)
      }
      return [...state, action.productId]
    }
    case CLEAR_FAVORITES:
      return initialFavoritesState
    default:
      return state
  }
}

export default favoritesReducer
