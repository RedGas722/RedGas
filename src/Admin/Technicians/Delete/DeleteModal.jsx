import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

const URL = 'http://localhost:10101/TecnicoDelete'

export const DeleteModal = ({ onClose, onTecnicoEliminado }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
    return regex.test(correo);
  };

  const handleDelete = async (e) => {
    e.preventDefault()

    if (!correo.trim()) {
      setMensaje('Por favor, ingrese un correo.');
      return;
    }

    if (!validarCorreo(correo)) {
      setMensaje('Por favor, ingrese un correo válido.');
      return;
    }

    try {
      const res = await fetch(`${URL}?correo_tecnico=${encodeURIComponent(correo)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.message === 'Correo no encontrado') {
          setMensaje('El correo no se encuentra registrado.');
          return;
        }
        setMensaje('Error al eliminar: ' + (errorData.message || 'Error desconocido del servidor'));
        return;
      }

      const data = await res.json();
      if (data && typeof data.message === 'string' && data.message === 'Correo no encontrado') {
        setMensaje('El correo no se encuentra registrado.');
        return;
      }
      setMensaje('Eliminación exitosa');
      if (onTecnicoEliminado) onTecnicoEliminado(correo);
    } catch (err) {
      setMensaje('Error al eliminar: ' + err.message)
    }
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

        <h2 className="text-xl font-bold text-center">Eliminación de Tecnico</h2>
        <InputLabel
          type='2'
          placeholder='Correo del tecnico'
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
          <p className={`text-center ${/error|por favor/i.test(mensaje) ? 'text-red-600' : 'text-green-600'} font-semibold`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
export default DeleteModal