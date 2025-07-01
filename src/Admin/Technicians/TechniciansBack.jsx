import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { Paginator } from '../../UI/Paginator/Paginator'
import CardTechniciansBack from './Get/CardTechniciansBack'
import { buscarTecnicoPorCorreo } from './Get/Get'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Buttons } from '../../UI/Login_Register/Buttons'
import BtnBack from '../../UI/Login_Register/BtnBack'

export const TechniciansBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
  const [tecnicosEmails, setTecnicosEmails] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [correoBusqueda, setCorreoBusqueda] = useState("")
  const [tecnicoBuscado, setTecnicoBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState("")
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const contenedorRef = useRef(null)

  const fetchTecnicos = async (pagina = 1) => {
    try {
      const res = await fetch(`https://redgas.onrender.com/TecnicoGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener técnicos')
      const data = await res.json()
      const resultado = data.data

      setTecnicos(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCorreosTecnicos = async () => {
    try {
      const res = await fetch(`https://redgas.onrender.com/TecnicoGetAllEmails`)
      if (!res.ok) throw new Error('Error al obtener correos de técnicos')
      const data = await res.json()
      setTecnicosEmails(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTecnicos(paginaActual)
    fetchCorreosTecnicos()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchTecnicos(1)
      fetchCorreosTecnicos()
      setPaginaActual(1)
      setRefrescar(false)
      setTecnicoBuscado(null)
      setCorreoBusqueda('')
      setErrorBusqueda('')
    }
  }, [refrescar])

  const handleUpdateClick = (tecnico) => setShowUpdateModal(tecnico)

  // 🔍 Buscar técnico en la base de datos
  const buscarTecnico = async (correo) => {
    setErrorBusqueda('')
    setTecnicoBuscado(null)

    const correoFinal = (correo || correoBusqueda).trim()
      if (!correoFinal) {
        setErrorBusqueda('Por favor ingrese un correo válido')
        return
      }

      try {
        const resultado = await buscarTecnicoPorCorreo(correoFinal)
        setTecnicoBuscado(resultado)
        setSugerencias([])
      } catch (error) {
        setErrorBusqueda(error.message || 'No se encontró el tecnico')
      }
  }

  // Autocompletado desde los correos obtenidos
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      setTecnicoBuscado(null)
      return
    }

    const filtrados = tecnicosEmails.filter(tecnico =>
      tecnico.correo_tecnico?.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, tecnicosEmails])

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
    <section className="w-full h-full p-[5px_20px_10px_5px]">
      <BtnBack To='/Admin' />
      
      <div className="p-[10px_20px_10px_20px] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-[var(--main-color)]">Técnicos</h1>
        
        <div className='flex flex-col gap-2'>
          
          <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[0_20px_10px_20px]'>
            
            <div ref={contenedorRef}>
              <InputLabel
                radius='10'
                type="1"
                ForID="correo_tecnico_busqueda"
                placeholder="Buscar técnico"
                childLabel="Buscar técnico"
                value={correoBusqueda}
                onChange={e => setCorreoBusqueda(e.target.value)}
                className="w-full"
                placeholderError={!!errorBusqueda}
              />
              {sugerencias.length > 0 && (
                <ul className="absolute z-10 bg-white border w-[230px] border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow">
                  {sugerencias.map((tecnico) => (
                    <li
                      key={tecnico.id_tecnico || tecnico.correo_tecnico}
                      onClick={() => {
                        setCorreoBusqueda(tecnico.correo_tecnico)
                        buscarTecnico(tecnico.correo_tecnico)
                        setSugerencias([])
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {tecnico.correo_tecnico}
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
          {/* Sección de técnicos */}
          <div className="flex flex-wrap items-center gap-6">
            {(tecnicoBuscado || tecnicos).map(tecnico => (
              <CardTechniciansBack
                key={tecnico.id_tecnico || tecnico.correo_tecnico}
                tecnico={tecnico}
                setRefrescar={setRefrescar}
                onUpdateClick={handleUpdateClick}
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

          {/* Modales */}
          {showRegisterModal && (
            <RegisterModal
              onClose={() => setShowRegisterModal(false)}
              setRefrescar={setRefrescar}
            />
          )}
          {typeof showUpdateModal === 'object' && showUpdateModal && (
            <UpdateModal
              onClose={() => setShowUpdateModal(false)}
              setRefrescar={setRefrescar}
              tecnicoCarta={showUpdateModal}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default TechniciansBack
