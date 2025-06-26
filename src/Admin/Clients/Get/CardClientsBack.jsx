import { DeleteClient } from '../Delete/Delete'

const CardClientsBack = ({ cliente, setRefrescar, onUpdateClick }) => {
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${cliente.nombre_cliente}?`)
    if (!confirmar) return

    const { success, message } = await DeleteClient(cliente.correo_cliente)

    if (success) {
      alert(message)
      setRefrescar(true)
    } else {
      alert(`Error: ${message}`)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full min-h-[150px] flex flex-col justify-start overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 truncate">{cliente.nombre_cliente}</h2>

      <div className="mt-2 space-y-1 text-sm">
        <p><span className="font-semibold">ID:</span> {cliente.id_cliente}</p>
        <p><span className="font-semibold">Correo:</span> {cliente.correo_cliente}</p>
        <p><span className="font-semibold">Teléfono:</span> {cliente.telefono_cliente}</p>
        <p><span className="font-semibold">Dirección:</span> {cliente.direccion_cliente}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Eliminar
        </button>

        <button
          onClick={() => onUpdateClick(cliente)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
        >
          Actualizar
        </button>
      </div>
    </div>
  )
}

export default CardClientsBack
