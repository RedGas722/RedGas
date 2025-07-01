import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { ButtonBack } from '../UI/ButtonBack/ButtonBack'
import { DeleteModal } from './Delete/Delete'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import CardTechniciansBack from './Get/CardTechniciansBack'
import { buscarTecnicoPorCorreo } from './Get/Get'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Backdrop, CircularProgress } from '@mui/material';
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const TechniciansBack = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  const buscarTecnico = async () => {
    setErrorBusqueda('')
    setTecnicoBuscado(null)
    if (!correoBusqueda.trim()) {
      fetchTecnicos(1)
      setPaginaActual(1)
      return
    }
    try {
      const resultado = await buscarTecnicoPorCorreo(correoBusqueda.trim())
      if (resultado.length > 0) {
        setTecnicoBuscado(resultado[0])
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró un técnico con ese correo.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar técnico.')
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

  // Para eliminar un técnico desde la tarjeta
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const handleDeleteClick = (tecnico) => {
    setShowDeleteModal(tecnico)
  }

  return (
    <>
      <section className="w-full h-full p-[var(--p-admin)]">
        <BtnBack To='/Admin' />

        <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-[var(--main-color)]">Técnicos</h1>

          <div className='NeoContainer_outset_TL flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>

            <div className='relative' ref={contenedorRef}>
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
                        setCorreoBusqueda(tecnico.correo_tecnico);
                        setSugerencias([]);
                        setTecnicos([tecnico]);
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
            {tecnicos.map(tecnico => (
              <CardTechniciansBack
                key={tecnico.id_tecnico || tecnico.correo_tecnico}
                tecnico={tecnico}
                setRefrescar={setRefrescar}
                onUpdateClick={handleUpdateClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
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
          {typeof showDeleteModal === 'object' && showDeleteModal && (
            <DeleteModal
              onClose={() => setShowDeleteModal(false)}
              setRefrescar={setRefrescar}
              tecnicoCarta={showDeleteModal}
            />
          )}
        </div>
      </section>
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
            />
          ) : (
            tecnicos.map(tecnico => (
              <CardTechniciansBack
                key={tecnico.id_tecnico || tecnico.correo_tecnico}
                tecnico={tecnico}
                setRefrescar={setRefrescar}
                onUpdateClick={handleUpdateClick}
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
    </>
  )
}
export default TechniciansBack
