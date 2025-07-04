import { useState, useEffect } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ onClose, setRefrescar, servicioCarta }) => {
  const [servicio, setServicio] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nombreParaBusqueda, setNombreParaBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')

  useEffect(() => {
    if (servicioCarta) {
      setServicio(servicioCarta)
      setNuevoNombre(servicioCarta.nombre_servicio)
      setNombreParaBusqueda(servicioCarta.nombre_servicio)
      setDescripcion(servicioCarta.descripcion_servicio || '')
      setPrecio(servicioCarta.precio_servicio ? servicioCarta.precio_servicio.toString() : '')
    }
  }, [servicioCarta])

  const validarCampos = () => {
    const errores = {}
    if (!nuevoNombre.trim()) errores.nuevoNombre = 'El nombre es obligatorio'
    if (!descripcion.trim()) errores.descripcion = 'La descripción es obligatoria'
    if (!precio || isNaN(precio) || Number(precio) <= 0) errores.precio = 'El precio debe ser un número mayor a 0'
    return errores
  }

  const actualizarServicio = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }
    setErrores({})
    setMensaje('')

    const body = {
      nombre_servicio: nombreParaBusqueda, // para buscar el servicio original
      nuevo_nombre_servicio: nuevoNombre,
      descripcion_servicio: descripcion,
      precio_servicio: parseFloat(precio),
    }

    try {
      const res = await fetch('https://redgas.onrender.com/ServicioUpdate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setMensaje('Servicio actualizado exitosamente.')
        if (typeof setRefrescar === 'function') setRefrescar(true)
        setNombreParaBusqueda(nuevoNombre)
      } else {
        const data = await res.json()
        setMensaje(data.errorInfo || 'Error al actualizar servicio.')
      }
    } catch {
      setMensaje('Error de red al actualizar.')
    }
  }

  const cancelarEdicion = () => {
    setServicio(null)
    setNuevoNombre('')
    setNombreParaBusqueda('')
    setMensaje('')
    setErrores({})
    setDescripcion('')
    setPrecio('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Servicio</h2>
        {servicio && (
          <>
            <InputLabel
              type="1"
              ForID="nombre_servicio"
              placeholder="Nombre"
              childLabel="Nombre"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="w-full"
              placeholderError={!!errores.nuevoNombre}
            />
            {errores.nuevoNombre && (
              <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>
            )}
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={`border rounded p-2 w-full ${errores.descripcion ? 'border-red-500' : ''}`}
            />
            {errores.descripcion && (
              <p className="text-red-600 text-sm">{errores.descripcion}</p>
            )}
            <InputLabel
              type="5"
              ForID="precio_servicio"
              placeholder="Precio"
              childLabel="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full"
              placeholderError={!!errores.precio}
            />
            {errores.precio && (
              <p className="text-red-600 text-sm">{errores.precio}</p>
            )}
            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarServicio}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Actualizar
              </button>
            </div>
          </>
        )}
        {mensaje && (
          <p
            className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}
