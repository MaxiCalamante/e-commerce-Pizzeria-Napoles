import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/firestore'
import OrderConfirmation from './OrderConfirmation'

export default function CheckoutForm() {
    const { cart, getTotalPrice, clearCart } = useCart()
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        emailConfirm: ''
    })
    const [errors, setErrors] = useState({})
    const [orderId, setOrderId] = useState(null)
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido'
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido'
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido'
        } else if (!/^\d+$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe contener solo números'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido'
        }

        if (!formData.emailConfirm.trim()) {
            newErrors.emailConfirm = 'Debes confirmar tu email'
        } else if (formData.email !== formData.emailConfirm) {
            newErrors.emailConfirm = 'Los emails no coinciden'
        }

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)

        // Crear orden
        const order = {
            buyer: {
                nombre: formData.nombre,
                apellido: formData.apellido,
                telefono: formData.telefono,
                email: formData.email
            },
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: getTotalPrice()
        }

        try {
            // Guardar orden en Firestore
            const firestoreOrderId = await createOrder(order)

            console.log('✅ Orden guardada en Firestore con ID:', firestoreOrderId)

            setOrderId(firestoreOrderId)
            setOrderDetails({ ...order, date: new Date().toISOString() })
            clearCart()
        } catch (error) {
            console.error('❌ Error al crear orden:', error)
            alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    // Si la orden fue confirmada, mostrar confirmación
    if (orderId) {
        return <OrderConfirmation orderId={orderId} orderDetails={orderDetails} />
    }

    if (cart.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <h4>No hay productos en el carrito</h4>
                    <p>Agrega productos antes de finalizar la compra</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Finalizar Compra</h2>

            <div className="row">
                <div className="col-lg-7">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Datos de Contacto</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="apellido" className="form-label">Apellido *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                                            id="apellido"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono *</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="1122334455"
                                        disabled={loading}
                                    />
                                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        disabled={loading}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="emailConfirm" className="form-label">Confirmar Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.emailConfirm ? 'is-invalid' : ''}`}
                                        id="emailConfirm"
                                        name="emailConfirm"
                                        value={formData.emailConfirm}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        disabled={loading}
                                    />
                                    {errors.emailConfirm && <div className="invalid-feedback">{errors.emailConfirm}</div>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger btn-lg w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Compra'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h4 className="card-title mb-4">Resumen del Pedido</h4>

                            {cart.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <br />
                                        <small className="text-muted">
                                            ${item.price.toLocaleString('es-AR')} × {item.quantity}
                                        </small>
                                    </div>
                                    <div>
                                        <strong>${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
                                    </div>
                                </div>
                            ))}

                            <div className="d-flex justify-content-between pt-3">
                                <strong className="fs-5">Total:</strong>
                                <strong className="fs-4 text-danger">
                                    ${getTotalPrice().toLocaleString('es-AR')}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
