import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderConfirmation({ orderId, orderDetails }) {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-body text-center p-5">
                            <div className="mb-4">
                                <div
                                    className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center"
                                    style={{ width: '80px', height: '80px' }}
                                >
                                    <span style={{ fontSize: '40px' }}>✓</span>
                                </div>
                            </div>

                            <h2 className="mb-3 text-success">¡Compra Exitosa!</h2>
                            <p className="text-muted mb-4">
                                Tu pedido ha sido registrado correctamente
                            </p>

                            <div className="alert alert-light border" role="alert">
                                <small className="text-muted d-block mb-1">ID de Orden</small>
                                <strong className="fs-5 text-dark font-monospace">{orderId}</strong>
                            </div>

                            {orderDetails && (
                                <div className="text-start mt-4 p-3 bg-light rounded">
                                    <h6 className="mb-3">Resumen de tu pedido:</h6>
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between mb-2">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>Total:</strong>
                                        <strong className="text-danger">
                                            ${orderDetails.total.toLocaleString('es-AR')}
                                        </strong>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <p className="text-muted small">
                                    Recibirás un correo de confirmación a <strong>{orderDetails?.buyer?.email}</strong>
                                </p>
                            </div>

                            <Link to="/" className="btn btn-danger btn-lg mt-3 w-100">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
