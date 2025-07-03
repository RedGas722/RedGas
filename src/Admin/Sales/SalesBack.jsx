import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { useBuscarSales } from './Get/Get'
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'
import CardSalesBack from './Get/CardSalesBack'

export const SalesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [ventas, setVentas] = useState([])
  const [ventasOriginal, setVentasOriginal] = useState([])
  const [productos, setProductos] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const {
    productoBusqueda, productoSugerencias,
    handleProductoInput, handleBuscar,
    contenedorRefProducto, setProductoBusqueda
  } = useBuscarSales(productos, ventasOriginal, setVentas)

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
      setProductoBusqueda('')
    }
  }, [refrescar])

  useEffect(() => {
    if (productoBusqueda.trim() === '') {
      setVentas(ventasOriginal)
    }
  }, [productoBusqueda, ventasOriginal, setVentas])


  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl z-[2] text-[var(--main-color)]">Ventas</h1>

        <div className='NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
          <div className="relative" ref={contenedorRefProducto}>
            <InputLabel
              radius="10"
              type="1"
              ForID="buscar_producto"
              placeholder="Buscar por producto"
              childLabel="Buscar por producto"
              value={productoBusqueda}
              onChange={(e) => handleProductoInput(e.target.value)}
              className="w-full"
            />
            {productoSugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {productoSugerencias.map((prod) => (
                  <li
                    key={prod.id_producto}
                    onClick={() => {
                      setProductoBusqueda(prod.nombre_producto)
                      handleBuscar(prod.nombre_producto)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer z-50"
                  >
                    {prod.nombre_producto}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius='10'
              nameButton='Registrar'
              textColor='var(--Font-Nav)'
              Onclick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="flex flex-wrap items-center gap-6">
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

        {/* Modal de registro */}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
          />
        )}
      </div>
    </section>
  )
}

export default SalesBack
