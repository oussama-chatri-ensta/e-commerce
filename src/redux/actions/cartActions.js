import { ADD_TO_CART, REMOVE_FROM_CART, SET_QTY, CLEAR_CART } from '../actionTypes'

export const addToCart = (product, qty = 1) => ({ type: ADD_TO_CART, product, qty })

export const removeFromCart = (productId) => ({ type: REMOVE_FROM_CART, productId })

export const setQty = (productId, qty) => ({ type: SET_QTY, productId, qty })

export const clearCart = () => ({ type: CLEAR_CART })
