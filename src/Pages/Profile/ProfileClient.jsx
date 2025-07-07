import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import BtnBack from "../../UI/Login_Register/BtnBack"
import Buttons from "../../UI/Login_Register/Buttons"
import FacturasModal from './FacturasModal'
import UpdateClientModal from './UpdateClientModal'
import { useNavigate } from "react-router-dom"

export const ProfileClient = () => {
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
      <div className="flex z-[2] p-[0_5px] items-center justify-between">
        <div className="btnDown">
          <BtnBack To='/' />
        </div>
        <div>
          <h2 className="font-bold text-4xl text-[var(--Font-Nav)]">MI PERFIL</h2>
        </div>
      </div>

      {/* Contenido */}
      <section className="h-fit z-[2] flex flex-wrap justify-center text-[var(--main-color)] items-center gap-[20px] p-20">
        <div className="flex flex-col z-[2] flex-wrap justify-center max-w-[700px] min-w-0 NeoContainer_outset_TL p-5 gap-6">
          
          {/* Datos */}
          <div className="text-[var(--main-color-sub)] pl-2 gap-3 flex items-center font-bold w-fit">
            <FontAwesomeIcon icon={faUser} className="text-[var(--main-color)] text-5xl" />
            <div className="flex flex-col justify-center font-light leading-[20px] gap-[2px]">
              <p className="text-xl font-bold text-[var(--main-color)]">{cliente.name}</p>
              <p className="text-[1rem]">📧 {cliente.email}</p>
              <p className="text-[1rem]">📞 {cliente.telefono}</p>
              <p className="text-[1rem]">📍 {cliente.direccion}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="z-[2] flex flex-wrap justify-center items-center gap-4">
            <Buttons
              type="button"
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
