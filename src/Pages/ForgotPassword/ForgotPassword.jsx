import { Buttons } from '../../UI/Login_Register/Buttons'
import { InputLabel } from '../../UI/Login_Register/InputLabel/InputLabel';
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import { useState } from "react"
import withReactContent from 'sweetalert2-react-content';
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2';
import './ForgotPassword.css'

const URL = 'http://localhost:10101/ClienteEmail'

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const serviceId = 'service_82gyxy6'
        const templateId = 'template_fwkby0l'
        const publicKey = 'SHHYhi-xHJeCovrBP'

        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo_cliente: email }),
            });

            const data = await res.json()
            const token = data.token

            if (token) {
                const decoded = jwtDecode(token)
                const user = decoded.data.name

                const templateParams = {
                    to_email: email,
                    company: 'RED-GAS',
                    user: user || 'Usuario',
                    message: 'Hemos recibido su solicitud de cambio de contraseña, haga click en el siguiente enlace:',
                    link: `http://localhost:5173/Login/ForgotPassword/Recovery/${token}`,
                }
                
                alertSendForm('wait', 'Enviando correo de recuperación...')
                emailjs.send(serviceId, templateId, templateParams, publicKey)
                    .then(() => {
                        alertSendForm(
                            200,
                            '¡Correo de recuperación enviado!',
                            'Hemos enviado un enlace a tu correo electrónico para que puedas restablecer tu contraseña.'
                        );
                        setTimeout(() => {
                            navigate('/');
                        }, 4000);
                    })
                    .catch(() => {
                        alertSendForm(
                            402,
                            'No se pudo enviar el correo',
                            'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.'
                        );
                    });

            } else {
                alertSendForm(
                    401,
                    'Correo no encontrado',
                    ''
                );
            }

        } catch {
            alertSendForm(400, 'El correo no esta registrador');
        }
    };

    const alertSendForm = (status, title, message) => {

        const MySwal = withReactContent(Swal);
        const emailinput = document.getElementById('Email')
        emailinput.style.border = 'transparent'

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
                    title: title || 'Correo enviado',
                    text: message || 'Hemos enviado el enlace de recuperación a tu correo electrónico.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                });
                emailinput.value = ''
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
                                ${title || 'Correo no encontrado'}
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

                emailinput.style.border = '2px solid #FF0000'
                break;

            case 402:
                MySwal.fire({
                    icon: 'warning',
                    title: title || 'Error al enviar el correo',
                    text: message || 'Ocurrió un error al enviar el mensaje. Inténtalo nuevamente.',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar',
                    timerProgressBar: true,
                    timer: 4000
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
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            emailinput.value = ''
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
                    confirmButtonText: 'Cerrar'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            navigate('/')
                            emailinput.value = ''
                        }
                    })
                break;

        }
    }

    return (

        <div className='sectionForgot w-full text-[var(--main-color)] h-dvh '>
            <div className="divForm NeoContainer_outset_TL p-[30px_15px_15px_15px]  flex flex-col justify-self-center items-center h-fit w-fit gap-[30px]">
                <h1 className="text-center text-4xl">¡Recuperar contraseña!</h1>
                <form className=" flex flex-col gap-[35px] justify-center items-center text-start w-full" onSubmit={handleForgotPassword} >
                    {/* E-mail */}
                    <InputLabel type='2' ForID='Email' childLabel='Correo electrónico' placeholder='example@gmail.com' onChange={e => setEmail(e.target.value)} required />
                    
                    <div className='flex flex-col gap-[10px] justify-center items-center text-start w-full'>
                        <Buttons type='submit' nameButton="Enviar" />
                        <Link to="/Login/">
                            <button className="cursor-pointer text-[var(--main-focus)]">
                                <p>¿Quieres volver al Login?</p>
                            </button>
                        </Link>
                    </div>
                </form>
                <div className="text-white text-2xl w-full text-center">
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword

