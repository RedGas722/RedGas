import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { Buttons } from '../../UI/Login_Register/Buttons'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { buscarProductoPorNombre } from './Get/Get'
import CardsProductsBack from './Get/CardProductsBack'
import { Backdrop, CircularProgress } from '@mui/material';
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const ProductsBack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [productos, setProductos] = useState([])
  const [productosNombres, setProductosNombres] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [productoBuscado, setProductoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])

  const contenedorRef = useRef(null)

  const URL_ALL = 'https://redgas.onrender.com/ProductoGetAllPaginated'
  const URL_NAMES = 'https://redgas.onrender.com/ProductoGetAllNames'

  async function fetchProductos(pagina = 1) {
    setIsLoading(true);
    try {
      const res = await fetch(`${URL_ALL}?page=${pagina}`);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      const resultado = data.data.resultado;

      setProductos(resultado.data || []);
      setPaginaActual(resultado.currentPage);
      setTotalPaginas(resultado.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchNombresProductos() {
    try {
      const res = await fetch(URL_NAMES)
      if (!res.ok) throw new Error('Error al obtener nombres de productos')
      const data = await res.json()
      setProductosNombres(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProductos(paginaActual)
    fetchNombresProductos()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchProductos(1)
      fetchNombresProductos()
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

  const buscarProducto = async (correo) => {
    setErrorBusqueda('')
    setProductoBuscado(null)
    try {
      const resultado = await buscarProductoPorNombre(correo)
      setProductoBuscado(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  // Autocomplete con nombres desde API
  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = productosNombres.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(nombreBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [nombreBusqueda, productosNombres])

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setProductoBuscado(null);
      setErrorBusqueda(''); 
    }
  }, [nombreBusqueda]);

  // Cierre de dropdown si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setSugerencias([])
      }
    }
    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />
      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold z-[2] text-3xl text-[var(--main-color)]">Productos</h1>
        <div className='NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>

          <div className='relative flex' ref={contenedorRef}>
            <InputLabel
              radius='10'
              type="1"
              ForID="nombre_producto_busqueda"
              placeholder="Buscar producto"
              childLabel="Buscar producto"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full "
              placeholderError={!!errorBusqueda}
            />

            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
                {sugerencias.map((producto) => (
                  <li
                    key={producto.id_producto}
                    onClick={() => {
                      setNombreBusqueda(producto.nombre_producto)
                      buscarProducto(producto.nombre_producto)
                      setSugerencias([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer z-50"
                  >
                    {producto.nombre_producto}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex w-fit h-fit flex-wrap justify-center justify-self-center items-center gap-[20px]">
            <Buttons radius='10' nameButton='Registrar' textColor='var(--Font-Nav)' Onclick={() => setShowRegisterModal(true)} />
            {/* Eliminar, Actualizar y Consultar removidos porque ya están en la card y el input de consulta ya existe */}
          </div>
        </div>

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

        {mensaje && (
          <div className="mt-2 text-sm text-center text-green-600 font-semibold">
            {mensaje}
          </div>
        )}

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
              setPaginaActual(nuevaPagina);
            }
          }}
          disabled={isLoading} 
        />

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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </section >
  )
}

export default ProductsBack
