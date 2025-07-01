import React from 'react'
import { DeleteService } from '../Delete/Delete'
import { Buttons } from '../../../UI/Login_Register/Buttons'

const CardServicesBack = ({ servicio, setRefrescar, onUpdateClick }) => {
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
    <div className="text-center items-center NeoContainer_outset_TL w-[300px] p-4 h-fit flex flex-col justify-start gap-2">
      <h2 className="text-xl font-bold text-[var(--Font-Nav)] w-full break-words whitespace-normal">
        {servicio.nombre_servicio}
      </h2>

      <div className="flex flex-col text-sm text-[var(--main-color)]">
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">ID Servicio:</span>
          <span className="break-words">{servicio.id_servicio}</span>
        </p>
        <p className="font-medium flex items-start text-start gap-1 min-w-0">
          <span className="font-bold text-[15px] whitespace-nowrap">Descripción:</span>
          <span className="break-words">{servicio.descripcion_servicio}</span>
        </p>
        <p className="font-medium flex items-center gap-1">
          <span className="font-bold text-[15px]">Precio:</span>
          <span className="break-words">{servicio.precio_servicio}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Buttons
          onClick={handleDelete}
          nameButton="Eliminar"
          textColor="var(--Font-Nav2)"
          radius="12"
          borderWidth="1"
          borderColor="var(--Font-Nav2)"
        />
        <Buttons
          onClick={() => onUpdateClick(servicio)}
          nameButton="Actualizar"
          textColor="var(--Font-Yellow)"
          radius="12"
          borderWidth="1"
          borderColor="var(--Font-Yellow)"
        />
      </div>
    </div>
  )
}

export default CardServicesBack
