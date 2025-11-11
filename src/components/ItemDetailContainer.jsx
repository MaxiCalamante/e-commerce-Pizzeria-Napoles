import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPizzaById } from '../data/products'
import ItemDetail from './ItemDetail'

export default function ItemDetailContainer({ onAdd }){
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPizzaById(id)
      .then(res => setItem(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if(loading) return <p>Cargando producto...</p>
  if(error) return <p>Error: {error}</p>
  if(!item) return <p>Producto no encontrado.</p>

  return <ItemDetail item={item} onAdd={onAdd} />
}
