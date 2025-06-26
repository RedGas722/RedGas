import React from 'react'
import { DeleteProduct } from '../Delete/Delete' // Asegúrate de que esta función esté implementada

const convertirFecha = (fechaConvertir) => {
  return fechaConvertir ? fechaConvertir.slice(0, 10) : ''
}

const convertirBase64AUrl = (imagen) => {
  if (!imagen) {
    console.warn("No hay imagen")
    return null
  }
  if (typeof imagen === 'string') {
    return `data:image/png;base64,${imagen}`
  }
  console.warn("Formato de imagen desconocido:", imagen)
  return null
}

const CardsProductsBack = ({ producto, setRefrescar, onUpdateClick }) => {
  const imageUrl = convertirBase64AUrl(producto.imagen)

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar el producto "${producto.nombre_producto}"?`)
    if (!confirmar) return

    const { success, message } = await DeleteProduct(producto.nombre_producto)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full h-[460px] flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate">{producto.nombre_producto}</h2>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={producto.nombre_producto}
            className="w-full h-[180px] object-contain rounded-md my-2"
          />
        ) : (
          <div className="w-full h-[180px] flex justify-center items-center bg-gray-200 rounded-md text-gray-500">
            Imagen no disponible
          </div>
        )}

        <h2 className="text-md text-gray-600">
          Categoría: {producto.categorias?.join(', ') || 'Sin categoría'}
        </h2>
        <h2 className="text-md font-bold text-gray-600">Stock: {producto.stock}</h2>

        {producto.descuento != 0 && (
          <>
            <h2 className="text-md font-bold text-gray-600">Descuento: {producto.descuento}%</h2>
            <h2 className="text-md font-bold text-gray-600">Fecha Descuento: {convertirFecha(producto.fecha_descuento)}</h2>
          </>
        )}

        <p className="text-lg font-bold text-green-600">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(producto.precio_producto || 0)}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Eliminar
        </button>

        <button
          onClick={() => onUpdateClick(producto)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          Actualizar
        </button>
      </div>
    </div>
  )
}

export default CardsProductsBack
