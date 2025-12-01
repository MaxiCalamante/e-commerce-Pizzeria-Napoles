import { db } from './firebase'
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    addDoc
} from 'firebase/firestore'

// Obtener todos los productos
export async function getProducts() {
    try {
        const productsCol = collection(db, 'products')
        const snapshot = await getDocs(productsCol)
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return products
    } catch (error) {
        console.error('Error al obtener productos:', error)
        throw error
    }
}

// Obtener productos por categoría
export async function getProductsByCategory(categoryId) {
    try {
        if (!categoryId || categoryId === 'todas') {
            return getProducts()
        }

        const productsCol = collection(db, 'products')
        const q = query(productsCol, where('category', '==', categoryId))
        const snapshot = await getDocs(q)
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return products
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error)
        throw error
    }
}

// Obtener producto por ID
export async function getProductById(productId) {
    try {
        const productDoc = doc(db, 'products', productId)
        const snapshot = await getDoc(productDoc)

        if (!snapshot.exists()) {
            throw new Error('Producto no encontrado')
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        }
    } catch (error) {
        console.error('Error al obtener producto:', error)
        throw error
    }
}

// Crear orden de compra
export async function createOrder(orderData) {
    try {
        const ordersCol = collection(db, 'orders')
        const docRef = await addDoc(ordersCol, {
            ...orderData,
            createdAt: new Date().toISOString(),
            status: 'pending'
        })

        return docRef.id
    } catch (error) {
        console.error('Error al crear orden:', error)
        throw error
    }
}
