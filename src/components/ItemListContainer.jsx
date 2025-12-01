import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts, getProductsByCategory } from '../services/firestore'
import ItemList from './ItemList'

export default function ItemListContainer({ greeting }) {
  const { categoryId } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const loader = categoryId ? getProductsByCategory(categoryId) : getProducts()
    loader
      .then(res => setItems(res))
      .catch(err => {
        console.error('Error al cargar productos:', err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <ItemList greeting={greeting} items={items} loading={loading} />
  )
}
