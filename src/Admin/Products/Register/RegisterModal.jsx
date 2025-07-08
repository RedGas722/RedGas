import React, { useState, useEffect } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'
import { Modal, Box, Fade, Backdrop } from '@mui/material'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [stock, setStock] = useState('')
  const [descuento, setDescuento] = useState('')
  const [fechaDescuento, setFechaDescuento] = useState(new Date().toISOString().slice(0, 10))
  const [imagen, setImagen] = useState(null)
  const [categoriaId, setCategoriaId] = useState('')
  const [categorias, setCategorias] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const URL_REGISTER = 'https://redgas.onrender.com/ProductoRegister'
  const URL_GET = 'https://redgas.onrender.com/ProductoGet'
  const URL_CATEGORIAS = 'https://redgas.onrender.com/CategoriaGetAll'
  const URL_SE_ENCUENTRA = 'https://redgas.onrender.com/SeEncuentraRegister'

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(URL_CATEGORIAS)
        const data = await res.json()
        setCategorias(data?.data || [])
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    fetchCategorias()
  }, [])

  const validarCampos = () => {
    const errores = {}
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 8 * 1024 * 1024

    if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
    else if (nombre.length > 100) errores.nombre = 'Máximo 100 caracteres.'

    if (!precio.trim()) errores.precio = 'El precio es obligatorio.'
    else if (isNaN(precio) || !/^\d+(\.\d{1,2})?$/.test(precio)) errores.precio = 'Número decimal válido.'

    if (!descripcion.trim()) errores.descripcion = 'La descripción es obligatoria.'

    if (!stock.trim()) errores.stock = 'El stock es obligatorio.'
    else if (!/^\d+$/.test(stock) || parseInt(stock) <= 0) errores.stock = 'Debe ser un número mayor que 0.'

    if (!/^\d+(\.\d{1,2})?$/.test(descuento) || parseFloat(descuento) < 0 || parseFloat(descuento) > 100)
      errores.descuento = 'Descuento entre 0 y 100.'

    const hoy = new Date().toISOString().slice(0, 10)
    if (parseFloat(descuento) > 0 && (!fechaDescuento.trim() || fechaDescuento < hoy))
      errores.fechaDescuento = 'Fecha futura requerida.'

    if (!imagen) errores.imagen = 'La imagen es obligatoria.'
    else {
      if (!tiposPermitidos.includes(imagen.type)) errores.imagen = 'Solo JPG, PNG o WEBP.'
      if (imagen.size > maxSize) errores.imagen = 'Máximo 8MB.'
    }

    if (!categoriaId) errores.categoria = 'Debe seleccionar una categoría.'

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
      const resCheck = await fetch(`${URL_GET}?nombre_producto=${encodeURIComponent(nombre)}`)
      const dataCheck = await resCheck.json()
      if (dataCheck?.data?.length > 0) {
        setMensaje('Ya existe un producto con ese nombre.')
        return
      }
      const precioConIVA = parseFloat(precio) * 1.19
      const precioRedondeado = Math.round(precioConIVA / 50) * 50
      
      const formData = new FormData()
      formData.append('nombre_producto', nombre)
      formData.append('precio_producto', precioRedondeado)
      formData.append('descripcion_producto', descripcion)
      formData.append('stock', parseInt(stock))
      formData.append('descuento', parseInt(descuento))
      formData.append('fecha_descuento', fechaDescuento)
      formData.append('imagen', imagen)

      const resRegister = await fetch(URL_REGISTER, {
        method: 'POST',
        body: formData,
      })

      if (!resRegister.ok) {
        const errorData = await resRegister.json()
        setMensaje('Error al registrar: ' + (errorData?.errors?.[0]?.msg || 'Datos inválidos.'))
        return
      }

      // Registrar la categoría seleccionada
      await fetch(URL_SE_ENCUENTRA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: nombre,
          id_categoria: parseInt(categoriaId),
        }),
      })

      // Si hay descuento > 0, registrar también la categoría "Ofertas"
      if (parseFloat(descuento) > 0) {
        const categoriaOferta = categorias.find(
          (cat) => cat.nombre_categoria.toLowerCase() === 'ofertas'
        )

        if (categoriaOferta) {
          await fetch(URL_SE_ENCUENTRA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre_producto: nombre,
              id_categoria: categoriaOferta.id_categoria,
            }),
          })
        }
      }

      setMensaje('Producto registrado exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setNombre('')
    setPrecio('')
    setDescripcion('')
    setStock('')
    setDescuento('')
    setFechaDescuento(new Date().toISOString().slice(0, 10))
    setImagen(null)
    setCategoriaId('')
    setMensaje('')
    setErrores({})
    onClose()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImagen(file)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320,
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }

  return (
    <Modal
      open={open}
      onClose={cancelarRegistro}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <h2 className="text-xl font-bold text-center">Registrar Producto</h2>

          <InputLabel type="1" ForID="nombre" placeholder="Nombre del Producto" childLabel="Nombre del Producto" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholderError={!!errores.nombre} />
          {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}

          <InputLabel type="5" ForID="precio" placeholder="Precio del Producto" childLabel="Precio del Producto" value={precio} onChange={(e) => setPrecio(e.target.value)} required placeholderError={!!errores.precio} />
          {errores.precio && <p className="text-red-600 text-sm">{errores.precio}</p>}

          {precio && !isNaN(precio) && (
            <p className="text-sm text-blue-600">
              Precio con IVA (19%) y redondeado: ${Math.round(parseFloat(precio) * 1.19 / 50) * 50}
            </p>
          )}

          <InputLabel type="1" ForID="descripcion" placeholder="Descripción" childLabel="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholderError={!!errores.descripcion} />
          {errores.descripcion && <p className="text-red-600 text-sm">{errores.descripcion}</p>}

          <InputLabel type="5" ForID="stock" placeholder="Stock" childLabel="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required placeholderError={!!errores.stock} />
          {errores.stock && <p className="text-red-600 text-sm">{errores.stock}</p>}

          <InputLabel type="5" ForID="descuento" placeholder="Descuento" childLabel="Descuento" value={descuento} onChange={(e) => setDescuento(e.target.value)} required placeholderError={!!errores.descuento} />
          {errores.descuento && <p className="text-red-600 text-sm">{errores.descuento}</p>}

          {parseFloat(descuento) > 0 && (
            <>
              <InputLabel
                type="7"
                ForID="fechaDescuento"
                placeholder="Fecha Descuento"
                childLabel="Fecha Descuento"
                value={fechaDescuento}
                onChange={(e) => setFechaDescuento(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                required
                placeholderError={!!errores.fechaDescuento}
              />
              {errores.fechaDescuento && <p className="text-red-600 text-sm">{errores.fechaDescuento}</p>}
            </>
          )}

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
          {errores.categoria && <p className="text-red-600 text-sm">{errores.categoria}</p>}

          <InputLabel type="4" ForID="imagen" placeholder="Imagen del Producto" childLabel="Imagen del Producto" onChange={handleImageChange} required placeholderError={!!errores.imagen} />
          {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}

          <div className="flex justify-between gap-2 pt-2">
            <button onClick={cancelarRegistro} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancelar</button>
            <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
          </div>

          {mensaje && (
            <p className={`text-center font-semibold ${mensaje.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
              {mensaje}
            </p>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}