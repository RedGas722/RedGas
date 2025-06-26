import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { buscarServicioPorNombre } from './Get/Get'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardServicesGetBack from './Get/CardServicesGetBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const ServicesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [servicios, setServicios] = useState([])
  const [servicioBuscado, setServicioBuscado] = useState(null)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [refrescar, setRefrescar] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [serviciosNombres, setServiciosNombres] = useState([])
  const contenedorRef = useRef(null)

  const fetchServicios = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/ServicioGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener servicios')
      const data = await res.json()
      const resultado = data.data

      setServicios(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchServiciosNombres = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/ServicioGetAllNames')
      if (!res.ok) throw new Error('Error al obtener nombres de servicios')
      const data = await res.json()
      setServiciosNombres(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServicios(paginaActual)
    fetchServiciosNombres()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchServicios(1)
      fetchServiciosNombres()
      setPaginaActual(1)
      setRefrescar(false)
      setServicioBuscado(null)
      setNombreBusqueda('')
      setErrorBusqueda('')
    }
  }, [refrescar])

  const buscarServicio = async () => {
    setErrorBusqueda('')
    setServicioBuscado(null)

    try {
      const resultado = await buscarServicioPorNombre(nombreBusqueda)
      if (resultado.length === 0) {
        throw new Error('No se encontró ningún servicio con ese nombre.')
      }
      setServicioBuscado(resultado[0]) // Suponiendo que devuelve array
      setSugerencias([])
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = serviciosNombres.filter((serv) =>
      (serv.nombre_servicio || '').toLowerCase().includes(nombreBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [nombreBusqueda, serviciosNombres])

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([])
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setServicioBuscado(null)
      setErrorBusqueda('')
    }
  }, [nombreBusqueda])

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px]">
        <div className='flex-col'>
          <h1 className="font-bold text-[20px]">Servicio BACK-OFFICE</h1>
          <div className='btnDown'>
            <BtnBack To='/Admin' />
          </div>
        </div>

        {/* Buscador */}
        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <InputLabel
              type="1"
              ForID="nombre_servicio_busqueda"
              placeholder="Buscar servicio"
              childLabel="Buscar servicio"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full"
            />
            <button
              onClick={buscarServicio}
              aria-label="Buscar servicio"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((servicio) => (
                <li
                  key={servicio.id_servicio}
                  onClick={() => {
                    setNombreBusqueda(servicio.nombre_servicio)
                    setSugerencias([])
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {servicio.nombre_servicio}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicioBuscado
          ? (
            <CardServicesGetBack
              key={servicioBuscado.id_servicio}
              servicio={servicioBuscado}
              setRefrescar={setRefrescar}
              onUpdateClick={(s) => setShowUpdateModal(s)}
              onDeleteClick={() => {}} // Puedes añadir lógica si tienes modal de eliminación
            />
          )
          : servicios.map((servicio) => (
            <CardServicesGetBack
              key={servicio.id_servicio}
              servicio={servicio}
              setRefrescar={setRefrescar}
              onUpdateClick={(s) => setShowUpdateModal(s)}
              onDeleteClick={() => {}}
            />
          ))
        }
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
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}
      {typeof showUpdateModal === 'object' && showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={setRefrescar}
          servicioCarta={showUpdateModal}
        />
      )}
    </div>
  )
}

export default ServicesBack
