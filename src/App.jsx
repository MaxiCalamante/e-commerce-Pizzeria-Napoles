import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import NavBar from './components/NavBar'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import CheckoutForm from './components/CheckoutForm'
import Contact from './components/Contact'
import NotFound from './components/NotFound'

export default function App() {
  return (
    <CartProvider>
      <div>
        <NavBar />
        <main className="container mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ItemListContainer greeting="Bienvenidos a Pizzería Nápoles! Disfruta nuestros sabores tradicionales." />
                  <Contact />
                </>
              }
            />
            <Route
              path="/category/:categoryId"
              element={<ItemListContainer greeting="Bienvenidos a Pizzería Nápoles! Disfruta nuestros sabores tradicionales." />}
            />
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  )
}
