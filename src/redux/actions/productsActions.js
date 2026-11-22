import {
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  ADD_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
} from '../actionTypes'

export const fetchProductsStart = () => ({ type: FETCH_PRODUCTS_START })
export const fetchProductsSuccess = (products) => ({ type: FETCH_PRODUCTS_SUCCESS, products })
export const fetchProductsFailure = (error) => ({ type: FETCH_PRODUCTS_FAILURE, error })

export const addProductSuccess = (product) => ({ type: ADD_PRODUCT_SUCCESS, product })
export const updateProductSuccess = (product) => ({ type: UPDATE_PRODUCT_SUCCESS, product })
export const deleteProductSuccess = (productId) => ({ type: DELETE_PRODUCT_SUCCESS, productId })
