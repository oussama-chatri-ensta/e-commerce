import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../redux/actions/uiActions'
import { CheckIcon } from './Icons'

export default function Toast() {
  const dispatch = useDispatch()
  const toast = useSelector((state) => state.ui.toast)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => dispatch(hideToast()), 2600)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div key={toast.id} className={toast.toastType === 'info' ? 'toast info' : 'toast'} role="status">
      <CheckIcon />
      {toast.message}
    </div>
  )
}
