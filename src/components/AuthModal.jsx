import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authFailure, authStart, authSuccess } from '../redux/actions/authActions'
import { closeAuthModal, showToast } from '../redux/actions/uiActions'
import { loginUser, registerUser } from '../api'
import { XIcon } from './Icons'

export default function AuthModal() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.authModalOpen)
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setError('')
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeAuthModal())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, dispatch])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    dispatch(authStart())

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password)
        const user = res.user || { name: email.split('@')[0], email }
        dispatch(authSuccess(res.token, user))
        dispatch(showToast(`Welcome back, ${user.name}!`))
        dispatch(closeAuthModal())
      } else {
        await registerUser(name, email, password)
        // Automatically log in after registration
        const loginRes = await loginUser(email, password)
        const user = loginRes.user || { name, email }
        dispatch(authSuccess(loginRes.token, user))
        dispatch(showToast(`Account created! Welcome, ${user.name}`))
        dispatch(closeAuthModal())
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed'
      setError(msg)
      dispatch(authFailure(msg))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <div className="overlay modal-overlay" onClick={() => dispatch(closeAuthModal())}>
      <div
        className="modal auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Sign in' : 'Create an account'}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="overlay-close"
          onClick={() => dispatch(closeAuthModal())}
          aria-label="Close"
        >
          <XIcon />
        </button>

        <div className="auth-form-wrap">
          <div className="auth-head">
            <h2>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to manage your shop catalogue'
                : 'Register to start adding and editing products'}
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-field">
                <label htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="e.g. Oussama Chatri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn primary block" disabled={loading}>
              {loading
                ? mode === 'login'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Register'}
            </button>
          </form>

          <div className="auth-foot">
            {mode === 'login' ? (
              <p>
                Don&rsquo;t have an account?{' '}
                <button type="button" className="link-btn" onClick={switchMode}>
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" className="link-btn" onClick={switchMode}>
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
