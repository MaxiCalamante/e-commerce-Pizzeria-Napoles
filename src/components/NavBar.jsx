import React from 'react'
import CartWidget from './CartWidget'
import logo from '../assets/logo.svg'

export default function NavBar({ cartItems = [], increase, decrease, removeItem, clearCart, checkout }){
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center ms-2">
          <img src={logo} alt="Pizza" width="48" height="48" className="rounded-circle me-2 nav-logo" />
          <a className="navbar-brand mb-0" href="#">Pizzería Nápoles</a>
          {cartItems.length > 0 && (
            <small className="text-white ms-3">Total: ${cartItems.reduce((s,p)=>s+p.price*p.quantity,0).toLocaleString('es-AR')}</small>
          )}
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#menu">Menú</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contacto</a>
            </li>
          </ul>
          <CartWidget cartItems={cartItems} increase={increase} decrease={decrease} removeItem={removeItem} clearCart={clearCart} checkout={checkout} />
        </div>
      </div>
    </nav>
  )
}
