import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider')
    }
    return context
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('pn_cart')
            return saved ? JSON.parse(saved) : []
        } catch (e) {
            console.error('Error al cargar carrito desde localStorage:', e)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem('pn_cart', JSON.stringify(cart))
        } catch (e) {
            console.error('Error al guardar carrito en localStorage:', e)
        }
    }, [cart])

    const addItem = (product, quantity) => {
        if (quantity <= 0) return

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id)

            if (existingItem) {
                // Verificar stock disponible
                const newQuantity = existingItem.quantity + quantity
                if (product.stock && newQuantity > product.stock) {
                    alert(`Solo hay ${product.stock} unidades disponibles`)
                    return prevCart
                }

                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            } else {
                // Verificar stock al agregar por primera vez
                if (product.stock && quantity > product.stock) {
                    alert(`Solo hay ${product.stock} unidades disponibles`)
                    return prevCart
                }

                return [...prevCart, { ...product, quantity }]
            }
        })
    }

    const removeItem = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId))
    }

    const clearCart = () => {
        setCart([])
    }

    const getItemQuantity = (productId) => {
        const item = cart.find(item => item.id === productId)
        return item ? item.quantity : 0
    }

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(productId)
            return
        }

        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    // Verificar stock
                    if (item.stock && newQuantity > item.stock) {
                        alert(`Solo hay ${item.stock} unidades disponibles`)
                        return item
                    }
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        })
    }

    const increaseQuantity = (productId) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + 1
                    // Verificar stock
                    if (item.stock && newQuantity > item.stock) {
                        alert(`Solo hay ${item.stock} unidades disponibles`)
                        return item
                    }
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        })
    }

    const decreaseQuantity = (productId) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity - 1
                    if (newQuantity <= 0) {
                        return item // No decrementamos aquí, el usuario debe usar removeItem
                    }
                    return { ...item, quantity: newQuantity }
                }
                return item
            }).filter(item => item.quantity > 0)
        })
    }

    const value = {
        cart,
        addItem,
        removeItem,
        clearCart,
        getItemQuantity,
        getTotalItems,
        getTotalPrice,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
