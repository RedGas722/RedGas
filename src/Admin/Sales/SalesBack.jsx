import { useState, useEffect } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardSalesBack from './Get/CardSalesBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { useBuscarSales } from './Get/Get'
import { Paginator } from '../../UI/Paginator/Paginator'

export const SalesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [ventas, setVentas] = useState([])
  const [ventasOriginal, setVentasOriginal] = useState([])
  const [productos, setProductos] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const fetchVentas = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/PedidoProductoGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener ventas')
      const data = await res.json()
      const resultado = data.data

      setVentas(resultado.data || [])
      setVentasOriginal(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProductos = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ProductoGetAllNames')
      const data = await res.json()
      setProductos(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error al obtener nombres de productos', error)
    }
  }

  const {
    productoBusqueda, productoSugerencias,
    handleProductoInput, handleBuscar, handleLimpiar,
    contenedorRefProducto, setProductoBusqueda
  } = useBuscarSales(productos, ventasOriginal, setVentas)

  useEffect(() => {
    fetchVentas(paginaActual)
    fetchProductos()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchVentas(1)
      fetchProductos()
      setPaginaActual(1)
      setRefrescar(false)
      handleLimpiar()
    }
  }, [refrescar])

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Ventas BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>

        <div className="relative" ref={contenedorRefProducto}>
          <InputLabel
            type="1"
            ForID="buscar_producto"
            placeholder="Buscar por producto"
            childLabel="Buscar por producto"
            value={productoBusqueda}
            onChange={(e) => handleProductoInput(e.target.value)}
            placeholderError={!!errorBusquedaProducto}
          />
          {productoSugerencias.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 shadow w-full">
              {productoSugerencias.map(prod => (
                <div
                  key={prod.id_producto}
                  onClick={() => setProductoBusqueda(prod.nombre_producto)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {prod.nombre_producto}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleBuscar} className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
        <button onClick={handleLimpiar} className="bg-gray-300 px-4 py-2 rounded">
          Limpiar
        </button>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ventas.map((venta) => (
          <CardSalesBack
            key={venta.id_pedidoProducto}
            venta={venta}
            productos={productos}
          />
        ))}
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

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setRefrescar={setRefrescar}
        />
      )}
    </div>
  )
}

export default SalesBack
