const pizzas = [
  { id: 1, name: 'Margherita', price: 8500, img: '/src/assets/pizza-margherita.svg', desc: 'Tomate, mozzarella, albahaca fresca.', category: 'clasicas', stock: 15 },
  { id: 2, name: 'Pepperoni', price: 9800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Salsa especial, mozzarella y pepperoni.', category: 'clasicas', stock: 20 },
  { id: 3, name: 'Cuatro Quesos', price: 10500, img: '/src/assets/pizza-cuatro.svg', desc: 'Mozzarella, gorgonzola, parmesano y provoleta.', category: 'especiales', stock: 12 },
  { id: 4, name: 'Napolitana', price: 9200, img: '/src/assets/pizza-margherita.svg', desc: 'Tomate, mozzarella, anchoas, orégano y aceitunas.', category: 'clasicas', stock: 18 },
  { id: 5, name: 'Hawaiana', price: 9500, img: '/src/assets/pizza-pepperoni.svg', desc: 'Jamón, piña, mozzarella y salsa especial.', category: 'especiales', stock: 10 },
  { id: 6, name: 'Vegetariana', price: 10200, img: '/src/assets/pizza-cuatro.svg', desc: 'Champiñones, pimientos, cebolla, tomate, aceitunas y rúcula.', category: 'vegetarianas', stock: 14 },
  { id: 7, name: 'Fugazzeta', price: 9800, img: '/src/assets/pizza-margherita.svg', desc: 'Mozzarella, cebolla caramelizada y orégano.', category: 'clasicas', stock: 16 },
  { id: 8, name: 'Calabresa', price: 10800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Calabresa, mozzarella, tomate y provenzal.', category: 'especiales', stock: 8 },
  { id: 9, name: 'Caprese', price: 11200, img: '/src/assets/pizza-cuatro.svg', desc: 'Tomate cherry, mozzarella de búfala, albahaca y aceite de oliva.', category: 'vegetarianas', stock: 10 },
  { id: 10, name: 'Prosciutto', price: 12500, img: '/src/assets/pizza-margherita.svg', desc: 'Jamón crudo, rúcula, parmesano y aceite de oliva.', category: 'premium', stock: 6 },
  { id: 11, name: 'Trufa Negra', price: 14800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Mozzarella, champiñones, trufa negra y parmesano.', category: 'premium', stock: 4 },
  { id: 12, name: 'Mediterránea', price: 11500, img: '/src/assets/pizza-cuatro.svg', desc: 'Berenjena, calabacín, pimiento asado, queso de cabra y albahaca.', category: 'vegetarianas', stock: 0 }
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
