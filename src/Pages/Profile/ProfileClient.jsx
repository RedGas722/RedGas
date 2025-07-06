import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { faUser, faUserCircle, faPhone, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getUserInitialsFromToken } from "../../UI/Utils/TokenUtils"
import BtnBack from "../../UI/Login_Register/BtnBack"
import Buttons from "../../UI/Login_Register/Buttons"
import FacturasModal from './FacturasModal'
import UpdateClientModal from './UpdateClientModal'
import { useNavigate } from "react-router-dom"

export const ProfileClient = () => {
  const [userInitials, setUserInitials] = useState("");
  const [cliente, setCliente] = useState({
    id: null,
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  })
  const [mostrarFacturas, setMostrarFacturas] = useState(false)
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { id, name, email, telefono, direccion } = decoded.data;

        setCliente({ id, name, email, telefono, direccion });
        setUserInitials(getUserInitialsFromToken(token));
      } catch (e) {
        console.error("Error al decodificar token:", e);
      }
    }
  }, []);

  // Cargar token y decodificar datos al montar
  const cargarClienteDesdeToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const { id, name, email, telefono, direccion } = decoded.data
        setCliente({ id, name, email, telefono, direccion })
      } catch (e) {
        console.error("Error al decodificar token:", e)
      }
    }
  }

  useEffect(() => {
    cargarClienteDesdeToken()
  }, [])

  const handleServicios = () => {
    console.log("Servicios completados")
  }

  const handleCambiarDatos = () => {
    setMostrarModalActualizar(true)
  }

  const handleCambiarContrasena = () => {
    navigate('/Login/ForgotPassword')
  }

  return (
    <div>
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
      <div className="flex z-[2] p-[5px] items-center justify-between">
        <div className="z-[2] flex flex-col text-center gap-2 sm:gap-0 sm:flex-row sm:justify-between items-center w-full">
          <BtnBack To='/' />
          <h2 className="font-bold text-3xl sm:text-4xl text-[var(--Font-Nav)]">Perfil</h2>
        </div>
      </div>

      {/* Contenido */}
      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] !py-[50px] MainPageContainer">
        <div className="flex flex-col z-[2] relative flex-wrap justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-6">

          {/* Datos */}
          <div className="text-[var(--main-color-sub)] pt-4 gap-2 flex items-center font-bold w-fit">
            <div className="w-fit p-[0_15px] h-[60px] absolute top-0 left-1/2 transform -translate-1/2 rounded-full bg-[var(--main-color)] text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {userInitials}
            </div>
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-normal gap-[8px] text-[var(--main-color)]">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-[var(--Font-Nav)]" />
                <p className="sm:text-xl font-bold text-[var(--main-color)]">{cliente.name}</p>
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
          <div className="z-[2] flex flex-wrap justify-center items-center gap-4">
            <Buttons
              type="button"
              radius='10'
              width='300px'
              nameButton="Servicios Completados"
              Onclick={handleServicios}
              className="bg-[var(--Font-Nav2)] hover:bg-[var(--Font-Nav2-shadow)] text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            />
            <Buttons
              nameButton="Compras Realizadas"
              Onclick={() => setMostrarFacturas(true)}
              className="bg-[var(--Font-Nav2)] hover:bg-[var(--Font-Nav2-shadow)] text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            />
            <Buttons
              type="button"
              nameButton="Cambiar Datos del Cliente"
              Onclick={handleCambiarDatos}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            />
            <Buttons
              type="button"
              nameButton="Cambiar Contraseña"
              Onclick={handleCambiarContrasena}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileClient
