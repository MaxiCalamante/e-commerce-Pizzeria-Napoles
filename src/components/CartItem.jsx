import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
    const { increaseQuantity, decreaseQuantity, removeItem } = useCart()

    const subtotal = item.price * item.quantity

    return (
        <div className="card mb-3 shadow-sm">
            <div className="row g-0">
                <div className="col-md-2 d-flex align-items-center justify-content-center p-3">
                    <img
                        src={item.img}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px', objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-10">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 className="card-title mb-1">{item.name}</h5>
                                <p className="card-text text-muted small mb-2">{item.desc}</p>
                                <p className="mb-0">
                                    <strong>Precio unitario:</strong> ${item.price.toLocaleString('es-AR')}
                                </p>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeItem(item.id)}
                                title="Eliminar del carrito"
                            >
                                <strong>✕</strong>
                            </button>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => decreaseQuantity(item.id)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="fw-bold px-2">{item.quantity}</span>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => increaseQuantity(item.id)}
                                    disabled={item.stock && item.quantity >= item.stock}
                                >
                                    +
                                </button>
                                {item.stock && (
                                    <small className="text-muted ms-2">
                                        (Stock: {item.stock})
                                    </small>
                                )}
                            </div>
                            <div className="text-end">
                                <strong className="fs-5 text-danger">
                                    ${subtotal.toLocaleString('es-AR')}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
