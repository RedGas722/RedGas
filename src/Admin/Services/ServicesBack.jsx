import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { BtnBack } from '../../UI/Login_Register/BtnBack'
import CardServicesGetBack from './Get/CardServicesBack'
import { buscarServicioPorNombre } from './Get/Get'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Buttons } from '../../UI/Login_Register/Buttons'
import { Paginator } from '../../UI/Paginator/Paginator'

export const ServicesBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [servicios, setServicios] = useState([])
  const [serviciosNombres, setServiciosNombres] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [servicioBuscado, setServicioBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
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

  const handleUpdateClick = (servicio) => setShowUpdateModal(servicio)

  const buscarServicio = async (nombre) => {
    setErrorBusqueda('')
    setServicioBuscado(null)

    if (!nombre.trim()) {
      fetchServicios(1)
      setPaginaActual(1)
      return
    }

    try {
      const resultado = await buscarServicioPorNombre(nombre.trim())
      if (resultado.length > 0) {
        setServicioBuscado(resultado[0])
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró ningún servicio con ese nombre.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar servicio.')
    }
  }

  useEffect(() => {
    if (nombreBusqueda.trim() === '') {
      setSugerencias([])
      setServicioBuscado(null)
      return
    }

    const filtrados = serviciosNombres.filter(serv =>
      serv.nombre_servicio?.toLowerCase().includes(nombreBusqueda.toLowerCase())
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

  return (
    <section className="w-full h-full p-[var(--p-admin)]">
      <BtnBack To='/Admin' />

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-4">
        <h1 className="font-bold z-[2] text-3xl text-[var(--main-color)]">Servicios</h1>

        <div className="NeoContainer_outset_TL z-[2] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]">
          <div className="relative" ref={contenedorRef}>
            <InputLabel
              radius="10"
              type="1"
              ForID="nombre_servicio_busqueda"
              placeholder="Buscar servicio"
              childLabel="Buscar servicio"
              value={nombreBusqueda}
              onChange={e => setNombreBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border w-[230px] border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow">
                {sugerencias.map(servicio => (
                  <li
                    key={servicio.id_servicio}
                    onClick={() => {
                      setNombreBusqueda(servicio.nombre_servicio)
                      buscarServicio(servicio.nombre_servicio)
                      setSugerencias([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer z-50"
                  >
                    {servicio.nombre_servicio}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius="10"
              nameButton="Registrar"
              textColor="var(--Font-Nav)"
              Onclick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

        <div className="flex flex-wrap items-center gap-6">
          {(servicioBuscado ? [servicioBuscado] : servicios).map(servicio => (
            <CardServicesGetBack
              key={servicio.id_servicio}
              servicio={servicio}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
              onDeleteClick={() => {}}
            />
          ))}
        </div>

        <Paginator
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={nuevaPagina => {
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
    </section>
  )
}

export default ServicesBack
