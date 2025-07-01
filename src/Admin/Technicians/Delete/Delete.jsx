import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

const URL = 'https://redgas.onrender.com/TecnicoDelete'

export const DeleteTechnician = async (correo_tecnico) => {
  try {
    const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correo_tecnico)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Error al eliminar técnico')
    }
    return { success: true, message: 'Técnico eliminado con éxito' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export const DeleteModal = ({ onClose, setRefrescar }) => {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(correo)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!correo.trim()) {
      setMensaje('Por favor, ingrese un correo.')
      return
    }
    if (!validarCorreo(correo)) {
      setMensaje('Por favor, ingrese un correo válido.')
      return
    }
    const { success, message } = await DeleteTechnician(correo)
    setMensaje(message)
    if (success && setRefrescar) setRefrescar(true)
  }

  const handleCancel = () => {
    setCorreo('')
    setMensaje('')
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl p-6 shadow-lg w-[300px] flex flex-col gap-4">
        <button
          className="absolute top-2 right-3 text-gray-600 text-lg"
          onClick={onClose}
        >✕</button>
        <h2 className="text-xl font-bold text-center">Eliminación de Técnico</h2>
        <InputLabel
          type='2'
          placeholder='Correo del técnico'
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required={true}
        />
        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleDelete}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Confirmar</button>
        </div>
        {mensaje && (
          <p className={`text-center ${/éxito|exito|éxito|exitoso/i.test(mensaje) ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}

export default DeleteModal