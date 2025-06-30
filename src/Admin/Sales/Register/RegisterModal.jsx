import { useState, useEffect, useRef } from 'react'
import { InputLabel } from '../../../UI/Login_Register/InputLabel/InputLabel'

export const RegisterModal = ({ onClose, setRefrescar }) => {
  const [nombreProducto, setNombreProducto] = useState('')
  const [idProducto, setIdProducto] = useState('')
  const [idFactura, setIdFactura] = useState('')
  const [cantidadProducto, setCantidadProducto] = useState('')
  const [estadoPedido, setEstadoPedido] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})

  const [productos, setProductos] = useState([])
  const [facturas, setFacturas] = useState([])
  const [sugerenciasProducto, setSugerenciasProducto] = useState([])
  const [sugerenciasFactura, setSugerenciasFactura] = useState([])

  const refProducto = useRef(null)
  const refFactura = useRef(null)

  const URL = 'https://redgas.onrender.com/PedidoProductoRegister'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProductos = await fetch('https://redgas.onrender.com/ProductoGetAll')
        const resFacturas = await fetch('https://redgas.onrender.com/FacturaGetAll')
        const dataProductos = await resProductos.json()
        const dataFacturas = await resFacturas.json()
        setProductos(dataProductos.data.productos)
        setFacturas(dataFacturas.data)
      } catch (err) {
        console.error('Error al cargar productos o facturas:', err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!nombreProducto.trim()) return setSugerenciasProducto([])
    const filtrados = productos.filter(p =>
      p.nombre_producto.toLowerCase().includes(nombreProducto.toLowerCase())
    )
    setSugerenciasProducto(filtrados.slice(0, 5))
  }, [nombreProducto, productos])

  useEffect(() => {
    if (!idFactura.trim()) return setSugerenciasFactura([])
    const filtrados = facturas.filter(f =>
      String(f.id_factura).includes(idFactura)
    )
    setSugerenciasFactura(filtrados.slice(0, 5))
  }, [idFactura, facturas])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        refProducto.current && !refProducto.current.contains(e.target) &&
        refFactura.current && !refFactura.current.contains(e.target)
      ) {
        setSugerenciasProducto([])
        setSugerenciasFactura([])
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const validarCampos = () => {
    const errores = {}
    if (!idProducto) errores.idProducto = 'Selecciona un producto válido.'
    if (!idFactura) errores.idFactura = 'ID factura requerido.'
    if (!cantidadProducto || parseInt(cantidadProducto) <= 0) errores.cantidad = 'Cantidad inválida.'
    if (!estadoPedido.trim()) errores.estado = 'Estado requerido.'
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
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_producto: parseInt(idProducto),
          id_factura: parseInt(idFactura),
          cantidad_producto: parseInt(cantidadProducto),
          estado_pedido: estadoPedido
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.errors?.[0]?.msg || 'Error en la solicitud')
      }

      setMensaje('Pedido registrado exitosamente.')
      if (setRefrescar) setRefrescar(true)
    } catch (err) {
      setMensaje('Error al registrar: ' + err.message)
    }
  }

  const cancelarRegistro = () => {
    setNombreProducto('')
    setIdProducto('')
    setIdFactura('')
    setCantidadProducto('')
    setEstadoPedido('')
    setMensaje('')
    setErrores({})
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[350px] flex flex-col gap-4 relative text-black">
        <h2 className="text-xl font-bold text-center">Registrar Venta</h2>

        {/* Autocompletado por nombre de producto */}
        <div className="relative w-full" ref={refProducto}>
          <InputLabel
            type="1"
            ForID="nombreProducto"
            placeholder="Nombre del Producto"
            childLabel="Producto"
            value={nombreProducto}
            onChange={(e) => {
              setNombreProducto(e.target.value)
              setIdProducto('') // Resetear ID al escribir
            }}
            placeholderError={!!errores.idProducto}
          />
          {sugerenciasProducto.length > 0 && (
            <ul className="absolute bg-white border rounded shadow w-full max-h-40 overflow-y-auto z-10">
              {sugerenciasProducto.map((p) => (
                <li
                  key={p.id_producto}
                  onClick={() => {
                    setNombreProducto(p.nombre_producto)
                    setIdProducto(p.id_producto.toString())
                    setSugerenciasProducto([])
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.nombre_producto} (#{p.id_producto})
                </li>
              ))}
            </ul>
          )}
          {errores.idProducto && <p className="text-red-600 text-sm">{errores.idProducto}</p>}
        </div>

        {/* Autocompletado ID Factura (igual que antes) */}
        <div className="relative w-full" ref={refFactura}>
          <InputLabel
            type="1"
            ForID="idFactura"
            placeholder="ID Factura"
            childLabel="ID Factura"
            value={idFactura}
            onChange={(e) => setIdFactura(e.target.value)}
            placeholderError={!!errores.idFactura}
          />
          {sugerenciasFactura.length > 0 && (
            <ul className="absolute bg-white border rounded shadow w-full max-h-40 overflow-y-auto z-10">
              {sugerenciasFactura.map((f) => (
                <li
                  key={f.id_factura}
                  onClick={() => {
                    setIdFactura(f.id_factura.toString())
                    setSugerenciasFactura([])
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Factura #{f.id_factura}
                </li>
              ))}
            </ul>
          )}
          {errores.idFactura && <p className="text-red-600 text-sm">{errores.idFactura}</p>}
        </div>

        <InputLabel
          type="5"
          ForID="cantidadProducto"
          placeholder="Cantidad"
          childLabel="Cantidad"
          value={cantidadProducto}
          onChange={(e) => setCantidadProducto(e.target.value)}
          placeholderError={!!errores.cantidad}
        />
        {errores.cantidad && <p className="text-red-600 text-sm">{errores.cantidad}</p>}

        <InputLabel
          type="1"
          ForID="estadoPedido"
          placeholder="Estado"
          childLabel="Estado"
          value={estadoPedido}
          onChange={(e) => setEstadoPedido(e.target.value)}
          placeholderError={!!errores.estado}
        />
        {errores.estado && <p className="text-red-600 text-sm">{errores.estado}</p>}

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
