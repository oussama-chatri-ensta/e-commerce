import {
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  ADD_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
} from '../actionTypes'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return { ...state, loading: true, error: null }
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, items: action.products, error: null }
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.error }
    case ADD_PRODUCT_SUCCESS:
      return { ...state, items: [action.product, ...state.items] }
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        items: state.items.map((p) =>
          p.id === action.product.id || p._id === action.product._id ? action.product : p,
        ),
      }
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        items: state.items.filter(
          (p) => p.id !== action.productId && p._id !== action.productId,
        ),
      }
    default:
      return state
  }
}
