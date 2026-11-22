import { AUTH_START, AUTH_SUCCESS, AUTH_FAILURE, LOGOUT } from '../actionTypes'

const initialAuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
}

export default function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case AUTH_START:
      return { ...state, loading: true, error: null }
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.token,
        user: action.user,
        error: null,
      }
    case AUTH_FAILURE:
      return { ...state, loading: false, error: action.error }
    case LOGOUT:
      return { ...initialAuthState }
    default:
      return state
  }
}
