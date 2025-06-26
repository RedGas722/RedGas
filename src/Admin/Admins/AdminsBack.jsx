import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { buscarAdminPorCorreo } from './Get/Get'
import { UpdateModal } from './Update/Update'
import CardAdminsBack from './Get/CardAdminsBack'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import ButtonBack from '../UI/ButtonBack/ButtonBack'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import { Paginator } from '../../UI/Paginator/Paginator'

export const AdminsBack = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [admins, setAdmins] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [adminSeleccionado, setAdminSeleccionado] = useState(null)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [adminBuscado, setAdminBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const contenedorRef = useRef(null)
  const inputRef = useRef(null)

  const URL = 'https://redgas.onrender.com/AdminGet'

  async function fetchAdmins(pagina = 1) {
    try {
      const res = await fetch(`https://redgas.onrender.com/AdminGetAllPaginated?page=${pagina}`)
      if (!res.ok) throw new Error('Error al obtener administradores')
      const data = await res.json()
      const resultado = data.data

      setAdmins(resultado.data || [])
      setPaginaActual(resultado.currentPage)
      setTotalPaginas(resultado.totalPages)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAdmins(paginaActual)
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchAdmins(1) // Reiniciar a la página 1
      setPaginaActual(1)
      setRefrescar(false)
      setAdminBuscado(null)
      setErrorBusqueda('')
      setCorreoBusqueda('')
    }
  }, [refrescar])

  const abrirModalActualizar = (admin) => {
    setAdminSeleccionado(admin)
    setShowUpdateModal(true)
  }

  const cerrarModal = () => {
    setShowUpdateModal(false)
    setAdminSeleccionado(null)
  }

  const buscarAdmin = async () => {
    setErrorBusqueda('')
    setAdminBuscado(null)
    try {
      const admin = await buscarAdminPorCorreo(correoBusqueda)
      setAdminBuscado(admin)
    } catch (error) {
      setErrorBusqueda(error.message)
    }
  }

  // 🧠 Autocomplete filtrando productos localmente
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      return
    }

    const filtrados = admins.filter((admin) =>
      admin.correo_admin.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, admins])

  // 🧽 Cierre del dropdown si se hace clic fuera
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

  // Limpia adminBuscado y errorBusqueda si el input queda vacío
  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setAdminBuscado(null)
      setErrorBusqueda('')
    }
  }, [correoBusqueda])

  // Mueve el input y el botón dentro del contenedorRef para que el click fuera funcione correctamente
  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[20px] flex-wrap">
        <div>
          <h1 className="font-bold text-[20px]">Admin BACK-OFFICE</h1>
          <BtnBack To='/Admin' className='btnDown' />
        </div>

        <div className="relative" ref={contenedorRef}>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
            <InputLabel
              type="1"
              ForID="correo_admin_busqueda"
              placeholder="Correo del administrador"
              childLabel="Correo"
              value={correoBusqueda}
              onChange={(e) => setCorreoBusqueda(e.target.value)}
              className="outline-none"
              ref={inputRef}
            />
            <button
              onClick={buscarAdmin}
              aria-label="Buscar admin"
              className="text-gray-600 hover:text-gray-900"
            >
              🔍
            </button>
          </div>
          {sugerencias.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto w-full shadow">
              {sugerencias.map((admin) => (
                <li
                  key={admin.id_admin}
                  onClick={() => {
                    setAdminBuscado(admin)
                    setCorreoBusqueda(admin.correo_admin)
                    setSugerencias([])
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {admin.correo_admin}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Aquí agregamos el botón para abrir el modal Registrar */}
        <ButtonBack ClickMod={() => setShowRegisterModal(true)} Child="Registrar" />
      </div>

      {/* resto del código igual */}
      {errorBusqueda && <p className="text-red-600 text-sm">{errorBusqueda}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminBuscado ? (
          <CardAdminsBack
            key={adminBuscado.id_admin}
            admin={adminBuscado}
            setRefrescar={setRefrescar}
            onUpdateClick={abrirModalActualizar}
          />
        ) : (
          admins.map((admin) => (
            <CardAdminsBack
              key={admin.id_admin}
              admin={admin}
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
        <RegisterModal onClose={() => setShowRegisterModal(false)} setRefrescar={setRefrescar} />
      )}

      {showUpdateModal && adminSeleccionado && (
        <UpdateModal
          onClose={cerrarModal}
          setRefrescar={setRefrescar}
          adminCarta={adminSeleccionado}
        />
      )}
    </div>
  )
}


export default AdminsBack
