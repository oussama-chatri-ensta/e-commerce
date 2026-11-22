import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT,
} from '../actionTypes'

export const authStart = () => ({ type: AUTH_START })
export const authSuccess = (token, user) => ({ type: AUTH_SUCCESS, token, user })
export const authFailure = (error) => ({ type: AUTH_FAILURE, error })
export const logout = () => ({ type: LOGOUT })
