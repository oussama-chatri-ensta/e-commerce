import { legacy_createStore as createStore } from 'redux'
import rootReducer from './reducers'
import { defaultUiState } from './reducers/uiReducer'

const STORAGE_KEY = 'souqdz-state'

function loadInitialState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    const savedToken = localStorage.getItem('souqdz_token') || null
    let savedUser = null
    try {
      savedUser = JSON.parse(localStorage.getItem('souqdz_user'))
    } catch {}

    return {
      cart: { items: Array.isArray(saved.cart?.items) ? saved.cart.items : [] },
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      ui: { ...defaultUiState, theme: saved.ui?.theme === 'dark' ? 'dark' : 'light' },
      products: { items: [], loading: false, error: null },
      auth: { token: savedToken, user: savedUser, loading: false, error: null },
    }
  } catch {
    return undefined
  }
}

const store = createStore(
  rootReducer,
  loadInitialState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

store.subscribe(() => {
  const { cart, favorites, ui, auth } = store.getState()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ cart, favorites, ui: { theme: ui.theme } }),
  )

  if (auth?.token) {
    localStorage.setItem('souqdz_token', auth.token)
    if (auth.user) {
      localStorage.setItem('souqdz_user', JSON.stringify(auth.user))
    }
  } else {
    localStorage.removeItem('souqdz_token')
    localStorage.removeItem('souqdz_user')
  }
})

export default store
