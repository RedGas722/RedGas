import { useState } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [cc_empleado, setCc] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const URL_REGISTER = 'https://redgas.onrender.com/EmpleadoRegister'
  const URL_GET = 'https://redgas.onrender.com/EmpleadoGet'

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (cc_empleado.length < 1 || cc_empleado.length > 15) errores.cc_empleado = 'Cedula obligatoria, entre 10 y 15 caracteres'
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
      const resCheck = await fetch(`${URL_GET}?correo_empleado=${encodeURIComponent(correo)}`)
      if (resCheck.ok) {
        const dataCheck = await resCheck.json()
        if (dataCheck?.data?.length > 0) {
          setMensaje('Ya existe un empleado con ese correo.')
          return
        }
      }

      const res = await fetch(URL_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cc_empleado: cc_empleado,
          nombre_empleado: `${nombre} ${apellido}`,
          correo_empleado: correo,
          telefono_empleado: telefono,
          direccion_empleado: direccion.trim() === '' ? 'sin direccion' : direccion,
          contraseña_empleado: contrasena,
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        setMensaje('Error al registrar: ' + errorText) 
        return
      }
      setMensaje('Empleado registrado exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setCc(0)
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

        <h2 className="text-xl font-bold text-center">Registrar Empleado</h2>

        <InputLabel
          type='5'
          ForID='cc'
          placeholder='CC'
          childLabel='CC'
          value={cc_empleado}
          onChange={(e) => setCc(e.target.value)}
          placeholderError={!!errores.cc_empleado}
        />
        {errores.cc_empleado && <p className="text-red-600 text-sm">{errores.cc_empleado}</p>}
        <InputLabel
          type='1'
          ForID='nombre_empleado'
          placeholder='Nombre del Empleado'
          childLabel='Nombre'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholderError={!!errores.nombre}
        />
        {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
        <InputLabel
          type='1'
          ForID='apellido_empleado'
          placeholder='Apellido del Empleado'
          childLabel='Apellido'
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholderError={!!errores.apellido}
        />
        {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}
        <InputLabel
          type='2'
          ForID='correo_empleado'
          placeholder='Correo del Empleado'
          childLabel='Correo'
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholderError={!!errores.correo}
        />
        {errores.correo && <p className="text-red-600 text-sm">{errores.correo}</p>}
        <InputLabel
          type='6'
          ForID='telefono_empleado'
          placeholder='Teléfono del Empleado'
          childLabel='Teléfono'
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholderError={!!errores.telefono}
        />
        {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
        <InputLabel
          type='1'
          ForID='direccion_empleado'
          placeholder='Dirección del Empleado'
          childLabel='Dirección'
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <InputLabel
          type='3'
          ForID='contrasena_empleado'
          placeholder='Contraseña del Empleado'
          childLabel='Contraseña'
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
