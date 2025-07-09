import { useState, useEffect } from 'react'
import { Buttons } from '../../../UI/Login_Register/Buttons'
import { Modal, Box, Typography, Button, TextField, IconButton, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ open, onClose, setRefrescar, tecnicoCarta }) => {
  const [tecnico, setTecnico] = useState(null)
  const [nuevoCorreo, setNuevoCorreo] = useState('')
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)

  const validarCampos = () => {
    const errores = {}
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (tecnico.cc_tecnico.length < 1 || tecnico.cc_tecnico.length > 15) errores.cc_tecnico = "Cédula obligatoria, entre 10 y 15 caracteres"
    if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio'
    if (!apellido.trim()) errores.apellido = 'El apellido es obligatorio'

    if (!nuevoCorreo.trim()) {
      errores.nuevoCorreo = 'El correo es obligatorio.'
    } else if (!correoRegex.test(nuevoCorreo)) {
      errores.nuevoCorreo = 'Correo inválido.'
    }

    if (!tecnico?.telefono_tecnico?.trim()) {
      errores.telefono_tecnico = 'El teléfono es obligatorio.'
    } else if (
      tecnico.telefono_tecnico.length !== 10 ||
      !/^\d+$/.test(tecnico.telefono_tecnico)
    ) {
      errores.telefono_tecnico = 'Teléfono debe tener 10 dígitos numéricos.'
    }

    return errores
  }

  const convertirBase64AUrl = (imagen) => {
    if (!imagen) return null
    if (typeof imagen === 'string') return `data:image/png;base64,${imagen}`
    if (imagen.type === 'Buffer' && Array.isArray(imagen.data)) {
      const binary = imagen.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      const base64 = btoa(binary)
      return `data:image/png;base64,${base64}`
    }
    return null
  }

  useEffect(() => {
    if (tecnicoCarta) {
      setTecnico(tecnicoCarta)
      setNuevoCorreo(tecnicoCarta.correo_tecnico)
      setCorreoParaBusqueda(tecnicoCarta.correo_tecnico)
      const partes = tecnicoCarta.nombre_tecnico.trim().split(/\s+/)
      const nombre = partes.slice(0, 2).join(' ')
      const apellido = partes.slice(2).join(' ')
      setNombre(nombre || '')
      setApellido(apellido || '')
      const urlImagen = convertirBase64AUrl(tecnicoCarta.imagen)
      setImagenPreview(urlImagen)
    }
  }, [tecnicoCarta])

  const actualizarTecnico = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }

    setErrores({})
    setMensaje('')

    try {
      let res
      if (imagenFile) {
        const formData = new FormData()
        formData.append('cc_tecnico', tecnico.cc_tecnico)
        formData.append('nombre_tecnico', `${nombre.trim()} ${apellido.trim()}`)
        formData.append('nuevo_correo_tecnico', nuevoCorreo)
        formData.append('telefono_tecnico', tecnico.telefono_tecnico)
        formData.append('correo_tecnico', correoParaBusqueda)
        formData.append('imagen', imagenFile)

        res = await fetch('https://redgas.onrender.com/TecnicoDataUpdate', {
          method: 'PUT',
          body: formData,
        })
      } else {
        const body = {
          cc_tecnico: tecnico.cc_tecnico,
          nombre_tecnico: `${nombre.trim()} ${apellido.trim()}`,
          nuevo_correo_tecnico: nuevoCorreo,
          telefono_tecnico: tecnico.telefono_tecnico,
          correo_tecnico: correoParaBusqueda,
        }
        res = await fetch('https://redgas.onrender.com/TecnicoDataUpdateNI', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      if (res.ok) {
        setMensaje('Técnico actualizado exitosamente.')
        setRefrescar && setRefrescar(true)
        if (correoParaBusqueda !== nuevoCorreo) setCorreoParaBusqueda(nuevoCorreo)
      } else {
        const data = await res.json()
        setMensaje(data.errorInfo || 'Error al actualizar técnico.')
      }
    } catch {
      setMensaje('Error de red al actualizar.')
    }
  }

  const cancelarEdicion = () => {
    setTecnico(null)
    setNuevoCorreo('')
    setCorreoParaBusqueda('')
    setMensaje('')
    setErrores({})
    setNombre('')
    setApellido('')
    setImagenFile(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={cancelarEdicion} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box className="bg-white p-6 rounded-xl w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto relative">
        <IconButton onClick={cancelarEdicion} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="text-center font-bold mb-4">Actualizar Técnico</Typography>

        {tecnico && (
          <>
            {imagenPreview && (
              <div className="flex justify-center my-2">
                <Avatar src={imagenPreview} sx={{ width: 110, height: 110, borderRadius:2 }} />
              </div>
            )}
            <InputLabel
              type="5"
              ForID="cc"
              placeholder="CC"
              childLabel="CC"
              value={tecnico?.cc_tecnico || 0}
              onChange={(e) => setTecnico({ ...tecnico, cc_tecnico: e.target.value })}
              className="w-full"
              placeholderError={!!errores.cc_tecnico}
            />
            {errores.cc_tecnico && <p className="text-red-600 text-sm">{errores.cc_tecnico}</p>}

            <InputLabel
              type="1"
              ForID="nombre_tecnico"
              placeholder="Nombre"
              childLabel="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nombre}
            />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

            <InputLabel
              type="1"
              ForID="apellido_tecnico"
              placeholder="Apellido"
              childLabel="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full"
              placeholderError={!!errores.apellido}
            />
            {errores.apellido && <p className="text-red-600 text-sm">{errores.apellido}</p>}

            <InputLabel
              type="2"
              ForID="correo_tecnico"
              placeholder="Correo"
              childLabel="Correo"
              value={nuevoCorreo}
              onChange={(e) => setNuevoCorreo(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nuevoCorreo}
            />
            {errores.nuevoCorreo && <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>}

            <InputLabel
              type="6"
              ForID="telefono_tecnico"
              placeholder="Teléfono"
              childLabel="Teléfono"
              value={tecnico?.telefono_tecnico || ''}
              onChange={(e) => setTecnico({ ...tecnico, telefono_tecnico: e.target.value })}
              className="w-full"
              placeholderError={!!errores.telefono_tecnico}
            />
            {errores.telefono_tecnico && <p className="text-red-600 text-sm">{errores.telefono_tecnico}</p>}



            <InputLabel
              type="4"
              ForID="imagen_tecnico"
              placeholder="Imagen"
              childLabel="Imagen"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  setImagenFile(file)
                  setImagenPreview(URL.createObjectURL(file))
                }
              }}
              className="w-full"
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Buttons Onclick={cancelarEdicion} borderWidth='1' nameButton='Cancelar' width='150px' textColor='var(--Font-Yellow)' />
              <Buttons Onclick={actualizarTecnico} borderWidth='1' nameButton='Actualizar' width='150px' textColor='var(--Font-Nav)' />
            </Box>
          </>
        )}

        {mensaje && (
          <Typography className={`text-center font-semibold mt-2 ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </Typography>
        )}
      </Box>
    </Modal>
  )
}
export default UpdateModal