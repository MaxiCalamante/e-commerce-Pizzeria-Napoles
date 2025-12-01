import React from 'react'

export default function Loader({ message = 'Cargando...' }) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Cargando...</span>
            </div>
            {message && <p className="mt-3 text-muted">{message}</p>}
        </div>
    )
}
