import { useState, useRef } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'
import { Modal, Box, Typography, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Buttons } from '../../../UI/Login_Register/Buttons'

export const RegisterModal = ({ open, onClose, setRefrescar }) => {
  const [cc_tecnico, setCc] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [imagen, setImagen] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [erroresActivos, setErroresActivos] = useState({})
  const errorTimeouts = useRef({})

  const URL_REGISTER = 'https://redgas.onrender.com/TecnicoRegister'
  const URL_GET = 'https://redgas.onrender.com/TecnicoGet'

  const validarCampos = () => {
    const errores = {}
    if (cc_tecnico.length < 1 || cc_tecnico.length > 15) errores.cc_tecnico = "Cédula obligatoria, entre 10 y 15 caracteres"
    if (!nombre.trim()) errores.nombre = 'Nombre es requerido.'
    if (!apellido.trim()) errores.apellido = 'Apellido es requerido.'
    if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Correo inválido.'
    if (!telefono.trim() || !/^\d{10}$/.test(telefono)) errores.telefono = 'Teléfono debe tener 10 dígitos.'
    if (!contrasena.trim() || contrasena.length < 6) errores.contrasena = 'Contraseña debe tener al menos 6 caracteres.'
    if (!imagen) errores.imagen = 'Imagen es requerida.'
    return errores
  }

  const handleRegister = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      setErroresActivos(erroresValidados)
      Object.keys(erroresValidados).forEach((key) => {
        if (errorTimeouts.current[key]) clearTimeout(errorTimeouts.current[key])
        errorTimeouts.current[key] = setTimeout(() => {
          setErroresActivos((prev) => ({ ...prev, [key]: undefined }))
        }, 2000)
      })
      return
    }

    try {
      const resCheck = await fetch(`${URL_GET}?correo_tecnico=${encodeURIComponent(correo)}`)
      if (resCheck.ok) {
        const dataCheck = await resCheck.json()
        if (dataCheck?.data) {
          setMensaje('Ya existe un técnico con ese correo.')
          return
        }
      }

      const formData = new FormData()
      formData.append('cc_tecnico', cc_tecnico)
      formData.append('nombre_tecnico', nombre + ' ' + apellido)
      formData.append('correo_tecnico', correo)
      formData.append('telefono_tecnico', telefono)
      formData.append('contrasena_tecnico', contrasena)
      formData.append('imagen', imagen)

      const res = await fetch(URL_REGISTER, { method: 'POST', body: formData })

      if (!res.ok) {
        setMensaje('Error al registrar: Datos inválidos.')
        return
      }

      setMensaje('Técnico registrado exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImagen(file || null)
  }

  const cancelarRegistro = () => {
    setCc('')
    setNombre('')
    setApellido('')
    setCorreo('')
    setTelefono('')
    setContrasena('')
    setImagen(null)
    setErrores({})
    setMensaje('')
    onClose()
  }

  return (
    <Modal open={open} onClose={cancelarRegistro}>
      <Box
        className="bg-white w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto px-6 py-4 rounded-xl relative shadow-lg"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <IconButton
          onClick={cancelarRegistro}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="font-bold text-center text-[var(--main-color)] mb-4">
          Registrar Técnico
        </Typography>

        <div className="flex flex-col gap-2 text-[var(--main-color)]">
          <InputLabel
            type='5'
            ForID="cc"
            childLabel="CC"
            placeholder={erroresActivos.cc_tecnico || 'CC'}
            value={cc_tecnico}
            onChange={(e) => setCc(e.target.value)}
            placeholderError={!!erroresActivos.cc_tecnico}
          />
          <InputLabel
            type='1'
            ForID="nombre_tecnico"
            childLabel="Nombre"
            placeholder={erroresActivos.nombre || 'Nombre'}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholderError={!!erroresActivos.nombre}
          />
          <InputLabel
            type='1'
            ForID="apellido_tecnico"
            childLabel="Apellido"
            placeholder={erroresActivos.apellido || 'Apellido'}
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholderError={!!erroresActivos.apellido}
          />
          <InputLabel
            type='2'
            ForID="correo_tecnico"
            childLabel="Correo"
            placeholder={erroresActivos.correo || 'example@gmail.com'}
            autoComplete='email'
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholderError={!!erroresActivos.correo}
          />
          <InputLabel
            type='5'
            ForID="telefono_tecnico"
            childLabel="Teléfono"
            placeholder={erroresActivos.telefono || 'Teléfono'}
            autoComplete='off'
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholderError={!!erroresActivos.telefono}
          />
          <InputLabel
            type='3'
            ForID="contrasena_tecnico"
            childLabel="Contraseña"
            placeholder={erroresActivos.contrasena || 'Contraseña'}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholderError={!!erroresActivos.contrasena}
          />
          <InputLabel
            type='4'
            ForID="imagen_tecnico"
            childLabel="Imagen"
            placeholder={erroresActivos.imagen || 'Imagen del Técnico'}
            onChange={handleImageChange}
            placeholderError={!!erroresActivos.imagen}
          />

          {mensaje && (
            <p className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
              {mensaje}
            </p>
          )}

          <div className="flex justify-between mt-4 gap-2">
            <Buttons Onclick={cancelarRegistro} borderWidth='1' nameButton='Cancelar' width='150px' textColor='var(--Font-Yellow)' />
            <Buttons Onclick={handleRegister} borderWidth='1' nameButton='Actualizar' width='150px' textColor='var(--Font-Nav)' />
          </div>
        </div>
      </Box>
    </Modal>
  )
}
export default RegisterModal