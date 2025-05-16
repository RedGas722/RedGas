import { AnimatedDots } from "../../Animations/AnimatedDots/AnimatedDots"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Circles } from "../../Animations/ColorCircles/Circles"
import { Buttons } from "../../UI/Login_Register/Buttons"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './RecoveryPassword.css'

const URL = 'http://localhost:10101/ClienteChangePassword'

export const RecoveryPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()


    const handleChangePassword = async (e) => {
        e.preventDefault()

        // alertSendForm('wait', 'Cambiando contraseña...')
        if (password == confirmPassword) {
            try {
                const res = await fetch(URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ contraseña_cliente: password })
                });

                const data = await res.json()


                if (data.status !== 'Unauthorized') {
                    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                        const mensaje = data.errors[0].msg;

                        if (mensaje === 'Invalid value') {
                            alertSendForm(401, 'La contraseña no cumple con los requisitos de seguridad', '');
                        } else {
                            alertSendForm(401, mensaje, '');
                        }
                    } else {
                        alertSendForm(200, 'Contraseña cambiada con éxito', 'Hemos cambiado tu contraseña con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.');
                    }
                } else {
                    alertSendForm(502, 'TOKEN EXPIRADO', 'El token de recuperación ha expirado o es inválido. Por favor, solicita un nuevo enlace de recuperación.')
                }
            }
            catch (err) {
                console.log(err);
                alertSendForm(502, 'Error al cambiar la contraseña', 'Ocurrió un error al cambiar la contraseña. Por favor, intenta nuevamente más tarde.')
            }
        } else {
            alertSendForm(401, 'Las contraseñas no coinciden', '')
        }
    }

    const alertSendForm = (status, title, message) => {

        const MySwal = withReactContent(Swal);
        const passwordInput = document.getElementById('password')
        const confirmPasswordInput = document.getElementById('passwordConfirm')

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
                        Swal.showLoading();
                    },
                });
                break;

            case 200:
                MySwal.fire({
                    icon: 'success',
                    title: title || 'Clave cambiada',
                    text: message || 'Hemos cambiado tu contraseña con éxito.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'volver al login',
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/Login')
                            passwordInput.value = ''
                            confirmPasswordInput.value = ''
                        }
                    })
                break;

            case 401:
                MySwal.fire({
                    html: `
                            <div style="display: flex; align-items: center;">
                            <div style="font-size: 30px; color: #3498db; margin-right: 15px;">
                                ℹ️
                            </div>
                            <div style="text-align: left;">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #2c3e50;">
                                ${title}
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
                });

                break;

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
                    timer: 9000
                })
                    .then((result) => {
                        if (result.isConfirmed && title === 'TOKEN EXPIRADO') {
                            navigate('/Login/ForgotPassword')
                            passwordInput.value = ''
                            confirmPasswordInput.value = ''
                        } else if (result.isConfirmed) {
                            navigate('/')
                            passwordInput.value = ''
                            confirmPasswordInput.value = ''
                        }
                    })
                break;

            default:
                MySwal.fire({
                    icon: 'error',
                    title: title || 'Error inesperado',
                    text: message || 'No se pudo procesar tu solicitud. Intenta nuevamente más tarde.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                    timer: 9000
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            passwordInput.value = ''
                            confirmPasswordInput.value = ''
                        }
                    })
                break;

        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };


    return (
        <section className="w-full gap-[40px] h-dvh flex justify-center items-center">
            <AnimatedDots />
            <Circles styleC1="right-[50%] bottom-[0px]" styleC2="left-[54%] top-[120px]" styleC3="top-[400px] left-[80px]" />
            <div className='divForm shadow_box_RL bg-glass-total rounded-3xl flex flex-col w-fit items-center justify-self-center gap-[20px]'>
                <h1 className="text-center text-white text-4xl">¡Recuperación Contraseña!</h1>
                <form className=" form flex flex-col gap-[15px] text-start w-full" onSubmit={handleChangePassword}>
                    <div className="w-full">
                        {/* Password */}
                        <label htmlFor="password" className="text-white text-2xl w-full">
                            Contraseña
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={showPassword ? "Contraseña" : "**********"}
                                id="password"
                                className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                                value={password} onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                        <p className="text-amber-300 text-x1l">min 8 - max 15 carateres</p>
                    </div>
                    <div className="w-full">
                        {/* Confirm Password */}
                        <label htmlFor="passwordConfirm" className="text-white text-2xl w-full">
                            Confirmar contraseña
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={showConfirmPassword ? "Confirmar" : "*********"}
                                id="passwordConfirm"
                                className="border-t-0 border-b-[1px] w-full placeholder:text-gray-400 text-gray-200 border-gray-300 outline-0"
                                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? faEyeSlash : faEye}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                            />
                        </div>
                    </div>
                    <div className="btnSumit">
                        <Buttons Type='submit' nameButton="Enviar" />
                    </div>
                </form>
            </div>
        </section>
    )
}
export default RecoveryPassword