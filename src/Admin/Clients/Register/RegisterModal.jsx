import React, { useState } from 'react'
import { Modal, Box, Typography, Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ open, onClose, setRefrescar }) => {
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

  const handleRegister = async () => {
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
    <Modal open={open} onClose={cancelarRegistro}>
      <Box
        className="bg-white w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto p-6 rounded-xl relative shadow-lg"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <IconButton onClick={cancelarRegistro} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="font-bold text-center text-[var(--main-color)] mb-4">
          Registrar Cliente
        </Typography>

        <div className="flex flex-col gap-3 text-[var(--main-color)]">
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

          <div className="flex justify-between mt-4 gap-2">
            <Button variant="outlined" onClick={cancelarRegistro} color="inherit" fullWidth>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleRegister} color="primary" fullWidth>
              Registrar
            </Button>
          </div>

          {mensaje && (
            <Typography
              variant="body2"
              className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {mensaje}
            </Typography>
          )}
        </div>
      </Box>
    </Modal>
  )
}
export default RegisterModal