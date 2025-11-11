import React, { useState } from 'react'

function ItemCount({ initial = 1, onAdd }){
  const [count, setCount] = useState(initial)
  return (
    <div className="d-flex align-items-center gap-2">
      <button className="btn btn-sm btn-outline-secondary" onClick={() => setCount(c => Math.max(1, c-1))}>-</button>
      <span>{count}</span>
      <button className="btn btn-sm btn-outline-secondary" onClick={() => setCount(c => c+1)}>+</button>
      <button className="btn btn-sm btn-danger" onClick={() => onAdd && onAdd(count)}>Agregar al carrito</button>
    </div>
  )
}

export default function ItemDetail({ item, onAdd }){
  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
          <img src={item.img} alt={item.name} style={{maxWidth:200}} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h3 className="card-title">{item.name}</h3>
            <p className="card-text">{item.desc}</p>
            <p className="card-text"><strong>Precio: </strong>${item.price}</p>
            <ItemCount onAdd={(qty) => onAdd && onAdd(item, qty)} />
          </div>
        </div>
      </div>
    </div>
  )
}
