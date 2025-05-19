import { Buttons } from "../../UI/Login_Register/Buttons"
import { InputLabel } from "../../UI/Login_Register/InputLabel/InputLabel"
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './RecoveryPassword.css'

const URL = 'http://localhost:10101/ClienteChangePassword'

export const RecoveryPassword = () => {
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

    return (
        <section className="w-full h-dvh flex justify-center text-[var(--main-color)] items-center">
            <div className='divForm NeoContainer_outset_TL p-[30px_15px_15px_15px] flex flex-col w-fit items-center justify-self-center gap-[20px]'>
                <h1 className="text-center text-4xl">¡Recuperación Contraseña!</h1>
                <form className="flex justify-center items-center flex-col gap-[30px] text-start w-full" onSubmit={handleChangePassword}>
                    <div className="w-full">
                        {/* Password */}
                        <InputLabel type='3' ForID='password' childLabel='Nueva contraseña' placeholder='**********' value={password} onChange={e => setPassword(e.target.value)} required />
                        <p className="text-[var(--Font-Nav)] text-x1l">min 8 - max 15 carateres</p>
                    </div>
                    <div className="w-full">
                        {/* Confirm Password */}
                        <InputLabel type='3' ForID='passwordConfirm' childLabel='Confirmar contraseña' placeholder='**********' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div>
                        <Buttons Type='submit' nameButton="Enviar" />
                    </div>
                </form>
            </div>
        </section>
    )
}
export default RecoveryPassword