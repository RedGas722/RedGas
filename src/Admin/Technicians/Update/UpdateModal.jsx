import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ onClose }) => {
  const [nuevoCorreo, setNuevoCorreo] = useState('')
  const [imagen, setImagen] = useState(null)
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')

  const URL = 'http://localhost:10101/TecnicoUpdate'

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!imagen) {
      setMensaje('Por favor, seleccione una imagen.')
      return
    }

    const formData = new FormData()
    formData.append('nombre_tecnico', nombre)
    formData.append('nuevo_correo_tecnico', nuevoCorreo)
    formData.append('contrasena_tecnico', contrasena)
    formData.append('telefono_tecnico', telefono)
    formData.append('imagen', imagen)
    formData.append('correo_tecnico', correo)
    try {
      const res = await fetch(URL, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al actualizar el producto')
      await res.json()
      setMensaje('Actualización exitosa')
    } catch (err) {
      console.error('Error al actualizar:', err)
      setMensaje('Error al actualizar: ' + err.message)
    }
  }

  const handleCancel = () => {
    setNuevoCorreo('')
    setNombre('')
    setImagen(null)
    setMensaje('')
    setCorreo('')
    setTelefono('')
    setContrasena('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setImagen(file)
  }


  return (
    <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="NeoContainer_Admin_outset_TL p-6 w-[340px] flex flex-col gap-4 relative text-[var(--main-color)]">
        <div>
          <button
            className="absolute top-2 right-3 text-[var(--main-color)] text-lg"
            onClick={onClose}
          >✕</button>
        </div>

        <h2 className="text-xl font-bold text-center">Actualizar Tecnico</h2>

        <InputLabel type="1" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del Técnico" />

        <InputLabel type="2" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo actual del Técnico" />

        <InputLabel type="2" value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} placeholder="Correo nuevo del Técnico" />

        <InputLabel type="2" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono nuevo del Técnico" />
        
        <InputLabel type="3" ForID="Password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña nueva del Técnico" />

        <InputLabel type="4" ForID="imagen" placeholder="Seleccionar imagen" onChange={handleImageChange} />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleCancel}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Cancelar</button>
          <button
            onClick={handleUpdate}
            className="NeoContainer_Admin_outset_TL bg-[var(--Font-Nav)] hover:bg-[var(--main-color)] BTN text-[var(--main-color)]"
          >Actualizar</button>
        </div>

        {mensaje && (
          <p className="text-center text-green-600 font-semibold">{mensaje}</p>
        )}
      </div>
    </div>
  )
}
