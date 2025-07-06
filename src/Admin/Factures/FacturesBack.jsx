import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ProductsModal } from './Get/ProductsModal'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'
import { Backdrop, CircularProgress } from '@mui/material';
import CardsFacturesBack from './Get/CardFacturesBack'
import { useBuscarFacturas } from './Get/Get'

export const FacturesBack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(null)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [facturaParaProductos, setFacturaParaProductos] = useState(null)
  const [facturas, setFacturas] = useState([])
  const [facturasOriginal, setFacturasOriginal] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [refrescar, setRefrescar] = useState(false)
  const [mostrarSugerenciasCliente, setMostrarSugerenciasCliente] = useState(false)
  const [mostrarSugerenciasEmpleado, setMostrarSugerenciasEmpleado] = useState(false)
  const contenedorRefCliente = useRef(null)
  const contenedorRefEmpleado = useRef(null)

  const {
    clienteCorreoBusqueda, empleadoBusqueda,
    clienteSugerencias, empleadoSugerencias,
    handleClienteInput, handleEmpleadoInput,
    handleBuscar, handleLimpiar,
    setClienteCorreoBusqueda, setEmpleadoBusqueda
  } = useBuscarFacturas(clientes, empleados, facturasOriginal, setFacturas, fetchFacturas)

  async function fetchFacturas(pagina = 1) {
    setIsLoading(true)
    try {
      const res = await fetch(`https://redgas.onrender.com/FacturaGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener facturas')
      const data = await res.json()
      const resultado = data.data

      setFacturas(resultado.data || [])
      setFacturasOriginal(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }finally {
      setIsLoading(false);
    }
  }

  const fetchClientes = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ClienteGetAllEmails')
      const data = await res.json()
      setClientes(data.data || [])
    } catch (error) {
      console.error('Error al obtener clientes', error)
    }
  }

  const fetchEmpleados = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/EmpleadoGetAllEmails')
      const data = await res.json()
      setEmpleados(data.data || [])
    } catch (error) {
      console.error('Error al obtener empleados', error)
    }
  }

  useEffect(() => {
    fetchFacturas(paginaActual)
    fetchClientes()
    fetchEmpleados()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchFacturas(1)
      fetchClientes()
      fetchEmpleados()
      setPaginaActual(1)
      setRefrescar(false)
      handleLimpiar()
    }
  }, [refrescar])

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (
        contenedorRefCliente.current && !contenedorRefCliente.current.contains(e.target)
      ) {
        setMostrarSugerenciasCliente(false)
      }

      if (
        contenedorRefEmpleado.current && !contenedorRefEmpleado.current.contains(e.target)
      ) {
        setMostrarSugerenciasEmpleado(false)
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])


  const abrirModalActualizar = (factura) => setShowUpdateModal(factura)
  const cerrarModalActualizar = () => setShowUpdateModal(null)

  const abrirModalProductos = (factura) => {
    setFacturaParaProductos(factura)
    setShowProductsModal(true)
  }

  const cerrarModalProductos = () => {
    setFacturaParaProductos(null)
    setShowProductsModal(false)
  }

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To="/Admin" />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold z-[2] text-3xl text-[var(--main-color)]">Facturas</h1>
        <div className="NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]">
          {/* Cliente */}
          <div ref={contenedorRefCliente}>
            <InputLabel
              radius="10"
              type="1"
              ForID="clienteBusqueda"
              placeholder="Buscar por cliente"
              childLabel="Buscar por cliente"
              value={clienteCorreoBusqueda}
              onChange={(e) => {
                handleClienteInput(e.target.value)
                setMostrarSugerenciasCliente(true)
              }}
            />
            {mostrarSugerenciasCliente && clienteSugerencias.length > 0 && (
              <div className="absolute z-[10] bg-white border border-gray-300 rounded mt-1 shadow w-full">
                {clienteSugerencias.map(cliente => (
                  <div
                    key={cliente.id_cliente}
                    onClick={() => {
                      setClienteCorreoBusqueda(cliente.correo_cliente)
                      setMostrarSugerenciasCliente(false)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cliente.nombre_cliente} - {cliente.correo_cliente}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Empleado */}
          <div className="relative" ref={contenedorRefEmpleado}>
            <InputLabel
              radius="10"
              type="1"
              ForID="empleadoBusqueda"
              placeholder="Buscar por empleado"
              childLabel="Buscar por empleado"
              value={empleadoBusqueda}
              onChange={(e) => {
                handleEmpleadoInput(e.target.value)
                setMostrarSugerenciasEmpleado(true)
              }}
            />
            {mostrarSugerenciasEmpleado && empleadoSugerencias.length > 0 && (
              <div className="absolute z-[10] bg-white border border-gray-300 rounded mt-1 shadow w-full">
                {empleadoSugerencias.map(empleado => (
                  <div
                    key={empleado.id_empleado}
                    onClick={() => {
                      setEmpleadoBusqueda(empleado.correo_empleado)
                      setMostrarSugerenciasEmpleado(false)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {empleado.nombre_empleado} - {empleado.correo_empleado}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Buttons nameButton="Buscar" radius="10" Onclick={handleBuscar} />
          <Buttons nameButton="Limpiar" radius="10" Onclick={handleLimpiar} />
          <Buttons nameButton="Registrar" radius="10" Onclick={() => setShowRegisterModal(true)} />
        </div>

        {/* Lista de facturas */}
        <div className="flex flex-wrap items-center gap-6">
          {facturas.map(factura => (
            <CardsFacturesBack
              key={factura.id_factura}
              factura={factura}
              clientes={clientes}
              empleados={empleados}
              onUpdateClick={abrirModalActualizar}
              onViewProductsClick={abrirModalProductos}
            />
          ))}
        </div>

        {/* Paginador */}
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

        {/* Modales */}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
            clientes={clientes}
            empleados={empleados}
          />
        )}
        {showUpdateModal && (
          <UpdateModal
            onClose={cerrarModalActualizar}
            setRefrescar={setRefrescar}
            facturaCarta={showUpdateModal}
          />
        )}
        {showProductsModal && facturaParaProductos && (
          <ProductsModal factura={facturaParaProductos} onClose={cerrarModalProductos} />
        )}
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  )
}

export default FacturesBack
