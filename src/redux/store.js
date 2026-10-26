import { legacy_createStore as createStore } from 'redux'
import rootReducer from './reducers'
import { defaultUiState } from './reducers/uiReducer'

const STORAGE_KEY = 'souqdz-state'

function loadInitialState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved || typeof saved !== 'object') return undefined
    return {
      cart: { items: Array.isArray(saved.cart?.items) ? saved.cart.items : [] },
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      ui: { ...defaultUiState, theme: saved.ui?.theme === 'dark' ? 'dark' : 'light' },
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

// Keep cart, favourites and the chosen theme across page reloads.
store.subscribe(() => {
  const { cart, favorites, ui } = store.getState()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ cart, favorites, ui: { theme: ui.theme } }),
  )
})

export default store
