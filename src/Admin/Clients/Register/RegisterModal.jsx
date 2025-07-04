import React, { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const URL_REGISTER = 'https://redgas.onrender.com/ClienteRegister'
  const URL_GET = 'https://redgas.onrender.com/ClienteGet'

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.'
    if (!apellido.trim()) errores.apellido = 'Apellido es requerido.'
    if (!correoRegex.test(correo)) errores.correo = 'Correo inválido.'
    if (telefono.length !== 10 || !/^\d+$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos.'
    if (contrasena.length < 8 || contrasena.length > 15) errores.contrasena = 'Contraseña debe tener entre 8 y 15 caracteres.'

    return errores
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

    try {
      const resCheck = await fetch(`${URL_GET}?correo_cliente=${encodeURIComponent(correo)}`)
      if (resCheck.ok) {
        const dataCheck = await resCheck.json()
        if (dataCheck?.data?.length > 0) {
          setMensaje('Ya existe un cliente con ese correo.')
          return
        }
      }

      const res = await fetch(URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: `${nombre} ${apellido}`,
          correo_cliente: correo,
          telefono_cliente: telefono,
          direccion_cliente: direccion.trim() === '' ? 'sin direccion' : direccion,
          contraseña_cliente: contrasena,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos.'))
        return
      }

      setMensaje('Cliente registrado exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setNombre('')
    setApellido('')
    setCorreo('')
    setTelefono('')
    setDireccion('')
    setContrasena('')
    setErrores({})
    setMensaje('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[320px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Cliente</h2>

        <InputLabel
          type="1"
          ForID="nombre"
          placeholder="Nombre del Cliente"
          childLabel="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholderError={!!errores.nombre}
        />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

        <InputLabel
          type="1"
          ForID="apellido"
          placeholder="Apellido del Cliente"
          childLabel="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          placeholderError={!!errores.apellido}
        />
        {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}

        <InputLabel
          type="2"
          ForID="correo"
          placeholder="Correo del Cliente"
          childLabel="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          placeholderError={!!errores.correo}
        />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}

        <InputLabel
          type="6"
          ForID="telefono"
          placeholder="Teléfono del Cliente"
          childLabel="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          placeholderError={!!errores.telefono}
        />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}

        <InputLabel
          type="1"
          ForID="direccion"
          placeholder="Dirección del Cliente"
          childLabel="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <InputLabel
          type="3"
          ForID="password"
          placeholder="Contraseña del Cliente"
          childLabel="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          placeholderError={!!errores.contrasena}
        />
        {errores.contrasena && <p className="text-red-600 text-sm">{errores.contrasena}</p>}

        <div className="flex justify-between gap-2">
          <button onClick={cancelarRegistro} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>

        {mensaje && (
          <p className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
