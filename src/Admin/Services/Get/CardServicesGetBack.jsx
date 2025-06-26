import React from 'react'
import { DeleteService } from '../Delete/Delete'

const CardServicesGetBack = ({ servicio, setRefrescar, onUpdateClick }) => {
  if (!servicio) return null

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar el servicio ${servicio.nombre_servicio}?`)
    if (!confirmar) return

    const { success, message } = await DeleteService(servicio.nombre_servicio)

    if (success) {
      alert(message)
      setRefrescar && setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[180px] flex flex-col justify-between overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">Servicio #{servicio.id_servicio}</h2>
        <div className="space-y-1 text-sm">
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">ID Servicio:</span>
            <span className="break-words">{servicio.id_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Nombre:</span>
            <span className="break-words">{servicio.nombre_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Descripción:</span>
            <span className="break-words">{servicio.descripcion_servicio}</span>
          </p>
          <p className="text-gray-700 font-medium flex flex-wrap gap-2">
            <span className="font-semibold">Precio:</span>
            <span className="break-words">{servicio.precio_servicio}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Eliminar
        </button>
        {onUpdateClick && (
          <button
            onClick={() => onUpdateClick(servicio)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Actualizar
          </button>
        )}
      </div>
    </div>
  )
}

export default CardServicesGetBack