import React from 'react'
import { Link } from 'react-router-dom'
import CartWidget from './CartWidget'
import logo from '../assets/logo.svg'
import { listCategories } from '../data/products'

export default function NavBar({ cartItems = [], increase, decrease, removeItem, clearCart, checkout }){
  const categories = listCategories()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center ms-2">
          <img src={logo} alt="Pizza" width="48" height="48" className="rounded-circle me-2 nav-logo" />
          <Link className="navbar-brand mb-0 text-white" to="/">Pizzería Nápoles</Link>
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
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>
              <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                {categories.map(cat => (
                  <li key={cat}><Link className="dropdown-item" to={cat === 'todas' ? '/' : `/category/${cat}`}>{cat}</Link></li>
                ))}
              </ul>
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
