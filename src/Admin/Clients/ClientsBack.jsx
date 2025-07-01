import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RegisterModal } from './Register/RegisterModal';
import { UpdateModal } from './Update/Update';
import CardClientsBack from './Get/CardClientsBack';
import { buscarClientePorCorreo } from './Get/Get';
import { BtnBack } from "../../UI/Login_Register/BtnBack";
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { Buttons } from '../../UI/Login_Register/Buttons';
import Paginator from '../../UI/Paginator/Paginator';

export const ClientsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [clientes, setClientes] = useState([])
  const [clientesEmails, setClientesEmails] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [clienteBuscado, setClienteBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const contenedorRef = useRef(null)

  const fetchClientes = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/ClienteGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener clientes')
      const data = await res.json()
      const resultado = data.data

      setClientes(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchClientesEmails = async () => {
    try {
      const res = await fetch(`https://redgas.onrender.com/ClienteGetAllEmails`)
      if (!res.ok) throw new Error('Error al obtener correos de clientes')
      const data = await res.json()
      setClientesEmails(data.data || []) 
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchClientes(paginaActual)
    fetchClientesEmails()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchClientes(1)
      fetchClientesEmails()
      setPaginaActual(1)
      setRefrescar(false)
      setClienteBuscado(null)
      setErrorBusqueda('')
      setCorreoBusqueda('')
    }
  }, [refrescar])

  const abrirModalActualizar = (cliente) => {
    setClienteSeleccionado(cliente)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setShowUpdateModal(false)
    setClienteSeleccionado(null)
  }

  const buscarCliente = async (correo) => {
  setErrorBusqueda('')
  setClienteBuscado(null)

  const correoFinal = (correo || correoBusqueda).trim()
    if (!correoFinal) {
      setErrorBusqueda('Por favor ingrese un correo válido')
      return
    }

    try {
      const resultado = await buscarClientePorCorreo(correoFinal)
      setClienteBuscado(resultado)
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message || 'No se encontró el cliente')
    }
  }

  useEffect(() => {
    if ((correoBusqueda || '').trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = clientesEmails.filter((cliente) =>
      (cliente.correo_cliente || '').toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, clientesEmails])

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

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setClienteBuscado(null)
      setErrorBusqueda('')
    }
  }, [correoBusqueda])

  return (
    <section className="w-full h-full flex flex-col p-[5px_20px_10px_5px]">
      <BtnBack To='/Admin' />
      <div className="p-[10px_20px_10px_20px] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Cliente BACK-OFFICE</h1>
        <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[0_20px_10px_20px]'>
          <div ref={contenedorRef} className="relative">
            <InputLabel
              radius='10'
              type="1"
              ForID="correo_cliente_busqueda"
              placeholder="Buscar cliente"
              childLabel="Buscar cliente"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full pr-8" // espacio para la lupa
              placeholderError={!!errorBusqueda}
            />
            
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border w-[230px] border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow">
                {sugerencias.map((cliente) => (
                  <li
                    key={cliente.id_cliente}
                    onClick={() => {
                      setCorreoBusqueda(cliente.correo_cliente);
                      buscarCliente(cliente.correo_cliente); // Pasar correo directamente
                      setSugerencias([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {cliente.correo_cliente}
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
              onClick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clienteBuscado ? (
            <CardClientsBack
              key={clienteBuscado.id_cliente}
              cliente={clienteBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={abrirModalActualizar}
            />
          ) : (
            clientes.map((cliente) => (
              <CardClientsBack
                key={cliente.id_cliente}
                cliente={cliente}
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

        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            setRefrescar={setRefrescar}
          />
        )}

        {showUpdateModal && clienteSeleccionado && (
          <UpdateModal
            onClose={cerrarModal}
            setRefrescar={setRefrescar}
            clienteCarta={clienteSeleccionado}
          />
        )}
      </div>
    </section>
  );
};

export default ClientsBack
