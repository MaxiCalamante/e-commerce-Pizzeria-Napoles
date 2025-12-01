import React, { useState } from 'react'

export default function ItemCount({ stock, initial = 1, onAdd }) {
    const [count, setCount] = useState(initial)

    const decrease = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }

    const increase = () => {
        if (count < stock) {
            setCount(count + 1)
        }
    }

    const handleAdd = () => {
        if (stock > 0) {
            onAdd(count)
        }
    }

    if (stock === 0) {
        return (
            <div className="alert alert-warning" role="alert">
                <strong>Sin stock disponible</strong>
            </div>
        )
    }

    return (
        <div className="card p-3 shadow-sm">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                <button
                    className="btn btn-outline-danger"
                    onClick={decrease}
                    disabled={count <= 1}
                >
                    <strong>-</strong>
                </button>
                <span className="fs-4 fw-bold">{count}</span>
                <button
                    className="btn btn-outline-danger"
                    onClick={increase}
                    disabled={count >= stock}
                >
                    <strong>+</strong>
                </button>
            </div>
            <small className="text-muted text-center mb-2">
                Stock disponible: {stock}
            </small>
            <button
                className="btn btn-danger w-100"
                onClick={handleAdd}
                disabled={stock === 0}
            >
                Agregar al carrito
            </button>
        </div>
    )
}
