import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from './CartItem'

export default function Cart() {
    const { cart, clearCart, getTotalPrice } = useCart()

    if (cart.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h2 className="mb-4">Carrito de Compras</h2>
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Tu carrito está vacío</h4>
                        <p>¡Agrega algunas pizzas deliciosas para comenzar!</p>
                        <hr />
                        <Link to="/" className="btn btn-danger">
                            Ver catálogo
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const total = getTotalPrice()

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Carrito de Compras</h2>
                <button
                    className="btn btn-outline-danger"
                    onClick={clearCart}
                >
                    Vaciar carrito
                </button>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {cart.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h4 className="card-title mb-4">Resumen del Pedido</h4>

                            <div className="mb-3">
                                {cart.map(item => (
                                    <div key={item.id} className="d-flex justify-content-between mb-2">
                                        <small className="text-muted">
                                            {item.name} × {item.quantity}
                                        </small>
                                        <small>
                                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                                        </small>
                                    </div>
                                ))}
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong className="fs-5">Total:</strong>
                                <strong className="fs-4 text-danger">
                                    ${total.toLocaleString('es-AR')}
                                </strong>
                            </div>

                            <Link to="/checkout" className="btn btn-danger w-100 btn-lg">
                                Finalizar Compra
                            </Link>

                            <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
