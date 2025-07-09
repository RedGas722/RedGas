import { useState, useEffect, useRef } from 'react'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { useBuscarServices } from './Get/Get'
import { Paginator } from '../../UI/Paginator/Paginator'
import { Backdrop, CircularProgress } from '@mui/material';
import CardServicesBack from './Get/CardsServicesBack'
import { Buttons } from '../../UI/Login_Register/Buttons'
// import { RegisterModal } from './Register/RegisterModal'

export const ServicesCompletedBack = () => {
  // const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [servicios, setServicios] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [serviciosOriginal, setServiciosOriginal] = useState([])
  const [clientes, setClientes] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const {
    clienteBusqueda, clienteSugerencias,
    handleClienteInput, handleBuscar,
    contenedorRefCliente, setClienteBusqueda
  } = useBuscarServices(clientes, serviciosOriginal, setServicios)

  const fetchServicios = async (pagina = 1) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://redgas.onrender.com/PedidoServicioGetAll?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener servicios')
      const data = await res.json()
      const resultado = data.data
      setServicios(resultado || [])
      setServiciosOriginal(resultado || [])
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
      setClientes(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error al obtener correos de clientes', error)
    }
  }

  useEffect(() => {
    fetchServicios(paginaActual)
    fetchClientes()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchServicios(1)
      fetchClientes()
      setPaginaActual(1)
      setRefrescar(false)
      setClienteBusqueda('')
    }
  }, [refrescar])

  useEffect(() => {
    if (clienteBusqueda.trim() === '') {
      setServicios(serviciosOriginal)
    }
  }, [clienteBusqueda, serviciosOriginal, setServicios])

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl z-[2] text-[var(--main-color)]">Servicios Completados</h1>

        <div className='NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
          <div className="relative" ref={contenedorRefCliente}>
            <InputLabel
              radius="10"
              type="1"
              ForID="buscar_cliente"
              placeholder="Buscar por correo"
              childLabel="Buscar por correo"
              value={clienteBusqueda}
              onChange={(e) => handleClienteInput(e.target.value)}
              className="w-full"
            />
            {clienteSugerencias.length > 0 && (
              <ul className="absolute z-[10] bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {clienteSugerencias.map((cliente) => (
                  <li
                    key={cliente.id_cliente}
                    onClick={() => {
                      setClienteBusqueda(cliente.correo_cliente)
                      handleBuscar(cliente.correo_cliente)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cliente.correo_cliente}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius='10'
              nameButton='Registrar'
              textColor='var(--Font-Nav)'
              Onclick={() => setShowRegisterModal(true)}
            />
          </div> */}
        </div>

        {/* Lista de servicios */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {servicios.map((servicio) => (
            <CardServicesBack
              key={servicio.id_pedidoServicio}
              servicio={servicio}
              clientes={clientes}
            />
          ))}
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

        {/* Modal de registro */}
        {/* {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
          />
        )} */}
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

export default ServicesCompletedBack
