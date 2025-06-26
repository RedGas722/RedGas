import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { buscarProductoPorNombre } from './Get/Get'
import CardsProductsBack from './Get/CardProductsBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'


export const ProductsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [productos, setProductos] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)


  // Estados para búsqueda
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [productoBuscado, setProductoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])

  const inputRef = useRef(null)
  const contenedorRef = useRef(null)

  const URL_ALL = 'https://redgas.onrender.com/ProductoGetAllPaginated'

  async function fetchProductos(pagina = 1) {
    try {
      const res = await fetch(`${URL_ALL}?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener productos')
      const data = await res.json()
      const resultado = data.data.resultado

      setProductos(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProductos(paginaActual)
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchProductos(1)
      setPaginaActual(1)
      setRefrescar(false)
      setProductoBuscado(null)
      setErrorBusqueda('')
      setNombreBusqueda('')
    }
  }, [refrescar])

  const abrirModalActualizar = (producto) => {
    setProductoSeleccionado(producto)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setProductoSeleccionado(null)
    setShowUpdateModal(false)
  }

  const buscarProducto = async () => {
    setErrorBusqueda('')
    setProductoBuscado(null)

    try {
      const resultado = await buscarProductoPorNombre(nombreBusqueda)
      setProductoBuscado(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  // 🧠 Autocomplete filtrando productos localmente
  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = productos.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(nombreBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [nombreBusqueda, productos])

  // 🧽 Cierre del dropdown si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target)
      ) {
        setSugerencias([])
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Producto BACK-OFFICE</h1>
           <div className='btnDown'>
            <BtnBack To='/Admin'  />
          </div>
        </div>

        {/* Búsqueda con autocomplete */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <InputLabel
              type="1"
              ForID="nombre_producto_busqueda"
              placeholder="Buscar producto"
              childLabel="Buscar producto"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full"
            />
            <button
              onClick={buscarProducto}
              aria-label="Buscar producto"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((producto) => (
                <li
                  key={producto.id_producto}
                  onClick={() => {
                    setProductoBuscado(producto)
                    setNombreBusqueda(producto.nombre_producto)
                    setSugerencias([])
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {producto.nombre_producto}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {/* Mensaje de error */}
      {errorBusqueda && (
        <p className="text-red-600 text-sm">{errorBusqueda}</p>
      )}

      {/* Mensaje de éxito */}
      {mensaje && (
        <div className="mt-2 text-sm text-center text-green-600 font-semibold">
          {mensaje}
        </div>
      )}

      {/* Tarjetas de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productoBuscado ? (
          <CardsProductsBack
            key={productoBuscado.id_producto}
            producto={productoBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          productos.map((producto) => (
            <CardsProductsBack
              key={producto.id_producto}
              producto={producto}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ))
        )}
      </div>

      <Paginator
        currentPage={paginaActual}
        totalPages={totalPaginas}
        onPageChange={(nuevaPagina) => {
          if (nuevaPagina !== paginaActual) {
            setPaginaActual(nuevaPagina)
          }
        }}
      />

      {/* Modales */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}

      {showUpdateModal && productoSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          productoCarta={productoSeleccionado}
        />
      )}
    </div>
  )
}

export default ProductsBack
