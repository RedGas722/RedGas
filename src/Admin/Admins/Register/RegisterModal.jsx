import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const URL_GET = 'https://redgas.onrender.com/AdminGet'
  const URL_POST = 'https://redgas.onrender.com/AdminRegister'

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.'
    if (!correoRegex.test(correo)) errores.correo = 'Correo inválido.'
    if (!telefono.trim() || telefono.length !== 10 || !/^\d+$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos numéricos.'
    if (contrasena.length < 8 || contrasena.length > 15) errores.contrasena = 'Contraseña debe tener entre 8 y 15 caracteres.'

    return errores
  }

  // Verificar si ya existe el correo
  const verificarCorreoExistente = async (correo) => {
    try {
      const res = await fetch(`${URL_GET}?correo_admin=${encodeURIComponent(correo)}`)
      if (!res.ok) throw new Error('Error al verificar el correo')
      const data = await res.json()
      return data?.data?.length > 0 // true si ya existe
    } catch (err) {
      console.error('Error verificando el correo:', err.message)
      return false
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      setMensaje('')
      return
    }

    setErrores({})
    setMensaje('')

    // Verificar si el correo ya está registrado
    const existe = await verificarCorreoExistente(correo.trim())
    if (existe) {
      setMensaje('❌ El correo ya está registrado.')
      return
    }

    try {
      const res = await fetch(URL_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_admin: nombre.trim(),
          correo_admin: correo.trim(),
          telefono_admin: telefono.trim(),
          contraseña_admin: contrasena,
        }),
      })

      if (!res.ok) throw new Error('Error en el registro')
      await res.json()
      setMensaje('✅ Registro exitoso.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('❌ Error al registrar: ' + err.message)
    }
  }

  const handleCancel = () => {
    setNombre('')
    setCorreo('')
    setTelefono('')
    setContrasena('')
    setMensaje('')
    setErrores({})
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Administrador</h2>

        <InputLabel
          type="1"
          ForID="nombre_admin"
          placeholder="Nombre"
          childLabel="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholderError={!!errores.nombre}
        />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
        <InputLabel
          type="2"
          ForID="correo_admin"
          placeholder="Correo"
          childLabel="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholderError={!!errores.correo}
        />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}
        <InputLabel
          type="6"
          ForID="telefono_admin"
          placeholder="Teléfono"
          childLabel="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholderError={!!errores.telefono}
        />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
        <InputLabel
          type="3"
          ForID="contrasena_admin"
          placeholder="Contraseña"
          childLabel="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholderError={!!errores.contrasena}
        />
        {errores.contrasena && <p className="text-red-600 text-sm">{errores.contrasena}</p>}

        <div className="flex justify-between gap-2 mt-2">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
        </div>

        {mensaje && (
          <p
            className={`text-center font-semibold mt-2 ${
              mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
