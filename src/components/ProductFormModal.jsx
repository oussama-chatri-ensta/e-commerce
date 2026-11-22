import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProductSuccess, updateProductSuccess } from '../redux/actions/productsActions'
import { closeProductForm, showToast } from '../redux/actions/uiActions'
import { createProduct, updateProduct } from '../api'
import { CATEGORIES } from '../data/products'
import { XIcon } from './Icons'

export default function ProductFormModal() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.productFormOpen)
  const editing = useSelector((state) => state.ui.editingProduct)
  const token = useSelector((state) => state.auth.token)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0] || 'Electronics')
  const [imageUrl, setImageUrl] = useState('')
  const [stock, setStock] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setError('')
      return undefined
    }

    if (editing) {
      setName(editing.name || editing.title || '')
      setDescription(editing.description || '')
      setPrice(editing.price !== undefined ? String(editing.price) : '')
      setCategory(editing.category || CATEGORIES[0] || 'Electronics')
      setImageUrl(editing.imageUrl || editing.thumbnail || '')
      setStock(editing.stock !== undefined ? String(editing.stock) : '')
    } else {
      setName('')
      setDescription('')
      setPrice('')
      setCategory(CATEGORIES[0] || 'Electronics')
      setImageUrl('')
      setStock('')
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') dispatch(closeProductForm())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, editing, dispatch])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const numPrice = Number(price)
    const numStock = Number(stock)

    if (isNaN(numPrice) || numPrice < 0) {
      setError('Price must be a positive number')
      return
    }

    if (isNaN(numStock) || numStock < 0) {
      setError('Stock must be 0 or greater')
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      category,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      stock: numStock,
    }

    setLoading(true)

    try {
      if (editing) {
        const id = editing._id || editing.id
        const updated = await updateProduct(id, payload, token)
        dispatch(updateProductSuccess(updated))
        dispatch(showToast(`"${updated.title}" updated successfully`))
      } else {
        const created = await createProduct(payload, token)
        dispatch(addProductSuccess(created))
        dispatch(showToast(`"${created.title}" added to catalogue`))
      }
      dispatch(closeProductForm())
    } catch (err) {
      setError(err.message || 'Could not save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay modal-overlay" onClick={() => dispatch(closeProductForm())}>
      <div
        className="modal product-form-modal"
        role="dialog"
        aria-modal="true"
        aria-label={editing ? 'Edit product' : 'Add new product'}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="overlay-close"
          onClick={() => dispatch(closeProductForm())}
          aria-label="Close"
        >
          <XIcon />
        </button>

        <div className="product-form-wrap">
          <div className="auth-head">
            <h2>{editing ? 'Edit product' : 'Add new product'}</h2>
            <p>
              {editing
                ? 'Update the product details in MongoDB'
                : 'Enter details to publish a new product in the souq'}
            </p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="p-name">Product name</label>
              <input
                id="p-name"
                type="text"
                required
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="p-cat">Category</label>
                <select
                  id="p-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="p-price">Price (DZD)</label>
                <input
                  id="p-price"
                  type="number"
                  min="0"
                  step="50"
                  required
                  placeholder="e.g. 8500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="p-stock">Stock quantity</label>
                <input
                  id="p-stock"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 25"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="p-image">Image URL</label>
                <input
                  id="p-image"
                  type="url"
                  placeholder="https://example.com/photo.webp"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="p-desc">Description</label>
              <textarea
                id="p-desc"
                rows="3"
                required
                placeholder="Write a clear description of the item…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn ghost"
                onClick={() => dispatch(closeProductForm())}
              >
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
