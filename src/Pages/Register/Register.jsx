import { Buttons } from "../../UI/Login_Register/Buttons"
import { BtnBack } from "../../UI/Login_Register/BtnBack"
import { Text } from "../../UI/Login_Register/Text"
import { useState } from "react"
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel"
import "./Register.css"
import { useNavigate } from "react-router-dom"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'


const URL = 'https://redgas.onrender.com/ClienteRegister'

export const Register = () => {

    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [apellido, setApellido] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [mensaje, setMensaje] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        alertSendForm('wait', 'Registrando usuario...', '')

        try {


            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_cliente: nombre + ' ' + apellido,
                    correo_cliente: correo,
                    telefono_cliente: telefono,
                    direccion_cliente: direccion,
                    contraseña_cliente: contrasena
                }),
            })

            if (!res.ok) throw new Error('Credenciales inválidas')
            const data = await res.json()
            alertSendForm(200, 'Registro exitoso', 'Tu cuenta ha sido creada con éxito. Ahora puedes iniciar sesión.')
            setTimeout(() => {
                navigate('/login')
            }, 0)
        } catch (err) {
            alertSendForm(502, 'Error al registrar usuario', 'Ocurrió un error al registrar tu cuenta. Por favor, intenta nuevamente más tarde.')
        }
    }

    const alertSendForm = (status, title, message) => {
        const nameInput = document.getElementById('Name')
        const lastNameInput = document.getElementById('LastName')
        const phoneInput = document.getElementById('Phone')
        const addressInput = document.getElementById('Address')
        const emailInput = document.getElementById('email')
        const passwordInput = document.getElementById('password')
        const passwordConfirmInput = document.getElementById('passwordConfirm')

        const MySwal = withReactContent(Swal)
        switch (status) {
            case 'wait':
                Swal.fire({
                    title: 'Procesando...',
                    text: message || 'Estamos procesando tu solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                })
                break

            case 200:
                MySwal.fire({
                    icon: 'success',
                    title: title || 'Correo enviado',
                    text: message || 'Hemos enviado el enlace de recuperación a tu correo electrónico.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    timer: 10
                })
                nameInput.value = ''
                lastNameInput.value = ''
                phoneInput.value = ''
                addressInput.value = ''
                emailInput.value = ''
                passwordInput.value = ''
                passwordConfirmInput.value = ''
                break

            case 401:
                MySwal.fire({
                    html: `
                            <div style="display: flex align-items: center">
                            <div style="font-size: 30px color: #3498db margin-right: 15px">
                                ℹ️
                            </div>
                            <div style="text-align: left">
                                <h3 style="margin: 0 font-size: 16px font-weight: 600 color: #2c3e50">
                                ${title || 'usuario no encontrado'}
                                </h3>
                            </div>
                            </div>
                        `,
                    showConfirmButton: false,
                    position: 'top-end',
                    width: '350px',
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ffffff',
                })

                nameInput.style.border = '2px solid #FF0000'
                lastNameInput.style.border = '2px solid #FF0000'
                phoneInput.style.border = '2px solid #FF0000'
                addressInput.style.border = '2px solid #FF0000'
                emailInput.style.border = '2px solid #FF0000'
                passwordInput.style.border = '2px solid #FF0000'
                passwordConfirmInput.style.border = '2px solid #FF0000'
                break

            case 502:
                MySwal.fire({
                    icon: 'error',
                    title: title || 'Ocurrió un error',
                    text: message || 'No pudimos completar tu solicitud. Intenta de nuevo más tarde.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            nameInput.value = ''
                            lastNameInput.value = ''
                            phoneInput.value = ''
                            addressInput.value = ''
                            emailInput.value = ''
                            passwordInput.value = ''
                            passwordConfirmInput.value = ''
                        }
                    })
                break

            default:
                MySwal.fire({
                    icon: 'error',
                    title: title || 'Error inesperado',
                    text: message || 'No se pudo procesar tu solicitud. Intenta nuevamente más tarde.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            nameInput.value = ''
                            lastNameInput.value = ''
                            phoneInput.value = ''
                            addressInput.value = ''
                            emailInput.value = ''
                            passwordInput.value = ''
                            passwordConfirmInput.value = ''
                        }
                    })
                break
        }
    }

    return (
        <div className="w-full h-[100%] p-[10px_0_0_10px] gap-10 grid grid-cols-2 text-[var(--main-color)]">
            <BtnBack To='/' />
            <div className="divForm NeoContainer_outset_TL p-6 flex flex-col items-center w-full max-w-3xl gap-4">
                <h1 className="text-center text-3xl md:text-4xl">¡Bienvenido!</h1>
                <form className="flex flex-col gap-6 w-full" onSubmit={handleRegister}>
                    {/* Name & LastName */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputLabel
                            type="1"
                            ForID="Name"
                            childLabel="Nombre"
                            placeholder="Nombre"
                            autoComplete="given-name"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                        />
                        <InputLabel
                            type="1"
                            ForID="LastName"
                            childLabel="Apellido"
                            placeholder="Apellido"
                            autoComplete="family-name"
                            value={apellido}
                            onChange={e => setApellido(e.target.value)}
                        />
                    </div>

                    {/* Phone & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputLabel
                            type="6"
                            ForID="Phone"
                            childLabel="Teléfono"
                            placeholder="3*********"
                            autoComplete="tel"
                            value={telefono}
                            onChange={e => setTelefono(e.target.value)}
                        />
                        <InputLabel
                            type="1"
                            ForID="Address"
                            childLabel="Dirección"
                            placeholder="Cra 22 #19 ******"
                            autoComplete="street-address"
                            value={direccion}
                            onChange={e => setDireccion(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <InputLabel
                        type="2"
                        ForID="email"
                        childLabel="Correo electrónico"
                        placeholder="example@gmail.com"
                        value={correo}
                        autoComplete="email"
                        required={true}
                        onChange={e => setCorreo(e.target.value)}
                    />

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputLabel
                            type="3"
                            ForID="password"
                            childLabel="Contraseña"
                            placeholder="Contraseña"
                            autoComplete="new-password"
                            required={true}
                            value={contrasena}
                            onChange={e => setContrasena(e.target.value)}
                        />
                        <InputLabel
                            type="3"
                            ForID="passwordConfirm"
                            childLabel="Confirmar contraseña"
                            placeholder="Confirmar contraseña"
                            autoComplete="new-password"
                            required={true}
                        />
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <Buttons nameButton="Register" />
                        <Text Have="¿Tienes cuenta?" GoTo="Inicia sesión aquí" nav="/Login" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register