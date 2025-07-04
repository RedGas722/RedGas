import { useState, useEffect } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const UpdateModal = ({ onClose, setRefrescar, productoCarta }) => {
  const [producto, setProducto] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [imagenNueva, setImagenNueva] = useState(null)
  const [imagenActual, setImagenActual] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [nombreActualDb, setNombreActualDb] = useState('') // ← Para mantener el nombre actualizado

  const URL_UPDATE = 'https://redgas.onrender.com/ProductoUpdateNI'
  const URL_UPDATE_IMAGEN = 'https://redgas.onrender.com/ProductoUpdate'
  const URL_SE_ENCUENTRA_UPDATE = 'https://redgas.onrender.com/SeEncuentraUpdate'
  const URL_SE_ENCUENTRA_REGISTER = 'https://redgas.onrender.com/SeEncuentraRegister'
  const URL_SE_ENCUENTRA_DELETE = 'https://redgas.onrender.com/SeEncuentraDelete'
  const URL_CATEGORIAS = 'https://redgas.onrender.com/CategoriaGetAll'

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(URL_CATEGORIAS)
        if (!res.ok) throw new Error('Error al cargar categorías')
        const data = await res.json()
        setCategorias(data.data || [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchCategorias()
  }, [])

  // Validación de campos
  const validarCampos = () => {
    const errores = {}
    if (!producto.nuevoNombre.trim()) errores.nuevoNombre = 'Nuevo nombre es obligatorio'
    if (!producto.precio || producto.precio <= 0) errores.precio = 'Precio debe ser mayor que 0'
    if (!producto.descripcion.trim()) errores.descripcion = 'Descripción es obligatoria'
    if (!producto.stock || producto.stock < 0) errores.stock = 'Stock no puede ser negativo'
    if (
      producto.descuento === '' ||
      isNaN(parseInt(producto.descuento)) ||
      parseInt(producto.descuento) < 0 ||
      parseInt(producto.descuento) > 100
    ) {
      errores.descuento = 'Descuento no puede ser menor a 0 o mayor a 100'
    }
    if (parseInt(producto.descuento) > 0) {
      const hoy = new Date().toISOString().slice(0, 10)
      if (!producto.fechaDescuento || producto.fechaDescuento < hoy) {
        errores.fechaDescuento = 'Fecha de descuento debe ser posterior a hoy'
      }
    }
    if (!producto.categoriaSeleccionada) errores.categoriaSeleccionada = 'Seleccione una categoría'
    return errores
  }
  // establecer el producto como el traido de la carta
  useEffect(() => {
    if (productoCarta) {
      setErrores({})
      const nombreInicial = productoCarta.nombre_producto || ''
      const fechaOriginal = convertirFecha(productoCarta.fecha_descuento)
      const hoy = new Date().toISOString().slice(0, 10)
      const fechaFinal = fechaOriginal && fechaOriginal < hoy ? hoy : fechaOriginal

      setProducto({
        nuevoNombre: nombreInicial,
        nombreProducto: nombreInicial,
        precio: productoCarta.precio_producto || '',
        descripcion: productoCarta.descripcion_producto || '',
        stock: productoCarta.stock || '',
        descuento: productoCarta.descuento || 0,
        fechaDescuento: fechaFinal || hoy,
        categoriaSeleccionada: '',
      })

      setNombreActualDb(nombreInicial)

      if (productoCarta.imagen) {
        setImagenActual(`data:image/jpeg;base64,${productoCarta.imagen}`)
        setImagenNueva(null)
      } else {
        setImagenActual(null)
        setImagenNueva(null)
      }
    }
  }, [productoCarta])

  // actualizar la categoria traida
  useEffect(() => {
    if (categorias.length > 0 && productoCarta) {
      const nombreCategoriaValida = productoCarta.categorias?.find(
        (nombre_categoria) => nombre_categoria.toLowerCase() !== 'ofertas'
      )

      const categoriaObj = categorias.find(
        (cat) => cat.nombre_categoria === nombreCategoriaValida
      )

      const nuevaCategoria = categoriaObj ? String(categoriaObj.id_categoria) : ''

      setProducto((prev) => ({
        ...prev,
        categoriaSeleccionada: nuevaCategoria,
      }))
    }
  }, [categorias, productoCarta]) // ← ya no depende de producto

  const handleActualizar = async () => {
    const erroresValidados = validarCampos()
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados)
      return
    }

    setErrores({})
    const hayImagen = !!imagenNueva
    const nombreOriginal = nombreActualDb
    const nombreFinal = producto.nuevoNombre

    try {
      if (hayImagen) {
        const formData = new FormData()
        formData.append('nombre_producto', nombreOriginal)
        formData.append('nuevo_nombre_producto', nombreFinal)
        formData.append('precio_producto', parseFloat(producto.precio))
        formData.append('descripcion_producto', producto.descripcion)
        formData.append('stock', parseInt(producto.stock))
        formData.append('descuento', parseInt(producto.descuento))
        formData.append('fecha_descuento', producto.fechaDescuento)
        formData.append('imagen', imagenNueva)

        const res = await fetch(URL_UPDATE_IMAGEN, {
          method: 'PUT',
          body: formData,
        })

        if (!res.ok) {
          const text = await res.text()
          if (text.includes('Duplicate entry') && text.includes('nombre_producto')) {
            throw new Error('El nombre del producto ya está registrado.')
          }

          const data = JSON.parse(text)
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar con imagen')
        }
      } else {
        const jsonData = {
          nombre_producto: nombreOriginal,
          nuevo_nombre_producto: nombreFinal,
          precio_producto: parseFloat(producto.precio),
          descripcion_producto: producto.descripcion,
          stock: parseInt(producto.stock),
          descuento: parseInt(producto.descuento),
          fecha_descuento: producto.fechaDescuento,
        }

        const res = await fetch(URL_UPDATE, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        })

        if (!res.ok) {
          const text = await res.text()
          if (text.includes('Duplicate entry') && text.includes('nombre_producto')) {
            throw new Error('El nombre del producto ya está registrado.')
          }

          const data = JSON.parse(text)
          throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar sin imagen')
        }
      }

      // ¡Actualizamos el nombre real del producto en el estado!
      setNombreActualDb(nombreFinal)

      // Actualizamos relación de categoría
      if (producto.categoriaSeleccionada !== categoriaSeleccionada) {
        await actualizarRelacionCategoria(nombreFinal)
      }

      if (parseInt(producto.descuento) > 0) {
        await agregarRelacionCategoriaOfertas(nombreFinal, categorias)
      } else {
        await eliminarRelacionCategoriaOfertas(nombreFinal, categorias)
      }

      if (setRefrescar) setRefrescar(true)
      setMensaje('Producto actualizado exitosamente.')
    } catch (err) {
      setMensaje('Error al actualizar: ' + err.message)
    }
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setProducto(null)
    setMensaje('')
    setErrores({})
    setImagenActual(null)
    setImagenNueva(null)
    onClose()
  }

  // Cambiar imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenNueva(file)
      const previewURL = URL.createObjectURL(file) // ← genera vista previa
      setImagenActual(previewURL) // ← actualiza la imagen actual por la nueva
    } else {
      setImagenNueva(null)
      setImagenActual(null)
    }
  }

  const convertirFecha = (fechaConvertir) => {
    return fechaConvertir ? fechaConvertir.slice(0, 10) : ''
  }

  const actualizarRelacionCategoria = async (nombreFinal) => {
    try {
      const res = await fetch(URL_SE_ENCUENTRA_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_producto: nombreFinal, // ¡ya es el nuevo nombre!
          id_categoria: producto.categoriaSeleccionada,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        let data
        try {
          data = JSON.parse(text)
        } catch {
          data = {}
        }
        throw new Error(data?.errors?.[0]?.msg || 'Error al actualizar categoría')
      }
    } catch (error) {
      throw error
    }
  }

  const agregarRelacionCategoriaOfertas = async (nombreProducto, categorias) => {
    try {
      // Buscar la categoría "Ofertas" (sin importar mayúsculas/minúsculas)
      const categoriaOfertas = categorias.find(
        (cat) => cat.nombre_categoria.toLowerCase() === 'ofertas'
      )

      if (!categoriaOfertas) {
        console.warn('No existe la categoría "Ofertas".')
        return
      }

      const payload = {
        nombre_producto: nombreProducto,
        id_categoria: categoriaOfertas.id_categoria,
      }

      const response = await fetch(URL_SE_ENCUENTRA_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error al agregar relación:', errorData)
        return
      }

      const data = await response.json()
      console.log('Relación agregada correctamente:', data)
    } catch (error) {
      console.error('Error en agregarRelacionCategoriaOfertas:', error)
    }
  }

  const eliminarRelacionCategoriaOfertas = async (nombreProducto, categorias) => {
    try {
      const categoriaOfertas = categorias.find(
        (cat) => cat.nombre_categoria.toLowerCase().trim() === 'ofertas'
      )

      if (!categoriaOfertas) {
        console.warn('Categoría "Ofertas" no encontrada.')
        return
      }

      const res = await fetch(`${URL_SE_ENCUENTRA_DELETE}?nombre_producto=${encodeURIComponent(nombreProducto)}&id_categoria=${categoriaOfertas.id_categoria}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error en la respuesta del servidor: ${errorText}`)
      }
    } catch (error) {
      console.error('Error al eliminar relación de categoría Ofertas:', error)
    }
  }


  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[340px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Actualizar Producto</h2>

        {producto && (
          <>
            <InputLabel
              type="1"
              ForID="nuevo_nombre_producto"
              placeholder="Nuevo nombre"
              childLabel="Nombre"
              value={producto.nuevoNombre || ''}
              onChange={(e) => setProducto({ ...producto, nuevoNombre: e.target.value })}
              className="w-full"
              placeholderError={!!errores.nuevoNombre}
            />
            {errores.nuevoNombre && (
              <p className="text-red-600 text-sm">{errores.nuevoNombre}</p>
            )}
            <InputLabel
              type="5"
              ForID="precio_producto"
              placeholder="Precio"
              childLabel="Precio"
              value={producto.precio || ''}
              onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
              className="w-full"
              placeholderError={!!errores.precio}
            />
            {errores.precio && (
              <p className="text-red-600 text-sm">{errores.precio}</p>
            )}
            <InputLabel
              type="1"
              ForID="descripcion_producto"
              placeholder="Descripción"
              childLabel="Descripción"
              value={producto.descripcion || ''}
              onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
              className="w-full"
              placeholderError={!!errores.descripcion}
            />
            {errores.descripcion && (
              <p className="text-red-600 text-sm">{errores.descripcion}</p>
            )}
            <InputLabel
              type="5"
              ForID="stock_producto"
              placeholder="Stock"
              childLabel="Stock"
              value={producto.stock || ''}
              onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
              className="w-full"
              placeholderError={!!errores.stock}
            />
            {errores.stock && (
              <p className="text-red-600 text-sm">{errores.stock}</p>
            )}
            <InputLabel
              type="5"
              ForID="descuento_producto"
              placeholder="Descuento (%)"
              childLabel="Descuento (%)"
              value={producto.descuento || ''}
              onChange={(e) => setProducto({ ...producto, descuento: e.target.value })}
              className="w-full"
              placeholderError={!!errores.descuento}
            />
            {errores.descuento && (
              <p className="text-red-600 text-sm">{errores.descuento}</p>
            )}
            <InputLabel
              type="7"
              ForID="fecha_descuento"
              placeholder="Fecha de descuento"
              childLabel="Fecha de descuento"
              value={producto.fechaDescuento || ''}
              onChange={(e) => setProducto({ ...producto, fechaDescuento: e.target.value })}
              className="w-full"
              placeholderError={!!errores.fechaDescuento}
            />
            {errores.fechaDescuento && (
              <p className="text-red-600 text-sm">{errores.fechaDescuento}</p>
            )}

            {/* Select para categoría */}
            <select
              id="categoria"
              value={producto.categoriaSeleccionada}
              onChange={(e) => setProducto({ ...producto, categoriaSeleccionada: e.target.value })}
              className="border rounded p-2 w-full transition-colors duration-300 bg-white cursor-pointer text-black"
              disabled={false} // Nunca deshabilitado
            >
              <option value="">-- Seleccione una categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </select>
            {errores.categoriaSeleccionada && (
              <p className="text-red-600 text-sm">{errores.categoriaSeleccionada}</p>
            )}

            {imagenActual && (
              <div className="mt-2 flex flex-col items-center">
                <p>Imagen Actual:</p>
                <img
                  src={imagenActual}
                  alt="Producto"
                  className="w-[200px] h-[200px] object-cover rounded shadow mt-2"
                />
              </div>
            )}

            <label className="mt-2">Seleccionar Nueva Imagen:</label>
            <InputLabel
              type="4"
              ForID="nueva_imagen"
              placeholder="Seleccionar Nueva Imagen"
              childLabel="Nueva Imagen"
              onChange={handleImageChange}
              className="w-full"
              placeholderError={!!errores.imagen}
            />
            {errores.imagen && <p className="text-red-600 text-sm">{errores.imagen}</p>}

            <div className="flex justify-between gap-2">
              <button
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizar}
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