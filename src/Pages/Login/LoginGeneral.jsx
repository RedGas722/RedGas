import { Buttons } from "../../UI/Login_Register/Buttons"
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel"
import { Text } from "../../UI/Login_Register/Text"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import { useState } from "react"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import './Login.css'
import { validateUserType } from './ValidateUserType'
import { startTokenRefresher } from "./TokenRefresher"

export const LoginGeneral = () => {
    const navigate = useNavigate()
    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [recordarme, setRecordarme] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        alertSendForm('wait', 'Iniciando sesión...')

        try {
            const userInfo = await validateUserType(correo)
            if (!userInfo) {
                alertSendForm(401, 'El correo electrónico o la contraseña son incorrectos')
                return
            }

            const loginURL = `https://redgas.onrender.com/${userInfo.ruta}`

            // 👇 Campos dinámicos según tipo de usuario
            let bodyData = {}
            switch (userInfo.tipo_usuario) {
                case 1: // Admin
                    bodyData = {
                        correo_admin: correo,
                        contraseña_admin: contrasena
                    }
                    break
                case 2: // Cliente
                    bodyData = {
                        correo_cliente: correo,
                        contraseña_cliente: contrasena
                    }
                    break
                case 3: // Empleado
                    bodyData = {
                        correo_empleado: correo,
                        contraseña_empleado: contrasena
                    }
                    break
                case 4: // Tecnico
                    bodyData = {
                        correo_tecnico: correo,
                        contraseña_tecnico: contrasena
                    }
                    break
                default:
                    alertSendForm(401, 'Tipo de usuario no válido')
                    return
            }

            const res = await fetch(loginURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })

            const data = await res.json()
            const token = data.token

            if (token) {
                const decoded = jwtDecode(token)
                const user = decoded.data.name

                alertSendForm(200, 'Inicio de sesión exitoso', `Bienvenido de nuevo ${user || 'Usuario'}`)
                localStorage.setItem('token', token)
                localStorage.setItem('tipo_usuario', userInfo.tipo_usuario)
                localStorage.setItem('recordarme', recordarme ? 'true' : 'false')
                startTokenRefresher();
                setTimeout(() => {
                    navigate('/')
                }, 0)

            } else {
                alertSendForm(401, 'El correo electrónico o la contraseña son incorrectos')
            }

        } catch (err) {
            console.error(err)
            alertSendForm(502, 'Error al iniciar sesión', 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente más tarde.')
        }
    }

    const alertSendForm = (status, title, message) => {
        const emailInput = document.getElementById('Email')
        const passwordInput = document.getElementById('Password')
        const MySwal = withReactContent(Swal)

        switch (status) {
            case 'wait':
                Swal.fire({
                    title: 'Procesando...',
                    text: message || 'Estamos procesando tu solicitud.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    timer: 6000,
                    timerProgressBar: true,
                    didOpen: () => Swal.showLoading(),
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
                    timer: 10,
                    timerProgressBar: true,
                })
                emailInput.value = ''
                passwordInput.value = ''
                break

            case 401:
                MySwal.fire({
                    html: `
                        <div style="display: flex; align-items: center">
                            <div style="font-size: 30px; color: #3498db; margin-right: 15px">ℹ️</div>
                            <div style="text-align: left">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2c3e50">
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
                emailInput.style.border = '2px solid #FF0000'
                passwordInput.style.border = '2px solid #FF0000'
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/')
                        emailInput.value = ''
                        passwordInput.value = ''
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/')
                        emailInput.value = ''
                        passwordInput.value = ''
                    }
                })
                break
        }
    }

    return (
        <>
            <div id='divAlert' />
            <div className="divForm p-[30px_15px_15px_15px] z-50 shadow_box_RL NeoContainer_outset_TL rounded-3xl flex flex-col items-center w-fit justify-self-center gap-[20px]">
                <h1 className="text-center text-4xl">¡Bienvenido Cliente!</h1>
                <form className="form flex flex-col gap-2.5 justify-center items-center text-start w-full " onSubmit={handleLogin}>

                    {/* Email */}
                    <InputLabel type='2'
                        ForID='Email'
                        childLabel='Correo electrónico'
                        placeholder='example@gmail.com'
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                        required />

                    {/* Password */}
                    <InputLabel type='3'
                        ForID='Password'
                        childLabel='Contraseña'
                        placeholder='**********'
                        autoComplete='off'
                        value={contrasena}
                        onChange={e => setContrasena(e.target.value)}
                        required />
                    <section className="flex gap-[5px] items-center justify-between w-full">
                        <label className="flex gap-[5px] items-center justify-center cursor-pointer text-[var(--main-color-sub)]">
                            <label className="flex items-center justify-center">
                                <input type="checkbox" className="input" checked={recordarme} onChange={() => setRecordarme(!recordarme)} />
                                <span className="custom-checkbox"></span>
                            </label>
                            <div><p>Recordarme</p></div>
                        </label>
                        <div className="text-[var(--Font-Nav)] text-[14px]">
                            <Link to="/Login/ForgotPassword">
                                <button type="button" className="cursor-pointer hover:text-[var(--Font-Nav-shadow)]">
                                    <p>¿Olvidaste tu contraseña?</p>
                                </button>
                            </Link>
                        </div>
                    </section>
                    <div className="flex flex-col gap-2.5 items-center justify-center">
                        <Buttons type="submit" nameButton="Iniciar" />
                        <Text Have="¿No tienes cuenta?" GoTo="Regístrate aquí" nav='/Register' />
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginGeneral
