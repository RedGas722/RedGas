import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { DeleteModal } from './Delete/Delete'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardTechniciansBack from './Get/CardTechniciansBack'
import { buscarTecnicoPorCorreo } from './Get/Get'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const TechniciansBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
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
      if (!res.ok) throw new Error('Error al obtener tecnicos')
      const data = await res.json()
      const resultado = data.data

      setTecnicos(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTecnicos(paginaActual)
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchTecnicos(1)
      setPaginaActual(1)
      setRefrescar(false)
      setTecnicoBuscado(null)
      setCorreoBusqueda('')
      setErrorBusqueda('')
    }
  }, [refrescar])

  const handleUpdateClick = (tecnico) => setShowUpdateModal(tecnico)
  const handleDeleteClick = (tecnico) => setShowDeleteModal(tecnico)

  // 🔍 Buscar técnico en la base de datos
  const buscarTecnico = async () => {
    setErrorBusqueda('')
    setTecnicoBuscado(null)

    try {
      const resultado = await buscarTecnicoPorCorreo(correoBusqueda.trim())
      if (resultado.length > 0) {
        setTecnicoBuscado(resultado[0])
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró un técnico con ese correo.')
      }
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  // Autocompletado local
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])  // Limpiar las sugerencias si el campo está vacío
      setTecnicoBuscado(null)  // No mostrar un técnico específico
      return
    }

    const filtrados = tecnicos.filter(tecnico =>
      tecnico.correo_tecnico?.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, tecnicos])

  // Cerrar sugerencias si se hace clic fuera
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
    <div className="p-[20px] h-full flex flex-col gap-[20px]">
      <div className='NeoContainer_outset_TL flex flex-col w-fit p-[0_0_0_20px]'>
        <h1 className="font-bold text-[20px] text-[var(--main-color)]">Técnicos</h1>

        {/* 🔍 Búsqueda con botón */}
        <div className="relative flex items-center" ref={contenedorRef}>
          <InputLabel
            type="1"
            ForID="correo_tecnico_busqueda"
            placeholder="Buscar técnico"
            childLabel="Buscar técnico"
            value={correoBusqueda}
            onChange={e => setCorreoBusqueda(e.target.value)}
            className="w-full pr-10"
          />
          <button
            onClick={buscarTecnico}
            className="absolute right-2 text-gray-600 hover:text-gray-800"
            title="Buscar técnico"
          >
            🔍
          </button>

          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((tecnico) => (
                <li
                  key={tecnico.id_tecnico || tecnico.correo_tecnico}
                  onClick={() => {
                    setCorreoBusqueda(tecnico.correo_tecnico)
                    setTecnicoBuscado(tecnico)
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

        {/* Mensaje de error */}
        {errorBusqueda && (
          <p className="text-red-600 text-sm mt-1">{errorBusqueda}</p>
        )}

        <div className="flex p-[20px] w-fit h-fit flex-wrap justify-center justify-self-center items-center gap-[20px]">
          <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
        </div>
      </div>

      {/* 📦 Cards de técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tecnicoBuscado ? (
          <CardTechniciansBack
            key={tecnicoBuscado.id_tecnico}
            tecnico={tecnicoBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={handleUpdateClick}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          tecnicos.map(tecnico => (
            <CardTechniciansBack
              key={tecnico.id_tecnico || tecnico.correo_tecnico}
              tecnico={tecnico}
              setRefrescar={setRefrescar}
              onUpdateClick={handleUpdateClick}
              onDeleteClick={handleDeleteClick}
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
      {typeof showUpdateModal === 'object' && showUpdateModal && (
        <UpdateModal
          onClose={() => setShowUpdateModal(false)}
          setRefrescar={setRefrescar}
          tecnicoCarta={showUpdateModal}
        />
      )}
    </div>
  )
}

export default TechniciansBack
