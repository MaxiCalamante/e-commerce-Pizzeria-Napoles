import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/firestore'
import ItemDetail from './ItemDetail'
import Loader from './Loader'

export default function ItemDetailContainer() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProductById(id)
      .then(res => setItem(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader message="Cargando producto..." />
  if (error) return <div className="alert alert-danger">Error: {error}</div>
  if (!item) return <div className="alert alert-warning">Producto no encontrado.</div>

  return (
    <div className="container py-4">
      <ItemDetail item={item} />
    </div>
  )
}
