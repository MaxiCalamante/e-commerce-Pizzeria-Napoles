import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ItemCount from './ItemCount'

export default function ItemDetail({ item }) {
  const { addItem, getItemQuantity } = useCart()
  const [itemAdded, setItemAdded] = useState(false)

  const handleAdd = (quantity) => {
    addItem(item, quantity)
    setItemAdded(true)
  }

  const quantityInCart = getItemQuantity(item.id)

  return (
    <div className="card shadow-sm">
      <div className="row g-0">
        <div className="col-md-5 d-flex align-items-center justify-content-center p-4">
          <img
            src={item.img}
            alt={item.name}
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-7">
          <div className="card-body">
            <h2 className="card-title mb-3">{item.name}</h2>
            <p className="card-text text-muted mb-3">{item.desc}</p>

            <div className="mb-3">
              <span className="badge bg-secondary me-2">{item.category}</span>
              {item.stock === 0 ? (
                <span className="badge bg-danger">Sin stock</span>
              ) : item.stock <= 5 ? (
                <span className="badge bg-warning text-dark">Quedan pocas unidades</span>
              ) : (
                <span className="badge bg-success">Disponible</span>
              )}
            </div>

            <h3 className="text-danger mb-4">
              ${item.price.toLocaleString('es-AR')}
            </h3>

            {!itemAdded ? (
              <ItemCount stock={item.stock} initial={1} onAdd={handleAdd} />
            ) : (
              <div className="alert alert-success" role="alert">
                <strong>✓ Producto agregado al carrito</strong>
                {quantityInCart > 0 && (
                  <p className="mb-2 mt-2">
                    <small>Cantidad en carrito: {quantityInCart}</small>
                  </p>
                )}
                <div className="mt-3 d-flex gap-2">
                  <Link to="/cart" className="btn btn-danger">
                    Ir al Carrito
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary">
                    Seguir Comprando
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
