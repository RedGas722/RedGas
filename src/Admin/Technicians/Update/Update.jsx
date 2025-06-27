import { useState, useEffect } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ onClose, setRefrescar, tecnicoCarta }) => {
  const [tecnico, setTecnico] = useState(null)
  const [nuevoCorreo, setNuevoCorreo] = useState('')
  const [correoParaBusqueda, setCorreoParaBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [imagenFile, setImagenFile] = useState(null) // 📸 Nuevo estado
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

    if (typeof imagen === 'string') {
      return `data:image/png;base64,${imagen}`
    }

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
        // 📸 Si se seleccionó una nueva imagen
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
        // 📝 Sin imagen
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
        if (correoParaBusqueda !== nuevoCorreo) {
          setCorreoParaBusqueda(nuevoCorreo)
        }
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
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Técnico</h2>
        {tecnico && (
          <>
            <InputLabel
              type="5"
              ForID="cc"
              placeholder="CC"
              childLabel="CC"
              value={tecnico?.cc_tecnico || 0}
              onChange={(e) => setTecnico({ ...tecnico, cc_tecnico: e.target.value })}
              className="w-full"
              placeholderError={!!errores.cc}
            />
            {errores.cc_tecnico && (
              <p className="text-red-600 text-sm">{errores.cc_tecnico}</p>
            )}

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
            {errores.nombre && (
              <p className="text-red-600 text-sm">{errores.nombre}</p>
            )}

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
            {errores.apellido && (
              <p className="text-red-600 text-sm">{errores.apellido}</p>
            )}

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
            {errores.nuevoCorreo && (
              <p className="text-red-600 text-sm">{errores.nuevoCorreo}</p>
            )}

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
            {errores.telefono_tecnico && (
              <p className="text-red-600 text-sm">{errores.telefono_tecnico}</p>
            )}

            {imagenPreview && (
              <div className="flex justify-center">
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="max-w-[150px] max-h-[150px] rounded-lg shadow-md object-cover"
                />
              </div>
            )}

            {/* 📸 Input de imagen */}
            <InputLabel
              type="4"
              ForID="imagen_tecnico"
              placeholder="Imagen"
              childLabel="Imagen"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  setImagenFile(file)
                  setImagenPreview(URL.createObjectURL(file)) // Vista previa temporal
                }
              }}
              className="w-full"
            />

            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarTecnico}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Actualizar
              </button>
            </div>
          </>
        )}
        {mensaje && (
          <p
            className={`text-center font-semibold ${
              mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
