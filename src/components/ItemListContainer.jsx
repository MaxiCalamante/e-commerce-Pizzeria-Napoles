import React from 'react'
import pizzaMargherita from '../assets/pizza-margherita.svg'
import pizzaPepperoni from '../assets/pizza-pepperoni.svg'
import pizzaCuatro from '../assets/pizza-cuatro.svg'

const pizzas = [
  { id: 1, name: 'Margherita', price: 8500, img: pizzaMargherita, desc: 'Tomate, mozzarella, albahaca fresca.' },
  { id: 2, name: 'Pepperoni', price: 9800, img: pizzaPepperoni, desc: 'Salsa especial, mozzarella y pepperoni.' },
  { id: 3, name: 'Cuatro Quesos', price: 105000, img: pizzaCuatro, desc: 'Mozzarella, gorgonzola, parmesano y provoleta.' }
]

export default function ItemListContainer({ greeting, onAdd }){
  return (
    <div>
      <div className="hero mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="mb-2">{greeting}</h1>
              <p className="lead">Descubri nuestras pizzas artesanales, masa casera y ingredientes seleccionados. ¡Pedí online o pasá por el local!</p>
            </div>
            <div className="col-md-4 text-center">
              <img src="/src/assets/pizza-pepperoni.svg" alt="pizza" style={{maxWidth:180}} className="img-fluid" />
            </div>
          </div>
        </div>
      </div>

  <section id="menu" className="row g-4 section-separator">
        {pizzas.map(p => (
          <article key={p.id} className="col-12 col-md-4">
            <div className="card h-100 shadow-sm hover-scale">
              <div style={{height:200, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                <img src={p.img} style={{maxWidth:'100%', maxHeight:'100%'}} className="card-img-top" alt={p.name} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.desc}</p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <strong>${p.price}</strong>
                </div>
                <div className="d-flex gap-2">
                  <button aria-label={`Agregar 1 ${p.name} al carrito`} className="btn btn-sm btn-danger" onClick={() => onAdd && onAdd(p)}>Agregar</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
