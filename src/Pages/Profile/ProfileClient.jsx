import { faUser, faUserCircle, faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BtnBack from "../../UI/Login_Register/BtnBack"
import Buttons from "../../UI/Login_Register/Buttons"
import ServicesModal from './ServicesModal'
import FacturasModal from './FacturasModal'
import UpdateClientModal from './UpdateClientModal'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"

export const ProfileClient = () => {
  const [cliente, setCliente] = useState({
    id: null,
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  })
  const [userName, setUserName] = useState('')
  const [showHistorialServices, setShowHistorialServices] = useState(false)
  const [mostrarFacturas, setMostrarFacturas] = useState(false)
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false)
  const navigate = useNavigate()

  // Cargar token y decodificar datos al montar
  const cargarClienteDesdeToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const { id, name, email, telefono, direccion } = decoded.data
        setCliente({ id, name, email, telefono, direccion })

        // Aplicar la misma lógica del Header para el nombre
        const names = name.split(' ')
        const firstLetter = names[0].toUpperCase()

        if (firstLetter.length > 6) {
          const secondLetter = names[1].toUpperCase().slice(0, 1)
          setUserName(firstLetter.slice(0, 1) + secondLetter)
        } else {
          setUserName(firstLetter)
        }
      } catch (e) {
        console.error("Error al decodificar token:", e)
      }
    }
  }

  useEffect(() => {
    cargarClienteDesdeToken()
  }, [])

  const handleServicios = () => {
    setShowHistorialServices(true)
  }

  const handleCambiarDatos = () => {
    setMostrarModalActualizar(true)
  }

  const handleCambiarContrasena = () => {
    navigate('/Login/ForgotPassword')
  }

  return (
    <div className="p-[5px] ">
      {/* Modales */}
      {showHistorialServices && (
        <ServicesModal onClose={() => setShowHistorialServices(false)} />
      )}

      {/* Modales */}
      {mostrarFacturas && (
        <FacturasModal onClose={() => setMostrarFacturas(false)} />
      )}

      {mostrarModalActualizar && (
        <UpdateClientModal
          onClose={() => setMostrarModalActualizar(false)}
          clienteData={cliente}
          setClienteData={setCliente}
        />
      )}

      {/* Encabezado */}
      <div className="z-[2] flex flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
        <BtnBack To='/' />
        <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Mi Perfil</h2>
      </div>

      {/* Contenido */}
      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] MainPageContainer">
        <div className="flex flex-col z-[2] relative flex-wrap h-fit justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 py-8 gap-6">

          {/* Datos */}
          <div className="text-[var(--main-color-sub)] leading-[20px] sm:pl-2 gap-3 flex flex-wrap justify-center sm:justify-start items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-normal gap-[8px] text-[var(--main-color)]">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-[var(--Font-Nav)]" />
                <p className="text-xl font-bold text-[var(--main-color)]">{cliente.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faPhone} className="text-1xl w-[15px] text-[var(--Font-Nav-shadow)]" />
                <p className="text-[1rem]">{cliente.telefono}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-1xl w-[15px] text-[var(--Font-Nav-shadow)]" />
                <p className="text-[1rem]">{cliente.email}</p>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-1xl w-[15px] text-[var(--Font-Nav-shadow)]" />
                <p className="text-[1rem]">{cliente.direccion}</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="z-[2] grid grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 h-fit w-full justify-center gap-4">
            <Buttons
              type="button"
              nameButton="Servicios Completados"
              Onclick={handleServicios}
            />
            <Buttons
              nameButton="Compras Realizadas"
              Onclick={() => setMostrarFacturas(true)}
            />
            <Buttons
              type="button"
              nameButton="Cambiar Datos del Cliente"
              Onclick={handleCambiarDatos}
            />
            <Buttons
              type="button"
              nameButton="Cambiar Contraseña"
              Onclick={handleCambiarContrasena}
            />
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-1/2 bg-[var(--main-color)] text-white text-[18px] font-extrabold rounded-full p-[5px_15px]">
            {userName}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileClient