import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAllPizzas, fetchPizzasByCategory } from '../data/products'
import ItemList from './ItemList'

export default function ItemListContainer({ greeting, onAdd }){
  const { categoryId } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const loader = categoryId ? fetchPizzasByCategory(categoryId) : fetchAllPizzas()
    loader.then(res => setItems(res)).finally(() => setLoading(false))
  }, [categoryId])

  return (
    <ItemList greeting={greeting} items={items} loading={loading} onAdd={onAdd} />
  )
}
