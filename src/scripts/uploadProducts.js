import { db } from '../services/firebase'
import { collection, addDoc } from 'firebase/firestore'

const pizzas = [
    { name: 'Margherita', price: 8500, img: '/src/assets/pizza-margherita.svg', desc: 'Tomate, mozzarella, albahaca fresca.', category: 'clasicas', stock: 15 },
    { name: 'Pepperoni', price: 9800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Salsa especial, mozzarella y pepperoni.', category: 'clasicas', stock: 20 },
    { name: 'Cuatro Quesos', price: 10500, img: '/src/assets/pizza-cuatro.svg', desc: 'Mozzarella, gorgonzola, parmesano y provoleta.', category: 'especiales', stock: 12 },
    { name: 'Napolitana', price: 9200, img: '/src/assets/pizza-margherita.svg', desc: 'Tomate, mozzarella, anchoas, orégano y aceitunas.', category: 'clasicas', stock: 18 },
    { name: 'Hawaiana', price: 9500, img: '/src/assets/pizza-pepperoni.svg', desc: 'Jamón, piña, mozzarella y salsa especial.', category: 'especiales', stock: 10 },
    { name: 'Vegetariana', price: 10200, img: '/src/assets/pizza-cuatro.svg', desc: 'Champiñones, pimientos, cebolla, tomate, aceitunas y rúcula.', category: 'vegetarianas', stock: 14 },
    { name: 'Fugazzeta', price: 9800, img: '/src/assets/pizza-margherita.svg', desc: 'Mozzarella, cebolla caramelizada y orégano.', category: 'clasicas', stock: 16 },
    { name: 'Calabresa', price: 10800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Calabresa, mozzarella, tomate y provenzal.', category: 'especiales', stock: 8 },
    { name: 'Caprese', price: 11200, img: '/src/assets/pizza-cuatro.svg', desc: 'Tomate cherry, mozzarella de búfala, albahaca y aceite de oliva.', category: 'vegetarianas', stock: 10 },
    { name: 'Prosciutto', price: 12500, img: '/src/assets/pizza-margherita.svg', desc: 'Jamón crudo, rúcula, parmesano y aceite de oliva.', category: 'premium', stock: 6 },
    { name: 'Trufa Negra', price: 14800, img: '/src/assets/pizza-pepperoni.svg', desc: 'Mozzarella, champiñones, trufa negra y parmesano.', category: 'premium', stock: 4 },
    { name: 'Mediterránea', price: 11500, img: '/src/assets/pizza-cuatro.svg', desc: 'Berenjena, calabacín, pimiento asado, queso de cabra y albahaca.', category: 'vegetarianas', stock: 0 }
]

async function uploadProducts() {
    console.log('🚀 Iniciando migración de productos a Firestore...')

    try {
        const productsCol = collection(db, 'products')
        let count = 0

        for (const pizza of pizzas) {
            await addDoc(productsCol, pizza)
            count++
            console.log(`✅ ${count}/12 - Producto "${pizza.name}" agregado`)
        }

        console.log('\n🎉 ¡Migración completada exitosamente!')
        console.log(`📊 Total de productos migrados: ${count}`)
        console.log('\n⚠️  IMPORTANTE: Ahora cierra esta pestaña y elimina el archivo upload.html')
    } catch (error) {
        console.error('❌ Error al migrar productos:', error)
        console.error('Detalles del error:', error.message)
    }
}

uploadProducts()
