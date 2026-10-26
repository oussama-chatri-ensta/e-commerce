import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import Hero from './components/Hero'
import Toolbar from './components/Toolbar'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'
import FavoritesPanel from './components/FavoritesPanel'
import Toast from './components/Toast'
import Footer from './components/Footer'

export default function App() {
  const theme = useSelector((state) => state.ui.theme)
  const cartOpen = useSelector((state) => state.ui.cartOpen)
  const favoritesOpen = useSelector((state) => state.ui.favoritesOpen)
  const modalProduct = useSelector((state) => state.ui.product)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.body.classList.toggle(
      'no-scroll',
      cartOpen || favoritesOpen || Boolean(modalProduct),
    )
  }, [cartOpen, favoritesOpen, modalProduct])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Toolbar />
        <ProductGrid />
      </main>
      <Footer />
      <ProductModal />
      <CartDrawer />
      <FavoritesPanel />
      <Toast />
    </>
  )
}
