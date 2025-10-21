import React, { useState } from 'react'

export default function CartWidget({ cartItems = [], increase, decrease, removeItem, clearCart, checkout }){
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(false)
  const count = cartItems.reduce((s, p) => s + (p.quantity || 0), 0)
  const total = cartItems.reduce((s,p) => s + p.quantity * p.price, 0)

  function fmt(n){
    return n.toLocaleString('es-AR')
  }

  React.useEffect(() => {
    if(count === 0) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 260)
    return () => clearTimeout(t)
  }, [count])

  return (
    <div className="d-flex align-items-center text-white position-relative">
      <button className="btn btn-outline-light me-2" aria-label="carrito" onClick={() => setOpen(o => !o)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .49.598l-1.5 6A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.49-.402L1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
      </button>
  <span className={`badge bg-light text-dark cart-badge ${bump? 'cart-bump' : ''}`}>{count}</span>

      {open && (
        <div className="card position-absolute" style={{ right: 0, top: '120%' , width: 340, zIndex: 2000 }}>
          <div className="card-body">
            <h6 className="card-title">Carrito</h6>
            {cartItems.length === 0 ? (
              <p className="mb-0">El carrito está vacío</p>
            ) : (
              <>
              <ul className="list-unstyled mb-2">
                {cartItems.map(item => (
                  <li key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div style={{flex:1}}>
                      <small className="d-block">{item.name}</small>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <button aria-label={`Disminuir ${item.name}`} className="btn btn-sm btn-outline-secondary" onClick={() => decrease && decrease(item.id,1)}>-</button>
                        <small className="px-2">{item.quantity}</small>
                        <button aria-label={`Aumentar ${item.name}`} className="btn btn-sm btn-outline-secondary" onClick={() => increase && increase(item.id,1)}>+</button>
                      </div>
                    </div>
                    <div className="text-end">
                      <div><strong>${fmt(item.price * item.quantity)}</strong></div>
                      <button aria-label={`Eliminar ${item.name}`} className="btn btn-sm btn-link text-danger" onClick={() => removeItem && removeItem(item.id)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center border-top pt-2">
                <strong>Total: ${fmt(total)}</strong>
                <div>
                  <button aria-label="Vaciar carrito" className="btn btn-sm btn-outline-secondary me-2" onClick={() => clearCart && clearCart()}>Vaciar</button>
                  <button aria-label="Procesar compra" className="btn btn-sm btn-danger" onClick={() => checkout && checkout()}>Checkout</button>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
