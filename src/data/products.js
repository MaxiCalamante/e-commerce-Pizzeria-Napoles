const pizzas = [
  { id: 1, name: 'Margherita', price: 8500, img: '/src/assets/pizza-margherita.svg', desc: 'Tomate, mozzarella, albahaca fresca.', category: 'clasicas' },
  { id: 2, name: 'Pepperoni', price: 9800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Salsa especial, mozzarella y pepperoni.', category: 'clasicas' },
  { id: 3, name: 'Cuatro Quesos', price: 10500, img: '/src/assets/pizza-cuatro.svg', desc: 'Mozzarella, gorgonzola, parmesano y provoleta.', category: 'especiales' }
]

export function fetchAllPizzas(){
  return new Promise((resolve) => {
    setTimeout(() => resolve(pizzas), 400)
  })
}

export function fetchPizzasByCategory(category){
  return new Promise((resolve) => {
    setTimeout(() => {
      if(!category || category === 'all' || category === 'todas') return resolve(pizzas)
      const filtered = pizzas.filter(p => p.category === category)
      resolve(filtered)
    }, 400)
  })
}

export function fetchPizzaById(id){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = pizzas.find(p => String(p.id) === String(id))
      if(found) resolve(found)
      else reject(new Error('Producto no encontrado'))
    }, 400)
  })
}

export function listCategories(){
  const set = new Set(pizzas.map(p => p.category))
  return ['todas', ...Array.from(set)]
}

export default pizzas
