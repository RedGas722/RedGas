import { useState, useEffect, useRef } from 'react'
import { RegisterModal } from './Register/RegisterModal'
import { UpdateModal } from './Update/Update'
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel'
import CardAdminsBack from './Get/CardAdminsBack'
import { buscarAdminPorCorreo } from './Get/Get'
import { Backdrop, CircularProgress } from '@mui/material';
import { Paginator } from '../../UI/Paginator/Paginator'
import { Buttons } from '../../UI/Login_Register/Buttons'

export const AdminsBack = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false) // ahora puede ser false o un objeto admin seleccionado
  const [admins, setAdmins] = useState([])
  const [adminsEmails, setAdminsEmails] = useState([])
  const [refrescar, setRefrescar] = useState(false)
  const [correoBusqueda, setCorreoBusqueda] = useState('')
  const [adminBuscado, setAdminBuscado] = useState(null)
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const contenedorRef = useRef(null)

  const fetchAdmins = async (pagina = 1) => {
    setIsLoading(true)
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
    }finally {
      setIsLoading(false);
    }
  }

  const fetchAdminsEmails = async () => {
    try {
      const res = await fetch('https://redgas.onrender.com/AdminGetAllEmails')
      if (!res.ok) throw new Error('Error al obtener correos')
      const data = await res.json()
      setAdminsEmails(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAdmins(paginaActual)
    fetchAdminsEmails()
  }, [paginaActual])

  useEffect(() => {
    if (refrescar) {
      fetchAdmins(1)
      fetchAdminsEmails()
      setPaginaActual(1)
      setRefrescar(false)
      setAdminBuscado(null)
      setErrorBusqueda('')
      setCorreoBusqueda('')
    }
  }, [refrescar])

  const handleUpdateClick = (admin) => setShowUpdateModal(admin)

  const buscarAdmin = async (correo) => {
    setErrorBusqueda('')
    setAdminBuscado(null)

    if (!correo.trim()) {
      fetchAdmins(1)
      setPaginaActual(1)
      return
    }

    try {
      const resultado = await buscarAdminPorCorreo(correo.trim())
      if (resultado) {
        setAdminBuscado(resultado)
        setSugerencias([])
      } else {
        setErrorBusqueda('No se encontró un administrador con ese correo.')
      }
    } catch (error) {
      setErrorBusqueda('Error al buscar administrador.')
    }
  }

  useEffect(() => {
    if (correoBusqueda.trim() === '') {
      setSugerencias([])
      setAdminBuscado(null)
      return
    }

    const filtrados = adminsEmails.filter(admin =>
      admin.correo_admin?.toLowerCase().includes(correoBusqueda.toLowerCase())
    )
    setSugerencias(filtrados.slice(0, 5))
  }, [correoBusqueda, adminsEmails])

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

      <div className="p-[var(--p-admin-sub)] h-full flex flex-col gap-2">
        <h1 className="font-bold text-3xl z-[2] text-[var(--main-color)]">Administradores</h1>

        <div className='NeoContainer_outset_TL z-[3] flex gap-4 flex-wrap items-end w-fit p-[var(--p-admin-control)]'>
          <div className="relative" ref={contenedorRef}>
            <InputLabel
              radius="10"
              type="1"
              ForID="correo_admin_busqueda"
              placeholder="Buscar administrador"
              childLabel="Buscar administrador"
              value={correoBusqueda}
              onChange={e => setCorreoBusqueda(e.target.value)}
              className="w-full"
              placeholderError={!!errorBusqueda}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-[10] bg-white border border-gray-300 rounded mt-1 max-h-[200px] overflow-y-auto shadow w-[230px]">
                {sugerencias.map((admin) => (
                  <li
                    key={admin.id_admin}
                    onClick={() => {
                      setCorreoBusqueda(admin.correo_admin)
                      buscarAdmin(admin.correo_admin)
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
          <div className="flex w-fit h-fit flex-wrap justify-center items-center gap-[20px]">
            <Buttons
              radius='10'
              nameButton='Registrar'
              textColor='var(--Font-Nav)'
              Onclick={() => setShowRegisterModal(true)}
            />
          </div>
        </div>

        {/* Lista de admins */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {(adminBuscado ? [adminBuscado] : admins).map((admin) => (
            <CardAdminsBack
              key={admin.id_admin}
              admin={admin}
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
            adminCarta={showUpdateModal}
          />
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

export default AdminsBack
