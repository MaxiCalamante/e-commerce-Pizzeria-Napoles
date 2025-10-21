import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import ItemListContainer from './components/ItemListContainer'
import Contact from './components/Contact'

export default function App(){
  const [cartItems, setCartItems] = useState(() => {
    try{
      const raw = localStorage.getItem('pn_cart')
      return raw ? JSON.parse(raw) : []
    }catch(e){
      return []
    }
  })

  useEffect(() => {
    try{ localStorage.setItem('pn_cart', JSON.stringify(cartItems)) }catch(e){}
  }, [cartItems])

  function addToCart(product, quantity = 1){
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if(existing){
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p)
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function increase(productId, amount = 1){
    setCartItems(prev => prev.map(p => p.id === productId ? { ...p, quantity: p.quantity + amount } : p))
  }

  function decrease(productId, amount = 1){
    setCartItems(prev => prev
      .map(p => p.id === productId ? { ...p, quantity: p.quantity - amount } : p)
      .filter(p => p.quantity > 0)
    )
  }

  function removeItem(productId){
    setCartItems(prev => prev.filter(p => p.id !== productId))
  }

  function clearCart(){
    setCartItems([])
  }

  function checkout(){
    // acción de checkout mínima: mostrar en consola y vaciar carrito
    console.log('Checkout', cartItems)
    setCartItems([])
  }

  return (
    <div>
      <NavBar cartItems={cartItems} increase={increase} decrease={decrease} removeItem={removeItem} clearCart={clearCart} checkout={checkout} />
      <main className="container mt-4">
        <ItemListContainer greeting="Bienvenidos a Pizzería Nápoles! Disfruta nuestros sabores tradicionales." onAdd={addToCart} />
        <Contact />
      </main>
    </div>
  )
}
