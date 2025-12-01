import React from 'react'
import { Link } from 'react-router-dom'
import Loader from './Loader'

export default function ItemList({ greeting, items, loading }) {
  if (loading) {
    return <Loader message="Cargando pizzas deliciosas..." />
  }

  return (
    <div>
      <div className="text-center my-5">
        <h1 className="display-5 fw-bold text-danger">{greeting}</h1>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No hay productos disponibles en esta categoría</h4>
          <p>Prueba con otra categoría o vuelve más tarde</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {items.map(pizza => (
            <div key={pizza.id} className="col">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '200px' }}>
                  <img src={pizza.img} alt={pizza.name} className="img-fluid" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pizza.name}</h5>
                  <p className="card-text text-muted small flex-grow-1">{pizza.desc}</p>

                  <div className="mb-2">
                    <span className="badge bg-secondary me-2">{pizza.category}</span>
                    {pizza.stock === 0 ? (
                      <span className="badge bg-danger">Sin stock</span>
                    ) : pizza.stock <= 5 ? (
                      <span className="badge bg-warning text-dark">Pocas unidades</span>
                    ) : null}
                  </div>

                  <p className="fs-5 fw-bold text-danger mb-3">
                    ${pizza.price.toLocaleString('es-AR')}
                  </p>

                  <Link to={`/item/${pizza.id}`} className="btn btn-danger w-100">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
