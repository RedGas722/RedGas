import { useState, useRef, useEffect } from 'react'

export const useBuscarSales = (productos, ventasOriginal, setVentas) => {
  const [productoBusqueda, setProductoBusqueda] = useState('')
  const [productoSugerencias, setProductoSugerencias] = useState([])
  const contenedorRefProducto = useRef(null)

  const handleProductoInput = (texto) => {
    setProductoBusqueda(texto)
    const sugerencias = productos.filter(p =>
      p.nombre_producto.toLowerCase().includes(texto.toLowerCase())
    )
    setProductoSugerencias(sugerencias.slice(0, 5))
  }

  const handleBuscar = (nombreProducto) => {
    
    const productoFiltrado = productos.find(p => p.nombre_producto.toLowerCase() === nombreProducto.toLowerCase())
    if (!productoFiltrado) {
      setVentas([])
      return
    }

    const filtrados = ventasOriginal.filter(v => v.id_producto === productoFiltrado.id_producto)
    setVentas(filtrados)
  }

  const handleLimpiar = () => {
    setProductoBusqueda('')
    setProductoSugerencias([])
    setVentas(ventasOriginal)
  }

  // 👇 click fuera para cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contenedorRefProducto.current && !contenedorRefProducto.current.contains(e.target)) {
        setProductoSugerencias([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return {
    productoBusqueda,
    productoSugerencias,
    handleProductoInput,
    handleBuscar,
    handleLimpiar,
    contenedorRefProducto,
    setProductoBusqueda
  }
}
