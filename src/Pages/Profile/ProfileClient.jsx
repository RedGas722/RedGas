import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import BtnBack from "../../UI/Login_Register/BtnBack"
import Buttons from "../../UI/Login_Register/Buttons"
import ServicesModal from './ServicesModal'
import FacturasModal from './FacturasModal'
import UpdateClientModal from './UpdateClientModal'
import { useNavigate } from "react-router-dom"
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'

export const ProfileClient = () => {
  const [cliente, setCliente] = useState({
    id: null,
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  })
  const [showHistorialServices, setShowHistorialServices] = useState(false)
  const [mostrarFacturas, setMostrarFacturas] = useState(false)
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState(false)
  const [passwordVerificada, setPasswordVerificada] = useState("");
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
    setShowHistorialServices(true)
  }

  const handleCambiarDatos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const { email } = decoded.data;

    const { value: passwordInput } = await Swal.fire({
      title: 'Verificación de identidad',
      input: 'password',
      inputLabel: 'Ingresa tu contraseña actual',
      inputPlaceholder: '********',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes escribir tu contraseña actual';
      }
    });

    if (!passwordInput) return;

    try {
      const res = await fetch(`https://redgas.onrender.com/ClienteGet?correo_cliente=${email}`);
      const data = await res.json();

      if (!data || !data.data?.contraseña_cliente) {
        Swal.fire('Error', 'No se pudo obtener la contraseña del servidor.', 'error');
        return;
      }

      const contraseñaOriginal = data.data.contraseña_cliente;

      const isMatch = await bcrypt.compare(passwordInput, contraseñaOriginal);
      if (!isMatch) {
        Swal.fire('Error', 'La contraseña no coincide.', 'error');
        return;
      }

      // ✅ Si coincide, mostrar modal con contraseña validada
      setPasswordVerificada(passwordInput);
      setMostrarModalActualizar(true);
    } catch (error) {
      Swal.fire('Error', 'No se pudo verificar la contraseña.', 'error');
    }
  };

  const handleCambiarContrasena = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const decoded = jwtDecode(token)
    const { email } = decoded.data

    // Mostrar SweetAlert para pedir contraseña actual
    const { value: passwordInput } = await Swal.fire({
      title: 'Verificación de identidad',
      input: 'password',
      inputLabel: 'Ingresa tu contraseña actual',
      inputPlaceholder: '********',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes escribir tu contraseña actual'
      }
    })

    if (!passwordInput) return

    try {
      // Obtener datos del cliente (incluyendo contraseña)
      const res = await fetch(`https://redgas.onrender.com/ClienteGet?correo_cliente=${email}`)
      const data = await res.json()

      if (!data || !data.data?.contraseña_cliente) {
        Swal.fire('Error', 'No se pudo obtener la contraseña del servidor.', 'error')
        return
      }

      const contraseñaOriginal = data.data.contraseña_cliente

      // Comparar con bcrypt
      const isMatch = await bcrypt.compare(passwordInput, contraseñaOriginal)
      if (!isMatch) {
        Swal.fire('Error', 'La contraseña no coincide.', 'error')
        return
      }

      // Si coincide, generar token de recuperación
      const resRecovery = await fetch('https://redgas.onrender.com/GenerateTokenRecovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      })

      const recoveryData = await resRecovery.json()
      const tokenRecuperacion = recoveryData.token

      if (!tokenRecuperacion) {
        Swal.fire('Error', 'No se pudo generar el token de recuperación.', 'error')
        return
      }

      // Redirigir a Recovery con ambos tokens
      navigate(`/Login/ForgotPassword/Recovery?tkc=${token}&tkr=${tokenRecuperacion}&tipo=Cliente`)

    } catch (error) {
      console.error('Error:', error)
      Swal.fire('Error', 'Algo salió mal, intenta de nuevo.', 'error')
    }
  }

  return (
    <div>
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
          passwordVerificada={passwordVerificada}
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
